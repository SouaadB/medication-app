import 'package:flutter/material.dart';
import '../models/user_profile.dart';
import '../services/profile_service.dart';

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
  
  // Controllers
  late TextEditingController _nameController;
  late TextEditingController _phoneController;
  late TextEditingController _chifaController;
  late TextEditingController _dobController;
  String? _selectedSkillLevel;

  @override
  void initState() {
    super.initState();
    _loadProfile();
  }

  @override
  void dispose() {
    _nameController.dispose();
    _phoneController.dispose();
    _chifaController.dispose();
    _dobController.dispose();
    super.dispose();
  }

  Future<void> _loadProfile() async {
    try {
      final profile = await _profileService.getProfile();
      setState(() {
        _profile = profile;
        _isLoading = false;
        _initializeControllers();
      });
    } catch (e) {
      setState(() => _isLoading = false);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Erreur: $e')),
        );
      }
    }
  }

  void _initializeControllers() {
    _nameController = TextEditingController(text: _profile?.name);
    _phoneController = TextEditingController(text: _profile?.phone);
    _chifaController = TextEditingController(text: _profile?.chifaCardNumber);
    _dobController = TextEditingController(text: _profile?.dateOfBirthFormatted);
    _selectedSkillLevel = _profile?.smartphoneSkillLevel;
  }

  Future<void> _updateProfile() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isLoading = true);
    try {
      final updatedProfile = _profile!.copyWith(
        name: _nameController.text,
        phone: _phoneController.text,
        chifaCardNumber: _profile?.role == 'patient' ? _chifaController.text : null,
        dateOfBirth: _profile?.role == 'patient' ? _dobController.text : null,
        smartphoneSkillLevel: _profile?.role == 'patient' ? _selectedSkillLevel : null,
      );

      final result = await _profileService.updateProfile(updatedProfile);
      setState(() {
        _profile = result;
        _isEditing = false;
        _isLoading = false;
      });
      
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Profil mis à jour avec succès')),
        );
      }
    } catch (e) {
      setState(() => _isLoading = false);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Erreur: $e')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    if (_isLoading && _profile == null) {
      return const Scaffold(
        body: Center(child: CircularProgressIndicator()),
      );
    }

    return Scaffold(
      backgroundColor: theme.colorScheme.background,
      appBar: AppBar(
        title: const Text('Mon Profil'),
        actions: [
          TextButton.icon(
            onPressed: () => setState(() => _isEditing = !_isEditing),
            icon: Icon(_isEditing ? Icons.close_rounded : Icons.edit_rounded, size: 18),
            label: Text(_isEditing ? 'Annuler' : 'Modifier'),
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            _buildProfileHeader(theme),
            Padding(
              padding: const EdgeInsets.all(24.0),
              child: Form(
                key: _formKey,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    _buildSectionTitle(theme, 'Informations de base'),
                    const SizedBox(height: 16),
                    _buildTextField(
                      controller: _nameController,
                      label: 'Nom complet',
                      prefixIcon: Icons.person_outline_rounded,
                      enabled: _isEditing,
                      validator: (v) => v!.isEmpty ? 'Requis' : null,
                    ),
                    const SizedBox(height: 16),
                    _buildTextField(
                      controller: TextEditingController(text: _profile?.email),
                      label: 'Email',
                      prefixIcon: Icons.email_outlined,
                      enabled: false,
                    ),
                    const SizedBox(height: 16),
                    _buildTextField(
                      controller: _phoneController,
                      label: 'Téléphone',
                      prefixIcon: Icons.phone_outlined,
                      enabled: _isEditing,
                      validator: (v) => v!.isEmpty ? 'Requis' : null,
                    ),
                    
                    if (_profile?.role == 'patient') ...[
                      const SizedBox(height: 32),
                      _buildSectionTitle(theme, 'Détails médicaux'),
                      const SizedBox(height: 16),
                      _buildTextField(
                        controller: _chifaController,
                        label: 'Numéro CHIFA',
                        prefixIcon: Icons.card_membership_rounded,
                        enabled: _isEditing,
                        validator: (v) {
                          if (v == null || v.isEmpty) return 'Requis';
                          if (v.length != 9) return '9 chiffres requis';
                          return null;
                        },
                      ),
                      const SizedBox(height: 16),
                      _buildTextField(
                        controller: _dobController,
                        label: 'Date de naissance',
                        prefixIcon: Icons.calendar_today_rounded,
                        enabled: _isEditing,
                        hint: 'JJ-MM-AAAA',
                        validator: (v) {
                          if (v == null || v.isEmpty) return 'Requis';
                          final regExp = RegExp(r'^\d{2}-\d{2}-\d{4}$');
                          if (!regExp.hasMatch(v)) return 'Format JJ-MM-AAAA';
                          return null;
                        },
                      ),
                      const SizedBox(height: 16),
                      DropdownButtonFormField<String>(
                        value: _selectedSkillLevel,
                        decoration: InputDecoration(
                          labelText: 'Niveau smartphone',
                          prefixIcon: const Icon(Icons.smartphone_rounded),
                          filled: true,
                          fillColor: _isEditing ? Colors.white : Colors.grey[100],
                        ),
                        items: ['BASIC', 'INTERMEDIATE', 'ADVANCED']
                            .map((level) => DropdownMenuItem(
                                  value: level,
                                  child: Text(level),
                                ))
                            .toList(),
                        onChanged: _isEditing ? (v) => setState(() => _selectedSkillLevel = v) : null,
                      ),
                    ],
                    
                    const SizedBox(height: 40),
                    if (_isEditing)
                      ElevatedButton(
                        onPressed: _isLoading ? null : _updateProfile,
                        child: _isLoading 
                          ? const SizedBox(height: 24, width: 24, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                          : const Text('Enregistrer les modifications'),
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

  Widget _buildProfileHeader(ThemeData theme) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.only(bottom: 32, top: 16),
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
              CircleAvatar(
                radius: 60,
                backgroundColor: theme.colorScheme.primary.withOpacity(0.1),
                child: Icon(Icons.person_rounded, size: 60, color: theme.colorScheme.primary),
              ),
              if (_isEditing)
                Positioned(
                  bottom: 0,
                  right: 0,
                  child: Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: theme.colorScheme.primary,
                      shape: BoxShape.circle,
                      border: Border.all(color: Colors.white, width: 3),
                    ),
                    child: const Icon(Icons.camera_alt_rounded, size: 20, color: Colors.white),
                  ),
                ),
            ],
          ),
          const SizedBox(height: 16),
          Text(
            _profile?.name ?? '',
            style: theme.textTheme.headlineMedium,
          ),
          const SizedBox(height: 4),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
            decoration: BoxDecoration(
              color: theme.colorScheme.primary.withOpacity(0.1),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Text(
              _profile?.role.toUpperCase() ?? '',
              style: TextStyle(
                color: theme.colorScheme.primary,
                fontSize: 12,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSectionTitle(ThemeData theme, String title) {
    return Text(
      title,
      style: theme.textTheme.titleLarge?.copyWith(fontSize: 18),
    );
  }

  Widget _buildTextField({
    required TextEditingController controller,
    required String label,
    required IconData prefixIcon,
    bool enabled = true,
    String? hint,
    String? Function(String?)? validator,
  }) {
    return TextFormField(
      controller: controller,
      enabled: enabled,
      decoration: InputDecoration(
        labelText: label,
        hintText: hint,
        prefixIcon: Icon(prefixIcon),
        filled: true,
        fillColor: enabled ? Colors.white : Colors.grey[100],
      ),
      validator: validator,
    );
  }
}
