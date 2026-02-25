import 'package:flutter/material.dart';
import 'package:flutter_app_med/auth/sign_up_page.dart';
import 'package:flutter_app_med/auth/sign_in_page.dart';
import 'package:flutter_app_med/auth/reset_password_page_1.dart';
import 'package:flutter_app_med/auth/forgot_password_page.dart';
import 'package:flutter_app_med/patient/patient_interface.dart';
import 'package:flutter_app_med/admin/admin_interface.dart';
import 'package:flutter_app_med/profile/profile_page.dart';

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
      routes: {
        '/signup': (context) => const SignUpPage(),
        '/signin': (context) => const SignInPage(),
        '/resetpassword': (context) => const ResetPasswordPage(token: ''),
        '/forgotpassword': (context) => const ForgotPasswordPage(),
        '/patientinterface': (context) => const PatientInterface(),
        '/patient': (context) => const PatientInterface(),
        '/admin': (context) => const AdminInterface(),
        '/profile': (context) => const ProfilePage(),
      },
    );
  }
}
