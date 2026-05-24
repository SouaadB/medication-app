import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:provider/provider.dart';
import '../config/api_config.dart';
import '../services/language_service.dart';

class SetupProfilePage extends StatefulWidget {
  const SetupProfilePage({super.key});
  @override
  State<SetupProfilePage> createState() => _SetupProfilePageState();
}

class _SetupProfilePageState extends State<SetupProfilePage>
    with SingleTickerProviderStateMixin {
  final TextEditingController _ageController        = TextEditingController();
  final TextEditingController _searchController     = TextEditingController();
  final FocusNode             _ageFocusNode         = FocusNode();
  final List<int>             _selectedConditionIds   = [];
  final List<String>          _selectedConditionNames = [];

  bool   _isLoading         = false;
  bool   _loadingConditions = true;
  String? _error;

  List<Map<String, dynamic>> _availableConditions = [];
  List<Map<String, dynamic>> _filteredConditions  = [];

  late AnimationController _animCtrl;
  late Animation<double>   _fadeAnim;
  late Animation<Offset>   _slideAnim;

  static const Color primary  = Color(0xFF1565C0);
  static const Color primaryLt = Color(0xFFE3F2FD);
  static const Color accent   = Color(0xFF64B5F6);
  static const Color darkText = Color(0xFF0F172A);

  @override
  void initState() {
    super.initState();
    _loadConditions();
    _searchController.addListener(_filterConditions);
    _animCtrl  = AnimationController(vsync: this, duration: const Duration(milliseconds: 800));
    _fadeAnim  = CurvedAnimation(parent: _animCtrl, curve: Curves.easeOut);
    _slideAnim = Tween<Offset>(begin: const Offset(0, 0.06), end: Offset.zero)
        .animate(CurvedAnimation(parent: _animCtrl, curve: Curves.easeOutCubic));
    _animCtrl.forward();
  }

  @override
  void dispose() {
    _animCtrl.dispose();
    _ageController.dispose();
    _ageFocusNode.dispose();
    _searchController.dispose();
    super.dispose();
  }

  Future<void> _loadConditions() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');
      final response = await http.get(
        Uri.parse('${ApiConfig.baseUrl}/profile/conditions'),
        headers: {'Authorization': 'Bearer $token'},
      );
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        setState(() {
          _availableConditions = List<Map<String, dynamic>>.from(data['conditions']);
          _filteredConditions  = _availableConditions;
          _loadingConditions   = false;
        });
      } else {
        setState(() => _loadingConditions = false);
      }
    } catch (_) {
      setState(() => _loadingConditions = false);
    }
  }

  void _filterConditions() {
    setState(() {
      _filteredConditions = _availableConditions
          .where((c) => c['name'].toString().toLowerCase()
              .contains(_searchController.text.toLowerCase()))
          .toList();
    });
  }

  void _incrementAge() {
    final v = int.tryParse(_ageController.text) ?? 0;
    if (v < 120) setState(() => _ageController.text = (v + 1).toString());
  }

  void _decrementAge() {
    final v = int.tryParse(_ageController.text) ?? 0;
    if (v > 0) setState(() => _ageController.text = (v - 1).toString());
  }

  void _toggleCondition(Map<String, dynamic> condition) {
    final id   = condition['id'] as int;
    final name = condition['name'].toString();
    setState(() {
      if (_selectedConditionIds.contains(id)) {
        final i = _selectedConditionIds.indexOf(id);
        _selectedConditionIds.removeAt(i);
        _selectedConditionNames.removeAt(i);
      } else {
        _selectedConditionIds.add(id);
        _selectedConditionNames.add(name);
      }
    });
  }

  void _showConditionSelector() {
    final lang = Provider.of<LanguageService>(context, listen: false);
    _searchController.clear();
    _filterConditions();

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => StatefulBuilder(
        builder: (ctx, setModal) {
          void toggle(Map<String, dynamic> c) {
            _toggleCondition(c);
            setModal(() {});
          }

          return Container(
            height: MediaQuery.of(context).size.height * 0.78,
            decoration: const BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
            ),
            child: Column(children: [

              // handle
              Container(
                margin: const EdgeInsets.only(top: 12),
                width: 40, height: 4,
                decoration: BoxDecoration(
                  color: Colors.grey.shade300,
                  borderRadius: BorderRadius.circular(2),
                ),
              ),

              // header
              Padding(
                padding: const EdgeInsets.fromLTRB(20, 16, 12, 0),
                child: Row(children: [
                  Container(
                    width: 36, height: 36,
                    decoration: BoxDecoration(
                      color: primaryLt, borderRadius: BorderRadius.circular(10)),
                    child: const Icon(Icons.medical_information_outlined,
                        color: primary, size: 18),
                  ),
                  const SizedBox(width: 12),
                  Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                    Text(lang.translate('selectCondition'),
                        style: const TextStyle(fontSize: 17, fontWeight: FontWeight.w800, color: darkText)),
                    Text('${_selectedConditionIds.length} selected',
                        style: TextStyle(fontSize: 12, color: Colors.grey.shade500)),
                  ])),
                  IconButton(
                    onPressed: () => Navigator.pop(ctx),
                    icon: Container(
                      width: 32, height: 32,
                      decoration: BoxDecoration(
                        color: Colors.grey.shade100, borderRadius: BorderRadius.circular(8)),
                      child: const Icon(Icons.close_rounded, size: 16, color: darkText),
                    ),
                  ),
                ]),
              ),

              // search
              Padding(
                padding: const EdgeInsets.fromLTRB(20, 14, 20, 8),
                child: TextField(
                  controller: _searchController,
                  onChanged: (_) { _filterConditions(); setModal(() {}); },
                  style: const TextStyle(fontSize: 14, color: darkText),
                  decoration: InputDecoration(
                    hintText: lang.translate('searchConditions'),
                    hintStyle: TextStyle(color: Colors.grey.shade400, fontSize: 14),
                    prefixIcon: Icon(Icons.search_rounded, color: Colors.grey.shade400, size: 20),
                    filled: true,
                    fillColor: const Color(0xFFF8FAFC),
                    contentPadding: const EdgeInsets.symmetric(vertical: 12, horizontal: 16),
                    enabledBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(14),
                      borderSide: BorderSide(color: Colors.grey.shade200),
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(14),
                      borderSide: const BorderSide(color: primary, width: 1.5),
                    ),
                  ),
                ),
              ),

              // list
              Expanded(child: ListView.builder(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                itemCount: _filteredConditions.length,
                itemBuilder: (_, i) {
                  final c       = _filteredConditions[i];
                  final selected = _selectedConditionIds.contains(c['id']);
                  return GestureDetector(
                    onTap: () => toggle(c),
                    child: AnimatedContainer(
                      duration: const Duration(milliseconds: 150),
                      margin: const EdgeInsets.only(bottom: 8),
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 13),
                      decoration: BoxDecoration(
                        color: selected ? primaryLt : const Color(0xFFF8FAFC),
                        borderRadius: BorderRadius.circular(14),
                        border: Border.all(
                          color: selected ? primary : Colors.grey.shade200,
                          width: selected ? 1.5 : 0.5,
                        ),
                      ),
                      child: Row(children: [
                        Text(c['emoji']?.toString() ?? '🏥',
                            style: const TextStyle(fontSize: 20)),
                        const SizedBox(width: 12),
                        Expanded(child: Text(c['name'].toString(),
                            style: TextStyle(
                              fontSize: 14,
                              fontWeight: selected ? FontWeight.w600 : FontWeight.w400,
                              color: selected ? primary : darkText,
                            ))),
                        AnimatedSwitcher(
                          duration: const Duration(milliseconds: 200),
                          child: selected
                              ? const Icon(Icons.check_circle_rounded,
                                  color: primary, size: 22, key: ValueKey('checked'))
                              : Icon(Icons.radio_button_unchecked_rounded,
                                  color: Colors.grey.shade300, size: 22, key: ValueKey('unchecked')),
                        ),
                      ]),
                    ),
                  );
                },
              )),

              // done button
              Padding(
                padding: EdgeInsets.fromLTRB(20, 8, 20, MediaQuery.of(ctx).padding.bottom + 16),
                child: SizedBox(
                  width: double.infinity, height: 52,
                  child: ElevatedButton(
                    onPressed: () => Navigator.pop(ctx),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: primary, foregroundColor: Colors.white,
                      elevation: 0,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                    ),
                    child: Text(lang.translate('done'),
                        style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                  ),
                ),
              ),
            ]),
          );
        },
      ),
    ).then((_) => setState(() {}));
  }

  Future<void> _saveProfile() async {
    final lang = Provider.of<LanguageService>(context, listen: false);
    final ageText = _ageController.text.trim();
    if (ageText.isEmpty) {
      setState(() => _error = 'Please enter your age'); return;
    }
    final age = int.tryParse(ageText);
    if (age == null || age < 0 || age > 120) {
      setState(() => _error = 'Age must be between 0 and 120'); return;
    }
    setState(() { _isLoading = true; _error = null; });
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');
      final response = await http.post(
        Uri.parse('${ApiConfig.baseUrl}/profile/setup'),
        headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer $token'},
        body: jsonEncode({'age': age, 'conditions': _selectedConditionIds}),
      );
      if (response.statusCode == 200) {
        await prefs.setBool('profile_completed', true);
        if (mounted) Navigator.pushReplacementNamed(context, '/patientinterface');
      } else {
        final data = jsonDecode(response.body);
        setState(() => _error = data['message'] ?? 'Failed to save profile');
      }
    } catch (_) {
      setState(() => _error = 'Connection error. Check your network.');
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final lang = Provider.of<LanguageService>(context);
    return Scaffold(
      backgroundColor: const Color(0xFF1565C0),
      body: Stack(children: [
        // decorative circles
        Positioned(top: -60, right: -60,
          child: Container(width: 200, height: 200,
            decoration: BoxDecoration(shape: BoxShape.circle,
                color: accent.withOpacity(0.1)))),
        Positioned(bottom: 250, left: -50,
          child: Container(width: 150, height: 150,
            decoration: BoxDecoration(shape: BoxShape.circle,
                color: Colors.white.withOpacity(0.04)))),

        SafeArea(child: Column(children: [

          // ── header ──────────────────────────────────────────────────────
          Padding(
            padding: const EdgeInsets.fromLTRB(20, 16, 28, 20),
            child: FadeTransition(opacity: _fadeAnim,
              child: Row(children: [
                GestureDetector(
                  onTap: () => Navigator.pop(context),
                  child: Container(
                    width: 42, height: 42,
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.15),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: const Icon(Icons.arrow_back_rounded, color: Colors.white, size: 20),
                  ),
                ),
                const SizedBox(width: 16),
                Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Text(lang.translate('setupProfile'),
                      style: const TextStyle(color: Colors.white,
                          fontSize: 20, fontWeight: FontWeight.w900, letterSpacing: -0.3)),
                  Text(lang.translate('helpUs'),
                      style: TextStyle(color: Colors.white.withOpacity(0.55), fontSize: 13)),
                ]),
              ]),
            ),
          ),

          // ── white card ───────────────────────────────────────────────────
          Expanded(child: FadeTransition(opacity: _fadeAnim,
            child: SlideTransition(position: _slideAnim,
              child: Container(
                width: double.infinity,
                decoration: const BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.only(
                    topLeft: Radius.circular(36), topRight: Radius.circular(36)),
                ),
                child: _loadingConditions
                    ? const Center(child: CircularProgressIndicator(color: primary))
                    : SingleChildScrollView(
                        padding: const EdgeInsets.fromLTRB(24, 32, 24, 32),
                        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [

                          // progress indicator
                          Row(children: [
                            Expanded(child: Container(height: 4,
                                decoration: BoxDecoration(color: primary,
                                    borderRadius: BorderRadius.circular(2)))),
                            const SizedBox(width: 4),
                            Expanded(child: Container(height: 4,
                                decoration: BoxDecoration(color: Colors.grey.shade200,
                                    borderRadius: BorderRadius.circular(2)))),
                          ]),
                          const SizedBox(height: 6),
                          Text('Step 1 of 2 — Basic Information',
                              style: TextStyle(fontSize: 11, color: Colors.grey.shade400)),
                          const SizedBox(height: 24),

                          // age section
                          _sectionLabel(lang.translate('age'), Icons.cake_outlined),
                          const SizedBox(height: 10),
                          Container(
                            height: 58,
                            decoration: BoxDecoration(
                              color: const Color(0xFFF8FAFC),
                              borderRadius: BorderRadius.circular(16),
                              border: Border.all(color: Colors.grey.shade200),
                            ),
                            child: Row(children: [
                              Expanded(child: TextField(
                                controller: _ageController,
                                focusNode: _ageFocusNode,
                                keyboardType: TextInputType.number,
                                style: const TextStyle(fontSize: 16,
                                    fontWeight: FontWeight.w600, color: darkText),
                                decoration: InputDecoration(
                                  hintText: lang.translate('enterAge'),
                                  hintStyle: TextStyle(color: Colors.grey.shade400,
                                      fontSize: 14, fontWeight: FontWeight.normal),
                                  border: InputBorder.none,
                                  contentPadding: const EdgeInsets.symmetric(horizontal: 18),
                                ),
                                onChanged: (v) {
                                  final age = int.tryParse(v);
                                  setState(() => _error = (v.isNotEmpty && (age == null || age < 0 || age > 120))
                                      ? 'Age must be between 0 and 120' : null);
                                },
                              )),
                              Container(width: 1, height: 36, color: Colors.grey.shade200),
                              Column(children: [
                                Expanded(child: InkWell(
                                  onTap: _incrementAge,
                                  child: SizedBox(width: 48,
                                      child: Icon(Icons.keyboard_arrow_up_rounded,
                                          color: primary, size: 22)),
                                )),
                                Container(width: 48, height: 1, color: Colors.grey.shade200),
                                Expanded(child: InkWell(
                                  onTap: _decrementAge,
                                  child: SizedBox(width: 48,
                                      child: Icon(Icons.keyboard_arrow_down_rounded,
                                          color: primary, size: 22)),
                                )),
                              ]),
                            ]),
                          ),
                          const SizedBox(height: 28),

                          // conditions section
                          _sectionLabel(lang.translate('chronicConditions'),
                              Icons.medical_information_outlined),
                          const SizedBox(height: 10),

                          // selected conditions chips
                          if (_selectedConditionNames.isNotEmpty) ...[
                            Wrap(spacing: 8, runSpacing: 8,
                              children: _selectedConditionNames.asMap().entries.map((e) {
                                return Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                                  decoration: BoxDecoration(
                                    color: primaryLt,
                                    borderRadius: BorderRadius.circular(20),
                                    border: Border.all(color: primary.withOpacity(0.3)),
                                  ),
                                  child: Row(mainAxisSize: MainAxisSize.min, children: [
                                    Text(e.value, style: const TextStyle(
                                        fontSize: 13, color: primary, fontWeight: FontWeight.w600)),
                                    const SizedBox(width: 6),
                                    GestureDetector(
                                      onTap: () => setState(() {
                                        _selectedConditionIds.removeAt(e.key);
                                        _selectedConditionNames.removeAt(e.key);
                                      }),
                                      child: const Icon(Icons.close_rounded,
                                          size: 14, color: primary),
                                    ),
                                  ]),
                                );
                              }).toList(),
                            ),
                            const SizedBox(height: 12),
                          ],

                          // add condition button
                          GestureDetector(
                            onTap: _showConditionSelector,
                            child: Container(
                              width: double.infinity,
                              padding: const EdgeInsets.symmetric(vertical: 16),
                              decoration: BoxDecoration(
                                color: _selectedConditionIds.isEmpty
                                    ? const Color(0xFFF8FAFC) : primaryLt,
                                borderRadius: BorderRadius.circular(16),
                                border: Border.all(
                                  color: _selectedConditionIds.isEmpty
                                      ? Colors.grey.shade300 : primary,
                                  width: _selectedConditionIds.isEmpty ? 0.5 : 1.5,
                                ),
                              ),
                              child: Row(mainAxisAlignment: MainAxisAlignment.center, children: [
                                Icon(
                                  _selectedConditionIds.isEmpty
                                      ? Icons.add_circle_outline_rounded
                                      : Icons.edit_outlined,
                                  color: _selectedConditionIds.isEmpty
                                      ? Colors.grey.shade500 : primary,
                                  size: 20,
                                ),
                                const SizedBox(width: 10),
                                Text(
                                  _selectedConditionIds.isEmpty
                                      ? lang.translate('addCondition')
                                      : 'Edit conditions (${_selectedConditionIds.length} selected)',
                                  style: TextStyle(
                                    fontSize: 14, fontWeight: FontWeight.w600,
                                    color: _selectedConditionIds.isEmpty
                                        ? Colors.grey.shade500 : primary,
                                  ),
                                ),
                              ]),
                            ),
                          ),

                          // error
                          if (_error != null) ...[
                            const SizedBox(height: 16),
                            Container(
                              padding: const EdgeInsets.all(12),
                              decoration: BoxDecoration(
                                color: Colors.red.shade50,
                                borderRadius: BorderRadius.circular(12),
                                border: Border.all(color: Colors.red.shade100),
                              ),
                              child: Row(children: [
                                Icon(Icons.error_outline_rounded,
                                    color: Colors.red.shade400, size: 16),
                                const SizedBox(width: 8),
                                Flexible(child: Text(_error!,
                                    style: TextStyle(color: Colors.red.shade700, fontSize: 13))),
                              ]),
                            ),
                          ],
                          const SizedBox(height: 32),

                          // continue button
                          SizedBox(
                            width: double.infinity, height: 56,
                            child: ElevatedButton(
                              onPressed: _isLoading ? null : _saveProfile,
                              style: ElevatedButton.styleFrom(
                                backgroundColor: primary, foregroundColor: Colors.white,
                                elevation: 0,
                                shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(16)),
                              ),
                              child: _isLoading
                                  ? const SizedBox(width: 22, height: 22,
                                      child: CircularProgressIndicator(
                                          color: Colors.white, strokeWidth: 2.5))
                                  : Row(mainAxisAlignment: MainAxisAlignment.center, children: [
                                      Text(lang.translate('continue'),
                                          style: const TextStyle(fontSize: 17,
                                              fontWeight: FontWeight.bold, letterSpacing: 0.2)),
                                      const SizedBox(width: 8),
                                      const Icon(Icons.arrow_forward_rounded, size: 20),
                                    ]),
                            ),
                          ),
                        ]),
                      ),
              ),
            ),
          )),
        ])),
      ]),
    );
  }

  Widget _sectionLabel(String text, IconData icon) {
    return Row(children: [
      Container(
        width: 30, height: 30,
        decoration: BoxDecoration(color: primaryLt, borderRadius: BorderRadius.circular(8)),
        child: Icon(icon, color: primary, size: 16),
      ),
      const SizedBox(width: 10),
      Text(text, style: const TextStyle(fontSize: 14,
          fontWeight: FontWeight.w700, color: darkText)),
    ]);
  }
}