import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';
import '../config/api_config.dart';

// ─────────────────────────────────────────────────────────────────────────────
//  Shared palette
// ─────────────────────────────────────────────────────────────────────────────
const Color kPrimaryBlue = Color(0xFF3498DB);
const Color kBlueTop = Color.fromARGB(255, 23, 152, 232);
const Color kBg = Color(0xFFF5F7FB);
const Color kDarkText = Color(0xFF0F172A);
const Color kMutedText = Color(0xFF94A3B8);

// Small parsing helpers (backend sometimes returns num, sometimes String)
double _toDouble(dynamic v) {
  if (v == null) return 0.0;
  if (v is num) return v.toDouble();
  return double.tryParse(v.toString()) ?? 0.0;
}

int _toInt(dynamic v) {
  if (v == null) return 0;
  if (v is num) return v.toInt();
  return int.tryParse(v.toString()) ?? 0;
}

bool _isTrue(dynamic v) => v == 1 || v == true || v == '1';

String _initialsOf(String name, {String fallback = '?'}) {
  if (name.trim().isEmpty) return fallback;
  return name
      .trim()
      .split(RegExp(r'\s+'))
      .where((e) => e.isNotEmpty)
      .map((e) => e[0])
      .take(2)
      .join()
      .toUpperCase();
}

Color _adherenceColor(double v) =>
    v >= 80 ? Colors.green : (v >= 50 ? Colors.orange : Colors.red);

const List<String> _monthsShort = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

String _monthYear(dynamic iso) {
  if (iso == null) return '—';
  final d = DateTime.tryParse(iso.toString());
  if (d == null) return '—';
  return '${_monthsShort[d.month - 1]} ${d.year}';
}

int? _ageFromDob(dynamic dob) {
  if (dob == null) return null;
  final d = DateTime.tryParse(dob.toString());
  if (d == null) return null;
  final now = DateTime.now();
  int age = now.year - d.year;
  if (now.month < d.month || (now.month == d.month && now.day < d.day)) age--;
  return age;
}

enum _PatientSort { adherenceDesc, adherenceAsc, nameAsc }

// ─────────────────────────────────────────────────────────────────────────────
//  Main shell  (bottom nav: Dashboard / Patients / Caregivers / Profile)
// ─────────────────────────────────────────────────────────────────────────────
class AdminInterface extends StatefulWidget {
  const AdminInterface({super.key});

  @override
  State<AdminInterface> createState() => _AdminInterfaceState();
}

class _AdminInterfaceState extends State<AdminInterface> {
  final _scaffoldKey = GlobalKey<ScaffoldState>();
  final TextEditingController _searchController = TextEditingController();

  int _currentTab = 0;
  bool _isLoading = true;
  String _userName = 'Admin';

  Map<String, dynamic>? _stats;
  List<Map<String, dynamic>> _patients = [];
  List<Map<String, dynamic>> _caregivers = [];

