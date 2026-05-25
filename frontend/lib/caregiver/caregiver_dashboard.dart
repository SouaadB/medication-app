import 'dart:async';
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'package:url_launcher/url_launcher.dart';
import '../config/api_config.dart';
import 'caregiver_login_page.dart';
import 'caregiver_profile_page.dart';
import 'caregiver_notifications_page.dart';

// ─────────────────────────────────────────────────────────────────────────────
// CAREGIVER DASHBOARD
// ─────────────────────────────────────────────────────────────────────────────

class CaregiverDashboard extends StatefulWidget {
  const CaregiverDashboard({super.key});
  @override
  State<CaregiverDashboard> createState() => _CaregiverDashboardState();
}

class _CaregiverDashboardState extends State<CaregiverDashboard> {
  List<Map<String, dynamic>> _patients         = [];
  List<Map<String, dynamic>> _filteredPatients = [];
  bool    _isLoading        = true;
  bool    _hasError         = false;
  String? _userName;
  Timer?  _refreshTimer;
  int     _unreadNotifCount = 0;

  final TextEditingController _searchController = TextEditingController();

  // richer green palette
  static const Color primary   = Color(0xFF16A34A);
  static const Color primaryDk = Color(0xFF14532D);
  static const Color primaryLt = Color(0xFF4ADE80);
  static const Color bg        = Color(0xFFF0FDF4);

  @override
  void initState() {
    super.initState();
    _loadUserName();
    _fetchPatients();
    _loadUnreadCount();
    _refreshTimer = Timer.periodic(const Duration(seconds: 30), (_) {
      _fetchPatients(silent: true);
      _loadUnreadCount();
    });
  }

  @override
  void dispose() {
    _refreshTimer?.cancel();
    _searchController.dispose();
    super.dispose();
  }

  Future<void> _loadUserName() async {
    final prefs = await SharedPreferences.getInstance();
    if (mounted) setState(() => _userName = prefs.getString('user_name') ?? 'Caregiver');
  }

