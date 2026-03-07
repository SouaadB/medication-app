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

class _VerifyCodePageState extends State<VerifyCodePage> {
  final TextEditingController _codeController = TextEditingController();
  bool _isLoading = false;
  String? _message;

  @override
  void initState() {
    super.initState();
    print('📧 Email reçu dans VerifyCodePage: ${widget.email}');
  }

  Future<void> _verifyCode() async {
    if (_codeController.text.isEmpty) {
      setState(() => _message = 'Veuillez entrer le code reçu');
      return;
    }

    if (_codeController.text.length != 6) {
      setState(() => _message = 'Le code doit contenir 6 chiffres');
      return;
    }

    setState(() {
      _isLoading = true;
      _message = null;
    });

    try {
      print('📤 Envoi à ${ApiConfig.baseUrl}/auth/verify-reset-code');
      print('📤 Email: ${widget.email}, Code: ${_codeController.text.trim()}');
      
      final response = await http.post(
        Uri.parse('${ApiConfig.baseUrl}/auth/verify-reset-code'),
        headers: ApiConfig.headers,
        body: jsonEncode({
          'identifier': widget.email,
          'code': _codeController.text.trim(),
        }),
      ).timeout(const Duration(seconds: 10));

      print('📥 Statut réponse: ${response.statusCode}');
      final data = jsonDecode(response.body);
      print('📥 Données reçues: $data');

      if (data['success'] == true) {
        print('🔑 Token reçu: ${data['resetToken']}');
        
        if (data['resetToken'] != null && data['resetToken'].toString().isNotEmpty) {
          setState(() {
            _message = '✅ Code vérifié avec succès';
          });
          
          Future.delayed(const Duration(seconds: 1), () {
            Navigator.pushNamed(
              context,
              '/resetpassword',
              arguments: data['resetToken'],
            );
          });
        } else {
          setState(() {
            _message = '❌ Token manquant dans la réponse';
          });
        }
      } else {
        setState(() {
          _message = '❌ ${data['message'] ?? 'Code invalide'}';
        });
      }
    } catch (e) {
      print('❌ Erreur: $e');
      setState(() {
        _message = '❌ Erreur de connexion au serveur';
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final languageService = Provider.of<LanguageService>(context);
    
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        elevation: 0,
        backgroundColor: Colors.white,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios, color: Colors.blue),
          onPressed: () => Navigator.pop(context),
        ),
        title: Text(
          languageService.translate('verifyCode'),
          style: const TextStyle(color: Colors.blue, fontWeight: FontWeight.bold),
        ),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 30.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: Colors.blue.withOpacity(0.1),
                  shape: BoxShape.circle,
                ),
                child: const Icon(
                  Icons.security_rounded,
                  size: 80,
                  color: Colors.blue,
                ),
              ),
              const SizedBox(height: 40),
              Text(
                languageService.translate('verifyCode'),
                style: const TextStyle(
                  fontSize: 28,
                  fontWeight: FontWeight.bold,
                  color: Colors.blue,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 10),
              Text(
                languageService.translate('codeSent'),
                style: const TextStyle(
                  fontSize: 16,
                  color: Colors.grey,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 8),
              Text(
                widget.email,
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: Colors.blue,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 40),
              TextField(
                controller: _codeController,
                decoration: InputDecoration(
                  hintText: languageService.translate('enterCode'),
                  prefixIcon: const Icon(Icons.pin_outlined, color: Colors.blue),
                  helperText: languageService.translate('enterCode'),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: BorderSide(color: Colors.grey.shade300),
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: BorderSide(color: Colors.grey.shade300),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: const BorderSide(color: Colors.blue, width: 2),
                  ),
                ),
                keyboardType: TextInputType.number,
                maxLength: 6,
              ),
              const SizedBox(height: 20),
              if (_message != null)
                Padding(
                  padding: const EdgeInsets.only(bottom: 20),
                  child: Text(
                    _message!,
                    style: TextStyle(
                      color: _message!.startsWith('✅') ? Colors.green : Colors.red,
                      fontWeight: FontWeight.w500,
                    ),
                    textAlign: TextAlign.center,
                  ),
                ),
              SizedBox(
                width: double.infinity,
                height: 55,
                child: ElevatedButton(
                  onPressed: _isLoading ? null : _verifyCode,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.blue,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                    elevation: 0,
                  ),
                  child: _isLoading
                      ? const SizedBox(
                          height: 24,
                          width: 24,
                          child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2),
                        )
                      : Text(
                          languageService.translate('verifyCode'),
                          style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                        ),
                ),
              ),
              const SizedBox(height: 20),
              TextButton(
                onPressed: () => Navigator.pop(context),
                child: Text(
                  languageService.translate('back'),
                  style: const TextStyle(
                    color: Colors.blue,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}