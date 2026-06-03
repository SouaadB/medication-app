import 'package:flutter/material.dart';
import '../services/accessibility_service.dart';

class AccessibilitySettingsPage extends StatefulWidget {
  const AccessibilitySettingsPage({super.key});

  @override
  State<AccessibilitySettingsPage> createState() =>
      _AccessibilitySettingsPageState();
}

class _AccessibilitySettingsPageState
    extends State<AccessibilitySettingsPage> {

  final _a11y = AccessibilityService.instance;

  @override
  Widget build(BuildContext context) {
    return ListenableBuilder(
      listenable: _a11y,
      builder: (context, _) => Scaffold(
        backgroundColor: const Color(0xFFF7F8FC),
        appBar: AppBar(
          backgroundColor: Colors.white,
          elevation: 0,
          leading: IconButton(
            icon: const Icon(Icons.arrow_back, color: Colors.black54),
            onPressed: () => Navigator.pop(context),
          ),
          title: const Text('Accessibility',
              style: TextStyle(
                  color: Color(0xFF1A237E),
                  fontWeight: FontWeight.bold,
                  fontSize: 18)),
        ),
        body: ListView(
          padding: const EdgeInsets.all(20),
          children: [

            // ── EASY READ MODE ──────────────────────────────────────────────
            _sectionHeader(Icons.auto_awesome_outlined,
                'Easy Read Mode',
                'For patients who have difficulty reading',
                Colors.orange),
            const SizedBox(height: 12),

            _toggleCard(
              icon: Icons.auto_awesome, iconColor: Colors.orange,
              title: 'Easy Read Mode',
              subtitle: 'Large colored icons, audio on tap, big buttons',
              value: _a11y.illiteracyMode,
              onChanged: (v) async {
                await _a11y.setIlliteracyMode(v);
                if (v) await _a11y.speak('Easy read mode enabled.');
              },
            ),

            if (_a11y.illiteracyMode) ...[
              const SizedBox(height: 10),
              _infoBanner(Icons.info_outline,
                  'Notifications show large colored icons and medication name. '
                  'Tap any card to hear it read aloud.',
                  Colors.orange),
              const SizedBox(height: 10),
              _testButton(),
            ],

            const SizedBox(height: 28),

            // ── VISUAL IMPAIRMENT MODE ──────────────────────────────────────
            _sectionHeader(Icons.remove_red_eye_outlined,
                'Visual Impairment Mode',
                'For patients with low vision or blindness',
                Colors.blue),
            const SizedBox(height: 12),

            _toggleCard(
              icon: Icons.accessibility_new, iconColor: Colors.blue,
              title: 'Visual Impairment Mode',
              subtitle: 'High contrast, large text, voice reading, vibrations',
              value: _a11y.visualImpairmentMode,
              onChanged: (v) async {
                await _a11y.setVisualImpairmentMode(v);
                if (v) await _a11y.speak('Visual impairment mode enabled.');
              },
            ),

            if (_a11y.visualImpairmentMode) ...[
              const SizedBox(height: 10),
              _infoBanner(Icons.info_outline,
                  'High contrast dark theme. Tap any notification card '
                  'to hear it read aloud.',
                  Colors.blue),
            ],

            const SizedBox(height: 28),

            // ── FONT SIZE ───────────────────────────────────────────────────
            _sectionHeader(Icons.text_fields_outlined,
                'Text Size',
                'Adjust text size across accessibility cards',
                Colors.teal),
            const SizedBox(height: 12),

            _fontSizeCard(),

            const SizedBox(height: 40),
          ],
        ),
      ),
    );
  }

  // ── FONT SIZE CARD ──────────────────────────────────────────────────────────

  Widget _fontSizeCard() {
    final scale = _a11y.textScaleFactor;
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.grey.shade200),
        boxShadow: [
          BoxShadow(color: Colors.black.withOpacity(0.04),
              blurRadius: 8, offset: const Offset(0, 3)),
        ],
      ),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [

        // Preview text
        Container(
          width: double.infinity,
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.teal.withOpacity(0.06),
            borderRadius: BorderRadius.circular(12),
          ),
          child: Text(
            'Take your medication now',
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 16 * scale,
              fontWeight: FontWeight.bold,
              color: const Color(0xFF1A237E),
            ),
          ),
        ),

        const SizedBox(height: 20),

        // Slider
        Row(children: [
          const Text('A', style: TextStyle(fontSize: 13, color: Colors.grey)),
          Expanded(
            child: SliderTheme(
              data: SliderTheme.of(context).copyWith(
                activeTrackColor: Colors.teal,
                inactiveTrackColor: Colors.teal.withOpacity(0.2),
                thumbColor: Colors.teal,
                overlayColor: Colors.teal.withOpacity(0.1),
                thumbShape: const RoundSliderThumbShape(enabledThumbRadius: 10),
                trackHeight: 4,
              ),
              child: Slider(
                value: scale,
                min: 1.0,
                max: 1.6,
                divisions: 6,
                onChanged: (v) => _a11y.setTextScaleFactor(v),
              ),
            ),
          ),
          const Text('A', style: TextStyle(fontSize: 22, color: Colors.grey,
              fontWeight: FontWeight.bold)),
        ]),

        // Labels
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 12),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: ['100%', '110%', '120%', '130%', '140%', '150%', '160%']
                .map((l) => Text(l,
                    style: TextStyle(
                      fontSize: 9,
                      color: l == '${(scale * 100).round()}%'
                          ? Colors.teal
                          : Colors.grey.shade400,
                      fontWeight: l == '${(scale * 100).round()}%'
                          ? FontWeight.bold
                          : FontWeight.normal,
                    )))
                .toList(),
          ),
        ),

        const SizedBox(height: 12),

        // Current value badge
        Center(
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
            decoration: BoxDecoration(
              color: Colors.teal.withOpacity(0.1),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Text(
              'Text size: ${(scale * 100).round()}%',
              style: const TextStyle(
                  color: Colors.teal,
                  fontWeight: FontWeight.bold,
                  fontSize: 13),
            ),
          ),
        ),
      ]),
    );
  }

  // ── TEST BUTTON ─────────────────────────────────────────────────────────────

  Widget _testButton() {
    return GestureDetector(
      onTap: () async {
        await _a11y.vibrateForStage('MAIN');
        await _a11y.speak('It is time to take your medication.');
      },
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.symmetric(vertical: 14),
        decoration: BoxDecoration(
          color: Colors.orange.shade50,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: Colors.orange.shade200),
        ),
        child: Row(mainAxisAlignment: MainAxisAlignment.center, children: [
          Icon(Icons.volume_up, color: Colors.orange.shade700, size: 20),
          const SizedBox(width: 10),
          Text('Test audio',
              style: TextStyle(
                  color: Colors.orange.shade700,
                  fontWeight: FontWeight.bold,
                  fontSize: 15)),
        ]),
      ),
    );
  }

  // ── HELPERS ─────────────────────────────────────────────────────────────────

  Widget _sectionHeader(IconData icon, String title, String subtitle, Color color) {
    return Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Container(
        padding: const EdgeInsets.all(10),
        decoration: BoxDecoration(
            color: color.withOpacity(0.1),
            borderRadius: BorderRadius.circular(12)),
        child: Icon(icon, color: color, size: 22),
      ),
      const SizedBox(width: 12),
      Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start,
          children: [
        Text(title, style: const TextStyle(
            fontSize: 16, fontWeight: FontWeight.bold,
            color: Color(0xFF1A237E))),
        Text(subtitle,
            style: TextStyle(fontSize: 12, color: Colors.grey.shade500)),
      ])),
    ]);
  }

  Widget _toggleCard({
    required IconData icon, required Color iconColor,
    required String title, required String subtitle,
    required bool value, required Future<void> Function(bool) onChanged,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
            color: value ? iconColor.withOpacity(0.3) : Colors.grey.shade200,
            width: value ? 1.5 : 1),
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.04),
            blurRadius: 8, offset: const Offset(0, 3))],
      ),
      child: SwitchListTile(
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        secondary: Container(
          padding: const EdgeInsets.all(10),
          decoration: BoxDecoration(color: iconColor.withOpacity(0.1),
              borderRadius: BorderRadius.circular(12)),
          child: Icon(icon, color: iconColor, size: 22),
        ),
        title: Text(title, style: const TextStyle(
            fontWeight: FontWeight.bold, fontSize: 15,
            color: Color(0xFF1A237E))),
        subtitle: Text(subtitle, style: TextStyle(
            fontSize: 12, color: Colors.grey.shade500, height: 1.4)),
        value: value,
        activeColor: iconColor,
        onChanged: onChanged,
      ),
    );
  }

  Widget _infoBanner(IconData icon, String text, Color color) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: color.withOpacity(0.08),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: color.withOpacity(0.2)),
      ),
      child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Icon(icon, size: 16, color: color),
        const SizedBox(width: 10),
        Expanded(child: Text(text, style: TextStyle(
            fontSize: 12, color: color.withOpacity(0.9), height: 1.5))),
      ]),
    );
  }
}