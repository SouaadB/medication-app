import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class ResetPasswordPage extends StatefulWidget {
  final String token; // Token from reset link

  const ResetPasswordPage({super.key, required this.token});

  @override
  State<ResetPasswordPage> createState() => _ResetPasswordPageState();
}

class _ResetPasswordPageState extends State<ResetPasswordPage> {
  final _newPasswordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();
  bool _obscureNew = true;
  bool _obscureConfirm = true;
  bool _isLoading = false;
  String? _error;

  // Password validation
  bool _isValidPassword(String password) {
    return password.length >= 8 &&
      RegExp(r'[a-z]').hasMatch(password) &&
      RegExp(r'[A-Z]').hasMatch(password) &&
      RegExp(r'[!@#\$&*~]').hasMatch(password);
  }

  Future<void> _resetPassword() async {
    setState(() { _isLoading = true; _error = null; });

    final newPassword = _newPasswordController.text;
    final confirmPassword = _confirmPasswordController.text;

    if (newPassword != confirmPassword) {
      setState(() {
        _error = "Passwords do not match";
        _isLoading = false;
      });
      return;
    }
    if (!_isValidPassword(newPassword)) {
      setState(() {
        _error = "Password must be at least 8 characters, include upper/lowercase and a special character.";
        _isLoading = false;
      });
      return;
    }

    final response = await http.post(
      Uri.parse('https://your-backend-url/reset-password'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'token': widget.token,
        'newPassword': newPassword,
      }),
    );

    final data = jsonDecode(response.body);
    if (data['success'] == true) {
      setState(() { _isLoading = false; });
      _showSuccessDialog();
    } else {
      setState(() {
        _error = data['message'] ?? "An error occurred";
        _isLoading = false;
      });
    }
  }

  void _showSuccessDialog() {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (_) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(Icons.check_circle, color: Colors.green, size: 40),
            SizedBox(height: 16),
            Text("Password changed successfully", style: TextStyle(fontSize: 18)),
            SizedBox(height: 16),
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: Color(0xFF3D1E8A),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
              ),
              onPressed: () {
                Navigator.of(context).pop();
                Navigator.of(context).pushReplacementNamed('/login');
              },
              child: Text("Log in"),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: Icon(Icons.close),
            onPressed: () => Navigator.of(context).pop(),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        leading: BackButton(),
        title: Text(''),
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 32),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text("Create a secure password", style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
            SizedBox(height: 8),
            Text("Please enter a strong password and keep it well!", style: TextStyle(color: Colors.grey)),
            SizedBox(height: 24),
            TextField(
              controller: _newPasswordController,
              obscureText: _obscureNew,
              decoration: InputDecoration(
                labelText: "New password",
                suffixIcon: IconButton(
                  icon: Icon(_obscureNew ? Icons.visibility_off : Icons.visibility),
                  onPressed: () => setState(() => _obscureNew = !_obscureNew),
                ),
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
              ),
            ),
            SizedBox(height: 16),
            TextField(
              controller: _confirmPasswordController,
              obscureText: _obscureConfirm,
              decoration: InputDecoration(
                labelText: "Confirm new password",
                suffixIcon: IconButton(
                  icon: Icon(_obscureConfirm ? Icons.visibility_off : Icons.visibility),
                  onPressed: () => setState(() => _obscureConfirm = !_obscureConfirm),
                ),
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
              ),
            ),
            SizedBox(height: 16),
            Text("Must contain at least:", style: TextStyle(fontWeight: FontWeight.bold)),
            Padding(
              padding: const EdgeInsets.only(left: 8.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text("• 8 characters"),
                  Text("• 1 lowercase character"),
                  Text("• 1 uppercase character"),
                  Text("• 1 special character"),
                ],
              ),
            ),
            if (_error != null) ...[
              SizedBox(height: 16),
              Text(_error!, style: TextStyle(color: Colors.red)),
            ],
            SizedBox(height: 32),
            Center(
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: Color(0xFF3D1E8A),
                  minimumSize: Size(200, 48),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                onPressed: _isLoading ? null : _resetPassword,
                child: _isLoading
                  ? CircularProgressIndicator(color: Colors.white)
                  : Text("Reset"),
              ),
            ),
          ],
        ),
      ),
    );
  }
}