  // Patient filtering / sorting
  String _search = '';
  String _statusFilter = 'all'; // all | active | inactive | low
  _PatientSort _sort = _PatientSort.adherenceDesc;

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
    if (!mounted) return;
    setState(() => _userName = prefs.getString('user_name') ?? 'Admin');
  }

  Future<void> _loadAdminData() async {
    if (!mounted) return;
    setState(() => _isLoading = true);

    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('auth_token');
    if (token == null) {
      if (mounted) Navigator.pushReplacementNamed(context, '/signin');
      return;
    }

    try {
      final results = await Future.wait([
        http.get(Uri.parse('${ApiConfig.baseUrl}/admin/statistics'),
            headers: ApiConfig.getAuthHeaders(token)),
        http.get(Uri.parse('${ApiConfig.baseUrl}/admin/patients'),
            headers: ApiConfig.getAuthHeaders(token)),
        http.get(Uri.parse('${ApiConfig.baseUrl}/admin/caregivers'),
            headers: ApiConfig.getAuthHeaders(token)),
      ]);

      final statsRes = results[0];
      final patientsRes = results[1];
      final caregiversRes = results[2];

      if (!mounted) return;

      if (statsRes.statusCode == 200) {
        _stats = jsonDecode(statsRes.body)['statistics'];
      }
      if (patientsRes.statusCode == 200) {
        _patients = List<Map<String, dynamic>>.from(
            jsonDecode(patientsRes.body)['patients'] ?? []);
      }
      if (caregiversRes.statusCode == 200) {
        _caregivers = List<Map<String, dynamic>>.from(
            jsonDecode(caregiversRes.body)['caregivers'] ?? []);
      }

      setState(() => _isLoading = false);
    } catch (e) {
      debugPrint('Error loading admin data: $e');
      if (mounted) {
        setState(() => _isLoading = false);
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
              content: Text('Error loading data'),
              backgroundColor: Colors.red),
        );
      }
    }
  }

  // ── Derived patient list (search + filter + sort) ──────────────────────────
  List<Map<String, dynamic>> get _visiblePatients {
    var list = _patients.where((p) {
      // search
      if (_search.isNotEmpty) {
        final s = _search.toLowerCase();
        final name = (p['name'] ?? '').toString().toLowerCase();
        final email = (p['email'] ?? '').toString().toLowerCase();
        final phone = (p['phone'] ?? '').toString().toLowerCase();
        if (!(name.contains(s) || email.contains(s) || phone.contains(s))) {
          return false;
        }
      }
      // status filter
      final active = _isTrue(p['is_active']);
      final adh = _toDouble(p['adherence_rate']);
      switch (_statusFilter) {
        case 'active':
          return active;
        case 'inactive':
          return !active;
        case 'low':
          return adh < 50;
        default:
          return true;
      }
    }).toList();

    list.sort((a, b) {
      switch (_sort) {
        case _PatientSort.adherenceAsc:
          return _toDouble(a['adherence_rate'])
              .compareTo(_toDouble(b['adherence_rate']));
        case _PatientSort.nameAsc:
          return (a['name'] ?? '')
              .toString()
              .toLowerCase()
              .compareTo((b['name'] ?? '').toString().toLowerCase());
        case _PatientSort.adherenceDesc:
        default:
          return _toDouble(b['adherence_rate'])
              .compareTo(_toDouble(a['adherence_rate']));
      }
    });
    return list;
  }

  // ── Actions ────────────────────────────────────────────────────────────────
  Future<void> _logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.clear();
    if (mounted) Navigator.pushReplacementNamed(context, '/signin');
  }

  Future<void> _openPatientProfile(Map<String, dynamic> patient) async {
    final changed = await Navigator.push<bool>(
      context,
      MaterialPageRoute(
        builder: (_) => AdminPatientProfilePage(
          patientId: _toInt(patient['id']),
          patientName: patient['name']?.toString() ?? 'Patient',
        ),
      ),
    );
    if (changed == true) _loadAdminData();
  }

  Future<void> _toggleStatus(Map<String, dynamic> patient) async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('auth_token');
    if (token == null) return;

    final newValue = !_isTrue(patient['is_active']);
    try {
      final res = await http.put(
        Uri.parse(
            '${ApiConfig.baseUrl}/admin/patients/${patient['id']}/toggle-status'),
        headers: ApiConfig.getAuthHeaders(token),
        body: jsonEncode({'is_active': newValue}),
      );
      if (res.statusCode == 200) {
        setState(() => patient['is_active'] = newValue ? 1 : 0);
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(SnackBar(
            content: Text(newValue
                ? 'Account activated'
                : 'Account deactivated'),
            backgroundColor: newValue ? Colors.green : Colors.orange,
          ));
        }
      }
    } catch (_) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
            content: Text('Connection error'), backgroundColor: Colors.red));
      }
    }
  }

  Future<void> _deletePatient(int id, String name) async {
    final confirm = await _confirmDelete('patient', name);
    if (confirm != true) return;

    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('auth_token');
    if (token == null) return;

    try {
      final res = await http.delete(
        Uri.parse('${ApiConfig.baseUrl}/admin/patients/$id'),
        headers: ApiConfig.getAuthHeaders(token),
      );
      if (res.statusCode == 200) {
        setState(() => _patients.removeWhere((p) => _toInt(p['id']) == id));
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
              content: Text('Patient deleted'),
              backgroundColor: Colors.green));
        }
      } else {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
              content: Text('Failed to delete patient'),
              backgroundColor: Colors.red));
        }
      }
    } catch (_) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
            content: Text('Connection error'), backgroundColor: Colors.red));
      }
    }
  }

  Future<void> _deleteCaregiver(int id, String name) async {
    final confirm = await _confirmDelete('caregiver', name);
    if (confirm != true) return;

    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('auth_token');
    if (token == null) return;

    try {
      final res = await http.delete(
        Uri.parse('${ApiConfig.baseUrl}/admin/caregivers/$id'),
        headers: ApiConfig.getAuthHeaders(token),
      );
      if (res.statusCode == 200) {
        setState(() => _caregivers.removeWhere((c) => _toInt(c['id']) == id));
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
              content: Text('Caregiver deleted'),
              backgroundColor: Colors.green));
        }
      }
    } catch (_) {/* ignore */}
  }

  Future<bool?> _confirmDelete(String type, String name) {
    return showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: Row(children: [
          Container(
            width: 36,
            height: 36,
            decoration: BoxDecoration(
                color: Colors.red.shade50,
                borderRadius: BorderRadius.circular(10)),
            child: const Icon(Icons.delete_outline, color: Colors.red, size: 18),
          ),
          const SizedBox(width: 12),
          Text('Delete ${type[0].toUpperCase()}${type.substring(1)}',
              style: const TextStyle(fontSize: 17, color: Colors.red)),
        ]),
        content: Text('Are you sure you want to delete "$name"?',
            style: TextStyle(color: Colors.grey.shade600)),
        actions: [
          TextButton(
              onPressed: () => Navigator.pop(ctx, false),
              child: const Text('Cancel')),
          ElevatedButton(
            onPressed: () => Navigator.pop(ctx, true),
            style: ElevatedButton.styleFrom(
                backgroundColor: Colors.red,
                foregroundColor: Colors.white,
                elevation: 0,
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(10))),
            child: const Text('Delete'),
          ),
        ],
      ),
    );
  }

  // ── Build ────────────────────────────────────────────────────────────────
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      key: _scaffoldKey,
      backgroundColor: kBg,
      drawer: _buildDrawer(),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator(color: kPrimaryBlue))
          : SafeArea(
              bottom: false,
              child: IndexedStack(
                index: _currentTab,
                children: [
                  _buildDashboardTab(),
                  _buildPatientsTab(),
                  _buildCaregiversTab(),
                  _buildProfileTab(),
                ],
              ),
            ),
      bottomNavigationBar: _buildBottomNav(),
    );
  }

  // ── Bottom navigation ──────────────────────────────────────────────────────
  Widget _buildBottomNav() {
    final items = [
      (Icons.dashboard_rounded, 'Dashboard'),
      (Icons.people_alt_rounded, 'Patients'),
      (Icons.groups_rounded, 'Caregivers'),
      (Icons.person_rounded, 'Profile'),
    ];
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        boxShadow: [
          BoxShadow(color: Colors.black.withOpacity(0.06), blurRadius: 12)
        ],
      ),
      child: SafeArea(
        top: false,
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 6, horizontal: 4),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: List.generate(items.length, (i) {
              final selected = _currentTab == i;
              return Expanded(
                child: InkWell(
                  borderRadius: BorderRadius.circular(14),
                  onTap: () => setState(() => _currentTab = i),
                  child: Padding(
                    padding: const EdgeInsets.symmetric(vertical: 8),
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(items[i].$1,
                            size: 24,
                            color: selected ? kPrimaryBlue : kMutedText),
                        const SizedBox(height: 4),
                        Text(items[i].$2,
                            style: TextStyle(
                                fontSize: 11,
                                fontWeight: selected
                                    ? FontWeight.w700
                                    : FontWeight.w500,
                                color:
                                    selected ? kPrimaryBlue : kMutedText)),
                      ],
                    ),
                  ),
                ),
              );
            }),
          ),
        ),
      ),
    );
  }

  // ── Reusable gradient header ────────────────────────────────────────────────
  Widget _gradientHeader({
    required String title,
    Widget? bottom,
    bool showRefresh = false,
    bool showBack = false,
    EdgeInsets padding = const EdgeInsets.fromLTRB(16, 14, 16, 18),
  }) {
    return Container(
      width: double.infinity,
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          colors: [kBlueTop, kPrimaryBlue],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.only(
          bottomLeft: Radius.circular(28),
          bottomRight: Radius.circular(28),
        ),
      ),
      child: Padding(
        padding: padding,
        child: Column(
          children: [
            Row(
              children: [
                _circleIconButton(
                  showBack ? Icons.arrow_back_ios_new_rounded : Icons.menu_rounded,
                  () => showBack
                      ? Navigator.maybePop(context)
                      : _scaffoldKey.currentState?.openDrawer(),
                ),
                Expanded(
                  child: Text(title,
                      textAlign: TextAlign.center,
                      style: const TextStyle(
                          color: Colors.white,
                          fontSize: 18,
                          fontWeight: FontWeight.w800)),
                ),
                if (showRefresh)
                  _circleIconButton(Icons.refresh_rounded, _loadAdminData)
                else
                  const SizedBox(width: 36),
              ],
            ),
            if (bottom != null) ...[const SizedBox(height: 14), bottom],
          ],
        ),
      ),
    );
  }

  Widget _circleIconButton(IconData icon, VoidCallback onTap) {
    return InkWell(
      borderRadius: BorderRadius.circular(10),
      onTap: onTap,
      child: Container(
        width: 36,
        height: 36,
        decoration: BoxDecoration(
            color: Colors.white.withOpacity(0.18),
            borderRadius: BorderRadius.circular(10)),
        child: Icon(icon, color: Colors.white, size: 18),
      ),
    );
  }

  // ───────────────────────────────────────────────────────────────────────────
  //  TAB 1 — DASHBOARD
  // ───────────────────────────────────────────────────────────────────────────
  Widget _buildDashboardTab() {
    final visible = _visiblePatients;
    return RefreshIndicator(
      onRefresh: _loadAdminData,
      color: kPrimaryBlue,
      child: CustomScrollView(
        slivers: [
          SliverToBoxAdapter(
            child: _gradientHeader(
              title: 'Admin Console',
              showRefresh: true,
              bottom: _adminProfileRow(),
            ),
          ),
          SliverToBoxAdapter(child: _statsSection()),
          ..._patientControlsAndList(visible),
          const SliverToBoxAdapter(child: SizedBox(height: 24)),
        ],
      ),
    );
  }

  Widget _adminProfileRow() {
    return Row(
      children: [
        Container(
          width: 56,
          height: 56,
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16),
            boxShadow: [
              BoxShadow(color: Colors.black.withOpacity(0.12), blurRadius: 8)
            ],
          ),
          child: Center(
            child: Text(_initialsOf(_userName, fallback: 'A'),
                style: const TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    color: kPrimaryBlue)),
          ),
        ),
        const SizedBox(width: 14),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(_userName,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                      color: Colors.white,
                      fontSize: 18,
                      fontWeight: FontWeight.w900)),
              const SizedBox(height: 2),
              const Text('System Administrator',
                  style: TextStyle(color: Colors.white70, fontSize: 12)),
            ],
          ),
        ),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
          decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.18),
              borderRadius: BorderRadius.circular(20)),
          child: const Text('ADMIN',
              style: TextStyle(
                  color: Colors.white,
                  fontSize: 11,
                  fontWeight: FontWeight.w700,
                  letterSpacing: 0.8)),
        ),
      ],
    );
  }

  Widget _statsSection() {
    final total = _toInt(_stats?['totalPatients']);
    final active = _toInt(_stats?['activePatients']);
    final newThisMonth = _stats?['newPatientsThisMonth']; // optional
    final ratio = total > 0 ? active / total : 0.0;

    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 4),
      child: Column(
        children: [
          // Top two big cards
          IntrinsicHeight(
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Expanded(
                  child: _bigStatCard(
                    dotColor: kPrimaryBlue,
                    label: 'PATIENTS',
                    value: '$total',
                    trailing: newThisMonth != null
                        ? Row(children: [
                            const Icon(Icons.trending_up,
                                size: 14, color: Colors.green),
                            const SizedBox(width: 4),
                            Text('+${_toInt(newThisMonth)} this month',
                                style: const TextStyle(
                                    fontSize: 11,
                                    color: Colors.green,
                                    fontWeight: FontWeight.w600)),
                          ])
                        : null,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _bigStatCard(
                    dotColor: Colors.green,
                    label: 'ACTIVE',
                    value: '$active',
                    valueSuffix: ' /$total',
                    trailing: SizedBox(
                      height: 6,
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(8),
                        child: LinearProgressIndicator(
                          value: ratio,
                          minHeight: 6,
                          backgroundColor: Colors.green.withOpacity(0.12),
                          valueColor:
                              const AlwaysStoppedAnimation(Colors.green),
                        ),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 12),
          // Three small cards
          Row(
            children: [
              Expanded(
                  child: _smallStatCard(
                      '${_toInt(_stats?['totalCaregivers'])}',
                      'Caregivers',
                      kPrimaryBlue)),
              const SizedBox(width: 12),
              Expanded(
                  child: _smallStatCard(
                      '${_toInt(_stats?['activeTreatments'])}',
                      'Treatments',
                      Colors.orange)),
              const SizedBox(width: 12),
              Expanded(
                  child: _smallStatCard(
                      '${_toInt(_stats?['totalAdmins'])}',
                      'Admins',
                      const Color(0xFF7C3AED))),
            ],
          ),
        ],
      ),
    );
  }

  Widget _bigStatCard({
    required Color dotColor,
    required String label,
    required String value,
    String? valueSuffix,
    Widget? trailing,
  }) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
              color: Colors.black.withOpacity(0.04),
              blurRadius: 10,
              offset: const Offset(0, 4))
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(children: [
            Container(
                width: 8,
                height: 8,
                decoration:
                    BoxDecoration(color: dotColor, shape: BoxShape.circle)),
            const SizedBox(width: 6),
            Text(label,
                style: TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w700,
                    color: Colors.grey.shade500,
                    letterSpacing: 0.5)),
          ]),
          const SizedBox(height: 8),
          RichText(
            text: TextSpan(
              text: value,
              style: const TextStyle(
                  fontSize: 30,
                  fontWeight: FontWeight.w900,
                  color: kDarkText),
              children: valueSuffix != null
                  ? [
                      TextSpan(
                          text: valueSuffix,
                          style: TextStyle(
                              fontSize: 15,
                              fontWeight: FontWeight.w600,
                              color: Colors.grey.shade400))
                    ]
                  : null,
            ),
          ),
          const SizedBox(height: 8),
          if (trailing != null) trailing,
        ],
      ),
    );
  }

  Widget _smallStatCard(String value, String label, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        boxShadow: [
          BoxShadow(
              color: Colors.black.withOpacity(0.04),
              blurRadius: 8,
              offset: const Offset(0, 3))
        ],
      ),
      child: Column(
        children: [
          Text(value,
              style: TextStyle(
                  fontSize: 22, fontWeight: FontWeight.w900, color: color)),
          const SizedBox(height: 2),
          Text(label,
              style: TextStyle(fontSize: 11, color: Colors.grey.shade500)),
        ],
      ),
    );
  }

  // ── Patient controls (title + sort + filter chips + search) + list ──────────
  List<Widget> _patientControlsAndList(List<Map<String, dynamic>> visible) {
    return [
      SliverToBoxAdapter(
        child: Padding(
          padding: const EdgeInsets.fromLTRB(16, 14, 16, 6),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text('Patients',
                  style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w800,
                      color: kDarkText)),
              _sortButton(),
            ],
          ),
        ),
      ),
      SliverToBoxAdapter(child: _filterChips()),
      SliverToBoxAdapter(child: _searchBar()),
      if (visible.isEmpty)
        SliverToBoxAdapter(child: _emptyState('No patients found'))
      else
        SliverPadding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          sliver: SliverList(
            delegate: SliverChildBuilderDelegate(
              (context, i) => _patientCard(visible[i]),
              childCount: visible.length,
            ),
          ),
        ),
    ];
  }

  Widget _sortButton() {
    String label;
    switch (_sort) {
      case _PatientSort.adherenceAsc:
        label = 'Adherence ↑';
        break;
      case _PatientSort.nameAsc:
        label = 'Name A–Z';
        break;
      default:
        label = 'Adherence ↓';
    }
    return PopupMenuButton<_PatientSort>(
      onSelected: (s) => setState(() => _sort = s),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
      itemBuilder: (_) => const [
        PopupMenuItem(
            value: _PatientSort.adherenceDesc,
            child: Text('Adherence (high → low)')),
        PopupMenuItem(
            value: _PatientSort.adherenceAsc,
            child: Text('Adherence (low → high)')),
        PopupMenuItem(value: _PatientSort.nameAsc, child: Text('Name (A–Z)')),
      ],
      child: Row(mainAxisSize: MainAxisSize.min, children: [
        Text('Sort: ',
            style: TextStyle(fontSize: 13, color: Colors.grey.shade500)),
        Text(label,
            style: const TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.w700,
                color: kPrimaryBlue)),
      ]),
    );
  }

  Widget _filterChips() {
    final chips = [
      ('all', 'All'),
      ('active', 'Active'),
      ('inactive', 'Inactive'),
      ('low', 'Low adherence'),
    ];
    return SizedBox(
      height: 44,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
        itemCount: chips.length,
        separatorBuilder: (_, __) => const SizedBox(width: 8),
        itemBuilder: (_, i) {
          final selected = _statusFilter == chips[i].$1;
          return GestureDetector(
            onTap: () => setState(() => _statusFilter = chips[i].$1),
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              alignment: Alignment.center,
              decoration: BoxDecoration(
                color: selected ? kPrimaryBlue : Colors.white,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(
                    color: selected ? kPrimaryBlue : Colors.grey.shade200),
              ),
              child: Text(chips[i].$2,
                  style: TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w600,
                      color: selected ? Colors.white : Colors.grey.shade600)),
            ),
          );
        },
      ),
    );
  }

  Widget _searchBar() {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 8, 16, 8),
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
            BoxShadow(color: Colors.black.withOpacity(0.03), blurRadius: 5)
          ],
        ),
        child: TextField(
          controller: _searchController,
          onChanged: (v) => setState(() => _search = v.trim()),
          decoration: const InputDecoration(
            hintText: 'Search by name, email, phone...',
            prefixIcon: Icon(Icons.search, color: Colors.grey),
            border: InputBorder.none,
            contentPadding:
                EdgeInsets.symmetric(horizontal: 16, vertical: 14),
          ),
        ),
      ),
    );
  }

  Widget _patientCard(Map<String, dynamic> p) {
    final name = p['name']?.toString() ?? 'Unknown';
    final email = p['email']?.toString() ?? '';
    final active = _isTrue(p['is_active']);
    final adh = _toDouble(p['adherence_rate']);
    final caregivers = (p['caregivers'] as List?) ?? [];

    return Container(
      margin: const EdgeInsets.only(bottom: 14),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
              color: Colors.black.withOpacity(0.04),
              blurRadius: 10,
              offset: const Offset(0, 4))
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _avatar(name, 48),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(name,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(
                            fontWeight: FontWeight.w800,
                            fontSize: 16,
                            color: kDarkText)),
                    const SizedBox(height: 2),
                    Text(email,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: TextStyle(
                            color: Colors.grey.shade500, fontSize: 12)),
                  ],
                ),
              ),
              _statusBadge(active),
              _patientMenu(p, name),
            ],
          ),
          const SizedBox(height: 14),
          // adherence row
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
            decoration: BoxDecoration(
              color: _adherenceColor(adh).withOpacity(0.08),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Row(
              children: [
                Text('30-day adherence',
                    style:
                        TextStyle(fontSize: 12, color: Colors.grey.shade700)),
                const Spacer(),
                Text('${adh.toStringAsFixed(0)}%',
                    style: TextStyle(
                        fontSize: 15,
                        fontWeight: FontWeight.w800,
                        color: _adherenceColor(adh))),
              ],
            ),
          ),
          if (caregivers.isNotEmpty) ...[
            const SizedBox(height: 10),
            Row(children: [
              Icon(Icons.people_outline,
                  size: 15, color: Colors.grey.shade500),
              const SizedBox(width: 6),
              Text(
                  '${caregivers.length} caregiver${caregivers.length > 1 ? 's' : ''} managing',
                  style:
                      TextStyle(fontSize: 12, color: Colors.grey.shade500)),
            ]),
          ],
        ],
      ),
    );
  }

  Widget _patientMenu(Map<String, dynamic> p, String name) {
    final active = _isTrue(p['is_active']);
    return PopupMenuButton<String>(
      icon: Icon(Icons.more_vert, color: Colors.grey.shade400),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
      onSelected: (v) {
        switch (v) {
          case 'view':
            _openPatientProfile(p);
            break;
          case 'toggle':
            _toggleStatus(p);
            break;
          case 'delete':
            _deletePatient(_toInt(p['id']), name);
            break;
        }
      },
      itemBuilder: (_) => [
        const PopupMenuItem(
            value: 'view',
            child: Row(children: [
              Icon(Icons.visibility_outlined, size: 18, color: kPrimaryBlue),
              SizedBox(width: 10),
              Text('View details'),
            ])),
        PopupMenuItem(
            value: 'toggle',
            child: Row(children: [
              Icon(active ? Icons.block : Icons.check_circle_outline,
                  size: 18, color: Colors.orange),
              const SizedBox(width: 10),
              Text(active ? 'Deactivate account' : 'Activate account'),
            ])),
        const PopupMenuItem(
            value: 'delete',
            child: Row(children: [
              Icon(Icons.delete_outline, size: 18, color: Colors.red),
              SizedBox(width: 10),
              Text('Delete patient', style: TextStyle(color: Colors.red)),
            ])),
      ],
    );
  }

  // ───────────────────────────────────────────────────────────────────────────
  //  TAB 2 — PATIENTS  (full management list, no stats)
  // ───────────────────────────────────────────────────────────────────────────
  Widget _buildPatientsTab() {
    final visible = _visiblePatients;
    return RefreshIndicator(
      onRefresh: _loadAdminData,
      color: kPrimaryBlue,
      child: CustomScrollView(
        slivers: [
          SliverToBoxAdapter(
            child: _gradientHeader(
              title: 'Patients',
              showRefresh: true,
              bottom: Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  _headerStat('${_toInt(_stats?["totalPatients"])}', 'Total'),
                  _headerDivider(),
                  _headerStat('${_toInt(_stats?["activePatients"])}', 'Active'),
                  _headerDivider(),
                  _headerStat(
                      '${_patients.where((p) => _toDouble(p["adherence_rate"]) < 50).length}',
                      'Low adh.'),
                ],
              ),
            ),
          ),
          ..._patientControlsAndList(visible),
          const SliverToBoxAdapter(child: SizedBox(height: 24)),
        ],
      ),
    );
  }

  // ───────────────────────────────────────────────────────────────────────────
  //  TAB 3 — CAREGIVERS
  // ───────────────────────────────────────────────────────────────────────────
  Widget _buildCaregiversTab() {
    final registered = _caregivers.length;
    final activeCount =
        _caregivers.where((c) => _toInt(c['patients_count']) > 0).length;
    final totalLinks = _caregivers.fold<int>(
        0, (sum, c) => sum + _toInt(c['patients_count']));
    final avg =
        registered > 0 ? (totalLinks / registered).toStringAsFixed(1) : '0.0';

    final q = _search.toLowerCase();
    final visible = _caregivers.where((c) {
      if (_search.isEmpty) return true;
      final n = (c['name'] ?? '').toString().toLowerCase();
      final e = (c['email'] ?? '').toString().toLowerCase();
      return n.contains(q) || e.contains(q);
    }).toList();

    return RefreshIndicator(
      onRefresh: _loadAdminData,
      color: kPrimaryBlue,
      child: CustomScrollView(
        slivers: [
          SliverToBoxAdapter(
            child: _gradientHeader(
              title: 'Caregivers',
              showRefresh: true,
              bottom: Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  _headerStat('$registered', 'Registered'),
                  _headerDivider(),
                  _headerStat('$activeCount', 'Active'),
                  _headerDivider(),
                  _headerStat(avg, 'Avg / caregiver'),
                ],
              ),
            ),
          ),
          SliverToBoxAdapter(child: _searchBarForCaregivers()),
          if (visible.isEmpty)
            SliverToBoxAdapter(child: _emptyState('No caregivers found'))
          else
            SliverPadding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              sliver: SliverList(
                delegate: SliverChildBuilderDelegate(
                  (context, i) => _caregiverCard(visible[i]),
                  childCount: visible.length,
                ),
              ),
            ),
          const SliverToBoxAdapter(child: SizedBox(height: 24)),
        ],
      ),
    );
  }

  Widget _searchBarForCaregivers() {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 12, 16, 4),
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
            BoxShadow(color: Colors.black.withOpacity(0.03), blurRadius: 5)
          ],
        ),
        child: TextField(
          onChanged: (v) => setState(() => _search = v.trim()),
          decoration: const InputDecoration(
            hintText: 'Search caregivers...',
            prefixIcon: Icon(Icons.search, color: Colors.grey),
            border: InputBorder.none,
            contentPadding:
                EdgeInsets.symmetric(horizontal: 16, vertical: 14),
          ),
        ),
      ),
    );
  }

  Widget _caregiverCard(Map<String, dynamic> c) {
    final name = c['name']?.toString() ?? 'Unknown';
    final email = c['email']?.toString() ?? '';
    final count = _toInt(c['patients_count']);
    final patients = (c['patients'] as List?) ?? [];

    return Container(
      margin: const EdgeInsets.only(top: 14),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
              color: Colors.black.withOpacity(0.04),
              blurRadius: 10,
              offset: const Offset(0, 4))
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              _avatar(name, 48, gradient: const [Color(0xFF1ABC9C), Color(0xFF16A085)]),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(name,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(
                            fontWeight: FontWeight.w800,
                            fontSize: 16,
                            color: kDarkText)),
                    const SizedBox(height: 2),
                    Text(email,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: TextStyle(
                            color: Colors.grey.shade500, fontSize: 12)),
                  ],
                ),
              ),
              PopupMenuButton<String>(
                icon: Icon(Icons.more_vert, color: Colors.grey.shade400),
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(14)),
                onSelected: (v) {
                  if (v == 'delete') _deleteCaregiver(_toInt(c['id']), name);
                },
                itemBuilder: (_) => const [
                  PopupMenuItem(
                      value: 'delete',
                      child: Row(children: [
                        Icon(Icons.delete_outline, size: 18, color: Colors.red),
                        SizedBox(width: 10),
                        Text('Delete caregiver',
                            style: TextStyle(color: Colors.red)),
                      ])),
                ],
              ),
            ],
          ),
          const SizedBox(height: 8),
          Row(children: [
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
              decoration: BoxDecoration(
                  color: const Color(0xFF1ABC9C).withOpacity(0.12),
                  borderRadius: BorderRadius.circular(8)),
              child: Text('$count',
                  style: const TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w800,
                      color: Color(0xFF16A085))),
            ),
            const SizedBox(width: 6),
            Text('patient${count == 1 ? '' : 's'} managed',
                style: TextStyle(fontSize: 12, color: Colors.grey.shade600)),
          ]),
          if (patients.isNotEmpty) ...[
            const SizedBox(height: 12),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: _caregiverPatientChips(patients),
            ),
          ],
        ],
      ),
    );
  }

  List<Widget> _caregiverPatientChips(List patients) {
    const maxShown = 3;
    final shown = patients.take(maxShown).toList();
    final extra = patients.length - shown.length;
    final chips = <Widget>[];
    for (final p in shown) {
      final n = (p is Map ? (p['name'] ?? p['email']) : p).toString();
      chips.add(_chip(n));
    }
    if (extra > 0) chips.add(_chip('+$extra more', muted: true));
    return chips;
  }

  Widget _chip(String text, {bool muted = false}) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: muted ? Colors.grey.shade100 : kBg,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.grey.shade200),
      ),
      child: Text(text,
          style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w500,
              color: muted ? Colors.grey.shade500 : Colors.grey.shade700)),
    );
  }

  // ───────────────────────────────────────────────────────────────────────────
  //  TAB 4 — PROFILE (admin's own account)
  // ───────────────────────────────────────────────────────────────────────────
  Widget _buildProfileTab() {
    return AdminProfileTab(
      userName: _userName,
      onOpenDrawer: () => _scaffoldKey.currentState?.openDrawer(),
      onLogout: _logout,
      onProfileUpdated: _loadUserData,
    );
  }

  // ── Shared small widgets ────────────────────────────────────────────────────
  Widget _headerStat(String value, String label) {
    return Column(children: [
      Text(value,
          style: const TextStyle(
              color: Colors.white,
              fontSize: 22,
              fontWeight: FontWeight.w900)),
      const SizedBox(height: 2),
      Text(label,
          style: const TextStyle(color: Colors.white70, fontSize: 11)),
    ]);
  }

  Widget _headerDivider() =>
      Container(width: 1, height: 30, color: Colors.white24);

  Widget _avatar(String name, double size, {List<Color>? gradient}) {
    final colors = gradient ?? [kPrimaryBlue, kPrimaryBlue.withOpacity(0.7)];
    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        gradient: LinearGradient(
            colors: colors,
            begin: Alignment.topLeft,
            end: Alignment.bottomRight),
        borderRadius: BorderRadius.circular(14),
      ),
      child: Center(
        child: Text(_initialsOf(name),
            style: TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.bold,
                fontSize: size * 0.36)),
      ),
    );
  }

  Widget _statusBadge(bool active) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
      decoration: BoxDecoration(
        color: (active ? Colors.green : Colors.red).withOpacity(0.12),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Text(active ? 'Active' : 'Inactive',
          style: TextStyle(
              color: active ? Colors.green : Colors.red,
              fontWeight: FontWeight.bold,
              fontSize: 11)),
    );
  }

  Widget _emptyState(String message) {
    return Padding(
      padding: const EdgeInsets.only(top: 60),
      child: Center(
        child: Column(children: [
          Icon(Icons.inbox_outlined, size: 72, color: Colors.grey.shade300),
          const SizedBox(height: 14),
          Text(message,
              style: TextStyle(color: Colors.grey.shade400, fontSize: 15)),
        ]),
      ),
    );
  }

  // ── Drawer (profile + logout) ────────────────────────────────────────────────
  Widget _buildDrawer() {
    return Drawer(
      shape: const RoundedRectangleBorder(
          borderRadius: BorderRadius.only(
              topRight: Radius.circular(28),
              bottomRight: Radius.circular(28))),
      child: Column(children: [
        Container(
          width: double.infinity,
          padding: const EdgeInsets.fromLTRB(20, 52, 20, 28),
          decoration: const BoxDecoration(
            gradient: LinearGradient(
                colors: [kBlueTop, kPrimaryBlue],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight),
          ),
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Container(
              width: 60,
              height: 60,
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(18),
                boxShadow: [
                  BoxShadow(
                      color: Colors.black.withOpacity(0.15), blurRadius: 10)
                ],
              ),
              child: Center(
                  child: Text(_initialsOf(_userName, fallback: 'A'),
                      style: const TextStyle(
                          fontSize: 22,
                          fontWeight: FontWeight.bold,
                          color: kPrimaryBlue))),
            ),
            const SizedBox(height: 14),
            Text(_userName,
                style: const TextStyle(
                    color: Colors.white,
                    fontSize: 18,
                    fontWeight: FontWeight.w800)),
            const SizedBox(height: 4),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
              decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.18),
                  borderRadius: BorderRadius.circular(20)),
              child: const Text('Administrator',
                  style: TextStyle(
                      color: Colors.white,
                      fontSize: 11,
                      fontWeight: FontWeight.w600,
                      letterSpacing: 0.5)),
            ),
          ]),
        ),
        const SizedBox(height: 8),
        _drawerItem(Icons.dashboard, 'Dashboard', false, () {
          Navigator.pop(context);
          setState(() => _currentTab = 0);
        }),
        _drawerItem(Icons.people_alt_rounded, 'Patients', false, () {
          Navigator.pop(context);
          setState(() => _currentTab = 1);
        }),
        _drawerItem(Icons.groups_rounded, 'Caregivers', false, () {
          Navigator.pop(context);
          setState(() => _currentTab = 2);
        }),
        _drawerItem(Icons.person_outline, 'My Profile', false, () {
          Navigator.pop(context);
          setState(() => _currentTab = 3);
        }),
        const Spacer(),
        const Padding(
          padding: EdgeInsets.symmetric(horizontal: 20, vertical: 8),
          child: Divider(height: 1),
        ),
        _drawerItem(Icons.logout, 'Logout', true, _logout),
        const SizedBox(height: 20),
      ]),
    );
  }

  Widget _drawerItem(
      IconData icon, String title, bool isRed, VoidCallback onTap) {
    final color = isRed ? Colors.red : kDarkText;
    return ListTile(
      leading: Container(
        width: 36,
        height: 36,
        decoration: BoxDecoration(
          color: isRed
              ? Colors.red.withOpacity(0.08)
              : kPrimaryBlue.withOpacity(0.08),
          borderRadius: BorderRadius.circular(10),
        ),
        child: Icon(icon, size: 18, color: isRed ? Colors.red : kPrimaryBlue),
      ),
      title: Text(title,
          style: TextStyle(
              fontSize: 14, fontWeight: FontWeight.w600, color: color)),
      onTap: onTap,
      contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 2),
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
//  Patient profile page  (mockup #2)  — calls /admin/patients/:id
// ─────────────────────────────────────────────────────────────────────────────
class AdminPatientProfilePage extends StatefulWidget {
  final int patientId;
  final String patientName;
  const AdminPatientProfilePage(
      {super.key, required this.patientId, required this.patientName});

  @override
  State<AdminPatientProfilePage> createState() =>
      _AdminPatientProfilePageState();
}

class _AdminPatientProfilePageState extends State<AdminPatientProfilePage> {
  bool _loading = true;
  bool _changed = false; // signals list to refresh on pop
  Map<String, dynamic>? _patient;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    setState(() => _loading = true);
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('auth_token');
    try {
      final res = await http.get(
        Uri.parse('${ApiConfig.baseUrl}/admin/patients/${widget.patientId}'),
        headers: ApiConfig.getAuthHeaders(token ?? ''),
      );
      if (res.statusCode == 200) {
        final data = jsonDecode(res.body);
        if (mounted) setState(() {
          _patient = data['patient'];
          _loading = false;
        });
      } else {
        if (mounted) setState(() => _loading = false);
      }
    } catch (_) {
      if (mounted) setState(() => _loading = false);
    }
  }

  Future<void> _toggleActive(bool value) async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('auth_token');
    try {
      final res = await http.put(
        Uri.parse(
            '${ApiConfig.baseUrl}/admin/patients/${widget.patientId}/toggle-status'),
        headers: ApiConfig.getAuthHeaders(token ?? ''),
        body: jsonEncode({'is_active': value}),
      );
      if (res.statusCode == 200) {
        setState(() {
          _patient?['is_active'] = value ? 1 : 0;
          _changed = true;
        });
      }
    } catch (_) {/* ignore */}
  }

  Future<void> _delete() async {
    final confirm = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: const Text('Delete patient',
            style: TextStyle(color: Colors.red)),
        content: Text('Delete "${widget.patientName}" permanently?'),
        actions: [
          TextButton(
              onPressed: () => Navigator.pop(ctx, false),
              child: const Text('Cancel')),
          ElevatedButton(
              onPressed: () => Navigator.pop(ctx, true),
              style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.red, foregroundColor: Colors.white),
              child: const Text('Delete')),
        ],
      ),
    );
    if (confirm != true) return;

    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('auth_token');
    try {
      final res = await http.delete(
        Uri.parse('${ApiConfig.baseUrl}/admin/patients/${widget.patientId}'),
        headers: ApiConfig.getAuthHeaders(token ?? ''),
      );
      if (res.statusCode == 200 && mounted) {
        Navigator.pop(context, true); // tell list to refresh
      }
    } catch (_) {/* ignore */}
  }

  @override
  Widget build(BuildContext context) {
    final p = _patient;
    final active = _isTrue(p?['is_active']);
    final adh = _toDouble(p?['adherence_rate']);
    final prevMonth = p?['previous_month_adherence']; // optional
    final daily = (p?['daily_adherence'] as List?) ?? const []; // optional
    final treatments = (p?['treatments'] as List?) ?? const [];
    final age = p?['age'] != null ? _toInt(p?['age']) : _ageFromDob(p?['date_of_birth']);

    return WillPopScope(
      onWillPop: () async {
        Navigator.pop(context, _changed);
        return false;
      },
      child: Scaffold(
        backgroundColor: kBg,
        body: _loading
            ? const Center(child: CircularProgressIndicator(color: kPrimaryBlue))
            : p == null
                ? const Center(child: Text('Patient not found'))
                : SafeArea(
                    bottom: false,
                    child: SingleChildScrollView(
                      child: Column(
                        children: [
                          _profileHeader(p),
                          Padding(
                            padding: const EdgeInsets.all(16),
                            child: Column(
                              children: [
                                _accountToggleCard(active),
                                const SizedBox(height: 14),
                                _infoGrid(age, p),
                                const SizedBox(height: 14),
                                _adherenceCard(adh, prevMonth, daily),
                                const SizedBox(height: 18),
                                _treatmentsSection(treatments),
                                const SizedBox(height: 24),
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

  Widget _profileHeader(Map<String, dynamic> p) {
    final name = p['name']?.toString() ?? 'Patient';
    final email = p['email']?.toString() ?? '';
    final phone = p['phone']?.toString() ?? '';
    return Container(
      width: double.infinity,
      decoration: const BoxDecoration(
        gradient: LinearGradient(
            colors: [kBlueTop, kPrimaryBlue],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight),
        borderRadius: BorderRadius.only(
            bottomLeft: Radius.circular(30),
            bottomRight: Radius.circular(30)),
      ),
      padding: const EdgeInsets.fromLTRB(16, 14, 16, 26),
      child: Column(
        children: [
          Row(
            children: [
              InkWell(
                borderRadius: BorderRadius.circular(10),
                onTap: () => Navigator.pop(context, _changed),
                child: Container(
                  width: 36,
                  height: 36,
                  decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.18),
                      borderRadius: BorderRadius.circular(10)),
                  child: const Icon(Icons.arrow_back_ios_new_rounded,
                      color: Colors.white, size: 16),
                ),
              ),
              const Expanded(
                child: Text('Patient Profile',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                        color: Colors.white,
                        fontSize: 18,
                        fontWeight: FontWeight.w800)),
              ),
              PopupMenuButton<String>(
                icon: Container(
                  width: 36,
                  height: 36,
                  decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.18),
                      borderRadius: BorderRadius.circular(10)),
                  child: const Icon(Icons.more_vert,
                      color: Colors.white, size: 18),
                ),
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(14)),
                onSelected: (v) {
                  if (v == 'delete') _delete();
                },
                itemBuilder: (_) => const [
                  PopupMenuItem(
                      value: 'delete',
                      child: Row(children: [
                        Icon(Icons.delete_outline,
                            size: 18, color: Colors.red),
                        SizedBox(width: 10),
                        Text('Delete patient',
                            style: TextStyle(color: Colors.red)),
                      ])),
                ],
              ),
            ],
          ),
          const SizedBox(height: 8),
          Container(
            width: 76,
            height: 76,
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(22),
              boxShadow: [
                BoxShadow(color: Colors.black.withOpacity(0.15), blurRadius: 12)
              ],
            ),
            child: Center(
              child: Text(_initialsOf(name),
                  style: const TextStyle(
                      fontSize: 28,
                      fontWeight: FontWeight.bold,
                      color: kPrimaryBlue)),
            ),
          ),
          const SizedBox(height: 12),
          Text(name,
              style: const TextStyle(
                  color: Colors.white,
                  fontSize: 22,
                  fontWeight: FontWeight.w900)),
          const SizedBox(height: 4),
          if (email.isNotEmpty)
            Text(email,
                style: const TextStyle(color: Colors.white70, fontSize: 13)),
          if (phone.isNotEmpty)
            Text(phone,
                style: const TextStyle(color: Colors.white70, fontSize: 13)),
        ],
      ),
    );
  }

  Widget _accountToggleCard(bool active) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        boxShadow: [
          BoxShadow(color: Colors.black.withOpacity(0.04), blurRadius: 10)
        ],
      ),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(active ? 'Account active' : 'Account inactive',
                    style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w800,
                        color: kDarkText)),
                const SizedBox(height: 2),
                Text('Can sign in & receive reminders',
                    style:
                        TextStyle(fontSize: 12, color: Colors.grey.shade500)),
              ],
            ),
          ),
          Switch(
            value: active,
            activeColor: Colors.green,
            onChanged: _toggleActive,
          ),
        ],
      ),
    );
  }

  Widget _infoGrid(int? age, Map<String, dynamic> p) {
    return IntrinsicHeight(
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Expanded(
            child: Column(children: [
              Expanded(child: _infoCard('AGE', age != null ? '$age yrs' : '—')),
              const SizedBox(height: 12),
              Expanded(
                child: _infoCard('CHIFA N°',
                    p['chifa_card_registration_number']?.toString() ?? '—'),
              ),
            ]),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(children: [
              Expanded(child: _infoCard('JOINED', _monthYear(p['created_at']))),
              const SizedBox(height: 12),
              Expanded(
                child: _infoCard('PHONE SKILL',
                    _capitalize(p['smartphone_skill_level']?.toString() ?? '—')),
              ),
            ]),
          ),
        ],
      ),
    );
  }

  String _capitalize(String s) =>
      s.isEmpty ? s : '${s[0].toUpperCase()}${s.substring(1).toLowerCase()}';

  Widget _infoCard(String label, String value) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(color: Colors.black.withOpacity(0.03), blurRadius: 8)
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label,
              style: TextStyle(
                  fontSize: 10,
                  fontWeight: FontWeight.w700,
                  letterSpacing: 0.5,
                  color: Colors.grey.shade400)),
          const SizedBox(height: 6),
          Text(value,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: const TextStyle(
                  fontSize: 17,
                  fontWeight: FontWeight.w800,
                  color: kDarkText)),
        ],
      ),
    );
  }

  Widget _adherenceCard(double adh, dynamic prevMonth, List daily) {
    final series = daily
        .map((e) => e is Map ? _toDouble(e['rate']) : _toDouble(e))
        .toList()
        .cast<double>();

    String? deltaText;
    Color deltaColor = Colors.green;
    if (prevMonth != null) {
      final prev = _toDouble(prevMonth);
      final diff = adh - prev;
      if (diff >= 0) {
        deltaText = 'up from ${prev.toStringAsFixed(0)}% last month';
        deltaColor = Colors.green;
      } else {
        deltaText = 'down from ${prev.toStringAsFixed(0)}% last month';
        deltaColor = Colors.red;
      }
    }

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        boxShadow: [
          BoxShadow(color: Colors.black.withOpacity(0.04), blurRadius: 10)
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text('30-day adherence',
                  style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w700,
                      color: kDarkText)),
              Text('${adh.toStringAsFixed(0)}%',
                  style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.w900,
                      color: _adherenceColor(adh))),
            ],
          ),
          const SizedBox(height: 14),
          if (series.isNotEmpty)
            _AdherenceBarChart(values: series)
          else
            // graceful fallback until the backend returns a daily series
            ClipRRect(
              borderRadius: BorderRadius.circular(8),
              child: LinearProgressIndicator(
                value: (adh / 100).clamp(0.0, 1.0),
                minHeight: 10,
                backgroundColor: _adherenceColor(adh).withOpacity(0.12),
                valueColor: AlwaysStoppedAnimation(_adherenceColor(adh)),
              ),
            ),
          if (deltaText != null) ...[
            const SizedBox(height: 12),
            Row(children: [
              Icon(deltaColor == Colors.green
                  ? Icons.trending_up
                  : Icons.trending_down,
                  size: 16, color: deltaColor),
              const SizedBox(width: 6),
              Text(deltaText,
                  style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      color: deltaColor)),
            ]),
          ],
        ],
      ),
    );
  }

  Widget _treatmentsSection(List treatments) {
    final active = treatments.where((t) => _isTrue(t['is_active'])).toList();
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(children: [
          const Text('Active treatments',
              style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w800,
                  color: kDarkText)),
          const SizedBox(width: 8),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
            decoration: BoxDecoration(
                color: kPrimaryBlue.withOpacity(0.12),
                borderRadius: BorderRadius.circular(8)),
            child: Text('${active.length}',
                style: const TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w800,
                    color: kPrimaryBlue)),
          ),
        ]),
        const SizedBox(height: 12),
        if (active.isEmpty)
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 20),
            child: Center(
                child: Text('No active treatments',
                    style: TextStyle(color: Colors.grey.shade400))),
          )
        else
          ...active.map((t) => _treatmentTile(t)),
      ],
    );
  }

  Widget _treatmentTile(dynamic t) {
    final name = t['medication_name']?.toString() ?? 'Medication';
    final dosage = t['dosage']?.toString() ?? '';
    final freq = t['frequency']?.toString() ?? '';
    final priority = (t['priority']?.toString() ?? 'MEDIUM').toUpperCase();

    Color pColor;
    switch (priority) {
      case 'HIGH':
        pColor = Colors.red;
        break;
      case 'LOW':
        pColor = Colors.green;
        break;
      default:
        pColor = Colors.orange;
    }

    final subtitle = [dosage, freq].where((e) => e.isNotEmpty).join(' · ');

    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(color: Colors.black.withOpacity(0.03), blurRadius: 8)
        ],
      ),
      child: Row(children: [
        Container(
          width: 40,
          height: 40,
          decoration: BoxDecoration(
              color: kPrimaryBlue.withOpacity(0.1),
              borderRadius: BorderRadius.circular(12)),
          child: const Center(
              child: Text('Rx',
                  style: TextStyle(
                      fontWeight: FontWeight.w800, color: kPrimaryBlue))),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(name,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                      fontSize: 15,
                      fontWeight: FontWeight.w700,
                      color: kDarkText)),
              if (subtitle.isNotEmpty) ...[
                const SizedBox(height: 2),
                Text(subtitle,
                    style:
                        TextStyle(fontSize: 12, color: Colors.grey.shade500)),
              ],
            ],
          ),
        ),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
          decoration: BoxDecoration(
              color: pColor.withOpacity(0.12),
              borderRadius: BorderRadius.circular(20)),
          child: Text(_capitalize(priority),
              style: TextStyle(
                  color: pColor, fontWeight: FontWeight.w700, fontSize: 11)),
        ),
      ]),
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
//  Tiny dependency-free bar chart for daily adherence (values 0..100)
// ─────────────────────────────────────────────────────────────────────────────
class _AdherenceBarChart extends StatelessWidget {
  final List<double> values;
  const _AdherenceBarChart({required this.values});

