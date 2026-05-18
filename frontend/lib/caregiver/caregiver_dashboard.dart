import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

import '../config/api_config.dart';
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
    return Scaffold(
      backgroundColor: bgColor,
      drawer: _buildDrawer(),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator(color: primaryGreen))
          : SafeArea(
              child: Column(
                children: [
                  _buildHeader(),
                  Expanded(
                    child: _filteredPatients.isEmpty
                        ? _buildEmptyState()
                        : _buildPatientList(),
                  ),
                ],
              ),
            ),
    );
  }

  Widget _buildHeader() {
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
                  const Text('My Patients', style: TextStyle(color: Colors.white, fontSize: 21, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 4),
                  Text('${_patients.length} patients', style: const TextStyle(color: Colors.white70, fontSize: 12)),
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
                hintText: 'Search patients...',
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
              Expanded(child: _buildTopCard('$goodCount', 'On Track', Colors.green)),
              const SizedBox(width: 12),
              Expanded(child: _buildTopCard('$warningCount', 'Attention', Colors.orange)),
              const SizedBox(width: 12),
              Expanded(child: _buildTopCard('$criticalCount', 'Critical', Colors.red)),
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

  Widget _buildPatientList() {
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: _filteredPatients.length,
      itemBuilder: (context, index) => _buildPatientCard(_filteredPatients[index]),
    );
  }

  Widget _buildPatientCard(Map<String, dynamic> patient) {
    final status = _getPatientStatus(patient);
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
          onTap: () {
            Navigator.push(
              context,
              MaterialPageRoute(builder: (_) => PatientDetailsPage(patient: patient)),
            );
          },
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
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                      decoration: BoxDecoration(color: statusColor.withOpacity(0.12), borderRadius: BorderRadius.circular(20)),
                      child: Text(statusText, style: TextStyle(color: statusColor, fontWeight: FontWeight.bold, fontSize: 12)),
                    ),
                  ],
                ),
                const SizedBox(height: 22),
                Row(
                  children: [
                    Expanded(child: _metric(Icons.show_chart, 'Adherence', '${patient['adherence_rate'] ?? 0}%', Colors.green)),
                    Expanded(child: _metric(Icons.warning_amber_rounded, 'Missed', '${patient['missed_doses'] ?? 0}', Colors.red)),
                  ],
                ),
                const SizedBox(height: 18),
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(color: const Color(0xFFF4F7FB), borderRadius: BorderRadius.circular(16)),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Next Medication', style: TextStyle(color: Colors.grey.shade600, fontSize: 12)),
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

  Widget _buildDrawer() {
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
            ListTile(leading: const Icon(Icons.people), title: const Text('My Patients'), onTap: () => Navigator.pop(context)),
            ListTile(leading: const Icon(Icons.notifications_none), title: const Text('Notifications'), onTap: () {}),
            ListTile(leading: const Icon(Icons.settings), title: const Text('Settings'), onTap: () {}),
            const Spacer(),
            const Divider(),
            ListTile(leading: const Icon(Icons.logout, color: Colors.red), title: const Text('Logout', style: TextStyle(color: Colors.red)), onTap: _logout),
          ],
        ),
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.people_outline, size: 90, color: Colors.grey.shade400),
            const SizedBox(height: 20),
            Text('No Patients Assigned', style: TextStyle(color: Colors.grey.shade700, fontSize: 22, fontWeight: FontWeight.bold)),
            const SizedBox(height: 10),
            Text('You currently have no patients linked to your caregiver account.', textAlign: TextAlign.center, style: TextStyle(color: Colors.grey.shade500)),
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
              label: const Text('Request Access'),
            ),
          ],
        ),
      ),
    );
  }
}

// Patient Details Page
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
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(24)),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(Icons.location_on, color: Colors.blue.shade600),
              const SizedBox(width: 8),
              const Text('Current Location', style: TextStyle(fontWeight: FontWeight.bold)),
              const Spacer(),
              Text('Updated now', style: TextStyle(color: Colors.grey.shade500, fontSize: 11)),
            ],
          ),
          const SizedBox(height: 16),
          Container(
            height: 180,
            decoration: BoxDecoration(color: Colors.blue.shade100, borderRadius: BorderRadius.circular(18)),
            child: const Center(child: Icon(Icons.location_pin, color: Colors.red, size: 52)),
          ),
          const SizedBox(height: 14),
          Text(_location?['address'] ?? 'Location sharing enabled', style: const TextStyle(fontWeight: FontWeight.w500)),
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
          if (_todayMedications.isEmpty)
            const Center(child: Padding(padding: EdgeInsets.symmetric(vertical: 20), child: Text('No medications scheduled'))),
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
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(24)),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('Recent Alerts', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
          const SizedBox(height: 18),
          if (_recentAlerts.isEmpty)
            const Center(child: Padding(padding: EdgeInsets.symmetric(vertical: 20), child: Text('No recent alerts'))),
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