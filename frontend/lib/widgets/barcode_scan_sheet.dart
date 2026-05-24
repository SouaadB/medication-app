// lib/widgets/barcode_scan_sheet.dart
//
// Full-featured elderly-friendly barcode scan bottom sheet.
// Usage:
//   final result = await BarcodeScanSheet.show(context, medicationName: 'Glucophage');
//   if (result != null) { /* use result.rawValue */ }
//
// pubspec.yaml dependencies needed:
//   mobile_scanner: ^5.0.0
//   image_picker: ^1.1.2
//
// Android: add CAMERA to AndroidManifest.xml
// iOS: NSCameraUsageDescription + NSPhotoLibraryUsageDescription in Info.plist

import 'package:flutter/material.dart';
import 'package:mobile_scanner/mobile_scanner.dart';
import 'package:image_picker/image_picker.dart';
import '../services/barcode_service.dart';

class BarcodeScanSheet extends StatefulWidget {
  final String medicationName;

  const BarcodeScanSheet({super.key, required this.medicationName});

  static Future<BarcodeResult?> show(
    BuildContext context, {
    required String medicationName,
  }) {
    return showModalBottomSheet<BarcodeResult?>(
      context: context,
      isScrollControlled: true,
      enableDrag: false,
      backgroundColor: Colors.transparent,
      builder: (_) => BarcodeScanSheet(medicationName: medicationName),
    );
  }

  @override
  State<BarcodeScanSheet> createState() => _BarcodeScanSheetState();
}

class _BarcodeScanSheetState extends State<BarcodeScanSheet> {
  late final MobileScannerController _ctrl;

