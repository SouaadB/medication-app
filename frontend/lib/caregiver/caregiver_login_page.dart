import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../config/api_config.dart';
import 'caregiver_dashboard.dart';
import '../auth/sign_in_page.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'caregiver_forgot_password_page.dart';

class CaregiverLoginPage extends StatefulWidget {
  const CaregiverLoginPage({super.key});

  @override
  State<CaregiverLoginPage> createState() => _CaregiverLoginPageState();
}

class _CaregiverLoginPageState extends State<CaregiverLoginPage>
    with SingleTickerProviderStateMixin {
  final TextEditingController _emailController    = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();

  bool    _isLoading       = false;
  bool    _obscurePassword = true;
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

  Future<void> _login() async {
    if (_emailController.text.trim().isEmpty || _passwordController.text.isEmpty) {
      setState(() => _errorMessage = 'Please fill in all fields');
      return;
    }
    setState(() { _isLoading = true; _errorMessage = null; });
    try {
      String? fcmToken;
      try { fcmToken = await FirebaseMessaging.instance.getToken(); } catch (_) {}

      final response = await http.post(
        Uri.parse('${ApiConfig.baseUrl}/auth/login'),
        headers: ApiConfig.headers,
        body: jsonEncode({
          'identifier': _emailController.text.trim(),
          'password':   _passwordController.text,
          'fcmToken':   fcmToken,
        }),
      ).timeout(const Duration(seconds: 10));

      final data = jsonDecode(response.body);
      if (response.statusCode == 200 && data['success'] == true) {
        final role = data['user']['role'];
        if (role == 'caregiver') {
          final prefs = await SharedPreferences.getInstance();
          await prefs.setString('auth_token', data['token']);
          await prefs.setString('user_name',  data['user']['name']  ?? '');
          await prefs.setString('user_email', data['user']['email'] ?? '');
          await prefs.setString('user_role',  role);
          await prefs.setInt('user_id', data['user']['id'] as int? ?? 0);
          final isFirstSet = prefs.containsKey('caregiver_first_login');
          if (!isFirstSet) await prefs.setBool('caregiver_first_login', true);
          if (mounted) {
            Navigator.pushReplacement(context,
                MaterialPageRoute(builder: (_) => const CaregiverDashboard()));
          }
        } else {
          setState(() => _errorMessage = 'This account is not a caregiver account');
        }
      } else {
        setState(() => _errorMessage = data['message'] ?? 'Invalid email or password');
      }
    } catch (e) {
      setState(() => _errorMessage = 'Connection error. Check your network.');
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: primaryDk,
      body: Stack(children: [
        // decorative circles
        Positioned(top: -60, right: -60,
          child: Container(width: 220, height: 220,
            decoration: BoxDecoration(shape: BoxShape.circle,
                color: primaryLt.withOpacity(0.08)))),
        Positioned(top: 80, left: -80,
          child: Container(width: 200, height: 200,
            decoration: BoxDecoration(shape: BoxShape.circle,
                color: Colors.white.withOpacity(0.04)))),
        Positioned(bottom: 200, right: -40,
          child: Container(width: 140, height: 140,
            decoration: BoxDecoration(shape: BoxShape.circle,
                color: primaryLt.withOpacity(0.05)))),

        SafeArea(child: Column(children: [
          // ✅ Back button row at top
          Padding(
            padding: const EdgeInsets.fromLTRB(20, 16, 20, 0),
            child: Row(
              children: [
                GestureDetector(
                  onTap: () => Navigator.pop(context),
                  child: Container(
                    width: 42, height: 42,
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.12),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: const Icon(Icons.arrow_back_rounded, color: Colors.white, size: 20),
                  ),
                ),
              ],
            ),
          ),

          // top header
          Padding(
            padding: const EdgeInsets.fromLTRB(28, 16, 28, 28),
            child: FadeTransition(opacity: _fadeAnim,
              child: SlideTransition(position: _slideAnim,
                child: Column(children: [
                  Container(
                    width: 78, height: 78,
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(24),
                      boxShadow: [
                        BoxShadow(color: primaryLt.withOpacity(0.5), blurRadius: 28, spreadRadius: 2),
                        BoxShadow(color: Colors.black.withOpacity(0.25), blurRadius: 14, offset: const Offset(0, 6)),
                      ],
                    ),
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(24),
                      child: Image.asset('assets/icon/app_icon.png', width: 78, height: 78, fit: BoxFit.cover),
                    ),
                  ),
                  const SizedBox(height: 18),
                  const Text('MediCare', style: TextStyle(color: Colors.white, fontSize: 26,
                      fontWeight: FontWeight.w900, letterSpacing: -0.5)),
                  const SizedBox(height: 4),
                  Text('Caregiver Portal', style: TextStyle(color: Colors.white.withOpacity(0.55),
                      fontSize: 13, letterSpacing: 2, fontWeight: FontWeight.w500)),
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
                    // badge
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                      decoration: BoxDecoration(
                        color: primary.withOpacity(0.08),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Row(mainAxisSize: MainAxisSize.min, children: [
                        Container(width: 6, height: 6,
                            decoration: const BoxDecoration(color: primary, shape: BoxShape.circle)),
                        const SizedBox(width: 6),
                        const Text('Secure Access', style: TextStyle(fontSize: 11,
                            color: primary, fontWeight: FontWeight.bold, letterSpacing: 0.5)),
                      ]),
                    ),
                    const SizedBox(height: 16),
                    const Text('Welcome back', style: TextStyle(fontSize: 30,
                        fontWeight: FontWeight.w900, color: darkText,
                        height: 1.1, letterSpacing: -0.5)),
                    const SizedBox(height: 6),
                    Text('Monitor your patients and keep them safe',
                        style: TextStyle(fontSize: 13, color: Colors.grey.shade500)),
                    const SizedBox(height: 32),

                    // email
                    _label('Email Address'),
                    const SizedBox(height: 8),
                    _field(controller: _emailController, hint: 'your@email.com',
                        icon: Icons.mail_outline_rounded,
                        keyboardType: TextInputType.emailAddress),
                    const SizedBox(height: 18),

                    // password
                    _label('Password'),
                    const SizedBox(height: 8),
                    _field(
                      controller: _passwordController,
                      hint: '••••••••',
                      icon: Icons.lock_outline_rounded,
                      obscure: _obscurePassword,
                      suffixIcon: IconButton(
                        onPressed: () => setState(() => _obscurePassword = !_obscurePassword),
                        icon: Icon(_obscurePassword
                            ? Icons.visibility_off_outlined : Icons.visibility_outlined,
                            color: Colors.grey.shade400, size: 20),
                      ),
                    ),

                    // Forgot Password link
                    const SizedBox(height: 8),
                    Align(
                      alignment: Alignment.centerRight,
                      child: TextButton(
                        onPressed: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(builder: (_) => const CaregiverForgotPasswordPage()),
                          );
                        },
                        style: TextButton.styleFrom(padding: EdgeInsets.zero),
                        child: Text(
                          'Forgot Password?',
                          style: TextStyle(
                            color: primary,
                            fontWeight: FontWeight.w600,
                            fontSize: 13,
                          ),
                        ),
                      ),
                    ),

                    // error
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

                    // sign in button
                    SizedBox(
                      width: double.infinity, height: 56,
                      child: ElevatedButton(
                        onPressed: _isLoading ? null : _login,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: primary,
                          foregroundColor: Colors.white,
                          elevation: 0,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                        ),
                        child: _isLoading
                            ? const SizedBox(width: 22, height: 22,
                                child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2.5))
                            : const Row(mainAxisAlignment: MainAxisAlignment.center, children: [
                                Text('Sign In', style: TextStyle(fontSize: 17,
                                    fontWeight: FontWeight.bold, letterSpacing: 0.2)),
                                SizedBox(width: 8),
                                Icon(Icons.arrow_forward_rounded, size: 20),
                              ]),
                      ),
                    ),
                    const SizedBox(height: 24),

                    const SizedBox(height: 20),

                    Row(children: [
                      Expanded(child: Divider(color: Colors.grey.shade200)),
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 16),
                        child: Text('or', style: TextStyle(color: Colors.grey.shade400, fontSize: 12)),
                      ),
                      Expanded(child: Divider(color: Colors.grey.shade200)),
                    ]),
                    const SizedBox(height: 16),
                    SizedBox(
                      width: double.infinity, height: 50,
                      child: OutlinedButton(
                        onPressed: () => Navigator.pushReplacement(context,
                            MaterialPageRoute(builder: (_) => const SignInPage())),
                        style: OutlinedButton.styleFrom(
                          side: BorderSide(color: Colors.grey.shade200),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                        ),
                        child: Row(mainAxisAlignment: MainAxisAlignment.center, children: [
                          Icon(Icons.person_outline_rounded, size: 18, color: Colors.grey.shade600),
                          const SizedBox(width: 10),
                          Text('Patient Login',
                              style: TextStyle(fontSize: 15, fontWeight: FontWeight.w600,
                                  color: Colors.grey.shade700)),
                        ]),
                      ),
                    ),
                    const SizedBox(height: 12),
                    Center(child: Text('New here? Ask your patient to send you an invitation.',
                        textAlign: TextAlign.center,
                        style: TextStyle(color: Colors.grey.shade400, fontSize: 12))),
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
    TextInputType? keyboardType,
    Widget? suffixIcon,
  }) {
    return TextField(
      controller: controller,
      obscureText: obscure,
      keyboardType: keyboardType,
      style: const TextStyle(fontSize: 15, color: darkText),
      decoration: InputDecoration(
        hintText: hint,
        hintStyle: TextStyle(color: Colors.grey.shade400, fontSize: 15),
        prefixIcon: Icon(icon, color: Colors.grey.shade400, size: 20),
        suffixIcon: suffixIcon,
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
}