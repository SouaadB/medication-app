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
  
  // For adding conditions
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
    _loadAvailableConditions(); // ← PRE-LOAD conditions when page opens
    _searchController.addListener(_filterConditions);
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
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

  Future<void> _loadConditions() async {
    setState(() => _isLoading = true);
    try {
      final conditions = await ConditionService.getPatientConditions();
      setState(() {
        _conditions = conditions;
        _isLoading = false;
      });
    } catch (e) {
      setState(() => _isLoading = false);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error loading conditions: $e')),
      );
    }
  }

  Future<void> _loadAvailableConditions() async {
    // If already loaded, use cached data
    if (_hasLoadedAvailableConditions && _availableConditions.isNotEmpty) {
      setState(() {
        _filteredConditions = _availableConditions;
      });
      return;
    }
    
    setState(() => _loadingAvailableConditions = true);
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');

      final response = await http.get(
        Uri.parse('${ApiConfig.baseUrl}/conditions/available'),
        headers: {
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        setState(() {
          _availableConditions = List<Map<String, dynamic>>.from(data['data']);
          _filteredConditions = _availableConditions;
          _loadingAvailableConditions = false;
          _hasLoadedAvailableConditions = true;
        });
      }
    } catch (e) {
      print('Error loading available conditions: $e');
      setState(() => _loadingAvailableConditions = false);
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

  void _showAddConditionDialog() {
    _selectedConditionIds.clear();
    _selectedConditionNames.clear();
    _searchController.clear();
    
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
                  
                  // Show conditions immediately (no loading spinner)
                  _availableConditions.isEmpty && _loadingAvailableConditions
                      ? const Expanded(
                          child: Center(
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                CircularProgressIndicator(color: Colors.blue),
                                SizedBox(height: 16),
                                Text(
                                  'Chargement des conditions...',
                                  style: TextStyle(color: Colors.grey, fontSize: 14),
                                ),
                              ],
                            ),
                          ),
                        )
                      : _filteredConditions.isEmpty
                          ? Expanded(
                              child: Center(
                                child: Column(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    Icon(
                                      Icons.info_outline,
                                      size: 48,
                                      color: Colors.grey.shade400,
                                    ),
                                    const SizedBox(height: 16),
                                    Text(
                                      _availableConditions.isEmpty
                                          ? (languageService.translate('noConditionsAvailable') ?? 'Aucune condition disponible')
                                          : (languageService.translate('noSearchResults') ?? 'Aucun résultat trouvé'),
                                      style: TextStyle(
                                        fontSize: 16,
                                        color: Colors.grey.shade600,
                                      ),
                                      textAlign: TextAlign.center,
                                    ),
                                  ],
                                ),
                              ),
                            )
                          : Expanded(
                              child: ListView.builder(
                                itemCount: _filteredConditions.length,
                                itemBuilder: (context, index) {
                                  final condition = _filteredConditions[index];
                                  final isSelected = _selectedConditionIds.contains(condition['id']);
                                  
                                  return ListTile(
                                    title: Text(
                                      _translateConditionName(condition['name'], languageService),
                                      style: const TextStyle(fontSize: 16),
                                    ),
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
                  
                  if (_selectedConditionNames.isNotEmpty)
                    Padding(
                      padding: const EdgeInsets.symmetric(vertical: 8),
                      child: Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: Colors.blue.withOpacity(0.1),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              '${languageService.translate('selected')} (${_selectedConditionNames.length}):',
                              style: const TextStyle(
                                fontWeight: FontWeight.bold,
                                color: Colors.blue,
                              ),
                            ),
                            const SizedBox(height: 8),
                            Wrap(
                              spacing: 8,
                              runSpacing: 4,
                              children: _selectedConditionNames.map((name) {
                                return Chip(
                                  label: Text(_translateConditionName(name, languageService)),
                                  backgroundColor: Colors.blue.withOpacity(0.2),
                                  labelStyle: const TextStyle(fontSize: 12),
                                );
                              }).toList(),
                            ),
                          ],
                        ),
                      ),
                    ),
                  
                  Padding(
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    child: Row(
                      children: [
                        Expanded(
                          child: ElevatedButton(
                            onPressed: _selectedConditionIds.isEmpty ? null : () {
                              Navigator.pop(context);
                              _addSelectedConditions();
                            },
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.blue,
                              foregroundColor: Colors.white,
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(12),
                              ),
                              padding: const EdgeInsets.symmetric(vertical: 16),
                            ),
                            child: Text(languageService.translate('add')),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: TextButton(
                            onPressed: () => Navigator.pop(context),
                            style: TextButton.styleFrom(
                              foregroundColor: Colors.grey,
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(12),
                              ),
                              padding: const EdgeInsets.symmetric(vertical: 16),
                            ),
                            child: Text(languageService.translate('cancel')),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            );
          },
        );
      },
    );
  }

  Future<void> _addSelectedConditions() async {
    if (_selectedConditionIds.isEmpty) return;

    setState(() => _isLoading = true);

    try {
      for (int conditionId in _selectedConditionIds) {
        await ConditionService.addCondition(conditionId);
      }
      
      await _loadConditions();
      await _loadAvailableConditions(); // Refresh available conditions
      
      if (mounted) {
        final languageService = Provider.of<LanguageService>(context, listen: false);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('${_selectedConditionIds.length} ${languageService.translate('conditionsAdded')}'),
            backgroundColor: Colors.green,
          ),
        );
      }
    } catch (e) {
      setState(() => _isLoading = false);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error: $e')),
        );
      }
    }
  }

  Future<void> _removeCondition(int conditionId, String conditionName) async {
    final languageService = Provider.of<LanguageService>(context, listen: false);
    
    final confirm = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(languageService.translate('removeCondition')),
        content: Text('${languageService.translate('confirmRemoveCondition')} "$conditionName"?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: Text(languageService.translate('cancel')),
          ),
          TextButton(
            onPressed: () => Navigator.pop(context, true),
            style: TextButton.styleFrom(foregroundColor: Colors.red),
            child: Text(languageService.translate('remove')),
          ),
        ],
      ),
    );

    if (confirm == true) {
      setState(() => _isLoading = true);
      try {
        await ConditionService.removeCondition(conditionId);
        await _loadConditions();
        await _loadAvailableConditions(); // Refresh available conditions
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(languageService.translate('conditionRemoved')),
              backgroundColor: Colors.green,
            ),
          );
        }
      } catch (e) {
        setState(() => _isLoading = false);
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Error: $e')),
          );
        }
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
          icon: const Icon(Icons.arrow_back, color: Colors.black54),
          onPressed: () => Navigator.pop(context),
        ),
        title: Text(
          languageService.translate('myConditions'),
          style: const TextStyle(
            color: Color(0xFF1A237E),
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : Column(
              children: [
                Padding(
                  padding: const EdgeInsets.all(20.0),
                  child: Text(
                    languageService.translate('manageConditions'),
                    style: TextStyle(
                      fontSize: 14,
                      color: Colors.grey.shade600,
                    ),
                  ),
                ),
                Expanded(
                  child: _conditions.isEmpty
                      ? Center(
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Container(
                                padding: const EdgeInsets.all(20),
                                decoration: BoxDecoration(
                                  color: Colors.blue.withOpacity(0.1),
                                  shape: BoxShape.circle,
                                ),
                                child: const Icon(
                                  Icons.medical_services_outlined,
                                  size: 60,
                                  color: Colors.blue,
                                ),
                              ),
                              const SizedBox(height: 24),
                              Text(
                                languageService.translate('noConditions'),
                                style: const TextStyle(
                                  fontSize: 20,
                                  fontWeight: FontWeight.bold,
                                  color: Color(0xFF1A237E),
                                ),
                              ),
                              const SizedBox(height: 8),
                              Padding(
                                padding: const EdgeInsets.symmetric(horizontal: 40),
                                child: Text(
                                  languageService.translate('addConditionsPrompt'),
                                  textAlign: TextAlign.center,
                                  style: TextStyle(
                                    fontSize: 14,
                                    color: Colors.grey.shade600,
                                  ),
                                ),
                              ),
                              const SizedBox(height: 32),
                              ElevatedButton(
                                onPressed: _showAddConditionDialog,
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: Colors.blue,
                                  foregroundColor: Colors.white,
                                  padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(30),
                                  ),
                                ),
                                child: Text(languageService.translate('addCondition')),
                              ),
                            ],
                          ),
                        )
                      : ListView.builder(
                          padding: const EdgeInsets.all(16),
                          itemCount: _conditions.length,
                          itemBuilder: (context, index) {
                            final condition = _conditions[index];
                            final color = _getColorForCondition(condition['name'] ?? '');
                            final medicationCount = condition['medication_count'] ?? 0;
                            
                            return Container(
                              margin: const EdgeInsets.only(bottom: 12),
                              decoration: BoxDecoration(
                                color: Colors.white,
                                borderRadius: BorderRadius.circular(16),
                                boxShadow: [
                                  BoxShadow(
                                    color: Colors.black.withOpacity(0.05),
                                    blurRadius: 10,
                                    offset: const Offset(0, 4),
                                  ),
                                ],
                              ),
                              child: ListTile(
                                contentPadding: const EdgeInsets.all(16),
                                leading: Container(
                                  padding: const EdgeInsets.all(12),
                                  decoration: BoxDecoration(
                                    color: color.withOpacity(0.1),
                                    shape: BoxShape.circle,
                                  ),
                                  child: Icon(
                                    Icons.favorite,
                                    color: color,
                                    size: 24,
                                  ),
                                ),
                                title: Text(
                                  _translateConditionName(condition['name'] ?? 'Unknown', languageService),
                                  style: const TextStyle(
                                    fontSize: 16,
                                    fontWeight: FontWeight.bold,
                                    color: Color(0xFF1A237E),
                                  ),
                                ),
                                subtitle: Text(
                                  '$medicationCount ${medicationCount == 1 ? languageService.translate('medication') : languageService.translate('medications')}',
                                  style: TextStyle(
                                    fontSize: 13,
                                    color: Colors.grey.shade600,
                                  ),
                                ),
                                trailing: Row(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                      decoration: BoxDecoration(
                                        color: Colors.green.withOpacity(0.1),
                                        borderRadius: BorderRadius.circular(12),
                                      ),
                                      child: Text(
                                        '${condition['adherence_rate'] ?? 0}%',
                                        style: const TextStyle(
                                          color: Colors.green,
                                          fontWeight: FontWeight.bold,
                                          fontSize: 14,
                                        ),
                                      ),
                                    ),
                                    IconButton(
                                      icon: const Icon(Icons.delete, color: Colors.red, size: 20),
                                      onPressed: () => _removeCondition(condition['id'], condition['name']),
                                    ),
                                  ],
                                ),
                                onTap: () {
                                  Navigator.push(
                                    context,
                                    MaterialPageRoute(
                                      builder: (context) => ConditionDetailPage(
                                        condition: {
                                          'id': condition['id'],
                                          'name': condition['name'],
                                          'percentage': condition['adherence_rate'] ?? 0,
                                          'color': color,
                                        },
                                      ),
                                    ),
                                  );
                                },
                              ),
                            );
                          },
                        ),
                ),
              ],
            ),
      floatingActionButton: _conditions.isNotEmpty
          ? FloatingActionButton(
              onPressed: _showAddConditionDialog,
              backgroundColor: Colors.blue,
              child: const Icon(Icons.add, color: Colors.white),
            )
          : null,
    );
  }

  Color _getColorForCondition(String name) {
    if (name.isEmpty) return Colors.blue;
    final List<Color> colors = [Colors.blue, Colors.green, Colors.orange, Colors.purple, Colors.teal];
    final int hash = name.hashCode.abs();
    return colors[hash % colors.length];
  }
}