import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';
import 'package:provider/provider.dart';
import '../config/api_config.dart';
import '../services/language_service.dart';
import '../services/settings_service.dart';

class AdminInterface extends StatefulWidget {
  const AdminInterface({super.key});

  @override
  State<AdminInterface> createState() => _AdminInterfaceState();
}

class _AdminInterfaceState extends State<AdminInterface> {
  bool _isLoading = true;
  Map<String, dynamic>? _stats;
  List<Map<String, dynamic>> _patients = [];
  List<Map<String, dynamic>> _filteredPatients = [];
  String? _userName;

  final TextEditingController _searchController = TextEditingController();

  static const Color primaryBlue = Color(0xFF3498DB);
   
  static const Color bgColor = Color(0xFFF5F7FB);
  static const Color darkText = Color(0xFF0F172A);

  @override
  void initState() {
    super.initState();
    _loadUserData();
    _loadAdminData();
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  Future<void> _loadUserData() async {
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      _userName = prefs.getString('user_name') ?? 'Admin';
    });
  }

  Future<void> _loadAdminData() async {
    if (!mounted) return;
    setState(() { _isLoading = true; });

    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('auth_token');

    if (token == null) {
      if (mounted) Navigator.pushReplacementNamed(context, '/signin');
      return;
    }

    try {
      final statsRes = await http.get(
        Uri.parse('${ApiConfig.baseUrl}/admin/statistics'),
        headers: ApiConfig.getAuthHeaders(token),
      );

      final patientsRes = await http.get(
        Uri.parse('${ApiConfig.baseUrl}/admin/patients'),
        headers: ApiConfig.getAuthHeaders(token),
      );

      if (statsRes.statusCode == 200 && patientsRes.statusCode == 200) {
        if (mounted) {
          final statsData = jsonDecode(statsRes.body);
          final patientsData = jsonDecode(patientsRes.body);
          
          setState(() {
            _stats = statsData['statistics'];
            _patients = List<Map<String, dynamic>>.from(patientsData['patients'] ?? []);
            _filteredPatients = List.from(_patients);
            _isLoading = false;
          });
        }
      } else {
        if (mounted) setState(() => _isLoading = false);
      }
    } catch (e) {
      print('Error loading admin data: $e');
      if (mounted) {
        setState(() => _isLoading = false);
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Error loading data'), backgroundColor: Colors.red),
        );
      }
    }
  }

  void _filterPatients(String value) {
    if (value.trim().isEmpty) {
      setState(() => _filteredPatients = List.from(_patients));
      return;
    }
    final filtered = _patients.where((patient) {
      final name = (patient['name'] ?? '').toString().toLowerCase();
      final email = (patient['email'] ?? '').toString().toLowerCase();
      final phone = (patient['phone'] ?? '').toString().toLowerCase();
      final search = value.toLowerCase();
      return name.contains(search) || email.contains(search) || phone.contains(search);
    }).toList();
    setState(() => _filteredPatients = filtered);
  }

  Future<void> _removePatient(int patientId, String patientName, LanguageService lang) async {
    final confirm = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: Row(children: [
          Container(width: 36, height: 36,
            decoration: BoxDecoration(color: Colors.red.shade50, borderRadius: BorderRadius.circular(10)),
            child: const Icon(Icons.delete_outline, color: Colors.red, size: 18)),
          const SizedBox(width: 12),
          Text(lang.translate('deletePatient'), style: const TextStyle(fontSize: 17, color: Colors.red)),
        ]),
        content: Text('${lang.translate('confirmDeletePatient')} "$patientName"?',
            style: TextStyle(color: Colors.grey.shade600)),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context, false), child: Text(lang.translate('cancel'))),
          ElevatedButton(
            onPressed: () => Navigator.pop(context, true),
            style: ElevatedButton.styleFrom(backgroundColor: Colors.red,
                foregroundColor: Colors.white, elevation: 0,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10))),
            child: Text(lang.translate('delete')),
          ),
        ],
      ),
    );

    if (confirm != true) return;

    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('auth_token');

    if (token == null) return;

    try {
      final response = await http.delete(
        Uri.parse('${ApiConfig.baseUrl}/admin/patients/$patientId'),
        headers: ApiConfig.getAuthHeaders(token),
      );

      if (response.statusCode == 200) {
        setState(() {
          _patients.removeWhere((p) => p['id'] == patientId);
          _filteredPatients.removeWhere((p) => p['id'] == patientId);
        });
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(lang.translate('patientDeleted')), backgroundColor: Colors.green),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(lang.translate('deleteError')), backgroundColor: Colors.red),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(lang.translate('deleteError')), backgroundColor: Colors.red),
      );
    }
  }

  Future<void> _logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.clear();
    if (mounted) {
      Navigator.pushReplacementNamed(context, '/signin');
    }
  }

  String _initials() {
    final name = _userName ?? 'Admin';
    return name.split(' ').map((e) => e.isNotEmpty ? e[0] : '').take(2).join().toUpperCase();
  }

  void _snack(String msg, Color color) {
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(
      content: Text(msg),
      backgroundColor: color,
      behavior: SnackBarBehavior.floating,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
    ));
  }

  @override
  Widget build(BuildContext context) {
    final languageService = Provider.of<LanguageService>(context);
    
    return Scaffold(
      backgroundColor: bgColor,
      body: _isLoading
          ? const Center(child: CircularProgressIndicator(color: primaryBlue))
          : SafeArea(
              child: CustomScrollView(
                slivers: [
                  // ── SliverAppBar ──────────────────────────────────────────
                  SliverAppBar(
                    expandedHeight: 180,
                    pinned: true,
                    backgroundColor: primaryBlue,
                    foregroundColor: Colors.white,
                    elevation: 0,
                    leading: Builder(
                      builder: (ctx) => IconButton(
                        icon: Container(
                          width: 36, height: 36,
                          decoration: BoxDecoration(
                            color: Colors.white.withOpacity(0.15),
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: const Icon(Icons.menu_rounded, color: Colors.white, size: 18),
                        ),
                        onPressed: () => Scaffold.of(ctx).openDrawer(),
                      ),
                    ),
                    actions: [
                      IconButton(
                        icon: Container(
                          width: 36, height: 36,
                          decoration: BoxDecoration(
                            color: Colors.white.withOpacity(0.15),
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: const Icon(Icons.refresh_rounded, color: Colors.white, size: 18),
                        ),
                        onPressed: _loadAdminData,
                      ),
                      const SizedBox(width: 8),
                    ],
                    flexibleSpace: FlexibleSpaceBar(
                      background: Container(
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            colors: [const Color.fromARGB(255, 23, 152, 232), primaryBlue],
                            begin: Alignment.topLeft, end: Alignment.bottomRight,
                          ),
                        ),
                        child: Stack(children: [
                          Positioned(top: -30, right: -30,
                            child: Container(width: 140, height: 140,
                              decoration: BoxDecoration(shape: BoxShape.circle,
                                  color: Colors.white.withOpacity(0.08)))),
                          SafeArea(child: Padding(
                            padding: const EdgeInsets.fromLTRB(20, 56, 20, 20),
                            child: Row(children: [
                              Container(
                                width: 72, height: 72,
                                decoration: BoxDecoration(
                                  color: Colors.white,
                                  borderRadius: BorderRadius.circular(20),
                                  boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.15), blurRadius: 12)],
                                ),
                                child: Center(child: Text(
                                  _initials(),
                                  style: TextStyle(fontSize: 26, fontWeight: FontWeight.bold, color: primaryBlue),
                                )),
                              ),
                              const SizedBox(width: 16),
                              Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                                Text(_userName ?? 'Admin',
                                    style: const TextStyle(color: Colors.white,
                                        fontSize: 20, fontWeight: FontWeight.w900, letterSpacing: -0.3)),
                                const SizedBox(height: 4),
                                Text('System Administrator',
                                    style: TextStyle(color: Colors.white.withOpacity(0.7), fontSize: 13)),
                                const SizedBox(height: 6),
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                  decoration: BoxDecoration(
                                    color: Colors.white.withOpacity(0.15),
                                    borderRadius: BorderRadius.circular(20),
                                  ),
                                  child: const Text('Admin', style: TextStyle(color: Colors.white,
                                      fontSize: 11, fontWeight: FontWeight.w600, letterSpacing: 0.5)),
                                ),
                              ])),
                            ]),
                          )),
                        ]),
                      ),
                    ),
                  ),

                  // ── Stats Grid ───────────────────────────────────────────
                  SliverToBoxAdapter(
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Row(
                        children: [
                          Expanded(child: _buildStatCard(languageService.translate('patients'), _stats?['totalPatients']?.toString() ?? '0', Icons.people_alt_rounded, Colors.blue)),
                          const SizedBox(width: 12),
                          Expanded(child: _buildStatCard(languageService.translate('caregivers'), _stats?['totalCaregivers']?.toString() ?? '0', Icons.people_outline, Colors.green)),
                          const SizedBox(width: 12),
                          Expanded(child: _buildStatCard(languageService.translate('admins'), _stats?['totalAdmins']?.toString() ?? '1', Icons.admin_panel_settings_rounded, Colors.orange)),
                        ],
                      ),
                    ),
                  ),

                  // ── Search Bar ───────────────────────────────────────────
                  SliverToBoxAdapter(
                    child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                      child: Container(
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(16),
                          boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.03), blurRadius: 5)],
                        ),
                        child: TextField(
                          controller: _searchController,
                          onChanged: _filterPatients,
                          decoration: InputDecoration(
                            hintText: languageService.translate('searchPatients'),
                            prefixIcon: const Icon(Icons.search, color: Colors.grey),
                            suffixIcon: _searchController.text.isEmpty
                                ? null
                                : IconButton(
                                    onPressed: () {
                                      _searchController.clear();
                                      _filterPatients('');
                                    },
                                    icon: const Icon(Icons.close, color: Colors.grey),
                                  ),
                            border: InputBorder.none,
                            contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                          ),
                        ),
                      ),
                    ),
                  ),

                  // ── Patient List ─────────────────────────────────────────
                  SliverPadding(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    sliver: _filteredPatients.isEmpty
                        ? SliverToBoxAdapter(child: _buildEmptyState(languageService))
                        : SliverList(
                            delegate: SliverChildBuilderDelegate(
                              (context, index) => _buildPatientCard(_filteredPatients[index], languageService),
                              childCount: _filteredPatients.length,
                            ),
                          ),
                  ),
                  const SliverToBoxAdapter(child: SizedBox(height: 30)),
                ],
              ),
            ),
      drawer: _buildDrawer(context, languageService),
    );
  }

  Widget _buildStatCard(String label, String value, IconData icon, Color color) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.04), blurRadius: 10, offset: const Offset(0, 4))],
      ),
      child: Column(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(color: color.withOpacity(0.1), shape: BoxShape.circle),
            child: Icon(icon, color: color, size: 24),
          ),
          const SizedBox(height: 12),
          Text(value, style: TextStyle(color: color, fontSize: 24, fontWeight: FontWeight.bold)),
          const SizedBox(height: 4),
          Text(label, textAlign: TextAlign.center, style: TextStyle(color: Colors.grey.shade600, fontSize: 12)),
        ],
      ),
    );
  }

  Widget _buildPatientCard(Map<String, dynamic> patient, LanguageService lang) {
    final bool isActive = (patient['is_active'] == 1 || patient['is_active'] == true);
    final String name = patient['name']?.toString() ?? 'Unknown';
    final String email = patient['email']?.toString() ?? '';
    final String phone = patient['phone']?.toString() ?? '';
    final String initials = name.isNotEmpty
        ? name.split(' ').map((e) => e[0]).take(2).join().toUpperCase()
        : 'P';
    
    double adherence = 0.0;
    final adherenceValue = patient['adherence_rate'];
    if (adherenceValue != null) {
      if (adherenceValue is num) {
        adherence = adherenceValue.toDouble();
      } else if (adherenceValue is String) {
        adherence = double.tryParse(adherenceValue) ?? 0.0;
      }
    }
    
    final List caregivers = patient['caregivers'] ?? [];

    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.04), blurRadius: 10, offset: const Offset(0, 4))],
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  width: 50, height: 50,
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [primaryBlue, primaryBlue.withOpacity(0.7)],
                      begin: Alignment.topLeft, end: Alignment.bottomRight,
                    ),
                    borderRadius: BorderRadius.circular(14),
                  ),
                  child: Center(child: Text(initials, style: const TextStyle(
                      color: Colors.white, fontWeight: FontWeight.bold, fontSize: 18))),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(name, style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 16, color: darkText)),
                      const SizedBox(height: 2),
                      Text(email, style: TextStyle(color: Colors.grey.shade500, fontSize: 12)),
                      if (phone.isNotEmpty)
                        Text(phone, style: TextStyle(color: Colors.grey.shade400, fontSize: 11)),
                    ],
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color: (isActive ? Colors.green : Colors.red).withOpacity(0.1),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Text(
                    isActive ? lang.translate('active') : lang.translate('inactive'),
                    style: TextStyle(
                      color: isActive ? Colors.green : Colors.red,
                      fontWeight: FontWeight.bold,
                      fontSize: 11,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            Container(
              padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 12),
              decoration: BoxDecoration(
                color: Colors.blue.withOpacity(0.08),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(lang.translate('adherenceRate'), style: TextStyle(fontSize: 12, fontWeight: FontWeight.w500)),
                  Row(
                    children: [
                      Text(
                        '${adherence.toStringAsFixed(0)}%',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: adherence >= 80 ? Colors.green : (adherence >= 50 ? Colors.orange : Colors.red),
                        ),
                      ),
                      const SizedBox(width: 4),
                      Icon(
                        Icons.trending_up,
                        size: 16,
                        color: adherence >= 80 ? Colors.green : (adherence >= 50 ? Colors.orange : Colors.red),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            if (caregivers.isNotEmpty) ...[
              const SizedBox(height: 12),
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.green.withOpacity(0.05),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: Colors.green.withOpacity(0.2)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Icon(Icons.people_outline, size: 14, color: Colors.green.shade700),
                        const SizedBox(width: 6),
                        Text(
                          '${lang.translate('caregivers')} (${caregivers.length})',
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w600,
                            color: Colors.green.shade700,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Wrap(
                      spacing: 8,
                      runSpacing: 6,
                      children: caregivers.map<Widget>((c) {
                        final caregiverEmail = c['email']?.toString() ?? c['name']?.toString() ?? 'Unknown';
                        return Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(16),
                            border: Border.all(color: Colors.green.shade200),
                          ),
                          child: Text(
                            caregiverEmail,
                            style: TextStyle(
                              color: Colors.green.shade700,
                              fontSize: 11,
                            ),
                          ),
                        );
                      }).toList(),
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
                    onPressed: () {},
                    icon: const Icon(Icons.visibility, size: 18),
                    label: Text(lang.translate('view')),
                    style: OutlinedButton.styleFrom(
                      foregroundColor: primaryBlue,
                      side: BorderSide(color: primaryBlue.withOpacity(0.3)),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: () => _removePatient(patient['id'] as int, name, lang),
                    icon: const Icon(Icons.delete_outline, size: 18),
                    label: Text(lang.translate('delete')),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.red,
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildEmptyState(LanguageService lang) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.people_outline, size: 80, color: Colors.grey.shade300),
          const SizedBox(height: 16),
          Text(lang.translate('noPatients'), style: TextStyle(color: Colors.grey.shade500, fontSize: 16)),
        ],
      ),
    );
  }

  Widget _buildDrawer(BuildContext context, LanguageService lang) {
    final settingsService = Provider.of<SettingsService>(context);
    
    return Drawer(
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.only(topRight: Radius.circular(28), bottomRight: Radius.circular(28))),
      child: Column(children: [
        Container(
          width: double.infinity,
          padding: const EdgeInsets.fromLTRB(20, 52, 20, 28),
          decoration: BoxDecoration(
            gradient: LinearGradient(
              colors: [const Color.fromARGB(255, 23, 152, 232), primaryBlue],
              begin: Alignment.topLeft, end: Alignment.bottomRight,
            ),
          ),
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Container(
              width: 60, height: 60,
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(18),
                boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.15), blurRadius: 10)],
              ),
              child: Center(child: Text(_initials(), style: TextStyle(
                  fontSize: 22, fontWeight: FontWeight.bold, color: primaryBlue))),
            ),
            const SizedBox(height: 14),
            Text(_userName ?? 'Admin', style: const TextStyle(color: Colors.white,
                fontSize: 18, fontWeight: FontWeight.w800)),
            const SizedBox(height: 4),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.15),
                borderRadius: BorderRadius.circular(20),
              ),
              child: const Text('Administrator', style: TextStyle(color: Colors.white,
                  fontSize: 11, fontWeight: FontWeight.w600, letterSpacing: 0.5)),
            ),
          ]),
        ),
        const SizedBox(height: 8),
        _drawerItem(Icons.dashboard, lang.translate('dashboard'), true, () => Navigator.pop(context)),
        const Padding(
          padding: EdgeInsets.symmetric(horizontal: 20, vertical: 8),
          child: Divider(height: 1),
        ),
        _drawerItem(Icons.person_outline, lang.translate('profile'), false, () {
          Navigator.pop(context);
          Navigator.pushNamed(context, '/profile');
        }),
        _drawerItem(Icons.language, lang.translate('language'), false, () {
          _showLanguageDialog(context, settingsService, lang);
        }),
        const Spacer(),
        const Padding(
          padding: EdgeInsets.symmetric(horizontal: 20, vertical: 8),
          child: Divider(height: 1),
        ),
        _drawerItem(Icons.logout, lang.translate('logout'), true, _logout),
        const SizedBox(height: 20),
      ]),
    );
  }

  Widget _drawerItem(IconData icon, String title, bool isRed, VoidCallback onTap) {
    final color = isRed ? Colors.red : const Color(0xFF0F172A);
    return ListTile(
      leading: Container(
        width: 36, height: 36,
        decoration: BoxDecoration(
          color: isRed ? Colors.red.withOpacity(0.08) : primaryBlue.withOpacity(0.08),
          borderRadius: BorderRadius.circular(10),
        ),
        child: Icon(icon, size: 18,
            color: isRed ? Colors.red : primaryBlue),
      ),
      title: Text(title, style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: color)),
      onTap: onTap,
      contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 2),
    );
  }

  void _showLanguageDialog(BuildContext context, SettingsService settings, LanguageService lang) async {
    final currentLang = lang.getCurrentLanguage();
    
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
          title: Row(children: [
            Container(width: 36, height: 36,
              decoration: BoxDecoration(color: primaryBlue.withOpacity(0.1), borderRadius: BorderRadius.circular(10)),
              child: const Icon(Icons.language, color: primaryBlue, size: 18)),
            const SizedBox(width: 12),
            Text(lang.translate('language'), style: TextStyle(color: primaryBlue, fontWeight: FontWeight.bold, fontSize: 17)),
          ]),
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
                    settings.setLanguage('en');
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
                    settings.setLanguage('fr');
                  },
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}