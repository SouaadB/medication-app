import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:provider/provider.dart';
import 'auth/sign_up_page.dart';
import 'auth/sign_in_page.dart';
import 'auth/reset_password_page_1.dart';
import 'auth/forgot_password_page.dart';
import 'auth/verify_code_page.dart';
import 'patient/patient_interface.dart';
import 'patient/health_overview_page.dart';
import 'patient/setup_profile_page.dart';
import 'patient/condition_detail_page.dart';
import 'patient/conditions_list_page.dart'; // ← ADD THIS IMPORT
import 'patient/manual_entry_page.dart';
import 'patient/add_medication_page.dart';
import 'patient/daily_planning_page.dart';
import 'patient/notifications_page.dart';
import 'patient/history_page.dart';
import 'patient/settings_page.dart';
import 'patient/daily_schedule_page.dart';
import 'admin/admin_interface.dart';
import 'profile/profile_page.dart';
import 'services/language_service.dart';

void main() {
  runApp(
    ChangeNotifierProvider(
      create: (_) => LanguageService(),
      child: const MyApp(),
    ),
  );
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    final languageService = Provider.of<LanguageService>(context);
    
    return MaterialApp(
      title: 'MediCare',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        primarySwatch: Colors.blue,
        useMaterial3: true,
      ),
      locale: languageService.locale,
      supportedLocales: const [
        Locale('en', ''),
        Locale('fr', ''),
      ],
      localizationsDelegates: const [
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
      ],
      initialRoute: '/signin',
      onGenerateRoute: (settings) {
        // Gestion spéciale pour resetpassword avec token
        if (settings.name == '/resetpassword') {
          final token = settings.arguments as String? ?? '';
          print('🔑 Token reçu dans la route: $token');
          return MaterialPageRoute(
            builder: (context) => ResetPasswordPage(token: token),
          );
        }
        
        // Gestion spéciale pour verifycode avec email dans l'URL
        if (settings.name?.startsWith('/verifycode') ?? false) {
          String email = '';
          if (settings.name!.contains('?email=')) {
            email = settings.name!.split('?email=')[1];
            email = Uri.decodeComponent(email);
          }
          print('📧 Email extrait de l\'URL: $email');
          return MaterialPageRoute(
            builder: (context) => VerifyCodePage(email: email),
          );
        }
        
        // Routes normales
        switch (settings.name) {
          case '/signin':
            return MaterialPageRoute(builder: (context) => const SignInPage());
          case '/signup':
            return MaterialPageRoute(builder: (context) => const SignUpPage());
          case '/forgotpassword':
            return MaterialPageRoute(builder: (context) => const ForgotPasswordPage());
          case '/setupprofile':
            return MaterialPageRoute(builder: (context) => const SetupProfilePage());
          case '/patientinterface':
            return MaterialPageRoute(builder: (context) => const PatientInterface());
          case '/patient':
            return MaterialPageRoute(builder: (context) => const PatientInterface());
          case '/condition-detail':
            final condition = settings.arguments as Map<String, dynamic>;
            return MaterialPageRoute(
              builder: (context) => ConditionDetailPage(condition: condition),
            );
          case '/conditions': // ← ADD THIS CASE
            return MaterialPageRoute(
              builder: (context) => const ConditionsListPage(),
            );
          case '/manual-entry':
            return MaterialPageRoute(
              builder: (context) => const ManualEntryPage(),
            );
          case '/add-medication':
            return MaterialPageRoute(
              builder: (context) => const AddMedicationPage(),
            );
          case '/planning':
            return MaterialPageRoute(
              builder: (context) => const DailyPlanningPage(),
            );
          case '/admin':
            return MaterialPageRoute(builder: (context) => const AdminInterface());
          case '/profile':
            return MaterialPageRoute(builder: (context) => const ProfilePage());
          case '/healthoverview':
            return MaterialPageRoute(builder: (context) => const HealthOverviewPage());
          case '/notifications':
            return MaterialPageRoute(builder: (context) => const NotificationsPage());
          case '/history':
            return MaterialPageRoute(builder: (context) => const HistoryPage());
          case '/settings':
            return MaterialPageRoute(builder: (context) => const SettingsPage());
          case '/daily-schedule':
            return MaterialPageRoute(builder: (context) => const DailySchedulePage());
          default:
            return MaterialPageRoute(builder: (context) => const SignInPage());
        }
      },
    );
  }
}