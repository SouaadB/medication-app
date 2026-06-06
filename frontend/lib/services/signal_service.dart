import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../config/api_config.dart';

// ─────────────────────────────────────────────────────────────────────────────
// SIGNAL SERVICE
// Fetches the latest AI early warning forecast for the current patient.
// Caches the result for 6 hours to avoid unnecessary API calls.
// ─────────────────────────────────────────────────────────────────────────────

class SignalService {

  // ── Singleton ───────────────────────────────────────────────────────────────
  SignalService._();
  static final SignalService instance = SignalService._();

  // ── Cache ───────────────────────────────────────────────────────────────────
  AdherenceForecast? _cached;
  DateTime?          _cachedAt;
  int?               _cachedPatientId;
  static const _cacheDuration = Duration(hours: 6);

  bool _isCacheValidFor(int patientId) =>
      _cached != null &&
      _cachedAt != null &&
      _cachedPatientId == patientId &&
      DateTime.now().difference(_cachedAt!) < _cacheDuration;

  // ── Fetch latest forecast ───────────────────────────────────────────────────
  Future<AdherenceForecast?> getLatestForecast({bool forceRefresh = false}) async {
    try {
      final prefs     = await SharedPreferences.getInstance();
      final token     = prefs.getString('auth_token');
      final patientId = prefs.getInt('user_id')
          ?? prefs.getInt('patient_id')
          ?? int.tryParse(prefs.getString('user_id') ?? '')
          ?? int.tryParse(prefs.getString('patient_id') ?? '');
      if (token == null || patientId == null) return null;

      if (!forceRefresh && _isCacheValidFor(patientId)) return _cached;

      final response = await http.get(
        Uri.parse('${ApiConfig.baseUrl}/signals/patient/$patientId'),
        headers: ApiConfig.getAuthHeaders(token),
      ).timeout(const Duration(seconds: 10));

      if (response.statusCode == 200) {
        final body = jsonDecode(response.body);
        if (body['success'] == true && body['data'] != null) {
          _cached          = AdherenceForecast.fromJson(body['data']);
          _cachedAt        = DateTime.now();
          _cachedPatientId = patientId;
          return _cached;
        }
      }
      return null;
    } catch (e) {
      debugPrint('[SignalService] Error: $e');
      return _cached;
    }
  }

  // ── Force generate a fresh forecast ─────────────────────────────────────────
  Future<AdherenceForecast?> generateForecast() async {
    try {
      final prefs     = await SharedPreferences.getInstance();
      final token     = prefs.getString('auth_token');
      final patientId = prefs.getInt('user_id')
          ?? prefs.getInt('patient_id')
          ?? int.tryParse(prefs.getString('user_id') ?? '')
          ?? int.tryParse(prefs.getString('patient_id') ?? '');
      if (token == null || patientId == null) return null;

      final response = await http.post(
        Uri.parse('${ApiConfig.baseUrl}/signals/generate/$patientId'),
        headers: ApiConfig.getAuthHeaders(token),
      ).timeout(const Duration(seconds: 15));

      if (response.statusCode == 200) {
        final body = jsonDecode(response.body);
        if (body['success'] == true && body['data'] != null) {
          _cached          = AdherenceForecast.fromJson(body['data']);
          _cachedAt        = DateTime.now();
          _cachedPatientId = patientId;
          return _cached;
        }
      }
      return null;
    } catch (e) {
      debugPrint('[SignalService] Generate error: $e');
      return null;
    }
  }

  void clearCache() {
    _cached          = null;
    _cachedAt        = null;
    _cachedPatientId = null;
  }

