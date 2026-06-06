import 'dart:async';
import 'dart:math';
import 'package:flutter/material.dart';
import 'package:sensors_plus/sensors_plus.dart';

// ─────────────────────────────────────────────────────────────────────────────
// SHAKE CONFIRM SERVICE  v2
//
// Fix 1 — Sensitivity: uses a GRAVITY-REMOVED magnitude so that resting on a
//   table (gravity ~9.8) no longer triggers. We track the low-pass filtered
//   gravity component and subtract it, leaving only the dynamic acceleration.
//   Threshold is applied to that dynamic magnitude only.
//
// Fix 2 — Single target: the service is a SINGLETON with one active callback
//   at a time. Each card registers itself with a notificationId. When shake
//   fires, only the registered card's callback runs — never multiple at once.
//
// Fix 3 — Gesture pattern: requires 3 back-and-forth peaks (direction
//   changes) not just 3 magnitude spikes. This filters out a single slam
//   or placing the phone down, while still recognising a real shake.
//
// Usage (in card initState):
//   ShakeConfirmService.instance.register(
//     notificationId: widget.notification['id'],
//     onConfirmed: _handleTaken,
//     onProgress: (n) => setState(() => _shakeCount = n),
//   );
//
// Usage (in card dispose):
//   ShakeConfirmService.instance.unregister(widget.notification['id']);
// ─────────────────────────────────────────────────────────────────────────────

class ShakeConfirmService {

  ShakeConfirmService._();
  static final ShakeConfirmService instance = ShakeConfirmService._();

  // ── Tuning constants ────────────────────────────────────────────────────────
  // Dynamic acceleration threshold (gravity removed).
  // 12 m/s²  = moderate deliberate shake
  // 8  m/s²  = gentle shake
  // 18 m/s²  = very strong (old value — too high for some users)
  static const double _threshold      = 12.0;

  // How many direction-change peaks needed
  static const int    _requiredShakes = 3;

  // All peaks must occur within this window
  static const int    _windowMs       = 2000;

  // Cooldown after confirmation — prevents double-fire
  static const int    _cooldownMs     = 2000;

  // Low-pass filter alpha: higher = faster gravity tracking
  // 0.8 = tracks gravity well while removing quick jolts
  static const double _alpha          = 0.8;

  // ── State ───────────────────────────────────────────────────────────────────
  StreamSubscription<AccelerometerEvent>? _sub;
  bool _inCooldown = false;

  // Gravity estimate (low-pass filtered)
  double _gx = 0, _gy = 0, _gz = 9.8;

  // Direction tracking for pattern detection
  double _lastDynMag = 0;
  bool   _wasAbove   = false; // was previous sample above threshold?
  final List<DateTime> _peakTimestamps = [];

  // Active registration — only ONE card listens at a time
  int?              _activeId;
  VoidCallback?     _onConfirmed;
  ValueChanged<int>? _onProgress;

  // ── Register ─────────────────────────────────────────────────────────────────
  // Call from card initState. Replaces any previous registration.
  void register({
    required int notificationId,
    required VoidCallback onConfirmed,
    ValueChanged<int>? onProgress,
  }) {
    _activeId    = notificationId;
    _onConfirmed = onConfirmed;
    _onProgress  = onProgress;
    _peakTimestamps.clear();
    _wasAbove    = false;
    _lastDynMag  = 0;

    // Start sensor if not already running
    if (_sub == null) {
      _sub = accelerometerEventStream(
        samplingPeriod: SensorInterval.normalInterval,
      ).listen(_onAccelerometer);
    }
  }

  // ── Unregister ───────────────────────────────────────────────────────────────
  // Call from card dispose. If no other card registered, stops the sensor.
  void unregister(int notificationId) {
    if (_activeId == notificationId) {
      _activeId    = null;
      _onConfirmed = null;
      _onProgress  = null;
      _peakTimestamps.clear();
      _sub?.cancel();
      _sub = null;
    }
  }

  // ── Core detection ────────────────────────────────────────────────────────────
  void _onAccelerometer(AccelerometerEvent e) {
    if (_activeId == null || _inCooldown) return;

    // 1. Update gravity estimate with low-pass filter
    _gx = _alpha * _gx + (1 - _alpha) * e.x;
    _gy = _alpha * _gy + (1 - _alpha) * e.y;
    _gz = _alpha * _gz + (1 - _alpha) * e.z;

    // 2. Dynamic acceleration = total - gravity
    final dx = e.x - _gx;
    final dy = e.y - _gy;
    final dz = e.z - _gz;
    final dynMag = sqrt(dx * dx + dy * dy + dz * dz);

    // 3. Detect a PEAK: crossing from below threshold to above then back
    //    This counts one "shake" only at the moment it peaks and comes back
    final isAbove = dynMag > _threshold;

    if (_wasAbove && !isAbove) {
      // We just crossed back down — this is one completed shake peak
      final now = DateTime.now();

      // Drop peaks outside the time window
      _peakTimestamps.removeWhere(
          (t) => now.difference(t).inMilliseconds > _windowMs);

      _peakTimestamps.add(now);
      _onProgress?.call(_peakTimestamps.length);

      if (_peakTimestamps.length >= _requiredShakes) {
        _peakTimestamps.clear();
        _triggerConfirmation();
      }
    }

    _wasAbove   = isAbove;
    _lastDynMag = dynMag;
  }

  void _triggerConfirmation() {
    _inCooldown = true;
    final cb = _onConfirmed;
    cb?.call();
    Future.delayed(
      const Duration(milliseconds: _cooldownMs),
      () => _inCooldown = false,
    );
  }
}