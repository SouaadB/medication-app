import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'add_medication_page.dart';
import '../config/api_config.dart';
import '../services/language_service.dart';

class ConditionDetailPage extends StatefulWidget {
  final Map<String, dynamic> condition;

  const ConditionDetailPage({super.key, required this.condition});

  @override
  State<ConditionDetailPage> createState() => _ConditionDetailPageState();
}

class _ConditionDetailPageState extends State<ConditionDetailPage> {
  List<dynamic> _medications = [];
  bool _isLoading = true;
  Map<String, dynamic>? _nextDose;

  @override
  void initState() {
    super.initState();
    _loadMedications();
    _loadNextDose();
  }

  // ── data loading ────────────────────────────────────────────────────────────

  Future<void> _loadMedications() async {
    setState(() => _isLoading = true);
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');
      final conditionId = widget.condition['id'];
      final response = await http.get(
        Uri.parse('${ApiConfig.baseUrl}/treatments/condition/$conditionId'),
        headers: ApiConfig.getAuthHeaders(token!),
      );
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        setState(() { _medications = data['treatments']; _isLoading = false; });
      } else { setState(() => _isLoading = false); }
    } catch (e) { setState(() => _isLoading = false); }
  }

  Future<void> _loadNextDose() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');
      final response = await http.get(
        Uri.parse('${ApiConfig.baseUrl}/treatments/next-dose'),
        headers: ApiConfig.getAuthHeaders(token!),
      );
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        setState(() => _nextDose = data['nextDose']);
      }
    } catch (_) {}
  }

  // ── helpers ─────────────────────────────────────────────────────────────────

  String _formatNextDoseText(Map<String, dynamic> med) {
    final date = DateTime.parse(med['scheduled_date_time']);
    final hour   = date.hour.toString().padLeft(2, '0');
    final minute = date.minute.toString().padLeft(2, '0');
    return '$hour:$minute';
  }

  String _getNextDoseDay(DateTime date) {
    final now      = DateTime.now();
    final tomorrow = DateTime(now.year, now.month, now.day + 1);
    if (date.day == now.day && date.month == now.month && date.year == now.year) return "Aujourd'hui";
    if (date.day == tomorrow.day && date.month == tomorrow.month && date.year == tomorrow.year) return "Demain";
    return '${date.day}/${date.month}';
  }

  Color _priorityColor(String? priority) {
    switch ((priority ?? '').toUpperCase()) {
      case 'HIGH':   return Colors.red;
      case 'LOW':    return Colors.green;
      default:       return Colors.orange;
    }
  }

  String _priorityLabel(String? priority, bool isFr) {
    switch ((priority ?? '').toUpperCase()) {
      case 'HIGH':   return isFr ? 'Haute'   : 'High';
      case 'LOW':    return isFr ? 'Basse'   : 'Low';
      default:       return isFr ? 'Moyenne' : 'Medium';
    }
  }

  String _formatDate(String? isoDate) {
    if (isoDate == null || isoDate.isEmpty) return '—';
    try {
      final d = DateTime.parse(isoDate);
      return '${d.day.toString().padLeft(2,'0')}/${d.month.toString().padLeft(2,'0')}/${d.year}';
    } catch (_) { return isoDate; }
  }

  // ── delete ───────────────────────────────────────────────────────────────────

  Future<void> _deleteMedication(int treatmentId) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');
      final response = await http.delete(
        Uri.parse('${ApiConfig.baseUrl}/treatments/$treatmentId'),
        headers: ApiConfig.getAuthHeaders(token!),
      );
      if (response.statusCode == 200) {
        _loadMedications();
        _loadNextDose();
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
            content: Text('Médicament supprimé avec succès'),
            backgroundColor: Colors.green,
          ));
        }
      } else { throw Exception('Failed to delete'); }
    } catch (_) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
          content: Text('Erreur lors de la suppression'),
          backgroundColor: Colors.red,
        ));
      }
    }
  }

  void _showDeleteConfirmation(int treatmentId, String name) {
    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        title: const Text('Delete medication'),
        content: Text('Are you sure you want to delete $name?'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text('Cancel')),
          TextButton(
            onPressed: () { Navigator.pop(context); _deleteMedication(treatmentId); },
            style: TextButton.styleFrom(foregroundColor: Colors.red),
            child: const Text('Delete'),
          ),
        ],
      ),
    );
  }

  // ── tap card → show detail / edit sheet ─────────────────────────────────────

  void _openMedicationDetail(Map<String, dynamic> med) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => _MedicationDetailSheet(
        medication: med,
        onUpdated: () { _loadMedications(); _loadNextDose(); },
        onDeleted: () { _deleteMedication(med['id']); },
      ),
    );
  }

  // ── BUILD ────────────────────────────────────────────────────────────────────

  @override
  Widget build(BuildContext context) {
    final languageService = Provider.of<LanguageService>(context);
    final isFr = languageService.getCurrentLanguage() == 'fr';

    return Scaffold(
      backgroundColor: const Color(0xFFF7F8FC),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios, color: Colors.blue),
          onPressed: () => Navigator.pop(context),
        ),
        title: Text(widget.condition['name'],
            style: const TextStyle(color: Colors.blue, fontWeight: FontWeight.bold)),
        actions: [
          IconButton(icon: const Icon(Icons.more_vert, color: Colors.blue), onPressed: () {}),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : Column(children: [

              // ── adherence card ────────────────────────────────────────────
              Container(
                margin: const EdgeInsets.fromLTRB(20, 20, 20, 0),
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(24),
                  boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 20, offset: const Offset(0, 10))],
                ),
                child: Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
                  Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                    Text(isFr ? "Taux d'observance" : 'Adherence Rate',
                        style: TextStyle(fontSize: 14, color: Colors.grey.shade600)),
                    const SizedBox(height: 4),
                    Text('${widget.condition['percentage']}%',
                        style: const TextStyle(fontSize: 32, fontWeight: FontWeight.bold, color: Colors.blue)),
                  ]),
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(color: Colors.blue.withOpacity(0.1), shape: BoxShape.circle),
                    child: const Icon(Icons.medical_services, color: Colors.blue, size: 32),
                  ),
                ]),
              ),

              // ── section title ─────────────────────────────────────────────
              Padding(
                padding: const EdgeInsets.fromLTRB(20, 24, 20, 8),
                child: Row(children: [
                  Text(isFr ? 'Médicaments' : 'Medications',
                      style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Color(0xFF1A237E))),
                  const Spacer(),
                  if (_medications.isNotEmpty)
                    Text('${_medications.length} total',
                        style: TextStyle(fontSize: 13, color: Colors.grey.shade500)),
                ]),
              ),

              // ── hint text ─────────────────────────────────────────────────
              if (_medications.isNotEmpty)
                Padding(
                  padding: const EdgeInsets.fromLTRB(20, 0, 20, 8),
                  child: Row(children: [
                    Icon(Icons.touch_app_outlined, size: 14, color: Colors.grey.shade400),
                    const SizedBox(width: 4),
                    Text(isFr ? 'Appuyez sur un médicament pour voir les détails' : 'Tap a medication to see details',
                        style: TextStyle(fontSize: 12, color: Colors.grey.shade400)),
                  ]),
                ),

              // ── medications list ──────────────────────────────────────────
              Expanded(
                child: _medications.isEmpty
                    ? Center(child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
                        Icon(Icons.medication_outlined, size: 80, color: Colors.grey.shade300),
                        const SizedBox(height: 16),
                        Text(isFr ? 'Aucun médicament pour cette condition' : 'No medications for this condition',
                            style: TextStyle(color: Colors.grey.shade600)),
                      ]))
                    : ListView.builder(
                        padding: const EdgeInsets.fromLTRB(20, 0, 20, 20),
                        itemCount: _medications.length,
                        itemBuilder: (context, index) {
                          final med = _medications[index];
                          final isNextDose = _nextDose != null &&
                              _nextDose!['medication_name'] == med['medication_name'];
                          return _buildMedicationCard(med, isNextDose, isFr);
                        },
                      ),
              ),

              // ── add button ────────────────────────────────────────────────
              Padding(
                padding: const EdgeInsets.all(20),
                child: SizedBox(
                  width: double.infinity, height: 55,
                  child: ElevatedButton.icon(
                    onPressed: () {
                      Navigator.push(context, MaterialPageRoute(
                        builder: (_) => AddMedicationPage(
                          conditionId: widget.condition['id'],
                          conditionName: widget.condition['name'],
                        ),
                      )).then((_) => _loadMedications());
                    },
                    icon: const Icon(Icons.add),
                    label: Text(isFr ? 'Ajouter un médicament' : 'Add medication',
                        style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.blue, foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(30)),
                      elevation: 0,
                    ),
                  ),
                ),
              ),
            ]),
    );
  }

  // ── medication card ──────────────────────────────────────────────────────────

  Widget _buildMedicationCard(Map<String, dynamic> med, bool isNextDose, bool isFr) {
    final priority      = (med['priority'] ?? 'MEDIUM').toString().toUpperCase();
    final priorityColor = _priorityColor(priority);
    final hasBarcode    = med['barcode_data'] != null;

    return GestureDetector(
      onTap: () => _openMedicationDetail(med),
      child: Container(
        margin: const EdgeInsets.only(bottom: 14),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(20),
          boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 10, offset: const Offset(0, 5))],
        ),
        child: Column(children: [

          // ── top: priority stripe ──────────────────────────────────────────
          Container(
            height: 4,
            decoration: BoxDecoration(
              color: priorityColor,
              borderRadius: const BorderRadius.vertical(top: Radius.circular(20)),
            ),
          ),

          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [

              // name + badges + delete
              Row(children: [
                Expanded(child: Text(
                  med['medication_name'],
                  style: const TextStyle(fontSize: 17, fontWeight: FontWeight.bold, color: Color(0xFF1A237E)),
                )),
                // priority badge
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                  decoration: BoxDecoration(
                    color: priorityColor.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Text(_priorityLabel(priority, isFr),
                      style: TextStyle(fontSize: 11, color: priorityColor, fontWeight: FontWeight.w600)),
                ),
                const SizedBox(width: 6),
                // barcode badge
                if (hasBarcode)
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 3),
                    decoration: BoxDecoration(
                      color: Colors.green.shade50,
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: Colors.green.shade200),
                    ),
                    child: Row(mainAxisSize: MainAxisSize.min, children: [
                      Icon(Icons.qr_code, size: 11, color: Colors.green.shade600),
                      const SizedBox(width: 3),
                      Text('scan', style: TextStyle(fontSize: 10, color: Colors.green.shade600)),
                    ]),
                  ),
                const SizedBox(width: 4),
                // delete
                GestureDetector(
                  onTap: () => _showDeleteConfirmation(med['id'], med['medication_name']),
                  child: Container(
                    padding: const EdgeInsets.all(6),
                    decoration: BoxDecoration(color: Colors.red.shade50, borderRadius: BorderRadius.circular(8)),
                    child: Icon(Icons.delete_outline, color: Colors.red.shade400, size: 18),
                  ),
                ),
              ]),
              const SizedBox(height: 10),

              // dosage + frequency chips
              Wrap(spacing: 8, children: [
                if (med['dosage'] != null && med['dosage'].toString().isNotEmpty)
                  _chip(Icons.science_outlined, med['dosage'].toString(), Colors.blue),
                _chip(Icons.access_time, med['frequency'].toString().split(' + ').first, Colors.purple),
              ]),
              const SizedBox(height: 12),

              // dates row
              Row(children: [
                Icon(Icons.calendar_today_outlined, size: 13, color: Colors.grey.shade400),
                const SizedBox(width: 4),
                Text(_formatDate(med['start_date']),
                    style: TextStyle(fontSize: 12, color: Colors.grey.shade500)),
                if (med['end_date'] != null) ...[
                  Text('  →  ', style: TextStyle(fontSize: 12, color: Colors.grey.shade400)),
                  Text(_formatDate(med['end_date']),
                      style: TextStyle(fontSize: 12, color: Colors.grey.shade500)),
                ],
                const Spacer(),
                // active status
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                  decoration: BoxDecoration(
                    color: (med['is_active'] == true || med['is_active'] == 1)
                        ? Colors.green.shade50 : Colors.grey.shade100,
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Text(
                    (med['is_active'] == true || med['is_active'] == 1)
                        ? (isFr ? 'Actif' : 'Active')
                        : (isFr ? 'Inactif' : 'Inactive'),
                    style: TextStyle(
                      fontSize: 11,
                      color: (med['is_active'] == true || med['is_active'] == 1)
                          ? Colors.green.shade600 : Colors.grey.shade500,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ]),

              // next dose
              if (isNextDose && _nextDose != null) ...[
                const SizedBox(height: 10),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                  decoration: BoxDecoration(
                    color: Colors.blue.shade50,
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Row(children: [
                    const Icon(Icons.notifications_active_outlined, size: 15, color: Colors.blue),
                    const SizedBox(width: 6),
                    Text(
                      '${isFr ? 'Prochaine dose' : 'Next dose'}: ${_formatNextDoseText(_nextDose!)} (${_getNextDoseDay(DateTime.parse(_nextDose!['scheduled_date_time']))})',
                      style: const TextStyle(fontSize: 13, color: Colors.blue, fontWeight: FontWeight.w500),
                    ),
                  ]),
                ),
              ],

              // tap hint
              const SizedBox(height: 8),
              Row(mainAxisAlignment: MainAxisAlignment.end, children: [
                Text(isFr ? 'Appuyer pour modifier' : 'Tap to edit',
                    style: TextStyle(fontSize: 11, color: Colors.grey.shade400)),
                const SizedBox(width: 3),
                Icon(Icons.edit_outlined, size: 12, color: Colors.grey.shade400),
              ]),
            ]),
          ),
        ]),
      ),
    );
  }

  Widget _chip(IconData icon, String label, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
      decoration: BoxDecoration(color: color.withOpacity(0.08), borderRadius: BorderRadius.circular(20)),
      child: Row(mainAxisSize: MainAxisSize.min, children: [
        Icon(icon, size: 13, color: color),
        const SizedBox(width: 4),
        Text(label, style: TextStyle(fontSize: 12, color: color, fontWeight: FontWeight.w500)),
      ]),
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// MEDICATION DETAIL + EDIT BOTTOM SHEET
// ─────────────────────────────────────────────────────────────────────────────

class _MedicationDetailSheet extends StatefulWidget {
  final Map<String, dynamic> medication;
  final VoidCallback onUpdated;
  final VoidCallback onDeleted;

  const _MedicationDetailSheet({
    required this.medication,
    required this.onUpdated,
    required this.onDeleted,
  });

  @override
  State<_MedicationDetailSheet> createState() => _MedicationDetailSheetState();
}

class _MedicationDetailSheetState extends State<_MedicationDetailSheet> {

  bool _isEditing = false;
  bool _isSaving  = false;

  // controllers
  late TextEditingController _nameCtrl;
  late TextEditingController _dosageCtrl;
  late TextEditingController _startCtrl;
  late TextEditingController _endCtrl;

  // editable values
  late String  _priority;
  late bool    _isActive;
  late String  _frequency;

  // frequency selector state
  String? _mainFrequency;
  List<String> _mealAnchors = [];

  final List<String> _frequenciesEn = const [
    'Once daily','Twice daily','Three times daily','Four times daily',
    'Every 4 hours','Every 6 hours','Every 8 hours','Every 12 hours','As needed',
  ];
  final List<String> _mealAnchorsEn = const [
    'Before breakfast','After breakfast','Before lunch',
    'After lunch','Before dinner','After dinner','Before sleeping',
  ];

  @override
  void initState() {
    super.initState();
    final med = widget.medication;
    _nameCtrl   = TextEditingController(text: med['medication_name'] ?? '');
    _dosageCtrl = TextEditingController(text: med['dosage'] ?? '');
    _startCtrl  = TextEditingController(text: _isoToDisplay(med['start_date']));
    _endCtrl    = TextEditingController(text: _isoToDisplay(med['end_date']));
    _priority   = (med['priority'] ?? 'MEDIUM').toString().toUpperCase();
    _isActive   = med['is_active'] == true || med['is_active'] == 1;
    _frequency  = med['frequency'] ?? 'Once daily';
    _parseFrequency(_frequency);
  }

  @override
  void dispose() {
    _nameCtrl.dispose();
    _dosageCtrl.dispose();
    _startCtrl.dispose();
    _endCtrl.dispose();
    super.dispose();
  }

  // ── parse existing frequency string into main + anchors ───────────────────

  void _parseFrequency(String freq) {
    final parts = freq.split(' + ');
    if (parts.isEmpty) return;
    _mainFrequency = _frequenciesEn.contains(parts.first) ? parts.first : _frequenciesEn.first;
    _mealAnchors = parts.skip(1).where((p) => _mealAnchorsEn.contains(p)).toList();
  }

  String _buildFrequency() {
    final parts = <String>[];
    if (_mainFrequency != null) parts.add(_mainFrequency!);
    parts.addAll(_mealAnchors);
    return parts.isEmpty ? 'Once daily' : parts.join(' + ');
  }

  // ── date helpers ─────────────────────────────────────────────────────────

  String _isoToDisplay(String? iso) {
    if (iso == null || iso.isEmpty) return '';
    try {
      final d = DateTime.parse(iso);
      return '${d.day.toString().padLeft(2,'0')}/${d.month.toString().padLeft(2,'0')}/${d.year}';
    } catch (_) { return ''; }
  }

  String _displayToIso(String display) {
    if (display.isEmpty) return '';
    try {
      final parts = display.split('/');
      return '${parts[2]}-${parts[1]}-${parts[0]}';
    } catch (_) { return ''; }
  }

  Future<void> _pickDate(TextEditingController ctrl) async {
    DateTime initial = DateTime.now();
    if (ctrl.text.isNotEmpty) {
      try {
        final p = ctrl.text.split('/');
        initial = DateTime(int.parse(p[2]), int.parse(p[1]), int.parse(p[0]));
      } catch (_) {}
    }
    final picked = await showDatePicker(
      context: context, initialDate: initial,
      firstDate: DateTime(2000), lastDate: DateTime(2100),
      builder: (ctx, child) => Theme(
        data: Theme.of(ctx).copyWith(colorScheme: const ColorScheme.light(primary: Colors.blue)),
        child: child!,
      ),
    );
    if (picked != null) {
      setState(() {
        ctrl.text = '${picked.day.toString().padLeft(2,'0')}/${picked.month.toString().padLeft(2,'0')}/${picked.year}';
      });
    }
  }

  // ── save ─────────────────────────────────────────────────────────────────

  Future<void> _save() async {
    setState(() => _isSaving = true);
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');
      final id    = widget.medication['id'];

      final body = <String, dynamic>{
        'medication_name': _nameCtrl.text.trim(),
        'dosage':          _dosageCtrl.text.trim(),
        'frequency':       _buildFrequency(),
        'priority':        _priority,
        'is_active':       _isActive,
        'start_date':      _displayToIso(_startCtrl.text),
      };
      if (_endCtrl.text.isNotEmpty) {
        body['end_date'] = _displayToIso(_endCtrl.text);
      }

      final response = await http.put(
        Uri.parse('${ApiConfig.baseUrl}/treatments/$id'),
        headers: ApiConfig.getAuthHeaders(token!),
        body: jsonEncode(body),
      );

      if (response.statusCode == 200) {
        if (mounted) {
          setState(() { _isEditing = false; _isSaving = false; });
          ScaffoldMessenger.of(context).showSnackBar(SnackBar(
            content: const Row(children: [
              Icon(Icons.check_circle, color: Colors.white),
              SizedBox(width: 10),
              Text('Medication updated successfully'),
            ]),
            backgroundColor: Colors.green,
            behavior: SnackBarBehavior.floating,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
          ));
          widget.onUpdated();
        }
      } else {
        final err = jsonDecode(response.body);
        throw Exception(err['message'] ?? 'Update failed');
      }
    } catch (e) {
      if (mounted) {
        setState(() => _isSaving = false);
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(
          content: Text('Error: $e'),
          backgroundColor: Colors.red,
          behavior: SnackBarBehavior.floating,
        ));
      }
    }
  }

  // ── frequency selector ────────────────────────────────────────────────────

  void _showFrequencySelector() {
    showModalBottomSheet(
      context: context, isScrollControlled: true,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(25))),
      builder: (_) => StatefulBuilder(builder: (ctx, setModal) {
        final isInterval = _mainFrequency != null &&
            (_mainFrequency!.contains('Every') || _mainFrequency == 'As needed' || _mainFrequency == 'Four times daily');
        final isThree = _mainFrequency == 'Three times daily';
        int maxAnchors = 99;
        if (_mainFrequency == 'Once daily') maxAnchors = 1;
        else if (_mainFrequency == 'Twice daily') maxAnchors = 2;

        return Container(
          height: MediaQuery.of(context).size.height * 0.80,
          padding: const EdgeInsets.symmetric(horizontal: 20),
          child: Column(children: [
            const SizedBox(height: 12),
            Container(width: 40, height: 4, decoration: BoxDecoration(color: Colors.grey.shade300, borderRadius: BorderRadius.circular(2))),
            const SizedBox(height: 16),
            const Text('Select Frequency', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
            const Divider(),
            Expanded(child: ListView(children: [
              const Padding(padding: EdgeInsets.symmetric(vertical: 8, horizontal: 4),
                  child: Text('Frequency', style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: Colors.blue))),
              ..._frequenciesEn.map((f) => RadioListTile<String>(
                title: Text(f), value: f, groupValue: _mainFrequency, activeColor: Colors.blue,
                onChanged: (val) {
                  if (val == null) return;
                  setModal(() {
                    _mainFrequency = val;
                    if (val == 'Three times daily') { _mealAnchors = [_mealAnchorsEn[1], _mealAnchorsEn[3], _mealAnchorsEn[5]]; }
                    else if (val.contains('Every') || val == 'As needed' || val == 'Four times daily') { _mealAnchors = []; }
                    else {
                      int nm = val == 'Once daily' ? 1 : val == 'Twice daily' ? 2 : 99;
                      if (_mealAnchors.length > nm) _mealAnchors = _mealAnchors.sublist(0, nm);
                    }
                  });
                  setState(() {});
                },
              )),
              const SizedBox(height: 12),
              const Padding(padding: EdgeInsets.symmetric(vertical: 8, horizontal: 4),
                  child: Text('Timing (Meals)', style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: Colors.blue))),
              if (isInterval) Padding(padding: const EdgeInsets.all(12),
                  child: Text('Not available for this frequency', style: TextStyle(color: Colors.grey.shade500, fontStyle: FontStyle.italic)))
              else if (isThree) const Padding(padding: EdgeInsets.all(12),
                  child: Text('Auto-selected for 3 times/day', style: TextStyle(color: Colors.blue, fontWeight: FontWeight.bold)))
              else ..._mealAnchorsEn.map((a) {
                final isSel = _mealAnchors.contains(a);
                final isDis = !isSel && _mealAnchors.length >= maxAnchors;
                return CheckboxListTile(
                  title: Text(a, style: TextStyle(color: isDis ? Colors.grey : Colors.black)),
                  value: isSel, activeColor: Colors.blue,
                  onChanged: isDis ? null : (val) {
                    setModal(() { if (val == true) _mealAnchors.add(a); else _mealAnchors.remove(a); });
                    setState(() {});
                  },
                );
              }),
            ])),
            Padding(padding: const EdgeInsets.symmetric(vertical: 16),
              child: SizedBox(width: double.infinity, height: 50,
                child: ElevatedButton(onPressed: () => Navigator.pop(ctx),
                  style: ElevatedButton.styleFrom(backgroundColor: Colors.blue, foregroundColor: Colors.white, shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12))),
                  child: const Text('Confirm', style: TextStyle(fontWeight: FontWeight.bold)),
                ))),
          ]),
        );
      }),
    );
  }

  // ── BUILD ─────────────────────────────────────────────────────────────────

  @override
  Widget build(BuildContext context) {
    final med    = widget.medication;
    final sh     = MediaQuery.of(context).size.height;

    return Container(
      height: sh * 0.90,
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
      ),
      child: Column(children: [

        // ── drag handle ──────────────────────────────────────────────────────
        const SizedBox(height: 12),
        Container(width: 40, height: 4,
            decoration: BoxDecoration(color: Colors.grey.shade300, borderRadius: BorderRadius.circular(2))),
        const SizedBox(height: 16),

        // ── header ───────────────────────────────────────────────────────────
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20),
          child: Row(children: [
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(color: Colors.blue.shade50, borderRadius: BorderRadius.circular(12)),
              child: const Icon(Icons.medication, color: Colors.blue, size: 26),
            ),
            const SizedBox(width: 12),
            Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text(_isEditing ? 'Edit Medication' : 'Medication Details',
                  style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFF1A237E))),
              Text(_isEditing ? 'Make your changes below' : 'Tap Edit to modify',
                  style: TextStyle(fontSize: 12, color: Colors.grey.shade500)),
            ])),
            // edit / cancel toggle
            TextButton.icon(
              onPressed: () => setState(() { _isEditing = !_isEditing; if (!_isEditing) _parseFrequency(widget.medication['frequency'] ?? 'Once daily'); }),
              icon: Icon(_isEditing ? Icons.close : Icons.edit_outlined, size: 18),
              label: Text(_isEditing ? 'Cancel' : 'Edit'),
              style: TextButton.styleFrom(
                foregroundColor: _isEditing ? Colors.grey : Colors.blue,
                backgroundColor: _isEditing ? Colors.grey.shade100 : Colors.blue.shade50,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
              ),
            ),
          ]),
        ),
        const SizedBox(height: 4),
        Divider(color: Colors.grey.shade100),

        // ── scrollable content ───────────────────────────────────────────────
        Expanded(child: SingleChildScrollView(
          padding: const EdgeInsets.fromLTRB(20, 8, 20, 20),
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [

            // ── medication name ────────────────────────────────────────────
            _sectionLabel(Icons.medication_outlined, 'Medication Name'),
            const SizedBox(height: 8),
            _isEditing
                ? _editField(_nameCtrl, 'Medication name', Icons.medication_outlined)
                : _readField(med['medication_name'] ?? '—', Icons.medication_outlined),
            const SizedBox(height: 18),

            // ── dosage ─────────────────────────────────────────────────────
            _sectionLabel(Icons.science_outlined, 'Dosage'),
            const SizedBox(height: 8),
            _isEditing
                ? _editField(_dosageCtrl, 'e.g. 500mg, 1g', Icons.science_outlined)
                : _readField(med['dosage'] ?? '—', Icons.science_outlined),
            const SizedBox(height: 18),

            // ── frequency ──────────────────────────────────────────────────
            _sectionLabel(Icons.access_time, 'Frequency'),
            const SizedBox(height: 8),
            _isEditing
                ? GestureDetector(
                    onTap: _showFrequencySelector,
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                      decoration: BoxDecoration(
                        border: Border.all(color: Colors.blue.shade200, width: 1.5),
                        borderRadius: BorderRadius.circular(12),
                        color: Colors.blue.shade50,
                      ),
                      child: Row(children: [
                        Icon(Icons.access_time, color: Colors.blue.shade400, size: 18),
                        const SizedBox(width: 10),
                        Expanded(child: Text(_buildFrequency(), style: TextStyle(fontSize: 15, color: Colors.blue.shade700))),
                        Icon(Icons.arrow_drop_down, color: Colors.blue.shade400),
                      ]),
                    ),
                  )
                : _readField(med['frequency'] ?? '—', Icons.access_time),
            const SizedBox(height: 18),

            // ── priority ───────────────────────────────────────────────────
            _sectionLabel(Icons.priority_high, 'Priority'),
            const SizedBox(height: 8),
            _isEditing
                ? Container(
                    padding: const EdgeInsets.all(4),
                    decoration: BoxDecoration(color: Colors.grey.shade100, borderRadius: BorderRadius.circular(12)),
                    child: Row(children: ['LOW','MEDIUM','HIGH'].map((level) {
                      final isSel  = _priority == level;
                      final color  = level == 'LOW' ? Colors.green : level == 'HIGH' ? Colors.red : Colors.orange;
                      final labels = {'LOW': 'Low', 'MEDIUM': 'Medium', 'HIGH': 'High'};
                      return Expanded(child: GestureDetector(
                        onTap: () => setState(() => _priority = level),
                        child: Container(
                          padding: const EdgeInsets.symmetric(vertical: 12),
                          decoration: BoxDecoration(
                            color: isSel ? color : Colors.transparent,
                            borderRadius: BorderRadius.circular(10),
                            boxShadow: isSel ? [BoxShadow(color: color.withOpacity(0.3), blurRadius: 4, offset: const Offset(0,2))] : null,
                          ),
                          child: Text(labels[level]!, textAlign: TextAlign.center,
                              style: TextStyle(color: isSel ? Colors.white : Colors.grey.shade600, fontWeight: isSel ? FontWeight.bold : FontWeight.normal)),
                        ),
                      ));
                    }).toList()),
                  )
                : Row(children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                      decoration: BoxDecoration(
                        color: _priorityColor(_priority).withOpacity(0.1),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Row(mainAxisSize: MainAxisSize.min, children: [
                        Icon(Icons.circle, size: 10, color: _priorityColor(_priority)),
                        const SizedBox(width: 6),
                        Text(_priorityLabel(_priority, false),
                            style: TextStyle(color: _priorityColor(_priority), fontWeight: FontWeight.w600)),
                      ]),
                    ),
                  ]),
            const SizedBox(height: 18),

            // ── active status ──────────────────────────────────────────────
            _sectionLabel(Icons.toggle_on_outlined, 'Status'),
            const SizedBox(height: 8),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
              decoration: BoxDecoration(
                border: Border.all(color: Colors.grey.shade200),
                borderRadius: BorderRadius.circular(12),
                color: Colors.white,
              ),
              child: Row(children: [
                Icon(
                  _isActive ? Icons.check_circle_outline : Icons.pause_circle_outline,
                  color: _isActive ? Colors.green : Colors.grey,
                  size: 20,
                ),
                const SizedBox(width: 10),
                Expanded(child: Text(
                  _isActive ? 'Active — currently taking' : 'Inactive — paused',
                  style: TextStyle(fontSize: 15, color: _isActive ? Colors.green.shade700 : Colors.grey.shade600),
                )),
                if (_isEditing)
                  Switch(
                    value: _isActive,
                    onChanged: (v) => setState(() => _isActive = v),
                    activeColor: Colors.green,
                  ),
              ]),
            ),
            const SizedBox(height: 18),

            // ── dates ──────────────────────────────────────────────────────
            Row(children: [
              Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                _sectionLabel(Icons.calendar_today_outlined, 'Start Date'),
                const SizedBox(height: 8),
                _isEditing
                    ? GestureDetector(
                        onTap: () => _pickDate(_startCtrl),
                        child: _editField(_startCtrl, 'dd/mm/yyyy', Icons.calendar_today_outlined, readOnly: true),
                      )
                    : _readField(_startCtrl.text.isNotEmpty ? _startCtrl.text : '—', Icons.calendar_today_outlined),
              ])),
              const SizedBox(width: 12),
              Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                _sectionLabel(Icons.calendar_month_outlined, 'End Date'),
                const SizedBox(height: 8),
                _isEditing
                    ? GestureDetector(
                        onTap: () => _pickDate(_endCtrl),
                        child: _editField(_endCtrl, 'dd/mm/yyyy (optional)', Icons.calendar_month_outlined, readOnly: true),
                      )
                    : _readField(_endCtrl.text.isNotEmpty ? _endCtrl.text : '—', Icons.calendar_month_outlined),
              ])),
            ]),
            const SizedBox(height: 18),

            // ── barcode ────────────────────────────────────────────────────
            if (med['barcode_data'] != null) ...[
              _sectionLabel(Icons.qr_code, 'Barcode'),
              const SizedBox(height: 8),
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: Colors.green.shade50,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: Colors.green.shade200),
                ),
                child: Row(children: [
                  Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(color: Colors.green.shade100, borderRadius: BorderRadius.circular(8)),
                    child: const Icon(Icons.qr_code, color: Colors.green, size: 22),
                  ),
                  const SizedBox(width: 12),
                  Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                    const Text('Barcode on file', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.green)),
                    const SizedBox(height: 2),
                    Text(
                      med['barcode_data'] is Map
                          ? (med['barcode_data']['barcode'] ?? '').toString()
                          : med['barcode_data'].toString(),
                      style: TextStyle(fontSize: 12, color: Colors.grey.shade700, fontFamily: 'monospace'),
                    ),
                  ])),
                ]),
              ),
              const SizedBox(height: 18),
            ],

            // ── created at ─────────────────────────────────────────────────
            _sectionLabel(Icons.history, 'Added on'),
            const SizedBox(height: 8),
            _readField(_formatDate(med['created_at']), Icons.history),
            const SizedBox(height: 30),

               
                  // REPLACE WITH:
