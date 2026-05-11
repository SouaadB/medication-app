const db = require('../config/database');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

/**
 * Handle Chatbot queries with Real AI (Gemini)
 */
exports.handleChatQuery = async (req, res) => {
    try {
        const { message } = req.body;
        const userId = req.user.id;

        if (!message) {
            return res.status(400).json({ success: false, message: 'Message is required' });
        }

        const lowerMsg = message.toLowerCase();

        // 1. EMERGENCY DETECTION (STOP Normal Chat)
        const emergencyKeywords = [
            'chest pain', 'difficulty breathing', 'breath', 'stroke', 
            'unconscious', 'fainted', 'seizure', 'heavy bleeding',
            'can\'t breathe', 'heart attack'
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

        // 2. Fetch user context (medications and conditions) to make the AI "smart"
        const [treatments] = await db.execute(
            'SELECT medication_name, dosage, frequency FROM treatments WHERE patient_id = ? AND is_active = true',
            [userId]
        );

        const medContext = treatments.map(t => `${t.medication_name} (${t.dosage}) taken ${t.frequency}`).join(', ');

        // 3. Define the System Prompt & Rules
        const prompt = `
            SYSTEM RULES (MANDATORY):
            - You are "MediCare AI", a supportive assistant for elderly patients.
            - ALWAYS start or end with: "Disclaimer: This assistant does not replace professional medical advice."
            - Use simple, human-readable, non-technical language.
            - NO long paragraphs. Use short sentences and bullet points if needed.
            - Context: The patient is taking: ${medContext || 'No medications currently listed'}.
            - If they ask about a missed dose, give calm advice based on general safety (don't double dose).
            - Be empathetic, patient, and calm.

            USER MESSAGE: "${message}"
        `;

        // 4. Call Gemini AI
        const result = await model.generateContent(prompt);
        const response = await result.response;
        let aiText = response.text();

        // Clean up response if it's too long or complex (Gemini is usually good with short prompts)
        // Ensure disclaimer is there (Safety check)
        if (!aiText.includes("professional medical advice")) {
            aiText += "\n\nDisclaimer: This assistant does not replace professional medical advice.";
        }

        // Return structured response
        res.json({
            success: true,
            reply: aiText,
            timestamp: new Date().toISOString(),
            isEmergency: false
        });

    } catch (error) {
        console.error('AI Chatbot Error:', error);
        // Fallback for API Key missing or other errors
        res.status(500).json({ 
            success: false, 
            message: 'I am having trouble connecting to my brain right now. Please ensure your AI API Key is configured.' 
        });
    }
};

