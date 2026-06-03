import 'dart:convert';
import 'package:flutter/material.dart';
import '../services/accessibility_service.dart';

// ─────────────────────────────────────────────────────────────────────────────
// ACCESSIBLE NOTIFICATION CARDS  v3
//
// Features:
//   ✅ Medication photo/icon area (large pill visual + med name)
//   ✅ Confirmation animation + audio when "I took it" is tapped
//   ✅ Dynamic font size from AccessibilityService.textScaleFactor
//   ✅ Audio only on tap — never on scroll
//   ✅ All action buttons working
//
// HOW TO USE in notifications_page.dart — top of _buildNotificationCard():
//
//   final a11y = AccessibilityService.instance;
//   if (a11y.illiteracyMode) {
//     return IlliteracyNotificationCard(
//       notification: notification, isFr: isFr,
//       onTaken:   () => _handleTaken(notification),
//       onSnooze:  () => _showSnoozeDialog(notification),
//       onSkip:    () => _skipDose(notification),
//       onDismiss: () => _markAsRead(notification['id'] as int),
//       getStyle:  _getStyle,
//     );
//   }
//   if (a11y.visualImpairmentMode) {
//     return VisualImpairmentNotificationCard(...same args...);
//   }
// ─────────────────────────────────────────────────────────────────────────────

// ── Stage config ─────────────────────────────────────────────────────────────

class _StageCfg {
  final Color   color;
  final Color   bgColor;
  final String  emoji;
  final IconData icon;
  final String  label;
  final bool    isCritical;
  const _StageCfg({
    required this.color, required this.bgColor,
    required this.emoji, required this.icon,
    required this.label, this.isCritical = false,
  });
}

_StageCfg _cfgForStage(String stage) {
  switch (stage) {
    case 'PREP':
      return const _StageCfg(color: Color(0xFFB45309), bgColor: Color(0xFFFFFDE7),
          emoji: '⏰', icon: Icons.access_time_rounded, label: 'Coming soon');
    case 'MAIN':
      return const _StageCfg(color: Color(0xFF1565C0), bgColor: Color(0xFFE3F2FD),
          emoji: '💊', icon: Icons.medication_rounded, label: 'Take now');
    case 'MAIN_HIGH':
      return const _StageCfg(color: Color(0xFFE53935), bgColor: Color(0xFFFFEBEE),
          emoji: '⚠️', icon: Icons.medication_rounded,
          label: 'Take now — important', isCritical: true);
    case 'FOLLOW_UP':
      return const _StageCfg(color: Color(0xFFF57C00), bgColor: Color(0xFFFFF3E0),
          emoji: '⏳', icon: Icons.hourglass_bottom_rounded, label: 'Still waiting');
    case 'MISSED':
      return const _StageCfg(color: Color(0xFFD84315), bgColor: Color(0xFFFBE9E7),
          emoji: '❌', icon: Icons.error_outline_rounded, label: 'Missed dose');
    case 'ESCALATION':
      return const _StageCfg(color: Color(0xFFB71C1C), bgColor: Color(0xFFFFEBEE),
          emoji: '🚨', icon: Icons.crisis_alert_rounded,
          label: 'URGENT', isCritical: true);
    case 'SNOOZE':
      return const _StageCfg(color: Color(0xFF546E7A), bgColor: Color(0xFFECEFF1),
          emoji: '😴', icon: Icons.snooze_rounded, label: 'Snoozed reminder');
    case 'BEFORE_MEAL_EARLY':
      return const _StageCfg(color: Color(0xFFAF6C00), bgColor: Color(0xFFFFF8E1),
          emoji: '🍽️', icon: Icons.restaurant_menu_rounded, label: 'Before meal — soon');
    case 'BEFORE_MEAL_MAIN':
      return const _StageCfg(color: Color(0xFFEF6C00), bgColor: Color(0xFFFFF3E0),
          emoji: '🍽️', icon: Icons.restaurant_menu_rounded, label: 'Before meal — now');
    case 'BEFORE_MEAL_MAIN_HIGH':
      return const _StageCfg(color: Color(0xFFD32F2F), bgColor: Color(0xFFFFEBEE),
          emoji: '🍽️', icon: Icons.restaurant_menu_rounded,
          label: 'Before meal — urgent', isCritical: true);
    case 'BEFORE_MEAL_FOLLOWUP':
      return const _StageCfg(color: Color(0xFFBF360C), bgColor: Color(0xFFFBE9E7),
          emoji: '🍽️', icon: Icons.warning_amber_rounded, label: 'Last chance');
    case 'INFORM_LATE':
      return const _StageCfg(color: Color(0xFF546E7A), bgColor: Color(0xFFECEFF1),
          emoji: '🙅', icon: Icons.block_rounded, label: 'Too late — do not take');
    case 'BEDTIME_PREP':
      return const _StageCfg(color: Color(0xFF3949AB), bgColor: Color(0xFFE8EAF6),
          emoji: '🌙', icon: Icons.bedtime_outlined, label: 'Sleep soon');
    case 'BEDTIME_MAIN':
      return const _StageCfg(color: Color(0xFF283593), bgColor: Color(0xFFE8EAF6),
          emoji: '💤', icon: Icons.bedtime_rounded, label: 'Bedtime');
    case 'BEDTIME_LATE':
      return const _StageCfg(color: Color(0xFF1A237E), bgColor: Color(0xFFE8EAF6),
          emoji: '🌛', icon: Icons.nightlight_round, label: 'Still awake?');
    case 'EMPTY_STOMACH_PREP':
      return const _StageCfg(color: Color(0xFF00695C), bgColor: Color(0xFFE0F2F1),
          emoji: '🥛', icon: Icons.no_meals_outlined, label: 'Empty stomach — soon');
    case 'SAFE_TO_EAT':
      return const _StageCfg(color: Color(0xFF2E7D32), bgColor: Color(0xFFE8F5E9),
          emoji: '🥗', icon: Icons.restaurant_rounded, label: 'You can eat now');
    default:
      return const _StageCfg(color: Color(0xFF1565C0), bgColor: Color(0xFFE3F2FD),
          emoji: '💊', icon: Icons.medication_rounded, label: 'Medication');
  }
}

