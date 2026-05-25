import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:provider/provider.dart';
import '../config/api_config.dart';
import '../services/language_service.dart';

class VerifyCodePage extends StatefulWidget {
  final String email;
  const VerifyCodePage({super.key, required this.email});
  @override
  State<VerifyCodePage> createState() => _VerifyCodePageState();
}

class _VerifyCodePageState extends State<VerifyCodePage>
    with SingleTickerProviderStateMixin {
  final TextEditingController _codeController = TextEditingController();
  bool    _isLoading = false;
  String? _message;

  late AnimationController _animCtrl;
  late Animation<double>   _fadeAnim;
  late Animation<Offset>   _slideAnim;

  static const Color primary  = Color(0xFF1565C0);
  static const Color accent   = Color(0xFF64B5F6);
  static const Color darkText = Color(0xFF0F172A);

  @override
  void initState() {
    super.initState();
    _animCtrl  = AnimationController(vsync: this, duration: const Duration(milliseconds: 800));
    _fadeAnim  = CurvedAnimation(parent: _animCtrl, curve: Curves.easeOut);
    _slideAnim = Tween<Offset>(begin: const Offset(0, 0.08), end: Offset.zero)
        .animate(CurvedAnimation(parent: _animCtrl, curve: Curves.easeOutCubic));
    _animCtrl.forward();
  }

  @override
  void dispose() {
    _animCtrl.dispose();
    _codeController.dispose();
    super.dispose();
  }

  Future<void> _verifyCode() async {
    if (_codeController.text.isEmpty) {
      setState(() => _message = 'Please enter the verification code');
      return;
    }
    if (_codeController.text.length != 6) {
      setState(() => _message = 'The code must be 6 digits');
      return;
    }
    setState(() { _isLoading = true; _message = null; });
    try {
      final response = await http.post(
        Uri.parse('${ApiConfig.baseUrl}/auth/verify-reset-code'),
        headers: ApiConfig.headers,
        body: jsonEncode({
          'identifier': widget.email,
          'code':       _codeController.text.trim(),
        }),
      ).timeout(const Duration(seconds: 10));

      final data = jsonDecode(response.body);
      if (data['success'] == true && data['resetToken'] != null) {
        setState(() => _message = '✅ Code verified successfully');
        Future.delayed(const Duration(seconds: 1), () {
          Navigator.pushNamed(context, '/resetpassword', arguments: data['resetToken']);
        });
      } else {
        setState(() => _message = data['message'] ?? 'Invalid code');
      }
    } catch (_) {
      setState(() => _message = 'Connection error. Try again.');
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final lang = Provider.of<LanguageService>(context);
    return Scaffold(
      backgroundColor: primary,
       resizeToAvoidBottomInset: true,
      body: Stack(children: [
        Positioned(top: -60, right: -60,
          child: Container(width: 200, height: 200,
            decoration: BoxDecoration(shape: BoxShape.circle, color: accent.withOpacity(0.1)))),
        SafeArea(child: Column(children: [

          // header
          Padding(
            padding: const EdgeInsets.fromLTRB(20, 16, 28, 20),
            child: FadeTransition(opacity: _fadeAnim,
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
                  const Text('Verify Code', style: TextStyle(color: Colors.white,
                      fontSize: 20, fontWeight: FontWeight.w900, letterSpacing: -0.3)),
                  Text('Check your email inbox', style: TextStyle(
                      color: Colors.white.withOpacity(0.55), fontSize: 13)),
                ]),
              ]),
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
                padding: const EdgeInsets.fromLTRB(28, 40, 28, 32),
                child: SingleChildScrollView(
                child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [

                  Container(
                    width: 80, height: 80,
                    decoration: BoxDecoration(
                        color: primary.withOpacity(0.08), shape: BoxShape.circle),
                    child: const Icon(Icons.shield_outlined, size: 38, color: primary),
                  ),
                  const SizedBox(height: 20),

                  const Text('Enter verification code', style: TextStyle(fontSize: 22,
                      fontWeight: FontWeight.w900, color: darkText, letterSpacing: -0.3)),
                  const SizedBox(height: 8),
                  Text('We sent a 6-digit code to',
                      style: TextStyle(fontSize: 13, color: Colors.grey.shade500)),
                  const SizedBox(height: 4),
                  Text(widget.email, style: const TextStyle(
                      fontSize: 14, fontWeight: FontWeight.bold, color: primary)),
                  const SizedBox(height: 32),

                  // code input
                  TextField(
                    controller: _codeController,
                    keyboardType: TextInputType.number,
                    maxLength: 6,
                    textAlign: TextAlign.center,
                    style: const TextStyle(fontSize: 28, fontWeight: FontWeight.bold,
                        color: primary, letterSpacing: 12),
                    decoration: InputDecoration(
                      hintText: '------',
                      hintStyle: TextStyle(color: Colors.grey.shade300, fontSize: 28,
                          letterSpacing: 12),
                      counterText: '',
                      filled: true,
                      fillColor: primary.withOpacity(0.04),
                      contentPadding: const EdgeInsets.symmetric(vertical: 20, horizontal: 16),
                      enabledBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(16),
                        borderSide: BorderSide(color: primary.withOpacity(0.2)),
                      ),
                      focusedBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(16),
                        borderSide: const BorderSide(color: primary, width: 2),
                      ),
                    ),
                  ),

                  if (_message != null) ...[
                    const SizedBox(height: 12),
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: _message!.startsWith('✅')
                            ? Colors.green.shade50 : Colors.red.shade50,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: _message!.startsWith('✅')
                            ? Colors.green.shade100 : Colors.red.shade100),
                      ),
                      child: Row(children: [
                        Icon(_message!.startsWith('✅')
                            ? Icons.check_circle_outline_rounded
                            : Icons.error_outline_rounded,
                            color: _message!.startsWith('✅')
                                ? Colors.green.shade500 : Colors.red.shade400, size: 16),
                        const SizedBox(width: 8),
                        Flexible(child: Text(_message!, style: TextStyle(
                            color: _message!.startsWith('✅')
                                ? Colors.green.shade700 : Colors.red.shade700, fontSize: 13))),
                      ]),
                    ),
                  ],
                  const SizedBox(height: 28),

                  SizedBox(
                    width: double.infinity, height: 56,
                    child: ElevatedButton(
                      onPressed: _isLoading ? null : _verifyCode,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: primary, foregroundColor: Colors.white,
                        elevation: 0,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                      ),
                      child: _isLoading
                          ? const SizedBox(width: 22, height: 22,
                              child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2.5))
                          : Row(mainAxisAlignment: MainAxisAlignment.center, children: [
                              Text(lang.translate('verifyCode'), style: const TextStyle(
                                  fontSize: 17, fontWeight: FontWeight.bold)),
                              const SizedBox(width: 8),
                              const Icon(Icons.verified_outlined, size: 20),
                            ]),
                    ),
                  ),
                  const SizedBox(height: 16),
                  TextButton(
                    onPressed: () => Navigator.pop(context),
                    child: Text(lang.translate('back'),
                        style: TextStyle(color: Colors.grey.shade400, fontSize: 14)),
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
}