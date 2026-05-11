import 'dart:async';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/health_service.dart';
import '../services/language_service.dart';
import 'condition_detail_page.dart';

class HealthOverviewPage extends StatefulWidget {
  const HealthOverviewPage({super.key});

  @override
  State<HealthOverviewPage> createState() => _HealthOverviewPageState();
}

class _HealthOverviewPageState extends State<HealthOverviewPage> {
  bool _isLoading = true;
  String? _errorMessage;
  
  // Dashboard data
  int _overallAdherence = 0;
  int _activeConditions = 0;
  int _currentStreak = 0;
  List<dynamic> _achievements = [];
  List<dynamic> _conditions = [];

  @override
  void initState() {
    super.initState();
    _loadDashboardData();
  }

  String _translateConditionName(String name, LanguageService lang) {
    switch(name) {
      case 'Diabetes Type 1': return lang.translate('diabetesType1');
      case 'Diabetes Type 2': return lang.translate('diabetesType2');
      case 'Hypertension': return lang.translate('hypertension');
      case 'Asthma': return lang.translate('asthma');
      case 'Heart Disease': return lang.translate('heartDisease');
      case 'High Cholesterol': return lang.translate('cholesterol');
       case 'COPD': return lang.translate('copd');
    case 'Arthritis': return lang.translate('arthritis');
    case 'Thyroid Disorder': return lang.translate('thyroidDisorder');
      default: return name;
    }
  }

  Future<void> _loadDashboardData() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final data = await HealthService.getDashboard();
      
