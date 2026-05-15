import 'package:flutter/material.dart';
import 'package:mobile_scanner/mobile_scanner.dart';
import 'dart:convert';
import 'package:permission_handler/permission_handler.dart';

class QRScannerPage extends StatefulWidget {
  const QRScannerPage({super.key});

  @override
  State<QRScannerPage> createState() => _QRScannerPageState();
}

class _QRScannerPageState extends State<QRScannerPage> {
  MobileScannerController controller = MobileScannerController();
  bool _isScanCompleted = false;

  @override
  void initState() {
    super.initState();
    _requestPermission();
  }

  Future<void> _requestPermission() async {
    final status = await Permission.camera.request();
    if (status.isDenied) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Camera permission is required to scan QR codes')),
        );
        Navigator.pop(context);
      }
    }
  }

  @override
  void dispose() {
    controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Scan Medication QR Code'),
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
      ),
      body: Stack(
        children: [
          MobileScanner(
            controller: controller,
            onDetect: (capture) {
              if (_isScanCompleted) return;
              
              final List<Barcode> barcodes = capture.barcodes;
              for (final barcode in barcodes) {
                final String? code = barcode.rawValue;
                if (code != null) {
                  setState(() {
                    _isScanCompleted = true;
                  });
                  _processQRCode(code);
                  break;
                }
              }
            },
          ),
          // Overlay to show scanning area
          Center(
            child: Container(
              width: 250,
              height: 250,
              decoration: BoxDecoration(
                border: Border.all(color: Colors.white, width: 2),
                borderRadius: BorderRadius.circular(12),
              ),
            ),
          ),
          const Positioned(
            bottom: 50,
            left: 0,
            right: 0,
            child: Center(
              child: Text(
                'Align QR code within the frame',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  backgroundColor: Colors.black45,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  void _processQRCode(String code) {
    final trimmedCode = code.trim();
    try {
      // 1. Try to parse as JSON first (best for structured data)
      final dynamic data = jsonDecode(trimmedCode);
      
      if (data is Map<String, dynamic> || data is List) {
        // Standardize keys for ManualEntryPage
        if (data is Map<String, dynamic>) {
          if (data.containsKey('name')) {
            data['medication_name'] = data.remove('name');
          }
        } else if (data is List) {
          for (var item in data) {
            if (item is Map<String, dynamic> && item.containsKey('name')) {
              item['medication_name'] = item.remove('name');
            }
          }
        }
        Navigator.pop(context, data);
        return;
      }
    } catch (e) {
      // 2. If JSON fails, treat as plain text (medication name only)
      // This allows scanning simple QR codes that just contain "Paracetamol"
      if (trimmedCode.isNotEmpty) {
        final plainTextData = {
          'medication_name': trimmedCode,
          'dosage': '',
          'frequency': 'Once daily',
          'duration_days': 7
        };
        Navigator.pop(context, plainTextData);
        return;
      }
    }

    // 3. If everything fails
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Invalid or empty QR code'),
        backgroundColor: Colors.red,
      ),
    );
    setState(() {
      _isScanCompleted = false;
    });
  }
}
