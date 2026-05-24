import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:provider/provider.dart';
import '../services/condition_service.dart';
import '../services/language_service.dart';
import '../config/api_config.dart';
import 'condition_detail_page.dart';

class ConditionsListPage extends StatefulWidget {
  const ConditionsListPage({super.key});

  @override
  State<ConditionsListPage> createState() => _ConditionsListPageState();
}

class _ConditionsListPageState extends State<ConditionsListPage> {
  bool _isLoading = true;
  List<dynamic> _conditions = [];

  final TextEditingController _searchController = TextEditingController();
  List<Map<String, dynamic>> _availableConditions = [];
  List<Map<String, dynamic>> _filteredConditions = [];
  List<int> _selectedConditionIds = [];
  List<String> _selectedConditionNames = [];
  bool _loadingAvailableConditions = false;
  bool _hasLoadedAvailableConditions = false;

  @override
  void initState() {
    super.initState();
    _loadConditions();
    _loadAvailableConditions();
    _searchController.addListener(_filterConditions);
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  // ── translation ───────────────────────────────────────────────────────────

   String _translateConditionName(String name, LanguageService lang) {
    switch (name) {
      // ── existing ──────────────────────────────────────────────────────────
      case 'Diabetes Type 1':       return lang.translate('diabetesType1');
      case 'Diabetes Type 2':       return lang.translate('diabetesType2');
      case 'Hypertension':          return lang.translate('hypertension');
      case 'Asthma':                return lang.translate('asthma');
      case 'Heart Disease':         return lang.translate('heartDisease');
      case 'High Cholesterol':      return lang.translate('cholesterol');
      case 'COPD':                  return lang.translate('copd');
      case 'Arthritis':             return lang.translate('arthritis');
      case 'Thyroid Disorder':      return lang.translate('thyroidDisorder');
 
      // ── cardiovascular ────────────────────────────────────────────────────
      case 'Heart Failure':             return lang.translate('heartFailure');
      case 'Atrial Fibrillation':       return lang.translate('atrialFibrillation');
      case 'Coronary Artery Disease':   return lang.translate('coronaryArteryDisease');
      case 'Stroke':                    return lang.translate('stroke');
      case 'Peripheral Arterial Disease': return lang.translate('peripheralArterialDisease');
      case 'Deep Vein Thrombosis':      return lang.translate('deepVeinThrombosis');
 
      // ── metabolic / endocrine ─────────────────────────────────────────────
      case 'Obesity':               return lang.translate('obesity');
      case 'Gout':                  return lang.translate('gout');
      case 'Osteoporosis':          return lang.translate('osteoporosis');
      case 'Vitamin D Deficiency':  return lang.translate('vitaminDDeficiency');
      case 'Iron Deficiency Anemia': return lang.translate('ironDeficiencyAnemia');
      case 'Anemia':                return lang.translate('anemia');
      case 'Metabolic Syndrome':    return lang.translate('metabolicSyndrome');
 
      // ── renal ─────────────────────────────────────────────────────────────
      case 'Chronic Kidney Disease': return lang.translate('chronicKidneyDisease');
      case 'Kidney Stones':          return lang.translate('kidneyStones');
 
      // ── neurological ──────────────────────────────────────────────────────
      case 'Alzheimer Disease':     return lang.translate('alzheimerDisease');
      case 'Parkinson Disease':     return lang.translate('parkinsonDisease');
      case 'Epilepsy':              return lang.translate('epilepsy');
      case 'Diabetic Neuropathy':   return lang.translate('diabeticNeuropathy');
      case 'Migraine':              return lang.translate('migraine');
      case 'Essential Tremor':      return lang.translate('essentialTremor');
 
      // ── musculoskeletal ───────────────────────────────────────────────────
      case 'Osteoarthritis':        return lang.translate('osteoarthritis');
      case 'Rheumatoid Arthritis':  return lang.translate('rheumatoidArthritis');
      case 'Chronic Back Pain':     return lang.translate('chronicBackPain');
      case 'Sciatica':              return lang.translate('sciatica');
      case 'Fibromyalgia':          return lang.translate('fibromyalgia');
 
      // ── respiratory ───────────────────────────────────────────────────────
      case 'Chronic Bronchitis':    return lang.translate('chronicBronchitis');
      case 'Tuberculosis':          return lang.translate('tuberculosis');
      case 'Sleep Apnea':           return lang.translate('sleepApnea');
      case 'Allergic Rhinitis':     return lang.translate('allergicRhinitis');
      case 'Pulmonary Embolism':    return lang.translate('pulmonaryEmbolism');
 
      // ── digestive / hepatic ───────────────────────────────────────────────
      case 'Gastroesophageal Reflux':  return lang.translate('gastroesophagealReflux');
      case 'Peptic Ulcer Disease':     return lang.translate('pepticUlcerDisease');
      case 'Irritable Bowel Syndrome': return lang.translate('irritableBowelSyndrome');
      case 'Chronic Liver Disease':    return lang.translate('chronicLiverDisease');
      case 'Hepatitis B':              return lang.translate('hepatitisB');
      case 'Hepatitis C':              return lang.translate('hepatitisC');
      case 'Crohn Disease':            return lang.translate('crohnDisease');
      case 'Ulcerative Colitis':       return lang.translate('ulcerativeColitis');
      case 'Gallstones':               return lang.translate('gallstones');
 
      // ── mental health ─────────────────────────────────────────────────────
      case 'Depression':            return lang.translate('depression');
      case 'Anxiety Disorder':      return lang.translate('anxietyDisorder');
      case 'Insomnia':              return lang.translate('insomnia');
      case 'Bipolar Disorder':      return lang.translate('bipolarDisorder');
      case 'Schizophrenia':         return lang.translate('schizophrenia');
 
      // ── ophthalmology ─────────────────────────────────────────────────────
      case 'Glaucoma':              return lang.translate('glaucoma');
      case 'Cataracts':             return lang.translate('cataracts');
      case 'Diabetic Retinopathy':  return lang.translate('diabeticRetinopathy');
      case 'Macular Degeneration':  return lang.translate('macularDegeneration');
 
      // ── oncology ──────────────────────────────────────────────────────────
      case 'Prostate Cancer':       return lang.translate('prostateCancer');
      case 'Breast Cancer':         return lang.translate('breastCancer');
      case 'Colon Cancer':          return lang.translate('colonCancer');
      case 'Lung Cancer':           return lang.translate('lungCancer');
      case 'Cervical Cancer':       return lang.translate('cervicalCancer');
 
      // ── dermatology ───────────────────────────────────────────────────────
      case 'Psoriasis':             return lang.translate('psoriasis');
      case 'Eczema':                return lang.translate('eczema');
      case 'Chronic Urticaria':     return lang.translate('chronicUrticaria');
 
      // ── urology / gynecology ──────────────────────────────────────────────
      case 'Benign Prostatic Hyperplasia': return lang.translate('benignProstaticHyperplasia');
      case 'Urinary Incontinence':         return lang.translate('urinaryIncontinence');
      case 'Chronic Urinary Tract Infection': return lang.translate('chronicUrinaryTractInfection');
      case 'Endometriosis':                return lang.translate('endometriosis');
      case 'Menopause':                    return lang.translate('menopause');
 
      // ── other ─────────────────────────────────────────────────────────────
      case 'Varicose Veins':        return lang.translate('varicoseVeins');
      case 'Hemorrhoids':           return lang.translate('hemorrhoids');
      case 'Chronic Pain Syndrome': return lang.translate('chronicPainSyndrome');
      case 'Autoimmune Disease':    return lang.translate('autoimmuneDisease');
      case 'Lupus':                 return lang.translate('lupus');
      case 'Multiple Sclerosis':    return lang.translate('multipleSclerosis');
      case 'Hearing Loss':          return lang.translate('hearingLoss');
      case 'Tinnitus':              return lang.translate('tinnitus');
      case 'Vertigo':               return lang.translate('vertigo');
 
      default: return name;
    }
  }

  // ── condition icon + color per type ──────────────────────────────────────

  String _iconForCondition(String name) {
    final n = name.toLowerCase();
    // cardiovascular
    if (n.contains('heart failure') || n.contains('insuffisance cardiaque')) return '🫀';
    if (n.contains('atrial') || n.contains('fibrillation'))                  return '💓';
    if (n.contains('coronary') || n.contains('coronarien'))                  return '🫀';
    if (n.contains('hypertension') || n.contains('blood pressure'))          return '❤️';
    if (n.contains('heart') || n.contains('cardiac') || n.contains('cardio')) return '❤️';
    if (n.contains('stroke') || n.contains('avc') || n.contains('cerebro'))  return '🧠';
    if (n.contains('artery') || n.contains('arterial') || n.contains('vein') || n.contains('varic')) return '🩸';
    if (n.contains('thrombosis') || n.contains('embolism'))                  return '🩸';
    if (n.contains('cholesterol') || n.contains('lipid'))                    return '🫀';
    // diabetes / metabolic
    if (n.contains('diabetes') || n.contains('diabète'))                     return '🩸';
    if (n.contains('obesity') || n.contains('obésité'))                      return '⚖️';
    if (n.contains('gout') || n.contains('goutte'))                          return '🦶';
    if (n.contains('metabolic') || n.contains('métabol'))                    return '⚗️';
    if (n.contains('vitamin d') || n.contains('vitamine d'))                 return '☀️';
    if (n.contains('anemia') || n.contains('anémie') || n.contains('iron')) return '💊';
    // thyroid / endocrine
    if (n.contains('thyroid') || n.contains('thyroïd'))                      return '🦋';
    // renal
    if (n.contains('kidney') || n.contains('renal') || n.contains('rein'))   return '🫘';
    // neurological
    if (n.contains('alzheimer') || n.contains('dementia') || n.contains('démence')) return '🧠';
    if (n.contains('parkinson'))                                              return '🧠';
    if (n.contains('epilep') || n.contains('épilep') || n.contains('seizure')) return '⚡';
    if (n.contains('neuropath'))                                              return '⚡';
    if (n.contains('migraine'))                                               return '🤕';
    if (n.contains('tremor') || n.contains('tremblement'))                   return '🤲';
    if (n.contains('sclerosis') || n.contains('sclérose'))                   return '🧠';
    if (n.contains('vertigo') || n.contains('vertige'))                      return '💫';
    // musculoskeletal
    if (n.contains('osteoporosis') || n.contains('ostéoporose'))             return '🦴';
    if (n.contains('osteoarth') || n.contains('arthrose'))                   return '🦵';
    if (n.contains('arthritis') || n.contains('arthrite'))                   return '🦵';
    if (n.contains('back pain') || n.contains('lombalgies') || n.contains('sciatica') || n.contains('sciatique')) return '🔙';
    if (n.contains('fibromyalgia') || n.contains('fibromyalgie'))            return '💢';
    // respiratory
    if (n.contains('asthma') || n.contains('asthme') || n.contains('copd') || n.contains('bronch')) return '🫁';
    if (n.contains('tuberculosis') || n.contains('tuberculose'))             return '🫁';
    if (n.contains('sleep apnea') || n.contains('apnée'))                   return '😴';
    if (n.contains('rhinitis') || n.contains('rhinite') || n.contains('allerg')) return '🤧';
    // digestive
    if (n.contains('reflux') || n.contains('gerd') || n.contains('ulcer') || n.contains('ulcère')) return '🫃';
    if (n.contains('bowel') || n.contains('intestin') || n.contains('crohn') || n.contains('colitis')) return '🫃';
    if (n.contains('liver') || n.contains('hepat') || n.contains('foie'))   return '🟤';
    if (n.contains('gallstone') || n.contains('biliaire'))                  return '🫐';
    // mental health
    if (n.contains('depression') || n.contains('dépression'))               return '🌧️';
    if (n.contains('anxiety') || n.contains('anxiété'))                     return '😰';
    if (n.contains('insomnia') || n.contains('insomnie'))                   return '🌙';
    if (n.contains('bipolar') || n.contains('bipolaire') || n.contains('schizo')) return '🧠';
    // ophthalmology
    if (n.contains('glaucoma') || n.contains('glaucome') || n.contains('cataract') || n.contains('retino') || n.contains('macular')) return '👁️';
    // cancer
    if (n.contains('cancer') || n.contains('tumor'))                        return '🎗️';
    // dermatology
    if (n.contains('psoriasis') || n.contains('eczema') || n.contains('urticaria')) return '🧴';
    // urology / gynecology
    if (n.contains('prostat'))                                               return '🫧';
    if (n.contains('urinary') || n.contains('urinaire'))                    return '🚿';
    if (n.contains('endometriosis') || n.contains('endométriose') || n.contains('menopause') || n.contains('ménopause')) return '🌸';
    // hearing
    if (n.contains('hearing') || n.contains('surdité') || n.contains('tinnitus') || n.contains('acouphène')) return '👂';
    // pain
    if (n.contains('pain') || n.contains('douleur'))                        return '💢';
    // autoimmune
    if (n.contains('autoimmune') || n.contains('auto-immune') || n.contains('lupus')) return '🛡️';
    // hemorrhoids / varicose
    if (n.contains('hemorrhoid') || n.contains('hémorroïde') || n.contains('varicose') || n.contains('varice')) return '🩹';
    return '💊';
  }

Color _bgColorForCondition(String name) {
    final n = name.toLowerCase();
    if (n.contains('heart') || n.contains('cardio') || n.contains('hypertension') ||
        n.contains('coronary') || n.contains('atrial') || n.contains('stroke') ||
        n.contains('avc') || n.contains('cholesterol'))        return const Color(0xFFE6F1FB);
    if (n.contains('diabetes') || n.contains('diabète') ||
        n.contains('obesity') || n.contains('metabolic') ||
        n.contains('gout') || n.contains('anemia'))            return const Color(0xFFFAEEDA);
    if (n.contains('asthma') || n.contains('copd') ||
        n.contains('bronch') || n.contains('pulmon') ||
        n.contains('respiratory') || n.contains('sleep apnea') ||
        n.contains('rhinitis'))                                 return const Color(0xFFEAF3DE);
    if (n.contains('thyroid') || n.contains('thyroïd'))        return const Color(0xFFEEEDFE);
    if (n.contains('arthritis') || n.contains('arthrose') ||
        n.contains('osteo') || n.contains('bone') ||
        n.contains('back') || n.contains('fibro') ||
        n.contains('sciatica'))                                 return const Color(0xFFF1EFE8);
    if (n.contains('kidney') || n.contains('renal') ||
        n.contains('rein'))                                     return const Color(0xFFE1F5EE);
    if (n.contains('brain') || n.contains('neuro') ||
        n.contains('alzheimer') || n.contains('parkinson') ||
        n.contains('epilep') || n.contains('migraine') ||
        n.contains('mental') || n.contains('depression') ||
        n.contains('anxiety') || n.contains('insomnia') ||
        n.contains('sclerosis'))                                return const Color(0xFFFBEAF0);
    if (n.contains('liver') || n.contains('hepat') ||
        n.contains('digestive') || n.contains('bowel') ||
        n.contains('reflux') || n.contains('ulcer'))           return const Color(0xFFFAEEDA);
    if (n.contains('eye') || n.contains('glaucoma') ||
        n.contains('cataract') || n.contains('retino') ||
        n.contains('vision'))                                   return const Color(0xFFE6F1FB);
    if (n.contains('cancer') || n.contains('tumor'))           return const Color(0xFFFCEBEB);
    if (n.contains('skin') || n.contains('psoriasis') ||
        n.contains('eczema'))                                   return const Color(0xFFFBEAF0);
    return const Color(0xFFEEEDFE);
  }

  // ── adherence helpers ─────────────────────────────────────────────────────

  Color _adherenceColor(int pct) {
    if (pct >= 80) return const Color(0xFF639922);
    if (pct >= 50) return const Color(0xFFBA7517);
    return const Color(0xFFE24B4A);
  }

  Color _adherenceBgColor(int pct) {
    if (pct >= 80) return const Color(0xFFEAF3DE);
    if (pct >= 50) return const Color(0xFFFAEEDA);
    return const Color(0xFFFCEBEB);
  }

  String _adherenceLabel(int pct, bool isFr) {
    if (pct >= 80) return isFr ? 'Bon'    : 'Good';
    if (pct >= 50) return isFr ? 'Moyen'  : 'Fair';
    return isFr ? 'Faible' : 'Low';
  }

  // ── stats computed from _conditions ──────────────────────────────────────

   int get _totalMedications => _conditions.fold(
    0, (sum, c) => sum + (int.tryParse(c['medication_count']?.toString() ?? '0') ?? 0));

   int get _averageAdherence {
  if (_conditions.isEmpty) return 0;
  final total = _conditions.fold(
      0, (sum, c) => sum + (int.tryParse(c['adherence_rate']?.toString() ?? '0') ?? 0));
  return (total / _conditions.length).round();
}

  // ── data loading ──────────────────────────────────────────────────────────

  Future<void> _loadConditions() async {
    setState(() => _isLoading = true);
    try {
      final conditions = await ConditionService.getPatientConditions();
      setState(() { _conditions = conditions; _isLoading = false; });
    } catch (e) {
      setState(() => _isLoading = false);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error loading conditions: $e')));
      }
    }
  }

