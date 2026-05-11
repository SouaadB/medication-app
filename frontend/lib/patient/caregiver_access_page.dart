import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:provider/provider.dart';
import '../config/api_config.dart';
import '../services/language_service.dart';
import '../services/settings_service.dart';

class CaregiverAccessPage extends StatefulWidget {
  const CaregiverAccessPage({super.key});

  @override
  State<CaregiverAccessPage> createState() => _CaregiverAccessPageState();
}

class _CaregiverAccessPageState extends State<CaregiverAccessPage> {
  List<dynamic> _caregivers = [];
  bool _isLoading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _fetchCaregivers();
  }

  Future<void> _fetchCaregivers() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');
      
      final response = await http.get(
        Uri.parse('${ApiConfig.baseUrl}/caregivers'),
        headers: {
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        setState(() {
          _caregivers = data['caregivers'];
          _isLoading = false;
        });
      } else {
        setState(() {
          _error = 'Failed to load caregivers';
          _isLoading = false;
        });
      }
    } catch (e) {
      setState(() {
        _error = 'Connection error';
        _isLoading = false;
      });
    }
  }

  Future<void> _removeCaregiver(int id) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');
      
      final response = await http.delete(
        Uri.parse('${ApiConfig.baseUrl}/caregivers/$id'),
        headers: {
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        _fetchCaregivers();
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Caregiver removed successfully')),
          );
        }
      }
    } catch (e) {
      debugPrint('Error removing caregiver: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    final lang = Provider.of<LanguageService>(context);
    final settings = Provider.of<SettingsService>(context);
    final isDark = settings.isDarkMode;
    final textColor = isDark ? Colors.white : const Color(0xFF2C3E50);

    return Scaffold(
      backgroundColor: isDark ? const Color(0xFF121212) : const Color(0xFFF8F9FE),
      appBar: AppBar(
        backgroundColor: const Color(0xFF3498DB),
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text(
          'Caregiver Access',
          style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
        ),
        centerTitle: true,
      ),
      body: Column(
        children: [
          Container(
            width: double.infinity,
            padding: const EdgeInsets.symmetric(vertical: 12),
            decoration: const BoxDecoration(color: Color(0xFF3498DB)),
            child: const Text(
              'Manage who can monitor your health',
              textAlign: TextAlign.center,
              style: TextStyle(color: Colors.white70, fontSize: 13),
            ),
          ),
          Expanded(
            child: _isLoading
                ? const Center(child: CircularProgressIndicator())
                : _error != null
                    ? Center(child: Text(_error!, style: TextStyle(color: textColor)))
                    : SingleChildScrollView(
                        padding: const EdgeInsets.all(20),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            _buildPrivacyBanner(isDark),
                            const SizedBox(height: 30),
                            Text(
                              'Connected Caregivers',
                              style: TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                                color: textColor,
                              ),
                            ),
                            const SizedBox(height: 16),
                            if (_caregivers.isEmpty)
                              Center(
                                child: Padding(
                                  padding: const EdgeInsets.symmetric(vertical: 40),
                                  child: Text(
                                    'No caregivers connected yet.',
                                    style: TextStyle(color: Colors.grey.shade500),
                                  ),
                                ),
                              )
                            else
                              ..._caregivers.map((c) => _buildCaregiverCard(c, isDark)),
                            const SizedBox(height: 30),
                            _buildHowItWorks(isDark),
                            const SizedBox(height: 30),
                            SizedBox(
                              width: double.infinity,
                              height: 55,
                              child: ElevatedButton(
                                onPressed: () => _showAddCaregiverDialog(),
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: const Color(0xFF3498DB),
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(15),
                                  ),
                                  elevation: 0,
                                ),
                                child: const Text(
                                  'Invite New Caregiver',
                                  style: TextStyle(
                                    fontSize: 16,
                                    fontWeight: FontWeight.bold,
                                    color: Colors.white,
                                  ),
                                ),
                              ),
                            ),
                            const SizedBox(height: 20),
                          ],
                        ),
                      ),
          ),
        ],
      ),
    );
  }

  Widget _buildPrivacyBanner(bool isDark) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: isDark ? Colors.blue.withOpacity(0.1) : const Color(0xFFEBF5FF),
        borderRadius: BorderRadius.circular(15),
        border: Border.all(color: Colors.blue.withOpacity(0.2)),
      ),
      child: Row(
        children: [
          const Icon(Icons.shield_outlined, color: Colors.blue, size: 28),
          const SizedBox(width: 16),
          const Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Your Privacy Matters',
                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                    color: Colors.blue,
                  ),
                ),
                SizedBox(height: 4),
                Text(
                  'You control who can see your health information and location. You can revoke access at any time.',
                  style: TextStyle(fontSize: 12, color: Colors.blue),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCaregiverCard(Map<String, dynamic> caregiver, bool isDark) {
    final status = caregiver['status'] ?? 'PENDING';
    final name = caregiver['name'] ?? '';
    final initials = name.isNotEmpty ? name.split(' ').map((e) => e[0]).take(2).join().toUpperCase() : '?';
    
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: isDark ? const Color(0xFF1E1E1E) : Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              CircleAvatar(
                radius: 25,
                backgroundColor: status == 'ACTIVE' ? Colors.green.shade100 : Colors.orange.shade100,
                child: Text(
                  initials,
                  style: TextStyle(
                    color: status == 'ACTIVE' ? Colors.green.shade700 : Colors.orange.shade700,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      name,
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: isDark ? Colors.white : const Color(0xFF2C3E50),
                      ),
                    ),
                    Text(
                      caregiver['relationship'] ?? '',
                      style: TextStyle(fontSize: 14, color: Colors.grey.shade500),
                    ),
                    Text(
                      caregiver['email'] ?? '',
                      style: TextStyle(fontSize: 12, color: Colors.grey.shade400),
                    ),
                  ],
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: status == 'ACTIVE' ? Colors.green.shade50 : Colors.orange.shade50,
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Text(
                  status == 'ACTIVE' ? 'Active' : 'Pending',
                  style: TextStyle(
                    fontSize: 12,
                    color: status == 'ACTIVE' ? Colors.green : Colors.orange,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
              const SizedBox(width: 10),
              IconButton(
                icon: const Icon(Icons.close, color: Colors.red, size: 20),
                onPressed: () => _showRemoveConfirmation(caregiver['id']),
              ),
            ],
          ),
          const SizedBox(height: 20),
          const Divider(),
          const SizedBox(height: 10),
          const Text(
            'Permissions:',
            style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.grey),
          ),
          const SizedBox(height: 10),
          _buildPermissionItem('View Location', caregiver['view_location'] == 1, isDark),
          _buildPermissionItem('View Medications', caregiver['view_medications'] == 1, isDark),
          _buildPermissionItem('Receive Alerts', caregiver['receive_alerts'] == 1, isDark),
        ],
      ),
    );
  }

  Widget _buildPermissionItem(String label, bool isEnabled, bool isDark) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 6),
      child: Row(
        children: [
          Icon(
            isEnabled ? Icons.check : Icons.close,
            size: 16,
            color: isEnabled ? Colors.green : Colors.red,
          ),
          const SizedBox(width: 8),
          Text(
            label,
            style: TextStyle(
              fontSize: 14,
              color: isDark ? Colors.white70 : const Color(0xFF2C3E50),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildHowItWorks(bool isDark) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: isDark ? const Color(0xFF1E1E1E) : Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Colors.grey.shade200),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'How It Works',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: isDark ? Colors.white : const Color(0xFF2C3E50),
            ),
          ),
          const SizedBox(height: 20),
          _buildStepItem('1', 'Invite a family member or friend by email', isDark),
          const SizedBox(height: 16),
          _buildStepItem('2', 'They\'ll receive an invitation to create a caregiver account', isDark),
          const SizedBox(height: 16),
          _buildStepItem('3', 'Once accepted, they can monitor your medication adherence', isDark),
        ],
      ),
    );
  }

  Widget _buildStepItem(String number, String text, bool isDark) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        CircleAvatar(
          radius: 12,
          backgroundColor: Colors.blue.shade50,
          child: Text(
            number,
            style: const TextStyle(fontSize: 12, color: Colors.blue, fontWeight: FontWeight.bold),
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Text(
            text,
            style: TextStyle(
              fontSize: 14,
              color: isDark ? Colors.white70 : const Color(0xFF2C3E50),
            ),
          ),
        ),
      ],
    );
  }

  void _showRemoveConfirmation(int id) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Remove Caregiver'),
        content: const Text('Are you sure you want to remove this caregiver? They will no longer have access to your health information.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              _removeCaregiver(id);
            },
            child: const Text('Remove', style: TextStyle(color: Colors.red)),
          ),
        ],
      ),
    );
  }

  void _showAddCaregiverDialog() {
    final nameController = TextEditingController();
    final relationshipController = TextEditingController();
    final emailController = TextEditingController();
    bool viewLoc = false;
    bool viewMed = true;
    bool recvAlert = true;

    showDialog(
      context: context,
      builder: (context) => StatefulBuilder(
        builder: (context, setState) => AlertDialog(
          title: const Text('Invite Caregiver'),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                TextField(
                  controller: nameController,
                  decoration: const InputDecoration(labelText: 'Full Name'),
                ),
                TextField(
                  controller: relationshipController,
                  decoration: const InputDecoration(labelText: 'Relationship (e.g. Daughter, Son)'),
                ),
                TextField(
                  controller: emailController,
                  decoration: const InputDecoration(labelText: 'Email Address'),
                  keyboardType: TextInputType.emailAddress,
                ),
                const SizedBox(height: 20),
                CheckboxListTile(
                  title: const Text('View Location'),
                  value: viewLoc,
                  onChanged: (v) => setState(() => viewLoc = v!),
                ),
                CheckboxListTile(
                  title: const Text('View Medications'),
                  value: viewMed,
                  onChanged: (v) => setState(() => viewMed = v!),
                ),
                CheckboxListTile(
                  title: const Text('Receive Alerts'),
                  value: recvAlert,
                  onChanged: (v) => setState(() => recvAlert = v!),
                ),
              ],
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('Cancel'),
            ),
            ElevatedButton(
              onPressed: () async {
                final prefs = await SharedPreferences.getInstance();
                final token = prefs.getString('auth_token');
                
                final response = await http.post(
                  Uri.parse('${ApiConfig.baseUrl}/caregivers'),
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer $token',
                  },
                  body: jsonEncode({
                    'name': nameController.text,
                    'relationship': relationshipController.text,
                    'email': emailController.text,
                    'view_location': viewLoc,
                    'view_medications': viewMed,
                    'receive_alerts': recvAlert,
                  }),
                );

                if (response.statusCode == 201) {
                  Navigator.pop(context);
                  _fetchCaregivers();
                }
              },
              child: const Text('Send Invitation'),
            ),
          ],
        ),
      ),
    );
  }
}
