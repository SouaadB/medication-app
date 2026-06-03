import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../services/language_service.dart';
import '../config/api_config.dart';

class RewardsPage extends StatefulWidget {
  const RewardsPage({super.key});

  @override
  State<RewardsPage> createState() => _RewardsPageState();
}

class _RewardsPageState extends State<RewardsPage> {
  Map<String, dynamic>? _rewardsData;
  bool _isLoading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _fetchRewardsStatus();
  }

  Future<void> _fetchRewardsStatus() async {
    setState(() {
      _isLoading = true;
      _error = null;
    });
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');

      final response = await http.get(
        Uri.parse('${ApiConfig.baseUrl}/rewards/status'),
        headers: {'Authorization': 'Bearer $token'},
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data['success'] == true) {
          setState(() => _rewardsData = data);
        } else {
          setState(() => _error = data['message'] ?? 'Unknown error');
        }
      } else {
        setState(() => _error = 'Server error: ${response.statusCode}');
      }
    } catch (e) {
      setState(() => _error = 'Connection error');
      debugPrint('Error fetching rewards: $e');
    } finally {
      setState(() => _isLoading = false);
    }
  }

  // ── Data helpers ────────────────────────────────────────────────────────────

  int get _level => _rewardsData?['level'] ?? 1;
  int get _points => _rewardsData?['points'] ?? 0;
  int get _streak => _rewardsData?['current_streak'] ?? 0;
  String get _badgeTier => _rewardsData?['badge_tier'] ?? 'none';

  List<dynamic> get _allAchievements =>
      _rewardsData?['all_achievements'] ?? [];

  Map<String, dynamic> get _weekly =>
      Map<String, dynamic>.from(_rewardsData?['weekly_progress'] ?? {});

  Map<String, dynamic> get _impact =>
      Map<String, dynamic>.from(_rewardsData?['impact'] ?? {});

  Map<String, dynamic> get _motivation =>
      Map<String, dynamic>.from(_rewardsData?['motivation'] ?? {});

  // ── UI helpers ──────────────────────────────────────────────────────────────

  Color _getCategoryColor(String? type) {
    switch (type) {
      case 'STREAK_DAYS':     return Colors.orange;
      case 'TOTAL_INTAKES':   return Colors.green;
      case 'PERFECT_WEEK':    return Colors.amber.shade700;
      case 'FIRST_MEDICATION':return Colors.blue;
      case 'KNOWLEDGE_SEEKER':return Colors.teal;
      case 'EARLY_BIRD':      return Colors.orange.shade300;
      case 'ADHERENCE_MONTH': return Colors.purple;
      default:                return Colors.purple;
    }
  }

  String _levelTitle(int level) {
    if (level >= 10) return 'Platinum Champion';
    if (level >= 7)  return 'Gold Champion';
    if (level >= 4)  return 'Silver Champion';
    if (level >= 2)  return 'Bronze Champion';
    return 'Health Starter';
  }

  // ── Build ───────────────────────────────────────────────────────────────────

  @override
  Widget build(BuildContext context) {
    final lang = Provider.of<LanguageService>(context);
    final isFr = lang.getCurrentLanguage() == 'fr';

    if (_isLoading) {
      return Scaffold(
        backgroundColor: const Color(0xFFF8F9FE),
        appBar: _buildAppBar(lang),
        body: const Center(child: CircularProgressIndicator()),
      );
    }

    if (_error != null) {
      return Scaffold(
        backgroundColor: const Color(0xFFF8F9FE),
        appBar: _buildAppBar(lang),
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(Icons.error_outline, size: 60, color: Colors.red.shade200),
              const SizedBox(height: 16),
              Text(_error!, style: TextStyle(color: Colors.grey.shade500)),
              const SizedBox(height: 16),
              ElevatedButton.icon(
                onPressed: _fetchRewardsStatus,
                icon: const Icon(Icons.refresh),
                label: Text(isFr ? 'Réessayer' : 'Retry'),
              ),
            ],
          ),
        ),
      );
    }

    return Scaffold(
      backgroundColor: const Color(0xFFF8F9FE),
      appBar: _buildAppBar(lang),
      body: RefreshIndicator(
        onRefresh: _fetchRewardsStatus,
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          child: Column(
            children: [
              _buildHeader(),
              Padding(
                padding: const EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // This Week
                    _buildSectionTitle(isFr ? 'Cette semaine' : 'This Week',
                        '${_weekly['progress_pct'] ?? 0}% ${isFr ? 'Complété' : 'Complete'}'),
                    const SizedBox(height: 16),
                    _buildWeeklyProgress(),

                    const SizedBox(height: 32),

                    // Badges
                    _buildSectionTitle(isFr ? 'Badges' : 'Achievement Badges', ''),
                    const SizedBox(height: 16),
                    _buildBadgeRow(),

                    const SizedBox(height: 32),

                    // Achievements list
                    _buildSectionTitle(isFr ? 'Réalisations' : 'Achievements', ''),
                    const SizedBox(height: 16),
                    ..._allAchievements.map((a) => _buildAchievementCard(a, isFr)).toList(),

                    const SizedBox(height: 32),

                    // Your Impact
                    _buildImpactCard(isFr),

                    const SizedBox(height: 24),

                    // Motivation footer
                    _buildMotivationCard(),

                    const SizedBox(height: 40),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  AppBar _buildAppBar(LanguageService lang) {
    return AppBar(
      backgroundColor: const Color(0xFF3498DB),
      elevation: 0,
      leading: IconButton(
        icon: const Icon(Icons.arrow_back, color: Colors.white),
        onPressed: () => Navigator.pop(context),
      ),
      title: Text(
        lang.translate('rewardsAchievements'),
        style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
      ),
      centerTitle: true,
    );
  }

  // ── Header ──────────────────────────────────────────────────────────────────

  Widget _buildHeader() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.fromLTRB(24, 8, 24, 28),
      decoration: const BoxDecoration(
        color: Color(0xFF3498DB),
        borderRadius: BorderRadius.only(
          bottomLeft: Radius.circular(32),
          bottomRight: Radius.circular(32),
        ),
      ),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                'Level $_level',
                style: const TextStyle(
                    color: Colors.white, fontSize: 32, fontWeight: FontWeight.bold),
              ),
              const SizedBox(width: 12),
              const Icon(Icons.stars, color: Colors.amber, size: 36),
            ],
          ),
          Text(
            _levelTitle(_level),
            style: const TextStyle(color: Colors.white70, fontSize: 16),
          ),
          const SizedBox(height: 24),
          Row(
            children: [
              _buildHeaderStat(
                  'Daily Streak', '$_streak Days',
                  Icons.local_fire_department, Colors.orange),
              const SizedBox(width: 16),
              _buildHeaderStat(
                  'Points', _points.toString(),
                  Icons.monetization_on, Colors.amber),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildHeaderStat(
      String label, String value, IconData icon, Color color) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(20),
        ),
        child: Row(
          children: [
            Icon(icon, color: color, size: 24),
            const SizedBox(width: 12),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(label,
                    style: const TextStyle(fontSize: 12, color: Colors.grey)),
                Text(value,
                    style: const TextStyle(
                        fontSize: 16, fontWeight: FontWeight.bold)),
              ],
            ),
          ],
        ),
      ),
    );
  }

  // ── Weekly progress ─────────────────────────────────────────────────────────

  Widget _buildWeeklyProgress() {
    final days = List<Map<String, dynamic>>.from(_weekly['days'] ?? []);
    final progressPct = (_weekly['progress_pct'] ?? 0) / 100.0;

    // Fallback: show 7 empty days if no data
    if (days.isEmpty) {
      for (int i = 0; i < 7; i++) {
        days.add({'day_label': ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][i],
          'completed': false, 'has_data': false, 'is_today': i == 6});
      }
    }

    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(
              color: Colors.black.withOpacity(0.03),
              blurRadius: 10,
              offset: const Offset(0, 4)),
        ],
      ),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: days.map((day) {
              final completed = day['completed'] == true;
              final hasData   = day['has_data'] == true;
              final isToday   = day['is_today'] == true;

              return Column(
                children: [
                  Container(
                    width: 36,
                    height: 36,
                    decoration: BoxDecoration(
                      color: completed
                          ? Colors.green.shade50
                          : isToday
                              ? Colors.blue.shade50
                              : Colors.grey.shade50,
                      shape: BoxShape.circle,
                      border: Border.all(
                        color: completed
                            ? Colors.green.shade200
                            : isToday
                                ? Colors.blue.shade200
                                : Colors.grey.shade200,
                      ),
                    ),
                    child: Icon(
                      completed
                          ? Icons.check_circle
                          : hasData
                              ? Icons.cancel
                              : Icons.circle_outlined,
                      color: completed
                          ? Colors.green
                          : hasData
                              ? Colors.red.shade300
                              : Colors.grey.shade400,
                      size: 20,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    (day['day_label'] ?? '').toString(),
                    style: TextStyle(
                      fontSize: 12,
                      color: isToday ? Colors.blue : Colors.black87,
                      fontWeight:
                          isToday ? FontWeight.bold : FontWeight.normal,
                    ),
                  ),
                ],
              );
            }).toList(),
          ),
          const SizedBox(height: 20),
          ClipRRect(
            borderRadius: BorderRadius.circular(10),
            child: LinearProgressIndicator(
              value: progressPct,
              minHeight: 8,
              backgroundColor: Colors.blue.shade50,
              valueColor:
                  const AlwaysStoppedAnimation<Color>(Color(0xFF3498DB)),
            ),
          ),
        ],
      ),
    );
  }

  // ── Badges ──────────────────────────────────────────────────────────────────

  Widget _buildBadgeRow() {
    final tiers = ['bronze', 'silver', 'gold', 'platinum'];
    final emojis = ['🥉', '🥈', '🥇', '💎'];
    final colors = [
      Colors.orange.shade800,
      Colors.blueGrey.shade400,
      Colors.amber.shade700,
      Colors.blue.shade300,
    ];
    final thresholds = [100, 500, 1000, 2500];

    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: List.generate(4, (i) {
        final unlocked = _points >= thresholds[i];
        return _buildBadge(
          tiers[i][0].toUpperCase() + tiers[i].substring(1),
          emojis[i],
          colors[i],
          unlocked,
        );
      }),
    );
  }

  Widget _buildBadge(
      String label, String emoji, Color color, bool unlocked) {
    return Column(
      children: [
        Container(
          width: 70,
          height: 70,
          decoration: BoxDecoration(
            color: unlocked ? Colors.white : Colors.grey.shade100,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(
              color: unlocked ? color.withOpacity(0.5) : Colors.grey.shade300,
              width: 2,
            ),
            boxShadow: unlocked
                ? [
                    BoxShadow(
                        color: color.withOpacity(0.15),
                        blurRadius: 10,
                        offset: const Offset(0, 4))
                  ]
                : [],
          ),
          child: Center(
            child: Opacity(
              opacity: unlocked ? 1.0 : 0.3,
              child: Text(emoji, style: const TextStyle(fontSize: 32)),
            ),
          ),
        ),
        const SizedBox(height: 8),
        Text(
          label,
          style: TextStyle(
            fontSize: 12,
            fontWeight:
                unlocked ? FontWeight.bold : FontWeight.normal,
            color: unlocked ? Colors.black87 : Colors.grey,
          ),
        ),
      ],
    );
  }

  // ── Achievement card ─────────────────────────────────────────────────────────

  Widget _buildAchievementCard(
      Map<String, dynamic> achievement, bool isFr) {
    final bool unlocked   = achievement['is_unlocked'] == true;
    final int  current    = achievement['progress_current'] ?? 0;
    final int  target     = achievement['progress_target'] ?? 1;
    final double pct      = (achievement['progress_pct'] ?? 0) / 100.0;
    final color           = _getCategoryColor(achievement['criteria_type']);
    final String icon     = achievement['icon_emoji'] ?? '🏆';
    final String title    = achievement['title'] ?? '';
    final String desc     = achievement['description'] ?? '';
    final String? earnedAt= achievement['earned_at'];

    String footerText;
    if (unlocked) {
      footerText = earnedAt != null
          ? (isFr ? 'Débloqué le ${_formatDate(earnedAt)}' : 'Unlocked on ${_formatDate(earnedAt)}')
          : (isFr ? 'Débloqué !' : 'Unlocked!');
    } else {
      footerText = isFr
          ? 'Progrès : $current / $target'
          : 'Progress: $current / $target';
    }

    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color:
              unlocked ? Colors.green.shade100 : Colors.grey.shade100,
        ),
        boxShadow: [
          BoxShadow(
              color: Colors.black.withOpacity(0.02),
              blurRadius: 10,
              offset: const Offset(0, 4)),
        ],
      ),
      child: Row(
        children: [
          // Icon circle
          Container(
            width: 56,
            height: 56,
            decoration: BoxDecoration(
              color: color.withOpacity(0.1),
              shape: BoxShape.circle,
            ),
            child: Center(
                child: Text(icon,
                    style: const TextStyle(fontSize: 28))),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Title + lock/unlock indicator
                Row(
                  children: [
                    Expanded(
                      child: Text(title,
                          style: const TextStyle(
                              fontWeight: FontWeight.bold,
                              fontSize: 16)),
                    ),
                    if (unlocked)
                      const Icon(Icons.emoji_events,
                          color: Colors.amber, size: 18),
                  ],
                ),
                Text(desc,
                    style: TextStyle(
                        color: Colors.grey.shade600, fontSize: 12)),
                const SizedBox(height: 12),
                // Progress bar (always shown — full if unlocked)
                ClipRRect(
                  borderRadius: BorderRadius.circular(4),
                  child: LinearProgressIndicator(
                    value: pct,
                    minHeight: 6,
                    backgroundColor: color.withOpacity(0.1),
                    valueColor:
                        AlwaysStoppedAnimation<Color>(color),
                  ),
                ),
                const SizedBox(height: 8),
                // Footer
                Row(
                  children: [
                    if (unlocked) ...[
                      Icon(Icons.check_circle,
                          color: Colors.green.shade400, size: 14),
                      const SizedBox(width: 4),
                    ],
                    Text(
                      footerText,
                      style: TextStyle(
                        color: unlocked
                            ? Colors.green.shade700
                            : Colors.grey.shade500,
                        fontSize: 11,
                        fontWeight: unlocked
                            ? FontWeight.bold
                            : FontWeight.normal,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // ── Impact card ──────────────────────────────────────────────────────────────

  Widget _buildImpactCard(bool isFr) {
    final longestStreak = _impact['longest_streak'] ?? 0;
    final improvement   = _impact['health_improvement'] ?? 0;
    final onTimePct     = _impact['medications_on_time_pct'] ?? 0;

    final improvementStr = improvement > 0
        ? '+$improvement%'
        : improvement < 0
            ? '$improvement%'
            : '0%';

    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.purple.shade50,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: Colors.purple.shade100),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(Icons.auto_graph, color: Colors.purple),
              const SizedBox(width: 12),
              Text(
                isFr ? 'Votre Impact' : 'Your Impact',
                style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: Colors.purple),
              ),
            ],
          ),
          const SizedBox(height: 16),
          _buildImpactRow(
            isFr ? 'Meilleure série' : 'Longest streak',
            '$longestStreak ${isFr ? 'jours' : 'days'} 🔥',
          ),
          _buildImpactRow(
            isFr ? 'Amélioration santé' : 'Health improvement',
            '$improvementStr 📈',
          ),
          _buildImpactRow(
            isFr ? 'Médicaments à l\'heure' : 'Medications on time',
            '$onTimePct% ⏰',
          ),
        ],
      ),
    );
  }

  Widget _buildImpactRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label,
              style: TextStyle(color: Colors.purple.shade700, fontSize: 14)),
          Text(value,
              style: const TextStyle(
                  fontWeight: FontWeight.bold, fontSize: 14)),
        ],
      ),
    );
  }

  // ── Motivation footer ────────────────────────────────────────────────────────

  Widget _buildMotivationCard() {
    final emoji   = _motivation['emoji']   ?? '🎉';
    final title   = _motivation['title']   ?? 'Keep Going!';
    final message = _motivation['message'] ?? "You're doing amazing!";

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(
              color: Colors.black.withOpacity(0.05),
              blurRadius: 10,
              offset: const Offset(0, 4)),
        ],
      ),
      child: Column(
        children: [
          Text(emoji, style: const TextStyle(fontSize: 40)),
          const SizedBox(height: 12),
          Text(title,
              style: const TextStyle(
                  fontSize: 20, fontWeight: FontWeight.bold)),
          const SizedBox(height: 8),
          Text(
            message,
            textAlign: TextAlign.center,
            style:
                TextStyle(color: Colors.grey.shade600, fontSize: 14),
          ),
        ],
      ),
    );
  }

  // ── Section title ────────────────────────────────────────────────────────────

  Widget _buildSectionTitle(String title, String subtitle) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          title,
          style: const TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
              color: Color(0xFF1A237E)),
        ),
        if (subtitle.isNotEmpty)
          Container(
            padding: const EdgeInsets.symmetric(
                horizontal: 12, vertical: 4),
            decoration: BoxDecoration(
              color: Colors.green.shade50,
              borderRadius: BorderRadius.circular(12),
            ),
            child: Text(
              subtitle,
              style: TextStyle(
                  color: Colors.green.shade700,
                  fontSize: 12,
                  fontWeight: FontWeight.bold),
            ),
          ),
      ],
    );
  }

  // ── Helpers ──────────────────────────────────────────────────────────────────

  String _formatDate(String isoDate) {
    try {
      final dt = DateTime.parse(isoDate);
      return '${dt.day}/${dt.month}/${dt.year}';
    } catch (_) {
      return isoDate;
    }
  }
}