import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../config/api_config.dart';
import '../services/language_service.dart';

class ManualEntryPage extends StatefulWidget {
  final Map<String, dynamic>? prefillData;

  const ManualEntryPage({super.key, this.prefillData});

  @override
  State<ManualEntryPage> createState() => _ManualEntryPageState();
}

class _ManualEntryPageState extends State<ManualEntryPage> {
  final TextEditingController _medicationController = TextEditingController();
  final TextEditingController _dosageController = TextEditingController();
  final TextEditingController _startDateController = TextEditingController();
  final TextEditingController _endDateController = TextEditingController();
  
  List<String> _selectedFrequencies = [];
  String? _mainFrequency; // "Once daily", "Twice daily", etc.
  List<String> _mealAnchors = []; // "Before breakfast", "After lunch", etc.
  String _priority = 'MEDIUM'; // LOW, MEDIUM, HIGH
  int? _selectedConditionId;
  String? _selectedConditionName;
  bool _isLoading = false;
  bool _isConditionPreSelected = false;

  final List<String> _frequencyBaseFr = [
    'Une fois par jour',
    'Deux fois par jour',
    'Trois fois par jour',
    'Quatre fois par jour',
    'Toutes les 4 heures',
    'Toutes les 6 heures',
    'Toutes les 8 heures',
    'Toutes les 12 heures',
    'Au besoin',
  ];

  final List<String> _frequencyBaseEn = [
    'Once daily',
    'Twice daily',
    'Three times daily',
    'Four times daily',
    'Every 4 hours',
    'Every 6 hours',
    'Every 8 hours',
    'Every 12 hours',
    'As needed',
  ];

  final List<String> _mealAnchorsFr = [
    'Avant le petit-déjeuner',
    'Après le petit-déjeuner',
    'Avant le déjeuner',
    'Après le déjeuner',
    'Avant le dîner',
    'Après le dîner',
    'Avant de dormir',
  ];

  final List<String> _mealAnchorsEn = [
    'Before breakfast',
    'After breakfast',
    'Before lunch',
    'After lunch',
    'Before dinner',
    'After dinner',
    'Before sleeping',
  ];

  final Map<String, String> _frToEnMap = {
    'Une fois par jour': 'Once daily',
    'Deux fois par jour': 'Twice daily',
    'Trois fois par jour': 'Three times daily',
    'Quatre fois par jour': 'Four times daily',
    'Toutes les 4 heures': 'Every 4 hours',
    'Toutes les 6 heures': 'Every 6 hours',
    'Toutes les 8 heures': 'Every 8 hours',
    'Toutes les 12 heures': 'Every 12 hours',
    'Au besoin': 'As needed',
    'Avant le petit-déjeuner': 'Before breakfast',
    'Après le petit-déjeuner': 'After breakfast',
    'Avant le déjeuner': 'Before lunch',
    'Après le déjeuner': 'After lunch',
    'Avant le dîner': 'Before dinner',
    'Après le dîner': 'After dinner',
    'Avant de dormir': 'Before sleeping',
  };

  List<Map<String, dynamic>> _conditions = [];
  bool _loadingConditions = true;

  // Get current frequency list based on language
  List<String> _getCurrentFrequencyBase(LanguageService languageService) {
    return languageService.getCurrentLanguage() == 'fr' 
        ? _frequencyBaseFr 
        : _frequencyBaseEn;
  }

  List<String> _getCurrentMealAnchors(LanguageService languageService) {
    return languageService.getCurrentLanguage() == 'fr' 
        ? _mealAnchorsFr 
        : _mealAnchorsEn;
  }

  // Check if current language is French
  bool _isFrench(LanguageService languageService) {
    return languageService.getCurrentLanguage() == 'fr';
  }

  // Convert to backend format (always English)
  String _getBackendFrequency() {
    List<String> finalParts = [];
    if (_mainFrequency != null) {
      finalParts.add(_frToEnMap[_mainFrequency] ?? _mainFrequency!);
    }
    for (var anchor in _mealAnchors) {
      finalParts.add(_frToEnMap[anchor] ?? anchor);
    }
    
    if (finalParts.isEmpty) return 'Once daily';
    return finalParts.join(' + ');
  }

