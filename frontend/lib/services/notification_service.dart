import 'package:flutter/material.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:io';
import 'dart:convert';

// ─────────────────────────────────────────────────────────────────────────────
// NAVIGATION KEY
// A global key so NotificationService can navigate without a BuildContext.
// Register this in main.dart on MaterialApp: navigatorKey: NotificationService.navigatorKey
// ─────────────────────────────────────────────────────────────────────────────
final GlobalKey<NavigatorState> notificationNavigatorKey =
    GlobalKey<NavigatorState>();

class NotificationService {
  static final FirebaseMessaging _fcm = FirebaseMessaging.instance;
  static final FlutterLocalNotificationsPlugin _localNotifications =
      FlutterLocalNotificationsPlugin();
  static String? _fcmToken;
  static bool _isInitialized = false;

  static String? get fcmToken => _fcmToken;

  static Future<void> initialize() async {
    print('🔔 [DEBUG] Starting notification service initialization...');

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

      // Handle taps on local notifications (foreground)
      await _localNotifications.initialize(
        settings,
        onDidReceiveNotificationResponse: (NotificationResponse response) {
          _navigateToNotifications();
        },
      );
      print('🔔 [DEBUG] Local notifications initialized');

      // Request permissions
      print('🔔 [DEBUG] Requesting notification permissions...');
      NotificationSettings settingsPermissions = await _fcm.requestPermission(
        alert: true,
        badge: true,
        sound: true,
      );

      print('🔔 [DEBUG] Permission status: ${settingsPermissions.authorizationStatus}');

      if (settingsPermissions.authorizationStatus ==
          AuthorizationStatus.authorized) {
        print('✅ Push notifications authorized');

        // Get FCM token
        print('🔔 [DEBUG] Getting FCM token...');
        _fcmToken = await _fcm.getToken();
        print('📱 FCM Token: $_fcmToken');

        if (_fcmToken == null) {
          print('❌ [ERROR] Failed to get FCM token - it is null!');
        } else {
          print(
              '✅ FCM token obtained successfully (length: ${_fcmToken!.length})');
        }

        // Handle foreground messages
        FirebaseMessaging.onMessage.listen(_handleForegroundMessage);

        // ── GAP 3 FIX: App opened from TERMINATED state ───────────────────
        // User tapped the notification when app was fully closed.
        RemoteMessage? initialMessage =
            await FirebaseMessaging.instance.getInitialMessage();
        if (initialMessage != null) {
          print('📨 Initial message: ${initialMessage.notification?.title}');
          // Delay to let the app fully mount before navigating
          Future.delayed(const Duration(milliseconds: 800), () {
            _handleMessageTap(initialMessage);
          });
        }

        // ── GAP 3 FIX: App opened from BACKGROUND state ───────────────────
        // User tapped the notification when app was in the background.
        FirebaseMessaging.onMessageOpenedApp.listen(_handleMessageTap);
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

  // ── NAVIGATION HELPER ──────────────────────────────────────────────────────
  // Navigates to /notifications regardless of where the user currently is.
  // Works even from the lock screen because we use the global navigator key.

  static void _navigateToNotifications() {
    final context = notificationNavigatorKey.currentContext;
    if (context == null) {
      print('⚠️ Navigator context not available yet');
      return;
    }

    // Check if patient is logged in — don't navigate if on login screen
    SharedPreferences.getInstance().then((prefs) {
      final token = prefs.getString('auth_token');
      final role  = prefs.getString('user_role') ?? 'patient';
      if (token == null) return; // not logged in, ignore
      if (role == 'caregiver') return; // caregivers have their own notifications

      print('📱 Navigating to /notifications from notification tap');
      notificationNavigatorKey.currentState
          ?.pushNamedAndRemoveUntil(
        '/notifications',
        (route) => route.settings.name == '/patient' ||
            route.settings.name == '/patientinterface' ||
            route.isFirst,
      );
    });
  }

  // ── MESSAGE TAP HANDLER ────────────────────────────────────────────────────
  // Called when user taps a push notification (background or terminated state).

  static void _handleMessageTap(RemoteMessage message) {
    print('📨 Notification tapped: ${message.notification?.title}');
    final navigateTo = message.data['navigate_to'];
    print('   navigate_to: $navigateTo');
    _navigateToNotifications();
  }

  // ── FOREGROUND MESSAGE HANDLER ─────────────────────────────────────────────
  // Shows a local notification banner when app is open.
  // Tapping that banner also routes to /notifications.

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
          iOS: const DarwinNotificationDetails(
            presentAlert: true,
            presentBadge: true,
            presentSound: true,
          ),
        ),
        // payload carries navigate_to so the tap handler can use it
        payload: jsonEncode(message.data),
      );
    } catch (e) {
      print('⚠️ Error showing notification: $e');
    }
  }

  @pragma('vm:entry-point')
  static Future<void> _handleBackgroundMessage(RemoteMessage message) async {
    print('📨 Background message: ${message.notification?.title}');
  }

  // ── SEND TOKEN TO BACKEND ──────────────────────────────────────────────────

  static Future<void> sendTokenToBackend(
      String authToken, String apiUrl) async {
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

      final response = await http
          .post(
            Uri.parse(url),
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer $authToken',
            },
            body: jsonEncode({'token': _fcmToken}),
          )
          .timeout(const Duration(seconds: 10));

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

  static Future<void> showLocalNotification(String title, String body,
      {Map<String, String>? payload}) async {
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
          iOS: const DarwinNotificationDetails(),
        ),
        payload: payload != null ? jsonEncode(payload) : null,
      );
    } catch (e) {
      print('⚠️ Error showing local notification: $e');
    }
  }
}