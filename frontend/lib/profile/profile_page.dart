import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/user_profile.dart';
import '../services/profile_service.dart';
import '../services/language_service.dart';

class ProfilePage extends StatefulWidget {
  const ProfilePage({super.key});

  @override
  State<ProfilePage> createState() => _ProfilePageState();
}

class _ProfilePageState extends State<ProfilePage> {
  final ProfileService _profileService = ProfileService();
  final _formKey = GlobalKey<FormState>();

  UserProfile? _profile;
  bool _isLoading  = true;
  bool _isSaving   = false;
  bool _isEditing  = false;

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

  // ── data ───────────────────────────────────────────────────────────────────

  Future<void> _loadProfile() async {
    try {
      final profile = await _profileService.getProfile();
      if (mounted) {
        setState(() {
          _profile = profile;
          _isLoading = false;
          _initControllers();
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() => _isLoading = false);
        _showSnack('Error loading profile: $e', Colors.red);
      }
    }
  }

  void _initControllers() {
    _nameController   = TextEditingController(text: _profile?.name);
    _phoneController  = TextEditingController(text: _profile?.phone);
    _chifaController  = TextEditingController(text: _profile?.chifaCardNumber);
    _dobController    = TextEditingController(text: _profile?.dateOfBirthFormatted);
    _selectedSkillLevel = _profile?.smartphoneSkillLevel;
  }

  Future<void> _saveProfile() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _isSaving = true);
    try {
      final updated = _profile!.copyWith(
        name:                _nameController.text.trim(),
        phone:               _phoneController.text.trim(),
        chifaCardNumber:     _profile?.role == 'patient' ? _chifaController.text.trim() : null,
        dateOfBirth:         _profile?.role == 'patient' ? _dobController.text.trim() : null,
        smartphoneSkillLevel: _profile?.role == 'patient' ? _selectedSkillLevel : null,
      );
      final result = await _profileService.updateProfile(updated);
      if (mounted) {
        setState(() { _profile = result; _isEditing = false; _isSaving = false; });
        _showSnack('Profile updated successfully', Colors.green);
      }
    } catch (e) {
      if (mounted) {
        setState(() => _isSaving = false);
        _showSnack('Error saving profile: $e', Colors.red);
      }
    }
  }

  void _showSnack(String msg, Color color) {
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(
      content: Text(msg),
      backgroundColor: color,
      behavior: SnackBarBehavior.floating,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
    ));
  }

  // ── BUILD ──────────────────────────────────────────────────────────────────

  @override
  Widget build(BuildContext context) {
    final lang = Provider.of<LanguageService>(context);

    if (_isLoading) {
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }

    return Scaffold(
      backgroundColor: const Color(0xFFF7F8FC),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.black54),
          onPressed: () => Navigator.pop(context),
        ),
        title: Text(lang.translate('profile'),
            style: const TextStyle(color: Color(0xFF1A237E), fontWeight: FontWeight.bold, fontSize: 18)),
        actions: [
          if (_isEditing)
            TextButton(
              onPressed: () => setState(() { _isEditing = false; _initControllers(); }),
              child: Text(lang.translate('cancel'), style: const TextStyle(color: Colors.grey)),
            )
          else
            TextButton.icon(
              onPressed: () => setState(() => _isEditing = true),
              icon: const Icon(Icons.edit_outlined, size: 16, color: Colors.blue),
              label: Text(lang.translate('edit'), style: const TextStyle(color: Colors.blue)),
            ),
          const SizedBox(width: 8),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.fromLTRB(16, 0, 16, 40),
        child: Form(
          key: _formKey,
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [

            // ── avatar header ─────────────────────────────────────────────
            _buildHeader(lang),
            const SizedBox(height: 24),

            // ── personal info ─────────────────────────────────────────────
            _sectionLabel('Personal Information', Icons.person_outline),
            const SizedBox(height: 12),
            _buildCard(children: [
              _field(
                controller: _nameController,
                label: 'Full name',
                icon: Icons.person_outline,
                enabled: _isEditing,
                validator: (v) => v == null || v.trim().isEmpty ? 'Name is required' : null,
              ),
              _divider(),
              _field(
                controller: TextEditingController(text: _profile?.email),
                label: 'Email',
                icon: Icons.email_outlined,
                enabled: false,
              ),
              _divider(),
              _field(
                controller: _phoneController,
                label: lang.translate('phone'),
                icon: Icons.phone_outlined,
                enabled: _isEditing,
                keyboardType: TextInputType.phone,
              ),
            ]),
            const SizedBox(height: 20),

            // ── medical info (patients only) ──────────────────────────────
            if (_profile?.role == 'patient') ...[
              _sectionLabel('Medical Information', Icons.medical_information_outlined),
              const SizedBox(height: 12),
              _buildCard(children: [
                _field(
                  controller: _chifaController,
                  label: lang.translate('chifaNumber'),
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
                  label: lang.translate('dateOfBirth'),
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
                _skillLevelTile(lang),
              ]),
              const SizedBox(height: 20),
            ],

            // ── account info (read only) ──────────────────────────────────
            _sectionLabel('Account', Icons.shield_outlined),
            const SizedBox(height: 12),
            _buildCard(children: [
              _infoTile('Role', (_profile?.role ?? '').toUpperCase(), Icons.badge_outlined),

            ]),
            const SizedBox(height: 32),

            // ── save button ───────────────────────────────────────────────
            if (_isEditing)
              SizedBox(
                width: double.infinity,
                height: 52,
                child: ElevatedButton(
                  onPressed: _isSaving ? null : _saveProfile,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.blue,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                    elevation: 0,
                  ),
                  child: _isSaving
                      ? const SizedBox(width: 22, height: 22,
                          child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                      : Text(lang.translate('save'),
                          style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                ),
              ),
          ]),
        ),
      ),
    );
  }

  // ── AVATAR HEADER ──────────────────────────────────────────────────────────

  Widget _buildHeader(LanguageService lang) {
    final name    = _profile?.name ?? '';
    final initials = name.trim().isNotEmpty
        ? name.trim().split(' ').map((e) => e.isNotEmpty ? e[0] : '').take(2).join().toUpperCase()
        : '?';
    final role = _profile?.role ?? '';

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
            backgroundColor: Colors.blue.shade50,
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
            color: Colors.blue.shade50,
            borderRadius: BorderRadius.circular(20),
          ),
          child: Text(role.toUpperCase(),
              style: const TextStyle(color: Colors.blue, fontSize: 12, fontWeight: FontWeight.bold)),
        ),
        if (_profile?.email != null) ...[
          const SizedBox(height: 8),
          Text(_profile!.email!, style: TextStyle(fontSize: 13, color: Colors.grey.shade500)),
        ],
      ]),
    );
  }

  // ── SECTION LABEL ──────────────────────────────────────────────────────────

  Widget _sectionLabel(String title, IconData icon) {
    return Row(children: [
      Icon(icon, size: 16, color: Colors.grey.shade500),
      const SizedBox(width: 6),
      Text(title.toUpperCase(),
          style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold,
              color: Colors.grey.shade500, letterSpacing: 0.8)),
    ]);
  }

  // ── CARD WRAPPER ───────────────────────────────────────────────────────────

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

  Widget _divider() => Divider(height: 1, indent: 56, color: Colors.grey.shade100);

  // ── FORM FIELD ─────────────────────────────────────────────────────────────

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
      // read-only display tile
      return Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        child: Row(children: [
          Icon(icon, size: 20, color: Colors.grey.shade400),
          const SizedBox(width: 16),
          Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text(label, style: TextStyle(fontSize: 11, color: Colors.grey.shade400)),
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
          prefixIcon: Icon(icon, size: 20, color: Colors.grey.shade400),
          border: InputBorder.none,
          labelStyle: TextStyle(fontSize: 12, color: Colors.grey.shade500),
          contentPadding: const EdgeInsets.symmetric(vertical: 12),
        ),
      ),
    );
  }

  // ── INFO TILE (read only) ──────────────────────────────────────────────────

  Widget _infoTile(String label, String value, IconData icon) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      child: Row(children: [
        Icon(icon, size: 20, color: Colors.grey.shade400),
        const SizedBox(width: 16),
        Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text(label, style: TextStyle(fontSize: 11, color: Colors.grey.shade400)),
          const SizedBox(height: 2),
          Text(value, style: const TextStyle(fontSize: 15, color: Color(0xFF1A237E), fontWeight: FontWeight.w500)),
        ]),
      ]),
    );
  }

  // ── SKILL LEVEL DROPDOWN ───────────────────────────────────────────────────

  Widget _skillLevelTile(LanguageService lang) {
    if (!_isEditing) {
      return _infoTile(
        lang.translate('skillLevel'),
        _selectedSkillLevel != null ? _skillLabel(_selectedSkillLevel!, lang) : '—',
        Icons.smartphone_outlined,
      );
    }

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
      child: DropdownButtonFormField<String>(
        value: _selectedSkillLevel,
        decoration: InputDecoration(
          labelText: lang.translate('skillLevel'),
          prefixIcon: Icon(Icons.smartphone_outlined, size: 20, color: Colors.grey.shade400),
          border: InputBorder.none,
          labelStyle: TextStyle(fontSize: 12, color: Colors.grey.shade500),
          contentPadding: const EdgeInsets.symmetric(vertical: 12),
        ),
        items: [
          DropdownMenuItem(value: 'BASIC',        child: Text(lang.translate('basic'))),
          DropdownMenuItem(value: 'INTERMEDIATE', child: Text(lang.translate('intermediate'))),
          DropdownMenuItem(value: 'ADVANCED',     child: Text(lang.translate('advanced'))),
        ],
        onChanged: (v) => setState(() => _selectedSkillLevel = v),
      ),
    );
  }

  String _skillLabel(String level, LanguageService lang) {
    switch (level) {
      case 'BASIC':        return lang.translate('basic');
      case 'INTERMEDIATE': return lang.translate('intermediate');
      case 'ADVANCED':     return lang.translate('advanced');
      default: return level;
    }
  }


}