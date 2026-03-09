import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../config/api_config.dart';
import '../services/language_service.dart';

class ReviewParsedMedicationsPage extends StatefulWidget {
  final List<dynamic> medications;
  const ReviewParsedMedicationsPage({super.key, required this.medications});

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

  @override
  void initState() {
    super.initState();
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
  }

  Future<void> _pickStartDate() async {
    final picked = await showDatePicker(
      context: context,
      initialDate: _startDate,
      firstDate: DateTime.now().subtract(const Duration(days: 0)),
      lastDate: DateTime.now().add(const Duration(days: 365)),
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

  Future<void> _saveSelected() async {
    final selected = _items.where((i) => i.include && i.nameController.text.trim().isNotEmpty).toList();
    if (selected.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Select at least one medication')));
      return;
    }

    setState(() => _isSubmitting = true);
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');
      if (token == null) {
        setState(() => _isSubmitting = false);
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Not authenticated')));
        return;
      }

      int successCount = 0;
      for (final item in selected) {
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
          'end_date': end
        };

        final resp = await http.post(
          Uri.parse('${ApiConfig.baseUrl}/treatments'),
          headers: ApiConfig.getAuthHeaders(token),
          body: jsonEncode(body),
        );
        if (resp.statusCode == 201) {
          successCount += 1;
        }
      }

      setState(() => _isSubmitting = false);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Saved $successCount medication(s)')),
        );
        Navigator.pop(context, true);
      }
    } catch (e) {
      setState(() => _isSubmitting = false);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Error: $e')));
      }
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
        title: const Text(
          'Review Medications',
          style: TextStyle(color: Colors.blue, fontWeight: FontWeight.bold),
        ),
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(20, 20, 20, 10),
            child: Row(
              children: [
                const Icon(Icons.calendar_today, color: Colors.blue),
                const SizedBox(width: 10),
                Expanded(
                  child: Text(
                    'Start: ${_fmtDate(_startDate)}',
                    style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
                  ),
                ),
                TextButton(
                  onPressed: _pickStartDate,
                  child: Text(languageService.translate('change') ?? 'Change'),
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
                          const Expanded(
                            child: Text(
                              'Include',
                              style: TextStyle(fontWeight: FontWeight.bold),
                            ),
                          ),
                          if (item.durationDays != null)
                            Text('${item.durationDays} days', style: TextStyle(color: Colors.grey.shade700)),
                        ],
                      ),
                      const SizedBox(height: 12),
                      TextField(
                        controller: item.nameController,
                        decoration: const InputDecoration(
                          labelText: 'Medication Name',
                          border: OutlineInputBorder(),
                        ),
                      ),
                      const SizedBox(height: 12),
                      TextField(
                        controller: item.dosageController,
                        decoration: const InputDecoration(
                          labelText: 'Dosage',
                          border: OutlineInputBorder(),
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
                        decoration: const InputDecoration(
                          labelText: 'Frequency',
                          border: OutlineInputBorder(),
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
                    : const Text('Save Selected', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
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