  Future<void> _fetchPatients({bool silent = false}) async {
    if (!silent && mounted) setState(() { _isLoading = true; _hasError = false; });
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');
      if (token == null) { setState(() => _isLoading = false); return; }

      final resp = await http.get(
        Uri.parse('${ApiConfig.baseUrl}/caregivers/patients'),
        headers: {'Authorization': 'Bearer $token', 'Content-Type': 'application/json'},
      ).timeout(const Duration(seconds: 15));

      if (resp.statusCode == 200) {
        final data     = jsonDecode(resp.body);
        final patients = List<Map<String, dynamic>>.from(data['patients'] ?? []);
        if (mounted) setState(() {
          _patients         = patients;
          _filteredPatients = _applySearch(_searchController.text, patients);
          _isLoading        = false;
          _hasError         = false;
        });
      } else {
        if (mounted) setState(() { _isLoading = false; _hasError = true; });
      }
    } catch (e) {
      debugPrint('fetchPatients error: $e');
      if (mounted) setState(() { _isLoading = false; _hasError = !silent; });
    }
  }

  Future<void> _loadUnreadCount() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');
      if (token == null) return;
      final resp = await http.get(
        Uri.parse('${ApiConfig.baseUrl}/caregivers/notifications/count'),
        headers: {'Authorization': 'Bearer $token', 'Content-Type': 'application/json'},
      );
      if (resp.statusCode == 200) {
        final data = jsonDecode(resp.body);
        if (mounted) setState(() => _unreadNotifCount = data['count'] ?? 0);
      }
    } catch (_) {}
  }

  List<Map<String, dynamic>> _applySearch(String q, List<Map<String, dynamic>> list) {
    if (q.trim().isEmpty) return list;
    return list.where((p) => (p['name'] ?? '').toString().toLowerCase().contains(q.toLowerCase())).toList();
  }

  void _onSearch(String q) => setState(() => _filteredPatients = _applySearch(q, _patients));

  Future<void> _logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.clear();
    if (mounted) Navigator.pushReplacement(context,
        MaterialPageRoute(builder: (_) => const CaregiverLoginPage()));
  }

  // ── status ─────────────────────────────────────────────────────────────────
  String _status(Map<String, dynamic> p) {
    final a = (p['adherence_rate'] ?? 0) as num;
    final m = (p['missed_doses']   ?? 0) as num;
    if (a >= 80 && m <= 2) return 'good';
    if (a >= 60 && m <= 5) return 'warning';
    return 'critical';
  }

  Color _statusColor(String s) {
    switch (s) {
      case 'good':    return const Color(0xFF16A34A);
      case 'warning': return const Color(0xFFD97706);
      default:        return const Color(0xFFDC2626);
    }
  }

  Color _statusBg(String s) {
    switch (s) {
      case 'good':    return const Color(0xFFDCFCE7);
      case 'warning': return const Color(0xFFFEF3C7);
      default:        return const Color(0xFFFEE2E2);
    }
  }

  String _statusLabel(String s) {
    switch (s) {
      case 'good':    return 'On Track';
      case 'warning': return 'Attention';
      default:        return 'Critical';
    }
  }

  IconData _statusIcon(String s) {
    switch (s) {
      case 'good':    return Icons.check_circle_outline_rounded;
      case 'warning': return Icons.warning_amber_rounded;
      default:        return Icons.error_outline_rounded;
    }
  }

  int get _goodCount     => _patients.where((p) => _status(p) == 'good').length;
  int get _warningCount  => _patients.where((p) => _status(p) == 'warning').length;
  int get _criticalCount => _patients.where((p) => _status(p) == 'critical').length;

  String _greeting() {
    final h = DateTime.now().hour;
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  }

  String _firstName() {
    final name = _userName ?? '';
    return name.split(' ').first;
  }

  // ── BUILD ──────────────────────────────────────────────────────────────────

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: bg,
      drawer: _buildDrawer(),
      body: SafeArea(child: Column(children: [
        _buildHeader(),
        Expanded(child: _isLoading
            ? Center(child: CircularProgressIndicator(color: primary))
            : _hasError ? _buildError()
            : _filteredPatients.isEmpty ? _buildEmpty()
            : _buildList()),
      ])),
    );
  }

  // ── HEADER ─────────────────────────────────────────────────────────────────

  Widget _buildHeader() {
    return Container(
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [primaryDk, primary],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: const BorderRadius.only(
          bottomLeft: Radius.circular(32),
          bottomRight: Radius.circular(32),
        ),
        boxShadow: [
          BoxShadow(color: primary.withOpacity(0.3), blurRadius: 16, offset: const Offset(0, 6)),
        ],
      ),
      child: Stack(children: [
        // decorative circle
        Positioned(top: -30, right: -30,
          child: Container(width: 120, height: 120,
            decoration: BoxDecoration(shape: BoxShape.circle,
                color: primaryLt.withOpacity(0.08)))),

        Padding(
          padding: const EdgeInsets.fromLTRB(20, 16, 20, 24),
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [

            // top bar
            Row(children: [
              Builder(builder: (ctx) => GestureDetector(
                onTap: () => Scaffold.of(ctx).openDrawer(),
                child: Container(
                  width: 40, height: 40,
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.15),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Icon(Icons.menu_rounded, color: Colors.white, size: 20),
                ),
              )),
              const Spacer(),
              // notification bell
              GestureDetector(
                onTap: () => Navigator.push(context,
                    MaterialPageRoute(builder: (_) => const CaregiverNotificationsPage()))
                    .then((_) => _loadUnreadCount()),
                child: Stack(children: [
                  Container(
                    width: 40, height: 40,
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.15),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: const Icon(Icons.notifications_outlined, color: Colors.white, size: 20),
                  ),
                  if (_unreadNotifCount > 0)
                    Positioned(right: 6, top: 6,
                      child: Container(
                        width: 10, height: 10,
                        decoration: BoxDecoration(
                          color: Colors.red.shade400,
                          shape: BoxShape.circle,
                          border: Border.all(color: primaryDk, width: 1.5),
                        ),
                      )),
                ]),
              ),
              const SizedBox(width: 8),
              GestureDetector(
                onTap: () => _fetchPatients(),
                child: Container(
                  width: 40, height: 40,
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.15),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Icon(Icons.refresh_rounded, color: Colors.white, size: 20),
                ),
              ),
            ]),
            const SizedBox(height: 20),

            // greeting
            Text(_greeting(), style: TextStyle(color: Colors.white.withOpacity(0.7),
                fontSize: 13, fontWeight: FontWeight.w500)),
            const SizedBox(height: 2),
            Text(_firstName().isNotEmpty ? _firstName() : 'Caregiver',
                style: const TextStyle(color: Colors.white, fontSize: 22,
                    fontWeight: FontWeight.w900, letterSpacing: -0.3)),
            const SizedBox(height: 4),
            Text('Monitoring ${_patients.length} patient${_patients.length == 1 ? '' : 's'}',
                style: TextStyle(color: Colors.white.withOpacity(0.6), fontSize: 13)),
            const SizedBox(height: 20),

            // search
            Container(
              height: 46,
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.15),
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: Colors.white.withOpacity(0.2)),
              ),
              child: TextField(
                controller: _searchController,
                onChanged: _onSearch,
                style: const TextStyle(color: Colors.white, fontSize: 14),
                decoration: InputDecoration(
                  border: InputBorder.none,
                  hintText: 'Search patients...',
                  hintStyle: TextStyle(color: Colors.white.withOpacity(0.5), fontSize: 14),
                  prefixIcon: Icon(Icons.search_rounded, color: Colors.white.withOpacity(0.7), size: 18),
                  suffixIcon: _searchController.text.isEmpty ? null
                      : IconButton(
                          icon: Icon(Icons.close_rounded, color: Colors.white.withOpacity(0.7), size: 16),
                          onPressed: () { _searchController.clear(); _onSearch(''); }),
                  contentPadding: const EdgeInsets.symmetric(vertical: 12),
                ),
              ),
            ),
            const SizedBox(height: 16),

            // summary cards
            Row(children: [
              Expanded(child: _summaryCard(_goodCount,     'On Track',  const Color(0xFF16A34A), const Color(0xFFDCFCE7), Icons.check_circle_outline_rounded)),
              const SizedBox(width: 8),
              Expanded(child: _summaryCard(_warningCount,  'Attention', const Color(0xFFD97706), const Color(0xFFFEF3C7), Icons.warning_amber_rounded)),
              const SizedBox(width: 8),
              Expanded(child: _summaryCard(_criticalCount, 'Critical',  const Color(0xFFDC2626), const Color(0xFFFEE2E2), Icons.error_outline_rounded)),
            ]),
          ]),
        ),
      ]),
    );
  }

  Widget _summaryCard(int count, String label, Color color, Color bgColor, IconData icon) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 8),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.12),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white.withOpacity(0.15)),
      ),
      child: Column(children: [
        Icon(icon, color: Colors.white.withOpacity(0.9), size: 18),
        const SizedBox(height: 6),
        Text('$count', style: const TextStyle(color: Colors.white,
            fontSize: 22, fontWeight: FontWeight.bold)),
        const SizedBox(height: 2),
        Text(label, style: TextStyle(color: Colors.white.withOpacity(0.7),
            fontSize: 10, fontWeight: FontWeight.w600)),
      ]),
    );
  }

  // ── PATIENT LIST ───────────────────────────────────────────────────────────

  Widget _buildList() {
    return RefreshIndicator(
      color: primary,
      onRefresh: () => _fetchPatients(),
      child: ListView.builder(
        padding: const EdgeInsets.fromLTRB(16, 20, 16, 30),
        itemCount: _filteredPatients.length,
        itemBuilder: (_, i) => _patientCard(_filteredPatients[i]),
      ),
    );
  }

  Widget _patientCard(Map<String, dynamic> p) {
    final status      = _status(p);
    final statusColor = _statusColor(status);
    final statusBg    = _statusBg(status);
    final adherence   = (p['adherence_rate'] ?? 0) as num;
    final missed      = (p['missed_doses']   ?? 0) as num;
    final name        = p['name']?.toString() ?? 'Patient';
    final relationship = p['relationship']?.toString() ?? '';
    final initials    = name.trim().split(' ').map((e) => e.isNotEmpty ? e[0] : '').take(2).join().toUpperCase();
    final nextMed     = p['next_medication']?.toString();
    final nextTime    = p['next_medication_time']?.toString();
    final lastActive  = p['last_active']?.toString() ?? '';

    return GestureDetector(
      onTap: () => Navigator.push(context,
          MaterialPageRoute(builder: (_) => PatientDetailsPage(patient: p))),
      child: Container(
        margin: const EdgeInsets.only(bottom: 16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(22),
          boxShadow: [
            BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 12, offset: const Offset(0, 4)),
            BoxShadow(color: statusColor.withOpacity(0.08), blurRadius: 20, offset: const Offset(0, 8)),
          ],
        ),
        child: Column(children: [

          // colored top stripe
          Container(
            height: 4,
            decoration: BoxDecoration(
              color: statusColor,
              borderRadius: const BorderRadius.vertical(top: Radius.circular(22)),
            ),
          ),

          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [

              // top row
              Row(children: [
                // avatar
                Container(
                  width: 50, height: 50,
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [statusColor, statusColor.withOpacity(0.7)],
                      begin: Alignment.topLeft, end: Alignment.bottomRight,
                    ),
                    borderRadius: BorderRadius.circular(14),
                  ),
                  child: Center(child: Text(initials, style: const TextStyle(
                      color: Colors.white, fontWeight: FontWeight.bold, fontSize: 18))),
                ),
                const SizedBox(width: 12),

                Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Text(name, style: const TextStyle(fontWeight: FontWeight.w800,
                      fontSize: 16, color: Color(0xFF0F172A))),
                  const SizedBox(height: 2),
                  if (relationship.isNotEmpty)
                    Text(relationship, style: TextStyle(color: Colors.grey.shade500, fontSize: 12)),
                  if (lastActive.isNotEmpty)
                    Row(children: [
                      Container(width: 6, height: 6,
                        margin: const EdgeInsets.only(right: 4),
                        decoration: BoxDecoration(
                          color: status == 'good' ? Colors.green : Colors.grey,
                          shape: BoxShape.circle,
                        )),
                      Text('Active $lastActive',
                          style: TextStyle(color: Colors.grey.shade400, fontSize: 11)),
                    ]),
                ])),

                // status badge + unfollow
                Column(crossAxisAlignment: CrossAxisAlignment.end, children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                    decoration: BoxDecoration(color: statusBg, borderRadius: BorderRadius.circular(20)),
                    child: Row(mainAxisSize: MainAxisSize.min, children: [
                      Icon(_statusIcon(status), size: 12, color: statusColor),
                      const SizedBox(width: 4),
                      Text(_statusLabel(status), style: TextStyle(
                          color: statusColor, fontWeight: FontWeight.bold, fontSize: 11)),
                    ]),
                  ),
                  const SizedBox(height: 6),
                  GestureDetector(
                    onTap: () => _unfollowPatient(p),
                    child: Container(
                      padding: const EdgeInsets.all(5),
                      decoration: BoxDecoration(
                        color: Colors.red.withOpacity(0.06),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Icon(Icons.person_remove_outlined, color: Colors.red.shade400, size: 14),
                    ),
                  ),
                ]),
              ]),
              const SizedBox(height: 14),

              // adherence bar
              Row(children: [
                Text('Adherence', style: TextStyle(fontSize: 11, color: Colors.grey.shade500,
                    fontWeight: FontWeight.w500)),
                const Spacer(),
                Text('$adherence%', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold,
                    color: statusColor)),
              ]),
              const SizedBox(height: 6),
              ClipRRect(
                borderRadius: BorderRadius.circular(6),
                child: LinearProgressIndicator(
                  value: adherence / 100,
                  minHeight: 7,
                  backgroundColor: Colors.grey.shade100,
                  valueColor: AlwaysStoppedAnimation<Color>(statusColor),
                ),
              ),
              const SizedBox(height: 12),

              // chips row
              Row(children: [
                _chip(Icons.cancel_outlined, '$missed missed',
                    const Color(0xFFDC2626), const Color(0xFFFEE2E2)),
                const SizedBox(width: 8),
                if (nextMed != null)
                  Expanded(child: _chip(Icons.alarm_rounded,
                      '$nextMed${nextTime != null ? ' · $nextTime' : ''}',
                      const Color(0xFF1565C0), const Color(0xFFEFF6FF))),
              ]),
              const SizedBox(height: 12),

              // action buttons
              Row(children: [
                Expanded(child: _actionBtn(
                  icon: Icons.phone_rounded,
                  label: 'Call',
                  color: const Color(0xFF16A34A),
                  bg: const Color(0xFFDCFCE7),
                  onTap: () => _callPatient(p['phone']?.toString()),
                )),
                const SizedBox(width: 10),
                Expanded(child: _actionBtn(
                  icon: Icons.notifications_rounded,
                  label: 'Remind',
                  color: const Color(0xFF1565C0),
                  bg: const Color(0xFFEFF6FF),
                  onTap: () => _sendReminder(p),
                )),
              ]),
            ]),
          ),
        ]),
      ),
    );
  }

  Widget _chip(IconData icon, String label, Color color, Color bg) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(color: bg, borderRadius: BorderRadius.circular(20)),
      child: Row(mainAxisSize: MainAxisSize.min, children: [
        Icon(icon, size: 12, color: color),
        const SizedBox(width: 4),
        Flexible(child: Text(label, style: TextStyle(fontSize: 11, color: color,
            fontWeight: FontWeight.w600), overflow: TextOverflow.ellipsis)),
      ]),
    );
  }

  Widget _actionBtn({
    required IconData icon,
    required String label,
    required Color color,
    required Color bg,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 10),
        decoration: BoxDecoration(color: bg, borderRadius: BorderRadius.circular(12)),
        child: Row(mainAxisAlignment: MainAxisAlignment.center, children: [
          Icon(icon, size: 15, color: color),
          const SizedBox(width: 6),
          Text(label, style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: color)),
        ]),
      ),
    );
  }

  // ── UNFOLLOW ───────────────────────────────────────────────────────────────

  Future<void> _unfollowPatient(Map<String, dynamic> patient) async {
    final name = patient['name']?.toString() ?? 'this patient';
    final confirm = await showDialog<bool>(
      context: context,
      builder: (_) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: Row(children: [
          Container(width: 36, height: 36,
            decoration: BoxDecoration(color: Colors.red.shade50, borderRadius: BorderRadius.circular(10)),
            child: Icon(Icons.person_remove_outlined, color: Colors.red.shade400, size: 18)),
          const SizedBox(width: 12),
          const Text('Stop Supervising', style: TextStyle(fontSize: 17)),
        ]),
        content: Text('Stop supervising $name? You will no longer see their data.',
            style: TextStyle(color: Colors.grey.shade600)),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context, false), child: const Text('Cancel')),
          ElevatedButton(
            onPressed: () => Navigator.pop(context, true),
            style: ElevatedButton.styleFrom(backgroundColor: Colors.red,
                foregroundColor: Colors.white, elevation: 0,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10))),
            child: const Text('Stop Supervising'),
          ),
        ],
      ),
    );
    if (confirm != true) return;
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');
      final resp  = await http.delete(
        Uri.parse('${ApiConfig.baseUrl}/caregivers/unfollow/${patient['id']}'),
        headers: {'Authorization': 'Bearer $token', 'Content-Type': 'application/json'},
      ).timeout(const Duration(seconds: 10));
      final data = jsonDecode(resp.body);
      if (resp.statusCode == 200 && data['success'] == true) {
        _snack('No longer supervising $name', Colors.orange);
        _fetchPatients();
      } else {
        _snack(data['message'] ?? 'Failed to unfollow', Colors.red);
      }
    } catch (_) { _snack('Connection error', Colors.red); }
  }

  Future<void> _callPatient(String? phone) async {
    if (phone == null || phone.isEmpty) { _snack('No phone number available', Colors.orange); return; }
    final url = Uri.parse('tel:$phone');
    if (await canLaunchUrl(url)) await launchUrl(url);
    else _snack('Could not open dialer', Colors.red);
  }

  Future<void> _sendReminder(Map<String, dynamic> patient) async {
    final name = patient['name']?.toString() ?? 'patient';
    final confirm = await showDialog<bool>(
      context: context,
      builder: (_) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: Row(children: [
          Container(width: 36, height: 36,
            decoration: BoxDecoration(color: Colors.blue.shade50, borderRadius: BorderRadius.circular(10)),
            child: Icon(Icons.notifications_outlined, color: Colors.blue.shade600, size: 18)),
          const SizedBox(width: 12),
          const Flexible(child: Text('Send Reminder', style: TextStyle(fontSize: 17))),
        ]),
        content: Text('Send a medication reminder to $name?',
            style: TextStyle(color: Colors.grey.shade600)),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context, false), child: const Text('Cancel')),
          ElevatedButton(
            onPressed: () => Navigator.pop(context, true),
            style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF1565C0),
                foregroundColor: Colors.white, elevation: 0,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10))),
            child: const Text('Send'),
          ),
        ],
      ),
    );
    if (confirm != true) return;
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');
      final resp  = await http.post(
        Uri.parse('${ApiConfig.baseUrl}/caregivers/remind/${patient['id']}'),
        headers: {'Authorization': 'Bearer $token', 'Content-Type': 'application/json'},
      ).timeout(const Duration(seconds: 10));
      final data = jsonDecode(resp.body);
      if (resp.statusCode == 200 && data['success'] == true) {
        _snack('✅ Reminder sent to $name', primary);
      } else {
        _snack(data['message'] ?? 'Failed to send reminder', Colors.red);
      }
    } catch (_) { _snack('Connection error', Colors.red); }
  }

  void _snack(String msg, Color color) {
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(
      content: Text(msg),
      backgroundColor: color,
      behavior: SnackBarBehavior.floating,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
    ));
  }

  // ── EMPTY / ERROR ──────────────────────────────────────────────────────────

    Widget _buildEmpty() {
    return LayoutBuilder(
      builder: (context, constraints) {
        final isCompact = constraints.maxHeight < 250;
        return Center(child: Padding(
          padding: const EdgeInsets.all(32),
          child: Column(mainAxisAlignment: MainAxisAlignment.center, mainAxisSize: MainAxisSize.min, children: [
            if (!isCompact) ...[
              Container(
                width: 80, height: 80,
                decoration: BoxDecoration(
                  color: primary.withOpacity(0.08),
                  shape: BoxShape.circle,
                ),
                child: Icon(Icons.people_outline_rounded, size: 40, color: primary.withOpacity(0.5)),
              ),
              const SizedBox(height: 16),
            ],
            Text(
              _searchController.text.isNotEmpty
                  ? 'No patients found'
                  : 'No patients yet',
              style: TextStyle(
                  fontSize: isCompact ? 15 : 20,
                  fontWeight: FontWeight.bold,
                  color: const Color(0xFF0F172A)),
            ),
            if (!isCompact) ...[
              const SizedBox(height: 8),
              Text('Ask your patient to add you as their caregiver.',
                  textAlign: TextAlign.center,
                  style: TextStyle(color: Colors.grey.shade500, fontSize: 14, height: 1.5)),
            ],
          ]),
        ));
      },
    );
  }

  Widget _buildError() {
    return Center(child: Padding(
      padding: const EdgeInsets.all(32),
      child: Column(mainAxisAlignment: MainAxisAlignment.center, mainAxisSize: MainAxisSize.min, children: [
        Icon(Icons.cloud_off_rounded, size: 64, color: Colors.grey.shade300),
        const SizedBox(height: 16),
        Text('Could not load patients', style: TextStyle(color: Colors.grey.shade600, fontSize: 16)),
        const SizedBox(height: 16),
        ElevatedButton(
          onPressed: _fetchPatients,
          style: ElevatedButton.styleFrom(backgroundColor: primary,
              foregroundColor: Colors.white, elevation: 0,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12))),
          child: const Text('Retry'),
        ),
      ]),
    ));
  }

  // ── DRAWER ─────────────────────────────────────────────────────────────────

  Widget _buildDrawer() {
    final initials = (_userName ?? 'C').split(' ')
        .map((e) => e.isNotEmpty ? e[0] : '').take(2).join().toUpperCase();

    return Drawer(
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.only(topRight: Radius.circular(28), bottomRight: Radius.circular(28))),
      child: Column(children: [
        Container(
          width: double.infinity,
          padding: const EdgeInsets.fromLTRB(20, 52, 20, 28),
          decoration: BoxDecoration(
            gradient: LinearGradient(
              colors: [primaryDk, primary],
              begin: Alignment.topLeft, end: Alignment.bottomRight,
            ),
          ),
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            // avatar with initials
            Container(
              width: 60, height: 60,
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(18),
                boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.15), blurRadius: 10)],
              ),
              child: Center(child: Text(initials, style: TextStyle(
                  fontSize: 22, fontWeight: FontWeight.bold, color: primary))),
            ),
            const SizedBox(height: 14),
            Text(_userName ?? 'Caregiver', style: const TextStyle(color: Colors.white,
                fontSize: 18, fontWeight: FontWeight.w800)),
            const SizedBox(height: 4),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.15),
                borderRadius: BorderRadius.circular(20),
              ),
              child: const Text('Caregiver', style: TextStyle(color: Colors.white,
                  fontSize: 11, fontWeight: FontWeight.w600, letterSpacing: 0.5)),
            ),
          ]),
        ),

        const SizedBox(height: 8),

        _drawerItem(Icons.people_outline_rounded, 'My Patients', false,
            () => Navigator.pop(context)),

        _drawerItemBadge(Icons.notifications_outlined, 'Notifications', _unreadNotifCount, () {
          Navigator.pop(context);
          Navigator.push(context,
              MaterialPageRoute(builder: (_) => const CaregiverNotificationsPage()))
              .then((_) => _loadUnreadCount());
        }),

        _drawerItem(Icons.person_outline_rounded, 'My Profile', false, () {
          Navigator.pop(context);
          Navigator.push(context,
              MaterialPageRoute(builder: (_) => const CaregiverProfilePage()));
        }),

        const Padding(
          padding: EdgeInsets.symmetric(horizontal: 20, vertical: 8),
          child: Divider(height: 1),
        ),

        const Spacer(),

        const Padding(
          padding: EdgeInsets.symmetric(horizontal: 20, vertical: 8),
          child: Divider(height: 1),
        ),

        _drawerItem(Icons.logout_rounded, 'Logout', true, _logout),
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
          color: isRed ? Colors.red.withOpacity(0.08) : primary.withOpacity(0.08),
          borderRadius: BorderRadius.circular(10),
        ),
        child: Icon(icon, size: 18,
            color: isRed ? Colors.red : primary),
      ),
      title: Text(title, style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: color)),
      onTap: onTap,
      contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 2),
    );
  }

  Widget _drawerItemBadge(IconData icon, String title, int badge, VoidCallback onTap) {
    return ListTile(
      leading: Stack(children: [
        Container(
          width: 36, height: 36,
          decoration: BoxDecoration(
            color: primary.withOpacity(0.08),
            borderRadius: BorderRadius.circular(10),
          ),
          child: Icon(icon, size: 18, color: primary),
        ),
        if (badge > 0)
          Positioned(right: 0, top: 0,
            child: Container(
              width: 10, height: 10,
              decoration: BoxDecoration(color: Colors.red, shape: BoxShape.circle,
                  border: Border.all(color: Colors.white, width: 1.5)),
            )),
      ]),
      title: Row(children: [
        Text(title, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600,
            color: Color(0xFF0F172A))),
        if (badge > 0) ...[
          const SizedBox(width: 8),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 2),
            decoration: BoxDecoration(color: Colors.red, borderRadius: BorderRadius.circular(10)),
            child: Text('$badge', style: const TextStyle(color: Colors.white,
                fontSize: 10, fontWeight: FontWeight.bold)),
          ),
        ],
      ]),
      onTap: onTap,
      contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 2),
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// PATIENT DETAILS PAGE
// ─────────────────────────────────────────────────────────────────────────────

