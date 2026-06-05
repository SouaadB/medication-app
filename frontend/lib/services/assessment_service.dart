// frontend/lib/services/assessment_service.dart

import 'dart:convert';
import 'package:http/http.dart' as http;
import '../config/api_config.dart';

class AssessmentService {
  final String baseUrl = ApiConfig.baseUrl;

  Future<Map<String, dynamic>> getLatestAssessment(int patientId, String token) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/assessments/$patientId'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return {
          'success': true,
          'assessment': data['assessment'],
        };
      } else {
        return {
          'success': false,
          'message': 'Failed to load assessment',
        };
      }
    } catch (e) {
      print('Error getting assessment: $e');
      return {
        'success': false,
        'message': 'Network error',
      };
    }
  }

  Future<Map<String, dynamic>> getAssessmentHistory(int patientId, String token) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/assessments/$patientId/history'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return {
          'success': true,
          'history': data['history'],
        };
      } else {
        return {
          'success': false,
          'message': 'Failed to load history',
        };
      }
    } catch (e) {
      print('Error getting history: $e');
      return {
        'success': false,
        'message': 'Network error',
      };
    }
  }
}