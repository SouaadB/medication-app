const db = require('../src/config/database');

const medications = [
    // --- DIABETES ---
    {
        name: 'Glucophage',
        scientific_name: 'Metformin',
        category: 'Diabetes',
        description: 'First-line medication for type 2 diabetes. Helps the body use insulin better and reduces glucose production in the liver.',
        how_to_take: 'Take with or after meals to reduce stomach side effects. Do not crush or chew extended-release tablets.',
        side_effects: 'Nausea, diarrhea, stomach pain, metallic taste in mouth.',
        warnings: 'Tell your doctor if you have kidney problems. Avoid excessive alcohol while taking this medication.',
        emoji: '💊'
    },
    {
        name: 'Diamicron',
        scientific_name: 'Gliclazide',
        category: 'Diabetes',
        description: 'Used to control blood sugar levels in type 2 diabetes by stimulating insulin production from the pancreas.',
        how_to_take: 'Take with breakfast. It is important to eat regularly to avoid low blood sugar (hypoglycemia).',
        side_effects: 'Low blood sugar, indigestion, skin rash.',
        warnings: 'Watch for signs of hypoglycemia: sweating, shaking, hunger, and confusion.',
        emoji: '🍬'
    },
    {
        name: 'Novomix',
        scientific_name: 'Insulin Aspart',
        category: 'Diabetes',
        description: 'A combination of rapid-acting and intermediate-acting insulin used to control blood sugar levels.',
        how_to_take: 'Inject under the skin (subcutaneously) within 15 minutes before a meal.',
        side_effects: 'Hypoglycemia, injection site reactions, weight gain.',
        warnings: 'Never share insulin pens or needles. Rotate injection sites to prevent skin thickening.',
        emoji: '💉'
    },
    {
        name: 'Januvia',
        scientific_name: 'Sitagliptine',
        category: 'Diabetes',
        description: 'A DPP-4 inhibitor that helps increase insulin levels after meals and decreases the amount of sugar made by the body.',
        how_to_take: 'Can be taken with or without food, usually once daily.',
        side_effects: 'Upper respiratory tract infection, headache, sore throat.',
        warnings: 'Monitor for signs of pancreatitis (severe abdominal pain).',
        emoji: '💊'
    },

    // --- HYPERTENSION ---
    {
        name: 'Amlor',
        scientific_name: 'Amlodipine',
        category: 'Hypertension',
        description: 'A calcium channel blocker used to treat high blood pressure and chest pain (angina). It relaxes blood vessels.',
        how_to_take: 'Take once daily at the same time each day, with or without food.',
        side_effects: 'Swelling of ankles or feet, headache, dizziness, flushing.',
        warnings: 'Avoid grapefruit and grapefruit juice as they can increase the levels of Amlodipine in your blood.',
        emoji: '❤️'
    },
    {
        name: 'Tareg',
        scientific_name: 'Valsartan',
        category: 'Hypertension',
        description: 'An Angiotensin II Receptor Blocker (ARB) that keeps blood vessels from narrowing, which lowers blood pressure.',
        how_to_take: 'Take with or without food. Stay well-hydrated while taking this medication.',
        side_effects: 'Dizziness, headache, fatigue, increased potassium levels.',
        warnings: 'Do not use if pregnant. Regular blood tests may be needed to check kidney function.',
        emoji: '🩸'
    },
    {
        name: 'Triatec',
        scientific_name: 'Ramipril',
        category: 'Hypertension',
        description: 'An ACE inhibitor used to treat high blood pressure and heart failure. It also protects kidneys in diabetic patients.',
        how_to_take: 'Usually taken once or twice daily. The first dose may make you feel dizzy, so take it at bedtime.',
        side_effects: 'Dry cough, dizziness, headache, fatigue.',
        warnings: 'A persistent dry cough is a common side effect; consult your doctor if it becomes bothersome.',
        emoji: '🩺'
    },
    {
        name: 'Detensiel',
        scientific_name: 'Bisoprolol',
        category: 'Hypertension',
        description: 'A beta-blocker that slows down the heart rate and makes the heart more efficient at pumping blood.',
        how_to_take: 'Take in the morning, usually with or without food.',
        side_effects: 'Cold hands or feet, fatigue, dizziness, slow heartbeat.',
        warnings: 'Do not stop taking this medication suddenly, as it can cause a rapid increase in blood pressure.',
        emoji: '💓'
    },

    // --- CHOLESTEROL ---
    {
        name: 'Tahor',
        scientific_name: 'Atorvastatin',
        category: 'Cholesterol',
        description: 'A statin used to lower "bad" cholesterol (LDL) and fats (triglycerides) and raise "good" cholesterol (HDL) in the blood.',
        how_to_take: 'Usually taken once daily in the evening or at bedtime for best results.',
        side_effects: 'Muscle pain, joint pain, diarrhea, cold-like symptoms.',
        warnings: 'Report any unexplained muscle pain or weakness to your doctor immediately.',
        emoji: '🧪'
    },
    {
        name: 'Crestor',
        scientific_name: 'Rosuvastatin',
        category: 'Cholesterol',
        description: 'A powerful statin that helps reduce cholesterol levels and the risk of heart disease and stroke.',
        how_to_take: 'Take once daily at any time of day, with or without food.',
        side_effects: 'Headache, muscle pain, abdominal pain, nausea.',
        warnings: 'Avoid excessive alcohol consumption. Regular liver function tests may be required.',
        emoji: '💎'
    },

    // --- HEART PROBLEMS ---
    {
        name: 'Aspegic',
        scientific_name: 'Aspirine',
        category: 'Heart Problems',
        description: 'Low-dose aspirin used as a blood thinner to prevent heart attacks and strokes by preventing blood clots.',
        how_to_take: 'Take with food or a full glass of water to protect your stomach.',
        side_effects: 'Stomach irritation, increased bruising or bleeding.',
        warnings: 'Inform your dentist or surgeon that you are taking aspirin before any procedures.',
        emoji: '🩹'
    },
    {
        name: 'Plavix',
        scientific_name: 'Clopidogrel',
        category: 'Heart Problems',
        description: 'An antiplatelet medication used to prevent blood clots in people with heart disease or recent stroke.',
        how_to_take: 'Take once daily, with or without food.',
        side_effects: 'Bleeding, bruising, stomach upset.',
        warnings: 'Stop taking Plavix 5-7 days before scheduled surgery after consulting your doctor.',
        emoji: '🛡️'
    }
];

async function seed() {
    try {
        console.log('🚀 Starting medication seeding...');
        
        for (const med of medications) {
            try {
                const query = `
                    INSERT INTO medication_info 
                    (name, scientific_name, category, description, how_to_take, side_effects, warnings, emoji) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                    ON DUPLICATE KEY UPDATE 
                    scientific_name = VALUES(scientific_name),
                    category = VALUES(category),
                    description = VALUES(description),
                    how_to_take = VALUES(how_to_take),
                    side_effects = VALUES(side_effects),
                    warnings = VALUES(warnings),
                    emoji = VALUES(emoji)
                `;
                
                await db.execute(query, [
                    med.name,
                    med.scientific_name,
                    med.category,
                    med.description,
                    med.how_to_take,
                    med.side_effects,
                    med.warnings,
                    med.emoji
                ]);
                console.log(`✅ Seeded: ${med.name}`);
            } catch (err) {
                console.error(`❌ Error seeding ${med.name}:`, err.message);
            }
        }
        
        console.log('✨ Seeding completed!');
        process.exit(0);
    } catch (error) {
        console.error('💥 Fatal seeding error:', error);
        process.exit(1);
    }
}

seed();
