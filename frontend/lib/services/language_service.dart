import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'translation_service.dart';

class LanguageService extends ChangeNotifier {
  static const String _localeKey = 'app_locale';
  Locale _locale = const Locale('en');

  LanguageService() {
    _loadSavedLanguage();
  }

  Locale get locale => _locale;

  Future<void> _loadSavedLanguage() async {
    final prefs = await SharedPreferences.getInstance();
    final languageCode = prefs.getString(_localeKey) ?? 'en';
    _locale = Locale(languageCode);
    notifyListeners();
  }

  Future<void> setLanguage(String languageCode) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_localeKey, languageCode);
    _locale = Locale(languageCode);
    notifyListeners();
  }

  String getCurrentLanguage() {
    return _locale.languageCode;
  }

  String translate(String key) {
    return TranslationService.translate(key, _locale.languageCode);
  }
}