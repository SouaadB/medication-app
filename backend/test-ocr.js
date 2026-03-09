const OCRService = require('./src/services/ocrService');

const mockText = `
Prescription:
Doliprane 1000mg - 1x per day for 7 days
Amoxicillin 500mg - 3x per day
Atorvastatine 20mg - Once daily
Pendant 10 jours
`;

console.log('--- Testing Medication Parsing ---');
const results = OCRService.parseMedicationText(mockText);
console.log('Detected Medications:', JSON.stringify(results, null, 2));

if (results.length >= 3) {
    console.log('✅ Success: Detected multiple medications');
} else {
    console.log('❌ Failure: Did not detect expected number of medications');
}
