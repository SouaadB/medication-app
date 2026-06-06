import 'dart:io';
import 'package:flutter/foundation.dart';

class ApiConfig {
  // Pour Windows (PC)
  static const String baseUrlWindows = 'http://localhost:5000/api';
  
  // Pour Android (émulateur)
  static const String baseUrlAndroidEmulator = 'http://10.0.2.2:5000/api';
  
  // Pour Android (vrai téléphone) - MIS À JOUR AVEC TON IP ACTUELLE
   static const String baseUrlAndroidPhone = 'http://192.168.1.6:5000/api';
  
  // Détection automatique de la plateforme
  static String get baseUrl {
    if (kIsWeb) {
      return 'http://localhost:5000/api';
    }
    
    if (Platform.isAndroid) {
      // Pour les émulateurs, l'adresse standard est 10.0.2.2
      // Mais Flutter ne peut pas facilement détecter si c'est un émulateur sans package additionnel
      // On utilise donc l'IP du réseau par défaut
      return baseUrlAndroidPhone;
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