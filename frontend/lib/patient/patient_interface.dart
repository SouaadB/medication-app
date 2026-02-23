import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';

class PatientInterface extends StatefulWidget {
  const PatientInterface({super.key});

  @override
  _PatientInterfaceState createState() => _PatientInterfaceState();
}

class _PatientInterfaceState extends State<PatientInterface> {
  bool _isLoading = true;
  bool _isLoggingOut = false;
  Map<String, dynamic>? _userData;
  String? _errorMessage;

  // IMPORTANT: Utilise la même URL que les autres pages
  //final String baseUrl = 'http://localhost:5000/api'; // Pour Windows
  // final String baseUrl = 'http://10.0.2.2:5000/api'; // Pour émulateur Android
   final String baseUrl = 'http://192.168.26.155:5000/api'; // Pour vrai téléphone

  @override
  void initState() {
    super.initState();
    _loadUserData();
  }

  // Charger les données de l'utilisateur via /api/auth/me
  Future<void> _loadUserData() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      // Récupérer le token stocké
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');

      if (token == null) {
        // Pas de token, rediriger vers la page de connexion
        _redirectToSignIn(); // ← MODIFIÉ ICI
        return;
      }

      print('🔑 Token: $token');
      
      // Appel à /api/auth/me avec le token
      final response = await http.get(
        Uri.parse('$baseUrl/auth/me'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      ).timeout(const Duration(seconds: 10));

      final data = jsonDecode(response.body);
      print('📥 Réponse /me: $data');

      if (response.statusCode == 200 && data['success'] == true) {
        setState(() {
          _userData = data['user'];
          _isLoading = false;
        });

        // Sauvegarder les infos utilisateur
        await prefs.setString('user_name', data['user']['name'] ?? '');
        await prefs.setString('user_email', data['user']['email'] ?? '');
      } else {
        // Token invalide ou expiré
        await prefs.remove('auth_token');
        _redirectToSignIn(); // ← MODIFIÉ ICI
      }
    } catch (e) {
      print('❌ Erreur chargement utilisateur: $e');
      setState(() {
        _errorMessage = 'Impossible de charger les données. Vérifie ta connexion.';
        _isLoading = false;
      });
    }
  }

  // Rediriger vers la page de connexion (SIGNIN, pas login)
  void _redirectToSignIn() { // ← MODIFIÉ ICI (nom de fonction)
    WidgetsBinding.instance.addPostFrameCallback((_) {
      Navigator.pushReplacementNamed(context, '/signin'); // ← '/signin' au lieu de '/login'
    });
  }

  // Déconnexion
  Future<void> _logout() async {
    setState(() {
      _isLoggingOut = true;
    });

    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');

      if (token != null) {
        // Appel à /api/auth/logout
        final response = await http.post(
          Uri.parse('$baseUrl/auth/logout'),
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer $token',
          },
        ).timeout(const Duration(seconds: 10));

        final data = jsonDecode(response.body);
        print('📥 Réponse logout: $data');
      }

      // Nettoyer les données stockées
      await prefs.remove('auth_token');
      await prefs.remove('user_name');
      await prefs.remove('user_email');
      await prefs.remove('user_role');

      // Rediriger vers la page de connexion
      Navigator.pushReplacementNamed(context, '/signin'); // ← C'EST DÉJÀ BON ICI !
      
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('👋 Déconnexion réussie !'),
          backgroundColor: Colors.green,
        ),
      );
    } catch (error) {
      print('❌ Erreur déconnexion: $error');
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('❌ Erreur réseau lors de la déconnexion'),
          backgroundColor: Colors.red,
        ),
      );
    } finally {
      setState(() {
        _isLoggingOut = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Mon Espace'),
        backgroundColor: Colors.blue,
        actions: [
          IconButton(
            icon: _isLoggingOut
                ? CircularProgressIndicator(color: Colors.white)
                : Icon(Icons.logout),
            onPressed: _isLoggingOut ? null : _logout,
            tooltip: 'Déconnexion',
          ),
        ],
      ),
      body: _isLoading
          ? Center(child: CircularProgressIndicator())
          : _errorMessage != null
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.error_outline, size: 64, color: Colors.red),
                      SizedBox(height: 16),
                      Text(
                        _errorMessage!,
                        style: TextStyle(fontSize: 16),
                        textAlign: TextAlign.center,
                      ),
                      SizedBox(height: 24),
                      ElevatedButton(
                        onPressed: _loadUserData,
                        child: Text('Réessayer'),
                      ),
                    ],
                  ),
                )
              : SingleChildScrollView( // ← AJOUTÉ ICI POUR ÉVITER LE DÉBORDEMENT
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Message de bienvenue avec le nom
                      Container(
                        padding: EdgeInsets.all(20),
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            colors: [Colors.blue, Colors.lightBlue],
                            begin: Alignment.topLeft,
                            end: Alignment.bottomRight,
                          ),
                          borderRadius: BorderRadius.circular(16),
                        ),
                        child: Row(
                          children: [
                            CircleAvatar(
                              radius: 30,
                              backgroundColor: Colors.white,
                              child: Text(
                                _userData?['name']?[0] ?? '?',
                                style: TextStyle(
                                  fontSize: 30,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.blue,
                                ),
                              ),
                            ),
                            SizedBox(width: 16),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    '👋 Bonjour,',
                                    style: TextStyle(
                                      fontSize: 16,
                                      color: Colors.white70,
                                    ),
                                  ),
                                  Text(
                                    _userData?['name'] ?? 'Patient',
                                    style: TextStyle(
                                      fontSize: 24,
                                      fontWeight: FontWeight.bold,
                                      color: Colors.white,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
                      
                      SizedBox(height: 20),
                      
                      // Informations du patient
                      Card(
                        elevation: 4,
                        child: Padding(
                          padding: const EdgeInsets.all(16.0),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                '📋 Mes Informations',
                                style: TextStyle(
                                  fontSize: 18,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              Divider(),
                              ListTile(
                                leading: Icon(Icons.email, color: Colors.blue),
                                title: Text('Email'),
                                subtitle: Text(_userData?['email'] ?? 'Non disponible'),
                              ),
                              ListTile(
                                leading: Icon(Icons.phone, color: Colors.blue),
                                title: Text('Téléphone'),
                                subtitle: Text(_userData?['phone'] ?? 'Non disponible'),
                              ),
                              if (_userData?['profile'] != null) ...[
                                ListTile(
                                  leading: Icon(Icons.badge, color: Colors.blue),
                                  title: Text('N° CHIFA'),
                                  subtitle: Text(_userData!['profile']['chifa_card_registration_number'] ?? 'N/A'),
                                ),
                                ListTile(
                                  leading: Icon(Icons.cake, color: Colors.blue),
                                  title: Text('Date de naissance'),
                                  subtitle: Text(_userData!['profile']['date_of_birth_formatted'] ?? 'N/A'),
                                ),
                                ListTile(
                                  leading: Icon(Icons.phone_android, color: Colors.blue),
                                  title: Text('Niveau smartphone'),
                                  subtitle: Text(_userData!['profile']['smartphone_skill_level'] ?? 'N/A'),
                                ),
                              ],
                            ],
                          ),
                        ),
                      ),
                      
                      SizedBox(height: 20),
                      
                      // Actions disponibles
                      Card(
                        elevation: 4,
                        child: Padding(
                          padding: const EdgeInsets.all(16.0),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                '⚕️ Mes Actions',
                                style: TextStyle(
                                  fontSize: 18,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              Divider(),
                              SizedBox(height: 10),
                              _buildActionButton(
                                icon: Icons.medication,
                                label: 'Mes médicaments',
                                color: Colors.orange,
                              ),
                              SizedBox(height: 8),
                              _buildActionButton(
                                icon: Icons.calendar_today,
                                label: 'Mon calendrier',
                                color: Colors.green,
                              ),
                              SizedBox(height: 8),
                              _buildActionButton(
                                icon: Icons.history,
                                label: 'Mon historique',
                                color: Colors.purple,
                              ),
                            ],
                          ),
                        ),
                      ),
                      
                      SizedBox(height: 20),
                      
                      // Bouton de déconnexion en bas
                      SizedBox(
                        width: double.infinity,
                        child: ElevatedButton(
                          onPressed: _isLoggingOut ? null : _logout,
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.red,
                            padding: EdgeInsets.symmetric(vertical: 16),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                          ),
                          child: _isLoggingOut
                              ? CircularProgressIndicator(color: Colors.white)
                              : Row(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    Icon(Icons.logout),
                                    SizedBox(width: 8),
                                    Text(
                                      'SE DÉCONNECTER',
                                      style: TextStyle(
                                        fontSize: 18,
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                  ],
                                ),
                        ),
                      ),
                    ],
                  ),
                ),
    );
  }

  Widget _buildActionButton({
    required IconData icon,
    required String label,
    required Color color,
  }) {
    return InkWell(
      onTap: () {
        // TODO: Implémenter les actions
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Fonctionnalité à venir: $label')),
        );
      },
      child: Container(
        padding: EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: color.withOpacity(0.1),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: color.withOpacity(0.3)),
        ),
        child: Row(
          children: [
            Icon(icon, color: color, size: 28),
            SizedBox(width: 12),
            Text(
              label,
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w500,
                color: color,
              ),
            ),
            Spacer(),
            Icon(Icons.arrow_forward_ios, color: color, size: 16),
          ],
        ),
      ),
    );
  }
}