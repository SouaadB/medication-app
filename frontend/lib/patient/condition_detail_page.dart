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
          _medications = data['treatments'];
          _isLoading = false;
        });
      } else {
        setState(() => _isLoading = false);
      }
    } catch (e) {
      print('Erreur chargement traitements: $e');
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
        setState(() {
          _nextDose = data['nextDose'];
        });
      }
    } catch (e) {
      print('Erreur chargement prochaine dose: $e');
    }
  }

  String _formatNextDoseText(Map<String, dynamic> med) {
    final date = DateTime.parse(med['scheduled_date_time']);
    final hour = date.hour.toString().padLeft(2, '0');
    final minute = date.minute.toString().padLeft(2, '0');
    return '$hour:$minute';
  }

  String _getNextDoseDay(DateTime date) {
    final now = DateTime.now();
    final tomorrow = DateTime(now.year, now.month, now.day + 1);
    
    if (date.day == now.day && date.month == now.month && date.year == now.year) return "Aujourd'hui";
    if (date.day == tomorrow.day && date.month == tomorrow.month && date.year == tomorrow.year) return "Demain";
    return '${date.day}/${date.month}';
  }

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
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Médicament supprimé avec succès'),
              backgroundColor: Colors.green,
            ),
          );
        }
      } else {
        throw Exception('Failed to delete medication');
      }
    } catch (e) {
      print('Error deleting medication: $e');
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Erreur lors de la suppression'),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

  void _showDeleteConfirmation(int treatmentId, String name) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Supprimer le médicament'),
        content: Text('Êtes-vous sûr de vouloir supprimer $name ?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Annuler'),
          ),
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              _deleteMedication(treatmentId);
            },
            style: TextButton.styleFrom(foregroundColor: Colors.red),
            child: const Text('Supprimer'),
          ),
        ],
      ),
    );
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
          widget.condition['name'],
          style: const TextStyle(
            color: Colors.blue,
            fontWeight: FontWeight.bold,
          ),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.more_vert, color: Colors.blue),
            onPressed: () {},
          ),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : Column(
              children: [
                // Adherence Rate Card
                Container(
                  margin: const EdgeInsets.all(20),
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(24),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.05),
                        blurRadius: 20,
                        offset: const Offset(0, 10),
                      ),
                    ],
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            "Taux d'observance",
                            style: TextStyle(
                              fontSize: 14,
                              color: Colors.grey.shade600,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            '${widget.condition['percentage']}%',
                            style: const TextStyle(
                              fontSize: 32,
                              fontWeight: FontWeight.bold,
                              color: Colors.blue,
                            ),
                          ),
                        ],
                      ),
                      Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: Colors.blue.withOpacity(0.1),
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(
                          Icons.medical_services,
                          color: Colors.blue,
                          size: 32,
                        ),
                      ),
                    ],
                  ),
                ),

                // Médicaments Title
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 20),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        'Médicaments',
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFF1A237E),
                        ),
                      ),
                    ],
                  ),
                ),

                // Medications List
                Expanded(
                  child: _medications.isEmpty
                      ? Center(
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(
                                Icons.medication_outlined,
                                size: 80,
                                color: Colors.grey.shade300,
                              ),
                              const SizedBox(height: 16),
                              Text(
                                'Aucun médicament pour cette condition',
                                style: TextStyle(color: Colors.grey.shade600),
                              ),
                            ],
                          ),
                        )
                      : ListView.builder(
                          padding: const EdgeInsets.all(20),
                          itemCount: _medications.length,
                          itemBuilder: (context, index) {
                            final med = _medications[index];
                            final isNextDose = _nextDose != null && 
                                              _nextDose!['medication_name'] == med['medication_name'];
                            
                            return Container(
                              margin: const EdgeInsets.only(bottom: 16),
                              padding: const EdgeInsets.all(20),
                              decoration: BoxDecoration(
                                color: Colors.white,
                                borderRadius: BorderRadius.circular(20),
                                boxShadow: [
                                  BoxShadow(
                                    color: Colors.black.withOpacity(0.05),
                                    blurRadius: 10,
                                    offset: const Offset(0, 5),
                                  ),
                                ],
                              ),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  // Medication Name & Delete Action
                                  Row(
                                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                    children: [
                                      Expanded(
                                        child: Text(
                                          med['medication_name'],
                                          style: const TextStyle(
                                            fontSize: 18,
                                            fontWeight: FontWeight.bold,
                                            color: Color(0xFF1A237E),
                                          ),
                                        ),
                                      ),
                                      IconButton(
                                        icon: const Icon(Icons.delete_outline, color: Colors.redAccent, size: 22),
                                        onPressed: () => _showDeleteConfirmation(med['id'], med['medication_name']),
                                        padding: EdgeInsets.zero,
                                        constraints: const BoxConstraints(),
                                      ),
                                    ],
                                  ),
                                  const SizedBox(height: 4),
                                  
                                  // Dosage and Frequency
                                  Text(
                                    '${med['dosage'] ?? ''} • ${med['frequency']}',
                                    style: TextStyle(
                                      fontSize: 14,
                                      color: Colors.grey.shade600,
                                    ),
                                  ),
                                  const SizedBox(height: 12),
                                  
                                  // Next Dose
                                  Row(
                                    children: [
                                      Container(
                                        width: 20,
                                        height: 20,
                                        decoration: BoxDecoration(
                                          border: Border.all(color: Colors.grey.shade400),
                                          borderRadius: BorderRadius.circular(4),
                                        ),
                                      ),
                                      const SizedBox(width: 12),
                                      Expanded(
                                        child: Text(
                                          isNextDose
                                              ? 'Prochaine dose: ${_formatNextDoseText(_nextDose!)} (${_getNextDoseDay(DateTime.parse(_nextDose!['scheduled_date_time']))})'
                                              : 'Prochaine dose: ---',
                                          style: TextStyle(
                                            fontSize: 14,
                                            color: isNextDose ? Colors.blue : Colors.grey.shade600,
                                            fontWeight: isNextDose ? FontWeight.w500 : FontWeight.normal,
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),
                                ],
                              ),
                            );
                          },
                        ),
                ),

                // Add Medication Button
                Padding(
                  padding: const EdgeInsets.all(20),
                  child: SizedBox(
                    width: double.infinity,
                    height: 55,
                    child: ElevatedButton(
                      onPressed: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => AddMedicationPage(
                              conditionId: widget.condition['id'],
                              conditionName: widget.condition['name'],
                            ),
                          ),
                        ).then((_) => _loadMedications());
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.blue,
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(30),
                        ),
                        elevation: 0,
                      ),
                      child: const Text(
                        'Ajouter un médicament',
                        style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                      ),
                    ),
                  ),
                ),
              ],
            ),
    );
  }
}