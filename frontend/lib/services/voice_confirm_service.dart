import 'dart:async';
import 'package:flutter/material.dart';
import 'package:speech_to_text/speech_to_text.dart';

// ─────────────────────────────────────────────────────────────────────────────
// VOICE CONFIRM SERVICE
//
// Listens for confirmation keywords after patient takes medication.
// Patient taps the mic button → speaks → app detects keyword → confirms.
//
// Recognised keywords (English + French):
//   "took", "taken", "done", "yes", "ok", "confirm",
//   "pris", "oui", "fait", "terminé"
//
// Usage:
//   final voice = VoiceConfirmService();
//   await voice.initialize();
//   await voice.startListening(
//     onConfirmed: () => markAsTaken(),
//     onListeningChanged: (isListening) => setState(...),
//     onPartialResult: (text) => setState(...),
//   );
//   voice.stop();
// ─────────────────────────────────────────────────────────────────────────────

class VoiceConfirmService {

  final SpeechToText _speech = SpeechToText();
  bool _initialized = false;
  bool _isListening = false;

  bool get isListening  => _isListening;
  bool get isAvailable  => _initialized;

  static const List<String> _keywords = [
    // English
    'took', 'taken', 'done', 'yes', 'ok', 'okay',
    'confirm', 'confirmed', 'i took it', 'taken it',
    // French
    'pris', 'oui', 'fait', 'terminé', 'termine', 'je l ai pris',
  ];

  // ── Initialize ───────────────────────────────────────────────────────────────
  Future<bool> initialize() async {
    if (_initialized) return true;
    _initialized = await _speech.initialize(
      onError: (e) => debugPrint('[Voice] Error: ${e.errorMsg}'),
      onStatus: (s) => debugPrint('[Voice] Status: $s'),
    );
    return _initialized;
  }

  // ── Start listening ──────────────────────────────────────────────────────────
  Future<void> startListening({
    required VoidCallback onConfirmed,
    required ValueChanged<bool> onListeningChanged,
    ValueChanged<String>? onPartialResult,
  }) async {
    if (!_initialized) {
      final ok = await initialize();
      if (!ok) return;
    }

    if (_isListening) {
      await stop();
      return;
    }

    _isListening = true;
    onListeningChanged(true);

    await _speech.listen(
      listenFor: const Duration(seconds: 8),
      pauseFor:  const Duration(seconds: 3),
      localeId:  'en_US',
      partialResults: true,
      onResult: (result) {
        final text = result.recognizedWords.toLowerCase().trim();
        debugPrint('[Voice] Heard: "$text"');

        onPartialResult?.call(text);

        // Check for any confirmation keyword
        final confirmed = _keywords.any((kw) => text.contains(kw));
        if (confirmed) {
          debugPrint('[Voice] Keyword detected — confirming');
          stop();
          onListeningChanged(false);
          onConfirmed();
        }
      },
      listenMode: ListenMode.confirmation,
    );

    // Auto-stop after listen duration
    Future.delayed(const Duration(seconds: 8), () {
      if (_isListening) {
        stop();
        onListeningChanged(false);
      }
    });
  }

  // ── Stop ─────────────────────────────────────────────────────────────────────
  Future<void> stop() async {
    _isListening = false;
    await _speech.stop();
  }

  void dispose() {
    _speech.cancel();
  }
}