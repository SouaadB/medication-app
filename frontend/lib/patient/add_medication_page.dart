import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'manual_entry_page.dart';
import 'review_parsed_medications_page.dart';
import '../config/api_config.dart';
import '../services/language_service.dart';

class AddMedicationPage extends StatefulWidget {
  const AddMedicationPage({super.key});

  @override
  State<AddMedicationPage> createState() => _AddMedicationPageState();
}

class _AddMedicationPageState extends State<AddMedicationPage> {
  
  Future<void> _pickImageAndScan(BuildContext context, ImageSource source) async {
    final picker = ImagePicker();
    final pickedFile = await picker.pickImage(source: source);

    if (pickedFile == null) return;

    // Check if widget is still mounted
    if (!mounted) return;

    // Afficher un indicateur de chargement
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (dialogContext) => const Center(
        child: CircularProgressIndicator(),
      ),
    );

    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');

      var request = http.MultipartRequest(
        'POST',
        Uri.parse('${ApiConfig.baseUrl}/treatments/ocr'),
      );
      request.headers['Authorization'] = 'Bearer $token';
      request.files.add(await http.MultipartFile.fromPath('prescription', pickedFile.path));

      var streamedResponse = await request.send();
      var response = await http.Response.fromStream(streamedResponse);
      var data = jsonDecode(response.body);

      // Check if widget is still mounted before closing dialog
      if (!mounted) return;
      Navigator.pop(context); // Fermer le dialogue de chargement

      if (response.statusCode == 200 && data['success'] == true) {
        final meds = (data['medications'] as List?) ?? [];
        if (meds.isEmpty) {
          _showError(context, 'Aucun médicament détecté');
        } else {
          if (!mounted) return;
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => ReviewParsedMedicationsPage(medications: meds),
            ),
          );
        }
      } else {
        _showError(context, 'Erreur lors du scan');
      }
    } catch (e) {
      // Check if widget is still mounted before closing dialog
      if (!mounted) return;
      Navigator.pop(context);
      _showError(context, 'Erreur: $e');
    }
  }

  void _showParsedDataDialog(BuildContext context, Map<String, dynamic> parsedData) {
    showDialog(
      context: context,
      builder: (dialogContext) => AlertDialog(
        title: const Text('Données extraites'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Médicament: ${parsedData['medication_name'] ?? 'Non détecté'}'),
            Text('Dosage: ${parsedData['dosage'] ?? 'Non détecté'}'),
            Text('Fréquence: ${parsedData['frequency'] ?? 'Once daily'}'),
            if (parsedData['duration_days'] != null)
              Text('Durée: ${parsedData['duration_days']} jours'),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(dialogContext),
            child: const Text('Annuler'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(dialogContext);
              // Aller à la page de saisie manuelle avec les données pré-remplies
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => ManualEntryPage(
                    prefillData: parsedData,
                  ),
                ),
              );
            },
            child: const Text('Utiliser ces données'),
          ),
        ],
      ),
    );
  }

  void _showError(BuildContext context, String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: Colors.red,
      ),
    );
  }

  void _showImageSourceDialog(BuildContext context) {
    final languageService = Provider.of<LanguageService>(context, listen: false);
    
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (bottomSheetContext) => SafeArea(
        child: Wrap(
          children: [
            ListTile(
              leading: const Icon(Icons.camera_alt, color: Colors.blue),
              title: Text(languageService.translate('camera')),
              onTap: () {
                Navigator.pop(bottomSheetContext);
                _pickImageAndScan(context, ImageSource.camera);
              },
            ),
            ListTile(
              leading: const Icon(Icons.photo_library, color: Colors.blue),
              title: Text(languageService.translate('gallery')),
              onTap: () {
                Navigator.pop(bottomSheetContext);
                _pickImageAndScan(context, ImageSource.gallery);
              },
            ),
          ],
        ),
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
          languageService.translate('addMedication'),
          style: const TextStyle(
            color: Colors.blue,
            fontWeight: FontWeight.bold,
            fontSize: 18,
          ),
        ),
      ),
      body: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              languageService.translate('addMedication'),
              style: const TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
                color: Colors.black,
              ),
            ),
            const SizedBox(height: 8),
            
            Text(
              languageService.translate('helpUs'),
              style: const TextStyle(
                fontSize: 14,
                color: Colors.grey,
              ),
            ),
            const SizedBox(height: 24),

            Container(
              height: 1,
              color: Colors.grey.shade300,
            ),
            const SizedBox(height: 24),

            GestureDetector(
              onTap: () => _showImageSourceDialog(context),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    width: 40,
                    height: 40,
                    decoration: const BoxDecoration(
                      color: Colors.blue,
                      shape: BoxShape.circle,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          languageService.translate('scanPrescription'),
                          style: const TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w600,
                            color: Colors.black,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          languageService.translate('scanDescription'),
                          style: TextStyle(
                            fontSize: 12,
                            color: Colors.grey.shade600,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            
            const SizedBox(height: 24),
            
            Container(
              height: 1,
              color: Colors.grey.shade300,
            ),
            const SizedBox(height: 24),

            GestureDetector(
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => const ManualEntryPage(),
                  ),
                );
              },
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    width: 40,
                    height: 40,
                    decoration: const BoxDecoration(
                      color: Colors.green,
                      shape: BoxShape.circle,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          languageService.translate('manualEntry'),
                          style: const TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w600,
                            color: Colors.black,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          languageService.translate('manualDescription'),
                          style: TextStyle(
                            fontSize: 12,
                            color: Colors.grey.shade600,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            
            const SizedBox(height: 30),
          ],
        ),
      ),
    );
  }
}
