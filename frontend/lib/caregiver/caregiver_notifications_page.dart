import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../config/api_config.dart';

class CaregiverNotificationsPage extends StatefulWidget {
  const CaregiverNotificationsPage({super.key});
  @override
  State<CaregiverNotificationsPage> createState() => _CaregiverNotificationsPageState();
}

class _CaregiverNotificationsPageState extends State<CaregiverNotificationsPage> {
  static const Color primary   = Color(0xFF16A34A);
  static const Color primaryDk = Color(0xFF14532D);
  static const Color primaryLt = Color(0xFF4ADE80);

  List<Map<String, dynamic>> _notifications = [];
  bool   _isLoading = true;
  bool   _hasError  = false;
  String _filter    = 'all';

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    setState(() { _isLoading = true; _hasError = false; });
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');
      if (token == null) return;
      final resp = await http.get(
        Uri.parse('${ApiConfig.baseUrl}/caregivers/notifications'),
        headers: {'Authorization': 'Bearer $token', 'Content-Type': 'application/json'},
      ).timeout(const Duration(seconds: 15));
      if (resp.statusCode == 200) {
        final data = jsonDecode(resp.body);
        if (mounted) setState(() {
          _notifications = List<Map<String, dynamic>>.from(data['notifications'] ?? []);
          _isLoading = false;
        });
      } else {
        if (mounted) setState(() { _isLoading = false; _hasError = true; });
      }
    } catch (e) {
      if (mounted) setState(() { _isLoading = false; _hasError = true; });
    }
  }

  List<Map<String, dynamic>> get _filtered =>
      _filter == 'all' ? _notifications
          : _notifications.where((n) => n['type'] == _filter).toList();

  // ── type helpers ───────────────────────────────────────────────────────────
  Color _color(String t) {
    switch (t) {
      case 'emergency': return const Color(0xFFDC2626);
      case 'summary':   return const Color(0xFF1565C0);
      case 'milestone': return const Color(0xFF7C3AED);
      default:          return Colors.grey;
    }
  }

  Color _bg(String t) {
    switch (t) {
      case 'emergency': return const Color(0xFFFEE2E2);
      case 'summary':   return const Color(0xFFEFF6FF);
      case 'milestone': return const Color(0xFFF5F3FF);
      default:          return Colors.grey.shade100;
    }
  }

  IconData _icon(String t) {
    switch (t) {
      case 'emergency': return Icons.warning_amber_rounded;
      case 'summary':   return Icons.bar_chart_rounded;
      case 'milestone': return Icons.emoji_events_rounded;
      default:          return Icons.notifications_rounded;
    }
  }

  String _label(String t) {
    switch (t) {
      case 'emergency': return 'Emergency';
      case 'summary':   return 'Summary';
      case 'milestone': return 'Milestone';
      default:          return 'Alert';
    }
  }

  String _timeAgo(String? raw) {
    if (raw == null) return '';
    try {
      final s  = raw.contains('T') ? raw : raw.replaceFirst(' ', 'T');
      final dt = DateTime.parse(s).add(const Duration(hours: 1));
      final d  = DateTime.now().difference(dt);
      if (d.inMinutes < 1)  return 'Just now';
      if (d.inMinutes < 60) return '${d.inMinutes}m ago';
      if (d.inHours < 24)   return '${d.inHours}h ago';
      if (d.inDays == 1)    return 'Yesterday';
      return '${d.inDays}d ago';
    } catch (_) { return ''; }
  }

  int _unread(String type) => type == 'all'
      ? _notifications.where((n) => n['is_read'] == 0).length
      : _notifications.where((n) => n['type'] == type && n['is_read'] == 0).length;

  // ── BUILD ──────────────────────────────────────────────────────────────────

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF0FDF4),
      body: Column(children: [

        // ── header ──────────────────────────────────────────────────────────
        Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              colors: [primaryDk, primary],
              begin: Alignment.topLeft, end: Alignment.bottomRight,
            ),
            borderRadius: const BorderRadius.only(
              bottomLeft: Radius.circular(28), bottomRight: Radius.circular(28)),
            boxShadow: [BoxShadow(color: primary.withOpacity(0.3), blurRadius: 14, offset: const Offset(0, 6))],
          ),
          child: SafeArea(child: Stack(children: [
            // decorative circle
            Positioned(top: -20, right: -20,
              child: Container(width: 100, height: 100,
                decoration: BoxDecoration(shape: BoxShape.circle,
                    color: primaryLt.withOpacity(0.08)))),

            Padding(
              padding: const EdgeInsets.fromLTRB(8, 8, 8, 20),
              child: Column(children: [

                // top bar
                Row(children: [
                  IconButton(
                    icon: Container(
                      width: 36, height: 36,
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.15),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: const Icon(Icons.arrow_back_rounded, color: Colors.white, size: 18),
                    ),
                    onPressed: () => Navigator.pop(context),
                  ),
                  const Spacer(),
                  Column(children: [
                    const Text('Notifications', style: TextStyle(color: Colors.white,
                        fontSize: 18, fontWeight: FontWeight.w900)),
                    Text('${_notifications.length} total',
                        style: TextStyle(color: Colors.white.withOpacity(0.6), fontSize: 12)),
                  ]),
                  const Spacer(),
                  IconButton(
                    icon: Container(
                      width: 36, height: 36,
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.15),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: const Icon(Icons.refresh_rounded, color: Colors.white, size: 18),
                    ),
                    onPressed: _load,
                  ),
                ]),
                const SizedBox(height: 16),

                // filter chips
                SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  padding: const EdgeInsets.symmetric(horizontal: 8),
                  child: Row(children: [
                    _chip('all',       'All',       Icons.notifications_rounded),
                    const SizedBox(width: 8),
                    _chip('emergency', 'Emergency', Icons.warning_amber_rounded),
                    const SizedBox(width: 8),
                    _chip('summary',   'Summary',   Icons.bar_chart_rounded),
                    const SizedBox(width: 8),
                    _chip('milestone', 'Milestone', Icons.emoji_events_rounded),
                  ]),
                ),
              ]),
            ),
          ])),
        ),

        // ── body ────────────────────────────────────────────────────────────
        Expanded(child: _isLoading
            ? const Center(child: CircularProgressIndicator(color: primary))
            : _hasError ? _buildError()
            : _filtered.isEmpty ? _buildEmpty()
            : RefreshIndicator(
                color: primary,
                onRefresh: _load,
                child: ListView.builder(
                  padding: const EdgeInsets.fromLTRB(16, 20, 16, 30),
                  itemCount: _filtered.length,
                  itemBuilder: (_, i) => _card(_filtered[i]),
                ),
              )),
      ]),
    );
  }

  Widget _chip(String value, String label, IconData icon) {
    final selected = _filter == value;
    final count    = _unread(value);
    return GestureDetector(
      onTap: () => setState(() => _filter = value),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
        decoration: BoxDecoration(
          color: selected ? Colors.white : Colors.white.withOpacity(0.15),
          borderRadius: BorderRadius.circular(22),
          border: Border.all(color: selected ? Colors.transparent : Colors.white.withOpacity(0.2)),
        ),
        child: Row(children: [
          Icon(icon, size: 13, color: selected ? primary : Colors.white),
          const SizedBox(width: 6),
          Text(label, style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700,
              color: selected ? primary : Colors.white)),
          if (count > 0) ...[
            const SizedBox(width: 6),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
              decoration: BoxDecoration(
                color: selected ? const Color(0xFFDC2626) : Colors.white.withOpacity(0.3),
                borderRadius: BorderRadius.circular(10),
              ),
              child: Text('$count', style: const TextStyle(fontSize: 10,
                  fontWeight: FontWeight.bold, color: Colors.white)),
            ),
          ],
        ]),
      ),
    );
  }

