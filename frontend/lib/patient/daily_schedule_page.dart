import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../config/api_config.dart';
import '../services/language_service.dart';

class DailySchedulePage extends StatefulWidget {
  const DailySchedulePage({super.key});

  @override
  State<DailySchedulePage> createState() => _DailySchedulePageState();
}

class _DailySchedulePageState extends State<DailySchedulePage> {
  bool _smartScheduling = true;
  bool _isLoading       = true;
  bool _isSaving        = false;

  TimeOfDay _bedtime   = const TimeOfDay(hour: 22, minute: 0);
  TimeOfDay _wakeTime  = const TimeOfDay(hour: 7,  minute: 0);
  TimeOfDay _breakfast = const TimeOfDay(hour: 8,  minute: 0);
  TimeOfDay _lunch     = const TimeOfDay(hour: 12, minute: 30);
  TimeOfDay _dinner    = const TimeOfDay(hour: 19, minute: 0);

  // Validation errors per slot. null = no error.
  Map<String, String?> _errors = {};

  // ─────────────────────────────────────────────────────────────────────────
  // CONSTRAINTS
  //
  // These minimum gaps ensure that medications scheduled around meals and
  // bedtime always have enough room to fire their notifications correctly.
  //
  //  wake → breakfast    : ≥ 45 min
  //    Reason: "Before breakfast" doses fire at breakfast-30min.
  //    If wake=07:00 and breakfast=07:20, the before-breakfast dose at 06:50
  //    would be before wake — the notification engine would suppress it.
  //    45 min guarantees: wake(07:00) + 45min = 07:45 ≤ breakfast(08:00+).
  //
  //  breakfast → lunch   : ≥ 3 hours
  //  lunch → dinner      : ≥ 3 hours
  //    Reason: Meal medications (before/during/after) need enough spacing
  //    to not overlap. 3h is the medical minimum between meals.
  //
  //  dinner → bedtime    : ≥ 1 hour
  //    Reason: "Before sleeping" doses fire at bedtime. If dinner is at 22:00
  //    and bedtime at 22:30, the bedtime PREP fires at 22:00 = dinner time.
  //    1h ensures a clean gap.
  //
  //  bedtime → wake      : ≥ 4 hours
  //    Reason: Minimum medically reasonable sleep window. Also prevents
  //    absurd configurations like bedtime=23:00, wake=23:30.
  // ─────────────────────────────────────────────────────────────────────────

  static const int _minWakeToBreakfast  = 45;
  static const int _minBreakfastToLunch = 180;
  static const int _minLunchToDinner    = 180;
  static const int _minDinnerToBedtime  = 60;
  static const int _minSleepWindow      = 240;

  // ─────────────────────────────────────────────────────────────────────────
  // TIME HELPERS
  // ─────────────────────────────────────────────────────────────────────────

  int _toMin(TimeOfDay t) => t.hour * 60 + t.minute;

  /// Forward gap from a to b (handles overnight wrap).
  int _forwardGap(TimeOfDay a, TimeOfDay b) {
    final diff = _toMin(b) - _toMin(a);
    return diff < 0 ? diff + 1440 : diff;
  }

  String _fmt(TimeOfDay t) =>
      '${t.hour.toString().padLeft(2, '0')}:${t.minute.toString().padLeft(2, '0')}';

  String _fmtMin(int minutes) {
    if (minutes >= 60) {
      final h = minutes ~/ 60;
      final m = minutes % 60;
      return m > 0 ? '${h}h ${m}min' : '${h}h';
    }
    return '${minutes}min';
  }

  // ─────────────────────────────────────────────────────────────────────────
  // VALIDATION
  // ─────────────────────────────────────────────────────────────────────────

