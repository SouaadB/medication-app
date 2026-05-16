const Tesseract = require('tesseract.js');
const { preprocessImage, cleanupFile } = require('./imagePreprocessor');

async function extractRawText(imagePath) {
    let processedPath = null;
    try {
        processedPath = await preprocessImage(imagePath);

        const { data: { text } } = await Tesseract.recognize(
            processedPath,
            'fra+eng',
            {
                logger: m =>
                    process.stdout.write(`\r[OCR] ${m.status} ${(m.progress * 100).toFixed(0)}%`)
            }
        );
        console.log('\n[OCR] Extraction complete.');
        return text;

    } catch (err) {
        throw new Error('[ocrExtractor] Tesseract failed: ' + err.message);

    } finally {
        if (processedPath && processedPath !== imagePath) {
            cleanupFile(processedPath);
        }
    }
}

module.exports = { extractRawText };