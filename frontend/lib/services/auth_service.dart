import 'dart:convert';
import 'package:http/http.dart' as http;
import '../config/api_config.dart';
import 'token_service.dart';

class AuthService {
  // Connexion
  Future<Map<String, dynamic>> signIn(String email, String password) async {
    try {
      print('🌐 Tentative de connexion à ${ApiConfig.baseUrl}/auth/login');
      
      final response = await http.post(
        Uri.parse('${ApiConfig.baseUrl}/auth/login'),
        headers: ApiConfig.headers,
        body: jsonEncode({
          'email': email,
          'password': password,
        }),
      ).timeout(const Duration(seconds: 10));
      
      print('📥 Réponse reçue: ${response.statusCode}');
      print('📄 Body: ${response.body}');
      
      final data = jsonDecode(response.body);
      
      if (response.statusCode == 200 && data['success'] == true) {
        await TokenService.saveToken(data['token']);
        if (data['user'] != null) {
          await TokenService.saveUser(data['user']);
        }
        return data;
      } else {
        throw Exception(data['message'] ?? 'Échec de la connexion');
      }
    } catch (e) {
      print('❌ Erreur: $e');
      throw Exception('Erreur de connexion au serveur: $e');
    }
  }
  
  // Inscription
  Future<Map<String, dynamic>> signUp(Map<String, dynamic> userData) async {
    try {
      print('🌐 Inscription à ${ApiConfig.baseUrl}/auth/register');
      
      final response = await http.post(
        Uri.parse('${ApiConfig.baseUrl}/auth/register'),
        headers: ApiConfig.headers,
        body: jsonEncode(userData),
      ).timeout(const Duration(seconds: 10));
      
      final data = jsonDecode(response.body);
      
      if (response.statusCode == 201 && data['success'] == true) {
        await TokenService.saveToken(data['token']);
        if (data['user'] != null) {
          await TokenService.saveUser(data['user']);
        }
        return data;
      } else {
        throw Exception(data['message'] ?? 'Échec de l\'inscription');
      }
    } catch (e) {
      throw Exception('Erreur de connexion au serveur: $e');
    }
  }
  
  // Récupérer l'utilisateur connecté
  Future<Map<String, dynamic>> getCurrentUser() async {
    final token = await TokenService.getToken();
    if (token == null) throw Exception('Non authentifié');
    
    try {
      final response = await http.get(
        Uri.parse('${ApiConfig.baseUrl}/auth/me'),
        headers: ApiConfig.getAuthHeaders(token),
      ).timeout(const Duration(seconds: 10));
      
      final data = jsonDecode(response.body);
      
      if (response.statusCode == 200 && data['success'] == true) {
        return data;
      } else {
        throw Exception(data['message'] ?? 'Impossible de récupérer l\'utilisateur');
      }
    } catch (e) {
      throw Exception('Erreur de connexion au serveur: $e');
    }
  }
  
  // Déconnexion
  Future<void> signOut() async {
    await TokenService.clearAll();
  }
  
  // Mot de passe oublié
  Future<Map<String, dynamic>> forgotPassword(String email) async {
    try {
      final response = await http.post(
        Uri.parse('${ApiConfig.baseUrl}/auth/forgot-password'),
        headers: ApiConfig.headers,
        body: jsonEncode({'email': email}),
      ).timeout(const Duration(seconds: 10));
      
      return jsonDecode(response.body);
    } catch (e) {
      throw Exception('Erreur de connexion au serveur: $e');
    }
  }
}