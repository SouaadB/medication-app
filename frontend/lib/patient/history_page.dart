import 'dart:convert';
import 'dart:math' as math;
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../config/api_config.dart';
import '../services/language_service.dart';

class HistoryPage extends StatefulWidget {
  const HistoryPage({super.key});

  @override
  State<HistoryPage> createState() => _HistoryPageState();
}

class _HistoryPageState extends State<HistoryPage> {
  bool _isLoading = true;
  List<dynamic> _history      = [];
  Map<String, dynamic>? _stats;
  List<dynamic> _weeklyTrends = [];
  List<dynamic> _mostMissed   = [];

  // period filter
  int _selectedDays = 30;
  final List<int> _periodOptions = [7, 30, 90];

  @override
  void initState() {
    super.initState();
    _loadAll();
  }

  // ── data ───────────────────────────────────────────────────────────────────

  Future<void> _loadAll() async {
    setState(() => _isLoading = true);
    await Future.wait([
      _loadHistory(),
      _loadStats(),
      _loadWeeklyTrends(),
      _loadMostMissed(),
    ]);
    setState(() => _isLoading = false);
  }

  Future<String?> _getToken() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('auth_token');
    if (token == null && mounted) Navigator.pushReplacementNamed(context, '/signin');
    return token;
  }

  Future<void> _loadHistory() async {
    try {
      final token = await _getToken();
      if (token == null) return;
      final resp = await http.get(
        Uri.parse('${ApiConfig.baseUrl}/history/grouped?days=$_selectedDays'),
        headers: ApiConfig.getAuthHeaders(token),
      );
      if (resp.statusCode == 200) {
        final data = jsonDecode(resp.body);
        if (mounted) setState(() => _history = data['data'] ?? []);
      }
    } catch (e) { debugPrint('history error: $e'); }
  }

  Future<void> _loadStats() async {
    try {
      final token = await _getToken();
      if (token == null) return;
      final resp = await http.get(
        Uri.parse('${ApiConfig.baseUrl}/history/stats?days=$_selectedDays'),
        headers: ApiConfig.getAuthHeaders(token),
      );
      if (resp.statusCode == 200) {
        final data = jsonDecode(resp.body);
        if (mounted) setState(() => _stats = data['data']);
      }
    } catch (e) { debugPrint('stats error: $e'); }
  }

  Future<void> _loadWeeklyTrends() async {
    try {
      final token = await _getToken();
      if (token == null) return;
      final resp = await http.get(
        Uri.parse('${ApiConfig.baseUrl}/history/trends?weeks=4'),
        headers: ApiConfig.getAuthHeaders(token),
      );
      if (resp.statusCode == 200) {
        final data = jsonDecode(resp.body);
        if (mounted) setState(() => _weeklyTrends = data['data'] ?? []);
      }
    } catch (e) { debugPrint('trends error: $e'); }
  }

  Future<void> _loadMostMissed() async {
    try {
      final token = await _getToken();
      if (token == null) return;
      final resp = await http.get(
        Uri.parse('${ApiConfig.baseUrl}/history/missed?limit=5'),
        headers: ApiConfig.getAuthHeaders(token),
      );
      if (resp.statusCode == 200) {
        final data = jsonDecode(resp.body);
        if (mounted) setState(() => _mostMissed = data['data'] ?? []);
      }
    } catch (e) { debugPrint('missed error: $e'); }
  }

  // ── helpers ────────────────────────────────────────────────────────────────

  String _formatDate(dynamic dateValue, LanguageService lang) {
    DateTime date;
    if (dateValue is DateTime) {
      date = dateValue;
    } else if (dateValue is String) {
      try { date = DateTime.parse(dateValue); }
      catch (_) { return dateValue.toString(); }
    } else { return dateValue.toString(); }

    final now        = DateTime.now();
    final today      = DateTime(now.year, now.month, now.day);
    final yesterday  = today.subtract(const Duration(days: 1));
    final normalized = DateTime(date.year, date.month, date.day);

    if (normalized == today)     return lang.translate('today');
    if (normalized == yesterday) return lang.translate('yesterday');
    return '${_monthName(date.month)} ${date.day}, ${date.year}';
  }

  String _monthName(int m) {
    const n = ['January','February','March','April','May','June',
               'July','August','September','October','November','December'];
    return n[m - 1];
  }

  String _shortDay(String? dayName) {
    if (dayName == null || dayName.isEmpty) return '?';
    return dayName.substring(0, 3);
  }

  String _formatTime(String? dateStr) {
    if (dateStr == null || dateStr.isEmpty) return '--:--';
    try {
      final sep = dateStr.contains(' ') ? ' ' : 'T';
      final parts = dateStr.split(sep);
      if (parts.length >= 2) {
        final tp = parts[1].split(':');
        if (tp.length >= 2) return '${tp[0].padLeft(2,'0')}:${tp[1].padLeft(2,'0')}';
      }
      final d = DateTime.parse(dateStr);
      return '${d.hour.toString().padLeft(2,'0')}:${d.minute.toString().padLeft(2,'0')}';
    } catch (_) { return '--:--'; }
  }

  Color _statusColor(String status) {
    switch (status) {
      case 'TAKEN':   return const Color(0xFF639922);
      case 'MISSED':  return const Color(0xFFE24B4A);
      case 'SKIPPED': return Colors.grey;
      default:        return Colors.orange;
    }
  }

  Color _statusBg(String status) {
    switch (status) {
      case 'TAKEN':   return const Color(0xFFEAF3DE);
      case 'MISSED':  return const Color(0xFFFCEBEB);
      case 'SKIPPED': return Colors.grey.shade100;
      default:        return const Color(0xFFFAEEDA);
    }
  }

  IconData _statusIcon(String status) {
    switch (status) {
      case 'TAKEN':   return Icons.check_circle_outline;
      case 'MISSED':  return Icons.cancel_outlined;
      case 'SKIPPED': return Icons.skip_next_outlined;
      default:        return Icons.access_time;
    }
  }

  String _statusText(String status, LanguageService lang) {
    switch (status) {
      case 'TAKEN':   return lang.translate('taken');
      case 'MISSED':  return lang.translate('missed');
      case 'SKIPPED': return 'Skipped';
      default:        return lang.translate('scheduled');
    }
  }

  int _parseInt(dynamic v) => int.tryParse(v?.toString() ?? '0') ?? 0;
  double _parseDouble(dynamic v) => double.tryParse(v?.toString() ?? '0') ?? 0;

  Color _adherenceColor(double pct) {
    if (pct >= 80) return const Color(0xFF639922);
    if (pct >= 50) return const Color(0xFFBA7517);
    return const Color(0xFFE24B4A);
  }

  // compute daily adherence % for each day in history
  List<_DayBar> _getDayBars() {
    return _history.take(14).map((day) {
      final meds  = (day['medications'] as List? ?? []);
      final total  = meds.length;
      final taken  = meds.where((m) => m['status'] == 'TAKEN').length;
      final pct    = total > 0 ? (taken / total * 100).roundToDouble() : 0.0;
      final label  = day['date']?.toString().substring(5) ?? ''; // MM-DD
      return _DayBar(label: label, pct: pct);
    }).toList().reversed.toList();
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
          icon: const Icon(Icons.arrow_back, color: Colors.black54),
          onPressed: () => Navigator.pop(context),
        ),
        title: Text(lang.translate('history'),
            style: const TextStyle(color: Color(0xFF1A237E), fontWeight: FontWeight.bold, fontSize: 18)),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh, color: Colors.blue),
            onPressed: _loadAll,
          ),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: _loadAll,
              child: SingleChildScrollView(
                physics: const AlwaysScrollableScrollPhysics(),
                padding: const EdgeInsets.fromLTRB(16, 12, 16, 30),
                child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [

                  // ── period selector ─────────────────────────────────────
                  _buildPeriodSelector(lang),
                  const SizedBox(height: 16),

                  // ── stats cards ─────────────────────────────────────────
                  if (_stats != null) ...[
                    _buildStatsCards(lang),
                    const SizedBox(height: 16),
                  ],

                  // ── daily bar chart ─────────────────────────────────────
                  if (_history.isNotEmpty) ...[
                    _sectionHeader('Daily adherence', Icons.bar_chart_rounded, Colors.blue),
                    const SizedBox(height: 10),
                    _buildBarChart(),
                    const SizedBox(height: 20),
                  ],

                  // ── weekly trends ───────────────────────────────────────
                  if (_weeklyTrends.isNotEmpty) ...[
                    _sectionHeader('Best days of the week', Icons.calendar_view_week_outlined, Colors.purple),
                    const SizedBox(height: 10),
                    _buildWeeklyTrends(),
                    const SizedBox(height: 20),
                  ],

                  // ── most missed ─────────────────────────────────────────
                  if (_mostMissed.isNotEmpty) ...[
                    _sectionHeader('Most missed medications', Icons.warning_amber_outlined, const Color(0xFFBA7517)),
                    const SizedBox(height: 10),
                    _buildMostMissed(),
                    const SizedBox(height: 20),
                  ],

                  // ── history timeline ────────────────────────────────────
                  _sectionHeader('Medication history', Icons.history_outlined, const Color(0xFF1A237E)),
                  const SizedBox(height: 10),

                  if (_history.isEmpty)
                    _buildEmpty(lang)
                  else
                    ..._history.map((day) => _buildDaySection(day, lang)).toList(),
                ]),
              ),
            ),
    );
  }

  // ── WIDGETS ────────────────────────────────────────────────────────────────

  Widget _sectionHeader(String title, IconData icon, Color color) {
    return Row(children: [
      Icon(icon, size: 18, color: color),
      const SizedBox(width: 8),
      Text(title, style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: color)),
    ]);
  }

  Widget _buildPeriodSelector(LanguageService lang) {
    return Container(
      padding: const EdgeInsets.all(4),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: Colors.grey.shade200),
      ),
      child: Row(children: _periodOptions.map((days) {
        final selected = _selectedDays == days;
        return Expanded(child: GestureDetector(
          onTap: () {
            if (_selectedDays != days) {
              setState(() => _selectedDays = days);
              _loadAll();
            }
          },
          child: Container(
            padding: const EdgeInsets.symmetric(vertical: 8),
            decoration: BoxDecoration(
              color: selected ? Colors.blue : Colors.transparent,
              borderRadius: BorderRadius.circular(10),
            ),
            child: Text(
              'Last $days days',
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w600,
                color: selected ? Colors.white : Colors.grey.shade600,
              ),
            ),
          ),
        ));
      }).toList()),
    );
  }

  Widget _buildStatsCards(LanguageService lang) {
    final adherence = _parseDouble(_stats!['adherence_rate']);
    final taken     = _parseInt(_stats!['taken_doses']);
    final missed    = _parseInt(_stats!['missed_doses']);
    final total     = _parseInt(_stats!['total_doses']);
    final aColor    = _adherenceColor(adherence);

    return Column(children: [
      // adherence hero
      Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(18),
          boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.04), blurRadius: 10, offset: const Offset(0, 4))],
        ),
        child: Row(children: [
          // mini ring
          SizedBox(
            width: 64, height: 64,
            child: CustomPaint(
              painter: _MiniRingPainter(progress: adherence / 100, color: aColor),
              child: Center(child: Text('${adherence.toInt()}%',
                  style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: aColor))),
            ),
          ),
          const SizedBox(width: 16),
          Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text('Adherence rate', style: TextStyle(fontSize: 13, color: Colors.grey.shade600)),
            const SizedBox(height: 4),
            ClipRRect(
              borderRadius: BorderRadius.circular(4),
              child: LinearProgressIndicator(
                value: adherence / 100,
                minHeight: 6,
                backgroundColor: Colors.grey.shade100,
                valueColor: AlwaysStoppedAnimation<Color>(aColor),
              ),
            ),
            const SizedBox(height: 6),
            Text('$taken taken out of $total doses',
                style: TextStyle(fontSize: 12, color: Colors.grey.shade500)),
          ])),
        ]),
      ),
      const SizedBox(height: 10),
      // taken / missed row
      Row(children: [
        Expanded(child: _miniStatCard(
          icon: Icons.check_circle_outline,
          value: '$taken',
          label: lang.translate('taken'),
          color: const Color(0xFF639922),
          bg: const Color(0xFFEAF3DE),
        )),
        const SizedBox(width: 10),
        Expanded(child: _miniStatCard(
          icon: Icons.cancel_outlined,
          value: '$missed',
          label: lang.translate('missed'),
          color: const Color(0xFFE24B4A),
          bg: const Color(0xFFFCEBEB),
        )),
        const SizedBox(width: 10),
        Expanded(child: _miniStatCard(
          icon: Icons.medication_outlined,
          value: '$total',
          label: 'Total',
          color: Colors.blue,
          bg: const Color(0xFFE6F1FB),
        )),
      ]),
    ]);
  }

