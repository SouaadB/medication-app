import 'package:shared_preferences/shared_preferences.dart';

class UserRoleService {
  static const String _roleKey = 'user_role';
  
  static Future<String?> getUserRole() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_roleKey);
  }
  
  static Future<void> setUserRole(String role) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_roleKey, role);
  }
  
  static Future<void> clearUserRole() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_roleKey);
  }
  
  static Future<bool> isAdmin() async {
    final role = await getUserRole();
    return role == 'admin';
  }
  
  static Future<bool> isCaregiver() async {
    final role = await getUserRole();
    return role == 'caregiver';
  }
  
  static Future<bool> isPatient() async {
    final role = await getUserRole();
    return role == 'patient';
  }
}