  @override
  Widget build(BuildContext context) {
    if (values.isEmpty) return const SizedBox.shrink();
    const maxH = 64.0;
    return SizedBox(
      height: maxH,
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.end,
        children: values.map((v) {
          final h = (v / 100.0).clamp(0.06, 1.0) * maxH;
          return Expanded(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 1.5),
              child: Container(
                height: h,
                decoration: BoxDecoration(
                  color: _adherenceColor(v),
                  borderRadius: BorderRadius.circular(3),
                ),
              ),
            ),
          );
        }).toList(),
      ),
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
//  Admin profile tab  (account info + edit + change password)
//  Uses /profile/me, /profile/update, /profile/password
// ─────────────────────────────────────────────────────────────────────────────
class AdminProfileTab extends StatefulWidget {
  final String userName;
  final VoidCallback onOpenDrawer;
  final VoidCallback onLogout;
  final VoidCallback onProfileUpdated;

  const AdminProfileTab({
    super.key,
    required this.userName,
    required this.onOpenDrawer,
    required this.onLogout,
    required this.onProfileUpdated,
  });

  @override
  State<AdminProfileTab> createState() => _AdminProfileTabState();
}

class _AdminProfileTabState extends State<AdminProfileTab> {
  final _nameCtrl = TextEditingController();
  final _phoneCtrl = TextEditingController();
  final _currentPwCtrl = TextEditingController();
  final _newPwCtrl = TextEditingController();
  final _confirmPwCtrl = TextEditingController();

