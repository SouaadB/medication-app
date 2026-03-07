import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:provider/provider.dart';
import '../config/api_config.dart';
import '../services/language_service.dart';

class SignInPage extends StatefulWidget {
  const SignInPage({super.key});

  @override
  State<SignInPage> createState() => _SignInPageState();
}

class _SignInPageState extends State<SignInPage> {
  final TextEditingController _identifierController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  bool _isLoading = false;
  String? _errorMessage;

  Future<void> _login() async {
    if (_identifierController.text.isEmpty || _passwordController.text.isEmpty) {
      setState(() => _errorMessage = 'Veuillez remplir tous les champs');
      return;
    }

    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final response = await http.post(
        Uri.parse('${ApiConfig.baseUrl}/auth/login'),
        headers: ApiConfig.headers,
        body: jsonEncode({
          'identifier': _identifierController.text.trim(),
          'password': _passwordController.text,
        }),
      ).timeout(const Duration(seconds: 10));

      final data = jsonDecode(response.body);

      if (response.statusCode == 200 && data['success'] == true) {
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('auth_token', data['token']);
        await prefs.setString('user_name', data['user']['name'] ?? '');
        await prefs.setString('user_email', data['user']['email'] ?? '');
        await prefs.setString('user_role', data['user']['role'] ?? '');

        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('✅ Connexion réussie!'), backgroundColor: Colors.green),
          );
          
          final role = data['user']['role'];
          if (role == 'admin') {
            Navigator.pushReplacementNamed(context, '/admin');
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
                
                if (!hasAge) {
                  Navigator.pushReplacementNamed(context, '/setupprofile');
                } else {
                  Navigator.pushReplacementNamed(context, '/patientinterface');
                }
              } else {
                final profileCompleted = prefs.getBool('profile_completed') ?? false;
                if (!profileCompleted) {
                  Navigator.pushReplacementNamed(context, '/setupprofile');
                } else {
                  Navigator.pushReplacementNamed(context, '/patientinterface');
                }
              }
            } catch (e) {
              print('Erreur vérification profil: $e');
              final profileCompleted = prefs.getBool('profile_completed') ?? false;
              if (!profileCompleted) {
                Navigator.pushReplacementNamed(context, '/setupprofile');
              } else {
                Navigator.pushReplacementNamed(context, '/patientinterface');
              }
            }
          }
        }
      } else {
        setState(() {
          _errorMessage = data['message'] ?? 'Identifiant ou mot de passe incorrect';
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _errorMessage = '❌ Erreur de connexion au serveur';
        });
      }
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  void dispose() {
    _identifierController.dispose();
    _passwordController.dispose();
    super.dispose();
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
      ),
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
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
                    Icons.medical_services_rounded,
                    size: 80,
                    color: Colors.blue,
                  ),
                ),
                const SizedBox(height: 40),
                
                Text(
                  languageService.translate('welcome'),
                  style: const TextStyle(
                    fontSize: 28,
                    fontWeight: FontWeight.bold,
                    color: Colors.blue,
                  ),
                ),
                const SizedBox(height: 10),
                Text(
                  languageService.translate('trackMedication'),
                  style: const TextStyle(
                    fontSize: 16,
                    color: Colors.grey,
                  ),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 50),
                
                TextField(
                  controller: _identifierController,
                  decoration: InputDecoration(
                    hintText: '${languageService.translate('email')} / ${languageService.translate('phone')}',
                    prefixIcon: const Icon(Icons.person_outline_rounded, color: Colors.blue),
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
                ),
                const SizedBox(height: 20),
                
                TextField(
                  controller: _passwordController,
                  obscureText: true,
                  decoration: InputDecoration(
                    hintText: languageService.translate('password'),
                    prefixIcon: const Icon(Icons.lock_outline_rounded, color: Colors.blue),
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
                ),
                
                Align(
                  alignment: Alignment.centerRight,
                  child: TextButton(
                    onPressed: () => Navigator.pushNamed(context, '/forgotpassword'),
                    child: Text(
                      languageService.translate('forgotPassword'),
                      style: const TextStyle(
                        color: Colors.blue,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                ),
                
                if (_errorMessage != null)
                  Padding(
                    padding: const EdgeInsets.only(top: 10),
                    child: Text(
                      _errorMessage!,
                      style: const TextStyle(color: Colors.red, fontWeight: FontWeight.w500),
                    ),
                  ),
                
                const SizedBox(height: 30),
                
                SizedBox(
                  width: double.infinity,
                  height: 55,
                  child: ElevatedButton(
                    onPressed: _isLoading ? null : _login,
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
                            languageService.translate('login'),
                            style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                          ),
                  ),
                ),
                
                const SizedBox(height: 20),
                
                Wrap(
                  alignment: WrapAlignment.center,
                  spacing: 4,
                  children: [
                    Text(
                      languageService.translate('noAccount'),
                      style: const TextStyle(color: Colors.grey),
                    ),
                    GestureDetector(
                      onTap: () => Navigator.pushNamed(context, '/signup'),
                      child: Text(
                        languageService.translate('signUp'),
                        style: const TextStyle(
                          color: Colors.blue,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}