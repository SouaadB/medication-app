import 'dart:async';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../services/chat_service.dart';

class ChatPage extends StatefulWidget {
  final int partnerId;
  final String partnerName;
  final String partnerRole; // 'patient' or 'caregiver'

  const ChatPage({
    super.key,
    required this.partnerId,
    required this.partnerName,
    required this.partnerRole,
  });

  @override
  State<ChatPage> createState() => _ChatPageState();
}

class _ChatPageState extends State<ChatPage> {
  final TextEditingController _controller = TextEditingController();
  final ScrollController _scrollController = ScrollController();

  List<ChatMessage> _messages = [];
  bool _isLoading   = true;
  bool _isSending   = false;
  int? _myId;
  String? _myRole;
  Timer? _pollTimer;

  static const Color _primary = Color(0xFF1565C0);

  @override
  void initState() {
    super.initState();
    _loadIdentity().then((_) {
      _fetchMessages();
      // Poll every 4 seconds for new messages
      _pollTimer = Timer.periodic(const Duration(seconds: 4), (_) => _fetchMessages(silent: true));
    });
  }

  @override
  void dispose() {
    _pollTimer?.cancel();
    _controller.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  Future<void> _loadIdentity() async {
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      _myId   = prefs.getInt('user_id') ?? prefs.getInt('patient_id');
      _myRole = prefs.getString('user_role') ?? 'patient';
    });
  }

  Future<void> _fetchMessages({bool silent = false}) async {
    if (!silent && mounted) setState(() => _isLoading = true);

    final msgs = await ChatService.getMessages(widget.partnerId);
    if (mounted) {
      final isAtBottom = _scrollController.hasClients &&
          _scrollController.position.pixels >=
          _scrollController.position.maxScrollExtent - 80;

      setState(() {
        _messages  = msgs;
        _isLoading = false;
      });

      if (isAtBottom || silent) _scrollToBottom();
    }
  }

  Future<void> _send() async {
    final text = _controller.text.trim();
    if (text.isEmpty || _isSending) return;

    setState(() => _isSending = true);
    _controller.clear();

    // Optimistic UI — add message immediately
    final optimistic = ChatMessage(
      id:           -DateTime.now().millisecondsSinceEpoch,
      senderId:     _myId ?? 0,
      senderRole:   _myRole ?? 'patient',
      receiverId:   widget.partnerId,
      receiverRole: widget.partnerRole,
      message:      text,
      isRead:       false,
      createdAt:    DateTime.now(),
    );
    setState(() => _messages.add(optimistic));
    _scrollToBottom();

    final ok = await ChatService.sendMessage(widget.partnerId, text);
    if (mounted) {
      setState(() => _isSending = false);
      if (ok) {
        // Replace optimistic with real message
        await _fetchMessages(silent: true);
      } else {
        // Remove optimistic on failure
        setState(() => _messages.removeWhere((m) => m.id == optimistic.id));
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
          content: Text('Failed to send message'),
          backgroundColor: Colors.red,
          behavior: SnackBarBehavior.floating,
        ));
      }
    }
  }

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

  bool _isMe(ChatMessage msg) =>
      msg.senderId == _myId && msg.senderRole == _myRole;

  String _formatTime(DateTime dt) {
    final now   = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);
    final msgDay = DateTime(dt.year, dt.month, dt.day);

    final timeStr =
        '${dt.hour.toString().padLeft(2, '0')}:${dt.minute.toString().padLeft(2, '0')}';

    if (msgDay == today) return timeStr;
    if (msgDay == today.subtract(const Duration(days: 1))) return 'Yesterday $timeStr';
    return '${dt.day}/${dt.month} $timeStr';
  }

  bool _showDateDivider(int index) {
    if (index == 0) return true;
    final prev = _messages[index - 1].createdAt;
    final curr = _messages[index].createdAt;
    return prev.day != curr.day ||
           prev.month != curr.month ||
           prev.year != curr.year;
  }

  String _dividerLabel(DateTime dt) {
    final now   = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);
    final msgDay = DateTime(dt.year, dt.month, dt.day);
    if (msgDay == today) return 'Today';
    if (msgDay == today.subtract(const Duration(days: 1))) return 'Yesterday';
    return '${dt.day}/${dt.month}/${dt.year}';
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF4F7FB),
      appBar: _buildAppBar(),
      body: Column(children: [
        Expanded(child: _buildMessageList()),
        _buildInputBar(),
      ]),
    );
  }

  PreferredSizeWidget _buildAppBar() {
    final initials = widget.partnerName
        .trim()
        .split(' ')
        .map((e) => e.isNotEmpty ? e[0] : '')
        .take(2)
        .join()
        .toUpperCase();

    return AppBar(
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
      title: Row(children: [
        Container(
          width: 38, height: 38,
          decoration: BoxDecoration(
            color: Colors.white.withOpacity(0.2),
            shape: BoxShape.circle,
          ),
          child: Center(child: Text(initials,
              style: const TextStyle(color: Colors.white,
                  fontWeight: FontWeight.bold, fontSize: 14))),
        ),
        const SizedBox(width: 10),
        Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text(widget.partnerName,
              style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w800)),
          Text(
            widget.partnerRole == 'caregiver' ? 'Caregiver' : 'Patient',
            style: TextStyle(fontSize: 11, color: Colors.white.withOpacity(0.7)),
          ),
        ]),
      ]),
      actions: [
        Container(
          margin: const EdgeInsets.only(right: 12),
          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
          decoration: BoxDecoration(
            color: Colors.white.withOpacity(0.15),
            borderRadius: BorderRadius.circular(20),
          ),
          child: Row(mainAxisSize: MainAxisSize.min, children: [
            Container(width: 7, height: 7,
                decoration: const BoxDecoration(
                    color: Colors.greenAccent, shape: BoxShape.circle)),
            const SizedBox(width: 5),
            const Text('Live', style: TextStyle(color: Colors.white,
                fontSize: 11, fontWeight: FontWeight.w600)),
          ]),
        ),
      ],
    );
  }

  Widget _buildMessageList() {
    if (_isLoading) {
      return const Center(child: CircularProgressIndicator(color: _primary));
    }
    if (_messages.isEmpty) {
      return Center(child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            width: 72, height: 72,
            decoration: BoxDecoration(
              color: _primary.withOpacity(0.08),
              shape: BoxShape.circle,
            ),
            child: Icon(Icons.chat_bubble_outline_rounded,
                size: 36, color: _primary.withOpacity(0.5)),
          ),
          const SizedBox(height: 16),
          const Text('No messages yet',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold,
                  color: Color(0xFF0F172A))),
          const SizedBox(height: 6),
          Text('Send the first message below',
              style: TextStyle(fontSize: 13, color: Colors.grey.shade500)),
        ],
      ));
    }

    return ListView.builder(
      controller: _scrollController,
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      itemCount: _messages.length,
      itemBuilder: (context, index) {
        final msg = _messages[index];
        return Column(children: [
          if (_showDateDivider(index)) _buildDateDivider(msg.createdAt),
          _buildBubble(msg),
        ]);
      },
    );
  }

  Widget _buildDateDivider(DateTime dt) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 12),
      child: Row(children: [
        Expanded(child: Divider(color: Colors.grey.shade300)),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 12),
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
            decoration: BoxDecoration(
              color: Colors.grey.shade200,
              borderRadius: BorderRadius.circular(20),
            ),
            child: Text(_dividerLabel(dt),
                style: TextStyle(fontSize: 11,
                    color: Colors.grey.shade600, fontWeight: FontWeight.w500)),
          ),
        ),
        Expanded(child: Divider(color: Colors.grey.shade300)),
      ]),
    );
  }

  Widget _buildBubble(ChatMessage msg) {
    final isMe      = _isMe(msg);
    final isOptimistic = msg.id < 0;

    return Padding(
      padding: const EdgeInsets.only(bottom: 6),
      child: Row(
        mainAxisAlignment: isMe ? MainAxisAlignment.end : MainAxisAlignment.start,
        crossAxisAlignment: CrossAxisAlignment.end,
        children: [
          if (!isMe) ...[
            Container(
              width: 28, height: 28,
              margin: const EdgeInsets.only(right: 6),
              decoration: BoxDecoration(
                color: _primary.withOpacity(0.12),
                shape: BoxShape.circle,
              ),
              child: Icon(
                widget.partnerRole == 'caregiver'
                    ? Icons.health_and_safety_rounded
                    : Icons.person_rounded,
                size: 14, color: _primary,
              ),
            ),
          ],

          ConstrainedBox(
            constraints: BoxConstraints(
              maxWidth: MediaQuery.of(context).size.width * 0.72,
            ),
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
              decoration: BoxDecoration(
                color: isMe ? _primary : Colors.white,
                borderRadius: BorderRadius.only(
                  topLeft:     const Radius.circular(18),
                  topRight:    const Radius.circular(18),
                  bottomLeft:  Radius.circular(isMe ? 18 : 4),
                  bottomRight: Radius.circular(isMe ? 4 : 18),
                ),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.06),
                    blurRadius: 8, offset: const Offset(0, 2),
                  ),
                ],
              ),
              child: Column(
                crossAxisAlignment: isMe
                    ? CrossAxisAlignment.end
                    : CrossAxisAlignment.start,
                children: [
                  Text(msg.message,
                      style: TextStyle(
                        fontSize: 14,
                        color: isMe ? Colors.white : const Color(0xFF0F172A),
                        height: 1.4,
                      )),
                  const SizedBox(height: 4),
                  Row(mainAxisSize: MainAxisSize.min, children: [
                    Text(_formatTime(msg.createdAt),
                        style: TextStyle(
                          fontSize: 10,
                          color: isMe
                              ? Colors.white.withOpacity(0.6)
                              : Colors.grey.shade400,
                        )),
                    if (isMe) ...[
                      const SizedBox(width: 4),
                      if (isOptimistic)
                        Icon(Icons.access_time_rounded, size: 11,
                            color: Colors.white.withOpacity(0.5))
                      else if (msg.isRead)
                        Icon(Icons.done_all_rounded, size: 12,
                            color: Colors.white.withOpacity(0.8))
                      else
                        Icon(Icons.done_rounded, size: 12,
                            color: Colors.white.withOpacity(0.5)),
                    ],
                  ]),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildInputBar() {
    return Container(
      padding: const EdgeInsets.fromLTRB(16, 10, 16, 16),
      decoration: BoxDecoration(
        color: Colors.white,
        boxShadow: [
          BoxShadow(color: Colors.black.withOpacity(0.06),
              blurRadius: 10, offset: const Offset(0, -2)),
        ],
      ),
      child: Row(children: [
        Expanded(
          child: Container(
            decoration: BoxDecoration(
              color: const Color(0xFFF4F7FB),
              borderRadius: BorderRadius.circular(24),
              border: Border.all(color: Colors.grey.shade200),
            ),
            child: TextField(
              controller: _controller,
              maxLines: 4,
              minLines: 1,
              textCapitalization: TextCapitalization.sentences,
              style: const TextStyle(fontSize: 14, color: Color(0xFF0F172A)),
              decoration: InputDecoration(
                hintText: 'Write a message...',
                hintStyle: TextStyle(color: Colors.grey.shade400, fontSize: 14),
                border: InputBorder.none,
                contentPadding: const EdgeInsets.symmetric(
                    horizontal: 16, vertical: 12),
              ),
              onSubmitted: (_) => _send(),
            ),
          ),
        ),
        const SizedBox(width: 10),
        GestureDetector(
          onTap: _send,
          child: Container(
            width: 46, height: 46,
            decoration: BoxDecoration(
              color: _isSending ? Colors.grey.shade300 : _primary,
              shape: BoxShape.circle,
              boxShadow: [
                BoxShadow(color: _primary.withOpacity(0.3),
                    blurRadius: 8, offset: const Offset(0, 3)),
              ],
            ),
            child: _isSending
                ? const Padding(
                    padding: EdgeInsets.all(12),
                    child: CircularProgressIndicator(
                        color: Colors.white, strokeWidth: 2))
                : const Icon(Icons.send_rounded, color: Colors.white, size: 20),
          ),
        ),
      ]),
    );
  }
}