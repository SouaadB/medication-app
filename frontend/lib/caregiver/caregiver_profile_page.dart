import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../config/api_config.dart';
import 'caregiver_login_page.dart';

class CaregiverProfilePage extends StatefulWidget {
  const CaregiverProfilePage({super.key});
  @override
  State<CaregiverProfilePage> createState() => _CaregiverProfilePageState();
}

class _CaregiverProfilePageState extends State<CaregiverProfilePage> {
  static const Color primary   = Color(0xFF16A34A);
  static const Color primaryDk = Color(0xFF14532D);
  static const Color primaryLt = Color(0xFF4ADE80);
  static const Color darkText  = Color(0xFF0F172A);

  bool   _loadingProfile = true;
  bool   _savingProfile  = false;
  bool   _savingPassword = false;
  bool   _isFirstLogin   = false;
  String _email      = '';
  String _createdAt  = '';

  final _nameCtrl      = TextEditingController();
  final _currentPwCtrl = TextEditingController();
  final _newPwCtrl     = TextEditingController();
  final _confirmPwCtrl = TextEditingController();

  bool _showCurrentPw = false;
  bool _showNewPw     = false;
  bool _showConfirmPw = false;

  @override
  void initState() {
    super.initState();
    _loadProfile();
    _checkFirstLogin();
  }

  @override
  void dispose() {
    _nameCtrl.dispose();
    _currentPwCtrl.dispose();
    _newPwCtrl.dispose();
    _confirmPwCtrl.dispose();
    super.dispose();
  }

  Future<String?> _token() async =>
      (await SharedPreferences.getInstance()).getString('auth_token');

  Future<void> _checkFirstLogin() async {
    final prefs = await SharedPreferences.getInstance();
    setState(() => _isFirstLogin = prefs.getBool('caregiver_first_login') ?? true);
  }

  Future<void> _loadProfile() async {
    setState(() => _loadingProfile = true);
    try {
      final token = await _token();
      if (token == null) return;
      final resp = await http.get(
        Uri.parse('${ApiConfig.baseUrl}/caregivers/profile'),
        headers: {'Authorization': 'Bearer $token', 'Content-Type': 'application/json'},
      ).timeout(const Duration(seconds: 10));
      if (resp.statusCode == 200) {
        final p = jsonDecode(resp.body)['profile'];
        setState(() {
          _nameCtrl.text = p['name']       ?? '';
          _email         = p['email']      ?? '';
          _createdAt     = p['created_at'] ?? '';
          _loadingProfile = false;
        });
      } else {
        setState(() => _loadingProfile = false);
      }
    } catch (_) { setState(() => _loadingProfile = false); }
  }

  Future<void> _saveProfile() async {
    if (_nameCtrl.text.trim().isEmpty) { _snack('Name cannot be empty', Colors.red); return; }
    setState(() => _savingProfile = true);
    try {
      final token = await _token();
      final resp  = await http.put(
        Uri.parse('${ApiConfig.baseUrl}/caregivers/profile'),
        headers: {'Authorization': 'Bearer $token', 'Content-Type': 'application/json'},
        body: jsonEncode({'name': _nameCtrl.text.trim()}),
      ).timeout(const Duration(seconds: 10));
      final data = jsonDecode(resp.body);
      if (resp.statusCode == 200 && data['success'] == true) {
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('user_name', _nameCtrl.text.trim());
        _snack('Profile updated', primary);
      } else {
        _snack(data['message'] ?? 'Failed to update', Colors.red);
      }
    } catch (_) { _snack('Connection error', Colors.red); }
    finally { if (mounted) setState(() => _savingProfile = false); }
  }

  Future<void> _changePassword() async {
    final current = _currentPwCtrl.text;
    final newPw   = _newPwCtrl.text;
    final confirm = _confirmPwCtrl.text;
    if (current.isEmpty || newPw.isEmpty || confirm.isEmpty) {
      _snack('Please fill in all fields', Colors.red); return;
    }
    if (newPw.length < 6) { _snack('Min 6 characters', Colors.red); return; }
    if (newPw != confirm) { _snack('Passwords do not match', Colors.red); return; }
    if (newPw == current) { _snack('New password must be different', Colors.red); return; }

    setState(() => _savingPassword = true);
    try {
      final token = await _token();
      final resp  = await http.put(
        Uri.parse('${ApiConfig.baseUrl}/caregivers/password'),
        headers: {'Authorization': 'Bearer $token', 'Content-Type': 'application/json'},
        body: jsonEncode({'currentPassword': current, 'newPassword': newPw}),
      ).timeout(const Duration(seconds: 10));
      final data = jsonDecode(resp.body);
      if (resp.statusCode == 200 && data['success'] == true) {
        final prefs = await SharedPreferences.getInstance();
        await prefs.setBool('caregiver_first_login', false);
        setState(() => _isFirstLogin = false);
        _currentPwCtrl.clear(); _newPwCtrl.clear(); _confirmPwCtrl.clear();
        _snack('✅ Password changed successfully!', primary);
      } else {
        _snack(data['message'] ?? 'Failed to change password', Colors.red);
      }
    } catch (_) { _snack('Connection error', Colors.red); }
    finally { if (mounted) setState(() => _savingPassword = false); }
  }

