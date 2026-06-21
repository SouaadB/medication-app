import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'add_medication_page.dart';
import '../config/api_config.dart';
import '../services/language_service.dart';
import '../widgets/barcode_scan_sheet.dart';

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
        setState(() {
          _medications = (data['treatments'] as List)
              .where((t) => t['deleted_at'] == null)
              .toList();
          _isLoading   = false;
        });
      } else {
        setState(() => _isLoading = false);
      }
    } catch (e) {
      setState(() => _isLoading = false);
    }
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
    final date   = DateTime.parse(med['scheduled_date_time']);
    final hour   = date.hour.toString().padLeft(2, '0');
    final minute = date.minute.toString().padLeft(2, '0');
    return '$hour:$minute';
  }

  String _getNextDoseDay(DateTime date) {
    final now      = DateTime.now();
    final tomorrow = DateTime(now.year, now.month, now.day + 1);
    if (date.day == now.day &&
        date.month == now.month &&
        date.year == now.year) return "Today";
    if (date.day == tomorrow.day &&
        date.month == tomorrow.month &&
        date.year == tomorrow.year) return "Tomorrow";
    return '${date.day}/${date.month}';
  }

  Color _priorityColor(String? priority) {
    switch ((priority ?? '').toUpperCase()) {
      case 'HIGH': return Colors.red;
      case 'LOW':  return Colors.green;
      default:     return Colors.orange;
    }
  }

  String _priorityLabel(String? priority, bool isFr) {
    switch ((priority ?? '').toUpperCase()) {
      case 'HIGH': return isFr ? 'Haute'   : 'High';
      case 'LOW':  return isFr ? 'Basse'   : 'Low';
      default:     return isFr ? 'Moyenne' : 'Medium';
    }
  }

  String _formatDate(String? isoDate) {
    if (isoDate == null || isoDate.isEmpty) return '—';
    try {
      final d = DateTime.parse(isoDate);
      return '${d.day.toString().padLeft(2,'0')}/'
             '${d.month.toString().padLeft(2,'0')}/'
             '${d.year}';
    } catch (_) {
      return isoDate;
    }
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
            content: Text('Medication deleted successfully'),
            backgroundColor: Colors.green,
          ));
        }
      } else {
        throw Exception('Failed to delete');
      }
    } catch (_) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
          content: Text('Error has occurd in the midlle of deletion'),
          backgroundColor: Colors.red,
        ));
      }
    }
  }

  void _showDeleteConfirmation(int treatmentId, String name) {
    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: const Row(children: [
          Icon(Icons.warning_amber_rounded, color: Colors.red, size: 24),
          SizedBox(width: 8),
          Text('Delete medication'),
        ]),
        content: Text('Are you sure you want to delete $name?\n\n'
            'This will also remove all scheduled doses.'),
        actions: [
          TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('Cancel')),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              _deleteMedication(treatmentId);
            },
            style: ElevatedButton.styleFrom(
                backgroundColor: Colors.red, foregroundColor: Colors.white),
            child: const Text('Delete'),
          ),
        ],
      ),
    );
  }

  void _openMedicationDetail(Map<String, dynamic> med) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => _MedicationDetailSheet(
        medication: med,
        onUpdated: () {
          _loadMedications();
          _loadNextDose();
        },
        onDeleted: () => _deleteMedication(med['id']),
      ),
    );
  }

  // ── BUILD ────────────────────────────────────────────────────────────────────

  @override
  Widget build(BuildContext context) {
    final lang = Provider.of<LanguageService>(context);
    final isFr = lang.getCurrentLanguage() == 'fr';

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
            style: const TextStyle(
                color: Colors.blue, fontWeight: FontWeight.bold)),
        actions: [
          IconButton(
              icon: const Icon(Icons.more_vert, color: Colors.blue),
              onPressed: () {}),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : Column(children: [

              // adherence card
              Container(
                margin: const EdgeInsets.fromLTRB(20, 20, 20, 0),
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(24),
                  boxShadow: [
                    BoxShadow(
                        color: Colors.black.withOpacity(0.05),
                        blurRadius: 20,
                        offset: const Offset(0, 10))
                  ],
                ),
                child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                  Column(crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                    Text(
                        isFr
                            ? "Taux d'observance"
                            : 'Adherence Rate',
                        style: TextStyle(
                            fontSize: 14, color: Colors.grey.shade600)),
                    const SizedBox(height: 4),
                    Text('${widget.condition['percentage']}%',
                        style: const TextStyle(
                            fontSize: 32,
                            fontWeight: FontWeight.bold,
                            color: Colors.blue)),
                  ]),
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                        color: Colors.blue.withOpacity(0.1),
                        shape: BoxShape.circle),
                    child: const Icon(Icons.medical_services,
                        color: Colors.blue, size: 32),
                  ),
                ]),
              ),

              // section title
              Padding(
                padding: const EdgeInsets.fromLTRB(20, 24, 20, 8),
                child: Row(children: [
                  Text(
                      isFr ? 'Médicaments' : 'Medications',
                      style: const TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFF1A237E))),
                  const Spacer(),
                  if (_medications.isNotEmpty)
                    Text('${_medications.length} total',
                        style: TextStyle(
                            fontSize: 13, color: Colors.grey.shade500)),
                ]),
              ),

              if (_medications.isNotEmpty)
                Padding(
                  padding: const EdgeInsets.fromLTRB(20, 0, 20, 8),
                  child: Row(children: [
                    Icon(Icons.touch_app_outlined,
                        size: 14, color: Colors.grey.shade400),
                    const SizedBox(width: 4),
                    Text(
                        isFr
                            ? 'Appuyez sur un médicament pour voir les détails'
                            : 'Tap a medication to see details',
                        style: TextStyle(
                            fontSize: 12, color: Colors.grey.shade400)),
                  ]),
                ),

              // list
              Expanded(
                child: _medications.isEmpty
                    ? Center(
                        child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                          Icon(Icons.medication_outlined,
                              size: 80, color: Colors.grey.shade300),
                          const SizedBox(height: 16),
                          Text(
                              isFr
                                  ? 'Aucun médicament pour cette condition'
                                  : 'No medications for this condition',
                              style:
                                  TextStyle(color: Colors.grey.shade600)),
                        ]))
                    : ListView.builder(
                        padding:
                            const EdgeInsets.fromLTRB(20, 0, 20, 20),
                        itemCount: _medications.length,
                        itemBuilder: (context, index) {
                          final med = _medications[index];
                          final isNextDose = _nextDose != null &&
                              _nextDose!['medication_name'] ==
                                  med['medication_name'];
                          return _buildMedicationCard(
                              med, isNextDose, isFr);
                        },
                      ),
              ),

              // add button
              Padding(
                padding: const EdgeInsets.all(20),
                child: SizedBox(
                  width: double.infinity,
                  height: 55,
                  child: ElevatedButton.icon(
                    onPressed: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (_) => AddMedicationPage(
                            conditionId: widget.condition['id'],
                            conditionName: widget.condition['name'],
                          ),
                        ),
                      ).then((_) => _loadMedications());
                    },
                    icon: const Icon(Icons.add),
                    label: Text(
                        isFr
                            ? 'Ajouter un médicament'
                            : 'Add medication',
                        style: const TextStyle(
                            fontSize: 16, fontWeight: FontWeight.bold)),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.blue,
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(30)),
                      elevation: 0,
                    ),
                  ),
                ),
              ),
            ]),
    );
  }

  // ── medication card ──────────────────────────────────────────────────────────

  Widget _buildMedicationCard(
      Map<String, dynamic> med, bool isNextDose, bool isFr) {
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
          boxShadow: [
            BoxShadow(
                color: Colors.black.withOpacity(0.05),
                blurRadius: 10,
                offset: const Offset(0, 5))
          ],
        ),
        child: Column(children: [

          // priority stripe
          Container(
            height: 4,
            decoration: BoxDecoration(
              color: priorityColor,
              borderRadius:
                  const BorderRadius.vertical(top: Radius.circular(20)),
            ),
          ),

          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [

              // name + badges + delete
              Row(children: [
                Expanded(
                  child: Text(
                    med['medication_name'],
                    style: const TextStyle(
                        fontSize: 17,
                        fontWeight: FontWeight.bold,
                        color: Color(0xFF1A237E)),
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(
                      horizontal: 8, vertical: 3),
                  decoration: BoxDecoration(
                    color: priorityColor.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Text(_priorityLabel(priority, isFr),
                      style: TextStyle(
                          fontSize: 11,
                          color: priorityColor,
                          fontWeight: FontWeight.w600)),
                ),
                const SizedBox(width: 6),
                if (hasBarcode)
                  Container(
                    padding: const EdgeInsets.symmetric(
                        horizontal: 6, vertical: 3),
                    decoration: BoxDecoration(
                      color: Colors.green.shade50,
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: Colors.green.shade200),
                    ),
                    child: Row(mainAxisSize: MainAxisSize.min, children: [
                      Icon(Icons.qr_code,
                          size: 11, color: Colors.green.shade600),
                      const SizedBox(width: 3),
                      Text('scan',
                          style: TextStyle(
                              fontSize: 10,
                              color: Colors.green.shade600)),
                    ]),
                  ),
                const SizedBox(width: 4),
                GestureDetector(
                  onTap: () => _showDeleteConfirmation(
                      med['id'], med['medication_name']),
                  child: Container(
                    padding: const EdgeInsets.all(6),
                    decoration: BoxDecoration(
                        color: Colors.red.shade50,
                        borderRadius: BorderRadius.circular(8)),
                    child: Icon(Icons.delete_outline,
                        color: Colors.red.shade400, size: 18),
                  ),
                ),
              ]),
              const SizedBox(height: 10),

              // dosage + frequency chips
              Wrap(spacing: 8, children: [
                if (med['dosage'] != null &&
                    med['dosage'].toString().isNotEmpty)
                  _chip(Icons.science_outlined,
                      med['dosage'].toString(), Colors.blue),
                _chip(
                  Icons.access_time,
                  med['frequency'].toString().split(' + ').first,
                  Colors.purple,
                ),
              ]),
              const SizedBox(height: 12),

              // dates + status
              Row(children: [
                Icon(Icons.calendar_today_outlined,
                    size: 13, color: Colors.grey.shade400),
                const SizedBox(width: 4),
                Text(_formatDate(med['start_date']),
                    style: TextStyle(
                        fontSize: 12, color: Colors.grey.shade500)),
                if (med['end_date'] != null) ...[
                  Text('  →  ',
                      style: TextStyle(
                          fontSize: 12, color: Colors.grey.shade400)),
                  Text(_formatDate(med['end_date']),
                      style: TextStyle(
                          fontSize: 12, color: Colors.grey.shade500)),
                ],
                const Spacer(),
                Container(
                  padding: const EdgeInsets.symmetric(
                      horizontal: 8, vertical: 3),
                  decoration: BoxDecoration(
                    color: (med['is_active'] == true ||
                            med['is_active'] == 1)
                        ? Colors.green.shade50
                        : Colors.grey.shade100,
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Text(
                    (med['is_active'] == true || med['is_active'] == 1)
                        ? (isFr ? 'Actif' : 'Active')
                        : (isFr ? 'Inactif' : 'Inactive'),
                    style: TextStyle(
                      fontSize: 11,
                      color: (med['is_active'] == true ||
                              med['is_active'] == 1)
                          ? Colors.green.shade600
                          : Colors.grey.shade500,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ]),

              // next dose
              if (isNextDose && _nextDose != null) ...[
                const SizedBox(height: 10),
                Container(
                  padding: const EdgeInsets.symmetric(
                      horizontal: 12, vertical: 8),
                  decoration: BoxDecoration(
                    color: Colors.blue.shade50,
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Row(children: [
                    const Icon(Icons.notifications_active_outlined,
                        size: 15, color: Colors.blue),
                    const SizedBox(width: 6),
                    Text(
                      '${isFr ? 'Prochaine dose' : 'Next dose'}: '
                      '${_formatNextDoseText(_nextDose!)} '
                      '(${_getNextDoseDay(DateTime.parse(_nextDose!['scheduled_date_time']))})',
                      style: const TextStyle(
                          fontSize: 13,
                          color: Colors.blue,
                          fontWeight: FontWeight.w500),
                    ),
                  ]),
                ),
              ],

              const SizedBox(height: 8),
              Row(mainAxisAlignment: MainAxisAlignment.end, children: [
                Text(isFr ? 'Appuyer pour modifier' : 'Tap to edit',
                    style: TextStyle(
                        fontSize: 11, color: Colors.grey.shade400)),
                const SizedBox(width: 3),
                Icon(Icons.edit_outlined,
                    size: 12, color: Colors.grey.shade400),
              ]),
            ]),
          ),
        ]),
      ),
    );
  }

  Widget _chip(IconData icon, String label, Color color) {
    return Container(
      padding:
          const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
      decoration: BoxDecoration(
          color: color.withOpacity(0.08),
          borderRadius: BorderRadius.circular(20)),
      child: Row(mainAxisSize: MainAxisSize.min, children: [
        Icon(icon, size: 13, color: color),
        const SizedBox(width: 4),
        Text(label,
            style: TextStyle(
                fontSize: 12,
                color: color,
                fontWeight: FontWeight.w500)),
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
  State<_MedicationDetailSheet> createState() =>
      _MedicationDetailSheetState();
}

class _MedicationDetailSheetState extends State<_MedicationDetailSheet> {

  bool _isEditing  = false;
  bool _isSaving   = false;
  String? _editedBarcodeData;
  bool _barcodeUpdated = false;

  late TextEditingController _nameCtrl;
  late TextEditingController _dosageCtrl;
  late TextEditingController _startCtrl;
  late TextEditingController _endCtrl;

  late String _priority;
  late bool   _isActive;
  late String _frequency;

  String?      _mainFrequency;
  List<String> _mealAnchors = [];

  // ─────────────────────────────────────────────────────────────────────────
  // FIX: 'Empty stomach' added to the edit sheet frequency lists too.
  // ─────────────────────────────────────────────────────────────────────────

  final List<String> _frequenciesEn = const [
    'Once daily',
    'Twice daily',
    'Three times daily',
    'Every 4 hours',
    'Every 6 hours',
    'Every 8 hours',
    'Every 12 hours',
    'As needed',
  ];

  final List<String> _mealAnchorsEn = const [
    'Before breakfast',
    'During breakfast',
    'After breakfast',
    'Before lunch',
    'During lunch',
    'After lunch',
    'Before dinner',
    'During dinner',
    'After dinner',
    'Before sleeping',
    'Empty stomach',
  ];

  @override
  void initState() {
    super.initState();
    final med   = widget.medication;
    _nameCtrl   = TextEditingController(text: med['medication_name'] ?? '');
    _dosageCtrl = TextEditingController(text: med['dosage'] ?? '');
    _startCtrl  = TextEditingController(text: _isoToDisplay(med['start_date']));
    _endCtrl    = TextEditingController(text: _isoToDisplay(med['end_date']));
    _priority   = (med['priority'] ?? 'MEDIUM').toString().toUpperCase();
    _isActive   = med['is_active'] == true || med['is_active'] == 1;
    _frequency  = med['frequency'] ?? 'Once daily';
    _parseFrequency(_frequency);
    _editedBarcodeData = med['barcode_data']?.toString();
  }

  @override
  void dispose() {
    _nameCtrl.dispose();
    _dosageCtrl.dispose();
    _startCtrl.dispose();
    _endCtrl.dispose();
    super.dispose();
  }

  // ─────────────────────────────────────────────────────────────────────────
  // FREQUENCY PARSING
  // FIX: _parseFrequency now recognises 'Empty stomach' as a valid anchor.
  // ─────────────────────────────────────────────────────────────────────────

  void _parseFrequency(String freq) {
    final parts = freq.split(' + ');
    if (parts.isEmpty) return;
    _mainFrequency = _frequenciesEn.contains(parts.first)
        ? parts.first
        : _frequenciesEn.first;
    _mealAnchors = parts
        .skip(1)
        .where((p) => _mealAnchorsEn.contains(p))
        .toList();
  }

  String _buildFrequency() {
    final parts = <String>[];
    if (_mainFrequency != null) parts.add(_mainFrequency!);
    parts.addAll(_mealAnchors);
    return parts.isEmpty ? 'Once daily' : parts.join(' + ');
  }

  // ─────────────────────────────────────────────────────────────────────────
  // DATE HELPERS
  // ─────────────────────────────────────────────────────────────────────────

  String _isoToDisplay(String? iso) {
    if (iso == null || iso.isEmpty) return '';
    try {
      final d = DateTime.parse(iso);
      return '${d.day.toString().padLeft(2,'0')}/'
             '${d.month.toString().padLeft(2,'0')}/'
             '${d.year}';
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
        initial = DateTime(
            int.parse(p[2]), int.parse(p[1]), int.parse(p[0]));
      } catch (_) {}
    }
    final picked = await showDatePicker(
      context: context,
      initialDate: initial,
      firstDate: DateTime(2000),
      lastDate: DateTime(2100),
      builder: (ctx, child) => Theme(
        data: Theme.of(ctx).copyWith(
            colorScheme:
                const ColorScheme.light(primary: Colors.blue)),
        child: child!,
      ),
    );
    if (picked != null) {
      setState(() {
        ctrl.text =
            '${picked.day.toString().padLeft(2,'0')}/'
            '${picked.month.toString().padLeft(2,'0')}/'
            '${picked.year}';
      });
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // SAVE
  // ─────────────────────────────────────────────────────────────────────────

  Future<void> _save() async {
    // Validate meal anchor for daily frequencies
    final needsAnchor = _mainFrequency == 'Once daily' ||
                        _mainFrequency == 'Twice daily' ||
                        _mainFrequency == 'Three times daily';
    if (needsAnchor && _mealAnchors.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(
        content: const Text(
            'Please select when to take this medication (e.g. After breakfast)'),
        backgroundColor: Colors.orange,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
      ));
      return;
    }

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

      if (_barcodeUpdated) {
        body['barcode_data'] = _editedBarcodeData;
      }
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
          setState(() {
            _isEditing = false;
            _isSaving  = false;
          });
          ScaffoldMessenger.of(context).showSnackBar(SnackBar(
            content: const Row(children: [
              Icon(Icons.check_circle, color: Colors.white),
              SizedBox(width: 10),
              Text('Medication updated successfully'),
            ]),
            backgroundColor: Colors.green,
            behavior: SnackBarBehavior.floating,
            shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(10)),
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

  // ─────────────────────────────────────────────────────────────────────────
  // ANCHOR HELPERS
  // ─────────────────────────────────────────────────────────────────────────

  String? _mealGroupOf(String enAnchor) {
    if (enAnchor.contains('breakfast')) return 'breakfast';
    if (enAnchor.contains('lunch'))     return 'lunch';
    if (enAnchor.contains('dinner'))    return 'dinner';
    return null;
  }

  bool _isExclusiveAnchor(String enAnchor) =>
      enAnchor == 'Empty stomach';

  bool _isAnchorDisabled(String enAnchor, List<String> enSelected, int maxAnchors) {
    if (enSelected.contains(enAnchor)) return false;
    if (enSelected.any(_isExclusiveAnchor)) return true;
    if (_isExclusiveAnchor(enAnchor) && enSelected.isNotEmpty) return true;
    if (enSelected.length >= maxAnchors) return true;
    final group = _mealGroupOf(enAnchor);
    if (group != null && enSelected.any((a) => _mealGroupOf(a) == group)) return true;
    return false;
  }

  bool _isFreqDisabled(String freq, List<String> enSelected) {
    if (!enSelected.any(_isExclusiveAnchor)) return false;
    return freq != 'Once daily';
  }

  int _maxFor(String? freq) {
    if (freq == 'Once daily')        return 1;
    if (freq == 'Twice daily')       return 2;
    if (freq == 'Three times daily') return 3;
    return 0;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // FREQUENCY SELECTOR (edit sheet)
  // ─────────────────────────────────────────────────────────────────────────

  void _showFrequencySelector() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(top: Radius.circular(25))),
      builder: (_) => StatefulBuilder(builder: (ctx, setModal) {
        final isInterval = _mainFrequency != null &&
            (_mainFrequency!.contains('Every') || _mainFrequency == 'As needed');
        final maxAnchors = _maxFor(_mainFrequency);
        final enSelected = _mealAnchors.toList(); // already EN in condition_detail

        return Container(
          height: MediaQuery.of(context).size.height * 0.85,
          padding: const EdgeInsets.symmetric(horizontal: 20),
          child: Column(children: [
            const SizedBox(height: 12),
            Container(width: 40, height: 4, decoration: BoxDecoration(color: Colors.grey.shade300, borderRadius: BorderRadius.circular(2))),
            const SizedBox(height: 16),
            const Text('Select Frequency', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
            const Divider(),
            Expanded(
              child: ListView(children: [

                // ── Base frequency ──────────────────────────────────────
                const Padding(
                  padding: EdgeInsets.symmetric(vertical: 8, horizontal: 4),
                  child: Text('Frequency', style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: Colors.blue)),
                ),
                ..._frequenciesEn.map((f) {
                  final disabled = _isFreqDisabled(f, enSelected);
                  return RadioListTile<String>(
                    title: Text(f, style: TextStyle(color: disabled ? Colors.grey.shade400 : Colors.black)),
                    value: f,
                    groupValue: disabled ? null : _mainFrequency,
                    activeColor: Colors.blue,
                    onChanged: disabled ? null : (val) {
                      if (val == null) return;
                      setModal(() {
                        _mainFrequency = val;
                        if (val.contains('Every') || val == 'As needed') {
                          _mealAnchors = [];
                        } else {
                          final nm = _maxFor(val);
                          if (_mealAnchors.length > nm) _mealAnchors = _mealAnchors.sublist(0, nm);
                        }
                      });
                      setState(() {});
                    },
                  );
                }),

                // ── Meal anchors ────────────────────────────────────────
                const SizedBox(height: 12),
                const Padding(
                  padding: EdgeInsets.symmetric(vertical: 8, horizontal: 4),
                  child: Text('Timing (Meals)', style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: Colors.blue)),
                ),
                if (isInterval)
                  Padding(
                    padding: const EdgeInsets.all(12),
                    child: Text('Not available for this frequency', style: TextStyle(color: Colors.grey.shade500, fontStyle: FontStyle.italic)))
                else
                  ..._mealAnchorsEn.map((a) {
                    final isSel     = _mealAnchors.contains(a);
                    final disabled  = _isAnchorDisabled(a, enSelected, maxAnchors);
                    final group     = _mealGroupOf(a);
                    final exclusive = _isExclusiveAnchor(a);

                    String? subtitle;
                    if (exclusive) {
                      subtitle = 'Cannot be combined with other timings';
                    } else if (!isSel && group != null && enSelected.any((s) => _mealGroupOf(s) == group)) {
                      subtitle = 'This meal is already covered';
                    }

                    return CheckboxListTile(
                      title: Row(children: [
                        Expanded(child: Text(a, style: TextStyle(color: disabled ? Colors.grey.shade400 : Colors.black))),
                        if (exclusive)
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                            decoration: BoxDecoration(color: Colors.teal.shade50, borderRadius: BorderRadius.circular(8), border: Border.all(color: Colors.teal.shade200)),
                            child: Text('Exclusive', style: TextStyle(fontSize: 10, color: Colors.teal.shade700)),
                          ),
                      ]),
                      subtitle: subtitle != null ? Text(subtitle, style: TextStyle(fontSize: 11, color: Colors.grey.shade500)) : null,
                      value: isSel,
                      activeColor: Colors.blue,
                      onChanged: disabled ? null : (val) {
                        setModal(() {
                          if (val == true) {
                            if (exclusive) {
                              // Exclusive: clear all, force once daily
                              _mealAnchors   = [a];
                              _mainFrequency = 'Once daily';
                            } else {
                              _mealAnchors.add(a);
                            }
                          } else {
                            _mealAnchors.remove(a);
                          }
                        });
                        setState(() {});
                      },
                    );
                  }),
              ]),
            ),
            Padding(
              padding: const EdgeInsets.symmetric(vertical: 16),
              child: SizedBox(
                width: double.infinity, height: 50,
                child: ElevatedButton(
                  onPressed: () => Navigator.pop(ctx),
                  style: ElevatedButton.styleFrom(backgroundColor: Colors.blue, foregroundColor: Colors.white, shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12))),
                  child: const Text('Confirm', style: TextStyle(fontWeight: FontWeight.bold)),
                ),
              ),
            ),
          ]),
        );
      }),
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // BUILD
  // ─────────────────────────────────────────────────────────────────────────

  @override
  Widget build(BuildContext context) {
    final med = widget.medication;
    final sh  = MediaQuery.of(context).size.height;

    return Container(
      height: sh * 0.90,
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
      ),
      child: Column(children: [

        // drag handle
        const SizedBox(height: 12),
        Container(
            width: 40,
            height: 4,
            decoration: BoxDecoration(
                color: Colors.grey.shade300,
                borderRadius: BorderRadius.circular(2))),
        const SizedBox(height: 16),

        // header
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20),
          child: Row(children: [
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                  color: Colors.blue.shade50,
                  borderRadius: BorderRadius.circular(12)),
              child: const Icon(Icons.medication,
                  color: Colors.blue, size: 26),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                Text(
                    _isEditing
                        ? 'Edit Medication'
                        : 'Medication Details',
                    style: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: Color(0xFF1A237E))),
                Text(
                    _isEditing
                        ? 'Make your changes below'
                        : 'Tap Edit to modify',
                    style: TextStyle(
                        fontSize: 12, color: Colors.grey.shade500)),
              ]),
            ),
            TextButton.icon(
              onPressed: () => setState(() {
                _isEditing = !_isEditing;
                if (!_isEditing) {
                  _parseFrequency(
                      widget.medication['frequency'] ?? 'Once daily');
                }
              }),
              icon: Icon(_isEditing ? Icons.close : Icons.edit_outlined,
                  size: 18),
              label: Text(_isEditing ? 'Cancel' : 'Edit'),
              style: TextButton.styleFrom(
                foregroundColor:
                    _isEditing ? Colors.grey : Colors.blue,
                backgroundColor: _isEditing
                    ? Colors.grey.shade100
                    : Colors.blue.shade50,
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(20)),
                padding: const EdgeInsets.symmetric(
                    horizontal: 14, vertical: 8),
              ),
            ),
          ]),
        ),
        const SizedBox(height: 4),
        Divider(color: Colors.grey.shade100),

        // scrollable content
        Expanded(
          child: SingleChildScrollView(
            padding: const EdgeInsets.fromLTRB(20, 8, 20, 20),
            child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [

              // name
              _sectionLabel(Icons.medication_outlined, 'Medication Name'),
              const SizedBox(height: 8),
              _isEditing
                  ? _editField(_nameCtrl, 'Medication name',
                      Icons.medication_outlined)
                  : _readField(med['medication_name'] ?? '—',
                      Icons.medication_outlined),
              const SizedBox(height: 18),

              // dosage
              _sectionLabel(Icons.science_outlined, 'Dosage'),
              const SizedBox(height: 8),
              _isEditing
                  ? _editField(_dosageCtrl, 'e.g. 500mg, 1g',
                      Icons.science_outlined)
                  : _readField(med['dosage'] ?? '—',
                      Icons.science_outlined),
              const SizedBox(height: 18),

              // frequency
              _sectionLabel(Icons.access_time, 'Frequency'),
              const SizedBox(height: 8),
              _isEditing
                  ? Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        GestureDetector(
                          onTap: _showFrequencySelector,
                          child: Container(
                            padding: const EdgeInsets.symmetric(
                                horizontal: 16, vertical: 14),
                            decoration: BoxDecoration(
                              border: Border.all(
                                color: _mainFrequency == 'As needed'
                                    ? Colors.orange.shade300
                                    : Colors.blue.shade200,
                                width: 1.5,
                              ),
                              borderRadius: BorderRadius.circular(12),
                              color: _mainFrequency == 'As needed'
                                  ? Colors.orange.shade50
                                  : Colors.blue.shade50,
                            ),
                            child: Row(children: [
                              Icon(Icons.access_time,
                                  color: _mainFrequency == 'As needed'
                                      ? Colors.orange.shade400
                                      : Colors.blue.shade400,
                                  size: 18),
                              const SizedBox(width: 10),
                              Expanded(
                                  child: Text(_buildFrequency(),
                                      style: TextStyle(
                                          fontSize: 15,
                                          color: _mainFrequency == 'As needed'
                                              ? Colors.orange.shade700
                                              : Colors.blue.shade700))),
                              Icon(Icons.arrow_drop_down,
                                  color: _mainFrequency == 'As needed'
                                      ? Colors.orange.shade400
                                      : Colors.blue.shade400),
                            ]),
                          ),
                        ),
                        if (_mainFrequency == 'As needed') ...[
                          const SizedBox(height: 8),
                          Container(
                            padding: const EdgeInsets.all(12),
                            decoration: BoxDecoration(
                              color: Colors.orange.shade50,
                              borderRadius: BorderRadius.circular(10),
                              border: Border.all(
                                  color: Colors.orange.shade200),
                            ),
                            child: Row(
                              crossAxisAlignment:
                                  CrossAxisAlignment.start,
                              children: [
                                Icon(Icons.info_outline,
                                    color: Colors.orange.shade700,
                                    size: 18),
                                const SizedBox(width: 10),
                                Expanded(
                                  child: Text(
                                    'No reminders will be sent. This medication will not appear in the daily schedule. Take it only when needed.',
                                    style: TextStyle(
                                      fontSize: 12,
                                      color: Colors.orange.shade800,
                                      height: 1.4,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ],
                    )
                  : _readField(med['frequency'] ?? '—',
                      Icons.access_time),
              const SizedBox(height: 18),

              // priority
              _sectionLabel(Icons.priority_high, 'Priority'),
              const SizedBox(height: 8),
              _isEditing
                  ? Container(
                      padding: const EdgeInsets.all(4),
                      decoration: BoxDecoration(
                          color: Colors.grey.shade100,
                          borderRadius: BorderRadius.circular(12)),
                      child: Row(
                        children:
                            ['LOW', 'MEDIUM', 'HIGH'].map((level) {
                          final isSel  = _priority == level;
                          final color  = level == 'LOW'
                              ? Colors.green
                              : level == 'HIGH'
                                  ? Colors.red
                                  : Colors.orange;
                          final labels = {
                            'LOW': 'Low',
                            'MEDIUM': 'Medium',
                            'HIGH': 'High'
                          };
                          return Expanded(
                            child: GestureDetector(
                              onTap: () =>
                                  setState(() => _priority = level),
                              child: Container(
                                padding: const EdgeInsets.symmetric(
                                    vertical: 12),
                                decoration: BoxDecoration(
                                  color: isSel
                                      ? color
                                      : Colors.transparent,
                                  borderRadius:
                                      BorderRadius.circular(10),
                                  boxShadow: isSel
                                      ? [
                                          BoxShadow(
                                              color: color
                                                  .withOpacity(0.3),
                                              blurRadius: 4,
                                              offset:
                                                  const Offset(0, 2))
                                        ]
                                      : null,
                                ),
                                child: Text(labels[level]!,
                                    textAlign: TextAlign.center,
                                    style: TextStyle(
                                        color: isSel
                                            ? Colors.white
                                            : Colors.grey.shade600,
                                        fontWeight: isSel
                                            ? FontWeight.bold
                                            : FontWeight.normal)),
                              ),
                            ),
                          );
                        }).toList(),
                      ),
                    )
                  : Row(children: [
                      Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 14, vertical: 8),
                        decoration: BoxDecoration(
                          color: _priorityColor(_priority)
                              .withOpacity(0.1),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Row(mainAxisSize: MainAxisSize.min,
                            children: [
                          Icon(Icons.circle,
                              size: 10,
                              color: _priorityColor(_priority)),
                          const SizedBox(width: 6),
                          Text(_priorityLabel(_priority, false),
                              style: TextStyle(
                                  color: _priorityColor(_priority),
                                  fontWeight: FontWeight.w600)),
                        ]),
                      ),
                    ]),
              const SizedBox(height: 18),

              // status
              _sectionLabel(Icons.toggle_on_outlined, 'Status'),
              const SizedBox(height: 8),
              Container(
                padding: const EdgeInsets.symmetric(
                    horizontal: 16, vertical: 4),
                decoration: BoxDecoration(
                  border: Border.all(color: Colors.grey.shade200),
                  borderRadius: BorderRadius.circular(12),
                  color: Colors.white,
                ),
                child: Row(children: [
                  Icon(
                    _isActive
                        ? Icons.check_circle_outline
                        : Icons.pause_circle_outline,
                    color: _isActive ? Colors.green : Colors.grey,
                    size: 20,
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Text(
                      _isActive
                          ? 'Active — currently taking'
                          : 'Inactive — paused',
                      style: TextStyle(
                          fontSize: 15,
                          color: _isActive
                              ? Colors.green.shade700
                              : Colors.grey.shade600),
                    ),
                  ),
                  if (_isEditing)
                    Switch(
                      value: _isActive,
                      onChanged: (v) =>
                          setState(() => _isActive = v),
                      activeColor: Colors.green,
                    ),
                ]),
              ),
              const SizedBox(height: 18),

              // dates
              Row(children: [
                Expanded(
                  child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                    _sectionLabel(
                        Icons.calendar_today_outlined, 'Start Date'),
                    const SizedBox(height: 8),
                    _isEditing
                        ? _editField(_startCtrl,
                            'dd/mm/yyyy',
                            Icons.calendar_today_outlined,
                            readOnly: true,
                            onTap: () => _pickDate(_startCtrl))
                        : _readField(
                            _startCtrl.text.isNotEmpty
                                ? _startCtrl.text
                                : '—',
                            Icons.calendar_today_outlined),
                  ]),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                    _sectionLabel(
                        Icons.calendar_month_outlined, 'End Date'),
                    const SizedBox(height: 8),
                    _isEditing
                        ? _editField(_endCtrl,
                            'dd/mm/yyyy (optional)',
                            Icons.calendar_month_outlined,
                            readOnly: true,
                            onTap: () => _pickDate(_endCtrl))
                        : _readField(
                            _endCtrl.text.isNotEmpty
                                ? _endCtrl.text
                                : '—',
                            Icons.calendar_month_outlined),
                  ]),
                ),
              ]),
              const SizedBox(height: 18),

              // barcode
              _sectionLabel(Icons.qr_code, 'Barcode'),
              const SizedBox(height: 8),
              if (!_isEditing) ...[
                if (med['barcode_data'] != null)
                  Container(
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: Colors.green.shade50,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(
                          color: Colors.green.shade200),
                    ),
                    child: Row(children: [
                      Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                            color: Colors.green.shade100,
                            borderRadius:
                                BorderRadius.circular(8)),
                        child: const Icon(Icons.qr_code,
                            color: Colors.green, size: 22),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                          child: Column(
                              crossAxisAlignment:
                                  CrossAxisAlignment.start,
                              children: [
                        const Text('Barcode on file',
                            style: TextStyle(
                                fontWeight: FontWeight.bold,
                                color: Colors.green)),
                        const SizedBox(height: 2),
                        Text(
                          med['barcode_data'] is Map
                              ? (med['barcode_data']['barcode'] ??
                                      '')
                                  .toString()
                              : med['barcode_data'].toString(),
                          style: TextStyle(
                              fontSize: 12,
                              color: Colors.grey.shade700,
                              fontFamily: 'monospace'),
                        ),
                      ])),
                    ]),
                  )
                else
                  Container(
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: Colors.grey.shade50,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(
                          color: Colors.grey.shade200),
                    ),
                    child: Row(children: [
                      Icon(Icons.qr_code_outlined,
                          color: Colors.grey.shade400, size: 20),
                      const SizedBox(width: 10),
                      Text('No barcode saved',
                          style: TextStyle(
                              color: Colors.grey.shade500,
                              fontSize: 14)),
                    ]),
                  ),
              ] else ...[
                if (_editedBarcodeData != null)
                  Container(
                    margin: const EdgeInsets.only(bottom: 10),
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: Colors.green.shade50,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(
                          color: Colors.green.shade200),
                    ),
                    child: Row(children: [
                      Icon(Icons.check_circle,
                          color: Colors.green.shade600, size: 18),
                      const SizedBox(width: 8),
                      Expanded(
                          child: Text(
                        _editedBarcodeData!.length > 40
                            ? '${_editedBarcodeData!.substring(0, 40)}...'
                            : _editedBarcodeData!,
                        style: TextStyle(
                            fontSize: 12,
                            color: Colors.grey.shade700,
                            fontFamily: 'monospace'),
                      )),
                      GestureDetector(
                        onTap: () => setState(() {
                          _editedBarcodeData = null;
                          _barcodeUpdated    = true;
                        }),
                        child: Icon(Icons.close,
                            size: 16, color: Colors.red.shade400),
                      ),
                    ]),
                  ),
                GestureDetector(
                  onTap: () async {
                    final result = await BarcodeScanSheet.show(
                      context,
                      medicationName: _nameCtrl.text,
                    );
                    if (result != null && mounted) {
                      setState(() {
                        _editedBarcodeData =
                            '{"barcode":"${result.rawValue}",'
                            '"format":"${result.format?.toString() ?? 'unknown'}",'
                            '"raw":"${result.rawValue}",'
                            '"displayValue":"${result.rawValue}"}';
                        _barcodeUpdated = true;
                      });
                      ScaffoldMessenger.of(context)
                          .showSnackBar(SnackBar(
                        content: const Row(children: [
                          Icon(Icons.check_circle,
                              color: Colors.white),
                          SizedBox(width: 8),
                          Text('Barcode scanned successfully'),
                        ]),
                        backgroundColor: Colors.green,
                        behavior: SnackBarBehavior.floating,
                        shape: RoundedRectangleBorder(
                            borderRadius:
                                BorderRadius.circular(10)),
                      ));
                    }
                  },
                  child: Container(
                    padding:
                        const EdgeInsets.symmetric(vertical: 12),
                    decoration: BoxDecoration(
                      color: Colors.blue.shade50,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(
                          color: Colors.blue.shade200),
                    ),
                    child: Row(
                        mainAxisAlignment:
                            MainAxisAlignment.center,
                        children: [
                      Icon(Icons.qr_code_scanner,
                          color: Colors.blue.shade600, size: 20),
                      const SizedBox(width: 8),
                      Text(
                        _editedBarcodeData != null
                            ? 'Rescan Barcode'
                            : 'Scan Barcode',
                        style: TextStyle(
                            color: Colors.blue.shade700,
                            fontWeight: FontWeight.w600,
                            fontSize: 14),
                      ),
                    ]),
                  ),
                ),
              ],
              const SizedBox(height: 18),

              // added on
              _sectionLabel(Icons.history, 'Added on'),
              const SizedBox(height: 8),
              _readField(_formatDate(med['created_at']),
                  Icons.history),
              const SizedBox(height: 30),

              // delete button
              SizedBox(
                width: double.infinity,
                height: 50,
                child: OutlinedButton.icon(
                  onPressed: () {
                    showDialog(
                      context: context,
                      builder: (_) => AlertDialog(
                        shape: RoundedRectangleBorder(
                            borderRadius:
                                BorderRadius.circular(16)),
                        title: const Row(children: [
                          Icon(Icons.warning_amber_rounded,
                              color: Colors.red, size: 24),
                          SizedBox(width: 8),
                          Text('Delete Medication',
                              style: TextStyle(fontSize: 18)),
                        ]),
                        content: Text(
                          'Are you sure you want to delete '
                          '"${widget.medication['medication_name']}"?\n\n'
                          'This will also remove all scheduled doses.',
                          style: const TextStyle(fontSize: 15),
                        ),
                        actions: [
                          TextButton(
                            onPressed: () =>
                                Navigator.pop(context),
                            child: const Text('Cancel',
                                style: TextStyle(
                                    color: Colors.grey,
                                    fontSize: 15)),
                          ),
                          ElevatedButton(
                            onPressed: () {
                              Navigator.pop(context);
                              Navigator.pop(context);
                              widget.onDeleted();
                            },
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.red,
                              foregroundColor: Colors.white,
                              shape: RoundedRectangleBorder(
                                  borderRadius:
                                      BorderRadius.circular(10)),
                            ),
                            child: const Text('Delete',
                                style: TextStyle(
                                    fontSize: 15,
                                    fontWeight:
                                        FontWeight.bold)),
                          ),
                        ],
                      ),
                    );
                  },
                  icon: const Icon(Icons.delete_outline,
                      color: Colors.red),
                  label: const Text('Delete Medication',
                      style: TextStyle(
                          color: Colors.red,
                          fontWeight: FontWeight.w600)),
                  style: OutlinedButton.styleFrom(
                    side: const BorderSide(color: Colors.red),
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12)),
                  ),
                ),
              ),
              const SizedBox(height: 12),
            ]),
          ),
        ),

        // save button (edit mode only)
        if (_isEditing)
          Container(
            padding: const EdgeInsets.fromLTRB(20, 8, 20, 20),
            decoration: BoxDecoration(
              color: Colors.white,
              boxShadow: [
                BoxShadow(
                    color: Colors.black.withOpacity(0.06),
                    blurRadius: 8,
                    offset: const Offset(0, -4))
              ],
            ),
            child: SizedBox(
              width: double.infinity,
              height: 54,
              child: ElevatedButton.icon(
                onPressed: _isSaving ? null : _save,
                icon: _isSaving
                    ? const SizedBox(
                        width: 18,
                        height: 18,
                        child: CircularProgressIndicator(
                            strokeWidth: 2, color: Colors.white))
                    : const Icon(Icons.save_outlined),
                label: Text(_isSaving ? 'Saving…' : 'Save Changes',
                    style: const TextStyle(
                        fontSize: 16, fontWeight: FontWeight.bold)),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.blue,
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(14)),
                  elevation: 0,
                ),
              ),
            ),
          ),
        if (!_isEditing)
          SizedBox(height: MediaQuery.of(context).padding.bottom + 8),
      ]),
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // UI HELPERS
  // ─────────────────────────────────────────────────────────────────────────

  Widget _sectionLabel(IconData icon, String label) {
    return Row(children: [
      Icon(icon, size: 15, color: Colors.blue.shade400),
      const SizedBox(width: 6),
      Text(label,
          style: TextStyle(
              fontSize: 13,
              fontWeight: FontWeight.w600,
              color: Colors.grey.shade600,
              letterSpacing: 0.3)),
    ]);
  }

  Widget _readField(String value, IconData icon) {
    return Container(
      width: double.infinity,
      padding:
          const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      decoration: BoxDecoration(
        color: Colors.grey.shade50,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.grey.shade200),
      ),
      child: Row(children: [
        Icon(icon, size: 16, color: Colors.grey.shade400),
        const SizedBox(width: 10),
        Expanded(
            child: Text(value,
                style: const TextStyle(
                    fontSize: 15, color: Colors.black87))),
      ]),
    );
  }

  Widget _editField(TextEditingController ctrl, String hint,
      IconData icon, {bool readOnly = false, VoidCallback? onTap}) {
    return TextField(
      controller: ctrl,
      readOnly: readOnly,
      onTap: onTap,
      decoration: InputDecoration(
        hintText: hint,
        hintStyle: TextStyle(color: Colors.grey.shade400),
        prefixIcon: Icon(icon, size: 18, color: Colors.blue.shade300),
        filled: true,
        fillColor: Colors.white,
        border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: BorderSide(color: Colors.grey.shade300)),
        enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: BorderSide(color: Colors.blue.shade200)),
        focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide:
                const BorderSide(color: Colors.blue, width: 2)),
        contentPadding: const EdgeInsets.symmetric(
            horizontal: 16, vertical: 14),
      ),
    );
  }

  Color _priorityColor(String? p) {
    switch ((p ?? '').toUpperCase()) {
      case 'HIGH': return Colors.red;
      case 'LOW':  return Colors.green;
      default:     return Colors.orange;
    }
  }

  String _priorityLabel(String? p, bool isFr) {
    switch ((p ?? '').toUpperCase()) {
      case 'HIGH': return 'High';
      case 'LOW':  return 'Low';
      default:     return 'Medium';
    }
  }

  String _formatDate(String? isoDate) {
    if (isoDate == null || isoDate.isEmpty) return '—';
    try {
      final d = DateTime.parse(isoDate);
      return '${d.day.toString().padLeft(2, '0')}/'
             '${d.month.toString().padLeft(2, '0')}/'
             '${d.year}';
    } catch (_) { return isoDate; }
  }
}