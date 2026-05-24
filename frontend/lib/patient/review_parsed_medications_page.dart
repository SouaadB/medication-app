// lib/pages/review_parsed_medications_page.dart
// UPDATED — added optional per-medication barcode scanning on each card
// Changes from original:
//   • Added Map<int, BarcodeResult?> _scannedBarcodes state
//   • Added _buildBarcodeCard(index) widget inside each medication card
//   • _saveSelected() sends barcode_data per treatment (nullable)
//   • All other logic unchanged

import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../config/api_config.dart';
import '../services/language_service.dart';
import '../services/condition_service.dart';
import '../widgets/barcode_scan_sheet.dart';   // ← NEW
import '../services/barcode_service.dart';      // ← NEW

class ReviewParsedMedicationsPage extends StatefulWidget {
  final List<dynamic> medications;
  final int? conditionId;
  final String? conditionName;

  const ReviewParsedMedicationsPage({
    super.key,
    required this.medications,
    this.conditionId,
    this.conditionName,
  });

  @override
  State<ReviewParsedMedicationsPage> createState() => _ReviewParsedMedicationsPageState();
}

class _ReviewParsedMedicationsPageState extends State<ReviewParsedMedicationsPage> {

  final List<String> _frequenciesEn = const [
    'Once daily','Twice daily','Three times daily','Four times daily',
    'Every 12 hours','Every 8 hours','Every 6 hours','As needed',
  ];
  final List<String> _frequenciesFr = const [
    'Une fois par jour','Deux fois par jour','Trois fois par jour','Quatre fois par jour',
    'Toutes les 12 heures','Toutes les 8 heures','Toutes les 6 heures','Au besoin',
  ];
  final List<String> _mealAnchorsFr = [
    'Avant le petit-déjeuner','Après le petit-déjeuner','Avant le déjeuner',
    'Après le déjeuner','Avant le dîner','Après le dîner','Avant de dormir',
  ];
  final List<String> _mealAnchorsEn = [
    'Before breakfast','After breakfast','Before lunch','After lunch',
    'Before dinner','After dinner','Before sleeping',
  ];
  final Map<String, String> _frToEnMap = {
    'Une fois par jour':'Once daily','Deux fois par jour':'Twice daily',
    'Trois fois par jour':'Three times daily','Quatre fois par jour':'Four times daily',
    'Toutes les 4 heures':'Every 4 hours','Toutes les 6 heures':'Every 6 hours',
    'Toutes les 8 heures':'Every 8 hours','Toutes les 12 heures':'Every 12 hours',
    'Au besoin':'As needed','Avant le petit-déjeuner':'Before breakfast',
    'Après le petit-déjeuner':'After breakfast','Avant le déjeuner':'Before lunch',
    'Après le déjeuner':'After lunch','Avant le dîner':'Before dinner',
    'Après le dîner':'After dinner','Avant de dormir':'Before sleeping',
  };

  late List<_EditableMedication> _items;
  DateTime _startDate                        = DateTime.now();
  bool _isSubmitting                         = false;
  bool _isConditionPreSelected               = false;
  List<Map<String, dynamic>> _patientConditions = [];
  bool _loadingConditions                    = false;
  Map<int, int?> _selectedConditionIds       = {};
  Map<int, String?> _mainFrequencies         = {};
  Map<int, List<String>> _mealAnchorsPerItem = {};
  Map<int, String> _priorityPerItem          = {};

  // ── *** NEW: per-card barcode state *** ────────────────────────────────────
  Map<int, BarcodeResult?> _scannedBarcodes  = {};

  @override
  void initState() {
    super.initState();
    _isConditionPreSelected = widget.conditionId != null;
    _items = widget.medications.map((m) {
      final freq = m['frequency'];
      final safeFreq = _frequenciesEn.contains(freq) ? freq : 'Once daily';
      final durationDays = m['duration_days'] is int ? m['duration_days'] as int : null;
      return _EditableMedication(
        name: m['name']?.toString() ?? '',
        dosage: m['dosage']?.toString() ?? '',
        frequency: safeFreq,
        durationDays: durationDays,
      );
    }).toList();

    for (int i = 0; i < _items.length; i++) {
      _selectedConditionIds[i] = widget.conditionId;
      _mainFrequencies[i]      = _items[i].frequency;
      _mealAnchorsPerItem[i]   = [];
      _priorityPerItem[i]      = 'MEDIUM';
      _scannedBarcodes[i]      = null;  // ← NEW
    }
    _loadPatientConditions();
  }

