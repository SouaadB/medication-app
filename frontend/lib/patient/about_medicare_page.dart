import 'package:flutter/material.dart';

class AboutMediCarePage extends StatelessWidget {
  const AboutMediCarePage({super.key});

  static const Color _primary   = Color(0xFF1565C0);
  static const Color _primaryDk = Color(0xFF0D3F7F);
  static const Color _accent    = Color(0xFF64B5F6);
  static const Color _bg        = Color(0xFFF4F7FB);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: _bg,
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            expandedHeight: 220,
            pinned: true,
            backgroundColor: _primary,
            foregroundColor: Colors.white,
            elevation: 0,
            leading: IconButton(
              icon: Container(
                width: 36, height: 36,
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.15),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: const Icon(Icons.arrow_back_rounded, color: Colors.white, size: 18),
              ),
              onPressed: () => Navigator.pop(context),
            ),
            flexibleSpace: FlexibleSpaceBar(
              background: Container(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [_primaryDk, _primary, _accent.withOpacity(0.8)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                ),
                child: Stack(children: [
                  Positioned(top: -40, right: -40,
                    child: Container(width: 160, height: 160,
                      decoration: BoxDecoration(shape: BoxShape.circle,
                          color: Colors.white.withOpacity(0.06)))),
                  Positioned(bottom: -20, left: -20,
                    child: Container(width: 120, height: 120,
                      decoration: BoxDecoration(shape: BoxShape.circle,
                          color: Colors.white.withOpacity(0.04)))),
                  SafeArea(child: Padding(
                    padding: const EdgeInsets.fromLTRB(24, 48, 24, 24),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisAlignment: MainAxisAlignment.end,
                      children: [
                        Row(children: [
                          Container(
                            width: 52, height: 52,
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(14),
                              boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.15), blurRadius: 10)],
                            ),
                            child: ClipRRect(
                              borderRadius: BorderRadius.circular(14),
                              child: Image.asset('assets/icon/app_icon.png', fit: BoxFit.cover),
                            ),
                          ),
                          const SizedBox(width: 14),
                          Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                            const Text('MediCare', style: TextStyle(
                              color: Colors.white, fontSize: 26,
                              fontWeight: FontWeight.w900, letterSpacing: -0.5,
                            )),
                            Text('Medication Adherence Platform', style: TextStyle(
                              color: Colors.white.withOpacity(0.75), fontSize: 12,
                            )),
                          ]),
                        ]),
                        const SizedBox(height: 12),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(
                            color: Colors.white.withOpacity(0.15),
                            borderRadius: BorderRadius.circular(20),
                          ),
                          child: const Text('Version 1.0.0', style: TextStyle(
                            color: Colors.white, fontSize: 11, fontWeight: FontWeight.w600,
                          )),
                        ),
                      ],
                    ),
                  )),
                ]),
              ),
            ),
          ),

          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(20),
              child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [

                _sectionHeader('Our Mission', Icons.flag_rounded, _primary),
                const SizedBox(height: 12),
                _missionCard(),
                const SizedBox(height: 24),

                _sectionHeader('Key Features', Icons.star_rounded, const Color(0xFF7B1FA2)),
                const SizedBox(height: 12),
                _featuresGrid(),
                const SizedBox(height: 24),

                _sectionHeader('Who We Serve', Icons.people_rounded, const Color(0xFF00897B)),
                const SizedBox(height: 12),
                _audienceCards(),
                const SizedBox(height: 24),

                _sectionHeader('Clinical Standards', Icons.verified_rounded, const Color(0xFFE65100)),
                const SizedBox(height: 12),
                _standardsCard(),
                const SizedBox(height: 32),

                _footer(),
                const SizedBox(height: 20),
              ]),
            ),
          ),
        ],
      ),
    );
  }

  Widget _sectionHeader(String title, IconData icon, Color color) {
    return Row(children: [
      Container(
        padding: const EdgeInsets.all(8),
        decoration: BoxDecoration(
          color: color.withOpacity(0.1),
          borderRadius: BorderRadius.circular(10),
        ),
        child: Icon(icon, color: color, size: 18),
      ),
      const SizedBox(width: 10),
      Text(title, style: const TextStyle(
        fontSize: 16, fontWeight: FontWeight.w800,
        color: Color(0xFF0F172A), letterSpacing: -0.3,
      )),
    ]);
  }

  Widget _missionCard() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [_primary, _primaryDk],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(20),
        boxShadow: [BoxShadow(color: _primary.withOpacity(0.3), blurRadius: 16, offset: const Offset(0, 6))],
      ),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        const Icon(Icons.format_quote_rounded, color: Colors.white54, size: 32),
        const SizedBox(height: 8),
        const Text(
          'MediCare is dedicated to improving medication adherence and health outcomes for elderly patients in Algeria — bridging the gap between patients, caregivers, and healthcare providers through intelligent, compassionate technology.',
          style: TextStyle(color: Colors.white, fontSize: 14, height: 1.7),
        ),
        const SizedBox(height: 16),
        Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: Colors.white.withOpacity(0.12),
            borderRadius: BorderRadius.circular(12),
          ),
          child: const Row(children: [
            Icon(Icons.lightbulb_rounded, color: Colors.amber, size: 18),
            SizedBox(width: 10),
            Expanded(child: Text(
              'Built as a final year engineering project (PFE) to address real challenges in elderly medication management.',
              style: TextStyle(color: Colors.white70, fontSize: 12, height: 1.5),
            )),
          ]),
        ),
      ]),
    );
  }

  Widget _featuresGrid() {
    final features = [
      _FeatureItem(Icons.document_scanner_rounded, 'OCR Prescription Scanning',
          'Automatically extract medications from French ordonnances using AI', const Color(0xFF1565C0)),
      _FeatureItem(Icons.notifications_active_rounded, 'Smart Reminders',
          'Intelligent push notifications scheduled around meals and daily routine', const Color(0xFF7B1FA2)),
      _FeatureItem(Icons.location_on_rounded, 'Live Location Sharing',
          '24/7 background location monitoring for caregiver peace of mind', const Color(0xFF00897B)),
      _FeatureItem(Icons.people_rounded, 'Caregiver Dashboard',
          'Real-time patient monitoring with adherence tracking and alerts', const Color(0xFFE65100)),
      _FeatureItem(Icons.psychology_rounded, 'AI Health Assistant',
          'Conversational AI trained on medication guidance with persistent memory', const Color(0xFF6D4C41)),
      _FeatureItem(Icons.bar_chart_rounded, 'Adherence Analytics',
          'Detailed reports, streaks, and achievement system to motivate patients', const Color(0xFF1565C0)),
      _FeatureItem(Icons.menu_book_rounded, 'Medication Dictionary',
          'Comprehensive Algerian medication database with PharmNet integration', const Color(0xFF2E7D32)),
      _FeatureItem(Icons.picture_as_pdf_rounded, 'PDF Reports',
          'Exportable medication history reports for medical consultations', const Color(0xFFC62828)),
    ];

    return Column(
      children: List.generate((features.length / 2).ceil(), (row) {
        final left  = features[row * 2];
        final right = row * 2 + 1 < features.length ? features[row * 2 + 1] : null;
        return Padding(
          padding: const EdgeInsets.only(bottom: 12),
          child: Row(children: [
            Expanded(child: _featureCard(left)),
            const SizedBox(width: 12),
            Expanded(child: right != null ? _featureCard(right) : const SizedBox()),
          ]),
        );
      }),
    );
  }

  Widget _featureCard(_FeatureItem f) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.04), blurRadius: 10, offset: const Offset(0, 4))],
      ),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Container(
          width: 40, height: 40,
          decoration: BoxDecoration(
            color: f.color.withOpacity(0.1),
            borderRadius: BorderRadius.circular(10),
          ),
          child: Icon(f.icon, color: f.color, size: 20),
        ),
        const SizedBox(height: 10),
        Text(f.title, style: const TextStyle(
          fontSize: 12, fontWeight: FontWeight.w800,
          color: Color(0xFF0F172A), height: 1.3,
        )),
        const SizedBox(height: 4),
        Text(f.description, style: TextStyle(
          fontSize: 11, color: Colors.grey.shade500, height: 1.4,
        )),
      ]),
    );
  }

  Widget _audienceCards() {
    return Row(children: [
      Expanded(child: _audienceCard(
        Icons.elderly_rounded, 'Elderly Patients',
        'Seniors managing chronic conditions who need simple, reliable medication reminders',
        const Color(0xFF1565C0),
      )),
      const SizedBox(width: 12),
      Expanded(child: _audienceCard(
        Icons.favorite_rounded, 'Caregivers & Family',
        'Family members and professional caregivers who remotely monitor patient wellbeing',
        const Color(0xFF00897B),
      )),
    ]);
  }

  Widget _audienceCard(IconData icon, String title, String desc, Color color) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: color.withOpacity(0.15)),
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.04), blurRadius: 10, offset: const Offset(0, 4))],
      ),
      child: Column(children: [
        Container(
          width: 48, height: 48,
          decoration: BoxDecoration(color: color.withOpacity(0.1), shape: BoxShape.circle),
          child: Icon(icon, color: color, size: 24),
        ),
        const SizedBox(height: 10),
        Text(title, style: const TextStyle(
          fontSize: 13, fontWeight: FontWeight.w800, color: Color(0xFF0F172A),
        ), textAlign: TextAlign.center),
        const SizedBox(height: 6),
        Text(desc, style: TextStyle(
          fontSize: 11, color: Colors.grey.shade500, height: 1.5,
        ), textAlign: TextAlign.center),
      ]),
    );
  }

  Widget _standardsCard() {
    final standards = [
      ('Medical Disclaimer', 'MediCare is a supportive tool and does not replace professional medical advice, diagnosis, or treatment.', Icons.gavel_rounded),
      ('Data Privacy', 'All patient data is encrypted and stored securely. Location data is only shared with explicitly approved caregivers.', Icons.lock_rounded),
      ('Emergency Protocol', 'Critical medication alerts bypass quiet hours. Emergency call functionality (SAMU 16) is integrated directly.', Icons.emergency_rounded),
    ];
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.04), blurRadius: 10, offset: const Offset(0, 4))],
      ),
      child: Column(
        children: standards.asMap().entries.map((e) {
          final idx = e.key; final s = e.value;
          return Column(children: [
            Padding(
              padding: const EdgeInsets.all(16),
              child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Container(
                  width: 36, height: 36,
                  decoration: BoxDecoration(
                    color: const Color(0xFFE65100).withOpacity(0.1),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Icon(s.$3, color: const Color(0xFFE65100), size: 18),
                ),
                const SizedBox(width: 12),
                Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Text(s.$1, style: const TextStyle(
                    fontSize: 13, fontWeight: FontWeight.w700, color: Color(0xFF0F172A),
                  )),
                  const SizedBox(height: 4),
                  Text(s.$2, style: TextStyle(
                    fontSize: 12, color: Colors.grey.shade500, height: 1.5,
                  )),
                ])),
              ]),
            ),
            if (idx < standards.length - 1)
              Divider(height: 1, indent: 64, endIndent: 16, color: Colors.grey.shade100),
          ]);
        }).toList(),
      ),
    );
  }

  Widget _footer() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: const Color(0xFF0F172A),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Column(children: [
        Row(mainAxisAlignment: MainAxisAlignment.center, children: [
          ClipRRect(
            borderRadius: BorderRadius.circular(10),
            child: Image.asset('assets/icon/app_icon.png', width: 36, height: 36, fit: BoxFit.cover),
          ),
          const SizedBox(width: 10),
          const Text('MediCare', style: TextStyle(
            color: Colors.white, fontSize: 18,
            fontWeight: FontWeight.w900, letterSpacing: -0.3,
          )),
        ]),
        const SizedBox(height: 12),
        Text('Final Year Engineering Project (PFE)',
            style: TextStyle(color: Colors.white.withOpacity(0.5), fontSize: 11),
            textAlign: TextAlign.center),
        const SizedBox(height: 4),
        Text('Higher School of Computer Science',
            style: TextStyle(color: Colors.white.withOpacity(0.35), fontSize: 11),
            textAlign: TextAlign.center),
        const SizedBox(height: 16),
        Divider(color: Colors.white.withOpacity(0.1)),
        const SizedBox(height: 14),
        Wrap(
          alignment: WrapAlignment.center,
          spacing: 10,
          runSpacing: 10,
          children: [
            _authorChip('Berrached Malak'),
            _authorChip('Benameurbelkacem Souaad'),
          ],
        ),
        const SizedBox(height: 12),
        Text('© 2025 MediCare. All rights reserved.',
            style: TextStyle(color: Colors.white.withOpacity(0.3), fontSize: 11),
            textAlign: TextAlign.center),
      ]),
    );
  }

  Widget _authorChip(String name) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.08),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Colors.white.withOpacity(0.15)),
      ),
      child: Row(mainAxisSize: MainAxisSize.min, children: [
        Container(
          width: 22, height: 22,
          decoration: const BoxDecoration(color: _primary, shape: BoxShape.circle),
          child: const Icon(Icons.person_rounded, color: Colors.white, size: 13),
        ),
        const SizedBox(width: 7),
        Text(name, style: const TextStyle(
          color: Colors.white, fontSize: 11, fontWeight: FontWeight.w600,
        )),
      ]),
    );
  }
}

class _FeatureItem {
  final IconData icon;
  final String title;
  final String description;
  final Color color;
  const _FeatureItem(this.icon, this.title, this.description, this.color);
}