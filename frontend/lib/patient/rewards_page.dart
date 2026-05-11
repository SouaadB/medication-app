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

  @override
  void initState() {
    super.initState();
    _fetchRewardsStatus();
  }

  Future<void> _fetchRewardsStatus() async {
    setState(() => _isLoading = true);
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');

      final response = await http.get(
        Uri.parse('${ApiConfig.baseUrl}/rewards/status'),
        headers: {'Authorization': 'Bearer $token'},
      );

      if (response.statusCode == 200) {
        setState(() {
          _rewardsData = jsonDecode(response.body);
        });
      }
    } catch (e) {
      debugPrint('Error fetching rewards: $e');
    } finally {
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final lang = Provider.of<LanguageService>(context);
    
    if (_isLoading) {
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }

    final data = _rewardsData ?? {};
    final int level = data['level'] ?? 1;
    final int points = data['points'] ?? 0;
    final int streak = data['current_streak'] ?? 0;
    final List allAchievements = data['all_achievements'] ?? [];
    final List unlockedAchievements = data['unlocked_achievements'] ?? [];

    return Scaffold(
      backgroundColor: const Color(0xFFF8F9FE),
      appBar: AppBar(
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
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            // Header Stats
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(24),
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
                        'Level $level',
                        style: const TextStyle(color: Colors.white, fontSize: 32, fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(width: 12),
                      const Icon(Icons.stars, color: Colors.amber, size: 36),
                    ],
                  ),
                  const Text(
                    'Health Champion',
                    style: TextStyle(color: Colors.white70, fontSize: 16),
                  ),
                  const SizedBox(height: 24),
                  Row(
                    children: [
                      _buildHeaderStat('Daily Streak', '$streak Days', Icons.local_fire_department, Colors.orange),
                      const SizedBox(width: 16),
                      _buildHeaderStat('Points', points.toString(), Icons.monetization_on, Colors.amber),
                    ],
                  ),
                ],
              ),
            ),
            
            Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // This Week Progress
                  _buildSectionTitle('This Week', '95% Complete'),
                  const SizedBox(height: 16),
                  _buildWeeklyProgress(),
                  
                  const SizedBox(height: 32),
                  
                  // Achievement Badges
                  _buildSectionTitle('Achievement Badges', ''),
                  const SizedBox(height: 16),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      _buildBadge('Bronze', '🥉', Colors.orange.shade800, points >= 100),
                      _buildBadge('Silver', '🥈', Colors.blueGrey.shade400, points >= 500),
                      _buildBadge('Gold', '🥇', Colors.amber.shade700, points >= 1000),
                      _buildBadge('Platinum', '💎', Colors.blue.shade300, points >= 2500),
                    ],
                  ),
                  
                  const SizedBox(height: 32),
                  
                  // Achievements List
                  _buildSectionTitle('Achievements', ''),
                  const SizedBox(height: 16),
                  ...allAchievements.map((achievement) {
                    final isUnlocked = unlockedAchievements.any((ua) => ua['id'] == achievement['id']);
                    return _buildAchievementCard(
                      achievement['title'],
                      achievement['description'],
                      achievement['icon_emoji'] ?? '🏆',
                      isUnlocked,
                      isUnlocked ? 'Unlocked!' : 'Progress: 0 / ${achievement['criteria_value']}',
                      isUnlocked ? 1.0 : 0.0,
                      _getAchievementColor(achievement['criteria_type']),
                    );
                  }).toList(),
                  
                  const SizedBox(height: 32),
                  
                  // Your Impact
                  Container(
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      color: Colors.purple.shade50,
                      borderRadius: BorderRadius.circular(24),
                      border: Border.all(color: Colors.purple.shade100),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Row(
                          children: [
                            Icon(Icons.auto_graph, color: Colors.purple),
                            SizedBox(width: 12),
                            Text(
                              'Your Impact',
                              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.purple),
                            ),
                          ],
                        ),
                        const SizedBox(height: 16),
                        _buildImpactRow('Longest streak', '21 days 🔥'),
                        _buildImpactRow('Health improvement', '+12% 📈'),
                        _buildImpactRow('Medications on time', '94% ⏰'),
                      ],
                    ),
                  ),
                  
                  const SizedBox(height: 24),
                  
                  // Footer Motivation
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(24),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(24),
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
                        const Text('🎉', style: TextStyle(fontSize: 40)),
                        const SizedBox(height: 12),
                        const Text(
                          'Keep Going!',
                          style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          'You\'re doing amazing! Just 16 more days to unlock the Streak Master achievement.',
                          textAlign: TextAlign.center,
                          style: TextStyle(color: Colors.grey.shade600, fontSize: 14),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 40),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildHeaderStat(String label, String value, IconData icon, Color color) {
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
                Text(label, style: const TextStyle(fontSize: 12, color: Colors.grey)),
                Text(value, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSectionTitle(String title, String subtitle) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          title,
          style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Color(0xFF1A237E)),
        ),
        if (subtitle.isNotEmpty)
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
            decoration: BoxDecoration(
              color: Colors.green.shade50,
              borderRadius: BorderRadius.circular(12),
            ),
            child: Text(
              subtitle,
              style: TextStyle(color: Colors.green.shade700, fontSize: 12, fontWeight: FontWeight.bold),
            ),
          ),
      ],
    );
  }

  Widget _buildWeeklyProgress() {
    final List<String> days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    final List<bool> completed = [true, true, true, true, true, true, false];
    
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.03),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: List.generate(7, (index) {
              return Column(
                children: [
                  Container(
                    width: 36,
                    height: 36,
                    decoration: BoxDecoration(
                      color: completed[index] ? Colors.green.shade50 : Colors.grey.shade50,
                      shape: BoxShape.circle,
                      border: Border.all(
                        color: completed[index] ? Colors.green.shade200 : Colors.grey.shade200,
                      ),
                    ),
                    child: Icon(
                      completed[index] ? Icons.check_circle : Icons.circle_outlined,
                      color: completed[index] ? Colors.green : Colors.grey.shade400,
                      size: 20,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    days[index],
                    style: TextStyle(
                      fontSize: 12,
                      color: index == 6 ? Colors.grey : Colors.black87,
                      fontWeight: index == 6 ? FontWeight.normal : FontWeight.bold,
                    ),
                  ),
                ],
              );
            }),
          ),
          const SizedBox(height: 20),
          ClipRRect(
            borderRadius: BorderRadius.circular(10),
            child: LinearProgressIndicator(
              value: 0.95,
              minHeight: 8,
              backgroundColor: Colors.blue.shade50,
              valueColor: const AlwaysStoppedAnimation<Color>(Color(0xFF3498DB)),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBadge(String label, String emoji, Color color, bool unlocked) {
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
            boxShadow: unlocked ? [
              BoxShadow(
                color: color.withOpacity(0.1),
                blurRadius: 10,
                offset: const Offset(0, 4),
              )
            ] : [],
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
            fontWeight: unlocked ? FontWeight.bold : FontWeight.normal,
            color: unlocked ? Colors.black87 : Colors.grey,
          ),
        ),
      ],
    );
  }

  Widget _buildAchievementCard(
    String title,
    String desc,
    String icon,
    bool unlocked,
    String footer,
    double progress,
    Color color,
  ) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: unlocked ? Colors.green.shade100 : Colors.grey.shade100,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.02),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Row(
        children: [
          Container(
            width: 56,
            height: 56,
            decoration: BoxDecoration(
              color: color.withOpacity(0.1),
              shape: BoxShape.circle,
            ),
            child: Center(child: Text(icon, style: const TextStyle(fontSize: 28))),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                ),
                Text(
                  desc,
                  style: TextStyle(color: Colors.grey.shade600, fontSize: 12),
                ),
                const SizedBox(height: 12),
                if (!unlocked) ...[
                  ClipRRect(
                    borderRadius: BorderRadius.circular(4),
                    child: LinearProgressIndicator(
                      value: progress,
                      minHeight: 6,
                      backgroundColor: color.withOpacity(0.1),
                      valueColor: AlwaysStoppedAnimation<Color>(color),
                    ),
                  ),
                  const SizedBox(height: 8),
                ],
                Row(
                  children: [
                    if (unlocked) Icon(Icons.check_circle, color: Colors.green.shade400, size: 14),
                    if (unlocked) const SizedBox(width: 4),
                    Text(
                      footer,
                      style: TextStyle(
                        color: unlocked ? Colors.green.shade700 : Colors.grey.shade500,
                        fontSize: 11,
                        fontWeight: unlocked ? FontWeight.bold : FontWeight.normal,
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

  Widget _buildImpactRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: TextStyle(color: Colors.purple.shade700, fontSize: 14)),
          Text(value, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
        ],
      ),
    );
  }

  Color _getAchievementColor(String? type) {
    switch (type) {
      case 'STREAK_DAYS': return Colors.orange;
      case 'TOTAL_INTAKES': return Colors.green;
      case 'PERFECT_WEEK': return Colors.amber;
      case 'FIRST_MEDICATION': return Colors.blue;
      case 'KNOWLEDGE_SEEKER': return Colors.teal;
      default: return Colors.purple;
    }
  }
}
