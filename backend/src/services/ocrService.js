const tesseract = require('tesseract.js');

class OCRService {
    /**
     * Process an image and extract text
     * @param {string} imagePath - Path or buffer of the image
     * @returns {Promise<string>} - Extracted text
     */
    static async extractText(imagePath) {
        try {
            const { data: { text } } = await tesseract.recognize(imagePath, 'eng+fra', {
                logger: m => console.log(m)
            });
            return text;
        } catch (error) {
            console.error('OCR Extraction Error:', error);
            throw new Error('Failed to extract text from image');
        }
    }

    /**
     * Parse extracted text using rules and regex
     * @param {string} text - Raw text from OCR
     * @returns {object} - Structured medication data
     */
    static parseMedicationText(text) {
        const result = {
            medication_name: null,
            dosage: null,
            frequency: 'Once daily',
            duration_days: null
        };

        const lowerText = text.toLowerCase();

        // 1. Extract Medication Name
        const commonDrugs = ['metformin', 'glipizide', 'aspirin', 'paracetamol', 'ibuprofen', 'amoxicillin'];
        for (const drug of commonDrugs) {
            if (lowerText.includes(drug)) {
                result.medication_name = drug.charAt(0).toUpperCase() + drug.slice(1);
                break;
            }
        }

        // 2. Extract Dosage (e.g., 500mg, 5mg, 10 ml)
        const dosageMatch = text.match(/(\d+\s*(mg|g|ml|µg))/i);
        if (dosageMatch) {
            result.dosage = dosageMatch[0];
        }

        // 3. Extract Frequency (Matching ENUM exactly)
        if (lowerText.includes('2x per day') || lowerText.includes('twice daily') || lowerText.includes('2 fois par jour')) {
            result.frequency = 'Twice daily';
        } else if (lowerText.includes('3x per day') || lowerText.includes('three times daily') || lowerText.includes('3 fois par jour')) {
            result.frequency = 'Three times daily';
        } else if (lowerText.includes('4x per day') || lowerText.includes('four times daily') || lowerText.includes('4 fois par jour')) {
            result.frequency = 'Four times daily';
        } else if (lowerText.includes('every 12 hours') || lowerText.includes('chaque 12 heures')) {
            result.frequency = 'Every 12 hours';
        } else if (lowerText.includes('every 8 hours') || lowerText.includes('chaque 8 heures')) {
            result.frequency = 'Every 8 hours';
        } else if (lowerText.includes('every 6 hours') || lowerText.includes('chaque 6 heures')) {
            result.frequency = 'Every 6 hours';
        } else if (lowerText.includes('as needed') || lowerText.includes('si besoin')) {
            result.frequency = 'As needed';
        } else if (lowerText.includes('once daily') || lowerText.includes('chaque jour') || lowerText.includes('1x per day')) {
            result.frequency = 'Once daily';
        }

        // 4. Extract Duration (e.g., for 7 days)
        const durationMatch = lowerText.match(/for\s+(\d+)\s+days|pendant\s+(\d+)\s+jours/);
        if (durationMatch) {
            result.duration_days = parseInt(durationMatch[1] || durationMatch[2]);
        }

        return result;
    }
}

module.exports = OCRService;