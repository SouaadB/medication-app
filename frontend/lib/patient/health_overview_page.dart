import 'dart:async';
import 'dart:math' as math;
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/health_service.dart';
import '../services/language_service.dart';
import 'condition_detail_page.dart';
import '../patient/early_warning_card.dart';

class HealthOverviewPage extends StatefulWidget {
  const HealthOverviewPage({super.key});

  @override
  State<HealthOverviewPage> createState() => _HealthOverviewPageState();
}

class _HealthOverviewPageState extends State<HealthOverviewPage>
    with SingleTickerProviderStateMixin {
  bool _isLoading = true;
  String? _errorMessage;

  int _overallAdherence = 0;
  int _activeConditions = 0;
  int _currentStreak    = 0;
  List<dynamic> _achievements = [];
  List<dynamic> _conditions   = [];

  late AnimationController _animCtrl;
  late Animation<double>   _ringAnim;

  @override
  void initState() {
    super.initState();
    _animCtrl = AnimationController(vsync: this, duration: const Duration(milliseconds: 1200));
    _ringAnim = Tween<double>(begin: 0, end: 1).animate(
        CurvedAnimation(parent: _animCtrl, curve: Curves.easeOutCubic));
    _loadDashboardData();
  }

  @override
  void dispose() {
    _animCtrl.dispose();
    super.dispose();
  }

  // ── data ───────────────────────────────────────────────────────────────────

  Future<void> _loadDashboardData() async {
    setState(() { _isLoading = true; _errorMessage = null; });
    try {
      final data = await HealthService.getDashboard();
      setState(() {
        _overallAdherence = int.tryParse(data['overallAdherence']?.toString() ?? '0') ?? 0;
        _activeConditions = int.tryParse(data['activeConditions']?.toString() ?? '0') ?? 0;
        _currentStreak    = int.tryParse(data['currentStreak']?.toString() ?? '0') ?? 0;
        _achievements     = data['achievements'] ?? [];
        _conditions       = data['conditions']   ?? [];
        _isLoading        = false;
      });
      _animCtrl.forward(from: 0);
    } catch (e) {
      setState(() { _errorMessage = e.toString(); _isLoading = false; });
    }
  }

  // ── helpers ────────────────────────────────────────────────────────────────

  Color _adherenceColor(int pct) {
    if (pct >= 80) return const Color(0xFF639922);
    if (pct >= 50) return const Color(0xFFBA7517);
    return const Color(0xFFE24B4A);
  }

  Color _adherenceBg(int pct) {
    if (pct >= 80) return const Color(0xFFEAF3DE);
    if (pct >= 50) return const Color(0xFFFAEEDA);
    return const Color(0xFFFCEBEB);
  }

  String _adherenceLabel(int pct) {
    if (pct >= 80) return 'Excellent';
    if (pct >= 50) return 'Fair';
    return 'Needs improvement';
  }

  // streak next milestone
  ({int next, int daysLeft, double progress}) _streakMilestone() {
    const milestones = [3, 7, 14, 30];
    for (final m in milestones) {
      if (_currentStreak < m) {
        final prev = milestones.indexOf(m) == 0 ? 0 : milestones[milestones.indexOf(m) - 1];
        final progress = ((_currentStreak - prev) / (m - prev)).clamp(0.0, 1.0);
        return (next: m, daysLeft: m - _currentStreak, progress: progress);
      }
    }
    return (next: 30, daysLeft: 0, progress: 1.0);
  }

  // condition icon + bg color — same logic as conditions_list_page
  String _iconForCondition(String name) {
    final n = name.toLowerCase();
    if (n.contains('diabetes'))    return '🩸';
    if (n.contains('hypertension') || n.contains('heart failure')) return '❤️';
    if (n.contains('heart') || n.contains('cardio') || n.contains('coronary')) return '🫀';
    if (n.contains('asthma') || n.contains('copd') || n.contains('bronch')) return '🫁';
    if (n.contains('thyroid'))     return '🦋';
    if (n.contains('arthritis') || n.contains('arthrose')) return '🦵';
    if (n.contains('osteoporosis') || n.contains('bone')) return '🦴';
    if (n.contains('kidney') || n.contains('renal'))   return '🫘';
    if (n.contains('alzheimer') || n.contains('parkinson')) return '🧠';
    if (n.contains('depression') || n.contains('anxiety')) return '🌧️';
    if (n.contains('insomnia'))    return '🌙';
    if (n.contains('cholesterol')) return '🫀';
    if (n.contains('stroke') || n.contains('avc')) return '🧠';
    if (n.contains('cancer'))      return '🎗️';
    if (n.contains('glaucoma') || n.contains('cataract')) return '👁️';
    if (n.contains('gout') || n.contains('goutte')) return '🦶';
    if (n.contains('obesity'))     return '⚖️';
    if (n.contains('tuberculosis')) return '🫁';
    if (n.contains('hepat') || n.contains('liver')) return '🟤';
    if (n.contains('epilep'))      return '⚡';
    if (n.contains('migraine'))    return '🤕';
    if (n.contains('psoriasis') || n.contains('eczema')) return '🧴';
    return '💊';
  }

  Color _bgColorForCondition(String name) {
    final n = name.toLowerCase();
    if (n.contains('diabetes'))    return const Color(0xFFFAEEDA);
    if (n.contains('hypertension') || n.contains('heart')) return const Color(0xFFE6F1FB);
    if (n.contains('asthma') || n.contains('copd')) return const Color(0xFFEAF3DE);
    if (n.contains('thyroid'))     return const Color(0xFFEEEDFE);
    if (n.contains('arthritis') || n.contains('osteo')) return const Color(0xFFF1EFE8);
    if (n.contains('kidney'))      return const Color(0xFFE1F5EE);
    if (n.contains('depression') || n.contains('mental') || n.contains('alzheimer')) return const Color(0xFFFBEAF0);
    if (n.contains('cancer'))      return const Color(0xFFFCEBEB);
    return const Color(0xFFEEEDFE);
  }

  int _parseAdherence(dynamic val) => int.tryParse(val?.toString() ?? '0') ?? 0;

  String _translateConditionName(String name, LanguageService lang) {
    switch (name) {
      case 'Diabetes Type 1':    return lang.translate('diabetesType1');
      case 'Diabetes Type 2':    return lang.translate('diabetesType2');
      case 'Hypertension':       return lang.translate('hypertension');
      case 'Asthma':             return lang.translate('asthma');
      case 'Heart Disease':      return lang.translate('heartDisease');
      case 'High Cholesterol':   return lang.translate('cholesterol');
      case 'COPD':               return lang.translate('copd');
      case 'Arthritis':          return lang.translate('arthritis');
      case 'Thyroid Disorder':   return lang.translate('thyroidDisorder');
      default: return name;
    }
  }

  // ── BUILD ──────────────────────────────────────────────────────────────────

  @override
  Widget build(BuildContext context) {
    final lang = Provider.of<LanguageService>(context);

    if (_isLoading) {
      return Scaffold(
        backgroundColor: const Color(0xFFF7F8FC),
        appBar: _appBar(lang),
        body: const Center(child: CircularProgressIndicator()),
      );
    }

    if (_errorMessage != null) {
      return Scaffold(
        backgroundColor: const Color(0xFFF7F8FC),
        appBar: _appBar(lang),
        body: Center(child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
          const Icon(Icons.error_outline, color: Colors.red, size: 60),
          const SizedBox(height: 16),
          Text('Error: $_errorMessage', textAlign: TextAlign.center),
          const SizedBox(height: 16),
          ElevatedButton(
            onPressed: _loadDashboardData,
            style: ElevatedButton.styleFrom(backgroundColor: Colors.blue, foregroundColor: Colors.white),
            child: Text(lang.translate('retry')),
          ),
        ])),
      );
    }

    return Scaffold(
      backgroundColor: const Color(0xFFF7F8FC),
      appBar: _appBar(lang),
      body: RefreshIndicator(
        onRefresh: _loadDashboardData,
        color: Colors.blue,
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          padding: const EdgeInsets.fromLTRB(16, 0, 16, 30),
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [

            // ── hero adherence ring ───────────────────────────────────────
            _buildAdherenceHero(lang),
            const SizedBox(height: 16),

            // ── streak card ───────────────────────────────────────────────
             
           _buildStreakCard(lang),
           const SizedBox(height: 16),

           // ── AI early warning ──────────────────────────────────────────
           const EarlyWarningCard(),
           const SizedBox(height: 16),

           // ── stats row ─────────────────────────────────────────────────
              _buildStatsRow(lang),
            const SizedBox(height: 24),

            // ── achievements ──────────────────────────────────────────────
            if (_achievements.isNotEmpty) ...[
              _sectionTitle(lang.translate('achievements'), Icons.emoji_events_outlined, Colors.purple),
              const SizedBox(height: 12),
              _buildAchievements(),
              const SizedBox(height: 24),
            ],

            // ── conditions ────────────────────────────────────────────────
            _sectionTitle(lang.translate('medicalConditions'), Icons.medical_information_outlined, Colors.blue),
            const SizedBox(height: 12),
            _buildConditions(lang),
          ]),
        ),
      ),
    );
  }

  AppBar _appBar(LanguageService lang) {
    return AppBar(
      backgroundColor: Colors.white,
      elevation: 0,
      leading: IconButton(
        icon: const Icon(Icons.arrow_back, color: Colors.black54),
        onPressed: () => Navigator.pop(context),
      ),
      title: Text(lang.translate('healthOverview'),
          style: const TextStyle(color: Color(0xFF1A237E), fontWeight: FontWeight.bold, fontSize: 18)),
      actions: [
        Container(
          margin: const EdgeInsets.only(right: 16),
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(color: Colors.blue.withOpacity(0.1), shape: BoxShape.circle),
          child: const Icon(Icons.favorite, color: Colors.blue, size: 22),
        ),
      ],
    );
  }

  Widget _sectionTitle(String title, IconData icon, Color color) {
    return Row(children: [
      Icon(icon, size: 20, color: color),
      const SizedBox(width: 8),
      Text(title, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFF1A237E))),
    ]);
  }

  // ── ADHERENCE HERO ─────────────────────────────────────────────────────────

  Widget _buildAdherenceHero(LanguageService lang) {
    final color = _adherenceColor(_overallAdherence);
    final bg    = _adherenceBg(_overallAdherence);
    final label = _adherenceLabel(_overallAdherence);

    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 16, offset: const Offset(0, 6))],
      ),
      child: Row(children: [

        // animated ring
        AnimatedBuilder(
          animation: _ringAnim,
          builder: (_, __) => SizedBox(
            width: 110, height: 110,
            child: CustomPaint(
              painter: _RingPainter(
                progress: (_overallAdherence / 100) * _ringAnim.value,
                color: color,
                bgColor: bg,
              ),
              child: Center(child: Column(mainAxisSize: MainAxisSize.min, children: [
                Text('$_overallAdherence%',
                    style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: color)),
                Text(label, style: TextStyle(fontSize: 10, color: color.withOpacity(0.8))),
              ])),
            ),
          ),
        ),

        const SizedBox(width: 20),

        // text info
        Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text(lang.translate('overallAdherence'),
              style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Color(0xFF1A237E))),
          const SizedBox(height: 6),
          Text(lang.translate('healthSnapshot'),
              style: TextStyle(fontSize: 13, color: Colors.grey.shade600, height: 1.4)),
          const SizedBox(height: 12),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            decoration: BoxDecoration(color: bg, borderRadius: BorderRadius.circular(20)),
            child: Row(mainAxisSize: MainAxisSize.min, children: [
              Icon(
                _overallAdherence >= 80 ? Icons.trending_up :
                _overallAdherence >= 50 ? Icons.trending_flat : Icons.trending_down,
                size: 16, color: color,
              ),
              const SizedBox(width: 4),
              Text(label, style: TextStyle(fontSize: 12, color: color, fontWeight: FontWeight.bold)),
            ]),
          ),
        ])),
      ]),
    );
  }

  // ── STREAK CARD ────────────────────────────────────────────────────────────

  Widget _buildStreakCard(LanguageService lang) {
    final milestone = _streakMilestone();
    final atMax     = _currentStreak >= 30;

    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 12, offset: const Offset(0, 4))],
      ),
      child: Row(children: [
        // fire icon
        Container(
          width: 52, height: 52,
          decoration: BoxDecoration(color: const Color(0xFFFAEEDA), borderRadius: BorderRadius.circular(14)),
          child: const Center(child: Text('🔥', style: TextStyle(fontSize: 24))),
        ),
        const SizedBox(width: 16),

        Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Row(children: [
            Text('$_currentStreak', style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Color(0xFF1A237E))),
            const SizedBox(width: 6),
            Text(
              '${_currentStreak == 1 ? "day" : "days"} streak',
              style: TextStyle(fontSize: 14, color: Colors.grey.shade600),
            ),
          ]),
          const SizedBox(height: 2),
          Text(
            atMax ? '🏆 30+ day streak champion!' :
                '${milestone.daysLeft} more day${milestone.daysLeft == 1 ? "" : "s"} to reach ${milestone.next}-day milestone',
            style: TextStyle(fontSize: 12, color: Colors.grey.shade500),
          ),
          const SizedBox(height: 8),
          ClipRRect(
            borderRadius: BorderRadius.circular(4),
            child: LinearProgressIndicator(
              value: milestone.progress,
              minHeight: 6,
              backgroundColor: const Color(0xFFFAEEDA),
              valueColor: const AlwaysStoppedAnimation<Color>(Color(0xFFBA7517)),
            ),
          ),
        ])),
      ]),
    );
  }

  // ── STATS ROW ──────────────────────────────────────────────────────────────

  Widget _buildStatsRow(LanguageService lang) {
    return Row(children: [
      Expanded(child: _statTile(
        icon: Icons.medical_information_outlined,
        value: '$_activeConditions',
        label: lang.translate('activeConditions'),
        color: Colors.blue,
        onTap: () => Navigator.pushNamed(context, '/conditions'),
      )),
      const SizedBox(width: 12),
      Expanded(child: _statTile(
        icon: Icons.emoji_events_outlined,
        value: '${_achievements.length}',
        label: lang.translate('achievements'),
        color: Colors.purple,
        onTap: null,
      )),
    ]);
  }

