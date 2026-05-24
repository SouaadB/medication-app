import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:http/http.dart' as http;
import 'translation_service.dart';
import '../config/api_config.dart';

class SettingsService extends ChangeNotifier {
  // Storage Keys
  static const String _localeKey = 'app_locale';
  static const String _darkModeKey = 'dark_mode';
  static const String _allNotificationsKey = 'all_notifications';
  static const String _medRemindersKey = 'med_reminders';
  static const String _adherenceAlertsKey = 'adherence_alerts';
  static const String _smartInsightsKey = 'smart_insights';
  static const String _soundKey = 'sound_enabled';
  static const String _vibrationKey = 'vibration_enabled';
  static const String _autoRefillKey = 'auto_refill_reminders';
  static const String _quietHoursEnabledKey = 'quiet_hours_enabled';
  static const String _quietHoursStartKey = 'quiet_hours_start';
  static const String _quietHoursEndKey = 'quiet_hours_end';
  static const String _quietHoursDaysKey = 'quiet_hours_days';
  static const String _criticalAlertsKey = 'critical_alerts_enabled';

  // Default Values
  Locale _locale = const Locale('en');
  bool _isDarkMode = false;
  bool _allNotifications = true;
  bool _medReminders = true;
  bool _adherenceAlerts = true;
  bool _smartInsights = true;
  bool _soundEnabled = true;
  bool _vibrationEnabled = true;
  bool _autoRefillReminders = true;
  
  // Quiet Hours Defaults
  bool _quietHoursEnabled = false;
  String _quietHoursStart = '22:00';
  String _quietHoursEnd = '07:00';
  List<String> _quietHoursDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  bool _criticalAlertsEnabled = true;

  SettingsService() {
    _loadSettings();
  }

  // Getters
  Locale get locale => _locale;
  bool get isDarkMode => false;
  bool get allNotifications => _allNotifications;
  bool get medReminders => _medReminders;
  bool get adherenceAlerts => _adherenceAlerts;
  bool get smartInsights => _smartInsights;
  bool get soundEnabled => _soundEnabled;
  bool get vibrationEnabled => _vibrationEnabled;
  bool get autoRefillReminders => _autoRefillReminders;
  
  // Quiet Hours Getters
  bool get quietHoursEnabled => _quietHoursEnabled;
  String get quietHoursStart => _quietHoursStart;
  String get quietHoursEnd => _quietHoursEnd;
  List<String> get quietHoursDays => _quietHoursDays;
  bool get criticalAlertsEnabled => _criticalAlertsEnabled;

  Future<void> _loadSettings() async {
    final prefs = await SharedPreferences.getInstance();
    
    _locale = Locale(prefs.getString(_localeKey) ?? 'en');
    _isDarkMode = prefs.getBool(_darkModeKey) ?? false;
    _allNotifications = prefs.getBool(_allNotificationsKey) ?? true;
    _medReminders = prefs.getBool(_medRemindersKey) ?? true;
    _adherenceAlerts = prefs.getBool(_adherenceAlertsKey) ?? true;
    _smartInsights = prefs.getBool(_smartInsightsKey) ?? true;
    _soundEnabled = prefs.getBool(_soundKey) ?? true;
    _vibrationEnabled = prefs.getBool(_vibrationKey) ?? true;
    _autoRefillReminders = prefs.getBool(_autoRefillKey) ?? true;
    
    // Load Quiet Hours
    _quietHoursEnabled = prefs.getBool(_quietHoursEnabledKey) ?? false;
    _quietHoursStart = prefs.getString(_quietHoursStartKey) ?? '22:00';
    _quietHoursEnd = prefs.getString(_quietHoursEndKey) ?? '07:00';
    _quietHoursDays = prefs.getStringList(_quietHoursDaysKey) ?? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    _criticalAlertsEnabled = prefs.getBool(_criticalAlertsKey) ?? true;
    
    notifyListeners();
  }

  Future<void> _syncToBackend(Map<String, dynamic> settings) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');
      if (token == null) return;

