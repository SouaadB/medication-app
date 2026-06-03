import 'dart:async';
import 'package:geolocator/geolocator.dart';
import 'package:geocoding/geocoding.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';
import '../config/api_config.dart';

class LocationService {
  static final LocationService _instance = LocationService._internal();
  factory LocationService() => _instance;
  LocationService._internal();
  
  Timer? _locationTimer;
  bool _isTracking = false;
  
  Future<bool> requestPermissions() async {
    LocationPermission permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
      if (permission == LocationPermission.denied) {
        return false;
      }
    }
    if (permission == LocationPermission.deniedForever) {
      return false;
    }
    return true;
  }
  
  Future<void> startLocationTracking(int patientId) async {
    if (_isTracking) return;
    
    final hasPermission = await requestPermissions();
    if (!hasPermission) {
      print('⚠️ Location permission denied');
      return;
    }
    
    // Send location every 2 minutes (to save battery)
    _locationTimer = Timer.periodic(const Duration(minutes: 2), (timer) async {
      await _updateLocation(patientId);
    });
    
    // Send initial location immediately
    await _updateLocation(patientId);
    _isTracking = true;
    print('✅ Location tracking started for patient $patientId');
  }
  
  Future<void> _updateLocation(int patientId) async {
    try {
      Position position = await Geolocator.getCurrentPosition(
        desiredAccuracy: LocationAccuracy.medium, // Use medium to save battery
      );
      
      // Get address from coordinates (optional, can be done on backend)
      String address = '';
      try {
        List<Placemark> placemarks = await placemarkFromCoordinates(
          position.latitude, 
          position.longitude
        );
        if (placemarks.isNotEmpty) {
          final p = placemarks.first;
          address = '${p.street ?? ''}, ${p.locality ?? ''}, ${p.country ?? ''}';
          if (address.startsWith(', ')) address = address.substring(2);
        }
      } catch (e) {
        print('Geocoding error: $e');
      }
      
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');
      
      final response = await http.post(
        Uri.parse('${ApiConfig.baseUrl}/location/update'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
        body: jsonEncode({
          'patient_id': patientId,
          'lat': position.latitude,
          'lng': position.longitude,
          'accuracy': position.accuracy,
          'address': address,
        }),
      );
      
      if (response.statusCode == 200) {
        print('📍 Location updated successfully');
      } else {
        print('❌ Failed to update location: ${response.statusCode}');
      }
    } catch (e) {
      print('Error updating location: $e');
    }
  }
  
  void stopLocationTracking() {
    _locationTimer?.cancel();
    _isTracking = false;
    print('🛑 Location tracking stopped');
  }
  
  bool get isTracking => _isTracking;
}