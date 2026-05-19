import 'package:permission_handler/permission_handler.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:flutter/foundation.dart' show kIsWeb;

class BackgroundLocationService {
  static final BackgroundLocationService _instance = BackgroundLocationService._internal();
  factory BackgroundLocationService() => _instance;
  BackgroundLocationService._internal();
  
  // Initialize
  Future<void> initialize() async {
    if (kIsWeb) return;
    print('✅ Background Location Service ready');
  }
  
  // Request permissions
  Future<bool> requestPermissions() async {
    if (kIsWeb) return false;
    
    // Request location permission
    PermissionStatus locationPermission = await Permission.location.request();
    if (!locationPermission.isGranted) {
      locationPermission = await Permission.location.request();
    }
    
    // Request background location permission (Android only)
    PermissionStatus backgroundPermission = await Permission.locationAlways.request();
    
    // Request notification permission
    await Permission.notification.request();
    
    bool locationGranted = locationPermission.isGranted;
    bool backgroundGranted = backgroundPermission.isGranted;
    
    print('📍 Permissions - Location: $locationGranted, Background: $backgroundGranted');
    
    return locationGranted && backgroundGranted;
  }
  
  // Start tracking (just saves preference - actual tracking is done by LocationService)
  Future<bool> startTracking(int patientId) async {
    if (kIsWeb) {
      print('⚠️ Background tracking not supported on web');
      return false;
    }
    
    try {
      // Request permissions
      bool hasPermissions = await requestPermissions();
      if (!hasPermissions) {
        print('❌ Cannot start tracking: insufficient permissions');
        return false;
      }
      
      // Get auth token
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');
      
      if (token == null) {
        print('❌ No auth token available');
        return false;
      }
      
      // Save preference (actual tracking is done by LocationService when app is open)
      await prefs.setBool('background_tracking_enabled', true);
      await prefs.setInt('tracking_patient_id', patientId);
      
      print('✅ Tracking preference saved for patient $patientId');
      return true;
      
    } catch (e) {
      print('❌ Failed to save tracking preference: $e');
      return false;
    }
  }
  
  // Stop tracking
  Future<void> stopTracking() async {
    if (kIsWeb) return;
    
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool('background_tracking_enabled', false);
    await prefs.remove('tracking_patient_id');
    
    print('🛑 Tracking preference disabled');
  }
  
  // Check if tracking is active
  Future<bool> isTracking() async {
    if (kIsWeb) return false;
    
    final prefs = await SharedPreferences.getInstance();
    return prefs.getBool('background_tracking_enabled') ?? false;
  }
  
  // Update auth token
  Future<void> updateAuthToken(String newToken) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('auth_token', newToken);
  }
  
  // Restore tracking on app restart
  Future<void> restoreTrackingIfNeeded() async {
    // Just log that it's restored - actual tracking happens when app opens
    final prefs = await SharedPreferences.getInstance();
    final wasEnabled = prefs.getBool('background_tracking_enabled') ?? false;
    final patientId = prefs.getInt('tracking_patient_id');
    
    if (wasEnabled && patientId != null) {
      print('🔄 Tracking preference restored for patient $patientId');
      // Note: Actual location tracking will resume when the app is opened
    }
  }
}