  @override
  void initState() {
    super.initState();
    
    // Check if condition is pre-selected from ConditionDetailPage
    if (widget.prefillData != null && widget.prefillData!.containsKey('condition_id')) {
      _selectedConditionId = widget.prefillData!['condition_id'];
      _selectedConditionName = widget.prefillData!['condition_name'];
      _isConditionPreSelected = true;
    }
    
    _loadConditions();
    
    if (widget.prefillData != null) {
      _medicationController.text = widget.prefillData!['medication_name'] ?? '';
      _dosageController.text = widget.prefillData!['dosage'] ?? '';
      
      final freq = widget.prefillData!['frequency'];
      if (freq != null && freq is String) {
        final parts = freq.split('+').map((s) => s.trim()).toList();
        
        // Try to identify main frequency and meal anchors
        for (var part in parts) {
          // Check if it's a base frequency
          String? matchingBase;
          for (var base in _frequencyBaseEn) {
            if (part == base) {
              matchingBase = _isFrench(Provider.of<LanguageService>(context, listen: false)) 
                  ? _frequencyBaseFr[_frequencyBaseEn.indexOf(base)]
                  : base;
              break;
            }
          }
          
          if (matchingBase != null) {
            _mainFrequency = matchingBase;
          } else {
            // Check if it's a meal anchor
            String? matchingAnchor;
            for (var anchor in _mealAnchorsEn) {
              if (part == anchor) {
                matchingAnchor = _isFrench(Provider.of<LanguageService>(context, listen: false))
                    ? _mealAnchorsFr[_mealAnchorsEn.indexOf(anchor)]
                    : anchor;
                break;
              }
            }
            if (matchingAnchor != null) {
              _mealAnchors.add(matchingAnchor);
            }
          }
        }
      }
      
      if (widget.prefillData!['duration_days'] != null) {
        final start = DateTime.now();
        final end = start.add(Duration(days: widget.prefillData!['duration_days']));
        _startDateController.text = _formatDate(start);
        _endDateController.text = _formatDate(end);
      }
    } else {
      // Default start date = today
      _startDateController.text = _formatDate(DateTime.now());
    }
  }

  Future<void> _loadConditions() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');

