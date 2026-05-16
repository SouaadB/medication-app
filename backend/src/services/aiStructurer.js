// services/aiStructurer.js
// 3-layer approach:
//   Layer 1: Groq (llama-3.3-70b) — fast, free, accurate
//   Layer 2: Gemini fallback — if Groq fails
//   Layer 3: Pure regex fallback — if both AI fail, still returns something

const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `You are a clinical pharmacist specializing in French and Algerian medical prescriptions (ordonnances).

You will receive raw OCR text extracted from a prescription. The text may contain OCR errors, broken words, misread characters, extra spaces, or garbled lines.

YOUR TASK: Extract a clean, structured list of medications.

ALGERIAN PRESCRIPTION FORMAT — each medication entry looks like:
  DRUGNAME FORM DOSAGE PACK
  instructions line (matin/soir/midi + frequency)
  
Common Algerian drug brand names you may encounter (OCR may mangle these):
GLUCOPHAGE, LEVOTHYROX, VOLTARENE, DOLYC, SPIROZIDE, ZOMAX, VITAMINE C, VITAMAG,
METFORMINE, AMLOR, KARDEGIC, INEXIUM, OMEPRAZOLE, PARACETAMOL, AUGMENTIN, AMOXICILLINE,
DOLIPRANE, ASPEGIC, SPASFON, FORLAX, XANAX, VALIUM, TEMESTA, STAGID, GLUCOR,
COVERSYL, APROVEL, TAREG, MICARDIS, TENORMINE, SECTRAL, CORDARONE, SINTROM

WHAT COUNTS AS A MEDICATION LINE:
- Drug brand name (ALL CAPS or mixed), followed by form code and dosage
- Form codes: COMP, COMP.SEC, COMP.PELLI, COMP.PELLI.SEC, COMP.EFFERV, GEL.DERM, SOL.BUV, AMP, TUB, SIROP, CAPS, SUPP, PATCH, SACHET
- Dosages: 1000MG, 75MG, 500MG, 25MG, 0.01, 127MG/5ML, 1G, 5MG

WHAT TO IGNORE:
- "Quantité suffisante pour: X mois" → quantity field
- "Quantité: X" → quantity field  
- "ORDONNANCE" → skip
- Doctor name/stamp → prescriber field
- Instruction lines (matin, soir, midi, comprimé, repas, chaque jour, application) → instructions field
- OCR noise lines (random chars, numbers alone, broken fragments)

OCR ERROR CORRECTION — very important for this prescription type:
- Fix character swaps: l→I, 0→O, rn→m, cl→d, VlT→VIT
- Fix accents on caps: "VOLTARENé"→"VOLTARENE", "GEL.DERrn"→"GEL.DERM"
- Fix split words: "GLUCO PHAGE"→"GLUCOPHAGE", "LEVO THYROX"→"LEVOTHYROX"
- Fix common OCR mistakes on drug names using the list above as reference
- "mols" or "mois" → "mois", "cornprimé" → "comprimé", "rnatin" → "matin"

DEDUPLICATION: same drug appearing twice → keep once only.

IMPORTANT: Return ONLY valid JSON. No markdown. No explanation:
{
  "medications": [
    {
      "name": "BRAND NAME only, corrected",
      "form": "form description or null",
      "dosage": "e.g. 1000mg or null",
      "pack": "e.g. B/30 or null",
      "instructions": "dosing schedule in French or null",
      "quantity": "e.g. '3 mois' or 'Quantité: 2' or null"
    }
  ],
  "prescriber": "Dr. Name or null",
  "prescriber_specialty": "specialty or null",
  "ocr_quality_estimate": "good | fair | poor",
  "corrections_made": ["corrections applied"]
}`;

// Layer 1: Groq AI (primary)
async function structureWithGroq(rawOcrText) {
    const response = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            {
                role: 'user',
                content: `Extract all medications from this Algerian prescription OCR text:\n\n---\n${rawOcrText}\n---`
            }
        ],
        temperature: 0.1,
        max_tokens: 1500
    });

    const raw = response.choices[0]?.message?.content || '';
    console.log('[AI-Groq] Response preview:', raw.slice(0, 200));
    return parseJSON(raw);
}

// Layer 2: Gemini fallback
async function structureWithGemini(rawOcrText) {
    if (!process.env.GEMINI_API_KEY) throw new Error('No Gemini key');
    
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const result = await model.generateContent(
        SYSTEM_PROMPT + '\n\nExtract medications from this OCR text:\n\n---\n' + rawOcrText + '\n---'
    );
    const raw = result.response.text();
    console.log('[AI-Gemini] Response preview:', raw.slice(0, 200));
    return parseJSON(raw);
}

