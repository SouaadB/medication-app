import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:provider/provider.dart';
import '../config/api_config.dart';
import '../services/language_service.dart';

class ForgotPasswordPage extends StatefulWidget {
  const ForgotPasswordPage({super.key});

  @override
  State<ForgotPasswordPage> createState() => _ForgotPasswordPageState();
}

class _ForgotPasswordPageState extends State<ForgotPasswordPage> {
  final TextEditingController emailController = TextEditingController();
  bool _isLoading = false;
  String? _message;
  bool _isSuccess = false;

  Future<void> _sendResetLink() async {
    if (emailController.text.isEmpty) {
      setState(() => _message = 'Veuillez entrer votre email');
      return;
    }

    setState(() {
      _isLoading = true;
      _message = null;
      _isSuccess = false;
    });

    try {
      print('📤 Envoi à ${ApiConfig.baseUrl}/auth/request-reset-code');
      print('📤 Email: ${emailController.text.trim()}');
      
      final response = await http.post(
        Uri.parse('${ApiConfig.baseUrl}/auth/request-reset-code'),
        headers: ApiConfig.headers,
        body: jsonEncode({'email': emailController.text.trim()}),
      ).timeout(const Duration(seconds: 10));

      print('📥 Statut réponse: ${response.statusCode}');
      final data = jsonDecode(response.body);
      print('📥 Données reçues: $data');

      if (response.statusCode == 200 && data['success'] == true) {
        setState(() {
          _message = data['message'] ?? 'Code envoyé avec succès';
          _isSuccess = true;
        });
        
        String email = emailController.text.trim();
        print('📧 Redirection vers verifycode avec email: $email');
        
        Future.delayed(const Duration(seconds: 2), () {
          Navigator.pushNamed(
            context,
            '/verifycode?email=$email',
          );
        });
      } else {
        setState(() {
          _message = data['message'] ?? 'Erreur lors de l\'envoi';
          _isSuccess = false;
        });
      }
    } catch (e) {
      print('❌ Erreur: $e');
      setState(() {
        _message = '❌ Erreur de connexion au serveur';
        _isSuccess = false;
      });
    } finally {
      if (mounted) setState(() => _isLoading = false);
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
          languageService.translate('forgotPassword'),
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
                  Icons.lock_reset_rounded,
                  size: 80,
                  color: Colors.blue,
                ),
              ),
              const SizedBox(height: 40),
              
              Text(
                languageService.translate('resetPassword'),
                style: const TextStyle(
                  fontSize: 28,
                  fontWeight: FontWeight.bold,
                  color: Colors.blue,
                ),
              ),
              const SizedBox(height: 10),
              
              Text(
                '${languageService.translate('sendCode')}',
                style: const TextStyle(
                  fontSize: 16,
                  color: Colors.grey,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 40),
              
              TextField(
                controller: emailController,
                decoration: InputDecoration(
                  hintText: languageService.translate('email'),
                  prefixIcon: const Icon(Icons.email_outlined, color: Colors.blue),
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
                keyboardType: TextInputType.emailAddress,
              ),
              const SizedBox(height: 20),
              
              if (_message != null)
                Padding(
                  padding: const EdgeInsets.only(bottom: 20),
                  child: Text(
                    _message!,
                    style: TextStyle(
                      color: _isSuccess ? Colors.green : Colors.red,
                      fontWeight: FontWeight.w500,
                    ),
                    textAlign: TextAlign.center,
                  ),
                ),
              
              SizedBox(
                width: double.infinity,
                height: 55,
                child: ElevatedButton(
                  onPressed: _isLoading ? null : _sendResetLink,
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
                          languageService.translate('sendCode'),
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