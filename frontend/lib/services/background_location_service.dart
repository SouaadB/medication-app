import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:geolocator/geolocator.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:shared_preferences/shared_preferences.dart';

// ─────────────────────────────────────────────────────────────────────────────
// BACKGROUND LOCATION SERVICE
// Uses Android's built-in location permissions.
// True background tracking (app closed) requires a paid package like
// flutter_background_geolocation. This version tracks while app is open
// and restores tracking when the app is reopened.
// ─────────────────────────────────────────────────────────────────────────────
class BackgroundLocationService {
  static final BackgroundLocationService _instance = BackgroundLocationService._internal();
  factory BackgroundLocationService() => _instance;
  BackgroundLocationService._internal();

  static const String _prefTrackingKey = 'background_tracking_active';
  static const String _prefPatientKey  = 'background_tracking_patient_id';

  Future<void> initialize() async {
    if (kIsWeb) return;
    print('✅ Background Location Service ready');
  }

  Future<bool> requestPermissions() async {
    if (kIsWeb) return false;

    PermissionStatus loc = await Permission.location.status;
    if (!loc.isGranted) {
      loc = await Permission.location.request();
      if (!loc.isGranted) return false;
    }

    // Request background location — patient must tap "Allow all the time"
    PermissionStatus bg = await Permission.locationAlways.status;
    if (!bg.isGranted) {
      bg = await Permission.locationAlways.request();
      // Even if denied, foreground tracking still works
    }

    await Permission.notification.request();
    return true;
  }

  Future<bool> startTracking(int patientId) async {
    if (kIsWeb) return false;
    try {
      final hasPermissions = await requestPermissions();
      if (!hasPermissions) return false;

      final prefs = await SharedPreferences.getInstance();
      await prefs.setBool(_prefTrackingKey, true);
      await prefs.setInt(_prefPatientKey, patientId);

      print('✅ Location tracking preference saved for patient $patientId');
      return true;
    } catch (e) {
      print('❌ Failed to start tracking: $e');
      return false;
    }
  }

  Future<void> stopTracking() async {
    if (kIsWeb) return;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(_prefTrackingKey, false);
    print('🛑 Location tracking stopped');
  }

  Future<void> restoreTrackingIfNeeded() async {
    if (kIsWeb) return;
    // LocationService handles the actual tracking via Timer
    // This just checks if permission is still granted
    try {
      final isGranted = await Permission.location.isGranted;
      if (!isGranted) {
        final prefs = await SharedPreferences.getInstance();
        await prefs.setBool(_prefTrackingKey, false);
      }
    } catch (e) {
      print('restoreTrackingIfNeeded error: $e');
    }
  }

  Future<bool> isTracking() async {
    if (kIsWeb) return false;
    final prefs = await SharedPreferences.getInstance();
    return prefs.getBool(_prefTrackingKey) ?? false;
  }
}