  Future<void> _loadAvailableConditions() async {
    if (_hasLoadedAvailableConditions && _availableConditions.isNotEmpty) {
      setState(() => _filteredConditions = _availableConditions);
      return;
    }
    setState(() => _loadingAvailableConditions = true);
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');
      final response = await http.get(
        Uri.parse('${ApiConfig.baseUrl}/conditions/available'),
        headers: {'Authorization': 'Bearer $token'},
      );
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        setState(() {
          _availableConditions     = List<Map<String, dynamic>>.from(data['data']);
          _filteredConditions      = _availableConditions;
          _loadingAvailableConditions = false;
          _hasLoadedAvailableConditions = true;
        });
      }
    } catch (e) {
      setState(() => _loadingAvailableConditions = false);
    }
  }

  void _filterConditions() {
    setState(() {
      _filteredConditions = _availableConditions
          .where((c) => c['name'].toLowerCase().contains(_searchController.text.toLowerCase()))
          .toList();
    });
  }

  // ── add condition sheet ───────────────────────────────────────────────────

  void _showAddConditionDialog() {
    _selectedConditionIds.clear();
    _selectedConditionNames.clear();
    _searchController.clear();
    final ls = Provider.of<LanguageService>(context, listen: false);

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => StatefulBuilder(builder: (ctx, setModal) {
        return Container(
          height: MediaQuery.of(context).size.height * 0.75,
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
          ),
          child: Column(children: [
            // handle
            const SizedBox(height: 12),
            Container(width: 40, height: 4,
                decoration: BoxDecoration(color: Colors.grey.shade300, borderRadius: BorderRadius.circular(2))),
            const SizedBox(height: 16),

            // header
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: Row(children: [
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(color: Colors.blue.shade50, borderRadius: BorderRadius.circular(10)),
                  child: const Icon(Icons.add_circle_outline, color: Colors.blue, size: 22),
                ),
                const SizedBox(width: 12),
                Expanded(child: Text(ls.translate('selectCondition'),
                    style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFF1A237E)))),
                GestureDetector(
                  onTap: () => Navigator.pop(ctx),
                  child: Container(
                    padding: const EdgeInsets.all(6),
                    decoration: BoxDecoration(color: Colors.grey.shade100, borderRadius: BorderRadius.circular(8)),
                    child: const Icon(Icons.close, size: 18, color: Colors.grey),
                  ),
                ),
              ]),
            ),
            const SizedBox(height: 16),

            // search
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: TextField(
                controller: _searchController,
                onChanged: (_) => setModal(() {}),
                decoration: InputDecoration(
                  hintText: ls.translate('searchConditions'),
                  hintStyle: TextStyle(color: Colors.grey.shade400),
                  prefixIcon: Icon(Icons.search, color: Colors.blue.shade300),
                  filled: true, fillColor: Colors.grey.shade50,
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
                  enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide(color: Colors.grey.shade200)),
                  focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Colors.blue, width: 1.5)),
                  contentPadding: const EdgeInsets.symmetric(vertical: 12),
                ),
              ),
            ),
            const SizedBox(height: 12),

            // list
            Expanded(child: _availableConditions.isEmpty && _loadingAvailableConditions
                ? const Center(child: CircularProgressIndicator(color: Colors.blue))
                : _filteredConditions.isEmpty
                    ? Center(child: Column(mainAxisSize: MainAxisSize.min, children: [
                        Icon(Icons.search_off, size: 48, color: Colors.grey.shade300),
                        const SizedBox(height: 12),
                        Text('No results found', style: TextStyle(color: Colors.grey.shade500)),
                      ]))
                    : ListView.separated(
                        padding: const EdgeInsets.symmetric(horizontal: 16),
                        itemCount: _filteredConditions.length,
                        separatorBuilder: (_, __) => Divider(height: 1, color: Colors.grey.shade100),
                        itemBuilder: (_, i) {
                          final cond      = _filteredConditions[i];
                          final isSelected = _selectedConditionIds.contains(cond['id']);
                          final icon      = _iconForCondition(cond['name']);
                          final bgColor   = _bgColorForCondition(cond['name']);

                          return ListTile(
                            contentPadding: const EdgeInsets.symmetric(horizontal: 4, vertical: 4),
                            leading: Container(
                              width: 40, height: 40,
                              decoration: BoxDecoration(color: bgColor, borderRadius: BorderRadius.circular(10)),
                              child: Center(child: Text(icon, style: const TextStyle(fontSize: 18))),
                            ),
                            title: Text(
                              _translateConditionName(cond['name'], ls),
                              style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w500),
                            ),
                            trailing: AnimatedContainer(
                              duration: const Duration(milliseconds: 200),
                              width: 24, height: 24,
                              decoration: BoxDecoration(
                                color: isSelected ? Colors.blue : Colors.transparent,
                                shape: BoxShape.circle,
                                border: Border.all(color: isSelected ? Colors.blue : Colors.grey.shade300, width: 1.5),
                              ),
                              child: isSelected
                                  ? const Icon(Icons.check, size: 14, color: Colors.white)
                                  : null,
                            ),
                            onTap: () => setModal(() {
                              if (isSelected) {
                                _selectedConditionIds.remove(cond['id']);
                                _selectedConditionNames.remove(cond['name']);
                              } else {
                                _selectedConditionIds.add(cond['id']);
                                _selectedConditionNames.add(cond['name']);
                              }
                            }),
                          );
                        },
                      )),

            // selected chips
            if (_selectedConditionNames.isNotEmpty)
              Container(
                width: double.infinity,
                padding: const EdgeInsets.fromLTRB(16, 10, 16, 0),
                child: Wrap(spacing: 6, runSpacing: 4,
                  children: _selectedConditionNames.map((name) => Chip(
                    avatar: Text(_iconForCondition(name)),
                    label: Text(_translateConditionName(name, ls), style: const TextStyle(fontSize: 12)),
                    backgroundColor: Colors.blue.shade50,
                    side: BorderSide(color: Colors.blue.shade200),
                    deleteIcon: const Icon(Icons.close, size: 14),
                    onDeleted: () => setModal(() {
                      final idx = _selectedConditionNames.indexOf(name);
                      if (idx != -1) {
                        _selectedConditionNames.removeAt(idx);
                        _selectedConditionIds.removeAt(idx);
                      }
                    }),
                  )).toList(),
                ),
              ),

            // confirm button
            Padding(
              padding: EdgeInsets.fromLTRB(20, 12, 20, MediaQuery.of(context).padding.bottom + 16),
              child: SizedBox(
                width: double.infinity, height: 52,
                child: ElevatedButton(
                  onPressed: _selectedConditionIds.isEmpty ? null : () {
                    Navigator.pop(ctx);
                    _addSelectedConditions();
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.blue, foregroundColor: Colors.white,
                    disabledBackgroundColor: Colors.grey.shade200,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                    elevation: 0,
                  ),
                  child: Text(
                    _selectedConditionIds.isEmpty
                        ? ls.translate('selectCondition')
                        : '${ls.translate('add')} ${_selectedConditionIds.length} ${_selectedConditionIds.length == 1 ? "condition" : "conditions"}',
                    style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                  ),
                ),
              ),
            ),
          ]),
        );
      }),
    );
  }

  Future<void> _addSelectedConditions() async {
    if (_selectedConditionIds.isEmpty) return;
    setState(() => _isLoading = true);
    try {
      for (int id in _selectedConditionIds) {
        await ConditionService.addCondition(id);
      }
      await _loadConditions();
      await _loadAvailableConditions();
      if (mounted) {
        final ls = Provider.of<LanguageService>(context, listen: false);
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(
          content: Row(children: [
            const Icon(Icons.check_circle, color: Colors.white),
            const SizedBox(width: 10),
            Text('${_selectedConditionIds.length} ${ls.translate('conditionsAdded')}'),
          ]),
          backgroundColor: Colors.green,
          behavior: SnackBarBehavior.floating,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
        ));
      }
    } catch (e) {
      setState(() => _isLoading = false);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Error: $e')));
      }
    }
  }

  Future<void> _removeCondition(int conditionId, String conditionName) async {
    final ls = Provider.of<LanguageService>(context, listen: false);
    final isFr = ls.getCurrentLanguage() == 'fr';

    final confirm = await showDialog<bool>(
      context: context,
      builder: (_) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: Row(children: [
          const Icon(Icons.warning_amber_rounded, color: Colors.orange, size: 24),
          const SizedBox(width: 8),
          Text(ls.translate('removeCondition')),
        ]),
        content: Text(
          isFr
              ? 'Supprimer "$conditionName" supprimera aussi tous ses médicaments associés. Continuer ?'
              : 'Removing "$conditionName" will also remove all its associated medications. Continue?',
          style: const TextStyle(fontSize: 15),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: Text(ls.translate('cancel'), style: const TextStyle(color: Colors.grey)),
          ),
          ElevatedButton(
            onPressed: () => Navigator.pop(context, true),
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.red, foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
              elevation: 0,
            ),
            child: Text(ls.translate('remove')),
          ),
        ],
      ),
    );

    if (confirm == true) {
      setState(() => _isLoading = true);
      try {
        await ConditionService.removeCondition(conditionId);
        await _loadConditions();
        await _loadAvailableConditions();
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(SnackBar(
            content: Text(ls.translate('conditionRemoved')),
            backgroundColor: Colors.green,
            behavior: SnackBarBehavior.floating,
          ));
        }
      } catch (e) {
        setState(() => _isLoading = false);
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Error: $e')));
        }
      }
    }
  }

  // ── BUILD ─────────────────────────────────────────────────────────────────

  @override
  Widget build(BuildContext context) {
    final ls   = Provider.of<LanguageService>(context);
    final isFr = ls.getCurrentLanguage() == 'fr';

    return Scaffold(
      backgroundColor: const Color(0xFFF7F8FC),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.black54),
          onPressed: () => Navigator.pop(context),
        ),
        title: Text(ls.translate('myConditions'),
            style: const TextStyle(color: Color(0xFF1A237E), fontWeight: FontWeight.bold)),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _conditions.isEmpty
              ? _buildEmptyState(ls, isFr)
              : Column(children: [

                  // ── stats row ───────────────────────────────────────────
                  _buildStatsRow(isFr),

                  // ── section label ───────────────────────────────────────
                  Padding(
                    padding: const EdgeInsets.fromLTRB(20, 16, 20, 8),
                    child: Row(children: [
                      Text(
                        isFr ? 'Conditions actives' : 'Active conditions',
                        style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Color(0xFF1A237E)),
                      ),
                      const Spacer(),
                      Text('${_conditions.length}',
                          style: TextStyle(fontSize: 13, color: Colors.grey.shade500)),
                    ]),
                  ),

                  // ── conditions list ─────────────────────────────────────
                  Expanded(child: ListView.builder(
                    padding: const EdgeInsets.fromLTRB(16, 0, 16, 100),
                    itemCount: _conditions.length,
                    itemBuilder: (_, i) => _buildConditionCard(_conditions[i], ls, isFr),
                  )),
                ]),

      // ── FAB ──────────────────────────────────────────────────────────────
      floatingActionButton: FloatingActionButton.extended(
        onPressed: _showAddConditionDialog,
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
        elevation: 2,
        icon: const Icon(Icons.add),
        label: Text(isFr ? 'Ajouter' : 'Add condition',
            style: const TextStyle(fontWeight: FontWeight.bold)),
      ),
    );
  }

  // ── stats row ─────────────────────────────────────────────────────────────

  Widget _buildStatsRow(bool isFr) {
    final avgPct = _averageAdherence;
    final avgColor = _adherenceColor(avgPct);

    return Container(
      color: Colors.white,
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 16),
      child: Row(children: [
        _statCard(
          '${_conditions.length}',
          isFr ? 'Conditions' : 'Conditions',
          Colors.blue,
          const Color(0xFFE6F1FB),
          Icons.medical_information_outlined,
        ),
        const SizedBox(width: 10),
        _statCard(
          '$_totalMedications',
          isFr ? 'Médicaments' : 'Medications',
          Colors.purple,
          const Color(0xFFEEEDFE),
          Icons.medication_outlined,
        ),
        const SizedBox(width: 10),
        _statCard(
          '$avgPct%',
          isFr ? 'Observance' : 'Adherence',
          avgColor,
          _adherenceBgColor(avgPct),
          Icons.trending_up,
        ),
      ]),
    );
  }

  Widget _statCard(String value, String label, Color color, Color bg, IconData icon) {
    return Expanded(child: Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(color: bg, borderRadius: BorderRadius.circular(14)),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Icon(icon, size: 18, color: color),
        const SizedBox(height: 6),
        Text(value, style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: color)),
        Text(label, style: TextStyle(fontSize: 11, color: color.withOpacity(0.8))),
      ]),
    ));
  }

  // ── condition card ────────────────────────────────────────────────────────

  Widget _buildConditionCard(Map<String, dynamic> cond, LanguageService ls, bool isFr) {
    final name    = (cond['name'] ?? 'Unknown') as String;
    final pct      = int.tryParse(cond['adherence_rate']?.toString() ?? '0') ?? 0;
    final medCount = int.tryParse(cond['medication_count']?.toString() ?? '0') ?? 0;
    final icon    = _iconForCondition(name);
    final bgColor = _bgColorForCondition(name);
    final adColor = _adherenceColor(pct);
    final adBg    = _adherenceBgColor(pct);

    return GestureDetector(
      onTap: () => Navigator.push(context, MaterialPageRoute(
        builder: (_) => ConditionDetailPage(condition: {
          'id':         cond['id'],
          'name':       name,
          'percentage': pct,
          'color':      bgColor,
        }),
      )).then((_) => _loadConditions()),
      child: Container(
        margin: const EdgeInsets.only(bottom: 12),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(18),
          border: Border.all(color: Colors.grey.shade100),
          boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.04), blurRadius: 8, offset: const Offset(0, 4))],
        ),
        child: Column(children: [

          // ── top stripe (adherence color) ─────────────────────────────────
          Container(
            height: 4,
            decoration: BoxDecoration(
              color: adColor,
              borderRadius: const BorderRadius.vertical(top: Radius.circular(18)),
            ),
          ),

          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(children: [

              // ── main row ────────────────────────────────────────────────
              Row(children: [
                // icon
                Container(
                  width: 48, height: 48,
                  decoration: BoxDecoration(color: bgColor, borderRadius: BorderRadius.circular(14)),
                  child: Center(child: Text(icon, style: const TextStyle(fontSize: 22))),
                ),
                const SizedBox(width: 14),

                // name + medication count
                Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Text(_translateConditionName(name, ls),
                      style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Color(0xFF1A237E))),
                  const SizedBox(height: 5),
                  Row(children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                      decoration: BoxDecoration(color: Colors.grey.shade100, borderRadius: BorderRadius.circular(20)),
                      child: Row(mainAxisSize: MainAxisSize.min, children: [
                        const Icon(Icons.medication_outlined, size: 13, color: Colors.grey),
                        const SizedBox(width: 4),
                        Text(
                          '$medCount ${medCount == 1 ? (isFr ? "médicament" : "medication") : (isFr ? "médicaments" : "medications")}',
                          style: TextStyle(fontSize: 11, color: Colors.grey.shade600),
                        ),
                      ]),
                    ),
                    const SizedBox(width: 6),
                    // adherence badge
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                      decoration: BoxDecoration(color: adBg, borderRadius: BorderRadius.circular(20)),
                      child: Text(
                        _adherenceLabel(pct, isFr),
                        style: TextStyle(fontSize: 11, color: adColor, fontWeight: FontWeight.w600),
                      ),
                    ),
                  ]),
                ])),

                // delete button
                const SizedBox(width: 8),
                GestureDetector(
                  onTap: () => _removeCondition(cond['id'], name),
                  child: Container(
                    width: 34, height: 34,
                    decoration: BoxDecoration(color: Colors.red.shade50, borderRadius: BorderRadius.circular(10)),
                    child: Icon(Icons.delete_outline, size: 18, color: Colors.red.shade400),
                  ),
                ),
                const SizedBox(width: 4),
                Icon(Icons.chevron_right, color: Colors.grey.shade400, size: 20),
              ]),

              // ── adherence progress bar ────────────────────────────────
              const SizedBox(height: 14),
              Row(children: [
                Text(isFr ? 'Observance' : 'Adherence',
                    style: TextStyle(fontSize: 12, color: Colors.grey.shade500)),
                const Spacer(),
                Text('$pct%',
                    style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: adColor)),
              ]),
              const SizedBox(height: 6),
              ClipRRect(
                borderRadius: BorderRadius.circular(4),
                child: LinearProgressIndicator(
                  value: pct / 100,
                  minHeight: 6,
                  backgroundColor: Colors.grey.shade100,
                  valueColor: AlwaysStoppedAnimation<Color>(adColor),
                ),
              ),
            ]),
          ),
        ]),
      ),
    );
  }

  // ── empty state ───────────────────────────────────────────────────────────

  Widget _buildEmptyState(LanguageService ls, bool isFr) {
    return Center(child: Padding(
      padding: const EdgeInsets.symmetric(horizontal: 40),
      child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
        Container(
          padding: const EdgeInsets.all(28),
          decoration: BoxDecoration(color: Colors.blue.shade50, shape: BoxShape.circle),
          child: const Icon(Icons.medical_services_outlined, size: 64, color: Colors.blue),
        ),
        const SizedBox(height: 28),
        Text(ls.translate('noConditions'),
            textAlign: TextAlign.center,
            style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: Color(0xFF1A237E))),
        const SizedBox(height: 10),
        Text(
          isFr
              ? 'Ajoutez vos maladies chroniques pour suivre vos médicaments et votre observance.'
              : 'Add your chronic conditions to track your medications and adherence.',
          textAlign: TextAlign.center,
          style: TextStyle(fontSize: 15, color: Colors.grey.shade600, height: 1.5),
        ),
        const SizedBox(height: 36),
        SizedBox(
          width: double.infinity, height: 54,
          child: ElevatedButton.icon(
            onPressed: _showAddConditionDialog,
            icon: const Icon(Icons.add_circle_outline),
            label: Text(ls.translate('addCondition'),
                style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.blue, foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(30)),
              elevation: 0,
            ),
          ),
        ),
      ]),
    ));
  }
}