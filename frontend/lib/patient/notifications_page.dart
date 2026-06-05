import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../config/api_config.dart';
import '../services/language_service.dart';
import '../widgets/barcode_scan_sheet.dart';
import '../services/barcode_service.dart';
import '../services/accessibility_service.dart';
import 'accessible_notification_cards.dart';

class NotificationsPage extends StatefulWidget {
  const NotificationsPage({super.key});

  @override
  State<NotificationsPage> createState() => _NotificationsPageState();
}

class _NotificationsPageState extends State<NotificationsPage>
    with SingleTickerProviderStateMixin {
  bool _isLoading = true;
  List<dynamic> _notifications = [];
  int _unreadCount = 0;
  late TabController _tabController;
  final Set<int> _processingIds = {};
  final List<String> _tabs = ['All', 'Pending', 'Missed', 'Achievements'];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: _tabs.length, vsync: this);
    _loadNotifications();
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  // ── DATA ───────────────────────────────────────────────────────────────────

  Future<void> _loadNotifications() async {
    setState(() => _isLoading = true);
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');
      if (token == null) {
        Navigator.pushReplacementNamed(context, '/signin');
        return;
      }
      final response = await http.get(
        Uri.parse('${ApiConfig.baseUrl}/notifications'),
        headers: ApiConfig.getAuthHeaders(token),
      );
      if (response.statusCode == 200) {
        final body = jsonDecode(response.body);
        setState(() {
          _notifications = body['data']['notifications'] ?? [];
          _unreadCount   = body['data']['unreadCount']   ?? 0;
          _isLoading     = false;
        });
      } else {
        setState(() => _isLoading = false);
      }
    } catch (e) {
      debugPrint('Error loading notifications: $e');
      setState(() => _isLoading = false);
    }
  }

  Map<String, dynamic> _parseData(dynamic raw) {
    if (raw == null) return {};
    if (raw is Map<String, dynamic>) return raw;
    if (raw is String && raw.isNotEmpty) {
      try { return jsonDecode(raw) as Map<String, dynamic>; } catch (_) {}
    }
    return {};
  }

  Future<void> _markAsRead(int notificationId, {bool reload = true}) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');
      await http.put(
        Uri.parse('${ApiConfig.baseUrl}/notifications/read/$notificationId'),
        headers: ApiConfig.getAuthHeaders(token!),
      );
      if (reload) _loadNotifications();
    } catch (e) { debugPrint('markAsRead error: $e'); }
  }

  Future<void> _markAllAsRead() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');
      await http.put(
        Uri.parse('${ApiConfig.baseUrl}/notifications/read-all'),
        headers: ApiConfig.getAuthHeaders(token!),
      );
      _loadNotifications();
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(
          content: const Text('All notifications marked as read'),
          backgroundColor: Colors.green,
          behavior: SnackBarBehavior.floating,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
        ));
      }
    } catch (e) { debugPrint('markAllAsRead error: $e'); }
  }

  // ── TAKEN ──────────────────────────────────────────────────────────────────

  Future<void> _handleTaken(Map<String, dynamic> notification) async {
    final data        = _parseData(notification['data']);
    final scheduleId  = _parseId(data['schedule_id']);
    final treatmentId = _parseId(data['treatment_id']);
    final notifId     = notification['id'] as int;
    if (scheduleId == null) return;

    setState(() => _processingIds.add(notifId));

    String? savedBarcode;
    if (treatmentId != null) savedBarcode = await _fetchSavedBarcode(treatmentId);

    if (savedBarcode != null && mounted) {
      await _showBarcodeConfirmDialog(
        savedBarcode: savedBarcode,
        scheduleId:   scheduleId,
        notifId:      notifId,
        medName:      _extractMedName(notification['title'] ?? ''),
      );
    } else {
      await _markTaken(scheduleId, notifId);
    }

    if (mounted) setState(() => _processingIds.remove(notifId));
  }

  Future<String?> _fetchSavedBarcode(int treatmentId) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');
      final response = await http.get(
        Uri.parse('${ApiConfig.baseUrl}/treatments/$treatmentId'),
        headers: ApiConfig.getAuthHeaders(token!),
      );
      if (response.statusCode == 200) {
        final body       = jsonDecode(response.body);
        final treatment  = body['treatment'] ?? body;
        final barcodeRaw = treatment['barcode_data'];
        if (barcodeRaw == null) return null;
        final parsed = barcodeRaw is String ? jsonDecode(barcodeRaw) : barcodeRaw;
        return (parsed['barcode'] ?? parsed['raw'] ?? parsed['rawValue'] ?? parsed['displayValue'])
            ?.toString();
      }
    } catch (_) {}
    return null;
  }

  Future<void> _showBarcodeConfirmDialog({
    required String savedBarcode,
    required int scheduleId,
    required int notifId,
    required String medName,
  }) async {
    await showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => _BarcodeConfirmSheet(
        medName:       medName,
        savedBarcode:  savedBarcode,
        onConfirmed:   () async { Navigator.pop(context); await _markTaken(scheduleId, notifId); },
        onScanRequest: () async {
          Navigator.pop(context);
          await _scanAndConfirm(savedBarcode: savedBarcode, scheduleId: scheduleId, notifId: notifId, medName: medName);
        },
      ),
    );
  }

  Future<void> _scanAndConfirm({
    required String savedBarcode,
    required int scheduleId,
    required int notifId,
    required String medName,
  }) async {
    final result = await BarcodeScanSheet.show(context, medicationName: medName);
    if (!mounted) return;

    if (result == null) {
      final confirmed = await _showManualConfirmDialog(medName);
      if (confirmed == true) await _markTaken(scheduleId, notifId);
      return;
    }

    if (result.rawValue == savedBarcode) {
      await _markTaken(scheduleId, notifId);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(
          content: const Row(children: [
            Icon(Icons.verified, color: Colors.white),
            SizedBox(width: 8),
            Text('Barcode confirmed — medication marked as taken!'),
          ]),
          backgroundColor: Colors.green,
          behavior: SnackBarBehavior.floating,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
        ));
      }
    } else {
      if (mounted) {
        final proceed = await showDialog<bool>(
          context: context,
          builder: (_) => AlertDialog(
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            title: const Row(children: [
              Icon(Icons.warning_amber_rounded, color: Colors.orange),
              SizedBox(width: 8),
              Text('Barcode Mismatch'),
            ]),
            content: const Text(
              'The scanned barcode does not match the saved medication.\n\n'
              'This could be a different package or brand. Did you take the correct medication?',
              style: TextStyle(fontSize: 15),
            ),
            actions: [
              TextButton(onPressed: () => Navigator.pop(context, false), child: const Text('Cancel')),
              ElevatedButton(
                onPressed: () => Navigator.pop(context, true),
                style: ElevatedButton.styleFrom(backgroundColor: Colors.orange, foregroundColor: Colors.white),
                child: const Text('Yes, I took it'),
              ),
            ],
          ),
        );
        if (proceed == true) await _markTaken(scheduleId, notifId);
      }
    }
  }

  Future<bool?> _showManualConfirmDialog(String medName) {
    return showDialog<bool>(
      context: context,
      builder: (_) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: const Text('Confirm Medication'),
        content: Text('Did you take $medName?', style: const TextStyle(fontSize: 15)),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context, false), child: const Text('No')),
          ElevatedButton(
            onPressed: () => Navigator.pop(context, true),
            style: ElevatedButton.styleFrom(backgroundColor: Colors.blue, foregroundColor: Colors.white),
            child: const Text('Yes, I took it'),
          ),
        ],
      ),
    );
  }

  Future<void> _markTaken(int scheduleId, int notifId) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');
      final response = await http.put(
        Uri.parse('${ApiConfig.baseUrl}/schedule/take/$scheduleId'),
        headers: ApiConfig.getAuthHeaders(token!),
      );
      if (response.statusCode == 200) {
        await _markAsRead(notifId, reload: false);
        _loadNotifications();
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(SnackBar(
            content: const Row(children: [
              Icon(Icons.check_circle, color: Colors.white),
              SizedBox(width: 8),
              Text('✅ Medication marked as taken!'),
            ]),
            backgroundColor: Colors.green,
            behavior: SnackBarBehavior.floating,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
          ));
        }
      }
    } catch (e) { debugPrint('markTaken error: $e'); }
  }

  // ── SNOOZE ─────────────────────────────────────────────────────────────────

