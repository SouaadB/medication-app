import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../config/api_config.dart';

class HealthService {
  static Future<Map<String, dynamic>> getDashboard() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');
      
      if (token == null) {
        throw Exception('Not authenticated');
      }

      final response = await http.get(
        Uri.parse('${ApiConfig.baseUrl}/health-review/dashboard'),
        headers: ApiConfig.getAuthHeaders(token),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return data['data'];
      } else {
        throw Exception('Failed to load dashboard');
      }
    } catch (e) {
      print('Error fetching dashboard: $e');
      rethrow;
    }
  }

  static Future<Map<String, dynamic>> saveEmergencyContact({
    required String name,
    required String relationship,
    required String phoneNumber,
    required bool isActive,
  }) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');
      
      if (token == null) {
        throw Exception('Not authenticated');
      }

      final response = await http.post(
        Uri.parse('${ApiConfig.baseUrl}/health-review/emergency-contact'),
        headers: ApiConfig.getAuthHeaders(token),
        body: jsonEncode({
          'name': name,
          'relationship': relationship,
          'phone_number': phoneNumber,
          'is_active': isActive,
        }),
      );

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        throw Exception('Failed to save emergency contact');
      }
    } catch (e) {
      print('Error saving emergency contact: $e');
      rethrow;
    }
  }

  static Future<Map<String, dynamic>> toggleEmergencyContact(bool isActive) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');
      
      if (token == null) {
        throw Exception('Not authenticated');
      }

      final response = await http.put(
        Uri.parse('${ApiConfig.baseUrl}/health-review/emergency-contact/toggle'),
        headers: ApiConfig.getAuthHeaders(token),
        body: jsonEncode({'is_active': isActive}),
      );

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        throw Exception('Failed to toggle emergency contact');
      }
    } catch (e) {
      print('Error toggling emergency contact: $e');
      rethrow;
    }
  }

  static Future<Map<String, dynamic>> deleteEmergencyContact() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');
      
      if (token == null) {
        throw Exception('Not authenticated');
      }

      final response = await http.delete(
        Uri.parse('${ApiConfig.baseUrl}/health-review/emergency-contact'),
        headers: ApiConfig.getAuthHeaders(token),
      );

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        throw Exception('Failed to delete emergency contact');
      }
    } catch (e) {
      print('Error deleting emergency contact: $e');
      rethrow;
    }
  }
}