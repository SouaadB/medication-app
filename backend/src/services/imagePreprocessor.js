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
            .resize({ width: 1500, withoutEnlargement: false })
            .grayscale()
            .normalize()
            .median(1)
            .sharpen({ sigma: 1.5, m1: 0.5, m2: 2.5 })
            .linear(1.3, -20)
            .threshold(150)
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