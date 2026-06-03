import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import '../config/api_config.dart';
import 'caregiver_login_page.dart';

class AcceptInvitationPage extends StatefulWidget {
  final String? email;
  const AcceptInvitationPage({super.key, this.email});

  @override
  State<AcceptInvitationPage> createState() => _AcceptInvitationPageState();
}

class _AcceptInvitationPageState extends State<AcceptInvitationPage>
    with SingleTickerProviderStateMixin {
  final TextEditingController _emailController    = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();

  bool    _isLoading       = false;
  bool    _obscurePassword = true;
  bool    _accepted        = false;
  String? _errorMessage;

  late AnimationController _animCtrl;
  late Animation<double>   _fadeAnim;
  late Animation<Offset>   _slideAnim;

  static const Color primary   = Color(0xFF16A34A);
  static const Color primaryDk = Color(0xFF14532D);
  static const Color primaryLt = Color(0xFF4ADE80);
  static const Color darkText  = Color(0xFF0F172A);

  @override
  void initState() {
    super.initState();
    if (widget.email != null) _emailController.text = widget.email!;
    _animCtrl  = AnimationController(vsync: this, duration: const Duration(milliseconds: 900));
    _fadeAnim  = CurvedAnimation(parent: _animCtrl, curve: Curves.easeOut);
    _slideAnim = Tween<Offset>(begin: const Offset(0, 0.08), end: Offset.zero)
        .animate(CurvedAnimation(parent: _animCtrl, curve: Curves.easeOutCubic));
    _animCtrl.forward();
  }

  @override
  void dispose() {
    _animCtrl.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  Future<void> _accept() async {
    if (_emailController.text.trim().isEmpty || _passwordController.text.isEmpty) {
      setState(() => _errorMessage = 'Please fill in all fields');
      return;
    }
    setState(() { _isLoading = true; _errorMessage = null; });
    try {
      final response = await http.post(
        Uri.parse('${ApiConfig.baseUrl}/caregivers/accept-invitation'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'email':    _emailController.text.trim(),
          'password': _passwordController.text,
        }),
      ).timeout(const Duration(seconds: 10));

      final data = jsonDecode(response.body);
      if (response.statusCode == 200 && data['success'] == true) {
        setState(() { _accepted = true; _isLoading = false; });
      } else {
        setState(() {
          _errorMessage = data['message'] ?? 'Invalid email or password';
          _isLoading = false;
        });
      }
    } catch (e) {
      setState(() { _errorMessage = 'Connection error. Please try again.'; _isLoading = false; });
    }
  }

  void _goToLogin() => Navigator.pushReplacement(
      context, MaterialPageRoute(builder: (_) => const CaregiverLoginPage()));

  // ── SUCCESS ────────────────────────────────────────────────────────────────

  Widget _buildSuccess() {
    return Scaffold(
      backgroundColor: primaryDk,
      body: Stack(children: [
        Positioned(top: -60, right: -60,
          child: Container(width: 200, height: 200,
            decoration: BoxDecoration(shape: BoxShape.circle,
                color: primaryLt.withOpacity(0.08)))),
        SafeArea(child: Column(children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(28, 40, 28, 28),
            child: Column(children: [
              // animated checkmark
              TweenAnimationBuilder<double>(
                tween: Tween(begin: 0, end: 1),
                duration: const Duration(milliseconds: 600),
                builder: (_, v, __) => Transform.scale(
                  scale: v,
                  child: Container(
                    width: 90, height: 90,
                    decoration: BoxDecoration(
                      color: Colors.white,
                      shape: BoxShape.circle,
                      boxShadow: [
                        BoxShadow(color: primaryLt.withOpacity(0.5), blurRadius: 30, spreadRadius: 4),
                      ],
                    ),
                    child: const Icon(Icons.check_rounded, size: 48, color: primary),
                  ),
                ),
              ),
              const SizedBox(height: 24),
              const Text('You\'re all set!', style: TextStyle(color: Colors.white,
                  fontSize: 28, fontWeight: FontWeight.w900, letterSpacing: -0.5)),
              const SizedBox(height: 8),
              Text('Your caregiver account is ready', style: TextStyle(
                  color: Colors.white.withOpacity(0.6), fontSize: 14)),
            ]),
          ),

          Expanded(child: Container(
            width: double.infinity,
            decoration: const BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.only(
                topLeft: Radius.circular(36), topRight: Radius.circular(36)),
            ),
            padding: const EdgeInsets.fromLTRB(28, 40, 28, 40),
            child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [

              // info cards
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: primary.withOpacity(0.05),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: primary.withOpacity(0.15)),
                ),
                child: Column(children: [
                  _successItem(Icons.monitor_heart_outlined, 'Monitor medications',
                      'Track your patient\'s daily medication schedule'),
                  const SizedBox(height: 16),
                  _successItem(Icons.location_on_outlined, 'Track location',
                      'See your patient\'s location in real time'),
                  const SizedBox(height: 16),
                  _successItem(Icons.notifications_outlined, 'Receive alerts',
                      'Get notified when something needs attention'),
                ]),
              ),
              const SizedBox(height: 32),

              SizedBox(
                width: double.infinity, height: 56,
                child: ElevatedButton(
                  onPressed: _goToLogin,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: primary, foregroundColor: Colors.white,
                    elevation: 0,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  ),
                  child: const Row(mainAxisAlignment: MainAxisAlignment.center, children: [
                    Text('Go to Login', style: TextStyle(fontSize: 17, fontWeight: FontWeight.bold)),
                    SizedBox(width: 8),
                    Icon(Icons.arrow_forward_rounded, size: 20),
                  ]),
                ),
              ),
            ]),
          )),
        ])),
      ]),
    );
  }

  Widget _successItem(IconData icon, String title, String subtitle) {
    return Row(children: [
      Container(
        width: 40, height: 40,
        decoration: BoxDecoration(color: primary.withOpacity(0.1), borderRadius: BorderRadius.circular(12)),
        child: Icon(icon, color: primary, size: 20),
      ),
      const SizedBox(width: 14),
      Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Text(title, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: darkText)),
        const SizedBox(height: 2),
        Text(subtitle, style: TextStyle(fontSize: 12, color: Colors.grey.shade500)),
      ])),
    ]);
  }

  // ── BUILD ──────────────────────────────────────────────────────────────────

  @override
  Widget build(BuildContext context) {
    if (_accepted) return _buildSuccess();

    return Scaffold(
      backgroundColor: primaryDk,
      body: Stack(children: [
        Positioned(top: -60, right: -60,
          child: Container(width: 200, height: 200,
            decoration: BoxDecoration(shape: BoxShape.circle,
                color: primaryLt.withOpacity(0.08)))),
        Positioned(bottom: 300, left: -60,
          child: Container(width: 160, height: 160,
            decoration: BoxDecoration(shape: BoxShape.circle,
                color: Colors.white.withOpacity(0.03)))),

        SafeArea(child: Column(children: [

          // header
          Padding(
            padding: const EdgeInsets.fromLTRB(20, 20, 28, 24),
            child: FadeTransition(opacity: _fadeAnim,
              child: SlideTransition(position: _slideAnim,
                child: Row(children: [
                  // back button
                  GestureDetector(
                    onTap: () => Navigator.canPop(context) ? Navigator.pop(context) : _goToLogin(),
                    child: Container(
                      width: 42, height: 42,
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.12),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: const Icon(Icons.arrow_back_rounded, color: Colors.white, size: 20),
                    ),
                  ),
                  const SizedBox(width: 16),
                  Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                    const Text('Accept Invitation', style: TextStyle(color: Colors.white,
                        fontSize: 20, fontWeight: FontWeight.w900, letterSpacing: -0.3)),
                    Text('Join as a caregiver', style: TextStyle(
                        color: Colors.white.withOpacity(0.55), fontSize: 13)),
                  ]),
                ]),
              ),
            ),
          ),

          // white card
          Expanded(child: FadeTransition(opacity: _fadeAnim,
            child: SlideTransition(position: _slideAnim,
              child: Container(
                width: double.infinity,
                decoration: const BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.only(
                    topLeft: Radius.circular(36), topRight: Radius.circular(36)),
                ),
                child: SingleChildScrollView(
                  padding: const EdgeInsets.fromLTRB(28, 36, 28, 32),
                  child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [

                    // info banner
                    Container(
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        gradient: LinearGradient(colors: [
                          primary.withOpacity(0.06),
                          primary.withOpacity(0.02),
                        ]),
                        borderRadius: BorderRadius.circular(14),
                        border: Border.all(color: primary.withOpacity(0.15)),
                      ),
                      child: Row(children: [
                        Container(
                          width: 36, height: 36,
                          decoration: BoxDecoration(color: primary.withOpacity(0.1),
                              borderRadius: BorderRadius.circular(10)),
                          child: const Icon(Icons.info_outline_rounded, color: primary, size: 18),
                        ),
                        const SizedBox(width: 12),
                        Expanded(child: Text(
                          'Use the email and temporary password from your invitation email.',
                          style: TextStyle(fontSize: 13, color: Colors.grey.shade700, height: 1.4),
                        )),
                      ]),
                    ),
                    const SizedBox(height: 28),

                    _label('Email Address'),
                    const SizedBox(height: 8),
                    _field(
                      controller: _emailController,
                      hint: 'Your invitation email',
                      icon: Icons.mail_outline_rounded,
                      keyboardType: TextInputType.emailAddress,
                      readOnly: widget.email != null,
                    ),
                    const SizedBox(height: 18),

                    _label('Temporary Password'),
                    const SizedBox(height: 8),
                    _field(
                      controller: _passwordController,
                      hint: 'From your invitation email',
                      icon: Icons.lock_outline_rounded,
                      obscure: _obscurePassword,
                      suffixIcon: IconButton(
                        onPressed: () => setState(() => _obscurePassword = !_obscurePassword),
                        icon: Icon(_obscurePassword
                            ? Icons.visibility_off_outlined : Icons.visibility_outlined,
                            color: Colors.grey.shade400, size: 20),
                      ),
                    ),

                    if (_errorMessage != null) ...[
                      const SizedBox(height: 12),
                      Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: Colors.red.shade50,
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: Colors.red.shade100),
                        ),
                        child: Row(children: [
                          Icon(Icons.error_outline_rounded, color: Colors.red.shade400, size: 16),
                          const SizedBox(width: 8),
                          Flexible(child: Text(_errorMessage!,
                              style: TextStyle(color: Colors.red.shade700, fontSize: 13))),
                        ]),
                      ),
                    ],
                    const SizedBox(height: 28),

                    SizedBox(
                      width: double.infinity, height: 56,
                      child: ElevatedButton(
                        onPressed: _isLoading ? null : _accept,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: primary, foregroundColor: Colors.white,
                          elevation: 0,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                        ),
                        child: _isLoading
                            ? const SizedBox(width: 22, height: 22,
                                child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2.5))
                            : const Row(mainAxisAlignment: MainAxisAlignment.center, children: [
                                Text('Confirm & Join', style: TextStyle(fontSize: 17,
                                    fontWeight: FontWeight.bold, letterSpacing: 0.2)),
                                SizedBox(width: 8),
                                Icon(Icons.check_circle_outline_rounded, size: 20),
                              ]),
                      ),
                    ),
                    const SizedBox(height: 20),

                    Center(child: TextButton(
                      onPressed: _goToLogin,
                      child: Text('Already have an account? Sign in',
                          style: TextStyle(color: Colors.grey.shade400, fontSize: 13)),
                    )),
                  ]),
                ),
              ),
            ),
          )),
        ])),
      ]),
    );
  }

  Widget _label(String text) => Text(text, style: const TextStyle(
      fontSize: 13, fontWeight: FontWeight.w600, color: darkText));

  Widget _field({
    required TextEditingController controller,
    required String hint,
    required IconData icon,
    bool obscure = false,
    bool readOnly = false,
    TextInputType? keyboardType,
    Widget? suffixIcon,
  }) {
    return TextField(
      controller: controller,
      obscureText: obscure,
      readOnly: readOnly,
      keyboardType: keyboardType,
      style: const TextStyle(fontSize: 15, color: darkText),
      decoration: InputDecoration(
        hintText: hint,
        hintStyle: TextStyle(color: Colors.grey.shade400, fontSize: 15),
        prefixIcon: Icon(icon, color: readOnly ? primary : Colors.grey.shade400, size: 20),
        suffixIcon: suffixIcon,
        filled: true,
        fillColor: readOnly ? primary.withOpacity(0.04) : const Color(0xFFF8FAFC),
        contentPadding: const EdgeInsets.symmetric(vertical: 16, horizontal: 16),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: BorderSide(color: readOnly ? primary.withOpacity(0.2) : Colors.grey.shade200),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: const BorderSide(color: primary, width: 1.5),
        ),
      ),
    );
  }
}