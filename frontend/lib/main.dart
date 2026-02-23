import 'package:flutter/material.dart';

import 'package:flutter_app_med/auth/Sign_Up_Page.dart';
import 'package:flutter_app_med/auth/Sign_In_Page.dart';
import 'package:flutter_app_med/auth/reset_Password_Page_1.dart';
import 'package:flutter_app_med/auth/Forgot_Password_Page.dart';
import 'package:flutter_app_med/patient/patient_interface.dart';
void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      initialRoute: '/signin', // Set your initial page here
      routes: {
        '/signup': (context) => SignUpPage(),
        '/signin': (context) => SignInPage(),
        '/resetpassword': (context) => ResetPasswordPage(token: ''), // Pass token as needed
        '/forgotpassword': (context) => ForgotPasswordPage(),
        '/patientinterface': (context) => PatientInterface(),
      },
    );
  }
}
