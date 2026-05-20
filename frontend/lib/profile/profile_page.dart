import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';
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

  // Role-based colors
  Color _primaryColor = const Color(0xFF3498DB);
  Color _lightColor = const Color(0xFFEBF5FB);
  String _roleTitle = 'Patient';
  IconData _roleIcon = Icons.person_rounded;

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
    
    // Set role-based colors
    if (_userRole == 'admin') {
      _primaryColor = const Color(0xFF3498DB);
      _lightColor = const Color(0xFFEBF5FB);
      _roleTitle = 'Administrator';
      _roleIcon = Icons.admin_panel_settings_rounded;
    } else if (_userRole == 'caregiver') {
      _primaryColor = const Color(0xFF22C55E);
      _lightColor = const Color(0xFFE8F5E9);
      _roleTitle = 'Caregiver';
      _roleIcon = Icons.people_alt_rounded;
    } else {
      _primaryColor = const Color(0xFF3498DB);
      _lightColor = const Color(0xFFEBF5FB);
      _roleTitle = 'Patient';
      _roleIcon = Icons.person_rounded;
    }
    
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
        _showErrorSnackBar(e.toString());
      }
    }
  }

  Future<void> _updateProfile() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isLoading = true);
    try {
      UserProfile? result;
      
      if (_userRole == 'caregiver') {
        final updatedProfile = _profile!.copyWith(
          name: _nameController.text,
          phone: null,
        );
        result = await _profileService.updateCaregiverProfile(updatedProfile);
      } else {
        final updatedProfile = _profile!.copyWith(
          name: _nameController.text,
          phone: _phoneController.text,
          chifaCardNumber: _userRole == 'patient' ? _chifaController.text : null,
          dateOfBirth: _userRole == 'patient' ? _dobController.text : null,
          smartphoneSkillLevel: _userRole == 'patient' ? _selectedSkillLevel : null,
        );
        result = await _profileService.updateProfile(updatedProfile);
      }
      
      setState(() {
        _profile = result;
        _isEditing = false;
        _isLoading = false;
      });
      
      if (mounted) {
        final languageService = Provider.of<LanguageService>(context, listen: false);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(languageService.translate('save')),
            backgroundColor: Colors.green,
          ),
        );
      }
    } catch (e) {
      setState(() => _isLoading = false);
      _showErrorSnackBar(e.toString());
    }
  }

  Future<void> _changePassword() async {
    if (_newPasswordController.text != _confirmPasswordController.text) {
      _showErrorSnackBar('Passwords do not match');
      return;
    }
    
    if (_newPasswordController.text.length < 6) {
      _showErrorSnackBar('Password must be at least 6 characters');
      return;
    }

    setState(() => _isLoading = true);
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
        _isLoading = false;
      });
      
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Password changed successfully'), backgroundColor: Colors.green),
      );
    } catch (e) {
      setState(() => _isLoading = false);
      _showErrorSnackBar(e.toString());
    }
  }

  void _showErrorSnackBar(String error) {
    final languageService = Provider.of<LanguageService>(context, listen: false);
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('${languageService.translate('error')}: $error'),
        backgroundColor: Colors.red,
      ),
    );
    setState(() => _isLoading = false);
  }

  @override
  Widget build(BuildContext context) {
    final languageService = Provider.of<LanguageService>(context);
    final settingsService = Provider.of<SettingsService>(context);
    final isDark = settingsService.isDarkMode;
    
    if (_isLoading && _profile == null) {
      return Scaffold(
        backgroundColor: isDark ? const Color(0xFF121212) : _lightColor,
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              CircularProgressIndicator(color: _primaryColor),
              const SizedBox(height: 16),
              Text(
                'Loading profile...',
                style: TextStyle(color: _primaryColor),
              ),
            ],
          ),
        ),
      );
    }

    return Scaffold(
      backgroundColor: isDark ? const Color(0xFF121212) : _lightColor,
      appBar: AppBar(
        backgroundColor: _primaryColor,
        elevation: 0,
        foregroundColor: Colors.white,
        title: Text(languageService.translate('profile')),
        centerTitle: true,
        actions: [
          if (_userRole != 'admin')
            TextButton.icon(
              onPressed: () => setState(() => _isEditing = !_isEditing),
              icon: Icon(_isEditing ? Icons.close_rounded : Icons.edit_rounded, size: 18),
              label: Text(_isEditing 
                  ? languageService.translate('cancel')
                  : languageService.translate('edit')),
              style: TextButton.styleFrom(foregroundColor: Colors.white),
            ),
          const SizedBox(width: 8),
        ],
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            _buildProfileHeader(languageService),
            Padding(
              padding: const EdgeInsets.all(24.0),
              child: Form(
                key: _formKey,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    _buildSectionTitle('Personal Information'),
                    const SizedBox(height: 16),
                    _buildTextField(
                      controller: _nameController,
                      label: languageService.translate('fullName'),
                      prefixIcon: Icons.person_outline_rounded,
                      enabled: _isEditing,
                      validator: (v) => v!.isEmpty ? languageService.translate('required') : null,
                    ),
                    const SizedBox(height: 16),
                    _buildTextField(
                      controller: TextEditingController(text: _profile?.email),
                      label: languageService.translate('email'),
                      prefixIcon: Icons.email_outlined,
                      enabled: false,
                    ),
                    
                    // Phone field only for patients (not for caregivers)
                    if (_userRole == 'patient') ...[
                      const SizedBox(height: 16),
                      _buildTextField(
                        controller: _phoneController,
                        label: languageService.translate('phone'),
                        prefixIcon: Icons.phone_outlined,
                        enabled: _isEditing,
                        validator: (v) => v!.isEmpty ? languageService.translate('required') : null,
                      ),
                    ],
                    
                    // Password change section for caregivers
                    if (_userRole == 'caregiver') ...[
                      const SizedBox(height: 24),
                      const Divider(),
                      const SizedBox(height: 16),
                      _buildSectionTitle('Security'),
                      const SizedBox(height: 16),
                      if (!_isChangingPassword)
                        ElevatedButton.icon(
                          onPressed: () => setState(() => _isChangingPassword = true),
                          icon: const Icon(Icons.lock_outline),
                          label: const Text('Change Password'),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: _primaryColor,
                            foregroundColor: Colors.white,
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                          ),
                        )
                      else ...[
                        _buildTextField(
                          controller: _currentPasswordController,
                          label: 'Current Password',
                          prefixIcon: Icons.lock_outline,
                          obscureText: true,
                          enabled: true,
                          validator: (v) => v!.isEmpty ? 'Current password required' : null,
                        ),
                        const SizedBox(height: 16),
                        _buildTextField(
                          controller: _newPasswordController,
                          label: 'New Password',
                          prefixIcon: Icons.lock_outline,
                          obscureText: true,
                          enabled: true,
                          validator: (v) => v!.length < 6 ? 'Password must be at least 6 characters' : null,
                        ),
                        const SizedBox(height: 16),
                        _buildTextField(
                          controller: _confirmPasswordController,
                          label: 'Confirm New Password',
                          prefixIcon: Icons.lock_outline,
                          obscureText: true,
                          enabled: true,
                          validator: (v) => v != _newPasswordController.text ? 'Passwords do not match' : null,
                        ),
                        const SizedBox(height: 16),
                        Row(
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
                                child: Text(languageService.translate('cancel')),
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: ElevatedButton(
                                onPressed: _changePassword,
                                style: ElevatedButton.styleFrom(backgroundColor: _primaryColor),
                                child: const Text('Save Password'),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ],
                    
                    if (_userRole == 'patient') ...[
                      const SizedBox(height: 32),
                      _buildSectionTitle('Medical Information'),
                      const SizedBox(height: 16),
                      _buildTextField(
                        controller: _chifaController,
                        label: languageService.translate('chifaNumber'),
                        prefixIcon: Icons.card_membership_rounded,
                        enabled: _isEditing,
                        helperText: '9-digit CHIFA card number',
                        validator: (v) {
                          if (v == null || v.isEmpty) return languageService.translate('required');
                          if (v.length != 9) return 'Must be exactly 9 digits';
                          return null;
                        },
                      ),
                      const SizedBox(height: 16),
                      _buildTextField(
                        controller: _dobController,
                        label: languageService.translate('dateOfBirth'),
                        prefixIcon: Icons.calendar_today_rounded,
                        enabled: _isEditing,
                        hint: 'DD-MM-YYYY',
                        validator: (v) {
                          if (v == null || v.isEmpty) return languageService.translate('required');
                          final regExp = RegExp(r'^\d{2}-\d{2}-\d{4}$');
                          if (!regExp.hasMatch(v)) return 'Format: DD-MM-YYYY';
                          return null;
                        },
                      ),
                      const SizedBox(height: 16),
                      DropdownButtonFormField<String>(
                        value: _selectedSkillLevel,
                        decoration: InputDecoration(
                          labelText: languageService.translate('skillLevel'),
                          prefixIcon: const Icon(Icons.smartphone_rounded),
                          filled: true,
                          fillColor: _isEditing ? Colors.white : Colors.grey[100],
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: BorderSide.none,
                          ),
                        ),
                        items: [
                          {'value': 'BASIC', 'label': languageService.translate('basic')},
                          {'value': 'INTERMEDIATE', 'label': languageService.translate('intermediate')},
                          {'value': 'ADVANCED', 'label': languageService.translate('advanced')},
                        ].map((item) => DropdownMenuItem(
                              value: item['value'],
                              child: Text(item['label']!),
                            )).toList(),
                        onChanged: _isEditing ? (v) => setState(() => _selectedSkillLevel = v) : null,
                      ),
                    ],
                    
                    const SizedBox(height: 40),
                    if (_isEditing)
                      ElevatedButton(
                        onPressed: _isLoading ? null : _updateProfile,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: _primaryColor,
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(vertical: 16),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                        child: _isLoading 
                          ? const SizedBox(height: 24, width: 24, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                          : Text(
                              languageService.translate('save'),
                              style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                            ),
                      ),
                    const SizedBox(height: 20),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildProfileHeader(LanguageService languageService) {
    final String name = _profile?.name ?? '';
    final String initials = name.isNotEmpty
        ? name.split(' ').map((e) => e[0]).take(2).join().toUpperCase()
        : 'U';
    
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.only(bottom: 32, top: 24),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: const BorderRadius.only(
          bottomLeft: Radius.circular(32),
          bottomRight: Radius.circular(32),
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        children: [
          Stack(
            children: [
              Container(
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  boxShadow: [
                    BoxShadow(
                      color: _primaryColor.withOpacity(0.3),
                      blurRadius: 20,
                      offset: const Offset(0, 5),
                    ),
                  ],
                ),
                child: CircleAvatar(
                  radius: 60,
                  backgroundColor: _lightColor,
                  child: CircleAvatar(
                    radius: 55,
                    backgroundColor: _primaryColor.withOpacity(0.1),
                    child: Text(
                      initials,
                      style: TextStyle(
                        fontSize: 40,
                        fontWeight: FontWeight.bold,
                        color: _primaryColor,
                      ),
                    ),
                  ),
                ),
              ),
              Positioned(
                bottom: 0,
                right: 0,
                child: Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: _primaryColor,
                    shape: BoxShape.circle,
                    border: Border.all(color: Colors.white, width: 3),
                  ),
                  child: Icon(
                    _roleIcon,
                    size: 20,
                    color: Colors.white,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Text(
            _profile?.name ?? '',
            style: TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
              color: _primaryColor,
            ),
          ),
          const SizedBox(height: 8),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
            decoration: BoxDecoration(
              color: _primaryColor.withOpacity(0.1),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(_roleIcon, size: 14, color: _primaryColor),
                const SizedBox(width: 6),
                Text(
                  _roleTitle,
                  style: TextStyle(
                    color: _primaryColor,
                    fontSize: 12,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 8),
          Text(
            _profile?.email ?? '',
            style: TextStyle(
              color: Colors.grey.shade600,
              fontSize: 13,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSectionTitle(String title) {
    return Text(
      title,
      style: TextStyle(
        fontSize: 18,
        fontWeight: FontWeight.bold,
        color: _primaryColor,
      ),
    );
  }

  Widget _buildTextField({
    required TextEditingController controller,
    required String label,
    required IconData prefixIcon,
    bool enabled = true,
    String? hint,
    String? helperText,
    bool obscureText = false,
    String? Function(String?)? validator,
  }) {
    return TextFormField(
      controller: controller,
      enabled: enabled,
      obscureText: obscureText,
      decoration: InputDecoration(
        labelText: label,
        hintText: hint,
        helperText: helperText,
        prefixIcon: Icon(prefixIcon, color: _primaryColor),
        filled: true,
        fillColor: enabled ? Colors.white : Colors.grey[100],
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide.none,
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(color: _primaryColor, width: 2),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide.none,
        ),
      ),
      validator: validator,
    );
  }
}