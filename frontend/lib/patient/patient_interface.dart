import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class PatientInterface extends StatefulWidget {
  const PatientInterface({super.key});

  @override
  _PatientInterfaceState createState() => _PatientInterfaceState();
}

class _PatientInterfaceState extends State<PatientInterface> {
  bool _isLoggingOut = false;

  Future<void> _logout() async {
    setState(() {
      _isLoggingOut = true;
    });

    try {
      final response = await http.post(
        Uri.parse('http://YOUR_BACKEND_URL/api/auth/logout'),
        headers: {
          'Content-Type': 'application/json',
          // Add your authorization header if needed
          // 'Authorization': 'Bearer $token',
        },
      );

      final data = jsonDecode(response.body);

      if (response.statusCode == 200 && data['success'] == true) {
        // Clear any stored tokens or user data here
        // For example, using shared_preferences:
        // final prefs = await SharedPreferences.getInstance();
        // await prefs.remove('token');
        // await prefs.remove('userData');

        // Navigate back to sign in page
        Navigator.pushReplacementNamed(context, '/signin');
        
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Logged out successfully!')),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(data['message'] ?? 'Logout failed')),
        );
      }
    } catch (error) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Network error: $error')),
      );
    } finally {
      setState(() {
        _isLoggingOut = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Patient Interface'),
        backgroundColor: Colors.blue,
        actions: [
          IconButton(
            icon: _isLoggingOut
                ? CircularProgressIndicator(color: Colors.white)
                : Icon(Icons.logout),
            onPressed: _isLoggingOut ? null : _logout,
            tooltip: 'Logout',
          ),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Welcome to Patient Interface',
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
            SizedBox(height: 20),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Patient Dashboard',
                      style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                    ),
                    SizedBox(height: 10),
                    Text('Here you can view your medical records, appointments, and more.'),
                    SizedBox(height: 20),
                    // Add more patient-specific widgets here
                    ElevatedButton(
                      onPressed: () {
                        // TODO: Add patient-specific actions
                      },
                      child: Text('View Medical Records'),
                    ),
                  ],
                ),
              ),
            ),
            SizedBox(height: 20),
            // Logout button at the bottom as well
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: _isLoggingOut ? null : _logout,
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.red,
                  padding: EdgeInsets.symmetric(vertical: 16),
                ),
                child: _isLoggingOut
                    ? CircularProgressIndicator(color: Colors.white)
                    : Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.logout),
                          SizedBox(width: 8),
                          Text('LOGOUT', style: TextStyle(fontSize: 18)),
                        ],
                      ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}