  String _email = '';
  bool _loading = true;
  bool _savingProfile = false;
  bool _savingPassword = false;

  bool _editing = false;
  String _origName = '';
  String _origPhone = '';

  bool _obscureCurrent = true;
  bool _obscureNew = true;
  bool _obscureConfirm = true;

  @override
  void initState() {
    super.initState();
    _loadProfile();
  }

  @override
  void dispose() {
    _nameCtrl.dispose();
    _phoneCtrl.dispose();
    _currentPwCtrl.dispose();
    _newPwCtrl.dispose();
    _confirmPwCtrl.dispose();
    super.dispose();
  }

  Future<void> _loadProfile() async {
    setState(() => _loading = true);
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('auth_token');

    // Sensible fallbacks from local storage first
    _nameCtrl.text = prefs.getString('user_name') ?? widget.userName;
    _email = prefs.getString('user_email') ?? '';
    _phoneCtrl.text = prefs.getString('user_phone') ?? '';

    try {
      final res = await http.get(
        Uri.parse('${ApiConfig.baseUrl}/profile/me'),
        headers: ApiConfig.getAuthHeaders(token ?? ''),
      );
      if (res.statusCode == 200) {
        final body = jsonDecode(res.body);
        // Accept a few common shapes: {user:{...}} / {profile:{...}} / {...}
        final Map<String, dynamic> u =
            (body['user'] ?? body['profile'] ?? body) as Map<String, dynamic>;
        if (u['name'] != null) _nameCtrl.text = u['name'].toString();
        if (u['email'] != null) _email = u['email'].toString();
        if (u['phone'] != null) _phoneCtrl.text = u['phone'].toString();
      }
    } catch (_) {
      // keep local fallbacks silently
    }

    if (mounted) setState(() => _loading = false);
  }

