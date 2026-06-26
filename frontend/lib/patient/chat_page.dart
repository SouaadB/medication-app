import 'dart:async';
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:path_provider/path_provider.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:record/record.dart';
import 'package:audioplayers/audioplayers.dart';
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

  // ── Voice recording ──────────────────────────────────────────────────────
  final AudioRecorder _audioRecorder = AudioRecorder();
  bool _isRecording = false;
  bool _isUploadingVoice = false;
  int _recordSeconds = 0;
  Timer? _recordTimer;
  String? _recordingPath;

  // ── Voice playback ───────────────────────────────────────────────────────
  final AudioPlayer _audioPlayer = AudioPlayer();
  int? _playingMessageId;
  Duration _playPosition = Duration.zero;
  Duration _playDuration = Duration.zero;

  static const Color _primary = Color(0xFF1565C0);

  @override
  void initState() {
    super.initState();
    _loadIdentity().then((_) {
      _fetchMessages();
      // Poll every 4 seconds for new messages
      _pollTimer = Timer.periodic(const Duration(seconds: 4), (_) => _fetchMessages(silent: true));
    });

    _audioPlayer.onPositionChanged.listen((pos) {
      if (mounted) setState(() => _playPosition = pos);
    });
    _audioPlayer.onDurationChanged.listen((dur) {
      if (mounted) setState(() => _playDuration = dur);
    });
    _audioPlayer.onPlayerComplete.listen((_) {
      if (mounted) setState(() {
        _playingMessageId = null;
        _playPosition = Duration.zero;
      });
    });
  }

  @override
  void dispose() {
    _pollTimer?.cancel();
    _recordTimer?.cancel();
    _audioRecorder.dispose();
    _audioPlayer.dispose();
    _controller.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  // ── Recording flow ───────────────────────────────────────────────────────
  Future<void> _startRecording() async {
    final micStatus = await Permission.microphone.request();
    if (!micStatus.isGranted) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
          content: Text('Microphone permission is required to send voice messages'),
          backgroundColor: Colors.red,
          behavior: SnackBarBehavior.floating,
        ));
      }
      return;
    }

    if (!await _audioRecorder.hasPermission()) return;

    final dir = await getTemporaryDirectory();
    final filePath = '${dir.path}/voice_${DateTime.now().millisecondsSinceEpoch}.m4a';

    await _audioRecorder.start(
      const RecordConfig(encoder: AudioEncoder.aacLc),
      path: filePath,
    );

    setState(() {
      _isRecording = true;
      _recordSeconds = 0;
      _recordingPath = filePath;
    });

    _recordTimer = Timer.periodic(const Duration(seconds: 1), (_) {
      if (mounted) setState(() => _recordSeconds++);
    });
  }

  Future<void> _cancelRecording() async {
    _recordTimer?.cancel();
    try {
      await _audioRecorder.stop();
      if (_recordingPath != null) {
        final f = File(_recordingPath!);
        if (await f.exists()) await f.delete();
      }
    } catch (_) {}
    if (mounted) {
      setState(() {
        _isRecording = false;
        _recordingPath = null;
        _recordSeconds = 0;
      });
    }
  }

  Future<void> _stopAndSendRecording() async {
    _recordTimer?.cancel();
    final durationSeconds = _recordSeconds;

    String? path;
    try {
      path = await _audioRecorder.stop();
    } catch (_) {}
    path ??= _recordingPath;

    if (mounted) {
      setState(() {
        _isRecording = false;
        _recordingPath = null;
        _recordSeconds = 0;
      });
    }

    if (path == null || durationSeconds < 1) return;

    setState(() => _isUploadingVoice = true);
    final ok = await ChatService.sendVoiceMessage(widget.partnerId, path, durationSeconds);
    if (mounted) {
      setState(() => _isUploadingVoice = false);
      if (ok) {
        await _fetchMessages(silent: true);
      } else {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
          content: Text('Failed to send voice message'),
          backgroundColor: Colors.red,
          behavior: SnackBarBehavior.floating,
        ));
      }
    }
    try {
      final f = File(path);
      if (await f.exists()) await f.delete();
    } catch (_) {}
  }

  // ── Playback flow ────────────────────────────────────────────────────────
  Future<void> _togglePlayback(ChatMessage msg) async {
    if (msg.audioUrl == null) return;

    if (_playingMessageId == msg.id) {
      await _audioPlayer.pause();
      setState(() => _playingMessageId = null);
      return;
    }

    await _audioPlayer.stop();
    setState(() {
      _playingMessageId = msg.id;
      _playPosition = Duration.zero;
      _playDuration = Duration(seconds: msg.audioDuration ?? 0);
    });
    await _audioPlayer.play(UrlSource(msg.audioUrl!));
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

  String _formatDuration(Duration d) {
    final minutes = d.inMinutes.remainder(60).toString().padLeft(2, '0');
    final seconds = d.inSeconds.remainder(60).toString().padLeft(2, '0');
    return '$minutes:$seconds';
  }

  Widget _buildVoiceContent(ChatMessage msg, bool isMe) {
    final isPlaying = _playingMessageId == msg.id;
    final totalSeconds = msg.audioDuration ?? 0;
    final progress = isPlaying && _playDuration.inMilliseconds > 0
        ? (_playPosition.inMilliseconds / _playDuration.inMilliseconds).clamp(0.0, 1.0)
        : 0.0;
    final fgColor = isMe ? Colors.white : _primary;

    return SizedBox(
      width: 180,
      child: Row(children: [
        GestureDetector(
          onTap: () => _togglePlayback(msg),
          child: Container(
            width: 34, height: 34,
            decoration: BoxDecoration(
              color: isMe ? Colors.white.withOpacity(0.2) : _primary.withOpacity(0.1),
              shape: BoxShape.circle,
            ),
            child: Icon(
              isPlaying ? Icons.pause_rounded : Icons.play_arrow_rounded,
              color: fgColor, size: 20,
            ),
          ),
        ),
        const SizedBox(width: 10),
        Expanded(
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            ClipRRect(
              borderRadius: BorderRadius.circular(4),
              child: LinearProgressIndicator(
                value: progress,
                minHeight: 4,
                backgroundColor: isMe ? Colors.white.withOpacity(0.25) : Colors.grey.shade200,
                valueColor: AlwaysStoppedAnimation<Color>(fgColor),
              ),
            ),
            const SizedBox(height: 4),
            Text(
              isPlaying ? _formatDuration(_playPosition) : _formatDuration(Duration(seconds: totalSeconds)),
              style: TextStyle(fontSize: 11, color: isMe ? Colors.white.withOpacity(0.7) : Colors.grey.shade500),
            ),
          ]),
        ),
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
                  if (msg.isVoice)
                    _buildVoiceContent(msg, isMe)
                  else
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
      child: _isRecording ? _buildRecordingRow() : _buildTextInputRow(),
    );
  }

  Widget _buildRecordingRow() {
    return Row(children: [
      GestureDetector(
        onTap: _cancelRecording,
        child: Container(
          width: 46, height: 46,
          decoration: BoxDecoration(color: Colors.grey.shade200, shape: BoxShape.circle),
          child: const Icon(Icons.close_rounded, color: Colors.grey, size: 20),
        ),
      ),
      const SizedBox(width: 10),
      Expanded(
        child: Container(
          height: 46,
          padding: const EdgeInsets.symmetric(horizontal: 16),
          decoration: BoxDecoration(
            color: const Color(0xFFF4F7FB),
            borderRadius: BorderRadius.circular(24),
            border: Border.all(color: Colors.grey.shade200),
          ),
          child: Row(children: [
            Container(width: 10, height: 10,
                decoration: const BoxDecoration(color: Colors.red, shape: BoxShape.circle)),
            const SizedBox(width: 10),
            Text('Recording…  ${_formatDuration(Duration(seconds: _recordSeconds))}',
                style: const TextStyle(fontSize: 14, color: Color(0xFF0F172A),
                    fontWeight: FontWeight.w600)),
          ]),
        ),
      ),
      const SizedBox(width: 10),
      GestureDetector(
        onTap: _stopAndSendRecording,
        child: Container(
          width: 46, height: 46,
          decoration: BoxDecoration(
            color: _primary,
            shape: BoxShape.circle,
            boxShadow: [
              BoxShadow(color: _primary.withOpacity(0.3),
                  blurRadius: 8, offset: const Offset(0, 3)),
            ],
          ),
          child: const Icon(Icons.send_rounded, color: Colors.white, size: 20),
        ),
      ),
    ]);
  }

  Widget _buildTextInputRow() {
    return Row(children: [
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
      ValueListenableBuilder<TextEditingValue>(
        valueListenable: _controller,
        builder: (context, value, _) {
          final hasText = value.text.trim().isNotEmpty;
          final busy = _isSending || _isUploadingVoice;

          return GestureDetector(
            onTap: busy
                ? null
                : (hasText ? _send : _startRecording),
            child: Container(
              width: 46, height: 46,
              decoration: BoxDecoration(
                color: busy ? Colors.grey.shade300 : _primary,
                shape: BoxShape.circle,
                boxShadow: [
                  BoxShadow(color: _primary.withOpacity(0.3),
                      blurRadius: 8, offset: const Offset(0, 3)),
                ],
              ),
              child: busy
                  ? const Padding(
                      padding: EdgeInsets.all(12),
                      child: CircularProgressIndicator(
                          color: Colors.white, strokeWidth: 2))
                  : Icon(hasText ? Icons.send_rounded : Icons.mic_rounded,
                      color: Colors.white, size: 20),
            ),
          );
        },
      ),
    ]);
  }
}