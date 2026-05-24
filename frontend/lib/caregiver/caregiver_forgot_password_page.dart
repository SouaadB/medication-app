import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:provider/provider.dart';
import '../config/api_config.dart';
import '../services/language_service.dart';

class CaregiverForgotPasswordPage extends StatefulWidget {
  const CaregiverForgotPasswordPage({super.key});

  @override
  State<CaregiverForgotPasswordPage> createState() => _CaregiverForgotPasswordPageState();
}

class _CaregiverForgotPasswordPageState extends State<CaregiverForgotPasswordPage>
    with SingleTickerProviderStateMixin {
  final TextEditingController emailController = TextEditingController();
  bool _isLoading = false;
  String? _message;
  bool _isSuccess = false;

  late AnimationController _animCtrl;
  late Animation<double> _fadeAnim;
  late Animation<Offset> _slideAnim;

  static const Color primary = Color(0xFF16A34A);
  static const Color primaryDk = Color(0xFF14532D);
  static const Color primaryLt = Color(0xFF4ADE80);
  static const Color darkText = Color(0xFF0F172A);

  @override
  void initState() {
    super.initState();
    _animCtrl = AnimationController(vsync: this, duration: const Duration(milliseconds: 800));
    _fadeAnim = CurvedAnimation(parent: _animCtrl, curve: Curves.easeOut);
    _slideAnim = Tween<Offset>(begin: const Offset(0, 0.08), end: Offset.zero)
        .animate(CurvedAnimation(parent: _animCtrl, curve: Curves.easeOutCubic));
    _animCtrl.forward();
  }

  @override
  void dispose() {
    _animCtrl.dispose();
    emailController.dispose();
    super.dispose();
  }

  Future<void> _sendResetLink() async {
    if (emailController.text.isEmpty) {
      setState(() { _message = 'Please enter your email'; _isSuccess = false; });
      return;
    }
    setState(() { _isLoading = true; _message = null; _isSuccess = false; });
    try {
      final response = await http.post(
        Uri.parse('${ApiConfig.baseUrl}/auth/caregiver/request-reset-code'),
        headers: ApiConfig.headers,
        body: jsonEncode({'email': emailController.text.trim()}),
      ).timeout(const Duration(seconds: 10));

      final data = jsonDecode(response.body);
      if (response.statusCode == 200 && data['success'] == true) {
        setState(() { _message = data['message'] ?? 'Code sent successfully'; _isSuccess = true; });
        Future.delayed(const Duration(seconds: 2), () {
          Navigator.pushNamed(context, '/caregiver-verify-code', arguments: emailController.text.trim());
        });
      } else {
        setState(() { _message = data['message'] ?? 'Failed to send code'; _isSuccess = false; });
      }
    } catch (_) {
      setState(() { _message = 'Connection error. Check your network.'; _isSuccess = false; });
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: primaryDk,
      body: Stack(children: [
        Positioned(top: -60, right: -60,
          child: Container(width: 220, height: 220,
            decoration: BoxDecoration(shape: BoxShape.circle, color: primaryLt.withOpacity(0.08)))),
        Positioned(top: 80, left: -80,
          child: Container(width: 200, height: 200,
            decoration: BoxDecoration(shape: BoxShape.circle, color: Colors.white.withOpacity(0.04)))),
        SafeArea(child: Column(children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(20, 16, 20, 20),
            child: FadeTransition(opacity: _fadeAnim,
              child: SlideTransition(position: _slideAnim,
                child: Row(children: [
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
                  const SizedBox(width: 16),
                  Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                    const Text('Forgot Password?', style: TextStyle(color: Colors.white,
                        fontSize: 20, fontWeight: FontWeight.w900, letterSpacing: -0.3)),
                    Text('Reset your caregiver access', style: TextStyle(
                        color: Colors.white.withOpacity(0.55), fontSize: 13)),
                  ]),
                ]),
              ),
            ),
          ),
          Expanded(child: FadeTransition(opacity: _fadeAnim,
            child: SlideTransition(position: _slideAnim,
              child: Container(
                width: double.infinity,
                decoration: const BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.only(
                    topLeft: Radius.circular(36), topRight: Radius.circular(36)),
                ),
                padding: const EdgeInsets.fromLTRB(28, 40, 28, 32),
                child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
                  Container(
                    width: 80, height: 80,
                    decoration: BoxDecoration(
                      color: primary.withOpacity(0.08),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(Icons.lock_reset_rounded, size: 38, color: primary),
                  ),
                  const SizedBox(height: 20),
                  const Text('Reset your password', style: TextStyle(fontSize: 22,
                      fontWeight: FontWeight.w900, color: darkText, letterSpacing: -0.3)),
                  const SizedBox(height: 8),
                  Text('Enter your email and we\'ll send you a verification code',
                      textAlign: TextAlign.center,
                      style: TextStyle(fontSize: 13, color: Colors.grey.shade500, height: 1.5)),
                  const SizedBox(height: 32),
                  Align(alignment: Alignment.centerLeft,
                    child: Text('Email Address', style: const TextStyle(
                        fontSize: 13, fontWeight: FontWeight.w600, color: darkText))),
                  const SizedBox(height: 8),
                  TextField(
                    controller: emailController,
                    keyboardType: TextInputType.emailAddress,
                    style: const TextStyle(fontSize: 15, color: darkText),
                    decoration: InputDecoration(
                      hintText: 'caregiver@email.com',
                      hintStyle: TextStyle(color: Colors.grey.shade400, fontSize: 14),
                      prefixIcon: Icon(Icons.mail_outline_rounded,
                          color: Colors.grey.shade400, size: 20),
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
                  ),
                  if (_message != null) ...[
                    const SizedBox(height: 12),
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: _isSuccess ? Colors.green.shade50 : Colors.red.shade50,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: _isSuccess
                            ? Colors.green.shade100 : Colors.red.shade100),
                      ),
                      child: Row(children: [
                        Icon(_isSuccess ? Icons.check_circle_outline_rounded
                            : Icons.error_outline_rounded,
                            color: _isSuccess ? Colors.green.shade500 : Colors.red.shade400, size: 16),
                        const SizedBox(width: 8),
                        Flexible(child: Text(_message!, style: TextStyle(
                            color: _isSuccess ? Colors.green.shade700 : Colors.red.shade700,
                            fontSize: 13))),
                      ]),
                    ),
                  ],
                  const SizedBox(height: 28),
                  SizedBox(
                    width: double.infinity, height: 56,
                    child: ElevatedButton(
                      onPressed: _isLoading ? null : _sendResetLink,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: primary,
                        foregroundColor: Colors.white,
                        elevation: 0,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                      ),
                      child: _isLoading
                          ? const SizedBox(width: 22, height: 22,
                              child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2.5))
                          : Row(mainAxisAlignment: MainAxisAlignment.center, children: [
                              const Text('Send Code', style: TextStyle(
                                  fontSize: 17, fontWeight: FontWeight.bold)),
                              const SizedBox(width: 8),
                              const Icon(Icons.send_rounded, size: 18),
                            ]),
                    ),
                  ),
                  const SizedBox(height: 16),
                  TextButton(
                    onPressed: () => Navigator.pop(context),
                    child: Text('Back',
                        style: TextStyle(color: Colors.grey.shade400, fontSize: 14)),
                  ),
                ]),
              ),
            ),
          )),
        ])),
      ]),
    );
  }
}