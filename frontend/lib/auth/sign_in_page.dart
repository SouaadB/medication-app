import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class SignInPage extends StatefulWidget {
  const SignInPage({super.key});

  @override
  _SignInPageState createState() => _SignInPageState();
}

class _SignInPageState extends State<SignInPage> {
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  bool _isLoading = false;
  String? _errorMessage;

  Future<void> _login() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    final response = await http.post(
      Uri.parse('http://YOUR_BACKEND_URL/api/auth/login'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'email': _emailController.text,
        'password': _passwordController.text,
      }),
    );

    setState(() {
      _isLoading = false;
    });

    final data = jsonDecode(response.body);

    if (response.statusCode == 200 && data['success'] == true) {
      // Handle successful login (e.g., save token, navigate)
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Login successful!')),
      );
      
      // Save token if provided
      if (data['token'] != null) {
        // You should use a secure storage like shared_preferences
        // For now, we'll just navigate
      }
      
      // Navigate to patient interface
      Navigator.pushReplacementNamed(context, '/patient');
    } else {
      setState(() {
        _errorMessage = data['message'] ?? 'Login failed';
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        width: double.infinity,
        height: double.infinity,
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: [Color(0xFF0F2027), Color(0xFF2C5364)],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
        ),
        child: Center(
          child: SingleChildScrollView(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 48.0),
              child: Container(
                padding: EdgeInsets.all(32),
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.12),
                  borderRadius: BorderRadius.circular(32),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.2),
                      blurRadius: 24,
                      offset: Offset(0, 8),
                    ),
                  ],
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    SizedBox(height: 40),
                    Row(
                      children: [
                        Icon(Icons.medical_services, color: Colors.white, size: 36),
                        SizedBox(width: 12),
                        Text(
                          'Aavi',
                          style: TextStyle(
                            fontSize: 36,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                            letterSpacing: 2,
                            shadows: [
                              Shadow(
                                color: Colors.black26,
                                blurRadius: 8,
                                offset: Offset(2, 2),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                    Text(
                      'Mobile UI Kit',
                      style: TextStyle(fontSize: 18, color: Colors.white70),
                    ),
                    SizedBox(height: 40),
                    Text(
                      'Sign in',
                      style: TextStyle(
                        fontSize: 28,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                        letterSpacing: 1.2,
                      ),
                    ),
                    Text(
                      'Welcome back! Please sign in to continue.',
                      style: TextStyle(fontSize: 15, color: Colors.white60),
                    ),
                    SizedBox(height: 32),
                    TextField(
                      controller: _emailController,
                      style: TextStyle(color: Colors.white),
                      decoration: InputDecoration(
                        filled: true,
                        fillColor: Colors.white.withOpacity(0.08),
                        prefixIcon: Icon(Icons.person, color: Colors.white70),
                        hintText: 'Email',
                        hintStyle: TextStyle(color: Colors.white54),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(18),
                          borderSide: BorderSide.none,
                        ),
                      ),
                    ),
                    SizedBox(height: 16),
                    TextField(
                      controller: _passwordController,
                      obscureText: true,
                      style: TextStyle(color: Colors.white),
                      decoration: InputDecoration(
                        filled: true,
                        fillColor: Colors.white.withOpacity(0.08),
                        prefixIcon: Icon(Icons.lock, color: Colors.white70),
                        hintText: 'Password',
                        hintStyle: TextStyle(color: Colors.white54),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(18),
                          borderSide: BorderSide.none,
                        ),
                      ),
                    ),
                    SizedBox(height: 8),
                    Align(
                      alignment: Alignment.centerRight,
                      child: TextButton(
                        onPressed: () {
                          Navigator.pushNamed(context, '/forgotpassword');
                        },
                        child: Text(
                          'Forgot Password?',
                          style: TextStyle(color: Colors.blueAccent, fontWeight: FontWeight.bold),
                        ),
                      ),
                    ),
                    if (_errorMessage != null)
                      Padding(
                        padding: const EdgeInsets.symmetric(vertical: 8.0),
                        child: Text(
                          _errorMessage!,
                          style: TextStyle(color: Colors.red),
                        ),
                      ),
                    SizedBox(height: 24),
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton(
                        onPressed: _isLoading ? null : _login,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.blueAccent,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(24),
                          ),
                          padding: EdgeInsets.symmetric(vertical: 18),
                          elevation: 8,
                          shadowColor: Colors.blueAccent,
                        ),
                        child: _isLoading
                            ? CircularProgressIndicator(color: Colors.white)
                            : Text('LOGIN', style: TextStyle(fontSize: 20, letterSpacing: 1.2)),
                      ),
                    ),
                    SizedBox(height: 16),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text("Don't have an account?", style: TextStyle(color: Colors.white70)),
                        TextButton(
                          onPressed: () {
                            Navigator.pushNamed(context, '/signup');
                          },
                          child: Text(
                            'Sign Up',
                            style: TextStyle(color: Colors.blueAccent, fontWeight: FontWeight.bold),
                          ),
                        ),
                      ], 
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}