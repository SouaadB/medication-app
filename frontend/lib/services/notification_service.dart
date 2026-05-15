import 'package:flutter/material.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:io';
import 'dart:convert';

class NotificationService {
  static final FirebaseMessaging _fcm = FirebaseMessaging.instance;
  static final FlutterLocalNotificationsPlugin _localNotifications =
      FlutterLocalNotificationsPlugin();
  static String? _fcmToken;
  static bool _isInitialized = false;
  
  static String? get fcmToken => _fcmToken;

  static Future<void> initialize() async {
    print('🔔 [DEBUG] Starting notification service initialization...');
    
    // Prevent double initialization
    if (_isInitialized) {
      print('🔔 [DEBUG] Already initialized, skipping');
      return;
    }
    
    try {
      // Initialize local notifications
      print('🔔 [DEBUG] Initializing local notifications...');
      const AndroidInitializationSettings androidSettings =
          AndroidInitializationSettings('@mipmap/ic_launcher');
      const DarwinInitializationSettings iosSettings =
          DarwinInitializationSettings();
      const InitializationSettings settings = InitializationSettings(
        android: androidSettings,
        iOS: iosSettings,
      );
      await _localNotifications.initialize(settings);
      print('🔔 [DEBUG] Local notifications initialized');

      // Request permissions
      print('🔔 [DEBUG] Requesting notification permissions...');
      NotificationSettings settingsPermissions = await _fcm.requestPermission(
        alert: true,
        badge: true,
        sound: true,
      );

      print('🔔 [DEBUG] Permission status: ${settingsPermissions.authorizationStatus}');
      
      if (settingsPermissions.authorizationStatus == AuthorizationStatus.authorized) {
        print('✅ Push notifications authorized');
        
        // Get FCM token
        print('🔔 [DEBUG] Getting FCM token...');
        _fcmToken = await _fcm.getToken();
        print('📱 FCM Token: $_fcmToken');
        
        if (_fcmToken == null) {
          print('❌ [ERROR] Failed to get FCM token - it is null!');
        } else {
          print('✅ FCM token obtained successfully (length: ${_fcmToken!.length})');
        }
        
        // Handle foreground messages
        FirebaseMessaging.onMessage.listen(_handleForegroundMessage);
        
        // Handle when app is opened from terminated state
        RemoteMessage? initialMessage = await FirebaseMessaging.instance.getInitialMessage();
        if (initialMessage != null) {
          print('📨 Initial message: ${initialMessage.notification?.title}');
          _handleMessage(initialMessage);
        }
        
        // Handle when app is opened from background
        FirebaseMessaging.onMessageOpenedApp.listen(_handleMessage);
      } else {
        print('❌ Push notifications not authorized');
      }
      
      _isInitialized = true;
      print('🔔 [DEBUG] Notification service initialization complete');
    } catch (e) {
      print('⚠️ Error initializing notifications: $e');
      print('🔔 [DEBUG] Stack trace: ${StackTrace.current}');
    }
  }
  
  // Call this AFTER user logs in
  static Future<void> sendTokenToBackend(String authToken, String apiUrl) async {
    print('🔄 [DEBUG] sendTokenToBackend called');
    print('   Auth token length: ${authToken.length}');
    print('   API URL: $apiUrl');
    print('   FCM token available: ${_fcmToken != null}');
    
    if (_fcmToken == null) {
      print('⚠️ No FCM token available - trying to get it again...');
      try {
        _fcmToken = await _fcm.getToken();
        print('   New token: $_fcmToken');
      } catch (e) {
        print('❌ Failed to get token: $e');
      }
    }
    
    if (_fcmToken == null) {
      print('❌ Still no FCM token, cannot send to backend');
      return;
    }
    
    print('📤 Sending token to backend: ${_fcmToken!.substring(0, 20)}...');
    
    try {
      final url = '$apiUrl/notifications/save-token';
      print('   URL: $url');
      
      final response = await http.post(
        Uri.parse(url),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $authToken',
        },
        body: jsonEncode({'fcmToken': _fcmToken}),
      ).timeout(const Duration(seconds: 10));
      
      print('📥 Response status: ${response.statusCode}');
      print('📥 Response body: ${response.body}');
      
      if (response.statusCode == 200) {
        print('✅ FCM token sent to backend successfully');
      } else {
        print('❌ Failed to send token to backend: ${response.statusCode}');
      }
    } catch (e) {
      print('❌ Error sending token: $e');
    }
  }

  static void _handleForegroundMessage(RemoteMessage message) {
    print('📨 Foreground message: ${message.notification?.title}');
    
    try {
      _localNotifications.show(
        DateTime.now().millisecondsSinceEpoch.remainder(100000),
        message.notification?.title ?? 'Medication Reminder',
        message.notification?.body ?? '',
        NotificationDetails(
          android: AndroidNotificationDetails(
            'medication_reminders',
            'Medication Reminders',
            channelDescription: 'Notifications for medication reminders',
            importance: Importance.high,
            priority: Priority.high,
          ),
          iOS: DarwinNotificationDetails(
            presentAlert: true,
            presentBadge: true,
            presentSound: true,
          ),
        ),
      );
    } catch (e) {
      print('⚠️ Error showing notification: $e');
    }
  }

  @pragma('vm:entry-point')
  static Future<void> _handleBackgroundMessage(RemoteMessage message) async {
    print('📨 Background message: ${message.notification?.title}');
  }
  
  static void _handleMessage(RemoteMessage message) {
    print('📨 App opened from notification: ${message.notification?.title}');
  }

  static Future<void> showLocalNotification(String title, String body, {Map<String, String>? payload}) async {
    try {
      await _localNotifications.show(
        DateTime.now().millisecondsSinceEpoch.remainder(100000),
        title,
        body,
        NotificationDetails(
          android: AndroidNotificationDetails(
            'medication_reminders',
            'Medication Reminders',
            importance: Importance.high,
            priority: Priority.high,
          ),
          iOS: DarwinNotificationDetails(),
        ),
        payload: payload != null ? jsonEncode(payload) : null,
      );
    } catch (e) {
      print('⚠️ Error showing local notification: $e');
    }
  }
}