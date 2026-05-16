// services/OCRService.js
// ─────────────────────────────────────────────────────────────
// Main orchestrator — this is the only file your controllers
// need to import. It wires together:
//
//   imagePreprocessor  →  ocrExtractor  →  aiStructurer
//
// Drop-in replacement for the old OCRService.js
// ─────────────────────────────────────────────────────────────

const { extractRawText }   = require('./ocrExtractor');
const { structureWithAI }  = require('./aiStructurer');

class OCRService {

    /**
     * Full pipeline: Image → OCR → AI structuring → clean JSON
     *
     * @param {string} imagePath - Absolute path to the prescription image
     * @returns {Promise<object>} - Structured result:
     *   {
     *     medications: [...],
     *     total_medications: number,
     *     prescriber: string|null,
     *     prescriber_specialty: string|null,
     *     ocr_quality_estimate: 'good'|'fair'|'poor',
     *     corrections_made: string[]
     *   }
     */
    static async extractMedications(imagePath) {
        console.log('[OCRService] Starting pipeline for:', imagePath);

        // ── Stage 1: OCR ──────────────────────────────────────
        const rawText = await extractRawText(imagePath);
        console.log('[OCRService] Raw OCR text length:', rawText.length, 'chars');

        if (!rawText || rawText.trim().length < 20) {
            throw new Error(
                'OCR returned too little text. ' +
                'Make sure the image is well-lit and not blurry.'
            );
        }

        // ── Stage 2: AI structuring (text only — no image sent) ─
        console.log('[OCRService] Sending text to AI structurer...');
        const structured = await structureWithAI(rawText);

        // ── Stage 3: Post-process / dedup (JS safety net) ────
        const final = this._postProcess(structured);

        console.log(`[OCRService] Done. ${final.total_medications} medication(s) found.`);
        if (final.corrections_made?.length) {
            console.log('[OCRService] Corrections:', final.corrections_made.join(' | '));
        }

        return final;
    }

    // ─────────────────────────────────────────────────────────
    // Internal helpers
    // ─────────────────────────────────────────────────────────

    static _postProcess(structured) {
        const seen = new Set();
        const meds = (structured.medications || []).filter(med => {
            const key = (med.name || '').toLowerCase().replace(/\s+/g, '');
            if (!key || key === 'unknown' || seen.has(key)) return false;
            seen.add(key);
            return true;
        });

        return {
            ...structured,
            medications: meds,
            total_medications: meds.length
        };
    }

    // ─────────────────────────────────────────────────────────
    // Legacy shims — keeps old call sites working without changes
    // ─────────────────────────────────────────────────────────

    /** @deprecated Use extractMedications() instead */
    static async extractText(imagePath) {
        console.warn('[OCRService] extractText() is deprecated — use extractMedications()');
        return extractRawText(imagePath);
    }

    /** @deprecated Use extractMedications() instead */
    static parseMedicationText(text) {
        console.warn('[OCRService] parseMedicationText() is deprecated — use extractMedications()');
        return text.split('\n')
            .filter(l => l.trim().length > 3)
            .map(l => ({ name: 'Unknown', raw_line: l.trim(), dosage: null }));
    }
}

module.exports = OCRService;