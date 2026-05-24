import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../config/api_config.dart';
import '../services/language_service.dart';

class DailyPlanningPage extends StatefulWidget {
  const DailyPlanningPage({super.key});

  @override
  State<DailyPlanningPage> createState() => _DailyPlanningPageState();
}

class _DailyPlanningPageState extends State<DailyPlanningPage> {
  DateTime _selectedDate = DateTime.now();
  bool _loading = true;
  List<Map<String, dynamic>> _rows = [];
  int _total     = 0;
  int _completed = 0;
  int _pending   = 0;
  int _missed    = 0;

  @override
  void initState() {
    super.initState();
    _loadScheduleForDate(_selectedDate);
  }

  // ── helpers ────────────────────────────────────────────────────────────────

  String _fmtYmd(DateTime d) =>
      '${d.year.toString().padLeft(4,'0')}-${d.month.toString().padLeft(2,'0')}-${d.day.toString().padLeft(2,'0')}';

  String _fmtDisplay(DateTime d, LanguageService lang) {
    final now  = DateTime.now();
    final t0   = DateTime(now.year, now.month, now.day);
    final d0   = DateTime(d.year, d.month, d.day);
    final diff = d0.difference(t0).inDays;
    if (diff == 0) return lang.translate('today');
    if (diff == 1) return lang.translate('tomorrow');
    if (diff == -1) return 'Yesterday';
    return '${_weekdayName(d.weekday)}, ${_monthName(d.month)} ${d.day}';
  }

  String _fmtFullDate(DateTime d) =>
      '${_weekdayName(d.weekday)}, ${_monthName(d.month)} ${d.day}, ${d.year}';

  String _weekdayName(int w) {
    const n = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
    return n[(w - 1) % 7];
  }

  String _monthName(int m) {
    const n = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    return n[(m - 1) % 12];
  }

  Color _conditionColor(String? name) {
    if (name == null || name.isEmpty) return Colors.blue;
    const colors = [Colors.blue, Colors.green, Colors.orange, Colors.purple, Colors.teal, Colors.pink, Colors.indigo];
    return colors[name.hashCode.abs() % colors.length];
  }

  int _adherencePct() {
    if (_total == 0) return 0;
    return ((_completed / _total) * 100).round();
  }

  Color _adherenceColor() {
    final p = _adherencePct();
    if (p >= 80) return const Color(0xFF639922);
    if (p >= 50) return const Color(0xFFBA7517);
    return const Color(0xFFE24B4A);
  }

  // ── time grouping ──────────────────────────────────────────────────────────

  String _timeGroup(String? timeStr) {
    if (timeStr == null) return 'Other';
    try {
      final parts = timeStr.split(':');
      final hour  = int.parse(parts[0]);
      if (hour < 12) return 'Morning';
      if (hour < 17) return 'Afternoon';
      if (hour < 21) return 'Evening';
      return 'Night';
    } catch (_) {
      return 'Other';
    }
  }

  IconData _groupIcon(String group) {
    switch (group) {
      case 'Morning':   return Icons.wb_sunny_outlined;
      case 'Afternoon': return Icons.wb_cloudy_outlined;
      case 'Evening':   return Icons.dinner_dining_outlined;
      case 'Night':     return Icons.nightlight_outlined;
      default:          return Icons.schedule_outlined;
    }
  }

  Color _groupColor(String group) {
    switch (group) {
      case 'Morning':   return Colors.orange;
      case 'Afternoon': return Colors.blue;
      case 'Evening':   return Colors.deepPurple;
      case 'Night':     return Colors.indigo;
      default:          return Colors.grey;
    }
  }

  Map<String, List<Map<String, dynamic>>> _groupedRows() {
    final order  = ['Morning', 'Afternoon', 'Evening', 'Night', 'Other'];
    final groups = <String, List<Map<String, dynamic>>>{};
    for (final row in _rows) {
      final g = _timeGroup(row['time']?.toString());
      groups.putIfAbsent(g, () => []).add(row);
    }
    final sorted = <String, List<Map<String, dynamic>>>{};
    for (final key in order) {
      if (groups.containsKey(key)) sorted[key] = groups[key]!;
    }
    return sorted;
  }

  // ── data ───────────────────────────────────────────────────────────────────

