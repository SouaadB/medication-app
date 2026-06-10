import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/user_profile.dart';
import '../services/profile_service.dart';
import '../services/language_service.dart';
import '../services/user_role_service.dart';
import '../services/settings_service.dart';
import '../config/api_config.dart';

class ProfilePage extends StatefulWidget {
  const ProfilePage({super.key});

  @override
  State<ProfilePage> createState() => _ProfilePageState();
}

class _ProfilePageState extends State<ProfilePage> {
  final ProfileService _profileService = ProfileService();
  final _formKey = GlobalKey<FormState>();
  
  UserProfile? _profile;
  bool _isLoading = true;
  bool _isSaving = false;
  bool _isEditing = false;
  bool _isChangingPassword = false;
  String? _userRole;
  
  // Controllers
  late TextEditingController _nameController;
  late TextEditingController _phoneController;
  late TextEditingController _chifaController;
  late TextEditingController _dobController;
  late TextEditingController _currentPasswordController;
  late TextEditingController _newPasswordController;
  late TextEditingController _confirmPasswordController;
  String? _selectedSkillLevel;

  @override
  void initState() {
    super.initState();
    _initializeControllers();
    _loadRoleAndProfile();
  }

  @override
  void dispose() {
    _nameController.dispose();
    _phoneController.dispose();
    _chifaController.dispose();
    _dobController.dispose();
    _currentPasswordController.dispose();
    _newPasswordController.dispose();
    _confirmPasswordController.dispose();
    super.dispose();
  }

  void _initializeControllers() {
    _nameController = TextEditingController();
    _phoneController = TextEditingController();
    _chifaController = TextEditingController();
    _dobController = TextEditingController();
    _currentPasswordController = TextEditingController();
    _newPasswordController = TextEditingController();
    _confirmPasswordController = TextEditingController();
  }

  Future<void> _loadRoleAndProfile() async {
    _userRole = await UserRoleService.getUserRole();
    await _loadProfile();
  }

  Future<void> _loadProfile() async {
    try {
      UserProfile? profile;
      
      if (_userRole == 'caregiver') {
        profile = await _profileService.getCaregiverProfile();
      } else {
        profile = await _profileService.getProfile();
      }
      
      setState(() {
        _profile = profile;
        _isLoading = false;
        _nameController.text = profile?.name ?? '';
        _phoneController.text = profile?.phone ?? '';
        _chifaController.text = profile?.chifaCardNumber ?? '';
        _dobController.text = profile?.dateOfBirthFormatted ?? '';
        _selectedSkillLevel = profile?.smartphoneSkillLevel;
      });
    } catch (e) {
      setState(() => _isLoading = false);
      if (mounted) {
        _showSnackBar('Error loading profile: $e', Colors.red);
      }
    }
  }

