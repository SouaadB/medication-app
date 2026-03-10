import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../config/api_config.dart';
import '../services/language_service.dart';
import '../services/condition_service.dart';

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
  final List<String> _frequencies = const [
    'Once daily',
    'Twice daily',
    'Three times daily',
    'Four times daily',
    'Every 12 hours',
    'Every 8 hours',
    'Every 6 hours',
    'As needed'
  ];

  late List<_EditableMedication> _items;
  DateTime _startDate = DateTime.now();
  bool _isSubmitting = false;
  bool _isConditionPreSelected = false;
  
  // For condition selection
  List<Map<String, dynamic>> _patientConditions = [];
  bool _loadingConditions = false;
  Map<int, int?> _selectedConditionIds = {}; // Map medication index to condition_id

  @override
  void initState() {
    super.initState();
    
    // Check if condition is pre-selected
    _isConditionPreSelected = widget.conditionId != null;
    
    _items = widget.medications.map((m) {
      final freq = m['frequency'];
      final safeFreq = _frequencies.contains(freq) ? freq : 'Once daily';
      return _EditableMedication(
        name: m['name']?.toString() ?? '',
        dosage: m['dosage']?.toString() ?? '',
        frequency: safeFreq,
        durationDays: m['duration_days'] is int ? m['duration_days'] as int : null,
      );
    }).toList();
    
    // Initialize condition IDs
    for (int i = 0; i < _items.length; i++) {
      _selectedConditionIds[i] = widget.conditionId; // Auto-select if provided
    }
    
    _loadPatientConditions();
  }

  Future<void> _loadPatientConditions() async {
    setState(() => _loadingConditions = true);
    try {
      final conditions = await ConditionService.getPatientConditions();
      setState(() {
        _patientConditions = List<Map<String, dynamic>>.from(conditions);
        _loadingConditions = false;
      });
    } catch (e) {
      print('Error loading conditions: $e');
      setState(() => _loadingConditions = false);
    }
  }

  Future<void> _pickStartDate() async {
    final languageService = Provider.of<LanguageService>(context, listen: false);
    final picked = await showDatePicker(
      context: context,
      initialDate: _startDate,
      firstDate: DateTime.now().subtract(const Duration(days: 0)),
      lastDate: DateTime.now().add(const Duration(days: 365)),
      locale: languageService.locale,
    );
    if (picked != null) {
      setState(() => _startDate = picked);
    }
  }

  String _fmtDate(DateTime d) {
    final y = d.year.toString().padLeft(4, '0');
    final m = d.month.toString().padLeft(2, '0');
    final day = d.day.toString().padLeft(2, '0');
    return '$y-$m-$day';
  }

  void _showConditionSelector(int index) {
    if (_isConditionPreSelected) {
      // Show message that condition is locked
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Condition is locked to ${widget.conditionName}'),
          backgroundColor: Colors.blue,
        ),
      );
      return;
    }
    
    final languageService = Provider.of<LanguageService>(context, listen: false);
    
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) {
        return Container(
          padding: const EdgeInsets.all(20),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Select Condition for ${_items[index].nameController.text}',
                style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 16),
              _loadingConditions
                  ? const Center(child: CircularProgressIndicator())
                  : _patientConditions.isEmpty
                      ? const Text('No conditions available. Add conditions first.')
                      : SizedBox(
                          height: 200,
                          child: ListView.builder(
                            itemCount: _patientConditions.length,
                            itemBuilder: (ctx, i) {
                              final condition = _patientConditions[i];
                              final isSelected = _selectedConditionIds[index] == condition['id'];
                              return ListTile(
                                title: Text(condition['name']),
                                trailing: isSelected
                                    ? const Icon(Icons.check_circle, color: Colors.blue)
                                    : const Icon(Icons.radio_button_unchecked),
                                onTap: () {
                                  setState(() {
                                    _selectedConditionIds[index] = condition['id'];
                                  });
                                  Navigator.pop(context);
                                },
                              );
                            },
                          ),
                        ),
            ],
          ),
        );
      },
    );
  }

  Future<void> _saveSelected() async {
    final languageService = Provider.of<LanguageService>(context, listen: false);
    
    final selected = _items.where((i) => i.include && i.nameController.text.trim().isNotEmpty).toList();
    if (selected.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(languageService.translate('selectOneMedication'))),
      );
      return;
    }

    // Check if all selected medications have a condition selected
    for (int i = 0; i < _items.length; i++) {
      if (_items[i].include && _selectedConditionIds[i] == null) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Please select a condition for ${_items[i].nameController.text}'),
            backgroundColor: Colors.orange,
          ),
        );
        return;
      }
    }

    setState(() => _isSubmitting = true);
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');
      if (token == null) {
        setState(() => _isSubmitting = false);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(languageService.translate('notAuthenticated'))),
        );
        return;
      }

      int successCount = 0;
      for (int i = 0; i < _items.length; i++) {
        final item = _items[i];
        if (!item.include || item.nameController.text.trim().isEmpty) continue;
        
        final start = _fmtDate(_startDate);
        String? end;
        if (item.durationDays != null && item.durationDays! > 0) {
          final e = _startDate.add(Duration(days: item.durationDays! - 1));
          end = _fmtDate(e);
        }

        final body = {
          'medication_name': item.nameController.text.trim(),
          'dosage': item.dosageController.text.trim().isEmpty ? null : item.dosageController.text.trim(),
          'frequency': item.frequency,
          'start_date': start,
          'end_date': end,
          'condition_id': _selectedConditionIds[i],
        };

        print('Sending treatment data: $body');

        final resp = await http.post(
          Uri.parse('${ApiConfig.baseUrl}/treatments'),
          headers: ApiConfig.getAuthHeaders(token),
          body: jsonEncode(body),
        );
        
        if (resp.statusCode == 201) {
          successCount += 1;
        } else {
          print('Error response: ${resp.body}');
        }
      }

      setState(() => _isSubmitting = false);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('$successCount ${languageService.translate('medicationsSaved')}'),
            backgroundColor: Colors.green,
          ),
        );
        Navigator.pop(context, true);
      }
    } catch (e) {
      print('Error saving medications: $e');
      setState(() => _isSubmitting = false);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('${languageService.translate('error')}: $e')),
        );
      }
    }
  }

  String _translateConditionName(String name, LanguageService lang) {
    switch(name) {
      case 'Diabetes Type 1': return lang.translate('diabetesType1');
      case 'Diabetes Type 2': return lang.translate('diabetesType2');
      case 'Hypertension': return lang.translate('hypertension');
      case 'Asthma': return lang.translate('asthma');
      case 'Heart Disease': return lang.translate('heartDisease');
      case 'High Cholesterol': return lang.translate('cholesterol');
      case 'COPD': return lang.translate('copd');
      case 'Arthritis': return lang.translate('arthritis');
      case 'Thyroid Disorder': return lang.translate('thyroidDisorder');
      default: return name;
    }
  }

  @override
  Widget build(BuildContext context) {
    final languageService = Provider.of<LanguageService>(context);
    
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios, color: Colors.blue),
          onPressed: () => Navigator.pop(context),
        ),
        title: Text(
          languageService.translate('reviewMedications'),
          style: const TextStyle(color: Colors.blue, fontWeight: FontWeight.bold),
        ),
      ),
      body: Column(
        children: [
          if (_isConditionPreSelected)
            Container(
              margin: const EdgeInsets.fromLTRB(20, 10, 20, 0),
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.blue.shade50,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Row(
                children: [
                  const Icon(Icons.lock, color: Colors.blue, size: 16),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      'Adding medications for: ${widget.conditionName}',
                      style: const TextStyle(
                        color: Colors.blue,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          Padding(
            padding: const EdgeInsets.fromLTRB(20, 20, 20, 10),
            child: Row(
              children: [
                const Icon(Icons.calendar_today, color: Colors.blue),
                const SizedBox(width: 10),
                Expanded(
                  child: Text(
                    '${languageService.translate('start')}: ${_fmtDate(_startDate)}',
                    style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
                  ),
                ),
                TextButton(
                  onPressed: _pickStartDate,
                  child: Text(languageService.translate('change')),
                ),
              ],
            ),
          ),
          Expanded(
            child: ListView.builder(
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
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(16),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.05),
                        blurRadius: 12,
                        offset: const Offset(0, 6),
                      ),
                    ],
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Switch(
                            value: item.include,
                            onChanged: (v) => setState(() => item.include = v),
                            activeColor: Colors.blue,
                          ),
                          const SizedBox(width: 8),
                          Expanded(
                            child: Text(
                              languageService.translate('include'),
                              style: const TextStyle(fontWeight: FontWeight.bold),
                            ),
                          ),
                          if (item.durationDays != null)
                            Text(
                              '${item.durationDays} ${languageService.translate('days')}',
                              style: TextStyle(color: Colors.grey.shade700),
                            ),
                        ],
                      ),
                      const SizedBox(height: 12),
                      TextField(
                        controller: item.nameController,
                        decoration: InputDecoration(
                          labelText: languageService.translate('medicationName'),
                          border: const OutlineInputBorder(),
                        ),
                      ),
                      const SizedBox(height: 12),
                      TextField(
                        controller: item.dosageController,
                        decoration: InputDecoration(
                          labelText: languageService.translate('dosage'),
                          border: const OutlineInputBorder(),
                        ),
                      ),
                      const SizedBox(height: 12),
                      DropdownButtonFormField<String>(
                        value: item.frequency,
                        items: _frequencies
                            .map((f) => DropdownMenuItem<String>(
                                  value: f,
                                  child: Text(f),
                                ))
                            .toList(),
                        onChanged: (v) => setState(() => item.frequency = v ?? 'Once daily'),
                        decoration: InputDecoration(
                          labelText: languageService.translate('frequency'),
                          border: const OutlineInputBorder(),
                        ),
                      ),
                      const SizedBox(height: 12),
                      // Condition selector
                      Container(
                        decoration: BoxDecoration(
                          border: Border.all(
                            color: _selectedConditionIds[index] == null && item.include
                                ? Colors.red.shade200 
                                : Colors.grey.shade300,
                            width: _selectedConditionIds[index] == null && item.include ? 2 : 1,
                          ),
                          borderRadius: BorderRadius.circular(8),
                          color: _isConditionPreSelected ? Colors.grey.shade50 : Colors.white,
                        ),
                        child: GestureDetector(
                          onTap: () => _showConditionSelector(index),
                          child: Padding(
                            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 16),
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Expanded(
                                  child: Text(
                                    _selectedConditionIds[index] == null
                                        ? (item.include ? 'Select condition (required)' : 'Select condition')
                                        : _translateConditionName(selectedCondition['name'], languageService),
                                    style: TextStyle(
                                      color: _selectedConditionIds[index] == null && item.include
                                          ? Colors.red.shade400
                                          : (_selectedConditionIds[index] == null 
                                              ? Colors.grey.shade600 
                                              : (_isConditionPreSelected ? Colors.grey.shade700 : Colors.black)),
                                    ),
                                  ),
                                ),
                                Icon(
                                  _isConditionPreSelected ? Icons.lock : Icons.arrow_drop_down,
                                  color: _isConditionPreSelected ? Colors.grey : Colors.blue,
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),
                      if (_selectedConditionIds[index] == null && item.include && !_isConditionPreSelected)
                        Padding(
                          padding: const EdgeInsets.only(top: 4, left: 12),
                          child: Text(
                            'Required',
                            style: TextStyle(
                              fontSize: 12,
                              color: Colors.red.shade400,
                            ),
                          ),
                        ),
                    ],
                  ),
                );
              },
            ),
          ),
          Padding(
            padding: const EdgeInsets.fromLTRB(20, 10, 20, 20),
            child: SizedBox(
              width: double.infinity,
              height: 55,
              child: ElevatedButton(
                onPressed: _isSubmitting ? null : _saveSelected,
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.blue,
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(30)),
                  elevation: 0,
                ),
                child: _isSubmitting
                    ? const SizedBox(
                        width: 22,
                        height: 22,
                        child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                      )
                    : Text(
                        languageService.translate('saveSelected'),
                        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                      ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _EditableMedication {
  final TextEditingController nameController;
  final TextEditingController dosageController;
  String frequency;
  bool include;
  final int? durationDays;

  _EditableMedication({
    required String name,
    required String dosage,
    required this.frequency,
    required this.durationDays,
  })  : nameController = TextEditingController(text: name),
        dosageController = TextEditingController(text: dosage),
        include = true;
}