  Future<void> _loadPatientConditions() async {
    setState(() => _loadingConditions = true);
    try {
      final conditions = await ConditionService.getPatientConditions();
      setState(() { _patientConditions = List<Map<String, dynamic>>.from(conditions); _loadingConditions = false; });
    } catch (_) { setState(() => _loadingConditions = false); }
  }

  List<String> _getCurrentFrequencyBase(LanguageService lang) =>
      lang.getCurrentLanguage() == 'fr' ? _frequenciesFr : _frequenciesEn;
  List<String> _getCurrentMealAnchors(LanguageService lang) =>
      lang.getCurrentLanguage() == 'fr' ? _mealAnchorsFr : _mealAnchorsEn;

  String _getBackendFrequencyFull(int index, LanguageService lang) {
    final parts = <String>[];
    final main = _mainFrequencies[index];
    if (main != null) parts.add(_frToEnMap[main] ?? main);
    for (var a in (_mealAnchorsPerItem[index] ?? [])) parts.add(_frToEnMap[a] ?? a);
    return parts.isEmpty ? 'Once daily' : parts.join(' + ');
  }

  IconData _getFrequencyIcon(int index) {
    switch (index) {
      case 0: return Icons.looks_one;   case 1: return Icons.looks_two;
      case 2: return Icons.looks_3;     case 3: return Icons.looks_4;
      case 4: return Icons.schedule;    case 5: return Icons.timer;
      case 6: return Icons.timer;       case 7: return Icons.healing;
      default: return Icons.access_time;
    }
  }

  // ── *** NEW: open scanner for a specific card *** ───────────────────────────