  Map<String, String?> _validateTimes() {
    final e = <String, String?>{};

    // 1. Meals must be in chronological order within the same day
    if (_toMin(_breakfast) >= _toMin(_lunch)) {
      e['lunch'] = 'Lunch must be after breakfast.';
    }
    if (_toMin(_lunch) >= _toMin(_dinner)) {
      e['dinner'] = 'Dinner must be after lunch.';
    }

    // 2. Wake → Breakfast gap
    final wakeToBreakfast = _forwardGap(_wakeTime, _breakfast);
    if (wakeToBreakfast < _minWakeToBreakfast) {
      final need = _minWakeToBreakfast - wakeToBreakfast;
      e['breakfast'] =
          'Breakfast must be at least ${_fmtMin(_minWakeToBreakfast)} after '
          'wake-up. Move it ${_fmtMin(need)} later, or wake up ${_fmtMin(need)} earlier.';
    }

    // 3. Breakfast → Lunch gap
    if (e['lunch'] == null) {
      final gap = _forwardGap(_breakfast, _lunch);
      if (gap < _minBreakfastToLunch) {
        final need = _minBreakfastToLunch - gap;
        e['lunch'] =
            'Lunch must be at least ${_fmtMin(_minBreakfastToLunch)} after '
            'breakfast. Move it ${_fmtMin(need)} later.';
      }
    }

    // 4. Lunch → Dinner gap
    if (e['dinner'] == null) {
      final gap = _forwardGap(_lunch, _dinner);
      if (gap < _minLunchToDinner) {
        final need = _minLunchToDinner - gap;
        e['dinner'] =
            'Dinner must be at least ${_fmtMin(_minLunchToDinner)} after '
            'lunch. Move it ${_fmtMin(need)} later.';
      }
    }

    // 5. Dinner → Bedtime gap
    final dinnerToBed = _forwardGap(_dinner, _bedtime);
    if (dinnerToBed < _minDinnerToBedtime) {
      final need = _minDinnerToBedtime - dinnerToBed;
      e['bedtime'] =
          'Bedtime must be at least ${_fmtMin(_minDinnerToBedtime)} after '
          'dinner. Move it ${_fmtMin(need)} later.';
    }

    // 6. Bedtime → Wake (sleep window)
    final sleepWindow = _forwardGap(_bedtime, _wakeTime);
    if (sleepWindow < _minSleepWindow) {
      final need = _minSleepWindow - sleepWindow;
      e['wake'] =
          'Sleep window is only ${_fmtMin(sleepWindow)}. '
          'Wake up ${_fmtMin(need)} later, or go to bed ${_fmtMin(need)} earlier.';
    }

    return e;
  }

  bool get _hasErrors => _errors.values.any((e) => e != null);

  // ─────────────────────────────────────────────────────────────────────────
  // LOAD / SAVE
  // ─────────────────────────────────────────────────────────────────────────

  @override
  void initState() {
    super.initState();
    _loadSchedule();
  }

  Future<void> _loadSchedule() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');
      if (token == null) { setState(() => _isLoading = false); return; }