  Future<void> _updateProfile() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isSaving = true);
    try {
      UserProfile? result;
      
      if (_userRole == 'caregiver') {
        final updatedProfile = _profile!.copyWith(
          name: _nameController.text.trim(),
          phone: null,
        );
        result = await _profileService.updateCaregiverProfile(updatedProfile);
      } else if (_userRole == 'admin') {
        // Admin only updates name
        final prefs = await SharedPreferences.getInstance();
        final token = prefs.getString('auth_token');
        final response = await http.put(
          Uri.parse('${ApiConfig.baseUrl}/profile/update'),
          headers: ApiConfig.getAuthHeaders(token!),
          body: jsonEncode({'name': _nameController.text.trim()}),
        );
        if (response.statusCode == 200) {
          await prefs.setString('user_name', _nameController.text.trim());
          result = _profile!.copyWith(name: _nameController.text.trim());
          _showSnackBar('Profile updated successfully', Colors.green);
        } else {
          throw Exception('Failed to update admin profile');
        }
      } else {
        final updatedProfile = _profile!.copyWith(
          name: _nameController.text.trim(),
          phone: _phoneController.text.trim(),
          chifaCardNumber: _chifaController.text.trim(),
          dateOfBirth: _dobController.text.trim(),
          smartphoneSkillLevel: _selectedSkillLevel,
        );
        result = await _profileService.updateProfile(updatedProfile);
      }
      
      setState(() {
        _profile = result;
        _isEditing = false;
        _isSaving = false;
      });
      
      if (_userRole != 'admin') {
        _showSnackBar('Profile saved', Colors.green);
      }
    } catch (e) {
      setState(() => _isSaving = false);
      _showSnackBar('Error saving profile: $e', Colors.red);
    }
  }

  // For patients and caregivers only – admin does not see password change
  Future<void> _changePassword() async {
    if (_newPasswordController.text != _confirmPasswordController.text) {
      _showSnackBar('Passwords do not match', Colors.red);
      return;
    }
    
    if (_newPasswordController.text.length < 6) {
      _showSnackBar('Password must be at least 6 characters', Colors.red);
      return;
    }

    setState(() => _isSaving = true);
    try {
      if (_userRole == 'caregiver') {
        await _profileService.changeCaregiverPassword(
          _currentPasswordController.text,
          _newPasswordController.text,
        );
      } else {
        await _profileService.changePassword(
          _currentPasswordController.text,
          _newPasswordController.text,
        );
      }
      
      setState(() {
        _isChangingPassword = false;
        _currentPasswordController.clear();
        _newPasswordController.clear();
        _confirmPasswordController.clear();
        _isSaving = false;
      });
      
      _showSnackBar('Password changed successfully', Colors.green);
    } catch (e) {
      setState(() => _isSaving = false);
      _showSnackBar(e.toString(), Colors.red);
    }
  }

  void _showSnackBar(String msg, Color color) {
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(
      content: Text(msg),
      backgroundColor: color,
      behavior: SnackBarBehavior.floating,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
    ));
  }

  String _getInitials() {
    final name = _profile?.name ?? '';
    if (name.trim().isEmpty) return '?';
    return name.trim().split(' ').map((e) => e.isNotEmpty ? e[0] : '').take(2).join().toUpperCase();
  }

  String _getRoleDisplay() {
    if (_userRole == 'admin') return 'ADMINISTRATOR';
    if (_userRole == 'caregiver') return 'CAREGIVER';
    return 'PATIENT';
  }

  @override
  Widget build(BuildContext context) {
    final languageService = Provider.of<LanguageService>(context);
    final settingsService = Provider.of<SettingsService>(context);
    final isDark = settingsService.isDarkMode;
    
    if (_isLoading && _profile == null) {
      return Scaffold(
        backgroundColor: isDark ? const Color(0xFF121212) : const Color(0xFFF7F8FC),
        body: const Center(child: CircularProgressIndicator()),
      );
    }

    return Scaffold(
      backgroundColor: isDark ? const Color(0xFF121212) : const Color(0xFFF7F8FC),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.black54),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text('Profile',
            style: TextStyle(color: Color(0xFF1A237E), fontWeight: FontWeight.bold, fontSize: 18)),
        actions: [
          if (_isEditing)
            TextButton(
              onPressed: () => setState(() { 
                _isEditing = false; 
                _isChangingPassword = false;
                _loadProfile(); 
              }),
              child: const Text('Cancel', style: TextStyle(color: Colors.grey)),
            )
          else
            TextButton.icon(
              onPressed: () => setState(() => _isEditing = true),
              icon: const Icon(Icons.edit_outlined, size: 16, color: Colors.blue),
              label: const Text('Edit', style: TextStyle(color: Colors.blue)),
            ),
          const SizedBox(width: 8),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.fromLTRB(16, 0, 16, 40),
        child: Form(
          key: _formKey,
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [

            // avatar header
            _buildHeader(),
            const SizedBox(height: 24),

            // personal info
            _sectionLabel('Personal Information', Icons.person_outline),
            const SizedBox(height: 12),
            _buildCard(children: [
              _field(
                controller: _nameController,
                label: 'Full Name',
                icon: Icons.person_outline,
                enabled: _isEditing,
                validator: (v) => v == null || v.trim().isEmpty ? 'Name is required' : null,
              ),
              _divider(),
              _infoTile('Email', _profile?.email ?? '', Icons.email_outlined, enabled: false),
              if (_userRole == 'patient') ...[
                _divider(),
                _field(
                  controller: _phoneController,
                  label: 'Phone',
                  icon: Icons.phone_outlined,
                  enabled: _isEditing,
                  keyboardType: TextInputType.phone,
                ),
              ],
            ]),
            const SizedBox(height: 20),

            // medical info (patients only)
            if (_userRole == 'patient') ...[
              _sectionLabel('Medical Information', Icons.medical_information_outlined),
              const SizedBox(height: 12),
              _buildCard(children: [
                _field(
                  controller: _chifaController,
                  label: 'Chifa Number',
                  icon: Icons.card_membership_outlined,
                  enabled: _isEditing,
                  validator: (v) {
                    if (v == null || v.trim().isEmpty) return 'Chifa number is required';
                    if (v.trim().length != 9) return 'Chifa number must be 9 digits';
                    return null;
                  },
                ),
                _divider(),
                _field(
                  controller: _dobController,
                  label: 'Date of Birth',
                  icon: Icons.calendar_today_outlined,
                  enabled: _isEditing,
                  hint: 'DD-MM-YYYY',
                  validator: (v) {
                    if (v == null || v.trim().isEmpty) return 'Date of birth is required';
                    if (!RegExp(r'^\d{2}-\d{2}-\d{4}$').hasMatch(v.trim())) return 'Format: DD-MM-YYYY';
                    return null;
                  },
                ),
                _divider(),
                _skillLevelTile(),
              ]),
              const SizedBox(height: 20),
            ],

            // account info
            _sectionLabel('Account', Icons.shield_outlined),
            const SizedBox(height: 12),
            _buildCard(children: [
              _infoTile('Role', _getRoleDisplay(), Icons.badge_outlined, enabled: false),
            ]),
            const SizedBox(height: 20),

            // change password (only for patients and caregivers)
            if (_userRole != 'admin' && !_isEditing && !_isChangingPassword)
              SizedBox(
                width: double.infinity,
                child: OutlinedButton.icon(
                  onPressed: () => setState(() => _isChangingPassword = true),
                  icon: const Icon(Icons.lock_outline),
                  label: const Text('Change Password'),
                  style: OutlinedButton.styleFrom(
                    foregroundColor: Colors.blue,
                    side: const BorderSide(color: Colors.blue),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    padding: const EdgeInsets.symmetric(vertical: 14),
                  ),
                ),
              ),

            // password change form (only for patients/caregivers)
            if (_userRole != 'admin' && _isChangingPassword) ...[
              const SizedBox(height: 16),
              _buildCard(children: [
                _passwordField(
                  controller: _currentPasswordController,
                  label: 'Current Password',
                  icon: Icons.lock_outline,
                ),
                _divider(),
                _passwordField(
                  controller: _newPasswordController,
                  label: 'New Password',
                  icon: Icons.lock_outline,
                  validator: (v) {
                    if (v == null || v.trim().isEmpty) return 'Password is required';
                    if (v.trim().length < 6) return 'Minimum 6 characters';
                    return null;
                  },
                ),
                _divider(),
                _passwordField(
                  controller: _confirmPasswordController,
                  label: 'Confirm New Password',
                  icon: Icons.lock_outline,
                  validator: (v) {
                    if (v != _newPasswordController.text) return 'Passwords do not match';
                    return null;
                  },
                ),
                const SizedBox(height: 12),
                Padding(
                  padding: const EdgeInsets.all(12),
                  child: Row(
                    children: [
                      Expanded(
                        child: OutlinedButton(
                          onPressed: () {
                            setState(() {
                              _isChangingPassword = false;
                              _currentPasswordController.clear();
                              _newPasswordController.clear();
                              _confirmPasswordController.clear();
                            });
                          },
                          child: const Text('Cancel'),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: ElevatedButton(
                          onPressed: _isSaving ? null : _changePassword,
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.blue,
                            foregroundColor: Colors.white,
                          ),
                          child: _isSaving
                              ? const SizedBox(width: 20, height: 20,
                                  child: CircularProgressIndicator(strokeWidth: 2))
                              : const Text('Save'),
                        ),
                      ),
                    ],
                  ),
                ),
              ]),
            ],

            const SizedBox(height: 20),

            // save button (when editing)
            if (_isEditing)
              SizedBox(
                width: double.infinity,
                height: 52,
                child: ElevatedButton(
                  onPressed: _isSaving ? null : _updateProfile,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.blue,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                    elevation: 0,
                  ),
                  child: _isSaving
                      ? const SizedBox(width: 22, height: 22,
                          child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                      : const Text('Save',
                          style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                ),
              ),
          ]),
        ),
      ),
    );
  }

  // Helper widgets (all English, no translations)
  Widget _buildHeader() {
    final name = _profile?.name ?? '';
    final initials = _getInitials();
    final role = _getRoleDisplay();

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(vertical: 28),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.04), blurRadius: 10, offset: const Offset(0, 4))],
      ),
      child: Column(children: [
        Stack(children: [
          CircleAvatar(
            radius: 52,
            backgroundColor: Colors.blue[50],
            child: Text(initials,
                style: const TextStyle(fontSize: 32, fontWeight: FontWeight.bold, color: Colors.blue)),
          ),
          if (_isEditing)
            Positioned(
              bottom: 0, right: 0,
              child: Container(
                padding: const EdgeInsets.all(7),
                decoration: BoxDecoration(
                  color: Colors.blue,
                  shape: BoxShape.circle,
                  border: Border.all(color: Colors.white, width: 2),
                ),
                child: const Icon(Icons.camera_alt_outlined, size: 16, color: Colors.white),
              ),
            ),
        ]),
        const SizedBox(height: 14),
        Text(name,
            style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Color(0xFF1A237E))),
        const SizedBox(height: 6),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 4),
          decoration: BoxDecoration(
            color: Colors.blue[50],
            borderRadius: BorderRadius.circular(20),
          ),
          child: Text(role,
              style: const TextStyle(color: Colors.blue, fontSize: 12, fontWeight: FontWeight.bold)),
        ),
        if (_profile?.email != null) ...[
          const SizedBox(height: 8),
          Text(_profile!.email!, style: TextStyle(fontSize: 13, color: Colors.grey[500])),
        ],
      ]),
    );
  }

  Widget _sectionLabel(String title, IconData icon) {
    return Row(children: [
      Icon(icon, size: 16, color: Colors.grey[500]),
      const SizedBox(width: 6),
      Text(title.toUpperCase(),
          style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold,
              color: Colors.grey[500], letterSpacing: 0.8)),
    ]);
  }

  Widget _buildCard({required List<Widget> children}) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.04), blurRadius: 10, offset: const Offset(0, 4))],
      ),
      child: Column(children: children),
    );
  }

  Widget _divider() => Divider(height: 1, indent: 56, color: Colors.grey[100]);

  Widget _field({
    required TextEditingController controller,
    required String label,
    required IconData icon,
    bool enabled = true,
    String? hint,
    TextInputType? keyboardType,
    String? Function(String?)? validator,
  }) {
    if (!enabled) {
      return Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        child: Row(children: [
          Icon(icon, size: 20, color: Colors.grey[400]),
          const SizedBox(width: 16),
          Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text(label, style: TextStyle(fontSize: 11, color: Colors.grey[400])),
            const SizedBox(height: 2),
            Text(controller.text.isNotEmpty ? controller.text : '—',
                style: const TextStyle(fontSize: 15, color: Color(0xFF1A237E), fontWeight: FontWeight.w500)),
          ]),
        ]),
      );
    }

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
      child: TextFormField(
        controller: controller,
        keyboardType: keyboardType,
        validator: validator,
        style: const TextStyle(fontSize: 15, color: Color(0xFF1A237E)),
        decoration: InputDecoration(
          labelText: label,
          hintText: hint,
          prefixIcon: Icon(icon, size: 20, color: Colors.grey[400]),
          border: InputBorder.none,
          labelStyle: TextStyle(fontSize: 12, color: Colors.grey[500]),
          contentPadding: const EdgeInsets.symmetric(vertical: 12),
        ),
      ),
    );
  }

  Widget _passwordField({
    required TextEditingController controller,
    required String label,
    required IconData icon,
    String? Function(String?)? validator,
  }) {
    bool _obscure = true;
    
    return StatefulBuilder(
      builder: (context, setState) {
        return Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
          child: TextFormField(
            controller: controller,
            obscureText: _obscure,
            validator: validator,
            style: const TextStyle(fontSize: 15, color: Color(0xFF1A237E)),
            decoration: InputDecoration(
              labelText: label,
              prefixIcon: Icon(icon, size: 20, color: Colors.grey[400]),
              suffixIcon: IconButton(
                icon: Icon(_obscure ? Icons.visibility_off : Icons.visibility, size: 20),
                onPressed: () => setState(() => _obscure = !_obscure),
              ),
              border: InputBorder.none,
              labelStyle: TextStyle(fontSize: 12, color: Colors.grey[500]),
              contentPadding: const EdgeInsets.symmetric(vertical: 12),
            ),
          ),
        );
      },
    );
  }

  Widget _infoTile(String label, String value, IconData icon, {bool enabled = true}) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      child: Row(children: [
        Icon(icon, size: 20, color: Colors.grey[400]),
        const SizedBox(width: 16),
        Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text(label, style: TextStyle(fontSize: 11, color: Colors.grey[400])),
          const SizedBox(height: 2),
          Text(value.isNotEmpty ? value : '—',
              style: const TextStyle(fontSize: 15, color: Color(0xFF1A237E), fontWeight: FontWeight.w500)),
        ]),
      ]),
    );
  }

  Widget _skillLevelTile() {
    final List<String> levels = ['BASIC', 'INTERMEDIATE', 'ADVANCED'];
    final Map<String, String> levelNames = {
      'BASIC': 'Basic',
      'INTERMEDIATE': 'Intermediate',
      'ADVANCED': 'Advanced',
    };

    if (!_isEditing) {
      final display = _selectedSkillLevel != null ? levelNames[_selectedSkillLevel!] ?? '—' : '—';
      return _infoTile('Smartphone Skill Level', display, Icons.smartphone_outlined);
    }

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
      child: DropdownButtonFormField<String>(
        value: _selectedSkillLevel,
        decoration: const InputDecoration(
          labelText: 'Smartphone Skill Level',
          prefixIcon: Icon(Icons.smartphone_outlined, size: 20),
          border: InputBorder.none,
          labelStyle: TextStyle(fontSize: 12, color: Colors.grey),
          contentPadding: EdgeInsets.symmetric(vertical: 12),
        ),
        items: levels.map((level) {
          return DropdownMenuItem(
            value: level,
            child: Text(levelNames[level]!),
          );
        }).toList(),
        onChanged: (v) => setState(() => _selectedSkillLevel = v),
      ),
    );
  }
}