  bool _torchOn         = false;
  bool _scanned         = false;
  bool _showHelp        = false;
  bool _processingPhoto = false;
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
   _ctrl = MobileScannerController(
  detectionSpeed: DetectionSpeed.normal,
  facing: CameraFacing.back,
  torchEnabled: false,
);
  }

  @override
  void dispose() {
    _ctrl.dispose();
    super.dispose();
  }

  // ── barcode detected from live camera ──────────────────────────────────────

  void _onDetect(BarcodeCapture capture) {
    if (_scanned || !mounted) return;
    final raw = capture.barcodes
        .map((b) => b.rawValue)
        .where((v) => v != null && v.isNotEmpty)
        .firstOrNull;
    if (raw == null) return;

    setState(() => _scanned = true);
    _ctrl.stop();

    final result = BarcodeResult(
      rawValue:     raw,
      displayValue: BarcodeService.formatForDisplay(raw),
      format:       capture.barcodes.first.format.name,
      scannedAt:    DateTime.now(),
    );

    Future.delayed(const Duration(milliseconds: 700), () {
      if (mounted) Navigator.pop(context, result);
    });
  }

  // ── scan from gallery photo ─────────────────────────────────────────────────

  Future<void> _scanFromPhoto() async {
    setState(() { _processingPhoto = true; _errorMessage = null; });
    try {
      final picker = ImagePicker();
      final image  = await picker.pickImage(source: ImageSource.gallery, imageQuality: 90);
      if (image == null) { setState(() => _processingPhoto = false); return; }

    final result = await _ctrl.analyzeImage(image.path);

      if (!mounted) return;

      if (result == null || result.barcodes.isEmpty || result.barcodes.first.rawValue == null) {
        setState(() {
          _errorMessage    = 'No barcode found in photo. Try again or use the live scanner.';
          _processingPhoto = false;
        });
        return;
      }

      final raw = result.barcodes.first.rawValue!;
      Navigator.pop(context, BarcodeResult(
        rawValue:     raw,
        displayValue: BarcodeService.formatForDisplay(raw),
        format:       result.barcodes.first.format.name,
        scannedAt:    DateTime.now(),
      ));
    } catch (_) {
      if (mounted) {
        setState(() {
          _errorMessage    = 'Could not process photo. Please use the live scanner.';
          _processingPhoto = false;
        });
      }
    }
  }

  void _toggleTorch() {
    setState(() => _torchOn = !_torchOn);
    _ctrl.toggleTorch();
  }

  // ── BUILD ──────────────────────────────────────────────────────────────────

  @override
  Widget build(BuildContext context) {
    final sh = MediaQuery.of(context).size.height;

    return Container(
      height: sh * 0.92,
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
      ),
      child: Column(children: [

        // drag handle
        const SizedBox(height: 12),
        Container(width: 40, height: 4,
            decoration: BoxDecoration(color: Colors.grey.shade300, borderRadius: BorderRadius.circular(2))),
        const SizedBox(height: 16),

        // header
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20),
          child: Row(children: [
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(color: Colors.blue.shade50, borderRadius: BorderRadius.circular(12)),
              child: const Icon(Icons.qr_code_scanner, color: Colors.blue, size: 28),
            ),
            const SizedBox(width: 12),
            Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              const Text('Scan Medication Barcode',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFF1A237E))),
              Text(widget.medicationName,
                  style: TextStyle(fontSize: 13, color: Colors.grey.shade600),
                  overflow: TextOverflow.ellipsis),
            ])),
            // help toggle
            GestureDetector(
              onTap: () => setState(() => _showHelp = !_showHelp),
              child: Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: _showHelp ? Colors.blue.shade100 : Colors.grey.shade100,
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Icon(Icons.help_outline,
                    color: _showHelp ? Colors.blue : Colors.grey.shade600),
              ),
            ),
          ]),
        ),
        const SizedBox(height: 12),

        // help panel
        if (_showHelp) _buildHelpPanel(),

        // camera
        Expanded(child: _buildCamera()),

        // controls
        _buildControls(),
        const SizedBox(height: 4),

        // skip
        Padding(
          padding: const EdgeInsets.fromLTRB(20, 4, 20, 12),
          child: SizedBox(
            width: double.infinity, height: 52,
            child: OutlinedButton.icon(
              onPressed: () => Navigator.pop(context, null),
              icon: const Icon(Icons.skip_next, color: Colors.grey),
              label: const Text('Skip — Save Without Barcode',
                  style: TextStyle(fontSize: 16, color: Colors.grey)),
              style: OutlinedButton.styleFrom(
                side: BorderSide(color: Colors.grey.shade300),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
              ),
            ),
          ),
        ),
        SizedBox(height: MediaQuery.of(context).padding.bottom + 4),
      ]),
    );
  }

  // ── camera viewfinder ───────────────────────────────────────────────────────

  Widget _buildCamera() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(20),
        child: Stack(children: [

          MobileScanner(controller: _ctrl, onDetect: _onDetect),

          // scan frame overlay
          CustomPaint(painter: _ScanOverlayPainter(scanned: _scanned), child: const SizedBox.expand()),

          // success flash
          if (_scanned)
            Container(
              color: Colors.green.withOpacity(0.25),
              child: const Center(child: Icon(Icons.check_circle, color: Colors.white, size: 80)),
            ),

          // error overlay
          if (_errorMessage != null)
            Positioned(
              bottom: 12, left: 12, right: 12,
              child: Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.red.shade700.withOpacity(0.9),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Row(children: [
                  const Icon(Icons.warning_amber_rounded, color: Colors.white, size: 18),
                  const SizedBox(width: 8),
                  Expanded(child: Text(_errorMessage!,
                      style: const TextStyle(color: Colors.white, fontSize: 13))),
                  GestureDetector(
                    onTap: () => setState(() => _errorMessage = null),
                    child: const Icon(Icons.close, color: Colors.white, size: 18),
                  ),
                ]),
              ),
            ),

          // photo-processing spinner
          if (_processingPhoto)
            Container(
              color: Colors.black54,
              child: const Center(child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  CircularProgressIndicator(color: Colors.white),
                  SizedBox(height: 12),
                  Text('Scanning photo…', style: TextStyle(color: Colors.white, fontSize: 15)),
                ],
              )),
            ),
        ]),
      ),
    );
  }

  // ── torch + photo buttons ───────────────────────────────────────────────────

  Widget _buildControls() {
    return Padding(
      padding: const EdgeInsets.fromLTRB(20, 10, 20, 4),
      child: Row(children: [
        Expanded(child: _ctrlBtn(
          icon:    _torchOn ? Icons.flashlight_on : Icons.flashlight_off,
          label:   _torchOn ? 'Light On' : 'Turn On Light',
          color:   _torchOn ? Colors.amber.shade700 : Colors.grey.shade700,
          bgColor: _torchOn ? Colors.amber.shade50 : Colors.grey.shade100,
          onTap:   _toggleTorch,
        )),
        const SizedBox(width: 12),
        Expanded(child: _ctrlBtn(
          icon:    Icons.photo_library_outlined,
          label:   'Use Photo',
          color:   Colors.blue.shade700,
          bgColor: Colors.blue.shade50,
          onTap:   _processingPhoto ? null : _scanFromPhoto,
        )),
      ]),
    );
  }

  Widget _ctrlBtn({
    required IconData icon,
    required String label,
    required Color color,
    required Color bgColor,
    VoidCallback? onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 14),
        decoration: BoxDecoration(color: bgColor, borderRadius: BorderRadius.circular(14)),
        child: Column(mainAxisSize: MainAxisSize.min, children: [
          Icon(icon, color: color, size: 28),
          const SizedBox(height: 4),
          Text(label,
              style: TextStyle(color: color, fontSize: 13, fontWeight: FontWeight.w600)),
        ]),
      ),
    );
  }

  // ── help panel ──────────────────────────────────────────────────────────────

  Widget _buildHelpPanel() {
    return Container(
      margin: const EdgeInsets.fromLTRB(16, 0, 16, 8),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.blue.shade50,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: Colors.blue.shade100),
      ),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        const Row(children: [
          Icon(Icons.info_outline, color: Colors.blue, size: 18),
          SizedBox(width: 6),
          Text('Where to find the barcode',
              style: TextStyle(fontWeight: FontWeight.bold, color: Colors.blue, fontSize: 14)),
        ]),
        const SizedBox(height: 10),
        Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
          // simple box+barcode icon
          Container(
            width: 68, height: 80,
            decoration: BoxDecoration(
              border: Border.all(color: Colors.blue.shade300, width: 2),
              borderRadius: BorderRadius.circular(6),
            ),
            child: Column(mainAxisAlignment: MainAxisAlignment.end, children: [
              // barcode lines representation
              Padding(
                padding: const EdgeInsets.fromLTRB(8, 4, 8, 4),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: List.generate(10, (i) => Container(
                    width: i.isEven ? 2 : 1,
                    height: 20,
                    color: Colors.grey.shade800,
                  )),
                ),
              ),
              Container(height: 1, color: Colors.blue.shade200),
              Padding(
                padding: const EdgeInsets.only(bottom: 4, top: 2),
                child: Text('← BARCODE', style: TextStyle(fontSize: 7, color: Colors.blue.shade400)),
              ),
            ]),
          ),
          const SizedBox(width: 14),
          Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            _tip(Icons.arrow_back, 'Usually on the BACK or SIDE of the box'),
            const SizedBox(height: 6),
            _tip(Icons.straighten, 'Black lines with numbers underneath'),
            const SizedBox(height: 6),
            _tip(Icons.wb_sunny_outlined, 'Tap "Turn On Light" if it\'s dark'),
            const SizedBox(height: 6),
            _tip(Icons.photo_library_outlined, 'Or take a photo of the box'),
            const SizedBox(height: 6),
            _tip(Icons.skip_next, 'You can always skip — barcode is optional'),
          ])),
        ]),
      ]),
    );
  }

  Widget _tip(IconData icon, String text) => Row(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      Icon(icon, size: 14, color: Colors.blue.shade400),
      const SizedBox(width: 6),
      Expanded(child: Text(text,
          style: TextStyle(fontSize: 12, color: Colors.grey.shade700))),
    ],
  );
}

