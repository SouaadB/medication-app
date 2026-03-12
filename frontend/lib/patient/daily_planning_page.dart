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

  String _fmtDisplay(DateTime d) {
    final today = DateTime.now();
    final t0 = DateTime(today.year, today.month, today.day);
    final d0 = DateTime(d.year, d.month, d.day);
    final diff = d0.difference(t0).inDays;
    if (diff == 0) return 'Today';
    if (diff == 1) return 'Tomorrow';
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

  Color _conditionColor(String name) {
    if (name.isEmpty) return Colors.blue;
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
      final ymd = _fmtYmd(date);
      final resp = await http.get(
        Uri.parse('${ApiConfig.baseUrl}/treatments/schedule?date=$ymd'),
        headers: ApiConfig.getAuthHeaders(token!),
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
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Failed to load schedule')));
      }
    } catch (e) {
      setState(() => _loading = false);
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Error: $e')));
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
            const Text(
              'My Planning',
              style: TextStyle(color: Colors.blue, fontWeight: FontWeight.bold),
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
                  const Text(
                    'Your daily medication schedule',
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
                        _fmtDisplay(_selectedDate),
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
                      _statCard('Total', _total, Colors.blue),
                      const SizedBox(width: 12),
                      _statCard('Completed', _completed, Colors.green),
                      const SizedBox(width: 12),
                      _statCard('Pending', _pending, Colors.blue),
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
                            children: const [
                              Expanded(child: Text('Time', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold))),
                              Expanded(child: Text('Medication', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold))),
                              Expanded(child: Text('Condition', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold))),
                              SizedBox(width: 60, child: Text('Status', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold))),
                            ],
                          ),
                        ),
                        ..._rows.map((row) => _buildRow(row)).toList(),
                      ],
                    ),
                  ),
                  const SizedBox(height: 16),
                  _legend(),
                  const SizedBox(height: 16),
                  _infoBanner(),
                ],
              ),
            ),
    );
  }

  Widget _statCard(String title, int value, Color color) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: title == 'Completed' ? Colors.green.withOpacity(0.1) : Colors.blue.withOpacity(0.1),
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

  Widget _buildRow(Map<String, dynamic> row) {
    final dt = DateTime.parse(row['scheduled_date_time']);
    final hh = dt.hour.toString().padLeft(2, '0');
    final mm = dt.minute.toString().padLeft(2, '0');
    final timeStr = '$hh:$mm';
    final name = row['medication_name']?.toString() ?? '';
    final dosage = row['dosage']?.toString() ?? '';
    final condition = row['condition_name']?.toString() ?? '';
    final status = row['status']?.toString() ?? 'SCHEDULED';
    final cColor = _conditionColor(condition);

    Color bg;
    Icon statusIcon;
    if (status == 'TAKEN') {
      bg = Colors.green.withOpacity(0.12);
      statusIcon = const Icon(Icons.check, color: Colors.green);
    } else if (status == 'MISSED') {
      bg = Colors.red.withOpacity(0.12);
      statusIcon = const Icon(Icons.close, color: Colors.red);
    } else {
      bg = Colors.white;
      statusIcon = Icon(Icons.access_time, color: Colors.grey.shade600);
    }

    return Container(
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(10),
        border: Border(
          left: BorderSide(color: cColor, width: 4),
        ),
      ),
      margin: const EdgeInsets.symmetric(horizontal: 0),
      padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 12),
      child: Row(
        children: [
          Expanded(child: Row(
            children: [
              const Icon(Icons.schedule, color: Colors.blue, size: 18),
              const SizedBox(width: 8),
              Text('$timeStr'),
            ],
          )),
          Expanded(child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  const Icon(Icons.medication, color: Colors.blue, size: 18),
                  const SizedBox(width: 8),
                  Expanded(child: Text(name, style: const TextStyle(fontWeight: FontWeight.w600))),
                ],
              ),
              const SizedBox(height: 2),
              Text(dosage, style: TextStyle(color: Colors.grey.shade600)),
            ],
          )),
          Expanded(child: Align(
            alignment: Alignment.centerLeft,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
              decoration: BoxDecoration(
                color: cColor.withOpacity(0.1),
                borderRadius: BorderRadius.circular(20),
              ),
              child: Text(condition, style: TextStyle(color: cColor, fontWeight: FontWeight.w600)),
            ),
          )),
          SizedBox(width: 60, child: Align(alignment: Alignment.centerRight, child: statusIcon)),
        ],
      ),
    );
  }

  Widget _legend() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text('Legend', style: TextStyle(fontWeight: FontWeight.bold)),
        const SizedBox(height: 8),
        Row(
          children: const [
            Icon(Icons.check, color: Colors.green, size: 18),
            SizedBox(width: 6),
            Text('Completed - Medication taken'),
          ],
        ),
        const SizedBox(height: 6),
        Row(
          children: [
            Icon(Icons.access_time, color: Colors.grey.shade600, size: 18),
            const SizedBox(width: 6),
            const Text('Pending - Not yet taken'),
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

  Widget _infoBanner() {
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
                  ? "This is today's schedule. Use the arrows to view future days."
                  : 'This is a future schedule. Medications will be marked as you take them.',
              style: TextStyle(color: isToday ? Colors.blue : Colors.purple),
            ),
          ),
        ],
      ),
    );
  }
}