  Future<void> _openScannerForItem(int index) async {
    final medName = _items[index].nameController.text.trim();
    final result  = await BarcodeScanSheet.show(
      context,
      medicationName: medName.isNotEmpty ? medName : 'Medication ${index + 1}',
    );
    if (result != null && mounted) {
      setState(() => _scannedBarcodes[index] = result);
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // *** NEW: barcode card widget shown inside each medication card ***
  // ─────────────────────────────────────────────────────────────────────────

  Widget _buildBarcodeCard(int index, bool isFr) {
    final barcode = _scannedBarcodes[index];

    if (barcode != null) {
      // ── scanned state ──────────────────────────────────────────────────────
      return Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: Colors.green.shade50,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: Colors.green.shade200),
        ),
        child: Row(children: [
          Container(
            padding: const EdgeInsets.all(6),
            decoration: BoxDecoration(color: Colors.green.shade100, borderRadius: BorderRadius.circular(8)),
            child: const Icon(Icons.qr_code, color: Colors.green, size: 20),
          ),
          const SizedBox(width: 10),
          Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text(isFr ? 'Code-barres ✓' : 'Barcode ✓',
                style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.green, fontSize: 13)),
            Text(barcode.displayValue,
                style: TextStyle(fontSize: 12, color: Colors.grey.shade700, fontFamily: 'monospace')),
          ])),
          // re-scan
          GestureDetector(
            onTap: () => _openScannerForItem(index),
            child: Container(
              padding: const EdgeInsets.all(6),
              decoration: BoxDecoration(color: Colors.blue.shade50, borderRadius: BorderRadius.circular(8)),
              child: Icon(Icons.refresh, color: Colors.blue.shade600, size: 18),
            ),
          ),
          const SizedBox(width: 4),
          // remove
          GestureDetector(
            onTap: () => setState(() => _scannedBarcodes[index] = null),
            child: Container(
              padding: const EdgeInsets.all(6),
              decoration: BoxDecoration(color: Colors.red.shade50, borderRadius: BorderRadius.circular(8)),
              child: Icon(Icons.close, color: Colors.red.shade400, size: 18),
            ),
          ),
        ]),
      );
    }

    // ── not scanned state ──────────────────────────────────────────────────
    return GestureDetector(
      onTap: () => _openScannerForItem(index),
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: Colors.grey.shade50,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: Colors.grey.shade200),
        ),
        child: Row(children: [
          Container(
            padding: const EdgeInsets.all(6),
            decoration: BoxDecoration(color: Colors.blue.shade50, borderRadius: BorderRadius.circular(8)),
            child: Icon(Icons.qr_code_scanner, color: Colors.blue.shade500, size: 20),
          ),
          const SizedBox(width: 10),
          Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text(
              isFr ? 'Scanner le code-barres (optionnel)' : 'Scan barcode (optional)',
              style: TextStyle(fontWeight: FontWeight.w600, color: Colors.grey.shade700, fontSize: 13),
            ),
            Text(
              isFr ? 'Appuyez pour scanner la boîte' : 'Tap to scan the medication box',
              style: TextStyle(fontSize: 11, color: Colors.grey.shade500),
            ),
          ])),
          Icon(Icons.chevron_right, color: Colors.grey.shade400, size: 18),
        ]),
      ),
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // *** UPDATED: _saveSelected — includes barcode_data per medication ***
  // ─────────────────────────────────────────────────────────────────────────

  Future<void> _saveSelected() async {
    final languageService = Provider.of<LanguageService>(context, listen: false);
    final selected = _items.where((i) => i.include && i.nameController.text.trim().isNotEmpty).toList();
    if (selected.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(languageService.translate('selectOneMedication'))));
      return;
    }
    for (int i = 0; i < _items.length; i++) {
      if (_items[i].include && _selectedConditionIds[i] == null) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(
          content: Text('Please select a condition for ${_items[i].nameController.text}'),
          backgroundColor: Colors.orange,
        ));
        return;
      }
    }

    setState(() => _isSubmitting = true);
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');
      if (token == null) {
        setState(() => _isSubmitting = false);
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(languageService.translate('notAuthenticated'))));
        return;
      }

      int successCount = 0;
      for (int i = 0; i < _items.length; i++) {
        final item = _items[i];
        if (!item.include || item.nameController.text.trim().isEmpty) continue;

        final start = _fmtDate(_startDate);
        String? end;
        if (item.durationDays != null && item.durationDays! > 0) {
          end = _fmtDate(_startDate.add(Duration(days: item.durationDays! - 1)));
        }

        // ── build body — include barcode if scanned ───────────────────────
        final body = <String, dynamic>{
          'medication_name': item.nameController.text.trim(),
          'dosage': item.dosageController.text.trim().isEmpty ? null : item.dosageController.text.trim(),
          'frequency':     _getBackendFrequencyFull(i, languageService),
          'priority':      _priorityPerItem[i] ?? 'MEDIUM',
          'start_date':    start,
          'end_date':      end,
          'condition_id':  _selectedConditionIds[i],
        };
        // barcode is optional
        if (_scannedBarcodes[i] != null) {
          body['barcode_data'] = _scannedBarcodes[i]!.toJson();
        }

        final resp = await http.post(
          Uri.parse('${ApiConfig.baseUrl}/treatments'),
          headers: ApiConfig.getAuthHeaders(token),
          body: jsonEncode(body),
        );
        if (resp.statusCode == 201) successCount++;
      }

      setState(() => _isSubmitting = false);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(
          content: Text('$successCount ${languageService.translate('medicationsSaved')}'),
          backgroundColor: Colors.green,
        ));
        Navigator.pop(context, true);
      }
    } catch (e) {
      setState(() => _isSubmitting = false);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('${languageService.translate('error')}: $e')));
      }
    }
  }

  Future<void> _pickStartDate() async {
    final languageService = Provider.of<LanguageService>(context, listen: false);
    final picked = await showDatePicker(
      context: context, initialDate: _startDate,
      firstDate: DateTime.now().subtract(const Duration(days: 0)),
      lastDate: DateTime.now().add(const Duration(days: 365)),
      locale: languageService.locale,
    );
    if (picked != null) setState(() => _startDate = picked);
  }

  String _fmtDate(DateTime d) =>
      '${d.year.toString().padLeft(4,'0')}-${d.month.toString().padLeft(2,'0')}-${d.day.toString().padLeft(2,'0')}';

  void _showConditionSelector(int index) {
    if (_isConditionPreSelected) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Condition is locked to ${widget.conditionName}'), backgroundColor: Colors.blue));
      return;
    }
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(20))),
      builder: (context) => Container(
        padding: const EdgeInsets.all(20),
        child: Column(mainAxisSize: MainAxisSize.min, crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text('Select Condition for ${_items[index].nameController.text}', style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          const SizedBox(height: 16),
          _loadingConditions
              ? const Center(child: CircularProgressIndicator())
              : _patientConditions.isEmpty
                  ? const Text('No conditions available.')
                  : SizedBox(
                      height: 200,
                      child: ListView.builder(
                        itemCount: _patientConditions.length,
                        itemBuilder: (ctx, i) {
                          final c = _patientConditions[i];
                          return ListTile(
                            title: Text(c['name']),
                            trailing: _selectedConditionIds[index] == c['id']
                                ? const Icon(Icons.check_circle, color: Colors.blue)
                                : const Icon(Icons.radio_button_unchecked),
                            onTap: () { setState(() => _selectedConditionIds[index] = c['id']); Navigator.pop(context); },
                          );
                        },
                      ),
                    ),
        ]),
      ),
    );
  }

  void _showSmartFrequencySelector(int itemIndex, LanguageService languageService) {
    final baseFreqs = _getCurrentFrequencyBase(languageService);
    final anchors   = _getCurrentMealAnchors(languageService);
    showModalBottomSheet(
      context: context, isScrollControlled: true,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(25))),
      builder: (context) => StatefulBuilder(builder: (context, setModalState) {
        final mainFreq   = _mainFrequencies[itemIndex];
        final mainFreqEn = mainFreq != null ? (_frToEnMap[mainFreq] ?? mainFreq) : null;
        final isInterval = mainFreqEn != null && (mainFreqEn.contains('Every') || mainFreqEn == 'As needed' || mainFreqEn == 'Four times daily');
        final isThreeTimes = mainFreqEn == 'Three times daily';
        int maxAnchors = 99;
        if (mainFreqEn == 'Once daily') maxAnchors = 1;
        else if (mainFreqEn == 'Twice daily') maxAnchors = 2;

        return Container(
          height: MediaQuery.of(context).size.height * 0.85,
          padding: const EdgeInsets.symmetric(horizontal: 20),
          child: Column(children: [
            const SizedBox(height: 12),
            Container(width: 40, height: 4, decoration: BoxDecoration(color: Colors.grey.shade300, borderRadius: BorderRadius.circular(2))),
            const SizedBox(height: 20),
            Text(languageService.translate('selectFrequency'), style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
            const Divider(),
            Expanded(child: ListView(children: [
              Padding(padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 16),
                  child: Text(languageService.getCurrentLanguage() == 'fr' ? 'Fréquence' : 'Frequency',
                      style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.blue))),
              ...baseFreqs.asMap().entries.map((entry) {
                final idx = entry.key; final f = entry.value;
                return RadioListTile<String>(
                  secondary: Icon(_getFrequencyIcon(idx), color: _mainFrequencies[itemIndex] == f ? Colors.blue : Colors.grey),
                  title: Text(f), value: f, groupValue: _mainFrequencies[itemIndex], activeColor: Colors.blue,
                  onChanged: (val) {
                    if (val == null) return;
                    setModalState(() {
                      _mainFrequencies[itemIndex] = val;
                      final valEn = _frToEnMap[val] ?? val;
                      if (valEn == 'Three times daily') { _mealAnchorsPerItem[itemIndex] = [anchors[1], anchors[3], anchors[5]]; }
                      else if (valEn.contains('Every') || valEn == 'As needed' || valEn == 'Four times daily') { _mealAnchorsPerItem[itemIndex] = []; }
                      else {
                        int newMax = valEn == 'Once daily' ? 1 : valEn == 'Twice daily' ? 2 : 99;
                        final current = _mealAnchorsPerItem[itemIndex] ?? [];
                        if (current.length > newMax) _mealAnchorsPerItem[itemIndex] = current.sublist(0, newMax);
                      }
                    });
                    setState(() {});
                  },
                );
              }),
              const SizedBox(height: 20),
              Padding(padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 16),
                  child: Text(languageService.getCurrentLanguage() == 'fr' ? 'Moment (Repas)' : 'Timing (Meals)',
                      style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.blue))),
              if (isInterval) Padding(padding: const EdgeInsets.all(16), child: Text(languageService.getCurrentLanguage() == 'fr' ? 'Indisponible pour cette fréquence' : 'Unavailable for this frequency', style: TextStyle(color: Colors.grey.shade500, fontStyle: FontStyle.italic)))
              else if (isThreeTimes) Padding(padding: const EdgeInsets.all(16), child: Text(languageService.getCurrentLanguage() == 'fr' ? 'Auto-sélectionné pour 3 fois/jour' : 'Auto-selected for 3 times/day', style: const TextStyle(color: Colors.blue, fontWeight: FontWeight.bold)))
              else ...anchors.map((a) {
                final currentAnchors = _mealAnchorsPerItem[itemIndex] ?? [];
                final isSelected = currentAnchors.contains(a);
                final isDisabled = !isSelected && currentAnchors.length >= maxAnchors;
                return CheckboxListTile(
                  title: Text(a, style: TextStyle(color: isDisabled ? Colors.grey : Colors.black)),
                  value: isSelected, activeColor: Colors.blue,
                  onChanged: isDisabled ? null : (val) {
                    setModalState(() {
                      if (val == true) _mealAnchorsPerItem[itemIndex] = [...currentAnchors, a];
                      else _mealAnchorsPerItem[itemIndex] = currentAnchors.where((x) => x != a).toList();
                    });
                    setState(() {});
                  },
                );
              }),
            ])),
            Padding(padding: const EdgeInsets.symmetric(vertical: 20),
              child: SizedBox(width: double.infinity, height: 50,
                child: ElevatedButton(onPressed: () => Navigator.pop(context),
                  style: ElevatedButton.styleFrom(backgroundColor: Colors.blue, foregroundColor: Colors.white, shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12))),
                  child: Text(languageService.translate('confirm'), style: const TextStyle(fontWeight: FontWeight.bold)),
                ))),
          ]),
        );
      }),
    );
  }

  String _translateConditionName(String name, LanguageService lang) {
    switch (name) {
      case 'Diabetes Type 1': return lang.translate('diabetesType1');
      case 'Diabetes Type 2': return lang.translate('diabetesType2');
      case 'Hypertension':    return lang.translate('hypertension');
      case 'Asthma':          return lang.translate('asthma');
      case 'Heart Disease':   return lang.translate('heartDisease');
      case 'High Cholesterol':return lang.translate('cholesterol');
      case 'COPD':            return lang.translate('copd');
      case 'Arthritis':       return lang.translate('arthritis');
      case 'Thyroid Disorder':return lang.translate('thyroidDisorder');
      default: return name;
    }
  }

  // ── BUILD ─────────────────────────────────────────────────────────────────

  @override
  Widget build(BuildContext context) {
    final languageService = Provider.of<LanguageService>(context);
    final isFr = languageService.getCurrentLanguage() == 'fr';

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white, elevation: 0,
        leading: IconButton(icon: const Icon(Icons.arrow_back_ios, color: Colors.blue), onPressed: () => Navigator.pop(context)),
        title: Text(languageService.translate('reviewMedications'), style: const TextStyle(color: Colors.blue, fontWeight: FontWeight.bold)),
      ),
      body: Column(children: [

        // locked condition banner
        if (_isConditionPreSelected)
          Container(
            margin: const EdgeInsets.fromLTRB(20, 10, 20, 0),
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(color: Colors.blue.shade50, borderRadius: BorderRadius.circular(12)),
            child: Row(children: [
              const Icon(Icons.lock, color: Colors.blue, size: 16), const SizedBox(width: 8),
              Expanded(child: Text('Adding medications for: ${widget.conditionName}', style: const TextStyle(color: Colors.blue, fontWeight: FontWeight.w500))),
            ]),
          ),

        // start date row
        Padding(
          padding: const EdgeInsets.fromLTRB(20, 20, 20, 10),
          child: Row(children: [
            const Icon(Icons.calendar_today, color: Colors.blue), const SizedBox(width: 10),
            Expanded(child: Text('${languageService.translate('start')}: ${_fmtDate(_startDate)}', style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600))),
            TextButton(onPressed: _pickStartDate, child: Text(languageService.translate('change'))),
          ]),
        ),

        // medication cards
        Expanded(child: ListView.builder(
          padding: const EdgeInsets.fromLTRB(20, 10, 20, 10),
          itemCount: _items.length,
          itemBuilder: (context, index) {
            final item = _items[index];
            final selectedCondition = _patientConditions.firstWhere(
              (c) => c['id'] == _selectedConditionIds[index],
              orElse: () => {'name': widget.conditionName ?? 'No condition selected'},
            );

            return Container(
              margin: const EdgeInsets.only(bottom: 16),
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white, borderRadius: BorderRadius.circular(16),
                boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 12, offset: const Offset(0, 6))],
              ),
              child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [

                // include switch
                Row(children: [
                  Switch(value: item.include, onChanged: (v) => setState(() => item.include = v), activeColor: Colors.blue),
                  const SizedBox(width: 8),
                  Expanded(child: Text(languageService.translate('include'), style: const TextStyle(fontWeight: FontWeight.bold))),
                  if (item.durationDays != null)
                    Text('${item.durationDays} ${languageService.translate('days')}', style: TextStyle(color: Colors.grey.shade700)),
                ]),
                const SizedBox(height: 12),

                // name
                TextField(
                  controller: item.nameController,
                  decoration: InputDecoration(labelText: languageService.translate('medicationName'), border: const OutlineInputBorder()),
                ),
                const SizedBox(height: 12),

                // dosage
                TextField(
                  controller: item.dosageController,
                  decoration: InputDecoration(labelText: languageService.translate('dosage'), border: const OutlineInputBorder()),
                ),
                const SizedBox(height: 12),

                // *** NEW: barcode card ***
                _buildBarcodeCard(index, isFr),
                const SizedBox(height: 12),

                // frequency
                Text(languageService.translate('frequency'), style: const TextStyle(fontWeight: FontWeight.w600, color: Color(0xFF1A237E))),
                const SizedBox(height: 8),
                GestureDetector(
                  onTap: () => _showSmartFrequencySelector(index, languageService),
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                    decoration: BoxDecoration(border: Border.all(color: Colors.grey.shade300), borderRadius: BorderRadius.circular(8), color: Colors.white),
                    child: Row(children: [
                      Icon(Icons.access_time, color: Colors.blue.shade300), const SizedBox(width: 8),
                      Expanded(child: Text(() {
                        final main = _mainFrequencies[index];
                        final anchors = _mealAnchorsPerItem[index] ?? [];
                        if (main == null && anchors.isEmpty) return languageService.translate('selectFrequency');
                        return [if (main != null) main, ...anchors].join(', ');
                      }(), maxLines: 2, overflow: TextOverflow.ellipsis,
                          style: TextStyle(color: _mainFrequencies[index] == null ? Colors.grey.shade400 : Colors.black))),
                      const Icon(Icons.arrow_drop_down, color: Colors.blue),
                    ]),
                  ),
                ),
                const SizedBox(height: 12),

                // priority
                Text(isFr ? 'Priorité' : 'Priority', style: const TextStyle(fontWeight: FontWeight.w600, color: Color(0xFF1A237E))),
                const SizedBox(height: 8),
                Container(
                  padding: const EdgeInsets.all(4),
                  decoration: BoxDecoration(color: Colors.grey.shade100, borderRadius: BorderRadius.circular(12)),
                  child: Row(children: ['LOW','MEDIUM','HIGH'].map((level) {
                    final isSelected = (_priorityPerItem[index] ?? 'MEDIUM') == level;
                    final color = level == 'LOW' ? Colors.green : level == 'HIGH' ? Colors.red : Colors.orange;
                    final label = isFr ? (level == 'LOW' ? 'Basse' : level == 'HIGH' ? 'Haute' : 'Moyenne') : (level == 'LOW' ? 'Low' : level == 'HIGH' ? 'High' : 'Medium');
                    return Expanded(child: GestureDetector(
                      onTap: () => setState(() => _priorityPerItem[index] = level),
                      child: Container(
                        padding: const EdgeInsets.symmetric(vertical: 12),
                        decoration: BoxDecoration(
                          color: isSelected ? color : Colors.transparent, borderRadius: BorderRadius.circular(10),
                          boxShadow: isSelected ? [BoxShadow(color: color.withOpacity(0.3), blurRadius: 4, offset: const Offset(0, 2))] : null,
                        ),
                        child: Text(label, textAlign: TextAlign.center, style: TextStyle(color: isSelected ? Colors.white : Colors.grey.shade600, fontWeight: isSelected ? FontWeight.bold : FontWeight.normal)),
                      ),
                    ));
                  }).toList()),
                ),
                const SizedBox(height: 12),

                // duration
                TextField(
                  controller: item.durationController,
                  keyboardType: TextInputType.number,
                  decoration: InputDecoration(
                    labelText: isFr ? 'Durée (en jours)' : 'Duration (days)',
                    hintText: isFr ? 'Optionnel - ex: 7, 30, 90' : 'Optional - e.g. 7, 30, 90',
                    prefixIcon: const Icon(Icons.calendar_today, color: Colors.blue),
                    border: const OutlineInputBorder(),
                    helperText: isFr ? 'Laissez vide pour une durée illimitée' : 'Leave empty for unlimited duration',
                  ),
                  onChanged: (value) {
                    if (value.isNotEmpty) {
                      final days = int.tryParse(value);
                      setState(() => item.durationDays = (days != null && days > 0) ? days : null);
                    } else { setState(() => item.durationDays = null); }
                  },
                ),
                if (item.durationDays != null && item.durationDays! > 0)
                  Padding(
                    padding: const EdgeInsets.only(top: 8, left: 12),
                    child: Row(children: [
                      const Icon(Icons.date_range, size: 16, color: Colors.green), const SizedBox(width: 8),
                      Text(
                        '${isFr ? 'Fin prévue' : 'End date'}: ${_fmtDate(_startDate.add(Duration(days: item.durationDays! - 1)))}',
                        style: TextStyle(fontSize: 12, color: Colors.green.shade700, fontWeight: FontWeight.w500),
                      ),
                    ]),
                  ),
                const SizedBox(height: 12),

                // condition selector
                Container(
                  decoration: BoxDecoration(
                    border: Border.all(color: _selectedConditionIds[index] == null && item.include ? Colors.red.shade200 : Colors.grey.shade300, width: _selectedConditionIds[index] == null && item.include ? 2 : 1),
                    borderRadius: BorderRadius.circular(8),
                    color: _isConditionPreSelected ? Colors.grey.shade50 : Colors.white,
                  ),
                  child: GestureDetector(
                    onTap: () => _showConditionSelector(index),
                    child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 16),
                      child: Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
                        Expanded(child: Text(
                          _selectedConditionIds[index] == null
                              ? (item.include ? 'Select condition (required)' : 'Select condition')
                              : _translateConditionName(selectedCondition['name'], languageService),
                          style: TextStyle(
                            color: _selectedConditionIds[index] == null && item.include ? Colors.red.shade400
                                : (_selectedConditionIds[index] == null ? Colors.grey.shade600
                                : (_isConditionPreSelected ? Colors.grey.shade700 : Colors.black)),
                          ),
                        )),
                        Icon(_isConditionPreSelected ? Icons.lock : Icons.arrow_drop_down,
                            color: _isConditionPreSelected ? Colors.grey : Colors.blue),
                      ]),
                    ),
                  ),
                ),
                if (_selectedConditionIds[index] == null && item.include && !_isConditionPreSelected)
                  Padding(padding: const EdgeInsets.only(top: 4, left: 12), child: Text('Required', style: TextStyle(fontSize: 12, color: Colors.red.shade400))),
              ]),
            );
          },
        )),

        // save button
        Padding(
          padding: const EdgeInsets.fromLTRB(20, 10, 20, 20),
          child: SizedBox(
            width: double.infinity, height: 55,
            child: ElevatedButton(
              onPressed: _isSubmitting ? null : _saveSelected,
              style: ElevatedButton.styleFrom(backgroundColor: Colors.blue, foregroundColor: Colors.white, shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(30)), elevation: 0),
              child: _isSubmitting
                  ? const SizedBox(width: 22, height: 22, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                  : Text(languageService.translate('saveSelected'), style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
            ),
          ),
        ),
      ]),
    );
  }
}

class _EditableMedication {
  final TextEditingController nameController;
  final TextEditingController dosageController;
  final TextEditingController durationController;
  String frequency;
  bool include;
  int? durationDays;

  _EditableMedication({
    required String name,
    required String dosage,
    required this.frequency,
    required this.durationDays,
  }) : nameController     = TextEditingController(text: name),
       dosageController   = TextEditingController(text: dosage),
       durationController = TextEditingController(text: durationDays != null ? durationDays.toString() : ''),
       include = true;
}