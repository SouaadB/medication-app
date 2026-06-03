// lib/services/barcode_service.dart
//
// Shared barcode scanning + package photo capture service.
// Used by both ManualEntryPage and ReviewParsedMedicationsPage.
//
// Dependencies to add to pubspec.yaml:
//   mobile_scanner: ^5.0.0          ← camera barcode scanner
//   image_picker: ^1.1.2            ← pick photo from gallery or camera
//   google_mlkit_barcode_scanning: ^0.12.0  ← scan barcode from image
//
// Permissions:
//   Android: CAMERA in AndroidManifest.xml
//   iOS: NSCameraUsageDescription + NSPhotoLibraryUsageDescription in Info.plist

import 'package:flutter/material.dart';

/// Represents a scanned barcode result.
class BarcodeResult {
  final String rawValue;       // the scanned barcode string
  final String displayValue;   // cleaned for display
  final String format;         // EAN13, CODE128, QR, etc.
  final DateTime scannedAt;

  const BarcodeResult({
    required this.rawValue,
    required this.displayValue,
    required this.format,
    required this.scannedAt,
  });

  /// What gets sent to the backend
  Map<String, dynamic> toJson() => {
    'barcode': rawValue,
    'format': format,
    'scanned_at': scannedAt.toIso8601String(),
  };

  @override
  String toString() => rawValue;
}

/// Static helpers used by the scan sheet
class BarcodeService {
  /// Returns true if the barcode looks like a pharmaceutical/product barcode.
  /// EAN-13 (13 digits) and EAN-8 (8 digits) are the most common on medication boxes.
  static bool isLikelyMedicationBarcode(String value) {
    final digits = value.replaceAll(RegExp(r'\D'), '');
    return digits.length >= 8 && digits.length <= 14;
  }

  /// Formats a raw barcode for friendly display: adds spaces every 4 digits for EAN-13
  static String formatForDisplay(String raw) {
    final digits = raw.replaceAll(RegExp(r'\D'), '');
    if (digits.length == 13) {
      return '${digits.substring(0,1)} ${digits.substring(1,7)} ${digits.substring(7)}';
    }
    return raw;
  }
}