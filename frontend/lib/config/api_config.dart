import 'dart:io';
import 'package:flutter/foundation.dart';

class ApiConfig {
  // Pour Windows (PC)
  static const String baseUrlWindows = 'http://localhost:5000/api';
  
  // Pour Android (émulateur)
  static const String baseUrlAndroidEmulator = 'http://10.0.2.2:5000/api';
  
  // Pour Android (vrai téléphone) - REMPLACE PAR TON IP
  static const String baseUrlAndroidPhone = 'http://192.168.26.155:5000/api';
  
  // Détection automatique de la plateforme
  static String get baseUrl {
    if (kIsWeb) {
      return 'http://localhost:5000/api';
    }
    
    if (Platform.isAndroid) {
      // Détecter si c'est un émulateur ou un vrai téléphone
      // Par défaut, on utilise l'IP du PC
      return baseUrlAndroidPhone; // Change ici si besoin
    }
    
    if (Platform.isWindows) {
      return baseUrlWindows;
    }
    
    // Par défaut
    return 'http://localhost:5000/api';
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