      final response = await http.put(
        Uri.parse('${ApiConfig.baseUrl}/profile/settings'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: jsonEncode(settings),
      );

      if (response.statusCode != 200) {
        debugPrint('Failed to sync settings: ${response.body}');
      }
    } catch (e) {
      debugPrint('Error syncing settings: $e');
    }
  }

  // Language
  Future<void> setLanguage(String languageCode) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_localeKey, languageCode);
    _locale = Locale(languageCode);
    notifyListeners();
  }

  String getCurrentLanguage() => _locale.languageCode;
  String translate(String key) => TranslationService.translate(key, _locale.languageCode);

  // Appearance
  Future<void> setDarkMode(bool value) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(_darkModeKey, value);
    _isDarkMode = value;
    notifyListeners();
    _syncToBackend({'dark_mode': value});
  }

  // Notifications
  Future<void> setAllNotifications(bool value) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(_allNotificationsKey, value);
    _allNotifications = value;
    
    Map<String, dynamic> updates = {'all_notifications': value};
    
    if (!value) {
      _medReminders = false;
      _adherenceAlerts = false;
      _smartInsights = false;
      updates.addAll({
        'medication_reminders': false,
        'adherence_alerts': false,
        'smart_insights': false
      });
    }
    
    notifyListeners();
    _syncToBackend(updates);
  }

  Future<void> setMedReminders(bool value) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(_medRemindersKey, value);
    _medReminders = value;
    if (value) _allNotifications = true;
    notifyListeners();
    _syncToBackend({'medication_reminders': value, 'all_notifications': _allNotifications});
  }

  Future<void> setAdherenceAlerts(bool value) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(_adherenceAlertsKey, value);
    _adherenceAlerts = value;
    if (value) _allNotifications = true;
    notifyListeners();
    _syncToBackend({'adherence_alerts': value, 'all_notifications': _allNotifications});
  }

  Future<void> setSmartInsights(bool value) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(_smartInsightsKey, value);
    _smartInsights = value;
    if (value) _allNotifications = true;
    notifyListeners();
    _syncToBackend({'smart_insights': value, 'all_notifications': _allNotifications});
  }

  // Sound & Alerts
  Future<void> setSoundEnabled(bool value) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(_soundKey, value);
    _soundEnabled = value;
    notifyListeners();
    _syncToBackend({'sound_enabled': value});
  }

  Future<void> setVibrationEnabled(bool value) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(_vibrationKey, value);
    _vibrationEnabled = value;
    notifyListeners();
    _syncToBackend({'vibration_enabled': value});
  }

  // Medication
  Future<void> setAutoRefillReminders(bool value) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(_autoRefillKey, value);
    _autoRefillReminders = value;
    notifyListeners();
    _syncToBackend({'auto_refill_reminders': value});
  }

  // Quiet Hours Setters
  Future<void> setQuietHoursEnabled(bool value) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(_quietHoursEnabledKey, value);
    _quietHoursEnabled = value;
    notifyListeners();
    _syncToBackend({'quiet_hours_enabled': value});
  }

  Future<void> setQuietHoursStart(String value) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_quietHoursStartKey, value);
    _quietHoursStart = value;
    notifyListeners();
    _syncToBackend({'quiet_hours_start': value});
  }

  Future<void> setQuietHoursEnd(String value) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_quietHoursEndKey, value);
    _quietHoursEnd = value;
    notifyListeners();
    _syncToBackend({'quiet_hours_end': value});
  }

  Future<void> setQuietHoursDays(List<String> value) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setStringList(_quietHoursDaysKey, value);
    _quietHoursDays = value;
    notifyListeners();
    _syncToBackend({'quiet_hours_days': jsonEncode(value)});
  }

  Future<void> setCriticalAlertsEnabled(bool value) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(_criticalAlertsKey, value);
    _criticalAlertsEnabled = value;
    notifyListeners();
    _syncToBackend({'critical_alerts_enabled': value});
  }

  Future<bool> deleteAccount() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');
      if (token == null) return false;

      final response = await http.delete(
        Uri.parse('${ApiConfig.baseUrl}/profile/account'),
        headers: {
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        await prefs.clear();
        return true;
      }
      return false;
    } catch (e) {
      debugPrint('Error deleting account: $e');
      return false;
    }
  }
}
