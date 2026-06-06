import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../config/api_config.dart';

// ─────────────────────────────────────────────────────────────────────────────
// CAREGIVER RISK INDICATOR SERVICE
//
// Fetches AI risk levels for all supervised patients in one call.
// Used by CaregiverDashboard to show risk dots on patient cards.
// ─────────────────────────────────────────────────────────────────────────────

class CaregiverRiskService {
  CaregiverRiskService._();
  static final CaregiverRiskService instance = CaregiverRiskService._();

  // patientId → riskLevel string
  Map<int, String> _riskMap   = {};
  DateTime?        _fetchedAt;

  bool get _isStale =>
      _fetchedAt == null ||
      DateTime.now().difference(_fetchedAt!) > const Duration(hours: 6);

  Future<Map<int, String>> getRiskMap({bool forceRefresh = false}) async {
    if (!forceRefresh && !_isStale) return _riskMap;
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');
      final email = prefs.getString('user_email') ?? '';
      if (token == null || email.isEmpty) return _riskMap;

      final resp = await http.get(
        Uri.parse('${ApiConfig.baseUrl}/signals/caregiver/$email'),
        headers: {'Authorization': 'Bearer $token', 'Content-Type': 'application/json'},
      ).timeout(const Duration(seconds: 10));

      if (resp.statusCode == 200) {
        final body = jsonDecode(resp.body);
        if (body['success'] == true && body['data'] is List) {
          final map = <int, String>{};
          for (final item in body['data'] as List) {
            final id    = item['patientId'] ?? item['patient_id'];
            final level = item['riskLevel'] ?? item['risk_level'] ?? 'low';
            if (id != null) map[id as int] = level.toString();
          }
          _riskMap   = map;
          _fetchedAt = DateTime.now();
        }
      }
    } catch (e) { debugPrint('[RiskService] $e'); }
    return _riskMap;
  }

  void clear() { _riskMap = {}; _fetchedAt = null; }
}

// ─────────────────────────────────────────────────────────────────────────────
// RISK INDICATOR WIDGET
//
// A small colored dot + label shown on each patient card.
// ─────────────────────────────────────────────────────────────────────────────

class PatientRiskIndicator extends StatelessWidget {
  final String riskLevel; // 'low' | 'moderate' | 'high' | 'critical'

  const PatientRiskIndicator({super.key, required this.riskLevel});

  Color get _color {
    switch (riskLevel) {
      case 'critical': return const Color(0xFFB71C1C);
      case 'high':     return const Color(0xFFE53935);
      case 'moderate': return const Color(0xFFF57C00);
      default:         return const Color(0xFF2E7D32);
    }
  }

  String get _emoji {
    switch (riskLevel) {
      case 'critical': return '🚨';
      case 'high':     return '🔴';
      case 'moderate': return '🟡';
      default:         return '🟢';
    }
  }

  String get _label {
    switch (riskLevel) {
      case 'critical': return 'Critical';
      case 'high':     return 'High';
      case 'moderate': return 'Moderate';
      default:         return 'Low';
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 3),
      decoration: BoxDecoration(
        color: _color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: _color.withOpacity(0.3)),
      ),
      child: Row(mainAxisSize: MainAxisSize.min, children: [
        Text(_emoji, style: const TextStyle(fontSize: 10)),
        const SizedBox(width: 3),
        Text(
          'AI: $_label',
          style: TextStyle(
              fontSize: 10,
              fontWeight: FontWeight.bold,
              color: _color),
        ),
      ]),
    );
  }
}