import 'dart:convert';
import 'package:http/http.dart' as http;
import '../config/api_config.dart';
import '../models/user_profile.dart';
import 'token_service.dart';

class ProfileService {
  // Récupérer le profil (Patient ou Admin)
  Future<UserProfile> getProfile() async {
    final token = await TokenService.getToken();
    if (token == null) throw Exception('Non authentifié');

    try {
      print('🌐 Récupération du profil à ${ApiConfig.baseUrl}/profile/me');
      
      final response = await http.get(
        Uri.parse('${ApiConfig.baseUrl}/profile/me'),
        headers: ApiConfig.getAuthHeaders(token),
      ).timeout(const Duration(seconds: 10));

      print('📥 Réponse profil: ${response.statusCode}');
      final data = jsonDecode(response.body);

      if (response.statusCode == 200 && data['success'] == true) {
        return UserProfile.fromJson(data['profile']);
      } else {
        throw Exception(data['message'] ?? 'Impossible de récupérer le profil');
      }
    } catch (e) {
      print('❌ Erreur ProfileService.getProfile: $e');
      throw Exception('Erreur lors de la récupération du profil: $e');
    }
  }

  // Récupérer le profil caregiver
  Future<UserProfile> getCaregiverProfile() async {
    final token = await TokenService.getToken();
    if (token == null) throw Exception('Non authentifié');

    try {
      print('🌐 Récupération du profil caregiver à ${ApiConfig.baseUrl}/profile/caregiver/me');
      
      final response = await http.get(
        Uri.parse('${ApiConfig.baseUrl}/profile/caregiver/me'),
        headers: ApiConfig.getAuthHeaders(token),
      ).timeout(const Duration(seconds: 10));

      print('📥 Réponse profil caregiver: ${response.statusCode}');
      
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        print('📦 Données reçues: $data');
        
        // The response has a 'profile' object
        final profileData = data['profile'] ?? data;
        
        return UserProfile(
          id: profileData['id'] ?? 0,
          name: profileData['name'] ?? '',
          email: profileData['email'] ?? '',
          phone: null,  // Caregivers don't have phone
          role: 'caregiver',
          chifaCardNumber: null,
          dateOfBirth: null,
          dateOfBirthFormatted: null,
          smartphoneSkillLevel: null,
          isActive: null,
        );
      } else if (response.statusCode == 404) {
        throw Exception('Caregiver profile not found');
      } else {
        final data = jsonDecode(response.body);
        throw Exception(data['message'] ?? 'Failed to fetch caregiver profile');
      }
    } catch (e) {
      print('❌ Erreur ProfileService.getCaregiverProfile: $e');
      throw Exception('Erreur lors de la récupération du profil: $e');
    }
  }

  // Mettre à jour le profil (Patient ou Admin)
  Future<UserProfile> updateProfile(UserProfile profile) async {
    final token = await TokenService.getToken();
    if (token == null) throw Exception('Non authentifié');

    try {
      final Map<String, dynamic> updateData = {
        'name': profile.name,
        'phone': profile.phone,
      };

      if (profile.role == 'patient') {
        updateData['chifaCardRegistrationNumber'] = profile.chifaCardNumber;
        updateData['dateOfBirth'] = profile.dateOfBirthFormatted;
        updateData['smartphoneSkillLevel'] = profile.smartphoneSkillLevel;
      }

      print('🌐 Mise à jour du profil à ${ApiConfig.baseUrl}/profile/update');
      print('📤 Données envoyées: $updateData');

      final response = await http.put(
        Uri.parse('${ApiConfig.baseUrl}/profile/update'),
        headers: ApiConfig.getAuthHeaders(token),
        body: jsonEncode(updateData),
      ).timeout(const Duration(seconds: 10));

      print('📥 Réponse mise à jour: ${response.statusCode}');
      final data = jsonDecode(response.body);

      if (response.statusCode == 200 && data['success'] == true) {
        return UserProfile.fromJson(data['profile'] ?? profile.toJson());
      } else {
        throw Exception(data['message'] ?? 'Échec de la mise à jour');
      }
    } catch (e) {
      print('❌ Erreur ProfileService.updateProfile: $e');
      throw Exception('Erreur lors de la mise à jour du profil: $e');
    }
  }

  // Mettre à jour le profil caregiver
  Future<UserProfile> updateCaregiverProfile(UserProfile profile) async {
    final token = await TokenService.getToken();
    if (token == null) throw Exception('Non authentifié');

    try {
      final updateData = {
        'name': profile.name,
      };

      print('🌐 Mise à jour du profil caregiver à ${ApiConfig.baseUrl}/profile/caregiver/update');
      print('📤 Données envoyées: $updateData');

      final response = await http.put(
        Uri.parse('${ApiConfig.baseUrl}/profile/caregiver/update'),
        headers: ApiConfig.getAuthHeaders(token),
        body: jsonEncode(updateData),
      ).timeout(const Duration(seconds: 10));

      print('📥 Réponse mise à jour caregiver: ${response.statusCode}');
      final data = jsonDecode(response.body);

      if (response.statusCode == 200 && data['success'] == true) {
        return profile;
      } else {
        throw Exception(data['message'] ?? 'Échec de la mise à jour');
      }
    } catch (e) {
      print('❌ Erreur ProfileService.updateCaregiverProfile: $e');
      throw Exception('Erreur lors de la mise à jour du profil: $e');
    }
  }

  // Changer le mot de passe (Patient ou Admin)
  Future<void> changePassword(String currentPassword, String newPassword) async {
    final token = await TokenService.getToken();
    if (token == null) throw Exception('Non authentifié');

    try {
      final response = await http.put(
        Uri.parse('${ApiConfig.baseUrl}/profile/password'),
        headers: ApiConfig.getAuthHeaders(token),
        body: jsonEncode({
          'current_password': currentPassword,
          'new_password': newPassword,
        }),
      ).timeout(const Duration(seconds: 10));

      final data = jsonDecode(response.body);

      if (response.statusCode != 200) {
        throw Exception(data['message'] ?? 'Failed to change password');
      }
    } catch (e) {
      print('❌ Erreur ProfileService.changePassword: $e');
      throw Exception('Erreur lors du changement de mot de passe: $e');
    }
  }

  // Changer le mot de passe caregiver
  Future<void> changeCaregiverPassword(String currentPassword, String newPassword) async {
    final token = await TokenService.getToken();
    if (token == null) throw Exception('Non authentifié');

    try {
      final response = await http.post(
        Uri.parse('${ApiConfig.baseUrl}/profile/caregiver/change-password'),
        headers: ApiConfig.getAuthHeaders(token),
        body: jsonEncode({
          'current_password': currentPassword,
          'new_password': newPassword,
        }),
      ).timeout(const Duration(seconds: 10));

      print('📥 Réponse changement mot de passe caregiver: ${response.statusCode}');
      final data = jsonDecode(response.body);

      if (response.statusCode != 200) {
        throw Exception(data['message'] ?? 'Failed to change password');
      }
    } catch (e) {
      print('❌ Erreur ProfileService.changeCaregiverPassword: $e');
      throw Exception('Erreur lors du changement de mot de passe: $e');
    }
  }
}