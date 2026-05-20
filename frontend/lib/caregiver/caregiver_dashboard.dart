import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'package:provider/provider.dart';

import '../config/api_config.dart';
import '../services/language_service.dart';
import '../services/settings_service.dart';
import 'caregiver_login_page.dart';

class CaregiverDashboard extends StatefulWidget {
  const CaregiverDashboard({super.key});

  @override
  State<CaregiverDashboard> createState() => _CaregiverDashboardState();
}

class _CaregiverDashboardState extends State<CaregiverDashboard> {
  List<Map<String, dynamic>> _patients = [];
  List<Map<String, dynamic>> _filteredPatients = [];

  bool _isLoading = true;
  String? _userName;

  final TextEditingController _searchController = TextEditingController();

  static const Color primaryGreen = Color(0xFF22C55E);
  static const Color bgColor = Color(0xFFF5F7FB);

  @override
  void initState() {
    super.initState();
    _loadUserData();
    _fetchPatients();
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  Future<void> _loadUserData() async {
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      _userName = prefs.getString('user_name') ?? 'Caregiver';
    });
  }

  Future<void> _fetchPatients() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('auth_token');

    if (token == null) {
      setState(() => _isLoading = false);
      return;
    }

    try {
      final response = await http.get(
        Uri.parse('${ApiConfig.baseUrl}/caregivers/patients'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final patients = List<Map<String, dynamic>>.from(data['patients'] ?? []);

        setState(() {
          _patients = patients;
          _filteredPatients = patients;
          _isLoading = false;
        });
      } else {
        setState(() => _isLoading = false);
      }
    } catch (e) {
      debugPrint(e.toString());
      setState(() => _isLoading = false);
    }
  }

  void _filterPatients(String value) {
    if (value.trim().isEmpty) {
      setState(() {
        _filteredPatients = _patients;
      });
      return;
    }

    final filtered = _patients.where((patient) {
      final name = (patient['name'] ?? '').toString().toLowerCase();
      return name.contains(value.toLowerCase());
    }).toList();

    setState(() {
      _filteredPatients = filtered;
    });
  }

  Future<void> _toggleFollowPatient(int patientId, bool isFollowing, String patientName) async {
    final languageService = Provider.of<LanguageService>(context, listen: false);
    
    final confirm = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(
          isFollowing ? languageService.translate('unfollowPatient') : languageService.translate('followPatient'),
          style: TextStyle(color: isFollowing ? Colors.orange : primaryGreen),
        ),
        content: Text(
          isFollowing 
              ? '${languageService.translate('confirmUnfollow')} "$patientName"? ${languageService.translate('youWillNoLongerSee')}'
              : '${languageService.translate('confirmFollow')} "$patientName"? ${languageService.translate('youWillBeAbleToMonitor')}',
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context, false), child: Text(languageService.translate('cancel'))),
          TextButton(
            onPressed: () => Navigator.pop(context, true),
            style: TextButton.styleFrom(foregroundColor: isFollowing ? Colors.orange : primaryGreen),
            child: Text(isFollowing ? languageService.translate('unfollow') : languageService.translate('follow')),
          ),
        ],
      ),
    );

    if (confirm != true) return;

    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('auth_token');

    try {
      final response = await http.put(
        Uri.parse('${ApiConfig.baseUrl}/caregivers/patients/$patientId/follow'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
        body: jsonEncode({'follow': !isFollowing}),
      );

      if (response.statusCode == 200) {
        setState(() {
          final index = _patients.indexWhere((p) => p['id'] == patientId);
          if (index != -1) {
            _patients[index]['is_following'] = !isFollowing;
          }
          final filteredIndex = _filteredPatients.indexWhere((p) => p['id'] == patientId);
          if (filteredIndex != -1) {
            _filteredPatients[filteredIndex]['is_following'] = !isFollowing;
          }
        });
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              isFollowing 
                  ? '${languageService.translate('unfollowSuccess')} $patientName'
                  : '${languageService.translate('followSuccess')} $patientName',
            ),
            backgroundColor: Colors.green,
          ),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Failed to update follow status'), backgroundColor: Colors.red),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Error updating follow status'), backgroundColor: Colors.red),
      );
    }
  }

  Future<void> _logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.clear();
    if (mounted) {
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (_) => const CaregiverLoginPage()),
      );
    }
  }

  void _showLanguageDialog(BuildContext context, LanguageService lang) {
    final settingsService = Provider.of<SettingsService>(context, listen: false);
    final currentLang = lang.getCurrentLanguage();
    
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text(lang.translate('language'), style: const TextStyle(color: primaryGreen, fontWeight: FontWeight.bold)),
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
                    settingsService.setLanguage('en');
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
                    settingsService.setLanguage('fr');
                  },
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  int get goodCount => _patients.where((p) => _getPatientStatus(p) == 'good').length;
  int get warningCount => _patients.where((p) => _getPatientStatus(p) == 'warning').length;
  int get criticalCount => _patients.where((p) => _getPatientStatus(p) == 'critical').length;

  String _getPatientStatus(Map<String, dynamic> patient) {
    final adherence = patient['adherence_rate'] ?? 0;
    final missed = patient['missed_doses'] ?? 0;

    if (adherence >= 90 && missed <= 1) {
      return 'good';
    } else if (adherence >= 70 && missed <= 3) {
      return 'warning';
    } else {
      return 'critical';
    }
  }

  @override
  Widget build(BuildContext context) {
    final languageService = Provider.of<LanguageService>(context);
    
    return Scaffold(
      backgroundColor: bgColor,
      drawer: _buildDrawer(languageService),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator(color: primaryGreen))
          : SafeArea(
              child: Column(
                children: [
                  _buildHeader(languageService),
                  Expanded(
                    child: _filteredPatients.isEmpty
                        ? _buildEmptyState(languageService)
                        : _buildPatientList(languageService),
                  ),
                ],
              ),
            ),
    );
  }

  Widget _buildHeader(LanguageService lang) {
    return Container(
      padding: const EdgeInsets.fromLTRB(20, 16, 20, 28),
      decoration: const BoxDecoration(
        color: primaryGreen,
        borderRadius: BorderRadius.only(bottomLeft: Radius.circular(32), bottomRight: Radius.circular(32)),
      ),
      child: Column(
        children: [
          Row(
            children: [
              Builder(
                builder: (context) => Container(
                  width: 42,
                  height: 42,
                  decoration: BoxDecoration(color: Colors.white.withOpacity(0.18), borderRadius: BorderRadius.circular(14)),
                  child: IconButton(
                    onPressed: () => Scaffold.of(context).openDrawer(),
                    icon: const Icon(Icons.menu, color: Colors.white),
                  ),
                ),
              ),
              const Spacer(),
              Column(
                children: [
                  Text(lang.translate('myPatients'), style: const TextStyle(color: Colors.white, fontSize: 21, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 4),
                  Text('${_patients.length} ${lang.translate('patients')}', style: const TextStyle(color: Colors.white70, fontSize: 12)),
                ],
              ),
              const Spacer(),
              Container(
                width: 42,
                height: 42,
                decoration: BoxDecoration(color: Colors.white.withOpacity(0.18), borderRadius: BorderRadius.circular(14)),
                child: IconButton(
                  onPressed: () {
                    setState(() => _isLoading = true);
                    _fetchPatients();
                  },
                  icon: const Icon(Icons.refresh, color: Colors.white, size: 20),
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),
          Container(
            height: 54,
            decoration: BoxDecoration(color: Colors.white.withOpacity(0.16), borderRadius: BorderRadius.circular(18)),
            child: TextField(
              controller: _searchController,
              onChanged: _filterPatients,
              style: const TextStyle(color: Colors.white),
              decoration: InputDecoration(
                border: InputBorder.none,
                hintText: lang.translate('searchPatients'),
                hintStyle: const TextStyle(color: Colors.white70),
                prefixIcon: const Icon(Icons.search, color: Colors.white),
                suffixIcon: _searchController.text.isEmpty
                    ? null
                    : IconButton(
                        onPressed: () {
                          _searchController.clear();
                          _filterPatients('');
                        },
                        icon: const Icon(Icons.close, color: Colors.white70),
                      ),
              ),
            ),
          ),
          const SizedBox(height: 22),
          Row(
            children: [
              Expanded(child: _buildTopCard('$goodCount', lang.translate('onTrack'), Colors.green)),
              const SizedBox(width: 12),
              Expanded(child: _buildTopCard('$warningCount', lang.translate('attention'), Colors.orange)),
              const SizedBox(width: 12),
              Expanded(child: _buildTopCard('$criticalCount', lang.translate('critical'), Colors.red)),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildTopCard(String number, String label, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 16),
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(20)),
      child: Column(
        children: [
          Text(number, style: TextStyle(color: color, fontSize: 24, fontWeight: FontWeight.bold)),
          const SizedBox(height: 6),
          Text(label, textAlign: TextAlign.center, style: TextStyle(color: Colors.grey.shade700, fontSize: 11, fontWeight: FontWeight.w600)),
        ],
      ),
    );
  }

  Widget _buildPatientList(LanguageService lang) {
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: _filteredPatients.length,
      itemBuilder: (context, index) => _buildPatientCard(_filteredPatients[index], lang),
    );
  }

  Widget _buildPatientCard(Map<String, dynamic> patient, LanguageService lang) {
    final status = _getPatientStatus(patient);
    final bool isFollowing = patient['is_following'] ?? true;
    
    Color statusColor;
    String statusText;

    switch (status) {
      case 'good':
        statusColor = Colors.green;
        statusText = 'Good';
        break;
      case 'warning':
        statusColor = Colors.orange;
        statusText = 'Warning';
        break;
      default:
        statusColor = Colors.red;
        statusText = 'Critical';
    }

    final String name = patient['name'] ?? 'Patient';
    final String initials = name.isNotEmpty
        ? name.split(' ').map((e) => e[0]).take(2).join().toUpperCase()
        : 'P';

    return Container(
      margin: const EdgeInsets.only(bottom: 18),
      child: Material(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        elevation: 2,
        shadowColor: Colors.black12,
        child: InkWell(
          borderRadius: BorderRadius.circular(24),
          onTap: isFollowing ? () {
            Navigator.push(
              context,
              MaterialPageRoute(builder: (_) => PatientDetailsPage(patient: patient)),
            );
          } : null,
          child: Opacity(
            opacity: isFollowing ? 1.0 : 0.6,
            child: Padding(
              padding: const EdgeInsets.all(18),
              child: Column(
                children: [
                  Row(
                    children: [
                      CircleAvatar(radius: 28, backgroundColor: primaryGreen, child: Text(initials, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold))),
                      const SizedBox(width: 14),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(name, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 17)),
                            const SizedBox(height: 4),
                            Text(patient['relationship'] ?? 'Patient', style: TextStyle(color: Colors.grey.shade600, fontSize: 13)),
                            const SizedBox(height: 3),
                            Text('Active ${patient['last_active'] ?? '2h ago'}', style: TextStyle(color: Colors.grey.shade500, fontSize: 12)),
                          ],
                        ),
                      ),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.end,
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                            decoration: BoxDecoration(color: statusColor.withOpacity(0.12), borderRadius: BorderRadius.circular(20)),
                            child: Text(statusText, style: TextStyle(color: statusColor, fontWeight: FontWeight.bold, fontSize: 12)),
                          ),
                          const SizedBox(height: 6),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                            decoration: BoxDecoration(
                              color: isFollowing ? primaryGreen.withOpacity(0.1) : Colors.grey.withOpacity(0.1),
                              borderRadius: BorderRadius.circular(20),
                            ),
                            child: Text(
                              isFollowing ? lang.translate('following') : lang.translate('notFollowing'),
                              style: TextStyle(
                                color: isFollowing ? primaryGreen : Colors.grey,
                                fontSize: 10,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                  const SizedBox(height: 22),
                  if (isFollowing) ...[
                    Row(
                      children: [
                        Expanded(child: _metric(Icons.show_chart, lang.translate('adherence'), '${patient['adherence_rate'] ?? 0}%', Colors.green)),
                        Expanded(child: _metric(Icons.warning_amber_rounded, lang.translate('missed'), '${patient['missed_doses'] ?? 0}', Colors.red)),
                      ],
                    ),
                    const SizedBox(height: 18),
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(color: const Color(0xFFF4F7FB), borderRadius: BorderRadius.circular(16)),
                      child: Row(
                        children: [
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(lang.translate('nextMedication'), style: TextStyle(color: Colors.grey.shade600, fontSize: 12)),
                                const SizedBox(height: 5),
                                Text(
                                  '${patient['next_medication'] ?? 'No medication'} • ${patient['next_medication_time'] ?? '--'}',
                                  style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  ] else ...[
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: Colors.grey.shade50,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: Colors.grey.shade200),
                      ),
                      child: Column(
                        children: [
                          Icon(Icons.visibility_off, size: 48, color: Colors.grey.shade400),
                          const SizedBox(height: 8),
                          Text(
                            lang.translate('notFollowing'),
                            style: TextStyle(color: Colors.grey.shade600, fontSize: 16, fontWeight: FontWeight.bold),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            lang.translate('tapToFollow'),
                            style: TextStyle(color: Colors.grey.shade500, fontSize: 12),
                          ),
                        ],
                      ),
                    ),
                  ],
                  const SizedBox(height: 14),
                  Row(
                    children: [
                      Expanded(
                        child: OutlinedButton.icon(
                          onPressed: () => _toggleFollowPatient(patient['id'], isFollowing, name),
                          icon: Icon(isFollowing ? Icons.person_remove : Icons.person_add, size: 18),
                          label: Text(isFollowing ? lang.translate('unfollow') : lang.translate('follow')),
                          style: OutlinedButton.styleFrom(
                            foregroundColor: isFollowing ? Colors.orange : primaryGreen,
                            side: BorderSide(color: (isFollowing ? Colors.orange : primaryGreen).withOpacity(0.3)),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _metric(IconData icon, String title, String value, Color color) {
    return Row(
      children: [
        Container(padding: const EdgeInsets.all(10), decoration: BoxDecoration(color: color.withOpacity(0.12), shape: BoxShape.circle), child: Icon(icon, color: color, size: 18)),
        const SizedBox(width: 12),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(title, style: TextStyle(color: Colors.grey.shade500, fontSize: 12)),
            const SizedBox(height: 4),
            Text(value, style: TextStyle(color: color, fontSize: 22, fontWeight: FontWeight.bold)),
          ],
        ),
      ],
    );
  }

  Widget _buildDrawer(LanguageService lang) {
    return Drawer(
      child: SafeArea(
        child: Column(
          children: [
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(24),
              color: primaryGreen,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const CircleAvatar(radius: 28, backgroundColor: Colors.white, child: Icon(Icons.groups, color: primaryGreen, size: 30)),
                  const SizedBox(height: 16),
                  const Text('MediCare', style: TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 6),
                  Text(_userName ?? 'Caregiver', style: const TextStyle(color: Colors.white70)),
                ],
              ),
            ),
            ListTile(
              leading: const Icon(Icons.dashboard),
              title: Text(lang.translate('dashboard')),
              onTap: () => Navigator.pop(context),
            ),
            ListTile(
              leading: const Icon(Icons.person_outline),
              title: Text(lang.translate('profile')),
              onTap: () {
                Navigator.pop(context);
                Navigator.pushNamed(context, '/profile');
              },
            ),
            ListTile(
              leading: const Icon(Icons.language),
              title: Text(lang.translate('language')),
              trailing: Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: primaryGreen.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(
                  lang.getCurrentLanguage() == 'en' ? 'EN' : 'FR',
                  style: TextStyle(color: primaryGreen, fontWeight: FontWeight.bold),
                ),
              ),
              onTap: () => _showLanguageDialog(context, lang),
            ),
            const Spacer(),
            const Divider(),
            ListTile(
              leading: const Icon(Icons.logout, color: Colors.red),
              title: Text(lang.translate('logout'), style: const TextStyle(color: Colors.red)),
              onTap: _logout,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildEmptyState(LanguageService lang) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.people_outline, size: 90, color: Colors.grey.shade400),
            const SizedBox(height: 20),
            Text(lang.translate('noPatientsAssigned'), style: TextStyle(color: Colors.grey.shade700, fontSize: 22, fontWeight: FontWeight.bold)),
            const SizedBox(height: 10),
            Text(lang.translate('noPatientsMessage'), textAlign: TextAlign.center, style: TextStyle(color: Colors.grey.shade500)),
            const SizedBox(height: 28),
            ElevatedButton.icon(
              onPressed: () {},
              style: ElevatedButton.styleFrom(
                backgroundColor: primaryGreen,
                foregroundColor: Colors.white,
                elevation: 0,
                padding: const EdgeInsets.symmetric(horizontal: 26, vertical: 14),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              ),
              icon: const Icon(Icons.add),
              label: Text(lang.translate('requestAccess')),
            ),
          ],
        ),
      ),
    );
  }
}

// Patient Details Page (keep as is - no changes needed)
class PatientDetailsPage extends StatefulWidget {
  final Map<String, dynamic> patient;
  const PatientDetailsPage({super.key, required this.patient});

  @override
  State<PatientDetailsPage> createState() => _PatientDetailsPageState();
}

class _PatientDetailsPageState extends State<PatientDetailsPage> {
  Map<String, dynamic> _patientData = {};
  List<Map<String, dynamic>> _todayMedications = [];
  List<Map<String, dynamic>> _recentAlerts = [];
  Map<String, dynamic>? _location;
  bool _isLoading = true;

  static const Color primaryGreen = Color(0xFF22C55E);

  @override
  void initState() {
    super.initState();
    _fetchPatientDetails();
  }

  Future<void> _fetchPatientDetails() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('auth_token');
    final patientId = widget.patient['id'];

    try {
      final response = await http.get(
        Uri.parse('${ApiConfig.baseUrl}/caregivers/patient/$patientId'),
        headers: {'Authorization': 'Bearer $token', 'Content-Type': 'application/json'},
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        setState(() {
          _patientData = data['patient'] ?? {};
          _todayMedications = List<Map<String, dynamic>>.from(data['today_medications'] ?? []);
          _recentAlerts = List<Map<String, dynamic>>.from(data['recent_alerts'] ?? []);
          _location = data['location'];
          _isLoading = false;
        });
      } else {
        setState(() => _isLoading = false);
      }
    } catch (e) {
      debugPrint('Error fetching patient details: $e');
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return Scaffold(
        backgroundColor: const Color(0xFFF5F7FB),
        appBar: AppBar(
          backgroundColor: primaryGreen,
          foregroundColor: Colors.white,
          elevation: 0,
          title: const Text('Patient Monitoring'),
        ),
        body: const Center(child: CircularProgressIndicator()),
      );
    }

    final patient = _patientData.isEmpty ? widget.patient : _patientData;
    final medicationsEnabled = patient['medications_enabled'] ?? true;
    final alertsEnabled = patient['alerts_enabled'] ?? true;
    final locationEnabled = patient['location_enabled'] ?? true;

    return Scaffold(
      backgroundColor: const Color(0xFFF5F7FB),
      appBar: AppBar(
        backgroundColor: primaryGreen,
        foregroundColor: Colors.white,
        elevation: 0,
        title: const Text('Patient Monitoring'),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            _buildPatientHeader(patient),
            const SizedBox(height: 18),
            if (locationEnabled) _buildLocationCard(),
            const SizedBox(height: 18),
            _buildHealthOverview(patient),
            const SizedBox(height: 18),
            if (medicationsEnabled) _buildTodayMedications(),
            const SizedBox(height: 18),
            if (alertsEnabled) _buildRecentAlerts(),
            const SizedBox(height: 30),
          ],
        ),
      ),
    );
  }

  Widget _buildPatientHeader(Map<String, dynamic> patient) {
    final String name = patient['name'] ?? 'Patient';
    final String initials = name.isNotEmpty ? name.split(' ').map((e) => e[0]).take(2).join().toUpperCase() : 'P';

    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(24)),
      child: Row(
        children: [
          CircleAvatar(radius: 30, backgroundColor: primaryGreen, child: Text(initials, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 18))),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(name, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                const SizedBox(height: 4),
                Text(patient['last_active'] ?? 'Active recently', style: TextStyle(color: Colors.grey.shade600)),
              ],
            ),
          ),
          const Icon(Icons.circle, color: Colors.green, size: 12),
        ],
      ),
    );
  }


  Widget _buildLocationCard() {
    final location = _location;
    final hasLocation = location != null && location['lat'] != null;
    
    bool isRecent = false;
    String timeAgo = 'Never';
    
    if (hasLocation && location['time_ago'] != null) {
      timeAgo = location['time_ago'].toString();
      
      if (timeAgo.contains('Just now')) {
        isRecent = true;
      } else if (timeAgo.contains('min')) {
        try {
          final minutes = int.tryParse(timeAgo.split(' ')[0]);
          if (minutes != null && minutes < 10) {
            isRecent = true;
          }
        } catch (e) {
          isRecent = false;
        }
      } else if (timeAgo.contains('seconds') || timeAgo.contains('second')) {
        isRecent = true;
      }
    }
    
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(
                Icons.location_on,
                color: hasLocation ? (isRecent ? Colors.green : Colors.orange) : Colors.grey,
                size: 22,
              ),
              const SizedBox(width: 8),
              const Text('Location', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
              const Spacer(),
              if (hasLocation)
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: isRecent ? Colors.green.withOpacity(0.1) : Colors.orange.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    isRecent ? '🟢 Live' : '🟡 Last known',
                    style: TextStyle(
                      color: isRecent ? Colors.green : Colors.orange,
                      fontSize: 11,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                )
              else
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: Colors.grey.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    '⚫ Offline',
                    style: TextStyle(
                      color: Colors.grey,
                      fontSize: 11,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
            ],
          ),
          const SizedBox(height: 16),
          Container(
            height: 180,
            width: double.infinity,
            decoration: BoxDecoration(
              color: Colors.blue.shade50,
              borderRadius: BorderRadius.circular(18),
            ),
            child: hasLocation
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.location_pin, color: Colors.red, size: 52),
                        const SizedBox(height: 8),
                        Text(
                          '${(location['lat'] as num?)?.toStringAsFixed(6) ?? '0.000000'}, ${(location['lng'] as num?)?.toStringAsFixed(6) ?? '0.000000'}',
                          style: TextStyle(color: Colors.blue.shade800, fontSize: 12),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          'Tap to open map',
                          style: TextStyle(color: Colors.blue.shade600, fontSize: 12),
                        ),
                      ],
                    ),
                  )
                : Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.location_off, size: 48, color: Colors.grey.shade400),
                        const SizedBox(height: 8),
                        Text(
                          location?['address'] ?? 'Location sharing not available',
                          style: TextStyle(color: Colors.grey.shade600, fontSize: 12),
                        ),
                      ],
                    ),
                  ),
          ),
          const SizedBox(height: 14),
          Row(
            children: [
              Icon(Icons.access_time, size: 14, color: Colors.grey.shade500),
              const SizedBox(width: 6),
              Text(
                hasLocation ? 'Updated $timeAgo' : 'No location data',
                style: TextStyle(color: Colors.grey.shade600, fontSize: 12),
              ),
            ],
          ),
          if (hasLocation && !isRecent && timeAgo != 'Never' && !timeAgo.contains('Just'))
            Padding(
              padding: const EdgeInsets.only(top: 8),
              child: Text(
                '⚠️ Patient may be offline or app closed',
                style: TextStyle(color: Colors.orange.shade700, fontSize: 11),
              ),
            ),
          if (location?['address'] != null && hasLocation && location!['address'] != '')
            Padding(
              padding: const EdgeInsets.only(top: 8),
              child: Text(
                location['address'],
                style: TextStyle(color: Colors.grey.shade700, fontSize: 12),
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildHealthOverview(Map<String, dynamic> patient) {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(24)),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('Health Overview', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
          const SizedBox(height: 18),
          GridView.count(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            crossAxisCount: 2,
            childAspectRatio: 1.35,
            crossAxisSpacing: 12,
            mainAxisSpacing: 12,
            children: [
              _buildHealthCard('Adherence Rate', '${patient['adherence_rate'] ?? 0}%', Colors.green),
              _buildHealthCard('Missed This Week', '${patient['missed_doses'] ?? 0}', Colors.orange),
              _buildHealthCard('Current Streak', '${patient['current_streak'] ?? 0} days', Colors.blue),
              _buildHealthCard('Daily Medications', '${patient['medication_count'] ?? 0}', Colors.purple),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildHealthCard(String title, String value, Color color) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(color: color.withOpacity(0.08), borderRadius: BorderRadius.circular(18)),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(value, style: TextStyle(color: color, fontSize: 24, fontWeight: FontWeight.bold)),
          const SizedBox(height: 8),
          Text(title, textAlign: TextAlign.center, style: TextStyle(color: Colors.grey.shade700, fontSize: 12)),
        ],
      ),
    );
  }

  Widget _buildTodayMedications() {
    if (_todayMedications.isEmpty) {
      return Container(
        padding: const EdgeInsets.all(18),
        decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(24)),
        child: const Center(child: Text('No medications scheduled for today')),
      );
    }

    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(24)),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Text('Today\'s Medications', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
              const Spacer(),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(color: Colors.blue.withOpacity(0.1), borderRadius: BorderRadius.circular(12)),
                child: Text('${_todayMedications.length} meds', style: const TextStyle(color: Colors.blue, fontSize: 11, fontWeight: FontWeight.w600)),
              ),
            ],
          ),
          const SizedBox(height: 18),
          ..._todayMedications.map((med) {
            final status = med['status'] ?? 'pending';
            final bool isTaken = status == 'taken';
            final bool isMissed = status == 'missed';
            
            Color bgColor;
            Color iconColor;
            String statusText;
            
            if (isTaken) {
              bgColor = Colors.green.withOpacity(0.06);
              iconColor = Colors.green;
              statusText = 'Taken';
            } else if (isMissed) {
              bgColor = Colors.red.withOpacity(0.08);
              iconColor = Colors.red;
              statusText = 'Missed';
            } else {
              bgColor = Colors.orange.withOpacity(0.06);
              iconColor = Colors.orange;
              statusText = 'Pending';
            }
            
            return Container(
              margin: const EdgeInsets.only(bottom: 12),
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(color: bgColor, borderRadius: BorderRadius.circular(18)),
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(color: iconColor.withOpacity(0.12), shape: BoxShape.circle),
                    child: Icon(Icons.medication, color: iconColor),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(med['name'] ?? '', style: const TextStyle(fontWeight: FontWeight.bold)),
                        const SizedBox(height: 4),
                        Text(med['time'] ?? '', style: TextStyle(color: Colors.grey.shade600, fontSize: 12)),
                      ],
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                    decoration: BoxDecoration(color: iconColor.withOpacity(0.12), borderRadius: BorderRadius.circular(14)),
                    child: Text(statusText, style: TextStyle(color: iconColor, fontWeight: FontWeight.bold, fontSize: 12)),
                  ),
                ],
              ),
            );
          }),
        ],
      ),
    );
  }

  Widget _buildRecentAlerts() {
    if (_recentAlerts.isEmpty) {
      return Container(
        padding: const EdgeInsets.all(18),
        decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(24)),
        child: const Center(child: Text('No recent alerts')),
      );
    }

    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(24)),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('Recent Alerts', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
          const SizedBox(height: 18),
          ..._recentAlerts.map((alert) => Container(
            margin: const EdgeInsets.only(bottom: 12),
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(color: Colors.orange.withOpacity(0.08), borderRadius: BorderRadius.circular(18)),
            child: Row(
              children: [
                const Icon(Icons.warning_amber_rounded, color: Colors.orange),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(alert['message'] ?? '', style: const TextStyle(fontWeight: FontWeight.w600)),
                      const SizedBox(height: 4),
                      Text(alert['time'] ?? '', style: TextStyle(color: Colors.grey.shade600, fontSize: 12)),
                    ],
                  ),
                ),
              ],
            ),
          )),
        ],
      ),
    );
  }
}