  void _snack(String msg, Color color) {
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(msg), backgroundColor: color),
    );
  }

  void _enterEdit() {
    _origName = _nameCtrl.text;
    _origPhone = _phoneCtrl.text;
    setState(() => _editing = true);
  }

  void _cancelEdit() {
    _nameCtrl.text = _origName;
    _phoneCtrl.text = _origPhone;
    setState(() => _editing = false);
  }

  Future<void> _saveProfile() async {
    final name = _nameCtrl.text.trim();
    if (name.isEmpty) {
      _snack('Name cannot be empty', Colors.red);
      return;
    }
    setState(() => _savingProfile = true);
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('auth_token');
    try {
      final res = await http.put(
        Uri.parse('${ApiConfig.baseUrl}/profile/update'),
        headers: ApiConfig.getAuthHeaders(token ?? ''),
        body: jsonEncode({'name': name, 'phone': _phoneCtrl.text.trim()}),
      );
      final body = _safeJson(res.body);
      if (res.statusCode == 200) {
        await prefs.setString('user_name', name);
        await prefs.setString('user_phone', _phoneCtrl.text.trim());
        widget.onProfileUpdated();
        if (mounted) setState(() => _editing = false);
        _snack(body?['message']?.toString() ?? 'Profile updated', Colors.green);
      } else {
        _snack(body?['message']?.toString() ?? 'Failed to update profile',
            Colors.red);
      }
    } catch (_) {
      _snack('Connection error', Colors.red);
    } finally {
      if (mounted) setState(() => _savingProfile = false);
    }
  }

  Future<void> _changePassword() async {
    final current = _currentPwCtrl.text;
    final next = _newPwCtrl.text;
    final confirm = _confirmPwCtrl.text;

    if (current.isEmpty || next.isEmpty) {
      _snack('Please fill in all password fields', Colors.red);
      return;
    }
    if (next.length < 6) {
      _snack('New password must be at least 6 characters', Colors.red);
      return;
    }
    if (next != confirm) {
      _snack('New passwords do not match', Colors.red);
      return;
    }

    setState(() => _savingPassword = true);
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('auth_token');
    try {
      final res = await http.put(
        Uri.parse('${ApiConfig.baseUrl}/profile/password'),
        headers: ApiConfig.getAuthHeaders(token ?? ''),
        body: jsonEncode({
          'currentPassword': current,
          'newPassword': next,
        }),
      );
      final body = _safeJson(res.body);
      if (res.statusCode == 200) {
        _currentPwCtrl.clear();
        _newPwCtrl.clear();
        _confirmPwCtrl.clear();
        _snack(body?['message']?.toString() ?? 'Password updated',
            Colors.green);
      } else {
        _snack(body?['message']?.toString() ?? 'Failed to update password',
            Colors.red);
      }
    } catch (_) {
      _snack('Connection error', Colors.red);
    } finally {
      if (mounted) setState(() => _savingPassword = false);
    }
  }

  Map<String, dynamic>? _safeJson(String s) {
    try {
      final v = jsonDecode(s);
      return v is Map<String, dynamic> ? v : null;
    } catch (_) {
      return null;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: kBg,
      body: _loading
          ? const Center(child: CircularProgressIndicator(color: kPrimaryBlue))
          : SingleChildScrollView(
              child: Column(
                children: [
                  _header(),
                  Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      children: [
                        _editProfileCard(),
                        const SizedBox(height: 16),
                        _changePasswordCard(),
                        const SizedBox(height: 16),
                        _logoutButton(),
                        const SizedBox(height: 24),
                      ],
                    ),
                  ),
                ],
              ),
            ),
    );
  }

  Widget _header() {
    final name = _nameCtrl.text.isEmpty ? widget.userName : _nameCtrl.text;
    return Container(
      width: double.infinity,
      decoration: const BoxDecoration(
        gradient: LinearGradient(
            colors: [kBlueTop, kPrimaryBlue],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight),
        borderRadius: BorderRadius.only(
            bottomLeft: Radius.circular(30),
            bottomRight: Radius.circular(30)),
      ),
      padding: const EdgeInsets.fromLTRB(16, 14, 16, 26),
      child: Column(
        children: [
          Row(
            children: [
              InkWell(
                borderRadius: BorderRadius.circular(10),
                onTap: widget.onOpenDrawer,
                child: Container(
                  width: 36,
                  height: 36,
                  decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.18),
                      borderRadius: BorderRadius.circular(10)),
                  child: const Icon(Icons.menu_rounded,
                      color: Colors.white, size: 18),
                ),
              ),
              const Expanded(
                child: Text('My Profile',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                        color: Colors.white,
                        fontSize: 18,
                        fontWeight: FontWeight.w800)),
              ),
              InkWell(
                borderRadius: BorderRadius.circular(10),
                onTap: _editing ? _cancelEdit : _enterEdit,
                child: Container(
                  width: 36,
                  height: 36,
                  decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.18),
                      borderRadius: BorderRadius.circular(10)),
                  child: Icon(
                      _editing ? Icons.close_rounded : Icons.edit_outlined,
                      color: Colors.white,
                      size: 18),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Container(
            width: 76,
            height: 76,
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(22),
              boxShadow: [
                BoxShadow(color: Colors.black.withOpacity(0.15), blurRadius: 12)
              ],
            ),
            child: Center(
              child: Text(_initialsOf(name, fallback: 'A'),
                  style: const TextStyle(
                      fontSize: 28,
                      fontWeight: FontWeight.bold,
                      color: kPrimaryBlue)),
            ),
          ),
          const SizedBox(height: 12),
          Text(name,
              style: const TextStyle(
                  color: Colors.white,
                  fontSize: 22,
                  fontWeight: FontWeight.w900)),
          if (_email.isNotEmpty) ...[
            const SizedBox(height: 4),
            Text(_email,
                style: const TextStyle(color: Colors.white70, fontSize: 13)),
          ],
          const SizedBox(height: 8),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 5),
            decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.18),
                borderRadius: BorderRadius.circular(20)),
            child: const Text('ADMIN',
                style: TextStyle(
                    color: Colors.white,
                    fontSize: 11,
                    fontWeight: FontWeight.w700,
                    letterSpacing: 0.8)),
          ),
        ],
      ),
    );
  }

  Widget _sectionCard({required String title, required IconData icon, required List<Widget> children}) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(color: Colors.black.withOpacity(0.04), blurRadius: 10)
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(children: [
            Container(
              width: 36,
              height: 36,
              decoration: BoxDecoration(
                  color: kPrimaryBlue.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(10)),
              child: Icon(icon, color: kPrimaryBlue, size: 18),
            ),
            const SizedBox(width: 12),
            Text(title,
                style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w800,
                    color: kDarkText)),
          ]),
          const SizedBox(height: 16),
          ...children,
        ],
      ),
    );
  }

  Widget _label(String text) => Padding(
        padding: const EdgeInsets.only(bottom: 6, top: 4),
        child: Text(text,
            style: TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w600,
                color: Colors.grey.shade600)),
      );

  Widget _field(TextEditingController c,
      {String? hint,
      bool obscure = false,
      Widget? suffix,
      TextInputType? type}) {
    return TextField(
      controller: c,
      obscureText: obscure,
      keyboardType: type,
      decoration: InputDecoration(
        hintText: hint,
        filled: true,
        fillColor: kBg,
        suffixIcon: suffix,
        contentPadding:
            const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
        border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(14),
            borderSide: BorderSide.none),
        enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(14),
            borderSide: BorderSide(color: Colors.grey.shade200)),
        focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(14),
            borderSide: const BorderSide(color: kPrimaryBlue, width: 1.4)),
      ),
    );
  }

  Widget _editProfileCard() {
    return _sectionCard(
      title: _editing ? 'Edit profile' : 'Profile information',
      icon: Icons.badge_outlined,
      children: _editing
          ? [
              _label('Full name'),
              _field(_nameCtrl, hint: 'Your name'),
              _label('Phone'),
              _field(_phoneCtrl,
                  hint: 'Phone number', type: TextInputType.phone),
              if (_email.isNotEmpty) ...[
                _label('Email'),
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.symmetric(
                      horizontal: 14, vertical: 14),
                  decoration: BoxDecoration(
                    color: kBg,
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(color: Colors.grey.shade200),
                  ),
                  child: Row(children: [
                    Expanded(
                        child: Text(_email,
                            style: TextStyle(color: Colors.grey.shade600))),
                    Icon(Icons.lock_outline,
                        size: 16, color: Colors.grey.shade400),
                  ]),
                ),
              ],
              const SizedBox(height: 16),
              Row(children: [
                Expanded(
                  child: OutlinedButton(
                    onPressed: _savingProfile ? null : _cancelEdit,
                    style: OutlinedButton.styleFrom(
                      foregroundColor: Colors.grey.shade700,
                      side: BorderSide(color: Colors.grey.shade300),
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(14)),
                    ),
                    child: const Text('Cancel'),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _primaryButton(
                    label: 'Save',
                    loading: _savingProfile,
                    onTap: _saveProfile,
                  ),
                ),
              ]),
            ]
          : [
              _staticRow(Icons.person_outline, 'Full name',
                  _nameCtrl.text.isEmpty ? '—' : _nameCtrl.text),
              const SizedBox(height: 10),
              _staticRow(Icons.phone_outlined, 'Phone',
                  _phoneCtrl.text.isEmpty ? 'Not set' : _phoneCtrl.text),
              if (_email.isNotEmpty) ...[
                const SizedBox(height: 10),
                _staticRow(Icons.email_outlined, 'Email', _email),
              ],
            ],
    );
  }

  Widget _staticRow(IconData icon, String label, String value) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        Container(
          width: 38,
          height: 38,
          decoration: BoxDecoration(
              color: kBg, borderRadius: BorderRadius.circular(10)),
          child: Icon(icon, size: 18, color: Colors.grey.shade500),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(label,
                  style: TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.w600,
                      color: Colors.grey.shade500)),
              const SizedBox(height: 2),
              Text(value,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                      fontSize: 15,
                      fontWeight: FontWeight.w700,
                      color: kDarkText)),
            ],
          ),
        ),
      ],
    );
  }

  Widget _changePasswordCard() {
    return _sectionCard(
      title: 'Change password',
      icon: Icons.lock_outline,
      children: [
        _label('Current password'),
        _field(_currentPwCtrl,
            hint: 'Enter current password',
            obscure: _obscureCurrent,
            suffix: _eyeButton(_obscureCurrent,
                () => setState(() => _obscureCurrent = !_obscureCurrent))),
        _label('New password'),
        _field(_newPwCtrl,
            hint: 'At least 6 characters',
            obscure: _obscureNew,
            suffix: _eyeButton(_obscureNew,
                () => setState(() => _obscureNew = !_obscureNew))),
        _label('Confirm new password'),
        _field(_confirmPwCtrl,
            hint: 'Re-enter new password',
            obscure: _obscureConfirm,
            suffix: _eyeButton(_obscureConfirm,
                () => setState(() => _obscureConfirm = !_obscureConfirm))),
        const SizedBox(height: 16),
        _primaryButton(
          label: 'Update password',
          loading: _savingPassword,
          onTap: _changePassword,
        ),
      ],
    );
  }

  Widget _eyeButton(bool obscured, VoidCallback onTap) {
    return IconButton(
      icon: Icon(obscured ? Icons.visibility_off : Icons.visibility,
          size: 20, color: Colors.grey.shade500),
      onPressed: onTap,
    );
  }

  Widget _primaryButton(
      {required String label,
      required bool loading,
      required VoidCallback onTap}) {
    return SizedBox(
      width: double.infinity,
      height: 50,
      child: ElevatedButton(
        onPressed: loading ? null : onTap,
        style: ElevatedButton.styleFrom(
          backgroundColor: kPrimaryBlue,
          foregroundColor: Colors.white,
          elevation: 0,
          shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(14)),
        ),
        child: loading
            ? const SizedBox(
                width: 22,
                height: 22,
                child: CircularProgressIndicator(
                    strokeWidth: 2, color: Colors.white))
            : Text(label,
                style: const TextStyle(
                    fontSize: 15, fontWeight: FontWeight.w700)),
      ),
    );
  }

  Widget _logoutButton() {
    return SizedBox(
      width: double.infinity,
      height: 50,
      child: OutlinedButton.icon(
        onPressed: widget.onLogout,
        icon: const Icon(Icons.logout, size: 18),
        label: const Text('Logout'),
        style: OutlinedButton.styleFrom(
          foregroundColor: Colors.red,
          side: BorderSide(color: Colors.red.shade200),
          shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(14)),
        ),
      ),
    );
  }
}