import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:provider/provider.dart';
import '../config/api_config.dart';
import '../services/language_service.dart';
import '../services/notification_service.dart';
import '../caregiver/caregiver_login_page.dart';

class SignInPage extends StatefulWidget {
  const SignInPage({super.key});
  @override
  State<SignInPage> createState() => _SignInPageState();
}

class _SignInPageState extends State<SignInPage>
    with SingleTickerProviderStateMixin {
  final TextEditingController _identifierController = TextEditingController();
  final TextEditingController _passwordController   = TextEditingController();
  bool    _isLoading       = false;
  bool    _obscurePassword = true;
  String? _errorMessage;

  late AnimationController _animCtrl;
  late Animation<double>   _fadeAnim;
  late Animation<Offset>   _slideAnim;

  static const Color primary   = Color(0xFF1565C0);
  static const Color primaryLt = Color(0xFF1E88E5);
  static const Color accent    = Color(0xFF64B5F6);
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
    _identifierController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  Future<void> _login() async {
    if (_identifierController.text.isEmpty || _passwordController.text.isEmpty) {
      setState(() => _errorMessage = 'Please fill in all fields');
      return;
    }
    setState(() { _isLoading = true; _errorMessage = null; });
    try {
      final response = await http.post(
        Uri.parse('${ApiConfig.baseUrl}/auth/login'),
        headers: ApiConfig.headers,
        body: jsonEncode({
          'identifier': _identifierController.text.trim(),
          'password':   _passwordController.text,
        }),
      ).timeout(const Duration(seconds: 10));

      final data = jsonDecode(response.body);

      if (response.statusCode == 200 && data['success'] == true) {
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('auth_token',  data['token']);
        await prefs.setString('user_name',   data['user']['name']  ?? '');
        await prefs.setString('user_email',  data['user']['email'] ?? '');
        await prefs.setString('user_role',   data['user']['role']  ?? '');
        await prefs.setString('api_url',     ApiConfig.baseUrl);

        try {
          if (data['user']['role'] == 'patient') {
            await NotificationService.sendTokenToBackend(data['token'], ApiConfig.baseUrl);
          }
        } catch (_) {}

        if (mounted) {
          final role = data['user']['role'];
          if (role == 'admin') {
  Navigator.pushReplacementNamed(context, '/admin');
} else if (role == 'caregiver') {
  setState(() => _errorMessage = 'This is the patient portal. Please use the Caregiver Login button below.');
  final prefs = await SharedPreferences.getInstance();
  await prefs.remove('auth_token'); // clear the token
  setState(() => _isLoading = false);
  return;
} else {
            try {
              final profileResponse = await http.get(
                Uri.parse('${ApiConfig.baseUrl}/profile/me'),
                headers: ApiConfig.getAuthHeaders(data['token']),
              ).timeout(const Duration(seconds: 5));
              if (profileResponse.statusCode == 200) {
                final profileData = jsonDecode(profileResponse.body);
                final hasAge = profileData['profile']['age'] != null;
                await prefs.setBool('profile_completed', hasAge);
                Navigator.pushReplacementNamed(context, hasAge ? '/patientinterface' : '/setupprofile');
              } else {
                final profileCompleted = prefs.getBool('profile_completed') ?? false;
                Navigator.pushReplacementNamed(context, profileCompleted ? '/patientinterface' : '/setupprofile');
              }
            } catch (_) {
              final profileCompleted = prefs.getBool('profile_completed') ?? false;
              Navigator.pushReplacementNamed(context, profileCompleted ? '/patientinterface' : '/setupprofile');
            }
          }
        }
      } else {
        if (response.statusCode == 403 && data['error_code'] == 'EMAIL_NOT_VERIFIED') {
          setState(() => _errorMessage = 
            'Please verify your email before logging in. Check your inbox for the verification link.');
        } else {
          setState(() => _errorMessage = data['message'] ?? 'Invalid email or password');
        }
      }
    } catch (_) {
      if (mounted) setState(() => _errorMessage = 'Connection error. Check your network.');
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final lang = Provider.of<LanguageService>(context);
    return Scaffold(
      backgroundColor: primary,
      body: Stack(children: [
        // decorative circles
        Positioned(top: -70, right: -70,
          child: Container(width: 240, height: 240,
            decoration: BoxDecoration(shape: BoxShape.circle,
                color: accent.withOpacity(0.12)))),
        Positioned(top: 100, left: -80,
          child: Container(width: 180, height: 180,
            decoration: BoxDecoration(shape: BoxShape.circle,
                color: Colors.white.withOpacity(0.04)))),
        Positioned(bottom: 250, right: -50,
          child: Container(width: 160, height: 160,
            decoration: BoxDecoration(shape: BoxShape.circle,
                color: accent.withOpacity(0.06)))),

        SafeArea(child: Column(children: [

          // header
          Padding(
            padding: const EdgeInsets.fromLTRB(28, 32, 28, 24),
            child: FadeTransition(opacity: _fadeAnim,
              child: SlideTransition(position: _slideAnim,
                child: Column(children: [
                  Container(
                    width: 78, height: 78,
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(24),
                      boxShadow: [
                        BoxShadow(color: accent.withOpacity(0.5), blurRadius: 28, spreadRadius: 2),
                        BoxShadow(color: Colors.black.withOpacity(0.2), blurRadius: 14, offset: const Offset(0, 6)),
                      ],
                    ),
                    child: const Icon(Icons.favorite_rounded, size: 36, color: primary),
                  ),
                  const SizedBox(height: 18),
                  const Text('MediCare', style: TextStyle(color: Colors.white, fontSize: 26,
                      fontWeight: FontWeight.w900, letterSpacing: -0.5)),
                  const SizedBox(height: 4),
                  Text('Patient Portal', style: TextStyle(color: Colors.white.withOpacity(0.55),
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
                        const Text('Secure Login', style: TextStyle(fontSize: 11,
                            color: primary, fontWeight: FontWeight.bold, letterSpacing: 0.5)),
                      ]),
                    ),
                    const SizedBox(height: 16),

                    const Text('Welcome back', style: TextStyle(fontSize: 30,
                        fontWeight: FontWeight.w900, color: darkText,
                        height: 1.1, letterSpacing: -0.5)),
                    const SizedBox(height: 6),
                    Text('Sign in to manage your medications',
                        style: TextStyle(fontSize: 13, color: Colors.grey.shade500)),
                    const SizedBox(height: 32),

                    _label('Email or Phone'),
                    const SizedBox(height: 8),
                    _field(controller: _identifierController,
                        hint: 'email@example.com or 0612345678',
                        icon: Icons.person_outline_rounded,
                        keyboardType: TextInputType.emailAddress),
                    const SizedBox(height: 18),

                    _label(lang.translate('password')),
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
                    const SizedBox(height: 8),

                    Align(
                      alignment: Alignment.centerRight,
                      child: TextButton(
                        onPressed: () => Navigator.pushNamed(context, '/forgotpassword'),
                        style: TextButton.styleFrom(padding: EdgeInsets.zero),
                        child: const Text('Forgot password?',
                            style: TextStyle(color: primary, fontWeight: FontWeight.w600, fontSize: 13)),
                      ),
                    ),

                    if (_errorMessage != null) ...[
                      const SizedBox(height: 4),
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
                    const SizedBox(height: 24),

                    // sign in button
                    SizedBox(
                      width: double.infinity, height: 56,
                      child: ElevatedButton(
                        onPressed: _isLoading ? null : _login,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: primary, foregroundColor: Colors.white,
                          elevation: 0,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                        ),
                        child: _isLoading
                            ? const SizedBox(width: 22, height: 22,
                                child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2.5))
                            : Row(mainAxisAlignment: MainAxisAlignment.center, children: [
                                Text(lang.translate('login'), style: const TextStyle(
                                    fontSize: 17, fontWeight: FontWeight.bold, letterSpacing: 0.2)),
                                const SizedBox(width: 8),
                                const Icon(Icons.arrow_forward_rounded, size: 20),
                              ]),
                      ),
                    ),
                    const SizedBox(height: 20),

                    Center(child: Wrap(alignment: WrapAlignment.center, spacing: 4, children: [
                      Text(lang.translate('noAccount'),
                          style: TextStyle(color: Colors.grey.shade500, fontSize: 14)),
                      GestureDetector(
                        onTap: () => Navigator.pushNamed(context, '/signup'),
                        child: Text(lang.translate('signUp'),
                            style: const TextStyle(color: primary,
                                fontWeight: FontWeight.bold, fontSize: 14)),
                      ),
                    ])),
                    const SizedBox(height: 28),

                    // divider
                    Row(children: [
                      Expanded(child: Divider(color: Colors.grey.shade200)),
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 16),
                        child: Text('Are you a caregiver?',
                            style: TextStyle(color: Colors.grey.shade400, fontSize: 12)),
                      ),
                      Expanded(child: Divider(color: Colors.grey.shade200)),
                    ]),
                    const SizedBox(height: 16),

                    SizedBox(
                      width: double.infinity, height: 50,
                      child: OutlinedButton(
                        onPressed: () => Navigator.push(context,
                            MaterialPageRoute(builder: (_) => const CaregiverLoginPage())),
                        style: OutlinedButton.styleFrom(
                          side: BorderSide(color: Colors.grey.shade200),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                        ),
                        child: Row(mainAxisAlignment: MainAxisAlignment.center, children: [
                          Icon(Icons.family_restroom_rounded, size: 18, color: Colors.grey.shade600),
                          const SizedBox(width: 10),
                          Text('Caregiver Login', style: TextStyle(
                              fontSize: 15, fontWeight: FontWeight.w600, color: Colors.grey.shade700)),
                        ]),
                      ),
                    ),
                    const SizedBox(height: 8),
                  ]),
                ),
              ),
            ),
          )),
        ])),
      ]),
    );
  }

  Widget _label(String text) => Padding(
    padding: const EdgeInsets.only(bottom: 0),
    child: Text(text, style: const TextStyle(
        fontSize: 13, fontWeight: FontWeight.w600, color: darkText)),
  );

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
        hintStyle: TextStyle(color: Colors.grey.shade400, fontSize: 14),
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