import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'dart:async';
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../config/api_config.dart';
import '../services/language_service.dart';

// ─────────────────────────────────────────────────────────────────────────────
// Common non-medication words — used only for hard rejection
// The list doesn't restrict entry — smart rules do
// ─────────────────────────────────────────────────────────────────────────────
const Set<String> _bannedWords = {
  'hello','hi','hey','good','bad','yes','no','ok','okay',
  'the','and','or','is','it','car','house','dog','cat',
  'food','water','fire','sun','moon','book','phone',
  'chair','door','window','tree','flower','bird','fish',
  'happy','sad','big','small','fast','slow','hot','cold',
  'man','woman','boy','girl','baby','love','hate','work',
  'play','run','eat','drink','sleep','walk','talk','read',
  'write','test','random','word','text','thing','stuff',
  'blah','abc','xyz','qwerty','aaa','bbb','ccc','ddd',
  // French
  'bonjour','salut','oui','non','merci','voiture','maison',
  'chien','chat','eau','feu','soleil','lune','livre',
  'chaise','porte','fenetre','arbre','fleur',
  'grand','petit','vite','lent','chaud','froid','homme',
  'femme','enfant','bebe','amour','travail','manger',
  'dormir','marcher','parler','lire','ecrire','mot','chose',
  // Arabic transliteration
  'salam','marhaba','naam','shukran','tayib',
};

// ─────────────────────────────────────────────────────────────────────────────
// Dosage ranges per unit
// ─────────────────────────────────────────────────────────────────────────────
const Map<String, Map<String, double>> _dosageRanges = {
  'mg':      {'min': 0.5,   'max': 3000},
  'g':       {'min': 0.001, 'max': 10},
  'ml':      {'min': 0.1,   'max': 500},
  'mcg':     {'min': 1,     'max': 2000},
  'µg':      {'min': 1,     'max': 2000},
  'ui':      {'min': 1,     'max': 100000},
  'iu':      {'min': 1,     'max': 100000},
  '%':       {'min': 0.01,  'max': 100},
  'mg/ml':   {'min': 0.1,   'max': 500},
  'mmol':    {'min': 0.1,   'max': 1000},
  'drops':   {'min': 1,     'max': 20},
  'gouttes': {'min': 1,     'max': 20},
};

class ManualEntryPage extends StatefulWidget {
  final Map<String, dynamic>? prefillData;
  const ManualEntryPage({super.key, this.prefillData});

  @override
  State<ManualEntryPage> createState() => _ManualEntryPageState();
}

class _ManualEntryPageState extends State<ManualEntryPage> {

  // Controllers
  final TextEditingController _medicationController = TextEditingController();
  final TextEditingController _dosageController     = TextEditingController();
  final TextEditingController _startDateController  = TextEditingController();
  final TextEditingController _endDateController    = TextEditingController();
  final FocusNode _medicationFocus                  = FocusNode();

  // Medication field state
  List<Map<String, dynamic>> _suggestions = []; // [{name, scientific_name, category, emoji}]
  bool   _showSuggestions   = false;
  bool   _isSearching       = false;   // spinner while fetching suggestions
  String? _medicationError;            // hard error → blocks save
  String? _medicationWarning;          // soft warning → allows save
  bool   _medicationAccepted = false;
  Timer? _debounceTimer;

  // Dosage
  String? _dosageError;

  // Form fields
  String? _mainFrequency;
  List<String> _mealAnchors          = [];
  String _priority                   = 'MEDIUM';
  int?   _selectedConditionId;
  String? _selectedConditionName;
  bool   _isLoading                  = false;
  bool   _isConditionPreSelected     = false;
  List<Map<String, dynamic>> _conditions = [];
  bool   _loadingConditions          = true;

