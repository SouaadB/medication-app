import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:intl/intl.dart';
import 'package:url_launcher/url_launcher.dart';  // ← AJOUTÉ pour les appels téléphoniques
import '../services/language_service.dart';
import '../config/api_config.dart';

class AIChatbotPage extends StatefulWidget {
  const AIChatbotPage({super.key});

// REPLACE WITH:
  @override
  State<AIChatbotPage> createState() => _AIChatbotPageState();
}

class _AIChatbotPageState extends State<AIChatbotPage> {
  final TextEditingController _messageController = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  bool _isLoading = false;
  bool _isLoadingHistory = true;

  final List<Map<String, dynamic>> _messages = [];

  @override
  void initState() {
    super.initState();
    _loadHistory();
  }

  Future<void> _loadHistory() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');
      final response = await http.get(
        Uri.parse('${ApiConfig.baseUrl}/ai/chat/history'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final history = data['history'] as List? ?? [];
        setState(() {
          _messages.clear();
          if (history.isEmpty) {
            // First time — show welcome message
            _messages.add({
              'isBot': true,
              'text': 'Hello! I\'m your MediCare AI assistant. I\'m here to help you with medication questions, first-aid guidance, and health concerns. How can I assist you today?',
              'time': DateFormat('HH:mm').format(DateTime.now()),
            });
          } else {
            for (final h in history) {
              _messages.add({
                'isBot': h['role'] == 'assistant',
                'text': h['message'],
                'time': DateFormat('HH:mm').format(
                    DateTime.parse(h['created_at'].toString())),
              });
            }
          }
          _isLoadingHistory = false;
        });
        _scrollToBottom();
      }
    } catch (_) {
      setState(() {
        _isLoadingHistory = false;
        _messages.add({
          'isBot': true,
          'text': 'Hello! I\'m your MediCare AI assistant. How can I assist you today?',
          'time': DateFormat('HH:mm').format(DateTime.now()),
        });
      });
    }
  }



// ========== NOUVELLE FONCTION D'APPEL (Version corrigée) ==========
Future<void> _makePhoneCall() async {
  final Uri phoneUri = Uri(
    scheme: 'tel',
    path: '16',
  );

  try {
    await launchUrl(
      phoneUri,
      mode: LaunchMode.externalApplication,
    );
  } catch (e) {
    print('Erreur appel: $e');
    _showCallDialog();
  }
}



void _showCallDialog() {
  showDialog(
    context: context,
    builder: (BuildContext context) {
      return AlertDialog(
        title: const Row(
          children: [
            Icon(Icons.emergency, color: Colors.red),
            SizedBox(width: 8),
            Text('SAMU - Urgence'),
          ],
        ),
        content: const Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text('Composez le numéro suivant :'),
            SizedBox(height: 20),
            Text(
              '📞 16',
              style: TextStyle(
                fontSize: 40,
                fontWeight: FontWeight.bold,
                color: Colors.red,
              ),
            ),
            SizedBox(height: 8),
            Text('(Service d\'Aide Médicale Urgente)'),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Fermer'),
          ),
          ElevatedButton.icon(
            onPressed: () async {
              Navigator.pop(context);
              await _openDialerDirectly();
            },
            icon: const Icon(Icons.phone),
            label: const Text('Ouvrir le téléphone'),
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.green,
              foregroundColor: Colors.white,
            ),
          ),
        ],
      );
    },
  );
}