  Future<void> _loadScheduleForDate(DateTime date) async {
    setState(() { _loading = true; _rows = []; _total = _completed = _pending = _missed = 0; });
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');
      if (token == null) { Navigator.pushReplacementNamed(context, '/signin'); return; }

      final resp = await http.get(
        Uri.parse('${ApiConfig.baseUrl}/treatments/schedule?date=${_fmtYmd(date)}'),
        headers: ApiConfig.getAuthHeaders(token),
      );

      if (resp.statusCode == 200) {
        final data = jsonDecode(resp.body);
        final meds = List<Map<String, dynamic>>.from(data['medications'] ?? []);
        setState(() {
          _rows      = meds;
          _total     = data['stats']?['total']     ?? meds.length;
          _completed = data['stats']?['completed'] ?? 0;
          _pending   = data['stats']?['pending']   ?? 0;
          _missed    = data['stats']?['missed']    ?? 0;
          _loading   = false;
        });
      } else {
        setState(() => _loading = false);
      }
    } catch (e) {
      debugPrint('DailyPlanningPage error: $e');
      setState(() => _loading = false);
    }
  }

  // ── navigation ─────────────────────────────────────────────────────────────

  bool get _canGoPrev {
    final t0 = DateTime(DateTime.now().year, DateTime.now().month, DateTime.now().day);
    final d0 = DateTime(_selectedDate.year, _selectedDate.month, _selectedDate.day);
    return d0.isAfter(t0);
  }

  bool get _canGoNext {
    final t0   = DateTime(DateTime.now().year, DateTime.now().month, DateTime.now().day);
    final d0   = DateTime(_selectedDate.year, _selectedDate.month, _selectedDate.day);
    return d0.difference(t0).inDays < 30;
  }

  void _goPrev() {
    if (!_canGoPrev) return;
    final d = _selectedDate.subtract(const Duration(days: 1));
    setState(() => _selectedDate = d);
    _loadScheduleForDate(d);
  }

  void _goNext() {
    if (!_canGoNext) return;
    final d = _selectedDate.add(const Duration(days: 1));
    setState(() => _selectedDate = d);
    _loadScheduleForDate(d);
  }

  // ── BUILD ──────────────────────────────────────────────────────────────────

  @override
  Widget build(BuildContext context) {
    final lang = Provider.of<LanguageService>(context);

    return Scaffold(
      backgroundColor: const Color(0xFFF7F8FC),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios, color: Colors.blue),
          onPressed: () => Navigator.pop(context),
        ),
        title: Row(children: [
          const Icon(Icons.calendar_month, color: Colors.blue, size: 22),
          const SizedBox(width: 8),
          Text(lang.translate('myPlanning'),
              style: const TextStyle(color: Color(0xFF1A237E), fontWeight: FontWeight.bold, fontSize: 18)),
        ]),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh, color: Colors.blue),
            onPressed: () => _loadScheduleForDate(_selectedDate),
          ),
        ],
      ),
      body: Column(children: [

        // ── date navigator ─────────────────────────────────────────────────
        Container(
          color: Colors.white,
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
          child: Row(children: [
            _navBtn(Icons.chevron_left, _canGoPrev, _goPrev),
            Expanded(child: Column(children: [
              Text(_fmtDisplay(_selectedDate, lang),
                  style: const TextStyle(fontSize: 17, fontWeight: FontWeight.bold, color: Color(0xFF1A237E))),
              const SizedBox(height: 2),
              Text(_fmtFullDate(_selectedDate),
                  style: TextStyle(fontSize: 12, color: Colors.grey.shade500)),
            ])),
            _navBtn(Icons.chevron_right, _canGoNext, _goNext),
          ]),
        ),

        Expanded(child: _loading
            ? const Center(child: CircularProgressIndicator())
            : RefreshIndicator(
                onRefresh: () => _loadScheduleForDate(_selectedDate),
                child: SingleChildScrollView(
                  physics: const AlwaysScrollableScrollPhysics(),
                  padding: const EdgeInsets.all(16),
                  child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [

                    // ── stats grid ──────────────────────────────────────────
                    GridView.count(
                      crossAxisCount: 4,
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      crossAxisSpacing: 8,
                      mainAxisSpacing: 8,
                      childAspectRatio: 0.85,
                      children: [
                        _statCard('Total',   _total,     Colors.blue,       Icons.medication_outlined),
                        _statCard('Taken',   _completed, const Color(0xFF639922), Icons.check_circle_outline),
                        _statCard('Pending', _pending,   const Color(0xFFBA7517), Icons.access_time),
                        _statCard('Missed',  _missed,    const Color(0xFFE24B4A), Icons.error_outline),
                      ],
                    ),
                    const SizedBox(height: 14),

                    // ── adherence bar ───────────────────────────────────────
                    Row(children: [
                      Text('Adherence', style: TextStyle(fontSize: 13, color: Colors.grey.shade600)),
                      const Spacer(),
                      Text('${_adherencePct()}%',
                          style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: _adherenceColor())),
                    ]),
                    const SizedBox(height: 6),
                    ClipRRect(
                      borderRadius: BorderRadius.circular(4),
                      child: LinearProgressIndicator(
                        value: _total > 0 ? _completed / _total : 0,
                        minHeight: 7,
                        backgroundColor: Colors.grey.shade200,
                        valueColor: AlwaysStoppedAnimation<Color>(_adherenceColor()),
                      ),
                    ),
                    const SizedBox(height: 20),

                    // ── empty state ─────────────────────────────────────────
                    if (_rows.isEmpty) _buildEmpty(lang)

                    // ── timeline grouped by meal ────────────────────────────
                    else ...() {
                      final groups = _groupedRows();
                      final widgets = <Widget>[];
                      groups.forEach((group, meds) {
                        widgets.add(_buildGroupHeader(group));
                        for (final med in meds) {
                          widgets.add(_buildMedCard(med, lang));
                        }
                        widgets.add(const SizedBox(height: 8));
                      });
                      return widgets;
                    }(),
                  ]),
                ),
              )),
      ]),
    );
  }

  // ── UI components ──────────────────────────────────────────────────────────

  Widget _navBtn(IconData icon, bool active, VoidCallback onTap) {
    return GestureDetector(
      onTap: active ? onTap : null,
      child: Container(
        width: 36, height: 36,
        decoration: BoxDecoration(
          color: active ? Colors.blue.shade50 : Colors.grey.shade100,
          borderRadius: BorderRadius.circular(10),
          border: Border.all(color: active ? Colors.blue.shade200 : Colors.grey.shade200),
        ),
        child: Icon(icon, size: 20, color: active ? Colors.blue : Colors.grey.shade400),
      ),
    );
  }

  Widget _statCard(String label, int value, Color color, IconData icon) {
    return Container(
      padding: const EdgeInsets.all(10),
      decoration: BoxDecoration(
        color: color.withOpacity(0.08),
        borderRadius: BorderRadius.circular(14),
      ),
      child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
        Icon(icon, color: color, size: 20),
        const SizedBox(height: 4),
        Text(value.toString(),
            style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: color)),
        Text(label,
            style: TextStyle(fontSize: 10, color: color.withOpacity(0.8), fontWeight: FontWeight.w500),
            textAlign: TextAlign.center),
      ]),
    );
  }

  Widget _buildGroupHeader(String group) {
    final color = _groupColor(group);
    final icon  = _groupIcon(group);
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(children: [
        Container(
          padding: const EdgeInsets.all(6),
          decoration: BoxDecoration(color: color.withOpacity(0.1), borderRadius: BorderRadius.circular(8)),
          child: Icon(icon, size: 16, color: color),
        ),
        const SizedBox(width: 8),
        Text(group, style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: color)),
        const SizedBox(width: 8),
        Expanded(child: Divider(color: color.withOpacity(0.2), thickness: 1)),
      ]),
    );
  }

  Widget _buildMedCard(Map<String, dynamic> row, LanguageService lang) {
    final timeStr  = row['time']?.toString() ?? '--:--';
    final name     = row['medication_name']?.toString() ?? 'Unknown';
    final dosage   = row['dosage']?.toString() ?? '';
    final cond     = row['condition_name']?.toString() ?? '';
    final status   = row['status']?.toString() ?? 'SCHEDULED';
    final cColor   = _conditionColor(cond.isNotEmpty ? cond : null);

    Color cardBg;
    Color stripeColor;
    Widget statusWidget;

    switch (status) {
      case 'TAKEN':
        cardBg      = const Color(0xFFEAF3DE);
        stripeColor = const Color(0xFF639922);
        statusWidget = Container(
          width: 30, height: 30,
          decoration: BoxDecoration(color: const Color(0xFF639922), shape: BoxShape.circle),
          child: const Icon(Icons.check, color: Colors.white, size: 16),
        );
        break;
      case 'MISSED':
        cardBg      = const Color(0xFFFCEBEB);
        stripeColor = const Color(0xFFE24B4A);
        statusWidget = Container(
          width: 30, height: 30,
          decoration: BoxDecoration(color: const Color(0xFFE24B4A), shape: BoxShape.circle),
          child: const Icon(Icons.close, color: Colors.white, size: 16),
        );
        break;
      case 'SKIPPED':
        cardBg      = const Color(0xFFF5F5F5);
        stripeColor = Colors.grey;
        statusWidget = Container(
          width: 30, height: 30,
          decoration: BoxDecoration(color: Colors.grey.shade400, shape: BoxShape.circle),
          child: const Icon(Icons.skip_next, color: Colors.white, size: 16),
        );
        break;
      default: // SCHEDULED
        cardBg      = Colors.white;
        stripeColor = Colors.blue;
        statusWidget = Container(
          width: 30, height: 30,
          decoration: BoxDecoration(
            color: Colors.grey.shade100,
            shape: BoxShape.circle,
            border: Border.all(color: Colors.grey.shade300),
          ),
          child: Icon(Icons.access_time, color: Colors.grey.shade500, size: 16),
        );
    }

    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      decoration: BoxDecoration(
        color: cardBg,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: Colors.black.withOpacity(0.06)),
      ),
      child: Row(children: [

        // left stripe
        Container(
          width: 4,
          height: 72,
          decoration: BoxDecoration(
            color: stripeColor,
            borderRadius: const BorderRadius.only(
              topLeft: Radius.circular(14),
              bottomLeft: Radius.circular(14),
            ),
          ),
        ),

        const SizedBox(width: 12),

        // time
        Column(mainAxisAlignment: MainAxisAlignment.center, children: [
          Text(timeStr,
              style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold,
                  color: status == 'TAKEN' ? const Color(0xFF3B6D11) :
                         status == 'MISSED' ? const Color(0xFFA32D2D) :
                         const Color(0xFF1A237E))),
        ]),

        const SizedBox(width: 12),

        // divider
        Container(width: 1, height: 44, color: Colors.black.withOpacity(0.07)),

        const SizedBox(width: 12),

        // med info
        Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text(name,
              style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Color(0xFF1A237E)),
              overflow: TextOverflow.ellipsis),
          if (dosage.isNotEmpty) ...[
            const SizedBox(height: 2),
            Text(dosage, style: TextStyle(fontSize: 12, color: Colors.grey.shade600)),
          ],
          if (cond.isNotEmpty) ...[
            const SizedBox(height: 4),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
              decoration: BoxDecoration(
                color: cColor.withOpacity(0.1),
                borderRadius: BorderRadius.circular(20),
              ),
              child: Text(cond,
                  style: TextStyle(fontSize: 11, color: cColor, fontWeight: FontWeight.w600),
                  overflow: TextOverflow.ellipsis),
            ),
          ],
        ])),

        const SizedBox(width: 12),
        statusWidget,
        const SizedBox(width: 12),
      ]),
    );
  }

  Widget _buildEmpty(LanguageService lang) {
    final now  = DateTime.now();
    final t0   = DateTime(now.year, now.month, now.day);
    final d0   = DateTime(_selectedDate.year, _selectedDate.month, _selectedDate.day);
    final diff = d0.difference(t0).inDays;

    return Center(child: Padding(
      padding: const EdgeInsets.symmetric(vertical: 60, horizontal: 20),
      child: Column(mainAxisSize: MainAxisSize.min, children: [
        Icon(diff >= 0 ? Icons.event_available_outlined : Icons.event_busy_outlined,
            size: 72, color: Colors.grey.shade300),
        const SizedBox(height: 16),
        Text(
          diff == 0 ? 'No medications scheduled for today'
              : diff > 0 ? 'No medications scheduled for this day'
              : 'No records for this day',
          textAlign: TextAlign.center,
          style: TextStyle(fontSize: 16, color: Colors.grey.shade500),
        ),
      ]),
    ));
  }
}