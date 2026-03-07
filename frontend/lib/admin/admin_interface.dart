import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';
import 'package:provider/provider.dart';
import '../config/api_config.dart';
import '../services/language_service.dart';

class AdminInterface extends StatefulWidget {
  const AdminInterface({super.key});

  @override
  State<AdminInterface> createState() => _AdminInterfaceState();
}

class _AdminInterfaceState extends State<AdminInterface> {
  bool isLoading = true;
  Map<String, dynamic>? stats;
  List patients = [];

  @override
  void initState() {
    super.initState();
    _loadAdminData();
  }

  Future<void> _loadAdminData() async {
    if (!mounted) return;
    setState(() => isLoading = true);

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
          setState(() {
            stats = jsonDecode(statsRes.body)['statistics'];
            patients = jsonDecode(patientsRes.body)['patients'];
            isLoading = false;
          });
        }
      }
    } catch (e) {
      if (mounted) {
        setState(() => isLoading = false);
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Erreur lors du chargement des données')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final languageService = Provider.of<LanguageService>(context);
    
    return Scaffold(
      backgroundColor: theme.colorScheme.background,
      appBar: AppBar(
        title: Text(languageService.translate('adminDashboard')),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh_rounded),
            onPressed: _loadAdminData,
          ),
        ],
      ),
      drawer: _buildDrawer(context, languageService),
      body: isLoading
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: _loadAdminData,
              child: SingleChildScrollView(
                physics: const AlwaysScrollableScrollPhysics(),
                padding: const EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      languageService.translate('statistics'),
                      style: theme.textTheme.titleLarge,
                    ),
                    const SizedBox(height: 16),
                    _buildStatsGrid(theme, languageService),
                    const SizedBox(height: 32),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          languageService.translate('patients'),
                          style: theme.textTheme.titleLarge,
                        ),
                        Text(
                          '${patients.length} ${languageService.translate('total')}',
                          style: theme.textTheme.bodyMedium?.copyWith(color: theme.colorScheme.primary),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    _buildPatientList(theme, languageService),
                  ],
                ),
              ),
            ),
    );
  }

  Widget _buildStatsGrid(ThemeData theme, LanguageService lang) {
    return GridView.count(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      crossAxisCount: 2,
      crossAxisSpacing: 16,
      mainAxisSpacing: 16,
      childAspectRatio: 1.5,
      children: [
        _buildStatCard(
          theme,
          lang.translate('patients'),
          stats?['totalPatients']?.toString() ?? '0',
          Icons.people_alt_rounded,
          Colors.blue,
        ),
        _buildStatCard(
          theme,
          lang.translate('admins'),
          stats?['totalAdmins']?.toString() ?? '0',
          Icons.admin_panel_settings_rounded,
          Colors.indigo,
        ),
        _buildStatCard(
          theme,
          lang.translate('today'),
          stats?['todayScheduled']?.toString() ?? '0',
          Icons.today_rounded,
          Colors.orange,
        ),
        _buildStatCard(
          theme,
          lang.translate('alerts'),
          '0',
          Icons.warning_amber_rounded,
          Colors.red,
        ),
      ],
    );
  }

  Widget _buildStatCard(ThemeData theme, String label, String value, IconData icon, Color color) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Icon(icon, color: color, size: 24),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: color.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Icon(Icons.trending_up_rounded, size: 14, color: Colors.green),
                ),
              ],
            ),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  value,
                  style: theme.textTheme.headlineMedium?.copyWith(color: theme.colorScheme.onSurface),
                ),
                Text(
                  label,
                  style: theme.textTheme.bodySmall,
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPatientList(ThemeData theme, LanguageService lang) {
    if (patients.isEmpty) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(40.0),
          child: Column(
            children: [
              Icon(Icons.person_off_rounded, size: 60, color: Colors.grey[300]),
              const SizedBox(height: 16),
              Text('Aucun patient trouvé'),
            ],
          ),
        ),
      );
    }

    return ListView.separated(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: patients.length,
      separatorBuilder: (context, index) => const SizedBox(height: 12),
      itemBuilder: (context, index) {
        final p = patients[index];
        final bool isActive = p['is_active'] == 1 || p['is_active'] == true;
        
        return Card(
          elevation: 1,
          child: ListTile(
            contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            leading: CircleAvatar(
              backgroundColor: theme.colorScheme.primary.withOpacity(0.1),
              child: Icon(Icons.person_rounded, color: theme.colorScheme.primary),
            ),
            title: Text(
              p['name'] ?? 'Inconnu',
              style: const TextStyle(fontWeight: FontWeight.bold),
            ),
            subtitle: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SizedBox(height: 4),
                Text(p['email'] ?? ''),
                const SizedBox(height: 2),
                Text(
                  '${lang.translate('chifaNumber')}: ${p['chifa_card_registration_number'] ?? 'N/A'}',
                  style: TextStyle(fontSize: 12, color: Colors.grey[600]),
                ),
              ],
            ),
            trailing: Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
              decoration: BoxDecoration(
                color: (isActive ? Colors.green : Colors.red).withOpacity(0.1),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: (isActive ? Colors.green : Colors.red).withOpacity(0.2)),
              ),
              child: Text(
                isActive ? lang.translate('active') : lang.translate('inactive'),
                style: TextStyle(
                  color: isActive ? Colors.green[700] : Colors.red[700],
                  fontSize: 12,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
            onTap: () {},
          ),
        );
      },
    );
  }

  Widget _buildDrawer(BuildContext context, LanguageService lang) {
    final theme = Theme.of(context);
    
    return Drawer(
      child: Column(
        children: [
          UserAccountsDrawerHeader(
            decoration: BoxDecoration(
              color: theme.colorScheme.primary,
            ),
            currentAccountPicture: const CircleAvatar(
              backgroundColor: Colors.white,
              child: Icon(Icons.admin_panel_settings_rounded, size: 40, color: Color(0xFF2196F3)),
            ),
            accountName: Text(
              lang.translate('admins'),
              style: const TextStyle(fontWeight: FontWeight.bold),
            ),
            accountEmail: const Text('admin@MediCare.dz'),
          ),
          ListTile(
            leading: const Icon(Icons.dashboard_rounded),
            title: Text(lang.translate('dashboard')),
            selected: true,
            selectedColor: theme.colorScheme.primary,
            onTap: () => Navigator.pop(context),
          ),
          ListTile(
            leading: const Icon(Icons.person_outline_rounded),
            title: Text(lang.translate('profile')),
            onTap: () {
              Navigator.pop(context);
              Navigator.pushNamed(context, '/profile');
            },
          ),
          const Divider(),
          ListTile(
            leading: const Icon(Icons.settings_outlined),
            title: Text(lang.translate('settings')),
            onTap: () => Navigator.pop(context),
          ),
          const Spacer(),
          ListTile(
            leading: const Icon(Icons.logout_rounded, color: Colors.red),
            title: Text(
              lang.translate('logout'),
              style: const TextStyle(color: Colors.red),
            ),
            onTap: () async {
              final prefs = await SharedPreferences.getInstance();
              await prefs.clear();
              if (mounted) Navigator.pushReplacementNamed(context, '/signin');
            },
          ),
          const SizedBox(height: 20),
        ],
      ),
    );
  }
}