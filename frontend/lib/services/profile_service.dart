import 'dart:convert';
import 'package:http/http.dart' as http;
import '../config/api_config.dart';
import '../models/user_profile.dart';
import 'token_service.dart';

class ProfileService {
  // Récupérer le profil
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

  // Mettre à jour le profil
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
        updateData['dateOfBirth'] = profile.dateOfBirthFormatted; // Le backend attend JJ-MM-AAAA
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
        // Le backend renvoie updatedProfile dans la réponse
        return UserProfile.fromJson(data['profile'] ?? profile.toJson());
      } else {
        throw Exception(data['message'] ?? 'Échec de la mise à jour');
      }
    } catch (e) {
      print('❌ Erreur ProfileService.updateProfile: $e');
      throw Exception('Erreur lors de la mise à jour du profil: $e');
    }
  }
}
