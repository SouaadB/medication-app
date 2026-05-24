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

  TimeOfDay _bedtime   = const TimeOfDay(hour: 23, minute: 0);
  TimeOfDay _wakeTime  = const TimeOfDay(hour: 7,  minute: 0);
  TimeOfDay _breakfast = const TimeOfDay(hour: 8,  minute: 0);
  TimeOfDay _lunch     = const TimeOfDay(hour: 12, minute: 30);
  TimeOfDay _dinner    = const TimeOfDay(hour: 18, minute: 30);

  // ── LOAD from backend ──────────────────────────────────────────────────────

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
          _smartScheduling = p['smart_scheduling_enabled'] == 1 || p['smart_scheduling_enabled'] == true;
          _bedtime   = _parseTime(p['bedtime'],        const TimeOfDay(hour: 23, minute: 0));
          _wakeTime  = _parseTime(p['wake_time'],       const TimeOfDay(hour: 7,  minute: 0));
          _breakfast = _parseTime(p['breakfast_time'],  const TimeOfDay(hour: 8,  minute: 0));
          _lunch     = _parseTime(p['lunch_time'],      const TimeOfDay(hour: 12, minute: 30));
          _dinner    = _parseTime(p['dinner_time'],     const TimeOfDay(hour: 18, minute: 30));
          _isLoading = false;
        });
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
    } catch (_) {
      return fallback;
    }
  }

  String _formatTime(TimeOfDay t) =>
      '${t.hour.toString().padLeft(2, '0')}:${t.minute.toString().padLeft(2, '0')}';

  int _activeDurationHours() {
    final wakeMinutes = _wakeTime.hour * 60 + _wakeTime.minute;
    final bedMinutes  = _bedtime.hour * 60 + _bedtime.minute;
    int diff = bedMinutes - wakeMinutes;
    if (diff < 0) diff += 24 * 60;
    return (diff / 60).round();
  }

  // ── SAVE to backend ────────────────────────────────────────────────────────

  Future<void> _saveSchedule() async {
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
          'bedtime':        _formatTime(_bedtime),
          'wake_time':      _formatTime(_wakeTime),
          'breakfast_time': _formatTime(_breakfast),
          'lunch_time':     _formatTime(_lunch),
          'dinner_time':    _formatTime(_dinner),
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

  // ── BUILD ──────────────────────────────────────────────────────────────────

  @override
  Widget build(BuildContext context) {
    final lang = Provider.of<LanguageService>(context);

    return Scaffold(
      backgroundColor: const Color(0xFFF8F9FA),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.black54),
          onPressed: () => Navigator.pop(context),
        ),
        actions: [
          Container(
            margin: const EdgeInsets.only(right: 16),
            padding: const EdgeInsets.all(8),
            decoration: const BoxDecoration(color: Color(0xFF3498DB), shape: BoxShape.circle),
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
                    style: const TextStyle(fontSize: 28, fontWeight: FontWeight.bold, color: Color(0xFF1A237E))),
                const SizedBox(height: 4),
                Text(lang.translate('setRoutine'),
                    style: TextStyle(fontSize: 16, color: Colors.grey.shade600)),
                const SizedBox(height: 24),

                // Smart Scheduling toggle
                _buildContainer(child: _buildSwitchTile(
                  lang.translate('enableSmartScheduling'),
                  _smartScheduling ? lang.translate('active') : 'Inactive',
                  _smartScheduling,
                  (v) => setState(() => _smartScheduling = v),
                  icon: Icons.access_time,
                )),
                const SizedBox(height: 16),

                // Info box
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

                // Sleep schedule
                _buildSectionHeader(Icons.bed_outlined, lang.translate('sleepSchedule'), Colors.purple),
                _buildContainer(child: Column(children: [
                  _buildTimeTile(lang.translate('bedtime'),   _bedtime,  (t) => setState(() => _bedtime  = t), Icons.nightlight_outlined, Colors.purple),
                  _buildTimeTile(lang.translate('wakeUpTime'), _wakeTime, (t) => setState(() => _wakeTime = t), Icons.wb_sunny_outlined,    Colors.orange),
                  const Divider(height: 1),
                  Padding(
                    padding: const EdgeInsets.all(16),
                    child: Row(mainAxisAlignment: MainAxisAlignment.center, children: [
                      Text('${lang.translate('activeHours')}: ', style: TextStyle(color: Colors.grey.shade600)),
                      Text('${_activeDurationHours()} ${lang.translate('hoursPerDay')}',
                          style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.blue)),
                    ]),
                  ),
                ])),
                const SizedBox(height: 24),

                // Meal times
                _buildSectionHeader(Icons.restaurant_outlined, lang.translate('mealTimes'), Colors.green),
                _buildContainer(child: Column(children: [
                  _buildTimeTile(lang.translate('breakfast'), _breakfast, (t) => setState(() => _breakfast = t), Icons.coffee_outlined,       Colors.orange),
                  _buildTimeTile(lang.translate('lunch'),     _lunch,     (t) => setState(() => _lunch     = t), Icons.lunch_dining_outlined,  Colors.green),
                  _buildTimeTile(lang.translate('dinner'),    _dinner,    (t) => setState(() => _dinner    = t), Icons.dinner_dining_outlined,  Colors.red),
                ])),
                const SizedBox(height: 24),

                // Schedule summary card
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
                          style: const TextStyle(color: Colors.white, fontSize: 17, fontWeight: FontWeight.bold)),
                    ]),
                    const SizedBox(height: 16),
                    _summaryRow('🌙 ${lang.translate('bedtime')}',  _formatTime(_bedtime)),
                    const SizedBox(height: 8),
                    _summaryRow('☀️ ${lang.translate('wakeUpTime')}', _formatTime(_wakeTime)),
                    const SizedBox(height: 8),
                    _summaryRow('☕ ${lang.translate('breakfast')}',  _formatTime(_breakfast)),
                    const SizedBox(height: 8),
                    _summaryRow('🥗 ${lang.translate('lunch')}',      _formatTime(_lunch)),
                    const SizedBox(height: 8),
                    _summaryRow('🍽️ ${lang.translate('dinner')}',     _formatTime(_dinner)),
                  ]),
                ),
                const SizedBox(height: 24),

                // How it works
                _buildContainer(child: Padding(
                  padding: const EdgeInsets.all(20),
                  child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                    Row(children: [
                      const Icon(Icons.track_changes, color: Colors.red, size: 24),
                      const SizedBox(width: 12),
                      Text(lang.translate('howSmartSchedulingWorks'),
                          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                    ]),
                    const SizedBox(height: 16),
                    _buildBulletPoint(lang.translate('medicationRemindersScheduledAroundMeals')),
                    _buildBulletPoint(lang.translate('noNotificationsDuringSleep')),
                    _buildBulletPoint(lang.translate('remindersOptimized')),
                  ]),
                )),
                const SizedBox(height: 32),

                // Save button
                SizedBox(
                  width: double.infinity,
                  height: 55,
                  child: ElevatedButton(
                    onPressed: _isSaving ? null : _saveSchedule,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF3498DB),
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(50)),
                      elevation: 0,
                    ),
                    child: _isSaving
                        ? const SizedBox(width: 22, height: 22,
                            child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                        : Text(lang.translate('saveSchedule'),
                            style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                  ),
                ),
                const SizedBox(height: 40),
              ]),
            ),
    );
  }

  // ── UI helpers (unchanged from original) ──────────────────────────────────

  Widget _summaryRow(String label, String value) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
      decoration: BoxDecoration(color: Colors.white.withOpacity(0.15), borderRadius: BorderRadius.circular(10)),
      child: Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
        Text(label, style: const TextStyle(color: Colors.white70, fontSize: 13)),
        Text(value,  style: const TextStyle(color: Colors.white,   fontSize: 15, fontWeight: FontWeight.bold)),
      ]),
    );
  }

  Widget _buildSectionHeader(IconData icon, String title, Color color) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(children: [
        Icon(icon, color: color, size: 20),
        const SizedBox(width: 12),
        Text(title, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFF1A237E))),
      ]),
    );
  }

  Widget _buildContainer({required Widget child}) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.03), blurRadius: 10, offset: const Offset(0, 4))],
      ),
      child: child,
    );
  }

  Widget _buildSwitchTile(String title, String subtitle, bool value, ValueChanged<bool> onChanged, {required IconData icon}) {
    return ListTile(
      leading: Container(
        padding: const EdgeInsets.all(8),
        decoration: BoxDecoration(color: Colors.blue.withOpacity(0.1), shape: BoxShape.circle),
        child: Icon(icon, color: Colors.blue, size: 20),
      ),
      title: Text(title, style: const TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF1A237E))),
      subtitle: Text(subtitle, style: TextStyle(color: Colors.grey.shade600, fontSize: 12)),
      trailing: Switch(value: value, onChanged: onChanged, activeColor: Colors.blue),
      contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
    );
  }

  Widget _buildTimeTile(String title, TimeOfDay time, Function(TimeOfDay) onChanged, IconData icon, Color iconColor) {
    return ListTile(
      title: Text(title, style: TextStyle(color: Colors.grey.shade600, fontSize: 14)),
      trailing: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        decoration: BoxDecoration(
          color: iconColor.withOpacity(0.05),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: iconColor.withOpacity(0.1)),
        ),
        child: Row(mainAxisSize: MainAxisSize.min, children: [
          Icon(icon, color: iconColor, size: 20),
          const SizedBox(width: 12),
          Text(time.format(context), style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
          const SizedBox(width: 12),
          const Icon(Icons.access_time, color: Colors.grey, size: 20),
        ]),
      ),
      onTap: () async {
        final picked = await showTimePicker(context: context, initialTime: time);
        if (picked != null) onChanged(picked);
      },
      contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
    );
  }

  Widget _buildBulletPoint(String text) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
        const Text('• ', style: TextStyle(color: Colors.blue, fontWeight: FontWeight.bold, fontSize: 18)),
        Expanded(child: Text(text, style: TextStyle(color: Colors.grey.shade600, fontSize: 13))),
      ]),
    );
  }
}