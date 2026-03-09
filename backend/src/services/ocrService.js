const tesseract = require('tesseract.js');
const sharp = require('sharp');
const Fuse = require('fuse.js');
const path = require('path');
const fs = require('fs');

class OCRService {
    /**
     * Preprocess image using Sharp to improve OCR accuracy
     * @param {string} imagePath 
     * @returns {Promise<string>} - Path to processed image
     */
    static async preprocessImage(imagePath) {
        try {
            const processedPath = path.join(path.dirname(imagePath), 'proc_' + path.basename(imagePath));
            await sharp(imagePath)
                .grayscale() // Convert to grayscale
                .normalize() // Improve contrast
                .sharpen()   // Make edges clearer
                .toFile(processedPath);
            return processedPath;
        } catch (error) {
            console.error('Preprocessing Error:', error);
            return imagePath; // Return original if preprocessing fails
        }
    }

    /**
     * Process an image and extract text
     * @param {string} imagePath - Path to the image
     * @returns {Promise<string>} - Extracted text
     */
    static async extractText(imagePath) {
        let processedPath = null;
        try {
            // 1. Preprocess image
            processedPath = await this.preprocessImage(imagePath);

            // 2. Perform OCR
            const { data: { text } } = await tesseract.recognize(processedPath, 'eng+fra', {
                logger: m => console.log(m.status + ': ' + (m.progress * 100).toFixed(2) + '%')
            });

            // 3. Clean up processed file if it was created
            if (processedPath !== imagePath) {
                fs.unlinkSync(processedPath);
            }

            return text;
        } catch (error) {
            console.error('OCR Extraction Error:', error);
            if (processedPath && processedPath !== imagePath && fs.existsSync(processedPath)) {
                fs.unlinkSync(processedPath);
            }
            throw new Error('Failed to extract text from image');
        }
    }

    /**
     * Parse extracted text to detect multiple medications
     * @param {string} text - Raw text from OCR
     * @returns {Array<object>} - List of structured medications
     */
    static parseMedicationText(text) {
        const medications = [];
        const lines = text.split('\n').filter(line => line.trim().length > 3);

        // Common medication names for fuzzy matching
        const knownMedicines = [
            'Metformin', 'Glipizide', 'Aspirin', 'Paracetamol', 'Ibuprofen', 
            'Amoxicillin', 'Augmentin', 'Doliprane', 'Voltaren', 'Spasfon',
            'Inexium', 'Lantus', 'Humalog', 'Ventoline', 'Atorvastatine',
            'Lisinopril', 'Levothyroxine', 'Atorvastatin', 'Metformin', 'Simvastatin',
            'Amlodipine', 'Metoprolol', 'Omeprazole', 'Albuterol', 'Losartan',
            'Gabapentin', 'Hydrochlorothiazide', 'Sertraline', 'Simvastatin', 'Montelukast',
            'Fluticasone', 'Amoxicillin', 'Furosemide', 'Pantoprazole', 'Acetaminophen',
            'Prednisone', 'Lexapro', 'Xanax', 'Vicodin', 'Crestor', 'Lipitor',
            'Advil', 'Tylenol', 'Motrin', 'Claritin', 'Zyrtec', 'Benadryl',
            'Lasix', 'Protonix', 'Zoloft', 'Prozac', 'Celexa', 'Wellbutrin',
            'Coumadin', 'Plavix', 'Xarelto', 'Eliquis', 'Januvia', 'Victoza'
        ];

        const fuse = new Fuse(knownMedicines, { threshold: 0.4 });

        for (const line of lines) {
            const lowerLine = line.toLowerCase();
            
            // Regex patterns
            // Dosage: numbers + units (mg, g, ml, etc.)
            const dosageMatch = line.match(/(\d+\s*(mg|g|ml|µg|mcg|units))/i);
            
            // Frequency patterns
            let frequency = 'Once daily';
            if (lowerLine.match(/(2|deux)\s*(x|fois|times)/i) || lowerLine.includes('twice daily') || lowerLine.includes('matin et soir')) {
                frequency = 'Twice daily';
            } else if (lowerLine.match(/(3|trois)\s*(x|fois|times)/i) || lowerLine.includes('three times daily')) {
                frequency = 'Three times daily';
            } else if (lowerLine.match(/(4|quatre)\s*(x|fois|times)/i) || lowerLine.includes('four times daily')) {
                frequency = 'Four times daily';
            } else if (lowerLine.includes('every 12 hours') || lowerLine.includes('12h')) {
                frequency = 'Every 12 hours';
            } else if (lowerLine.includes('every 8 hours') || lowerLine.includes('8h')) {
                frequency = 'Every 8 hours';
            } else if (lowerLine.includes('as needed') || lowerLine.includes('si besoin') || lowerLine.includes('prn')) {
                frequency = 'As needed';
            }

            // Duration patterns
            let durationDays = null;
            const durationMatch = lowerLine.match(/for\s+(\d+)\s+days|pendant\s+(\d+)\s+jours/);
            if (durationMatch) {
                durationDays = parseInt(durationMatch[1] || durationMatch[2]);
            }

            // Extract medicine name (Look for capitalized word before dosage or use fuzzy match)
            let medicineName = null;
            
            // Strategy A: Pattern matching (Word before dosage)
            const patternMatch = line.match(/([A-Z][a-z]+)\s*\d+/);
            if (patternMatch) {
                medicineName = patternMatch[1];
            }

            // Strategy B: Fuzzy search words in line against known list
            if (!medicineName) {
                const words = line.split(/\s+/);
                for (const word of words) {
                    const results = fuse.search(word);
                    if (results.length > 0) {
                        medicineName = results[0].item;
                        break;
                    }
                }
            }

            // Strategy C: If we found a dosage but no name, take the longest capitalized word
            if (!medicineName && dosageMatch) {
                const capsWords = line.match(/[A-Z][a-z]+/g);
                if (capsWords && capsWords.length > 0) {
                    medicineName = capsWords[0];
                }
            }

            // If we found at least a name or a dosage, consider it a medication line
            // Exclude lines that only contain "Pendant" or common duration markers
            if ((medicineName || dosageMatch) && medicineName !== 'Pendant') {
                medications.push({
                    name: medicineName || 'Unknown Medication',
                    dosage: dosageMatch ? dosageMatch[0] : null,
                    frequency: frequency,
                    duration_days: durationDays,
                    raw_line: line.trim()
                });
            }
        }

        // Deduplicate (some OCR errors create double lines)
        return this.deduplicateMedications(medications);
    }

    static deduplicateMedications(meds) {
        const unique = [];
        const seen = new Set();
        for (const med of meds) {
            const key = `${med.name}-${med.dosage}`.toLowerCase();
            if (!seen.has(key)) {
                unique.push(med);
                seen.add(key);
            }
        }
        return unique;
    }
}

module.exports = OCRService;
