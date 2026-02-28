import 'package:flutter/material.dart';
import 'auth/sign_up_page.dart';
import 'auth/sign_in_page.dart';
import 'auth/reset_password_page_1.dart';
import 'auth/forgot_password_page.dart';
import 'auth/verify_code_page.dart';
import 'patient/patient_interface.dart';
import 'admin/admin_interface.dart';
import 'profile/profile_page.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Medication App',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        primarySwatch: Colors.blue,
        useMaterial3: true,
      ),
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
          case '/patientinterface':
            return MaterialPageRoute(builder: (context) => const PatientInterface());
          case '/patient':
            return MaterialPageRoute(builder: (context) => const PatientInterface());
          case '/admin':
            return MaterialPageRoute(builder: (context) => const AdminInterface());
          case '/profile':
            return MaterialPageRoute(builder: (context) => const ProfilePage());
          default:
            return MaterialPageRoute(builder: (context) => const SignInPage());
        }
      },
    );
  }}