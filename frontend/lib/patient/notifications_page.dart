import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../config/api_config.dart';
import '../services/language_service.dart';

class NotificationsPage extends StatefulWidget {
  const NotificationsPage({super.key});

  @override
  State<NotificationsPage> createState() => _NotificationsPageState();
}

class _NotificationsPageState extends State<NotificationsPage> {
  bool _isLoading = true;
  List<dynamic> _notifications = [];
  int _unreadCount = 0;

  @override
  void initState() {
    super.initState();
    _loadNotifications();
  }

  Future<void> _loadNotifications() async {
    setState(() => _isLoading = true);
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');
      
      if (token == null) {
        Navigator.pushReplacementNamed(context, '/signin');
        return;
      }

      final response = await http.get(
        Uri.parse('${ApiConfig.baseUrl}/notifications'),
        headers: ApiConfig.getAuthHeaders(token),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        setState(() {
          _notifications = data['data']['notifications'] ?? [];
          _unreadCount = data['data']['unreadCount'] ?? 0;
          _isLoading = false;
        });
      } else {
        setState(() => _isLoading = false);
      }
    } catch (e) {
      print('Error loading notifications: $e');
      setState(() => _isLoading = false);
    }
  }

  Future<void> _markAsRead(int notificationId) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');

      await http.put(
        Uri.parse('${ApiConfig.baseUrl}/notifications/read/$notificationId'),
        headers: ApiConfig.getAuthHeaders(token!),
      );

      _loadNotifications();
    } catch (e) {
      print('Error marking as read: $e');
    }
  }

  Future<void> _markAllAsRead() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');

      await http.put(
        Uri.parse('${ApiConfig.baseUrl}/notifications/read-all'),
        headers: ApiConfig.getAuthHeaders(token!),
      );

      _loadNotifications();
      
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Toutes les notifications ont été marquées comme lues'),
          backgroundColor: Colors.green,
        ),
      );
    } catch (e) {
      print('Error marking all as read: $e');
    }
  }

  Future<void> _takeMedication(int? scheduleId) async {
    if (scheduleId == null) return;

    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');

      final response = await http.put(
        Uri.parse('${ApiConfig.baseUrl}/schedule/take/$scheduleId'),
        headers: ApiConfig.getAuthHeaders(token!),
      );

      if (response.statusCode == 200) {
        _loadNotifications();
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('✅ Médicament pris !'),
            backgroundColor: Colors.green,
          ),
        );
      }
    } catch (e) {
      print('Error taking medication: $e');
    }
  }

  String _getTimeAgo(String dateStr) {
    final date = DateTime.parse(dateStr);
    final now = DateTime.now();
    final difference = now.difference(date);

    if (difference.inMinutes < 1) return 'À l\'instant';
    if (difference.inMinutes < 60) return '${difference.inMinutes} min';
    if (difference.inHours < 24) return '${difference.inHours} h';
    if (difference.inDays == 1) return 'Hier';
    return '${difference.inDays} jours';
  }

  Color _getIconColor(String type) {
    switch (type) {
      case 'reminder':
        return Colors.blue;
      case 'missed':
        return Colors.red;
      case 'achievement':
        return Colors.purple;
      case 'insight':
        return Colors.orange;
      case 'refill':
        return Colors.green;
      default:
        return Colors.grey;
    }
  }

  IconData _getIcon(String type) {
    switch (type) {
      case 'reminder':
        return Icons.access_time;
      case 'missed':
        return Icons.error_outline;
      case 'achievement':
        return Icons.emoji_events;
      case 'insight':
        return Icons.trending_up;
      case 'refill':
        return Icons.inventory;
      default:
        return Icons.notifications_none;
    }
  }

  @override
  Widget build(BuildContext context) {
    final lang = Provider.of<LanguageService>(context);
    
    return Scaffold(
      backgroundColor: const Color(0xFFF8F9FA),
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
            decoration: const BoxDecoration(
              color: Color(0xFF3498DB),
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.notifications_none, color: Colors.white, size: 24),
          ),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: _loadNotifications,
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(20.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              lang.translate('notifications'),
                              style: const TextStyle(
                                fontSize: 28,
                                fontWeight: FontWeight.bold,
                                color: Color(0xFF1A237E),
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              '$_unreadCount ${lang.translate('unreadNotifications')}',
                              style: TextStyle(
                                fontSize: 16,
                                color: Colors.grey.shade600,
                              ),
                            ),
                          ],
                        ),
                        if (_unreadCount > 0)
                          TextButton(
                            onPressed: _markAllAsRead,
                            child: Text(
                              lang.translate('markAllRead'),
                              style: const TextStyle(color: Colors.blue),
                            ),
                          ),
                      ],
                    ),
                    const SizedBox(height: 24),
                    
                    if (_notifications.isEmpty)
                      Center(
                        child: Column(
                          children: [
                            const SizedBox(height: 100),
                            Icon(
                              Icons.notifications_off_outlined,
                              size: 80,
                              color: Colors.grey.shade400,
                            ),
                            const SizedBox(height: 16),
                            Text(
                              'Aucune notification',
                              style: TextStyle(
                                fontSize: 18,
                                color: Colors.grey.shade600,
                              ),
                            ),
                          ],
                        ),
                      )
                    else
                      ..._notifications.map((notification) {
                        final data = notification['data'] ?? {};
                        final scheduleId = data['schedule_id'];
                        final type = notification['type'] ?? 'info';
                        // CORRECTION: Convertir is_read de int à bool
                        final isRead = notification['is_read'] == 1 || notification['is_read'] == true;
                        
                        return _buildNotificationCard(
                          context,
                          lang,
                          icon: _getIcon(type),
                          iconColor: _getIconColor(type),
                          title: notification['title'] ?? '',
                          subtitle: notification['message'] ?? '',
                          time: _getTimeAgo(notification['created_at']),
                          isRead: isRead,
                          actionLabel: type == 'reminder' || type == 'missed' 
                              ? lang.translate('markAsTaken') 
                              : null,
                          onAction: type == 'reminder' || type == 'missed'
                              ? () => _takeMedication(scheduleId)
                              : null,
                          onTap: () => _markAsRead(notification['id']),
                        );
                      }).toList(),
                  ],
                ),
              ),
            ),
    );
  }

  Widget _buildNotificationCard(
    BuildContext context,
    LanguageService lang, {
    required IconData icon,
    required Color iconColor,
    required String title,
    required String subtitle,
    required String time,
    required bool isRead,
    String? actionLabel,
    VoidCallback? onAction,
    VoidCallback? onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        margin: const EdgeInsets.only(bottom: 16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(20),
          border: !isRead ? Border.all(color: Colors.blue.withOpacity(0.5), width: 2) : null,
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.03),
              blurRadius: 10,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Stack(
          children: [
            Padding(
              padding: const EdgeInsets.all(20),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: iconColor.withOpacity(0.1),
                      shape: BoxShape.circle,
                    ),
                    child: Icon(icon, color: iconColor, size: 24),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          title,
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: isRead ? FontWeight.normal : FontWeight.bold,
                            color: const Color(0xFF1A237E),
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          subtitle,
                          style: TextStyle(
                            fontSize: 14,
                            color: Colors.grey.shade600,
                          ),
                        ),
                        const SizedBox(height: 12),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              time,
                              style: TextStyle(
                                fontSize: 12,
                                color: Colors.grey.shade400,
                              ),
                            ),
                            if (actionLabel != null && onAction != null)
                              GestureDetector(
                                onTap: onAction,
                                child: Text(
                                  actionLabel,
                                  style: const TextStyle(
                                    fontSize: 14,
                                    fontWeight: FontWeight.bold,
                                    color: Colors.blue,
                                  ),
                                ),
                              ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            if (!isRead)
              Positioned(
                top: 10,
                right: 10,
                child: Container(
                  width: 10,
                  height: 10,
                  decoration: const BoxDecoration(
                    color: Colors.blue,
                    shape: BoxShape.circle,
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
}