Widget _card(Map<String, dynamic> n) {
  final type    = n['type']?.toString() ?? 'summary';
  final color   = _color(type);
  final bg      = _bg(type);
  final isRead  = n['is_read'] == 1 || n['is_read'] == true;
  final patient = n['patient_name']?.toString() ?? '';

  return Container(
    margin: const EdgeInsets.only(bottom: 12),
    decoration: BoxDecoration(
      color: Colors.white,
      borderRadius: BorderRadius.circular(18),
      border: Border(left: BorderSide(color: isRead ? color.withOpacity(0.3) : color, width: 4)),
      boxShadow: [
        BoxShadow(
          color: isRead ? Colors.black.withOpacity(0.03) : color.withOpacity(0.08),
          blurRadius: isRead ? 6 : 12, offset: const Offset(0, 3)),
      ],
    ),
    child: Padding(
      padding: const EdgeInsets.all(14),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [

        Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Container(
            width: 40, height: 40,
            decoration: BoxDecoration(color: bg, borderRadius: BorderRadius.circular(12)),
            child: Icon(_icon(type), color: color, size: 20),
          ),
          const SizedBox(width: 12),
          Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Row(children: [
              Expanded(child: Text(n['title']?.toString() ?? '',
                  style: TextStyle(fontSize: 13,
                      fontWeight: isRead ? FontWeight.w600 : FontWeight.w800,
                      color: const Color(0xFF0F172A), height: 1.3))),
              const SizedBox(width: 8),
              if (!isRead)
                Container(width: 8, height: 8,
                    decoration: BoxDecoration(color: color, shape: BoxShape.circle)),
            ]),
            const SizedBox(height: 2),
            Text(_timeAgo(n['created_at']?.toString()),
                style: TextStyle(fontSize: 11, color: Colors.grey.shade400)),
          ])),
        ]),

        const SizedBox(height: 10),
        Text(n['message']?.toString() ?? '',
            style: TextStyle(fontSize: 13, color: Colors.grey.shade600, height: 1.5)),
        const SizedBox(height: 10),

        Row(children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
            decoration: BoxDecoration(color: bg, borderRadius: BorderRadius.circular(20)),
            child: Row(mainAxisSize: MainAxisSize.min, children: [
              Icon(_icon(type), size: 10, color: color),
              const SizedBox(width: 4),
              Text(_label(type), style: TextStyle(fontSize: 10, color: color,
                  fontWeight: FontWeight.bold)),
            ]),
          ),
          if (patient.isNotEmpty) ...[
            const SizedBox(width: 8),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              decoration: BoxDecoration(
                color: primary.withOpacity(0.07),
                borderRadius: BorderRadius.circular(20),
              ),
              child: Row(mainAxisSize: MainAxisSize.min, children: [
                const Icon(Icons.person_outline_rounded, size: 10, color: primary),
                const SizedBox(width: 4),
                Text(patient, style: const TextStyle(fontSize: 10,
                    color: primary, fontWeight: FontWeight.bold)),
              ]),
            ),
          ],
        ]),
      ]),
    ),
  );
}

  Widget _buildEmpty() {
    return Center(child: Padding(
      padding: const EdgeInsets.all(32),
      child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
        Container(
          width: 90, height: 90,
          decoration: BoxDecoration(color: primary.withOpacity(0.07), shape: BoxShape.circle),
          child: Icon(Icons.notifications_none_rounded, size: 44, color: primary.withOpacity(0.4)),
        ),
        const SizedBox(height: 20),
        const Text('All caught up!', style: TextStyle(fontSize: 18,
            fontWeight: FontWeight.bold, color: Color(0xFF0F172A))),
        const SizedBox(height: 8),
        Text(
          _filter == 'all'
              ? 'You\'ll be notified when your patients need attention.'
              : 'No ${_label(_filter).toLowerCase()} notifications yet.',
          textAlign: TextAlign.center,
          style: TextStyle(color: Colors.grey.shade500, fontSize: 13, height: 1.5),
        ),
      ]),
    ));
  }

  Widget _buildError() {
    return Center(child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
      Icon(Icons.cloud_off_rounded, size: 56, color: Colors.grey.shade300),
      const SizedBox(height: 16),
      Text('Could not load notifications',
          style: TextStyle(color: Colors.grey.shade600, fontSize: 15)),
      const SizedBox(height: 16),
      ElevatedButton(
        onPressed: _load,
        style: ElevatedButton.styleFrom(backgroundColor: primary,
            foregroundColor: Colors.white, elevation: 0,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12))),
        child: const Text('Retry'),
      ),
    ]));
  }
}