import 'dart:async';
import 'dart:math';
import 'package:flutter/material.dart';
import 'package:sensors_plus/sensors_plus.dart';
import 'accessibility_service.dart';

// ─────────────────────────────────────────────────────────────────────────────
// SHAKE CONFIRM SERVICE
//
// Detects a deliberate shake gesture and fires a callback.
// Only active when explicitly started — never runs in background.
//
// Algorithm:
//   - Reads accelerometer at ~50Hz
//   - Calculates magnitude of acceleration vector
//   - A "shake event" fires when magnitude > threshold
//   - Requires 3 shake events within 1.5 seconds → confirms
//   - 1 second cooldown after confirmation to prevent double-fire
//
// Usage:
//   final shake = ShakeConfirmService();
//   shake.start(onConfirmed: () => markAsTaken());
//   shake.stop(); // call in dispose()
// ─────────────────────────────────────────────────────────────────────────────

class ShakeConfirmService {

  // ── Config ──────────────────────────────────────────────────────────────────
  static const double _threshold      = 18.0; // m/s² — above gravity+movement
  static const int    _requiredShakes = 3;    // shakes needed to confirm
  static const int    _windowMs       = 1500; // time window in ms
  static const int    _cooldownMs     = 1000; // cooldown after confirm

  // ── State ───────────────────────────────────────────────────────────────────
  StreamSubscription<AccelerometerEvent>? _sub;
  final List<DateTime> _shakeTimestamps = [];
  bool _isActive   = false;
  bool _inCooldown = false;
  VoidCallback? _onConfirmed;
  ValueChanged<int>? _onShakeProgress; // fires with current shake count

  bool get isActive => _isActive;

  // ── Start listening ──────────────────────────────────────────────────────────
  void start({
    required VoidCallback onConfirmed,
    ValueChanged<int>? onShakeProgress,
  }) {
    if (_isActive) stop();
    _isActive        = true;
    _onConfirmed     = onConfirmed;
    _onShakeProgress = onShakeProgress;
    _shakeTimestamps.clear();

    _sub = accelerometerEventStream(
      samplingPeriod: SensorInterval.normalInterval,
    ).listen(_onAccelerometer);
  }

  // ── Stop listening ───────────────────────────────────────────────────────────
  void stop() {
    _sub?.cancel();
    _sub = null;
    _isActive = false;
    _shakeTimestamps.clear();
  }

  // ── Core detection ───────────────────────────────────────────────────────────
  void _onAccelerometer(AccelerometerEvent e) {
    if (!_isActive || _inCooldown) return;

    // Magnitude of acceleration vector (gravity ~9.8 m/s² at rest)
    final magnitude = sqrt(e.x * e.x + e.y * e.y + e.z * e.z);

    if (magnitude > _threshold) {
      final now = DateTime.now();

      // Remove timestamps outside the time window
      _shakeTimestamps.removeWhere((t) =>
          now.difference(t).inMilliseconds > _windowMs);

      // Add current shake
      _shakeTimestamps.add(now);

      // Report progress
      _onShakeProgress?.call(_shakeTimestamps.length);

      // Check if we've reached the required count
      if (_shakeTimestamps.length >= _requiredShakes) {
        _shakeTimestamps.clear();
        _triggerConfirmation();
      }
    }
  }

  void _triggerConfirmation() {
    _inCooldown = true;
    _onConfirmed?.call();

    // Reset cooldown
    Future.delayed(
      const Duration(milliseconds: _cooldownMs),
      () => _inCooldown = false,
    );
  }
}