Widget _statTile({
  required IconData icon,
  required String value,
  required String label,
  required Color color,
  VoidCallback? onTap,
}) {
  return GestureDetector(
    onTap: onTap,
    child: Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.04), blurRadius: 10, offset: const Offset(0, 4))],
      ),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Row(children: [
          Container(
            width: 38, height: 38,
            decoration: BoxDecoration(color: color.withOpacity(0.1), borderRadius: BorderRadius.circular(10)),
            child: Icon(icon, color: color, size: 20),
          ),
          const Spacer(),
          if (onTap != null)
            Icon(Icons.chevron_right, color: Colors.grey.shade400, size: 16),
        ]),
        const SizedBox(height: 10),
        Text(value, style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: color)),
        const SizedBox(height: 2),
        Text(label,
            style: TextStyle(fontSize: 11, color: Colors.grey.shade600),
            maxLines: 2, overflow: TextOverflow.ellipsis),
      ]),
    ),
  );
}

  // ── ACHIEVEMENTS ───────────────────────────────────────────────────────────

  Widget _buildAchievements() {
    return SizedBox(
      height: 120,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        itemCount: _achievements.length,
        separatorBuilder: (_, __) => const SizedBox(width: 10),
        itemBuilder: (_, i) {
          final a = _achievements[i];
          return Container(
            width: 130,
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: Colors.purple.withOpacity(0.2)),
              boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.03), blurRadius: 8, offset: const Offset(0, 3))],
            ),
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text(a['badge_icon'] ?? '🏆', style: const TextStyle(fontSize: 24)),
              const SizedBox(height: 4),
              Text(a['name'] ?? '', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF1A237E)), maxLines: 1, overflow: TextOverflow.ellipsis),
              const SizedBox(height: 2),
              Text(a['description'] ?? '', style: TextStyle(fontSize: 10, color: Colors.grey.shade500), maxLines: 2, overflow: TextOverflow.ellipsis),
            ]),
          );
        },
      ),
    );
  }

  // ── CONDITIONS ─────────────────────────────────────────────────────────────

  Widget _buildConditions(LanguageService lang) {
    if (_conditions.isEmpty) {
      return Container(
        padding: const EdgeInsets.all(24),
        decoration: BoxDecoration(color: Colors.grey.shade50, borderRadius: BorderRadius.circular(20)),
        child: Column(children: [
          const Icon(Icons.medical_services_outlined, size: 40, color: Colors.grey),
          const SizedBox(height: 12),
          Text(lang.translate('noConditions'), style: TextStyle(color: Colors.grey.shade600)),
          const SizedBox(height: 4),
          Text(lang.translate('addConditionsPrompt'), textAlign: TextAlign.center,
              style: TextStyle(color: Colors.grey.shade500, fontSize: 12)),
        ]),
      );
    }

    return Column(children: [
      ..._conditions.map((condition) {
        final name     = (condition['name'] ?? 'Unknown').toString();
        final pct      = _parseAdherence(condition['adherence_rate']);
        final medCount = int.tryParse(condition['medication_count']?.toString() ?? '0') ?? 0;
        final icon     = _iconForCondition(name);
        final bg       = _bgColorForCondition(name);
        final adColor  = _adherenceColor(pct);
        final adBg     = _adherenceBg(pct);

        return GestureDetector(
          onTap: () => Navigator.push(context, MaterialPageRoute(
            builder: (_) => ConditionDetailPage(condition: {
              'id':         condition['id'],
              'name':       name,
              'percentage': pct,
              'color':      bg,
            }),
          )).then((_) => _loadDashboardData()),
          child: Container(
            margin: const EdgeInsets.only(bottom: 10),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(18),
              border: Border.all(color: Colors.grey.shade100),
              boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.04), blurRadius: 8, offset: const Offset(0, 3))],
            ),
            child: Column(children: [
              // top stripe
              Container(
                height: 4,
                decoration: BoxDecoration(
                  color: adColor,
                  borderRadius: const BorderRadius.vertical(top: Radius.circular(18)),
                ),
              ),
              Padding(
                padding: const EdgeInsets.all(14),
                child: Column(children: [
                  Row(children: [
                    Container(
                      width: 44, height: 44,
                      decoration: BoxDecoration(color: bg, borderRadius: BorderRadius.circular(12)),
                      child: Center(child: Text(icon, style: const TextStyle(fontSize: 20))),
                    ),
                    const SizedBox(width: 12),
                    Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                      Text(_translateConditionName(name, lang),
                          style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: Color(0xFF1A237E))),
                      const SizedBox(height: 4),
                      Row(children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                          decoration: BoxDecoration(color: Colors.grey.shade100, borderRadius: BorderRadius.circular(20)),
                          child: Row(mainAxisSize: MainAxisSize.min, children: [
                            const Icon(Icons.medication_outlined, size: 12, color: Colors.grey),
                            const SizedBox(width: 4),
                            Text('$medCount ${lang.translate('medications')}',
                                style: TextStyle(fontSize: 11, color: Colors.grey.shade600)),
                          ]),
                        ),
                        const SizedBox(width: 6),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                          decoration: BoxDecoration(color: adBg, borderRadius: BorderRadius.circular(20)),
                          child: Text('$pct%',
                              style: TextStyle(fontSize: 11, color: adColor, fontWeight: FontWeight.bold)),
                        ),
                      ]),
                    ])),
                    Icon(Icons.chevron_right, color: Colors.grey.shade400, size: 20),
                  ]),
                  const SizedBox(height: 10),
                  // adherence bar
                  ClipRRect(
                    borderRadius: BorderRadius.circular(4),
                    child: LinearProgressIndicator(
                      value: pct / 100,
                      minHeight: 5,
                      backgroundColor: Colors.grey.shade100,
                      valueColor: AlwaysStoppedAnimation<Color>(adColor),
                    ),
                  ),
                ]),
              ),
            ]),
          ),
        );
      }).toList(),

      const SizedBox(height: 4),
      SizedBox(
        width: double.infinity,
        child: TextButton.icon(
          onPressed: () => Navigator.pushNamed(context, '/conditions'),
          icon: const Icon(Icons.add_circle_outline, size: 18),
          label: Text(lang.translate('viewAllConditions'),
              style: const TextStyle(fontWeight: FontWeight.bold)),
          style: TextButton.styleFrom(foregroundColor: Colors.blue),
        ),
      ),
    ]);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// RING PAINTER — animated adherence arc
// ─────────────────────────────────────────────────────────────────────────────

class _RingPainter extends CustomPainter {
  final double progress;
  final Color  color;
  final Color  bgColor;

  const _RingPainter({required this.progress, required this.color, required this.bgColor});

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final radius = (size.width - 16) / 2;
    const startAngle = -math.pi / 2;
    const fullSweep  = 2 * math.pi;

    // background ring
    canvas.drawArc(
      Rect.fromCircle(center: center, radius: radius),
      startAngle, fullSweep, false,
      Paint()
        ..color  = bgColor
        ..strokeWidth = 10
        ..style  = PaintingStyle.stroke
        ..strokeCap = StrokeCap.round,
    );

    // progress arc
    if (progress > 0) {
      canvas.drawArc(
        Rect.fromCircle(center: center, radius: radius),
        startAngle, fullSweep * progress, false,
        Paint()
          ..color  = color
          ..strokeWidth = 10
          ..style  = PaintingStyle.stroke
          ..strokeCap = StrokeCap.round,
      );
    }
  }

  @override
  bool shouldRepaint(_RingPainter old) =>
      old.progress != progress || old.color != color;
}