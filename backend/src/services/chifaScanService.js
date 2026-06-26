// Extracts the 12-digit SCRN (Social Security Registration Number) printed
// near the top of an Algerian "Carte Chifa" from a photo of the card.
// There is no public Algerian API to validate/lookup this number, so the
// best we can do is read it reliably off the card itself via vision OCR.
const Groq = require('groq-sdk');
const sharp = require('sharp');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function extractScrnFromImage(imagePath) {
    const resizedBuffer = await sharp(imagePath)
        .resize({ width: 1200, withoutEnlargement: true })
        .jpeg({ quality: 85 })
        .toBuffer();

    const base64Image = resizedBuffer.toString('base64');

    const response = await groq.chat.completions.create({
        model: 'meta-llama/llama-4-scout-17b-16e-instruct',
        messages: [
            {
                role: 'user',
                content: [
                    {
                        type: 'image_url',
                        image_url: { url: `data:image/jpeg;base64,${base64Image}` },
                    },
                    {
                        type: 'text',
                        text: 'This is a photo of an Algerian "Carte Chifa" (social security card). ' +
                              'Find the unique registration number printed near the top of the card — ' +
                              'it is exactly 12 digits long, sometimes printed with spaces between groups of digits. ' +
                              'Respond with ONLY those 12 digits, no spaces, no other text. ' +
                              'If you cannot clearly find a 12-digit number on this image, respond with exactly: NONE',
                    },
                ],
            },
        ],
        temperature: 0,
        max_tokens: 30,
    });

    const raw = (response.choices[0]?.message?.content || '').trim();
    console.log('[ChifaScan] Vision response:', raw);

    const digitsOnly = raw.replace(/\D/g, '');
    if (digitsOnly.length === 12) return digitsOnly;
    return null;
}

module.exports = { extractScrnFromImage };