  Future<void> _logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.clear();
    if (mounted) Navigator.pushAndRemoveUntil(context,
        MaterialPageRoute(builder: (_) => const CaregiverLoginPage()), (_) => false);
  }

  void _snack(String msg, Color color) {
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(
      content: Text(msg), backgroundColor: color,
      behavior: SnackBarBehavior.floating,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
    ));
  }

  String _initials() => _nameCtrl.text.trim().split(' ')
      .map((e) => e.isNotEmpty ? e[0] : '').take(2).join().toUpperCase();

  String _fmtDate(String raw) {
    try {
      final d = DateTime.parse(raw);
      const m = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      return '${m[d.month - 1]} ${d.day}, ${d.year}';
    } catch (_) { return raw; }
  }

  // ── BUILD ──────────────────────────────────────────────────────────────────

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF0FDF4),
      body: _loadingProfile
          ? const Center(child: CircularProgressIndicator(color: primary))
          : CustomScrollView(
              slivers: [

                // ── SliverAppBar ───────────────────────────────────────────
                SliverAppBar(
                  expandedHeight: 200,
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
                        child: const Icon(Icons.logout_rounded, color: Colors.white, size: 18),
                      ),
                      onPressed: _confirmLogout,
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
                      child: Stack(children: [
                        Positioned(top: -30, right: -30,
                          child: Container(width: 140, height: 140,
                            decoration: BoxDecoration(shape: BoxShape.circle,
                                color: primaryLt.withOpacity(0.08)))),
                        SafeArea(child: Padding(
                          padding: const EdgeInsets.fromLTRB(20, 56, 20, 20),
                          child: Row(children: [
                            // avatar
                            Container(
                              width: 72, height: 72,
                              decoration: BoxDecoration(
                                color: Colors.white,
                                borderRadius: BorderRadius.circular(20),
                                boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.15), blurRadius: 12)],
                              ),
                              child: Center(child: Text(
                                _initials().isNotEmpty ? _initials() : '?',
                                style: TextStyle(fontSize: 26, fontWeight: FontWeight.bold, color: primary),
                              )),
                            ),
                            const SizedBox(width: 16),
                            Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                              Text(_nameCtrl.text.isNotEmpty ? _nameCtrl.text : 'Caregiver',
                                  style: const TextStyle(color: Colors.white,
                                      fontSize: 20, fontWeight: FontWeight.w900, letterSpacing: -0.3)),
                              const SizedBox(height: 4),
                              Text(_email, style: TextStyle(color: Colors.white.withOpacity(0.7), fontSize: 13),
                                  overflow: TextOverflow.ellipsis),
                              const SizedBox(height: 6),
                              Row(children: [
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                  decoration: BoxDecoration(
                                    color: Colors.white.withOpacity(0.15),
                                    borderRadius: BorderRadius.circular(20),
                                  ),
                                  child: const Text('Caregiver', style: TextStyle(color: Colors.white,
                                      fontSize: 11, fontWeight: FontWeight.w600, letterSpacing: 0.5)),
                                ),
                                if (_createdAt.isNotEmpty) ...[
                                  const SizedBox(width: 8),
                                  Text('Since ${_fmtDate(_createdAt)}',
                                      style: TextStyle(color: Colors.white.withOpacity(0.6), fontSize: 11)),
                                ],
                              ]),
                            ])),
                          ]),
                        )),
                      ]),
                    ),
                  ),
                ),

                // ── content ───────────────────────────────────────────────
                SliverToBoxAdapter(child: Padding(
                  padding: const EdgeInsets.fromLTRB(16, 20, 16, 40),
                  child: Column(children: [

                    // first login banner
                    if (_isFirstLogin) ...[
                      Container(
                        padding: const EdgeInsets.all(14),
                        decoration: BoxDecoration(
                          color: Colors.orange.shade50,
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color: Colors.orange.shade200),
                        ),
                        child: Row(children: [
                          Container(
                            width: 36, height: 36,
                            decoration: BoxDecoration(
                              color: Colors.orange.shade100,
                              borderRadius: BorderRadius.circular(10),
                            ),
                            child: Icon(Icons.security_rounded, color: Colors.orange.shade700, size: 18),
                          ),
                          const SizedBox(width: 12),
                          Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                            Text('Set your personal password',
                                style: TextStyle(fontWeight: FontWeight.bold,
                                    color: Colors.orange.shade800, fontSize: 13)),
                            const SizedBox(height: 2),
                            Text('For your security, replace the temporary password below.',
                                style: TextStyle(color: Colors.orange.shade700, fontSize: 12, height: 1.3)),
                          ])),
                        ]),
                      ),
                      const SizedBox(height: 16),
                    ],

                    // profile card
                    _section(
                      title: 'Personal Information',
                      icon: Icons.person_outline_rounded,
                      iconColor: primary,
                      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                        _fieldLabel('Full Name'),
                        const SizedBox(height: 8),
                        _field(controller: _nameCtrl, hint: 'Your full name',
                            icon: Icons.person_outline_rounded),
                        const SizedBox(height: 16),
                        _fieldLabel('Email Address'),
                        const SizedBox(height: 8),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                          decoration: BoxDecoration(
                            color: primary.withOpacity(0.04),
                            borderRadius: BorderRadius.circular(14),
                            border: Border.all(color: primary.withOpacity(0.15)),
                          ),
                          child: Row(children: [
                            Icon(Icons.mail_outline_rounded, color: primary, size: 20),
                            const SizedBox(width: 12),
                            Expanded(child: Text(_email,
                                style: TextStyle(fontSize: 14, color: Colors.grey.shade700),
                                overflow: TextOverflow.ellipsis)),
                            const SizedBox(width: 8),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                              decoration: BoxDecoration(
                                color: primary.withOpacity(0.1),
                                borderRadius: BorderRadius.circular(20),
                              ),
                              child: const Text('Verified', style: TextStyle(fontSize: 10,
                                  color: primary, fontWeight: FontWeight.bold)),
                            ),
                          ]),
                        ),
                        const SizedBox(height: 20),
                        SizedBox(
                          width: double.infinity, height: 50,
                          child: ElevatedButton(
                            onPressed: _savingProfile ? null : _saveProfile,
                            style: ElevatedButton.styleFrom(
                              backgroundColor: primary, foregroundColor: Colors.white,
                              elevation: 0,
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                            ),
                            child: _savingProfile
                                ? const SizedBox(width: 20, height: 20,
                                    child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                                : const Text('Save Changes', style: TextStyle(
                                    fontSize: 15, fontWeight: FontWeight.bold)),
                          ),
                        ),
                      ]),
                    ),
                    const SizedBox(height: 16),

                    // password card
                    _section(
                      title: 'Change Password',
                      icon: Icons.lock_outline_rounded,
                      iconColor: _isFirstLogin ? Colors.orange : const Color(0xFF1565C0),
                      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                        if (_isFirstLogin) ...[
                          Container(
                            padding: const EdgeInsets.all(12),
                            margin: const EdgeInsets.only(bottom: 16),
                            decoration: BoxDecoration(
                              color: primary.withOpacity(0.05),
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(color: primary.withOpacity(0.15)),
                            ),
                            child: Row(children: [
                              const Icon(Icons.info_outline_rounded, color: primary, size: 16),
                              const SizedBox(width: 8),
                              Expanded(child: Text(
                                'Enter your temporary password from the invitation email.',
                                style: TextStyle(fontSize: 12, color: Colors.grey.shade700, height: 1.4),
                              )),
                            ]),
                          ),
                        ],
                        _fieldLabel('Current Password'),
                        const SizedBox(height: 8),
                        _field(
                          controller: _currentPwCtrl, hint: 'Current password',
                          icon: Icons.lock_outline_rounded, obscure: !_showCurrentPw,
                          suffix: _eye(_showCurrentPw, () => setState(() => _showCurrentPw = !_showCurrentPw)),
                        ),
                        const SizedBox(height: 14),
                        _fieldLabel('New Password'),
                        const SizedBox(height: 8),
                        _field(
                          controller: _newPwCtrl, hint: 'At least 6 characters',
                          icon: Icons.lock_reset_outlined, obscure: !_showNewPw,
                          suffix: _eye(_showNewPw, () => setState(() => _showNewPw = !_showNewPw)),
                        ),
                        const SizedBox(height: 14),
                        _fieldLabel('Confirm New Password'),
                        const SizedBox(height: 8),
                        _field(
                          controller: _confirmPwCtrl, hint: 'Repeat new password',
                          icon: Icons.lock_reset_outlined, obscure: !_showConfirmPw,
                          suffix: _eye(_showConfirmPw, () => setState(() => _showConfirmPw = !_showConfirmPw)),
                        ),
                        const SizedBox(height: 20),
                        SizedBox(
                          width: double.infinity, height: 50,
                          child: ElevatedButton.icon(
                            onPressed: _savingPassword ? null : _changePassword,
                            icon: _savingPassword
                                ? const SizedBox(width: 18, height: 18,
                                    child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                                : const Icon(Icons.check_circle_outline_rounded, size: 18),
                            label: Text(_savingPassword ? 'Saving...' : 'Change Password',
                                style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold)),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: _isFirstLogin ? Colors.orange : const Color(0xFF1565C0),
                              foregroundColor: Colors.white, elevation: 0,
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                            ),
                          ),
                        ),
                      ]),
                    ),
                    const SizedBox(height: 16),

                    // logout
                    GestureDetector(
                      onTap: _confirmLogout,
                      child: Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: Colors.red.shade50,
                          borderRadius: BorderRadius.circular(18),
                          border: Border.all(color: Colors.red.withOpacity(0.15)),
                        ),
                        child: Row(children: [
                          Container(
                            width: 40, height: 40,
                            decoration: BoxDecoration(
                              color: Colors.red.shade100,
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: const Icon(Icons.logout_rounded, color: Colors.red, size: 20),
                          ),
                          const SizedBox(width: 14),
                          Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                            const Text('Logout', style: TextStyle(color: Colors.red,
                                fontWeight: FontWeight.bold, fontSize: 15)),
                            Text('Sign out of your caregiver account',
                                style: TextStyle(color: Colors.red.shade400, fontSize: 12)),
                          ])),
                          Icon(Icons.chevron_right_rounded, color: Colors.red.shade300),
                        ]),
                      ),
                    ),
                  ]),
                )),
              ],
            ),
    );
  }

  // ── helpers ────────────────────────────────────────────────────────────────

  Widget _section({
    required String title,
    required IconData icon,
    required Color iconColor,
    required Widget child,
  }) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.04), blurRadius: 10, offset: const Offset(0, 4))],
      ),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Row(children: [
          Container(
            width: 34, height: 34,
            decoration: BoxDecoration(color: iconColor.withOpacity(0.1), borderRadius: BorderRadius.circular(10)),
            child: Icon(icon, color: iconColor, size: 17),
          ),
          const SizedBox(width: 10),
          Text(title, style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w800, color: darkText)),
        ]),
        const SizedBox(height: 18),
        child,
      ]),
    );
  }

  Widget _fieldLabel(String text) => Text(text, style: const TextStyle(
      fontSize: 13, fontWeight: FontWeight.w600, color: darkText));

  Widget _field({
    required TextEditingController controller,
    required String hint,
    required IconData icon,
    bool obscure = false,
    Widget? suffix,
  }) {
    return TextField(
      controller: controller,
      obscureText: obscure,
      style: const TextStyle(fontSize: 15, color: darkText),
      decoration: InputDecoration(
        hintText: hint,
        hintStyle: TextStyle(color: Colors.grey.shade400, fontSize: 14),
        prefixIcon: Icon(icon, color: Colors.grey.shade400, size: 20),
        suffixIcon: suffix,
        filled: true,
        fillColor: const Color(0xFFF8FAFC),
        contentPadding: const EdgeInsets.symmetric(vertical: 16, horizontal: 16),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: BorderSide(color: Colors.grey.shade200),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: const BorderSide(color: primary, width: 1.5),
        ),
      ),
    );
  }

  Widget _eye(bool visible, VoidCallback onTap) => IconButton(
    onPressed: onTap,
    icon: Icon(visible ? Icons.visibility_outlined : Icons.visibility_off_outlined,
        color: Colors.grey.shade400, size: 20),
  );

  Future<void> _confirmLogout() async {
    final confirm = await showDialog<bool>(
      context: context,
      builder: (_) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: Row(children: [
          Container(width: 36, height: 36,
            decoration: BoxDecoration(color: Colors.red.shade50, borderRadius: BorderRadius.circular(10)),
            child: Icon(Icons.logout_rounded, color: Colors.red.shade400, size: 18)),
          const SizedBox(width: 12),
          const Text('Logout', style: TextStyle(fontSize: 17, color: Colors.red)),
        ]),
        content: Text('Are you sure you want to sign out?',
            style: TextStyle(color: Colors.grey.shade600)),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context, false), child: const Text('Cancel')),
          ElevatedButton(
            onPressed: () => Navigator.pop(context, true),
            style: ElevatedButton.styleFrom(backgroundColor: Colors.red,
                foregroundColor: Colors.white, elevation: 0,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10))),
            child: const Text('Sign Out'),
          ),
        ],
      ),
    );
    if (confirm == true) _logout();
  }
}