  // ── Fetch forecast history (for trend chart) ─────────────────────────────
  Future<List<ForecastHistoryPoint>> getForecastHistory() async {
    try {
      final prefs     = await SharedPreferences.getInstance();
      final token     = prefs.getString('auth_token');
      final patientId = prefs.getInt('user_id')
          ?? prefs.getInt('patient_id')
          ?? int.tryParse(prefs.getString('user_id') ?? '')
          ?? int.tryParse(prefs.getString('patient_id') ?? '');
      if (token == null || patientId == null) return [];

      final response = await http.get(
        Uri.parse('${ApiConfig.baseUrl}/signals/patient/$patientId/history?limit=7'),
        headers: ApiConfig.getAuthHeaders(token),
      ).timeout(const Duration(seconds: 10));

      if (response.statusCode == 200) {
        final body = jsonDecode(response.body);
        if (body['success'] == true && body['data'] is List) {
          final list = body['data'] as List;
          return list
              .map((e) => ForecastHistoryPoint.fromJson(e as Map<String, dynamic>))
              .toList()
              .reversed
              .toList(); // oldest first for chart
        }
      }
      return [];
    } catch (e) {
      debugPrint('[SignalService] History error: $e');
      return [];
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// DATA MODELS
// ─────────────────────────────────────────────────────────────────────────────

class AdherenceForecast {
  final int     patientId;
  final double  forecastScore;
  final String  riskLevel;       // 'low' | 'moderate' | 'high' | 'critical'
  final List<ActiveSignal> activeSignals;
  final SignalDetails signals;
  final DateTime createdAt;

  const AdherenceForecast({
    required this.patientId,
    required this.forecastScore,
    required this.riskLevel,
    required this.activeSignals,
    required this.signals,
    required this.createdAt,
  });

  factory AdherenceForecast.fromJson(Map<String, dynamic> json) {
    // signal_data may come as a JSON string from DB or as a Map from live API
    Map<String, dynamic> signalMap = {};
    final rawSignals = json['signals'] ?? json['signal_data'];
    if (rawSignals is String) {
      try { signalMap = jsonDecode(rawSignals) as Map<String, dynamic>; } catch (_) {}
    } else if (rawSignals is Map<String, dynamic>) {
      signalMap = rawSignals;
    }

    // interventions_triggered may also be a JSON string
    List<dynamic> interventions = [];
    final rawInterventions = json['interventionsTriggered'] ?? json['interventions_triggered'];
    if (rawInterventions is String) {
      try { interventions = jsonDecode(rawInterventions) as List; } catch (_) {}
    } else if (rawInterventions is List) {
      interventions = rawInterventions;
    }

    final activeSignalsRaw = json['activeSignals'] as List? ?? [];

    return AdherenceForecast(
      patientId:     json['patientId']    ?? json['patient_id']    ?? 0,
      forecastScore: (json['forecastScore'] ?? json['forecast_score'] ?? 0.0).toDouble(),
      riskLevel:     json['riskLevel']    ?? json['risk_level']    ?? 'low',
      activeSignals: activeSignalsRaw
          .map((s) => ActiveSignal.fromJson(s as Map<String, dynamic>))
          .toList(),
      signals:   SignalDetails.fromJson(signalMap),
      createdAt: json['createdAt']    != null ? DateTime.parse(json['createdAt'])
               : json['created_at']  != null ? DateTime.parse(json['created_at'])
               : DateTime.now(),
    );
  }

  // ── UI helpers ───────────────────────────────────────────────────────────────

  Color get riskColor {
    switch (riskLevel) {
      case 'critical': return const Color(0xFFB71C1C);
      case 'high':     return const Color(0xFFE53935);
      case 'moderate': return const Color(0xFFF57C00);
      default:         return const Color(0xFF2E7D32);
    }
  }

  Color get riskBgColor {
    switch (riskLevel) {
      case 'critical': return const Color(0xFFFFEBEE);
      case 'high':     return const Color(0xFFFFF3E0);
      case 'moderate': return const Color(0xFFFFFDE7);
      default:         return const Color(0xFFE8F5E9);
    }
  }

  IconData get riskIcon {
    switch (riskLevel) {
      case 'critical': return Icons.crisis_alert_rounded;
      case 'high':     return Icons.warning_amber_rounded;
      case 'moderate': return Icons.info_outline_rounded;
      default:         return Icons.check_circle_outline_rounded;
    }
  }

  String get riskLabel {
    switch (riskLevel) {
      case 'critical': return 'Critical Risk';
      case 'high':     return 'High Risk';
      case 'moderate': return 'Moderate Risk';
      default:         return 'Low Risk';
    }
  }

  int get scorePercent => (forecastScore * 100).round();
}

class ActiveSignal {
  final String signal;
  final String detail;
  final double score;

  const ActiveSignal({
    required this.signal,
    required this.detail,
    required this.score,
  });

  factory ActiveSignal.fromJson(Map<String, dynamic> json) => ActiveSignal(
    signal: json['signal'] ?? '',
    detail: json['detail'] ?? '',
    score:  (json['score'] ?? 0.0).toDouble(),
  );

  String get label {
    switch (signal) {
      case 'responseTimeDegradation': return 'Slow response time';
      case 'partialDayAdherence':     return 'Partial day adherence';
      case 'weekendCliff':            return 'Weekend drop-off';
      case 'postIllnessRecovery':     return 'Slow recovery';
      case 'specificMedDrift':        return 'Specific medication drift';
      case 'lowOverallAdherence':     return 'Low overall adherence';
      default:                        return signal;
    }
  }

  IconData get icon {
    switch (signal) {
      case 'responseTimeDegradation': return Icons.access_time_rounded;
      case 'partialDayAdherence':     return Icons.wb_sunny_outlined;
      case 'weekendCliff':            return Icons.weekend_outlined;
      case 'postIllnessRecovery':     return Icons.healing_outlined;
      case 'specificMedDrift':        return Icons.medication_outlined;
      case 'lowOverallAdherence':     return Icons.trending_down_rounded;
      default:                        return Icons.analytics_outlined;
    }
  }
}

class SignalDetails {
  final double responseTimeDegradation;
  final double partialDayAdherence;
  final double weekendCliff;
  final double postIllnessRecovery;
  final double specificMedDrift;

  const SignalDetails({
    required this.responseTimeDegradation,
    required this.partialDayAdherence,
    required this.weekendCliff,
    required this.postIllnessRecovery,
    required this.specificMedDrift,
  });

  factory SignalDetails.fromJson(Map<String, dynamic> json) => SignalDetails(
    responseTimeDegradation: (json['responseTimeDegradation']?['score'] ?? 0.0).toDouble(),
    partialDayAdherence:     (json['partialDayAdherence']?['score']     ?? 0.0).toDouble(),
    weekendCliff:            (json['weekendCliff']?['score']            ?? 0.0).toDouble(),
    postIllnessRecovery:     (json['postIllnessRecovery']?['score']     ?? 0.0).toDouble(),
    specificMedDrift:        (json['specificMedDrift']?['score']        ?? 0.0).toDouble(),
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FORECAST HISTORY POINT — used for trend chart
// ─────────────────────────────────────────────────────────────────────────────

class ForecastHistoryPoint {
  final double   score;
  final String   riskLevel;
  final DateTime createdAt;

  const ForecastHistoryPoint({
    required this.score,
    required this.riskLevel,
    required this.createdAt,
  });

  factory ForecastHistoryPoint.fromJson(Map<String, dynamic> json) =>
      ForecastHistoryPoint(
        score:     (json['forecastScore'] ?? json['forecast_score'] ?? 0.0).toDouble(),
        riskLevel: (json['riskLevel']     ?? json['risk_level']     ?? 'low').toString(),
        createdAt: json['createdAt']   != null
            ? DateTime.parse(json['createdAt'].toString())
            : json['created_at'] != null
                ? DateTime.parse(json['created_at'].toString())
                : DateTime.now(),
      );

  Color get color {
    switch (riskLevel) {
      case 'critical': return const Color(0xFFB71C1C);
      case 'high':     return const Color(0xFFE53935);
      case 'moderate': return const Color(0xFFF57C00);
      default:         return const Color(0xFF2E7D32);
    }
  }

  String get dayLabel {
    final now  = DateTime.now();
    final diff = now.difference(createdAt).inDays;
    if (diff == 0) return 'Today';
    if (diff == 1) return 'Yesterday';
    return '${createdAt.day}/${createdAt.month}';
  }
}