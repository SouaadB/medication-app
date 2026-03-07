import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:provider/provider.dart';
import '../config/api_config.dart';
import '../services/language_service.dart';

class SignUpPage extends StatefulWidget {
  const SignUpPage({super.key});

  @override
  State<SignUpPage> createState() => _SignUpPageState();
}

class _SignUpPageState extends State<SignUpPage> {
  final _formKey = GlobalKey<FormState>();
  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  final TextEditingController _phoneController = TextEditingController();
  final TextEditingController _chifaCardController = TextEditingController();
  final TextEditingController _dateOfBirthController = TextEditingController();
  String? _selectedSmartphoneSkillLevel;
  bool _isLoading = false;

  final List<String> _smartphoneSkillLevels = [
    'BASIC',
    'INTERMEDIATE',
    'ADVANCED',
  ];

  Future<void> _selectDate(BuildContext context) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: DateTime.now().subtract(const Duration(days: 365 * 20)),
      firstDate: DateTime(1900),
      lastDate: DateTime.now(),
    );
    if (picked != null) {
      String formattedDate = "${picked.day.toString().padLeft(2, '0')}-"
          "${picked.month.toString().padLeft(2, '0')}-"
          "${picked.year}";
      setState(() {
        _dateOfBirthController.text = formattedDate;
      });
    }
  }

  Future<void> _signUp() async {
    if (_formKey.currentState!.validate()) {
      if (_selectedSmartphoneSkillLevel == null) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Veuillez sélectionner votre niveau en smartphone')),
        );
        return;
      }

      setState(() => _isLoading = true);

      try {
        Map<String, dynamic> userData = {
          'name': _nameController.text.trim(),
          'email': _emailController.text.trim(),
          'password': _passwordController.text,
          'phone': _phoneController.text.trim(),
          'chifaCardRegistrationNumber': _chifaCardController.text.trim(),
          'dateOfBirth': _dateOfBirthController.text,
          'smartphoneSkillLevel': _selectedSmartphoneSkillLevel,
        };

        final response = await http.post(
          Uri.parse('${ApiConfig.baseUrl}/auth/register'),
          headers: ApiConfig.headers,
          body: jsonEncode(userData),
        ).timeout(const Duration(seconds: 10));

        final responseData = jsonDecode(response.body);

        if (response.statusCode == 201 && responseData['success'] == true) {
          if (mounted) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text('✅ ${responseData['message']}'),
                backgroundColor: Colors.green,
              ),
            );
            Future.delayed(const Duration(seconds: 2), () {
              Navigator.pop(context);
            });
          }
        } else {
          throw Exception(responseData['message'] ?? 'Erreur lors de l\'inscription');
        }
      } catch (e) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('❌ $e'),
              backgroundColor: Colors.red,
            ),
          );
        }
      } finally {
        if (mounted) setState(() => _isLoading = false);
      }
    }
  }

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    _phoneController.dispose();
    _chifaCardController.dispose();
    _dateOfBirthController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final languageService = Provider.of<LanguageService>(context);
    
    return Scaffold(
      backgroundColor: theme.colorScheme.background,
      appBar: AppBar(
        title: Text(languageService.translate('signUp')),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24.0),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: <Widget>[
              Text(
                languageService.translate('welcome'),
                style: theme.textTheme.headlineMedium,
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 8),
              Text(
                languageService.translate('helpUs'),
                style: theme.textTheme.bodyLarge,
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 32),
              
              _buildFieldTitle(languageService.translate('profile')),
              const SizedBox(height: 12),
              TextFormField(
                controller: _nameController,
                decoration: InputDecoration(
                  labelText: languageService.translate('profile'),
                  prefixIcon: const Icon(Icons.person_outline),
                ),
                validator: (value) => (value == null || value.isEmpty) ? 'Requis' : null,
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _emailController,
                decoration: InputDecoration(
                  labelText: languageService.translate('email'),
                  prefixIcon: Icon(Icons.email_outlined),
                ),
                keyboardType: TextInputType.emailAddress,
                validator: (value) {
                  if (value == null || value.isEmpty) return 'Requis';
                  if (!RegExp(r'^[^@]+@[^@]+\.[^@]+').hasMatch(value)) return 'Email invalide';
                  return null;
                },
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _passwordController,
                decoration: InputDecoration(
                  labelText: languageService.translate('password'),
                  prefixIcon: Icon(Icons.lock_outline),
                ),
                obscureText: true,
                validator: (value) => (value == null || value.length < 6) ? 'Min 6 caractères' : null,
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _phoneController,
                decoration: InputDecoration(
                  labelText: languageService.translate('phone'),
                  prefixIcon: Icon(Icons.phone_outlined),
                  hintText: '0612345678',
                ),
                keyboardType: TextInputType.phone,
                validator: (value) => (value == null || value.length != 10) ? '10 chiffres requis' : null,
              ),
              
              const SizedBox(height: 32),
              _buildFieldTitle(languageService.translate('medications')),
              const SizedBox(height: 12),
              TextFormField(
                controller: _chifaCardController,
                decoration: InputDecoration(
                  labelText: languageService.translate('chifaNumber'),
                  prefixIcon: Icon(Icons.card_membership_outlined),
                  hintText: '9 chiffres',
                ),
                keyboardType: TextInputType.number,
                validator: (value) => (value == null || value.length != 9) ? '9 chiffres requis' : null,
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _dateOfBirthController,
                decoration: InputDecoration(
                  labelText: languageService.translate('dateOfBirth'),
                  prefixIcon: Icon(Icons.calendar_today_outlined),
                  hintText: 'JJ-MM-AAAA',
                ),
                readOnly: true,
                onTap: () => _selectDate(context),
                validator: (value) => (value == null || value.isEmpty) ? 'Requis' : null,
              ),
              const SizedBox(height: 16),
              DropdownButtonFormField<String>(
                decoration: InputDecoration(
                  labelText: languageService.translate('skillLevel'),
                  prefixIcon: Icon(Icons.smartphone_outlined),
                ),
                value: _selectedSmartphoneSkillLevel,
                items: _smartphoneSkillLevels.map((level) {
                  return DropdownMenuItem(value: level, child: Text(level));
                }).toList(),
                onChanged: (value) => setState(() => _selectedSmartphoneSkillLevel = value),
                validator: (value) => value == null ? 'Requis' : null,
              ),
              
              const SizedBox(height: 40),
              ElevatedButton(
                onPressed: _isLoading ? null : _signUp,
                child: _isLoading
                    ? const SizedBox(
                        height: 24,
                        width: 24,
                        child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2),
                      )
                    : Text(languageService.translate('signUp')),
              ),
              const SizedBox(height: 20),
              Center(
                child: Wrap(
                  alignment: WrapAlignment.center,
                  spacing: 4,
                  children: [
                    Text(
                      languageService.translate('alreadyHaveAccount'),
                      style: TextStyle(color: Colors.grey),
                    ),
                    GestureDetector(
                      onTap: () => Navigator.pop(context),
                      child: Text(
                        languageService.translate('signIn'),
                        style: const TextStyle(
                          color: Colors.blue,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildFieldTitle(String title) {
    return Text(
      title,
      style: const TextStyle(
        fontSize: 16,
        fontWeight: FontWeight.bold,
        color: Color(0xFF1A237E),
      ),
    );
  }
}