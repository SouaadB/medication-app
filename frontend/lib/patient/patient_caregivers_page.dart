import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../config/api_config.dart';
import 'chat_page.dart';

class PatientCaregiversPage extends StatefulWidget {
  const PatientCaregiversPage({super.key});

  @override
  State<PatientCaregiversPage> createState() => _PatientCaregiversPageState();
}

class _PatientCaregiversPageState extends State<PatientCaregiversPage> {
  List<dynamic> _caregivers = [];
  bool _isLoading = true;
  String? _error;

  static const Color _primary   = Color(0xFF1565C0);
  static const Color _primaryDk = Color(0xFF0D3F7F);

  @override
  void initState() {
    super.initState();
    _fetchCaregivers();
  }

  Future<void> _fetchCaregivers() async {
    setState(() { _isLoading = true; _error = null; });
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');
      final resp  = await http.get(
        Uri.parse('${ApiConfig.baseUrl}/caregivers'),
        headers: {'Authorization': 'Bearer $token'},
      );
      if (resp.statusCode == 200) {
        final data = jsonDecode(resp.body);
        setState(() { _caregivers = data['caregivers'] ?? []; _isLoading = false; });
      } else {
        setState(() { _error = 'Failed to load caregivers'; _isLoading = false; });
      }
    } catch (_) {
      setState(() { _error = 'Connection error'; _isLoading = false; });
    }
  }

  Future<void> _removeCaregiver(int id) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');
      final resp  = await http.delete(
        Uri.parse('${ApiConfig.baseUrl}/caregivers/$id'),
        headers: {'Authorization': 'Bearer $token'},
      );
      if (resp.statusCode == 200) {
        _fetchCaregivers();
        if (mounted) ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Caregiver removed'), backgroundColor: Colors.orange,
              behavior: SnackBarBehavior.floating));
      }
    } catch (_) {}
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF4F7FB),
      body: CustomScrollView(
        slivers: [
          // ── Header ────────────────────────────────────────────────────────
          SliverAppBar(
            expandedHeight: 160,
            pinned: true,
            backgroundColor: _primary,
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
                  child: const Icon(Icons.person_add_rounded, color: Colors.white, size: 18),
                ),
                onPressed: _showAddCaregiverDialog,
              ),
              const SizedBox(width: 8),
            ],
            flexibleSpace: FlexibleSpaceBar(
              background: Container(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [_primaryDk, _primary],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                ),
                child: Stack(children: [
                  Positioned(top: -30, right: -30,
                    child: Container(width: 140, height: 140,
                      decoration: BoxDecoration(shape: BoxShape.circle,
                          color: Colors.white.withOpacity(0.06)))),
                  SafeArea(child: Padding(
                    padding: const EdgeInsets.fromLTRB(24, 56, 24, 20),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisAlignment: MainAxisAlignment.end,
                      children: [
                        const Text('My Caregivers', style: TextStyle(
                          color: Colors.white, fontSize: 24,
                          fontWeight: FontWeight.w900, letterSpacing: -0.3,
                        )),
                        const SizedBox(height: 4),
                        Text(
                          _caregivers.isEmpty
                              ? 'No caregivers connected yet'
                              : '${_caregivers.length} caregiver${_caregivers.length > 1 ? 's' : ''} connected',
                          style: TextStyle(color: Colors.white.withOpacity(0.7), fontSize: 13),
                        ),
                      ],
                    ),
                  )),
                ]),
              ),
            ),
          ),

          // ── Content ────────────────────────────────────────────────────────
          SliverToBoxAdapter(
            child: _isLoading
                ? const SizedBox(height: 200,
                    child: Center(child: CircularProgressIndicator(color: _primary)))
                : _error != null
                    ? _buildError()
                    : Padding(
                        padding: const EdgeInsets.all(20),
                        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [

                          // Privacy banner
                          _buildPrivacyBanner(),
                          const SizedBox(height: 24),

                          if (_caregivers.isEmpty)
                            _buildEmpty()
                          else ...[
                            Text('Connected Caregivers',
                                style: TextStyle(fontSize: 15,
                                    fontWeight: FontWeight.w800,
                                    color: Colors.grey.shade700)),
                            const SizedBox(height: 12),
                            ..._caregivers.map((c) => _buildCaregiverCard(c)),
                          ],

                          const SizedBox(height: 24),
                          _buildHowItWorks(),
                          const SizedBox(height: 24),

                          // Invite button
                          SizedBox(
                            width: double.infinity, height: 54,
                            child: ElevatedButton.icon(
                              onPressed: _showAddCaregiverDialog,
                              icon: const Icon(Icons.person_add_rounded, size: 20),
                              label: const Text('Invite New Caregiver',
                                  style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold)),
                              style: ElevatedButton.styleFrom(
                                backgroundColor: _primary,
                                foregroundColor: Colors.white,
                                elevation: 0,
                                shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(16)),
                              ),
                            ),
                          ),
                          const SizedBox(height: 30),
                        ]),
                      ),
          ),
        ],
      ),
    );
  }

  // ── Privacy Banner ──────────────────────────────────────────────────────────
  Widget _buildPrivacyBanner() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: _primary.withOpacity(0.06),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: _primary.withOpacity(0.15)),
      ),
      child: Row(children: [
        Container(
          width: 40, height: 40,
          decoration: BoxDecoration(
            color: _primary.withOpacity(0.1),
            shape: BoxShape.circle,
          ),
          child: const Icon(Icons.shield_outlined, color: _primary, size: 20),
        ),
        const SizedBox(width: 14),
        const Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text('Your Privacy Matters', style: TextStyle(
            fontWeight: FontWeight.bold, color: _primary, fontSize: 13,
          )),
          SizedBox(height: 3),
          Text('You control who sees your health data. Revoke access anytime.',
              style: TextStyle(fontSize: 12, color: _primary, height: 1.4)),
        ])),
      ]),
    );
  }

  // ── Caregiver Card ──────────────────────────────────────────────────────────
  Widget _buildCaregiverCard(Map<String, dynamic> c) {
    final status   = c['status'] ?? 'PENDING';
    final name     = c['name']?.toString() ?? '';
    final initials = name.trim().split(' ')
        .map((e) => e.isNotEmpty ? e[0] : '').take(2).join().toUpperCase();
    final isActive = status == 'ACTIVE';
    final statusColor = isActive ? Colors.green : Colors.orange;
    final caregiverId = c['id'] as int;

    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 12, offset: const Offset(0, 4))],
      ),
      child: Column(children: [
        // Colored top stripe
        Container(
          height: 4,
          decoration: BoxDecoration(
            color: isActive ? _primary : Colors.orange,
            borderRadius: const BorderRadius.vertical(top: Radius.circular(20)),
          ),
        ),

        Padding(
          padding: const EdgeInsets.all(16),
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [

            // Top row — avatar + info + status
            Row(children: [
              Container(
                width: 48, height: 48,
                decoration: BoxDecoration(
                  color: statusColor.withOpacity(0.12),
                  shape: BoxShape.circle,
                ),
                child: Center(child: Text(initials, style: TextStyle(
                  color: statusColor, fontWeight: FontWeight.bold, fontSize: 16,
                ))),
              ),
              const SizedBox(width: 12),
              Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text(name, style: const TextStyle(
                  fontSize: 15, fontWeight: FontWeight.w800, color: Color(0xFF0F172A),
                )),
                Text(c['relationship']?.toString() ?? '',
                    style: TextStyle(fontSize: 12, color: Colors.grey.shade500)),
                Text(c['email']?.toString() ?? '',
                    style: TextStyle(fontSize: 11, color: Colors.grey.shade400)),
              ])),
              Column(crossAxisAlignment: CrossAxisAlignment.end, children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: statusColor.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Text(isActive ? 'Active' : 'Pending',
                      style: TextStyle(fontSize: 11,
                          color: statusColor, fontWeight: FontWeight.bold)),
                ),
                const SizedBox(height: 6),
                GestureDetector(
                  onTap: () => _confirmRemove(caregiverId, name),
                  child: Container(
                    padding: const EdgeInsets.all(5),
                    decoration: BoxDecoration(
                      color: Colors.red.withOpacity(0.06),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Icon(Icons.person_remove_outlined,
                        color: Colors.red.shade400, size: 14),
                  ),
                ),
              ]),
            ]),

            const SizedBox(height: 14),
            Divider(color: Colors.grey.shade100, height: 1),
            const SizedBox(height: 14),

            // Permissions row
            Row(children: [
              _permChip(Icons.location_on_outlined, 'Location',
                  c['view_location'] == 1),
              const SizedBox(width: 8),
              _permChip(Icons.medication_outlined, 'Medications',
                  c['view_medications'] == 1),
              const SizedBox(width: 8),
              _permChip(Icons.notifications_outlined, 'Alerts',
                  c['receive_alerts'] == 1),
            ]),

            const SizedBox(height: 14),

            // Action buttons
            Row(children: [
              // Chat button — only if ACTIVE
              if (isActive) ...[
                Expanded(child: _actionBtn(
                  icon: Icons.chat_rounded,
                  label: 'Chat',
                  color: _primary,
                  bg: const Color(0xFFEFF6FF),
                  onTap: () => Navigator.push(context, MaterialPageRoute(
                    builder: (_) => ChatPage(
                      partnerId:   caregiverId,
                      partnerName: name,
                      partnerRole: 'caregiver',
                    ),
                  )),
                )),
                const SizedBox(width: 10),
              ],
              Expanded(child: _actionBtn(
                icon: Icons.shield_outlined,
                label: 'Permissions',
                color: Colors.grey.shade600,
                bg: Colors.grey.shade100,
                onTap: () => _showPermissionsInfo(c),
              )),
            ]),
          ]),
        ),
      ]),
    );
  }

  Widget _permChip(IconData icon, String label, bool enabled) {
    return Expanded(child: Container(
      padding: const EdgeInsets.symmetric(vertical: 6),
      decoration: BoxDecoration(
        color: enabled
            ? Colors.green.shade50
            : Colors.grey.shade50,
        borderRadius: BorderRadius.circular(10),
        border: Border.all(
          color: enabled ? Colors.green.shade200 : Colors.grey.shade200,
        ),
      ),
      child: Column(children: [
        Icon(icon, size: 14,
            color: enabled ? Colors.green.shade600 : Colors.grey.shade400),
        const SizedBox(height: 3),
        Text(label, style: TextStyle(
          fontSize: 9, fontWeight: FontWeight.w600,
          color: enabled ? Colors.green.shade700 : Colors.grey.shade400,
        )),
      ]),
    ));
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
          Text(label, style: TextStyle(
              fontSize: 13, fontWeight: FontWeight.w700, color: color)),
        ]),
      ),
    );
  }

  // ── Empty state ─────────────────────────────────────────────────────────────
  Widget _buildEmpty() {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 40),
      child: Column(children: [
        Container(
          width: 80, height: 80,
          decoration: BoxDecoration(
            color: _primary.withOpacity(0.07),
            shape: BoxShape.circle,
          ),
          child: Icon(Icons.people_outline_rounded, size: 40,
              color: _primary.withOpacity(0.4)),
        ),
        const SizedBox(height: 16),
        const Text('No caregivers yet', style: TextStyle(
          fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFF0F172A),
        )),
        const SizedBox(height: 8),
        Text('Invite a family member or friend\nto monitor your health.',
            textAlign: TextAlign.center,
            style: TextStyle(fontSize: 13, color: Colors.grey.shade500, height: 1.5)),
        const SizedBox(height: 24),
      ]),
    );
  }

  // ── Error state ─────────────────────────────────────────────────────────────
  Widget _buildError() {
    return SizedBox(height: 200, child: Center(child: Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Icon(Icons.cloud_off_rounded, color: Colors.grey.shade300, size: 48),
        const SizedBox(height: 12),
        Text(_error!, style: TextStyle(color: Colors.grey.shade500)),
        const SizedBox(height: 12),
        TextButton(onPressed: _fetchCaregivers, child: const Text('Retry')),
      ],
    )));
  }

  // ── How it works ────────────────────────────────────────────────────────────
  Widget _buildHowItWorks() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [BoxShadow(
            color: Colors.black.withOpacity(0.04),
            blurRadius: 10, offset: const Offset(0, 4))],
      ),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        const Text('How It Works', style: TextStyle(
          fontSize: 14, fontWeight: FontWeight.w800, color: Color(0xFF0F172A),
        )),
        const SizedBox(height: 14),
        _step('1', 'Invite a family member or friend by email'),
        _step('2', 'They receive an invitation to create a caregiver account'),
        _step('3', 'Once active, they can monitor your medications and chat with you'),
      ]),
    );
  }

  Widget _step(String n, String text) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: Row(children: [
        Container(
          width: 24, height: 24,
          decoration: BoxDecoration(
            color: _primary.withOpacity(0.1),
            shape: BoxShape.circle,
          ),
          child: Center(child: Text(n, style: const TextStyle(
            fontSize: 11, color: _primary, fontWeight: FontWeight.bold,
          ))),
        ),
        const SizedBox(width: 10),
        Expanded(child: Text(text, style: TextStyle(
          fontSize: 13, color: Colors.grey.shade600, height: 1.4,
        ))),
      ]),
    );
  }

  // ── Dialogs ─────────────────────────────────────────────────────────────────
  void _confirmRemove(int id, String name) {
    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: Row(children: [
          Container(width: 36, height: 36,
            decoration: BoxDecoration(
                color: Colors.red.shade50,
                borderRadius: BorderRadius.circular(10)),
            child: Icon(Icons.person_remove_outlined,
                color: Colors.red.shade400, size: 18)),
          const SizedBox(width: 12),
          const Text('Remove Caregiver', style: TextStyle(fontSize: 16)),
        ]),
        content: Text('Remove $name? They will no longer have access to your health data.',
            style: TextStyle(color: Colors.grey.shade600)),
        actions: [
          TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('Cancel')),
          ElevatedButton(
            onPressed: () { Navigator.pop(context); _removeCaregiver(id); },
            style: ElevatedButton.styleFrom(
                backgroundColor: Colors.red, foregroundColor: Colors.white,
                elevation: 0,
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(10))),
            child: const Text('Remove'),
          ),
        ],
      ),
    );
  }

  void _showPermissionsInfo(Map<String, dynamic> c) {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(top: Radius.circular(24))),
      builder: (_) => Padding(
        padding: const EdgeInsets.all(24),
        child: Column(mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text('Permissions for ${c['name']}',
              style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w800)),
          const SizedBox(height: 16),
          _permRow(Icons.location_on_outlined,
              'View your location', c['view_location'] == 1),
          _permRow(Icons.medication_outlined,
              'View your medications', c['view_medications'] == 1),
          _permRow(Icons.notifications_outlined,
              'Receive alerts about you', c['receive_alerts'] == 1),
          const SizedBox(height: 8),
          Text('To change permissions, remove and re-invite this caregiver.',
              style: TextStyle(fontSize: 12, color: Colors.grey.shade400)),
          const SizedBox(height: 16),
        ]),
      ),
    );
  }

  Widget _permRow(IconData icon, String label, bool enabled) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(children: [
        Container(
          width: 36, height: 36,
          decoration: BoxDecoration(
            color: enabled ? Colors.green.shade50 : Colors.grey.shade100,
            borderRadius: BorderRadius.circular(10),
          ),
          child: Icon(icon, size: 18,
              color: enabled ? Colors.green.shade600 : Colors.grey.shade400),
        ),
        const SizedBox(width: 12),
        Expanded(child: Text(label,
            style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w500))),
        Icon(enabled ? Icons.check_circle_rounded : Icons.cancel_rounded,
            size: 20,
            color: enabled ? Colors.green.shade500 : Colors.grey.shade300),
      ]),
    );
  }

  void _showAddCaregiverDialog() {
    final nameCtrl         = TextEditingController();
    final relationshipCtrl = TextEditingController();
    final emailCtrl        = TextEditingController();
    bool viewLoc   = false;
    bool viewMed   = true;
    bool recvAlert = true;

    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (ctx) => StatefulBuilder(builder: (ctx, setS) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: const Text('Invite Caregiver',
            style: TextStyle(fontWeight: FontWeight.bold)),
        content: SingleChildScrollView(child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            _dialogField(nameCtrl, 'Full Name', Icons.person_outline),
            const SizedBox(height: 12),
            _dialogField(relationshipCtrl, 'Relationship (e.g. Daughter)',
                Icons.people_outline),
            const SizedBox(height: 12),
            _dialogField(emailCtrl, 'Email Address', Icons.email_outlined,
                type: TextInputType.emailAddress),
            const SizedBox(height: 16),
            const Divider(),
            const SizedBox(height: 8),
            const Align(alignment: Alignment.centerLeft,
              child: Text('Permissions', style: TextStyle(
                  fontWeight: FontWeight.w700, fontSize: 13))),
            CheckboxListTile(
              dense: true,
              title: const Text('View Location', style: TextStyle(fontSize: 13)),
              value: viewLoc, activeColor: _primary,
              onChanged: (v) => setS(() => viewLoc = v!),
            ),
            CheckboxListTile(
              dense: true,
              title: const Text('View Medications', style: TextStyle(fontSize: 13)),
              value: viewMed, activeColor: _primary,
              onChanged: (v) => setS(() => viewMed = v!),
            ),
            CheckboxListTile(
              dense: true,
              title: const Text('Receive Alerts', style: TextStyle(fontSize: 13)),
              value: recvAlert, activeColor: _primary,
              onChanged: (v) => setS(() => recvAlert = v!),
            ),
          ],
        )),
        actions: [
          TextButton(
              onPressed: () => Navigator.pop(ctx),
              child: const Text('Cancel')),
          ElevatedButton(
            onPressed: () async {
              final prefs = await SharedPreferences.getInstance();
              final token = prefs.getString('auth_token');
              try {
                final resp = await http.post(
                  Uri.parse('${ApiConfig.baseUrl}/caregivers'),
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer $token',
                  },
                  body: jsonEncode({
                    'name':         nameCtrl.text.trim(),
                    'relationship': relationshipCtrl.text.trim(),
                    'email':        emailCtrl.text.trim(),
                    'view_location':    viewLoc,
                    'view_medications': viewMed,
                    'receive_alerts':   recvAlert,
                  }),
                );
                if (mounted) {
                  Navigator.pop(ctx);
                  if (resp.statusCode == 201) {
                    ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
                      content: Text('✅ Invitation sent!'),
                      backgroundColor: Colors.green,
                      behavior: SnackBarBehavior.floating,
                    ));
                    _fetchCaregivers();
                  } else {
                    ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
                      content: Text('Failed to send invitation'),
                      backgroundColor: Colors.red,
                      behavior: SnackBarBehavior.floating,
                    ));
                  }
                }
              } catch (_) {
                if (mounted) Navigator.pop(ctx);
              }
            },
            style: ElevatedButton.styleFrom(
                backgroundColor: _primary, foregroundColor: Colors.white,
                elevation: 0,
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(10))),
            child: const Text('Send Invite'),
          ),
        ],
      )),
    );
  }

  Widget _dialogField(TextEditingController ctrl, String label, IconData icon,
      {TextInputType type = TextInputType.text}) {
    return TextField(
      controller: ctrl,
      keyboardType: type,
      decoration: InputDecoration(
        labelText: label,
        prefixIcon: Icon(icon, size: 18, color: Colors.grey.shade400),
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
        contentPadding:
            const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
      ),
    );
  }
}