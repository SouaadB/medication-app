import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/language_service.dart';

class DailySchedulePage extends StatefulWidget {
  const DailySchedulePage({super.key});

  @override
  State<DailySchedulePage> createState() => _DailySchedulePageState();
}

class _DailySchedulePageState extends State<DailySchedulePage> {
  bool _smartScheduling = true;
  TimeOfDay _bedtime = const TimeOfDay(hour: 23, minute: 0);
  TimeOfDay _wakeTime = const TimeOfDay(hour: 7, minute: 0);
  TimeOfDay _breakfast = const TimeOfDay(hour: 8, minute: 0);
  TimeOfDay _lunch = const TimeOfDay(hour: 12, minute: 30);
  TimeOfDay _dinner = const TimeOfDay(hour: 18, minute: 30);

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
            decoration: const BoxDecoration(
              color: Color(0xFF3498DB),
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.access_time, color: Colors.white, size: 24),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              lang.translate('dailySchedule'),
              style: const TextStyle(
                fontSize: 28,
                fontWeight: FontWeight.bold,
                color: Color(0xFF1A237E),
              ),
            ),
            const SizedBox(height: 4),
            Text(
              lang.translate('setRoutine'),
              style: TextStyle(
                fontSize: 16,
                color: Colors.grey.shade600,
              ),
            ),
            const SizedBox(height: 24),

            // Smart Scheduling Switch
            _buildContainer(
              child: _buildSwitchTile(
                lang.translate('enableSmartScheduling'),
                lang.translate('active'),
                _smartScheduling,
                (v) => setState(() => _smartScheduling = v),
                icon: Icons.access_time,
              ),
            ),
            
            const SizedBox(height: 16),
            // Info Box
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.blue.withOpacity(0.05),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: Colors.blue.withOpacity(0.1)),
              ),
              child: Row(
                children: [
                  const Icon(Icons.lightbulb_outline, color: Colors.blue, size: 24),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Text(
                      lang.translate('smartSchedulingInfo'),
                      style: const TextStyle(color: Colors.blue, fontSize: 13),
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 24),
            // Sleep Schedule
            _buildSectionHeader(Icons.bed_outlined, lang.translate('sleepSchedule'), Colors.purple),
            _buildContainer(
              child: Column(
                children: [
                  _buildTimeTile(lang.translate('bedtime'), _bedtime, (t) => setState(() => _bedtime = t), Icons.nightlight_outlined, Colors.purple),
                  _buildTimeTile(lang.translate('wakeUpTime'), _wakeTime, (t) => setState(() => _wakeTime = t), Icons.wb_sunny_outlined, Colors.orange),
                  const Divider(height: 1),
                  Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          '${lang.translate('activeHours')}: ',
                          style: TextStyle(color: Colors.grey.shade600),
                        ),
                        Text(
                          '16 ${lang.translate('hoursPerDay')}',
                          style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.blue),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 24),
            // Meal Times
            _buildSectionHeader(Icons.restaurant_outlined, lang.translate('mealTimes'), Colors.green),
            _buildContainer(
              child: Column(
                children: [
                  _buildTimeTile(lang.translate('breakfast'), _breakfast, (t) => setState(() => _breakfast = t), Icons.coffee_outlined, Colors.orange),
                  _buildTimeTile(lang.translate('lunch'), _lunch, (t) => setState(() => _lunch = t), Icons.lunch_dining_outlined, Colors.green),
                  _buildTimeTile(lang.translate('dinner'), _dinner, (t) => setState(() => _dinner = t), Icons.dinner_dining_outlined, Colors.red),
                ],
              ),
            ),

            const SizedBox(height: 24),
            // Daily Routine Summary
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: const Color(0xFF3498DB),
                borderRadius: BorderRadius.circular(24),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      const Icon(Icons.access_time, color: Colors.white, size: 24),
                      const SizedBox(width: 12),
                      Text(
                        lang.translate('yourDailyRoutine'),
                        style: const TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  Container(
                    width: double.infinity,
                    height: 50,
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Center(
                      child: Text(
                        'Sleep Schedule',
                        style: TextStyle(color: Colors.blue.shade200),
                      ),
                    ),
                  ),
                  const SizedBox(height: 12),
                  Container(
                    width: double.infinity,
                    height: 50,
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Center(
                      child: Text(
                        'Meals',
                        style: TextStyle(color: Colors.blue.shade200),
                      ),
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 24),
            // How it works
            _buildContainer(
              child: Padding(
                padding: const EdgeInsets.all(20.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        const Icon(Icons.track_changes, color: Colors.red, size: 24),
                        const SizedBox(width: 12),
                        Text(
                          lang.translate('howSmartSchedulingWorks'),
                          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    _buildBulletPoint(lang.translate('medicationRemindersScheduledAroundMeals')),
                    _buildBulletPoint(lang.translate('noNotificationsDuringSleep')),
                    _buildBulletPoint(lang.translate('remindersOptimized')),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 32),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () => Navigator.pop(context),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF3498DB),
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(50)),
                ),
                child: Text(lang.translate('saveSchedule'), style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
              ),
            ),
            const SizedBox(height: 40),
          ],
        ),
      ),
    );
  }

  Widget _buildSectionHeader(IconData icon, String title, Color color) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        children: [
          Icon(icon, color: color, size: 20),
          const SizedBox(width: 12),
          Text(
            title,
            style: const TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: Color(0xFF1A237E),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildContainer({required Widget child}) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.03),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
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
      title: Text(
        title,
        style: const TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF1A237E)),
      ),
      subtitle: Text(subtitle, style: TextStyle(color: Colors.grey.shade600, fontSize: 12)),
      trailing: Switch(
        value: value,
        onChanged: onChanged,
        activeColor: Colors.blue,
      ),
      contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
    );
  }

  Widget _buildTimeTile(String title, TimeOfDay time, Function(TimeOfDay) onTimeChanged, IconData icon, Color iconColor) {
    return ListTile(
      title: Text(title, style: TextStyle(color: Colors.grey.shade600, fontSize: 14)),
      trailing: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        decoration: BoxDecoration(
          color: iconColor.withOpacity(0.05),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: iconColor.withOpacity(0.1)),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon, color: iconColor, size: 20),
            const SizedBox(width: 12),
            Text(
              time.format(context),
              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
            ),
            const SizedBox(width: 12),
            const Icon(Icons.access_time, color: Colors.grey, size: 20),
          ],
        ),
      ),
      onTap: () async {
        final TimeOfDay? picked = await showTimePicker(
          context: context,
          initialTime: time,
        );
        if (picked != null) onTimeChanged(picked);
      },
      contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
    );
  }

  Widget _buildBulletPoint(String text) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('• ', style: TextStyle(color: Colors.blue, fontWeight: FontWeight.bold, fontSize: 18)),
          Expanded(
            child: Text(
              text,
              style: TextStyle(color: Colors.grey.shade600, fontSize: 13),
            ),
          ),
        ],
      ),
    );
  }
}
