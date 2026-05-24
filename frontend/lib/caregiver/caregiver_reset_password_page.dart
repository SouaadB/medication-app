import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:provider/provider.dart';
import '../config/api_config.dart';
import '../services/language_service.dart';

class CaregiverResetPasswordPage extends StatefulWidget {
  final String resetToken;
  final String email;
  const CaregiverResetPasswordPage({super.key, required this.resetToken, required this.email});

  @override
  State<CaregiverResetPasswordPage> createState() => _CaregiverResetPasswordPageState();
}

class _CaregiverResetPasswordPageState extends State<CaregiverResetPasswordPage>
    with SingleTickerProviderStateMixin {
  final _newPasswordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();
  bool _obscureNew = true;
  bool _obscureConfirm = true;
  bool _isLoading = false;
  String? _error;

  bool _hasMinLength = false;
  bool _hasUppercase = false;
  bool _hasLowercase = false;
  bool _hasNumber = false;
  bool _hasSpecialChar = false;

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
    _newPasswordController.addListener(_checkStrength);
    _animCtrl = AnimationController(vsync: this, duration: const Duration(milliseconds: 800));
    _fadeAnim = CurvedAnimation(parent: _animCtrl, curve: Curves.easeOut);
    _slideAnim = Tween<Offset>(begin: const Offset(0, 0.08), end: Offset.zero)
        .animate(CurvedAnimation(parent: _animCtrl, curve: Curves.easeOutCubic));
    _animCtrl.forward();
  }

  @override
  void dispose() {
    _animCtrl.dispose();
    _newPasswordController.dispose();
    _confirmPasswordController.dispose();
    super.dispose();
  }

  void _checkStrength() {
    final p = _newPasswordController.text;
    setState(() {
      _hasMinLength = p.length >= 8;
      _hasUppercase = RegExp(r'[A-Z]').hasMatch(p);
      _hasLowercase = RegExp(r'[a-z]').hasMatch(p);
      _hasNumber = RegExp(r'[0-9]').hasMatch(p);
      // ✅ Fixed: properly escaped regex for special characters
      _hasSpecialChar = RegExp(r'[!@#\$&*~]').hasMatch(p);
    });
  }

  bool _isValid(String p) =>
      p.length >= 8 &&
      RegExp(r'[a-z]').hasMatch(p) &&
      RegExp(r'[A-Z]').hasMatch(p) &&
      RegExp(r'[!@#\$&*~]').hasMatch(p);

  Future<void> _reset() async {
    setState(() { _isLoading = true; _error = null; });
    final newPw = _newPasswordController.text;
    final confirmPw = _confirmPasswordController.text;
    if (newPw != confirmPw) {
      setState(() { _error = 'Passwords do not match'; _isLoading = false; });
      return;
    }
    if (!_isValid(newPw)) {
      setState(() { _error = 'Password does not meet requirements'; _isLoading = false; });
      return;
    }
    try {
      final response = await http.post(
        Uri.parse('${ApiConfig.baseUrl}/auth/caregiver/reset-password'),
        headers: ApiConfig.headers,
        body: jsonEncode({'resetToken': widget.resetToken, 'newPassword': newPw}),
      ).timeout(const Duration(seconds: 10));
      final data = jsonDecode(response.body);
      if (data['success'] == true) {
        if (mounted) _showSuccess();
      } else {
        setState(() { _error = data['message'] ?? 'An error occurred'; _isLoading = false; });
      }
    } catch (_) {
      setState(() { _error = 'Connection error. Try again.'; _isLoading = false; });
    }
  }

  void _showSuccess() {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (_) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        content: Column(mainAxisSize: MainAxisSize.min, children: [
          Container(
            width: 72, height: 72,
            decoration: BoxDecoration(color: Colors.green.shade50, shape: BoxShape.circle),
            child: Icon(Icons.check_circle_rounded, color: Colors.green.shade500, size: 44),
          ),
          const SizedBox(height: 20),
          const Text('Password Reset!', style: TextStyle(fontSize: 20,
              fontWeight: FontWeight.bold, color: darkText)),
          const SizedBox(height: 8),
          Text('Your caregiver password has been updated successfully.',
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 13, color: Colors.grey.shade600, height: 1.4)),
          const SizedBox(height: 24),
          SizedBox(
            width: double.infinity, height: 48,
            child: ElevatedButton(
              onPressed: () {
                Navigator.of(context).pop();
                Navigator.of(context).pushReplacementNamed('/caregiver-login');
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: primary,
                foregroundColor: Colors.white,
                elevation: 0,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
              child: const Text('Sign In Now', style: TextStyle(fontWeight: FontWeight.bold)),
            ),
          ),
        ]),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: primaryDk,
      body: Stack(children: [
        Positioned(top: -60, right: -60,
          child: Container(width: 220, height: 220,
            decoration: BoxDecoration(shape: BoxShape.circle, color: primaryLt.withOpacity(0.08)))),
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
                    const Text('New Password', style: TextStyle(color: Colors.white,
                        fontSize: 20, fontWeight: FontWeight.w900, letterSpacing: -0.3)),
                    Text('Create a strong password', style: TextStyle(
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
                child: SingleChildScrollView(
                  padding: const EdgeInsets.fromLTRB(28, 36, 28, 32),
                  child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                    Container(
                      width: 64, height: 64,
                      decoration: BoxDecoration(
                          color: primary.withOpacity(0.08), shape: BoxShape.circle),
                      child: const Icon(Icons.password_rounded, size: 30, color: primary),
                    ),
                    const SizedBox(height: 16),
                    const Text('Set new password', style: TextStyle(fontSize: 22,
                        fontWeight: FontWeight.w900, color: darkText, letterSpacing: -0.3)),
                    const SizedBox(height: 6),
                    Text('Make it strong and memorable',
                        style: TextStyle(fontSize: 13, color: Colors.grey.shade500)),
                    const SizedBox(height: 28),
                    const Text('New Password', style: TextStyle(
                        fontSize: 13, fontWeight: FontWeight.w600, color: darkText)),
                    const SizedBox(height: 8),
                    _pwField(
                      controller: _newPasswordController,
                      hint: 'Min 8 characters',
                      obscure: _obscureNew,
                      onToggle: () => setState(() => _obscureNew = !_obscureNew),
                    ),
                    const SizedBox(height: 16),
                    Container(
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        color: const Color(0xFFF8FAFC),
                        borderRadius: BorderRadius.circular(14),
                        border: Border.all(color: Colors.grey.shade200),
                      ),
                      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                        Text('Password Requirements',
                            style: const TextStyle(fontWeight: FontWeight.bold,
                                color: primary, fontSize: 12)),
                        const SizedBox(height: 10),
                        _criterion('Minimum 8 characters', _hasMinLength),
                        _criterion('One uppercase letter', _hasUppercase),
                        _criterion('One lowercase letter', _hasLowercase),
                        _criterion('One number', _hasNumber),
                        _criterion('One special character (!@#\$&*~)', _hasSpecialChar),
                      ]),
                    ),
                    const SizedBox(height: 16),
                    const Text('Confirm Password', style: TextStyle(
                        fontSize: 13, fontWeight: FontWeight.w600, color: darkText)),
                    const SizedBox(height: 8),
                    _pwField(
                      controller: _confirmPasswordController,
                      hint: 'Repeat new password',
                      obscure: _obscureConfirm,
                      onToggle: () => setState(() => _obscureConfirm = !_obscureConfirm),
                    ),
                    if (_error != null) ...[
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
                          Flexible(child: Text(_error!,
                              style: TextStyle(color: Colors.red.shade700, fontSize: 13))),
                        ]),
                      ),
                    ],
                    const SizedBox(height: 28),
                    SizedBox(
                      width: double.infinity, height: 56,
                      child: ElevatedButton(
                        onPressed: _isLoading ? null : _reset,
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
                                const Text('Reset Password', style: TextStyle(
                                    fontSize: 17, fontWeight: FontWeight.bold)),
                                const SizedBox(width: 8),
                                const Icon(Icons.lock_reset_rounded, size: 20),
                              ]),
                      ),
                    ),
                  ]),
                ),
              ),
            ),
          )),
        ])),
      ]),
    );
  }

  Widget _pwField({
    required TextEditingController controller,
    required String hint,
    required bool obscure,
    required VoidCallback onToggle,
  }) {
    return TextField(
      controller: controller,
      obscureText: obscure,
      style: const TextStyle(fontSize: 15, color: darkText),
      decoration: InputDecoration(
        hintText: hint,
        hintStyle: TextStyle(color: Colors.grey.shade400, fontSize: 14),
        prefixIcon: Icon(Icons.lock_outline_rounded, color: Colors.grey.shade400, size: 20),
        suffixIcon: IconButton(
          onPressed: onToggle,
          icon: Icon(obscure ? Icons.visibility_off_outlined : Icons.visibility_outlined,
              color: Colors.grey.shade400, size: 20),
        ),
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

  Widget _criterion(String text, bool met) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 3),
      child: Row(children: [
        Icon(met ? Icons.check_circle_rounded : Icons.circle_outlined,
            size: 15,
            color: met ? Colors.green.shade500 : Colors.grey.shade400),
        const SizedBox(width: 8),
        Text(text, style: TextStyle(
            fontSize: 12,
            color: met ? Colors.green.shade700 : Colors.grey.shade600,
            decoration: met ? TextDecoration.lineThrough : null)),
      ]),
    );
  }
}