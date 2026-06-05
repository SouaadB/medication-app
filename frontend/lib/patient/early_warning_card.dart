import 'package:flutter/material.dart';
import '../services/signal_service.dart';

// ─────────────────────────────────────────────────────────────────────────────
// EARLY WARNING CARD
//
// Displays the AI adherence forecast on the patient health overview page.
//
// Usage — add to health_overview_page.dart:
//   EarlyWarningCard()
//
// The card:
//   • Loads the latest forecast on mount
//   • Shows risk level with color coding
//   • Lists active signals with details
//   • Has a refresh button
//   • Hides itself when risk is LOW (no need to worry the patient)
// ─────────────────────────────────────────────────────────────────────────────

class EarlyWarningCard extends StatefulWidget {
  /// If true, always shows the card even when risk is LOW (useful for testing)
  final bool showWhenLow;

  const EarlyWarningCard({super.key, this.showWhenLow = false});

  @override
  State<EarlyWarningCard> createState() => _EarlyWarningCardState();
}

class _EarlyWarningCardState extends State<EarlyWarningCard>
    with SingleTickerProviderStateMixin {

  AdherenceForecast? _forecast;
  bool _isLoading  = true;
  bool _isRefreshing = false;
  bool _expanded   = false;

  late AnimationController _pulseCtrl;
  late Animation<double>   _pulseAnim;

  @override
  void initState() {
    super.initState();
    _pulseCtrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1200),
    );
    _pulseAnim = Tween<double>(begin: 1.0, end: 1.04).animate(
      CurvedAnimation(parent: _pulseCtrl, curve: Curves.easeInOut),
    );
    _loadForecast();
  }

  @override
  void dispose() {
    _pulseCtrl.dispose();
    super.dispose();
  }

  Future<void> _loadForecast() async {
    setState(() => _isLoading = true);
    final forecast = await SignalService.instance.getLatestForecast();
    if (mounted) {
      setState(() {
        _forecast  = forecast;
        _isLoading = false;
      });
      // Pulse animation for high/critical risk
      if (forecast?.riskLevel == 'critical' || forecast?.riskLevel == 'high') {
        _pulseCtrl.repeat(reverse: true);
      }
    }
  }

  Future<void> _refresh() async {
    setState(() => _isRefreshing = true);
    _pulseCtrl.stop();
    final forecast = await SignalService.instance.generateForecast();
    if (mounted) {
      setState(() {
        _forecast    = forecast;
        _isRefreshing = false;
      });
      if (forecast?.riskLevel == 'critical' || forecast?.riskLevel == 'high') {
        _pulseCtrl.repeat(reverse: true);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) return _buildSkeleton();
    if (_forecast == null) return const SizedBox.shrink();
    if (_forecast!.riskLevel == 'low' && !widget.showWhenLow) {
      return _buildLowRiskBadge();
    }
    return _buildForecastCard(_forecast!);
  }

  // ── Main card ────────────────────────────────────────────────────────────────

  Widget _buildForecastCard(AdherenceForecast f) {
    final isCritical = f.riskLevel == 'critical';

    return AnimatedBuilder(
      animation: _pulseAnim,
      builder: (_, __) => Transform.scale(
        scale: isCritical ? _pulseAnim.value : 1.0,
        child: Container(
          margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(20),
            border: Border.all(
              color: f.riskColor.withOpacity(isCritical ? 0.6 : 0.3),
              width: isCritical ? 2 : 1.5,
            ),
            boxShadow: [
              BoxShadow(
                color: f.riskColor.withOpacity(0.12),
                blurRadius: 16,
                offset: const Offset(0, 6),
              ),
            ],
          ),
          child: Column(children: [

            // ── Colored top stripe ──────────────────────────────────────────
            Container(
              height: 5,
              decoration: BoxDecoration(
                color: f.riskColor,
                borderRadius: const BorderRadius.vertical(top: Radius.circular(20)),
              ),
            ),

            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [

                // ── Header row ──────────────────────────────────────────────
                Row(children: [
                  Container(
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: f.riskBgColor,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Icon(f.riskIcon, color: f.riskColor, size: 22),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                      Text(
                        '🤖 AI Health Insight',
                        style: TextStyle(
                          fontSize: 11,
                          color: Colors.grey.shade500,
                          letterSpacing: 0.5,
                        ),
                      ),
                      Text(
                        f.riskLabel,
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: f.riskColor,
                        ),
                      ),
                    ]),
                  ),
                  // Score badge
                  Container(
                    padding: const EdgeInsets.symmetric(
                        horizontal: 12, vertical: 6),
                    decoration: BoxDecoration(
                      color: f.riskBgColor,
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Text(
                      '${f.scorePercent}%',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: f.riskColor,
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  // Refresh button
                  GestureDetector(
                    onTap: _isRefreshing ? null : _refresh,
                    child: Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: Colors.grey.shade100,
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: _isRefreshing
                          ? SizedBox(
                              width: 16, height: 16,
                              child: CircularProgressIndicator(
                                strokeWidth: 2, color: f.riskColor),
                            )
                          : Icon(Icons.refresh_rounded,
                              size: 18, color: Colors.grey.shade500),
                    ),
                  ),
                ]),

                const SizedBox(height: 12),

                // ── Risk score bar ───────────────────────────────────────────
                Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Row(mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                    Text('Adherence risk score',
                        style: TextStyle(
                            fontSize: 12, color: Colors.grey.shade500)),
                    Text('${f.scorePercent}/100',
                        style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                            color: f.riskColor)),
                  ]),
                  const SizedBox(height: 6),
                  ClipRRect(
                    borderRadius: BorderRadius.circular(4),
                    child: LinearProgressIndicator(
                      value: f.forecastScore,
                      minHeight: 8,
                      backgroundColor: Colors.grey.shade100,
                      valueColor: AlwaysStoppedAnimation<Color>(f.riskColor),
                    ),
                  ),
                ]),

                // ── Active signals ───────────────────────────────────────────
                if (f.activeSignals.isNotEmpty) ...[
                  const SizedBox(height: 14),
                  GestureDetector(
                    onTap: () => setState(() => _expanded = !_expanded),
                    child: Row(children: [
                      Text(
                        '${f.activeSignals.length} risk factor${f.activeSignals.length > 1 ? 's' : ''} detected',
                        style: TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.w600,
                          color: Colors.grey.shade700,
                        ),
                      ),
                      const Spacer(),
                      Icon(
                        _expanded
                            ? Icons.keyboard_arrow_up_rounded
                            : Icons.keyboard_arrow_down_rounded,
                        color: Colors.grey.shade400,
                        size: 20,
                      ),
                    ]),
                  ),

                  if (_expanded) ...[
                    const SizedBox(height: 10),
                    ...f.activeSignals.map((s) => _buildSignalRow(s, f.riskColor)),
                  ],
                ],

                if (f.activeSignals.isEmpty) ...[
                  const SizedBox(height: 8),
                  Text(
                    'No specific risk factors identified.',
                    style: TextStyle(
                        fontSize: 13, color: Colors.grey.shade500),
                  ),
                ],

                // ── Timestamp ────────────────────────────────────────────────
                const SizedBox(height: 10),
                Row(children: [
                  Icon(Icons.access_time_rounded,
                      size: 12, color: Colors.grey.shade400),
                  const SizedBox(width: 4),
                  Text(
                    'Updated ${_timeAgo(f.createdAt)}',
                    style: TextStyle(
                        fontSize: 11, color: Colors.grey.shade400),
                  ),
                ]),
              ]),
            ),
          ]),
        ),
      ),
    );
  }

  // ── Signal row ───────────────────────────────────────────────────────────────

  Widget _buildSignalRow(ActiveSignal signal, Color riskColor) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: riskColor.withOpacity(0.05),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: riskColor.withOpacity(0.15)),
      ),
      child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Icon(signal.icon, size: 16, color: riskColor),
        const SizedBox(width: 10),
        Expanded(
          child: Column(crossAxisAlignment: CrossAxisAlignment.start,
              children: [
            Text(
              signal.label,
              style: TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.bold,
                color: Colors.grey.shade800,
              ),
            ),
            const SizedBox(height: 2),
            Text(
              signal.detail,
              style: TextStyle(
                  fontSize: 12, color: Colors.grey.shade600, height: 1.4),
            ),
          ]),
        ),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 3),
          decoration: BoxDecoration(
            color: riskColor.withOpacity(0.1),
            borderRadius: BorderRadius.circular(8),
          ),
          child: Text(
            '${(signal.score * 100).round()}%',
            style: TextStyle(
                fontSize: 11,
                fontWeight: FontWeight.bold,
                color: riskColor),
          ),
        ),
      ]),
    );
  }

  // ── Low risk badge ───────────────────────────────────────────────────────────

  Widget _buildLowRiskBadge() {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: BoxDecoration(
        color: Colors.green.shade50,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: Colors.green.shade200),
      ),
      child: Row(children: [
        Icon(Icons.check_circle_outline_rounded,
            color: Colors.green.shade600, size: 20),
        const SizedBox(width: 10),
        Expanded(
          child: Text(
            'AI health analysis: adherence looks good! Keep it up.',
            style: TextStyle(
                fontSize: 13,
                color: Colors.green.shade700,
                fontWeight: FontWeight.w500),
          ),
        ),
      ]),
    );
  }

  // ── Skeleton loader ──────────────────────────────────────────────────────────

  Widget _buildSkeleton() {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      height: 120,
      decoration: BoxDecoration(
        color: Colors.grey.shade100,
        borderRadius: BorderRadius.circular(20),
      ),
      child: const Center(
        child: CircularProgressIndicator(strokeWidth: 2),
      ),
    );
  }

  // ── Helpers ──────────────────────────────────────────────────────────────────

  String _timeAgo(DateTime dt) {
    final diff = DateTime.now().difference(dt);
    if (diff.inMinutes < 1)  return 'just now';
    if (diff.inMinutes < 60) return '${diff.inMinutes} min ago';
    if (diff.inHours < 24)   return '${diff.inHours}h ago';
    return '${diff.inDays}d ago';
  }
}