Future<void> _showSnoozeDialog(Map<String, dynamic> notification) async {
  final data       = _parseData(notification['data']);
  final scheduleId = _parseId(data['schedule_id']);
  final notifId    = notification['id'] as int;
  if (scheduleId == null) return;

  final minutes = await showModalBottomSheet<int>(
    context: context,
    backgroundColor: Colors.transparent,
    builder: (ctx) => Container(
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      padding: const EdgeInsets.all(24),
      child: Column(mainAxisSize: MainAxisSize.min, children: [
        Container(width: 40, height: 4,
            decoration: BoxDecoration(color: Colors.grey.shade300, borderRadius: BorderRadius.circular(2))),
        const SizedBox(height: 20),
        const Row(children: [
          Icon(Icons.snooze, color: Colors.blue, size: 24),
          SizedBox(width: 12),
          Text('Snooze Reminder', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
        ]),
        const SizedBox(height: 6),
        Text('How long would you like to snooze?', style: TextStyle(color: Colors.grey.shade600)),
        const SizedBox(height: 20),
        Row(children: [
          Expanded(child: _snoozeOption(ctx, '15 min', 15, Colors.blue)),
          const SizedBox(width: 12),
          Expanded(child: _snoozeOption(ctx, '30 min', 30, Colors.orange)),
        ]),
        const SizedBox(height: 16),
        SizedBox(
          width: double.infinity,
          child: TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: Text('Cancel', style: TextStyle(color: Colors.grey.shade500)),
          ),
        ),
        SizedBox(height: MediaQuery.of(context).padding.bottom),
      ]),
    ),
  );

  if (minutes != null && mounted) await _snooze(scheduleId, notifId, minutes);
}

  Widget _snoozeOption(BuildContext ctx, String label, int minutes, Color color) {
    return Expanded(child: GestureDetector(
      onTap: () => Navigator.pop(ctx, minutes),
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 16),
        decoration: BoxDecoration(
          color: color.withOpacity(0.1),
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: color.withOpacity(0.3)),
        ),
        child: Column(mainAxisSize: MainAxisSize.min, children: [
          Icon(Icons.snooze, color: color, size: 22),
          const SizedBox(height: 4),
          Text(label, style: TextStyle(color: color, fontWeight: FontWeight.bold, fontSize: 13)),
        ]),
      ),
    ));
  }

  Future<void> _snooze(int scheduleId, int notifId, int minutes) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');
      await http.post(
        Uri.parse('${ApiConfig.baseUrl}/notifications/snooze/$scheduleId'),
        headers: ApiConfig.getAuthHeaders(token!),
        body: jsonEncode({'minutes': minutes}),
      );
      await _markAsRead(notifId, reload: false);
      _loadNotifications();
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(
          content: Text('😴 Snoozed for $minutes minutes'),
          backgroundColor: Colors.blue,
          behavior: SnackBarBehavior.floating,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
        ));
      }
    } catch (e) { debugPrint('snooze error: $e'); }
  }

  // ── SKIP ───────────────────────────────────────────────────────────────────

  Future<void> _skipDose(Map<String, dynamic> notification) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (_) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: const Text('Skip this dose?'),
        content: const Text(
          'This will mark the dose as skipped. Please consult your doctor before regularly skipping medications.',
          style: TextStyle(fontSize: 15),
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context, false), child: const Text('Cancel')),
          ElevatedButton(
            onPressed: () => Navigator.pop(context, true),
            style: ElevatedButton.styleFrom(backgroundColor: Colors.orange, foregroundColor: Colors.white),
            child: const Text('Skip Dose'),
          ),
        ],
      ),
    );

    if (confirmed == true) {
      final data       = _parseData(notification['data']);
      final scheduleId = _parseId(data['schedule_id']);
      final notifId    = notification['id'] as int;
      if (scheduleId == null) return;
      try {
        final prefs = await SharedPreferences.getInstance();
        final token = prefs.getString('auth_token');
        await http.put(
          Uri.parse('${ApiConfig.baseUrl}/schedule/skip/$scheduleId'),
          headers: ApiConfig.getAuthHeaders(token!),
        );
        await _markAsRead(notifId, reload: false);
        _loadNotifications();
      } catch (e) { debugPrint('skip error: $e'); }
    }
  }

  // ── HELPERS ────────────────────────────────────────────────────────────────

  int? _parseId(dynamic val) {
    if (val == null) return null;
    if (val is int) return val;
    return int.tryParse(val.toString());
  }

  String _extractMedName(String title) {
    final idx = title.indexOf(':');
    return idx != -1 ? title.substring(idx + 1).trim() : title;
  }

  String _getTimeAgo(String dateStr, bool isFr) {
    try {
      final date      = DateTime.parse(dateStr);
      final corrected = date.add(const Duration(hours: 1));
      final diff      = DateTime.now().difference(corrected);
      if (diff.inMinutes < 1)  return isFr ? 'À l\'instant' : 'Just now';
      if (diff.inMinutes < 60) return isFr ? 'Il y a ${diff.inMinutes} min' : '${diff.inMinutes} min ago';
      if (diff.inHours < 24)   return isFr ? 'Il y a ${diff.inHours} h'    : '${diff.inHours} h ago';
      if (diff.inDays == 1)    return isFr ? 'Hier'                         : 'Yesterday';
      return isFr ? 'Il y a ${diff.inDays} jours' : '${diff.inDays} days ago';
    } catch (_) { return ''; }
  }

  DateTime _correctedDate(String dateStr) {
    try { return DateTime.parse(dateStr).add(const Duration(hours: 1)); }
    catch (_) { return DateTime.now(); }
  }

  // ── STYLE ──────────────────────────────────────────────────────────────────
  // Every stage produced by notificationService._getNotificationStages() is
  // handled explicitly here. No stage should fall through to the default.
  //
  // Stage → button rules:
  //   showTaken   : PUT /schedule/take/:id  — marks dose as taken in DB
  //   showSnooze  : POST /notifications/snooze/:id  — adds snooze notification
  //   showSkip    : PUT /schedule/skip/:id  — marks dose as skipped in DB
  //   showDismiss : PUT /notifications/read/:id  — just marks as read
  //
  // Informational stages (SAFE_TO_EAT, INFORM_LATE) → dismiss only.
  // Escalation stages → taken only, no escape.
  // ──────────────────────────────────────────────────────────────────────────

  _NotifStyle _getStyle(Map<String, dynamic> notification) {
    final type  = (notification['type'] ?? '').toString();
    final data  = _parseData(notification['data']);
    final stage = (data['stage'] ?? '').toString();
    final title = (notification['title'] ?? '').toString();

    // ── Caregiver reminder ────────────────────────────────────────────────
    if ((data['type'] ?? '') == 'caregiver_reminder') {
      return _NotifStyle(
        color: Colors.teal, bgColor: const Color(0xFFE0F2F1),
        icon: Icons.favorite_outline_rounded, stage: 'caregiver',
        showTaken: false, showSnooze: false, showSkip: false, showDismiss: true,
      );
    }

    // ── Daily summary ─────────────────────────────────────────────────────
    if (type == 'summary') {
      final pct   = _parseId(data['pct']) ?? 0;
      final color = pct >= 90 ? Colors.green
                  : pct >= 70 ? Colors.blue
                  : pct >= 50 ? Colors.orange
                  : Colors.red;
      return _NotifStyle(
        color: color, bgColor: color.withOpacity(0.08),
        icon: Icons.bar_chart_rounded, stage: 'summary',
        showTaken: false, showSnooze: false, showSkip: false, showDismiss: false,
        isSummary: true, adherencePct: pct,
      );
    }

    // ── Achievement / Streak ──────────────────────────────────────────────
    if (type == 'achievement') {
      final streak = _parseId(data['streak']);
      return _NotifStyle(
        color: Colors.purple, bgColor: const Color(0xFFEEEDFE),
        icon: streak != null ? Icons.local_fire_department : Icons.emoji_events,
        stage: 'achievement',
        showTaken: false, showSnooze: false, showSkip: false, showDismiss: true,
        streakDays: streak,
      );
    }

    // ── ESCALATION ────────────────────────────────────────────────────────
    // Maximum urgency. Taken only — no escape routes.
    if (stage == 'ESCALATION') {
      return _NotifStyle(
        color: Colors.red.shade700, bgColor: const Color(0xFFFCEBEB),
        icon: Icons.crisis_alert, stage: 'escalation',
        showTaken: true, showSnooze: false, showSkip: false, showDismiss: false,
        isCritical: true,
      );
    }

    // ── MISSED (from Job 2) ───────────────────────────────────────────────
    // Standard/interval doses the patient didn't take.
    // Taken + Skip allowed. No snooze (they're already late).
    if (type == 'missed' || stage == 'MISSED') {
      return _NotifStyle(
        color: Colors.deepOrange, bgColor: const Color(0xFFFFF3E0),
        icon: Icons.error_outline, stage: 'missed',
        showTaken: true, showSnooze: false, showSkip: true, showDismiss: false,
      );
    }

    // ── FOLLOW_UP ─────────────────────────────────────────────────────────
    // HIGH priority dose overdue 15 min. Taken only — no snooze, no skip.
    if (stage == 'FOLLOW_UP') {
      return _NotifStyle(
        color: Colors.orange, bgColor: const Color(0xFFFFF8E1),
        icon: Icons.warning_amber_rounded, stage: 'followup',
        showTaken: true, showSnooze: false, showSkip: false, showDismiss: false,
      );
    }

    // ── PREP / EARLY (standard doses) ────────────────────────────────────
    // Heads-up before the dose time. Dismiss only — it's too early to confirm.
    if (stage == 'PREP') {
      return _NotifStyle(
        color: Colors.amber.shade700, bgColor: const Color(0xFFFFFDE7),
        icon: Icons.access_time, stage: 'prep',
        showTaken: false, showSnooze: false, showSkip: false, showDismiss: true,
      );
    }

    // ── MAIN / MAIN_HIGH (standard + interval + during/after meal) ────────
    // It is time. Taken + Snooze.
    if (stage == 'MAIN') {
      return _NotifStyle(
        color: Colors.blue, bgColor: const Color(0xFFE6F1FB),
        icon: Icons.medication, stage: 'main',
        showTaken: true, showSnooze: true, showSkip: false, showDismiss: false,
      );
    }

    // ── MAIN_HIGH ─────────────────────────────────────────────────────────
    // Critical dose — Taken only, no snooze.
    if (stage == 'MAIN_HIGH') {
      return _NotifStyle(
        color: Colors.red.shade600, bgColor: const Color(0xFFFCEBEB),
        icon: Icons.medication, stage: 'main_high',
        showTaken: true, showSnooze: false, showSkip: false, showDismiss: false,
        isCritical: true,
      );
    }

    // ── SNOOZE (from snooze controller) ───────────────────────────────────
    if (stage == 'SNOOZE') {
      return _NotifStyle(
        color: Colors.blueGrey, bgColor: const Color(0xFFECEFF1),
        icon: Icons.snooze, stage: 'snooze',
        showTaken: true, showSnooze: false, showSkip: false, showDismiss: false,
      );
    }

    // ── BEFORE MEAL stages ────────────────────────────────────────────────

    // BEFORE_MEAL_EARLY: window is opening, prepare now. Dismiss only.
    if (stage == 'BEFORE_MEAL_EARLY') {
      return _NotifStyle(
        color: Colors.amber.shade700, bgColor: const Color(0xFFFFFDE7),
        icon: Icons.restaurant_menu, stage: 'before_meal_early',
        showTaken: false, showSnooze: false, showSkip: false, showDismiss: true,
      );
    }

    // BEFORE_MEAL_MAIN: take it NOW before eating. Taken + Snooze (small window).
    if (stage == 'BEFORE_MEAL_MAIN') {
      return _NotifStyle(
        color: Colors.orange, bgColor: const Color(0xFFFFF3E0),
        icon: Icons.restaurant_menu, stage: 'before_meal_main',
        showTaken: true, showSnooze: true, showSkip: false, showDismiss: false,
      );
    }
    
     // BEFORE_MEAL_MAIN_HIGH: HIGH priority — take NOW, no snooze allowed.
        if (stage == 'BEFORE_MEAL_MAIN_HIGH') {
      return _NotifStyle(
        color: Colors.deepOrange, bgColor: const Color(0xFFFBE9E7),
        icon: Icons.restaurant_menu, stage: 'before_meal_main_high',
        showTaken: true, showSnooze: false, showSkip: false, showDismiss: false,
        isCritical: true,
      );
    }


    // BEFORE_MEAL_FOLLOWUP (HIGH only): last chance before meal starts. Taken only.
    if (stage == 'BEFORE_MEAL_FOLLOWUP') {
      return _NotifStyle(
        color: Colors.deepOrange, bgColor: const Color(0xFFFBE9E7),
        icon: Icons.warning_amber_rounded, stage: 'before_meal_followup',
        showTaken: true, showSnooze: false, showSkip: false, showDismiss: false,
      );
    }

    // INFORM_LATE: window is gone — DO NOT take now. Informational + dismiss only.
    if (stage == 'INFORM_LATE') {
      return _NotifStyle(
        color: Colors.grey.shade600, bgColor: const Color(0xFFF5F5F5),
        icon: Icons.info_outline, stage: 'inform_late',
        showTaken: false, showSnooze: false, showSkip: false, showDismiss: true,
        isInformational: true,
      );
    }

    // ── BEDTIME stages ────────────────────────────────────────────────────

    // BEDTIME_PREP: 30 min before bedtime. Dismiss only — too early to confirm.
    if (stage == 'BEDTIME_PREP') {
      return _NotifStyle(
        color: Colors.indigo.shade300, bgColor: const Color(0xFFE8EAF6),
        icon: Icons.bedtime_outlined, stage: 'bedtime_prep',
        showTaken: false, showSnooze: false, showSkip: false, showDismiss: true,
      );
    }

    // BEDTIME_MAIN: it is bedtime. Taken only — no snooze for sleeping medication.
    if (stage == 'BEDTIME_MAIN') {
      return _NotifStyle(
        color: Colors.indigo, bgColor: const Color(0xFFE8EAF6),
        icon: Icons.bedtime, stage: 'bedtime_main',
        showTaken: true, showSnooze: false, showSkip: false, showDismiss: false,
      );
    }

    // BEDTIME_LATE: patient still awake 20min past bedtime. Taken only.
    if (stage == 'BEDTIME_LATE') {
      return _NotifStyle(
        color: Colors.indigo.shade700, bgColor: const Color(0xFFE8EAF6),
        icon: Icons.nightlight_round, stage: 'bedtime_late',
        showTaken: true, showSnooze: false, showSkip: false, showDismiss: false,
      );
    }

    // ── EMPTY STOMACH stages ──────────────────────────────────────────────

    // EMPTY_STOMACH_PREP: prepare medication. Dismiss only.
    if (stage == 'EMPTY_STOMACH_PREP') {
      return _NotifStyle(
        color: Colors.teal, bgColor: const Color(0xFFE0F2F1),
        icon: Icons.no_meals_outlined, stage: 'empty_stomach_prep',
        showTaken: false, showSnooze: false, showSkip: false, showDismiss: true,
      );
    }
    if (stage == 'EMPTY_STOMACH_MAIN') {
  return _NotifStyle(
    color: Colors.teal, bgColor: const Color(0xFFE0F2F1),
    icon: Icons.no_meals_outlined, stage: 'empty_stomach_main',
    showTaken: true, showSnooze: true, showSkip: false, showDismiss: false,
  );
}

    // SAFE_TO_EAT: purely informational — you can eat now. Dismiss only.
    if (stage == 'SAFE_TO_EAT') {
      return _NotifStyle(
        color: Colors.green, bgColor: const Color(0xFFE8F5E9),
        icon: Icons.restaurant, stage: 'safe_to_eat',
        showTaken: false, showSnooze: false, showSkip: false, showDismiss: true,
        isInformational: true,
      );
    }
    // ── AI INSIGHT ────────────────────────────────────────────────────────
if (type == 'ai_insight') {
  return _NotifStyle(
    color: const Color(0xFF6750A4), bgColor: const Color(0xFFF3EFF7),
    icon: Icons.psychology_outlined, stage: 'ai_insight',
    showTaken: false, showSnooze: false, showSkip: false, showDismiss: true,
    isInformational: true,
  );
}
    // ── DEFAULT ───────────────────────────────────────────────────────────
    // Fallback for any unrecognised stage. Treated as a standard main reminder.
    return _NotifStyle(
      color: Colors.blue, bgColor: const Color(0xFFE6F1FB),
      icon: Icons.medication, stage: 'main',
      showTaken: true, showSnooze: true, showSkip: false, showDismiss: false,
    );
  }

  // ── FILTER ─────────────────────────────────────────────────────────────────

  List<dynamic> _filteredNotifications(int tabIndex) {
    switch (tabIndex) {
      case 1: // Pending — unread, actionable reminders
        return _notifications.where((n) {
          final type   = (n['type'] ?? '').toString();
          final data   = _parseData(n['data']);
          final stage  = (data['stage'] ?? '').toString();
          final isRead = n['is_read'] == 1 || n['is_read'] == true;
          return !isRead &&
              type != 'achievement' &&
              type != 'missed'  &&
              type != 'summary' &&
              type != 'ai_insight' &&
              stage != 'MISSED' &&
              stage != 'INFORM_LATE' &&
              stage != 'SAFE_TO_EAT';
        }).toList();
      case 2: // Missed
        return _notifications.where((n) {
          final type  = (n['type'] ?? '').toString();
          final data  = _parseData(n['data']);
          final stage = (data['stage'] ?? '').toString();
          return type == 'missed' || stage == 'MISSED';
        }).toList();
      case 3: // Achievements + summaries
        return _notifications.where((n) {
          final type = (n['type'] ?? '').toString();
          return type == 'achievement' || type == 'summary';
        }).toList();
      default:
        return _notifications;
    }
  }

  // ── GROUP BY DATE ──────────────────────────────────────────────────────────

  Map<String, List<dynamic>> _groupByDate(List<dynamic> notifications, bool isFr) {
    final now       = DateTime.now();
    final today     = DateTime(now.year, now.month, now.day);
    final yesterday = today.subtract(const Duration(days: 1));
    final groups    = <String, List<dynamic>>{};

    for (final n in notifications) {
      try {
        final date     = _correctedDate(n['created_at'].toString());
        final dateOnly = DateTime(date.year, date.month, date.day);
        String key;
        if (dateOnly == today)          key = isFr ? 'Aujourd\'hui' : 'Today';
        else if (dateOnly == yesterday) key = isFr ? 'Hier'         : 'Yesterday';
        else key = isFr
            ? '${date.day}/${date.month}/${date.year}'
            : '${date.month}/${date.day}/${date.year}';
        groups.putIfAbsent(key, () => []).add(n);
      } catch (_) {
        groups.putIfAbsent('Other', () => []).add(n);
      }
    }
    return groups;
  }

  // ── BUILD ──────────────────────────────────────────────────────────────────

  @override
  Widget build(BuildContext context) {
    final lang = Provider.of<LanguageService>(context);
    final isFr = lang.getCurrentLanguage() == 'fr';

    return Scaffold(
      backgroundColor: const Color(0xFFF8F9FA),
      appBar: AppBar(
        backgroundColor: Colors.white, elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.black54),
          onPressed: () => Navigator.pop(context),
        ),
        title: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text(lang.translate('notifications'),
              style: const TextStyle(color: Color(0xFF1A237E), fontWeight: FontWeight.bold, fontSize: 18)),
          Text('$_unreadCount ${isFr ? 'non lue(s)' : 'unread'}',
              style: TextStyle(color: Colors.grey.shade500, fontSize: 12)),
        ]),
        actions: [
          if (_unreadCount > 0)
            TextButton(
              onPressed: _markAllAsRead,
              child: Text(lang.translate('markAllRead'),
                  style: const TextStyle(color: Colors.blue, fontSize: 13)),
            ),
          IconButton(
            icon: const Icon(Icons.refresh, color: Colors.blue),
            onPressed: _loadNotifications,
          ),
        ],
        bottom: TabBar(
          controller: _tabController,
          labelColor: Colors.blue,
          unselectedLabelColor: Colors.grey,
          indicatorColor: Colors.blue,
          indicatorWeight: 3,
          labelStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
          tabs: _tabs.map((t) => Tab(text: t)).toList(),
        ),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : TabBarView(
              controller: _tabController,
              children: List.generate(_tabs.length, (tabIdx) {
                final filtered = _filteredNotifications(tabIdx);
                if (filtered.isEmpty) return _buildEmpty(isFr, tabIdx);
                final groups   = _groupByDate(filtered, isFr);
                return RefreshIndicator(
                  onRefresh: _loadNotifications,
                  child: ListView(
                    padding: const EdgeInsets.fromLTRB(16, 12, 16, 30),
                    children: groups.entries.expand((entry) => [
                      _buildDateHeader(entry.key),
                      ...entry.value.map((n) => _buildNotificationCard(n, isFr)),
                    ]).toList(),
                  ),
                );
              }),
            ),
    );
  }

  Widget _buildDateHeader(String label) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(4, 16, 4, 8),
      child: Text(label,
          style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold,
              color: Colors.grey.shade500, letterSpacing: 0.5)),
    );
  }

  Widget _buildEmpty(bool isFr, int tabIdx) {
    final icons    = [Icons.notifications_off_outlined, Icons.check_circle_outline,
                      Icons.celebration, Icons.emoji_events_outlined];
    final messages = [
      isFr ? 'Aucune notification'         : 'No notifications',
      isFr ? 'Pas de doses en attente 🎉'  : 'No pending doses 🎉',
      isFr ? 'Aucune dose manquée ✅'       : 'No missed doses ✅',
      isFr ? 'Pas encore de succès'        : 'No achievements yet',
    ];
    final colors = [Colors.grey, Colors.green, Colors.green, Colors.purple];
    return Center(child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
      Icon(icons[tabIdx], size: 80, color: colors[tabIdx].withOpacity(0.3)),
      const SizedBox(height: 16),
      Text(messages[tabIdx], style: TextStyle(fontSize: 18, color: Colors.grey.shade500)),
    ]));
  }

  // ── NOTIFICATION CARD ──────────────────────────────────────────────────────

  Widget _buildNotificationCard(Map<String, dynamic> notification, bool isFr) {
      // ── Accessibility overrides ──────────────────────────────────
  final a11y = AccessibilityService.instance;
  if (a11y.illiteracyMode) {
    return IlliteracyNotificationCard(
      notification: notification,
      isFr:         isFr,
      onTaken:      () => _handleTaken(notification),
      onSnooze:     () => _showSnoozeDialog(notification),
      onSkip:       () => _skipDose(notification),
      onDismiss:    () => _markAsRead(notification['id'] as int),
      getStyle:     _getStyle,
    );
  }
  if (a11y.visualImpairmentMode) {
    return VisualImpairmentNotificationCard(
      notification: notification,
      isFr:         isFr,
      onTaken:      () => _handleTaken(notification),
      onSnooze:     () => _showSnoozeDialog(notification),
      onSkip:       () => _skipDose(notification),
      onDismiss:    () => _markAsRead(notification['id'] as int),
      getStyle:     _getStyle,
    );
  }
    final notifId   = notification['id'] as int;
    final style     = _getStyle(notification);
    final isRead    = notification['is_read'] == 1 || notification['is_read'] == true;
    final isProc    = _processingIds.contains(notifId);
    final data      = _parseData(notification['data']);
    final priority  = (data['priority'] ?? 'MEDIUM').toString();
    final condition = (data['condition'] ?? '').toString();
    final timeAgo   = _getTimeAgo(notification['created_at']?.toString() ?? '', isFr);
    final title     = (notification['title'] ?? '').toString();
    final message   = (notification['message'] ?? '').toString();

    // Scheduled time — shown on missed cards
    String? scheduledAt;
    if (style.stage == 'missed') {
      final schedDt = data['scheduled_date_time']?.toString();
      if (schedDt != null) {
        try {
          final d = DateTime.parse(schedDt);
          scheduledAt = '${d.hour.toString().padLeft(2,'0')}:${d.minute.toString().padLeft(2,'0')}';
        } catch (_) {}
      }
    }

    if (style.isSummary) return _buildSummaryCard(notification, data, style, timeAgo, isFr);
    if (style.stage == 'achievement') return _buildAchievementCard(notification, data, style, timeAgo, isRead, isFr);

    return GestureDetector(
      onTap: () { if (!isRead && !style.showTaken) _markAsRead(notifId); },
      child: Container(
        margin: const EdgeInsets.only(bottom: 12),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(18),
          border: style.isCritical
              ? Border.all(color: Colors.red.shade400, width: 2)
              : (!isRead ? Border.all(color: style.color.withOpacity(0.4), width: 1.5) : null),
          boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.04),
              blurRadius: 8, offset: const Offset(0, 4))],
        ),
        child: Column(children: [

          // colour stripe at top
          Container(height: 4, decoration: BoxDecoration(
            color: style.color,
            borderRadius: const BorderRadius.vertical(top: Radius.circular(18)),
          )),

          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [

              // header row
              Row(children: [
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(color: style.bgColor, borderRadius: BorderRadius.circular(12)),
                  child: Icon(style.icon, color: style.color, size: 22),
                ),
                const SizedBox(width: 12),
                Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Text(title, style: TextStyle(
                    fontSize: 15,
                    fontWeight: isRead ? FontWeight.w500 : FontWeight.bold,
                    color: const Color(0xFF1A237E),
                  )),
                  if (condition.isNotEmpty) ...[
                    const SizedBox(height: 2),
                    Text(condition, style: TextStyle(fontSize: 11, color: style.color.withOpacity(0.8))),
                  ],
                ])),
                if (!isRead)
                  Container(width: 9, height: 9,
                      decoration: BoxDecoration(color: style.color, shape: BoxShape.circle)),
                const SizedBox(width: 4),
                if (priority == 'HIGH')
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 3),
                    decoration: BoxDecoration(
                        color: Colors.red.shade50, borderRadius: BorderRadius.circular(20)),
                    child: Text('HIGH', style: TextStyle(
                        fontSize: 10, color: Colors.red.shade700, fontWeight: FontWeight.bold)),
                  ),
              ]),
              const SizedBox(height: 10),

              // message
              Text(message, style: TextStyle(fontSize: 14, color: Colors.grey.shade700, height: 1.4)),

              // informational banner (INFORM_LATE / SAFE_TO_EAT)
              if (style.isInformational) ...[
                const SizedBox(height: 8),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                  decoration: BoxDecoration(
                    color: style.color.withOpacity(0.08),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Row(children: [
                    Icon(Icons.info_outline, size: 13, color: style.color),
                    const SizedBox(width: 6),
                    Expanded(child: Text(
                      style.stage == 'safe_to_eat'
                          ? 'No action needed — this is an informational reminder.'
                          : 'Do not take this medication now. The timing window has passed.',
                      style: TextStyle(fontSize: 11, color: style.color),
                    )),
                  ]),
                ),
              ],

              // scheduled time for missed cards
              if (scheduledAt != null) ...[
                const SizedBox(height: 6),
                Row(children: [
                  Icon(Icons.schedule, size: 13, color: Colors.grey.shade400),
                  const SizedBox(width: 4),
                  Text(
                    isFr ? 'Prévu à $scheduledAt' : 'Scheduled at $scheduledAt',
                    style: TextStyle(fontSize: 12, color: Colors.grey.shade500),
                  ),
                ]),
              ],

              const SizedBox(height: 12),
              Text(timeAgo, style: TextStyle(fontSize: 11, color: Colors.grey.shade400)),
              const SizedBox(height: 14),

              // action buttons
              if (!isRead && (style.showTaken || style.showSnooze || style.showSkip || style.showDismiss))
                isProc
                    ? const Center(child: SizedBox(width: 22, height: 22,
                        child: CircularProgressIndicator(strokeWidth: 2, color: Colors.blue)))
                    : _buildActions(notification, style, notifId, isFr),
            ]),
          ),
        ]),
      ),
    );
  }

  // ── SUMMARY CARD ───────────────────────────────────────────────────────────

  Widget _buildSummaryCard(Map<String, dynamic> notification, Map<String, dynamic> data,
      _NotifStyle style, String timeAgo, bool isFr) {
    final pct   = style.adherencePct ?? 0;
    final taken = _parseId(data['taken']) ?? 0;
    final total = _parseId(data['total']) ?? 0;

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.04),
            blurRadius: 8, offset: const Offset(0, 4))],
      ),
      child: Column(children: [
        Container(height: 4, decoration: BoxDecoration(
          color: style.color,
          borderRadius: const BorderRadius.vertical(top: Radius.circular(18)),
        )),
        Padding(
          padding: const EdgeInsets.all(16),
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Row(children: [
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(color: style.bgColor, borderRadius: BorderRadius.circular(12)),
                child: Icon(style.icon, color: style.color, size: 22),
              ),
              const SizedBox(width: 12),
              Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text(notification['title'] ?? '',
                    style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: Color(0xFF1A237E))),
                Text(isFr ? 'Bilan quotidien' : 'Daily summary',
                    style: TextStyle(fontSize: 11, color: style.color)),
              ])),
              Text('$pct%', style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: style.color)),
            ]),
            const SizedBox(height: 12),
            Text(notification['message'] ?? '',
                style: TextStyle(fontSize: 14, color: Colors.grey.shade700)),
            const SizedBox(height: 12),
            Row(children: [
              Text(isFr ? 'Observance' : 'Adherence',
                  style: TextStyle(fontSize: 12, color: Colors.grey.shade500)),
              const Spacer(),
              Text('$taken/$total',
                  style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: style.color)),
            ]),
            const SizedBox(height: 6),
            ClipRRect(
              borderRadius: BorderRadius.circular(4),
              child: LinearProgressIndicator(
                value: total > 0 ? taken / total : 0,
                minHeight: 8,
                backgroundColor: Colors.grey.shade100,
                valueColor: AlwaysStoppedAnimation<Color>(style.color),
              ),
            ),
            const SizedBox(height: 10),
            Text(timeAgo, style: TextStyle(fontSize: 11, color: Colors.grey.shade400)),
          ]),
        ),
      ]),
    );
  }

  // ── ACHIEVEMENT CARD ───────────────────────────────────────────────────────

  Widget _buildAchievementCard(Map<String, dynamic> notification, Map<String, dynamic> data,
      _NotifStyle style, String timeAgo, bool isRead, bool isFr) {
    final streak = style.streakDays;

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: !isRead ? Border.all(color: Colors.purple.withOpacity(0.3), width: 1.5) : null,
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.04),
            blurRadius: 8, offset: const Offset(0, 4))],
      ),
      child: Column(children: [
        Container(height: 4, decoration: const BoxDecoration(
          color: Colors.purple,
          borderRadius: BorderRadius.vertical(top: Radius.circular(18)),
        )),
        Padding(
          padding: const EdgeInsets.all(16),
          child: Row(children: [
            Container(
              width: 56, height: 56,
              decoration: BoxDecoration(color: const Color(0xFFEEEDFE), borderRadius: BorderRadius.circular(16)),
              child: Center(child: streak != null
                  ? Column(mainAxisSize: MainAxisSize.min, children: [
                      const Icon(Icons.local_fire_department, color: Colors.orange, size: 22),
                      Text('$streak', style: const TextStyle(fontSize: 12,
                          fontWeight: FontWeight.bold, color: Colors.purple)),
                    ])
                  : const Icon(Icons.emoji_events, color: Colors.purple, size: 28)),
            ),
            const SizedBox(width: 14),
            Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text(notification['title'] ?? '',
                  style: TextStyle(fontSize: 15,
                      fontWeight: isRead ? FontWeight.w500 : FontWeight.bold,
                      color: const Color(0xFF1A237E))),
              const SizedBox(height: 4),
              Text(notification['message'] ?? '',
                  style: TextStyle(fontSize: 13, color: Colors.grey.shade600, height: 1.4)),
              const SizedBox(height: 6),
              Text(timeAgo, style: TextStyle(fontSize: 11, color: Colors.grey.shade400)),
            ])),
            if (!isRead)
              Container(width: 9, height: 9,
                  decoration: const BoxDecoration(color: Colors.purple, shape: BoxShape.circle)),
          ]),
        ),
      ]),
    );
  }

  // ── ACTION BUTTONS ─────────────────────────────────────────────────────────

  Widget _buildActions(Map<String, dynamic> notification, _NotifStyle style, int notifId, bool isFr) {
    return Row(children: [

      if (style.showTaken)
        Expanded(child: SizedBox(
          height: 44,
          child: ElevatedButton.icon(
            onPressed: () => _handleTaken(notification),
            icon: const Icon(Icons.check_circle_outline, size: 18),
            label: const Text('Taken ✓', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.green, foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              elevation: 0,
            ),
          ),
        )),

      if (style.showSnooze) ...[
        if (style.showTaken) const SizedBox(width: 8),
        Expanded(child: SizedBox(
          height: 44,
          child: OutlinedButton.icon(
            onPressed: () => _showSnoozeDialog(notification),
            icon: const Icon(Icons.snooze, size: 18),
            label: Text(isFr ? 'Rappel' : 'Snooze',
                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
            style: OutlinedButton.styleFrom(
              foregroundColor: Colors.blue,
              side: BorderSide(color: Colors.blue.shade300),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            ),
          ),
        )),
      ],

      if (style.showDismiss) ...[
        Expanded(child: SizedBox(
          height: 44,
          child: OutlinedButton(
            onPressed: () => _markAsRead(notifId),
            style: OutlinedButton.styleFrom(
              foregroundColor: Colors.grey.shade600,
              side: BorderSide(color: Colors.grey.shade300),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            ),
            child: Text(isFr ? 'Compris ✓' : 'Got it ✓',
                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
          ),
        )),
      ],

      if (style.showSkip) ...[
        if (style.showTaken) const SizedBox(width: 8),
        SizedBox(
          height: 44,
          child: OutlinedButton(
            onPressed: () => _skipDose(notification),
            style: OutlinedButton.styleFrom(
              foregroundColor: Colors.grey,
              side: BorderSide(color: Colors.grey.shade300),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              padding: const EdgeInsets.symmetric(horizontal: 14),
            ),
            child: Text(isFr ? 'Ignorer' : 'Skip',
                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
          ),
        ),
      ],
    ]);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// BARCODE CONFIRM SHEET
// ─────────────────────────────────────────────────────────────────────────────

class _BarcodeConfirmSheet extends StatelessWidget {
  final String medName;
  final String savedBarcode;
  final VoidCallback onConfirmed;
  final VoidCallback onScanRequest;

  const _BarcodeConfirmSheet({
    required this.medName,
    required this.savedBarcode,
    required this.onConfirmed,
    required this.onScanRequest,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      padding: const EdgeInsets.all(24),
      child: Column(mainAxisSize: MainAxisSize.min, children: [
        Container(width: 40, height: 4,
            decoration: BoxDecoration(color: Colors.grey.shade300, borderRadius: BorderRadius.circular(2))),
        const SizedBox(height: 20),
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(color: Colors.blue.shade50, shape: BoxShape.circle),
          child: const Icon(Icons.qr_code_scanner, color: Colors.blue, size: 36),
        ),
        const SizedBox(height: 16),
        const Text('Confirm your medication',
            style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Color(0xFF1A237E))),
        const SizedBox(height: 8),
        Text(medName, style: TextStyle(fontSize: 16, color: Colors.grey.shade600)),
        const SizedBox(height: 8),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
          decoration: BoxDecoration(color: Colors.green.shade50, borderRadius: BorderRadius.circular(20)),
          child: Row(mainAxisSize: MainAxisSize.min, children: [
            Icon(Icons.qr_code, size: 14, color: Colors.green.shade600),
            const SizedBox(width: 6),
            Text(BarcodeService.formatForDisplay(savedBarcode),
                style: TextStyle(fontSize: 12, color: Colors.green.shade700, fontFamily: 'monospace')),
          ]),
        ),
        const SizedBox(height: 24),
        Text(
          'You have a barcode saved for this medication.\nScan the box to confirm you have the right one.',
          textAlign: TextAlign.center,
          style: TextStyle(fontSize: 14, color: Colors.grey.shade600, height: 1.5),
        ),
        const SizedBox(height: 24),
        SizedBox(
          width: double.infinity, height: 52,
          child: ElevatedButton.icon(
            onPressed: onScanRequest,
            icon: const Icon(Icons.qr_code_scanner),
            label: const Text('Scan Medication Box',
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.blue, foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
              elevation: 0,
            ),
          ),
        ),
        const SizedBox(height: 12),
        SizedBox(
          width: double.infinity, height: 48,
          child: OutlinedButton(
            onPressed: onConfirmed,
            style: OutlinedButton.styleFrom(
              foregroundColor: Colors.grey.shade600,
              side: BorderSide(color: Colors.grey.shade300),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
            ),
            child: const Text('Skip scan — I took it', style: TextStyle(fontSize: 15)),
          ),
        ),
        SizedBox(height: MediaQuery.of(context).padding.bottom + 8),
      ]),
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// STYLE DATA CLASS
// ─────────────────────────────────────────────────────────────────────────────

class _NotifStyle {
  final Color    color;
  final Color    bgColor;
  final IconData icon;
  final String   stage;
  final bool     showTaken;
  final bool     showSnooze;
  final bool     showSkip;
  final bool     showDismiss;
  final bool     isCritical;
  final bool     isSummary;
  final bool     isInformational; // SAFE_TO_EAT / INFORM_LATE
  final int?     adherencePct;
  final int?     streakDays;

  const _NotifStyle({
    required this.color,
    required this.bgColor,
    required this.icon,
    required this.stage,
    required this.showTaken,
    required this.showSnooze,
    required this.showSkip,
    required this.showDismiss,
    this.isCritical      = false,
    this.isSummary       = false,
    this.isInformational = false,
    this.adherencePct,
    this.streakDays,
  });
}