import 'dart:async';
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../config/api_config.dart';

class ChatMessage {
  final int id;
  final int senderId;
  final String senderRole;
  final int receiverId;
  final String receiverRole;
  final String message;
  final bool isRead;
  final DateTime createdAt;

  ChatMessage({
    required this.id,
    required this.senderId,
    required this.senderRole,
    required this.receiverId,
    required this.receiverRole,
    required this.message,
    required this.isRead,
    required this.createdAt,
  });

  factory ChatMessage.fromJson(Map<String, dynamic> json) {
    return ChatMessage(
      id:           json['id'],
      senderId:     json['sender_id'],
      senderRole:   json['sender_role'],
      receiverId:   json['receiver_id'],
      receiverRole: json['receiver_role'],
      message:      json['message'],
      isRead:       json['is_read'] == 1 || json['is_read'] == true,
      createdAt:    DateTime.parse(json['created_at']).toLocal(),
    );
  }
}

class ChatService {
  static Future<String?> _getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('auth_token');
  }

  static Map<String, String> _headers(String token) => {
    'Content-Type':  'application/json',
    'Authorization': 'Bearer $token',
  };

  // Send a message
  static Future<bool> sendMessage(int receiverId, String message) async {
    try {
      final token = await _getToken();
      if (token == null) return false;

      final resp = await http.post(
        Uri.parse('${ApiConfig.baseUrl}/chat/send'),
        headers: _headers(token),
        body: jsonEncode({'receiver_id': receiverId, 'message': message}),
      ).timeout(const Duration(seconds: 10));

      return resp.statusCode == 201;
    } catch (_) {
      return false;
    }
  }

  // Get messages with a specific partner
  static Future<List<ChatMessage>> getMessages(int partnerId, {int? before}) async {
    try {
      final token = await _getToken();
      if (token == null) return [];

      final uri = Uri.parse('${ApiConfig.baseUrl}/chat/$partnerId')
          .replace(queryParameters: {
        'limit': '50',
        if (before != null) 'before': before.toString(),
      });

      final resp = await http.get(uri, headers: _headers(token))
          .timeout(const Duration(seconds: 10));

      if (resp.statusCode == 200) {
        final data = jsonDecode(resp.body);
        final list = data['messages'] as List? ?? [];
        return list.map((m) => ChatMessage.fromJson(m)).toList();
      }
      return [];
    } catch (_) {
      return [];
    }
  }

  // Get unread count
  static Future<int> getUnreadCount() async {
    try {
      final token = await _getToken();
      if (token == null) return 0;

      final resp = await http.get(
        Uri.parse('${ApiConfig.baseUrl}/chat/unread/count'),
        headers: _headers(token),
      ).timeout(const Duration(seconds: 5));

      if (resp.statusCode == 200) {
        final data = jsonDecode(resp.body);
        return data['count'] ?? 0;
      }
      return 0;
    } catch (_) {
      return 0;
    }
  }
}