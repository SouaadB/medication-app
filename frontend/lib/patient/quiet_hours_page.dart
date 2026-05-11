import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/settings_service.dart';

class QuietHoursPage extends StatefulWidget {
  const QuietHoursPage({super.key});

  @override
  State<QuietHoursPage> createState() => _QuietHoursPageState();
}

class _QuietHoursPageState extends State<QuietHoursPage> {
  final List<String> _allDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  @override
  Widget build(BuildContext context) {
    final settings = Provider.of<SettingsService>(context);
    final isDark = settings.isDarkMode;
    final textColor = isDark ? Colors.white : const Color(0xFF1A237E);
    final subTextColor = isDark ? Colors.white70 : Colors.grey.shade600;

    return Scaffold(
      backgroundColor: isDark ? const Color(0xFF121212) : const Color(0xFFF8F9FE),
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: Icon(Icons.arrow_back, color: textColor),
          onPressed: () => Navigator.pop(context),
        ),
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 16),
            child: CircleAvatar(
              backgroundColor: Colors.purple.shade100,
              radius: 18,
              child: const Icon(Icons.access_time, color: Colors.purple, size: 20),
            ),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Quiet Hours',
              style: TextStyle(
                fontSize: 28,
                fontWeight: FontWeight.bold,
                color: textColor,
              ),
            ),
            Text(
              'Customize your notification schedule',
              style: TextStyle(fontSize: 14, color: subTextColor),
            ),
            const SizedBox(height: 30),

            // Enable Quiet Hours Card
            _buildCard(
              isDark: isDark,
              child: Column(
                children: [
                  SwitchListTile.adaptive(
                    value: settings.quietHoursEnabled,
                    onChanged: (v) => settings.setQuietHoursEnabled(v),
                    title: Row(
                      children: [
                        Icon(Icons.nightlight_outlined, color: Colors.purple.shade300),
                        const SizedBox(width: 12),
                        Text(
                          'Enable Quiet Hours',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w600,
                            color: textColor,
                          ),
                        ),
                      ],
                    ),
                    subtitle: Padding(
                      padding: const EdgeInsets.only(left: 32),
                      child: Text(
                        settings.quietHoursEnabled ? 'Active' : 'Inactive',
                        style: TextStyle(color: settings.quietHoursEnabled ? Colors.green : Colors.grey),
                      ),
                    ),
                    activeColor: Colors.purple,
                  ),
                ],
              ),
            ),

            const SizedBox(height: 16),

            // Info Banner
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.purple.shade50.withOpacity(isDark ? 0.1 : 1),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: Colors.purple.shade100.withOpacity(0.5)),
              ),
              child: Row(
                children: [
                  const Text('🌙', style: TextStyle(fontSize: 18)),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Text(
                      'Notifications will be silenced during quiet hours to help you rest.',
                      style: TextStyle(
                        fontSize: 13,
                        color: isDark ? Colors.purple.shade100 : Colors.purple.shade700,
                      ),
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 24),

            // Time Range Section
            Text(
              'Time Range',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: textColor,
              ),
            ),
            const SizedBox(height: 16),
            _buildTimePicker(
              label: 'Start Time',
              time: settings.quietHoursStart,
              icon: Icons.wb_sunny_outlined,
              iconColor: Colors.orange,
              isDark: isDark,
              onTap: () => _selectTime(context, settings, true),
            ),
            const SizedBox(height: 12),
            _buildTimePicker(
              label: 'End Time',
              time: settings.quietHoursEnd,
              icon: Icons.nightlight_outlined,
              iconColor: Colors.purple,
              isDark: isDark,
              onTap: () => _selectTime(context, settings, false),
            ),
            
            const SizedBox(height: 16),
            Center(
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 8),
                decoration: BoxDecoration(
                  color: isDark ? Colors.grey.shade900 : Colors.white,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: Colors.grey.shade200.withOpacity(0.5)),
                ),
                child: Text(
                  'Quiet hours: ${settings.quietHoursStart} - ${settings.quietHoursEnd}',
                  style: TextStyle(fontSize: 13, color: subTextColor),
                ),
              ),
            ),

            const SizedBox(height: 24),

            // Active Days Section
            Text(
              'Active Days',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: textColor,
              ),
            ),
            const SizedBox(height: 16),
            _buildCard(
              isDark: isDark,
              padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 8),
              child: Column(
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    children: _allDays.map((day) {
                      final isSelected = settings.quietHoursDays.contains(day);
                      return GestureDetector(
                        onTap: () {
                          final newDays = List<String>.from(settings.quietHoursDays);
                          if (isSelected) {
                            if (newDays.length > 1) newDays.remove(day);
                          } else {
                            newDays.add(day);
                          }
                          settings.setQuietHoursDays(newDays);
                        },
                        child: Container(
                          width: 40,
                          height: 40,
                          decoration: BoxDecoration(
                            color: isSelected ? Colors.purple : Colors.transparent,
                            shape: BoxShape.circle,
                            border: Border.all(
                              color: isSelected ? Colors.purple : Colors.purple.shade200,
                              width: 1.5,
                            ),
                          ),
                          child: Center(
                            child: Text(
                              day.substring(0, 1),
                              style: TextStyle(
                                color: isSelected ? Colors.white : Colors.purple,
                                fontWeight: FontWeight.bold,
                                fontSize: 13,
                              ),
                            ),
                          ),
                        ),
                      );
                    }).toList(),
                  ),
                  const SizedBox(height: 12),
                  Text(
                    settings.quietHoursDays.length == 7 ? 'Active every day' : 'Active on selected days',
                    style: TextStyle(fontSize: 12, color: subTextColor),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 24),

            // Critical Alerts Section
            _buildCard(
              isDark: isDark,
              child: Column(
                children: [
                  SwitchListTile.adaptive(
                    value: settings.criticalAlertsEnabled,
                    onChanged: (v) => settings.setCriticalAlertsEnabled(v),
                    title: Row(
                      children: [
                        Icon(Icons.notifications_active_outlined, color: Colors.red.shade300),
                        const SizedBox(width: 12),
                        Text(
                          'Critical Alerts',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w600,
                            color: textColor,
                          ),
                        ),
                      ],
                    ),
                    subtitle: const Padding(
                      padding: const EdgeInsets.only(left: 32),
                      child: Text('Allow urgent medication reminders', style: TextStyle(fontSize: 12)),
                    ),
                    activeColor: Colors.red,
                  ),
                  Container(
                    margin: const EdgeInsets.all(12),
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: Colors.red.shade50.withOpacity(isDark ? 0.1 : 1),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Text(
                      'Critical medication reminders will still notify you during quiet hours for your safety.',
                      style: TextStyle(fontSize: 11, color: isDark ? Colors.red.shade200 : Colors.red.shade700),
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 24),

            // Schedule Preview Section
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [Colors.purple.shade400, Colors.purple.shade600],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(20),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      const Icon(Icons.calendar_today, color: Colors.white, size: 20),
                      const SizedBox(width: 10),
                      const Text(
                        'Schedule Preview',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 20),
                  _buildPreviewRow('Notifications Silenced', '${settings.quietHoursStart} - ${settings.quietHoursEnd}'),
                  const SizedBox(height: 12),
                  _buildPreviewRow('Active On', settings.quietHoursDays.join(', ')),
                ],
              ),
            ),

            const SizedBox(height: 30),

            // Save Button
            SizedBox(
              width: double.infinity,
              height: 55,
              child: ElevatedButton(
                onPressed: () => Navigator.pop(context),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.purple,
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(30),
                  ),
                  elevation: 2,
                ),
                child: const Text(
                  'Save Settings',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                ),
              ),
            ),
            const SizedBox(height: 40),
          ],
        ),
      ),
    );
  }

  Widget _buildCard({required Widget child, required bool isDark, EdgeInsets? padding}) {
    return Container(
      padding: padding,
      decoration: BoxDecoration(
        color: isDark ? const Color(0xFF1E1E1E) : Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          if (!isDark)
            BoxShadow(
              color: Colors.black.withOpacity(0.05),
              blurRadius: 10,
              offset: const Offset(0, 4),
            ),
        ],
      ),
      child: child,
    );
  }

  Widget _buildTimePicker({
    required String label,
    required String time,
    required IconData icon,
    required Color iconColor,
    required bool isDark,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: isDark ? const Color(0xFF1E1E1E) : Colors.orange.shade50.withOpacity(label.contains('Start') ? 0.3 : 0),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: label.contains('Start') ? Colors.orange.shade100 : Colors.purple.shade100,
            width: 1,
          ),
          gradient: label.contains('End') 
            ? LinearGradient(colors: [Colors.purple.shade50.withOpacity(0.1), Colors.purple.shade50.withOpacity(0.3)])
            : null,
        ),
        child: Row(
          children: [
            Icon(icon, color: iconColor),
            const SizedBox(width: 12),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(label, style: TextStyle(fontSize: 12, color: Colors.grey.shade600)),
                Text(
                  time,
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    color: isDark ? Colors.white : const Color(0xFF1A237E),
                  ),
                ),
              ],
            ),
            const Spacer(),
            Icon(Icons.access_time, color: Colors.grey.shade400, size: 20),
          ],
        ),
      ),
    );
  }

  Widget _buildPreviewRow(String label, String value) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: TextStyle(fontSize: 11, color: Colors.grey.shade400)),
          const SizedBox(height: 2),
          Text(
            value,
            style: const TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w600,
              color: Colors.black87,
            ),
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
        ],
      ),
    );
  }

  Future<void> _selectTime(BuildContext context, SettingsService settings, bool isStart) async {
    final currentTime = isStart ? settings.quietHoursStart : settings.quietHoursEnd;
    final parts = currentTime.split(':');
    final initialTime = TimeOfDay(hour: int.parse(parts[0]), minute: int.parse(parts[1]));

    final TimeOfDay? picked = await showTimePicker(
      context: context,
      initialTime: initialTime,
      builder: (context, child) {
        return Theme(
          data: ThemeData.light().copyWith(
            colorScheme: const ColorScheme.light(primary: Colors.purple),
          ),
          child: child!,
        );
      },
    );

    if (picked != null) {
      final formattedTime = '${picked.hour.toString().padLeft(2, '0')}:${picked.minute.toString().padLeft(2, '0')}';
      if (isStart) {
        settings.setQuietHoursStart(formattedTime);
      } else {
        settings.setQuietHoursEnd(formattedTime);
      }
    }
  }
}
