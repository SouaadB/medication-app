import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../services/language_service.dart';
import '../config/api_config.dart';

class MedicationDictionaryPage extends StatefulWidget {
  const MedicationDictionaryPage({super.key});

  @override
  State<MedicationDictionaryPage> createState() => _MedicationDictionaryPageState();
}

class _MedicationDictionaryPageState extends State<MedicationDictionaryPage>
    with SingleTickerProviderStateMixin {
  final TextEditingController _searchController = TextEditingController();
  List<Map<String, dynamic>> _medications = [];
  List<Map<String, dynamic>> _filteredMedications = [];
  bool _isLoading = true;
  late TabController _tabController;

  // Categories for tab filtering
  final List<String> _categories = [
    'All', 'Diabetes', 'Hypertension', 'Heart', 'Thyroid',
    'Pain', 'Stomach', 'Antibiotics', 'Vitamins', 'Other'
  ];
  String _selectedCategory = 'All';

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: _categories.length, vsync: this);
    _fetchMedications();
  }

  @override
  void dispose() {
    _tabController.dispose();
    _searchController.dispose();
    super.dispose();
  }

  Future<void> _fetchMedications([String query = '']) async {
    setState(() => _isLoading = true);
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');

      final uri = Uri.parse('${ApiConfig.baseUrl}/education/dictionary').replace(
        queryParameters: query.isNotEmpty ? {'query': query} : null,
      );

      final response = await http.get(
        uri,
        headers: {'Authorization': 'Bearer $token'},
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final fetched = List<Map<String, dynamic>>.from(data['medications']);
        setState(() {
          _medications = fetched;
          _applyFilter();
        });
      }
    } catch (e) {
      debugPrint('Error fetching medications: $e');
    } finally {
      setState(() => _isLoading = false);
    }
  }

  void _applyFilter() {
    if (_selectedCategory == 'All') {
      _filteredMedications = List.from(_medications);
    } else {
      _filteredMedications = _medications.where((m) {
        final cat = (m['category'] ?? '').toString().toLowerCase();
        return cat.contains(_selectedCategory.toLowerCase());
      }).toList();
    }
  }

  // Safe getter — handles both snake_case and camelCase keys from API
  String _safe(Map<String, dynamic> med, List<String> keys, [String fallback = '']) {
    for (final key in keys) {
      if (med[key] != null && med[key].toString().isNotEmpty) {
        return med[key].toString();
      }
    }
    return fallback;
  }

  List<String> _safeList(Map<String, dynamic> med, List<String> keys) {
    for (final key in keys) {
      if (med[key] != null && med[key] is List) {
        return List<String>.from(med[key]);
      }
    }
    return [];
  }

  Color _getCategoryColor(String? category) {
    if (category == null) return Colors.blue;
    final cat = category.toLowerCase();
    if (cat.contains('pain')) return Colors.orange;
    if (cat.contains('diabetes')) return Colors.teal;
    if (cat.contains('blood pressure') || cat.contains('hypertension')) return Colors.red;
    if (cat.contains('cholesterol') || cat.contains('heart')) return Colors.indigo;
    if (cat.contains('stomach') || cat.contains('gastro')) return Colors.lightBlue;
    if (cat.contains('thyroid')) return Colors.purple;
    if (cat.contains('antibiotic')) return Colors.green;
    if (cat.contains('vitamin')) return Colors.amber;
    return Colors.blueGrey;
  }

  IconData _getCategoryIcon(String? category) {
    if (category == null) return Icons.medication;
    final cat = category.toLowerCase();
    if (cat.contains('diabetes')) return Icons.water_drop;
    if (cat.contains('hypertension') || cat.contains('heart')) return Icons.favorite;
    if (cat.contains('pain')) return Icons.healing;
    if (cat.contains('thyroid')) return Icons.circle;
    if (cat.contains('antibiotic')) return Icons.coronavirus;
    if (cat.contains('vitamin')) return Icons.local_florist;
    if (cat.contains('stomach')) return Icons.restaurant;
    return Icons.medication;
  }

  @override
  Widget build(BuildContext context) {
    final lang = Provider.of<LanguageService>(context);
    final isFr = lang.getCurrentLanguage() == 'fr';

    return Scaffold(
      backgroundColor: const Color(0xFFF8F9FE),
      appBar: AppBar(
        backgroundColor: const Color(0xFF3498DB),
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
        title: Text(
          lang.translate('medicationDictionary'),
          style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
        ),
        centerTitle: true,
      ),
      body: Column(
        children: [
          // Blue header with search
          Container(
            color: const Color(0xFF3498DB),
            child: Column(
              children: [
                Text(
                  isFr
                      ? 'Informations claires sur vos médicaments'
                      : 'Simple explanations for your medications',
                  textAlign: TextAlign.center,
                  style: const TextStyle(color: Colors.white70, fontSize: 13),
                ),
                const SizedBox(height: 12),
                // Search Bar
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(30),
                    ),
                    child: TextField(
                      controller: _searchController,
                      onChanged: (v) {
                        _fetchMedications(v);
                      },
                      decoration: InputDecoration(
                        hintText: isFr ? 'Rechercher un médicament...' : 'Search medications...',
                        border: InputBorder.none,
                        icon: const Icon(Icons.search, color: Colors.grey),
                        suffixIcon: _searchController.text.isNotEmpty
                            ? IconButton(
                                icon: const Icon(Icons.clear, color: Colors.grey),
                                onPressed: () {
                                  _searchController.clear();
                                  _fetchMedications();
                                },
                              )
                            : null,
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 12),
                // Category tabs
                SizedBox(
                  height: 40,
                  child: ListView.builder(
                    scrollDirection: Axis.horizontal,
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    itemCount: _categories.length,
                    itemBuilder: (context, index) {
                      final cat = _categories[index];
                      final isSelected = _selectedCategory == cat;
                      return GestureDetector(
                        onTap: () {
                          setState(() {
                            _selectedCategory = cat;
                            _applyFilter();
                          });
                        },
                        child: Container(
                          margin: const EdgeInsets.only(right: 8),
                          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                          decoration: BoxDecoration(
                            color: isSelected ? Colors.white : Colors.white.withOpacity(0.2),
                            borderRadius: BorderRadius.circular(20),
                          ),
                          child: Text(
                            cat,
                            style: TextStyle(
                              color: isSelected ? const Color(0xFF3498DB) : Colors.white,
                              fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                              fontSize: 13,
                            ),
                          ),
                        ),
                      );
                    },
                  ),
                ),
                const SizedBox(height: 12),
              ],
            ),
          ),

          // Stats bar
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
            color: Colors.white,
            child: Row(
              children: [
                Icon(Icons.library_books, color: Colors.blue.shade300, size: 16),
                const SizedBox(width: 6),
                Text(
                  '${_filteredMedications.length} ${isFr ? 'médicaments' : 'medications'}',
                  style: TextStyle(
                    fontSize: 13,
                    color: Colors.grey.shade600,
                    fontWeight: FontWeight.w500,
                  ),
                ),
                const Spacer(),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: Colors.purple.shade50,
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Row(
                    children: [
                      Icon(Icons.lightbulb_outline, color: Colors.purple.shade400, size: 14),
                      const SizedBox(width: 4),
                      Text(
                        isFr ? 'Montrez à votre médecin' : 'Show your doctor',
                        style: TextStyle(fontSize: 11, color: Colors.purple.shade400),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),

          // Medication List
          Expanded(
            child: _isLoading
                ? const Center(child: CircularProgressIndicator())
                : _filteredMedications.isEmpty
                    ? Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(Icons.search_off, size: 60, color: Colors.grey.shade300),
                            const SizedBox(height: 16),
                            Text(
                              isFr ? 'Aucun médicament trouvé' : 'No medications found',
                              style: TextStyle(color: Colors.grey.shade500, fontSize: 16),
                            ),
                          ],
                        ),
                      )
                    : ListView.builder(
                        padding: const EdgeInsets.fromLTRB(16, 12, 16, 16),
                        itemCount: _filteredMedications.length,
                        itemBuilder: (context, index) {
                          return _buildMedicationCard(_filteredMedications[index]);
                        },
                      ),
          ),
        ],
      ),
    );
  }

  Widget _buildMedicationCard(Map<String, dynamic> med) {
    final color = _getCategoryColor(med['category']);
    final name = _safe(med, ['name']);
    final scientificName = _safe(med, ['scientific_name', 'scientificName']);
    final category = _safe(med, ['category'], 'General');
    final emoji = _safe(med, ['emoji'], '💊');
    final isUserAdded = med['user_added'] == true;

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: isUserAdded
            ? Border.all(color: Colors.blue.shade200, width: 1.5)
            : null,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.04),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: ListTile(
        contentPadding: const EdgeInsets.all(16),
        leading: Container(
          width: 52,
          height: 52,
          decoration: BoxDecoration(
            color: color.withOpacity(0.1),
            borderRadius: BorderRadius.circular(14),
          ),
          child: Center(
            child: Text(emoji, style: const TextStyle(fontSize: 26)),
          ),
        ),
        title: Row(
          children: [
            Expanded(
              child: Text(
                name,
                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 17),
              ),
            ),
            if (isUserAdded)
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                decoration: BoxDecoration(
                  color: Colors.blue.shade50,
                  borderRadius: BorderRadius.circular(6),
                ),
                child: Text(
                  'My med',
                  style: TextStyle(fontSize: 10, color: Colors.blue.shade600, fontWeight: FontWeight.bold),
                ),
              ),
          ],
        ),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (scientificName.isNotEmpty) ...[
              const SizedBox(height: 2),
              Text(
                scientificName,
                style: TextStyle(color: Colors.grey.shade600, fontSize: 13),
              ),
            ],
            const SizedBox(height: 8),
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                  decoration: BoxDecoration(
                    color: color.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(_getCategoryIcon(category), size: 11, color: color),
                      const SizedBox(width: 4),
                      Text(
                        category,
                        style: TextStyle(color: color, fontSize: 11, fontWeight: FontWeight.bold),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ],
        ),
        trailing: Container(
          width: 36,
          height: 36,
          decoration: BoxDecoration(
            color: color.withOpacity(0.08),
            borderRadius: BorderRadius.circular(10),
          ),
          child: Icon(Icons.chevron_right, color: color, size: 20),
        ),
        onTap: () => _showMedicationDetail(med),
      ),
    );
  }

  void _showMedicationDetail(Map<String, dynamic> med) {
    final lang = Provider.of<LanguageService>(context, listen: false);
    final isFr = lang.getCurrentLanguage() == 'fr';
    final color = _getCategoryColor(med['category']);

    // Safe field access — handles both snake_case and camelCase
    final name = _safe(med, ['name']);
    final emoji = _safe(med, ['emoji'], '💊');
    final scientificName = _safe(med, ['scientific_name', 'scientificName']);
    final category = _safe(med, ['category'], 'General');
    final description = _safe(med, ['description'], isFr ? 'Aucune description disponible.' : 'No description available.');
    final howToTake = _safe(med, ['how_to_take', 'howToTake'], isFr ? 'Suivez les instructions de votre médecin.' : 'Follow your doctor\'s instructions.');
    final sideEffects = _safeList(med, ['side_effects', 'sideEffects']);
    final warnings = _safeList(med, ['warnings']);
    final interactions = _safeList(med, ['interactions']);
    final algeriaBrands = _safeList(med, ['algeria_brands', 'algeriaBrands']);

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => DraggableScrollableSheet(
        initialChildSize: 0.92,
        maxChildSize: 0.95,
        minChildSize: 0.5,
        builder: (_, controller) => Container(
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(top: Radius.circular(30)),
          ),
          child: Column(
            children: [
              // Header
              Container(
                padding: const EdgeInsets.fromLTRB(24, 16, 24, 20),
                decoration: BoxDecoration(
                  color: color.withOpacity(0.08),
                  borderRadius: const BorderRadius.vertical(top: Radius.circular(30)),
                ),
                child: Column(
                  children: [
                    // Drag handle
                    Container(
                      width: 40, height: 4,
                      decoration: BoxDecoration(
                        color: Colors.grey.shade300,
                        borderRadius: BorderRadius.circular(2),
                      ),
                    ),
                    const SizedBox(height: 16),
                    Row(
                      children: [
                        Container(
                          width: 60, height: 60,
                          decoration: BoxDecoration(
                            color: color.withOpacity(0.15),
                            borderRadius: BorderRadius.circular(16),
                          ),
                          child: Center(child: Text(emoji, style: const TextStyle(fontSize: 32))),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(name, style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold)),
                              if (scientificName.isNotEmpty)
                                Text(scientificName, style: TextStyle(color: Colors.grey.shade500, fontSize: 14)),
                              const SizedBox(height: 6),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                decoration: BoxDecoration(
                                  color: color.withOpacity(0.15),
                                  borderRadius: BorderRadius.circular(10),
                                ),
                                child: Text(
                                  category,
                                  style: TextStyle(color: color, fontSize: 12, fontWeight: FontWeight.bold),
                                ),
                              ),
                            ],
                          ),
                        ),
                        IconButton(
                          icon: const Icon(Icons.close),
                          onPressed: () => Navigator.pop(context),
                        ),
                      ],
                    ),
                  ],
                ),
              ),

              // Scrollable content
              Expanded(
                child: ListView(
                  controller: controller,
                  padding: const EdgeInsets.all(24),
                  children: [
                    _buildDetailSection(
                      icon: Icons.help_outline,
                      title: isFr ? 'Qu\'est-ce que c\'est ?' : 'What is it?',
                      content: description,
                      bgColor: Colors.blue.shade50,
                      iconColor: Colors.blue,
                    ),

                    const SizedBox(height: 20),
                    _buildDetailSection(
                      icon: Icons.timer_outlined,
                      title: isFr ? 'Comment le prendre' : 'How to take it',
                      content: howToTake,
                      bgColor: Colors.green.shade50,
                      iconColor: Colors.green,
                    ),

                    if (algeriaBrands.isNotEmpty) ...[
                      const SizedBox(height: 20),
                      _buildListSection(
                        icon: Icons.local_pharmacy,
                        title: isFr ? 'Marques disponibles en Algérie' : 'Available brands in Algeria',
                        items: algeriaBrands,
                        bgColor: Colors.teal.shade50,
                        iconColor: Colors.teal,
                      ),
                    ],

                    if (sideEffects.isNotEmpty) ...[
                      const SizedBox(height: 20),
                      _buildListSection(
                        icon: Icons.favorite_border,
                        title: isFr ? 'Effets secondaires possibles' : 'Possible side effects',
                        items: sideEffects,
                        bgColor: Colors.orange.shade50,
                        iconColor: Colors.orange,
                      ),
                    ],

                    if (warnings.isNotEmpty) ...[
                      const SizedBox(height: 20),
                      _buildListSection(
                        icon: Icons.warning_amber_rounded,
                        title: isFr ? 'Avertissements importants' : 'Important warnings',
                        items: warnings,
                        bgColor: Colors.red.shade50,
                        iconColor: Colors.red,
                      ),
                    ],

                    if (interactions.isNotEmpty) ...[
                      const SizedBox(height: 20),
                      _buildListSection(
                        icon: Icons.compare_arrows,
                        title: isFr ? 'Interactions médicamenteuses' : 'Drug interactions',
                        items: interactions,
                        bgColor: Colors.purple.shade50,
                        iconColor: Colors.purple,
                      ),
                    ],

                    const SizedBox(height: 24),
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: Colors.yellow.shade50,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: Colors.yellow.shade200),
                      ),
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Icon(Icons.info_outline, color: Colors.amber.shade700, size: 18),
                          const SizedBox(width: 10),
                          Expanded(
                            child: Text(
                              isFr
                                  ? 'Ces informations sont à titre éducatif uniquement. Consultez toujours votre médecin ou pharmacien.'
                                  : 'This information is for educational purposes only. Always consult your doctor or pharmacist.',
                              style: const TextStyle(fontSize: 12, height: 1.5),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 16),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildDetailSection({
    required IconData icon,
    required String title,
    required String content,
    required Color bgColor,
    required Color iconColor,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Icon(icon, color: iconColor, size: 20),
            const SizedBox(width: 8),
            Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
          ],
        ),
        const SizedBox(height: 10),
        Container(
          width: double.infinity,
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: bgColor,
            borderRadius: BorderRadius.circular(16),
          ),
          child: Text(content, style: const TextStyle(fontSize: 14, height: 1.6, color: Colors.black87)),
        ),
      ],
    );
  }

  Widget _buildListSection({
    required IconData icon,
    required String title,
    required List<String> items,
    required Color bgColor,
    required Color iconColor,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Icon(icon, color: iconColor, size: 20),
            const SizedBox(width: 8),
            Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
          ],
        ),
        const SizedBox(height: 10),
        Container(
          width: double.infinity,
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: bgColor,
            borderRadius: BorderRadius.circular(16),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: items
                .map((item) => Padding(
                      padding: const EdgeInsets.only(bottom: 8),
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('• ', style: TextStyle(color: iconColor, fontWeight: FontWeight.bold, fontSize: 16)),
                          Expanded(
                            child: Text(item, style: const TextStyle(fontSize: 14, color: Colors.black87, height: 1.4)),
                          ),
                        ],
                      ),
                    ))
                .toList(),
          ),
        ),
      ],
    );
  }
}