      final response = await http.get(
        Uri.parse('${ApiConfig.baseUrl}/profile/conditions'),
        headers: ApiConfig.getAuthHeaders(token!),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        setState(() {
          _conditions = List<Map<String, dynamic>>.from(data['conditions']);
          _loadingConditions = false;
        });
      } else {
        setState(() => _loadingConditions = false);
      }
    } catch (e) {
      print('Erreur chargement conditions: $e');
      setState(() => _loadingConditions = false);
    }
  }

  String _formatDate(DateTime date) {
    return "${date.day.toString().padLeft(2, '0')}/"
           "${date.month.toString().padLeft(2, '0')}/"
           "${date.year}";
  }

  @override
  Widget build(BuildContext context) {
    final languageService = Provider.of<LanguageService>(context);
    final currentFrequencyBase = _getCurrentFrequencyBase(languageService);
    final currentMealAnchors = _getCurrentMealAnchors(languageService);
    final isFrench = _isFrench(languageService);
    
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
          languageService.translate('manualEntry'),
          style: const TextStyle(
            color: Colors.blue,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
      body: _loadingConditions
          ? const Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Header
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: Colors.blue.shade50,
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          languageService.translate('medicationName'),
                          style: const TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.w600,
                            color: Color(0xFF1A237E),
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          languageService.translate('helpUs'),
                          style: TextStyle(
                            fontSize: 14,
                            color: Colors.grey.shade700,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 24),

                  // Condition (Auto-selected if coming from condition detail)
                  Row(
                    children: [
                      _buildLabelWithIcon(
                        Icons.medical_information,
                        languageService.translate('conditions'),
                      ),
                      if (!_isConditionPreSelected)
                        const Text(
                          ' *',
                          style: TextStyle(color: Colors.red, fontSize: 16, fontWeight: FontWeight.bold),
                        ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
                    decoration: BoxDecoration(
                      border: Border.all(
                        color: !_isConditionPreSelected && _selectedConditionId == null && !_loadingConditions
                            ? Colors.red.shade200 
                            : Colors.grey.shade300,
                        width: !_isConditionPreSelected && _selectedConditionId == null && !_loadingConditions ? 2 : 1,
                      ),
                      borderRadius: BorderRadius.circular(12),
                      color: _isConditionPreSelected ? Colors.grey.shade50 : Colors.white,
                      boxShadow: [
                        BoxShadow(
                          color: Colors.grey.withOpacity(0.1),
                          blurRadius: 4,
                          offset: const Offset(0, 2),
                        ),
                      ],
                    ),
                    child: _isConditionPreSelected
                        ? Padding(
                            padding: const EdgeInsets.symmetric(vertical: 16),
                            child: Row(
                              children: [
                                Container(
                                  padding: const EdgeInsets.all(8),
                                  child: Icon(Icons.medical_information, color: Colors.grey.shade600),
                                ),
                                const SizedBox(width: 8),
                                Expanded(
                                  child: Text(
                                    _selectedConditionName ?? 'Unknown',
                                    style: TextStyle(
                                      color: Colors.grey.shade700,
                                      fontSize: 16,
                                      fontWeight: FontWeight.w500,
                                    ),
                                  ),
                                ),
                                Container(
                                  padding: const EdgeInsets.all(8),
                                  child: const Icon(Icons.lock, color: Colors.grey, size: 18),
                                ),
                              ],
                            ),
                          )
                        : DropdownButtonHideUnderline(
                            child: DropdownButton<int>(
                              value: _selectedConditionId,
                              hint: Text(
                                isFrench ? 'Sélectionnez une condition' : 'Select condition',
                                style: TextStyle(
                                  color: _selectedConditionId == null 
                                      ? Colors.grey.shade400 
                                      : Colors.black,
                                ),
                              ),
                              icon: const Icon(Icons.arrow_drop_down, color: Colors.blue),
                              isExpanded: true,
                              items: _conditions.map((c) {
                                return DropdownMenuItem<int>(
                                  value: c['id'],
                                  child: Text(c['name']),
                                );
                              }).toList(),
                              onChanged: (value) => setState(() => _selectedConditionId = value),
                            ),
                          ),
                  ),
                  if (_isConditionPreSelected)
                    Padding(
                      padding: const EdgeInsets.only(top: 4, left: 12),
                      child: Text(
                        isFrench ? 'Condition verrouillée' : 'Locked condition',
                        style: TextStyle(
                          fontSize: 12,
                          color: Colors.grey.shade600,
                          fontStyle: FontStyle.italic,
                        ),
                      ),
                    ),
                  const SizedBox(height: 20),

                  // Medication Name Field
                  _buildLabelWithIcon(
                    Icons.medication,
                    languageService.translate('medicationName'),
                  ),
                  const SizedBox(height: 8),
                  _buildTextField(
                    controller: _medicationController,
                    hintText: isFrench ? 'ex: Metformine' : 'e.g., Metformin',
                    icon: Icons.medication_outlined,
                  ),
                  const SizedBox(height: 20),

                  // Dosage Field
                  _buildLabelWithIcon(
                    Icons.science,
                    languageService.translate('dosage'),
                  ),
                  const SizedBox(height: 8),
                  _buildTextField(
                    controller: _dosageController,
                    hintText: isFrench ? 'ex: 500mg' : 'e.g., 500mg',
                    icon: Icons.science_outlined,
                  ),
                  const SizedBox(height: 20),

                  // Frequency Field
                  _buildLabelWithIcon(
                    Icons.access_time,
                    languageService.translate('frequency'),
                  ),
                  const SizedBox(height: 8),
                  _buildFrequencySelector(languageService, currentFrequencyBase, currentMealAnchors),
                  const SizedBox(height: 20),

                  // Priority Field
                  _buildLabelWithIcon(
                    Icons.priority_high,
                    isFrench ? 'Priorité' : 'Priority',
                  ),
                  const SizedBox(height: 8),
                  _buildPrioritySelector(isFrench),
                  const SizedBox(height: 20),

                  // Start Date Field
                  _buildLabelWithIcon(
                    Icons.calendar_today,
                    languageService.translate('startDate'),
                  ),
                  const SizedBox(height: 8),
                  _buildDatePickerField(
                    controller: _startDateController,
                    onTap: () => _selectDate(context, _startDateController),
                    icon: Icons.calendar_month,
                  ),
                  const SizedBox(height: 20),

                  // End Date Field
                  _buildLabelWithIcon(
                    Icons.calendar_today,
                    languageService.translate('endDate'),
                  ),
                  const SizedBox(height: 8),
                  _buildDatePickerField(
                    controller: _endDateController,
                    onTap: () => _selectDate(context, _endDateController),
                    icon: Icons.calendar_month,
                  ),
                  const SizedBox(height: 32),

                  // Generate Button
                  Container(
                    width: double.infinity,
                    height: 55,
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(30),
                      gradient: LinearGradient(
                        colors: [Colors.blue.shade400, Colors.blue.shade700],
                      ),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.blue.withOpacity(0.3),
                          blurRadius: 8,
                          offset: const Offset(0, 4),
                        ),
                      ],
                    ),
                    child: ElevatedButton(
                      onPressed: _isLoading ? null : _saveTreatment,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.transparent,
                        foregroundColor: Colors.white,
                        shadowColor: Colors.transparent,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(30),
                        ),
                        elevation: 0,
                      ),
                      child: _isLoading
                          ? const SizedBox(
                              height: 24,
                              width: 24,
                              child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2),
                            )
                          : Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                const Icon(Icons.save, size: 20),
                                const SizedBox(width: 8),
                                Text(
                                  languageService.translate('save'),
                                  style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                                ),
                              ],
                            ),
                    ),
                  ),
                ],
              ),
            ),
    );
  }

  // Frequency selector
  Widget _buildFrequencySelector(LanguageService languageService, List<String> baseFreqs, List<String> anchors) {
    String displayText;
    if (_mainFrequency == null && _mealAnchors.isEmpty) {
      displayText = languageService.translate('selectFrequency');
    } else {
      List<String> parts = [];
      if (_mainFrequency != null) parts.add(_mainFrequency!);
      parts.addAll(_mealAnchors);
      displayText = parts.join(', ');
    }

    return GestureDetector(
      onTap: () => _showSmartFrequencySelector(languageService, baseFreqs, anchors),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        decoration: BoxDecoration(
          border: Border.all(color: Colors.grey.shade300),
          borderRadius: BorderRadius.circular(12),
          color: Colors.white,
        ),
        child: Row(
          children: [
            Icon(Icons.access_time, color: Colors.blue.shade300),
            const SizedBox(width: 8),
            Expanded(child: Text(displayText, maxLines: 2, overflow: TextOverflow.ellipsis)),
            const Icon(Icons.arrow_drop_down, color: Colors.blue),
          ],
        ),
      ),
    );
  }

  void _showSmartFrequencySelector(LanguageService languageService, List<String> baseFreqs, List<String> anchors) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(25))),
      builder: (context) => StatefulBuilder(
        builder: (context, setModalState) {
          final mainFreqEn = _mainFrequency != null ? _frToEnMap[_mainFrequency] ?? _mainFrequency : null;
          
          final isInterval = mainFreqEn != null && 
              (mainFreqEn.contains('Every') || mainFreqEn == 'As needed' || mainFreqEn == 'Four times daily');
          
          final isThreeTimes = mainFreqEn == 'Three times daily';
          
          int maxAnchors = 99;
          if (mainFreqEn == 'Once daily') maxAnchors = 1;
          else if (mainFreqEn == 'Twice daily') maxAnchors = 2;

          return Container(
            height: MediaQuery.of(context).size.height * 0.85,
            padding: const EdgeInsets.symmetric(horizontal: 20),
            child: Column(
              children: [
                const SizedBox(height: 12),
                Container(width: 40, height: 4, decoration: BoxDecoration(color: Colors.grey.shade300, borderRadius: BorderRadius.circular(2))),
                const SizedBox(height: 20),
                Text(languageService.translate('selectFrequency'), style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
                const Divider(),
                Expanded(
                  child: ListView(
                    children: [
                      _buildSectionTitle(_isFrench(languageService) ? 'Fréquence' : 'Frequency'),
                      ...baseFreqs.asMap().entries.map((entry) {
                        final idx = entry.key;
                        final f = entry.value;
                        return RadioListTile<String>(
                          secondary: Icon(_getFrequencyIcon(idx), color: _mainFrequency == f ? Colors.blue : Colors.grey),
                          title: Text(f),
                          value: f,
                          groupValue: _mainFrequency,
                          activeColor: Colors.blue,
                          onChanged: (val) {
                            if (val == null) return;
                            setModalState(() {
                              _mainFrequency = val;
                              final valEn = _frToEnMap[val] ?? val;
                              // Rule: 3 times daily auto-selects all meals
                              if (valEn == 'Three times daily') {
                                _mealAnchors = [anchors[1], anchors[3], anchors[5]]; // After breakfast, lunch, dinner
                              } else {
                                final isNowInterval = valEn.contains('Every') || valEn == 'As needed' || valEn == 'Four times daily';
                                if (isNowInterval) {
                                  _mealAnchors = [];
                                } else {
                                  // Trim anchors if they exceed max allowed for new frequency
                                  int newMax = 99;
                                  if (valEn == 'Once daily') newMax = 1;
                                  else if (valEn == 'Twice daily') newMax = 2;
                                  if (_mealAnchors.length > newMax) {
                                    _mealAnchors = _mealAnchors.sublist(0, newMax);
                                  }
                                }
                              }
                            });
                            setState(() {});
                          },
                        );
                      }),
                      const SizedBox(height: 20),
                      _buildSectionTitle(_isFrench(languageService) ? 'Moment (Repas)' : 'Timing (Meals)'),
                      if (isInterval) 
                        Padding(
                          padding: const EdgeInsets.all(16.0),
                          child: Text(
                            _isFrench(languageService) ? 'Indisponible pour cette fréquence' : 'Unavailable for this frequency',
                            style: TextStyle(color: Colors.grey.shade500, fontStyle: FontStyle.italic),
                          ),
                        )
                      else if (isThreeTimes)
                        Padding(
                          padding: const EdgeInsets.all(16.0),
                          child: Text(
                            _isFrench(languageService) ? 'Auto-sélectionné pour 3 fois/jour' : 'Auto-selected for 3 times/day',
                            style: const TextStyle(color: Colors.blue, fontWeight: FontWeight.bold),
                          ),
                        )
                      else
                        ...anchors.map((a) {
                          final isSelected = _mealAnchors.contains(a);
                          final isDisabled = !isSelected && _mealAnchors.length >= maxAnchors;
                          return CheckboxListTile(
                            title: Text(a, style: TextStyle(color: isDisabled ? Colors.grey : Colors.black)),
                            value: isSelected,
                            activeColor: Colors.blue,
                            onChanged: isDisabled ? null : (val) {
                              setModalState(() {
                                if (val == true) _mealAnchors.add(a);
                                else _mealAnchors.remove(a);
                              });
                              setState(() {});
                            },
                          );
                        }),
                    ],
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.symmetric(vertical: 20),
                  child: SizedBox(
                    width: double.infinity,
                    height: 50,
                    child: ElevatedButton(
                      onPressed: () => Navigator.pop(context),
                      style: ElevatedButton.styleFrom(backgroundColor: Colors.blue, foregroundColor: Colors.white, shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12))),
                      child: Text(languageService.translate('confirm'), style: const TextStyle(fontWeight: FontWeight.bold)),
                    ),
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _buildPrioritySelector(bool isFrench) {
    return Container(
      padding: const EdgeInsets.all(4),
      decoration: BoxDecoration(
        color: Colors.grey.shade100,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        children: [
          _buildPriorityOption('LOW', isFrench ? 'Basse' : 'Low', Colors.green),
          _buildPriorityOption('MEDIUM', isFrench ? 'Moyenne' : 'Medium', Colors.orange),
          _buildPriorityOption('HIGH', isFrench ? 'Haute' : 'High', Colors.red),
        ],
      ),
    );
  }

  Widget _buildPriorityOption(String value, String label, Color color) {
    bool isSelected = _priority == value;
    return Expanded(
      child: GestureDetector(
        onTap: () => setState(() => _priority = value),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 12),
          decoration: BoxDecoration(
            color: isSelected ? color : Colors.transparent,
            borderRadius: BorderRadius.circular(10),
            boxShadow: isSelected ? [
              BoxShadow(color: color.withOpacity(0.3), blurRadius: 4, offset: const Offset(0, 2))
            ] : null,
          ),
          child: Text(
            label,
            textAlign: TextAlign.center,
            style: TextStyle(
              color: isSelected ? Colors.white : Colors.grey.shade600,
              fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildSectionTitle(String title) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 16),
      child: Text(title, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.blue)),
    );
  }

  // Helper method to build labels with icons
  Widget _buildLabelWithIcon(IconData icon, String label) {
    return Row(
      children: [
        Container(
          padding: const EdgeInsets.all(4),
          decoration: BoxDecoration(
            color: Colors.blue.withOpacity(0.1),
            borderRadius: BorderRadius.circular(6),
          ),
          child: Icon(icon, color: Colors.blue, size: 18),
        ),
        const SizedBox(width: 8),
        Text(
          label,
          style: const TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.w600,
            color: Color(0xFF1A237E),
          ),
        ),
      ],
    );
  }

  // Helper method to build text fields
  Widget _buildTextField({
    required TextEditingController controller,
    required String hintText,
    required IconData icon,
  }) {
    return Container(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withOpacity(0.1),
            blurRadius: 4,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: TextField(
        controller: controller,
        decoration: InputDecoration(
          hintText: hintText,
          hintStyle: TextStyle(color: Colors.grey.shade400),
          prefixIcon: Icon(icon, color: Colors.blue.shade300),
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: BorderSide(color: Colors.grey.shade300),
          ),
          enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: BorderSide(color: Colors.grey.shade300),
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: const BorderSide(color: Colors.blue, width: 2),
          ),
          filled: true,
          fillColor: Colors.white,
          contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
        ),
      ),
    );
  }

  // Helper method to build date picker field
  Widget _buildDatePickerField({
    required TextEditingController controller,
    required VoidCallback onTap,
    required IconData icon,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
        decoration: BoxDecoration(
          border: Border.all(color: Colors.grey.shade300),
          borderRadius: BorderRadius.circular(12),
          color: Colors.white,
          boxShadow: [
            BoxShadow(
              color: Colors.grey.withOpacity(0.1),
              blurRadius: 4,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              child: Icon(icon, color: Colors.blue.shade300),
            ),
            const SizedBox(width: 8),
            Expanded(
              child: Text(
                controller.text.isEmpty ? 'dd/mm/yyyy' : controller.text,
                style: TextStyle(
                  color: controller.text.isEmpty ? Colors.grey.shade400 : Colors.black,
                  fontSize: 16,
                ),
              ),
            ),
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: Colors.blue.withOpacity(0.1),
                borderRadius: BorderRadius.circular(8),
              ),
              child: const Icon(Icons.arrow_drop_down, color: Colors.blue),
            ),
          ],
        ),
      ),
    );
  }

  // Helper method to get icon for each frequency
  IconData _getFrequencyIcon(int index) {
    switch (index) {
      case 0:
        return Icons.looks_one;
      case 1:
        return Icons.looks_two;
      case 2:
        return Icons.looks_3;
      case 3:
        return Icons.looks_4;
      case 4:
        return Icons.schedule;
      case 5:
        return Icons.timer;
      case 6:
        return Icons.timer;
      case 7:
        return Icons.healing;
      default:
        return Icons.access_time;
    }
  }

  Future<void> _selectDate(BuildContext context, TextEditingController controller) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: DateTime.now(),
      firstDate: DateTime.now(),
      lastDate: DateTime.now().add(const Duration(days: 365 * 5)),
      builder: (context, child) {
        return Theme(
          data: Theme.of(context).copyWith(
            colorScheme: const ColorScheme.light(
              primary: Colors.blue,
              onPrimary: Colors.white,
              onSurface: Colors.black,
            ),
          ),
          child: child!,
        );
      },
    );
    if (picked != null) {
      setState(() {
        controller.text = "${picked.day.toString().padLeft(2, '0')}/"
            "${picked.month.toString().padLeft(2, '0')}/"
            "${picked.year}";
      });
    }
  }

  Future<void> _saveTreatment() async {
    final languageService = Provider.of<LanguageService>(context, listen: false);
    final isFrench = _isFrench(languageService);
    
    if (_medicationController.text.isEmpty) {
      _showError(isFrench 
          ? 'Veuillez entrer le nom du médicament'
          : 'Please enter medication name');
      return;
    }
    
    // Validate condition only if not pre-selected
    if (!_isConditionPreSelected && _selectedConditionId == null) {
      _showError(isFrench 
          ? 'Veuillez sélectionner une condition médicale'
          : 'Please select a medical condition');
      return;
    }
    
    if (_mainFrequency == null && _mealAnchors.isEmpty) {
      _showError(isFrench
          ? 'Veuillez sélectionner la fréquence'
          : 'Please select frequency');
      return;
    }
    if (_startDateController.text.isEmpty) {
      _showError(isFrench
          ? 'Veuillez sélectionner la date de début'
          : 'Please select start date');
      return;
    }

    setState(() => _isLoading = true);

    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');

      // Convert date from DD/MM/YYYY to YYYY-MM-DD
      final startParts = _startDateController.text.split('/');
      final startDate = '${startParts[2]}-${startParts[1]}-${startParts[0]}';
      
      String? endDate;
      if (_endDateController.text.isNotEmpty) {
        final endParts = _endDateController.text.split('/');
        endDate = '${endParts[2]}-${endParts[1]}-${endParts[0]}';
      }

      // Convert frequency to backend format (English)
      final backendFrequency = _getBackendFrequency();

      final response = await http.post(
        Uri.parse('${ApiConfig.baseUrl}/treatments'),
        headers: ApiConfig.getAuthHeaders(token!),
        body: jsonEncode({
          'condition_id': _selectedConditionId,
          'medication_name': _medicationController.text.trim(),
          'dosage': _dosageController.text.trim(),
          'frequency': backendFrequency,
          'priority': _priority,
          'start_date': startDate,
          'end_date': endDate,
        }),
      );

      final data = jsonDecode(response.body);

      if (response.statusCode == 201) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Row(
                children: [
                  const Icon(Icons.check_circle, color: Colors.white),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Text(
                      isFrench
                          ? '✅ Traitement ajouté avec succès!'
                          : '✅ Treatment added successfully!',
                    ),
                  ),
                ],
              ),
              backgroundColor: Colors.green,
              behavior: SnackBarBehavior.floating,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(10),
              ),
            ),
          );
          Navigator.pop(context);
        }
      } else {
        _showError(data['message'] ?? 'Erreur lors de l\'ajout');
      }
    } catch (e) {
      _showError('Erreur de connexion: $e');
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  void _showError(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Row(
          children: [
            const Icon(Icons.error, color: Colors.white),
            const SizedBox(width: 12),
            Expanded(child: Text(message)),
          ],
        ),
        backgroundColor: Colors.red,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(10),
        ),
      ),
    );
  }

  @override
  void dispose() {
    _medicationController.dispose();
    _dosageController.dispose();
    _startDateController.dispose();
    _endDateController.dispose();
    super.dispose();
  }
}