// ── scan frame overlay painter ────────────────────────────────────────────────

class _ScanOverlayPainter extends CustomPainter {
  final bool scanned;
  const _ScanOverlayPainter({required this.scanned});

  @override
  void paint(Canvas canvas, Size size) {
    final w = size.width;
    final h = size.height;
    final cw = w * 0.78;
    final ch = h * 0.26;
    final cl = (w - cw) / 2;
    final ct = (h - ch) / 2;
    final rect = Rect.fromLTWH(cl, ct, cw, ch);

    // dim overlay
  final dimPath = Path()
  ..fillType = PathFillType.evenOdd          // ← move it here, on the Path
  ..addRect(Rect.fromLTWH(0, 0, w, h))
  ..addRRect(RRect.fromRectAndRadius(rect, const Radius.circular(8)));
canvas.drawPath(dimPath, Paint()
  ..color = Colors.black.withOpacity(0.45));

    // corners
    final cp = Paint()
      ..color = scanned ? Colors.greenAccent : Colors.white
      ..strokeWidth = 3.5
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.round;
    const L = 22.0;
    // TL
    canvas.drawLine(Offset(cl, ct + L), Offset(cl, ct), cp);
    canvas.drawLine(Offset(cl, ct), Offset(cl + L, ct), cp);
    // TR
    canvas.drawLine(Offset(cl + cw - L, ct), Offset(cl + cw, ct), cp);
    canvas.drawLine(Offset(cl + cw, ct), Offset(cl + cw, ct + L), cp);
    // BL
    canvas.drawLine(Offset(cl, ct + ch - L), Offset(cl, ct + ch), cp);
    canvas.drawLine(Offset(cl, ct + ch), Offset(cl + L, ct + ch), cp);
    // BR
    canvas.drawLine(Offset(cl + cw - L, ct + ch), Offset(cl + cw, ct + ch), cp);
    canvas.drawLine(Offset(cl + cw, ct + ch), Offset(cl + cw, ct + ch - L), cp);

    // scan line
    if (!scanned) {
      canvas.drawLine(
        Offset(cl + 10, ct + ch / 2),
        Offset(cl + cw - 10, ct + ch / 2),
        Paint()..color = Colors.blueAccent.withOpacity(0.8)..strokeWidth = 2,
      );
    }

    // label
    final tp = TextPainter(
      text: TextSpan(
        text: scanned ? '✓  Barcode detected!' : 'Point the barcode at this window',
        style: TextStyle(
          color: scanned ? Colors.greenAccent : Colors.white.withOpacity(0.85),
          fontSize: 13,
        ),
      ),
      textDirection: TextDirection.ltr,
    )..layout(maxWidth: w);
    tp.paint(canvas, Offset((w - tp.width) / 2, ct + ch + 10));
  }

  @override
  bool shouldRepaint(_ScanOverlayPainter o) => o.scanned != scanned;
}