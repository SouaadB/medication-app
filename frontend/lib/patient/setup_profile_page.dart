import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:provider/provider.dart';
import '../config/api_config.dart';
import '../services/language_service.dart';

class SetupProfilePage extends StatefulWidget {
  const SetupProfilePage({super.key});

  @override
  State<SetupProfilePage> createState() => _SetupProfilePageState();
}

class _SetupProfilePageState extends State<SetupProfilePage> {
  final TextEditingController _ageController = TextEditingController();
  final FocusNode _ageFocusNode = FocusNode();
  final List<int> _selectedConditionIds = [];
  final List<String> _selectedConditionNames = [];
  bool _isLoading = false;
  String? _error;
  
  List<Map<String, dynamic>> _availableConditions = [];
  bool _loadingConditions = true;

  final TextEditingController _searchController = TextEditingController();
  List<Map<String, dynamic>> _filteredConditions = [];

  @override
  void initState() {
    super.initState();
    _loadConditions();
    _searchController.addListener(_filterConditions);
  }

  @override
  void dispose() {
    _ageController.dispose();
    _ageFocusNode.dispose();
    _searchController.dispose();
    super.dispose();
  }

  Future<void> _loadConditions() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');

      final response = await http.get(
        Uri.parse('${ApiConfig.baseUrl}/profile/conditions'),
        headers: {
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        setState(() {
          _availableConditions = List<Map<String, dynamic>>.from(data['conditions']);
          _filteredConditions = _availableConditions;
          _loadingConditions = false;
        });
      }
    } catch (e) {
      print('Erreur chargement conditions: $e');
      setState(() => _loadingConditions = false);
    }
  }

  void _filterConditions() {
    setState(() {
      _filteredConditions = _availableConditions
          .where((condition) => condition['name']
              .toLowerCase()
              .contains(_searchController.text.toLowerCase()))
          .toList();
    });
  }

  void _incrementAge() {
    final currentAge = int.tryParse(_ageController.text) ?? 0;
    if (currentAge < 120) {
      _ageController.text = (currentAge + 1).toString();
    }
  }

  void _decrementAge() {
    final currentAge = int.tryParse(_ageController.text) ?? 0;
    if (currentAge > 0) {
      _ageController.text = (currentAge - 1).toString();
    }
  }

  void _showConditionSelector() {
    final languageService = Provider.of<LanguageService>(context, listen: false);
    
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (BuildContext context) {
        return StatefulBuilder(
          builder: (context, setState) {
            return Container(
              height: MediaQuery.of(context).size.height * 0.7,
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        languageService.translate('selectCondition'),
                        style: const TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                          color: Colors.blue,
                        ),
                      ),
                      IconButton(
                        icon: const Icon(Icons.close),
                        onPressed: () => Navigator.pop(context),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  
                  TextField(
                    controller: _searchController,
                    decoration: InputDecoration(
                      hintText: languageService.translate('searchConditions'),
                      prefixIcon: const Icon(Icons.search, color: Colors.blue),
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
                    ),
                  ),
                  const SizedBox(height: 16),
                  
                  Expanded(
                    child: ListView.builder(
                      itemCount: _filteredConditions.length,
                      itemBuilder: (context, index) {
                        final condition = _filteredConditions[index];
                        final isSelected = _selectedConditionIds.contains(condition['id']);
                        
                        return ListTile(
                          title: Text(condition['name']),
                          trailing: isSelected
                              ? const Icon(Icons.check_circle, color: Colors.blue)
                              : const Icon(Icons.radio_button_unchecked, color: Colors.grey),
                          onTap: () {
                            setState(() {
                              if (isSelected) {
                                _selectedConditionIds.remove(condition['id']);
                                _selectedConditionNames.remove(condition['name']);
                              } else {
                                _selectedConditionIds.add(condition['id']);
                                _selectedConditionNames.add(condition['name']);
                              }
                            });
                          },
                        );
                      },
                    ),
                  ),
                  
                  Padding(
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    child: SizedBox(
                      width: double.infinity,
                      height: 50,
                      child: ElevatedButton(
                        onPressed: () {
                          Navigator.pop(context);
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.blue,
                          foregroundColor: Colors.white,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                        child: Text(languageService.translate('done')),
                      ),
                    ),
                  ),
                ],
              ),
            );
          },
        );
      },
    ).then((_) {
      setState(() {});
    });
  }

  @override
  Widget build(BuildContext context) {
    final languageService = Provider.of<LanguageService>(context);
    
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        elevation: 0,
        backgroundColor: Colors.white,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios, color: Colors.blue),
          onPressed: () => Navigator.pop(context),
        ),
        title: Text(
          languageService.translate('setupProfile'),
          style: const TextStyle(
            color: Colors.blue,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
      body: SafeArea(
        child: _loadingConditions
            ? const Center(child: CircularProgressIndicator())
            : SingleChildScrollView(
                padding: const EdgeInsets.all(24.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Center(
                      child: Icon(Icons.person_outline_rounded, size: 60, color: Colors.blue),
                    ),
                    const SizedBox(height: 16),
                    Center(
                      child: Text(
                        languageService.translate('setupProfile'),
                        style: const TextStyle(
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                          color: Colors.blue,
                        ),
                      ),
                    ),
                    const SizedBox(height: 8),
                    Center(
                      child: Text(
                        languageService.translate('helpUs'),
                        style: const TextStyle(
                          fontSize: 14,
                          color: Colors.grey,
                        ),
                      ),
                    ),
                    const SizedBox(height: 32),

                    Text(
                      languageService.translate('age'),
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: Colors.blue,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Container(
                      height: 60,
                      decoration: BoxDecoration(
                        border: Border.all(color: Colors.grey.shade300),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Row(
                        children: [
                          Expanded(
                            child: TextField(
                              controller: _ageController,
                              focusNode: _ageFocusNode,
                              keyboardType: TextInputType.number,
                              decoration: InputDecoration(
                                hintText: languageService.translate('enterAge'),
                                border: InputBorder.none,
                                contentPadding: const EdgeInsets.symmetric(horizontal: 16),
                              ),
                              onChanged: (value) {
                                if (value.isNotEmpty) {
                                  final age = int.tryParse(value);
                                  if (age != null && (age < 0 || age > 120)) {
                                    setState(() {
                                      _error = languageService.translate('age') + ' doit être entre 0 et 120';
                                    });
                                  } else {
                                    setState(() {
                                      _error = null;
                                    });
                                  }
                                }
                              },
                            ),
                          ),
                          Container(
                            width: 1,
                            height: 40,
                            color: Colors.grey.shade300,
                          ),
                          Column(
                            children: [
                              Expanded(
                                child: InkWell(
                                  onTap: _incrementAge,
                                  child: Container(
                                    width: 40,
                                    alignment: Alignment.center,
                                    child: const Icon(
                                      Icons.keyboard_arrow_up,
                                      color: Colors.blue,
                                      size: 20,
                                    ),
                                  ),
                                ),
                              ),
                              Container(
                                width: 40,
                                height: 1,
                                color: Colors.grey.shade300,
                              ),
                              Expanded(
                                child: InkWell(
                                  onTap: _decrementAge,
                                  child: Container(
                                    width: 40,
                                    alignment: Alignment.center,
                                    child: const Icon(
                                      Icons.keyboard_arrow_down,
                                      color: Colors.blue,
                                      size: 20,
                                    ),
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 24),

                    Text(
                      languageService.translate('chronicConditions'),
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: Colors.blue,
                      ),
                    ),
                    const SizedBox(height: 8),

                    if (_selectedConditionNames.isNotEmpty)
                      Container(
                        margin: const EdgeInsets.only(bottom: 16),
                        child: Column(
                          children: _selectedConditionNames.map((condition) {
                            return Container(
                              margin: const EdgeInsets.only(bottom: 8),
                              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                              decoration: BoxDecoration(
                                color: Colors.grey.shade50,
                                borderRadius: BorderRadius.circular(8),
                                border: Border.all(color: Colors.grey.shade200),
                              ),
                              child: Row(
                                children: [
                                  Expanded(
                                    child: Text(
                                      condition,
                                      style: const TextStyle(
                                        fontSize: 14,
                                      ),
                                    ),
                                  ),
                                  InkWell(
                                    onTap: () {
                                      setState(() {
                                        final index = _selectedConditionNames.indexOf(condition);
                                        _selectedConditionIds.removeAt(index);
                                        _selectedConditionNames.removeAt(index);
                                      });
                                    },
                                    child: const Icon(
                                      Icons.close,
                                      size: 18,
                                      color: Colors.red,
                                    ),
                                  ),
                                ],
                              ),
                            );
                          }).toList(),
                        ),
                      ),

                    InkWell(
                      onTap: _showConditionSelector,
                      child: Container(
                        width: double.infinity,
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        decoration: BoxDecoration(
                          border: Border.all(color: Colors.blue),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Center(
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              const Icon(Icons.add, color: Colors.blue),
                              const SizedBox(width: 8),
                              Text(
                                languageService.translate('addCondition'),
                                style: const TextStyle(
                                  color: Colors.blue,
                                  fontWeight: FontWeight.w500,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(height: 32),

                    if (_error != null)
                      Padding(
                        padding: const EdgeInsets.only(bottom: 16),
                        child: Text(
                          _error!,
                          style: const TextStyle(color: Colors.red),
                          textAlign: TextAlign.center,
                        ),
                      ),

                    SizedBox(
                      width: double.infinity,
                      height: 55,
                      child: ElevatedButton(
                        onPressed: _isLoading ? null : _saveProfile,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.blue,
                          foregroundColor: Colors.white,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                          elevation: 0,
                        ),
                        child: _isLoading
                            ? const SizedBox(
                                height: 24,
                                width: 24,
                                child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2),
                              )
                            : Text(
                                languageService.translate('continue'),
                                style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                              ),
                      ),
                    ),
                  ],
                ),
              ),
      ),
    );
  }

  Future<void> _saveProfile() async {
    final languageService = Provider.of<LanguageService>(context, listen: false);
    
    final ageText = _ageController.text.trim();
    if (ageText.isEmpty) {
      setState(() => _error = 'Veuillez entrer votre âge');
      return;
    }

    final age = int.tryParse(ageText);
    if (age == null) {
      setState(() => _error = 'Veuillez entrer un âge valide');
      return;
    }

    if (age < 0 || age > 120) {
      setState(() => _error = 'L\'âge doit être entre 0 et 120 ans');
      return;
    }

    setState(() {
      _isLoading = true;
      _error = null;
    });

    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');

      final response = await http.post(
        Uri.parse('${ApiConfig.baseUrl}/profile/setup'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: jsonEncode({
          'age': age,
          'conditions': _selectedConditionIds,
        }),
      );

      if (response.statusCode == 200) {
        await prefs.setBool('profile_completed', true);
        
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('✅ ${languageService.translate('save')} !'),
              backgroundColor: Colors.green,
            ),
          );
          Navigator.pushReplacementNamed(context, '/patientinterface');
        }
      } else {
        final data = jsonDecode(response.body);
        setState(() {
          _error = data['message'] ?? 'Erreur lors de la sauvegarde';
        });
      }
    } catch (e) {
      print('Erreur: $e');
      setState(() {
        _error = 'Erreur de connexion au serveur';
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }
}