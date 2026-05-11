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

class _MedicationDictionaryPageState extends State<MedicationDictionaryPage> {
  final TextEditingController _searchController = TextEditingController();
  List<Map<String, dynamic>> _medications = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _fetchMedications();
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
        setState(() {
          _medications = List<Map<String, dynamic>>.from(data['medications']);
        });
      }
    } catch (e) {
      debugPrint('Error fetching medications: $e');
    } finally {
      setState(() => _isLoading = false);
    }
  }

  Color _getCategoryColor(String? category) {
    if (category == null) return Colors.blue;
    final cat = category.toLowerCase();
    if (cat.contains('pain')) return Colors.orange;
    if (cat.contains('diabetes')) return Colors.teal;
    if (cat.contains('blood pressure')) return Colors.red;
    if (cat.contains('cholesterol')) return Colors.blue;
    if (cat.contains('stomach')) return Colors.lightBlue;
    return Colors.purple;
  }

  @override
  Widget build(BuildContext context) {
    final lang = Provider.of<LanguageService>(context);
    
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
          // Header
          Container(
            width: double.infinity,
            padding: const EdgeInsets.symmetric(vertical: 12),
            decoration: const BoxDecoration(color: Color(0xFF3498DB)),
            child: const Text(
              'Simple explanations for your medications',
              textAlign: TextAlign.center,
              style: TextStyle(color: Colors.white70, fontSize: 13),
            ),
          ),
          
          // Search Bar
          Padding(
            padding: const EdgeInsets.all(16),
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(30),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.05),
                    blurRadius: 10,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              child: TextField(
                controller: _searchController,
                onChanged: (v) => _fetchMedications(v),
                decoration: const InputDecoration(
                  hintText: 'Search medications...',
                  border: InputBorder.none,
                  icon: Icon(Icons.search, color: Colors.grey),
                ),
              ),
            ),
          ),
          
          // Did you know banner
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.purple.shade50,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: Colors.purple.shade100),
              ),
              child: const Row(
                children: [
                  Icon(Icons.lightbulb_outline, color: Colors.purple, size: 20),
                  SizedBox(width: 12),
                  Expanded(
                    child: Text(
                      'Keep a list of all your medications to show doctors and pharmacists.',
                      style: TextStyle(fontSize: 12, color: Colors.purple),
                    ),
                  ),
                ],
              ),
            ),
          ),
          
          const SizedBox(height: 16),
          
          // Medication List
          Expanded(
            child: _isLoading 
              ? const Center(child: CircularProgressIndicator())
              : _medications.isEmpty 
                ? const Center(child: Text('No medications found'))
                : ListView.builder(
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    itemCount: _medications.length,
                    itemBuilder: (context, index) {
                      final med = _medications[index];
                      return _buildMedicationCard(med);
                    },
                  ),
          ),
        ],
      ),
    );
  }

  Widget _buildMedicationCard(Map<String, dynamic> med) {
    final color = _getCategoryColor(med['category']);
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.03),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: ListTile(
        contentPadding: const EdgeInsets.all(16),
        leading: Container(
          width: 50,
          height: 50,
          decoration: BoxDecoration(
            color: color.withOpacity(0.1),
            borderRadius: BorderRadius.circular(12),
          ),
          child: Center(
            child: Text(med['emoji'] ?? '💊', style: const TextStyle(fontSize: 24)),
          ),
        ),
        title: Text(
          med['name'],
          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
        ),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(med['scientific_name'] ?? '', style: TextStyle(color: Colors.grey.shade600, fontSize: 13)),
            const SizedBox(height: 8),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              decoration: BoxDecoration(
                color: color.withOpacity(0.1),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Text(
                med['category'] ?? 'General',
                style: TextStyle(color: color, fontSize: 11, fontWeight: FontWeight.bold),
              ),
            ),
          ],
        ),
        trailing: IconButton(
          icon: Icon(Icons.info_outline, color: Colors.grey.shade400),
          onPressed: () => _showMedicationDetail(med),
        ),
        onTap: () => _showMedicationDetail(med),
      ),
    );
  }

  void _showMedicationDetail(Map<String, dynamic> med) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => DraggableScrollableSheet(
        initialChildSize: 0.9,
        maxChildSize: 0.9,
        minChildSize: 0.5,
        builder: (_, controller) => Container(
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(top: Radius.circular(30)),
          ),
          child: ListView(
            controller: controller,
            padding: const EdgeInsets.all(24),
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      Text(med['emoji'], style: const TextStyle(fontSize: 32)),
                      const SizedBox(width: 16),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(med['name'], style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
                          Text(med['scientificName'], style: TextStyle(color: Colors.grey.shade500)),
                        ],
                      ),
                    ],
                  ),
                  IconButton(
                    icon: const Icon(Icons.close),
                    onPressed: () => Navigator.pop(context),
                  ),
                ],
              ),
              const SizedBox(height: 32),
              
              _buildDetailSection(
                icon: Icons.help_outline,
                title: 'What is it?',
                content: med['description'],
                bgColor: Colors.blue.shade50,
                iconColor: Colors.blue,
              ),
              
              const SizedBox(height: 24),
              _buildDetailSection(
                icon: Icons.timer_outlined,
                title: 'How to take it',
                content: med['howToTake'],
                bgColor: Colors.green.shade50,
                iconColor: Colors.green,
              ),
              
              const SizedBox(height: 24),
              _buildListSection(
                icon: Icons.favorite_border,
                title: 'Possible side effects',
                items: List<String>.from(med['sideEffects']),
                bgColor: Colors.orange.shade50,
                iconColor: Colors.orange,
              ),
              
              const SizedBox(height: 24),
              _buildListSection(
                icon: Icons.warning_amber_rounded,
                title: 'Important warnings',
                items: List<String>.from(med['warnings']),
                bgColor: Colors.red.shade50,
                iconColor: Colors.red,
              ),
              
              const SizedBox(height: 32),
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.yellow.shade50,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: Colors.yellow.shade200),
                ),
                child: const Text(
                  'Remember: This information is for educational purposes. Always consult your doctor or pharmacist if you have questions about your medications.',
                  style: TextStyle(fontSize: 12, height: 1.5),
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
        const SizedBox(height: 12),
        Container(
          width: double.infinity,
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: bgColor,
            borderRadius: BorderRadius.circular(16),
          ),
          child: Text(
            content,
            style: const TextStyle(fontSize: 14, height: 1.5, color: Colors.black87),
          ),
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
        const SizedBox(height: 12),
        Container(
          width: double.infinity,
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: bgColor,
            borderRadius: BorderRadius.circular(16),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: items.map((item) => Padding(
              padding: const EdgeInsets.only(bottom: 8),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('• ', style: TextStyle(color: iconColor, fontWeight: FontWeight.bold)),
                  Expanded(child: Text(item, style: const TextStyle(fontSize: 14, color: Colors.black87))),
                ],
              ),
            )).toList(),
          ),
        ),
      ],
    );
  }
}
