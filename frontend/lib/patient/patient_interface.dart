import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';
import 'package:provider/provider.dart';
import '../config/api_config.dart';
import 'condition_detail_page.dart';
import '../services/language_service.dart';
import '../services/condition_service.dart';

class PatientInterface extends StatefulWidget {
  const PatientInterface({super.key});

  @override
  State<PatientInterface> createState() => _PatientInterfaceState();
}

class _PatientInterfaceState extends State<PatientInterface> {
  bool _isLoading = true;
  bool _isLoggingOut = false;
  Map<String, dynamic>? _userData;
  String? _errorMessage;
  int _selectedIndex = 0;

  double _overallAdherence = 0.0;
  List<Map<String, dynamic>> _patientConditions = [];
  bool _loadingConditions = false;
  List<Map<String, dynamic>> _nextMedications = [];

  @override
  void initState() {
    super.initState();
    _loadUserData().then((_) {
      _loadPatientConditions();
      _loadAdherenceData();
      _loadNextMedications();
    });
  }

  Future<void> _loadUserData() async {
    if (!mounted) return;
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final prefs = await SharedPreferences.getInstance();
      final String? token = prefs.getString('auth_token');

      if (token == null) {
        _redirectToSignIn();
        return;
      }

      final response = await http.get(
        Uri.parse('${ApiConfig.baseUrl}/auth/me'),
        headers: ApiConfig.getAuthHeaders(token),
      ).timeout(const Duration(seconds: 10));

      final Map<String, dynamic> data = jsonDecode(response.body);

      if (response.statusCode == 200 && data['success'] == true) {
        if (mounted) {
          setState(() {
            _userData = data['user'];
            _isLoading = false;
          });
        }
        await prefs.setString('user_name', data['user']['name']?.toString() ?? '');
        await prefs.setString('user_email', data['user']['email']?.toString() ?? '');
      } else {
        await prefs.remove('auth_token');
        _redirectToSignIn();
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _errorMessage = 'Impossible de charger les données. Vérifiez votre connexion.';
          _isLoading = false;
        });
      }
    }
  }

  Future<void> _loadPatientConditions() async {
    setState(() => _loadingConditions = true);
    
    try {
      final conditions = await ConditionService.getPatientConditions();
      
      setState(() {
        _patientConditions = conditions.map<Map<String, dynamic>>((c) {
          final String conditionName = c['name'] as String? ?? 'Unknown';
          return {
            'id': c['id'] ?? 0,
            'name': conditionName,
            'percentage': c['adherence_rate'] ?? 85,
            'color': _getColorForCondition(conditionName),
          };
        }).toList();
        _loadingConditions = false;
      });
    } catch (e) {
      print('Erreur chargement conditions: $e');
      setState(() => _loadingConditions = false);
    }
  }

  Future<void> _loadAdherenceData() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final String? token = prefs.getString('auth_token');

      if (token == null) return;

      final response = await http.get(
        Uri.parse('${ApiConfig.baseUrl}/patient/adherence'),
        headers: ApiConfig.getAuthHeaders(token),
      );

      if (response.statusCode == 200) {
        final Map<String, dynamic> data = jsonDecode(response.body);
        setState(() {
          _overallAdherence = (data['adherence'] as num?)?.toDouble() ?? 0.0;
        });
      }
    } catch (e) {
      print('Erreur chargement adhérence: $e');
    }
  }

  Future<void> _loadNextMedications() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final String? token = prefs.getString('auth_token');

      if (token == null) return;

      final response = await http.get(
        Uri.parse('${ApiConfig.baseUrl}/patient/next-medications'),
        headers: ApiConfig.getAuthHeaders(token),
      );

      if (response.statusCode == 200) {
        final Map<String, dynamic> data = jsonDecode(response.body);
        final List<dynamic> meds = data['medications'];
        if (meds != null) {
          setState(() {
            _nextMedications = List<Map<String, dynamic>>.from(meds);
          });
        }
      }
    } catch (e) {
      print('Erreur chargement médicaments: $e');
    }
  }

  Color _getColorForCondition(String name) {
    if (name.isEmpty) return Colors.blue;
    final List<Color> colors = [Colors.blue, Colors.green, Colors.orange, Colors.purple, Colors.teal];
    final int hash = name.hashCode.abs();
    return colors[hash % colors.length];
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

  void _redirectToSignIn() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (mounted) {
        Navigator.pushReplacementNamed(context, '/signin');
      }
    });
  }

  Future<void> _logout() async {
    setState(() => _isLoggingOut = true);

    try {
      final prefs = await SharedPreferences.getInstance();
      final String? token = prefs.getString('auth_token');

      if (token != null) {
        await http.post(
          Uri.parse('${ApiConfig.baseUrl}/auth/logout'),
          headers: ApiConfig.getAuthHeaders(token),
        ).timeout(const Duration(seconds: 10));
      }

      await prefs.clear();
      if (mounted) {
        Navigator.pushReplacementNamed(context, '/signin');
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('👋 Déconnexion réussie !'), backgroundColor: Colors.green),
        );
      }
    } catch (error) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('❌ Erreur lors de la déconnexion'), backgroundColor: Colors.red),
        );
      }
    } finally {
      if (mounted) setState(() => _isLoggingOut = false);
    }
  }

  Widget _buildLanguageItem(BuildContext context) {
    return Consumer<LanguageService>(
      builder: (context, languageService, child) {
        final currentLang = languageService.getCurrentLanguage();
        final langText = currentLang == 'en' ? 'English' : 'Français';
        
        return ListTile(
          leading: const Icon(Icons.language, color: Colors.blue, size: 24),
          title: Text(
            languageService.translate('language'),
            style: const TextStyle(
              color: Color(0xFF1A237E),
              fontSize: 16,
              fontWeight: FontWeight.w500,
            ),
          ),
          trailing: Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            decoration: BoxDecoration(
              color: Colors.blue.withOpacity(0.1),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Text(
              langText,
              style: const TextStyle(
                color: Colors.blue,
                fontWeight: FontWeight.bold,
                fontSize: 14,
              ),
            ),
          ),
          onTap: () => _showLanguageDialog(context, languageService),
        );
      },
    );
  }

  Future<void> _showLanguageDialog(BuildContext context, LanguageService languageService) async {
    final currentLang = languageService.getCurrentLanguage();
    
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text(
            languageService.translate('language'),
            style: const TextStyle(color: Colors.blue, fontWeight: FontWeight.bold),
          ),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              ListTile(
                title: const Text('English'),
                leading: Radio<String>(
                  value: 'en',
                  groupValue: currentLang,
                  onChanged: (String? value) {
                    Navigator.pop(context);
                    languageService.setLanguage('en');
                  },
                ),
              ),
              ListTile(
                title: const Text('Français'),
                leading: Radio<String>(
                  value: 'fr',
                  groupValue: currentLang,
                  onChanged: (String? value) {
                    Navigator.pop(context);
                    languageService.setLanguage('fr');
                  },
                ),
              ),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: Text(languageService.translate('cancel')),
            ),
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final languageService = Provider.of<LanguageService>(context);
    
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: Builder(
          builder: (BuildContext context) => IconButton(
            icon: const Icon(Icons.menu, color: Colors.black54),
            onPressed: () => Scaffold.of(context).openDrawer(),
          ),
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
      drawer: _buildDrawer(context, languageService),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _errorMessage != null
              ? _buildErrorView(theme)
              : RefreshIndicator(
                  onRefresh: () async {
                    await _loadUserData();
                    await _loadPatientConditions();
                    await _loadAdherenceData();
                    await _loadNextMedications();
                  },
                  child: SingleChildScrollView(
                    physics: const AlwaysScrollableScrollPhysics(),
                    padding: const EdgeInsets.symmetric(horizontal: 20.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        _buildDashboardHeader(theme, languageService),
                        const SizedBox(height: 32),
                        _buildAdherenceCard(theme, languageService),
                        const SizedBox(height: 32),
                        _buildConditionsSection(theme, languageService),
                        const SizedBox(height: 32),
                        _buildNextMedicationCard(theme, languageService),
                        const SizedBox(height: 32),
                        _buildQuickActionsGrid(theme, languageService),
                        const SizedBox(height: 32),
                      ],
                    ),
                  ),
                ),
      bottomNavigationBar: _buildBottomNavigationBar(theme, languageService),
    );
  }

  Widget _buildDashboardHeader(ThemeData theme, LanguageService lang) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          lang.translate('dashboard'),
          style: const TextStyle(
            fontSize: 28,
            fontWeight: FontWeight.bold,
            color: Color(0xFF1A237E),
          ),
        ),
        const SizedBox(height: 4),
        Text(
          lang.translate('trackMedication'),
          style: TextStyle(
            fontSize: 16,
            color: Colors.grey.shade600,
          ),
        ),
      ],
    );
  }

  Widget _buildAdherenceCard(ThemeData theme, LanguageService lang) {
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
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                lang.translate('overallAdherence'),
                style: const TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w600,
                  color: Color(0xFF1A237E),
                ),
              ),
              Text(
                '${(_overallAdherence * 100).toInt()}%',
                style: const TextStyle(
                  fontSize: 28,
                  fontWeight: FontWeight.bold,
                  color: Colors.blue,
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          if (_overallAdherence > 0)
            ClipRRect(
              borderRadius: BorderRadius.circular(10),
              child: LinearProgressIndicator(
                value: _overallAdherence,
                backgroundColor: Colors.grey.shade100,
                valueColor: const AlwaysStoppedAnimation<Color>(Colors.blue),
                minHeight: 12,
              ),
            ),
          const SizedBox(height: 12),
          Text(
            _overallAdherence > 0 
                ? lang.translate('greatJob')
                : lang.translate('noAdherenceData'),
            style: TextStyle(
              fontSize: 14,
              color: Colors.grey.shade600,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildConditionsSection(ThemeData theme, LanguageService lang) {
    if (_patientConditions.isEmpty) {
      return const SizedBox.shrink();
    }
    
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              lang.translate('yourConditions'),
              style: const TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: Color(0xFF1A237E),
              ),
            ),
            TextButton(
              onPressed: () {
                Navigator.pushNamed(context, '/conditions');
              },
              child: Text(
                lang.translate('viewAll'),
                style: const TextStyle(color: Colors.blue),
              ),
            ),
          ],
        ),
        const SizedBox(height: 16),
        SizedBox(
          height: 160,
          child: _loadingConditions
              ? const Center(child: CircularProgressIndicator())
              : ListView.builder(
                  scrollDirection: Axis.horizontal,
                  itemCount: _patientConditions.length,
                  itemBuilder: (BuildContext context, int index) {
                    final condition = _patientConditions[index];
                    return _buildConditionCard(condition, lang);
                  },
                ),
        ),
      ],
    );
  }

  Widget _buildConditionCard(Map<String, dynamic> condition, LanguageService lang) {
    final String conditionName = condition['name'] as String? ?? 'Unknown';
    
    // Fix: Handle both String and int for percentage
    final int conditionPercentage;
    final dynamic percentageValue = condition['percentage'];
    if (percentageValue is String) {
      conditionPercentage = int.tryParse(percentageValue) ?? 0;
    } else if (percentageValue is int) {
      conditionPercentage = percentageValue;
    } else if (percentageValue is double) {
      conditionPercentage = percentageValue.toInt();
    } else {
      conditionPercentage = 0;
    }
    
    final Color conditionColor = condition['color'] as Color? ?? Colors.blue;
    
    return GestureDetector(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => ConditionDetailPage(condition: condition),
          ),
        );
      },
      child: Container(
        width: 160,
        margin: const EdgeInsets.only(right: 16),
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(24),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.05),
              blurRadius: 15,
              offset: const Offset(0, 5),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: conditionColor.withOpacity(0.1),
                shape: BoxShape.circle,
              ),
              child: Icon(Icons.circle, color: conditionColor, size: 24),
            ),
            const Spacer(),
            Text(
              _translateConditionName(conditionName, lang),
              style: const TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w600,
                color: Color(0xFF1A237E),
              ),
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),
            const SizedBox(height: 8),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  '$conditionPercentage%',
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    color: conditionColor,
                  ),
                ),
                Icon(Icons.chevron_right, color: Colors.grey.shade400, size: 20),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildNextMedicationCard(ThemeData theme, LanguageService lang) {
    if (_nextMedications.isEmpty) {
      return const SizedBox.shrink();
    }
    
    final medication = _nextMedications.first;
    final String medicationName = medication['name'] as String? ?? 'No medication';
    final String medicationCondition = medication['condition'] as String? ?? '';
    final String medicationTime = medication['time'] as String? ?? '--:--';
    
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          lang.translate('nextMedication'),
          style: const TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.bold,
            color: Color(0xFF1A237E),
          ),
        ),
        const SizedBox(height: 16),
        GestureDetector(
          onTap: () {
            // Navigate to medication details
          },
          child: Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFF42A5F5), Color(0xFF2196F3)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(24),
              boxShadow: [
                BoxShadow(
                  color: Colors.blue.withOpacity(0.3),
                  blurRadius: 20,
                  offset: const Offset(0, 10),
                ),
              ],
            ),
            child: Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        medicationName,
                        style: const TextStyle(
                          fontSize: 22,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        _translateConditionName(medicationCondition, lang),
                        style: TextStyle(
                          fontSize: 14,
                          color: Colors.white.withOpacity(0.8),
                        ),
                      ),
                      const SizedBox(height: 24),
                      Text(
                        medicationTime,
                        style: const TextStyle(
                          fontSize: 28,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                    ],
                  ),
                ),
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.2),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(Icons.access_time, color: Colors.white, size: 32),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildQuickActionsGrid(ThemeData theme, LanguageService lang) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          lang.translate('quickActions'),
          style: const TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.bold,
            color: Color(0xFF1A237E),
          ),
        ),
        const SizedBox(height: 16),
        Row(
          children: [
            Expanded(
              child: GestureDetector(
                onTap: () {
                  // Navigate to insights
                },
                child: _buildQuickActionCard(lang.translate('smartInsights'), Icons.insights, Colors.blue),
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: GestureDetector(
                onTap: () {
                  // Navigate to history
                },
                child: _buildQuickActionCard(lang.translate('viewHistory'), Icons.history, Colors.blue),
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildQuickActionCard(String title, IconData icon, Color color) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 15,
            offset: const Offset(0, 5),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, color: color, size: 28),
          const SizedBox(height: 12),
          Text(
            title,
            style: const TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w600,
              color: Color(0xFF1A237E),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBottomNavigationBar(ThemeData theme, LanguageService lang) {
    return BottomNavigationBar(
      currentIndex: _selectedIndex,
      onTap: (int index) {
        if (index == 3) { // Health Overview tab
          Navigator.pushNamed(context, '/healthoverview');
        } else if (index == 1) { // Conditions tab
          Navigator.pushNamed(context, '/conditions');
        } else if (index == 2) { // History tab
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('History page coming soon')),
          );
        } else {
          setState(() {
            _selectedIndex = index;
          });
        }
      },
      type: BottomNavigationBarType.fixed,
      backgroundColor: Colors.white,
      selectedItemColor: Colors.blue,
      unselectedItemColor: Colors.grey,
      showSelectedLabels: true,
      showUnselectedLabels: true,
      elevation: 20,
      items: [
        BottomNavigationBarItem(
          icon: const Icon(Icons.home_outlined),
          activeIcon: const Icon(Icons.home),
          label: lang.translate('home'),
        ),
        BottomNavigationBarItem(
          icon: const Icon(Icons.show_chart),
          label: lang.translate('conditions'),
        ),
        BottomNavigationBarItem(
          icon: const Icon(Icons.history),
          label: lang.translate('history'),
        ),
        BottomNavigationBarItem(
          icon: const Icon(Icons.person_outline),
          activeIcon: const Icon(Icons.person),
          label: lang.translate('healthOverview'),
        ),
      ],
    );
  }

  Widget _buildErrorView(ThemeData theme) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(40.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.cloud_off_rounded, size: 80, color: Colors.grey),
            const SizedBox(height: 24),
            Text(
              _errorMessage!,
              textAlign: TextAlign.center,
              style: theme.textTheme.bodyLarge,
            ),
            const SizedBox(height: 32),
            ElevatedButton(
              onPressed: _loadUserData,
              child: const Text('Réessayer'),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDrawer(BuildContext context, LanguageService lang) {
    final theme = Theme.of(context);
    
    return Drawer(
      child: Column(
        children: [
          _buildDrawerHeader(theme, lang),
          Expanded(
            child: ListView(
              padding: EdgeInsets.zero,
              children: [
                _buildDrawerItem(Icons.home_outlined, lang.translate('dashboard'), true, () {
                  Navigator.pop(context);
                  setState(() {
                    _selectedIndex = 0;
                  });
                }),
                _buildDrawerItem(Icons.timeline, lang.translate('conditions'), false, () {
                  Navigator.pop(context);
                  Navigator.pushNamed(context, '/conditions');
                }),
                _buildDrawerItem(Icons.calendar_month, 'My Planning', false, () {
                  Navigator.pop(context);
                  Navigator.pushNamed(context, '/planning');
                }),
                _buildDrawerItem(Icons.notifications_none, lang.translate('notifications'), false, () {
                  Navigator.pop(context);
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Notifications page coming soon')),
                  );
                }),
                _buildDrawerItem(Icons.favorite_border, lang.translate('healthOverview'), false, () {
                  Navigator.pop(context);
                  Navigator.pushNamed(context, '/healthoverview');
                }),
                const Divider(indent: 20, endIndent: 20, height: 40),
                
                _buildDrawerItem(Icons.insights, lang.translate('smartInsights'), false, () {
                  Navigator.pop(context);
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Insights page coming soon')),
                  );
                }),
                _buildDrawerItem(Icons.history, lang.translate('history'), false, () {
                  Navigator.pop(context);
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('History page coming soon')),
                  );
                }),
                _buildDrawerItem(Icons.person_outline, lang.translate('profile'), false, () {
                  Navigator.pop(context);
                  Navigator.pushNamed(context, '/profile');
                }),
                _buildDrawerItem(Icons.settings_outlined, lang.translate('settings'), false, () {
                  Navigator.pop(context);
                  _showSettingsSheet(context, lang);
                }),
              ],
            ),
          ),
          _buildLogoutItem(lang),
        ],
      ),
    );
  }

  Widget _buildDrawerHeader(ThemeData theme, LanguageService lang) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.only(top: 60, bottom: 30, left: 24, right: 24),
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          colors: [Color(0xFF42A5F5), Color(0xFF2196F3)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Container(
                padding: const EdgeInsets.all(12),
                decoration: const BoxDecoration(
                  color: Colors.white,
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.favorite, color: Colors.blue, size: 32),
              ),
              IconButton(
                icon: const Icon(Icons.close, color: Colors.white),
                onPressed: () => Navigator.pop(context),
              ),
            ],
          ),
          const SizedBox(height: 20),
          const Text(
            'MediCare',
            style: TextStyle(
              color: Colors.white,
              fontSize: 24,
              fontWeight: FontWeight.bold,
            ),
          ),
          Text(
            _userData?['name']?.toString() ?? 'John Doe',
            style: TextStyle(
              color: Colors.white.withOpacity(0.9),
              fontSize: 16,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDrawerItem(IconData icon, String title, bool selected, VoidCallback onTap) {
    return ListTile(
      leading: Icon(
        icon,
        color: selected ? Colors.blue : Colors.grey.shade600,
        size: 24,
      ),
      title: Text(
        title,
        style: TextStyle(
          color: selected ? Colors.blue : const Color(0xFF1A237E),
          fontSize: 16,
          fontWeight: selected ? FontWeight.bold : FontWeight.w500,
        ),
      ),
      onTap: onTap,
      contentPadding: const EdgeInsets.symmetric(horizontal: 24, vertical: 4),
    );
  }

  Widget _buildLogoutItem(LanguageService lang) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 30),
      child: ListTile(
        leading: const Icon(Icons.logout, color: Colors.red, size: 24),
        title: Text(
          lang.translate('logout'),
          style: const TextStyle(
            color: Colors.red,
            fontSize: 16,
            fontWeight: FontWeight.bold,
          ),
        ),
        onTap: _logout,
        contentPadding: const EdgeInsets.symmetric(horizontal: 24),
      ),
    );
  }

  void _showSettingsSheet(BuildContext context, LanguageService languageService) {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (bottomSheetContext) => SafeArea(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            ListTile(
              leading: const Icon(Icons.language, color: Colors.blue),
              title: Text(languageService.translate('language')),
              trailing: const Icon(Icons.chevron_right, color: Colors.blue),
              onTap: () {
                Navigator.pop(bottomSheetContext);
                _showLanguageDialog(context, languageService);
              },
            ),
          ],
        ),
      ),
    );
  }
}