  // Frequency lists
  final List<String> _frequencyBaseFr = [
    'Une fois par jour','Deux fois par jour','Trois fois par jour',
    'Quatre fois par jour','Toutes les 4 heures','Toutes les 6 heures',
    'Toutes les 8 heures','Toutes les 12 heures','Au besoin',
  ];
  final List<String> _frequencyBaseEn = [
    'Once daily','Twice daily','Three times daily','Four times daily',
    'Every 4 hours','Every 6 hours','Every 8 hours','Every 12 hours','As needed',
  ];
  final List<String> _mealAnchorsFr = [
    'Avant le petit-déjeuner','Après le petit-déjeuner',
    'Avant le déjeuner','Après le déjeuner',
    'Avant le dîner','Après le dîner','Avant de dormir',
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

  List<String> _getCurrentFrequencyBase(LanguageService ls) =>
      ls.getCurrentLanguage() == 'fr' ? _frequencyBaseFr : _frequencyBaseEn;
  List<String> _getCurrentMealAnchors(LanguageService ls) =>
      ls.getCurrentLanguage() == 'fr' ? _mealAnchorsFr : _mealAnchorsEn;
  bool _isFrench(LanguageService ls) => ls.getCurrentLanguage() == 'fr';

  String _getBackendFrequency() {
    final parts = <String>[];
    if (_mainFrequency != null) parts.add(_frToEnMap[_mainFrequency] ?? _mainFrequency!);
    for (var a in _mealAnchors) parts.add(_frToEnMap[a] ?? a);
    return parts.isEmpty ? 'Once daily' : parts.join(' + ');
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Init / Dispose
  // ─────────────────────────────────────────────────────────────────────────

  @override
  void initState() {
    super.initState();

    if (widget.prefillData != null && widget.prefillData!.containsKey('condition_id')) {
      _selectedConditionId    = widget.prefillData!['condition_id'];
      _selectedConditionName  = widget.prefillData!['condition_name'];
      _isConditionPreSelected = true;
    }
    _loadConditions();

    if (widget.prefillData != null) {
      final name = widget.prefillData!['medication_name'] ?? '';
      _medicationController.text = name;
      if (name.isNotEmpty) _medicationAccepted = true;
      _dosageController.text = widget.prefillData!['dosage'] ?? '';
      if (widget.prefillData!['duration_days'] != null) {
        final start = DateTime.now();
        final end   = start.add(Duration(days: widget.prefillData!['duration_days']));
        _startDateController.text = _formatDate(start);
        _endDateController.text   = _formatDate(end);
      }
    } else {
      _startDateController.text = _formatDate(DateTime.now());
    }

    _medicationController.addListener(_onMedicationChanged);
    _medicationFocus.addListener(() {
      if (!_medicationFocus.hasFocus) {
        Future.delayed(const Duration(milliseconds: 200), () {
          if (mounted) {
            setState(() => _showSuggestions = false);
            _validateMedicationFinal();
          }
        });
      }
    });
  }

  @override
  void dispose() {
    _debounceTimer?.cancel();
    _medicationController.removeListener(_onMedicationChanged);
    _medicationController.dispose();
    _dosageController.dispose();
    _startDateController.dispose();
    _endDateController.dispose();
    _medicationFocus.dispose();
    super.dispose();
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Medication name — smart validation rules
  // Returns hard error string or null if acceptable
  // Also sets _medicationWarning for soft warnings (not blocking)
  // ─────────────────────────────────────────────────────────────────────────

  String? _checkMedicationName(String raw, bool isFr) {
    final name = raw.trim();
    _medicationWarning = null; // reset soft warning

    // Rule 1: minimum length
    if (name.length < 3) {
      return isFr
          ? 'Le nom doit contenir au moins 3 caractères'
          : 'Name must be at least 3 characters';
    }

    // Rule 2: must start with a letter
    if (!RegExp(r'^[a-zA-ZÀ-ÿ]').hasMatch(name)) {
      return isFr
          ? 'Le nom doit commencer par une lettre'
          : 'Name must start with a letter';
    }

    // Rule 3: only letters, digits, spaces, hyphens, apostrophes, dots
    if (!RegExp(r"^[a-zA-ZÀ-ÿ0-9\s\-'\.+]+$").hasMatch(name)) {
      return isFr
          ? 'Caractères non autorisés (lettres, chiffres, tirets uniquement)'
          : 'Invalid characters (use letters, numbers, hyphens only)';
    }

    // Rule 4: max 4 words — medication names are not sentences
    final words = name.trim().split(RegExp(r'\s+'));
    if (words.length > 4) {
      return isFr
          ? 'Trop de mots — les médicaments ont au maximum 4 mots'
          : 'Too many words — medication names have at most 4 words';
    }

    // Rule 5: not a pure number
    if (RegExp(r'^\d+$').hasMatch(name)) {
      return isFr
          ? 'Entrez un nom de médicament, pas un nombre'
          : 'Please enter a medication name, not a number';
    }

    // Rule 6: not a known common word (check first word only)
    final firstWord = words.first.toLowerCase()
        .replaceAll(RegExp(r'[^a-z]'), '');
    if (_bannedWords.contains(firstWord) ||
        _bannedWords.contains(name.toLowerCase())) {
      return isFr
          ? '"$name" n\'est pas un nom de médicament valide'
          : '"$name" is not a valid medication name';
    }

    // Rule 7: repetitive keyboard spam (aaaa, 1234567)
    if (RegExp(r'^(.)\1{3,}$').hasMatch(name)) {
      return isFr ? 'Nom invalide' : 'Invalid name';
    }

    // Rule 8: looks like random letters only (no vowels at all, >4 chars)
    // Real medication names almost always have at least one vowel
    if (name.length > 4 &&
        !RegExp(r'[aeiouàâäéèêëîïôùûüÿæœ]', caseSensitive: false).hasMatch(name) &&
        !RegExp(r'\d').hasMatch(name)) {
      return isFr
          ? 'Ce nom ne ressemble pas à un médicament'
          : 'This does not look like a medication name';
    }

    // ── Soft warning (not blocking): not in our known list ───────────────────
    // The user CAN still save — we just inform them to double-check
    final inList = _suggestions.any(
      (s) => s['name'].toString().toLowerCase() == name.toLowerCase(),
    );
    if (!inList && _suggestions.isEmpty) {
      // Only show warning if no suggestions loaded yet (could still be valid)
      _medicationWarning = null;
    } else if (!inList) {
      _medicationWarning = isFr
          ? 'Ce médicament n\'est pas dans notre liste — vérifiez l\'orthographe'
          : 'This medication is not in our list — please double-check spelling';
    }

    return null; // passes all hard rules → accepted
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Autocomplete — fetches from backend /api/education/medications/names
  // ─────────────────────────────────────────────────────────────────────────

  void _onMedicationChanged() {
    final query = _medicationController.text.trim();

    setState(() {
      _medicationAccepted = false;
      _medicationError    = null;
      _medicationWarning  = null;
    });

    _debounceTimer?.cancel();

    if (query.length < 2) {
      setState(() { _suggestions = []; _showSuggestions = false; _isSearching = false; });
      return;
    }

    setState(() => _isSearching = true);

    _debounceTimer = Timer(const Duration(milliseconds: 300), () async {
      if (!mounted) return;
      try {
        final prefs = await SharedPreferences.getInstance();
        final token = prefs.getString('auth_token');

        final uri = Uri.parse('${ApiConfig.baseUrl}/education/medications/names')
            .replace(queryParameters: {'query': query});

        final response = await http.get(
          uri,
          headers: {'Authorization': 'Bearer $token'},
        ).timeout(const Duration(seconds: 4));

        if (!mounted) return;

        if (response.statusCode == 200) {
          final data = jsonDecode(response.body);
          final meds = List<Map<String, dynamic>>.from(data['medications'] ?? []);
          setState(() {
            _suggestions     = meds;
            _showSuggestions = meds.isNotEmpty;
            _isSearching     = false;
          });
        } else {
          setState(() { _isSearching = false; _showSuggestions = false; });
        }
      } catch (_) {
        if (mounted) setState(() { _isSearching = false; _showSuggestions = false; });
      }
    });
  }

  void _selectSuggestion(Map<String, dynamic> med) {
    final name = med['name'].toString();
    _medicationController.removeListener(_onMedicationChanged);
    _medicationController.text = name;
    _medicationController.selection =
        TextSelection.fromPosition(TextPosition(offset: name.length));
    _medicationController.addListener(_onMedicationChanged);
    setState(() {
      _suggestions       = [];
      _showSuggestions   = false;
      _isSearching       = false;
      _medicationError   = null;
      _medicationWarning = null;
      _medicationAccepted = true;
    });
    _medicationFocus.unfocus();
  }

  void _validateMedicationFinal() {
    final query = _medicationController.text.trim();
    if (query.isEmpty) return;
    final ls   = Provider.of<LanguageService>(context, listen: false);
    final isFr = _isFrench(ls);
    final err  = _checkMedicationName(query, isFr);
    setState(() {
      _medicationError    = err;
      _medicationAccepted = err == null;
    });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Dosage validation
  // ─────────────────────────────────────────────────────────────────────────

  String? _validateDosage(String raw, bool isFr) {
    if (raw.trim().isEmpty) return null;
    final pattern = RegExp(
      r'^(\d+(?:[.,]\d+)?)\s*(mg/ml|mg|mcg|µg|g|ml|ui|iu|%|mmol|drops|gouttes|comprimé|tablet|cp)?$',
      caseSensitive: false,
    );
    final match = pattern.firstMatch(raw.trim());
    if (match == null) {
      return isFr
          ? 'Format invalide. Exemples : 500mg, 1g, 50mcg, 10ml'
          : 'Invalid format. Examples: 500mg, 1g, 50mcg, 10ml';
    }
    final numberStr = match.group(1)!.replaceAll(',', '.');
    final unit      = (match.group(2) ?? '').toLowerCase();
    final value     = double.tryParse(numberStr);
    if (value == null || value <= 0) {
      return isFr ? 'La dose doit être supérieure à 0' : 'Dose must be greater than 0';
    }
    if (unit.isNotEmpty && _dosageRanges.containsKey(unit)) {
      final min = _dosageRanges[unit]!['min']!;
      final max = _dosageRanges[unit]!['max']!;
      if (value < min || value > max) {
        return isFr
            ? 'Dose inhabituelle : $value$unit — vérifiez avec votre médecin'
            : 'Unusual dose: $value$unit — please verify with your doctor';
      }
    }
    if (unit.isEmpty && value > 5000) {
      return isFr
          ? 'Valeur trop élevée. Oublié l\'unité ? (mg, ml, g…)'
          : 'Value too high. Forgot the unit? (mg, ml, g…)';
    }
    return null;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Data helpers
  // ─────────────────────────────────────────────────────────────────────────

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
          _conditions        = List<Map<String, dynamic>>.from(data['conditions']);
          _loadingConditions = false;
        });
      } else {
        setState(() => _loadingConditions = false);
      }
    } catch (e) {
      setState(() => _loadingConditions = false);
    }
  }

  String _formatDate(DateTime d) =>
      "${d.day.toString().padLeft(2,'0')}/${d.month.toString().padLeft(2,'0')}/${d.year}";

  // ─────────────────────────────────────────────────────────────────────────
  // BUILD
  // ─────────────────────────────────────────────────────────────────────────

  @override
  Widget build(BuildContext context) {
    final ls             = Provider.of<LanguageService>(context);
    final currentFreqBase= _getCurrentFrequencyBase(ls);
    final currentAnchors = _getCurrentMealAnchors(ls);
    final isFr           = _isFrench(ls);

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white, elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios, color: Colors.blue),
          onPressed: () => Navigator.pop(context),
        ),
        title: Text(ls.translate('manualEntry'),
            style: const TextStyle(color: Colors.blue, fontWeight: FontWeight.bold)),
      ),
      body: _loadingConditions
          ? const Center(child: CircularProgressIndicator())
          : GestureDetector(
              onTap: () { _medicationFocus.unfocus(); setState(() => _showSuggestions = false); },
              behavior: HitTestBehavior.translucent,
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Header
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(color: Colors.blue.shade50, borderRadius: BorderRadius.circular(16)),
                      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                        Text(ls.translate('medicationName'),
                            style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w600, color: Color(0xFF1A237E))),
                        const SizedBox(height: 4),
                        Text(ls.translate('helpUs'),
                            style: TextStyle(fontSize: 14, color: Colors.grey.shade700)),
                      ]),
                    ),
                    const SizedBox(height: 24),

                    // Condition
                    Row(children: [
                      _buildLabelWithIcon(Icons.medical_information, ls.translate('conditions')),
                      if (!_isConditionPreSelected)
                        const Text(' *', style: TextStyle(color: Colors.red, fontSize: 16, fontWeight: FontWeight.bold)),
                    ]),
                    const SizedBox(height: 8),
                    _buildConditionSelector(isFr),
                    const SizedBox(height: 20),

                    // Medication name
                    _buildLabelWithIcon(Icons.medication, ls.translate('medicationName')),
                    const SizedBox(height: 4),
                    // Hint text explaining the rules
                    Text(
                      isFr
                          ? 'Vous pouvez saisir n\'importe quel médicament — tapez pour voir les suggestions'
                          : 'You can enter any medication name — type to see suggestions from our list',
                      style: TextStyle(fontSize: 12, color: Colors.grey.shade500),
                    ),
                    const SizedBox(height: 8),
                    _buildMedicationField(isFr),
                    const SizedBox(height: 20),

                    // Dosage
                    _buildLabelWithIcon(Icons.science, ls.translate('dosage')),
                    const SizedBox(height: 8),
                    _buildDosageField(isFr),
                    const SizedBox(height: 20),

                    // Frequency
                    _buildLabelWithIcon(Icons.access_time, ls.translate('frequency')),
                    const SizedBox(height: 8),
                    _buildFrequencySelector(ls, currentFreqBase, currentAnchors),
                    const SizedBox(height: 20),

                    // Priority
                    _buildLabelWithIcon(Icons.priority_high, isFr ? 'Priorité' : 'Priority'),
                    const SizedBox(height: 8),
                    _buildPrioritySelector(isFr),
                    const SizedBox(height: 20),

                    // Start date
                    _buildLabelWithIcon(Icons.calendar_today, ls.translate('startDate')),
                    const SizedBox(height: 8),
                    _buildDatePickerField(controller: _startDateController,
                        onTap: () => _selectDate(context, _startDateController), icon: Icons.calendar_month),
                    const SizedBox(height: 20),

                    // End date
                    _buildLabelWithIcon(Icons.calendar_today, ls.translate('endDate')),
                    const SizedBox(height: 8),
                    _buildDatePickerField(controller: _endDateController,
                        onTap: () => _selectDate(context, _endDateController), icon: Icons.calendar_month),
                    const SizedBox(height: 32),

                    // Save button
                    _buildSaveButton(ls, isFr),
                    const SizedBox(height: 40),
                  ],
                ),
              ),
            ),
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Medication field widget
  // ─────────────────────────────────────────────────────────────────────────

  Widget _buildMedicationField(bool isFr) {
    Color borderColor = Colors.grey.shade300;
    double borderWidth = 1;
    if (_medicationError != null)                                  { borderColor = Colors.red.shade400;    borderWidth = 2; }
    else if (_medicationAccepted && _medicationWarning != null)    { borderColor = Colors.orange.shade400; borderWidth = 2; }
    else if (_medicationAccepted && _medicationWarning == null)    { borderColor = Colors.green.shade400;  borderWidth = 2; }

    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [

      // Input field
      Container(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(12),
          boxShadow: [BoxShadow(color: Colors.grey.withOpacity(0.1), blurRadius: 4, offset: const Offset(0, 2))],
        ),
        child: TextField(
          controller: _medicationController,
          focusNode: _medicationFocus,
          textCapitalization: TextCapitalization.words,
          decoration: InputDecoration(
            hintText: isFr ? 'ex: Glucophage, Coversyl, ou votre médicament…' : 'e.g., Glucophage, Coversyl, or your medication…',
            hintStyle: TextStyle(color: Colors.grey.shade400),
            prefixIcon: Icon(Icons.medication_outlined, color: Colors.blue.shade300),
            suffixIcon: _isSearching
                ? const Padding(
                    padding: EdgeInsets.all(12),
                    child: SizedBox(width: 20, height: 20,
                        child: CircularProgressIndicator(strokeWidth: 2, color: Colors.blue)))
                : _buildMedicationSuffixIcon(),
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide(color: Colors.grey.shade300)),
            enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide(color: borderColor, width: borderWidth)),
            focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12),
                borderSide: BorderSide(color: _medicationError != null ? Colors.red : Colors.blue, width: 2)),
            filled: true, fillColor: Colors.white,
            contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
          ),
        ),
      ),

      // Hard error
      if (_medicationError != null)
        _buildFeedbackRow(_medicationError!, Colors.red.shade600, Icons.cancel_outlined),

      // Soft warning (not blocking)
      if (_medicationError == null && _medicationWarning != null)
        _buildFeedbackRow(_medicationWarning!, Colors.orange.shade700, Icons.info_outline),

      // Success
      if (_medicationAccepted && _medicationError == null && _medicationWarning == null)
        _buildFeedbackRow(
          isFr ? 'Médicament reconnu ✓' : 'Medication recognized ✓',
          Colors.green.shade600, Icons.check_circle_outline,
        ),

      // Suggestions dropdown — from algerianMedications.js via backend
      if (_showSuggestions && _suggestions.isNotEmpty)
        _buildSuggestionsDropdown(),
    ]);
  }

  Widget? _buildMedicationSuffixIcon() {
    if (_medicationController.text.isEmpty) return null;
    if (_medicationError != null)   return const Icon(Icons.cancel, color: Colors.red);
    if (_medicationWarning != null) return const Icon(Icons.warning_amber_rounded, color: Colors.orange);
    if (_medicationAccepted)        return const Icon(Icons.check_circle, color: Colors.green);
    return Icon(Icons.search, color: Colors.blue.shade300);
  }

  Widget _buildFeedbackRow(String message, Color color, IconData icon) {
    return Padding(
      padding: const EdgeInsets.only(top: 6, left: 12),
      child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Icon(icon, color: color, size: 14),
        const SizedBox(width: 4),
        Expanded(child: Text(message, style: TextStyle(color: color, fontSize: 12))),
      ]),
    );
  }

  Widget _buildSuggestionsDropdown() {
    final query = _medicationController.text.trim().toLowerCase();
    return Container(
      margin: const EdgeInsets.only(top: 4),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.blue.shade100),
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.08), blurRadius: 12, offset: const Offset(0, 4))],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(12),
        child: Column(
          children: _suggestions.asMap().entries.map((entry) {
            final idx  = entry.key;
            final med  = entry.value;
            final name = med['name'].toString();
            final sciName  = med['scientific_name']?.toString() ?? '';
            final category = med['category']?.toString() ?? '';
            final emoji    = med['emoji']?.toString() ?? '💊';

            // Highlight matching letters
            final lowerName  = name.toLowerCase();
            final matchIdx   = lowerName.indexOf(query);

            return InkWell(
              onTap: () => _selectSuggestion(med),
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                decoration: BoxDecoration(
                  color: idx == 0 ? Colors.blue.shade50 : Colors.white,
                  border: idx < _suggestions.length - 1
                      ? Border(bottom: BorderSide(color: Colors.grey.shade100))
                      : null,
                ),
                child: Row(children: [
                  Text(emoji, style: const TextStyle(fontSize: 20)),
                  const SizedBox(width: 10),
                  Expanded(child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Name with highlighted match
                      matchIdx >= 0
                          ? RichText(text: TextSpan(
                              style: const TextStyle(color: Colors.black87, fontSize: 15, fontWeight: FontWeight.w500),
                              children: [
                                if (matchIdx > 0) TextSpan(text: name.substring(0, matchIdx)),
                                TextSpan(text: name.substring(matchIdx, matchIdx + query.length),
                                    style: TextStyle(color: Colors.blue.shade700, fontWeight: FontWeight.bold)),
                                if (matchIdx + query.length < name.length)
                                  TextSpan(text: name.substring(matchIdx + query.length)),
                              ],
                            ))
                          : Text(name, style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w500)),
                      // Scientific name + category
                      if (sciName.isNotEmpty)
                        Text('$sciName • $category',
                            style: TextStyle(fontSize: 11, color: Colors.grey.shade500)),
                    ],
                  )),
                  Icon(Icons.north_west, size: 14, color: Colors.grey.shade400),
                ]),
              ),
            );
          }).toList(),
        ),
      ),
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Dosage field widget
  // ─────────────────────────────────────────────────────────────────────────

  Widget _buildDosageField(bool isFr) {
    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Container(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(12),
          boxShadow: [BoxShadow(color: Colors.grey.withOpacity(0.1), blurRadius: 4, offset: const Offset(0, 2))],
        ),
        child: TextField(
          controller: _dosageController,
          keyboardType: const TextInputType.numberWithOptions(decimal: true),
          inputFormatters: [
            FilteringTextInputFormatter.allow(RegExp(r'[0-9.,a-zA-ZµéàèêüîôùûÉÀÈÊÜÎÔÙÛ\s/]')),
          ],
          onChanged: (val) => setState(() => _dosageError = _validateDosage(val, isFr)),
          decoration: InputDecoration(
            hintText: isFr ? 'ex: 500mg, 1g, 50mcg, 10ml' : 'e.g., 500mg, 1g, 50mcg, 10ml',
            hintStyle: TextStyle(color: Colors.grey.shade400),
            prefixIcon: Icon(Icons.science_outlined, color: Colors.blue.shade300),
            suffixIcon: _dosageController.text.isEmpty ? null
                : _dosageError == null
                    ? const Icon(Icons.check_circle, color: Colors.green)
                    : const Icon(Icons.warning_amber_rounded, color: Colors.orange),
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide(color: Colors.grey.shade300)),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: BorderSide(
                color: _dosageError != null ? Colors.orange.shade300
                    : _dosageController.text.isNotEmpty ? Colors.green.shade300
                    : Colors.grey.shade300,
                width: (_dosageError != null || _dosageController.text.isNotEmpty) ? 2 : 1,
              ),
            ),
            focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12),
                borderSide: BorderSide(color: _dosageError != null ? Colors.orange : Colors.blue, width: 2)),
            filled: true, fillColor: Colors.white,
            contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
          ),
        ),
      ),
      if (_dosageError != null)
        _buildFeedbackRow(_dosageError!, Colors.orange.shade700, Icons.warning_amber_rounded),

      // Quick unit chips
      if (_dosageController.text.isNotEmpty &&
          RegExp(r'^\d+$').hasMatch(_dosageController.text.trim()))
        Padding(
          padding: const EdgeInsets.only(top: 8),
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text(isFr ? 'Ajouter une unité :' : 'Add a unit:',
                style: TextStyle(fontSize: 11, color: Colors.grey.shade500)),
            const SizedBox(height: 4),
            Wrap(spacing: 6, children: ['mg', 'g', 'mcg', 'ml', 'UI'].map((unit) {
              return GestureDetector(
                onTap: () {
                  final newVal = '${_dosageController.text.trim()}$unit';
                  _dosageController.text = newVal;
                  _dosageController.selection = TextSelection.fromPosition(TextPosition(offset: newVal.length));
                  setState(() => _dosageError = _validateDosage(newVal, isFr));
                },
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: Colors.blue.shade50, borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: Colors.blue.shade200),
                  ),
                  child: Text(unit, style: TextStyle(fontSize: 12, color: Colors.blue.shade700, fontWeight: FontWeight.w500)),
                ),
              );
            }).toList()),
          ]),
        ),
    ]);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Save
  // ─────────────────────────────────────────────────────────────────────────

  Future<void> _saveTreatment() async {
    final ls      = Provider.of<LanguageService>(context, listen: false);
    final isFr    = _isFrench(ls);
    final medName = _medicationController.text.trim();

    if (medName.isEmpty) {
      _showError(isFr ? 'Veuillez entrer le nom du médicament' : 'Please enter medication name');
      return;
    }

    // Run hard validation
    final nameErr = _checkMedicationName(medName, isFr);
    if (nameErr != null) {
      setState(() { _medicationError = nameErr; _medicationAccepted = false; });
      _showError(nameErr);
      return;
    }

    // Condition
    if (!_isConditionPreSelected && _selectedConditionId == null) {
      _showError(isFr ? 'Veuillez sélectionner une condition médicale' : 'Please select a medical condition');
      return;
    }

    // Dosage
    final dosageErr = _validateDosage(_dosageController.text.trim(), isFr);
    if (dosageErr != null) {
      setState(() => _dosageError = dosageErr);
      _showError(isFr ? 'Veuillez corriger la dose' : 'Please fix the dosage');
      return;
    }

    // Frequency
    if (_mainFrequency == null && _mealAnchors.isEmpty) {
      _showError(isFr ? 'Veuillez sélectionner la fréquence' : 'Please select frequency');
      return;
    }
    if (_startDateController.text.isEmpty) {
      _showError(isFr ? 'Veuillez sélectionner la date de début' : 'Please select start date');
      return;
    }

    setState(() => _isLoading = true);
    try {
      final prefs  = await SharedPreferences.getInstance();
      final token  = prefs.getString('auth_token');
      final startP = _startDateController.text.split('/');
      final startDate = '${startP[2]}-${startP[1]}-${startP[0]}';
      String? endDate;
      if (_endDateController.text.isNotEmpty) {
        final e = _endDateController.text.split('/');
        endDate = '${e[2]}-${e[1]}-${e[0]}';
      }
      final response = await http.post(
        Uri.parse('${ApiConfig.baseUrl}/treatments'),
        headers: ApiConfig.getAuthHeaders(token!),
        body: jsonEncode({
          'condition_id':    _selectedConditionId,
          'medication_name': medName,
          'dosage':          _dosageController.text.trim(),
          'frequency':       _getBackendFrequency(),
          'priority':        _priority,
          'start_date':      startDate,
          'end_date':        endDate,
        }),
      );
      final data = jsonDecode(response.body);
      if (response.statusCode == 201) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(SnackBar(
            content: Row(children: [
              const Icon(Icons.check_circle, color: Colors.white), const SizedBox(width: 12),
              Expanded(child: Text(isFr ? '✅ Traitement ajouté avec succès!' : '✅ Treatment added successfully!')),
            ]),
            backgroundColor: Colors.green, behavior: SnackBarBehavior.floating,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
          ));
          Navigator.pop(context);
        }
      } else {
        _showError(data['message'] ?? 'Error');
      }
    } catch (e) {
      _showError('Connection error: $e');
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  void _showError(String message) {
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(
      content: Row(children: [
        const Icon(Icons.error, color: Colors.white), const SizedBox(width: 12),
        Expanded(child: Text(message)),
      ]),
      backgroundColor: Colors.red, behavior: SnackBarBehavior.floating,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
    ));
  }

  // ─────────────────────────────────────────────────────────────────────────
  // UI helpers
  // ─────────────────────────────────────────────────────────────────────────

  Widget _buildSaveButton(LanguageService ls, bool isFr) {
    return Container(
      width: double.infinity, height: 55,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(30),
        gradient: LinearGradient(colors: [Colors.blue.shade400, Colors.blue.shade700]),
        boxShadow: [BoxShadow(color: Colors.blue.withOpacity(0.3), blurRadius: 8, offset: const Offset(0, 4))],
      ),
      child: ElevatedButton(
        onPressed: _isLoading ? null : _saveTreatment,
        style: ElevatedButton.styleFrom(
          backgroundColor: Colors.transparent, foregroundColor: Colors.white,
          shadowColor: Colors.transparent,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(30)), elevation: 0,
        ),
        child: _isLoading
            ? const SizedBox(height: 24, width: 24, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
            : Row(mainAxisAlignment: MainAxisAlignment.center, children: [
                const Icon(Icons.save, size: 20), const SizedBox(width: 8),
                Text(ls.translate('save'), style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
              ]),
      ),
    );
  }

  Widget _buildConditionSelector(bool isFr) {
    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
        decoration: BoxDecoration(
          border: Border.all(color: !_isConditionPreSelected && _selectedConditionId == null ? Colors.red.shade200 : Colors.grey.shade300,
              width: !_isConditionPreSelected && _selectedConditionId == null ? 2 : 1),
          borderRadius: BorderRadius.circular(12), color: _isConditionPreSelected ? Colors.grey.shade50 : Colors.white,
          boxShadow: [BoxShadow(color: Colors.grey.withOpacity(0.1), blurRadius: 4, offset: const Offset(0, 2))],
        ),
        child: _isConditionPreSelected
            ? Padding(padding: const EdgeInsets.symmetric(vertical: 16), child: Row(children: [
                Container(padding: const EdgeInsets.all(8), child: Icon(Icons.medical_information, color: Colors.grey.shade600)),
                const SizedBox(width: 8),
                Expanded(child: Text(_selectedConditionName ?? 'Unknown',
                    style: TextStyle(color: Colors.grey.shade700, fontSize: 16, fontWeight: FontWeight.w500))),
                Container(padding: const EdgeInsets.all(8), child: const Icon(Icons.lock, color: Colors.grey, size: 18)),
              ]))
            : DropdownButtonHideUnderline(child: DropdownButton<int>(
                value: _selectedConditionId,
                hint: Text(isFr ? 'Sélectionnez une condition' : 'Select condition',
                    style: TextStyle(color: _selectedConditionId == null ? Colors.grey.shade400 : Colors.black)),
                icon: const Icon(Icons.arrow_drop_down, color: Colors.blue),
                isExpanded: true,
                items: _conditions.map((c) => DropdownMenuItem<int>(value: c['id'], child: Text(c['name']))).toList(),
                onChanged: (v) => setState(() => _selectedConditionId = v),
              )),
      ),
      if (_isConditionPreSelected)
        Padding(padding: const EdgeInsets.only(top: 4, left: 12),
            child: Text(isFr ? 'Condition verrouillée' : 'Locked condition',
                style: TextStyle(fontSize: 12, color: Colors.grey.shade600, fontStyle: FontStyle.italic))),
    ]);
  }

  Widget _buildFrequencySelector(LanguageService ls, List<String> baseFreqs, List<String> anchors) {
    final parts = <String>[];
    if (_mainFrequency != null) parts.add(_mainFrequency!);
    parts.addAll(_mealAnchors);
    final displayText = parts.isEmpty ? ls.translate('selectFrequency') : parts.join(', ');
    return GestureDetector(
      onTap: () => _showSmartFrequencySelector(ls, baseFreqs, anchors),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        decoration: BoxDecoration(border: Border.all(color: Colors.grey.shade300), borderRadius: BorderRadius.circular(12), color: Colors.white),
        child: Row(children: [
          Icon(Icons.access_time, color: Colors.blue.shade300), const SizedBox(width: 8),
          Expanded(child: Text(displayText, maxLines: 2, overflow: TextOverflow.ellipsis)),
          const Icon(Icons.arrow_drop_down, color: Colors.blue),
        ]),
      ),
    );
  }

  void _showSmartFrequencySelector(LanguageService ls, List<String> baseFreqs, List<String> anchors) {
    showModalBottomSheet(
      context: context, isScrollControlled: true,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(25))),
      builder: (context) => StatefulBuilder(builder: (context, setModalState) {
        final mainFreqEn = _mainFrequency != null ? _frToEnMap[_mainFrequency] ?? _mainFrequency : null;
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
            Text(ls.translate('selectFrequency'), style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
            const Divider(),
            Expanded(child: ListView(children: [
              _buildSectionTitle(_isFrench(ls) ? 'Fréquence' : 'Frequency'),
              ...baseFreqs.asMap().entries.map((e) {
                final idx = e.key; final f = e.value;
                return RadioListTile<String>(
                  secondary: Icon(_getFrequencyIcon(idx), color: _mainFrequency == f ? Colors.blue : Colors.grey),
                  title: Text(f), value: f, groupValue: _mainFrequency, activeColor: Colors.blue,
                  onChanged: (val) {
                    if (val == null) return;
                    setModalState(() {
                      _mainFrequency = val;
                      final valEn = _frToEnMap[val] ?? val;
                      if (valEn == 'Three times daily') {
                        _mealAnchors = [anchors[1], anchors[3], anchors[5]];
                      } else if (valEn.contains('Every') || valEn == 'As needed' || valEn == 'Four times daily') {
                        _mealAnchors = [];
                      } else {
                        int newMax = 99;
                        if (valEn == 'Once daily') newMax = 1;
                        else if (valEn == 'Twice daily') newMax = 2;
                        if (_mealAnchors.length > newMax) _mealAnchors = _mealAnchors.sublist(0, newMax);
                      }
                    });
                    setState(() {});
                  },
                );
              }),
              const SizedBox(height: 20),
              _buildSectionTitle(_isFrench(ls) ? 'Moment (Repas)' : 'Timing (Meals)'),
              if (isInterval) Padding(padding: const EdgeInsets.all(16),
                  child: Text(_isFrench(ls) ? 'Indisponible pour cette fréquence' : 'Unavailable for this frequency',
                      style: TextStyle(color: Colors.grey.shade500, fontStyle: FontStyle.italic)))
              else if (isThreeTimes) Padding(padding: const EdgeInsets.all(16),
                  child: Text(_isFrench(ls) ? 'Auto-sélectionné pour 3 fois/jour' : 'Auto-selected for 3 times/day',
                      style: const TextStyle(color: Colors.blue, fontWeight: FontWeight.bold)))
              else ...anchors.map((a) {
                final isSelected = _mealAnchors.contains(a);
                final isDisabled = !isSelected && _mealAnchors.length >= maxAnchors;
                return CheckboxListTile(
                  title: Text(a, style: TextStyle(color: isDisabled ? Colors.grey : Colors.black)),
                  value: isSelected, activeColor: Colors.blue,
                  onChanged: isDisabled ? null : (val) {
                    setModalState(() { if (val == true) _mealAnchors.add(a); else _mealAnchors.remove(a); });
                    setState(() {});
                  },
                );
              }),
            ])),
            Padding(padding: const EdgeInsets.symmetric(vertical: 20),
              child: SizedBox(width: double.infinity, height: 50,
                child: ElevatedButton(onPressed: () => Navigator.pop(context),
                  style: ElevatedButton.styleFrom(backgroundColor: Colors.blue, foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12))),
                  child: Text(ls.translate('confirm'), style: const TextStyle(fontWeight: FontWeight.bold))),
              )),
          ]),
        );
      }),
    );
  }

  Widget _buildPrioritySelector(bool isFr) => Container(
    padding: const EdgeInsets.all(4),
    decoration: BoxDecoration(color: Colors.grey.shade100, borderRadius: BorderRadius.circular(12)),
    child: Row(children: [
      _buildPriorityOption('LOW',    isFr ? 'Basse'   : 'Low',    Colors.green),
      _buildPriorityOption('MEDIUM', isFr ? 'Moyenne' : 'Medium', Colors.orange),
      _buildPriorityOption('HIGH',   isFr ? 'Haute'   : 'High',   Colors.red),
    ]),
  );

  Widget _buildPriorityOption(String value, String label, Color color) {
    final isSelected = _priority == value;
    return Expanded(child: GestureDetector(
      onTap: () => setState(() => _priority = value),
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 12),
        decoration: BoxDecoration(
          color: isSelected ? color : Colors.transparent, borderRadius: BorderRadius.circular(10),
          boxShadow: isSelected ? [BoxShadow(color: color.withOpacity(0.3), blurRadius: 4, offset: const Offset(0, 2))] : null,
        ),
        child: Text(label, textAlign: TextAlign.center,
            style: TextStyle(color: isSelected ? Colors.white : Colors.grey.shade600,
                fontWeight: isSelected ? FontWeight.bold : FontWeight.normal)),
      ),
    ));
  }

  Widget _buildSectionTitle(String title) => Padding(
    padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 16),
    child: Text(title, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.blue)),
  );

  Widget _buildLabelWithIcon(IconData icon, String label) => Row(children: [
    Container(padding: const EdgeInsets.all(4),
        decoration: BoxDecoration(color: Colors.blue.withOpacity(0.1), borderRadius: BorderRadius.circular(6)),
        child: Icon(icon, color: Colors.blue, size: 18)),
    const SizedBox(width: 8),
    Text(label, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: Color(0xFF1A237E))),
  ]);

  Widget _buildDatePickerField({required TextEditingController controller, required VoidCallback onTap, required IconData icon}) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
        decoration: BoxDecoration(border: Border.all(color: Colors.grey.shade300), borderRadius: BorderRadius.circular(12),
            color: Colors.white, boxShadow: [BoxShadow(color: Colors.grey.withOpacity(0.1), blurRadius: 4, offset: const Offset(0, 2))]),
        child: Row(children: [
          Container(padding: const EdgeInsets.all(8), child: Icon(icon, color: Colors.blue.shade300)),
          const SizedBox(width: 8),
          Expanded(child: Text(controller.text.isEmpty ? 'dd/mm/yyyy' : controller.text,
              style: TextStyle(color: controller.text.isEmpty ? Colors.grey.shade400 : Colors.black, fontSize: 16))),
          Container(padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(color: Colors.blue.withOpacity(0.1), borderRadius: BorderRadius.circular(8)),
              child: const Icon(Icons.arrow_drop_down, color: Colors.blue)),
        ]),
      ),
    );
  }

  IconData _getFrequencyIcon(int i) {
    switch (i) {
      case 0: return Icons.looks_one;   case 1: return Icons.looks_two;
      case 2: return Icons.looks_3;     case 3: return Icons.looks_4;
      case 4: return Icons.schedule;    case 5: return Icons.timer;
      case 6: return Icons.timer;       case 7: return Icons.healing;
      default: return Icons.access_time;
    }
  }

  Future<void> _selectDate(BuildContext context, TextEditingController c) async {
    final picked = await showDatePicker(
      context: context, initialDate: DateTime.now(),
      firstDate: DateTime.now(), lastDate: DateTime.now().add(const Duration(days: 365 * 5)),
      builder: (context, child) => Theme(
        data: Theme.of(context).copyWith(colorScheme: const ColorScheme.light(
            primary: Colors.blue, onPrimary: Colors.white, onSurface: Colors.black)),
        child: child!,
      ),
    );
    if (picked != null) {
      setState(() {
        c.text = "${picked.day.toString().padLeft(2,'0')}/${picked.month.toString().padLeft(2,'0')}/${picked.year}";
      });
    }
  }
}