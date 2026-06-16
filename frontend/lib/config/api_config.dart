import 'dart:io';
import 'package:flutter/foundation.dart';

class ApiConfig {
  // Production backend (Render)
  static const String _prodUrl = 'https://medicare-backend-7kkp.onrender.com/api';

  // Local development (Windows only)
  static const String _localUrl = 'http://localhost:5000/api';

  // Détection automatique de la plateforme
  static String get baseUrl {
    if (kIsWeb) {
      return _prodUrl;
    }

    if (Platform.isAndroid) {
      return _prodUrl;
    }

    if (Platform.isWindows) {
      return _localUrl;
    }

    return _prodUrl;
  }
  
  // Headers par défaut
  static Map<String, String> get headers => {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
  
  // Headers avec token
  static Map<String, String> getAuthHeaders(String token) => {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': 'Bearer $token',
  };
}