      setState(() {
        _overallAdherence = data['overallAdherence'] ?? 0;
        _activeConditions = data['activeConditions'] ?? 0;
        _currentStreak = data['currentStreak'] ?? 0;
        _achievements = data['achievements'] ?? [];
        _conditions = data['conditions'] ?? [];
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _errorMessage = e.toString();
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final languageService = Provider.of<LanguageService>(context);
    
    if (_isLoading) {
      return Scaffold(
        backgroundColor: Colors.white,
        appBar: AppBar(
          backgroundColor: Colors.white,
          elevation: 0,
          leading: IconButton(
            icon: const Icon(Icons.arrow_back, color: Colors.black54),
            onPressed: () => Navigator.pop(context),
          ),
        ),
        body: const Center(child: CircularProgressIndicator()),
      );
    }

    if (_errorMessage != null) {
      return Scaffold(
        backgroundColor: Colors.white,
        appBar: AppBar(
          backgroundColor: Colors.white,
          elevation: 0,
          leading: IconButton(
            icon: const Icon(Icons.arrow_back, color: Colors.black54),
            onPressed: () => Navigator.pop(context),
          ),
        ),
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.error_outline, color: Colors.red, size: 60),
              const SizedBox(height: 16),
              Text('Error: $_errorMessage'),
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: _loadDashboardData,
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.blue,
                  foregroundColor: Colors.white,
                ),
                child: Text(languageService.translate('retry')),
              ),
            ],
          ),
        ),
      );
    }

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.black54),
          onPressed: () => Navigator.pop(context),
        ),
        actions: [
          Container(
            margin: const EdgeInsets.only(right: 16),
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: Colors.blue.withOpacity(0.1),
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.favorite, color: Colors.blue, size: 24),
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: _loadDashboardData,
        color: Colors.blue,
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          padding: const EdgeInsets.symmetric(horizontal: 20.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildHeader(languageService),
              const SizedBox(height: 32),
              _buildHealthStatistics(languageService),
              const SizedBox(height: 32),
              _buildMedicalConditions(languageService),
              const SizedBox(height: 32),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildHeader(LanguageService lang) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          lang.translate('healthOverview'),
          style: const TextStyle(
            fontSize: 28,
            fontWeight: FontWeight.bold,
            color: Color(0xFF1A237E),
          ),
        ),
        const SizedBox(height: 4),
        Text(
          lang.translate('healthSnapshot'),
          style: TextStyle(
            fontSize: 16,
            color: Colors.grey.shade600,
          ),
        ),
      ],
    );
  }

  Widget _buildHealthStatistics(LanguageService lang) {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 20,
            offset: const Offset(0, 10),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            lang.translate('healthStatistics'),
            style: const TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: Color(0xFF1A237E),
            ),
          ),
          const SizedBox(height: 20),
          GridView.count(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            crossAxisCount: 2,
            crossAxisSpacing: 16,
            mainAxisSpacing: 16,
            childAspectRatio: 1.1,
            children: [
              GestureDetector(
                onTap: () {},
                child: _buildStatItem(
                  Icons.favorite_border,
                  '$_overallAdherence%',
                  lang.translate('overallAdherence'),
                  Colors.blue.withOpacity(0.05),
                  Colors.blue,
                ),
              ),
              GestureDetector(
                onTap: () {
                  Navigator.pushNamed(context, '/conditions');
                },
                child: _buildStatItem(
                  Icons.timeline,
                  '$_activeConditions',
                  lang.translate('activeConditions'),
                  Colors.green.withOpacity(0.05),
                  Colors.green,
                ),
              ),
              GestureDetector(
                onTap: () {},
                child: _buildStatItem(
                  Icons.access_time,
                  '$_currentStreak ${_currentStreak == 1 ? lang.translate('day') : lang.translate('days')}',
                  lang.translate('currentStreak'),
                  Colors.orange.withOpacity(0.05),
                  Colors.orange,
                ),
              ),
              GestureDetector(
                onTap: () {
                  _showAchievementsDialog(lang);
                },
                child: _buildStatItem(
                  Icons.emoji_events_outlined,
                  '${_achievements.length}',
                  lang.translate('achievements'),
                  Colors.purple.withOpacity(0.05),
                  Colors.purple,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildStatItem(IconData icon, String value, String label, Color bgColor, Color iconColor) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: bgColor,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(icon, color: iconColor, size: 28),
          const SizedBox(height: 12),
          Text(
            value,
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
              color: iconColor,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            label,
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 11,
              color: Colors.grey.shade600,
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMedicalConditions(LanguageService lang) {
    if (_conditions.isEmpty) {
      return Container(
        padding: const EdgeInsets.all(24),
        decoration: BoxDecoration(
          color: Colors.grey.shade50,
          borderRadius: BorderRadius.circular(24),
        ),
        child: Column(
          children: [
            const Icon(Icons.medical_services_outlined, size: 40, color: Colors.grey),
            const SizedBox(height: 12),
            Text(
              lang.translate('noConditions'),
              style: TextStyle(color: Colors.grey.shade600),
            ),
            const SizedBox(height: 4),
            Text(
              lang.translate('addConditionsPrompt'),
              textAlign: TextAlign.center,
              style: TextStyle(color: Colors.grey.shade500, fontSize: 12),
            ),
          ],
        ),
      );
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          lang.translate('medicalConditions'),
          style: const TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.bold,
            color: Color(0xFF1A237E),
          ),
        ),
        const SizedBox(height: 16),
        ..._conditions.map((condition) {
          final color = _getColorForCondition(condition['name'] ?? '');
          return GestureDetector(
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => ConditionDetailPage(
                    condition: {
                      'id': condition['id'],
                      'name': condition['name'],
                      'percentage': condition['adherence_rate'] ?? 0,
                      'color': color,
                    },
                  ),
                ),
              );
            },
            child: Container(
              margin: const EdgeInsets.only(bottom: 12),
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.grey.shade50,
                borderRadius: BorderRadius.circular(16),
              ),
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: color,
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(Icons.favorite, color: Colors.white, size: 24),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          _translateConditionName(condition['name'] ?? 'Unknown', lang),
                          style: const TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: Color(0xFF1A237E),
                          ),
                        ),
                        const SizedBox(height: 4),
                        Row(
                          children: [
                            Text(
                              '${condition['medication_count'] ?? 0} ${lang.translate('medications')}',
                              style: TextStyle(
                                fontSize: 12,
                                color: Colors.grey.shade500,
                              ),
                            ),
                            const SizedBox(width: 12),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                              decoration: BoxDecoration(
                                color: Colors.green.withOpacity(0.1),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: Text(
                                '${condition['adherence_rate'] ?? 0}%',
                                style: const TextStyle(
                                  color: Colors.green,
                                  fontSize: 12,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                  const Icon(Icons.chevron_right, color: Colors.grey),
                ],
              ),
            ),
          );
        }).toList(),
        const SizedBox(height: 8),
        Center(
          child: TextButton(
            onPressed: () {
              Navigator.pushNamed(context, '/conditions');
            },
            child: Text(
              lang.translate('viewAllConditions'),
              style: const TextStyle(color: Colors.blue, fontWeight: FontWeight.bold),
            ),
          ),
        ),
      ],
    );
  }

  void _showAchievementsDialog(LanguageService lang) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(lang.translate('yourAchievements')),
        content: SizedBox(
          width: double.maxFinite,
          child: _achievements.isEmpty
              ? Text(lang.translate('noAchievements'))
              : ListView.builder(
                  shrinkWrap: true,
                  itemCount: _achievements.length,
                  itemBuilder: (context, index) {
                    final achievement = _achievements[index];
                    return ListTile(
                      leading: Text(
                        achievement['badge_icon'] ?? '🏆',
                        style: const TextStyle(fontSize: 30),
                      ),
                      title: Text(achievement['name'] ?? ''),
                      subtitle: Text(achievement['description'] ?? ''),
                    );
                  },
                ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text(lang.translate('close')),
          ),
        ],
      ),
    );
  }

  Color _getColorForCondition(String name) {
    if (name.isEmpty) return Colors.blue;
    final List<Color> colors = [Colors.blue, Colors.green, Colors.orange, Colors.purple, Colors.teal];
    final int hash = name.hashCode.abs();
    return colors[hash % colors.length];
  }
}
