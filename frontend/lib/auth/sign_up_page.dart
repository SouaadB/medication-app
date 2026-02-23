import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

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

  // IMPORTANT: Remplace par l'URL correcte selon ta plateforme
  //final String baseUrl = 'http://localhost:5000/api'; // Pour Windows
  // final String baseUrl = 'http://10.0.2.2:5000/api'; // Pour émulateur Android
   final String baseUrl = 'http://192.168.26.155:5000/api'; // Pour vrai téléphone (remplace par ton IP)

  // Liste des niveaux de compétence
  final List<String> _smartphoneSkillLevels = [
    'BASIC',
    'INTERMEDIATE',
    'ADVANCED',
  ];

  Future<void> _selectDate(BuildContext context) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: DateTime.now(),
      firstDate: DateTime(1900),
      lastDate: DateTime.now(),
    );
    if (picked != null) {
      // Format: DD-MM-YYYY
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
      setState(() {
        _isLoading = true;
      });

      try {
        // Préparer les données
        Map<String, dynamic> userData = {
          'name': _nameController.text,
          'email': _emailController.text,
          'password': _passwordController.text,
          'phone': _phoneController.text,
          'chifaCardRegistrationNumber': _chifaCardController.text,
          'dateOfBirth': _dateOfBirthController.text,
          'smartphoneSkillLevel': _selectedSmartphoneSkillLevel,
        };

        // Afficher les données envoyées (pour debug)
        print('📤 Envoi des données: $userData');

        // Appel API
        final response = await http.post(
          Uri.parse('$baseUrl/auth/register'),
          headers: {'Content-Type': 'application/json'},
          body: jsonEncode(userData),
        ).timeout(const Duration(seconds: 10));

        // Analyser la réponse
        final responseData = jsonDecode(response.body);
        print('📥 Réponse: $responseData');

        if (response.statusCode == 201 && responseData['success'] == true) {
          // Succès
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('✅ ${responseData['message']}'),
              backgroundColor: Colors.green,
            ),
          );

          // Retourner à la page de connexion après 2 secondes
          Future.delayed(const Duration(seconds: 2), () {
            Navigator.pop(context); // Retour à la page précédente (login)
          });
        } else {
          // Erreur de validation
          throw Exception(responseData['message'] ?? 'Erreur inconnue');
        }
      } catch (e) {
        // Gestion des erreurs
        String errorMessage = 'Erreur de connexion';
        if (e.toString().contains('Failed host lookup')) {
          errorMessage = '❌ Serveur inaccessible. Vérifie l\'URL: $baseUrl';
        } else if (e.toString().contains('Timeout')) {
          errorMessage = '❌ Délai d\'attente dépassé. Le serveur ne répond pas.';
        } else {
          errorMessage = '❌ $e';
        }

        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(errorMessage),
            backgroundColor: Colors.red,
          ),
        );
        print('❌ Erreur: $e');
      } finally {
        setState(() {
          _isLoading = false;
        });
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
    return Scaffold(
      appBar: AppBar(
        title: const Text('Inscription'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: ListView(
            children: <Widget>[
              // Champ Nom
              TextFormField(
                controller: _nameController,
                decoration: const InputDecoration(
                  labelText: 'Nom complet',
                  border: OutlineInputBorder(),
                  prefixIcon: Icon(Icons.person),
                ),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Veuillez entrer votre nom';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16.0),

              // Champ Email
              TextFormField(
                controller: _emailController,
                decoration: const InputDecoration(
                  labelText: 'Email',
                  border: OutlineInputBorder(),
                  prefixIcon: Icon(Icons.email),
                ),
                keyboardType: TextInputType.emailAddress,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Veuillez entrer votre email';
                  }
                  if (!RegExp(r'^[^@]+@[^@]+\.[^@]+').hasMatch(value)) {
                    return 'Email invalide';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16.0),

              // Champ Mot de passe
              TextFormField(
                controller: _passwordController,
                decoration: const InputDecoration(
                  labelText: 'Mot de passe',
                  border: OutlineInputBorder(),
                  prefixIcon: Icon(Icons.lock),
                ),
                obscureText: true,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Veuillez entrer un mot de passe';
                  }
                  if (value.length < 6) {
                    return 'Le mot de passe doit contenir au moins 6 caractères';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16.0),

              // Champ Téléphone
              TextFormField(
                controller: _phoneController,
                decoration: const InputDecoration(
                  labelText: 'Numéro de téléphone',
                  border: OutlineInputBorder(),
                  prefixIcon: Icon(Icons.phone),
                  hintText: '0612345678',
                ),
                keyboardType: TextInputType.phone,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Veuillez entrer votre téléphone';
                  }
                  if (value.length != 10 || !RegExp(r'^[0-9]+$').hasMatch(value)) {
                    return 'Le téléphone doit contenir 10 chiffres';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16.0),

              // Champ CHIFA
              TextFormField(
                controller: _chifaCardController,
                decoration: const InputDecoration(
                  labelText: 'Numéro CHIFA',
                  border: OutlineInputBorder(),
                  prefixIcon: Icon(Icons.card_membership),
                  hintText: '123456789',
                ),
                keyboardType: TextInputType.number,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Veuillez entrer votre numéro CHIFA';
                  }
                  if (value.length != 9 || !RegExp(r'^[0-9]+$').hasMatch(value)) {
                    return 'Le numéro CHIFA doit contenir exactement 9 chiffres';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16.0),

              // Champ Date de naissance
              TextFormField(
                controller: _dateOfBirthController,
                decoration: const InputDecoration(
                  labelText: 'Date de naissance',
                  border: OutlineInputBorder(),
                  prefixIcon: Icon(Icons.calendar_today),
                  hintText: 'JJ-MM-AAAA',
                ),
                readOnly: true,
                onTap: () => _selectDate(context),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Veuillez sélectionner votre date de naissance';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16.0),

              // Dropdown Niveau smartphone
              DropdownButtonFormField<String>(
                value: _selectedSmartphoneSkillLevel,
                decoration: const InputDecoration(
                  labelText: 'Niveau smartphone',
                  border: OutlineInputBorder(),
                  prefixIcon: Icon(Icons.phone_android),
                ),
                hint: const Text('Sélectionnez votre niveau'),
                items: _smartphoneSkillLevels.map((String level) {
                  return DropdownMenuItem<String>(
                    value: level,
                    child: Text(level),
                  );
                }).toList(),
                onChanged: (String? newValue) {
                  setState(() {
                    _selectedSmartphoneSkillLevel = newValue;
                  });
                },
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Veuillez sélectionner votre niveau';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 24.0),

              // Bouton d'inscription
              ElevatedButton(
                onPressed: _isLoading ? null : _signUp,
                style: ElevatedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 16.0),
                ),
                child: _isLoading
                    ? const CircularProgressIndicator(color: Colors.white)
                    : const Text(
                        "S'inscrire",
                        style: TextStyle(fontSize: 18.0),
                      ),
              ),

              // Lien vers la page de connexion
              TextButton(
                onPressed: () {
                  Navigator.pop(context);
                },
                child: const Text('Déjà un compte ? Se connecter'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}