class PatientDetailsPage extends StatefulWidget {
  final Map<String, dynamic> patient;
  const PatientDetailsPage({super.key, required this.patient});
  @override
  State<PatientDetailsPage> createState() => _PatientDetailsPageState();
}

class _PatientDetailsPageState extends State<PatientDetailsPage> {
  Map<String, dynamic> _data     = {};
  List<Map<String, dynamic>> _meds   = [];
  List<Map<String, dynamic>> _alerts = [];
  Map<String, dynamic>? _location;
  bool _isLoading = true;
  Timer? _locationTimer;

  static const Color primary   = Color(0xFF16A34A);
  static const Color primaryDk = Color(0xFF14532D);

  @override
  void initState() {
    super.initState();
    _fetchDetails();
    _locationTimer = Timer.periodic(
        const Duration(seconds: 30), (_) => _fetchDetails(locationOnly: true));
  }

  @override
  void dispose() {
    _locationTimer?.cancel();
    super.dispose();
  }

  Future<void> _fetchDetails({bool locationOnly = false}) async {
    if (!locationOnly && mounted) setState(() => _isLoading = true);
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');
      final id    = widget.patient['id'];

      final resp = await http.get(
        Uri.parse('${ApiConfig.baseUrl}/caregivers/patient/$id'),
        headers: {'Authorization': 'Bearer $token', 'Content-Type': 'application/json'},
      ).timeout(const Duration(seconds: 15));

      if (resp.statusCode == 200) {
        final body = jsonDecode(resp.body);
        if (mounted) setState(() {
          if (!locationOnly) {
            _data   = body['patient']           ?? {};
            _meds   = List<Map<String, dynamic>>.from(body['today_medications'] ?? []);
            _alerts = List<Map<String, dynamic>>.from(body['recent_alerts']     ?? []);
          }
          _location  = body['location'];
          _isLoading = false;
        });
      } else {
        if (mounted) setState(() => _isLoading = false);
      }
    } catch (e) {
      debugPrint('fetchDetails error: $e');
      if (mounted) setState(() => _isLoading = false);
    }
  }

  Future<void> _openMaps(double lat, double lng) async {
    final url = Uri.parse('https://www.google.com/maps/search/?api=1&query=$lat,$lng');
    if (await canLaunchUrl(url)) {
      await launchUrl(url, mode: LaunchMode.externalApplication);
    }
  }

  @override
  Widget build(BuildContext context) {
    final patient  = _data.isEmpty ? widget.patient : _data;
    final medOk    = patient['medications_enabled'] != false;
    final alertOk  = patient['alerts_enabled']      != false;
    final locOk    = patient['location_enabled']    != false;

    return Scaffold(
      backgroundColor: const Color(0xFFF0FDF4),
      body: CustomScrollView(
        slivers: [
          // ── SliverAppBar ──────────────────────────────────────────────────
          SliverAppBar(
            expandedHeight: 160,
            floating: false,
            pinned: true,
            backgroundColor: primary,
            foregroundColor: Colors.white,
            elevation: 0,
            leading: IconButton(
              icon: Container(
                width: 36, height: 36,
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.15),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: const Icon(Icons.arrow_back_rounded, color: Colors.white, size: 18),
              ),
              onPressed: () => Navigator.pop(context),
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
                onPressed: _fetchDetails,
              ),
              const SizedBox(width: 8),
            ],
            flexibleSpace: FlexibleSpaceBar(
              background: Container(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [primaryDk, primary],
                    begin: Alignment.topLeft, end: Alignment.bottomRight,
                  ),
                ),
                child: SafeArea(child: Padding(
                  padding: const EdgeInsets.fromLTRB(20, 56, 20, 16),
                  child: _buildPatientHeader(patient),
                )),
              ),
            ),
          ),

          // ── content ───────────────────────────────────────────────────────
          SliverToBoxAdapter(child: _isLoading
              ? const SizedBox(height: 200,
                  child: Center(child: CircularProgressIndicator(color: Color(0xFF16A34A))))
              : Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(children: [
                    _buildHealthOverview(patient),
                    const SizedBox(height: 14),
                    if (locOk) ...[_buildLocationCard(), const SizedBox(height: 14)],
                    if (medOk) ...[_buildMedications(), const SizedBox(height: 14)],
                    if (alertOk) ...[_buildAlerts(), const SizedBox(height: 14)],
                    const SizedBox(height: 20),
                  ]),
                )),
        ],
      ),
    );
  }

  Widget _buildPatientHeader(Map<String, dynamic> p) {
    final name      = p['name']?.toString() ?? 'Patient';
    final initials  = name.trim().split(' ').map((e) => e.isNotEmpty ? e[0] : '').take(2).join().toUpperCase();
    final adherence = (p['adherence_rate'] ?? 0) as num;
    final lastActive = p['last_active']?.toString() ?? '';

    return Row(children: [
      Container(
        width: 56, height: 56,
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.1), blurRadius: 10)],
        ),
        child: Center(child: Text(initials, style: TextStyle(
            fontSize: 22, fontWeight: FontWeight.bold, color: primary))),
      ),
      const SizedBox(width: 14),
      Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Text(name, style: const TextStyle(color: Colors.white, fontSize: 20,
            fontWeight: FontWeight.w900, letterSpacing: -0.3)),
        if (lastActive.isNotEmpty)
          Text('Active $lastActive', style: TextStyle(color: Colors.white.withOpacity(0.6), fontSize: 12)),
        const SizedBox(height: 8),
        ClipRRect(
          borderRadius: BorderRadius.circular(4),
          child: LinearProgressIndicator(
            value: adherence / 100,
            minHeight: 5,
            backgroundColor: Colors.white.withOpacity(0.2),
            valueColor: const AlwaysStoppedAnimation<Color>(Colors.white),
          ),
        ),
      ])),
      const SizedBox(width: 12),
      Column(crossAxisAlignment: CrossAxisAlignment.end, children: [
        Text('$adherence%', style: const TextStyle(color: Colors.white,
            fontSize: 22, fontWeight: FontWeight.bold)),
        Text('adherence', style: TextStyle(color: Colors.white.withOpacity(0.6), fontSize: 10)),
      ]),
    ]);
  }

  Widget _buildHealthOverview(Map<String, dynamic> p) {
    return _card(
      title: 'Health Overview',
      icon: Icons.monitor_heart_outlined,
      iconColor: primary,
      child: Row(children: [
        Expanded(child: _healthTile('${p['adherence_rate'] ?? 0}%', 'Adherence',
            const Color(0xFF16A34A), const Color(0xFFDCFCE7))),
        Expanded(child: _healthTile('${p['missed_doses'] ?? 0}', 'Missed 7d',
            const Color(0xFFD97706), const Color(0xFFFEF3C7))),
        Expanded(child: _healthTile('${p['current_streak'] ?? 0}d', 'Streak',
            const Color(0xFF1565C0), const Color(0xFFEFF6FF))),
        Expanded(child: _healthTile('${p['medication_count'] ?? 0}', 'Meds',
            const Color(0xFF7C3AED), const Color(0xFFF5F3FF))),
      ]),
    );
  }

  Widget _healthTile(String value, String label, Color color, Color bg) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 3),
      padding: const EdgeInsets.symmetric(vertical: 12),
      decoration: BoxDecoration(color: bg, borderRadius: BorderRadius.circular(14)),
      child: Column(children: [
        Text(value, style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: color)),
        const SizedBox(height: 4),
        Text(label, style: TextStyle(fontSize: 9, color: color.withOpacity(0.8),
            fontWeight: FontWeight.w600), textAlign: TextAlign.center),
      ]),
    );
  }

  Widget _buildLocationCard() {
    final loc     = _location;
    final hasLoc  = loc != null && loc['lat'] != null;
    final timeAgo = loc?['time_ago']?.toString() ?? 'Never';
    final address = loc?['address']?.toString() ?? '';

    bool isRecent = false;
    if (hasLoc) {
      if (timeAgo.contains('Just now') || timeAgo.contains('second')) isRecent = true;
      else if (timeAgo.contains('min')) {
        final mins = int.tryParse(timeAgo.split(' ')[0]) ?? 99;
        isRecent = mins < 6;
      }
    }

    final statusColor = hasLoc ? (isRecent ? const Color(0xFF16A34A) : const Color(0xFFD97706)) : Colors.grey;

    return _card(
      title: 'Location',
      icon: Icons.location_on_rounded,
      iconColor: statusColor,
      trailing: Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
        decoration: BoxDecoration(
          color: statusColor.withOpacity(0.1),
          borderRadius: BorderRadius.circular(20),
        ),
        child: Text(
          hasLoc ? (isRecent ? '🟢 Live' : '🟡 Last known') : '⚫ Offline',
          style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: statusColor),
        ),
      ),
      child: Column(children: [
        GestureDetector(
          onTap: hasLoc ? () => _openMaps(loc['lat'] as double, loc['lng'] as double) : null,
          child: Container(
            height: 150,
            width: double.infinity,
            decoration: BoxDecoration(
              color: hasLoc ? const Color(0xFFEFF6FF) : Colors.grey.shade100,
              borderRadius: BorderRadius.circular(16),
              border: hasLoc ? Border.all(color: Colors.blue.shade100) : null,
            ),
            child: hasLoc
                ? Column(mainAxisAlignment: MainAxisAlignment.center, children: [
                    Container(
                      width: 48, height: 48,
                      decoration: BoxDecoration(color: Colors.red.shade50, shape: BoxShape.circle),
                      child: Icon(Icons.location_pin, color: Colors.red.shade500, size: 28),
                    ),
                    const SizedBox(height: 8),
                    Text('${(loc['lat'] as num).toStringAsFixed(5)}, ${(loc['lng'] as num).toStringAsFixed(5)}',
                        style: TextStyle(color: Colors.blue.shade700, fontSize: 12)),
                    const SizedBox(height: 8),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 7),
                      decoration: BoxDecoration(
                        color: const Color(0xFF1565C0),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: const Row(mainAxisSize: MainAxisSize.min, children: [
                        Icon(Icons.map_rounded, color: Colors.white, size: 13),
                        SizedBox(width: 6),
                        Text('Open in Google Maps', style: TextStyle(color: Colors.white,
                            fontSize: 12, fontWeight: FontWeight.bold)),
                      ]),
                    ),
                  ])
                : Column(mainAxisAlignment: MainAxisAlignment.center, children: [
                    Icon(Icons.location_off_rounded, size: 36, color: Colors.grey.shade400),
                    const SizedBox(height: 8),
                    Text(address.isNotEmpty ? address : 'Location not available',
                        textAlign: TextAlign.center,
                        style: TextStyle(color: Colors.grey.shade500, fontSize: 12)),
                  ]),
          ),
        ),
        if (hasLoc) ...[
          const SizedBox(height: 10),
          Row(children: [
            Icon(Icons.access_time_rounded, size: 12, color: Colors.grey.shade400),
            const SizedBox(width: 4),
            Text('Updated $timeAgo', style: TextStyle(fontSize: 12, color: Colors.grey.shade500)),
          ]),
          if (address.isNotEmpty) ...[
            const SizedBox(height: 4),
            Text(address, style: TextStyle(fontSize: 12, color: Colors.grey.shade600),
                maxLines: 2, overflow: TextOverflow.ellipsis),
          ],
          if (!isRecent)
            Padding(
              padding: const EdgeInsets.only(top: 6),
              child: Row(children: [
                Icon(Icons.warning_amber_rounded, size: 12, color: Colors.orange.shade600),
                const SizedBox(width: 4),
                Text('Patient may have disabled location sharing',
                    style: TextStyle(fontSize: 11, color: Colors.orange.shade700)),
              ]),
            ),
        ],
      ]),
    );
  }

  Widget _buildMedications() {
    return _card(
      title: "Today's Medications",
      icon: Icons.medication_rounded,
      iconColor: const Color(0xFF1565C0),
      trailing: Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
        decoration: BoxDecoration(color: const Color(0xFFEFF6FF), borderRadius: BorderRadius.circular(20)),
        child: Text('${_meds.length}', style: const TextStyle(color: Color(0xFF1565C0),
            fontSize: 12, fontWeight: FontWeight.bold)),
      ),
      child: _meds.isEmpty
          ? _emptySection('No medications scheduled today')
          : Column(children: _meds.map((med) {
              final status = med['status']?.toString() ?? 'pending';
              Color color, bg;
              String label;
              IconData icon;
              switch (status) {
                case 'taken':
                  color = const Color(0xFF16A34A); bg = const Color(0xFFDCFCE7);
                  label = 'Taken'; icon = Icons.check_circle_rounded;
                  break;
                case 'missed':
                  color = const Color(0xFFDC2626); bg = const Color(0xFFFEE2E2);
                  label = 'Missed'; icon = Icons.cancel_rounded;
                  break;
                default:
                  color = const Color(0xFFD97706); bg = const Color(0xFFFEF3C7);
                  label = 'Pending'; icon = Icons.access_time_rounded;
              }
              return Container(
                margin: const EdgeInsets.only(bottom: 10),
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(color: bg.withOpacity(0.5),
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(color: color.withOpacity(0.15))),
                child: Row(children: [
                  Container(
                    width: 36, height: 36,
                    decoration: BoxDecoration(color: bg, borderRadius: BorderRadius.circular(10)),
                    child: Icon(icon, color: color, size: 18),
                  ),
                  const SizedBox(width: 12),
                  Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                    Text(med['name']?.toString() ?? '', style: const TextStyle(
                        fontWeight: FontWeight.w700, fontSize: 14, color: Color(0xFF0F172A))),
                    if ((med['dosage']?.toString() ?? '').isNotEmpty)
                      Text(med['dosage'].toString(),
                          style: TextStyle(color: Colors.grey.shade500, fontSize: 12)),
                  ])),
                  Column(crossAxisAlignment: CrossAxisAlignment.end, children: [
                    Text(med['time']?.toString() ?? '',
                        style: TextStyle(color: Colors.grey.shade500, fontSize: 12,
                            fontWeight: FontWeight.w600)),
                    const SizedBox(height: 4),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                      decoration: BoxDecoration(color: bg, borderRadius: BorderRadius.circular(10)),
                      child: Text(label, style: TextStyle(color: color, fontSize: 10,
                          fontWeight: FontWeight.bold)),
                    ),
                  ]),
                ]),
              );
            }).toList()),
    );
  }

  Widget _buildAlerts() {
    return _card(
      title: 'Recent Alerts',
      icon: Icons.notifications_rounded,
      iconColor: const Color(0xFFD97706),
      child: _alerts.isEmpty
          ? _emptySection('No recent alerts')
          : Column(children: _alerts.map((alert) => Container(
              margin: const EdgeInsets.only(bottom: 10),
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: const Color(0xFFFEF3C7).withOpacity(0.5),
                borderRadius: BorderRadius.circular(14),
                border: const Border(left: BorderSide(color: Color(0xFFD97706), width: 3)),
              ),
              child: Row(children: [
                Container(
                  width: 32, height: 32,
                  decoration: BoxDecoration(
                    color: const Color(0xFFFEF3C7),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: const Icon(Icons.warning_amber_rounded, color: Color(0xFFD97706), size: 16),
                ),
                const SizedBox(width: 10),
                Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Text(alert['message']?.toString() ?? '',
                      style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13,
                          color: Color(0xFF0F172A))),
                  const SizedBox(height: 2),
                  Text(alert['time']?.toString() ?? '',
                      style: TextStyle(color: Colors.grey.shade500, fontSize: 11)),
                ])),
              ]),
            )).toList()),
    );
  }

  Widget _card({
    required String title,
    required IconData icon,
    required Color iconColor,
    required Widget child,
    Widget? trailing,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 2),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.04), blurRadius: 10, offset: const Offset(0, 4))],
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Row(children: [
            Container(
              width: 34, height: 34,
              decoration: BoxDecoration(
                color: iconColor.withOpacity(0.1),
                borderRadius: BorderRadius.circular(10),
              ),
              child: Icon(icon, color: iconColor, size: 17),
            ),
            const SizedBox(width: 10),
            Text(title, style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w800,
                color: Color(0xFF0F172A))),
            if (trailing != null) ...[const Spacer(), trailing],
          ]),
          const SizedBox(height: 14),
          child,
        ]),
      ),
    );
  }

  Widget _emptySection(String msg) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 12),
      child: Center(child: Text(msg, style: TextStyle(color: Colors.grey.shade400, fontSize: 13))),
    );
  }
}