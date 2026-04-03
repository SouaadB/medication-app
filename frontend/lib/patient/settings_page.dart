import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/language_service.dart';

class SettingsPage extends StatefulWidget {
  const SettingsPage({super.key});

  @override
  State<SettingsPage> createState() => _SettingsPageState();
}

class _SettingsPageState extends State<SettingsPage> {
  bool _allNotifications = true;
  bool _medicationReminders = true;
  bool _adherenceAlerts = true;
  bool _smartInsights = true;
  bool _sound = true;
  bool _vibration = true;
  bool _darkMode = false;
  bool _autoRefill = true;

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
            child: const Icon(Icons.settings, color: Colors.white, size: 24),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              lang.translate('settings'),
              style: const TextStyle(
                fontSize: 28,
                fontWeight: FontWeight.bold,
                color: Color(0xFF1A237E),
              ),
            ),
            const SizedBox(height: 4),
            Text(
              lang.translate('customizeExperience'),
              style: TextStyle(
                fontSize: 16,
                color: Colors.grey.shade600,
              ),
            ),
            const SizedBox(height: 24),

            // Notifications Section
            _buildSectionHeader(Icons.notifications_none, lang.translate('notifications'), Colors.blue),
            _buildSettingsContainer([
              _buildSwitchTile(
                lang.translate('allNotifications'),
                lang.translate('enableAllNotifications'),
                _allNotifications,
                (v) => setState(() => _allNotifications = v),
              ),
              _buildSwitchTile(
                lang.translate('medicationReminders'),
                lang.translate('getReminded'),
                _medicationReminders,
                (v) => setState(() => _medicationReminders = v),
              ),
              _buildSwitchTile(
                lang.translate('adherenceAlerts'),
                lang.translate('trackProgress'),
                _adherenceAlerts,
                (v) => setState(() => _adherenceAlerts = v),
              ),
              _buildSwitchTile(
                lang.translate('smartInsightsLong'),
                lang.translate('aiPowered'),
                _smartInsights,
                (v) => setState(() => _smartInsights = v),
              ),
            ]),

            const SizedBox(height: 24),
            // Sound & Alerts Section
            _buildSectionHeader(Icons.volume_up_outlined, lang.translate('soundAlerts'), Colors.green),
            _buildSettingsContainer([
              _buildSwitchTile(
                lang.translate('sound'),
                lang.translate('playSound'),
                _sound,
                (v) => setState(() => _sound = v),
              ),
              _buildSwitchTile(
                lang.translate('vibration'),
                lang.translate('vibrateOnNotifications'),
                _vibration,
                (v) => setState(() => _vibration = v),
              ),
              _buildNavigationTile(
                lang.translate('quietHours'),
                lang.translate('quietHoursSubtitle'),
                Icons.access_time,
                () {},
              ),
            ]),

            const SizedBox(height: 24),
            // Appearance Section
            _buildSectionHeader(Icons.wb_sunny_outlined, lang.translate('appearance'), Colors.orange),
            _buildSettingsContainer([
              _buildSwitchTile(
                lang.translate('darkMode'),
                lang.translate('useDarkTheme'),
                _darkMode,
                (v) => setState(() => _darkMode = v),
              ),
              _buildNavigationTile(
                lang.translate('language'),
                lang.getCurrentLanguage() == 'en' ? 'English (US)' : 'Français (FR)',
                Icons.language,
                () {
                  // Re-use language selection logic
                },
              ),
            ]),

            const SizedBox(height: 24),
            // Medication Section
            _buildSectionHeader(Icons.medical_services_outlined, lang.translate('medication'), Colors.purple),
            _buildSettingsContainer([
              _buildSwitchTile(
                lang.translate('autoRefillReminders'),
                lang.translate('remindWhenLow'),
                _autoRefill,
                (v) => setState(() => _autoRefill = v),
              ),
              _buildNavigationTile(
                lang.translate('dailySchedule'),
                lang.translate('sleepWakeMeal'),
                Icons.calendar_today,
                () => Navigator.pushNamed(context, '/daily-schedule'),
              ),
              _buildNavigationTile(
                lang.translate('exportData'),
                null,
                Icons.file_download_outlined,
                () {},
              ),
            ]),

            const SizedBox(height: 24),
            // Support Section
            _buildSettingsContainer([
              _buildNavigationTile(lang.translate('helpSupport'), null, Icons.help_outline, () {}),
              _buildNavigationTile(lang.translate('privacyPolicy'), null, Icons.privacy_tip_outlined, () {}),
              _buildNavigationTile(lang.translate('termsOfService'), null, Icons.description_outlined, () {}),
              _buildNavigationTile(
                lang.translate('aboutMediCare'),
                lang.translate('version'),
                Icons.info_outline,
                () {},
              ),
            ]),

            const SizedBox(height: 24),
            // Danger Zone Section
            Text(
              lang.translate('dangerZone'),
              style: const TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: Colors.red,
              ),
            ),
            const SizedBox(height: 12),
            Container(
              decoration: BoxDecoration(
                color: Colors.red.withOpacity(0.05),
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: Colors.red.withOpacity(0.1)),
              ),
              child: _buildNavigationTile(
                lang.translate('deleteAccount'),
                lang.translate('permanentlyDelete'),
                Icons.delete_outline,
                () {},
                textColor: Colors.red,
                iconColor: Colors.red,
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
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: color.withOpacity(0.1),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Icon(icon, color: color, size: 20),
          ),
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

  Widget _buildSettingsContainer(List<Widget> children) {
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
      child: Column(children: children),
    );
  }

  Widget _buildSwitchTile(String title, String subtitle, bool value, ValueChanged<bool> onChanged) {
    return ListTile(
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
      contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 4),
    );
  }

  Widget _buildNavigationTile(String title, String? subtitle, IconData icon, VoidCallback onTap, {Color? textColor, Color? iconColor}) {
    return ListTile(
      leading: Icon(icon, color: iconColor ?? Colors.blue, size: 24),
      title: Text(
        title,
        style: TextStyle(
          fontWeight: FontWeight.bold,
          color: textColor ?? const Color(0xFF1A237E),
        ),
      ),
      subtitle: subtitle != null ? Text(subtitle, style: TextStyle(color: Colors.grey.shade600, fontSize: 12)) : null,
      trailing: const Icon(Icons.chevron_right, color: Colors.grey, size: 20),
      onTap: onTap,
      contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 4),
    );
  }
}