      final response = await http.get(
        Uri.parse('${ApiConfig.baseUrl}/profile/schedule'),
        headers: ApiConfig.getAuthHeaders(token),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final p    = data['schedule'] ?? data['data'] ?? {};

        setState(() {
          _smartScheduling = p['smart_scheduling_enabled'] == 1 ||
                             p['smart_scheduling_enabled'] == true;
          _wakeTime  = _parseTime(p['wake_time'],       const TimeOfDay(hour: 7,  minute: 0));
          _breakfast = _parseTime(p['breakfast_time'],  const TimeOfDay(hour: 8,  minute: 0));
          _lunch     = _parseTime(p['lunch_time'],      const TimeOfDay(hour: 12, minute: 30));
          _dinner    = _parseTime(p['dinner_time'],     const TimeOfDay(hour: 19, minute: 0));
          _bedtime   = _parseTime(p['bedtime'],         const TimeOfDay(hour: 22, minute: 0));
          _isLoading = false;
        });

        // Validate on load so existing conflicts are surfaced immediately
        setState(() => _errors = _validateTimes());
      } else {
        setState(() => _isLoading = false);
      }
    } catch (e) {
      debugPrint('DailySchedulePage load error: $e');
      setState(() => _isLoading = false);
    }
  }

  TimeOfDay _parseTime(dynamic value, TimeOfDay fallback) {
    if (value == null) return fallback;
    try {
      final parts = value.toString().split(':');
      return TimeOfDay(hour: int.parse(parts[0]), minute: int.parse(parts[1]));
    } catch (_) { return fallback; }
  }

  int _activeDurationHours() => (_forwardGap(_wakeTime, _bedtime) / 60).round();

  Future<void> _saveSchedule() async {
    // Re-validate before saving
    final errors = _validateTimes();
    setState(() => _errors = errors);

    if (_hasErrors) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(
        content: const Row(children: [
          Icon(Icons.warning_amber_rounded, color: Colors.white),
          SizedBox(width: 10),
          Expanded(child: Text('Please fix the time conflicts before saving.')),
        ]),
        backgroundColor: Colors.orange,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
      ));
      return;
    }

    setState(() => _isSaving = true);
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');
      if (token == null) return;

      final response = await http.patch(
        Uri.parse('${ApiConfig.baseUrl}/profile/schedule'),
        headers: ApiConfig.getAuthHeaders(token),
        body: jsonEncode({
          'smart_scheduling_enabled': _smartScheduling,
          'wake_time':      _fmt(_wakeTime),
          'breakfast_time': _fmt(_breakfast),
          'lunch_time':     _fmt(_lunch),
          'dinner_time':    _fmt(_dinner),
          'bedtime':        _fmt(_bedtime),
        }),
      );

      if (response.statusCode == 200) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(SnackBar(
            content: const Row(children: [
              Icon(Icons.check_circle, color: Colors.white),
              SizedBox(width: 10),
              Text('Schedule saved successfully'),
            ]),
            backgroundColor: Colors.green,
            behavior: SnackBarBehavior.floating,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
          ));
          Navigator.pop(context);
        }
      } else {
        throw Exception('Save failed: ${response.statusCode}');
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(
          content: Text('Error saving schedule: $e'),
          backgroundColor: Colors.red,
          behavior: SnackBarBehavior.floating,
        ));
      }
    } finally {
      if (mounted) setState(() => _isSaving = false);
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // BUILD
  // ─────────────────────────────────────────────────────────────────────────

  @override
  Widget build(BuildContext context) {
    final lang = Provider.of<LanguageService>(context);

    return Scaffold(
      backgroundColor: const Color(0xFFF8F9FA),
      appBar: AppBar(
        backgroundColor: Colors.white, elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.black54),
          onPressed: () => Navigator.pop(context),
        ),
        actions: [
          Container(
            margin: const EdgeInsets.only(right: 16),
            padding: const EdgeInsets.all(8),
            decoration: const BoxDecoration(
                color: Color(0xFF3498DB), shape: BoxShape.circle),
            child: const Icon(Icons.access_time, color: Colors.white, size: 24),
          ),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              padding: const EdgeInsets.all(20),
              child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [

                Text(lang.translate('dailySchedule'),
                    style: const TextStyle(fontSize: 28, fontWeight: FontWeight.bold,
                        color: Color(0xFF1A237E))),
                const SizedBox(height: 4),
                Text(lang.translate('setRoutine'),
                    style: TextStyle(fontSize: 16, color: Colors.grey.shade600)),
                const SizedBox(height: 24),

                // ── Smart scheduling toggle ────────────────────────────────
                _buildContainer(child: _buildSwitchTile(
                  lang.translate('enableSmartScheduling'),
                  _smartScheduling ? lang.translate('active') : 'Inactive',
                  _smartScheduling,
                  (v) => setState(() => _smartScheduling = v),
                  icon: Icons.access_time,
                )),
                const SizedBox(height: 16),

                // ── Info box ──────────────────────────────────────────────
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.blue.withOpacity(0.05),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: Colors.blue.withOpacity(0.1)),
                  ),
                  child: Row(children: [
                    const Icon(Icons.lightbulb_outline, color: Colors.blue, size: 24),
                    const SizedBox(width: 12),
                    Expanded(child: Text(lang.translate('smartSchedulingInfo'),
                        style: const TextStyle(color: Colors.blue, fontSize: 13))),
                  ]),
                ),
                const SizedBox(height: 24),

                // ── Conflict banner ───────────────────────────────────────
                if (_hasErrors) ...[
                  Container(
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: Colors.orange.shade50,
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(color: Colors.orange.shade200),
                    ),
                    child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
                      Icon(Icons.warning_amber_rounded,
                          color: Colors.orange.shade700, size: 22),
                      const SizedBox(width: 10),
                      Expanded(child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Time conflicts detected',
                              style: TextStyle(fontWeight: FontWeight.bold,
                                  color: Colors.orange.shade800, fontSize: 14)),
                          const SizedBox(height: 4),
                          Text(
                            'Fix the highlighted times below. These gaps ensure '
                            'medications are scheduled at medically appropriate intervals.',
                            style: TextStyle(
                                color: Colors.orange.shade700, fontSize: 13)),
                        ],
                      )),
                    ]),
                  ),
                  const SizedBox(height: 16),
                ],

                // ── Sleep schedule ────────────────────────────────────────
                _buildSectionHeader(Icons.bed_outlined,
                    lang.translate('sleepSchedule'), Colors.purple),
                _buildContainer(child: Column(children: [
                  _buildTimeTile(
                    lang.translate('bedtime'), _bedtime,
                    (t) { setState(() { _bedtime  = t; _errors = _validateTimes(); }); },
                    Icons.nightlight_outlined, Colors.purple,
                    errorText: _errors['bedtime'],
                    hintText:  'At least ${_fmtMin(_minDinnerToBedtime)} after dinner',
                  ),
                  _buildTimeTile(
                    lang.translate('wakeUpTime'), _wakeTime,
                    (t) { setState(() { _wakeTime = t; _errors = _validateTimes(); }); },
                    Icons.wb_sunny_outlined, Colors.orange,
                    errorText: _errors['wake'],
                    hintText:  'At least ${_fmtMin(_minSleepWindow)} after bedtime',
                  ),
                  const Divider(height: 1),
                  Padding(
                    padding: const EdgeInsets.all(16),
                    child: Row(mainAxisAlignment: MainAxisAlignment.center, children: [
                      Text('${lang.translate('activeHours')}: ',
                          style: TextStyle(color: Colors.grey.shade600)),
                      Text('${_activeDurationHours()} ${lang.translate('hoursPerDay')}',
                          style: const TextStyle(fontWeight: FontWeight.bold,
                              color: Colors.blue)),
                    ]),
                  ),
                ])),
                const SizedBox(height: 24),

                // ── Meal times ─────────────────────────────────────────────
                _buildSectionHeader(Icons.restaurant_outlined,
                    lang.translate('mealTimes'), Colors.green),
                _buildContainer(child: Column(children: [
                  _buildTimeTile(
                    lang.translate('breakfast'), _breakfast,
                    (t) { setState(() { _breakfast = t; _errors = _validateTimes(); }); },
                    Icons.coffee_outlined, Colors.orange,
                    errorText: _errors['breakfast'],
                    hintText:  'At least ${_fmtMin(_minWakeToBreakfast)} after wake-up',
                  ),
                  _buildTimeTile(
                    lang.translate('lunch'), _lunch,
                    (t) { setState(() { _lunch     = t; _errors = _validateTimes(); }); },
                    Icons.lunch_dining_outlined, Colors.green,
                    errorText: _errors['lunch'],
                    hintText:  'At least ${_fmtMin(_minBreakfastToLunch)} after breakfast',
                  ),
                  _buildTimeTile(
                    lang.translate('dinner'), _dinner,
                    (t) { setState(() { _dinner    = t; _errors = _validateTimes(); }); },
                    Icons.dinner_dining_outlined, Colors.red,
                    errorText: _errors['dinner'],
                    hintText:  'At least ${_fmtMin(_minLunchToDinner)} after lunch '
                               '· at least ${_fmtMin(_minDinnerToBedtime)} before bedtime',
                  ),
                ])),
                const SizedBox(height: 24),

                // ── Summary card ──────────────────────────────────────────
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: const Color(0xFF3498DB),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                    Row(children: [
                      const Icon(Icons.access_time, color: Colors.white, size: 22),
                      const SizedBox(width: 10),
                      Text(lang.translate('yourDailyRoutine'),
                          style: const TextStyle(color: Colors.white, fontSize: 17,
                              fontWeight: FontWeight.bold)),
                    ]),
                    const SizedBox(height: 16),
                    _summaryRow('🌙 ${lang.translate('bedtime')}',    _fmt(_bedtime)),
                    const SizedBox(height: 8),
                    _summaryRow('☀️ ${lang.translate('wakeUpTime')}',  _fmt(_wakeTime)),
                    const SizedBox(height: 8),
                    _summaryRow('☕ ${lang.translate('breakfast')}',   _fmt(_breakfast)),
                    const SizedBox(height: 8),
                    _summaryRow('🥗 ${lang.translate('lunch')}',       _fmt(_lunch)),
                    const SizedBox(height: 8),
                    _summaryRow('🍽️ ${lang.translate('dinner')}',      _fmt(_dinner)),
                  ]),
                ),
                const SizedBox(height: 24),

                // ── How it works ──────────────────────────────────────────
                _buildContainer(child: Padding(
                  padding: const EdgeInsets.all(20),
                  child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                    Row(children: [
                      const Icon(Icons.track_changes, color: Colors.red, size: 24),
                      const SizedBox(width: 12),
                      Text(lang.translate('howSmartSchedulingWorks'),
                          style: const TextStyle(
                              fontWeight: FontWeight.bold, fontSize: 16)),
                    ]),
                    const SizedBox(height: 16),
                    _buildBulletPoint(lang.translate('medicationRemindersScheduledAroundMeals')),
                    _buildBulletPoint(lang.translate('noNotificationsDuringSleep')),
                    _buildBulletPoint(lang.translate('remindersOptimized')),
                    _buildBulletPoint(
                      'Before-meal medications require at least '
                      '${_fmtMin(_minWakeToBreakfast)} between wake-up and breakfast '
                      'to allow notification timing.',
                    ),
                    _buildBulletPoint(
                      'Bedtime medications remind you 30 min before bedtime, '
                      'then again at bedtime.',
                    ),
                    _buildBulletPoint(
                      'At least ${_fmtMin(_minDinnerToBedtime)} between dinner '
                      'and bedtime prevents notification overlap.',
                    ),
                  ]),
                )),
                const SizedBox(height: 32),

                // ── Save button ───────────────────────────────────────────
                SizedBox(
                  width: double.infinity, height: 55,
                  child: ElevatedButton(
                    onPressed: (_isSaving || _hasErrors) ? null : _saveSchedule,
                    style: ElevatedButton.styleFrom(
                      backgroundColor:
                          _hasErrors ? Colors.grey.shade400 : const Color(0xFF3498DB),
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(50)),
                      elevation: 0,
                    ),
                    child: _isSaving
                        ? const SizedBox(width: 22, height: 22,
                            child: CircularProgressIndicator(
                                strokeWidth: 2, color: Colors.white))
                        : Text(
                            _hasErrors
                                ? 'Fix conflicts to save'
                                : lang.translate('saveSchedule'),
                            style: const TextStyle(
                                fontSize: 18, fontWeight: FontWeight.bold),
                          ),
                  ),
                ),
                const SizedBox(height: 40),
              ]),
            ),
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // UI HELPERS
  // ─────────────────────────────────────────────────────────────────────────

  Widget _summaryRow(String label, String value) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
      decoration: BoxDecoration(
          color: Colors.white.withOpacity(0.15),
          borderRadius: BorderRadius.circular(10)),
      child: Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
        Text(label, style: const TextStyle(color: Colors.white70, fontSize: 13)),
        Text(value,  style: const TextStyle(color: Colors.white,
            fontSize: 15, fontWeight: FontWeight.bold)),
      ]),
    );
  }

  Widget _buildSectionHeader(IconData icon, String title, Color color) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(children: [
        Icon(icon, color: color, size: 20),
        const SizedBox(width: 12),
        Text(title, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold,
            color: Color(0xFF1A237E))),
      ]),
    );
  }

  Widget _buildContainer({required Widget child}) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.03),
            blurRadius: 10, offset: const Offset(0, 4))],
      ),
      child: child,
    );
  }

  Widget _buildSwitchTile(String title, String subtitle, bool value,
      ValueChanged<bool> onChanged, {required IconData icon}) {
    return ListTile(
      leading: Container(
        padding: const EdgeInsets.all(8),
        decoration: BoxDecoration(
            color: Colors.blue.withOpacity(0.1), shape: BoxShape.circle),
        child: Icon(icon, color: Colors.blue, size: 20),
      ),
      title: Text(title, style: const TextStyle(fontWeight: FontWeight.bold,
          color: Color(0xFF1A237E))),
      subtitle: Text(subtitle,
          style: TextStyle(color: Colors.grey.shade600, fontSize: 12)),
      trailing: Switch(value: value, onChanged: onChanged, activeColor: Colors.blue),
      contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
    );
  }

  /// Time picker tile with optional error text (red) or hint text (grey).
  Widget _buildTimeTile(
    String title,
    TimeOfDay time,
    Function(TimeOfDay) onChanged,
    IconData icon,
    Color iconColor, {
    String? errorText,
    String? hintText,
  }) {
    final hasError  = errorText != null;
    final chipColor = hasError ? Colors.red : iconColor;

    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      ListTile(
        title: Text(title, style: TextStyle(
          color: hasError ? Colors.red.shade700 : Colors.grey.shade600,
          fontSize: 14,
          fontWeight: hasError ? FontWeight.w600 : FontWeight.normal,
        )),
        trailing: Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          decoration: BoxDecoration(
            color: chipColor.withOpacity(0.05),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(
              color: hasError ? Colors.red.shade300 : chipColor.withOpacity(0.15),
              width: hasError ? 1.5 : 1.0,
            ),
          ),
          child: Row(mainAxisSize: MainAxisSize.min, children: [
            Icon(icon, color: chipColor, size: 20),
            const SizedBox(width: 12),
            Text(time.format(context), style: TextStyle(
              fontWeight: FontWeight.bold, fontSize: 16,
              color: hasError ? Colors.red.shade700 : null,
            )),
            const SizedBox(width: 12),
            Icon(Icons.access_time,
                color: hasError ? Colors.red.shade300 : Colors.grey, size: 20),
          ]),
        ),
        onTap: () async {
          final picked = await showTimePicker(
              context: context, initialTime: time);
          if (picked != null) onChanged(picked);
        },
        contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
      ),
      if (hasError)
        Padding(
          padding: const EdgeInsets.fromLTRB(20, 0, 20, 10),
          child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Icon(Icons.error_outline, size: 14, color: Colors.red.shade600),
            const SizedBox(width: 6),
            Expanded(child: Text(errorText,
                style: TextStyle(fontSize: 12, color: Colors.red.shade600))),
          ]),
        )
      else if (hintText != null)
        Padding(
          padding: const EdgeInsets.fromLTRB(20, 0, 20, 10),
          child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Icon(Icons.info_outline, size: 13, color: Colors.grey.shade400),
            const SizedBox(width: 6),
            Expanded(child: Text(hintText,
                style: TextStyle(fontSize: 11, color: Colors.grey.shade400))),
          ]),
        ),
    ]);
  }

  Widget _buildBulletPoint(String text) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
        const Text('• ', style: TextStyle(color: Colors.blue,
            fontWeight: FontWeight.bold, fontSize: 18)),
        Expanded(child: Text(text,
            style: TextStyle(color: Colors.grey.shade600, fontSize: 13))),
      ]),
    );
  }
}