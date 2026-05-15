const db = require('../config/database');
const Groq = require('groq-sdk');

// Initialize Groq AI
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

/**
 * Handle Chatbot queries with Groq AI
 */
exports.handleChatQuery = async (req, res) => {
    try {
        const { message } = req.body;
        const userId = req.user.id;

        if (!message) {
            return res.status(400).json({ success: false, message: 'Message is required' });
        }

        const lowerMsg = message.toLowerCase();

        // 1. EMERGENCY DETECTION
        const emergencyKeywords = [
            'chest pain', 'difficulty breathing', 'breath', 'stroke',
            'unconscious', 'fainted', 'seizure', 'heavy bleeding',
            "can't breathe", 'heart attack'
        ];

        const isEmergency = emergencyKeywords.some(keyword => lowerMsg.includes(keyword));

        if (isEmergency) {
            return res.json({
                success: true,
                reply: "🚨 **EMERGENCY DETECTED** 🚨\n\nI am signaling that you need immediate help. Please stay calm.\n\n**Instructions:**\n1. Stop what you are doing and sit or lie down.\n2. **CALL 911 IMMEDIATELY** (or your local emergency number).\n3. Use the red phone button at the top of your screen to call your emergency contact.\n\n*Do not wait for further AI instructions.*",
                timestamp: new Date().toISOString(),
                isEmergency: true
            });
        }

        // 2. Fetch user medications for context
        const [treatments] = await db.execute(
            'SELECT medication_name, dosage, frequency FROM treatments WHERE patient_id = ? AND is_active = true',
            [userId]
        );

        const medContext = treatments.map(t => `${t.medication_name} (${t.dosage}) taken ${t.frequency}`).join(', ');

        // 3. Call Groq AI
        console.log('--- AI Assistant Request ---');
        console.log('User ID:', userId);

        const completion = await groq.chat.completions.create({
            model: "llama-3.1-8b-instant",
            max_tokens: 500,
            messages: [
                {
                    role: "system",
                    content: `You are "MediCare AI", a supportive assistant for elderly patients.
- ALWAYS end with: "Disclaimer: This assistant does not replace professional medical advice."
- Use simple, non-technical language.
- NO long paragraphs. Use short sentences and bullet points.
- The patient is currently taking: ${medContext || 'No medications listed'}.
- If they ask about a missed dose, advise them not to double dose and to contact their doctor.
- Be empathetic, patient, and calm.`
                },
                {
                    role: "user",
                    content: message
                }
            ]
        });

        let aiText = completion.choices[0].message.content;

        if (!aiText.includes("professional medical advice")) {
            aiText += "\n\nDisclaimer: This assistant does not replace professional medical advice.";
        }

        return res.json({
            success: true,
            reply: aiText,
            timestamp: new Date().toISOString(),
            isEmergency: false
        });

    } catch (error) {
        console.error('AI Chatbot Error:', error.message);

        res.status(500).json({
            success: false,
            message: "The assistant is temporarily unavailable. Please try again later."
        });
    }
};