// ── Helper ────────────────────────────────────────────────────────────────────

Map<String, dynamic> _parseNotifData(dynamic raw) {
  if (raw == null) return {};
  if (raw is Map<String, dynamic>) return raw;
  if (raw is String && raw.isNotEmpty) {
    try { return jsonDecode(raw) as Map<String, dynamic>; } catch (_) {}
  }
  return {};
}

// ─────────────────────────────────────────────────────────────────────────────
// ILLITERACY CARD
// ─────────────────────────────────────────────────────────────────────────────

class IlliteracyNotificationCard extends StatefulWidget {
  final Map<String, dynamic> notification;
  final bool isFr;
  final VoidCallback onTaken;
  final VoidCallback onSnooze;
  final VoidCallback onSkip;
  final VoidCallback onDismiss;
  final dynamic Function(Map<String, dynamic>) getStyle;

  const IlliteracyNotificationCard({
    super.key,
    required this.notification, required this.isFr,
    required this.onTaken, required this.onSnooze,
    required this.onSkip, required this.onDismiss,
    required this.getStyle,
  });

  @override
  State<IlliteracyNotificationCard> createState() =>
      _IlliteracyNotificationCardState();
}

class _IlliteracyNotificationCardState
    extends State<IlliteracyNotificationCard>
    with TickerProviderStateMixin {

  late AnimationController _pulse;
  late AnimationController _successCtrl;
  late Animation<double>   _successScale;
  late Animation<double>   _successOpacity;

  bool _showSuccess = false;
  final _a11y = AccessibilityService.instance;

  @override
  void initState() {
    super.initState();

    // Pulse for critical stages
    _pulse = AnimationController(
        vsync: this, duration: const Duration(milliseconds: 800));
    final data  = _parseNotifData(widget.notification['data']);
    final stage = (data['stage'] ?? '').toString();
    if (stage == 'ESCALATION' || stage == 'MAIN_HIGH' ||
        stage == 'BEFORE_MEAL_MAIN_HIGH') {
      _pulse.repeat(reverse: true);
    }

    // Success animation — scale up then fade
    _successCtrl = AnimationController(
        vsync: this, duration: const Duration(milliseconds: 700));
    _successScale = Tween<double>(begin: 0.5, end: 1.2).animate(
        CurvedAnimation(parent: _successCtrl, curve: Curves.elasticOut));
    _successOpacity = Tween<double>(begin: 0.0, end: 1.0).animate(
        CurvedAnimation(parent: _successCtrl,
            curve: const Interval(0.0, 0.5, curve: Curves.easeIn)));
  }

  @override
  void dispose() {
    _pulse.dispose();
    _successCtrl.dispose();
    super.dispose();
  }

  Future<void> _speak() async {
    final data    = _parseNotifData(widget.notification['data']);
    final stage   = (data['stage'] ?? 'MAIN').toString();
    final message = (widget.notification['message'] ?? '').toString();
    await _a11y.vibrateForStage(stage);
    await _a11y.speakNotification(message, stage: stage, lang: 'en');
  }

  Future<void> _handleTaken() async {
    // 1. Trigger success animation
    setState(() => _showSuccess = true);
    _successCtrl.forward();

    // 2. Play confirmation sound
    await _a11y.speakConfirmation();

    // 3. Wait for animation to finish then call the real handler
    await Future.delayed(const Duration(milliseconds: 900));
    widget.onTaken();
  }

  String _medName() {
    final title = (widget.notification['title'] ?? '').toString();
    final idx   = title.indexOf(':');
    return idx != -1 ? title.substring(idx + 1).trim() : title;
  }

  String _time() {
    final data = _parseNotifData(widget.notification['data']);
    final raw  = data['scheduled_date_time']?.toString();
    if (raw == null || raw.isEmpty) return '';
    try {
      final d = DateTime.parse(raw);
      return '${d.hour.toString().padLeft(2, '0')}:${d.minute.toString().padLeft(2, '0')}';
    } catch (_) { return ''; }
  }

  bool _hasBarcode() {
    final data = widget.notification['data'];
    final parsed = _parseNotifData(data);
    // Check if treatment has barcode via treatment_id presence
    // Actual barcode check is done via the barcode_data field if available
    return parsed['has_barcode'] == true || parsed['has_barcode'] == 1;
  }

  @override
  Widget build(BuildContext context) {
    final data  = _parseNotifData(widget.notification['data']);
    final stage = (data['stage'] ?? 'MAIN').toString();
    final cfg   = _cfgForStage(stage);
    final style = widget.getStyle(widget.notification);
    final isRead = widget.notification['is_read'] == 1 ||
                   widget.notification['is_read'] == true;
    final name  = _medName();
    final time  = _time();
    final fs    = _a11y.textScaleFactor; // dynamic font scale

    return AnimatedBuilder(
      animation: _pulse,
      builder: (_, __) {
        final pulseScale = cfg.isCritical ? 1.0 + _pulse.value * 0.012 : 1.0;
        return Transform.scale(
          scale: pulseScale,
          child: GestureDetector(
            onTap: _speak,
            child: Container(
              margin: const EdgeInsets.only(bottom: 16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(24),
                border: cfg.isCritical
                    ? Border.all(color: cfg.color, width: 3)
                    : Border.all(color: cfg.color.withOpacity(0.3), width: 1.5),
                boxShadow: [BoxShadow(
                  color: cfg.color.withOpacity(cfg.isCritical ? 0.3 : 0.1),
                  blurRadius: cfg.isCritical ? 24 : 12,
                  offset: const Offset(0, 6),
                )],
              ),
              child: Column(children: [

                // ── TOP BANNER — color + emoji ──────────────────────────────
                Stack(children: [
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.fromLTRB(20, 20, 20, 20),
                    decoration: BoxDecoration(
                      color: cfg.color,
                      borderRadius: const BorderRadius.vertical(
                          top: Radius.circular(24)),
                    ),
                    child: Column(children: [

                      // ── MEDICATION PHOTO AREA ─────────────────────────────
                      // Shows a stylised pill illustration with the med name.
                      // If a real image URL is ever added to the treatment,
                      // replace the icon widget with Image.network(url).
                      Container(
                        width: 100, height: 100,
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.15),
                          shape: BoxShape.circle,
                        ),
                        child: Stack(alignment: Alignment.center, children: [
                          // Pill icon background
                          Icon(Icons.medication_rounded,
                              color: Colors.white.withOpacity(0.3), size: 72),
                          // Stage emoji on top
                          Text(cfg.emoji,
                              style: const TextStyle(fontSize: 42)),
                        ]),
                      ),

                      const SizedBox(height: 12),

                      // Stage label badge
                      Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 14, vertical: 5),
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.2),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Text(cfg.label.toUpperCase(),
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 11 * fs,
                              fontWeight: FontWeight.bold,
                              letterSpacing: 1.0,
                            )),
                      ),
                    ]),
                  ),

                  // ── SUCCESS OVERLAY ───────────────────────────────────────
                  if (_showSuccess)
                    AnimatedBuilder(
                      animation: _successCtrl,
                      builder: (_, __) => Container(
                        width: double.infinity,
                        padding: const EdgeInsets.fromLTRB(20, 20, 20, 20),
                        decoration: BoxDecoration(
                          color: Colors.green.withOpacity(
                              _successOpacity.value * 0.92),
                          borderRadius: const BorderRadius.vertical(
                              top: Radius.circular(24)),
                        ),
                        child: Column(children: [
                          Transform.scale(
                            scale: _successScale.value,
                            child: const Text('✅',
                                style: TextStyle(fontSize: 64)),
                          ),
                          const SizedBox(height: 8),
                          Text('Well done!',
                              style: TextStyle(
                                color: Colors.white,
                                fontSize: 20 * fs,
                                fontWeight: FontWeight.bold,
                              )),
                        ]),
                      ),
                    ),
                ]),

                // ── BOTTOM — med name, time, buttons ───────────────────────
                Padding(
                  padding: const EdgeInsets.fromLTRB(20, 16, 20, 20),
                  child: Column(children: [

                    // Medication name + time
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Expanded(child: Text(name,
                            style: TextStyle(
                              fontSize: 20 * fs,
                              fontWeight: FontWeight.bold,
                              color: cfg.color,
                            ),
                            maxLines: 2,
                            overflow: TextOverflow.ellipsis)),
                        if (time.isNotEmpty) ...[
                          const SizedBox(width: 12),
                          Container(
                            padding: const EdgeInsets.symmetric(
                                horizontal: 10, vertical: 6),
                            decoration: BoxDecoration(
                              color: cfg.color.withOpacity(0.1),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Text('🕐 $time',
                                style: TextStyle(
                                  fontSize: 16 * fs,
                                  fontWeight: FontWeight.bold,
                                  color: cfg.color,
                                )),
                          ),
                        ],
                      ],
                    ),

                    const SizedBox(height: 6),

                    // Tap hint + speaker
                    Row(children: [
                      Icon(Icons.touch_app_outlined,
                          size: 12, color: Colors.grey.shade400),
                      const SizedBox(width: 4),
                      Text('Tap card to hear message',
                          style: TextStyle(
                              fontSize: 10 * fs,
                              color: Colors.grey.shade400)),
                      const Spacer(),
                      GestureDetector(
                        onTap: _speak,
                        child: Container(
                          padding: const EdgeInsets.all(8),
                          decoration: BoxDecoration(
                            color: cfg.color.withOpacity(0.1),
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: Icon(Icons.volume_up_rounded,
                              color: cfg.color, size: 18),
                        ),
                      ),
                    ]),

                    const SizedBox(height: 16),

                    // Action buttons
                    if (!isRead && !_showSuccess)
                      _buildButtons(style, cfg, fs)
                    else if (isRead && !_showSuccess)
                      Row(mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                        Icon(Icons.check_circle_outline,
                            color: Colors.green.shade400, size: 20),
                        const SizedBox(width: 6),
                        Text('Done', style: TextStyle(
                            color: Colors.green.shade400,
                            fontWeight: FontWeight.w600,
                            fontSize: 14 * fs)),
                      ]),
                  ]),
                ),
              ]),
            ),
          ),
        );
      },
    );
  }

  Widget _buildButtons(dynamic style, _StageCfg cfg, double fs) {
    return Column(children: [
      if (style.showTaken) ...[
        _btn(emoji: '✅', label: 'I took it',
            color: const Color(0xFF2E7D32), fs: fs,
            onTap: _handleTaken),   // ← confirmation handler
        const SizedBox(height: 10),
      ],
      if (style.showSnooze) ...[
        _btn(emoji: '⏰', label: 'Remind me later',
            color: const Color(0xFF1565C0), fs: fs,
            onTap: widget.onSnooze),
        const SizedBox(height: 10),
      ],
      if (style.showDismiss) ...[
        _btn(emoji: '👍', label: 'Got it',
            color: const Color(0xFF546E7A), fs: fs,
            onTap: widget.onDismiss),
        const SizedBox(height: 10),
      ],
      if (style.showSkip)
        GestureDetector(
          onTap: widget.onSkip,
          child: Padding(
            padding: const EdgeInsets.only(top: 4),
            child: Text('Skip this dose',
                style: TextStyle(
                  fontSize: 13 * fs,
                  color: Colors.grey.shade500,
                  decoration: TextDecoration.underline,
                )),
          ),
        ),
    ]);
  }

  Widget _btn({
    required String emoji, required String label,
    required Color color, required double fs,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: double.infinity,
        height: 64,
        decoration: BoxDecoration(
          color: color,
          borderRadius: BorderRadius.circular(16),
          boxShadow: [BoxShadow(
            color: color.withOpacity(0.3),
            blurRadius: 8, offset: const Offset(0, 4),
          )],
        ),
        child: Row(mainAxisAlignment: MainAxisAlignment.center, children: [
          Text(emoji, style: const TextStyle(fontSize: 22)),
          const SizedBox(width: 10),
          Text(label, style: TextStyle(
            color: Colors.white,
            fontSize: 17 * fs,
            fontWeight: FontWeight.bold,
          )),
        ]),
      ),
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// VISUAL IMPAIRMENT CARD
// ─────────────────────────────────────────────────────────────────────────────

class VisualImpairmentNotificationCard extends StatefulWidget {
  final Map<String, dynamic> notification;
  final bool isFr;
  final VoidCallback onTaken;
  final VoidCallback onSnooze;
  final VoidCallback onSkip;
  final VoidCallback onDismiss;
  final dynamic Function(Map<String, dynamic>) getStyle;

  const VisualImpairmentNotificationCard({
    super.key,
    required this.notification, required this.isFr,
    required this.onTaken, required this.onSnooze,
    required this.onSkip, required this.onDismiss,
    required this.getStyle,
  });

  @override
  State<VisualImpairmentNotificationCard> createState() =>
      _VisualImpairmentNotificationCardState();
}

class _VisualImpairmentNotificationCardState
    extends State<VisualImpairmentNotificationCard>
    with SingleTickerProviderStateMixin {

  late AnimationController _successCtrl;
  late Animation<double>   _successScale;
  bool _showSuccess = false;
  final _a11y = AccessibilityService.instance;

  @override
  void initState() {
    super.initState();
    _successCtrl = AnimationController(
        vsync: this, duration: const Duration(milliseconds: 600));
    _successScale = Tween<double>(begin: 0.5, end: 1.0).animate(
        CurvedAnimation(parent: _successCtrl, curve: Curves.elasticOut));
  }

  @override
  void dispose() {
    _successCtrl.dispose();
    super.dispose();
  }

  Future<void> _speak() async {
    final data    = _parseNotifData(widget.notification['data']);
    final stage   = (data['stage'] ?? 'MAIN').toString();
    final message = (widget.notification['message'] ?? '').toString();
    await _a11y.vibrateForStage(stage);
    await _a11y.speakNotification(message, stage: stage, lang: 'en');
  }

  Future<void> _handleTaken() async {
    setState(() => _showSuccess = true);
    _successCtrl.forward();
    await _a11y.speakConfirmation();
    await Future.delayed(const Duration(milliseconds: 900));
    widget.onTaken();
  }

  @override
  Widget build(BuildContext context) {
    final data    = _parseNotifData(widget.notification['data']);
    final stage   = (data['stage'] ?? 'MAIN').toString();
    final cfg     = _cfgForStage(stage);
    final style   = widget.getStyle(widget.notification);
    final isRead  = widget.notification['is_read'] == 1 ||
                    widget.notification['is_read'] == true;
    final title   = (widget.notification['title']   ?? '').toString();
    final message = (widget.notification['message'] ?? '').toString();
    final fs      = _a11y.textScaleFactor;

    return Semantics(
      label: '$title. $message',
      child: GestureDetector(
        onTap: _speak,
        child: Container(
          margin: const EdgeInsets.only(bottom: 16),
          decoration: BoxDecoration(
            color: const Color(0xFF0F172A),
            borderRadius: BorderRadius.circular(20),
            border: cfg.isCritical
                ? Border.all(color: cfg.color, width: 3)
                : Border.all(color: cfg.color.withOpacity(0.5), width: 2),
            boxShadow: [BoxShadow(
              color: cfg.color.withOpacity(0.25),
              blurRadius: 16, offset: const Offset(0, 6),
            )],
          ),
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [

            Container(height: 5,
                decoration: BoxDecoration(color: cfg.color,
                    borderRadius: const BorderRadius.vertical(
                        top: Radius.circular(20)))),

            Padding(
              padding: const EdgeInsets.all(20),
              child: Column(crossAxisAlignment: CrossAxisAlignment.start,
                  children: [

                // Success overlay
                if (_showSuccess)
                  AnimatedBuilder(
                    animation: _successCtrl,
                    builder: (_, __) => Transform.scale(
                      scale: _successScale.value,
                      child: Container(
                        width: double.infinity,
                        padding: const EdgeInsets.all(16),
                        margin: const EdgeInsets.only(bottom: 16),
                        decoration: BoxDecoration(
                          color: Colors.green.withOpacity(0.2),
                          borderRadius: BorderRadius.circular(14),
                          border: Border.all(color: Colors.green, width: 2),
                        ),
                        child: Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                          const Text('✅', style: TextStyle(fontSize: 28)),
                          const SizedBox(width: 12),
                          Text('Well done!', style: TextStyle(
                            color: Colors.green,
                            fontSize: 20 * fs,
                            fontWeight: FontWeight.bold,
                          )),
                        ]),
                      ),
                    ),
                  ),

                // Header row
                Row(children: [
                  Text(cfg.emoji, style: const TextStyle(fontSize: 32)),
                  const SizedBox(width: 12),
                  Expanded(child: Text(title,
                      style: TextStyle(fontSize: 17 * fs,
                          fontWeight: FontWeight.bold, color: cfg.color))),
                  Semantics(
                    button: true, label: 'Replay audio',
                    child: GestureDetector(
                      onTap: _speak,
                      child: Container(
                        padding: const EdgeInsets.all(10),
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.08),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Icon(Icons.volume_up_rounded,
                            color: cfg.color, size: 22),
                      ),
                    ),
                  ),
                ]),

                const SizedBox(height: 12),

                Text(message, style: TextStyle(
                    fontSize: 16 * fs, color: Colors.white, height: 1.6)),

                const SizedBox(height: 6),
                Text('Tap card to hear this message',
                    style: TextStyle(fontSize: 10 * fs,
                        color: Colors.grey.shade600)),

                const SizedBox(height: 20),

                if (!isRead && !_showSuccess)
                  _buildActions(style, fs)
                else if (isRead && !_showSuccess)
                  Row(children: [
                    Icon(Icons.check_circle,
                        color: Colors.green.shade400, size: 18),
                    const SizedBox(width: 6),
                    Text('Read', style: TextStyle(
                        color: Colors.green.shade400,
                        fontSize: 14 * fs)),
                  ]),
              ]),
            ),
          ]),
        ),
      ),
    );
  }

  Widget _buildActions(dynamic style, double fs) {
    return Column(children: [
      if (style.showTaken) ...[
        Semantics(button: true, label: 'Mark as taken',
            child: _btn('✅  I took it', Colors.green.shade700, fs, _handleTaken)),
        const SizedBox(height: 10),
      ],
      if (style.showSnooze) ...[
        Semantics(button: true, label: 'Snooze',
            child: _btn('⏰  Remind me later',
                const Color(0xFF1565C0), fs, widget.onSnooze)),
        const SizedBox(height: 10),
      ],
      if (style.showDismiss) ...[
        Semantics(button: true, label: 'Got it',
            child: _btn('👍  Got it',
                const Color(0xFF546E7A), fs, widget.onDismiss)),
        const SizedBox(height: 10),
      ],
      if (style.showSkip)
        Semantics(button: true, label: 'Skip dose',
            child: GestureDetector(
              onTap: widget.onSkip,
              child: Text('Skip this dose', style: TextStyle(
                fontSize: 14 * fs, color: Colors.grey.shade500,
                decoration: TextDecoration.underline,
              )),
            )),
    ]);
  }

  Widget _btn(String label, Color color, double fs, VoidCallback onTap) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: double.infinity, height: 64,
        decoration: BoxDecoration(
            color: color, borderRadius: BorderRadius.circular(14)),
        child: Center(child: Text(label, style: TextStyle(
          color: Colors.white, fontSize: 18 * fs,
          fontWeight: FontWeight.bold,
        ))),
      ),
    );
  }
}