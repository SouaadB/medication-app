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
  int _total = 0;
  int _completed = 0;
  int _pending = 0;
  int _missed = 0;

  @override
  void initState() {
    super.initState();
    _loadScheduleForDate(_selectedDate);
  }

  String _fmtYmd(DateTime d) {
    final y = d.year.toString().padLeft(4, '0');
    final m = d.month.toString().padLeft(2, '0');
    final day = d.day.toString().padLeft(2, '0');
    return '$y-$m-$day';
  }

  String _fmtDisplay(DateTime d, LanguageService lang) {
    final today = DateTime.now();
    final t0 = DateTime(today.year, today.month, today.day);
    final d0 = DateTime(d.year, d.month, d.day);
    final diff = d0.difference(t0).inDays;
    if (diff == 0) return lang.translate('today');
    if (diff == 1) return lang.translate('tomorrow');
    return '${_weekdayName(d.weekday)}, ${_monthName(d.month)} ${d.day}, ${d.year}';
  }

  String _weekdayName(int w) {
    const names = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
    return names[(w - 1) % 7];
  }

  String _monthName(int m) {
    const names = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    return names[(m - 1) % 12];
  }

  Color _conditionColor(String? name) {
    if (name == null || name.isEmpty) return Colors.blue;
    final colors = [Colors.blue, Colors.green, Colors.orange, Colors.purple, Colors.teal];
    return colors[name.hashCode.abs() % colors.length];
  }

  Future<void> _loadScheduleForDate(DateTime date) async {
    setState(() {
      _loading = true;
      _rows = [];
      _total = 0; _completed = 0; _pending = 0; _missed = 0;
    });
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');
      if (token == null) {
        Navigator.pushReplacementNamed(context, '/signin');
        return;
      }
      
      final ymd = _fmtYmd(date);
      final resp = await http.get(
        Uri.parse('${ApiConfig.baseUrl}/treatments/schedule?date=$ymd'),
        headers: ApiConfig.getAuthHeaders(token),
      );
      
      if (resp.statusCode == 200) {
        final data = jsonDecode(resp.body);
        final meds = List<Map<String, dynamic>>.from(data['medications'] ?? []);
        
        setState(() {
          _rows = meds;
          _total = data['stats']?['total'] ?? meds.length;
          _completed = data['stats']?['completed'] ?? 0;
          _pending = data['stats']?['pending'] ?? 0;
          _missed = data['stats']?['missed'] ?? 0;
          _loading = false;
        });
      } else {
        setState(() => _loading = false);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to load schedule')),
        );
      }
    } catch (e) {
      print('Error loading schedule: $e');
      setState(() => _loading = false);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error: $e')),
      );
    }
  }

  bool get _canGoPrev {
    final today = DateTime.now();
    final t0 = DateTime(today.year, today.month, today.day);
    final d0 = DateTime(_selectedDate.year, _selectedDate.month, _selectedDate.day);
    return d0.isAfter(t0);
  }

  bool get _canGoNext {
    final today = DateTime.now();
    final t0 = DateTime(today.year, today.month, today.day);
    final d0 = DateTime(_selectedDate.year, _selectedDate.month, _selectedDate.day);
    final diff = d0.difference(t0).inDays;
    return diff < 30;
  }

  void _goPrev() {
    if (!_canGoPrev) return;
    final next = _selectedDate.subtract(const Duration(days: 1));
    setState(() => _selectedDate = next);
    _loadScheduleForDate(next);
  }

  void _goNext() {
    if (!_canGoNext) return;
    final next = _selectedDate.add(const Duration(days: 1));
    setState(() => _selectedDate = next);
    _loadScheduleForDate(next);
  }

  @override
  Widget build(BuildContext context) {
    final lang = Provider.of<LanguageService>(context);
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios, color: Colors.blue),
          onPressed: () => Navigator.pop(context),
        ),
        title: Row(
          children: [
            const Icon(Icons.calendar_month, color: Colors.blue),
            const SizedBox(width: 8),
            Text(
              lang.translate('myPlanning'),
              style: const TextStyle(color: Colors.blue, fontWeight: FontWeight.bold),
            ),
          ],
        ),
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    lang.translate('dailySchedule'),
                    style: TextStyle(fontSize: 14, color: Colors.grey),
                  ),
                  const SizedBox(height: 16),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      IconButton(
                        icon: const Icon(Icons.arrow_back_ios),
                        color: _canGoPrev ? Colors.blue : Colors.grey.shade300,
                        onPressed: _canGoPrev ? _goPrev : null,
                      ),
                      Text(
                        _fmtDisplay(_selectedDate, lang),
                        style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                      ),
                      IconButton(
                        icon: const Icon(Icons.arrow_forward_ios),
                        color: _canGoNext ? Colors.blue : Colors.grey.shade300,
                        onPressed: _canGoNext ? _goNext : null,
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      _statCard(lang.translate('total'), _total, Colors.blue, lang),
                      const SizedBox(width: 12),
                      _statCard(lang.translate('taken'), _completed, Colors.green, lang),
                      const SizedBox(width: 12),
                      _statCard(lang.translate('pending'), _pending, Colors.orange, lang),
                    ],
                  ),
                  const SizedBox(height: 16),
                  Container(
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(16),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.05),
                          blurRadius: 10,
                          offset: const Offset(0, 6),
                        ),
                      ],
                    ),
                    child: Column(
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 16),
                          decoration: const BoxDecoration(
                            borderRadius: BorderRadius.only(
                              topLeft: Radius.circular(16),
                              topRight: Radius.circular(16),
                            ),
                            gradient: LinearGradient(
                              colors: [Color(0xFF42A5F5), Color(0xFF2196F3)],
                              begin: Alignment.topLeft,
                              end: Alignment.bottomRight,
                            ),
                          ),
                          child: Row(
                            children: [
                              Expanded(child: Text(lang.translate('time'), style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold))),
                              Expanded(child: Text(lang.translate('medication'), style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold))),
                              Expanded(child: Text(lang.translate('condition'), style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold))),
                              SizedBox(width: 60, child: Text(lang.translate('status'), style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold))),
                            ],
                          ),
                        ),
                        ..._rows.map((row) => _buildRow(row, lang)).toList(),
                      ],
                    ),
                  ),
                  const SizedBox(height: 16),
                  _legend(lang),
                  const SizedBox(height: 16),
                  _infoBanner(lang),
                ],
              ),
            ),
    );
  }

  Widget _statCard(String title, int value, Color color, LanguageService lang) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: color.withOpacity(0.1),
          borderRadius: BorderRadius.circular(12),
        ),
        child: Column(
          children: [
            Text(
              value.toString(),
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: color),
            ),
            const SizedBox(height: 4),
            Text(title, style: TextStyle(color: color, fontWeight: FontWeight.w600)),
          ],
        ),
      ),
    );
  }

  Widget _buildRow(Map<String, dynamic> row, LanguageService lang) {
    try {
      final timeStr = row['time'] ?? '--:--';
      final name = row['medication_name']?.toString() ?? 'Unknown';
      final dosage = row['dosage']?.toString() ?? '';
      final condition = row['condition_name']?.toString() ?? 'No condition';
      final status = row['status']?.toString() ?? 'SCHEDULED';
      final cColor = _conditionColor(condition);

      Color bg;
      Icon statusIcon;
      String statusText;
      if (status == 'TAKEN') {
        bg = Colors.green.withOpacity(0.12);
        statusIcon = const Icon(Icons.check, color: Colors.green);
        statusText = lang.translate('taken');
      } else if (status == 'MISSED') {
        bg = Colors.red.withOpacity(0.12);
        statusIcon = const Icon(Icons.close, color: Colors.red);
        statusText = lang.translate('missed');
      } else {
        bg = Colors.white;
        statusIcon = Icon(Icons.access_time, color: Colors.grey.shade600);
        statusText = lang.translate('pending');
      }

      return Container(
        decoration: BoxDecoration(
          color: bg,
          borderRadius: BorderRadius.circular(10),
          border: Border(
            left: BorderSide(color: cColor, width: 4),
          ),
        ),
        margin: const EdgeInsets.symmetric(vertical: 2, horizontal: 0),
        padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 12),
        child: Row(
          children: [
            Expanded(
              child: Row(
                children: [
                  const Icon(Icons.schedule, color: Colors.blue, size: 18),
                  const SizedBox(width: 8),
                  Text(timeStr),
                ],
              ),
            ),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      const Icon(Icons.medication, color: Colors.blue, size: 18),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          name,
                          style: const TextStyle(fontWeight: FontWeight.w600),
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                    ],
                  ),
                  if (dosage.isNotEmpty) ...[
                    const SizedBox(height: 2),
                    Text(
                      dosage,
                      style: TextStyle(color: Colors.grey.shade600, fontSize: 12),
                    ),
                  ],
                ],
              ),
            ),
            Expanded(
              child: Align(
                alignment: Alignment.centerLeft,
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                  decoration: BoxDecoration(
                    color: cColor.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Text(
                    condition,
                    style: TextStyle(color: cColor, fontWeight: FontWeight.w600, fontSize: 12),
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
              ),
            ),
            SizedBox(
              width: 60,
              child: Align(
                alignment: Alignment.centerRight,
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    statusIcon,
                    const SizedBox(height: 2),
                    Text(
                      statusText,
                      style: TextStyle(
                        fontSize: 10,
                        color: status == 'TAKEN' ? Colors.green : (status == 'MISSED' ? Colors.red : Colors.grey),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      );
    } catch (e) {
      print('Error building row: $e');
      return const SizedBox.shrink();
    }
  }

  Widget _legend(LanguageService lang) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(lang.translate('legend'), style: const TextStyle(fontWeight: FontWeight.bold)),
        const SizedBox(height: 8),
        Row(
          children: [
            const Icon(Icons.check, color: Colors.green, size: 18),
            const SizedBox(width: 6),
            Text(lang.translate('completedLegend')),
          ],
        ),
        const SizedBox(height: 6),
        Row(
          children: [
            Icon(Icons.access_time, color: Colors.grey.shade600, size: 18),
            const SizedBox(width: 6),
            Text(lang.translate('pendingLegend')),
          ],
        ),
        const SizedBox(height: 6),
        Row(
          children: const [
            Icon(Icons.close, color: Colors.red, size: 18),
            SizedBox(width: 6),
            Text('Missed - Skipped dose'),
          ],
        ),
      ],
    );
  }

  Widget _infoBanner(LanguageService lang) {
    final today = DateTime.now();
    final t0 = DateTime(today.year, today.month, today.day);
    final d0 = DateTime(_selectedDate.year, _selectedDate.month, _selectedDate.day);
    final diff = d0.difference(t0).inDays;
    final isToday = diff == 0;

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: isToday ? Colors.blue.withOpacity(0.1) : Colors.purple.withOpacity(0.1),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        children: [
          Icon(Icons.info, color: isToday ? Colors.blue : Colors.purple),
          const SizedBox(width: 8),
          Expanded(
            child: Text(
              isToday
                  ? lang.translate('todayScheduleInfo')
                  : lang.translate('futureScheduleInfo'),
              style: TextStyle(color: isToday ? Colors.blue : Colors.purple),
            ),
          ),
        ],
      ),
    );
  }
}