Future<void> _openDialerDirectly() async {
  final Uri phoneUri = Uri(
    scheme: 'tel',
    path: '16',
  );

  await launchUrl(
    phoneUri,
    mode: LaunchMode.externalApplication,
  );
}
// ========== FIN ==========

  void _scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  Future<void> _sendMessage(String text) async {
    if (text.trim().isEmpty) return;

    setState(() {
      _messages.add({
        'isBot': false,
        'text': text,
        'time': DateFormat('HH:mm').format(DateTime.now())
      });
      _isLoading = true;
    });
    _messageController.clear();
    _scrollToBottom();

    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');

      final response = await http.post(
        Uri.parse('${ApiConfig.baseUrl}/ai/chat'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: jsonEncode({'message': text}),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data['success']) {
          setState(() {
            _messages.add({
              'isBot': true,
              'text': data['reply'],
              'time': DateFormat('HH:mm').format(DateTime.now()),
            });
            _isLoading = false;
          });
          _scrollToBottom();
        } else {
          throw Exception(data['message'] ?? 'Unknown error');
        }
      } else {
        final data = jsonDecode(response.body);
        throw Exception(data['message'] ?? 'Server error (${response.statusCode})');
      }
    } catch (e) {
      setState(() {
        _messages.add({
          'isBot': true,
          'text': 'I am sorry, I am having trouble connecting to my brain right now. (${e.toString().replaceAll('Exception: ', '')})',
          'time': DateFormat('HH:mm').format(DateTime.now()),
        });
        _isLoading = false;
      });
      _scrollToBottom();
    }
  }

  @override
  Widget build(BuildContext context) {
    final lang = Provider.of<LanguageService>(context);
    
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: const Color(0xFF3498DB),
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
        title: Column(
          children: [
            Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Icon(Icons.chat_bubble_outline, color: Colors.white, size: 20),
                const SizedBox(width: 8),
                Text(
                  lang.translate('aiHealthAssistant'),
                  style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                ),
              ],
            ),
          ],
        ),
        centerTitle: true,
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 12),
            child: Container(
              decoration: const BoxDecoration(
                color: Color(0xFFE74C3C),
                shape: BoxShape.circle,
              ),
              child: IconButton(
                icon: const Icon(Icons.call, color: Colors.white, size: 20),
                onPressed: _makePhoneCall,  // ← MODIFIÉ: Appelle la fonction pour composer le 16
              ),
            ),
          ),
        ],
      ),
      body: Column(
        children: [
          // Subheader
          Container(
            width: double.infinity,
            padding: const EdgeInsets.symmetric(vertical: 12),
            decoration: const BoxDecoration(
              color: Color(0xFF3498DB),
            ),
            child: const Text(
              'Your trusted AI companion for health guidance',
              textAlign: TextAlign.center,
              style: TextStyle(color: Colors.white70, fontSize: 13),
            ),
          ),
          
          Expanded(
               child: _isLoadingHistory
                ? const Center(child: CircularProgressIndicator())
                : ListView(
              controller: _scrollController,
              padding: const EdgeInsets.all(20),
              children: [
                // Messages
                ..._messages.map((msg) => _buildMessageBubble(msg)),
                
                if (_isLoading)
                  const Padding(
                    padding: EdgeInsets.only(top: 8),
                    child: Center(child: CircularProgressIndicator(strokeWidth: 2)),
                  ),
                
                const SizedBox(height: 24),
                const Center(
                  child: Text(
                    'Try asking:',
                    style: TextStyle(color: Colors.grey, fontWeight: FontWeight.w500),
                  ),
                ),
                const SizedBox(height: 16),
                
                // Suggested Prompts Grid
                GridView.count(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  crossAxisCount: 2,
                  childAspectRatio: 1.5,
                  crossAxisSpacing: 12,
                  mainAxisSpacing: 12,
                  children: [
                    _buildPromptCard('I missed my medication', '💊', Colors.orange.shade50, onTap: () => _sendMessage('I missed my medication')),
                    _buildPromptCard('What should I do if I feel dizzy?', '😵‍💫', Colors.blue.shade50, onTap: () => _sendMessage('What should I do if I feel dizzy?')),
                    _buildPromptCard('Explain this medication', '📋', Colors.grey.shade50, onTap: () => _sendMessage('Explain this medication')),
                    _buildPromptCard('Emergency help', '🚨', Colors.red.shade50, isEmergency: true, onTap: () => _sendMessage('Emergency help')),
                  ],
                ),
              ],
            ),
          ),
          
          // Emergency Banner (Now also a Disclaimer)
          Container(
            padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 16),
            color: Colors.blue.shade50,
            child: Column(
              children: [
                Row(
                  children: [
                    Icon(Icons.info_outline, color: Colors.blue.shade700, size: 16),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        'This assistant does not replace professional medical advice.',
                        style: TextStyle(color: Colors.blue.shade900, fontSize: 11, fontWeight: FontWeight.bold),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 4),
                Row(
                  children: [
                    const Icon(Icons.error_outline, color: Colors.red, size: 16),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        'For medical emergencies or an ambulance call 16 — (SAMU) immediately',  // ← MODIFIÉ
                        style: TextStyle(color: Colors.red.shade700, fontSize: 11, fontWeight: FontWeight.bold),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          
          // Input Area (MICROPHONE SUPPRIMÉ)
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            decoration: BoxDecoration(
              color: Colors.white,
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.05),
                  blurRadius: 10,
                  offset: const Offset(0, -2),
                ),
              ],
            ),
            child: Row(
              children: [
                // ← L'icône microphone a été SUPPRIMÉE ici
                Expanded(
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    decoration: BoxDecoration(
                      color: Colors.grey.shade100,
                      borderRadius: BorderRadius.circular(24),
                    ),
                    child: TextField(
                      controller: _messageController,
                      decoration: const InputDecoration(
                        hintText: 'Type your question...',
                        border: InputBorder.none,
                        hintStyle: TextStyle(color: Colors.grey, fontSize: 14),
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Container(
                  decoration: BoxDecoration(
                    color: Colors.grey.shade100,
                    shape: BoxShape.circle,
                  ),
                  child: IconButton(
                    icon: const Icon(Icons.send, color: Colors.blueGrey, size: 20),
                    onPressed: () => _sendMessage(_messageController.text),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMessageBubble(Map<String, dynamic> msg) {
    final isBot = msg['isBot'] ?? true;
    return Align(
      alignment: isBot ? Alignment.centerLeft : Alignment.centerRight,
      child: Container(
        margin: const EdgeInsets.only(top: 8),
        padding: const EdgeInsets.all(20),
        constraints: BoxConstraints(maxWidth: MediaQuery.of(context).size.width * 0.8),
        decoration: BoxDecoration(
          color: isBot ? Colors.white : const Color(0xFF3498DB),
          borderRadius: BorderRadius.only(
            topLeft: const Radius.circular(20),
            topRight: const Radius.circular(20),
            bottomLeft: Radius.circular(isBot ? 0 : 20),
            bottomRight: Radius.circular(isBot ? 20 : 0),
          ),
          border: isBot ? Border.all(color: Colors.grey.shade100) : null,
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.03),
              blurRadius: 10,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: isBot ? CrossAxisAlignment.start : CrossAxisAlignment.end,
          children: [
            Text(
              msg['text'],
              style: TextStyle(
                fontSize: 16,
                color: isBot ? const Color(0xFF2C3E50) : Colors.white,
                height: 1.5,
              ),
            ),
            const SizedBox(height: 12),
            Text(
              msg['time'],
              style: TextStyle(
                color: isBot ? Colors.grey.shade400 : Colors.white70,
                fontSize: 12,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPromptCard(String text, String emoji, Color bgColor, {bool isEmergency = false, required VoidCallback onTap}) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: isEmergency ? Colors.red.shade100 : Colors.grey.shade100),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.02),
              blurRadius: 5,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(emoji, style: const TextStyle(fontSize: 24)),
            const SizedBox(height: 8),
            Text(
              text,
              style: TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.bold,
                color: isEmergency ? Colors.red.shade700 : const Color(0xFF2C3E50),
              ),
            ),
          ],
        ),
      ),
    );
  }
}