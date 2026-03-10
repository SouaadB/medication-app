import 'dart:async';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../services/health_service.dart';
import '../services/language_service.dart';
import 'condition_detail_page.dart';

class HealthOverviewPage extends StatefulWidget {
  const HealthOverviewPage({super.key});

  @override
  State<HealthOverviewPage> createState() => _HealthOverviewPageState();
}

class _HealthOverviewPageState extends State<HealthOverviewPage> {
  bool _isLoading = true;
  String? _errorMessage;
  
  // Dashboard data
  int _overallAdherence = 0;
  int _activeConditions = 0;
  int _currentStreak = 0;
  List<dynamic> _achievements = [];
  List<dynamic> _conditions = [];
  Map<String, dynamic>? _emergencyContact;
  
  // Emergency contact form
  bool _isEditingEmergency = false;
  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _relationshipController = TextEditingController();
  final TextEditingController _phoneController = TextEditingController();
  bool _isEmergencyActive = false;
  bool _isSavingEmergency = false;

  @override
  void initState() {
    super.initState();
    _loadDashboardData();
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

  Future<void> _loadDashboardData() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final data = await HealthService.getDashboard();
      
      setState(() {
        _overallAdherence = data['overallAdherence'] ?? 0;
        _activeConditions = data['activeConditions'] ?? 0;
        _currentStreak = data['currentStreak'] ?? 0;
        _achievements = data['achievements'] ?? [];
        _conditions = data['conditions'] ?? [];
        _emergencyContact = data['emergencyContact'];
        
        if (_emergencyContact != null) {
          _nameController.text = _emergencyContact!['name'] ?? '';
          _relationshipController.text = _emergencyContact!['relationship'] ?? '';
          _phoneController.text = _emergencyContact!['phone_number'] ?? '';
          _isEmergencyActive = _emergencyContact!['is_active'] == 1;
        }
        
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _errorMessage = e.toString();
        _isLoading = false;
      });
    }
  }

  Future<void> _saveEmergencyContact() async {
    final languageService = Provider.of<LanguageService>(context, listen: false);
    
    if (_nameController.text.isEmpty || 
        _relationshipController.text.isEmpty || 
        _phoneController.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(languageService.translate('fillAllFields'))),
      );
      return;
    }

    setState(() => _isSavingEmergency = true);

    try {
      await HealthService.saveEmergencyContact(
        name: _nameController.text,
        relationship: _relationshipController.text,
        phoneNumber: _phoneController.text,
        isActive: _isEmergencyActive,
      );
      
      await _loadDashboardData();
      
      setState(() {
        _isEditingEmergency = false;
        _isSavingEmergency = false;
      });

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(languageService.translate('contactSaved'))),
      );
    } catch (e) {
      setState(() => _isSavingEmergency = false);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error: $e')),
      );
    }
  }

  Future<void> _toggleEmergencyContact(bool value) async {
    setState(() => _isEmergencyActive = value);

    try {
      await HealthService.toggleEmergencyContact(value);
      
      if (_emergencyContact != null) {
        setState(() {
          _emergencyContact!['is_active'] = value ? 1 : 0;
        });
      }
    } catch (e) {
      setState(() => _isEmergencyActive = !value);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error: $e')),
      );
    }
  }

  Future<void> _deleteEmergencyContact() async {
    final languageService = Provider.of<LanguageService>(context, listen: false);
    
    final confirm = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(languageService.translate('deleteContact')),
        content: Text(languageService.translate('confirmDeleteContact')),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: Text(languageService.translate('cancel')),
          ),
          TextButton(
            onPressed: () => Navigator.pop(context, true),
            style: TextButton.styleFrom(foregroundColor: Colors.red),
            child: Text(languageService.translate('delete')),
          ),
        ],
      ),
    );

    if (confirm == true) {
      try {
        await HealthService.deleteEmergencyContact();
        setState(() {
          _emergencyContact = null;
          _nameController.clear();
          _relationshipController.clear();
          _phoneController.clear();
          _isEmergencyActive = false;
        });
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(languageService.translate('contactDeleted'))),
        );
      } catch (e) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error: $e')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final languageService = Provider.of<LanguageService>(context);
    
    if (_isLoading) {
      return Scaffold(
        backgroundColor: Colors.white,
        appBar: AppBar(
          backgroundColor: Colors.white,
          elevation: 0,
          leading: IconButton(
            icon: const Icon(Icons.arrow_back, color: Colors.black54),
            onPressed: () => Navigator.pop(context),
          ),
        ),
        body: const Center(child: CircularProgressIndicator()),
      );
    }

    if (_errorMessage != null) {
      return Scaffold(
        backgroundColor: Colors.white,
        appBar: AppBar(
          backgroundColor: Colors.white,
          elevation: 0,
          leading: IconButton(
            icon: const Icon(Icons.arrow_back, color: Colors.black54),
            onPressed: () => Navigator.pop(context),
          ),
        ),
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.error_outline, color: Colors.red, size: 60),
              const SizedBox(height: 16),
              Text('Error: $_errorMessage'),
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: _loadDashboardData,
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.blue,
                  foregroundColor: Colors.white,
                ),
                child: Text(languageService.translate('retry')),
              ),
            ],
          ),
        ),
      );
    }

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.black54),
          onPressed: () => Navigator.pop(context),
        ),
        actions: [
          Container(
            margin: const EdgeInsets.only(right: 16),
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: Colors.blue.withOpacity(0.1),
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.favorite, color: Colors.blue, size: 24),
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: _loadDashboardData,
        color: Colors.blue,
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          padding: const EdgeInsets.symmetric(horizontal: 20.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildHeader(languageService),
              const SizedBox(height: 32),
              _buildHealthStatistics(languageService),
              const SizedBox(height: 32),
              _buildMedicalConditions(languageService),
              const SizedBox(height: 32),
              _buildEmergencyContact(languageService),
              const SizedBox(height: 32),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildHeader(LanguageService lang) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          lang.translate('healthOverview'),
          style: const TextStyle(
            fontSize: 28,
            fontWeight: FontWeight.bold,
            color: Color(0xFF1A237E),
          ),
        ),
        const SizedBox(height: 4),
        Text(
          lang.translate('healthSnapshot'),
          style: TextStyle(
            fontSize: 16,
            color: Colors.grey.shade600,
          ),
        ),
      ],
    );
  }

  Widget _buildHealthStatistics(LanguageService lang) {
    return Container(
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
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            lang.translate('healthStatistics'),
            style: const TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: Color(0xFF1A237E),
            ),
          ),
          const SizedBox(height: 20),
          GridView.count(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            crossAxisCount: 2,
            crossAxisSpacing: 16,
            mainAxisSpacing: 16,
            childAspectRatio: 1.1,
            children: [
              GestureDetector(
                onTap: () {},
                child: _buildStatItem(
                  Icons.favorite_border,
                  '$_overallAdherence%',
                  lang.translate('overallAdherence'),
                  Colors.blue.withOpacity(0.05),
                  Colors.blue,
                ),
              ),
              GestureDetector(
                onTap: () {
                  Navigator.pushNamed(context, '/conditions');
                },
                child: _buildStatItem(
                  Icons.timeline,
                  '$_activeConditions',
                  lang.translate('activeConditions'),
                  Colors.green.withOpacity(0.05),
                  Colors.green,
                ),
              ),
              GestureDetector(
                onTap: () {},
                child: _buildStatItem(
                  Icons.access_time,
                  '$_currentStreak ${_currentStreak == 1 ? lang.translate('day') : lang.translate('days')}',
                  lang.translate('currentStreak'),
                  Colors.orange.withOpacity(0.05),
                  Colors.orange,
                ),
              ),
              GestureDetector(
                onTap: () {
                  _showAchievementsDialog(lang);
                },
                child: _buildStatItem(
                  Icons.emoji_events_outlined,
                  '${_achievements.length}',
                  lang.translate('achievements'),
                  Colors.purple.withOpacity(0.05),
                  Colors.purple,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildStatItem(IconData icon, String value, String label, Color bgColor, Color iconColor) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: bgColor,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(icon, color: iconColor, size: 28),
          const SizedBox(height: 12),
          Text(
            value,
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
              color: iconColor,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            label,
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 11,
              color: Colors.grey.shade600,
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMedicalConditions(LanguageService lang) {
    if (_conditions.isEmpty) {
      return Container(
        padding: const EdgeInsets.all(24),
        decoration: BoxDecoration(
          color: Colors.grey.shade50,
          borderRadius: BorderRadius.circular(24),
        ),
        child: Column(
          children: [
            const Icon(Icons.medical_services_outlined, size: 40, color: Colors.grey),
            const SizedBox(height: 12),
            Text(
              lang.translate('noConditions'),
              style: TextStyle(color: Colors.grey.shade600),
            ),
            const SizedBox(height: 4),
            Text(
              lang.translate('addConditionsPrompt'),
              textAlign: TextAlign.center,
              style: TextStyle(color: Colors.grey.shade500, fontSize: 12),
            ),
          ],
        ),
      );
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          lang.translate('medicalConditions'),
          style: const TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.bold,
            color: Color(0xFF1A237E),
          ),
        ),
        const SizedBox(height: 16),
        ..._conditions.map((condition) {
          final color = _getColorForCondition(condition['name'] ?? '');
          return GestureDetector(
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
            child: Container(
              margin: const EdgeInsets.only(bottom: 12),
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.grey.shade50,
                borderRadius: BorderRadius.circular(16),
              ),
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: color,
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(Icons.favorite, color: Colors.white, size: 24),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          _translateConditionName(condition['name'] ?? 'Unknown', lang),
                          style: const TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: Color(0xFF1A237E),
                          ),
                        ),
                        const SizedBox(height: 4),
                        Row(
                          children: [
                            Text(
                              '${condition['medication_count'] ?? 0} ${lang.translate('medications')}',
                              style: TextStyle(
                                fontSize: 12,
                                color: Colors.grey.shade500,
                              ),
                            ),
                            const SizedBox(width: 12),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                              decoration: BoxDecoration(
                                color: Colors.green.withOpacity(0.1),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: Text(
                                '${condition['adherence_rate'] ?? 0}%',
                                style: const TextStyle(
                                  color: Colors.green,
                                  fontSize: 12,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                  const Icon(Icons.chevron_right, color: Colors.grey),
                ],
              ),
            ),
          );
        }).toList(),
        const SizedBox(height: 8),
        Center(
          child: TextButton(
            onPressed: () {
              Navigator.pushNamed(context, '/conditions');
            },
            child: Text(
              lang.translate('viewAllConditions'),
              style: const TextStyle(color: Colors.blue, fontWeight: FontWeight.bold),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildEmergencyContact(LanguageService lang) {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: Colors.red.withOpacity(0.02),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: Colors.red.withOpacity(0.1)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                lang.translate('emergencyContact'),
                style: const TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFF1A237E),
                ),
              ),
              if (_emergencyContact != null && !_isEditingEmergency)
                Switch(
                  value: _isEmergencyActive,
                  onChanged: _toggleEmergencyContact,
                  activeColor: Colors.green,
                ),
            ],
          ),
          const SizedBox(height: 20),
          
          if (_isEditingEmergency) ...[
            _buildContactInput(Icons.person_outline, lang.translate('name'), _nameController),
            const SizedBox(height: 16),
            _buildContactInput(Icons.favorite_border, lang.translate('relationship'), _relationshipController),
            const SizedBox(height: 16),
            _buildContactInput(Icons.phone_outlined, lang.translate('phone'), _phoneController, keyboardType: TextInputType.phone),
            const SizedBox(height: 24),
            Row(
              children: [
                Expanded(
                  child: ElevatedButton(
                    onPressed: _isSavingEmergency ? null : _saveEmergencyContact,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.green,
                      foregroundColor: Colors.white,
                    ),
                    child: _isSavingEmergency
                        ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                        : Text(lang.translate('save')),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: TextButton(
                    onPressed: () {
                      setState(() {
                        _isEditingEmergency = false;
                        if (_emergencyContact != null) {
                          _nameController.text = _emergencyContact!['name'] ?? '';
                          _relationshipController.text = _emergencyContact!['relationship'] ?? '';
                          _phoneController.text = _emergencyContact!['phone_number'] ?? '';
                        }
                      });
                    },
                    child: Text(lang.translate('cancel')),
                  ),
                ),
              ],
            ),
          ] else if (_emergencyContact != null) ...[
            _buildContactInfo(Icons.person_outline, lang.translate('name'), _emergencyContact!['name'] ?? ''),
            const SizedBox(height: 16),
            _buildContactInfo(Icons.favorite_border, lang.translate('relationship'), _emergencyContact!['relationship'] ?? ''),
            const SizedBox(height: 16),
            _buildContactInfo(Icons.phone_outlined, lang.translate('phone'), _emergencyContact!['phone_number'] ?? ''),
            const SizedBox(height: 24),
            Container(
              padding: const EdgeInsets.all(12),
              width: double.infinity,
              decoration: BoxDecoration(
                color: _isEmergencyActive ? Colors.green.withOpacity(0.05) : Colors.grey.withOpacity(0.05),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Text(
                _isEmergencyActive
                    ? lang.translate('contactActive')
                    : lang.translate('contactInactive'),
                textAlign: TextAlign.center,
                style: TextStyle(
                  color: _isEmergencyActive ? Colors.green : Colors.grey,
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
            const SizedBox(height: 16),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                TextButton.icon(
                  onPressed: () => setState(() => _isEditingEmergency = true),
                  icon: const Icon(Icons.edit, size: 18),
                  label: Text(lang.translate('edit')),
                ),
                TextButton.icon(
                  onPressed: _deleteEmergencyContact,
                  icon: const Icon(Icons.delete, size: 18, color: Colors.red),
                  label: Text(lang.translate('remove'), style: const TextStyle(color: Colors.red)),
                ),
              ],
            ),
          ] else ...[
            const Center(
              child: Icon(Icons.warning_amber_rounded, color: Colors.orange, size: 40),
            ),
            const SizedBox(height: 16),
            Text(
              lang.translate('noContact'),
              textAlign: TextAlign.center,
              style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            Text(
              lang.translate('addContactPrompt'),
              textAlign: TextAlign.center,
              style: TextStyle(color: Colors.grey.shade600, fontSize: 14),
            ),
            const SizedBox(height: 24),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () => setState(() => _isEditingEmergency = true),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.blue,
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(30),
                  ),
                ),
                child: Text(lang.translate('addContact')),
              ),
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildContactInput(IconData icon, String label, TextEditingController controller, {TextInputType? keyboardType}) {
    return TextField(
      controller: controller,
      keyboardType: keyboardType,
      decoration: InputDecoration(
        labelText: label,
        prefixIcon: Icon(icon, color: Colors.red.withOpacity(0.4)),
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
      ),
    );
  }

  Widget _buildContactInfo(IconData icon, String label, String value) {
    return Row(
      children: [
        Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: Colors.red.withOpacity(0.05),
            shape: BoxShape.circle,
          ),
          child: Icon(icon, color: Colors.red.withOpacity(0.4), size: 20),
        ),
        const SizedBox(width: 16),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              label,
              style: TextStyle(
                fontSize: 11,
                color: Colors.grey.shade500,
              ),
            ),
            Text(
              value,
              style: const TextStyle(
                fontSize: 15,
                fontWeight: FontWeight.bold,
                color: Color(0xFF1A237E),
              ),
            ),
          ],
        ),
      ],
    );
  }

  void _showAchievementsDialog(LanguageService lang) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(lang.translate('yourAchievements')),
        content: SizedBox(
          width: double.maxFinite,
          child: _achievements.isEmpty
              ? Text(lang.translate('noAchievements'))
              : ListView.builder(
                  shrinkWrap: true,
                  itemCount: _achievements.length,
                  itemBuilder: (context, index) {
                    final achievement = _achievements[index];
                    return ListTile(
                      leading: Text(
                        achievement['badge_icon'] ?? '🏆',
                        style: const TextStyle(fontSize: 30),
                      ),
                      title: Text(achievement['name'] ?? ''),
                      subtitle: Text(achievement['description'] ?? ''),
                    );
                  },
                ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text(lang.translate('close')),
          ),
        ],
      ),
    );
  }

  Color _getColorForCondition(String name) {
    if (name.isEmpty) return Colors.blue;
    final List<Color> colors = [Colors.blue, Colors.green, Colors.orange, Colors.purple, Colors.teal];
    final int hash = name.hashCode.abs();
    return colors[hash % colors.length];
  }
}