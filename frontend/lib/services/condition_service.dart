import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../config/api_config.dart';

class ConditionService {
  // Get patient's conditions with adherence rate
  static Future<List<dynamic>> getPatientConditions() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');
      
      if (token == null) {
        throw Exception('Not authenticated');
      }

      final response = await http.get(
        Uri.parse('${ApiConfig.baseUrl}/conditions'),
        headers: ApiConfig.getAuthHeaders(token),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return data['data'] ?? [];
      } else {
        throw Exception('Failed to load conditions: ${response.statusCode}');
      }
    } catch (e) {
      print('Error in getPatientConditions: $e');
      rethrow;
    }
  }

  // Get all available chronic conditions (for adding)
  static Future<List<dynamic>> getAvailableConditions() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');
      
      if (token == null) {
        throw Exception('Not authenticated');
      }

      final response = await http.get(
        Uri.parse('${ApiConfig.baseUrl}/conditions/available'),
        headers: ApiConfig.getAuthHeaders(token),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return data['data'] ?? [];
      } else {
        throw Exception('Failed to load available conditions: ${response.statusCode}');
      }
    } catch (e) {
      print('Error in getAvailableConditions: $e');
      rethrow;
    }
  }

  // Add condition to patient
  static Future<Map<String, dynamic>> addCondition(int conditionId) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');
      
      if (token == null) {
        throw Exception('Not authenticated');
      }

      final response = await http.post(
        Uri.parse('${ApiConfig.baseUrl}/conditions/add'),
        headers: ApiConfig.getAuthHeaders(token),
        body: jsonEncode({'condition_id': conditionId}),
      );

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        throw Exception('Failed to add condition: ${response.statusCode}');
      }
    } catch (e) {
      print('Error in addCondition: $e');
      rethrow;
    }
  }

  // Remove condition from patient
  static Future<Map<String, dynamic>> removeCondition(int conditionId) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');
      
      if (token == null) {
        throw Exception('Not authenticated');
      }

      final response = await http.delete(
        Uri.parse('${ApiConfig.baseUrl}/conditions/remove/$conditionId'),
        headers: ApiConfig.getAuthHeaders(token),
      );

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        throw Exception('Failed to remove condition: ${response.statusCode}');
      }
    } catch (e) {
      print('Error in removeCondition: $e');
      rethrow;
    }
  }

  // Get medications for a specific condition
  static Future<List<dynamic>> getMedicationsForCondition(int conditionId) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');
      
      if (token == null) {
        throw Exception('Not authenticated');
      }

      final response = await http.get(
        Uri.parse('${ApiConfig.baseUrl}/conditions/$conditionId/medications'),
        headers: ApiConfig.getAuthHeaders(token),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return data['data'] ?? [];
      } else {
        throw Exception('Failed to load medications: ${response.statusCode}');
      }
    } catch (e) {
      print('Error in getMedicationsForCondition: $e');
      rethrow;
    }
  }
}