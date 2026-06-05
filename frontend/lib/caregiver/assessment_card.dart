// frontend/lib/caregiver/assessment_card.dart

import 'package:flutter/material.dart';

class AssessmentCard extends StatelessWidget {
  final Map<String, dynamic> assessment;
  final VoidCallback? onRefresh;

  const AssessmentCard({
    Key? key,
    required this.assessment,
    this.onRefresh,
  }) : super(key: key);

  Color _getRiskColor(String riskLevel) {
    switch (riskLevel) {
      case 'good':
        return Colors.green;
      case 'low':
        return Colors.orange;
      case 'moderate':
        return Colors.deepOrange;
      case 'high':
        return Colors.red;
      case 'critical':
        return Colors.purple;
      default:
        return Colors.grey;
    }
  }

  String _getRiskEmoji(String riskLevel) {
    switch (riskLevel) {
      case 'good':
        return '✅';
      case 'low':
        return '⚠️';
      case 'moderate':
        return '⚡';
      case 'high':
        return '🔴';
      case 'critical':
        return '🚨';
      default:
        return '📊';
    }
  }

  @override
  Widget build(BuildContext context) {
    final riskLevel = assessment['risk_level'] ?? 'good';
    final riskColor = _getRiskColor(riskLevel);
    final riskEmoji = _getRiskEmoji(riskLevel);
    final assessmentText = assessment['assessment_text'] ?? 'No assessment available';
    final actions = assessment['recommended_actions'] as List? ?? [];

    return Card(
      margin: const EdgeInsets.all(16),
      elevation: 4,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: BorderSide(color: riskColor, width: 2),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: riskColor.withOpacity(0.1),
              borderRadius: const BorderRadius.only(
                topLeft: Radius.circular(12),
                topRight: Radius.circular(12),
              ),
            ),
            child: Row(
              children: [
                Text(riskEmoji, style: const TextStyle(fontSize: 28)),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Clinical Assessment',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: riskColor,
                        ),
                      ),
                      Text(
                        'Risk Level: ${riskLevel.toUpperCase()}',
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w500,
                          color: riskColor,
                        ),
                      ),
                    ],
                  ),
                ),
                if (onRefresh != null)
                  IconButton(
                    icon: const Icon(Icons.refresh),
                    onPressed: onRefresh,
                    color: riskColor,
                  ),
              ],
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(16),
            child: Text(
              assessmentText,
              style: const TextStyle(fontSize: 14, height: 1.5),
            ),
          ),
          if (actions.isNotEmpty) ...[
            const Divider(),
            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    '🎯 Recommended Actions',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 12),
                  ...actions.map((action) => _buildActionItem(action)),
                ],
              ),
            ),
          ],
          if (assessment['created_at'] != null)
            Padding(
              padding: const EdgeInsets.all(12),
              child: Text(
                'Updated: ${_formatDate(assessment['created_at'])}',
                style: TextStyle(fontSize: 12, color: Colors.grey[600]),
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildActionItem(Map<String, dynamic> action) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 24,
            height: 24,
            decoration: BoxDecoration(
              color: Colors.blue.withOpacity(0.1),
              shape: BoxShape.circle,
            ),
            child: Center(
              child: Text(
                '${action['priority']}',
                style: const TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.bold,
                  color: Colors.blue,
                ),
              ),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  action['action'] ?? '',
                  style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w500),
                ),
                const SizedBox(height: 4),
                Text(
                  action['reason'] ?? '',
                  style: TextStyle(fontSize: 12, color: Colors.grey[600]),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  String _formatDate(String dateTimeStr) {
    try {
      final dateTime = DateTime.parse(dateTimeStr);
      final now = DateTime.now();
      final difference = now.difference(dateTime);

      if (difference.inHours < 1) {
        return '${difference.inMinutes} minutes ago';
      } else if (difference.inHours < 24) {
        return '${difference.inHours} hours ago';
      } else {
        return '${difference.inDays} days ago';
      }
    } catch (e) {
      return dateTimeStr;
    }
  }
}