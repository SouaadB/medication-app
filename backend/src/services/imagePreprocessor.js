// services/imagePreprocessor.js
// Tuned specifically for Algerian ordonnance format:
// - Colored text (red/blue on white)
// - Mixed fonts (printed + italic)
// - Possible page curl or slight tilt

const sharp = require('sharp');
const path  = require('path');
const fs    = require('fs');

async function preprocessImage(imagePath) {
    const processedPath = path.join(
        path.dirname(imagePath),
        'proc_' + path.basename(imagePath)
    );

    try {
        await sharp(imagePath)
            .resize({ width: 2000, withoutEnlargement: false }) // upscale small images
            .grayscale()
            .normalize()                  // maximize contrast
            .median(1)                    // remove salt-and-pepper noise
            .sharpen({ sigma: 2, m1: 0.5, m2: 3 }) // stronger sharpening for printed text
            .linear(1.4, -30)            // increase contrast, darken text
            .threshold(145)              // binarize — tuned for colored-text prescriptions
            .toFile(processedPath);

        return processedPath;
    } catch (err) {
        console.error('[imagePreprocessor] Sharp failed:', err.message);
        return imagePath;
    }
}

function cleanupFile(filePath) {
    try {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    } catch (_) {}
}

module.exports = { preprocessImage, cleanupFile };