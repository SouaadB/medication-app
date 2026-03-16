import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/language_service.dart';

class NotificationsPage extends StatelessWidget {
  const NotificationsPage({super.key});

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
            child: const Icon(Icons.notifications_none, color: Colors.white, size: 24),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      lang.translate('notifications'),
                      style: const TextStyle(
                        fontSize: 28,
                        fontWeight: FontWeight.bold,
                        color: Color(0xFF1A237E),
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      '2 ${lang.translate('unreadNotifications')}',
                      style: TextStyle(
                        fontSize: 16,
                        color: Colors.grey.shade600,
                      ),
                    ),
                  ],
                ),
                TextButton(
                  onPressed: () {},
                  child: Text(
                    lang.translate('markAllRead'),
                    style: const TextStyle(color: Colors.blue),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 24),
            _buildNotificationCard(
              context,
              lang,
              icon: Icons.access_time,
              iconColor: Colors.blue,
              title: lang.translate('medicationReminder'),
              subtitle: '${lang.translate('timeToTake')} Metformin 500mg',
              time: '10 ${lang.translate('minutesAgo')}',
              actionLabel: lang.translate('markAsTaken'),
              hasBorder: true,
            ),
            _buildNotificationCard(
              context,
              lang,
              icon: Icons.trending_up,
              iconColor: Colors.green,
              title: lang.translate('greatProgress'),
              subtitle: lang.translate('maintainedAdherence'),
              time: '2 ${lang.translate('hoursAgo')}',
              hasBorder: true,
            ),
            _buildNotificationCard(
              context,
              lang,
              icon: Icons.error_outline,
              iconColor: Colors.orange,
              title: lang.translate('smartInsight'),
              subtitle: lang.translate('bloodPressureInsight'),
              time: '5 ${lang.translate('hoursAgo')}',
            ),
            _buildNotificationCard(
              context,
              lang,
              icon: Icons.access_time,
              iconColor: Colors.blue,
              title: lang.translate('missedDose'),
              subtitle: lang.translate('missedLisinopril'),
              time: '6 ${lang.translate('hoursAgo')}',
              actionLabel: lang.translate('takeNow'),
            ),
            _buildNotificationCard(
              context,
              lang,
              icon: Icons.check_circle_outline,
              iconColor: Colors.purple,
              title: lang.translate('sevenDayStreak'),
              subtitle: lang.translate('takenOnTime'),
              time: '1 ${lang.translate('dayAgo')}',
            ),
            _buildNotificationCard(
              context,
              lang,
              icon: Icons.access_time,
              iconColor: Colors.blue,
              title: lang.translate('upcomingRefill'),
              subtitle: lang.translate('metforminSupply'),
              time: '1 ${lang.translate('dayAgo')}',
            ),
            _buildNotificationCard(
              context,
              lang,
              icon: Icons.error_outline,
              iconColor: Colors.orange,
              title: lang.translate('adherenceTip'),
              subtitle: lang.translate('setupSmartReminders'),
              time: '2 ${lang.translate('daysAgo')}',
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildNotificationCard(
    BuildContext context,
    LanguageService lang, {
    required IconData icon,
    required Color iconColor,
    required String title,
    required String subtitle,
    required String time,
    String? actionLabel,
    bool hasBorder = false,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: hasBorder ? Border.all(color: Colors.blue.withOpacity(0.5), width: 2) : null,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.03),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Stack(
        children: [
          Padding(
            padding: const EdgeInsets.all(20),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: iconColor.withOpacity(0.1),
                    shape: BoxShape.circle,
                  ),
                  child: Icon(icon, color: iconColor, size: 24),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        title,
                        style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFF1A237E),
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        subtitle,
                        style: TextStyle(
                          fontSize: 14,
                          color: Colors.grey.shade600,
                        ),
                      ),
                      const SizedBox(height: 12),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            time,
                            style: TextStyle(
                              fontSize: 12,
                              color: Colors.grey.shade400,
                            ),
                          ),
                          if (actionLabel != null)
                            Text(
                              actionLabel,
                              style: const TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.bold,
                                color: Colors.blue,
                              ),
                            ),
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          Positioned(
            top: 10,
            right: 10,
            child: Icon(Icons.close, color: Colors.grey.shade300, size: 18),
          ),
        ],
      ),
    );
  }
}