SizedBox(
  width: double.infinity, height: 50,
  child: OutlinedButton.icon(
    onPressed: () {
      showDialog(
        context: context,
        builder: (_) => AlertDialog(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          title: const Row(children: [
            Icon(Icons.warning_amber_rounded, color: Colors.red, size: 24),
            SizedBox(width: 8),
            Text('Delete Medication', style: TextStyle(fontSize: 18)),
          ]),
          content: Text(
            'Are you sure you want to delete "${widget.medication['medication_name']}"?\n\nThis will also remove all scheduled doses.',
            style: const TextStyle(fontSize: 15),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('Cancel', style: TextStyle(color: Colors.grey, fontSize: 15)),
            ),
            ElevatedButton(
              onPressed: () {
                Navigator.pop(context); // close dialog
                Navigator.pop(context); // close sheet
                widget.onDeleted();
                                   },
                                    style: ElevatedButton.styleFrom(
                                    backgroundColor: Colors.red,
                                    foregroundColor: Colors.white,
                                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                                   ),
                                  child: const Text('Delete', style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold)),
                               ),
                               ],
                                ),
                            );
                          },
                     icon: const Icon(Icons.delete_outline, color: Colors.red),
                     label: const Text('Delete Medication', style: TextStyle(color: Colors.red, fontWeight: FontWeight.w600)),
                     style: OutlinedButton.styleFrom(
                     side: const BorderSide(color: Colors.red),
                     shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
              ),
         ),
            const SizedBox(height: 12),
          ]),
        )),

        // ── save button (only in edit mode) ──────────────────────────────────
        if (_isEditing)
          Container(
            padding: const EdgeInsets.fromLTRB(20, 8, 20, 20),
            decoration: BoxDecoration(
              color: Colors.white,
              boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.06), blurRadius: 8, offset: const Offset(0, -4))],
            ),
            child: SizedBox(
              width: double.infinity, height: 54,
              child: ElevatedButton.icon(
                onPressed: _isSaving ? null : _save,
                icon: _isSaving
                    ? const SizedBox(width: 18, height: 18, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                    : const Icon(Icons.save_outlined),
                label: Text(_isSaving ? 'Saving…' : 'Save Changes',
                    style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.blue, foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                  elevation: 0,
                ),
              ),
            ),
          ),
        if (!_isEditing) SizedBox(height: MediaQuery.of(context).padding.bottom + 8),
      ]),
    );
  }

  // ── small UI helpers ──────────────────────────────────────────────────────

  Widget _sectionLabel(IconData icon, String label) {
    return Row(children: [
      Icon(icon, size: 15, color: Colors.blue.shade400),
      const SizedBox(width: 6),
      Text(label, style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: Colors.grey.shade600, letterSpacing: 0.3)),
    ]);
  }

  Widget _readField(String value, IconData icon) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      decoration: BoxDecoration(
        color: Colors.grey.shade50,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.grey.shade200),
      ),
      child: Row(children: [
        Icon(icon, size: 16, color: Colors.grey.shade400),
        const SizedBox(width: 10),
        Expanded(child: Text(value, style: const TextStyle(fontSize: 15, color: Colors.black87))),
      ]),
    );
  }

  Widget _editField(TextEditingController ctrl, String hint, IconData icon, {bool readOnly = false}) {
    return TextField(
      controller: ctrl,
      readOnly: readOnly,
      decoration: InputDecoration(
        hintText: hint,
        hintStyle: TextStyle(color: Colors.grey.shade400),
        prefixIcon: Icon(icon, size: 18, color: Colors.blue.shade300),
        filled: true,
        fillColor: Colors.white,
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide(color: Colors.grey.shade300)),
        enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide(color: Colors.blue.shade200)),
        focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Colors.blue, width: 2)),
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      ),
    );
  }

  Color _priorityColor(String? p) {
    switch ((p ?? '').toUpperCase()) {
      case 'HIGH':  return Colors.red;
      case 'LOW':   return Colors.green;
      default:      return Colors.orange;
    }
  }

  String _priorityLabel(String? p, bool isFr) {
    switch ((p ?? '').toUpperCase()) {
      case 'HIGH':  return 'High';
      case 'LOW':   return 'Low';
      default:      return 'Medium';
    }
  }
    // ← ADD THIS
  String _formatDate(String? isoDate) {
    if (isoDate == null || isoDate.isEmpty) return '—';
    try {
      final d = DateTime.parse(isoDate);
      return '${d.day.toString().padLeft(2, '0')}/${d.month.toString().padLeft(2, '0')}/${d.year}';
    } catch (_) { return isoDate; }
  }
}