// Layer 3: Pure regex fallback (no AI needed)
function structureWithRegex(rawOcrText) {
    console.log('[Regex-Fallback] Running regex parser on OCR text...');
    
    const medications = [];
    const lines = rawOcrText.split('\n').map(l => l.trim()).filter(l => l.length > 2);

    const dosagePattern   = /(\d+(?:\.\d+)?\s*(?:MG|G|ML|MCG|UI|%)(?:\/\d+\s*(?:MG|ML))?)/i;
    const packPattern     = /\b(B\/\d+|TUB\.\d+G?|AMP\.\d+ML|B\/\d+\.AMP\.\d+ML)\b/i;
    const quantityPattern = /Quantit[eé]\s*(?:suffisante\s+pour\s*:\s*)?(\d+\s*mois|\d+)/i;
    const formCodes       = ['COMP', 'GEL', 'SOL', 'AMP', 'TUB', 'SIROP', 'CAPS', 'SUPP', 'PATCH', 'SACHET'];
    const instructionWords= ['matin', 'soir', 'midi', 'comprimé', 'repas', 'chaque', 'application', 'avant', 'après', 'milieu'];

    let currentMed = null;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const upperLine = line.toUpperCase();

        if (upperLine.includes('ORDONNANCE') || upperLine.includes('DR.') || 
            upperLine.includes('DOCTEUR') || upperLine.includes('SPECIALISTE') ||
            upperLine.includes('ENDOCRINOLOG') || upperLine.includes('DIABETOLOG')) {
            if (currentMed) { medications.push(currentMed); currentMed = null; }
            continue;
        }

        const isInstructionLine = instructionWords.some(w => line.toLowerCase().includes(w));
        
        const qtyMatch = line.match(quantityPattern);
        if (qtyMatch && currentMed) {
            currentMed.quantity = qtyMatch[1].trim();
            continue;
        }

        const hasCaps     = /^[A-Z]{3,}/.test(line);
        const hasFormCode = formCodes.some(f => upperLine.includes(f));
        const hasDosage   = dosagePattern.test(line);

        if (hasCaps && (hasFormCode || hasDosage) && !isInstructionLine) {
            if (currentMed) medications.push(currentMed);

            const nameMatch   = line.match(/^([A-Z][A-Z\s\-]{1,20}?)(?:\s+(?:COMP|GEL|SOL|AMP|TUB|SIROP|CAPS|VITAMINE|VITAMAG)|\s+\d)/i);
            const dosageMatch = line.match(dosagePattern);
            const packMatch   = line.match(packPattern);

            currentMed = {
                name: nameMatch ? nameMatch[1].trim() : line.split(/\s+/)[0],
                form: hasFormCode ? formCodes.find(f => upperLine.includes(f)) : null,
                dosage: dosageMatch ? dosageMatch[1].trim() : null,
                pack: packMatch ? packMatch[1].trim() : null,
                instructions: null,
                quantity: null
            };
        } else if (isInstructionLine && currentMed) {
            currentMed.instructions = currentMed.instructions 
                ? currentMed.instructions + '; ' + line 
                : line;
        }
    }

    if (currentMed) medications.push(currentMed);

    const seen = new Set();
    const unique = medications.filter(m => {
        const k = (m.name || '').toLowerCase().replace(/\s+/g, '');
        if (!k || seen.has(k)) return false;
        seen.add(k); return true;
    });

    console.log(`[Regex-Fallback] Found ${unique.length} medications`);

    return {
        medications: unique,
        prescriber: null,
        prescriber_specialty: null,
        ocr_quality_estimate: 'fair',
        corrections_made: ['Used regex fallback — AI unavailable'],
        fallback_used: true
    };
}

function parseJSON(raw) {
    let cleaned = raw.replace(/```json|```/g, '').trim();
    const start = cleaned.indexOf('{');
    const end   = cleaned.lastIndexOf('}');
    if (start === -1 || end === -1) throw new Error('No JSON found in: ' + raw.slice(0, 100));
    return JSON.parse(cleaned.slice(start, end + 1));
}

// MAIN EXPORT — tries all 3 layers in order
async function structureWithAI(rawOcrText) {
    // Layer 1: Groq
    try {
        const result = await structureWithGroq(rawOcrText);
        console.log('[aiStructurer] ✅ Groq succeeded');
        return result;
    } catch (err) {
        console.warn('[aiStructurer] ⚠️ Groq failed:', err.message);
    }

    // Layer 2: Gemini
    try {
        const result = await structureWithGemini(rawOcrText);
        console.log('[aiStructurer] ✅ Gemini fallback succeeded');
        return result;
    } catch (err) {
        console.warn('[aiStructurer] ⚠️ Gemini failed:', err.message);
    }

    // Layer 3: Regex (always works)
    console.warn('[aiStructurer] ⚠️ Both AI failed — using regex fallback');
    return structureWithRegex(rawOcrText);
}

module.exports = { structureWithAI };