Widget _miniStatCard({
  required IconData icon,
  required String value,
  required String label,
  required Color color,
  required Color bg,
}) {
  return Container(
    padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 10),
    decoration: BoxDecoration(color: bg, borderRadius: BorderRadius.circular(14)),
    child: Column(mainAxisSize: MainAxisSize.min, children: [
      Icon(icon, color: color, size: 18),
      const SizedBox(height: 4),
      Text(value, style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: color)),
      Text(label, style: TextStyle(fontSize: 10, color: color.withOpacity(0.8)),
          maxLines: 1, overflow: TextOverflow.ellipsis),
    ]),
  );
}

  Widget _buildBarChart() {
    final bars = _getDayBars();
    if (bars.isEmpty) return const SizedBox.shrink();
    final maxPct = bars.map((b) => b.pct).fold(0.0, math.max);

    return Container(
      height: 150,
      padding: const EdgeInsets.fromLTRB(8, 12, 8, 8),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.04), blurRadius: 10, offset: const Offset(0, 4))],
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.end,
        children: bars.map((bar) {
          final heightFraction = maxPct > 0 ? bar.pct / maxPct : 0.0;
          final color = _adherenceColor(bar.pct);
          return Expanded(child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 2),
            child: Column(mainAxisAlignment: MainAxisAlignment.end, children: [

              ClipRRect(
                borderRadius: BorderRadius.circular(4),
                child: AnimatedContainer(
                  duration: const Duration(milliseconds: 600),
                  height: 70 * heightFraction + (bar.pct > 0 ? 4 : 0),
                  color: color,
                ),
              ),
              const SizedBox(height: 4),
              Text(bar.label, style: TextStyle(fontSize: 7, color: Colors.grey.shade500)),
            ]),
          ));
        }).toList(),
      ),
    );
  }

  Widget _buildWeeklyTrends() {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.04), blurRadius: 10, offset: const Offset(0, 4))],
      ),
      child: Column(children: _weeklyTrends.map((t) {
        final pct   = _parseDouble(t['adherence_rate']);
        final color = _adherenceColor(pct);
        final day   = _shortDay(t['day_name']?.toString());
        final taken = _parseInt(t['taken_doses']);
        final total = _parseInt(t['total_doses']);

        return Padding(
          padding: const EdgeInsets.symmetric(vertical: 5),
          child: Row(children: [
            SizedBox(
              width: 36,
              child: Text(day, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Color(0xFF1A237E))),
            ),
            Expanded(child: ClipRRect(
              borderRadius: BorderRadius.circular(4),
              child: LinearProgressIndicator(
                value: pct / 100,
                minHeight: 8,
                backgroundColor: Colors.grey.shade100,
                valueColor: AlwaysStoppedAnimation<Color>(color),
              ),
            )),
            const SizedBox(width: 10),
            SizedBox(
              width: 44,
              child: Text('$taken/$total',
                  style: TextStyle(fontSize: 11, color: Colors.grey.shade500), textAlign: TextAlign.right),
            ),
            const SizedBox(width: 8),
            SizedBox(
              width: 36,
              child: Text('${pct.toInt()}%',
                  style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: color), textAlign: TextAlign.right),
            ),
          ]),
        );
      }).toList()),
    );
  }

  Widget _buildMostMissed() {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.04), blurRadius: 10, offset: const Offset(0, 4))],
      ),
      child: Column(children: _mostMissed.asMap().entries.map((entry) {
        final i   = entry.key;
        final med = entry.value;
        final name  = med['medication_name']?.toString() ?? 'Unknown';
        final dosage = med['dosage']?.toString() ?? '';
        final cond  = med['condition_name']?.toString() ?? '';
        final count = _parseInt(med['missed_count']);
        final isLast = i == _mostMissed.length - 1;

        return Container(
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
          decoration: BoxDecoration(
            border: isLast ? null : Border(bottom: BorderSide(color: Colors.grey.shade100)),
          ),
          child: Row(children: [
            Container(
              width: 32, height: 32,
              decoration: BoxDecoration(
                color: Colors.orange.shade50,
                borderRadius: BorderRadius.circular(8),
              ),
              child: Center(child: Text('${i + 1}',
                  style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Colors.orange.shade700))),
            ),
            const SizedBox(width: 12),
            Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text('$name${dosage.isNotEmpty ? ' $dosage' : ''}',
                  style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: Color(0xFF1A237E))),
              if (cond.isNotEmpty)
                Text(cond, style: TextStyle(fontSize: 12, color: Colors.grey.shade500)),
            ])),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
              decoration: BoxDecoration(
                color: const Color(0xFFFCEBEB),
                borderRadius: BorderRadius.circular(20),
              ),
              child: Text('$count missed',
                  style: const TextStyle(fontSize: 12, color: Color(0xFFE24B4A), fontWeight: FontWeight.bold)),
            ),
          ]),
        );
      }).toList()),
    );
  }

  Widget _buildDaySection(Map<String, dynamic> day, LanguageService lang) {
    final dateLabel = _formatDate(day['date'], lang);
    final meds      = (day['medications'] as List? ?? []);
    final taken     = meds.where((m) => m['status'] == 'TAKEN').length;
    final total     = meds.length;
    final pct       = total > 0 ? (taken / total * 100).round() : 0;
    final pctColor  = _adherenceColor(pct.toDouble());

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.04), blurRadius: 10, offset: const Offset(0, 4))],
      ),
      child: Column(children: [

        // day header
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          decoration: BoxDecoration(
            color: Colors.grey.shade50,
            borderRadius: const BorderRadius.vertical(top: Radius.circular(18)),
            border: Border(bottom: BorderSide(color: Colors.grey.shade100)),
          ),
          child: Row(children: [
            const Icon(Icons.calendar_today_outlined, size: 16, color: Color(0xFF1A237E)),
            const SizedBox(width: 8),
            Text(dateLabel, style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: Color(0xFF1A237E))),
            const Spacer(),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
              decoration: BoxDecoration(
                color: pctColor.withOpacity(0.1),
                borderRadius: BorderRadius.circular(20),
              ),
              child: Text('$taken/$total  ·  $pct%',
                  style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: pctColor)),
            ),
          ]),
        ),

        // medication rows
        ...meds.asMap().entries.map((entry) {
          final i     = entry.key;
          final med   = entry.value;
          final status = med['status']?.toString() ?? 'SCHEDULED';
          final name   = '${med['medication_name'] ?? ''} ${med['dosage'] ?? ''}'.trim();
          final cond   = med['condition_name']?.toString() ?? '';
          final time   = _formatTime(med['full_datetime']?.toString() ?? med['scheduled_date_time']?.toString());
          final sColor = _statusColor(status);
          final sBg    = _statusBg(status);
          final sIcon  = _statusIcon(status);
          final isLast = i == meds.length - 1;

          return Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            decoration: BoxDecoration(
              border: isLast ? null : Border(bottom: BorderSide(color: Colors.grey.shade50, width: 1)),
            ),
            child: Row(children: [

              // time
              SizedBox(
                width: 46,
                child: Text(time,
                    style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Color(0xFF1A237E))),
              ),

              const SizedBox(width: 10),

              // name + condition
              Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text(name,
                    style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: Color(0xFF1A237E)),
                    overflow: TextOverflow.ellipsis),
                if (cond.isNotEmpty)
                  Text(cond, style: TextStyle(fontSize: 11, color: Colors.grey.shade500)),
              ])),

              const SizedBox(width: 10),

              // status badge
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                decoration: BoxDecoration(color: sBg, borderRadius: BorderRadius.circular(20)),
                child: Row(mainAxisSize: MainAxisSize.min, children: [
                  Icon(sIcon, size: 13, color: sColor),
                  const SizedBox(width: 4),
                  Text(_statusText(status, lang),
                      style: TextStyle(fontSize: 11, color: sColor, fontWeight: FontWeight.bold)),
                ]),
              ),
            ]),
          );
        }).toList(),
      ]),
    );
  }

  Widget _buildEmpty(LanguageService lang) {
    return Center(child: Padding(
      padding: const EdgeInsets.symmetric(vertical: 60),
      child: Column(mainAxisSize: MainAxisSize.min, children: [
        Icon(Icons.history_outlined, size: 72, color: Colors.grey.shade300),
        const SizedBox(height: 16),
        Text(lang.translate('noHistory'),
            style: TextStyle(fontSize: 18, color: Colors.grey.shade500)),
      ]),
    ));
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

class _DayBar {
  final String label;
  final double pct;
  const _DayBar({required this.label, required this.pct});
}

class _MiniRingPainter extends CustomPainter {
  final double progress;
  final Color  color;
  const _MiniRingPainter({required this.progress, required this.color});

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final radius = (size.width - 10) / 2;
    const start  = -math.pi / 2;

    canvas.drawArc(Rect.fromCircle(center: center, radius: radius),
        start, 2 * math.pi, false,
        Paint()..color = color.withOpacity(0.15)..strokeWidth = 6..style = PaintingStyle.stroke..strokeCap = StrokeCap.round);

    if (progress > 0) {
      canvas.drawArc(Rect.fromCircle(center: center, radius: radius),
          start, 2 * math.pi * progress, false,
          Paint()..color = color..strokeWidth = 6..style = PaintingStyle.stroke..strokeCap = StrokeCap.round);
    }
  }

  @override
  bool shouldRepaint(_MiniRingPainter old) => old.progress != progress;
}