import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../config/api_config.dart';

// ─────────────────────────────────────────────────────────────────────────────
// CAREGIVER EARLY WARNING PANEL
//
// Shows the AI adherence forecast for a specific patient.
// Used in PatientDetailsPage after the AssessmentCard.
//
// Usage:
//   CaregiverEarlyWarningPanel(patientId: p['id'], patientName: p['name'])
// ─────────────────────────────────────────────────────────────────────────────

class CaregiverEarlyWarningPanel extends StatefulWidget {
  final int    patientId;
  final String patientName;

  const CaregiverEarlyWarningPanel({
    super.key,
    required this.patientId,
    required this.patientName,
  });

  @override
  State<CaregiverEarlyWarningPanel> createState() =>
      _CaregiverEarlyWarningPanelState();
}

class _CaregiverEarlyWarningPanelState
    extends State<CaregiverEarlyWarningPanel> {

  Map<String, dynamic>? _forecast;
  bool _isLoading    = true;
  bool _isRefreshing = false;
  bool _expanded     = false;

  @override
  void initState() {
    super.initState();
    _load();
  }

  // ── data ────────────────────────────────────────────────────────────────────

  Future<void> _load() async {
    setState(() => _isLoading = true);
    final f = await _fetchForecast();
    if (mounted) setState(() { _forecast = f; _isLoading = false; });
  }

  Future<void> _refresh() async {
    setState(() => _isRefreshing = true);
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');
      final resp  = await http.post(
        Uri.parse('${ApiConfig.baseUrl}/signals/generate/${widget.patientId}'),
        headers: {'Authorization': 'Bearer $token', 'Content-Type': 'application/json'},
      ).timeout(const Duration(seconds: 15));

      if (resp.statusCode == 200) {
        final body = jsonDecode(resp.body);
        if (body['success'] == true && body['data'] != null) {
          if (mounted) setState(() => _forecast = body['data']);
        }
      }
    } catch (e) { debugPrint('[CaregiverEWP] refresh error: $e'); }
    if (mounted) setState(() => _isRefreshing = false);
  }

  Future<Map<String, dynamic>?> _fetchForecast() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');
      final resp  = await http.get(
        Uri.parse('${ApiConfig.baseUrl}/signals/patient/${widget.patientId}'),
        headers: {'Authorization': 'Bearer $token', 'Content-Type': 'application/json'},
      ).timeout(const Duration(seconds: 10));

      if (resp.statusCode == 200) {
        final body = jsonDecode(resp.body);
        if (body['success'] == true && body['data'] != null) return body['data'];
      }
    } catch (e) { debugPrint('[CaregiverEWP] fetch error: $e'); }
    return null;
  }

  // ── helpers ──────────────────────────────────────────────────────────────────

  String _riskLevel() => (_forecast?['riskLevel'] ?? _forecast?['risk_level'] ?? 'low').toString();

  double _score() {
    final s = _forecast?['forecastScore'] ?? _forecast?['forecast_score'] ?? 0.0;
    return (s as num).toDouble();
  }

  List<dynamic> _activeSignals() {
    final raw = _forecast?['activeSignals'];
    if (raw is List) return raw;
    return [];
  }

  String _createdAt() {
    final raw = _forecast?['createdAt'] ?? _forecast?['created_at'];
    if (raw == null) return '';
    try {
      final dt   = DateTime.parse(raw.toString());
      final diff = DateTime.now().difference(dt);
      if (diff.inMinutes < 1)  return 'just now';
      if (diff.inMinutes < 60) return '${diff.inMinutes} min ago';
      if (diff.inHours   < 24) return '${diff.inHours}h ago';
      return '${diff.inDays}d ago';
    } catch (_) { return ''; }
  }

  Color _riskColor() {
    switch (_riskLevel()) {
      case 'critical': return const Color(0xFFB71C1C);
      case 'high':     return const Color(0xFFE53935);
      case 'moderate': return const Color(0xFFF57C00);
      default:         return const Color(0xFF2E7D32);
    }
  }

  Color _riskBg() {
    switch (_riskLevel()) {
      case 'critical': return const Color(0xFFFFEBEE);
      case 'high':     return const Color(0xFFFFF3E0);
      case 'moderate': return const Color(0xFFFFFDE7);
      default:         return const Color(0xFFE8F5E9);
    }
  }

  IconData _riskIcon() {
    switch (_riskLevel()) {
      case 'critical': return Icons.crisis_alert_rounded;
      case 'high':     return Icons.warning_amber_rounded;
      case 'moderate': return Icons.info_outline_rounded;
      default:         return Icons.check_circle_outline_rounded;
    }
  }

  String _riskLabel() {
    switch (_riskLevel()) {
      case 'critical': return 'Critical Risk';
      case 'high':     return 'High Risk';
      case 'moderate': return 'Moderate Risk';
      default:         return 'Low Risk';
    }
  }

  String _signalLabel(String key) {
    switch (key) {
      case 'responseTimeDegradation': return 'Slow response time';
      case 'partialDayAdherence':     return 'Partial day adherence';
      case 'weekendCliff':            return 'Weekend drop-off';
      case 'postIllnessRecovery':     return 'Slow recovery';
      case 'specificMedDrift':        return 'Specific medication drift';
      case 'lowOverallAdherence':     return 'Low overall adherence';
      default:                        return key;
    }
  }

  IconData _signalIcon(String key) {
    switch (key) {
      case 'responseTimeDegradation': return Icons.access_time_rounded;
      case 'partialDayAdherence':     return Icons.wb_sunny_outlined;
      case 'weekendCliff':            return Icons.weekend_outlined;
      case 'postIllnessRecovery':     return Icons.healing_outlined;
      case 'specificMedDrift':        return Icons.medication_outlined;
      case 'lowOverallAdherence':     return Icons.trending_down_rounded;
      default:                        return Icons.analytics_outlined;
    }
  }

  // ── build ────────────────────────────────────────────────────────────────────

  @override
  Widget build(BuildContext context) {
    if (_isLoading) return _buildSkeleton();

    final color    = _riskColor();
    final bg       = _riskBg();
    final level    = _riskLevel();
    final score    = _score();
    final signals  = _activeSignals();
    final scoreInt = (score * 100).round();

    return Container(
      margin: const EdgeInsets.only(bottom: 14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: color.withOpacity(level == 'critical' ? 0.6 : 0.25),
          width: level == 'critical' ? 2 : 1.5,
        ),
        boxShadow: [
          BoxShadow(
            color: color.withOpacity(0.10),
            blurRadius: 14,
            offset: const Offset(0, 5),
          ),
        ],
      ),
      child: Column(children: [

        // ── top stripe ──────────────────────────────────────────────────────
        Container(
          height: 5,
          decoration: BoxDecoration(
            color: color,
            borderRadius: const BorderRadius.vertical(top: Radius.circular(20)),
          ),
        ),

        Padding(
          padding: const EdgeInsets.all(16),
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [

            // ── header ───────────────────────────────────────────────────────
            Row(children: [
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                    color: bg, borderRadius: BorderRadius.circular(12)),
                child: Icon(_riskIcon(), color: color, size: 20),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                  Text(
                    '🤖 AI Adherence Forecast',
                    style: TextStyle(
                        fontSize: 11,
                        color: Colors.grey.shade500,
                        letterSpacing: 0.4),
                  ),
                  Text(
                    _riskLabel(),
                    style: TextStyle(
                        fontSize: 15,
                        fontWeight: FontWeight.bold,
                        color: color),
                  ),
                ]),
              ),
              // score badge
              Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                decoration: BoxDecoration(
                    color: bg, borderRadius: BorderRadius.circular(20)),
                child: Text(
                  '$scoreInt%',
                  style: TextStyle(
                      fontSize: 17,
                      fontWeight: FontWeight.bold,
                      color: color),
                ),
              ),
              const SizedBox(width: 8),
              // refresh
              GestureDetector(
                onTap: _isRefreshing ? null : _refresh,
                child: Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                      color: Colors.grey.shade100,
                      borderRadius: BorderRadius.circular(10)),
                  child: _isRefreshing
                      ? SizedBox(
                          width: 15, height: 15,
                          child: CircularProgressIndicator(
                              strokeWidth: 2, color: color))
                      : Icon(Icons.refresh_rounded,
                          size: 17, color: Colors.grey.shade500),
                ),
              ),
            ]),

            const SizedBox(height: 12),

            // ── score bar ────────────────────────────────────────────────────
            Row(mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
              Text('Risk score',
                  style: TextStyle(
                      fontSize: 11, color: Colors.grey.shade500)),
              Text('$scoreInt / 100',
                  style: TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.bold,
                      color: color)),
            ]),
            const SizedBox(height: 5),
            ClipRRect(
              borderRadius: BorderRadius.circular(4),
              child: LinearProgressIndicator(
                value: score,
                minHeight: 7,
                backgroundColor: Colors.grey.shade100,
                valueColor: AlwaysStoppedAnimation<Color>(color),
              ),
            ),

            // ── signals ──────────────────────────────────────────────────────
            if (signals.isNotEmpty) ...[
              const SizedBox(height: 14),
              GestureDetector(
                onTap: () => setState(() => _expanded = !_expanded),
                child: Row(children: [
                  Text(
                    '${signals.length} risk factor${signals.length > 1 ? 's' : ''} detected',
                    style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                        color: Colors.grey.shade700),
                  ),
                  const Spacer(),
                  Icon(
                    _expanded
                        ? Icons.keyboard_arrow_up_rounded
                        : Icons.keyboard_arrow_down_rounded,
                    color: Colors.grey.shade400,
                    size: 18,
                  ),
                ]),
              ),
              if (_expanded) ...[
                const SizedBox(height: 10),
                ...signals.map((s) {
                  final key    = (s['signal'] ?? '').toString();
                  final detail = (s['detail'] ?? '').toString();
                  final sc     = ((s['score'] ?? 0.0) as num).toDouble();
                  return Container(
                    margin: const EdgeInsets.only(bottom: 8),
                    padding: const EdgeInsets.all(11),
                    decoration: BoxDecoration(
                      color: color.withOpacity(0.05),
                      borderRadius: BorderRadius.circular(12),
                      border:
                          Border.all(color: color.withOpacity(0.12)),
                    ),
                    child: Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                      Icon(_signalIcon(key), size: 15, color: color),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                          Text(_signalLabel(key),
                              style: TextStyle(
                                  fontSize: 12,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.grey.shade800)),
                          const SizedBox(height: 2),
                          Text(detail,
                              style: TextStyle(
                                  fontSize: 11,
                                  color: Colors.grey.shade600,
                                  height: 1.4)),
                        ]),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 6, vertical: 2),
                        decoration: BoxDecoration(
                          color: color.withOpacity(0.1),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(
                          '${(sc * 100).round()}%',
                          style: TextStyle(
                              fontSize: 10,
                              fontWeight: FontWeight.bold,
                              color: color),
                        ),
                      ),
                    ]),
                  );
                }),
              ],
            ],

            if (signals.isEmpty && level == 'low') ...[
              const SizedBox(height: 8),
              Text('No risk factors detected — patient adherence looks stable.',
                  style: TextStyle(
                      fontSize: 12, color: Colors.grey.shade500)),
            ],

            // ── caregiver action banner for high/critical ─────────────────
            if (level == 'high' || level == 'critical') ...[
              const SizedBox(height: 12),
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: color.withOpacity(0.06),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: color.withOpacity(0.2)),
                ),
                child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                  Icon(Icons.campaign_outlined, color: color, size: 16),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      level == 'critical'
                          ? 'Immediate attention needed. Consider contacting ${widget.patientName} or their doctor.'
                          : 'Consider sending ${widget.patientName} a reminder or checking in with them.',
                      style: TextStyle(
                          fontSize: 11,
                          color: color,
                          height: 1.4),
                    ),
                  ),
                ]),
              ),
            ],

            // ── timestamp ─────────────────────────────────────────────────
            const SizedBox(height: 10),
            Row(children: [
              Icon(Icons.access_time_rounded,
                  size: 11, color: Colors.grey.shade400),
              const SizedBox(width: 4),
              Text(
                'Updated ${_createdAt()}',
                style:
                    TextStyle(fontSize: 10, color: Colors.grey.shade400),
              ),
            ]),
          ]),
        ),
      ]),
    );
  }

  Widget _buildSkeleton() {
    return Container(
      margin: const EdgeInsets.only(bottom: 14),
      height: 110,
      decoration: BoxDecoration(
        color: Colors.grey.shade100,
        borderRadius: BorderRadius.circular(20),
      ),
      child: const Center(
          child: CircularProgressIndicator(strokeWidth: 2)),
    );
  }
}