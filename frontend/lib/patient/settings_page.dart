import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/settings_service.dart';

class SettingsPage extends StatefulWidget {
  const SettingsPage({super.key});

  @override
  State<SettingsPage> createState() => _SettingsPageState();
}

class _SettingsPageState extends State<SettingsPage> {
  @override
  Widget build(BuildContext context) {
    final settings = Provider.of<SettingsService>(context);
    final isDark = settings.isDarkMode;
    final theme = Theme.of(context);
    final textColor = isDark ? Colors.white : const Color(0xFF1A237E);
    final subTextColor = isDark ? Colors.white70 : Colors.grey.shade600;

    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: Icon(Icons.arrow_back, color: textColor),
          onPressed: () => Navigator.pop(context),
        ),
        actions: [
          IconButton(
            icon: Icon(Icons.help_outline, color: Colors.blue.shade400),
            onPressed: () {},
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              settings.translate('settings'),
              style: TextStyle(
                fontSize: 28,
                fontWeight: FontWeight.bold,
                color: textColor,
              ),
            ),
            Text(
              isDark ? 'Personnalisez votre expérience' : 'Customize your app experience',
              style: TextStyle(fontSize: 14, color: subTextColor),
            ),
            const SizedBox(height: 30),

            // Notifications Section
            _buildSectionHeader(
              icon: Icons.notifications_none_outlined,
              title: settings.translate('notifications'),
              color: Colors.blue,
              isDark: isDark,
            ),
            _buildSettingCard(
              children: [
                _buildSwitchTile(
                  title: 'All Notifications',
                  subtitle: 'Enable all notifications',
                  value: settings.allNotifications,
                  onChanged: (v) => settings.setAllNotifications(v),
                  isDark: isDark,
                ),
                _buildSwitchTile(
                  title: 'Medication Reminders',
                  subtitle: 'Get reminded to take meds',
                  value: settings.medReminders,
                  onChanged: settings.allNotifications ? (v) => settings.setMedReminders(v) : null,
                  isDark: isDark,
                ),
                _buildSwitchTile(
                  title: 'Adherence Alerts',
                  subtitle: 'Track your progress',
                  value: settings.adherenceAlerts,
                  onChanged: settings.allNotifications ? (v) => settings.setAdherenceAlerts(v) : null,
                  isDark: isDark,
                ),
                _buildSwitchTile(
                  title: 'Smart Insights',
                  subtitle: 'AI-powered recommendations',
                  value: settings.smartInsights,
                  onChanged: settings.allNotifications ? (v) => settings.setSmartInsights(v) : null,
                  isDark: isDark,
                ),
              ],
              isDark: isDark,
            ),

            const SizedBox(height: 24),

            // Sound & Alerts Section
            _buildSectionHeader(
              icon: Icons.volume_up_outlined,
              title: 'Sound & Alerts',
              color: Colors.green,
              isDark: isDark,
            ),
            _buildSettingCard(
              children: [
                _buildSwitchTile(
                  title: 'Sound',
                  subtitle: 'Play notification sounds',
                  value: settings.soundEnabled,
                  onChanged: (v) => settings.setSoundEnabled(v),
                  isDark: isDark,
                ),
                _buildSwitchTile(
                  title: 'Vibration',
                  subtitle: 'Vibrate on notifications',
                  value: settings.vibrationEnabled,
                  onChanged: (v) => settings.setVibrationEnabled(v),
                  isDark: isDark,
                ),
                _buildNavigationTile(
                  icon: Icons.access_time,
                  title: 'Quiet Hours',
                  subtitle: '${settings.quietHoursStart} - ${settings.quietHoursEnd}',
                  onTap: () => Navigator.pushNamed(context, '/quiet-hours'),
                  isDark: isDark,
                ),
              ],
              isDark: isDark,
            ),

            const SizedBox(height: 24),

            // Appearance Section
            _buildSectionHeader(
              icon: Icons.wb_sunny_outlined,
              title: 'Appearance',
              color: Colors.orange,
              isDark: isDark,
            ),
            _buildSettingCard(
              children: [
                _buildSwitchTile(
                  title: 'Dark Mode',
                  subtitle: 'Use dark theme',
                  value: settings.isDarkMode,
                  onChanged: (v) => settings.setDarkMode(v),
                  isDark: isDark,
                ),
                _buildNavigationTile(
                  icon: Icons.language,
                  title: settings.translate('language'),
                  subtitle: settings.getCurrentLanguage() == 'en' ? 'English (US)' : 'Français',
                  onTap: () => _showLanguageDialog(context, settings),
                  isDark: isDark,
                ),
              ],
              isDark: isDark,
            ),

            const SizedBox(height: 24),

            // Medication Section
            _buildSectionHeader(
              icon: Icons.medical_services_outlined,
              title: 'Medication',
              color: Colors.purple,
              isDark: isDark,
            ),
            _buildSettingCard(
              children: [
                _buildSwitchTile(
                  title: 'Auto-Refill Reminders',
                  subtitle: 'Remind when supply is low',
                  value: settings.autoRefillReminders,
                  onChanged: (v) => settings.setAutoRefillReminders(v),
                  isDark: isDark,
                ),
                _buildNavigationTile(
                  icon: Icons.calendar_today_outlined,
                  title: 'Daily Schedule',
                  subtitle: 'Sleep, wake & meal times',
                  onTap: () => Navigator.pushNamed(context, '/daily-schedule'),
                  isDark: isDark,
                ),
                _buildNavigationTile(
                  icon: Icons.file_download_outlined,
                  title: 'Export Data',
                  onTap: () {},
                  isDark: isDark,
                ),
              ],
              isDark: isDark,
            ),

            const SizedBox(height: 24),

            // Family & Care Section
            _buildSectionHeader(
              icon: Icons.people_outline,
              title: 'Family & Care',
              color: Colors.teal,
              isDark: isDark,
            ),
            _buildSettingCard(
              children: [
                _buildNavigationTile(
                  icon: Icons.shield_outlined,
                  title: 'Caregiver Access',
                  subtitle: 'Manage who can monitor you',
                  onTap: () => Navigator.pushNamed(context, '/caregiver-access'),
                  isDark: isDark,
                ),
              ],
              isDark: isDark,
            ),

            const SizedBox(height: 24),

            // Support Section
            _buildSettingCard(
              children: [
                _buildNavigationTile(
                  icon: Icons.help_outline,
                  title: 'Help & Support',
                  onTap: () {},
                  isDark: isDark,
                ),
                _buildNavigationTile(
                  icon: Icons.lock_outline,
                  title: 'Privacy Policy',
                  onTap: () {},
                  isDark: isDark,
                ),
                _buildNavigationTile(
                  icon: Icons.description_outlined,
                  title: 'Terms of Service',
                  onTap: () {},
                  isDark: isDark,
                ),
                _buildNavigationTile(
                  icon: Icons.info_outline,
                  title: 'About MediCare',
                  subtitle: 'Version 1.0.0',
                  onTap: () {},
                  isDark: isDark,
                ),
              ],
              isDark: isDark,
            ),

            const SizedBox(height: 24),

            // Danger Zone
            Container(
              decoration: BoxDecoration(
                color: isDark ? Colors.red.withOpacity(0.1) : Colors.red.shade50,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: Colors.red.shade200.withOpacity(0.5)),
              ),
              child: ListTile(
                leading: Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: Colors.red.shade100,
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(Icons.delete_outline, color: Colors.red),
                ),
                title: const Text(
                  'Delete Account',
                  style: TextStyle(color: Colors.red, fontWeight: FontWeight.bold),
                ),
                subtitle: const Text(
                  'Permanently delete your data',
                  style: TextStyle(color: Colors.red, fontSize: 12),
                ),
                trailing: const Icon(Icons.chevron_right, color: Colors.red),
                onTap: () async {
                  final confirm = await showDialog<bool>(
                    context: context,
                    builder: (context) => AlertDialog(
                      title: const Text('Delete Account', style: TextStyle(color: Colors.red)),
                      content: const Text('Are you sure you want to permanently delete your account? This action cannot be undone.'),
                      actions: [
                        TextButton(onPressed: () => Navigator.pop(context, false), child: const Text('Cancel')),
                        TextButton(
                          onPressed: () => Navigator.pop(context, true),
                          child: const Text('Delete', style: TextStyle(color: Colors.red)),
                        ),
                      ],
                    ),
                  );
                  if (confirm == true) {
                    final success = await settings.deleteAccount();
                    if (success && mounted) {
                      Navigator.pushNamedAndRemoveUntil(context, '/signin', (route) => false);
                    }
                  }
                },
              ),
            ),
            const SizedBox(height: 40),
          ],
        ),
      ),
    );
  }

  Widget _buildSectionHeader({
    required IconData icon,
    required String title,
    required Color color,
    required bool isDark,
  }) {
    return Padding(
      padding: const EdgeInsets.only(left: 4, bottom: 12),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: color.withOpacity(0.1),
              shape: BoxShape.circle,
            ),
            child: Icon(icon, color: color, size: 20),
          ),
          const SizedBox(width: 12),
          Text(
            title,
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: isDark ? Colors.white : const Color(0xFF1A237E),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSettingCard({required List<Widget> children, required bool isDark}) {
    return Container(
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
      child: Column(children: children),
    );
  }

  Widget _buildSwitchTile({
    required String title,
    String? subtitle,
    required bool value,
    required ValueChanged<bool>? onChanged,
    required bool isDark,
  }) {
    return ListTile(
      title: Text(
        title,
        style: TextStyle(
          fontSize: 15,
          fontWeight: FontWeight.w500,
          color: isDark ? Colors.white : const Color(0xFF1A237E),
        ),
      ),
      subtitle: subtitle != null
          ? Text(
              subtitle,
              style: TextStyle(fontSize: 12, color: isDark ? Colors.white70 : Colors.grey.shade600),
            )
          : null,
      trailing: Switch.adaptive(
        value: value,
        onChanged: onChanged,
        activeColor: Colors.blue,
      ),
    );
  }

  Widget _buildNavigationTile({
    IconData? icon,
    required String title,
    String? subtitle,
    required VoidCallback onTap,
    required bool isDark,
  }) {
    return ListTile(
      leading: icon != null ? Icon(icon, color: isDark ? Colors.white70 : Colors.grey.shade400, size: 22) : null,
      title: Text(
        title,
        style: TextStyle(
          fontSize: 15,
          fontWeight: FontWeight.w500,
          color: isDark ? Colors.white : const Color(0xFF1A237E),
        ),
      ),
      subtitle: subtitle != null
          ? Text(
              subtitle,
              style: TextStyle(fontSize: 12, color: isDark ? Colors.white70 : Colors.grey.shade600),
            )
          : null,
      trailing: Icon(Icons.chevron_right, color: Colors.grey.shade400, size: 20),
      onTap: onTap,
    );
  }

  Future<void> _showLanguageDialog(BuildContext context, SettingsService settings) async {
    final currentLang = settings.getCurrentLanguage();
    
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          backgroundColor: settings.isDarkMode ? const Color(0xFF1E1E1E) : Colors.white,
          title: Text(
            settings.translate('language'),
            style: const TextStyle(color: Colors.blue, fontWeight: FontWeight.bold),
          ),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              ListTile(
                title: Text('English', style: TextStyle(color: settings.isDarkMode ? Colors.white : Colors.black)),
                leading: Radio<String>(
                  value: 'en',
                  groupValue: currentLang,
                  onChanged: (String? value) {
                    Navigator.pop(context);
                    settings.setLanguage('en');
                  },
                ),
              ),
              ListTile(
                title: Text('Français', style: TextStyle(color: settings.isDarkMode ? Colors.white : Colors.black)),
                leading: Radio<String>(
                  value: 'fr',
                  groupValue: currentLang,
                  onChanged: (String? value) {
                    Navigator.pop(context);
                    settings.setLanguage('fr');
                  },
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}
