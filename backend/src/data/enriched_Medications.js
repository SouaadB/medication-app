const algerianMedications = [

  // ─── DIABETES ──────────────────────────────────────────────
    {
      name: 'Glucophage',
      scientific_name: 'Metformin',
      category: 'Diabetes',
      emoji: '💊',
      description: 'Glucophage (Metformin) is the most commonly prescribed medication for type 2 diabetes in Algeria. It works by reducing the amount of sugar your liver releases into your blood and helps your body respond better to insulin.',
      how_to_take: 'Take with meals to reduce stomach upset. Usually taken 2-3 times daily. Swallow whole with a full glass of water.',
      side_effects: [
        'Nausea or vomiting (especially at start)',
        'Diarrhea or stomach pain',
        'Loss of appetite',
        'Metallic taste in mouth'
      ],
      warnings: [
        'Do not take if you have kidney problems',
        'Stop before any surgery or X-ray with contrast dye',
        'Avoid excessive alcohol',
        'Tell your doctor if you feel unusually tired or have muscle pain'
      ],
      interactions: [
        'Alcohol can increase risk of lactic acidosis',
        'Iodinated contrast media — stop 48h before',
        'Some diuretics may interact'
      ],
      algeria_brands: [
        'Glucophage 500mg',
        'Glucophage 850mg',
        'Glucophage 1000mg',
        'Metformine Biogaran',
        'Stagid 700mg'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'Liste I',
        lab: 'MERCK SANTE S.A.S',
        generic_official: 'METFORMINE CHLORHYDRATE',
        notice_url: 'https://pharmnet-dz.com/notice.ashx?id=5861',
        pharmnet_url: 'https://pharmnet-dz.com/m-5861-glucophage-1000mg-comp-pelli-sec-b-30',
        dosage_variants: [
          {
            dosage: '1000MG',
            form: 'COMP. PELLI',
            conditioning: 'B/30',
            ppa: null
          },
          {
            dosage: '850MG',
            form: 'COMP. PELLI',
            conditioning: 'B/100',
            ppa: '492.00 DA'
          }
        ]
      }
    },
    {
      name: 'Diamicron',
      scientific_name: 'Gliclazide',
      category: 'Diabetes',
      emoji: '💊',
      description: 'Diamicron belongs to the sulfonylurea class and stimulates your pancreas to produce more insulin. Widely used in Algeria for type 2 diabetes management.',
      how_to_take: 'Take once daily with breakfast. Modified-release tablets (MR) should be swallowed whole, not crushed.',
      side_effects: [
        'Low blood sugar (hypoglycemia)',
        'Weight gain',
        'Nausea',
        'Stomach upset'
      ],
      warnings: [
        'Monitor blood sugar regularly',
        'Eat regular meals — skipping meals increases hypoglycemia risk',
        'Avoid alcohol',
        'Not for type 1 diabetes'
      ],
      interactions: [
        'NSAIDs like ibuprofen may enhance effect',
        'Beta-blockers may mask hypoglycemia symptoms',
        'Fluconazole increases gliclazide levels'
      ],
      algeria_brands: [
        'Diamicron 80mg',
        'Diamicron MR 30mg',
        'Diamicron MR 60mg',
        'Gliclazide Mylan'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'Liste I',
        lab: 'SERVIER',
        generic_official: 'GLICLAZIDE',
        notice_url: 'https://pharmnet-dz.com/notice.ashx?id=3711',
        pharmnet_url: 'https://pharmnet-dz.com/m-3711-diamicron-30mg-comp-lm-b-30-',
        dosage_variants: [
          {
            dosage: '30MG',
            form: 'COMP. PELLI. LP',
            conditioning: 'B/30',
            ppa: null
          }
        ]
      }
    },
    {
      name: 'Novomix',
      scientific_name: 'Insulin Aspart (Biphasic)',
      category: 'Diabetes',
      emoji: '💉',
      description: 'Novomix is a biphasic insulin used for type 1 and type 2 diabetes. It contains both fast-acting and intermediate-acting insulin to control blood sugar around meals and between meals.',
      how_to_take: 'Inject subcutaneously (under the skin) just before meals. Rotate injection sites. Keep refrigerated.',
      side_effects: [
        'Low blood sugar (hypoglycemia)',
        'Injection site reactions',
        'Weight gain',
        'Lipodystrophy at injection site'
      ],
      warnings: [
        'Never inject into a vein',
        'Do not use if insulin appears cloudy or has particles',
        'Carry glucose tablets in case of hypoglycemia',
        'Do not share pen or needles'
      ],
      interactions: [
        'Alcohol can unpredictably alter blood sugar',
        'Beta-blockers may mask hypoglycemia',
        'Steroids increase blood sugar needs'
      ],
      algeria_brands: [
        'Novomix 30 FlexPen',
        'Novomix 50 FlexPen',
        'Novomix 70 FlexPen'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'Liste II',
        lab: 'NOVO NORDISK',
        generic_official: 'INSULINE ASPARTE / INSULINE ASPARTE PROTAMINE 30/70%',
        notice_url: 'https://pharmnet-dz.com/notice.ashx?id=3310',
        pharmnet_url: 'https://pharmnet-dz.com/m-3310-novomix-30-flexpen-100ui-ml-susp-inj-b-05-stylos-multidoses-pre-remplis-jetables-de-3ml',
        dosage_variants: [
          {
            dosage: '100UI/ML',
            form: 'SUSP. INJ',
            conditioning: 'B/05 STYLOS MULTIDOSES PRE-REMPLIS JETABLES DE 3ML',
            ppa: '5906.96 DA'
          }
        ]
      }
    },
    {
      name: 'Lantus',
      scientific_name: 'Insulin Glargine',
      category: 'Diabetes',
      emoji: '💉',
      description: 'Lantus is a long-acting insulin taken once daily to provide a steady background level of insulin throughout the day and night.',
      how_to_take: 'Inject once daily at the same time each day. Usually given at bedtime. Do not mix with other insulins.',
      side_effects: [
        'Hypoglycemia',
        'Injection site pain or redness',
        'Weight gain'
      ],
      warnings: [
        'Do not dilute or mix with other insulins',
        'Store unopened vials in refrigerator',
        'Once opened, store at room temperature up to 28 days'
      ],
      interactions: [
        'Thiazolidinediones may cause fluid retention with insulin',
        'Alcohol alters blood sugar control'
      ],
      algeria_brands: [
        'Lantus SoloStar',
        'Toujeo SoloStar (300U/mL)'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'Liste II',
        lab: 'SANOFI AVENTIS',
        generic_official: 'INSULINE GLARGINE',
        notice_url: 'https://pharmnet-dz.com/notice.ashx?id=3304',
        pharmnet_url: 'https://pharmnet-dz.com/m-3304-lantus-100ui-ml-sol-inj-sc-en-cart-b-5cart-de-3ml--pour-optipen-',
        dosage_variants: [
          {
            dosage: '100UI/ML',
            form: 'SOL. INJ',
            conditioning: 'B/5CART. DE 3ML  (POUR OPTIPEN )',
            ppa: '7103.00 DA'
          },
          {
            dosage: '100UI/ML',
            form: 'SOL. INJ',
            conditioning: 'B/1FL DE 10ML',
            ppa: null
          }
        ]
      }
    },
    {
      name: 'Januvia',
      scientific_name: 'Sitagliptin',
      category: 'Diabetes',
      emoji: '💊',
      description: 'Januvia is a DPP-4 inhibitor that helps lower blood sugar by increasing insulin release when blood sugar is high and decreasing sugar production by the liver.',
      how_to_take: 'Take once daily with or without food. Usually 100mg per day.',
      side_effects: [
        'Stuffy or runny nose',
        'Sore throat',
        'Upper respiratory infection',
        'Headache',
        'Rarely: joint pain'
      ],
      warnings: [
        'Dose adjustment needed for kidney disease',
        'Report severe joint pain to doctor',
        'May cause pancreatitis — seek care for severe stomach pain'
      ],
      interactions: [
        'Works well with metformin',
        'May need dose adjustment with certain antifungals'
      ],
      algeria_brands: [
        'Januvia 100mg',
        'Janumet (Sitagliptin + Metformin)'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'Liste I',
        lab: 'MERCK SCHARP & DOHME LTD',
        generic_official: 'SITAGLIPTINE PHOSPHATE MONOHYDRATE EXPRIME EN SITAGLIPTINE',
        notice_url: 'https://pharmnet-dz.com//notice.ashx?id=6078',
        pharmnet_url: 'https://pharmnet-dz.com/m-3727-januvia-100mg-comp-pelli-b-28',
        dosage_variants: [
          {
            dosage: '100MG',
            form: 'COMP. PELLI',
            conditioning: 'B/28',
            ppa: null
          }
        ]
      }
    },
    {
      name: 'Glucor',
      scientific_name: 'Acarbose',
      category: 'Diabetes',
      emoji: '💊',
      description: 'Glucor slows the digestion of carbohydrates in the intestine, reducing the rise in blood sugar after meals. Often used alongside other diabetes medications.',
      how_to_take: 'Take at the start of each main meal. Swallow with the first bite of food.',
      side_effects: [
        'Gas and bloating (very common at start)',
        'Diarrhea',
        'Stomach cramps'
      ],
      warnings: [
        'Side effects usually improve after a few weeks',
        'Not suitable for inflammatory bowel disease',
        'Low blood sugar must be treated with glucose (not table sugar)'
      ],
      interactions: [
        'Reduces effectiveness of some digestive enzymes',
        'May interact with antacids'
      ],
      algeria_brands: [
        'Glucor 50mg',
        'Glucor 100mg'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'Liste I',
        lab: 'BAYER',
        generic_official: 'ACARBOSE',
        notice_url: 'https://pharmnet-dz.com/notice.ashx?id=3725',
        pharmnet_url: 'https://pharmnet-dz.com/m-3725-glucobay-100mg-comp-sec-b-30',
        dosage_variants: [
          {
            dosage: '100MG',
            form: 'COMP. SEC',
            conditioning: 'B/30',
            ppa: null
          },
          {
            dosage: '50MG',
            form: 'COMP',
            conditioning: 'B/30',
            ppa: '411.28 DA'
          }
        ]
      }
    },
    {
      name: 'Victoza',
      scientific_name: 'Liraglutide',
      category: 'Diabetes',
      emoji: '💉',
      description: 'Victoza is a GLP-1 receptor agonist injectable medication for type 2 diabetes. It stimulates insulin release, reduces glucagon, slows gastric emptying and reduces appetite. Also provides cardiovascular protection.',
      how_to_take: 'Inject once daily at any time, with or without meals. Inject under the skin of abdomen, thigh, or upper arm. Rotate injection sites.',
      side_effects: [
        'Nausea (very common at start)',
        'Vomiting',
        'Diarrhea',
        'Decreased appetite',
        'Injection site reactions'
      ],
      warnings: [
        'Not for type 1 diabetes',
        'Stop and seek care for severe abdominal pain (pancreatitis)',
        'Not recommended with personal or family history of thyroid cancer',
        'Monitor heart rate'
      ],
      interactions: [
        'Slows gastric emptying — may affect absorption of oral medications',
        'Insulin — hypoglycemia risk increases'
      ],
      algeria_brands: [
        'Victoza 6mg/mL pen',
        'Ozempic (Semaglutide — related drug)'
      ],
      pharmnet: {
        refundable: null,
        prescription_list: 'N/D',
        lab: 'NOVONORDISK',
        generic_official: null,
        notice_url: 'https://pharmnet-dz.com//notice.ashx?id=6078',
        pharmnet_url: 'https://pharmnet-dz.com/m-3484-victoza-6mg-ml-sol-inj-s-c-en-stylo-preremplie-multidose-b-02-stylos-de-3ml',
        dosage_variants: [
          {
            dosage: '6MG/ML',
            form: 'SOL. INJ',
            conditioning: 'B/02 STYLOS DE 3ML',
            ppa: null
          }
        ]
      }
    },
    {
      name: 'Stagid',
      scientific_name: 'Metformin (sustained release)',
      category: 'Diabetes',
      emoji: '💊',
      description: 'Stagid is a sustained-release form of metformin that is gentler on the stomach than regular metformin. Widely available in Algeria.',
      how_to_take: 'Take during or immediately after meals. Swallow whole — do not crush or chew. Usually once or twice daily.',
      side_effects: [
        'Fewer stomach side effects than regular metformin',
        'Nausea',
        'Diarrhea (less common)'
      ],
      warnings: [
        'Same precautions as regular metformin',
        'Do not use with severe kidney or liver disease',
        'Stop before contrast X-rays'
      ],
      interactions: [
        'Same as metformin — alcohol, contrast media, diuretics'
      ],
      algeria_brands: [
        'Stagid 700mg'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'Liste I',
        lab: 'MERCK LIPHA SANTE',
        generic_official: 'METFORMINE EMBONATE',
        notice_url: 'https://pharmnet-dz.com/notice.ashx?id=3635',
        pharmnet_url: 'https://pharmnet-dz.com/m-3635-stagid-700mg-comp-sec-b-30',
        dosage_variants: [
          {
            dosage: '700MG',
            form: 'COMP. SEC',
            conditioning: 'B/30',
            ppa: null
          }
        ]
      }
    },
    {
      name: 'Novorapid',
      scientific_name: 'Insulin Aspart (Rapid-acting)',
      category: 'Diabetes',
      emoji: '💉',
      description: 'Novorapid is a rapid-acting insulin analog that starts working within 10-20 minutes of injection. Used to control blood sugar spikes at mealtimes.',
      how_to_take: 'Inject immediately before meals. Can also be given just after meals if necessary. Inject subcutaneously.',
      side_effects: [
        'Hypoglycemia',
        'Injection site reactions',
        'Weight gain'
      ],
      warnings: [
        'Always carry fast-acting glucose (sugar, juice)',
        'Do not use if solution is not clear and colorless',
        'Rotate injection sites to prevent lipodystrophy'
      ],
      interactions: [
        'Alcohol alters blood sugar unpredictably',
        'Beta-blockers mask hypoglycemia symptoms'
      ],
      algeria_brands: [
        'NovoRapid FlexPen 100U/mL',
        'NovoRapid Penfill'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'Liste II',
        lab: 'NOVO NORDISK',
        generic_official: 'INSULINE ASPARTE',
        notice_url: 'https://pharmnet-dz.com/notice.ashx?id=3308',
        pharmnet_url: 'https://pharmnet-dz.com/m-3308-novorapid-flexpen-100ui-ml-sol-inj-b-05-stylos-multidoses-pre-remplis-jetables-de-3ml',
        dosage_variants: [
          {
            dosage: '100UI/ML',
            form: 'SOL. INJ',
            conditioning: 'B/05 STYLOS MULTIDOSES PRE-REMPLIS JETABLES DE 3ML',
            ppa: '5800.73 DA'
          }
        ]
      }
    },
    {
      name: 'Amaryl',
      scientific_name: 'Glimepiride',
      category: 'Diabetes',
      emoji: '💊',
      description: 'Amaryl is a sulfonylurea medication used to treat type 2 diabetes. It helps the pancreas produce more insulin to lower blood sugar levels.',
      how_to_take: 'Take once daily with breakfast or the first main meal of the day.',
      side_effects: [
        'Low blood sugar',
        'Weight gain',
        'Nausea',
        'Dizziness'
      ],
      warnings: [
        'Do not skip meals',
        'Monitor blood sugar regularly',
        'Use cautiously in elderly patients'
      ],
      interactions: [
        'Insulin increases hypoglycemia risk',
        'Alcohol may worsen low blood sugar'
      ],
      algeria_brands: [
        'Amaryl 1mg',
        'Amaryl 2mg',
        'Amaryl 4mg'
      ],
      pharmnet: null
    },
    {
      name: 'Galvus',
      scientific_name: 'Vildagliptin',
      category: 'Diabetes',
      emoji: '💊',
      description: 'Galvus is used for type 2 diabetes to help control blood sugar by increasing insulin release and reducing glucose production.',
      how_to_take: 'Take once or twice daily with or without food.',
      side_effects: [
        'Headache',
        'Dizziness',
        'Nausea',
        'Fatigue'
      ],
      warnings: [
        'Monitor liver function regularly',
        'Report severe abdominal pain'
      ],
      interactions: [
        'Insulin may increase hypoglycemia risk'
      ],
      algeria_brands: [
        'Galvus 50mg'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'Liste I',
        lab: 'NOVARTIS',
        generic_official: 'VILDAGLIPTINE',
        notice_url: 'https://pharmnet-dz.com/notice.ashx?id=3728',
        pharmnet_url: 'https://pharmnet-dz.com/m-3728-galvus-50mg-comp-b-28',
        dosage_variants: [
          {
            dosage: '50MG',
            form: 'COMP',
            conditioning: 'B/28',
            ppa: '2747.00 DA'
          }
        ]
      }
    },
    {
      name: 'Galvus Met',
      scientific_name: 'Vildagliptin + Metformin',
      category: 'Diabetes',
      emoji: '💊',
      description: 'Galvus Met combines vildagliptin and metformin to improve blood sugar control in type 2 diabetes.',
      how_to_take: 'Take with meals to reduce stomach upset.',
      side_effects: [
        'Diarrhea',
        'Nausea',
        'Headache',
        'Low blood sugar'
      ],
      warnings: [
        'Monitor kidney function',
        'Avoid excessive alcohol'
      ],
      interactions: [
        'Alcohol increases lactic acidosis risk'
      ],
      algeria_brands: [
        'Galvus Met 50mg/500mg',
        'Galvus Met 50mg/850mg'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'Liste I',
        lab: 'NOVARTIS',
        generic_official: 'VILDAGLIPTINE',
        notice_url: 'https://pharmnet-dz.com/notice.ashx?id=3728',
        pharmnet_url: 'https://pharmnet-dz.com/m-3728-galvus-50mg-comp-b-28',
        dosage_variants: [
          {
            dosage: '50MG',
            form: 'COMP',
            conditioning: 'B/28',
            ppa: '2747.00 DA'
          }
        ]
      }
    },
    {
      name: 'Actos',
      scientific_name: 'Pioglitazone',
      category: 'Diabetes',
      emoji: '💊',
      description: 'Actos improves insulin sensitivity in patients with type 2 diabetes.',
      how_to_take: 'Take once daily with or without food.',
      side_effects: [
        'Weight gain',
        'Swelling',
        'Headache',
        'Muscle pain'
      ],
      warnings: [
        'Use cautiously in heart failure',
        'Monitor liver function'
      ],
      interactions: [
        'Insulin increases edema risk'
      ],
      algeria_brands: [
        'Actos 15mg',
        'Actos 30mg'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'Liste I',
        lab: 'ARAB PHARM',
        generic_official: 'PIOGLITAZONE CHLORHYDRATE EXPRIME EN PIOGLITAZONE',
        notice_url: 'https://pharmnet-dz.com//notice.ashx?id=6078',
        pharmnet_url: 'https://pharmnet-dz.com/m-3716-actos-15mg-comp--b-30',
        dosage_variants: [
          {
            dosage: '15MG',
            form: 'COMP',
            conditioning: 'B/30',
            ppa: null
          },
          {
            dosage: '30MG',
            form: 'COMP',
            conditioning: 'B/30',
            ppa: null
          }
        ]
      }
    },
    {
      name: 'Levemir',
      scientific_name: 'Insulin Detemir',
      category: 'Diabetes',
      emoji: '💉',
      description: 'Levemir is a long-acting insulin used to provide stable blood sugar control throughout the day.',
      how_to_take: 'Inject once or twice daily at the same time each day.',
      side_effects: [
        'Hypoglycemia',
        'Weight gain',
        'Injection site reactions'
      ],
      warnings: [
        'Rotate injection sites',
        'Monitor blood sugar regularly'
      ],
      interactions: [
        'Alcohol may alter blood sugar levels'
      ],
      algeria_brands: [
        'Levemir FlexPen'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'Liste II',
        lab: 'NOVO NORDISK',
        generic_official: 'INSULINE DETEMIR',
        notice_url: 'https://pharmnet-dz.com/notice.ashx?id=3312',
        pharmnet_url: 'https://pharmnet-dz.com/m-3312-levemir-flexpen-100u-ml-ou-100ui-ml-sol-inj-s-c-b-05-stylos-pre-remplis-multidose-jetables-de-3ml',
        dosage_variants: [
          {
            dosage: '100U/ML (OU 100UI/ML)',
            form: 'SOL. INJ',
            conditioning: 'B/05 STYLOS PRE REMPLIS MULTIDOSE JETABLES DE 3ML',
            ppa: '8982.08 DA'
          }
        ]
      }
    },
    {
      name: 'Humalog',
      scientific_name: 'Insulin Lispro',
      category: 'Diabetes',
      emoji: '💉',
      description: 'Humalog is a rapid-acting insulin used to control blood sugar spikes during meals.',
      how_to_take: 'Inject within 15 minutes before meals.',
      side_effects: [
        'Hypoglycemia',
        'Weight gain',
        'Injection site reactions'
      ],
      warnings: [
        'Always carry sugar for hypoglycemia'
      ],
      interactions: [
        'Beta-blockers may mask hypoglycemia symptoms'
      ],
      algeria_brands: [
        'Humalog KwikPen'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'Liste II',
        lab: 'ELI LILLY',
        generic_official: 'INSULINE LISPRO',
        notice_url: 'https://pharmnet-dz.com/notice.ashx?id=3744',
        pharmnet_url: 'https://pharmnet-dz.com/m-3744-humalog-100ui-ml-3-5mg-ml-sol-inj-sc-iv-en-cartouche-pour-stylo-b-05-cartouches-de-3ml',
        dosage_variants: [
          {
            dosage: '100UI/ML (3,5MG/ML)',
            form: 'SOL. INJ',
            conditioning: 'B/05 CARTOUCHES DE 3ML',
            ppa: '3999.28 DA'
          },
          {
            dosage: '100UI/ML (3,5MG/ML)',
            form: 'SOL. INJ',
            conditioning: 'B/01FL.DE 10ML',
            ppa: null
          }
        ]
      }
    },
    {
      name: 'Trajenta',
      scientific_name: 'Linagliptin',
      category: 'Diabetes',
      emoji: '💊',
      description: 'Trajenta is a DPP-4 inhibitor for type 2 diabetes that does not require dose adjustment in kidney disease, making it valuable for diabetic patients with renal impairment.',
      how_to_take: 'Take once daily (5mg) with or without food at any time of day.',
      side_effects: [
        'Nasopharyngitis',
        'Cough',
        'Hypoglycemia when combined with sulfonylurea',
        'Rarely: joint pain'
      ],
      warnings: [
        'Report severe or persistent joint pain',
        'Stop and seek care for pancreatitis symptoms',
        'Not for type 1 diabetes'
      ],
      interactions: [
        'Rifampicin reduces effectiveness',
        'Sulfonylureas — increased hypoglycemia risk'
      ],
      algeria_brands: [
        'Trajenta 5mg',
        'Jentadueto (Linagliptin + Metformin)'
      ],
      pharmnet: null
    },
    {
      name: 'Onglyza',
      scientific_name: 'Saxagliptin',
      category: 'Diabetes',
      emoji: '💊',
      description: 'Onglyza is a DPP-4 inhibitor used as an add-on treatment for type 2 diabetes when diet and exercise plus metformin do not provide adequate control.',
      how_to_take: 'Take once daily (2.5mg or 5mg) with or without food.',
      side_effects: [
        'Upper respiratory infection',
        'Urinary tract infection',
        'Headache',
        'Hypoglycemia with sulfonylurea'
      ],
      warnings: [
        'Dose reduction needed for kidney impairment',
        'Monitor for signs of heart failure',
        'Report pancreatitis symptoms'
      ],
      interactions: [
        'Strong CYP3A4 inhibitors (ketoconazole) increase saxagliptin levels',
        'Insulin increases hypoglycemia risk'
      ],
      algeria_brands: [
        'Onglyza 2.5mg',
        'Onglyza 5mg',
        'Komboglyze (Saxagliptin + Metformin)'
      ],
      pharmnet: null
    },
    {
      name: 'Forxiga',
      scientific_name: 'Dapagliflozin',
      category: 'Diabetes',
      emoji: '💊',
      description: 'Forxiga is an SGLT-2 inhibitor that lowers blood sugar by causing the kidneys to remove glucose through urine. Also protects the heart and kidneys in people with type 2 diabetes.',
      how_to_take: 'Take once daily (10mg) in the morning, with or without food.',
      side_effects: [
        'Genital yeast infections',
        'Urinary tract infections',
        'Increased urination',
        'Low blood pressure',
        'Rarely: diabetic ketoacidosis'
      ],
      warnings: [
        'Not for type 1 diabetes',
        'Maintain good genital hygiene',
        'Stop before surgery',
        'Seek urgent care if nausea, vomiting, or abdominal pain with normal blood sugar'
      ],
      interactions: [
        'Diuretics — increased dehydration risk',
        'Insulin and sulfonylureas — increased hypoglycemia risk'
      ],
      algeria_brands: [
        'Forxiga 10mg'
      ],
      pharmnet: null
    },
    {
      name: 'Jardiance',
      scientific_name: 'Empagliflozin',
      category: 'Diabetes',
      emoji: '💊',
      description: 'Jardiance is an SGLT-2 inhibitor for type 2 diabetes that has strong evidence for reducing heart failure hospitalizations and protecting kidney function.',
      how_to_take: 'Take once daily (10mg or 25mg) in the morning, with or without food.',
      side_effects: [
        'Genital infections',
        'Urinary tract infections',
        'Increased urination',
        'Dizziness',
        'Thirst'
      ],
      warnings: [
        'Maintain hydration',
        'Monitor kidney function',
        'Stop before major surgery',
        'Report signs of ketoacidosis'
      ],
      interactions: [
        'Diuretics — dehydration risk',
        'Insulin — hypoglycemia risk with dose reductions needed'
      ],
      algeria_brands: [
        'Jardiance 10mg',
        'Jardiance 25mg'
      ],
      pharmnet: null
    },
    {
      name: 'Ozempic',
      scientific_name: 'Semaglutide',
      category: 'Diabetes',
      emoji: '💉',
      description: 'Ozempic is a once-weekly GLP-1 receptor agonist injection for type 2 diabetes. Provides significant blood sugar lowering, weight loss, and cardiovascular protection.',
      how_to_take: 'Inject once weekly on the same day each week. Inject under the skin of the abdomen, thigh, or upper arm. Dose starts at 0.25mg and increases.',
      side_effects: [
        'Nausea (very common at start)',
        'Vomiting',
        'Diarrhea',
        'Constipation',
        'Decreased appetite',
        'Injection site reactions'
      ],
      warnings: [
        'Not for type 1 diabetes',
        'Avoid in personal/family history of thyroid cancer',
        'Pancreatitis risk — seek care for severe abdominal pain',
        'May slow gastric emptying affecting other medications'
      ],
      interactions: [
        'Insulin and sulfonylureas — hypoglycemia risk',
        'Slows absorption of oral medications'
      ],
      algeria_brands: [
        'Ozempic 0.25mg/0.5mg pen',
        'Ozempic 1mg pen'
      ],
      pharmnet: null
    },
    {
      name: 'Trulicity',
      scientific_name: 'Dulaglutide',
      category: 'Diabetes',
      emoji: '💉',
      description: 'Trulicity is a once-weekly GLP-1 receptor agonist for type 2 diabetes, delivered via an easy-to-use auto-injector pen that does not require reconstitution.',
      how_to_take: 'Inject once weekly at any time of day with or without food. Can inject into abdomen, thigh, or upper arm.',
      side_effects: [
        'Nausea',
        'Diarrhea',
        'Abdominal pain',
        'Vomiting',
        'Decreased appetite'
      ],
      warnings: [
        'Avoid in thyroid cancer history',
        'Pancreatitis risk',
        'Not for type 1 diabetes'
      ],
      interactions: [
        'Slows gastric emptying — affects oral drug absorption',
        'Sulfonylureas — increased hypoglycemia'
      ],
      algeria_brands: [
        'Trulicity 0.75mg',
        'Trulicity 1.5mg'
      ],
      pharmnet: null
    },
    {
      name: 'Huminsulin',
      scientific_name: 'Insulin Human (NPH)',
      category: 'Diabetes',
      emoji: '💉',
      description: 'Huminsulin NPH is an intermediate-acting human insulin used once or twice daily to control background blood sugar levels in type 1 and type 2 diabetes.',
      how_to_take: 'Inject subcutaneously once or twice daily. Roll the vial gently to mix before injecting — do not shake.',
      side_effects: [
        'Hypoglycemia',
        'Weight gain',
        'Injection site reactions',
        'Lipodystrophy'
      ],
      warnings: [
        'Rotate injection sites',
        'Carry glucose at all times',
        'Cloudy appearance is normal — mix gently before use'
      ],
      interactions: [
        'Alcohol alters blood sugar',
        'Beta-blockers mask hypoglycemia symptoms',
        'Steroids increase insulin requirements'
      ],
      algeria_brands: [
        'Huminsulin Basal 100 IU/mL',
        'Insulatard HM (NPH)'
      ],
      pharmnet: null
    },
    {
      name: 'Mixtard',
      scientific_name: 'Insulin Human (Biphasic)',
      category: 'Diabetes',
      emoji: '💉',
      description: 'Mixtard is a premixed human insulin containing both short-acting and intermediate-acting insulin. Used twice daily for simplified diabetes management.',
      how_to_take: 'Inject subcutaneously 30 minutes before breakfast and dinner. Mix gently before use.',
      side_effects: [
        'Hypoglycemia',
        'Weight gain',
        'Injection site reactions'
      ],
      warnings: [
        'Inject 30 minutes before meals — timing is critical',
        'Do not skip meals after injection',
        'Rotate injection sites'
      ],
      interactions: [
        'Same as other insulins — alcohol, beta-blockers, steroids'
      ],
      algeria_brands: [
        'Mixtard 30 HM',
        'Mixtard 50 HM'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'Liste II',
        lab: 'NOVO NORDISK',
        generic_official: 'INSULINE HUMAINE (rDNA) 30% / INSULINE HUMAINE ISOPHANE 70%',
        notice_url: 'https://pharmnet-dz.com//notice.ashx?id=6078',
        pharmnet_url: 'https://pharmnet-dz.com/m-3736-mixtard-30hm-100ui-ml-susp-inj-fl-10ml',
        dosage_variants: [
          {
            dosage: '100UI/ML',
            form: 'SUSP. INJ',
            conditioning: 'FL/10ML',
            ppa: null
          }
        ]
      }
    },
    {
      name: 'Janumet',
      scientific_name: 'Sitagliptin + Metformin',
      category: 'Diabetes',
      emoji: '💊',
      description: 'Janumet combines sitagliptin (DPP-4 inhibitor) and metformin in a single tablet for convenient type 2 diabetes management when both medications are needed.',
      how_to_take: 'Take twice daily with meals to reduce stomach upset.',
      side_effects: [
        'Nausea',
        'Diarrhea',
        'Stomach pain',
        'Upper respiratory infection',
        'Headache'
      ],
      warnings: [
        'Stop before surgery or contrast X-ray',
        'Dose adjustment needed for kidney disease',
        'Monitor for pancreatitis'
      ],
      interactions: [
        'Alcohol — lactic acidosis risk',
        'Iodinated contrast — stop 48h before'
      ],
      algeria_brands: [
        'Janumet 50mg/500mg',
        'Janumet 50mg/850mg',
        'Janumet 50mg/1000mg'
      ],
      pharmnet: null
    },
    {
      name: 'Eucreas',
      scientific_name: 'Vildagliptin + Metformin',
      category: 'Diabetes',
      emoji: '💊',
      description: 'Eucreas is a fixed-dose combination of vildagliptin and metformin for type 2 diabetes patients already controlled on both individual components.',
      how_to_take: 'Take twice daily with meals.',
      side_effects: [
        'Nausea',
        'Diarrhea',
        'Headache',
        'Dizziness'
      ],
      warnings: [
        'Monitor liver function',
        'Avoid in severe kidney or liver disease',
        'Stop before contrast procedures'
      ],
      interactions: [
        'Alcohol — lactic acidosis risk',
        'Insulin — hypoglycemia risk'
      ],
      algeria_brands: [
        'Eucreas 50mg/850mg',
        'Eucreas 50mg/1000mg'
      ],
      pharmnet: null
    },
    {
      name: 'Invokana',
      scientific_name: 'Canagliflozin',
      category: 'Diabetes',
      emoji: '💊',
      description: 'Invokana is an SGLT-2 inhibitor for type 2 diabetes that reduces blood sugar and body weight, and has shown benefits in preventing kidney disease progression.',
      how_to_take: 'Take once daily (100mg or 300mg) before the first meal of the day.',
      side_effects: [
        'Genital yeast infections',
        'Urinary tract infections',
        'Increased urination',
        'Dehydration',
        'Leg or foot amputations (rare)'
      ],
      warnings: [
        'Monitor for signs of lower limb problems',
        'Stay hydrated',
        'Stop before major surgery',
        'Not for type 1 diabetes'
      ],
      interactions: [
        'Diuretics — dehydration risk',
        'Digoxin — levels may increase',
        'Rifampicin — reduces effectiveness'
      ],
      algeria_brands: [
        'Invokana 100mg',
        'Invokana 300mg'
      ],
      pharmnet: null
    },

  // ─── HYPERTENSION ──────────────────────────────────────────
    {
      name: 'Coversyl',
      scientific_name: 'Perindopril',
      category: 'Hypertension',
      emoji: '❤️',
      description: 'Coversyl is an ACE inhibitor used to treat high blood pressure and heart failure. It relaxes blood vessels so your heart does not have to work as hard.',
      how_to_take: 'Take once daily, preferably in the morning before eating. Take at the same time each day.',
      side_effects: [
        'Dry cough (very common)',
        'Dizziness',
        'Headache',
        'Fatigue',
        'Rarely: swelling of face/lips/tongue (angioedema)'
      ],
      warnings: [
        'Tell your doctor immediately if you develop swelling of the face or throat',
        'Monitor potassium levels',
        'Not safe during pregnancy',
        'Can cause dizziness when standing up'
      ],
      interactions: [
        'Potassium supplements increase hyperkalemia risk',
        'NSAIDs reduce effectiveness',
        'Diuretics increase hypotension risk'
      ],
      algeria_brands: [
        'Coversyl 5mg',
        'Coversyl 10mg',
        'Coversyl Plus (+ Indapamide)'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'Liste I',
        lab: 'SERVIER',
        generic_official: 'PERINDOPRIL ARGININE',
        notice_url: 'https://pharmnet-dz.com/notice.ashx?id=3217',
        pharmnet_url: 'https://pharmnet-dz.com/m-3217-coversyl-10mg-comp-pelli-b-30',
        dosage_variants: [
          {
            dosage: '10MG',
            form: 'COMP. PELLI',
            conditioning: 'B/30',
            ppa: null
          },
          {
            dosage: '5MG',
            form: 'COMP. PELLI',
            conditioning: 'B/30',
            ppa: '812.00 DA'
          }
        ]
      }
    },
    {
      name: 'Aprovel',
      scientific_name: 'Irbesartan',
      category: 'Hypertension',
      emoji: '❤️',
      description: 'Aprovel is an ARB (angiotensin receptor blocker) used to treat high blood pressure and protect the kidneys in diabetic patients with hypertension.',
      how_to_take: 'Take once daily with or without food. Usually 150-300mg per day.',
      side_effects: [
        'Dizziness',
        'Fatigue',
        'Nausea',
        'Diarrhea'
      ],
      warnings: [
        'Not safe during pregnancy',
        'Monitor kidney function and potassium',
        'Avoid potassium supplements unless prescribed'
      ],
      interactions: [
        'NSAIDs reduce effectiveness',
        'Potassium-sparing diuretics increase hyperkalemia risk',
        'Lithium levels may increase'
      ],
      algeria_brands: [
        'Aprovel 150mg',
        'Aprovel 300mg',
        'CoAprovel (+ Hydrochlorothiazide)'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'Liste I',
        lab: 'SANOFI AVENTIS',
        generic_official: 'IRBESARTAN',
        notice_url: 'https://pharmnet-dz.com/notice.ashx?id=209',
        pharmnet_url: 'https://pharmnet-dz.com/m-209-aprovel-150mg-comp-pelli-b-28',
        dosage_variants: [
          {
            dosage: '150MG',
            form: 'COMP. PELLI',
            conditioning: 'B/28',
            ppa: '1204.00 DA'
          },
          {
            dosage: '300MG',
            form: 'COMP. PELLI',
            conditioning: 'B/28',
            ppa: '1204.00 DA'
          }
        ]
      }
    },
    {
      name: 'Tareg',
      scientific_name: 'Valsartan',
      category: 'Hypertension',
      emoji: '❤️',
      description: 'Tareg (Valsartan) is used to treat high blood pressure and heart failure. It blocks angiotensin II, a chemical that narrows blood vessels.',
      how_to_take: 'Take once or twice daily. Can be taken with or without food.',
      side_effects: [
        'Dizziness',
        'Headache',
        'Fatigue',
        'Back pain'
      ],
      warnings: [
        'Not safe in pregnancy',
        'Monitor kidney function',
        'May cause low blood pressure'
      ],
      interactions: [
        'NSAIDs reduce effectiveness',
        'Potassium-sparing diuretics',
        'Lithium'
      ],
      algeria_brands: [
        'Tareg 80mg',
        'Tareg 160mg',
        'Tareg 320mg',
        'Co-Tareg'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'Liste I',
        lab: 'NOVARTIS',
        generic_official: 'VALSARTAN',
        notice_url: 'https://pharmnet-dz.com/notice.ashx?id=3088',
        pharmnet_url: 'https://pharmnet-dz.com/m-3088-tareg-160mg-comp-pelli-b-28',
        dosage_variants: [
          {
            dosage: '160MG',
            form: 'COMP. PELLI',
            conditioning: 'B/28',
            ppa: '2315.00 DA'
          },
          {
            dosage: '80MG',
            form: 'COMP. PELLI',
            conditioning: 'B/28',
            ppa: '1646.00 DA'
          }
        ]
      }
    },
    {
      name: 'Tenormine',
      scientific_name: 'Atenolol',
      category: 'Hypertension',
      emoji: '❤️',
      description: 'Tenormine is a beta-blocker that slows the heart rate and reduces blood pressure. Used for hypertension, angina, and some heart rhythm problems.',
      how_to_take: 'Take once daily, with or without food. Do not stop suddenly.',
      side_effects: [
        'Fatigue',
        'Cold hands and feet',
        'Slow heart rate',
        'Dizziness',
        'Sleep disturbances'
      ],
      warnings: [
        'Never stop suddenly — taper gradually under doctor supervision',
        'May mask signs of low blood sugar in diabetics',
        'Not for asthma patients'
      ],
      interactions: [
        'Calcium channel blockers (verapamil) — risk of heart block',
        'Clonidine — rebound hypertension if stopped together',
        'NSAIDs reduce effectiveness'
      ],
      algeria_brands: [
        'Tenormine 50mg',
        'Tenormine 100mg',
        'Atenolol Mylan'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'Liste I',
        lab: 'SANAMED',
        generic_official: 'ATENOLOL',
        notice_url: 'https://pharmnet-dz.com//notice.ashx?id=93',
        pharmnet_url: 'https://pharmnet-dz.com/m-6223-tenormed-100mg-comprime-secable-b-30',
        dosage_variants: [
          {
            dosage: '100MG',
            form: 'COMP. SEC',
            conditioning: 'B/30',
            ppa: null
          }
        ]
      }
    },
    {
      name: 'Amlor',
      scientific_name: 'Amlodipine',
      category: 'Hypertension',
      emoji: '❤️',
      description: 'Amlor is a calcium channel blocker used to treat high blood pressure and chest pain (angina). It relaxes blood vessels and reduces the workload on the heart.',
      how_to_take: 'Take once daily, with or without food. Take at the same time each day.',
      side_effects: [
        'Ankle swelling',
        'Flushing',
        'Headache',
        'Fatigue',
        'Palpitations'
      ],
      warnings: [
        'Tell doctor if ankle swelling is severe',
        'Do not stop suddenly for angina treatment',
        'Grapefruit juice may increase drug levels'
      ],
      interactions: [
        'Simvastatin — limit simvastatin to 20mg',
        'Cyclosporine levels may increase',
        'Rifampicin reduces effectiveness'
      ],
      algeria_brands: [
        'Amlor 5mg',
        'Amlor 10mg',
        'Amlodipine Mylan',
        'Exforge (+ Valsartan)'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'Liste I',
        lab: 'PFIZER PHARM ALGERIE',
        generic_official: 'AMLODIPINE BESYLATE EXPRIME EN AMLODIPINE',
        notice_url: 'https://pharmnet-dz.com/notice.ashx?id=88',
        pharmnet_url: 'https://pharmnet-dz.com/m-88-amlor-10mg-gles-b-28',
        dosage_variants: [
          {
            dosage: '10MG',
            form: 'GLES',
            conditioning: 'B/28',
            ppa: null
          },
          {
            dosage: '5MG',
            form: 'GLES',
            conditioning: 'B/28 ET B/98',
            ppa: '2000.00 DA'
          }
        ]
      }
    },

  // ─── HEART ─────────────────────────────────────────────────
    {
      name: 'Kardégic',
      scientific_name: 'Aspirin (low dose)',
      category: 'Heart',
      emoji: '💊',
      description: 'Kardégic is low-dose aspirin used to prevent blood clots, heart attacks, and strokes. It is not a painkiller at this dose — it works as a blood thinner.',
      how_to_take: 'Take once daily, usually 75mg or 160mg. Dissolve in water before taking. Take with or after food.',
      side_effects: [
        'Stomach irritation',
        'Heartburn',
        'Nausea',
        'Rarely: stomach bleeding'
      ],
      warnings: [
        'Tell your dentist and surgeon you take aspirin',
        'Do not take ibuprofen regularly without consulting your doctor',
        'Stop if you notice black stools or vomiting blood'
      ],
      interactions: [
        'Ibuprofen and naproxen interfere with antiplatelet effect',
        'Warfarin — increased bleeding risk',
        'Clopidogrel — usually prescribed together'
      ],
      algeria_brands: [
        'Kardégic 75mg',
        'Kardégic 160mg',
        'Aspirine UPSA 100mg'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'N/D',
        lab: 'SANOFI AVENTIS',
        generic_official: 'ACIDE ACETYLSALICYLIQUE',
        notice_url: 'https://pharmnet-dz.com/notice.ashx?id=1709',
        pharmnet_url: 'https://pharmnet-dz.com/m-1709-kardegic-160mg-sachet--288mg-sachet-acetylsalicylate-de-dl-lysine-pdre-sol-buv-b-30-sachets-dose',
        dosage_variants: [
          {
            dosage: '160MG/SACHET** (288MG/SACHET ACETYLSALICYLATE DE DL LYSINE)',
            form: 'PDRE. SOL. BUV',
            conditioning: 'B/30 SACHETS DOSE',
            ppa: null
          },
          {
            dosage: '75MG/SACHET** (135MG/SACH. ACETYLSALICYLATE DE DL LYSINE)',
            form: 'PDRE. SOL. BUV',
            conditioning: 'B/30',
            ppa: null
          }
        ]
      }
    },
    {
      name: 'Cordarone',
      scientific_name: 'Amiodarone',
      category: 'Heart',
      emoji: '❤️',
      description: 'Cordarone is used to treat serious heart rhythm problems (arrhythmias). It is a powerful medication that requires careful monitoring.',
      how_to_take: 'Take with food to reduce stomach upset. Do not crush tablets. Follow your doctor\'s dose schedule exactly.',
      side_effects: [
        'Sensitivity to sunlight',
        'Thyroid problems',
        'Lung toxicity (rare)',
        'Visual disturbances',
        'Liver effects'
      ],
      warnings: [
        'Use high-SPF sunscreen outdoors',
        'Regular thyroid, liver, and lung monitoring required',
        'Interacts with many medications — always inform any new doctor'
      ],
      interactions: [
        'Warfarin — significantly increases anticoagulant effect',
        'Digoxin — increases digoxin levels',
        'Many other interactions — always check with pharmacist'
      ],
      algeria_brands: [
        'Cordarone 200mg',
        'Amiodarone Mylan'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'Liste II',
        lab: 'SANOFI SYNTHELABO',
        generic_official: 'AMIODARONE CHLORHYDRATE',
        notice_url: 'https://pharmnet-dz.com/notice.ashx?id=131',
        pharmnet_url: 'https://pharmnet-dz.com/m-131-cordarone-200mg-comp-sec-b-30',
        dosage_variants: [
          {
            dosage: '200MG',
            form: 'COMP SEC',
            conditioning: 'B/30',
            ppa: null
          },
          {
            dosage: '50MG/ML (150MG/3ML)',
            form: 'SOL. INJ',
            conditioning: 'B/06 AMP. DE 3ML',
            ppa: null
          }
        ]
      }
    },
    {
      name: 'Plavix',
      scientific_name: 'Clopidogrel',
      category: 'Heart',
      emoji: '🩸',
      description: 'Plavix is an antiplatelet medication that prevents blood clots. Used after heart attack, stroke, or stent placement to keep blood vessels open.',
      how_to_take: 'Take once daily with or without food. Do not stop without consulting your doctor — stopping suddenly can trigger a heart attack.',
      side_effects: [
        'Easy bruising or bleeding',
        'Stomach pain',
        'Nausea',
        'Headache',
        'Diarrhea'
      ],
      warnings: [
        'Tell all doctors and dentists you take Plavix before any procedure',
        'Do not stop suddenly',
        'Seek care if you notice unusual bleeding',
        'Avoid omeprazole — use pantoprazole instead'
      ],
      interactions: [
        'Omeprazole reduces effectiveness significantly',
        'Aspirin — usually taken together but increases bleeding risk',
        'NSAIDs — increased bleeding risk',
        'Warfarin — increased bleeding risk'
      ],
      algeria_brands: [
        'Plavix 75mg',
        'Clopidogrel Mylan',
        'Ceruvin 75mg'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'Liste I',
        lab: 'SANOFI AVENTIS',
        generic_official: 'CLOPIDOGREL HYDROGENOSULFATE EXPRIME EN CLOPIDOGREL',
        notice_url: 'https://pharmnet-dz.com//notice.ashx?id=93',
        pharmnet_url: 'https://pharmnet-dz.com/m-6086-plavix-300-mg-cp-pellicule-b-30',
        dosage_variants: [
          {
            dosage: '300 MG',
            form: 'COMP. PELLI',
            conditioning: 'B/30',
            ppa: null
          },
          {
            dosage: '75MG',
            form: 'COMP. PELLI',
            conditioning: 'B/28',
            ppa: '1680.00 DA'
          }
        ]
      }
    },
    {
      name: 'Sintrom',
      scientific_name: 'Acenocoumarol',
      category: 'Heart',
      emoji: '🩸',
      description: 'Sintrom is an oral anticoagulant (blood thinner) used to prevent and treat blood clots, deep vein thrombosis, pulmonary embolism, and to prevent stroke in patients with atrial fibrillation. Very commonly used in Algeria.',
      how_to_take: 'Take at the same time each day, usually in the evening. Regular INR blood tests are essential to adjust the dose.',
      side_effects: [
        'Bleeding (the main risk)',
        'Easy bruising',
        'Nosebleeds',
        'Prolonged bleeding from cuts'
      ],
      warnings: [
        'Regular INR monitoring is mandatory',
        'Many foods and medications affect its action',
        'Tell all doctors, dentists, and pharmacists you take Sintrom',
        'Seek immediate care for unusual or heavy bleeding',
        'Avoid contact sports'
      ],
      interactions: [
        'Aspirin and NSAIDs — greatly increased bleeding risk',
        'Antibiotics can increase effect',
        'Vitamin K-rich foods (spinach, broccoli) reduce effect',
        'Many drug interactions — always check before starting any new medication'
      ],
      algeria_brands: [
        'Sintrom 4mg',
        'Sintrom 1mg'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'Liste I',
        lab: 'NOVARTIS',
        generic_official: 'ACENOCOUMAROL',
        notice_url: 'https://pharmnet-dz.com/notice.ashx?id=3066',
        pharmnet_url: 'https://pharmnet-dz.com/m-3066-sintrom-4mg-comp-sec-b-30',
        dosage_variants: [
          {
            dosage: '4MG',
            form: 'COMP. SEC',
            conditioning: 'B/30',
            ppa: '188.00 DA'
          }
        ]
      }
    },
    {
      name: 'Tahor',
      scientific_name: 'Atorvastatin',
      category: 'Heart',
      emoji: '💊',
      description: 'Tahor is a statin used to lower cholesterol and reduce the risk of heart attack and stroke. It is one of the most prescribed medications worldwide.',
      how_to_take: 'Take once daily at any time of day, with or without food. Take at the same time each day.',
      side_effects: [
        'Muscle pain or weakness (important — report to doctor)',
        'Headache',
        'Nausea',
        'Joint pain',
        'Liver enzyme elevation (rare)'
      ],
      warnings: [
        'Report any unexplained muscle pain or weakness immediately',
        'Avoid grapefruit juice',
        'Regular liver function tests recommended',
        'Inform doctor if planning pregnancy'
      ],
      interactions: [
        'Grapefruit juice increases drug levels significantly',
        'Amlodipine — limit atorvastatin to 40mg',
        'Rifampicin reduces effectiveness',
        'Niacin increases myopathy risk'
      ],
      algeria_brands: [
        'Tahor 10mg',
        'Tahor 20mg',
        'Tahor 40mg',
        'Tahor 80mg',
        'Atorvastatine Mylan'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'Liste I',
        lab: 'PFIZER PHARM ALGERIE',
        generic_official: 'ATORVASTATINE CALCIQUE TRIHYDRATE EXPRIME EN ATORVASTATINE',
        notice_url: 'https://pharmnet-dz.com/notice.ashx?id=1564',
        pharmnet_url: 'https://pharmnet-dz.com/m-1564-tahor-10mg-comp-pelli-b-28',
        dosage_variants: [
          {
            dosage: '10MG',
            form: 'COMP. PELLI',
            conditioning: 'B/28',
            ppa: null
          },
          {
            dosage: '20MG',
            form: 'COMP. PELLI',
            conditioning: 'B/28',
            ppa: null
          },
          {
            dosage: '40MG',
            form: 'COMP. PELLI',
            conditioning: 'B/28',
            ppa: null
          }
        ]
      }
    },
    {
      name: 'Zocor',
      scientific_name: 'Simvastatin',
      category: 'Heart',
      emoji: '💊',
      description: 'Zocor is a statin that lowers LDL (bad) cholesterol and raises HDL (good) cholesterol, reducing the risk of cardiovascular events.',
      how_to_take: 'Take once daily in the evening or at bedtime. Avoid grapefruit.',
      side_effects: [
        'Muscle pain',
        'Headache',
        'Abdominal pain',
        'Nausea'
      ],
      warnings: [
        'Report muscle pain or weakness immediately',
        'Avoid grapefruit juice',
        'Limit to 20mg with amlodipine'
      ],
      interactions: [
        'Amlodipine — limit simvastatin to 20mg',
        'Amiodarone — limit simvastatin to 20mg',
        'Grapefruit juice'
      ],
      algeria_brands: [
        'Zocor 20mg',
        'Zocor 40mg',
        'Simvastatine Mylan'
      ],
      pharmnet: null
    },
    {
      name: 'Lescol',
      scientific_name: 'Fluvastatin',
      category: 'Heart',
      emoji: '💊',
      description: 'Lescol is a statin used to lower cholesterol levels and reduce the risk of cardiovascular disease. It is one of the statins available in Algeria.',
      how_to_take: 'Take once daily in the evening, with or without food. Extended-release form can be taken at any time.',
      side_effects: [
        'Muscle pain',
        'Headache',
        'Indigestion',
        'Nausea',
        'Insomnia'
      ],
      warnings: [
        'Report muscle pain or weakness immediately',
        'Liver function monitoring recommended',
        'Avoid in pregnancy'
      ],
      interactions: [
        'Cyclosporine increases fluvastatin levels',
        'Rifampicin reduces effectiveness',
        'Fluconazole increases levels'
      ],
      algeria_brands: [
        'Lescol 20mg',
        'Lescol 40mg',
        'Lescol XL 80mg'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'Liste I',
        lab: 'NOVARTIS',
        generic_official: 'FLUVASTATINE SODIQUE',
        notice_url: 'https://pharmnet-dz.com/notice.ashx?id=1553',
        pharmnet_url: 'https://pharmnet-dz.com/m-1553-lescol-40mg-gles-b-28',
        dosage_variants: [
          {
            dosage: '40MG',
            form: 'GLES',
            conditioning: 'B/28',
            ppa: null
          }
        ]
      }
    },

  // ─── HYPERTENSION ──────────────────────────────────────────
    {
      name: 'Sectral',
      scientific_name: 'Acebutolol',
      category: 'Hypertension',
      emoji: '❤️',
      description: 'Sectral is a cardioselective beta-blocker used to treat hypertension, angina, and heart rhythm disorders. It has less effect on the airways than non-selective beta-blockers.',
      how_to_take: 'Take once or twice daily, with or without food. Do not stop suddenly.',
      side_effects: [
        'Fatigue',
        'Dizziness',
        'Cold extremities',
        'Sleep disturbances',
        'Slow heart rate'
      ],
      warnings: [
        'Do not stop abruptly — taper dose under medical supervision',
        'Use with caution in asthma',
        'May mask hypoglycemia symptoms in diabetics'
      ],
      interactions: [
        'Verapamil — risk of severe bradycardia',
        'Clonidine — rebound hypertension risk',
        'Digoxin — additive bradycardia'
      ],
      algeria_brands: [
        'Sectral 200mg',
        'Sectral 400mg',
        'Acebutolol Mylan'
      ],
      pharmnet: {
        refundable: null,
        prescription_list: 'Liste I',
        lab: 'SAIDAL GROUPE',
        generic_official: 'ACEBUTOLOL CHLORHYDRATE',
        notice_url: 'https://pharmnet-dz.com//notice.ashx?id=93',
        pharmnet_url: 'https://pharmnet-dz.com/m-3231-sectral-200mg-comp-pelli-sec-b-30',
        dosage_variants: [
          {
            dosage: '200MG',
            form: 'COMP. PELLI',
            conditioning: 'B/30',
            ppa: '487.00 DA'
          },
          {
            dosage: '400MG',
            form: 'COMP. PELLI',
            conditioning: 'B/30',
            ppa: '906.00 DA'
          }
        ]
      }
    },
    {
      name: 'Lasilix',
      scientific_name: 'Furosemide',
      category: 'Hypertension',
      emoji: '💊',
      description: 'Lasilix is a powerful loop diuretic (water pill) used to treat fluid retention (edema) in heart failure, kidney disease, and liver cirrhosis, and to treat high blood pressure.',
      how_to_take: 'Take in the morning or early afternoon to avoid nighttime urination. Take with food to reduce stomach upset.',
      side_effects: [
        'Frequent urination',
        'Dizziness',
        'Low potassium (weakness, cramps)',
        'Dehydration',
        'Low blood pressure',
        'Sensitivity to sunlight'
      ],
      warnings: [
        'Monitor potassium levels — may need potassium supplements',
        'Stay hydrated',
        'Rise slowly to prevent dizziness',
        'Regular blood tests required'
      ],
      interactions: [
        'Digoxin — low potassium increases toxicity risk',
        'NSAIDs reduce effectiveness',
        'Aminoglycoside antibiotics — increased kidney toxicity',
        'Lithium — toxicity risk increases'
      ],
      algeria_brands: [
        'Lasilix 20mg',
        'Lasilix 40mg',
        'Lasilix 500mg (high dose)',
        'Furosémide Mylan'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'Liste II',
        lab: 'SANOFI AVENTIS',
        generic_official: 'FUROSEMIDE',
        notice_url: 'https://pharmnet-dz.com/notice.ashx?id=3288',
        pharmnet_url: 'https://pharmnet-dz.com/m-3288-lasilix-20mg-comp-b-30',
        dosage_variants: [
          {
            dosage: '20MG',
            form: 'COMP',
            conditioning: 'B/30',
            ppa: null
          }
        ]
      }
    },
    {
      name: 'Aldactone',
      scientific_name: 'Spironolactone',
      category: 'Hypertension',
      emoji: '❤️',
      description: 'Aldactone is a potassium-sparing diuretic used for heart failure, high blood pressure, and conditions causing high aldosterone levels. It also has anti-androgenic effects.',
      how_to_take: 'Take once daily with food to improve absorption and reduce stomach upset.',
      side_effects: [
        'Increased potassium',
        'Breast tenderness or enlargement (men)',
        'Menstrual irregularities (women)',
        'Dizziness',
        'Nausea'
      ],
      warnings: [
        'Monitor potassium levels — can cause dangerous hyperkalemia',
        'Avoid potassium supplements',
        'Regular kidney function tests',
        'Not safe in pregnancy'
      ],
      interactions: [
        'ACE inhibitors and ARBs — hyperkalemia risk',
        'NSAIDs reduce effectiveness',
        'Digoxin levels may increase'
      ],
      algeria_brands: [
        'Aldactone 25mg',
        'Aldactone 50mg',
        'Aldactone 75mg',
        'Spirozide (combination)'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'Liste II',
        lab: 'PFIZER HOLDING FRANCE',
        generic_official: 'SPIRONOLACTONE MICRONISEE',
        notice_url: 'https://pharmnet-dz.com/notice.ashx?id=1481',
        pharmnet_url: 'https://pharmnet-dz.com/m-1481-aldactone-75mg-comp-pelli-sec-b-30',
        dosage_variants: [
          {
            dosage: '75MG',
            form: 'COMP. PELLI',
            conditioning: 'B/30',
            ppa: null
          }
        ]
      }
    },
    {
      name: 'Micardis',
      scientific_name: 'Telmisartan',
      category: 'Hypertension',
      emoji: '❤️',
      description: 'Micardis is an ARB (angiotensin receptor blocker) used to treat high blood pressure and reduce the risk of cardiovascular events. It also protects the kidneys in diabetic patients.',
      how_to_take: 'Take once daily with or without food. Take at the same time each day.',
      side_effects: [
        'Dizziness',
        'Back pain',
        'Sinusitis',
        'Diarrhea',
        'Upper respiratory infection'
      ],
      warnings: [
        'Not safe during pregnancy',
        'Monitor kidney function',
        'Can cause low blood pressure especially with diuretics'
      ],
      interactions: [
        'Digoxin — increases digoxin levels',
        'Lithium — toxicity risk',
        'NSAIDs reduce effectiveness',
        'Potassium-sparing diuretics — hyperkalemia risk'
      ],
      algeria_brands: [
        'Micardis 40mg',
        'Micardis 80mg',
        'MicardisPlus (+ Hydrochlorothiazide)'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'Liste I',
        lab: 'BOEHRINGER INGELHEIM',
        generic_official: 'TELMISARTAN',
        notice_url: 'https://pharmnet-dz.com/notice.ashx?id=3202',
        pharmnet_url: 'https://pharmnet-dz.com/m-3202-micardis-40mg-comp--b-28',
        dosage_variants: [
          {
            dosage: '40MG',
            form: 'COMP',
            conditioning: 'B/28',
            ppa: null
          },
          {
            dosage: '80MG',
            form: 'COMP',
            conditioning: 'B/28',
            ppa: null
          }
        ]
      }
    },

  // ─── HEART ─────────────────────────────────────────────────
    {
      name: 'Digoxine',
      scientific_name: 'Digoxin',
      category: 'Heart',
      emoji: '❤️',
      description: 'Digoxine strengthens heart contractions and slows the heart rate. Used for heart failure and certain irregular heart rhythms (atrial fibrillation). Has a narrow safety margin requiring careful monitoring.',
      how_to_take: 'Take at the same time each day. Can be taken with or without food. Do not change brand without consulting your doctor.',
      side_effects: [
        'Nausea and vomiting',
        'Loss of appetite',
        'Visual disturbances (yellow-green halos)',
        'Irregular heartbeat',
        'Fatigue'
      ],
      warnings: [
        'Regular blood level monitoring is essential — toxicity is dangerous',
        'Tell your doctor immediately about vision changes or severe nausea',
        'Low potassium increases toxicity risk',
        'Many drug interactions'
      ],
      interactions: [
        'Amiodarone — greatly increases digoxin levels',
        'Furosemide — low potassium increases toxicity',
        'Antibiotics like clarithromycin — increase levels',
        'Calcium channel blockers — increase levels'
      ],
      algeria_brands: [
        'Digoxine 0.25mg',
        'Hemigoxine 0.125mg'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'Liste I',
        lab: 'BIOLOGICI',
        generic_official: 'DIGOXINE',
        notice_url: 'https://pharmnet-dz.com//notice.ashx?id=93',
        pharmnet_url: 'https://pharmnet-dz.com/m-3276-digoxine-0-5mg-2ml-sol-inj-iv-b-05-',
        dosage_variants: [
          {
            dosage: '0,5MG/2ML',
            form: 'SOL. INJ',
            conditioning: 'B/05',
            ppa: null
          }
        ]
      }
    },

  // ─── HYPERTENSION ──────────────────────────────────────────
    {
      name: 'Cozaar',
      scientific_name: 'Losartan',
      category: 'Hypertension',
      emoji: '❤️',
      description: 'Cozaar is an ARB medication used to lower blood pressure and protect the kidneys in diabetic patients.',
      how_to_take: 'Take once daily with or without food.',
      side_effects: [
        'Dizziness',
        'Fatigue',
        'Back pain'
      ],
      warnings: [
        'Monitor kidney function and potassium levels'
      ],
      interactions: [
        'NSAIDs reduce effectiveness'
      ],
      algeria_brands: [
        'Cozaar 50mg',
        'Cozaar 100mg'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'Liste I',
        lab: 'MSD FRANCE',
        generic_official: 'LOSARTAN POTASSIQUE',
        notice_url: 'https://pharmnet-dz.com//notice.ashx?id=93',
        pharmnet_url: 'https://pharmnet-dz.com/m-5762-cozaar-100mg-comp-pelli-b-28',
        dosage_variants: [
          {
            dosage: '100MG',
            form: 'COMP. PELLI',
            conditioning: 'B/28',
            ppa: null
          },
          {
            dosage: '50MG',
            form: 'COMP SEC',
            conditioning: 'B/28',
            ppa: null
          }
        ]
      }
    },
    {
      name: 'Renitec',
      scientific_name: 'Enalapril',
      category: 'Hypertension',
      emoji: '❤️',
      description: 'Renitec is an ACE inhibitor used for high blood pressure and heart failure.',
      how_to_take: 'Take once or twice daily before or after meals.',
      side_effects: [
        'Dry cough',
        'Dizziness',
        'Low blood pressure'
      ],
      warnings: [
        'Monitor kidney function',
        'Not safe during pregnancy'
      ],
      interactions: [
        'Potassium supplements increase hyperkalemia risk'
      ],
      algeria_brands: [
        'Renitec 5mg',
        'Renitec 20mg'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'Liste I',
        lab: 'MERCK SCHARP & DOHME LTD',
        generic_official: 'ENALAPRIL MALEATE',
        notice_url: 'https://pharmnet-dz.com/notice.ashx?id=160',
        pharmnet_url: 'https://pharmnet-dz.com/m-160-renitec-20mg-comp-sec-b-28',
        dosage_variants: [
          {
            dosage: '20MG',
            form: 'COMP. SEC',
            conditioning: 'B/28',
            ppa: null
          },
          {
            dosage: '5MG',
            form: 'COMP. SEC',
            conditioning: 'B/28',
            ppa: null
          }
        ]
      }
    },
    {
      name: 'Norvasc',
      scientific_name: 'Amlodipine',
      category: 'Hypertension',
      emoji: '❤️',
      description: 'Norvasc relaxes blood vessels and is used to treat hypertension and angina.',
      how_to_take: 'Take once daily at the same time each day.',
      side_effects: [
        'Ankle swelling',
        'Headache',
        'Flushing'
      ],
      warnings: [
        'Monitor swelling in legs'
      ],
      interactions: [
        'Grapefruit juice may increase drug levels'
      ],
      algeria_brands: [
        'Norvasc 5mg',
        'Norvasc 10mg'
      ],
      pharmnet: null
    },
    {
      name: 'Adalate',
      scientific_name: 'Nifedipine',
      category: 'Hypertension',
      emoji: '❤️',
      description: 'Adalate is a calcium channel blocker used to treat hypertension and chest pain.',
      how_to_take: 'Take once daily. Swallow whole.',
      side_effects: [
        'Headache',
        'Flushing',
        'Dizziness'
      ],
      warnings: [
        'Do not crush extended-release tablets'
      ],
      interactions: [
        'Grapefruit juice increases levels'
      ],
      algeria_brands: [
        'Adalate LP 20mg',
        'Adalate LP 30mg'
      ],
      pharmnet: null
    },
    {
      name: 'Lodoz',
      scientific_name: 'Bisoprolol + Hydrochlorothiazide',
      category: 'Hypertension',
      emoji: '❤️',
      description: 'Lodoz combines a beta-blocker and diuretic to control high blood pressure.',
      how_to_take: 'Take once daily in the morning.',
      side_effects: [
        'Fatigue',
        'Dizziness',
        'Frequent urination'
      ],
      warnings: [
        'Monitor blood pressure regularly'
      ],
      interactions: [
        'NSAIDs may reduce effectiveness'
      ],
      algeria_brands: [
        'Lodoz 2.5mg/6.25mg'
      ],
      pharmnet: null
    },
    {
      name: 'Natrilix',
      scientific_name: 'Indapamide',
      category: 'Hypertension',
      emoji: '💊',
      description: 'Natrilix is a diuretic used to lower blood pressure and reduce fluid retention.',
      how_to_take: 'Take once daily in the morning.',
      side_effects: [
        'Frequent urination',
        'Low potassium',
        'Dizziness'
      ],
      warnings: [
        'Monitor electrolytes regularly'
      ],
      interactions: [
        'Digoxin toxicity risk increases with low potassium'
      ],
      algeria_brands: [
        'Natrilix 1.5mg'
      ],
      pharmnet: null
    },

  // ─── HEART ─────────────────────────────────────────────────
    {
      name: 'Crestor',
      scientific_name: 'Rosuvastatin',
      category: 'Heart',
      emoji: '💊',
      description: 'Crestor lowers cholesterol and reduces the risk of heart attack and stroke.',
      how_to_take: 'Take once daily with or without food.',
      side_effects: [
        'Muscle pain',
        'Headache',
        'Nausea'
      ],
      warnings: [
        'Report muscle pain immediately'
      ],
      interactions: [
        'Warfarin increases bleeding risk'
      ],
      algeria_brands: [
        'Crestor 10mg',
        'Crestor 20mg'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'Liste I',
        lab: 'ASTRAZENECA',
        generic_official: 'ROSUVASTATINE  CALCIQUE EXPRIME EN ROSUVASTATINE',
        notice_url: 'https://pharmnet-dz.com/notice.ashx?id=1614',
        pharmnet_url: 'https://pharmnet-dz.com/m-1614-crestor-10mg-comp-pelli-b-28',
        dosage_variants: [
          {
            dosage: '10MG',
            form: 'COMP. PELLI',
            conditioning: 'B/28',
            ppa: null
          },
          {
            dosage: '20MG',
            form: 'COMP. PELLI',
            conditioning: 'B/28',
            ppa: null
          },
          {
            dosage: '5MG',
            form: 'COMP. PELLI',
            conditioning: 'B/28',
            ppa: null
          }
        ]
      }
    },
    {
      name: 'Lipanthyl',
      scientific_name: 'Fenofibrate',
      category: 'Heart',
      emoji: '💊',
      description: 'Lipanthyl is used to reduce triglycerides and cholesterol levels.',
      how_to_take: 'Take with meals.',
      side_effects: [
        'Stomach pain',
        'Muscle pain',
        'Nausea'
      ],
      warnings: [
        'Monitor liver function'
      ],
      interactions: [
        'Statins increase muscle toxicity risk'
      ],
      algeria_brands: [
        'Lipanthyl 160mg'
      ],
      pharmnet: {
        refundable: null,
        prescription_list: 'Liste II',
        lab: 'FOURNIER',
        generic_official: 'FENOFIBRATE',
        notice_url: 'https://pharmnet-dz.com//notice.ashx?id=93',
        pharmnet_url: 'https://pharmnet-dz.com/m-1578-lipanthyl-160mg-comp-pelli--lm-b-30',
        dosage_variants: [
          {
            dosage: '160MG',
            form: 'COMP. PELLI',
            conditioning: 'B/30',
            ppa: null
          }
        ]
      }
    },
    {
      name: 'Cardensiel',
      scientific_name: 'Bisoprolol',
      category: 'Heart',
      emoji: '❤️',
      description: 'Cardensiel is used for heart failure, hypertension, and heart rhythm disorders.',
      how_to_take: 'Take once daily in the morning.',
      side_effects: [
        'Fatigue',
        'Slow heartbeat',
        'Dizziness'
      ],
      warnings: [
        'Do not stop suddenly'
      ],
      interactions: [
        'Verapamil increases bradycardia risk'
      ],
      algeria_brands: [
        'Cardensiel 5mg',
        'Cardensiel 10mg'
      ],
      pharmnet: null
    },
    {
      name: 'Monicor',
      scientific_name: 'Isosorbide Mononitrate',
      category: 'Heart',
      emoji: '❤️',
      description: 'Monicor is used to prevent angina attacks by improving blood flow to the heart.',
      how_to_take: 'Take once daily in the morning.',
      side_effects: [
        'Headache',
        'Low blood pressure',
        'Dizziness'
      ],
      warnings: [
        'Rise slowly from sitting position'
      ],
      interactions: [
        'Do not combine with erectile dysfunction medications'
      ],
      algeria_brands: [
        'Monicor LP 20mg'
      ],
      pharmnet: null
    },
    {
      name: 'Tildiem',
      scientific_name: 'Diltiazem',
      category: 'Heart',
      emoji: '❤️',
      description: 'Tildiem is used for angina, hypertension, and certain heart rhythm disorders.',
      how_to_take: 'Take once or twice daily with food.',
      side_effects: [
        'Slow heartbeat',
        'Constipation',
        'Dizziness'
      ],
      warnings: [
        'Monitor heart rate regularly'
      ],
      interactions: [
        'Beta-blockers increase bradycardia risk'
      ],
      algeria_brands: [
        'Tildiem 60mg',
        'Tildiem LP 200mg'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'Liste I',
        lab: 'SANOFI SYNTHELABO',
        generic_official: 'DILTIAZEM CHLORHYDRATE',
        notice_url: 'https://pharmnet-dz.com/notice.ashx?id=49',
        pharmnet_url: 'https://pharmnet-dz.com/m-49-tildiem-60mg-comp-b-30',
        dosage_variants: [
          {
            dosage: '60MG',
            form: 'COMP',
            conditioning: 'B/30',
            ppa: '376.00 DA'
          }
        ]
      }
    },

  // ─── HYPERTENSION ──────────────────────────────────────────
    {
      name: 'Spirozide',
      scientific_name: 'Spironolactone + Hydrochlorothiazide',
      category: 'Hypertension',
      emoji: '❤️',
      description: 'Spirozide combines two diuretics to treat high blood pressure, heart failure, and fluid retention. Spironolactone also helps protect the heart.',
      how_to_take: 'Take once daily in the morning with or after breakfast. Avoid taking late in the day to prevent nighttime urination.',
      side_effects: [
        'Increased urination',
        'Dizziness',
        'Electrolyte imbalances',
        'Breast tenderness',
        'Sensitivity to sunlight'
      ],
      warnings: [
        'Monitor potassium levels',
        'Stay hydrated',
        'Rise slowly from sitting/lying to prevent dizziness',
        'Avoid potassium supplements unless prescribed'
      ],
      interactions: [
        'ACE inhibitors and ARBs — increased potassium risk',
        'NSAIDs reduce diuretic effectiveness',
        'Digoxin levels may change'
      ],
      algeria_brands: [
        'Spirozide 25mg/25mg',
        'Spirozide 50mg/50mg',
        'Aldactazine'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'Liste II',
        lab: 'BIO-GALENIC',
        generic_official: 'SPIRONOLACTONE / ALTIZIDE',
        notice_url: 'https://pharmnet-dz.com/notice.ashx?id=1484',
        pharmnet_url: 'https://pharmnet-dz.com/m-1484-spirozide-25mg-15mg-comp-pelli-sec-b-30',
        dosage_variants: [
          {
            dosage: '25MG/15MG',
            form: 'COMP. PELLI',
            conditioning: 'B/30',
            ppa: null
          }
        ]
      }
    },
    {
      name: 'Concor',
      scientific_name: 'Bisoprolol',
      category: 'Hypertension',
      emoji: '❤️',
      description: 'Concor is a cardioselective beta-blocker used to treat hypertension, stable angina, and chronic heart failure. It selectively blocks beta-1 receptors in the heart with minimal effect on the lungs.',
      how_to_take: 'Take once daily in the morning with or without food. Do not crush or chew. Do not stop suddenly.',
      side_effects: [
        'Fatigue',
        'Dizziness',
        'Cold hands and feet',
        'Slow heartbeat',
        'Sleep disturbances'
      ],
      warnings: [
        'Never stop abruptly',
        'Use with caution in asthma',
        'Masks hypoglycemia symptoms in diabetics'
      ],
      interactions: [
        'Verapamil — severe bradycardia risk',
        'Clonidine — rebound hypertension risk',
        'Digoxin — additive bradycardia'
      ],
      algeria_brands: [
        'Concor 2.5mg',
        'Concor 5mg',
        'Concor 10mg',
        'Bisoprolol Mylan'
      ],
      pharmnet: null
    },

  // ─── HEART ─────────────────────────────────────────────────
    {
      name: 'Konakion',
      scientific_name: 'Phytomenadione (Vitamin K1)',
      category: 'Heart',
      emoji: '🩸',
      description: 'Konakion is used to reverse the effects of anticoagulants like Sintrom (acenocoumarol) and warfarin, and to treat or prevent bleeding due to vitamin K deficiency.',
      how_to_take: 'Dosage determined by the doctor based on INR levels. Available as injectable and oral solution.',
      side_effects: [
        'Flushing with IV administration',
        'Rarely: allergic reactions'
      ],
      warnings: [
        'Do not alter Sintrom or warfarin dose without INR check first',
        'Inform anticoagulation clinic before taking'
      ],
      interactions: [
        'Directly reverses the effect of oral anticoagulants',
        'Antibiotics may reduce vitamin K produced by gut bacteria'
      ],
      algeria_brands: [
        'Konakion MM 10mg/mL',
        'Konakion MM Paediatric 2mg/0.2mL'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'N/D',
        lab: 'HOFFMAN LAROCHE',
        generic_official: 'PHYTOMENADIONE',
        notice_url: 'https://pharmnet-dz.com/notice.ashx?id=1744',
        pharmnet_url: 'https://pharmnet-dz.com/m-1744-konakion-mm-10mg-ml-sol-inj-iv-b-05amp-de-1ml',
        dosage_variants: [
          {
            dosage: '10MG/ML',
            form: 'SOL. INJ',
            conditioning: 'B/05AMP. DE 1ML',
            ppa: null
          }
        ]
      }
    },
    {
      name: 'Xarelto',
      scientific_name: 'Rivaroxaban',
      category: 'Heart',
      emoji: '🩸',
      description: 'Xarelto is a newer oral anticoagulant (NOAC/DOAC) used to prevent stroke in atrial fibrillation, treat blood clots, and prevent DVT after surgery. Unlike Sintrom, it does not require regular INR monitoring.',
      how_to_take: 'Take with the evening meal for atrial fibrillation (20mg). For DVT/PE treatment, take 15mg twice daily for 3 weeks, then 20mg once daily.',
      side_effects: [
        'Bleeding (the main risk)',
        'Nausea',
        'Anemia',
        'Easy bruising'
      ],
      warnings: [
        'Seek care immediately for any serious bleeding',
        'Tell all doctors and dentists you take Xarelto',
        'Avoid in severe kidney disease',
        'Do not stop without medical advice'
      ],
      interactions: [
        'NSAIDs and aspirin — increased bleeding risk',
        'Ketoconazole and ritonavir — increase drug levels',
        'Rifampicin — reduces effectiveness'
      ],
      algeria_brands: [
        'Xarelto 10mg',
        'Xarelto 15mg',
        'Xarelto 20mg'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'Liste I',
        lab: 'BAYER',
        generic_official: 'RIVAROXABAN',
        notice_url: 'https://pharmnet-dz.com/notice.ashx?id=1818',
        pharmnet_url: 'https://pharmnet-dz.com/m-1818-xarelto-10mg-comp-pelli-b-05--b-10--b-30--b-100',
        dosage_variants: [
          {
            dosage: '10MG',
            form: 'COMP. PELLI',
            conditioning: 'B/05 - B/10 - B/30 - B/100',
            ppa: null
          },
          {
            dosage: '15MG',
            form: 'COMP. PELLI',
            conditioning: 'B/14 - B/42 - B/100',
            ppa: null
          },
          {
            dosage: '20MG',
            form: 'COMP. PELLI',
            conditioning: 'B/28 - B/100',
            ppa: null
          }
        ]
      }
    },
    {
      name: 'Eliquis',
      scientific_name: 'Apixaban',
      category: 'Heart',
      emoji: '🩸',
      description: 'Eliquis is a NOAC (newer oral anticoagulant) used to prevent stroke in atrial fibrillation, treat DVT and pulmonary embolism, and prevent clots after hip or knee surgery.',
      how_to_take: 'Take twice daily (5mg) with or without food. Take at regular 12-hour intervals.',
      side_effects: [
        'Bleeding',
        'Bruising',
        'Nausea',
        'Anemia'
      ],
      warnings: [
        'Do not stop without medical advice — serious clotting risk',
        'Inform all healthcare providers before any procedures',
        'Avoid in severe liver or kidney disease'
      ],
      interactions: [
        'Strong CYP3A4/P-gp inhibitors (ketoconazole, ritonavir) increase levels',
        'Rifampicin reduces effectiveness',
        'NSAIDs — bleeding risk'
      ],
      algeria_brands: [
        'Eliquis 2.5mg',
        'Eliquis 5mg'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'Liste I',
        lab: 'PFIZER',
        generic_official: 'APIXABAN',
        notice_url: 'https://pharmnet-dz.com//notice.ashx?id=93',
        pharmnet_url: 'https://pharmnet-dz.com/m-6087-eliquis-2-5-mg-comp-pelli-b-20',
        dosage_variants: [
          {
            dosage: '2,5 MG',
            form: 'COMP',
            conditioning: 'B/20',
            ppa: null
          },
          {
            dosage: '2,5 MG',
            form: 'COMP. PELLI',
            conditioning: 'B/60',
            ppa: null
          }
        ]
      }
    },
    {
      name: 'Pradaxa',
      scientific_name: 'Dabigatran',
      category: 'Heart',
      emoji: '🩸',
      description: 'Pradaxa is a direct thrombin inhibitor anticoagulant used for stroke prevention in atrial fibrillation and treatment of venous thromboembolism.',
      how_to_take: 'Take twice daily (110mg or 150mg) with a full glass of water. Swallow whole — do not open capsules.',
      side_effects: [
        'Bleeding',
        'Nausea',
        'Dyspepsia',
        'Stomach pain'
      ],
      warnings: [
        'Do not crush or chew capsules',
        'Do not use with severe kidney disease',
        'Tell all healthcare providers',
        'A specific antidote (idarucizumab) is available for emergency reversal'
      ],
      interactions: [
        'P-gp inhibitors (amiodarone, verapamil) — increase levels',
        'Rifampicin — reduces levels',
        'NSAIDs — bleeding risk'
      ],
      algeria_brands: [
        'Pradaxa 110mg',
        'Pradaxa 150mg'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'Liste I',
        lab: 'BOEHRINGER INGELHEIM',
        generic_official: 'DABIGATRAN ETEXILATE MESILATE',
        notice_url: 'https://pharmnet-dz.com/notice.ashx?id=6036',
        pharmnet_url: 'https://pharmnet-dz.com/m-6036-pradaxa-110-mg-gelule-b-30-',
        dosage_variants: [
          {
            dosage: '110MG',
            form: 'GLES',
            conditioning: 'B/30',
            ppa: null
          },
          {
            dosage: '110MG',
            form: 'GLES',
            conditioning: 'B/60',
            ppa: null
          },
          {
            dosage: '150MG',
            form: 'GLES',
            conditioning: 'B/60',
            ppa: null
          },
          {
            dosage: '75 MG',
            form: 'GLES',
            conditioning: 'B/30',
            ppa: null
          }
        ]
      }
    },
    {
      name: 'Vastarel',
      scientific_name: 'Trimetazidine',
      category: 'Heart',
      emoji: '❤️',
      description: 'Vastarel is used as an add-on therapy for stable angina to improve myocardial energy metabolism and reduce angina frequency. Widely used in Algeria for heart disease management.',
      how_to_take: 'Take twice daily (35mg modified-release) with meals.',
      side_effects: [
        'Nausea',
        'Diarrhea',
        'Dizziness',
        'Headache',
        'Rarely: Parkinson-like symptoms in elderly'
      ],
      warnings: [
        'Not for acute angina attacks',
        'Not for Parkinson\'s disease or movement disorders',
        'Reduce dose in kidney disease'
      ],
      interactions: [
        'Few significant drug interactions'
      ],
      algeria_brands: [
        'Vastarel MR 35mg',
        'Trimetazidine Mylan'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'Liste II',
        lab: 'SERVIER',
        generic_official: 'TRIMETAZIDINE DICHLORHYDRATE',
        notice_url: 'https://pharmnet-dz.com/notice.ashx?id=1517',
        pharmnet_url: 'https://pharmnet-dz.com/m-1517-vastarel-35mg-comp-pelli-lm-b-60',
        dosage_variants: [
          {
            dosage: '35MG',
            form: 'COMP. PELLI',
            conditioning: 'B/60',
            ppa: null
          }
        ]
      }
    },
    {
      name: 'Procoralan',
      scientific_name: 'Ivabradine',
      category: 'Heart',
      emoji: '❤️',
      description: 'Procoralan slows the heart rate by a specific mechanism without affecting blood pressure. Used for chronic heart failure and angina in patients whose heart rate is too fast.',
      how_to_take: 'Take twice daily with food (morning and evening meals).',
      side_effects: [
        'Visual brightness (phosphenes — light flashing in vision)',
        'Slow heart rate',
        'Headache',
        'Dizziness',
        'Blurred vision'
      ],
      warnings: [
        'Not for use in atrial fibrillation',
        'Do not use if heart rate is below 60 bpm at rest',
        'Driving may be affected by visual side effects'
      ],
      interactions: [
        'Azithromycin and other QT-prolonging drugs',
        'CYP3A4 inhibitors (diltiazem, verapamil) increase levels',
        'Grapefruit juice increases levels'
      ],
      algeria_brands: [
        'Procoralan 5mg',
        'Procoralan 7.5mg'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'Liste I',
        lab: 'SERVIER',
        generic_official: 'IVABRADINE CHLORHYDRATE EXPRIME EN IVABRADINE',
        notice_url: 'https://pharmnet-dz.com//notice.ashx?id=93',
        pharmnet_url: 'https://pharmnet-dz.com/m-122-procoralan-5mg-comp-pelli-b-56',
        dosage_variants: [
          {
            dosage: '5MG',
            form: 'COMP. PELLI',
            conditioning: 'B/56',
            ppa: null
          },
          {
            dosage: '7,5MG',
            form: 'COMP. PELLI',
            conditioning: 'B/56',
            ppa: null
          }
        ]
      }
    },
    {
      name: 'Ezetrol',
      scientific_name: 'Ezetimibe',
      category: 'Heart',
      emoji: '💊',
      description: 'Ezetrol reduces cholesterol by blocking its absorption in the intestine. Often combined with a statin for better cholesterol control in patients with cardiovascular disease.',
      how_to_take: 'Take once daily (10mg) at any time of day, with or without food. Can be taken at the same time as a statin.',
      side_effects: [
        'Headache',
        'Stomach pain',
        'Diarrhea',
        'Fatigue',
        'Muscle pain (rare)'
      ],
      warnings: [
        'Report unusual muscle pain or weakness',
        'Monitor liver function when combined with statin',
        'Not for active liver disease'
      ],
      interactions: [
        'Bile acid sequestrants (cholestyramine) — take Ezetrol 2 hours before or 4 hours after',
        'Cyclosporine — increases ezetimibe levels'
      ],
      algeria_brands: [
        'Ezetrol 10mg',
        'Inegy (Ezetimibe + Simvastatin)'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'Liste I',
        lab: 'MERCK SCHARP & DOHME LTD',
        generic_official: 'EZETIMIBE',
        notice_url: 'https://pharmnet-dz.com/notice.ashx?id=1627',
        pharmnet_url: 'https://pharmnet-dz.com/m-1627-ezetrol-10mg-comp-b-30',
        dosage_variants: [
          {
            dosage: '10MG',
            form: 'COMP',
            conditioning: 'B/30',
            ppa: null
          }
        ]
      }
    },

  // ─── HYPERTENSION ──────────────────────────────────────────
    {
      name: 'Trandate',
      scientific_name: 'Labetalol',
      category: 'Hypertension',
      emoji: '❤️',
      description: 'Trandate is an alpha and beta-blocker used to treat hypertension, including hypertensive emergencies and high blood pressure during pregnancy (pre-eclampsia).',
      how_to_take: 'Take twice daily with food. Do not stop suddenly.',
      side_effects: [
        'Fatigue',
        'Dizziness',
        'Nausea',
        'Scalp tingling',
        'Slow heartbeat'
      ],
      warnings: [
        'Do not stop abruptly',
        'Monitor liver function with long-term use',
        'Use with caution in asthma'
      ],
      interactions: [
        'Calcium channel blockers — additive hypotension',
        'Cimetidine increases labetalol levels',
        'NSAIDs reduce effectiveness'
      ],
      algeria_brands: [
        'Trandate 200mg',
        'Labetalol injectable 5mg/mL'
      ],
      pharmnet: null
    },
    {
      name: 'Catapressan',
      scientific_name: 'Clonidine',
      category: 'Hypertension',
      emoji: '❤️',
      description: 'Catapressan is a centrally acting antihypertensive used for moderate to severe hypertension that is not controlled by other medications.',
      how_to_take: 'Take 2-3 times daily. Must never be stopped suddenly.',
      side_effects: [
        'Dry mouth (very common)',
        'Drowsiness',
        'Dizziness',
        'Constipation',
        'Depression'
      ],
      warnings: [
        'Never stop abruptly — risk of dangerous rebound hypertension',
        'Do not drive or operate machinery if drowsy',
        'Avoid alcohol'
      ],
      interactions: [
        'Beta-blockers — severe rebound hypertension if clonidine is stopped first',
        'Tricyclic antidepressants reduce effectiveness'
      ],
      algeria_brands: [
        'Catapressan 0.15mg',
        'Clonidine injectable'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'Liste II',
        lab: 'BOEHRINGER INGELHEIM',
        generic_official: 'CLONIDINE',
        notice_url: 'https://pharmnet-dz.com/notice.ashx?id=144',
        pharmnet_url: 'https://pharmnet-dz.com/m-144-catapressan-0-15mg-comp-b-20',
        dosage_variants: [
          {
            dosage: '0,15MG',
            form: 'COMP',
            conditioning: 'B/20',
            ppa: null
          },
          {
            dosage: '0,15MG/ML',
            form: 'SOL. INJ',
            conditioning: 'B/30',
            ppa: null
          }
        ]
      }
    },
    {
      name: 'Tritace',
      scientific_name: 'Ramipril',
      category: 'Hypertension',
      emoji: '❤️',
      description: 'Tritace is an ACE inhibitor used for hypertension, heart failure, and kidney protection in diabetic patients. It is also used to reduce the risk of heart attack and stroke in high-risk patients.',
      how_to_take: 'Take once daily with or without food, at the same time each day.',
      side_effects: [
        'Dry cough',
        'Dizziness',
        'Headache',
        'Fatigue',
        'Elevated potassium'
      ],
      warnings: [
        'Not safe in pregnancy',
        'Stop immediately if you develop facial swelling or throat tightness (angioedema)',
        'Monitor potassium and kidney function'
      ],
      interactions: [
        'NSAIDs reduce effectiveness and increase kidney risk',
        'Potassium-sparing diuretics — hyperkalemia',
        'Lithium — toxicity risk'
      ],
      algeria_brands: [
        'Tritace 2.5mg',
        'Tritace 5mg',
        'Tritace 10mg',
        'Ramipril Mylan'
      ],
      pharmnet: null
    },
    {
      name: 'Lisinopril',
      scientific_name: 'Lisinopril',
      category: 'Hypertension',
      emoji: '❤️',
      description: 'Lisinopril is an ACE inhibitor used for hypertension, heart failure, and after heart attack. It helps relax blood vessels and reduce the workload on the heart.',
      how_to_take: 'Take once daily with or without food.',
      side_effects: [
        'Dry cough',
        'Dizziness',
        'Headache',
        'Fatigue',
        'Hyperkalemia'
      ],
      warnings: [
        'Not safe in pregnancy',
        'Monitor kidney function and potassium',
        'Report any swelling of face or throat immediately'
      ],
      interactions: [
        'NSAIDs reduce effectiveness',
        'Potassium supplements — hyperkalemia risk',
        'Lithium — toxicity risk'
      ],
      algeria_brands: [
        'Lisinopril 5mg',
        'Lisinopril 10mg',
        'Lisinopril 20mg',
        'Zestril'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'Liste II',
        lab: 'PHARMALLIANCE',
        generic_official: 'ESOMEPRAZOLE MAGNESIUM TRIHYDRATE EXPRIME EN ESOMEPRAZOLE',
        notice_url: null,
        pharmnet_url: 'https://pharmnet-dz.com/m-3883-lisinox-20mg-comp-pelli-gastroresist-b-07--b-14--b-28',
        dosage_variants: [
          {
            dosage: '20MG',
            form: 'GLES. A MICROG. GASTRORESIST',
            conditioning: 'B/07 - B/14 - B/28',
            ppa: '600.00 DA'
          },
          {
            dosage: '40MG',
            form: 'COMP. PELLI',
            conditioning: 'B/07 - B/14 - B/28',
            ppa: null
          }
        ]
      }
    },
    {
      name: 'Lercan',
      scientific_name: 'Lercanidipine',
      category: 'Hypertension',
      emoji: '❤️',
      description: 'Lercan is a third-generation calcium channel blocker for hypertension that causes less ankle swelling than older calcium channel blockers.',
      how_to_take: 'Take once daily, 15 minutes before a meal. Do not take with grapefruit juice.',
      side_effects: [
        'Headache',
        'Flushing',
        'Ankle swelling (less than older CCBs)',
        'Palpitations',
        'Dizziness'
      ],
      warnings: [
        'Not for unstable angina',
        'Avoid grapefruit',
        'Do not use in severe liver or kidney disease'
      ],
      interactions: [
        'Cyclosporine — mutual increase in levels',
        'CYP3A4 inhibitors (ketoconazole) increase lercanidipine levels',
        'Rifampicin reduces effectiveness'
      ],
      algeria_brands: [
        'Lercan 10mg',
        'Lercan 20mg',
        'Zanidip 10mg'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'Liste I',
        lab: 'NOVAPHARM TRADING',
        generic_official: 'LERCANIDIPINE CHLORHYDRATE',
        notice_url: 'https://pharmnet-dz.com//notice.ashx?id=93',
        pharmnet_url: 'https://pharmnet-dz.com/m-5755-lerca-10mg-comp-pelli-sec-b-30-',
        dosage_variants: [
          {
            dosage: '10MG',
            form: 'COMP. PELLI',
            conditioning: 'B/30',
            ppa: null
          }
        ]
      }
    },
    {
      name: 'Hyzaar',
      scientific_name: 'Losartan + Hydrochlorothiazide',
      category: 'Hypertension',
      emoji: '❤️',
      description: 'Hyzaar combines losartan (ARB) and hydrochlorothiazide (diuretic) for patients whose blood pressure is not controlled by either medication alone.',
      how_to_take: 'Take once daily with or without food.',
      side_effects: [
        'Dizziness',
        'Fatigue',
        'Increased urination',
        'Low potassium',
        'Back pain'
      ],
      warnings: [
        'Not safe in pregnancy',
        'Monitor kidney function and electrolytes',
        'Stay hydrated in hot weather'
      ],
      interactions: [
        'NSAIDs reduce effectiveness',
        'Lithium — toxicity risk',
        'Potassium-sparing diuretics — electrolyte imbalance'
      ],
      algeria_brands: [
        'Hyzaar 50mg/12.5mg',
        'Hyzaar 100mg/25mg'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'Liste I',
        lab: 'MSD FRANCE',
        generic_official: 'LOSARTAN POTASSIQUE /  HYDROCHLOROTHIAZIDE',
        notice_url: 'https://pharmnet-dz.com//notice.ashx?id=93',
        pharmnet_url: 'https://pharmnet-dz.com/m-5753-hyzaar-50mg-12-5mg-comp-b-28',
        dosage_variants: [
          {
            dosage: '50MG/12,5MG',
            form: 'COMP',
            conditioning: 'B/28',
            ppa: null
          }
        ]
      }
    },
    {
      name: 'Exforge',
      scientific_name: 'Amlodipine + Valsartan',
      category: 'Hypertension',
      emoji: '❤️',
      description: 'Exforge is a fixed-dose combination of amlodipine (calcium channel blocker) and valsartan (ARB) for patients who need two medications to control blood pressure.',
      how_to_take: 'Take once daily with or without food.',
      side_effects: [
        'Ankle swelling',
        'Headache',
        'Dizziness',
        'Fatigue',
        'Flushing'
      ],
      warnings: [
        'Not safe in pregnancy',
        'Monitor kidney function and potassium',
        'Avoid grapefruit juice'
      ],
      interactions: [
        'NSAIDs reduce effectiveness',
        'CYP3A4 inhibitors increase amlodipine levels',
        'Potassium-sparing diuretics — hyperkalemia'
      ],
      algeria_brands: [
        'Exforge 5mg/80mg',
        'Exforge 5mg/160mg',
        'Exforge 10mg/160mg'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'Liste I',
        lab: 'NOVARTIS',
        generic_official: 'AMLODIPINE BESILATE EXPRIME EN AMLODIPINE / VALSARTAN',
        notice_url: 'https://pharmnet-dz.com/notice.ashx?id=3198',
        pharmnet_url: 'https://pharmnet-dz.com/m-3198-exforge-10mg-160mg-comp-pelli-b-28',
        dosage_variants: [
          {
            dosage: '10MG/160MG',
            form: 'COMP. PELLI',
            conditioning: 'B/28',
            ppa: '1400.00 DA'
          },
          {
            dosage: '5MG/160MG',
            form: 'COMP. PELLI',
            conditioning: 'B/28',
            ppa: '1718.00 DA'
          },
          {
            dosage: '5MG/80MG',
            form: 'COMP. PELLI',
            conditioning: 'B/28',
            ppa: '1400.00 DA'
          }
        ]
      }
    },
    {
      name: 'Atacand',
      scientific_name: 'Candesartan',
      category: 'Hypertension',
      emoji: '❤️',
      description: 'Atacand is an ARB used to treat hypertension and heart failure. It also reduces the risk of cardiovascular events in heart failure patients.',
      how_to_take: 'Take once daily (4-32mg) with or without food.',
      side_effects: [
        'Dizziness',
        'Headache',
        'Respiratory infections',
        'Back pain'
      ],
      warnings: [
        'Not safe in pregnancy',
        'Monitor kidney function and potassium',
        'Can cause low blood pressure with first dose'
      ],
      interactions: [
        'NSAIDs reduce effectiveness',
        'Potassium-sparing diuretics — hyperkalemia',
        'Lithium — toxicity risk'
      ],
      algeria_brands: [
        'Atacand 4mg',
        'Atacand 8mg',
        'Atacand 16mg',
        'Atacand 32mg'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'Liste I',
        lab: 'ASTRAZENECA',
        generic_official: 'CANDESARTAN CILEXETIL',
        notice_url: 'https://pharmnet-dz.com//notice.ashx?id=93',
        pharmnet_url: 'https://pharmnet-dz.com/m-6095-atacand-16mg-comp-sec--b-30-',
        dosage_variants: [
          {
            dosage: '16 MG',
            form: 'COMP SEC',
            conditioning: 'B/30',
            ppa: null
          },
          {
            dosage: '4MG',
            form: 'COMP. SEC',
            conditioning: 'B/28',
            ppa: null
          },
          {
            dosage: '8MG',
            form: 'COMP. SEC',
            conditioning: 'B/30',
            ppa: null
          }
        ]
      }
    },

  // ─── HEART ─────────────────────────────────────────────────
    {
      name: 'Isoptine',
      scientific_name: 'Verapamil',
      category: 'Heart',
      emoji: '❤️',
      description: 'Isoptine is a calcium channel blocker used for supraventricular tachycardia, angina, and hypertension. It slows the heart rate and is often used for atrial fibrillation rate control.',
      how_to_take: 'Take 2-3 times daily with food. Extended-release forms taken once daily.',
      side_effects: [
        'Constipation (very common)',
        'Nausea',
        'Slow heartbeat',
        'Dizziness',
        'Headache'
      ],
      warnings: [
        'Do not combine with beta-blockers without specialist guidance',
        'Do not use in heart failure with reduced ejection fraction',
        'Do not stop suddenly'
      ],
      interactions: [
        'Beta-blockers — risk of heart block and severe bradycardia',
        'Digoxin — increases digoxin levels',
        'Simvastatin — limit statin dose',
        'Carbamazepine — increases carbamazepine levels'
      ],
      algeria_brands: [
        'Isoptine 40mg',
        'Isoptine 120mg',
        'Isoptine SR 240mg'
      ],
      pharmnet: null
    },
    {
      name: 'Previscan',
      scientific_name: 'Fluindione',
      category: 'Heart',
      emoji: '🩸',
      description: 'Previscan is an oral anticoagulant (vitamin K antagonist) used in Algeria as an alternative to Sintrom for atrial fibrillation, DVT, and pulmonary embolism. Like Sintrom, it requires regular INR monitoring.',
      how_to_take: 'Take once daily, preferably in the evening. Regular INR monitoring is mandatory.',
      side_effects: [
        'Bleeding',
        'Easy bruising',
        'Nosebleeds',
        'Skin reactions (specific to fluindione)'
      ],
      warnings: [
        'Regular INR monitoring mandatory',
        'Many food and drug interactions',
        'Inform all healthcare providers',
        'Seek emergency care for serious bleeding'
      ],
      interactions: [
        'NSAIDs and aspirin — greatly increased bleeding risk',
        'Many antibiotics increase anticoagulant effect',
        'Vitamin K foods reduce effect'
      ],
      algeria_brands: [
        'Previscan 20mg'
      ],
      pharmnet: null
    },
    {
      name: 'Nicorandil',
      scientific_name: 'Nicorandil',
      category: 'Heart',
      emoji: '❤️',
      description: 'Nicorandil is an antianginal medication used for prevention and long-term treatment of angina. It has a dual mechanism of action unlike nitrates.',
      how_to_take: 'Take twice daily with or without food. Starting dose usually 5-10mg twice daily.',
      side_effects: [
        'Headache (very common, usually settles)',
        'Flushing',
        'Nausea',
        'Dizziness',
        'Rarely: oral/anal ulcers'
      ],
      warnings: [
        'Report any oral ulcers, unusual pain, or skin sores',
        'Do not combine with erectile dysfunction medications (PDE5 inhibitors)',
        'Low blood pressure risk'
      ],
      interactions: [
        'PDE5 inhibitors (sildenafil) — severe hypotension',
        'Other antihypertensives — additive hypotension'
      ],
      algeria_brands: [
        'Nicorandil 5mg',
        'Nicorandil 10mg',
        'Ikorel 10mg'
      ],
      pharmnet: null
    },

  // ─── THYROID ───────────────────────────────────────────────
    {
      name: 'Levothyrox',
      scientific_name: 'Levothyroxine Sodium',
      category: 'Thyroid',
      emoji: '🦋',
      description: 'Levothyrox replaces the thyroid hormone that your thyroid gland cannot produce enough of. Used for hypothyroidism (underactive thyroid). Must be taken consistently every day.',
      how_to_take: 'Take on an empty stomach, 30-60 minutes before breakfast. Take at the same time every morning. Do not skip doses.',
      side_effects: [
        'At correct dose: usually none',
        'If dose too high: rapid heartbeat, weight loss, anxiety, sweating, insomnia'
      ],
      warnings: [
        'Very important to take every single day',
        'Never change brand without telling your doctor',
        'Many foods and medications interfere with absorption',
        'Regular blood tests (TSH) are essential'
      ],
      interactions: [
        'Calcium supplements — take 4 hours apart',
        'Iron supplements — take 4 hours apart',
        'Antacids — take 4 hours apart',
        'Certain diabetes medications may need dose adjustment'
      ],
      algeria_brands: [
        'Levothyrox 25mcg',
        'Levothyrox 50mcg',
        'Levothyrox 75mcg',
        'Levothyrox 100mcg',
        'Levothyrox 125mcg',
        'Levothyrox 150mcg'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'Liste II',
        lab: 'MERCK SANTE S.A.S',
        generic_official: 'LEVOTHYROXINE  SODIQUE',
        notice_url: 'https://pharmnet-dz.com/notice.ashx?id=3806',
        pharmnet_url: 'https://pharmnet-dz.com/m-3806-levothyrox-100Âµg-comp-sec-b-30',
        dosage_variants: [
          {
            dosage: '100ÂµG',
            form: 'COMP. SEC',
            conditioning: 'B/30',
            ppa: null
          },
          {
            dosage: '25ÂµG',
            form: 'COMP. SEC',
            conditioning: 'B/30',
            ppa: null
          },
          {
            dosage: '50ÂµG',
            form: 'COMP. SEC',
            conditioning: 'B/30',
            ppa: null
          },
          {
            dosage: '75ÂµG',
            form: 'COMP. SEC',
            conditioning: 'B/30',
            ppa: null
          }
        ]
      }
    },
    {
      name: 'Thyrozol',
      scientific_name: 'Thiamazole (Methimazole)',
      category: 'Thyroid',
      emoji: '🦋',
      description: 'Thyrozol is used to treat hyperthyroidism (overactive thyroid). It reduces the amount of thyroid hormone produced by the thyroid gland.',
      how_to_take: 'Take at regular intervals throughout the day. Take with food to reduce stomach upset.',
      side_effects: [
        'Nausea',
        'Headache',
        'Skin rash or itching',
        'Joint pain',
        'Rarely: agranulocytosis (low white blood cells)'
      ],
      warnings: [
        'Seek immediate care if you develop fever, sore throat, or mouth ulcers — may indicate agranulocytosis',
        'Regular blood tests needed',
        'Not for use in first trimester of pregnancy'
      ],
      interactions: [
        'Warfarin — may increase anticoagulant effect',
        'Beta-blockers used with it for symptom control'
      ],
      algeria_brands: [
        'Thyrozol 5mg',
        'Thyrozol 10mg',
        'Thyrozol 20mg'
      ],
      pharmnet: null
    },
    {
      name: 'Néomercazole',
      scientific_name: 'Carbimazole',
      category: 'Thyroid',
      emoji: '🦋',
      description: 'Néomercazole is used to treat hyperthyroidism (overactive thyroid). It works by blocking the production of thyroid hormones. Very commonly used in Algeria as an alternative to Thyrozol.',
      how_to_take: 'Take at evenly spaced intervals throughout the day. Take with food. Doses are gradually reduced as thyroid levels normalize.',
      side_effects: [
        'Nausea',
        'Skin rash',
        'Joint pain',
        'Hair thinning',
        'Rarely: dangerous drop in white blood cells'
      ],
      warnings: [
        'Seek urgent medical care for fever, sore throat, or mouth ulcers',
        'Regular blood counts required',
        'Not recommended in first trimester of pregnancy',
        'Report any yellowing of skin or eyes'
      ],
      interactions: [
        'Warfarin — increased anticoagulant effect',
        'Theophylline — levels may change as thyroid function normalizes'
      ],
      algeria_brands: [
        'Néomercazole 5mg',
        'Néomercazole 20mg',
        'Carbimazole Mylan'
      ],
      pharmnet: null
    },
    {
      name: 'Basdène',
      scientific_name: 'Benzylthiouracil',
      category: 'Thyroid',
      emoji: '🦋',
      description: 'Basdène is used to treat hyperthyroidism by reducing thyroid hormone production.',
      how_to_take: 'Take regularly with meals.',
      side_effects: [
        'Skin rash',
        'Joint pain',
        'Nausea'
      ],
      warnings: [
        'Seek medical help for fever or sore throat'
      ],
      interactions: [
        'Warfarin effect may increase'
      ],
      algeria_brands: [
        'Basdène 25mg'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'Liste I',
        lab: 'BOUCHARA-RECORDATI',
        generic_official: 'BENZYLTHIOURACILE',
        notice_url: 'https://pharmnet-dz.com/notice.ashx?id=620',
        pharmnet_url: 'https://pharmnet-dz.com/m-620-basdene-25mg-comp-b-50',
        dosage_variants: [
          {
            dosage: '25MG',
            form: 'COMP',
            conditioning: 'B/50',
            ppa: null
          }
        ]
      }
    },
    {
      name: 'Propylex',
      scientific_name: 'Propylthiouracil',
      category: 'Thyroid',
      emoji: '🦋',
      description: 'Propylex is used for hyperthyroidism and thyroid storm management.',
      how_to_take: 'Take several times daily with food.',
      side_effects: [
        'Nausea',
        'Skin rash',
        'Joint pain'
      ],
      warnings: [
        'Monitor liver function regularly'
      ],
      interactions: [
        'Warfarin anticoagulant effect may increase'
      ],
      algeria_brands: [
        'Propylex 50mg'
      ],
      pharmnet: null
    },
    {
      name: 'L-Thyroxine',
      scientific_name: 'Levothyroxine (alternative brand)',
      category: 'Thyroid',
      emoji: '🦋',
      description: 'L-Thyroxine is another brand of levothyroxine for hypothyroidism management. It is bioequivalent to Levothyrox but patients should be consistent in using one brand.',
      how_to_take: 'Take on an empty stomach 30-60 minutes before breakfast, at the same time each day.',
      side_effects: [
        'At correct dose: none expected',
        'If overdosed: palpitations, sweating, weight loss, insomnia'
      ],
      warnings: [
        'Do not switch brands without informing your doctor — TSH monitoring needed after any change',
        'Take 4 hours apart from calcium, iron, and antacids'
      ],
      interactions: [
        'Calcium, iron, antacids — all reduce absorption',
        'Cholestyramine — greatly reduces absorption'
      ],
      algeria_brands: [
        'L-Thyroxine Serb 25mcg',
        'L-Thyroxine Serb 50mcg',
        'L-Thyroxine Serb 100mcg',
        'L-Thyroxine Serb 150mcg'
      ],
      pharmnet: null
    },
    {
      name: 'Iode 131',
      scientific_name: 'Radioactive Iodine (I-131)',
      category: 'Thyroid',
      emoji: '🦋',
      description: 'Radioactive iodine is used to permanently reduce thyroid activity in Graves\' disease or toxic nodular goiter. It destroys overactive thyroid cells selectively. Administered in specialized centers in Algeria.',
      how_to_take: 'Taken as a single oral capsule or liquid dose in a specialist nuclear medicine center. Isolation precautions required after administration.',
      side_effects: [
        'Hypothyroidism (usually requires lifelong Levothyrox afterward)',
        'Neck tenderness',
        'Temporary worsening of symptoms'
      ],
      warnings: [
        'Not safe in pregnancy or breastfeeding',
        'Avoid close contact with children and pregnant women for several days after treatment',
        'May worsen eye disease in Graves\' ophthalmopathy'
      ],
      interactions: [
        'Antithyroid drugs (Neomercazole) must be stopped before treatment',
        'High iodine intake reduces effectiveness'
      ],
      algeria_brands: [
        'I-131 (administered in nuclear medicine departments at CHU Algiers, Oran, Constantine)'
      ],
      pharmnet: null
    },

  // ─── RESPIRATORY ───────────────────────────────────────────
    {
      name: 'Ventoline',
      scientific_name: 'Salbutamol (Albuterol)',
      category: 'Respiratory',
      emoji: '🫁',
      description: 'Ventoline is a short-acting bronchodilator (reliever inhaler) used to quickly open the airways during asthma attacks or breathing difficulties. It is the most commonly used rescue inhaler in Algeria.',
      how_to_take: 'Shake well before use. Breathe out fully, place mouthpiece in mouth, press and breathe in slowly, hold breath for 10 seconds. Usually 1-2 puffs as needed.',
      side_effects: [
        'Trembling or shaking',
        'Fast heartbeat',
        'Headache',
        'Feeling nervous',
        'Low potassium with high doses'
      ],
      warnings: [
        'Do not use more than prescribed — overuse suggests poorly controlled asthma',
        'Seek emergency care if usual dose does not relieve attack',
        'Tell doctor if you need it more than twice a week'
      ],
      interactions: [
        'Beta-blockers reduce effectiveness',
        'Other bronchodilators — additive effects',
        'Diuretics — low potassium risk'
      ],
      algeria_brands: [
        'Ventoline 100mcg inhaler',
        'Ventoline 2mg/5mL syrup',
        'Ventoline nebulizer solution',
        'Salbutamol Mylan'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'Liste I',
        lab: 'GLAXO SMITHKLINE',
        generic_official: 'SALBUTAMOL',
        notice_url: 'https://pharmnet-dz.com/notice.ashx?id=2074',
        pharmnet_url: 'https://pharmnet-dz.com/m-2074-ventoline-0-5mg-ml-sol-inj-s-c-b-6amp',
        dosage_variants: [
          {
            dosage: '0,5MG/ML',
            form: 'SOL. INJ',
            conditioning: 'B/6AMP',
            ppa: null
          },
          {
            dosage: '100ÂµG/DOSE',
            form: 'AERO',
            conditioning: 'FL/200DOSES',
            ppa: null
          },
          {
            dosage: '2MG',
            form: 'COMP',
            conditioning: 'B/40',
            ppa: null
          },
          {
            dosage: '5MG/ML',
            form: 'AERO',
            conditioning: 'FL/10ML',
            ppa: null
          }
        ]
      }
    },
    {
      name: 'Seretide',
      scientific_name: 'Fluticasone + Salmeterol',
      category: 'Respiratory',
      emoji: '🫁',
      description: 'Seretide combines a corticosteroid (fluticasone) to reduce airway inflammation with a long-acting bronchodilator (salmeterol) to keep airways open. Used as a maintenance inhaler for asthma and COPD.',
      how_to_take: 'Use twice daily, morning and evening. Rinse mouth with water after each use to prevent oral thrush. Do not use as a rescue inhaler.',
      side_effects: [
        'Oral thrush (fungal infection in mouth)',
        'Hoarse voice',
        'Headache',
        'Throat irritation',
        'Muscle cramps'
      ],
      warnings: [
        'Never use as rescue inhaler — always have Ventoline for attacks',
        'Rinse mouth after every use',
        'Do not stop suddenly',
        'Report increased breathlessness'
      ],
      interactions: [
        'Ritonavir and ketoconazole increase fluticasone levels',
        'Beta-blockers may reduce salmeterol effectiveness'
      ],
      algeria_brands: [
        'Seretide 25/50mcg Evohaler',
        'Seretide 25/125mcg',
        'Seretide 25/250mcg',
        'Seretide Diskus'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'Liste I',
        lab: 'GLAXO SMITHKLINE',
        generic_official: 'FLUTICASONE PROPIONATE / SALMETEROL XINAFOATE EXPRIME EN SALMETEROL',
        notice_url: 'https://pharmnet-dz.com/notice.ashx?id=2127',
        pharmnet_url: 'https://pharmnet-dz.com/m-2127-seretide-diskus-100Âµg-50Âµg-dose-pdre-p-inhal-f-60doses',
        dosage_variants: [
          {
            dosage: '100ÂµG/50ÂµG/DOSE',
            form: 'PDRE. INHAL',
            conditioning: 'F/60DOSES',
            ppa: null
          },
          {
            dosage: '250ÂµG/50ÂµG/DOSE',
            form: 'PDRE. INHAL',
            conditioning: 'F/60DOSES',
            ppa: null
          },
          {
            dosage: '500ÂµG/50ÂµG/DOSE',
            form: 'PDRE. INHAL',
            conditioning: 'F/60DOSES',
            ppa: '3046.00 DA'
          }
        ]
      }
    },
    {
      name: 'Symbicort',
      scientific_name: 'Budesonide + Formoterol',
      category: 'Respiratory',
      emoji: '🫁',
      description: 'Symbicort is a combination inhaler used for maintenance treatment of asthma and COPD. It contains a steroid and a long-acting bronchodilator.',
      how_to_take: 'Inhale once or twice daily as prescribed. Rinse mouth after use. Can be used as both maintenance and reliever (SMART therapy) in asthma.',
      side_effects: [
        'Oral thrush',
        'Hoarse voice',
        'Headache',
        'Throat irritation',
        'Trembling'
      ],
      warnings: [
        'Rinse mouth after every use',
        'Do not use as sole rescue inhaler unless prescribed for SMART therapy',
        'Report worsening symptoms immediately'
      ],
      interactions: [
        'Ketoconazole increases budesonide levels',
        'Beta-blockers reduce formoterol effectiveness'
      ],
      algeria_brands: [
        'Symbicort Turbuhaler 80/4.5mcg',
        'Symbicort Turbuhaler 160/4.5mcg',
        'Symbicort 320/9mcg'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'Liste I',
        lab: 'ASTRAZENECA',
        generic_official: 'BUDESONIDE / FORMOTEROL',
        notice_url: 'https://pharmnet-dz.com/notice.ashx?id=1354',
        pharmnet_url: 'https://pharmnet-dz.com/m-1354-symbicort-turbuhaler-100Âµg-6Âµg-dose-pdre-p-inhal-fl-120doses',
        dosage_variants: [
          {
            dosage: '100ÂµG/6ÂµG/DOSE',
            form: 'PDRE. INHAL',
            conditioning: 'FL./120DOSES',
            ppa: null
          },
          {
            dosage: '200ÂµG/6ÂµG/DOSE',
            form: 'PDRE. INHAL',
            conditioning: 'FL./120DOSES',
            ppa: null
          },
          {
            dosage: '400ÂµG/12ÂµG/DOSE',
            form: 'PDRE. INHAL',
            conditioning: 'FL./60DOSES',
            ppa: '3088.00 DA'
          }
        ]
      }
    },
    {
      name: 'Spiriva',
      scientific_name: 'Tiotropium',
      category: 'Respiratory',
      emoji: '🫁',
      description: 'Spiriva is a long-acting anticholinergic bronchodilator used once daily for COPD (chronic bronchitis and emphysema). It keeps the airways open throughout the day.',
      how_to_take: 'Use once daily at the same time each morning. Insert capsule into HandiHaler device and inhale. Do not swallow the capsule.',
      side_effects: [
        'Dry mouth (very common)',
        'Constipation',
        'Urinary retention',
        'Blurred vision',
        'Throat irritation'
      ],
      warnings: [
        'Do not get powder in eyes — can cause blurred vision or glaucoma',
        'Tell doctor if you have prostate or bladder problems',
        'Not for acute breathlessness — use Ventoline for attacks'
      ],
      interactions: [
        'Other anticholinergics — avoid combining',
        'Limited systemic interactions'
      ],
      algeria_brands: [
        'Spiriva HandiHaler 18mcg',
        'Spiriva Respimat 2.5mcg'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'Liste I',
        lab: 'BOEHRINGER INGELHEIM',
        generic_official: 'TIOTROPIUM BROMURE MONOHYDRATE EXPRIME EN TIOTROPIUM',
        notice_url: 'https://pharmnet-dz.com//notice.ashx?id=6011',
        pharmnet_url: 'https://pharmnet-dz.com/m-2141-spiriva-18Âµg-pdre-p-inhalation-en-gles-b-30-et-b-30-inhalateur-handihaler-',
        dosage_variants: [
          {
            dosage: '18ÂµG',
            form: 'PDRE. INHAL',
            conditioning: 'B/30 ET B/30+INHALATEUR (HanDihaler)',
            ppa: null
          }
        ]
      }
    },
    {
      name: 'Atrovent',
      scientific_name: 'Ipratropium',
      category: 'Respiratory',
      emoji: '🫁',
      description: 'Atrovent is a bronchodilator used in COPD and chronic bronchitis to improve breathing.',
      how_to_take: 'Use inhaler regularly as prescribed.',
      side_effects: [
        'Dry mouth',
        'Cough',
        'Headache'
      ],
      warnings: [
        'Avoid spraying into eyes'
      ],
      interactions: [
        'Other anticholinergics increase side effects'
      ],
      algeria_brands: [
        'Atrovent inhaler'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'Liste I',
        lab: 'BOEHRINGER INGELHEIM',
        generic_official: 'IPRATROPIUM BROMURE',
        notice_url: 'https://pharmnet-dz.com/notice.ashx?id=2104',
        pharmnet_url: 'https://pharmnet-dz.com/m-2104-atrovent-adul--0-50mg-2ml-sol-inhal-par-nebuliseur-b-10-recipients-unidoses-de-2ml',
        dosage_variants: [
          {
            dosage: '0,50MG/2ML',
            form: 'SOL. INHAL',
            conditioning: 'B/10 RECIPIENTS UNIDOSES DE  2ML',
            ppa: null
          }
        ]
      }
    },
    {
      name: 'Foster',
      scientific_name: 'Beclometasone + Formoterol',
      category: 'Respiratory',
      emoji: '🫁',
      description: 'Foster combines a corticosteroid and bronchodilator for asthma and COPD maintenance treatment.',
      how_to_take: 'Use twice daily and rinse mouth afterward.',
      side_effects: [
        'Oral thrush',
        'Hoarse voice',
        'Headache'
      ],
      warnings: [
        'Not for acute asthma attacks'
      ],
      interactions: [
        'Beta-blockers reduce effectiveness'
      ],
      algeria_brands: [
        'Foster 100/6 inhaler'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'Liste I',
        lab: 'CHIESI S.A.',
        generic_official: 'BECLOMETASONE DIPROPIONATE/ FORMOTEROL FUMARATE DIHYDRATE',
        notice_url: 'https://pharmnet-dz.com//notice.ashx?id=6011',
        pharmnet_url: 'https://pharmnet-dz.com/m-1362-foster-100Âµg-6Âµg-sol-p-inhalation-fl-120-doses',
        dosage_variants: [
          {
            dosage: '100ÂµG/6ÂµG',
            form: 'SOL. INHAL',
            conditioning: 'FL/120 DOSES',
            ppa: '3127.58 DA'
          }
        ]
      }
    },
    {
      name: 'Flixotide',
      scientific_name: 'Fluticasone',
      category: 'Respiratory',
      emoji: '🫁',
      description: 'Flixotide is an inhaled corticosteroid used to control chronic asthma inflammation.',
      how_to_take: 'Use regularly and rinse mouth after use.',
      side_effects: [
        'Oral thrush',
        'Hoarse voice',
        'Cough'
      ],
      warnings: [
        'Do not stop suddenly'
      ],
      interactions: [
        'Ketoconazole increases fluticasone levels'
      ],
      algeria_brands: [
        'Flixotide 125mcg',
        'Flixotide 250mcg'
      ],
      pharmnet: {
        refundable: null,
        prescription_list: 'Liste I',
        lab: 'GLAXO SMITHKLINE',
        generic_official: 'FLUTICASONE PROPIONATE',
        notice_url: 'https://pharmnet-dz.com/notice.ashx?id=2115',
        pharmnet_url: 'https://pharmnet-dz.com/m-2115-flixotide-125Âµg-dose-susp-inhal-buccale-fl-120doses',
        dosage_variants: [
          {
            dosage: '125ÂµG/DOSE',
            form: 'SUSP. INHAL',
            conditioning: 'FL/120DOSES',
            ppa: null
          },
          {
            dosage: '250ÂµG/DOSE',
            form: 'SUSP. INHAL',
            conditioning: 'FL/60DOSES',
            ppa: null
          },
          {
            dosage: '50ÂµG/DOSE',
            form: 'SUSP. INHAL',
            conditioning: 'FL./120DOSES',
            ppa: null
          }
        ]
      }
    },
    {
      name: 'Berodual',
      scientific_name: 'Fenoterol + Ipratropium',
      category: 'Respiratory',
      emoji: '🫁',
      description: 'Berodual combines two bronchodilators for COPD and chronic breathing problems.',
      how_to_take: 'Use as prescribed through inhaler or nebulizer.',
      side_effects: [
        'Tremors',
        'Dry mouth',
        'Fast heartbeat'
      ],
      warnings: [
        'Do not exceed prescribed doses'
      ],
      interactions: [
        'Other bronchodilators increase side effects'
      ],
      algeria_brands: [
        'Berodual inhaler',
        'Berodual nebulizer'
      ],
      pharmnet: null
    },
    {
      name: 'Bricanyl',
      scientific_name: 'Terbutaline',
      category: 'Respiratory',
      emoji: '🫁',
      description: 'Bricanyl is a short-acting beta-2 agonist bronchodilator used to relieve bronchospasm in asthma and COPD. Available as inhaler and nebulizer solution.',
      how_to_take: 'Inhale 1-2 puffs as needed for breathlessness. Nebulizer solution diluted and used 3-4 times daily if needed.',
      side_effects: [
        'Tremors',
        'Fast heartbeat',
        'Headache',
        'Nervousness',
        'Low potassium at high doses'
      ],
      warnings: [
        'Seek emergency care if relief is inadequate',
        'Do not use more frequently than prescribed'
      ],
      interactions: [
        'Beta-blockers reduce effectiveness',
        'Diuretics — low potassium risk'
      ],
      algeria_brands: [
        'Bricanyl Turbuhaler 0.5mg',
        'Bricanyl 0.5mg/mL nebulizer'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'Liste I',
        lab: 'ASTRAZENECA',
        generic_official: 'TERBUTALINE SULFATE',
        notice_url: 'https://pharmnet-dz.com/notice.ashx?id=2109',
        pharmnet_url: 'https://pharmnet-dz.com/m-2109-bricanyl-5mg-2ml-sol-p-inhal-bucc-par-nebuliseur-en-recipient-unidose-de-2ml-b-50',
        dosage_variants: [
          {
            dosage: '5MG/2ML',
            form: 'SOL. INHAL',
            conditioning: 'B/50',
            ppa: null
          },
          {
            dosage: '0,5MG/ML',
            form: 'SOL. INJ',
            conditioning: 'B/8',
            ppa: null
          }
        ]
      }
    },
    {
      name: 'Pulmicort',
      scientific_name: 'Budesonide',
      category: 'Respiratory',
      emoji: '🫁',
      description: 'Pulmicort is an inhaled corticosteroid used as a maintenance treatment to prevent asthma attacks and control airway inflammation. Available as Turbuhaler and nebulizer suspension.',
      how_to_take: 'Use once or twice daily as prescribed. Rinse mouth with water and spit after each dose.',
      side_effects: [
        'Oral thrush',
        'Hoarse voice',
        'Cough',
        'Throat irritation'
      ],
      warnings: [
        'Rinse mouth after every use',
        'Do not use as a rescue inhaler',
        'Do not stop suddenly'
      ],
      interactions: [
        'Ketoconazole and itraconazole increase budesonide blood levels'
      ],
      algeria_brands: [
        'Pulmicort Turbuhaler 100mcg',
        'Pulmicort Turbuhaler 200mcg',
        'Pulmicort 0.25mg nebulizer',
        'Pulmicort 0.5mg nebulizer'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'Liste I',
        lab: 'ASTRAZENECA',
        generic_official: 'BUDESONIDE',
        notice_url: 'https://pharmnet-dz.com/notice.ashx?id=2120',
        pharmnet_url: 'https://pharmnet-dz.com/m-2120-pulmicort-0-5mg-2ml-susp-p--inhal-par-nebuliseur-en-recipient-unidose-b-04etuis-de-05-recipients-unidoses',
        dosage_variants: [
          {
            dosage: '0,5MG/2ML',
            form: 'SUSP. INHAL',
            conditioning: 'B/04ETUIS DE 05 RECIPIENTS UNIDOSES',
            ppa: '3006.00 DA'
          },
          {
            dosage: '1MG/ 2ML',
            form: 'SUSP. INHAL',
            conditioning: 'B/04ETUIS DE 05 RECIPIENTS UNIDOSES',
            ppa: '1851.00 DA'
          }
        ]
      }
    },
    {
      name: 'Singulair',
      scientific_name: 'Montelukast',
      category: 'Respiratory',
      emoji: '🫁',
      description: 'Singulair is a leukotriene receptor antagonist used as an add-on treatment for asthma and to relieve seasonal allergic rhinitis. Often used in children and adults with both conditions.',
      how_to_take: 'Take once daily in the evening. Can be taken with or without food. Chewable tablets for children.',
      side_effects: [
        'Headache',
        'Stomach pain',
        'Thirst',
        'Rarely: sleep disturbances, mood changes, depression'
      ],
      warnings: [
        'Report any behavioral changes, depression, or mood disturbances — particularly in children',
        'Not for acute asthma attacks'
      ],
      interactions: [
        'Phenobarbital and rifampicin reduce effectiveness',
        'Few significant interactions'
      ],
      algeria_brands: [
        'Singulair 5mg (chewable)',
        'Singulair 10mg',
        'Montelukast Mylan'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'Liste I',
        lab: 'MERCK SCHARP & DOHME LTD',
        generic_official: 'MONTELUKAST SODIQUE EXPRIME EN MONTELUKAST',
        notice_url: 'https://pharmnet-dz.com/notice.ashx?id=2132',
        pharmnet_url: 'https://pharmnet-dz.com/m-2132-singulair-10mg-comp-pelli-b-28',
        dosage_variants: [
          {
            dosage: '10MG',
            form: 'COMP. PELLI',
            conditioning: 'B/28',
            ppa: null
          },
          {
            dosage: '4MG',
            form: 'COMP. A CROQ',
            conditioning: 'B/28',
            ppa: '2566.00 DA'
          },
          {
            dosage: '4MG/SACHET',
            form: 'GRLES',
            conditioning: 'B/28 SACHETS',
            ppa: null
          },
          {
            dosage: '5MG',
            form: 'COMP. A CROQ',
            conditioning: 'B/28',
            ppa: null
          }
        ]
      }
    },
    {
      name: 'Rhinathiol',
      scientific_name: 'Carbocisteine',
      category: 'Respiratory',
      emoji: '🫁',
      description: 'Rhinathiol is a mucolytic agent that reduces the viscosity of mucus in the airways, making it easier to cough up. Used for bronchitis, COPD, and respiratory infections with thick secretions.',
      how_to_take: 'Take 3 times daily with water. Syrup form available for children and adults.',
      side_effects: [
        'Nausea',
        'Stomach pain',
        'Diarrhea',
        'Skin rash (rare)'
      ],
      warnings: [
        'Not recommended for children under 2',
        'Drink plenty of fluids',
        'Consult doctor if symptoms worsen'
      ],
      interactions: [
        'Few clinically significant interactions'
      ],
      algeria_brands: [
        'Rhinathiol 5% adult syrup',
        'Rhinathiol 2% pediatric syrup',
        'Rhinathiol 375mg capsules'
      ],
      pharmnet: {
        refundable: null,
        prescription_list: 'N/D',
        lab: 'INSTITUT MEDICAL ALGERIEN',
        generic_official: 'CARBOCISTEINE',
        notice_url: 'https://pharmnet-dz.com//notice.ashx?id=6011',
        pharmnet_url: 'https://pharmnet-dz.com/m-1320-rhinathiol-adulte-0-05-sirop-fl-125ml',
        dosage_variants: [
          {
            dosage: '0.05',
            form: 'SIROP',
            conditioning: 'FL/125ML',
            ppa: '165.00 DA'
          }
        ]
      }
    },
    {
      name: 'Solmucol',
      scientific_name: 'Acetylcysteine',
      category: 'Respiratory',
      emoji: '🫁',
      description: 'Solmucol is a mucolytic agent that breaks down mucus in the airways and has antioxidant properties. Used for bronchitis, COPD, and as an antidote in paracetamol overdose (IV form).',
      how_to_take: 'Dissolve effervescent sachet or tablet in water. Take 1-3 times daily depending on the form and dose.',
      side_effects: [
        'Nausea',
        'Vomiting',
        'Stomach pain',
        'Skin rash',
        'Rarely: bronchospasm in asthmatics'
      ],
      warnings: [
        'Use with caution in asthma patients',
        'Drink plenty of fluids',
        'IV form used in hospitals for paracetamol overdose'
      ],
      interactions: [
        'Nitroglycerin — may increase hypotension and headache',
        'Do not mix with other medications in nebulizer'
      ],
      algeria_brands: [
        'Solmucol 200mg sachet',
        'Solmucol 600mg effervescent',
        'Mucomyst 200mg'
      ],
      pharmnet: {
        refundable: null,
        prescription_list: 'N/D',
        lab: 'PHARMA IVAL',
        generic_official: 'N-ACETYLCYSTEINE',
        notice_url: 'https://pharmnet-dz.com//notice.ashx?id=6011',
        pharmnet_url: 'https://pharmnet-dz.com/m-1334-solmucol-200mg-grles-sol-buv-sach-dose-b-20-',
        dosage_variants: [
          {
            dosage: '200MG',
            form: 'GRLES. SOL. BUV',
            conditioning: 'B/20',
            ppa: null
          }
        ]
      }
    },
    {
      name: 'Théophylline',
      scientific_name: 'Theophylline',
      category: 'Respiratory',
      emoji: '🫁',
      description: 'Théophylline is a bronchodilator used for COPD and asthma that is poorly controlled by inhalers. It has a narrow therapeutic range requiring blood level monitoring.',
      how_to_take: 'Take once or twice daily with food (extended-release forms). Take at the same time each day.',
      side_effects: [
        'Nausea',
        'Vomiting',
        'Headache',
        'Insomnia',
        'Rapid heartbeat',
        'Tremors'
      ],
      warnings: [
        'Regular blood level monitoring essential — toxicity risk',
        'Avoid caffeine',
        'Many drug and food interactions',
        'Seek care for vomiting, seizures, or irregular heartbeat'
      ],
      interactions: [
        'Ciprofloxacin and erythromycin increase levels significantly',
        'Smoking reduces levels',
        'Rifampicin reduces levels',
        'Carbamazepine reduces levels'
      ],
      algeria_brands: [
        'Euphyllin LP 200mg',
        'Euphyllin LP 300mg',
        'Théophylline LP Mylan'
      ],
      pharmnet: {
        refundable: null,
        prescription_list: 'N/D',
        lab: 'RENAUDIN',
        generic_official: 'THEOPHYLLINE',
        notice_url: 'https://pharmnet-dz.com//notice.ashx?id=6011',
        pharmnet_url: 'https://pharmnet-dz.com/m-2101-theophylline-240mg-4ml-sol-inj-b-05amp-de-4ml',
        dosage_variants: [
          {
            dosage: '240MG/4ML',
            form: 'SOL. INJ',
            conditioning: 'B/05AMP. DE 4ML',
            ppa: null
          }
        ]
      }
    },
    {
      name: 'Alvesco',
      scientific_name: 'Ciclesonide',
      category: 'Respiratory',
      emoji: '🫁',
      description: 'Alvesco is a newer inhaled corticosteroid for asthma maintenance treatment that is activated in the lungs, reducing systemic side effects compared to older inhaled steroids.',
      how_to_take: 'Inhale once daily (80mcg or 160mcg). Rinse mouth with water after use.',
      side_effects: [
        'Headache',
        'Throat irritation',
        'Nasopharyngitis',
        'Less oral thrush than older ICS'
      ],
      warnings: [
        'Not for acute asthma attacks',
        'Rinse mouth after use',
        'Do not stop suddenly'
      ],
      interactions: [
        'CYP3A4 inhibitors (ketoconazole) may increase systemic ciclesonide levels'
      ],
      algeria_brands: [
        'Alvesco 80mcg',
        'Alvesco 160mcg'
      ],
      pharmnet: null
    },
    {
      name: 'Onbrez',
      scientific_name: 'Indacaterol',
      category: 'Respiratory',
      emoji: '🫁',
      description: 'Onbrez is a once-daily long-acting beta-2 agonist (LABA) bronchodilator for COPD maintenance treatment. It provides 24-hour bronchodilation from a single daily dose.',
      how_to_take: 'Inhale contents of one capsule via Breezhaler device once daily at the same time each day. Do not swallow capsule.',
      side_effects: [
        'Cough on inhalation (very common, harmless)',
        'Nasopharyngitis',
        'Headache',
        'Tremors',
        'Rapid heartbeat'
      ],
      warnings: [
        'Not for asthma',
        'Not for acute bronchospasm',
        'Do not use more than once daily'
      ],
      interactions: [
        'Beta-blockers may reduce effectiveness',
        'QT-prolonging medications — caution',
        'Non-potassium sparing diuretics — hypokalemia risk'
      ],
      algeria_brands: [
        'Onbrez Breezhaler 150mcg',
        'Onbrez Breezhaler 300mcg'
      ],
      pharmnet: null
    },
    {
      name: 'Ultibro',
      scientific_name: 'Indacaterol + Glycopyrronium',
      category: 'Respiratory',
      emoji: '🫁',
      description: 'Ultibro is a once-daily dual bronchodilator combining a LABA and LAMA for COPD patients who need more bronchodilation than a single agent provides.',
      how_to_take: 'Inhale once daily via Breezhaler device. Do not swallow the capsule.',
      side_effects: [
        'Cough on inhalation',
        'Nasopharyngitis',
        'Dry mouth',
        'Headache',
        'Urinary retention (rare)'
      ],
      warnings: [
        'Not for asthma',
        'Not for acute attacks',
        'Caution in prostate or bladder problems',
        'Avoid eye contact with powder'
      ],
      interactions: [
        'Other anticholinergics — avoid combining',
        'Beta-blockers reduce LABA effectiveness'
      ],
      algeria_brands: [
        'Ultibro Breezhaler 110/50mcg'
      ],
      pharmnet: null
    },

  // ─── PAIN ──────────────────────────────────────────────────
    {
      name: 'Voltarène',
      scientific_name: 'Diclofenac',
      category: 'Pain',
      emoji: '🩹',
      description: 'Voltarène is a non-steroidal anti-inflammatory drug (NSAID) used to treat pain, inflammation, and fever. Available as tablets, injections, and topical gel.',
      how_to_take: 'Take with food or milk to protect the stomach. Voltarène Emulgel: apply to affected area 3-4 times daily and rub in gently.',
      side_effects: [
        'Stomach upset or pain',
        'Nausea',
        'Headache',
        'Dizziness',
        'Skin reactions with gel'
      ],
      warnings: [
        'Avoid if you have stomach ulcers',
        'Not for long-term use without medical supervision',
        'Avoid if you have kidney or heart problems',
        'Do not apply gel to broken skin'
      ],
      interactions: [
        'Increases risk of bleeding with aspirin or warfarin',
        'May reduce effectiveness of blood pressure medications',
        'Increases methotrexate toxicity'
      ],
      algeria_brands: [
        'Voltarène 25mg',
        'Voltarène 50mg',
        'Voltarène 75mg SR',
        'Voltarène Emulgel 1%',
        'Diclofenac Mylan'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'Liste II',
        lab: 'NOVARTIS',
        generic_official: 'DICLOFENAC SODIQUE',
        notice_url: 'https://pharmnet-dz.com//notice.ashx?id=961',
        pharmnet_url: 'https://pharmnet-dz.com/m-2715-voltarene-25mg-suppo-b-10',
        dosage_variants: [
          {
            dosage: '25MG',
            form: 'SUPPO',
            conditioning: 'B/10',
            ppa: null
          },
          {
            dosage: '100MG',
            form: 'SUPPO',
            conditioning: 'B/10',
            ppa: null
          }
        ]
      }
    },
    {
      name: 'Dolyc',
      scientific_name: 'Paracetamol + Lysine',
      category: 'Pain',
      emoji: '🩹',
      description: 'Dolyc is a combination of paracetamol and lysine used to treat mild to moderate pain and fever. Commonly used in Algeria for headaches, dental pain, and body aches.',
      how_to_take: 'Take 1 tablet every 6-8 hours as needed. Do not exceed the recommended dose. Can be taken with or without food.',
      side_effects: [
        'Rarely causes side effects at normal doses',
        'Skin rash (allergic reaction — rare)'
      ],
      warnings: [
        'Do not exceed recommended dose — liver damage risk with overdose',
        'Avoid alcohol',
        'Do not combine with other paracetamol-containing products'
      ],
      interactions: [
        'Warfarin — may slightly increase anticoagulant effect with long-term use',
        'Alcohol increases liver toxicity risk'
      ],
      algeria_brands: [
        'Dolyc 1g',
        'Dolyc 500mg'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'N/D',
        lab: 'MERINAL',
        generic_official: 'PARACETAMOL',
        notice_url: 'https://pharmnet-dz.com/notice.ashx?id=2631',
        pharmnet_url: 'https://pharmnet-dz.com/m-2631-dolyc-1g-comp-b-10',
        dosage_variants: [
          {
            dosage: '1G',
            form: 'COMP. SEC',
            conditioning: 'B/10',
            ppa: null
          },
          {
            dosage: '500MG',
            form: 'COMP',
            conditioning: 'B/20',
            ppa: null
          }
        ]
      }
    },
    {
      name: 'Spasfon',
      scientific_name: 'Phloroglucinol',
      category: 'Pain',
      emoji: '🩹',
      description: 'Spasfon is an antispasmodic used to relieve abdominal cramps and spasms of the digestive and urinary tracts. Very commonly used in Algeria.',
      how_to_take: 'Take 2 tablets up to 3 times daily. Can be taken with or without food.',
      side_effects: [
        'Very well tolerated',
        'Allergic reactions very rare'
      ],
      warnings: [
        'Inform your doctor if pregnant',
        'Not a painkiller for severe pain — see a doctor if pain is intense'
      ],
      interactions: [
        'Very few known interactions'
      ],
      algeria_brands: [
        'Spasfon 80mg',
        'Spasfon Lyoc (dissolves on tongue)'
      ],
      pharmnet: null
    },
    {
      name: 'Profenid',
      scientific_name: 'Ketoprofen',
      category: 'Pain',
      emoji: '🩹',
      description: 'Profenid is an NSAID used to treat pain and inflammation in arthritis, muscle pain, and post-surgical pain. Available in tablets, gel, and injectable forms.',
      how_to_take: 'Take with food or milk. For gel: apply to affected area 2-3 times daily and massage gently. Wash hands after applying.',
      side_effects: [
        'Stomach pain',
        'Nausea',
        'Indigestion',
        'Skin sensitivity to sunlight with gel',
        'Headache'
      ],
      warnings: [
        'Avoid prolonged sun exposure when using gel — risk of photosensitivity',
        'Avoid in stomach ulcer',
        'Not for long-term use without supervision',
        'Not safe in third trimester of pregnancy'
      ],
      interactions: [
        'Warfarin — increased bleeding risk',
        'Lithium — toxicity risk increases',
        'Diuretics — reduced effectiveness'
      ],
      algeria_brands: [
        'Profenid 100mg',
        'Profenid LP 200mg',
        'Profenid gel',
        'Profenid injectable 100mg'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'N/D',
        lab: 'SANOFI AVENTIS',
        generic_official: 'KETOPROFENE',
        notice_url: 'https://pharmnet-dz.com/notice.ashx?id=2807',
        pharmnet_url: 'https://pharmnet-dz.com/m-2807-profenid-100mg-comp-pelli-b-30',
        dosage_variants: [
          {
            dosage: '100MG',
            form: 'COMP. PELLI',
            conditioning: 'B/30',
            ppa: null
          },
          {
            dosage: '100MG',
            form: 'SUPPO',
            conditioning: 'B/12',
            ppa: null
          },
          {
            dosage: '50MG/ML (100MG/2ML)',
            form: 'SOL. INJ',
            conditioning: 'B/06 AMP. DE 2ML',
            ppa: null
          }
        ]
      }
    },
    {
      name: 'Cortancyl',
      scientific_name: 'Prednisone',
      category: 'Pain',
      emoji: '💊',
      description: 'Cortancyl is a corticosteroid (steroid) used to treat a wide range of inflammatory and autoimmune conditions including arthritis, asthma flares, allergic reactions, and inflammatory bowel disease.',
      how_to_take: 'Take in the morning with breakfast to reduce sleep disturbance. Take with food. Do not stop suddenly after prolonged use.',
      side_effects: [
        'Weight gain',
        'Increased blood sugar',
        'Mood changes',
        'Insomnia',
        'Increased appetite',
        'Weakening of bones with long-term use'
      ],
      warnings: [
        'Never stop suddenly after long-term use — gradual tapering required',
        'Monitor blood sugar especially in diabetics',
        'Avoid contact with people who have chickenpox or measles',
        'Take calcium and vitamin D supplements if on long-term treatment'
      ],
      interactions: [
        'NSAIDs — increased stomach ulcer risk',
        'Diabetes medications — may need dose adjustment',
        'Vaccines — avoid live vaccines during treatment',
        'Warfarin — increased anticoagulant effect'
      ],
      algeria_brands: [
        'Cortancyl 1mg',
        'Cortancyl 5mg',
        'Prednisone Mylan'
      ],
      pharmnet: null
    },
    {
      name: 'Celebrex',
      scientific_name: 'Celecoxib',
      category: 'Pain',
      emoji: '🩹',
      description: 'Celebrex is used for arthritis and chronic joint pain by reducing inflammation.',
      how_to_take: 'Take once or twice daily with food.',
      side_effects: [
        'Stomach pain',
        'Headache',
        'Dizziness'
      ],
      warnings: [
        'Use cautiously in heart disease'
      ],
      interactions: [
        'Warfarin increases bleeding risk'
      ],
      algeria_brands: [
        'Celebrex 100mg',
        'Celebrex 200mg'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'Liste I',
        lab: 'PFIZER PHARM ALGERIE',
        generic_official: 'CELECOXIB',
        notice_url: 'https://pharmnet-dz.com/notice.ashx?id=2808',
        pharmnet_url: 'https://pharmnet-dz.com/m-2808-celebrex-100mg-gles-b-20',
        dosage_variants: [
          {
            dosage: '100MG',
            form: 'GLES',
            conditioning: 'B/20',
            ppa: null
          },
          {
            dosage: '200MG',
            form: 'GLES',
            conditioning: 'B/10 - B/15 - B/30',
            ppa: null
          }
        ]
      }
    },
    {
      name: 'Arcoxia',
      scientific_name: 'Etoricoxib',
      category: 'Pain',
      emoji: '🩹',
      description: 'Arcoxia is an anti-inflammatory medication used for arthritis and chronic pain.',
      how_to_take: 'Take once daily with or without food.',
      side_effects: [
        'Headache',
        'Swelling',
        'Stomach pain'
      ],
      warnings: [
        'May increase blood pressure'
      ],
      interactions: [
        'Warfarin increases bleeding risk'
      ],
      algeria_brands: [
        'Arcoxia 60mg',
        'Arcoxia 90mg'
      ],
      pharmnet: null
    },
    {
      name: 'Brexin',
      scientific_name: 'Piroxicam',
      category: 'Pain',
      emoji: '🩹',
      description: 'Brexin is used to treat chronic inflammatory joint diseases and arthritis pain.',
      how_to_take: 'Take after meals.',
      side_effects: [
        'Heartburn',
        'Stomach pain',
        'Nausea'
      ],
      warnings: [
        'Risk of stomach ulcers with prolonged use'
      ],
      interactions: [
        'NSAIDs increase bleeding risk'
      ],
      algeria_brands: [
        'Brexin 20mg'
      ],
      pharmnet: null
    },
    {
      name: 'Coltramyl',
      scientific_name: 'Thiocolchicoside',
      category: 'Pain',
      emoji: '🩹',
      description: 'Coltramyl is a muscle relaxant used for painful muscle spasms.',
      how_to_take: 'Take after meals as prescribed.',
      side_effects: [
        'Drowsiness',
        'Diarrhea',
        'Weakness'
      ],
      warnings: [
        'Avoid driving if drowsy'
      ],
      interactions: [
        'Sedatives increase drowsiness'
      ],
      algeria_brands: [
        'Coltramyl 4mg'
      ],
      pharmnet: null
    },
    {
      name: 'Bi-Profénid',
      scientific_name: 'Ketoprofen (extended-release)',
      category: 'Pain',
      emoji: '🩹',
      description: 'Bi-Profénid is an extended-release form of ketoprofen NSAID providing longer-lasting anti-inflammatory and analgesic effects for arthritis, back pain, and musculoskeletal pain.',
      how_to_take: 'Take once daily with food. Swallow whole — do not crush or chew.',
      side_effects: [
        'Stomach pain',
        'Nausea',
        'Heartburn',
        'Dizziness',
        'Photosensitivity'
      ],
      warnings: [
        'Avoid prolonged sun exposure',
        'Take with food to protect the stomach',
        'Avoid in stomach ulcer, kidney failure, or severe heart disease'
      ],
      interactions: [
        'Warfarin — bleeding risk',
        'Lithium — toxicity',
        'Methotrexate — toxicity',
        'Diuretics — reduced effectiveness'
      ],
      algeria_brands: [
        'Bi-Profénid 150mg'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'Liste II',
        lab: 'SANOFI AVENTIS',
        generic_official: 'KETOPROFENE',
        notice_url: 'https://pharmnet-dz.com//notice.ashx?id=961',
        pharmnet_url: 'https://pharmnet-dz.com/m-937-biprofenid-150mg-comp-sec-b-20',
        dosage_variants: [
          {
            dosage: '150MG',
            form: 'COMP. SEC',
            conditioning: 'B/20',
            ppa: null
          }
        ]
      }
    },
    {
      name: 'Solpadol',
      scientific_name: 'Paracetamol + Codeine',
      category: 'Pain',
      emoji: '🩹',
      description: 'Solpadol combines paracetamol and codeine for moderate to moderately severe pain not controlled by paracetamol alone. Codeine is an opioid that works centrally to relieve pain.',
      how_to_take: 'Take 1-2 tablets every 4-6 hours as needed. Do not take more than 8 tablets in 24 hours.',
      side_effects: [
        'Constipation (very common)',
        'Drowsiness',
        'Nausea',
        'Dizziness',
        'Dry mouth'
      ],
      warnings: [
        'Can cause dependence with prolonged use',
        'Do not drive if drowsy',
        'Avoid alcohol',
        'Do not exceed maximum dose — liver damage risk from paracetamol component'
      ],
      interactions: [
        'Alcohol and sedatives — excessive drowsiness',
        'MAOIs — serious interactions',
        'Other paracetamol products — overdose risk'
      ],
      algeria_brands: [
        'Solpadol 500mg/30mg',
        'Efferalgan Codéine'
      ],
      pharmnet: null
    },
    {
      name: 'Tramadol',
      scientific_name: 'Tramadol',
      category: 'Pain',
      emoji: '🩹',
      description: 'Tramadol is a centrally acting opioid analgesic used for moderate to severe pain. It has a dual mechanism of action combining opioid receptor activity with serotonin/noradrenaline effects.',
      how_to_take: 'Take every 4-6 hours as needed (immediate-release) or once or twice daily (extended-release). Take with water.',
      side_effects: [
        'Nausea and vomiting (especially at start)',
        'Dizziness',
        'Constipation',
        'Drowsiness',
        'Headache',
        'Sweating'
      ],
      warnings: [
        'Can cause dependence with prolonged use',
        'Do not drive or operate machinery',
        'Avoid alcohol',
        'Risk of seizures especially with antidepressants',
        'Do not stop suddenly after long-term use'
      ],
      interactions: [
        'MAOIs — serious, potentially fatal interaction',
        'SSRIs and SNRIs — serotonin syndrome risk',
        'Carbamazepine — reduces tramadol effect',
        'Benzodiazepines — increased sedation and respiratory risk'
      ],
      algeria_brands: [
        'Tramadol 50mg capsules',
        'Contramal 100mg LP',
        'Zamudol 50mg',
        'Topalgic 50mg'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'Liste I',
        lab: 'BEKER LABORATOIRES',
        generic_official: 'TRAMADOL CHLORHYDRATE EXPRIME EN TRAMADOL',
        notice_url: 'https://pharmnet-dz.com/notice.ashx?id=5717',
        pharmnet_url: 'https://pharmnet-dz.com/m-5717-tramadol-beker-50mg-gles-b-30',
        dosage_variants: [
          {
            dosage: '50MG',
            form: 'GLES',
            conditioning: 'B/30',
            ppa: '270 DA'
          }
        ]
      }
    },
    {
      name: 'Acupan',
      scientific_name: 'Nefopam',
      category: 'Pain',
      emoji: '🩹',
      description: 'Acupan is a non-opioid centrally acting analgesic used for moderate to severe pain, particularly post-operative pain. It does not cause respiratory depression like opioids.',
      how_to_take: 'Oral: 1 tablet 3 times daily. IV: administered by healthcare professionals in a clinical setting.',
      side_effects: [
        'Nausea and vomiting',
        'Sweating',
        'Dry mouth',
        'Drowsiness',
        'Fast heartbeat',
        'Urinary retention'
      ],
      warnings: [
        'Do not use with MAOIs',
        'Use with caution in elderly and patients with urinary problems',
        'Can cause confusion in elderly'
      ],
      interactions: [
        'MAOIs — contraindicated',
        'Atropine-like drugs — additive anticholinergic effects',
        'Tricyclic antidepressants — additive effects'
      ],
      algeria_brands: [
        'Acupan 30mg tablets',
        'Acupan 20mg/mL injectable'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'Liste I',
        lab: 'BIOCODEX',
        generic_official: 'NEFOPAM CHLORHYDRATE',
        notice_url: 'https://pharmnet-dz.com/notice.ashx?id=2695',
        pharmnet_url: 'https://pharmnet-dz.com/m-2695-acupan-10mg-ml-ou-20mg-2ml-sol-inj-im-iv-b-05amp-de-2ml',
        dosage_variants: [
          {
            dosage: '10MG/ML (OU 20MG/2ML)',
            form: 'SOL. INJ',
            conditioning: 'B/05AMP. DE 2ML',
            ppa: null
          }
        ]
      }
    },
    {
      name: 'Médrol',
      scientific_name: 'Methylprednisolone',
      category: 'Pain',
      emoji: '💊',
      description: 'Médrol is a corticosteroid used for inflammatory and autoimmune conditions, severe allergic reactions, and as part of cancer treatment protocols. More potent than prednisone.',
      how_to_take: 'Take in the morning with food. Do not stop suddenly after prolonged use — taper under medical supervision.',
      side_effects: [
        'Weight gain',
        'Elevated blood sugar',
        'Mood changes',
        'Insomnia',
        'Osteoporosis with long-term use',
        'Susceptibility to infections'
      ],
      warnings: [
        'Never stop abruptly after extended use',
        'Monitor blood sugar in diabetics',
        'Take with calcium and vitamin D if prescribed long-term',
        'Avoid live vaccines during treatment'
      ],
      interactions: [
        'NSAIDs — stomach ulcer risk',
        'Warfarin — anticoagulant effect altered',
        'Diabetes medications — dose adjustment needed',
        'Rifampicin — reduces steroid effect'
      ],
      algeria_brands: [
        'Médrol 4mg',
        'Médrol 16mg',
        'Depo-Médrol injectable 40mg/mL',
        'Solu-Médrol injectable'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'Liste I',
        lab: 'PHARMACIA UPJOHN',
        generic_official: 'METHYLPREDNISOLONE',
        notice_url: 'https://pharmnet-dz.com/notice.ashx?id=3761',
        pharmnet_url: 'https://pharmnet-dz.com/m-3761-medrol-16mg-comp-b-20',
        dosage_variants: [
          {
            dosage: '16MG',
            form: 'COMP',
            conditioning: 'B/20',
            ppa: null
          },
          {
            dosage: '4MG',
            form: 'COMP',
            conditioning: 'B/30',
            ppa: null
          }
        ]
      }
    },
    {
      name: 'Hydrocortisone',
      scientific_name: 'Hydrocortisone',
      category: 'Pain',
      emoji: '💊',
      description: 'Hydrocortisone is used to treat adrenal insufficiency (Addison\'s disease), as well as inflammatory and autoimmune conditions. It is the natural stress hormone of the body.',
      how_to_take: 'Take 2-3 times daily simulating the body\'s natural cortisol pattern (higher dose in morning, lower in evening). Take with food.',
      side_effects: [
        'Weight gain',
        'Elevated blood sugar',
        'Mood changes',
        'Insomnia',
        'Sodium retention',
        'Fluid retention'
      ],
      warnings: [
        'Never stop suddenly if used for adrenal insufficiency — can be life-threatening',
        'Increase dose during illness, surgery, or stress',
        'Carry medical alert card or bracelet'
      ],
      interactions: [
        'Rifampicin and phenytoin — reduce corticosteroid effect',
        'NSAIDs — stomach ulcer risk',
        'Warfarin — altered anticoagulant effect'
      ],
      algeria_brands: [
        'Hydrocortisone 10mg',
        'Hydrocortisone 20mg',
        'Solu-Cortef injectable 100mg/250mg/500mg'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'Liste I',
        lab: 'SANOFI AVENTIS',
        generic_official: 'HYDROCORTISONE',
        notice_url: 'https://pharmnet-dz.com/notice.ashx?id=653',
        pharmnet_url: 'https://pharmnet-dz.com/m-653-hydrocortisone-roussel-10mg-comp-b-25-',
        dosage_variants: [
          {
            dosage: '10MG',
            form: 'COMP SEC',
            conditioning: 'B/25',
            ppa: null
          }
        ]
      }
    },
    {
      name: 'Dexamethasone',
      scientific_name: 'Dexamethasone',
      category: 'Pain',
      emoji: '💊',
      description: 'Dexamethasone is a potent corticosteroid used for severe allergic reactions, inflammation, autoimmune conditions, cerebral edema, and certain cancers. Frequently used in hospitals in Algeria.',
      how_to_take: 'Oral: take in the morning with food. Injectable: given by healthcare professionals. Dose varies significantly by indication.',
      side_effects: [
        'Elevated blood sugar',
        'Fluid retention',
        'Mood changes',
        'Insomnia',
        'Increased infection risk',
        'Osteoporosis'
      ],
      warnings: [
        'Never stop abruptly after prolonged use',
        'Monitor blood sugar carefully',
        'Avoid live vaccines during treatment',
        'Report any signs of infection promptly'
      ],
      interactions: [
        'Rifampicin — greatly reduces dexamethasone effect',
        'Warfarin — altered anticoagulant effect',
        'Diabetes medications — dose adjustment needed',
        'NSAIDs — stomach ulcer risk'
      ],
      algeria_brands: [
        'Dexamethasone 0.5mg',
        'Dexamethasone injectable 4mg/mL',
        'Soludécadron injectable'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'Liste I',
        lab: 'RENAUDIN',
        generic_official: 'DEXAMETHASONE (PHOSPHATE)',
        notice_url: 'https://pharmnet-dz.com//notice.ashx?id=668',
        pharmnet_url: 'https://pharmnet-dz.com/m-643-dexamethasone-20mg-sol-inj-b-5',
        dosage_variants: [
          {
            dosage: '20MG',
            form: 'SOL. INJ',
            conditioning: 'B/5',
            ppa: null
          }
        ]
      }
    },
    {
      name: 'Lyrica',
      scientific_name: 'Pregabalin',
      category: 'Pain',
      emoji: '💊',
      description: 'Lyrica is used for neuropathic pain (nerve pain from diabetes, shingles, spinal cord injury), fibromyalgia, and as an add-on treatment for epilepsy. Also used for generalized anxiety disorder.',
      how_to_take: 'Take 2-3 times daily with or without food. Start at low dose and gradually increase.',
      side_effects: [
        'Drowsiness (very common)',
        'Dizziness',
        'Weight gain',
        'Blurred vision',
        'Swelling in hands and feet',
        'Dry mouth'
      ],
      warnings: [
        'Do not drive until you know how it affects you',
        'Do not stop suddenly — taper gradually',
        'Avoid alcohol',
        'Can cause dependence — use only as prescribed'
      ],
      interactions: [
        'Opioids — increased CNS depression and respiratory risk',
        'Benzodiazepines — increased sedation',
        'Alcohol — additive sedation'
      ],
      algeria_brands: [
        'Lyrica 25mg',
        'Lyrica 75mg',
        'Lyrica 150mg',
        'Lyrica 300mg',
        'Prégabaline Mylan'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'Liste I',
        lab: 'PFIZER LIMITED',
        generic_official: 'PREGABALINE',
        notice_url: 'https://pharmnet-dz.com/notice.ashx?id=2413',
        pharmnet_url: 'https://pharmnet-dz.com/m-2413-lyrica-25mg-gles-b-56',
        dosage_variants: [
          {
            dosage: '25MG',
            form: 'GLES',
            conditioning: 'B/56',
            ppa: null
          },
          {
            dosage: '300MG',
            form: 'GLES',
            conditioning: 'B/56',
            ppa: null
          },
          {
            dosage: '50MG',
            form: 'GLES',
            conditioning: 'B/56',
            ppa: null
          }
        ]
      }
    },
    {
      name: 'Neurontin',
      scientific_name: 'Gabapentin',
      category: 'Pain',
      emoji: '💊',
      description: 'Neurontin is used for neuropathic pain (diabetic neuropathy, postherpetic neuralgia) and as an adjunct for epilepsy. It reduces abnormal electrical activity in nerves.',
      how_to_take: 'Take 3 times daily with or without food. Doses are gradually increased over several weeks.',
      side_effects: [
        'Drowsiness',
        'Dizziness',
        'Fatigue',
        'Weight gain',
        'Swelling',
        'Blurred vision'
      ],
      warnings: [
        'Do not drive until you know how it affects you',
        'Do not stop suddenly — gradually reduce',
        'Monitor mood changes',
        'Dose reduction needed for kidney disease'
      ],
      interactions: [
        'Opioids and benzodiazepines — increased sedation',
        'Antacids — reduce absorption (take 2 hours apart)',
        'Alcohol — increased sedation'
      ],
      algeria_brands: [
        'Neurontin 100mg',
        'Neurontin 300mg',
        'Neurontin 400mg',
        'Gabapentine Mylan'
      ],
      pharmnet: null
    },
    {
      name: 'Colchicine',
      scientific_name: 'Colchicine',
      category: 'Pain',
      emoji: '🩹',
      description: 'Colchicine is used to treat acute gout attacks and to prevent gout flares. It works by reducing inflammation caused by uric acid crystal deposits in joints.',
      how_to_take: 'For acute gout: 1mg immediately then 0.5mg one hour later. For prevention: 0.5mg once or twice daily.',
      side_effects: [
        'Nausea and vomiting (very common)',
        'Diarrhea',
        'Abdominal pain',
        'Muscle weakness (with long-term use)',
        'Bone marrow suppression (rare)'
      ],
      warnings: [
        'Do not exceed recommended dose — toxicity risk',
        'Dose reduction in kidney or liver disease',
        'Watch for muscle weakness or pain',
        'Seek care if severe vomiting or diarrhea'
      ],
      interactions: [
        'Clarithromycin and statins — increase colchicine toxicity risk significantly',
        'Ciclosporin — increased toxicity',
        'P-gp inhibitors increase levels'
      ],
      algeria_brands: [
        'Colchicine 1mg',
        'Colchicine 0.5mg'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'Liste I',
        lab: 'GALENIQUES VERNIN',
        generic_official: 'COLCHICINE CRISTALISEE',
        notice_url: 'https://pharmnet-dz.com/notice.ashx?id=1402',
        pharmnet_url: 'https://pharmnet-dz.com/m-1402-colchicine-opocalcium-1mg-comp-b-20',
        dosage_variants: [
          {
            dosage: '1MG',
            form: 'COMP',
            conditioning: 'B/20',
            ppa: null
          }
        ]
      }
    },
    {
      name: 'Allopurinol',
      scientific_name: 'Allopurinol',
      category: 'Pain',
      emoji: '🩹',
      description: 'Allopurinol is used for long-term prevention of gout attacks and kidney stones caused by high uric acid levels. It lowers uric acid production in the body.',
      how_to_take: 'Take once daily after a meal with plenty of water. Start at low dose and increase gradually.',
      side_effects: [
        'Skin rash (stop immediately and see doctor)',
        'Nausea',
        'Diarrhea',
        'Drowsiness',
        'Headache'
      ],
      warnings: [
        'Stop immediately if you develop skin rash — risk of severe Stevens-Johnson syndrome',
        'Drink at least 2 liters of water daily',
        'Do not start during acute gout attack',
        'Dose reduction needed for kidney disease'
      ],
      interactions: [
        'Azathioprine and mercaptopurine — serious toxicity — avoid or reduce dose significantly',
        'Warfarin — increased anticoagulant effect',
        'Ampicillin/amoxicillin — increased rash risk'
      ],
      algeria_brands: [
        'Allopurinol 100mg',
        'Allopurinol 300mg',
        'Zyloric 100mg',
        'Zyloric 300mg'
      ],
      pharmnet: null
    },
    {
      name: 'Féburic',
      scientific_name: 'Febuxostat',
      category: 'Pain',
      emoji: '🩹',
      description: 'Féburic is a newer xanthine oxidase inhibitor used to reduce uric acid levels in gout. An alternative to allopurinol, particularly for patients who cannot tolerate allopurinol.',
      how_to_take: 'Take once daily (80mg or 120mg) with or without food.',
      side_effects: [
        'Gout flares at start of treatment (normal)',
        'Nausea',
        'Diarrhea',
        'Joint pain',
        'Headache',
        'Liver enzyme elevation'
      ],
      warnings: [
        'Use colchicine or NSAIDs to prevent flares when starting treatment',
        'Monitor liver function',
        'Caution in cardiovascular disease'
      ],
      interactions: [
        'Azathioprine and mercaptopurine — avoid combination',
        'Theophylline — may increase theophylline levels'
      ],
      algeria_brands: [
        'Féburic 80mg',
        'Féburic 120mg',
        'Adenuric 80mg'
      ],
      pharmnet: null
    },
    {
      name: 'Myolastan',
      scientific_name: 'Tetrazepam',
      category: 'Pain',
      emoji: '🩹',
      description: 'Myolastan is a benzodiazepine-based muscle relaxant used for painful muscle spasm and contracture, particularly in back pain and musculoskeletal conditions.',
      how_to_take: 'Take 1 tablet once or twice daily. Take at night if possible to minimize daytime drowsiness.',
      side_effects: [
        'Drowsiness (very common)',
        'Dizziness',
        'Fatigue',
        'Coordination difficulty',
        'Dependence with prolonged use'
      ],
      warnings: [
        'Do not drive or operate machinery',
        'Avoid alcohol',
        'Short-term use only — risk of dependence',
        'Do not stop abruptly after prolonged use'
      ],
      interactions: [
        'Alcohol and other CNS depressants — excessive sedation',
        'Opioids — serious respiratory risk'
      ],
      algeria_brands: [
        'Myolastan 50mg'
      ],
      pharmnet: null
    },

  // ─── STOMACH ───────────────────────────────────────────────
    {
      name: 'Inexium',
      scientific_name: 'Esomeprazole',
      category: 'Stomach',
      emoji: '🫁',
      description: 'Inexium reduces stomach acid production. Used for acid reflux, heartburn, stomach ulcers, and to protect the stomach when taking anti-inflammatory drugs.',
      how_to_take: 'Take 30 minutes before a meal, usually in the morning. Swallow whole — do not crush.',
      side_effects: [
        'Headache',
        'Nausea',
        'Diarrhea or constipation',
        'Stomach pain',
        'Flatulence'
      ],
      warnings: [
        'Long-term use may reduce magnesium and B12 levels',
        'Should not be used long-term without medical supervision',
        'May mask symptoms of stomach cancer'
      ],
      interactions: [
        'Clopidogrel — omeprazole reduces its effectiveness (use pantoprazole instead)',
        'Methotrexate levels may increase',
        'Reduces absorption of some medications'
      ],
      algeria_brands: [
        'Inexium 20mg',
        'Inexium 40mg',
        'Esomeprazole Mylan'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'Liste II',
        lab: 'ASTRAZENECA',
        generic_official: 'ESOMEPRAZOLE',
        notice_url: 'https://pharmnet-dz.com/notice.ashx?id=3888',
        pharmnet_url: 'https://pharmnet-dz.com/m-3888-inexium-40mg-comp-gastroresist-b-14',
        dosage_variants: [
          {
            dosage: '40MG',
            form: 'COMP. PELLI',
            conditioning: 'B/14',
            ppa: null
          },
          {
            dosage: '40MG/FL. DE PDRE.',
            form: 'PDRE. SOL. INJ',
            conditioning: 'B/10FL. DE PDRE.',
            ppa: null
          }
        ]
      }
    },
    {
      name: 'Mopral',
      scientific_name: 'Omeprazole',
      category: 'Stomach',
      emoji: '🫁',
      description: 'Mopral (Omeprazole) is a proton pump inhibitor that reduces stomach acid. One of the most prescribed medications in Algeria for acid reflux, gastritis, and ulcer protection.',
      how_to_take: 'Take 30 minutes before the first meal of the day. Swallow capsule whole. If taking once daily, take in the morning.',
      side_effects: [
        'Headache',
        'Diarrhea',
        'Nausea',
        'Stomach pain',
        'Flatulence'
      ],
      warnings: [
        'Avoid in patients taking Plavix — reduces clopidogrel effectiveness',
        'Long-term use may reduce magnesium and vitamin B12',
        'Do not use continuously for more than 4 weeks without medical review'
      ],
      interactions: [
        'Clopidogrel (Plavix) — avoid combination, use pantoprazole instead',
        'Methotrexate — increases toxicity',
        'Warfarin — may increase anticoagulant effect'
      ],
      algeria_brands: [
        'Mopral 10mg',
        'Mopral 20mg',
        'Oméprazole Mylan',
        'Zoltum 20mg'
      ],
      pharmnet: null
    },
    {
      name: 'Forlax',
      scientific_name: 'Macrogol (Polyethylene Glycol)',
      category: 'Stomach',
      emoji: '🫁',
      description: 'Forlax is an osmotic laxative used to treat constipation. It works by retaining water in the bowel to soften stools.',
      how_to_take: 'Dissolve 1-2 sachets in a glass of water. Take once daily, preferably in the morning.',
      side_effects: [
        'Bloating',
        'Stomach cramps',
        'Nausea',
        'Diarrhea if dose too high'
      ],
      warnings: [
        'Not for prolonged use without medical advice',
        'Ensure adequate fluid intake',
        'Not for bowel obstruction'
      ],
      interactions: [
        'May affect absorption of other medications taken at same time'
      ],
      algeria_brands: [
        'Forlax 10g sachet',
        'Forlax 4g sachet (pediatric)',
        'Movicol'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'N/D',
        lab: 'IPSEN PHARMA',
        generic_official: 'MACROGOL 4000 (POLYETHYLENE GLYCOL)',
        notice_url: 'https://pharmnet-dz.com/notice.ashx?id=2942',
        pharmnet_url: 'https://pharmnet-dz.com/m-2942-forlax-10g-sachet--prde-sol-buv-b-20-sachets-dose-',
        dosage_variants: [
          {
            dosage: '10G/SACHET**',
            form: 'PDRE. SOL. BUV',
            conditioning: 'B/20 SACHETS DOSE',
            ppa: '455.00 DA'
          },
          {
            dosage: '4G/SACH.',
            form: 'PDRE. SOL. BUV',
            conditioning: 'B/20SACH-DOSE',
            ppa: null
          }
        ]
      }
    },
    {
      name: 'Débridat',
      scientific_name: 'Trimebutine',
      category: 'Stomach',
      emoji: '🫁',
      description: 'Débridat regulates intestinal motility and is used for irritable bowel syndrome, functional digestive disorders, and abdominal cramps. Very commonly prescribed in Algeria.',
      how_to_take: 'Take 1 tablet 3 times daily before meals. Can be taken with or without food.',
      side_effects: [
        'Dry mouth',
        'Nausea',
        'Constipation or diarrhea',
        'Drowsiness'
      ],
      warnings: [
        'Tell doctor if you are pregnant or breastfeeding',
        'Report persistent digestive symptoms'
      ],
      interactions: [
        'Few known interactions at therapeutic doses'
      ],
      algeria_brands: [
        'Débridat 100mg',
        'Débridat 200mg',
        'Trimébutine Mylan'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'Liste II',
        lab: 'PFIZER',
        generic_official: 'TRIMEBUTINE',
        notice_url: 'https://pharmnet-dz.com/notice.ashx?id=2896',
        pharmnet_url: 'https://pharmnet-dz.com/m-2896-debridat-0-7870g-pour-100g-pdre-susp-buv--en-flacon-fl-250ml',
        dosage_variants: [
          {
            dosage: '0,7870G POUR 100G',
            form: 'PDRE. SUSP. BUV',
            conditioning: 'FL/250ML',
            ppa: null
          },
          {
            dosage: '100MG',
            form: 'COMP. PELLI',
            conditioning: 'B/20',
            ppa: '181.00 DA'
          },
          {
            dosage: '200MG',
            form: 'COMP. PELLI',
            conditioning: 'B/30',
            ppa: null
          }
        ]
      }
    },
    {
      name: 'Pariet',
      scientific_name: 'Rabeprazole',
      category: 'Stomach',
      emoji: '🫁',
      description: 'Pariet reduces stomach acid and is used for reflux and stomach ulcers.',
      how_to_take: 'Take before meals, usually in the morning.',
      side_effects: [
        'Headache',
        'Nausea',
        'Diarrhea'
      ],
      warnings: [
        'Long-term use requires medical supervision'
      ],
      interactions: [
        'Reduces absorption of some medications'
      ],
      algeria_brands: [
        'Pariet 20mg'
      ],
      pharmnet: null
    },
    {
      name: 'Gaviscon',
      scientific_name: 'Sodium Alginate + Antacids',
      category: 'Stomach',
      emoji: '🫁',
      description: 'Gaviscon relieves acid reflux and heartburn by forming a protective barrier in the stomach.',
      how_to_take: 'Take after meals and before bedtime.',
      side_effects: [
        'Bloating',
        'Nausea'
      ],
      warnings: [
        'Do not exceed recommended doses'
      ],
      interactions: [
        'May reduce absorption of other medications'
      ],
      algeria_brands: [
        'Gaviscon syrup',
        'Gaviscon tablets'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'N/D',
        lab: 'SMITHKLINE BEECHAM',
        generic_official: 'ALGINATE DE SODIUM / BICARBONATE DE SODIUM',
        notice_url: null,
        pharmnet_url: 'https://pharmnet-dz.com/m-2917-gaviscon-susp-buv-fl-250-ml',
        dosage_variants: [
          {
            dosage: '50MG/26.7MG',
            form: 'SUSP. BUV',
            conditioning: 'FL/250 ML',
            ppa: null
          }
        ]
      }
    },
    {
      name: 'Duphalac',
      scientific_name: 'Lactulose',
      category: 'Stomach',
      emoji: '🫁',
      description: 'Duphalac is a laxative used to treat chronic constipation in elderly patients.',
      how_to_take: 'Take once daily with water or juice.',
      side_effects: [
        'Bloating',
        'Gas',
        'Diarrhea'
      ],
      warnings: [
        'Drink plenty of fluids'
      ],
      interactions: [
        'Few significant interactions'
      ],
      algeria_brands: [
        'Duphalac syrup'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'N/D',
        lab: 'SOLVAY PHARMA',
        generic_official: 'LACTULOSE',
        notice_url: 'https://pharmnet-dz.com/notice.ashx?id=2937',
        pharmnet_url: 'https://pharmnet-dz.com/m-2937-duphalac-10g-15ml-sol-buv-sachet-b-20-',
        dosage_variants: [
          {
            dosage: '10G/15ML',
            form: 'SOL. BUV. SACHET',
            conditioning: 'B/20',
            ppa: null
          }
        ]
      }
    },
    {
      name: 'Meteospasmyl',
      scientific_name: 'Alverine + Simethicone',
      category: 'Stomach',
      emoji: '🫁',
      description: 'Meteospasmyl is used for irritable bowel syndrome and digestive spasms.',
      how_to_take: 'Take before meals.',
      side_effects: [
        'Nausea',
        'Dizziness'
      ],
      warnings: [
        'Consult doctor if symptoms persist'
      ],
      interactions: [
        'Few known interactions'
      ],
      algeria_brands: [
        'Meteospasmyl capsules'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'N/D',
        lab: 'MAYOLY SPINDLER',
        generic_official: 'ALVERINE/SIMETICONE',
        notice_url: 'https://pharmnet-dz.com/notice.ashx?id=2852',
        pharmnet_url: 'https://pharmnet-dz.com/m-2852-meteospasmyl-60mg-300mg-caps-b-20',
        dosage_variants: [
          {
            dosage: '60MG/300MG',
            form: 'CAPS',
            conditioning: 'B/20',
            ppa: null
          }
        ]
      }
    },
    {
      name: 'Pantoloc',
      scientific_name: 'Pantoprazole',
      category: 'Stomach',
      emoji: '🫁',
      description: 'Pantoloc is the preferred proton pump inhibitor for patients on clopidogrel (Plavix) because it does not interfere with clopidogrel\'s antiplatelet effect, unlike omeprazole. Used for reflux, ulcers, and gastro-oesophageal reflux disease.',
      how_to_take: 'Take 30-60 minutes before a meal. Swallow whole — do not crush. Usually once daily (40mg).',
      side_effects: [
        'Headache',
        'Diarrhea',
        'Nausea',
        'Flatulence',
        'Stomach pain'
      ],
      warnings: [
        'Preferred PPI for patients on clopidogrel',
        'Long-term use may reduce magnesium and B12',
        'May mask symptoms of stomach cancer'
      ],
      interactions: [
        'Does not significantly interact with clopidogrel (unlike omeprazole)',
        'Reduces absorption of ketoconazole and itraconazole',
        'Methotrexate levels may increase'
      ],
      algeria_brands: [
        'Pantoloc 20mg',
        'Pantoloc 40mg',
        'Eupantol 40mg',
        'Pantoprazole Mylan'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'Liste II',
        lab: 'DAR AL DAWA',
        generic_official: 'PANTOPRAZOLE',
        notice_url: 'https://pharmnet-dz.com/notice.ashx?id=3875',
        pharmnet_url: 'https://pharmnet-dz.com/m-3875-pantodar-40mg-comp-gastroresist-b-14',
        dosage_variants: [
          {
            dosage: '40MG',
            form: 'COMP. ENRO',
            conditioning: 'B/14',
            ppa: null
          }
        ]
      }
    },
    {
      name: 'Dompéridone',
      scientific_name: 'Domperidone',
      category: 'Stomach',
      emoji: '🫁',
      description: 'Dompéridone is a prokinetic agent used to treat nausea, vomiting, bloating, and slow gastric emptying. It also stimulates milk production in breastfeeding mothers.',
      how_to_take: 'Take 1 tablet (10mg) 3 times daily before meals. Maximum 3 tablets per day.',
      side_effects: [
        'Dry mouth',
        'Headache',
        'Diarrhea',
        'Breast enlargement or milk production',
        'Rarely: cardiac arrhythmia'
      ],
      warnings: [
        'Do not use for more than 7 days without medical advice',
        'Not for patients with cardiac arrhythmias',
        'Avoid in severe kidney disease',
        'Low doses in elderly'
      ],
      interactions: [
        'QT-prolonging drugs — cardiac risk',
        'CYP3A4 inhibitors (ketoconazole) — increase domperidone levels',
        'Antifungals — increase domperidone levels'
      ],
      algeria_brands: [
        'Motilium 10mg',
        'Dompéridone Mylan'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'Liste II',
        lab: 'GENERIC LAB',
        generic_official: 'DOMPERIDONE',
        notice_url: null,
        pharmnet_url: 'https://pharmnet-dz.com/m-2872-domperidone-1mg-ml-sol-buv-fl-180ml',
        dosage_variants: [
          {
            dosage: '1MG/ML',
            form: 'SOL. BUV',
            conditioning: 'FL/180ML',
            ppa: null
          }
        ]
      }
    },
    {
      name: 'Métoclopramide',
      scientific_name: 'Metoclopramide',
      category: 'Stomach',
      emoji: '🫁',
      description: 'Métoclopramide is a prokinetic antiemetic used to treat nausea, vomiting, and delayed gastric emptying. It is also used to facilitate intestinal intubation.',
      how_to_take: 'Take 10mg up to 3 times daily, 30 minutes before meals.',
      side_effects: [
        'Drowsiness',
        'Restlessness',
        'Fatigue',
        'Involuntary movements (dystonia — especially in young patients)',
        'Breast milk production'
      ],
      warnings: [
        'Risk of involuntary movements especially in young patients and with high doses — seek urgent care if this occurs',
        'Do not exceed recommended dose or duration (max 5 days for acute use)',
        'Avoid in Parkinson\'s disease'
      ],
      interactions: [
        'Alcohol and sedatives — increased drowsiness',
        'Levodopa — reduced effectiveness',
        'Opioids — reduce metoclopramide prokinetic effect'
      ],
      algeria_brands: [
        'Primpéran 10mg tablets',
        'Primpéran injectable',
        'Métoclopramide Mylan'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'Liste II',
        lab: 'RENAUDIN',
        generic_official: 'METOCLOPRAMIDE',
        notice_url: null,
        pharmnet_url: 'https://pharmnet-dz.com/m-2857-metoclopramide-10mg-sol-inj-b-10amp-',
        dosage_variants: [
          {
            dosage: '10MG',
            form: 'SOL. INJ',
            conditioning: 'B/10AMP.',
            ppa: null
          }
        ]
      }
    },
    {
      name: 'Smecta',
      scientific_name: 'Diosmectite',
      category: 'Stomach',
      emoji: '🫁',
      description: 'Smecta is an intestinal adsorbent used to treat acute and chronic diarrhea in adults and children. It adsorbs toxins, bacteria, and viruses in the gut without being absorbed into the bloodstream.',
      how_to_take: 'Dissolve 1 sachet in half a glass of water. Take 3 sachets per day for adults. For infants, mix in bottle. Take between meals.',
      side_effects: [
        'Constipation (if overused)',
        'Bloating'
      ],
      warnings: [
        'Take 2 hours apart from other medications — may reduce their absorption',
        'Seek medical care if diarrhea persists more than 48 hours',
        'Ensure adequate hydration with oral rehydration salts'
      ],
      interactions: [
        'May reduce absorption of other oral medications — take 2 hours apart'
      ],
      algeria_brands: [
        'Smecta 3g sachet',
        'Smectalia 3g sachet'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'N/D',
        lab: 'AT PHARMA SPA',
        generic_official: 'DIOSMECTITE',
        notice_url: 'https://pharmnet-dz.com/notice.ashx?id=3901',
        pharmnet_url: 'https://pharmnet-dz.com/m-3901-smecta-3g-sachet-pdre-p-susp-buv-en-sachet-dose-b-30-sachets',
        dosage_variants: [
          {
            dosage: '3G/SACHET',
            form: 'SUSP. BUV',
            conditioning: 'B/30 SACHETS',
            ppa: null
          }
        ]
      }
    },
    {
      name: 'Antacid Magné',
      scientific_name: 'Magnesium Hydroxide + Aluminum Hydroxide',
      category: 'Stomach',
      emoji: '🫁',
      description: 'Antacid combinations neutralize stomach acid for fast relief of heartburn and indigestion. They are among the most commonly self-purchased medications in Algeria.',
      how_to_take: 'Take 1-2 tablets or 10-20mL suspension 20-60 minutes after meals and at bedtime. Chew tablets well.',
      side_effects: [
        'Constipation (aluminum-dominant)',
        'Diarrhea (magnesium-dominant)',
        'Nausea'
      ],
      warnings: [
        'Do not take long-term without medical advice',
        'Take 2 hours apart from other medications — reduces absorption',
        'Avoid in kidney failure'
      ],
      interactions: [
        'Fluoroquinolones, tetracyclines, iron — take 2 hours apart',
        'Levothyrox — take 4 hours apart'
      ],
      algeria_brands: [
        'Maalox suspension',
        'Maalox Plus tablets',
        'Gélox suspension',
        'Rennie tablets'
      ],
      pharmnet: null
    },
    {
      name: 'Daflon',
      scientific_name: 'Micronized Purified Flavonoid Fraction',
      category: 'Stomach',
      emoji: '💊',
      description: 'Daflon is a phlebotonic agent used to treat chronic venous insufficiency, hemorrhoids, and swollen legs. It strengthens vein walls and reduces inflammation.',
      how_to_take: 'Take 1 tablet (500mg) twice daily with meals. For hemorrhoids: 6 tablets per day for 4 days then 4 tablets for 3 days.',
      side_effects: [
        'Nausea',
        'Diarrhea',
        'Stomach pain',
        'Headache (rare)'
      ],
      warnings: [
        'Not a substitute for compression stockings',
        'Inform doctor if symptoms do not improve',
        'Consult doctor during pregnancy'
      ],
      interactions: [
        'Few significant drug interactions'
      ],
      algeria_brands: [
        'Daflon 500mg',
        'Detralex 500mg'
      ],
      pharmnet: {
        refundable: null,
        prescription_list: 'N/D',
        lab: 'SERVIER',
        generic_official: 'DIOSMINE',
        notice_url: 'https://pharmnet-dz.com//notice.ashx?id=93',
        pharmnet_url: 'https://pharmnet-dz.com/m-1519-daflon-300mg-150mg-en-diosmine-et-150mg-en-hesperidine-comp-enro-b-30',
        dosage_variants: [
          {
            dosage: '300MG (150MG EN DIOSMINE ET 150MG EN HESPERIDINE)',
            form: 'COMP',
            conditioning: 'B/30',
            ppa: null
          },
          {
            dosage: '500MG (450MG EN DIOSMINE ET 50MG EN FLAVONOIDES EXPRIMES EN HESPERIDINE)',
            form: 'COMP. ENRO',
            conditioning: 'B/15  ET  B/30',
            ppa: null
          }
        ]
      }
    },
    {
      name: 'Hémorroïdal',
      scientific_name: 'Cinchocaine + Hydrocortisone (rectal)',
      category: 'Stomach',
      emoji: '💊',
      description: 'Rectal preparations combining a local anesthetic and corticosteroid to relieve pain, itching, and inflammation from hemorrhoids. Widely used in Algeria.',
      how_to_take: 'Apply to affected area morning and evening and after each bowel movement. For suppositories: insert after bowel movement.',
      side_effects: [
        'Skin thinning with prolonged use',
        'Local irritation',
        'Allergic reactions'
      ],
      warnings: [
        'Do not use for more than 7 days without medical supervision',
        'Do not apply to infected areas',
        'Inform doctor if pregnant'
      ],
      interactions: [
        'Limited systemic absorption — few drug interactions'
      ],
      algeria_brands: [
        'Schériproct suppositories',
        'Ultraproct ointment',
        'Proctolog cream'
      ],
      pharmnet: {
        refundable: false,
        prescription_list: 'Liste II',
        lab: 'SAIDAL GROUPE',
        generic_official: 'TRIMEBUTINE / RUSCOGENINES',
        notice_url: 'https://pharmnet-dz.com/notice.ashx?id=2987',
        pharmnet_url: 'https://pharmnet-dz.com/m-2987-hemorect-120mg-10mg-suppo-b-10',
        dosage_variants: [
          {
            dosage: '120MG/10MG',
            form: 'SUPPO',
            conditioning: 'B/10',
            ppa: null
          },
          {
            dosage: '5,8% / 0,5%',
            form: 'CRÃME',
            conditioning: 'T/20G',
            ppa: '153.00 DA'
          }
        ]
      }
    },
    {
      name: 'Créon',
      scientific_name: 'Pancreatin (Pancreatic Enzymes)',
      category: 'Stomach',
      emoji: '🫁',
      description: 'Créon contains digestive enzymes (lipase, amylase, protease) used to treat exocrine pancreatic insufficiency — a condition where the pancreas cannot produce enough digestive enzymes.',
      how_to_take: 'Take with every meal and snack. Swallow capsules whole with water or sprinkle contents on slightly acidic soft food. Do not crush granules.',
      side_effects: [
        'Nausea',
        'Stomach pain',
        'Diarrhea',
        'Constipation'
      ],
      warnings: [
        'Do not crush or chew granules',
        'Dose depends on fat content of meal',
        'Ensure adequate fluid intake'
      ],
      interactions: [
        'Iron supplements — Créon may reduce iron absorption'
      ],
      algeria_brands: [
        'Créon 10000',
        'Créon 25000',
        'Créon 40000'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'N/D',
        lab: 'SOLVAY PHARMA',
        generic_official: 'POUDRE DE PANCREAS',
        notice_url: null,
        pharmnet_url: 'https://pharmnet-dz.com/m-2929-creon-12-000-ui-gles-b-60-',
        dosage_variants: [
          {
            dosage: '12 000 UI',
            form: 'GLES',
            conditioning: 'B/60',
            ppa: null
          }
        ]
      }
    },

  // ─── ANTIBIOTICS ───────────────────────────────────────────
    {
      name: 'Augmentin',
      scientific_name: 'Amoxicillin + Clavulanic Acid',
      category: 'Antibiotics',
      emoji: '🦠',
      description: 'Augmentin is a broad-spectrum antibiotic used to treat bacterial infections of the ear, sinuses, lungs, skin, and urinary tract.',
      how_to_take: 'Take with food to reduce stomach upset. Complete the full course even if you feel better.',
      side_effects: [
        'Diarrhea (very common)',
        'Nausea',
        'Skin rash',
        'Yeast infections'
      ],
      warnings: [
        'Tell your doctor if you are allergic to penicillin',
        'Complete the full course to prevent antibiotic resistance',
        'Probiotics may help prevent diarrhea'
      ],
      interactions: [
        'Warfarin — increased bleeding risk',
        'Methotrexate — increased toxicity',
        'Oral contraceptives — may reduce effectiveness'
      ],
      algeria_brands: [
        'Augmentin 500mg/125mg',
        'Augmentin 875mg/125mg',
        'Augmentin 1g/125mg',
        'Clamoxyl'
      ],
      pharmnet: {
        refundable: null,
        prescription_list: 'Liste I',
        lab: 'GLAXO SMITHKLINE',
        generic_official: 'AMOXICILLINE SODIQUE EXPRIME EN AMOXICILLINE / ACIDE CLAVULANIQUE POTASSIQUE EXPRIME EN ACIDE CLAVULANIQUE',
        notice_url: 'https://pharmnet-dz.com/notice.ashx?id=289',
        pharmnet_url: 'https://pharmnet-dz.com/m-289-augmentin-1g-200mg-pdre-sol-inj-b-10',
        dosage_variants: [
          {
            dosage: '1G/200MG',
            form: 'PDRE. SOL. INJ',
            conditioning: 'B/10',
            ppa: null
          },
          {
            dosage: '250MG/62,5MG/5ML',
            form: 'PDRE. SUSP. BUV',
            conditioning: 'FL/60ML',
            ppa: null
          },
          {
            dosage: '2G/200MG',
            form: 'PDRE. SOL. INJ',
            conditioning: 'B/10',
            ppa: null
          },
          {
            dosage: '500MG',
            form: 'COMP. PELLI',
            conditioning: 'B/12',
            ppa: null
          },
          {
            dosage: '500MG/50MG',
            form: 'PDRE. SOL. INJ',
            conditioning: 'B/1',
            ppa: null
          }
        ]
      }
    },
    {
      name: 'Amoxicilline',
      scientific_name: 'Amoxicillin',
      category: 'Antibiotics',
      emoji: '🦠',
      description: 'Amoxicilline is one of the most commonly used antibiotics for treating bacterial infections including throat, ear, chest, and urinary tract infections.',
      how_to_take: 'Take at evenly spaced intervals throughout the day. Can be taken with or without food. Complete the full course.',
      side_effects: [
        'Diarrhea',
        'Nausea',
        'Skin rash',
        'Stomach upset'
      ],
      warnings: [
        'Tell your doctor about penicillin allergy',
        'Complete the full course',
        'Seek care immediately for severe rash or difficulty breathing'
      ],
      interactions: [
        'Methotrexate toxicity increases',
        'May reduce effectiveness of oral contraceptives'
      ],
      algeria_brands: [
        'Amoxicilline 500mg',
        'Amoxicilline 1g',
        'Clamoxyl 500mg',
        'Flemoxin'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'Liste I',
        lab: 'HUP.P.PHARMA SARL',
        generic_official: 'AMOXICILLINE TRIHYDRATE EXPRIME EN AMOXICILLINE',
        notice_url: 'https://pharmnet-dz.com/notice.ashx?id=891',
        pharmnet_url: 'https://pharmnet-dz.com/m-891-amoxicilline-eg-125mg-5ml-pdre-susp-buv-fl-60ml',
        dosage_variants: [
          {
            dosage: '125MG/5ML',
            form: 'PDRE. SUSP. BUV',
            conditioning: 'FL./60ML',
            ppa: null
          },
          {
            dosage: '1G',
            form: 'COMP. DISPERS',
            conditioning: 'B/14',
            ppa: null
          },
          {
            dosage: '250MG/5ML',
            form: 'PDRE. SUSP. BUV',
            conditioning: 'B/1FL. DE 60ML DE SUSP. BUV. APRES RECONST. + UNE CUILLERE-MESURE',
            ppa: null
          },
          {
            dosage: '500MG/5ML',
            form: 'PDRE. SOL. BUV',
            conditioning: 'B/1FL. DE 60ML DE SUSP. BUV. APRES RECONST. + UNE CUILLERE-MESURE',
            ppa: null
          }
        ]
      }
    },
    {
      name: 'Zomax',
      scientific_name: 'Azithromycin',
      category: 'Antibiotics',
      emoji: '🦠',
      description: 'Zomax (Azithromycin) is a macrolide antibiotic used to treat respiratory infections, skin infections, and sexually transmitted infections.',
      how_to_take: 'Take once daily. Usually a 3 or 5 day course. Can be taken with or without food.',
      side_effects: [
        'Nausea',
        'Diarrhea',
        'Stomach pain',
        'Headache'
      ],
      warnings: [
        'Tell doctor about heart rhythm problems',
        'Complete the full course',
        'May prolong QT interval — inform all doctors'
      ],
      interactions: [
        'Antacids containing aluminum or magnesium — take 1 hour apart',
        'Warfarin — increased bleeding risk',
        'Some heart medications — QT prolongation risk'
      ],
      algeria_brands: [
        'Zomax 250mg',
        'Zomax 500mg',
        'Azithromycine Mylan',
        'Zithromax'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'Liste I',
        lab: 'HIKMA PHARMACEUTICALS',
        generic_official: 'AZITHROMYCINE DIHYDRATE',
        notice_url: 'https://pharmnet-dz.com/notice.ashx?id=805',
        pharmnet_url: 'https://pharmnet-dz.com/m-805-zomax-40mg-ml--200mg-5ml-et-300mg-7-5ml--pdre-p-susp-buv-b-1fl-de-15ml-apres-reconstit--200mg-5ml-une-amp-d-eau-purifiee--une-cuillere-mesure-de-5ml-et-b-1fl-de-22-5ml-apres-reconstit-300mg-7-5ml-une-amp-d-eau-purifiee--une-cuillere-mes',
        dosage_variants: [
          {
            dosage: '40MG/ML** (200MG/5ML ET 300MG/7,5ML)**',
            form: 'PDRE. SOL. BUV',
            conditioning: 'B/1FL. DE 15ML APRES RECONSTIT. (200MG/5ML)+UNE AMP. D\'EAU PURIFIEE + UNE CUILLERE MESURE DE 5ML ET  B/1FL. DE 22,5ML APRES RECONSTIT.(300MG/7,5ML)+UNE AMP. D\'EAU PURIFIEE + UNE CUILLERE MESURE DE 5ML',
            ppa: null
          },
          {
            dosage: '500MG',
            form: 'COMP. PELLI',
            conditioning: 'B/03',
            ppa: null
          }
        ]
      }
    },
    {
      name: 'Ciflox',
      scientific_name: 'Ciprofloxacin',
      category: 'Antibiotics',
      emoji: '🦠',
      description: 'Ciflox is a fluoroquinolone antibiotic used to treat urinary tract infections, respiratory infections, gastrointestinal infections, and skin infections. Reserved for more serious bacterial infections.',
      how_to_take: 'Take with a full glass of water. Can be taken with or without food. Space doses evenly. Complete the full course.',
      side_effects: [
        'Nausea',
        'Diarrhea',
        'Headache',
        'Dizziness',
        'Tendon pain (rare but serious)',
        'Sensitivity to sunlight'
      ],
      warnings: [
        'Stop immediately if you feel tendon pain — risk of tendon rupture',
        'Avoid sun exposure',
        'Can affect mental status in elderly',
        'Do not take with dairy products or antacids'
      ],
      interactions: [
        'Antacids and iron — take 2 hours apart',
        'Warfarin — increased bleeding risk',
        'Theophylline — toxicity risk increases',
        'NSAIDs — seizure risk increases'
      ],
      algeria_brands: [
        'Ciflox 250mg',
        'Ciflox 500mg',
        'Ciflox 750mg',
        'Ciprofloxacine Mylan'
      ],
      pharmnet: null
    },
    {
      name: 'Pénicilline V',
      scientific_name: 'Phenoxymethylpenicillin',
      category: 'Antibiotics',
      emoji: '🦠',
      description: 'Pénicilline V is an oral penicillin used for streptococcal throat infections (angina), and for long-term prevention of rheumatic fever in children and adults in Algeria.',
      how_to_take: 'Take on an empty stomach 30-60 minutes before meals for best absorption. Take at evenly spaced intervals.',
      side_effects: [
        'Nausea',
        'Diarrhea',
        'Stomach pain',
        'Skin rash'
      ],
      warnings: [
        'Tell doctor if allergic to penicillin',
        'Complete the full course',
        'Seek urgent care for severe rash or breathing difficulty'
      ],
      interactions: [
        'May reduce oral contraceptive effectiveness (rare)',
        'Methotrexate toxicity increases'
      ],
      algeria_brands: [
        'Oracilline 1 MUI',
        'Oracilline 2 MUI',
        'Pénicilline V Mylan'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'Liste I',
        lab: 'KPMA LABORATOIRES',
        generic_official: 'PHENOXYMETHYLPENICILLINE POTASSIQUE EXPRIME EN PHENOXYMETHYLPENICILLINE',
        notice_url: 'https://pharmnet-dz.com//notice.ashx?id=896',
        pharmnet_url: 'https://pharmnet-dz.com/m-271-penicilline-cimex-1-000-000ui--comp-pelli-b-12',
        dosage_variants: [
          {
            dosage: '1 000 000UI**',
            form: 'COMP. PELLI',
            conditioning: 'B/12',
            ppa: '257.00 DA'
          },
          {
            dosage: '250 000UI/5ML',
            form: 'PDRE. SOL. BUV',
            conditioning: 'B/1FL. DE 60ML DE SUSP. BUV. APRES RECONSTITUTION +UNE CUILLERE MESURE',
            ppa: null
          }
        ]
      }
    },
    {
      name: 'Rovamycine',
      scientific_name: 'Spiramycin',
      category: 'Antibiotics',
      emoji: '🦠',
      description: 'Rovamycine is a macrolide antibiotic used for respiratory and oral infections, and importantly for toxoplasmosis during pregnancy to protect the fetus.',
      how_to_take: 'Take 2-3 times daily. Can be taken with or without food.',
      side_effects: [
        'Nausea',
        'Vomiting',
        'Diarrhea',
        'Stomach pain',
        'Skin rash'
      ],
      warnings: [
        'Inform your doctor if pregnant — special dosing for toxoplasmosis prevention',
        'Complete the full course'
      ],
      interactions: [
        'Levodopa — may reduce its effectiveness',
        'Few other significant interactions'
      ],
      algeria_brands: [
        'Rovamycine 1.5 MUI',
        'Rovamycine 3 MUI',
        'Spiramycine Mylan'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'Liste I',
        lab: 'SAIDAL GROUPE',
        generic_official: 'SPIRAMYCINE',
        notice_url: 'https://pharmnet-dz.com/notice.ashx?id=789',
        pharmnet_url: 'https://pharmnet-dz.com/m-789-rovamycine-1-500-000ui-comp-pelli-b-16',
        dosage_variants: [
          {
            dosage: '1 500 000UI',
            form: 'COMP. PELLI',
            conditioning: 'B/16',
            ppa: null
          },
          {
            dosage: '3 000 000UI',
            form: 'COMP. PELLI',
            conditioning: 'B/10 ET B/16',
            ppa: null
          }
        ]
      }
    },
    {
      name: 'Josacine',
      scientific_name: 'Josamycin',
      category: 'Antibiotics',
      emoji: '🦠',
      description: 'Josacine is a macrolide antibiotic used for respiratory tract infections and as an alternative to penicillin in allergic patients. Also used for Helicobacter pylori eradication regimens.',
      how_to_take: 'Take 2 times daily with food to reduce stomach upset. Complete the full course.',
      side_effects: [
        'Nausea',
        'Vomiting',
        'Diarrhea',
        'Stomach pain',
        'Skin rash'
      ],
      warnings: [
        'Tell doctor about any liver disease',
        'Complete the full course'
      ],
      interactions: [
        'Warfarin — increased anticoagulant effect',
        'Statins — increased myopathy risk'
      ],
      algeria_brands: [
        'Josacine 500mg',
        'Josacine 1g'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'Liste I',
        lab: 'ASTELLAS PHARMA',
        generic_official: 'JOSAMYCINE PROPIONATE EXPRIME EN JOSAMYCINE',
        notice_url: 'https://pharmnet-dz.com/notice.ashx?id=810',
        pharmnet_url: 'https://pharmnet-dz.com/m-810-josacine-125mg-5-ml-grles-susp-buv-b-01-fl-de-15g-correspondant-a-60ml-de-susp-reconstituee-avec-seringue-p-administration-orale',
        dosage_variants: [
          {
            dosage: '125MG/5 ML',
            form: 'GRLES. SOL. BUV',
            conditioning: 'B/01 FL. DE 15G CORRESPONDANT A 60ML DE SUSP. RECONSTITUEE AVEC SERINGUE P. ADMINISTRATION ORALE',
            ppa: null
          },
          {
            dosage: '250MG',
            form: 'PDRE. SOL. BUV',
            conditioning: 'B/12',
            ppa: null
          },
          {
            dosage: '250MG/5ML',
            form: 'GRLES. SOL. BUV',
            conditioning: 'B/01 FL. DE 15G CORRESPONDANT A 60ML DE SUSP. RECONSTITUEE AVEC SERINGUE P. ADMINISTRATION ORALE',
            ppa: null
          },
          {
            dosage: '500MG /5ML',
            form: 'GRLES. SOL. BUV',
            conditioning: 'B/01 FL. DE 20G CORRESPONDANT A 60ML DE SUSP. RECONSTITUEE AVEC SERINGUE P. ADMINISTRATION ORALE',
            ppa: '904.68 DA'
          },
          {
            dosage: '500MG',
            form: 'COMP. PELLI',
            conditioning: 'B/20',
            ppa: null
          },
          {
            dosage: '500MG',
            form: 'PDRE. SOL. BUV',
            conditioning: 'B/12',
            ppa: null
          }
        ]
      }
    },
    {
      name: 'Rulid',
      scientific_name: 'Roxithromycin',
      category: 'Antibiotics',
      emoji: '🦠',
      description: 'Rulid is a macrolide antibiotic used for respiratory tract infections, soft tissue infections, and Helicobacter pylori eradication. Taken only twice daily.',
      how_to_take: 'Take twice daily (150mg) before meals. Food may reduce absorption.',
      side_effects: [
        'Nausea',
        'Diarrhea',
        'Stomach pain',
        'Headache'
      ],
      warnings: [
        'Tell doctor about liver problems',
        'Complete the full course'
      ],
      interactions: [
        'Warfarin — increased anticoagulant effect',
        'Ergotamine — risk of ergotism',
        'Terfenadine and astemizole — cardiac risk (avoid)'
      ],
      algeria_brands: [
        'Rulid 150mg',
        'Roxithromycine Mylan'
      ],
      pharmnet: null
    },
    {
      name: 'Oflocet',
      scientific_name: 'Ofloxacin',
      category: 'Antibiotics',
      emoji: '🦠',
      description: 'Oflocet is a fluoroquinolone antibiotic used for urinary tract infections, respiratory infections, and sexually transmitted infections.',
      how_to_take: 'Take twice daily with plenty of water. Can be taken with or without food.',
      side_effects: [
        'Nausea',
        'Diarrhea',
        'Headache',
        'Dizziness',
        'Tendon pain',
        'Photosensitivity'
      ],
      warnings: [
        'Stop if tendon pain develops — tendon rupture risk',
        'Avoid sun exposure',
        'Do not take with antacids or iron'
      ],
      interactions: [
        'Antacids and iron — take 2 hours apart',
        'Warfarin — increased bleeding risk',
        'NSAIDs — seizure risk'
      ],
      algeria_brands: [
        'Oflocet 200mg',
        'Ofloxacine Mylan'
      ],
      pharmnet: {
        refundable: null,
        prescription_list: 'Liste I',
        lab: 'ROUSSEL',
        generic_official: 'OFLOXACINE',
        notice_url: 'https://pharmnet-dz.com//notice.ashx?id=896',
        pharmnet_url: 'https://pharmnet-dz.com/m-356-oflocet-200mg-comp-b-10',
        dosage_variants: [
          {
            dosage: '200MG',
            form: 'COMP. PELLI',
            conditioning: 'B/10',
            ppa: null
          },
          {
            dosage: '200MG/40ML',
            form: 'SOL. INJ',
            conditioning: 'FL/40ML',
            ppa: null
          }
        ]
      }
    },
    {
      name: 'Tavanic',
      scientific_name: 'Levofloxacin',
      category: 'Antibiotics',
      emoji: '🦠',
      description: 'Tavanic is a broad-spectrum fluoroquinolone antibiotic used for community-acquired pneumonia, urinary tract infections, and sinusitis in Algeria.',
      how_to_take: 'Take once daily with plenty of water. Can be taken with or without food.',
      side_effects: [
        'Nausea',
        'Diarrhea',
        'Headache',
        'Dizziness',
        'Tendon pain',
        'Photosensitivity',
        'Insomnia'
      ],
      warnings: [
        'Stop immediately if tendon pain or swelling — risk of tendon rupture',
        'Avoid sun exposure',
        'Risk of QT prolongation',
        'Elderly patients especially at risk for tendon problems'
      ],
      interactions: [
        'Antacids, iron, calcium — take 2 hours apart',
        'Warfarin — increased bleeding risk',
        'QT-prolonging drugs — cardiac risk',
        'NSAIDs — seizure risk increases'
      ],
      algeria_brands: [
        'Tavanic 250mg',
        'Tavanic 500mg',
        'Levofloxacine Mylan'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'Liste I',
        lab: 'SANOFI AVENTIS',
        generic_official: 'LEVOFLOXACINE HEMIHYDRATE EXPRIME EN LEVOFLOXACINE',
        notice_url: 'https://pharmnet-dz.com/notice.ashx?id=364',
        pharmnet_url: 'https://pharmnet-dz.com/m-364-tavanic-250mg-comp-pelli-sec-b-05',
        dosage_variants: [
          {
            dosage: '250MG',
            form: 'COMP. PELLI',
            conditioning: 'B/05',
            ppa: null
          },
          {
            dosage: '500MG',
            form: 'COMP. PELLI',
            conditioning: 'B/05',
            ppa: null
          }
        ]
      }
    },
    {
      name: 'Doxycycline',
      scientific_name: 'Doxycycline',
      category: 'Antibiotics',
      emoji: '🦠',
      description: 'Doxycycline is a tetracycline antibiotic used for respiratory infections, Lyme disease, tick-borne illnesses, sexually transmitted infections, and malaria prevention in travelers.',
      how_to_take: 'Take with plenty of water and food. Take while sitting upright. Do not lie down for 30 minutes after taking.',
      side_effects: [
        'Nausea',
        'Vomiting',
        'Photosensitivity (sun sensitivity)',
        'Esophageal irritation',
        'Yeast infections'
      ],
      warnings: [
        'Not for children under 8 or pregnant women — can damage developing teeth and bones',
        'Use sunscreen daily',
        'Take with food and water — can burn the esophagus',
        'Do not take at bedtime'
      ],
      interactions: [
        'Antacids, iron, calcium, dairy — reduce absorption (take 2-3 hours apart)',
        'Warfarin — increased anticoagulant effect',
        'Oral contraceptives — may reduce effectiveness'
      ],
      algeria_brands: [
        'Doxycycline 100mg',
        'Vibramycine 100mg'
      ],
      pharmnet: null
    },
    {
      name: 'Rocéphine',
      scientific_name: 'Ceftriaxone',
      category: 'Antibiotics',
      emoji: '🦠',
      description: 'Rocéphine is a 3rd generation cephalosporin antibiotic administered by injection (IM or IV) for serious bacterial infections including pneumonia, meningitis, septicemia, and complicated UTIs.',
      how_to_take: 'Injected once daily by a healthcare professional (intramuscular or intravenous). Home IM injections sometimes prescribed in Algeria.',
      side_effects: [
        'Pain at injection site',
        'Diarrhea',
        'Skin rash',
        'Nausea',
        'Rarely: gallbladder sludge'
      ],
      warnings: [
        'Tell doctor if allergic to penicillin — some cross-allergy possible',
        'Do not mix with calcium-containing solutions',
        'Tell doctor about kidney or liver disease'
      ],
      interactions: [
        'Calcium-containing products — do not mix in same IV line',
        'Warfarin — increased anticoagulant effect'
      ],
      algeria_brands: [
        'Rocéphine 1g injectable',
        'Rocéphine 2g injectable',
        'Ceftriaxone Mylan'
      ],
      pharmnet: null
    },
    {
      name: 'Keforal',
      scientific_name: 'Cefalexin',
      category: 'Antibiotics',
      emoji: '🦠',
      description: 'Keforal is a first-generation cephalosporin antibiotic used for skin and soft tissue infections, urinary tract infections, and respiratory tract infections.',
      how_to_take: 'Take 2-4 times daily with or without food. Complete the full course.',
      side_effects: [
        'Nausea',
        'Diarrhea',
        'Stomach pain',
        'Skin rash',
        'Yeast infections'
      ],
      warnings: [
        'Tell doctor if allergic to penicillin',
        'Complete the full course',
        'Seek urgent care for severe rash or breathing difficulty'
      ],
      interactions: [
        'Warfarin — increased anticoagulant effect',
        'Metformin — monitor kidney function'
      ],
      algeria_brands: [
        'Keforal 500mg',
        'Céfalexine Mylan',
        'Ospexin 500mg'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'Liste I',
        lab: 'ELI LILLY',
        generic_official: 'CEFALEXINE',
        notice_url: 'https://pharmnet-dz.com//notice.ashx?id=896',
        pharmnet_url: 'https://pharmnet-dz.com/m-1897-keforal-125mg-5ml-pdre-susp-buv-fl-100ml',
        dosage_variants: [
          {
            dosage: '125MG/5ML',
            form: 'GRLES. SOL. BUV',
            conditioning: 'FL/100ML',
            ppa: null
          },
          {
            dosage: '250MG/5ML',
            form: 'PDRE. SOL. BUV',
            conditioning: 'FL/60ML',
            ppa: '383.00 DA'
          },
          {
            dosage: '500MG**',
            form: 'COMP. PELLI',
            conditioning: 'B/12',
            ppa: null
          }
        ]
      }
    },
    {
      name: 'Zinnat',
      scientific_name: 'Cefuroxime',
      category: 'Antibiotics',
      emoji: '🦠',
      description: 'Zinnat is a second-generation cephalosporin antibiotic used for upper and lower respiratory tract infections, urinary tract infections, skin infections, and Lyme disease.',
      how_to_take: 'Take twice daily with food to improve absorption and reduce stomach upset.',
      side_effects: [
        'Diarrhea',
        'Nausea',
        'Stomach pain',
        'Headache',
        'Skin rash'
      ],
      warnings: [
        'Tell doctor if allergic to penicillin',
        'Complete the full course',
        'Take with food — improves absorption'
      ],
      interactions: [
        'Antacids — reduce absorption',
        'Warfarin — increased anticoagulant effect'
      ],
      algeria_brands: [
        'Zinnat 250mg',
        'Zinnat 500mg',
        'Céfuroxime Mylan'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'Liste I',
        lab: 'GLAXO SMITHKLINE',
        generic_official: 'CEFUROXIME AXETIL EXPRIME EN CEFUROXIME',
        notice_url: 'https://pharmnet-dz.com/notice.ashx?id=702',
        pharmnet_url: 'https://pharmnet-dz.com/m-702-zinnat-125mg-comp-b-14',
        dosage_variants: [
          {
            dosage: '125MG',
            form: 'COMP',
            conditioning: 'B/14',
            ppa: '653.00 DA'
          },
          {
            dosage: '125MG/5ML',
            form: 'SUSP. BUV',
            conditioning: 'FL/70ML',
            ppa: '656.30 DA'
          },
          {
            dosage: '250MG',
            form: 'COMP. PELLI',
            conditioning: 'B/14',
            ppa: '537.00 DA'
          }
        ]
      }
    },
    {
      name: 'Flagyl',
      scientific_name: 'Metronidazole',
      category: 'Antibiotics',
      emoji: '🦠',
      description: 'Flagyl is an antibiotic and antiprotozoal medication used for bacterial vaginosis, anaerobic bacterial infections, H. pylori eradication, C. difficile colitis, and protozoal infections like giardiasis and amebiasis.',
      how_to_take: 'Take with food to reduce stomach upset. Do not crush tablets. Complete the full course.',
      side_effects: [
        'Metallic taste (very common)',
        'Nausea',
        'Headache',
        'Diarrhea',
        'Urine may turn dark/reddish (harmless)'
      ],
      warnings: [
        'Absolutely avoid alcohol during treatment and for 48 hours after — severe reaction (disulfiram-like)',
        'Avoid sun exposure',
        'Report numbness or tingling'
      ],
      interactions: [
        'Alcohol — severe reaction (nausea, vomiting, flushing, rapid heartbeat)',
        'Warfarin — greatly increased anticoagulant effect',
        'Lithium — toxicity risk',
        'Phenytoin — levels increase'
      ],
      algeria_brands: [
        'Flagyl 250mg',
        'Flagyl 500mg',
        'Métronidazole Mylan',
        'Rodogyl (Metronidazole + Spiramycin)'
      ],
      pharmnet: {
        refundable: null,
        prescription_list: 'Liste I',
        lab: 'BIOPHARM',
        generic_official: 'METRONIDAZOLE',
        notice_url: 'https://pharmnet-dz.com//notice.ashx?id=896',
        pharmnet_url: 'https://pharmnet-dz.com/m-864-flagyl-125mg-5ml-susp-buv-fl-120-ml--cuillere-mesure-de-5ml',
        dosage_variants: [
          {
            dosage: '125MG/5ML',
            form: 'SUSP. BUV',
            conditioning: 'FL/120 ML + CUILLERE MESURE DE 5ML',
            ppa: '183.00 DA'
          },
          {
            dosage: '250MG',
            form: 'COMP. PELLI',
            conditioning: 'B/20',
            ppa: null
          },
          {
            dosage: '500MG',
            form: 'OVULE',
            conditioning: 'B/10',
            ppa: null
          }
        ]
      }
    },
    {
      name: 'Amikacine',
      scientific_name: 'Amikacin',
      category: 'Antibiotics',
      emoji: '🦠',
      description: 'Amikacine is an aminoglycoside antibiotic administered by injection for severe gram-negative bacterial infections. Used in hospital settings in Algeria for serious infections.',
      how_to_take: 'Administered by injection (IM or IV) by healthcare professionals, once or twice daily depending on kidney function.',
      side_effects: [
        'Kidney damage (nephrotoxicity) — with prolonged use',
        'Hearing damage (ototoxicity)',
        'Dizziness',
        'Rarely: neuromuscular blockade'
      ],
      warnings: [
        'Regular kidney function monitoring mandatory',
        'Blood level monitoring required',
        'Hearing tests recommended with prolonged use',
        'Use with extreme caution in kidney disease'
      ],
      interactions: [
        'Loop diuretics (furosemide) — increased ototoxicity and nephrotoxicity',
        'Vancomycin — increased nephrotoxicity',
        'Neuromuscular blocking agents — additive effect'
      ],
      algeria_brands: [
        'Amikacine 250mg/mL injectable',
        'Amiklin 500mg injectable'
      ],
      pharmnet: null
    },
    {
      name: 'Rifampicine',
      scientific_name: 'Rifampicin',
      category: 'Antibiotics',
      emoji: '🦠',
      description: 'Rifampicine is a key antibiotic in tuberculosis treatment regimens used in Algeria and worldwide. It is also used for leprosy and meningococcal meningitis prevention.',
      how_to_take: 'Take on an empty stomach 30 minutes before a meal. Take at the same time each day. Part of multi-drug TB regimen.',
      side_effects: [
        'Orange/red coloration of urine, sweat, and tears (harmless)',
        'Nausea',
        'Stomach pain',
        'Liver toxicity (monitor)',
        'Skin rash'
      ],
      warnings: [
        'Warn patients that body fluids will turn orange/red — harmless but alarming',
        'Regular liver function tests required',
        'Reduces effectiveness of many medications — always tell your doctor you are taking it',
        'Soft contact lenses may be permanently stained'
      ],
      interactions: [
        'Reduces levels of many drugs including: oral contraceptives, warfarin, HIV antiretrovirals, diabetes medications, corticosteroids — always check interactions'
      ],
      algeria_brands: [
        'Rifampicine 300mg',
        'Rifampicine 600mg',
        'Rimactan',
        'Included in TB fixed-dose combinations: Rimstar (RHZE)'
      ],
      pharmnet: null
    },
    {
      name: 'Isoniazide',
      scientific_name: 'Isoniazid',
      category: 'Antibiotics',
      emoji: '🦠',
      description: 'Isoniazide is a cornerstone of tuberculosis treatment, given as part of combination regimens. Used for both active TB treatment and latent TB infection prevention.',
      how_to_take: 'Take once daily on an empty stomach or with food if stomach upset. Take with vitamin B6 (pyridoxine) to prevent peripheral neuropathy.',
      side_effects: [
        'Peripheral neuropathy (numbness/tingling) — prevented by vitamin B6',
        'Liver toxicity (hepatitis)',
        'Skin rash',
        'Mood changes'
      ],
      warnings: [
        'Take with pyridoxine (vitamin B6) to prevent nerve damage',
        'Regular liver function tests required',
        'Avoid alcohol',
        'Report any numbness, tingling, or weakness in hands or feet'
      ],
      interactions: [
        'Phenytoin — increases phenytoin levels',
        'Carbamazepine — increases toxicity',
        'Antacids containing aluminum — reduce absorption (take separately)'
      ],
      algeria_brands: [
        'Isoniazide 100mg',
        'Isoniazide 300mg',
        'Included in TB fixed-dose combinations: Rimstar, Rifinah'
      ],
      pharmnet: {
        refundable: null,
        prescription_list: 'Liste I',
        lab: 'GRUPPO LEPETIT',
        generic_official: 'ISONIAZIDE',
        notice_url: 'https://pharmnet-dz.com//notice.ashx?id=896',
        pharmnet_url: 'https://pharmnet-dz.com/m-3587-isoniazide-100mg-comp-b-1000',
        dosage_variants: [
          {
            dosage: '100MG',
            form: 'COMP',
            conditioning: 'B/1000',
            ppa: null
          }
        ]
      }
    },
    {
      name: 'Nitrofurantoïne',
      scientific_name: 'Nitrofurantoin',
      category: 'Antibiotics',
      emoji: '🦠',
      description: 'Nitrofurantoïne is an antibiotic specifically used to treat uncomplicated urinary tract infections (UTIs) and for long-term prevention of recurrent UTIs.',
      how_to_take: 'Take with food to reduce stomach upset. Drink plenty of water. Take at evenly spaced intervals.',
      side_effects: [
        'Nausea (very common)',
        'Vomiting',
        'Loss of appetite',
        'Urine turns brown (harmless)',
        'Pulmonary reactions (rare with long-term use)'
      ],
      warnings: [
        'Not effective for kidney infections',
        'Avoid in severe kidney disease',
        'With long-term use, monitor lung and liver function',
        'Not for the last 36 weeks of pregnancy'
      ],
      interactions: [
        'Antacids containing magnesium trisilicate — reduce absorption',
        'Probenecid — increases nitrofurantoin blood levels and toxicity'
      ],
      algeria_brands: [
        'Furadantine 100mg',
        'Nitrofurantoïne 100mg'
      ],
      pharmnet: {
        refundable: null,
        prescription_list: 'Liste II',
        lab: 'SCHWARZ PHARMA',
        generic_official: 'GLYCERYL TRINITRATE',
        notice_url: 'https://pharmnet-dz.com//notice.ashx?id=93',
        pharmnet_url: 'https://pharmnet-dz.com/m-117-nitrocine-10mg-10ml-sol-p-perf-iv-b-10-amp-de-10ml',
        dosage_variants: [
          {
            dosage: '10MG/10ML',
            form: 'SOL. PERF',
            conditioning: 'B/10 AMP.DE  10ML',
            ppa: null
          }
        ]
      }
    },
    {
      name: 'Péflacine',
      scientific_name: 'Pefloxacin',
      category: 'Antibiotics',
      emoji: '🦠',
      description: 'Péflacine is a fluoroquinolone antibiotic widely available in Algeria, used for urinary tract infections, respiratory infections, and as an alternative in multi-drug resistant infections.',
      how_to_take: 'Take twice daily with water. Can be taken with or without food. Avoid antacids.',
      side_effects: [
        'Nausea',
        'Diarrhea',
        'Headache',
        'Tendon pain',
        'Photosensitivity'
      ],
      warnings: [
        'Stop if tendon pain — risk of tendon rupture, particularly Achilles tendon',
        'Avoid prolonged sun exposure',
        'Do not take with antacids or iron'
      ],
      interactions: [
        'Antacids, iron — take 2 hours apart',
        'Warfarin — increased anticoagulant effect',
        'Theophylline — increased toxicity risk'
      ],
      algeria_brands: [
        'Péflacine 400mg',
        'Péfloxacine Mylan'
      ],
      pharmnet: null
    },
    {
      name: 'Bactrim',
      scientific_name: 'Trimethoprim + Sulfamethoxazole',
      category: 'Antibiotics',
      emoji: '🦠',
      description: 'Bactrim (Co-trimoxazole) is used for urinary tract infections, respiratory infections, and in immunocompromised patients for pneumocystis pneumonia prevention and treatment.',
      how_to_take: 'Take twice daily with food. Drink plenty of water throughout treatment.',
      side_effects: [
        'Nausea',
        'Vomiting',
        'Skin rash (including severe reactions)',
        'Photosensitivity',
        'Elevated potassium'
      ],
      warnings: [
        'Stop immediately for severe skin rash — Stevens-Johnson syndrome risk',
        'Drink plenty of water',
        'Avoid in sulfonamide allergy',
        'Monitor kidney function and potassium'
      ],
      interactions: [
        'Warfarin — greatly increased anticoagulant effect',
        'Methotrexate — severe toxicity',
        'ACE inhibitors/ARBs — hyperkalemia risk',
        'Potassium-sparing diuretics — hyperkalemia risk'
      ],
      algeria_brands: [
        'Bactrim 400/80mg',
        'Bactrim Forte 800/160mg',
        'Cotrimoxazole Mylan'
      ],
      pharmnet: null
    },

  // ─── VITAMINS ──────────────────────────────────────────────
    {
      name: 'Vitamine C',
      scientific_name: 'Ascorbic Acid',
      category: 'Vitamins',
      emoji: '🍊',
      description: 'Vitamin C is essential for immune function, wound healing, and antioxidant protection. Used to treat or prevent vitamin C deficiency.',
      how_to_take: 'Take effervescent tablets dissolved in a glass of water. Can be taken at any time of day.',
      side_effects: [
        'Stomach upset at high doses',
        'Diarrhea at very high doses',
        'Kidney stones with very prolonged high doses'
      ],
      warnings: [
        'Do not exceed recommended daily intake without medical advice',
        'High doses may interfere with some lab tests'
      ],
      interactions: [
        'Iron absorption increases (can be beneficial)',
        'Warfarin — very high doses may affect anticoagulation'
      ],
      algeria_brands: [
        'Vitamine C 500mg effervescent',
        'Vitamine C 1000mg',
        'Cébévit',
        'Laroscorbine'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'N/D',
        lab: 'AGUETTANT',
        generic_official: 'ACIDE ASCORBIQUE',
        notice_url: 'https://pharmnet-dz.com//notice.ashx?id=6078',
        pharmnet_url: 'https://pharmnet-dz.com/m-3414-vitamine-c-500mg-5ml-sol-inj-b-100amp-de-5ml-',
        dosage_variants: [
          {
            dosage: '500MG/5ML',
            form: 'SOL. INJ',
            conditioning: 'B/100AMP. DE 5ML',
            ppa: null
          },
          {
            dosage: '500MG/5ML',
            form: 'SOL. INJ',
            conditioning: 'B/10AMP.',
            ppa: null
          }
        ]
      }
    },
    {
      name: 'Vitamag',
      scientific_name: 'Magnesium Pidolate',
      category: 'Vitamins',
      emoji: '💊',
      description: 'Vitamag provides magnesium in the form of pidolate, which is well absorbed. Used for magnesium deficiency, muscle cramps, fatigue, and stress.',
      how_to_take: 'Dilute the oral solution in a glass of water. Take 1-2 ampoules daily, usually morning and noon.',
      side_effects: [
        'Diarrhea at high doses',
        'Stomach discomfort'
      ],
      warnings: [
        'Dose adjustment needed for kidney disease',
        'Consult doctor if taking for more than 1 month'
      ],
      interactions: [
        'May reduce absorption of some antibiotics (take 2 hours apart)',
        'Bisphosphonates — take 2 hours apart'
      ],
      algeria_brands: [
        'Vitamag SOL.BUV 127mg/5mL',
        'Mag 2 (Magnesium chloride)'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'N/D',
        lab: 'LAD PHARMA',
        generic_official: 'MAGNESIUM ELEMENT  (SOUS FORME DE MAGNESIUM PIDOLATE)',
        notice_url: 'https://pharmnet-dz.com//notice.ashx?id=6078',
        pharmnet_url: 'https://pharmnet-dz.com/m-3412-vitamag-127mg-5ml-de-magnesium--1-5g-5ml-de-pidolate-de-magnesium--sol-buv-en-amp-b-20-amp-de-5ml--b-30amp-de-5ml',
        dosage_variants: [
          {
            dosage: '127MG/5ML DE MAGNESIUM  (1,5G/5ML DE PIDOLATE DE MAGNESIUM))',
            form: 'SOL. BUV',
            conditioning: 'B/20 AMP. DE 5ML  - B/30AMP. DE 5ML',
            ppa: null
          },
          {
            dosage: '61MG/5ML DE MAGNESIUM (SOIT 0,75G/5ML OU 15% DE MAGNESIUM PIDOLATE )',
            form: 'SOL. BUV',
            conditioning: 'FL./125ML',
            ppa: null
          }
        ]
      }
    },
    {
      name: 'Calciprat',
      scientific_name: 'Calcium + Vitamin D3',
      category: 'Vitamins',
      emoji: '🦴',
      description: 'Calciprat combines calcium and vitamin D3 to prevent and treat osteoporosis and calcium deficiency. Commonly prescribed alongside corticosteroids or for elderly patients in Algeria.',
      how_to_take: 'Chew or dissolve tablet in the mouth. Take with meals for better absorption. Take 2-4 hours apart from other medications.',
      side_effects: [
        'Constipation',
        'Nausea',
        'Stomach pain',
        'Flatulence',
        'Hypercalcemia with excessive doses'
      ],
      warnings: [
        'Do not exceed prescribed dose',
        'Tell doctor if you have kidney stones',
        'Space from other medications as calcium reduces their absorption'
      ],
      interactions: [
        'Levothyrox — take 4 hours apart',
        'Fluoroquinolone antibiotics — take 2 hours apart',
        'Bisphosphonates — take 2 hours apart',
        'Iron — take 2 hours apart'
      ],
      algeria_brands: [
        'Calciprat 500mg/400UI',
        'Calciprat 1000mg/800UI',
        'Calcéos',
        'Orocal D3'
      ],
      pharmnet: null
    },
    {
      name: 'Fero-Grad',
      scientific_name: 'Ferrous Sulfate + Vitamin C',
      category: 'Vitamins',
      emoji: '🩸',
      description: 'Fero-Grad is an iron supplement combined with vitamin C (which improves iron absorption). Used to treat and prevent iron-deficiency anemia, commonly seen in pregnant women and patients with chronic diseases in Algeria.',
      how_to_take: 'Take on an empty stomach 1 hour before meals for best absorption. If stomach upset occurs, take with a small amount of food.',
      side_effects: [
        'Black or dark stools (normal)',
        'Constipation',
        'Nausea',
        'Stomach cramps',
        'Diarrhea'
      ],
      warnings: [
        'Keep out of reach of children — iron overdose is dangerous',
        'Dark stools are normal and not a concern',
        'Do not take with milk or antacids'
      ],
      interactions: [
        'Levothyrox — take 4 hours apart',
        'Fluoroquinolones — take 2 hours apart',
        'Calcium — reduces absorption',
        'Tetracyclines — take 2-3 hours apart'
      ],
      algeria_brands: [
        'Fero-Grad 500mg',
        'Tardyferon B9',
        'Ferrograd C',
        'Timoferol'
      ],
      pharmnet: null
    },
    {
      name: 'Neurobion',
      scientific_name: 'Vitamin B1 + B6 + B12',
      category: 'Vitamins',
      emoji: '💊',
      description: 'Neurobion is a vitamin B complex used for nerve pain, neuropathy, and vitamin deficiencies.',
      how_to_take: 'Take once daily after meals.',
      side_effects: [
        'Nausea',
        'Headache',
        'Skin rash'
      ],
      warnings: [
        'Do not exceed recommended doses'
      ],
      interactions: [
        'Levodopa effectiveness may decrease'
      ],
      algeria_brands: [
        'Neurobion tablets',
        'Neurobion injectable'
      ],
      pharmnet: null
    },
    {
      name: 'Vitamine D3',
      scientific_name: 'Cholecalciferol',
      category: 'Vitamins',
      emoji: '☀️',
      description: 'Vitamine D3 supplements are widely prescribed in Algeria to correct deficiency, support calcium absorption for bone health, and boost immune function. Deficiency is very common in Algeria despite the sunny climate.',
      how_to_take: 'High-dose ampoules (100,000 IU) taken as a single monthly or quarterly dose. Daily lower doses taken with meals.',
      side_effects: [
        'At recommended doses: minimal side effects',
        'Overdose: hypercalcemia — nausea, thirst, frequent urination, confusion'
      ],
      warnings: [
        'Do not take high doses without confirmed blood level deficiency',
        'Monitor calcium levels with high-dose therapy',
        'Regular blood level monitoring recommended'
      ],
      interactions: [
        'Thiazide diuretics — increase calcium levels, increasing hypercalcemia risk',
        'Cholestyramine — reduces vitamin D absorption'
      ],
      algeria_brands: [
        'Uvedose 100,000 IU ampoule',
        'ZymaD oral drops',
        'Vitamine D3 BON 100,000 UI',
        'Cholécalciférol Mylan'
      ],
      pharmnet: null
    },
    {
      name: 'Acide Folique',
      scientific_name: 'Folic Acid (Vitamin B9)',
      category: 'Vitamins',
      emoji: '🍃',
      description: 'Acide Folique (folic acid) is essential for DNA synthesis and is critical during early pregnancy to prevent neural tube defects. Also used in anemia treatment and for patients on methotrexate.',
      how_to_take: 'For pregnancy prevention: start at least 1 month before conception and continue through first trimester. Take daily, with or without food.',
      side_effects: [
        'Very well tolerated at recommended doses',
        'Rarely: nausea, bloating, sleep disturbances at high doses'
      ],
      warnings: [
        'High doses can mask vitamin B12 deficiency — check B12 levels if anemia is present',
        'Essential for all women planning pregnancy'
      ],
      interactions: [
        'Methotrexate — antagonist (folic acid supplements help reduce methotrexate toxicity)',
        'Phenytoin — folic acid may reduce phenytoin levels'
      ],
      algeria_brands: [
        'Acide Folique 0.4mg (5mg)',
        'Spéciafoldine 5mg',
        'B9 Bébé (preconception)'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'N/D',
        lab: 'API',
        generic_official: 'ACIDE FOLIQUE',
        notice_url: 'https://pharmnet-dz.com//notice.ashx?id=6053',
        pharmnet_url: 'https://pharmnet-dz.com/m-1746-acide-folique--api-5mg-comp-b-20',
        dosage_variants: [
          {
            dosage: '5MG',
            form: 'COMP',
            conditioning: 'B/20',
            ppa: '170.00 DA'
          }
        ]
      }
    },
    {
      name: 'Tardyferon',
      scientific_name: 'Ferrous Sulfate (sustained release)',
      category: 'Vitamins',
      emoji: '🩸',
      description: 'Tardyferon is a sustained-release iron supplement for iron-deficiency anemia that causes fewer gastrointestinal side effects than immediate-release iron formulations.',
      how_to_take: 'Take 1 tablet once or twice daily. Take on an empty stomach, but if stomach upset occurs, take with a light meal.',
      side_effects: [
        'Black or dark stools (normal)',
        'Constipation (less than regular iron)',
        'Nausea (less common)',
        'Stomach pain'
      ],
      warnings: [
        'Dark stools are normal and expected',
        'Keep out of reach of children — iron overdose dangerous',
        'Do not take with antacids or milk'
      ],
      interactions: [
        'Levothyrox — take 4 hours apart',
        'Quinolones and tetracyclines — take 2-3 hours apart',
        'Calcium — reduces iron absorption'
      ],
      algeria_brands: [
        'Tardyferon 80mg',
        'Tardyferon B9 (with folic acid)'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'N/D',
        lab: 'PIERRE FABRE',
        generic_official: 'FER FERREUX (DCI)   (SOUS FORME DE SULFATE FERREUX)',
        notice_url: 'https://pharmnet-dz.com/notice.ashx?id=1793',
        pharmnet_url: 'https://pharmnet-dz.com/m-1793-tardyferon-80mg-comp-enro-b-30',
        dosage_variants: [
          {
            dosage: '80MG',
            form: 'COMP. PELLI',
            conditioning: 'B/30',
            ppa: null
          }
        ]
      }
    },
    {
      name: 'Vitamine B12',
      scientific_name: 'Cyanocobalamin / Hydroxocobalamin',
      category: 'Vitamins',
      emoji: '💊',
      description: 'Vitamine B12 is used to treat deficiency from dietary insufficiency, malabsorption, or metformin use. Essential for nerve function, red blood cell formation, and DNA synthesis.',
      how_to_take: 'Oral tablets: daily supplementation. Injectable form (IM): given weekly for 4 weeks, then monthly for maintenance of deficiency.',
      side_effects: [
        'Very safe — excess is excreted in urine',
        'Rarely: acne, allergic reactions with injectable form'
      ],
      warnings: [
        'Metformin users should check B12 levels regularly',
        'Vegan/vegetarian patients at risk — supplement routinely',
        'Injectable form preferred for malabsorption'
      ],
      interactions: [
        'Metformin — reduces B12 absorption over time',
        'Proton pump inhibitors (omeprazole) — reduce B12 absorption with long-term use'
      ],
      algeria_brands: [
        'Vitamine B12 1000mcg injectable',
        'Rubranova 1000mcg injectable',
        'Dodécavit injectable'
      ],
      pharmnet: {
        refundable: null,
        prescription_list: 'N/D',
        lab: 'BIO-GALENIC',
        generic_official: 'THIAMINE CHLORHYDRATE / PYRIDOXINE CHLORHYDRATE',
        notice_url: 'https://pharmnet-dz.com//notice.ashx?id=6078',
        pharmnet_url: 'https://pharmnet-dz.com/m-3440-vitamine-b1-b6-bgl-250mg-250mg-comp-b-20',
        dosage_variants: [
          {
            dosage: '250MG/250MG',
            form: 'COMP',
            conditioning: 'B/20',
            ppa: '198.00 DA'
          }
        ]
      }
    },
    {
      name: 'Phosphore Sandoz',
      scientific_name: 'Sodium Phosphate',
      category: 'Vitamins',
      emoji: '💊',
      description: 'Phosphore Sandoz is used to treat hypophosphatemia (low phosphate levels), commonly seen in patients with kidney disease, hyperparathyroidism, and those on aluminum-containing antacids.',
      how_to_take: 'Dissolve effervescent tablet in water and drink immediately. Taken 1-4 times daily as prescribed.',
      side_effects: [
        'Nausea',
        'Diarrhea',
        'Stomach cramps'
      ],
      warnings: [
        'Avoid in severe kidney disease',
        'Monitor phosphate and calcium levels',
        'Do not take with calcium supplements without medical advice'
      ],
      interactions: [
        'Antacids containing aluminum — bind phosphate reducing absorption',
        'Calcium supplements — may form insoluble complexes'
      ],
      algeria_brands: [
        'Phosphore Sandoz effervescent'
      ],
      pharmnet: null
    },
    {
      name: 'Potassium Effervescent',
      scientific_name: 'Potassium Chloride',
      category: 'Vitamins',
      emoji: '💊',
      description: 'Potassium supplements are used to prevent or treat low potassium (hypokalemia) caused by diuretics, vomiting, or diarrhea. Commonly needed by patients on Lasilix (furosemide) or other diuretics.',
      how_to_take: 'Dissolve effervescent tablet in a full glass of water. Drink slowly. Take with meals.',
      side_effects: [
        'Nausea and vomiting',
        'Stomach pain',
        'Diarrhea',
        'Dangerous if too much taken — hyperkalemia'
      ],
      warnings: [
        'Take only prescribed dose — excess potassium is dangerous',
        'Monitor potassium blood levels regularly',
        'Do not take if on potassium-sparing diuretics or ACE inhibitors without medical advice'
      ],
      interactions: [
        'ACE inhibitors/ARBs — hyperkalemia risk',
        'Spironolactone — hyperkalemia risk',
        'NSAIDs — reduce potassium excretion'
      ],
      algeria_brands: [
        'Diffu-K 600mg effervescent',
        'KCl effervescent 500mg',
        'Slow-K 600mg'
      ],
      pharmnet: {
        refundable: null,
        prescription_list: 'N/D',
        lab: 'RENAUDIN',
        generic_official: 'POTASSIUM GLUCONATE',
        notice_url: 'https://pharmnet-dz.com//notice.ashx?id=6078',
        pharmnet_url: 'https://pharmnet-dz.com/m-3365-potassium-gluconate-0-05-sol-inj-b-100amp-de-10ml',
        dosage_variants: [
          {
            dosage: '0.05',
            form: 'SOL. INJ',
            conditioning: 'B/100AMP. DE 10ML',
            ppa: null
          }
        ]
      }
    },
    {
      name: 'Oméga 3',
      scientific_name: 'Omega-3 Fatty Acids (EPA/DHA)',
      category: 'Vitamins',
      emoji: '🐟',
      description: 'Omega-3 fatty acid supplements reduce triglycerides and have cardiovascular protective effects. Used in Algeria as an adjunct to statins for high triglyceride levels.',
      how_to_take: 'Take 2-4 capsules daily with meals. Take at the same time each day.',
      side_effects: [
        'Fishy aftertaste or burping',
        'Nausea',
        'Diarrhea',
        'Stomach discomfort'
      ],
      warnings: [
        'High doses may increase bleeding time',
        'Tell doctor if on anticoagulants',
        'May cause slight reduction in blood pressure'
      ],
      interactions: [
        'Warfarin and antiplatelet drugs — increased bleeding risk at high doses',
        'Blood pressure medications — additive hypotension possible'
      ],
      algeria_brands: [
        'Omacor 1g capsules',
        'Oméga 3 Mylan',
        'Maxepa capsules'
      ],
      pharmnet: null
    },
    {
      name: 'Alvityl',
      scientific_name: 'Multivitamin Complex',
      category: 'Vitamins',
      emoji: '💊',
      description: 'Alvityl is a multivitamin supplement used for prevention and correction of multiple vitamin deficiencies, fatigue, and during periods of increased nutritional needs.',
      how_to_take: 'Take 1-2 tablets daily with a meal.',
      side_effects: [
        'Nausea at high doses',
        'Stomach upset'
      ],
      warnings: [
        'Do not combine with other multivitamin supplements',
        'Consult doctor if pregnant'
      ],
      interactions: [
        'May interfere with absorption of certain medications — take 2 hours apart if needed'
      ],
      algeria_brands: [
        'Alvityl tablets',
        'Alvityl syrup'
      ],
      pharmnet: null
    },
    {
      name: 'Befol',
      scientific_name: 'Vitamin B Complex (B1+B6+B9)',
      category: 'Vitamins',
      emoji: '💊',
      description: 'Befol is a B vitamin complex commonly prescribed in Algeria for neuropathy, peripheral nerve pain, and pregnancy supplementation.',
      how_to_take: 'Take once daily with or after a meal.',
      side_effects: [
        'Nausea',
        'Skin flushing (rare)'
      ],
      warnings: [
        'Do not exceed prescribed dose',
        'Inform doctor if pregnant or planning pregnancy'
      ],
      interactions: [
        'Levodopa — high-dose B6 reduces levodopa effectiveness (if not combined with carbidopa)'
      ],
      algeria_brands: [
        'Befol tablets',
        'Bécozyme forte'
      ],
      pharmnet: null
    },
    {
      name: 'Rééquilibre',
      scientific_name: 'Lacteol (Lactobacillus acidophilus)',
      category: 'Vitamins',
      emoji: '🦠',
      description: 'Lacteol Fort is a probiotic used to restore intestinal flora after diarrhea or antibiotic treatment. Widely prescribed in Algeria alongside antibiotics.',
      how_to_take: 'Dissolve sachet in water or sprinkle on food. Take 1-2 sachets daily. Can be taken at any time.',
      side_effects: [
        'Bloating (mild and temporary)',
        'No significant adverse effects'
      ],
      warnings: [
        'Not a treatment for serious infections',
        'Tell doctor if immune system is compromised'
      ],
      interactions: [
        'Take 2 hours apart from antibiotics to maximize effectiveness'
      ],
      algeria_brands: [
        'Lacteol Fort sachets',
        'Ultra-Levure (Saccharomyces boulardii)'
      ],
      pharmnet: null
    },

  // ─── NEUROLOGICAL ──────────────────────────────────────────
    {
      name: 'Depakine',
      scientific_name: 'Valproate Sodium',
      category: 'Neurological',
      emoji: '🧠',
      description: 'Depakine is an anticonvulsant used to treat epilepsy and bipolar disorder. It is a widely used epilepsy medication in Algeria but has serious risks in pregnancy.',
      how_to_take: 'Take with food to reduce stomach upset. Swallow whole — do not crush extended-release tablets. Take at the same time each day.',
      side_effects: [
        'Nausea and vomiting (especially at start)',
        'Tremor',
        'Weight gain',
        'Hair loss (usually temporary)',
        'Drowsiness',
        'Liver toxicity'
      ],
      warnings: [
        'ABSOLUTELY NOT to be used in pregnancy — serious risk of birth defects and developmental problems',
        'Women of childbearing age must use effective contraception and be enrolled in a pregnancy prevention program',
        'Regular liver function tests',
        'Report unusual bleeding or bruising'
      ],
      interactions: [
        'Carbamazepine — reduces valproate levels',
        'Phenytoin — unpredictable mutual interaction',
        'Aspirin — increases valproate levels',
        'Lamotrigine — valproate greatly increases lamotrigine levels'
      ],
      algeria_brands: [
        'Dépakine 200mg',
        'Dépakine 500mg LP',
        'Dépakine Chrono 500mg',
        'Dépakine 200mg/mL oral solution'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'Liste II',
        lab: 'SANOFI AVENTIS',
        generic_official: 'VALPROATE DE SODIUM',
        notice_url: 'https://pharmnet-dz.com/notice.ashx?id=3485',
        pharmnet_url: 'https://pharmnet-dz.com/m-3485-depakine-200mg-comp-gastroresist-b-40',
        dosage_variants: [
          {
            dosage: '200MG',
            form: 'COMP',
            conditioning: 'B/40',
            ppa: null
          },
          {
            dosage: '200MG/ML',
            form: 'SOL. BUV',
            conditioning: 'B/1FL DE 40ML + SERING. P. ADMINIST. ORALE GRADUEE EN MG',
            ppa: null
          },
          {
            dosage: '500MG',
            form: 'COMP',
            conditioning: 'B/40',
            ppa: null
          }
        ]
      }
    },
    {
      name: 'Tégrétol',
      scientific_name: 'Carbamazepine',
      category: 'Neurological',
      emoji: '🧠',
      description: 'Tégrétol is an anticonvulsant used for epilepsy, trigeminal neuralgia (severe facial pain), and bipolar disorder. One of the most used antiepileptics in Algeria.',
      how_to_take: 'Take with food. Start at low dose and increase gradually. Take at the same time each day.',
      side_effects: [
        'Dizziness and drowsiness (especially at start)',
        'Nausea',
        'Blurred vision',
        'Skin rash (stop immediately for severe rash)',
        'Low sodium levels',
        'Rarely: Stevens-Johnson syndrome'
      ],
      warnings: [
        'Stop immediately and seek care for severe skin rash',
        'Blood tests to monitor levels, liver function, and blood counts required',
        'Reduces effectiveness of many medications including contraceptives',
        'Interacts with many medications — always check before adding new drugs'
      ],
      interactions: [
        'Many CYP enzyme inducers/inhibitors — complex interactions',
        'Reduces effectiveness of oral contraceptives, warfarin, antidepressants',
        'Valproate — complex mutual interaction',
        'Erythromycin and azithromycin — increase carbamazepine levels'
      ],
      algeria_brands: [
        'Tégrétol 200mg',
        'Tégrétol 400mg',
        'Tégrétol LP 200mg',
        'Tégrétol LP 400mg'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'Liste II',
        lab: 'NOVARTIS',
        generic_official: 'CARBAMAZEPINE',
        notice_url: 'https://pharmnet-dz.com/notice.ashx?id=3509',
        pharmnet_url: 'https://pharmnet-dz.com/m-3509-tegretol-100mg-5ml-susp-buv-fl-150ml',
        dosage_variants: [
          {
            dosage: '100MG/5ML',
            form: 'SUSP. BUV',
            conditioning: 'FL/150ML',
            ppa: null
          },
          {
            dosage: '200MG',
            form: 'COMP',
            conditioning: 'B/50',
            ppa: null
          }
        ]
      }
    },
    {
      name: 'Lamictal',
      scientific_name: 'Lamotrigine',
      category: 'Neurological',
      emoji: '🧠',
      description: 'Lamictal is an anticonvulsant used for epilepsy and bipolar disorder. Increasingly used in Algeria as a mood stabilizer and add-on epilepsy treatment.',
      how_to_take: 'Take once or twice daily. Start at very low dose and increase very slowly to reduce skin rash risk. Take with or without food.',
      side_effects: [
        'Skin rash (can be severe — stop if rash develops)',
        'Dizziness',
        'Headache',
        'Blurred or double vision',
        'Nausea',
        'Insomnia'
      ],
      warnings: [
        'Increase dose very slowly to minimize rash risk',
        'Stop immediately for any skin rash — Stevens-Johnson syndrome risk',
        'Do not stop suddenly — seizure risk',
        'Valproate greatly increases lamotrigine blood levels requiring dose reduction'
      ],
      interactions: [
        'Valproate — doubles lamotrigine levels — halve lamotrigine dose',
        'Carbamazepine — reduces lamotrigine levels',
        'Oral contraceptives — reduce lamotrigine levels'
      ],
      algeria_brands: [
        'Lamictal 25mg',
        'Lamictal 50mg',
        'Lamictal 100mg',
        'Lamotrigine Mylan'
      ],
      pharmnet: null
    },
    {
      name: 'Rivotril',
      scientific_name: 'Clonazepam',
      category: 'Neurological',
      emoji: '🧠',
      description: 'Rivotril is a benzodiazepine anticonvulsant used for epilepsy (especially absence seizures and myoclonic seizures), panic disorder, and restless legs syndrome.',
      how_to_take: 'Take as directed, usually 2-3 times daily. Do not stop suddenly.',
      side_effects: [
        'Drowsiness (very common)',
        'Dizziness',
        'Coordination problems',
        'Memory problems',
        'Dependence with long-term use'
      ],
      warnings: [
        'Do not drive until you know how it affects you',
        'Do not stop suddenly after prolonged use — seizures and withdrawal risk',
        'Avoid alcohol',
        'Can cause dependence — use only as prescribed'
      ],
      interactions: [
        'Alcohol and CNS depressants — severe respiratory depression risk',
        'Opioids — potentially fatal respiratory depression',
        'Other antiepileptics — complex interactions'
      ],
      algeria_brands: [
        'Rivotril 0.5mg',
        'Rivotril 2mg',
        'Clonazépam Mylan'
      ],
      pharmnet: null
    },
    {
      name: 'Phenobarbital',
      scientific_name: 'Phenobarbital',
      category: 'Neurological',
      emoji: '🧠',
      description: 'Phénobarbital is one of the oldest antiepileptics, still used in Algeria for generalized tonic-clonic seizures and as a sedative. Also used in newborn jaundice treatment.',
      how_to_take: 'Take once daily at bedtime to minimize daytime drowsiness. Do not stop suddenly.',
      side_effects: [
        'Drowsiness',
        'Dizziness',
        'Cognitive slowing',
        'Mood changes',
        'Osteoporosis with long-term use',
        'Dependence'
      ],
      warnings: [
        'Do not stop suddenly — serious seizure risk',
        'Do not drive until stable on medication',
        'Reduces effectiveness of many medications',
        'Vitamin D and calcium supplementation needed long-term'
      ],
      interactions: [
        'Induces liver enzymes — reduces effectiveness of warfarin, oral contraceptives, valproate, corticosteroids, and many others',
        'Valproate — increases phenobarbital levels'
      ],
      algeria_brands: [
        'Gardénal 15mg',
        'Gardénal 50mg',
        'Gardénal 100mg',
        'Phénobarbital Mylan'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'Liste II',
        lab: 'RENAUDIN',
        generic_official: 'PHENOBARBITAL  (SOUS FORME SODIQUE)',
        notice_url: 'https://pharmnet-dz.com//notice.ashx?id=6066',
        pharmnet_url: 'https://pharmnet-dz.com/m-3515-phenobarbial-40mg-pdre-p-sol-inj-b-1amp-de-1ml',
        dosage_variants: [
          {
            dosage: '40MG',
            form: 'PDRE. SOL. INJ',
            conditioning: 'B/1AMP. DE 1ML',
            ppa: null
          }
        ]
      }
    },
    {
      name: 'Séroplex',
      scientific_name: 'Escitalopram',
      category: 'Neurological',
      emoji: '🧠',
      description: 'Séroplex is an SSRI antidepressant used for depression, generalized anxiety disorder, panic disorder, and social anxiety. One of the most commonly prescribed antidepressants in Algeria.',
      how_to_take: 'Take once daily with or without food. Take in the morning or evening. Therapeutic effects may take 2-4 weeks to appear.',
      side_effects: [
        'Nausea (usually settles after 1-2 weeks)',
        'Headache',
        'Insomnia or drowsiness',
        'Sexual dysfunction',
        'Dry mouth',
        'Sweating'
      ],
      warnings: [
        'Do not stop suddenly — taper gradually to avoid withdrawal symptoms',
        'Monitor for suicidal thoughts especially in young adults at the start',
        'QT prolongation — avoid with other QT-prolonging drugs',
        'Allow 14 days after stopping MAOIs before starting'
      ],
      interactions: [
        'MAOIs — potentially fatal serotonin syndrome (contraindicated)',
        'Tramadol — serotonin syndrome risk',
        'QT-prolonging drugs (amiodarone, erythromycin) — cardiac risk'
      ],
      algeria_brands: [
        'Séroplex 5mg',
        'Séroplex 10mg',
        'Séroplex 20mg',
        'Escitalopram Mylan'
      ],
      pharmnet: null
    },
    {
      name: 'Prozac',
      scientific_name: 'Fluoxetine',
      category: 'Neurological',
      emoji: '🧠',
      description: 'Prozac is an SSRI antidepressant used for depression, obsessive-compulsive disorder, bulimia nervosa, and panic disorder. Has a long half-life making it forgiving if doses are occasionally missed.',
      how_to_take: 'Take once daily in the morning with or without food. Effects take 2-6 weeks to appear.',
      side_effects: [
        'Nausea',
        'Headache',
        'Insomnia',
        'Anxiety',
        'Sexual dysfunction',
        'Diarrhea',
        'Weight changes'
      ],
      warnings: [
        'Do not stop suddenly',
        'Monitor for suicidal thoughts in young adults',
        'Allow 14 days after stopping MAOIs',
        'Long washout period needed — wait 5 weeks after stopping Prozac before starting MAOIs'
      ],
      interactions: [
        'MAOIs — contraindicated (serotonin syndrome)',
        'Warfarin — increased bleeding risk',
        'Tramadol — serotonin syndrome risk',
        'Many drug interactions due to CYP2D6 inhibition'
      ],
      algeria_brands: [
        'Prozac 20mg',
        'Fluoxétine Mylan'
      ],
      pharmnet: null
    },
    {
      name: 'Laroxyl',
      scientific_name: 'Amitriptyline',
      category: 'Neurological',
      emoji: '🧠',
      description: 'Laroxyl is a tricyclic antidepressant used for depression, neuropathic pain, migraine prevention, and insomnia. At low doses (10-25mg) it is widely used in Algeria for chronic pain management.',
      how_to_take: 'Take at bedtime (the sedating effect is a benefit). Start at low dose and increase gradually. Take with or without food.',
      side_effects: [
        'Dry mouth (very common)',
        'Drowsiness',
        'Constipation',
        'Urinary retention',
        'Dizziness on standing',
        'Weight gain',
        'Blurred vision'
      ],
      warnings: [
        'Do not drive until effects are known',
        'Do not stop suddenly after prolonged use',
        'Use with caution in elderly — falls risk',
        'Avoid in cardiac arrhythmias and recent heart attack'
      ],
      interactions: [
        'MAOIs — contraindicated (potentially fatal)',
        'Alcohol and sedatives — severe drowsiness',
        'Tramadol and SSRIs — serotonin syndrome risk',
        'Anticholinergic drugs — additive effects'
      ],
      algeria_brands: [
        'Laroxyl 25mg',
        'Laroxyl 50mg',
        'Laroxyl drops 40mg/mL',
        'Amitriptyline Mylan'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'Liste I',
        lab: 'ROCHE',
        generic_official: 'AMITRIPTYLINE CHLORHYDRATE EXPRIME EN AMITRIPTYLINE',
        notice_url: 'https://pharmnet-dz.com/notice.ashx?id=2516',
        pharmnet_url: 'https://pharmnet-dz.com/m-2516-laroxyl-25mg-comp-pelli-b-60-',
        dosage_variants: [
          {
            dosage: '25MG',
            form: 'COMP. PELLI',
            conditioning: 'B/60',
            ppa: null
          },
          {
            dosage: '50MG',
            form: 'COMP. PELLI',
            conditioning: 'B/20',
            ppa: null
          }
        ]
      }
    },
    {
      name: 'Effexor',
      scientific_name: 'Venlafaxine',
      category: 'Neurological',
      emoji: '🧠',
      description: 'Effexor is an SNRI (serotonin-norepinephrine reuptake inhibitor) antidepressant used for major depression, generalized anxiety disorder, social anxiety, and panic disorder.',
      how_to_take: 'Take once daily with food (extended-release). Start at low dose and increase gradually. Do not crush extended-release capsules.',
      side_effects: [
        'Nausea (especially at start)',
        'Headache',
        'Dizziness',
        'Dry mouth',
        'Sweating',
        'Elevated blood pressure at higher doses',
        'Sexual dysfunction'
      ],
      warnings: [
        'Monitor blood pressure — may increase at higher doses',
        'Do not stop suddenly — withdrawal symptoms can be severe',
        'Allow 14 days after stopping MAOIs',
        'Monitor for suicidal thoughts'
      ],
      interactions: [
        'MAOIs — contraindicated',
        'Tramadol — serotonin syndrome risk',
        'Sumatriptan — serotonin syndrome risk',
        'Warfarin — monitor closely'
      ],
      algeria_brands: [
        'Effexor LP 37.5mg',
        'Effexor LP 75mg',
        'Effexor LP 150mg',
        'Venlafaxine Mylan'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'Liste I',
        lab: 'WYETH PHARMACEUTICALS',
        generic_official: 'VENLAFAXINE CHLORHYDRATE EXPRIME EN VENLAFAXINE',
        notice_url: 'https://pharmnet-dz.com/notice.ashx?id=2575',
        pharmnet_url: 'https://pharmnet-dz.com/m-2575-effexor-lp-37-5mg-gles-lp-b-30',
        dosage_variants: [
          {
            dosage: '37,5MG',
            form: 'GLES. LP',
            conditioning: 'B/30',
            ppa: null
          }
        ]
      }
    },
    {
      name: 'Lexomil',
      scientific_name: 'Bromazepam',
      category: 'Neurological',
      emoji: '🧠',
      description: 'Lexomil is a benzodiazepine anxiolytic widely used in Algeria for anxiety, panic attacks, and short-term insomnia. It has a medium duration of action.',
      how_to_take: 'Take 1/2 to 1 tablet 1-3 times daily as prescribed. For insomnia: take 30 minutes before bed.',
      side_effects: [
        'Drowsiness',
        'Dizziness',
        'Coordination problems',
        'Memory impairment',
        'Dependence with prolonged use'
      ],
      warnings: [
        'Do not drive or operate machinery',
        'Avoid alcohol — serious respiratory depression risk',
        'Do not use for more than 4-12 weeks — dependence risk',
        'Do not stop suddenly after prolonged use — withdrawal syndrome'
      ],
      interactions: [
        'Alcohol and opioids — serious respiratory depression',
        'Other CNS depressants — additive sedation',
        'Antifungals (ketoconazole) — increase bromazepam levels'
      ],
      algeria_brands: [
        'Lexomil 6mg',
        'Bromazépam Mylan'
      ],
      pharmnet: null
    },
    {
      name: 'Haldol',
      scientific_name: 'Haloperidol',
      category: 'Neurological',
      emoji: '🧠',
      description: 'Haldol is a first-generation antipsychotic used for schizophrenia, acute psychosis, and severe agitation. Available in tablets, injectable, and long-acting injectable (depot) forms.',
      how_to_take: 'Take as directed by psychiatrist. Oral tablets taken 2-3 times daily. Long-acting injectable given monthly by healthcare professional.',
      side_effects: [
        'Movement disorders (extrapyramidal effects — stiffness, tremor, restlessness)',
        'Drowsiness',
        'Weight gain',
        'QT prolongation',
        'Tardive dyskinesia with long-term use'
      ],
      warnings: [
        'Report any muscle stiffness, tremor, or involuntary movements immediately',
        'Monitor ECG for QT prolongation',
        'Avoid in Parkinson\'s disease',
        'Do not stop without medical guidance'
      ],
      interactions: [
        'QT-prolonging drugs — additive cardiac risk',
        'CNS depressants — additive sedation',
        'Lithium — increased neurotoxicity risk',
        'Rifampicin — reduces haloperidol levels'
      ],
      algeria_brands: [
        'Haldol 1mg',
        'Haldol 5mg',
        'Haldol Decanoas 50mg/mL injectable'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'Liste I',
        lab: 'JANSSEN CILAG',
        generic_official: 'HALOPERIDOL',
        notice_url: 'https://pharmnet-dz.com/notice.ashx?id=2228',
        pharmnet_url: 'https://pharmnet-dz.com/m-2228-haldol-5mg-ml-sol-inj-b-5-amp-de-1ml',
        dosage_variants: [
          {
            dosage: '5MG/ML',
            form: 'SOL. INJ',
            conditioning: 'B/5 AMP de 1ML',
            ppa: null
          }
        ]
      }
    },
    {
      name: 'Tercian',
      scientific_name: 'Cyamemazine',
      category: 'Neurological',
      emoji: '🧠',
      description: 'Tercian is a phenothiazine antipsychotic used in Algeria for anxiety, agitation, insomnia, and as an adjunct in schizophrenia treatment. Available as tablets and syrup.',
      how_to_take: 'Take as prescribed, usually 1-3 times daily. Syrup form for easier dosing.',
      side_effects: [
        'Drowsiness',
        'Dry mouth',
        'Constipation',
        'Dizziness',
        'Movement disorders (less common than older antipsychotics)'
      ],
      warnings: [
        'Do not drive',
        'Avoid alcohol',
        'Monitor heart rhythm',
        'Avoid in Parkinson\'s disease'
      ],
      interactions: [
        'CNS depressants — additive sedation',
        'QT-prolonging drugs — cardiac risk',
        'Levodopa — reduced effectiveness'
      ],
      algeria_brands: [
        'Tercian 25mg',
        'Tercian 100mg',
        'Tercian syrup 40mg/mL'
      ],
      pharmnet: null
    },
    {
      name: 'Risperdal',
      scientific_name: 'Risperidone',
      category: 'Neurological',
      emoji: '🧠',
      description: 'Risperdal is an atypical antipsychotic used for schizophrenia, bipolar disorder, and behavioral disturbances in dementia. Increasingly available in Algeria.',
      how_to_take: 'Take once or twice daily with or without food. Oral solution available for patients who cannot swallow tablets.',
      side_effects: [
        'Weight gain',
        'Drowsiness',
        'Dizziness',
        'Movement disorders (less than typical antipsychotics)',
        'Elevated prolactin (breast changes, menstrual irregularities)',
        'QT prolongation'
      ],
      warnings: [
        'Monitor weight and metabolic parameters regularly',
        'Avoid in elderly with dementia — increased mortality risk',
        'Monitor for signs of high blood sugar',
        'Do not stop suddenly'
      ],
      interactions: [
        'QT-prolonging drugs — cardiac risk',
        'Carbamazepine — reduces risperidone levels',
        'CNS depressants — additive sedation'
      ],
      algeria_brands: [
        'Risperdal 1mg',
        'Risperdal 2mg',
        'Risperdal 4mg',
        'Risperdal Consta (monthly injection)'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'Liste I',
        lab: 'JANSSEN CILAG',
        generic_official: 'RISPERIDONE',
        notice_url: 'https://pharmnet-dz.com/notice.ashx?id=2263',
        pharmnet_url: 'https://pharmnet-dz.com/m-2263-risperdal-1mg-ml-sol-buv-fl-60ml',
        dosage_variants: [
          {
            dosage: '1MG/ML',
            form: 'SOL. BUV. GTTES',
            conditioning: 'FL./60ML',
            ppa: null
          }
        ]
      }
    },
    {
      name: 'Zyprexa',
      scientific_name: 'Olanzapine',
      category: 'Neurological',
      emoji: '🧠',
      description: 'Zyprexa is an atypical antipsychotic used for schizophrenia and bipolar disorder. Has significant sedating and appetite-stimulating properties.',
      how_to_take: 'Take once daily at bedtime with or without food.',
      side_effects: [
        'Significant weight gain',
        'Elevated blood sugar',
        'Drowsiness',
        'Dry mouth',
        'Constipation',
        'Metabolic syndrome'
      ],
      warnings: [
        'Monitor blood sugar and weight regularly',
        'Avoid in patients with diabetes — worsens glucose control',
        'Not for elderly dementia patients',
        'Do not stop suddenly'
      ],
      interactions: [
        'Fluvoxamine — significantly increases olanzapine levels',
        'Carbamazepine — reduces olanzapine levels',
        'CNS depressants — additive sedation'
      ],
      algeria_brands: [
        'Zyprexa 5mg',
        'Zyprexa 10mg',
        'Zyprexa Zydis (dissolving tablet) 5mg',
        'Olanzapine Mylan'
      ],
      pharmnet: null
    },
    {
      name: 'Imovane',
      scientific_name: 'Zopiclone',
      category: 'Neurological',
      emoji: '🌙',
      description: 'Imovane is a non-benzodiazepine hypnotic (Z-drug) used for short-term treatment of insomnia. It helps with sleep onset and maintenance.',
      how_to_take: 'Take 1 tablet (7.5mg) at bedtime. Only when needed. Short-term use only (max 4 weeks).',
      side_effects: [
        'Bitter or metallic taste (very common)',
        'Drowsiness next morning',
        'Dry mouth',
        'Dizziness',
        'Dependence with prolonged use'
      ],
      warnings: [
        'Do not drive the morning after — impairs driving',
        'Short-term use only — risk of dependence',
        'Avoid alcohol',
        'Do not stop abruptly if used regularly'
      ],
      interactions: [
        'Alcohol — additive sedation, seriously impairs driving',
        'Opioids — respiratory depression risk',
        'Erythromycin — increases zopiclone levels'
      ],
      algeria_brands: [
        'Imovane 7.5mg',
        'Zopiclone Mylan 7.5mg'
      ],
      pharmnet: null
    },
    {
      name: 'Stilnox',
      scientific_name: 'Zolpidem',
      category: 'Neurological',
      emoji: '🌙',
      description: 'Stilnox is a non-benzodiazepine hypnotic for short-term insomnia treatment. It works quickly (within 15 minutes) and should be taken just before sleep.',
      how_to_take: 'Take 10mg immediately before bed. Be ready to sleep when you take it. Do not take if you will not have 7-8 hours for sleep.',
      side_effects: [
        'Drowsiness next morning',
        'Dizziness',
        'Headache',
        'Paradoxical agitation (rare)',
        'Sleepwalking, sleep-eating, sleep-driving (rare but serious)'
      ],
      warnings: [
        'Risk of complex sleep behaviors — stop and tell doctor if unusual nighttime behaviors occur',
        'Do not drive the next day',
        'Short-term use only',
        'Avoid alcohol'
      ],
      interactions: [
        'Alcohol — dangerous respiratory depression and complex sleep behaviors',
        'CNS depressants — additive sedation',
        'Ketoconazole — increases zolpidem levels'
      ],
      algeria_brands: [
        'Stilnox 10mg',
        'Zolpidem Mylan 10mg'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'Liste I',
        lab: 'SANOFI AVENTIS',
        generic_official: 'ZOLPIDEM',
        notice_url: 'https://pharmnet-dz.com/notice.ashx?id=2191',
        pharmnet_url: 'https://pharmnet-dz.com/m-2191-stilnox-10mg-comp-pelli-sec-b-14',
        dosage_variants: [
          {
            dosage: '10MG',
            form: 'COMP. PELLI',
            conditioning: 'B/14',
            ppa: '267.00 DA'
          }
        ]
      }
    },

  // ─── UROLOGY ───────────────────────────────────────────────
    {
      name: 'Josir',
      scientific_name: 'Tamsulosin',
      category: 'Urology',
      emoji: '🫀',
      description: 'Josir is an alpha-1 blocker used to treat lower urinary tract symptoms from benign prostatic hyperplasia (enlarged prostate) — improving urine flow and reducing the need to strain when urinating.',
      how_to_take: 'Take once daily 30 minutes after the same meal each day. Swallow whole.',
      side_effects: [
        'Dizziness (especially on standing up — orthostatic hypotension)',
        'Ejaculation disorders',
        'Headache',
        'Fatigue',
        'Runny nose'
      ],
      warnings: [
        'Rise slowly from sitting to avoid dizziness — falls risk in elderly',
        'Tell ophthalmologist before cataract surgery — floppy iris syndrome risk',
        'Do not use with phosphodiesterase inhibitors (sildenafil) for first-dose hypotension risk'
      ],
      interactions: [
        'Sildenafil (Viagra) — severe hypotension',
        'Cimetidine — increases tamsulosin levels',
        'Other alpha-blockers — additive hypotension'
      ],
      algeria_brands: [
        'Josir 0.4mg',
        'Tamsulosine Mylan 0.4mg',
        'Omix 0.4mg'
      ],
      pharmnet: null
    },
    {
      name: 'Xatral',
      scientific_name: 'Alfuzosin',
      category: 'Urology',
      emoji: '🫀',
      description: 'Xatral is an alpha-blocker for benign prostatic hyperplasia symptoms. It relaxes smooth muscle in the prostate and bladder neck to improve urine flow.',
      how_to_take: 'Take 1 tablet (10mg) once daily immediately after the same meal each day. Swallow whole.',
      side_effects: [
        'Dizziness on standing',
        'Headache',
        'Fatigue',
        'Digestive disturbance'
      ],
      warnings: [
        'Rise slowly to avoid dizziness',
        'Tell ophthalmologist before eye surgery',
        'Avoid with potent CYP3A4 inhibitors'
      ],
      interactions: [
        'Ketoconazole and ritonavir — avoid combination',
        'Other antihypertensives — additive hypotension',
        'PDE5 inhibitors — hypotension risk'
      ],
      algeria_brands: [
        'Xatral OD 10mg',
        'Alfuzosine Mylan'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'N/D',
        lab: 'SANOFI AVENTIS',
        generic_official: 'ALFUZOSINE CHLORHYDRATE',
        notice_url: 'https://pharmnet-dz.com/notice.ashx?id=1158',
        pharmnet_url: 'https://pharmnet-dz.com/m-1158-xatral-lp-5mg-comp-pelli-lp-b-56',
        dosage_variants: [
          {
            dosage: '5MG',
            form: 'COMP. PELLI. LP',
            conditioning: 'B/56',
            ppa: '1813.00 DA'
          }
        ]
      }
    },
    {
      name: 'Chibro-Proscar',
      scientific_name: 'Finasteride',
      category: 'Urology',
      emoji: '🫀',
      description: 'Chibro-Proscar is a 5-alpha reductase inhibitor used to treat benign prostatic hyperplasia. It shrinks the prostate over time (3-6 months) and reduces the need for prostate surgery.',
      how_to_take: 'Take once daily with or without food. Effect takes 3-6 months to appear. Continue for long-term benefit.',
      side_effects: [
        'Decreased libido',
        'Erectile dysfunction',
        'Decreased ejaculate volume',
        'Breast tenderness or enlargement',
        'Depression (rare)'
      ],
      warnings: [
        'Women should not handle crushed tablets (teratogenic — risk to male fetus)',
        'May reduce PSA levels — inform urologist',
        'Report any mood changes or depression',
        'Improvement takes 3-6 months'
      ],
      interactions: [
        'Few significant drug interactions'
      ],
      algeria_brands: [
        'Chibro-Proscar 5mg',
        'Finastéride Mylan'
      ],
      pharmnet: null
    },

  // ─── ENDOCRINE ─────────────────────────────────────────────
    {
      name: 'Fosamax',
      scientific_name: 'Alendronate',
      category: 'Endocrine',
      emoji: '🦴',
      description: 'Fosamax is a bisphosphonate used to prevent and treat osteoporosis, particularly in postmenopausal women and patients on long-term corticosteroids. Widely prescribed in Algeria.',
      how_to_take: 'Take once weekly on the same day. Take with a full glass of plain water 30 minutes before any food, drink, or medication. Stay upright for at least 30 minutes after.',
      side_effects: [
        'Esophageal irritation (if not taken correctly)',
        'Nausea',
        'Stomach pain',
        'Muscle and joint pain',
        'Rarely: jaw osteonecrosis with long-term use'
      ],
      warnings: [
        'Must remain upright for 30 minutes after taking — risk of severe esophageal damage if lying down',
        'Do not take with food, other drugs, or beverages except plain water',
        'Tell dentist you take alendronate before any dental procedures — jaw bone risk'
      ],
      interactions: [
        'Calcium and antacids — reduce absorption (take at least 30 minutes after alendronate)',
        'NSAIDs — increased GI risk',
        'Aspirin — increased GI irritation'
      ],
      algeria_brands: [
        'Fosamax 70mg (weekly)',
        'Alendronate Mylan 70mg'
      ],
      pharmnet: null
    },
    {
      name: 'Actonel',
      scientific_name: 'Risedronate',
      category: 'Endocrine',
      emoji: '🦴',
      description: 'Actonel is a bisphosphonate for osteoporosis prevention and treatment. Available weekly or monthly, making it convenient for patients.',
      how_to_take: 'Take once weekly or monthly with a full glass of plain water. Take at least 30 minutes before first food. Stay upright for at least 30 minutes.',
      side_effects: [
        'Esophageal irritation',
        'Stomach pain',
        'Nausea',
        'Muscle and joint pain',
        'Jaw osteonecrosis (rare, long-term)'
      ],
      warnings: [
        'Stay upright after taking',
        'Take with plain water only',
        'Tell dentist about use before any dental procedures',
        'Also take calcium and vitamin D unless levels are adequate'
      ],
      interactions: [
        'Calcium, antacids — take separately',
        'NSAIDs — GI irritation risk'
      ],
      algeria_brands: [
        'Actonel 35mg weekly',
        'Actonel 75mg two-day monthly course',
        'Risédronique Mylan'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'Liste I',
        lab: 'SANOFI AVENTIS',
        generic_official: 'ACIDE RISEDRONIQUE SEL MONOSODIQUE',
        notice_url: 'https://pharmnet-dz.com/notice.ashx?id=1415',
        pharmnet_url: 'https://pharmnet-dz.com/m-1415-actonel-5mg-comp-pell-b-28',
        dosage_variants: [
          {
            dosage: '5MG',
            form: 'COMP. PELLI',
            conditioning: 'B/28',
            ppa: '3,656.25 DA'
          },
          {
            dosage: '35MG',
            form: 'COMP. PELLI',
            conditioning: 'B/28',
            ppa: '3,656.25 DA'
          }
        ]
      }
    },

  // ─── OPHTHALMOLOGY ─────────────────────────────────────────
    {
      name: 'Timoptol',
      scientific_name: 'Timolol (eye drops)',
      category: 'Ophthalmology',
      emoji: '👁️',
      description: 'Timoptol eye drops are used to treat glaucoma and elevated intraocular pressure by reducing fluid production in the eye. Even though eye drops, significant amounts are absorbed systemically.',
      how_to_take: 'Instill 1 drop in affected eye(s) twice daily. Press on the inner corner of the eye (nasolacrimal occlusion) for 1 minute after instilling to reduce systemic absorption.',
      side_effects: [
        'Stinging on instillation',
        'Blurred vision (temporary)',
        'Systemic: slow heart rate, low blood pressure, worsening of asthma, fatigue',
        'Eye irritation'
      ],
      warnings: [
        'Tell doctor if you have asthma, COPD, or heart disease — systemic effects are significant',
        'Tell all doctors and dentists you use timolol eye drops',
        'Occlusion of nasolacrimal duct reduces systemic absorption'
      ],
      interactions: [
        'Oral beta-blockers — additive systemic effects',
        'Calcium channel blockers — increased bradycardia risk',
        'Clonidine — additive blood pressure lowering'
      ],
      algeria_brands: [
        'Timoptol 0.25% eye drops',
        'Timoptol 0.5% eye drops',
        'Timoptol XE gel'
      ],
      pharmnet: null
    },
    {
      name: 'Xalatan',
      scientific_name: 'Latanoprost (eye drops)',
      category: 'Ophthalmology',
      emoji: '👁️',
      description: 'Xalatan is a prostaglandin analogue eye drop for glaucoma that reduces intraocular pressure by increasing fluid drainage from the eye. Used once daily at bedtime.',
      how_to_take: 'Instill 1 drop in affected eye(s) at bedtime. Remove contact lenses before instilling and wait 15 minutes before reinserting.',
      side_effects: [
        'Permanent darkening of iris color (especially in hazel/blue eyes)',
        'Eyelash growth and darkening',
        'Eye redness and irritation',
        'Darkening of skin around eye'
      ],
      warnings: [
        'Warn patients that eye and eyelash color may permanently change',
        'Do not use if using two different prostaglandin eye drops',
        'Refrigerate until opening — can store at room temperature for 6 weeks once opened'
      ],
      interactions: [
        'Bimatoprost and other prostaglandin eye drops — avoid combination (reduces effect)',
        'Thimerosal-containing drops — do not use together'
      ],
      algeria_brands: [
        'Xalatan 0.005% eye drops',
        'Latanoprost Mylan'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'Liste I',
        lab: 'PHARMACIA UPJOHN',
        generic_official: 'LATANOPROST',
        notice_url: null,
        pharmnet_url: 'https://pharmnet-dz.com/m-2363-xalatan-50Âµg-ml-0-005--colly-f-2-5ml',
        dosage_variants: [
          {
            dosage: '50ÂµG/ML (0,005%)',
            form: 'COLLY. SOL',
            conditioning: 'F/2,5ML',
            ppa: '1528.78 DA'
          }
        ]
      }
    },

  // ─── DERMATOLOGY ───────────────────────────────────────────
    {
      name: 'Cutacnyl',
      scientific_name: 'Benzoyl Peroxide',
      category: 'Dermatology',
      emoji: '🧴',
      description: 'Cutacnyl is used topically for mild to moderate acne. It kills acne-causing bacteria and helps unblock pores. Widely available in Algerian pharmacies.',
      how_to_take: 'Apply a thin layer to affected areas once or twice daily after washing face. Start with lower concentration to minimize irritation.',
      side_effects: [
        'Skin dryness and peeling (very common at start)',
        'Redness and irritation',
        'Bleaching of fabrics (avoid white clothes, towels, and pillowcases)',
        'Rarely: allergic contact dermatitis'
      ],
      warnings: [
        'Bleaches fabrics — avoid contact with clothing and bedding',
        'Use sunscreen daily — increases photosensitivity',
        'Avoid contact with eyes and mouth',
        'Start with lower strength (2.5%) if skin is sensitive'
      ],
      interactions: [
        'Other acne treatments (tretinoin) — increased skin irritation if used together'
      ],
      algeria_brands: [
        'Cutacnyl 5% gel',
        'Cutacnyl 10% gel',
        'Benzaknen 5%'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'Liste II',
        lab: 'GALDERMA INTERNATIONAL',
        generic_official: 'PEROXYDE DE BENZOYLE',
        notice_url: 'https://pharmnet-dz.com/notice.ashx?id=1663',
        pharmnet_url: 'https://pharmnet-dz.com/m-1663-cutacnyl-0-025-gel-derm-t-40g',
        dosage_variants: [
          {
            dosage: '0.025',
            form: 'GEL. DERM',
            conditioning: 'T/40G',
            ppa: '216.00 DA'
          },
          {
            dosage: '0.05',
            form: 'GEL. DERM',
            conditioning: 'T/40G',
            ppa: null
          },
          {
            dosage: '0.1',
            form: 'GEL. DERM',
            conditioning: 'T/40G',
            ppa: null
          }
        ]
      }
    },
    {
      name: 'Lamisil',
      scientific_name: 'Terbinafine',
      category: 'Dermatology',
      emoji: '🍄',
      description: 'Lamisil is an antifungal used for athlete\'s foot, ringworm, nail fungus, and other dermatophyte infections. Available in oral and topical forms.',
      how_to_take: 'Cream: apply once or twice daily for 1-2 weeks. Tablets: once daily for nail infections (6 weeks for fingernails, 12 weeks for toenails).',
      side_effects: [
        'Cream: skin irritation (rare)',
        'Tablets: nausea, stomach pain, taste disturbances (sometimes prolonged), headache, liver toxicity (rare)'
      ],
      warnings: [
        'Tablet form: monitor liver function — stop if jaundice develops',
        'Taste disturbances may persist for weeks after stopping',
        'Nail treatment requires patience — months to see full results'
      ],
      interactions: [
        'Tablets: rifampicin — reduces terbinafine levels',
        'Cimetidine — increases terbinafine levels',
        'Warfarin — levels may change',
        'CYP2D6 substrates — terbinafine inhibits this enzyme'
      ],
      algeria_brands: [
        'Lamisil 1% cream',
        'Lamisil 250mg tablets',
        'Terbinafine Mylan'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'Liste II',
        lab: 'NOVARTIS',
        generic_official: 'TERBINAFINE CHLORHYDRATE',
        notice_url: 'https://pharmnet-dz.com/notice.ashx?id=478',
        pharmnet_url: 'https://pharmnet-dz.com/m-478-lamisil-0-01-sol-pulv-cutanee-fl-15ml',
        dosage_variants: [
          {
            dosage: '0.01',
            form: 'SOL. APP. LOCALE',
            conditioning: 'FL./15ML',
            ppa: null
          }
        ]
      }
    },
    {
      name: 'Terbinafine',
      scientific_name: 'Terbinafine',
      category: 'Dermatology',
      emoji: '🍄',
      description: 'Generic terbinafine for fungal skin and nail infections — same as Lamisil but available at lower cost in Algeria.',
      how_to_take: 'Same as Lamisil — cream once or twice daily; tablets once daily.',
      side_effects: [
        'Same as Lamisil brand'
      ],
      warnings: [
        'Same as Lamisil brand — monitor liver function with tablets'
      ],
      interactions: [
        'Same as Lamisil brand'
      ],
      algeria_brands: [
        'Terbinafine Mylan 250mg',
        'Terbinafine 1% crème'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'Liste II',
        lab: 'BEKER LABORATOIRES',
        generic_official: 'TERBINAFINE CHLORHYDRATE EXPRIME EN TERBINAFINE',
        notice_url: 'https://pharmnet-dz.com//notice.ashx?id=896',
        pharmnet_url: 'https://pharmnet-dz.com/m-4570-terbinafine-beker-250mg-comp-secable-b-20',
        dosage_variants: [
          {
            dosage: '250MG',
            form: 'COMP. SEC',
            conditioning: 'B/20',
            ppa: '1500.00 DA'
          }
        ]
      }
    },
    {
      name: 'Daktarin',
      scientific_name: 'Miconazole',
      category: 'Dermatology',
      emoji: '🍄',
      description: 'Daktarin is a topical antifungal cream used for skin and nail fungal infections, oral thrush (gel form), and athlete\'s foot. Very commonly used in Algeria.',
      how_to_take: 'Cream: Apply twice daily to affected area and rub in gently. Continue for at least 1 week after symptoms clear. Oral gel: apply to affected area in mouth 4 times daily.',
      side_effects: [
        'Skin irritation',
        'Burning sensation',
        'Contact dermatitis (rare)'
      ],
      warnings: [
        'Oral gel may interact with warfarin and oral antidiabetics — inform your doctor',
        'Continue full course even after symptoms improve to prevent recurrence'
      ],
      interactions: [
        'Oral gel: warfarin — significantly increases anticoagulant effect',
        'Oral gel: sulfonylureas — may increase hypoglycemia risk'
      ],
      algeria_brands: [
        'Daktarin 2% cream',
        'Daktarin oral gel 20mg/g'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'Liste I',
        lab: 'EL KENDI',
        generic_official: 'MICONAZOLE',
        notice_url: 'https://pharmnet-dz.com//notice.ashx?id=1142',
        pharmnet_url: 'https://pharmnet-dz.com/m-5922-daktazol-2g-gel-buccal-t-40g',
        dosage_variants: [
          {
            dosage: '2G%',
            form: 'GEL',
            conditioning: 'T/40G',
            ppa: null
          }
        ]
      }
    },
    {
      name: 'Bétaméthasone crème',
      scientific_name: 'Betamethasone',
      category: 'Dermatology',
      emoji: '🧴',
      description: 'Bétaméthasone is a potent topical corticosteroid cream used for eczema, psoriasis, contact dermatitis, and other inflammatory skin conditions.',
      how_to_take: 'Apply a thin layer to affected skin once or twice daily. Rub in gently. Do not cover with airtight bandages unless instructed.',
      side_effects: [
        'Skin thinning with prolonged use',
        'Stretch marks',
        'Easy bruising',
        'Systemic effects with extensive use',
        'Acne',
        'Skin color changes'
      ],
      warnings: [
        'Do not use on the face, underarms, or groin for extended periods',
        'Not for prolonged use — skin atrophy risk',
        'Not for use in children without medical guidance',
        'Do not use on infected skin unless combined with an antibiotic'
      ],
      interactions: [
        'Systemic effects possible if extensive use — may affect diabetes control'
      ],
      algeria_brands: [
        'Bétaméthasone 0.05% crème',
        'Diprosone crème',
        'Célestoderm V'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'Liste I',
        lab: 'NOVAPHARM TRADING',
        generic_official: 'BETAMETHASONE',
        notice_url: null,
        pharmnet_url: 'https://pharmnet-dz.com/m-4364-betamethasone-novagenerics-0-0005-creme-t-15g',
        dosage_variants: [
          {
            dosage: '0.05%',
            form: 'CRÃME',
            conditioning: 'T/15G',
            ppa: null
          },
          {
            dosage: '0.0005',
            form: 'PDE. DERM',
            conditioning: 'T/15G',
            ppa: null
          },
          {
            dosage: '0.001',
            form: 'PDE. DERM',
            conditioning: 'T/15G',
            ppa: null
          }
        ]
      }
    },

  // ─── NEUROLOGICAL ──────────────────────────────────────────
    {
      name: 'Surmontil',
      scientific_name: 'Trimipramine',
      category: 'Neurological',
      emoji: '🧠',
      description: 'Surmontil is a tricyclic antidepressant with sedating properties used for depression with anxiety and insomnia. Also prescribed for neuropathic pain at lower doses.',
      how_to_take: 'Take at bedtime (main dose) with or without food. May divide into 2-3 doses during the day.',
      side_effects: [
        'Drowsiness',
        'Dry mouth',
        'Constipation',
        'Urinary retention',
        'Dizziness on standing',
        'Weight gain'
      ],
      warnings: [
        'Do not stop suddenly after prolonged use',
        'Do not drive',
        'Avoid alcohol',
        'Use with caution in cardiac disease and elderly'
      ],
      interactions: [
        'MAOIs — contraindicated',
        'Alcohol and CNS depressants — severe sedation',
        'Anticholinergic drugs — additive effects'
      ],
      algeria_brands: [
        'Surmontil 25mg',
        'Surmontil 100mg'
      ],
      pharmnet: {
        refundable: null,
        prescription_list: 'Liste I',
        lab: 'BIOPHARM',
        generic_official: 'TRIMIPRAMINE',
        notice_url: null,
        pharmnet_url: 'https://pharmnet-dz.com/m-2547-surmontil-0-04-sol-buv-gttes-fl-compte-gttes-30ml',
        dosage_variants: [
          {
            dosage: '0.04',
            form: 'SOL. BUV. GTTES',
            conditioning: 'FL.COMPTE GTTES./30ML',
            ppa: null
          },
          {
            dosage: '25MG',
            form: 'COMP',
            conditioning: 'B/50',
            ppa: null
          }
        ]
      }
    },
    {
      name: 'Anafranil',
      scientific_name: 'Clomipramine',
      category: 'Neurological',
      emoji: '🧠',
      description: 'Anafranil is a tricyclic antidepressant specifically effective for obsessive-compulsive disorder (OCD), panic disorder, and depression. It has a strong serotonergic component.',
      how_to_take: 'Take with food. Start at low dose and increase gradually. Take the main dose at bedtime to reduce daytime drowsiness.',
      side_effects: [
        'Dry mouth',
        'Constipation',
        'Drowsiness',
        'Weight gain',
        'Sexual dysfunction',
        'Urinary retention',
        'Tremor'
      ],
      warnings: [
        'Do not stop suddenly',
        'Avoid in patients with heart disease',
        'Seizure threshold lowered',
        'Allow 14 days between stopping MAOIs and starting'
      ],
      interactions: [
        'MAOIs — contraindicated',
        'Alcohol and CNS depressants',
        'SSRIs — serotonin syndrome risk if combined'
      ],
      algeria_brands: [
        'Anafranil 10mg',
        'Anafranil 25mg',
        'Anafranil 75mg LP'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'Liste I',
        lab: 'DEFIANTE FARMACEUTICA LDA',
        generic_official: 'CLOMIPRAMINE CHLORHYDRATE',
        notice_url: 'https://pharmnet-dz.com/notice.ashx?id=2532',
        pharmnet_url: 'https://pharmnet-dz.com/m-2532-anafranil-10mg-comp-enro-b-60',
        dosage_variants: [
          {
            dosage: '10MG',
            form: 'COMP. PELLI',
            conditioning: 'B/60',
            ppa: '282.00 DA'
          },
          {
            dosage: '25MG',
            form: 'COMP. PELLI',
            conditioning: 'B/50',
            ppa: null
          },
          {
            dosage: '25MG/2ML',
            form: 'SOL. INJ',
            conditioning: 'B/05',
            ppa: null
          },
          {
            dosage: '75MG',
            form: 'COMP. PELLI',
            conditioning: 'B/20',
            ppa: null
          }
        ]
      }
    },
    {
      name: 'Paxil',
      scientific_name: 'Paroxetine',
      category: 'Neurological',
      emoji: '🧠',
      description: 'Paxil is an SSRI antidepressant used for depression, anxiety disorders, OCD, post-traumatic stress disorder, and social phobia. Has a more significant discontinuation syndrome than other SSRIs.',
      how_to_take: 'Take once daily in the morning with food. Do not stop abruptly — taper dose gradually.',
      side_effects: [
        'Nausea',
        'Drowsiness or insomnia',
        'Sexual dysfunction',
        'Weight gain',
        'Dry mouth',
        'Sweating',
        'Severe discontinuation syndrome'
      ],
      warnings: [
        'Taper dose very slowly when stopping — significant discontinuation symptoms',
        'Monitor for suicidal thoughts especially in young adults',
        'Not for use in pregnancy — cardiac effects in newborns'
      ],
      interactions: [
        'MAOIs — contraindicated',
        'Tramadol — serotonin syndrome',
        'Tamoxifen — reduces tamoxifen effectiveness',
        'Warfarin — increased bleeding risk'
      ],
      algeria_brands: [
        'Deroxat 20mg',
        'Paroxétine Mylan 20mg'
      ],
      pharmnet: null
    },
    {
      name: 'Zoloft',
      scientific_name: 'Sertraline',
      category: 'Neurological',
      emoji: '🧠',
      description: 'Zoloft is an SSRI antidepressant used for depression, OCD, panic disorder, PTSD, and social anxiety. Generally well tolerated with a favorable safety profile in various populations.',
      how_to_take: 'Take once daily, morning or evening, with or without food. Therapeutic effects take 2-4 weeks.',
      side_effects: [
        'Nausea',
        'Diarrhea',
        'Insomnia',
        'Sexual dysfunction',
        'Dry mouth',
        'Tremor',
        'Sweating'
      ],
      warnings: [
        'Do not stop suddenly — taper gradually',
        'Monitor for suicidal ideation in young adults',
        'Allow 14 days after stopping MAOIs',
        'Can interact with many medications'
      ],
      interactions: [
        'MAOIs — contraindicated',
        'Tramadol — serotonin syndrome risk',
        'Warfarin — increased anticoagulant effect',
        'Pimozide — contraindicated'
      ],
      algeria_brands: [
        'Zoloft 50mg',
        'Zoloft 100mg',
        'Sertraline Mylan'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'Liste I',
        lab: 'PFIZER PHARM ALGERIE',
        generic_official: 'SERTRALINE CHLORHYDRATE EXPRIME EN SERTRALINE',
        notice_url: 'https://pharmnet-dz.com/notice.ashx?id=2562',
        pharmnet_url: 'https://pharmnet-dz.com/m-2562-zoloft-50mg-gles-b-14-',
        dosage_variants: [
          {
            dosage: '50MG',
            form: 'GLES',
            conditioning: 'B/14',
            ppa: '602.00 DA'
          }
        ]
      }
    },
    {
      name: 'Stablon',
      scientific_name: 'Tianeptine',
      category: 'Neurological',
      emoji: '🧠',
      description: 'Stablon is a unique antidepressant with an atypical mechanism (enhances serotonin reuptake) used for depression, particularly in anxious-depressive states. Widely prescribed in Algeria.',
      how_to_take: 'Take 1 tablet (12.5mg) 3 times daily before meals.',
      side_effects: [
        'Nausea',
        'Constipation',
        'Abdominal pain',
        'Drowsiness',
        'Dizziness',
        'Dry mouth'
      ],
      warnings: [
        'Do not use with MAOIs',
        'Not for use in patients under 15',
        'Risk of misuse and dependence reported — use only as prescribed',
        'Do not stop suddenly after prolonged use'
      ],
      interactions: [
        'MAOIs — contraindicated (2-week washout required)',
        'Alcohol — increased sedation'
      ],
      algeria_brands: [
        'Stablon 12.5mg'
      ],
      pharmnet: null
    },
    {
      name: 'Témésta',
      scientific_name: 'Lorazepam',
      category: 'Neurological',
      emoji: '🧠',
      description: 'Témésta is a benzodiazepine used for anxiety, short-term insomnia, and alcohol withdrawal. Also used in hospitals for sedation and seizure management.',
      how_to_take: 'Take 1mg 2-3 times daily for anxiety. For insomnia: 1-2mg at bedtime. Use the lowest effective dose for the shortest time.',
      side_effects: [
        'Drowsiness',
        'Dizziness',
        'Coordination problems',
        'Memory impairment',
        'Dependence with prolonged use'
      ],
      warnings: [
        'Short-term use only — risk of physical and psychological dependence',
        'Do not drive',
        'Avoid alcohol',
        'Do not stop abruptly after prolonged use'
      ],
      interactions: [
        'Alcohol and opioids — serious respiratory depression risk',
        'Other CNS depressants — additive sedation',
        'Valproate — increases lorazepam levels'
      ],
      algeria_brands: [
        'Témésta 1mg',
        'Lorazépam Mylan'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'Liste I',
        lab: 'LABORATOIRES SALEM',
        generic_official: 'LORAZEPAM',
        notice_url: 'https://pharmnet-dz.com/notice.ashx?id=2840',
        pharmnet_url: 'https://pharmnet-dz.com/m-2840-temesta-1mg-comp-sec-b-30-',
        dosage_variants: [
          {
            dosage: '1MG',
            form: 'COMP. PELLI',
            conditioning: 'B/30',
            ppa: null
          },
          {
            dosage: '2,5MG',
            form: 'COMP. SEC',
            conditioning: 'B/30',
            ppa: null
          }
        ]
      }
    },
    {
      name: 'Urbanyl',
      scientific_name: 'Clobazam',
      category: 'Neurological',
      emoji: '🧠',
      description: 'Urbanyl is a 1,5-benzodiazepine used as an adjunct treatment for epilepsy, particularly Lennox-Gastaut syndrome, and for anxiety. It has a somewhat different receptor profile from other benzodiazepines.',
      how_to_take: 'Take 1-3 times daily as prescribed. Doses are adjusted based on response and tolerance.',
      side_effects: [
        'Drowsiness',
        'Dizziness',
        'Aggression or irritability',
        'Constipation',
        'Coordination problems'
      ],
      warnings: [
        'Do not stop suddenly in epilepsy — seizure risk',
        'Risk of dependence',
        'Caution in elderly and children',
        'Do not drive'
      ],
      interactions: [
        'Alcohol and CNS depressants — excessive sedation',
        'Valproate — increases clobazam levels',
        'Carbamazepine — reduces clobazam levels',
        'Ketoconazole — increases active metabolite levels'
      ],
      algeria_brands: [
        'Urbanyl 5mg',
        'Urbanyl 10mg',
        'Urbanyl 20mg'
      ],
      pharmnet: null
    },
    {
      name: 'Migranal',
      scientific_name: 'Ergotamine + Caffeine',
      category: 'Neurological',
      emoji: '🧠',
      description: 'Migranal is used to relieve acute migraine headaches. It contains ergotamine which constricts dilated blood vessels causing migraine pain, plus caffeine which enhances absorption.',
      how_to_take: 'Take at the first sign of migraine. 1-2 tablets at onset, repeat every 30 minutes if needed. Do not exceed 6 tablets per attack or 10 per week.',
      side_effects: [
        'Nausea and vomiting',
        'Tingling in hands and feet',
        'Weakness',
        'Rarely: ergotism with overuse'
      ],
      warnings: [
        'Do not overuse — ergotism and medication overuse headache risk',
        'Not for prevention — acute treatment only',
        'Not for cardiovascular disease, hypertension, or pregnancy'
      ],
      interactions: [
        'Triptans — do not combine (24-hour interval required)',
        'Macrolide antibiotics and azole antifungals — increase ergotamine levels dangerously',
        'Beta-blockers — peripheral vasoconstriction increases'
      ],
      algeria_brands: [
        'Migwell',
        'Cafergot (Ergotamine + Caffeine)'
      ],
      pharmnet: null
    },
    {
      name: 'Imigrane',
      scientific_name: 'Sumatriptan',
      category: 'Neurological',
      emoji: '🧠',
      description: 'Imigrane is a triptan used for acute migraine attacks with or without aura, and cluster headaches. It works by constricting blood vessels and blocking pain pathways.',
      how_to_take: 'Take 1 tablet (50mg or 100mg) at onset of migraine. May repeat after 2 hours if migraine returns. Maximum 2 tablets in 24 hours.',
      side_effects: [
        'Tingling',
        'Flushing',
        'Dizziness',
        'Heaviness in chest or throat',
        'Drowsiness',
        'Nausea'
      ],
      warnings: [
        'Not for prevention — acute treatment only',
        'Not for cardiovascular disease, stroke history, or uncontrolled hypertension',
        'Do not use within 24 hours of ergotamine',
        'Chest tightness is usually not cardiac but seek care if severe'
      ],
      interactions: [
        'Ergotamine — contraindicated within 24 hours',
        'MAOIs — contraindicated',
        'SSRIs and SNRIs — serotonin syndrome risk',
        'Lithium — serotonin syndrome risk'
      ],
      algeria_brands: [
        'Imigrane 50mg',
        'Imigrane 100mg',
        'Sumatriptan Mylan'
      ],
      pharmnet: null
    },

  // ─── ENDOCRINE ─────────────────────────────────────────────
    {
      name: 'Synacthen',
      scientific_name: 'Tetracosactide',
      category: 'Endocrine',
      emoji: '💊',
      description: 'Synacthen is a synthetic ACTH analogue used diagnostically to test adrenal gland function (Synacthen stimulation test), and therapeutically for inflammatory conditions.',
      how_to_take: 'Administered by injection by a healthcare professional. Depot form given IM every 2-3 days.',
      side_effects: [
        'Injection site reactions',
        'Allergic reactions',
        'Side effects of corticosteroid excess with depot form'
      ],
      warnings: [
        'Diagnostic use requires hospital monitoring',
        'Depot form has corticosteroid-like side effects — do not stop suddenly after prolonged use',
        'Allergy testing recommended before use'
      ],
      interactions: [
        'Similar to corticosteroid interactions in depot form'
      ],
      algeria_brands: [
        'Synacthen 0.25mg injectable',
        'Synacthen Retard 1mg depot'
      ],
      pharmnet: null
    },
    {
      name: 'Dostinex',
      scientific_name: 'Cabergoline',
      category: 'Endocrine',
      emoji: '💊',
      description: 'Dostinex is a dopamine agonist used to treat elevated prolactin levels (hyperprolactinemia) from pituitary adenoma, and to suppress breast milk production after delivery.',
      how_to_take: 'Take twice weekly with food. Take at the same time on the same two days each week.',
      side_effects: [
        'Nausea',
        'Headache',
        'Dizziness',
        'Fatigue',
        'Constipation',
        'Orthostatic hypotension (especially first dose)'
      ],
      warnings: [
        'First dose may cause sudden drop in blood pressure — sit or lie down after taking',
        'Monitor heart valves with long-term use',
        'Psychiatric symptoms can occur (compulsive behaviors)'
      ],
      interactions: [
        'Antihypertensives — additive hypotension',
        'Metoclopramide and domperidone — reduce effectiveness (dopamine antagonists)',
        'Erythromycin — increases cabergoline levels'
      ],
      algeria_brands: [
        'Dostinex 0.5mg',
        'Cabergoline Mylan'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'Liste I',
        lab: 'PFIZER HOLDING FRANCE',
        generic_official: 'CABERGOLINE',
        notice_url: 'https://pharmnet-dz.com/notice.ashx?id=616',
        pharmnet_url: 'https://pharmnet-dz.com/m-616-dostinex-0-5mg-comp--pilulier-08',
        dosage_variants: [
          {
            dosage: '0,5MG',
            form: 'COMP',
            conditioning: 'PILULIER/08',
            ppa: '3129.83 DA'
          }
        ]
      }
    },
    {
      name: 'Somatuline',
      scientific_name: 'Lanreotide',
      category: 'Endocrine',
      emoji: '💉',
      description: 'Somatuline is a somatostatin analogue used to treat acromegaly (excess growth hormone) and neuroendocrine tumors. Given as a monthly deep subcutaneous injection.',
      how_to_take: 'Injected by a healthcare professional once monthly into the upper outer buttock area.',
      side_effects: [
        'Diarrhea',
        'Gallstones (long-term)',
        'Stomach pain',
        'Injection site reactions',
        'Blood sugar changes'
      ],
      warnings: [
        'Gallbladder monitoring recommended with long-term use',
        'Monitor blood sugar — may reduce insulin secretion',
        'Do not administer intravenously'
      ],
      interactions: [
        'Cyclosporine — reduce cyclosporine dose when starting lanreotide',
        'Insulin and antidiabetics — dose adjustment may be needed'
      ],
      algeria_brands: [
        'Somatuline Autogel 60mg',
        'Somatuline Autogel 90mg',
        'Somatuline Autogel 120mg'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'Liste I',
        lab: 'IPSEN PHARMA',
        generic_official: 'LANREOTIDE ACETATE EXPRIME EN LANREOTIDE',
        notice_url: 'https://pharmnet-dz.com/notice.ashx?id=3832',
        pharmnet_url: 'https://pharmnet-dz.com/m-3832-somatuline-lp-120mg-sering-de-0-5ml-sol-inj-sc-profonde-lp-en-sering-prerempl-b-01seringue-preremplie-de-0-5ml-avec-un-systÃ¨me-de-securite--aiguille',
        dosage_variants: [
          {
            dosage: '120MG/SERING. DE 0,5ML',
            form: 'SOL. INJ. LP',
            conditioning: 'B/01SERINGUE PREREMPLIE DE 0,5ML AVEC UN SYSTÃME DE SECURITE + AIGUILLE',
            ppa: '140671.00 DA'
          },
          {
            dosage: '30MG',
            form: 'PDRE. SOL. INJ',
            conditioning: 'B/1+1',
            ppa: null
          },
          {
            dosage: '60MG/SERING. DE 0,5ML',
            form: 'SOL. INJ. LP',
            conditioning: 'B/01SERINGUE PREREMPLIE DE 0,5ML AVEC UN SYSTÃME DE SECURITE + AIGUILLE',
            ppa: '103906.00 DA'
          },
          {
            dosage: '90MG/SERING. DE 0,5ML',
            form: 'SOL. INJ. LP',
            conditioning: 'B/01SERINGUE PREREMPLIE DE 0,5ML AVEC UN SYSTÃME DE SECURITE + AIGUILLE',
            ppa: '129820.00 DA'
          }
        ]
      }
    },

  // ─── RHEUMATOLOGY ──────────────────────────────────────────
    {
      name: 'Méthotrexate',
      scientific_name: 'Methotrexate',
      category: 'Rheumatology',
      emoji: '💊',
      description: 'Méthotrexate is a disease-modifying antirheumatic drug (DMARD) used for rheumatoid arthritis, psoriasis, and psoriatic arthritis. At low weekly doses it suppresses the overactive immune response causing joint destruction.',
      how_to_take: 'Take ONCE PER WEEK (not daily) — this is critical. Take on the same day each week. Always take with folic acid (on non-methotrexate days).',
      side_effects: [
        'Nausea and vomiting',
        'Mouth ulcers',
        'Fatigue',
        'Liver toxicity',
        'Bone marrow suppression',
        'Lung toxicity (rare)'
      ],
      warnings: [
        'NEVER take daily — weekly dosing only — daily dosing is potentially fatal',
        'Take folic acid supplementation on non-methotrexate days to reduce side effects',
        'Regular blood tests (CBC, liver function) are mandatory',
        'Report any breathlessness, persistent cough, mouth ulcers, or unusual bruising',
        'Not safe in pregnancy — teratogenic'
      ],
      interactions: [
        'NSAIDs — increase methotrexate toxicity',
        'Trimethoprim/Bactrim — serious toxicity',
        'Penicillins — increase methotrexate levels',
        'Alcohol — increases liver toxicity'
      ],
      algeria_brands: [
        'Méthotrexate 2.5mg tablets',
        'Méthotrexate 25mg/mL injectable',
        'Novatrex 2.5mg',
        'Imeth 7.5mg/15mg/25mg auto-injector'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'Liste I',
        lab: 'RHONE POULENC RORER',
        generic_official: 'METHOTREXATE',
        notice_url: 'https://pharmnet-dz.com/notice.ashx?id=989',
        pharmnet_url: 'https://pharmnet-dz.com/m-989-methotrexate-bellon-2-5mg-comp-b-20',
        dosage_variants: [
          {
            dosage: '2,5MG',
            form: 'COMP',
            conditioning: 'B/20',
            ppa: null
          },
          {
            dosage: '500MG/FL. DE PDRE.',
            form: 'PDRE. SOL. INJ',
            conditioning: 'B/10 FL (500 MG/20ML)',
            ppa: null
          },
          {
            dosage: '5MG/2ML',
            form: 'SOL. INJ',
            conditioning: 'B/1FL',
            ppa: null
          }
        ]
      }
    },
    {
      name: 'Plaquenil',
      scientific_name: 'Hydroxychloroquine',
      category: 'Rheumatology',
      emoji: '💊',
      description: 'Plaquenil is a disease-modifying drug used for rheumatoid arthritis, lupus (SLE), and other autoimmune conditions. It also has antimalarial properties. Requires regular eye monitoring.',
      how_to_take: 'Take once or twice daily with food to reduce stomach upset. Therapeutic effect takes 3-6 months to appear.',
      side_effects: [
        'Nausea and stomach upset',
        'Headache',
        'Skin rash',
        'Rare but important: retinal damage with long-term use'
      ],
      warnings: [
        'Annual eye examination (retinal screening) is mandatory with long-term use',
        'Stop and inform doctor if any visual changes occur',
        'May prolong QT interval',
        'Do not use in patients with G6PD deficiency'
      ],
      interactions: [
        'Amiodarone and other QT-prolonging drugs — cardiac risk',
        'Antidiabetics — may enhance glucose lowering',
        'Cyclosporine — levels may increase'
      ],
      algeria_brands: [
        'Plaquenil 200mg',
        'Hydroxychloroquine Mylan'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'N/D',
        lab: 'SANOFI SYNTHELABO',
        generic_official: 'HYDROXYCHLOROQUINE',
        notice_url: 'https://pharmnet-dz.com/notice.ashx?id=1414',
        pharmnet_url: 'https://pharmnet-dz.com/m-1414-plaquenil-200mg-comp-enro-b-30',
        dosage_variants: [
          {
            dosage: '200MG',
            form: 'COMP. PELLI',
            conditioning: 'B/30',
            ppa: null
          }
        ]
      }
    },
    {
      name: 'Adalimumab',
      scientific_name: 'Adalimumab',
      category: 'Rheumatology',
      emoji: '💉',
      description: 'Adalimumab is a biologic DMARD (anti-TNF) used for moderate-to-severe rheumatoid arthritis, ankylosing spondylitis, psoriatic arthritis, Crohn\'s disease, and psoriasis when conventional treatments fail.',
      how_to_take: 'Inject subcutaneously every 2 weeks (for most indications). Inject into abdomen or thigh. Rotate sites.',
      side_effects: [
        'Injection site reactions',
        'Increased infection risk (including TB reactivation)',
        'Headache',
        'Rash',
        'Rarely: serious infections, demyelinating disorders'
      ],
      warnings: [
        'Screen for tuberculosis (TB) before starting — reactivation risk',
        'Report any signs of infection promptly',
        'Do not use with live vaccines',
        'Stop before surgery'
      ],
      interactions: [
        'Anakinra — serious infection risk (contraindicated)',
        'Live vaccines — contraindicated during treatment',
        'Abatacept — increased infection risk'
      ],
      algeria_brands: [
        'Humira 40mg/0.8mL pre-filled pen',
        'Adalimumab biosimilar (available in Algeria at reduced cost)'
      ],
      pharmnet: null
    },
    {
      name: 'Salazopyrine',
      scientific_name: 'Sulfasalazine',
      category: 'Rheumatology',
      emoji: '💊',
      description: 'Salazopyrine is a DMARD used for rheumatoid arthritis, ankylosing spondylitis, and inflammatory bowel disease (Crohn\'s, ulcerative colitis).',
      how_to_take: 'Take with food and plenty of water. Start at low dose and increase gradually. Take 2-4 times daily.',
      side_effects: [
        'Nausea and vomiting',
        'Headache',
        'Skin rash',
        'Urine/skin may turn orange (harmless)',
        'Reduced male fertility (reversible)',
        'Blood count changes'
      ],
      warnings: [
        'Tell doctor if sulfonamide or aspirin allergic',
        'Regular blood tests required',
        'Orange discoloration of urine is normal and harmless',
        'Drink plenty of fluids'
      ],
      interactions: [
        'Warfarin — increased anticoagulant effect',
        'Methotrexate — increased toxicity risk',
        'Digoxin — reduced digoxin absorption',
        'Folic acid — reduces absorption (take at different times)'
      ],
      algeria_brands: [
        'Salazopyrine 500mg',
        'Sulfasalazine Mylan'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'N/D',
        lab: 'PHARMACIA UPJOHN',
        generic_official: 'SALAZOSULFAPYRIDINE',
        notice_url: 'https://pharmnet-dz.com/notice.ashx?id=2980',
        pharmnet_url: 'https://pharmnet-dz.com/m-2980-salazopyrin-en-500mg-comp-b-100',
        dosage_variants: [
          {
            dosage: '500MG',
            form: 'COMP',
            conditioning: 'B/100',
            ppa: null
          }
        ]
      }
    },

  // ─── ONCOLOGY SUPPORT ──────────────────────────────────────
    {
      name: 'Zofran',
      scientific_name: 'Ondansetron',
      category: 'Oncology Support',
      emoji: '💊',
      description: 'Zofran is a 5-HT3 antagonist antiemetic used to prevent and treat nausea and vomiting caused by chemotherapy, radiotherapy, and surgery. One of the most effective antiemetics available.',
      how_to_take: 'Take 30 minutes before chemotherapy or radiotherapy. Can be taken with or without food. Also available as injectable and orally dissolving tablet.',
      side_effects: [
        'Headache',
        'Constipation',
        'Flushing',
        'QT prolongation at higher doses',
        'Dizziness'
      ],
      warnings: [
        'Monitor ECG if at risk of QT prolongation',
        'Avoid other QT-prolonging medications',
        'Constipation may require laxative treatment'
      ],
      interactions: [
        'QT-prolonging drugs — cardiac risk',
        'Apomorphine — severe hypotension (contraindicated)',
        'Phenytoin, carbamazepine, rifampicin — reduce ondansetron effectiveness'
      ],
      algeria_brands: [
        'Zofran 4mg',
        'Zofran 8mg',
        'Ondansetron Mylan',
        'Setron 8mg'
      ],
      pharmnet: null
    },
    {
      name: 'Decadron',
      scientific_name: 'Dexamethasone (oncology use)',
      category: 'Oncology Support',
      emoji: '💊',
      description: 'Dexamethasone is used in oncology as part of anti-emetic regimens with chemotherapy, for cerebral edema from brain tumors, and as part of certain cancer treatment protocols.',
      how_to_take: 'Dose and schedule determined by oncologist. In chemotherapy anti-emesis: usually taken the morning of and for 2-3 days after chemotherapy.',
      side_effects: [
        'Insomnia',
        'Elevated blood sugar',
        'Mood changes (euphoria or anxiety)',
        'Fluid retention',
        'Increased appetite'
      ],
      warnings: [
        'Inform oncologist about all medications',
        'Monitor blood sugar in diabetics',
        'Do not stop abruptly if taken for more than a week'
      ],
      interactions: [
        'Same as dexamethasone in the pain section'
      ],
      algeria_brands: [
        'Dexaméthasone 4mg injectable',
        'Dexaméthasone 8mg injectable',
        'Dectancyl 0.5mg tablets'
      ],
      pharmnet: null
    },
    {
      name: 'Leucovorine',
      scientific_name: 'Calcium Folinate (Leucovorin)',
      category: 'Oncology Support',
      emoji: '💊',
      description: 'Leucovorine is used to reduce the toxic effects of methotrexate (leucovorin rescue), and as part of colorectal cancer chemotherapy regimens (FOLFOX, FOLFIRI) to enhance the effect of 5-fluorouracil.',
      how_to_take: 'Administered by healthcare professionals in oncology or rheumatology settings. Timing critical relative to methotrexate.',
      side_effects: [
        'Nausea',
        'Allergic reactions',
        'Rarely: seizures with high doses'
      ],
      warnings: [
        'Not a substitute for folic acid supplementation in methotrexate-treated patients',
        'Timing of administration relative to methotrexate is critical'
      ],
      interactions: [
        'Methotrexate — rescue agent, given 24 hours after methotrexate for high-dose protocols',
        '5-Fluorouracil — leucovorin enhances its anticancer effect'
      ],
      algeria_brands: [
        'Leucovorine calcique 25mg injectable',
        'Calcium Folinate 50mg/mL'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'N/D',
        lab: 'CLS PHARMA',
        generic_official: 'MEQUINOL',
        notice_url: 'https://pharmnet-dz.com/notice.ashx?id=526',
        pharmnet_url: 'https://pharmnet-dz.com/m-526-leucodinine-b-0-1-pde-t-30g',
        dosage_variants: [
          {
            dosage: '0.1',
            form: 'PDE. DERM',
            conditioning: 'T/30G',
            ppa: null
          }
        ]
      }
    },

  // ─── GYNECOLOGY ────────────────────────────────────────────
    {
      name: 'Duphaston',
      scientific_name: 'Dydrogesterone',
      category: 'Gynecology',
      emoji: '🩺',
      description: 'Duphaston is a synthetic progestogen used for endometriosis, irregular menstruation, threatened miscarriage, premenstrual syndrome, and hormone replacement therapy. Very widely prescribed in Algeria.',
      how_to_take: 'Dosage and timing depend on indication. For threatened miscarriage: usually 40mg immediately then 10mg every 8 hours. Follow prescribed schedule precisely.',
      side_effects: [
        'Headache',
        'Nausea',
        'Breast tenderness',
        'Irregular bleeding',
        'Dizziness'
      ],
      warnings: [
        'Do not stop suddenly in threatened miscarriage without medical guidance',
        'Tell doctor if you have liver disease or a history of blood clots',
        'Inform doctor if you miss a period while taking it'
      ],
      interactions: [
        'Rifampicin and other liver enzyme inducers — reduce effectiveness',
        'Phenytoin and carbamazepine — reduce effectiveness'
      ],
      algeria_brands: [
        'Duphaston 10mg',
        'Dydrogestérone Mylan'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'Liste I',
        lab: 'SOLVAY PHARMA',
        generic_official: 'DYDROGESTERONE',
        notice_url: 'https://pharmnet-dz.com/notice.ashx?id=3816',
        pharmnet_url: 'https://pharmnet-dz.com/m-3816-duphaston-10mg-comp-pelli-b-10',
        dosage_variants: [
          {
            dosage: '10MG',
            form: 'COMP. PELLI',
            conditioning: 'B/10',
            ppa: null
          }
        ]
      }
    },
    {
      name: 'Utrogestan',
      scientific_name: 'Micronised Progesterone',
      category: 'Gynecology',
      emoji: '🩺',
      description: 'Utrogestan is a natural progesterone supplement used for luteal phase support in fertility treatments, threatened miscarriage prevention, and hormone replacement therapy.',
      how_to_take: 'Can be taken orally or inserted vaginally (vaginal route preferred for fertility treatment). Usually 1-3 capsules daily as prescribed.',
      side_effects: [
        'Drowsiness (oral route — common)',
        'Dizziness',
        'Breast tenderness',
        'Headache',
        'Nausea'
      ],
      warnings: [
        'Oral use causes drowsiness — take at bedtime',
        'Vaginal route avoids first-pass metabolism and drowsiness',
        'Not a contraceptive'
      ],
      interactions: [
        'Rifampicin, phenytoin, carbamazepine — reduce effectiveness'
      ],
      algeria_brands: [
        'Utrogestan 100mg capsules',
        'Utrogestan 200mg capsules',
        'Progesterone Mylan'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'Liste I',
        lab: 'BESINS INTERNATIONAL',
        generic_official: 'PROGESTERONE',
        notice_url: 'https://pharmnet-dz.com/notice.ashx?id=3822',
        pharmnet_url: 'https://pharmnet-dz.com/m-3822-utrogestan-100mg-caps-molle-ora-ou-vagi-b-30-',
        dosage_variants: [
          {
            dosage: '100MG',
            form: 'CAPS. MOLLE',
            conditioning: 'B/30',
            ppa: '728.00 DA'
          },
          {
            dosage: '200MG',
            form: 'CAPS. MOLLE',
            conditioning: 'B/15',
            ppa: null
          }
        ]
      }
    },
    {
      name: 'Clomid',
      scientific_name: 'Clomiphene Citrate',
      category: 'Gynecology',
      emoji: '🩺',
      description: 'Clomid is used to stimulate ovulation in women with infertility due to anovulation (absence of ovulation), including polycystic ovarian syndrome (PCOS). Widely used in Algerian fertility clinics.',
      how_to_take: 'Take once daily for 5 days starting on day 2-5 of menstrual cycle. Used for up to 6 cycles typically.',
      side_effects: [
        'Hot flushes',
        'Nausea',
        'Breast tenderness',
        'Mood changes',
        'Headache',
        'Visual disturbances (stop and seek care)',
        'Ovarian cysts'
      ],
      warnings: [
        'Stop and inform doctor immediately for any visual disturbances',
        'Risk of multiple pregnancy (twins)',
        'Ovarian hyperstimulation syndrome risk',
        'Ovarian cysts should resolve between cycles'
      ],
      interactions: [
        'Few significant drug interactions at standard doses'
      ],
      algeria_brands: [
        'Clomid 50mg',
        'Clomiphène Mylan 50mg',
        'Prolifen 50mg'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'Liste I',
        lab: 'SANOFI AVENTIS',
        generic_official: 'CLOMIFENE CITRATE',
        notice_url: 'https://pharmnet-dz.com/notice.ashx?id=3810',
        pharmnet_url: 'https://pharmnet-dz.com/m-3810-clomid-50mg-comp-b-5-',
        dosage_variants: [
          {
            dosage: '50MG',
            form: 'COMP. SEC',
            conditioning: 'B/5',
            ppa: null
          }
        ]
      }
    },
    {
      name: 'Mifégyne',
      scientific_name: 'Mifepristone',
      category: 'Gynecology',
      emoji: '🩺',
      description: 'Mifégyne is a progesterone antagonist used medically to terminate early pregnancy (up to 49 days) in combination with misoprostol, and to prepare the cervix for delivery.',
      how_to_take: 'Administered under strict medical supervision in a healthcare facility only. One tablet taken followed 36-48 hours later by misoprostol.',
      side_effects: [
        'Cramping and bleeding',
        'Nausea',
        'Vomiting',
        'Diarrhea',
        'Headache'
      ],
      warnings: [
        'Use only under medical supervision',
        'Ectopic pregnancy must be ruled out before use',
        'Follow-up appointment essential to confirm complete treatment',
        'Emergency care required for heavy bleeding or signs of infection'
      ],
      interactions: [
        'NSAIDs — reduce mifepristone effectiveness (avoid for 8-12 days)',
        'Corticosteroids — mifepristone may reduce their effectiveness'
      ],
      algeria_brands: [
        'Mifégyne 200mg (available through regulated medical channels)'
      ],
      pharmnet: null
    },
    {
      name: 'Premarin',
      scientific_name: 'Conjugated Estrogens',
      category: 'Gynecology',
      emoji: '🩺',
      description: 'Premarin is used for hormone replacement therapy (HRT) in menopausal women to relieve hot flushes, night sweats, vaginal dryness, and to prevent osteoporosis.',
      how_to_take: 'Take once daily (oral), continuously or cyclically as prescribed. Cream: apply to vaginal area daily.',
      side_effects: [
        'Breast tenderness',
        'Nausea',
        'Headache',
        'Fluid retention',
        'Vaginal bleeding',
        'Increased clotting risk'
      ],
      warnings: [
        'Always combine with progestogen if uterus is intact to prevent endometrial cancer',
        'Increased risk of breast cancer with long-term combined HRT',
        'Increased clotting and stroke risk',
        'Regular mammography and gynecological review essential'
      ],
      interactions: [
        'Rifampicin and anticonvulsants — reduce effectiveness',
        'Warfarin — may reduce anticoagulant effect',
        'Thyroid medication — may need dose adjustment'
      ],
      algeria_brands: [
        'Premarin 0.625mg',
        'Premarin cream',
        'Climara patch (estradiol — related)'
      ],
      pharmnet: null
    },
    {
      name: 'Cytotec',
      scientific_name: 'Misoprostol',
      category: 'Gynecology',
      emoji: '🩺',
      description: 'Cytotec is a prostaglandin E1 analogue used for gastric ulcer protection (with NSAIDs), cervical ripening before delivery, and medical termination of pregnancy (with mifepristone). Also used for postpartum hemorrhage prevention.',
      how_to_take: 'Dosage and route (oral, sublingual, vaginal, rectal) depend entirely on indication. Follow prescribed protocol exactly.',
      side_effects: [
        'Cramping and uterine contractions',
        'Nausea',
        'Diarrhea',
        'Fever',
        'Shivering'
      ],
      warnings: [
        'Not for use in pregnancy for gastric ulcers (causes uterine contractions)',
        'Medical supervision required for obstetric uses',
        'Severe cramping and bleeding expected when used for uterine indications'
      ],
      interactions: [
        'Mifepristone — combined for medical abortion protocol',
        'NSAIDs — may reduce misoprostol effectiveness'
      ],
      algeria_brands: [
        'Cytotec 200mcg',
        'Misoprostol Mylan'
      ],
      pharmnet: null
    },

  // ─── INFECTIOUS DISEASE ────────────────────────────────────
    {
      name: 'Zentel',
      scientific_name: 'Albendazole',
      category: 'Infectious Disease',
      emoji: '🦠',
      description: 'Zentel is a broad-spectrum antiparasitic drug used for intestinal worms (roundworms, threadworms, hookworms, pinworms), hydatid disease (caused by Echinococcus), and neurocysticercosis.',
      how_to_take: 'For intestinal worms: single 400mg dose taken with food. For tissue infections: 400mg twice daily for 28 days, repeated in cycles.',
      side_effects: [
        'Nausea and stomach pain',
        'Headache',
        'Dizziness',
        'Liver enzyme elevation (with prolonged use)'
      ],
      warnings: [
        'Monitor liver function with prolonged treatment',
        'Not for use in first trimester of pregnancy',
        'Repeat treatment may be needed for family members'
      ],
      interactions: [
        'Cimetidine — increases albendazole active metabolite levels',
        'Dexamethasone — increases albendazole levels',
        'Praziquantel — increases levels'
      ],
      algeria_brands: [
        'Zentel 400mg tablets',
        'Zentel suspension 200mg/5mL'
      ],
      pharmnet: null
    },
    {
      name: 'Fasigyne',
      scientific_name: 'Tinidazole',
      category: 'Infectious Disease',
      emoji: '🦠',
      description: 'Fasigyne is an antiprotozoal and antibacterial agent used for giardiasis, amoebic dysentery, bacterial vaginosis, trichomoniasis, and H. pylori eradication. Single or short-course therapy.',
      how_to_take: 'Take with food to reduce stomach upset. Usually single dose (2g) or 3-5 day course depending on indication.',
      side_effects: [
        'Metallic taste',
        'Nausea',
        'Stomach discomfort',
        'Headache',
        'Urine may darken (harmless)'
      ],
      warnings: [
        'Absolutely avoid alcohol during treatment and for 72 hours after — serious disulfiram-like reaction',
        'Not for use in first trimester of pregnancy'
      ],
      interactions: [
        'Alcohol — severe disulfiram-like reaction (avoid for 72 hours after)',
        'Warfarin — increased anticoagulant effect'
      ],
      algeria_brands: [
        'Fasigyne 500mg',
        'Tinidazole Mylan'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'Liste I',
        lab: 'PFIZER PHARM ALGERIE',
        generic_official: 'TINIDAZOLE',
        notice_url: 'https://pharmnet-dz.com/notice.ashx?id=2057',
        pharmnet_url: 'https://pharmnet-dz.com/m-2057-fasigyne-500mg-comp-enro-b-4',
        dosage_variants: [
          {
            dosage: '500MG',
            form: 'COMP. PELLI',
            conditioning: 'B/4',
            ppa: null
          }
        ]
      }
    },
    {
      name: 'Nivaquine',
      scientific_name: 'Chloroquine',
      category: 'Infectious Disease',
      emoji: '🦠',
      description: 'Nivaquine is used for malaria prevention and treatment, and for autoimmune conditions (lupus, rheumatoid arthritis). Requires regular eye monitoring with long-term use.',
      how_to_take: 'For malaria prevention: take once weekly starting 1 week before travel. For treatment: dose prescribed by physician. With food to reduce stomach upset.',
      side_effects: [
        'Nausea',
        'Headache',
        'Visual disturbances',
        'Skin rash',
        'Retinal damage with long-term use',
        'QT prolongation'
      ],
      warnings: [
        'Annual eye exam mandatory for long-term use',
        'Stop and seek care for any visual changes',
        'Not for use with epilepsy',
        'QT prolongation — avoid with other QT-prolonging drugs'
      ],
      interactions: [
        'QT-prolonging drugs — cardiac risk',
        'Antacids — reduce absorption (take 4 hours apart)',
        'Amiodarone — increased arrhythmia risk'
      ],
      algeria_brands: [
        'Nivaquine 100mg',
        'Chloroquine Mylan'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'Liste II',
        lab: 'RHONE POULENC RORER',
        generic_official: 'CHLOROQUINE',
        notice_url: 'https://pharmnet-dz.com/notice.ashx?id=2054',
        pharmnet_url: 'https://pharmnet-dz.com/m-2054-nivaquine-100mg-comp-b-20',
        dosage_variants: [
          {
            dosage: '100MG',
            form: 'COMP',
            conditioning: 'B/20',
            ppa: null
          }
        ]
      }
    },
    {
      name: 'Aralen',
      scientific_name: 'Chloroquine Phosphate',
      category: 'Infectious Disease',
      emoji: '🦠',
      description: 'Aralen is another brand of chloroquine used for malaria and autoimmune diseases in Algeria. Same drug as Nivaquine, different brand.',
      how_to_take: 'Same as Nivaquine — take with food, weekly for prevention.',
      side_effects: [
        'Same as Nivaquine'
      ],
      warnings: [
        'Regular eye monitoring required with long-term use'
      ],
      interactions: [
        'Same as Nivaquine'
      ],
      algeria_brands: [
        'Aralen 250mg',
        'Aralen 500mg'
      ],
      pharmnet: null
    },
    {
      name: 'Malarone',
      scientific_name: 'Atovaquone + Proguanil',
      category: 'Infectious Disease',
      emoji: '🦠',
      description: 'Malarone is used for malaria prevention and treatment, particularly for travel to areas with chloroquine-resistant malaria. Taken daily (versus weekly for chloroquine).',
      how_to_take: 'Prevention: start 1-2 days before travel, take daily throughout stay, and 7 days after return. Take with food.',
      side_effects: [
        'Nausea and vomiting',
        'Stomach pain',
        'Headache',
        'Diarrhea',
        'Cough'
      ],
      warnings: [
        'Take with food to reduce side effects',
        'Not for severe kidney disease',
        'If vomiting within 1 hour of dose, repeat the dose'
      ],
      interactions: [
        'Rifampicin — reduces effectiveness significantly',
        'Tetracyclines — reduce effectiveness',
        'Metoclopramide — reduces atovaquone levels'
      ],
      algeria_brands: [
        'Malarone 250mg/100mg',
        'Malarone Junior (pediatric)'
      ],
      pharmnet: null
    },

  // ─── ALLERGY ───────────────────────────────────────────────
    {
      name: 'Zyrtec',
      scientific_name: 'Cetirizine',
      category: 'Allergy',
      emoji: '🌿',
      description: 'Zyrtec is a second-generation antihistamine used for allergic rhinitis, urticaria (hives), and other allergic conditions. Less sedating than older antihistamines.',
      how_to_take: 'Take 1 tablet (10mg) once daily, with or without food. Can be taken at night if drowsiness occurs.',
      side_effects: [
        'Drowsiness (less than older antihistamines)',
        'Dry mouth',
        'Headache',
        'Fatigue',
        'Nausea'
      ],
      warnings: [
        'May still cause drowsiness — caution when driving',
        'Reduce dose in severe kidney disease',
        'Avoid alcohol'
      ],
      interactions: [
        'Alcohol — increased sedation',
        'CNS depressants — additive drowsiness',
        'Theophylline at high doses — reduces cetirizine clearance'
      ],
      algeria_brands: [
        'Zyrtec 10mg',
        'Cétirizine Mylan 10mg',
        'Virlix 10mg'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'Liste II',
        lab: 'UCB PHARMA',
        generic_official: 'CETIRIZINE DICHLORHYDRATE',
        notice_url: 'https://pharmnet-dz.com/notice.ashx?id=4025',
        pharmnet_url: 'https://pharmnet-dz.com/m-4025-zyrtec-10mg-ml-sol-buv-gttes-b-01fl-compte-gttes-de-15ml',
        dosage_variants: [
          {
            dosage: '10MG/ML',
            form: 'SOL. BUV. GTTES',
            conditioning: 'B/01FL COMPTE GTTES DE 15ML',
            ppa: '348.00 DA'
          }
        ]
      }
    },
    {
      name: 'Clarityne',
      scientific_name: 'Loratadine',
      category: 'Allergy',
      emoji: '🌿',
      description: 'Clarityne is a non-sedating second-generation antihistamine for allergic rhinitis, urticaria, and seasonal allergies. Safe for use during the day without causing drowsiness.',
      how_to_take: 'Take 1 tablet (10mg) once daily with or without food. Consistently non-sedating at recommended dose.',
      side_effects: [
        'Headache',
        'Dry mouth',
        'Fatigue',
        'Very rarely: drowsiness'
      ],
      warnings: [
        'One of the safest antihistamines for daytime use',
        'Reduce dose in severe liver disease',
        'Safe in pregnancy (consult doctor)'
      ],
      interactions: [
        'Ketoconazole and erythromycin — slightly increase loratadine levels (not clinically significant at standard doses)'
      ],
      algeria_brands: [
        'Clarityne 10mg',
        'Loratadine Mylan',
        'Claritin 10mg'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'Liste II',
        lab: 'SCHERING PLOUGH',
        generic_official: 'LORATADINE',
        notice_url: 'https://pharmnet-dz.com/notice.ashx?id=4002',
        pharmnet_url: 'https://pharmnet-dz.com/m-4002-clarityne-1mg-ml-sirop-fl-60ml',
        dosage_variants: [
          {
            dosage: '1MG/ML',
            form: 'SIROP',
            conditioning: 'FL./60ML',
            ppa: '392.31 DA'
          }
        ]
      }
    },
    {
      name: 'Aerius',
      scientific_name: 'Desloratadine',
      category: 'Allergy',
      emoji: '🌿',
      description: 'Aerius is a second-generation non-sedating antihistamine for chronic urticaria and allergic rhinitis. It is the active metabolite of loratadine with slightly improved potency.',
      how_to_take: 'Take 1 tablet (5mg) once daily with or without food.',
      side_effects: [
        'Headache',
        'Fatigue',
        'Dry mouth',
        'Very rarely: drowsiness'
      ],
      warnings: [
        'Dose reduction in severe kidney or liver disease',
        'One of the most non-sedating antihistamines'
      ],
      interactions: [
        'Few clinically significant interactions at standard doses'
      ],
      algeria_brands: [
        'Aerius 5mg',
        'Desloratadine Mylan 5mg'
      ],
      pharmnet: null
    },
    {
      name: 'Polaramine',
      scientific_name: 'Dexchlorpheniramine',
      category: 'Allergy',
      emoji: '🌿',
      description: 'Polaramine is a first-generation antihistamine used for allergic rhinitis, urticaria, and allergic reactions. More sedating than newer antihistamines — useful for night-time allergy symptoms.',
      how_to_take: 'Take 2mg 3-4 times daily or 6mg (slow-release) twice daily. Take with food or milk.',
      side_effects: [
        'Significant drowsiness (very common)',
        'Dry mouth',
        'Constipation',
        'Urinary retention',
        'Blurred vision',
        'Confusion in elderly'
      ],
      warnings: [
        'Do not drive or operate machinery',
        'Avoid alcohol',
        'Use with extreme caution in elderly — falls and confusion risk',
        'Not recommended during work or driving hours'
      ],
      interactions: [
        'Alcohol and CNS depressants — severe sedation',
        'MAOIs — prolonged anticholinergic effects',
        'Anticholinergic drugs — additive effects'
      ],
      algeria_brands: [
        'Polaramine 2mg',
        'Polaramine Répétabs 6mg SR',
        'Déxchlorphéniramine Mylan'
      ],
      pharmnet: {
        refundable: null,
        prescription_list: 'N/D',
        lab: 'SCHERING PLOUGH',
        generic_official: 'DEXCHLORPHENIRAMINE MALEATE',
        notice_url: 'https://pharmnet-dz.com//notice.ashx?id=6072',
        pharmnet_url: 'https://pharmnet-dz.com/m-3976-polaramine-5mg-ml-sol-inj-b-05-amp-de-1ml',
        dosage_variants: [
          {
            dosage: '5MG/ML',
            form: 'SOL. INJ',
            conditioning: 'B/05 AMP. DE 1ML',
            ppa: null
          }
        ]
      }
    },
    {
      name: 'Phenergan',
      scientific_name: 'Promethazine',
      category: 'Allergy',
      emoji: '🌿',
      description: 'Phenergan is a first-generation antihistamine used for allergies, nausea, motion sickness, and as a pre-medication sedative. Highly sedating.',
      how_to_take: 'For allergies: 25mg at night. For nausea: 25mg at onset. Take with food.',
      side_effects: [
        'Severe drowsiness',
        'Dry mouth',
        'Constipation',
        'Blurred vision',
        'Urinary retention',
        'Movement disorders (rare)'
      ],
      warnings: [
        'Do not drive — strongly sedating',
        'Avoid alcohol',
        'Not for children under 2 years — respiratory depression risk',
        'Not for elderly with dementia'
      ],
      interactions: [
        'Alcohol and CNS depressants — severe respiratory depression',
        'MAOIs — serious interactions',
        'Anticholinergic drugs — additive effects'
      ],
      algeria_brands: [
        'Phenergan 25mg',
        'Prométhazine Mylan'
      ],
      pharmnet: null
    },
    {
      name: 'Nasonex',
      scientific_name: 'Mometasone (nasal spray)',
      category: 'Allergy',
      emoji: '👃',
      description: 'Nasonex is an intranasal corticosteroid spray for allergic and non-allergic rhinitis, nasal polyps, and seasonal allergies. Minimal systemic absorption at recommended doses.',
      how_to_take: 'Spray 2 puffs into each nostril once daily. Shake well before use. Use regularly for best effect.',
      side_effects: [
        'Nasal irritation',
        'Epistaxis (nosebleed)',
        'Headache',
        'Pharyngitis',
        'Rarely: nasal septal perforation'
      ],
      warnings: [
        'Shake before use',
        'Avoid spraying directly at the nasal septum',
        'If using for more than 3 months, mention to doctor',
        'Do not use if nasal infection present without treatment'
      ],
      interactions: [
        'Ketoconazole — may slightly increase systemic absorption',
        'Few clinically significant interactions at intranasal doses'
      ],
      algeria_brands: [
        'Nasonex 50mcg nasal spray',
        'Mométasone Mylan nasal spray'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'Liste I',
        lab: 'SCHERING PLOUGH',
        generic_official: 'MOMETASONE FUROATE ANHYDRE',
        notice_url: 'https://pharmnet-dz.com/notice.ashx?id=1942',
        pharmnet_url: 'https://pharmnet-dz.com/m-1942-nasonex-50Âµg-dose-susp-p-pulv-nas-fl-120doses-avec-pompe-doseuse',
        dosage_variants: [
          {
            dosage: '50ÂµG/DOSE',
            form: 'SPRAY NAS',
            conditioning: 'FL./120DOSES AVEC POMPE DOSEUSE',
            ppa: null
          }
        ]
      }
    },
    {
      name: 'Avamys',
      scientific_name: 'Fluticasone Furoate (nasal)',
      category: 'Allergy',
      emoji: '👃',
      description: 'Avamys is an intranasal corticosteroid used for seasonal and perennial allergic rhinitis. Provides 24-hour relief from nasal symptoms with once-daily dosing.',
      how_to_take: 'Spray 2 puffs into each nostril once daily. Shake and prime before first use.',
      side_effects: [
        'Nosebleeds',
        'Nasal irritation',
        'Headache',
        'Pharyngitis'
      ],
      warnings: [
        'Shake before use',
        'Do not spray directly onto septum',
        'Some systemic absorption possible'
      ],
      interactions: [
        'CYP3A4 inhibitors (ketoconazole, ritonavir) may increase systemic exposure'
      ],
      algeria_brands: [
        'Avamys 27.5mcg nasal spray'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'Liste I',
        lab: 'GLAXO SMITHKLINE',
        generic_official: 'FLUTICASONE FUROATE',
        notice_url: 'https://pharmnet-dz.com//notice.ashx?id=1943',
        pharmnet_url: 'https://pharmnet-dz.com/m-4288-avamys-27-50Âµg-dose-susp-p-pulv-nas-fl-120doses',
        dosage_variants: [
          {
            dosage: '27,50ÂµG/DOSE',
            form: 'SUSP.NAS',
            conditioning: 'FL./120DOSES',
            ppa: null
          }
        ]
      }
    },

  // ─── STOMACH ───────────────────────────────────────────────
    {
      name: 'Ursolvan',
      scientific_name: 'Ursodeoxycholic Acid (UDCA)',
      category: 'Stomach',
      emoji: '🫀',
      description: 'Ursolvan is used to dissolve cholesterol gallstones, treat primary biliary cholangitis, and protect the liver in certain cholestatic liver conditions.',
      how_to_take: 'Take with meals (or at bedtime for gallstone dissolution). Doses are weight-based. Treatment for gallstones lasts months to years.',
      side_effects: [
        'Nausea',
        'Diarrhea',
        'Stomach pain',
        'Rarely: liver function changes'
      ],
      warnings: [
        'Not for calcified gallstones or non-functioning gallbladder',
        'Regular liver function monitoring recommended',
        'Gallstones may recur after stopping'
      ],
      interactions: [
        'Cholestyramine and antacids — reduce absorption',
        'Contraceptives and clofibrate — increase cholesterol secretion counteracting UDCA'
      ],
      algeria_brands: [
        'Ursolvan 300mg',
        'UDCA Mylan 250mg',
        'Delursan 250mg'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'Liste I',
        lab: 'SANOFI AVENTIS',
        generic_official: 'ACIDE URSODESOXYCHOLIQUE',
        notice_url: 'https://pharmnet-dz.com/notice.ashx?id=2994',
        pharmnet_url: 'https://pharmnet-dz.com/m-2994-ursolvan-200mg-gles-b-30',
        dosage_variants: [
          {
            dosage: '200MG',
            form: 'GLES',
            conditioning: 'B/30',
            ppa: '587.04 DA'
          }
        ]
      }
    },
    {
      name: 'Silymarine',
      scientific_name: 'Silymarin (Milk Thistle Extract)',
      category: 'Stomach',
      emoji: '🌿',
      description: 'Silymarine is a hepatoprotective supplement derived from milk thistle used to support liver function in hepatitis, alcoholic liver disease, and as adjunct therapy in liver cirrhosis.',
      how_to_take: 'Take 1 capsule 2-3 times daily with meals.',
      side_effects: [
        'Mild stomach upset',
        'Diarrhea',
        'Headache'
      ],
      warnings: [
        'Supplement, not a substitute for medical treatment of liver disease',
        'Consult doctor before use in serious liver conditions'
      ],
      interactions: [
        'May interact with certain medications metabolized by the liver (CYP enzymes) — inform doctor'
      ],
      algeria_brands: [
        'Legalon 140mg',
        'Silymarine 200mg capsules',
        'Silimaral 35mg'
      ],
      pharmnet: null
    },

  // ─── ENT ───────────────────────────────────────────────────
    {
      name: 'Hexaspray',
      scientific_name: 'Biclotymol',
      category: 'ENT',
      emoji: '🗣️',
      description: 'Hexaspray is an antiseptic throat spray used for sore throat, pharyngitis, and tonsillitis. Very commonly used in Algeria for upper respiratory tract infections.',
      how_to_take: 'Spray 2-3 times into the back of the throat, 3-4 times daily. Hold breath during spraying.',
      side_effects: [
        'Mild local irritation',
        'Transient numbness',
        'Rarely: allergic reactions'
      ],
      warnings: [
        'Not for children under 6 years',
        'Do not swallow',
        'Not for severe throat infections requiring antibiotics'
      ],
      interactions: [
        'No significant interactions at local application'
      ],
      algeria_brands: [
        'Hexaspray 0.5mg/dose spray',
        'Hexaspray Menthol'
      ],
      pharmnet: {
        refundable: true,
        prescription_list: 'N/D',
        lab: 'BOUCHARA-RECORDATI',
        generic_official: 'BICLOTYMOL',
        notice_url: 'https://pharmnet-dz.com/notice.ashx?id=1133',
        pharmnet_url: 'https://pharmnet-dz.com/m-1133-hexaspray-0-75mg-30g-collu-fl-pressurise-de-30g',
        dosage_variants: [
          {
            dosage: '0,75MG/30G',
            form: 'COLLU',
            conditioning: 'FL. PRESSURISE DE 30G',
            ppa: '259.00 DA'
          }
        ]
      }
    },
    {
      name: 'Strepsils',
      scientific_name: 'Dichlorobenzyl Alcohol + Amylmetacresol',
      category: 'ENT',
      emoji: '🗣️',
      description: 'Strepsils lozenges are antiseptic throat lozenges providing local treatment of sore throat, mild oral infections, and pharyngitis.',
      how_to_take: 'Dissolve 1 lozenge slowly in the mouth every 2-3 hours. Maximum 8 lozenges per day.',
      side_effects: [
        'Temporary numbness',
        'Rarely: allergic reactions',
        'Mouth irritation'
      ],
      warnings: [
        'Not for children under 6',
        'Do not chew or swallow whole',
        'Not a substitute for antibiotics in bacterial infection'
      ],
      interactions: [
        'No significant interactions'
      ],
      algeria_brands: [
        'Strepsils original',
        'Strepsils menthol',
        'Strepsils honey and lemon'
      ],
      pharmnet: null
    },
    {
      name: 'Rhinofluimucil',
      scientific_name: 'Acetylcysteine + Tuaminoheptane',
      category: 'ENT',
      emoji: '👃',
      description: 'Rhinofluimucil nasal spray combines a mucolytic agent with a nasal decongestant for the treatment of thick nasal secretions and nasal congestion in rhinitis and sinusitis.',
      how_to_take: 'Spray 2-3 puffs into each nostril 4 times daily. Do not use for more than 7-10 days without medical advice.',
      side_effects: [
        'Nasal dryness',
        'Burning sensation',
        'Sneezing',
        'Rebound congestion with overuse'
      ],
      warnings: [
        'Do not use for more than 10 days without medical advice — rebound congestion risk',
        'Not for children under 3 without medical guidance',
        'Avoid in severe hypertension or hyperthyroidism'
      ],
      interactions: [
        'MAOIs — rebound hypertension risk',
        'Tricyclic antidepressants — additive vasoconstriction'
      ],
      algeria_brands: [
        'Rhinofluimucil nasal solution 0.1%/1%'
      ],
      pharmnet: {
        refundable: false,
        prescription_list: 'Liste II',
        lab: 'ZAMBON',
        generic_official: 'ACETYLCYSTEINE/TUAMINOHEPTANE/CHLORURE DE BENZALKONIUM',
        notice_url: 'https://pharmnet-dz.com/notice.ashx?id=1476',
        pharmnet_url: 'https://pharmnet-dz.com/m-1476-rhinofluimucil-100mg-50mg-1-25mg-10ml-sol-pulv-nasale-fl-10ml',
        dosage_variants: [
          {
            dosage: '100MG/50MG/1,25MG/10ML',
            form: 'SOL. NAS',
            conditioning: 'FL./10ML',
            ppa: null
          }
        ]
      }
    },
    {
      name: 'Naphazoline',
      scientific_name: 'Naphazoline',
      category: 'ENT',
      emoji: '👃',
      description: 'Naphazoline is a topical nasal decongestant for temporary relief of nasal congestion. Available as nasal drops or spray and as eye drops for red eye.',
      how_to_take: 'Nasal: 2-3 drops in each nostril 3-4 times daily. Do not use for more than 5 days.',
      side_effects: [
        'Burning or stinging sensation',
        'Sneezing',
        'Rebound congestion (rhinitis medicamentosa) with overuse',
        'Headache'
      ],
      warnings: [
        'Do not use for more than 5 days — serious rebound congestion risk',
        'Not for children under 12 without medical advice',
        'Avoid in hypertension'
      ],
      interactions: [
        'MAOIs — risk of severe hypertension',
        'Beta-blockers — additive effects'
      ],
      algeria_brands: [
        'Naphazoline 0.05% nasal drops',
        'Naphazoline 0.1%',
        'Derinox 0.05%'
      ],
      pharmnet: null
    },

  // ─── RESPIRATORY ───────────────────────────────────────────
    {
      name: 'Toplexil',
      scientific_name: 'Oxomemazine',
      category: 'Respiratory',
      emoji: '🫁',
      description: 'Toplexil is an antihistamine cough syrup used for dry, irritating cough and as a sedating antihistamine for nighttime allergy symptoms. Contains an antihistamine with antitussive properties.',
      how_to_take: 'Take 1-2 teaspoons (5-10mL) 3 times daily and at bedtime if needed.',
      side_effects: [
        'Drowsiness (very common)',
        'Dry mouth',
        'Constipation',
        'Urinary retention',
        'Dizziness'
      ],
      warnings: [
        'Do not drive — strongly sedating',
        'Avoid alcohol',
        'Not for productive cough',
        'Not for children under 12 without medical guidance'
      ],
      interactions: [
        'Alcohol — excessive sedation',
        'MAOIs — prolonged anticholinergic effects',
        'CNS depressants — additive sedation'
      ],
      algeria_brands: [
        'Toplexil 0.33mg/mL syrup'
      ],
      pharmnet: {
        refundable: false,
        prescription_list: 'N/D',
        lab: 'SAIDAL GROUPE',
        generic_official: 'OXOMEMAZINE',
        notice_url: 'https://pharmnet-dz.com//notice.ashx?id=6011',
        pharmnet_url: 'https://pharmnet-dz.com/m-1300-toplexil-0-33mg-ml-sirop-fl-150ml',
        dosage_variants: [
          {
            dosage: '0,33MG/ML',
            form: 'SIROP',
            conditioning: 'FL/150ML',
            ppa: '116.00 DA'
          }
        ]
      }
    },
    {
      name: 'Codipront',
      scientific_name: 'Codeine + Phenyltoloxamine',
      category: 'Respiratory',
      emoji: '🫁',
      description: 'Codipront is a combination cough suppressant containing codeine (opioid antitussive) and an antihistamine for dry, persistent, nonproductive cough.',
      how_to_take: 'Take 1 capsule 2-3 times daily. Take with water. Do not crush capsules.',
      side_effects: [
        'Drowsiness',
        'Constipation',
        'Nausea',
        'Dry mouth',
        'Dizziness'
      ],
      warnings: [
        'Contains codeine — habit-forming',
        'Do not drive',
        'Avoid alcohol',
        'Not for children under 12',
        'Not for productive cough'
      ],
      interactions: [
        'Alcohol and CNS depressants — respiratory depression risk',
        'MAOIs — serious interactions'
      ],
      algeria_brands: [
        'Codipront capsules',
        'Codipront cum expectorant'
      ],
      pharmnet: null
    },

  // ─── STOMACH ───────────────────────────────────────────────
    {
      name: 'Imodium',
      scientific_name: 'Loperamide',
      category: 'Stomach',
      emoji: '🫁',
      description: 'Imodium is an antimotility agent used for acute and chronic diarrhea. It slows intestinal contractions to reduce stool frequency and improve stool consistency.',
      how_to_take: 'Take 2 capsules (4mg) initially then 1 capsule (2mg) after each loose stool. Maximum 8mg per day.',
      side_effects: [
        'Constipation',
        'Stomach cramps',
        'Nausea',
        'Dizziness',
        'Dry mouth'
      ],
      warnings: [
        'Do not use in acute dysentery (blood in stool)',
        'Do not use in C. difficile-associated diarrhea',
        'Do not use in fever or bloody diarrhea without medical advice',
        'Seek care if diarrhea persists beyond 48 hours'
      ],
      interactions: [
        'Quinidine — increases loperamide levels (cardiac risk)',
        'Strong CYP3A4 inhibitors — increase loperamide levels'
      ],
      algeria_brands: [
        'Imodium 2mg capsules',
        'Lopéramide Mylan 2mg'
      ],
      pharmnet: null
    },
    {
      name: 'Nifuroxazide',
      scientific_name: 'Nifuroxazide',
      category: 'Stomach',
      emoji: '🫁',
      description: 'Nifuroxazide is an intestinal antiseptic used for acute diarrhea caused by intestinal bacteria. It acts locally in the gut without significant systemic absorption.',
      how_to_take: 'Take 1 tablet (200mg) 4 times daily for 3-7 days. Can be taken with or without food.',
      side_effects: [
        'Nausea',
        'Stomach pain',
        'Allergic reactions (rare)'
      ],
      warnings: [
        'Not for bloody diarrhea without medical advice',
        'Not a replacement for oral rehydration salts',
        'Seek care if high fever or severe dehydration'
      ],
      interactions: [
        'Alcohol — disulfiram-like reaction possible (avoid)',
        'Few significant drug interactions'
      ],
      algeria_brands: [
        'Ercefuryl 200mg',
        'Nifuroxazide 200mg',
        'Diafuryl 200mg'
      ],
      pharmnet: {
        refundable: false,
        prescription_list: 'Liste II',
        lab: 'PHARMAGHREB',
        generic_official: 'NIFUROXAZIDE',
        notice_url: 'https://pharmnet-dz.com/notice.ashx?id=3935',
        pharmnet_url: 'https://pharmnet-dz.com/m-3935-nifuroxazide-0-04-susp-buv-fl-90ml',
        dosage_variants: [
          {
            dosage: '0.04',
            form: 'SUSP. BUV',
            conditioning: 'FL/90ML',
            ppa: null
          }
        ]
      }
    },
    {
      name: 'Activated Charcoal',
      scientific_name: 'Charbon Activé',
      category: 'Stomach',
      emoji: '⚫',
      description: 'Activated charcoal is used for digestive disorders, bloating, and as an emergency measure for certain poisonings. It adsorbs toxins and gas in the gut.',
      how_to_take: 'For bloating: 2-4 tablets 3 times daily before meals. For poisoning: administered by healthcare professionals.',
      side_effects: [
        'Black stools (harmless)',
        'Constipation',
        'Nausea'
      ],
      warnings: [
        'Do not use for bloating and poisoning simultaneously without guidance',
        'Take 2 hours apart from other medications — reduces absorption of almost all drugs',
        'Not effective for all types of poisoning'
      ],
      interactions: [
        'Reduces absorption of virtually all orally administered medications — take 2 hours apart'
      ],
      algeria_brands: [
        'Carbosylane',
        'Charbon de Belloc',
        'Ultracarbon'
      ],
      pharmnet: null
    },
    {
      name: 'Nexium',
      scientific_name: 'Esomeprazole (alternative brand)',
      category: 'Stomach',
      emoji: '🫁',
      description: 'Nexium is the same molecule as Inexium (esomeprazole), another brand available in Algeria for acid-related disorders.',
      how_to_take: 'Take 30 minutes before a meal. Swallow whole.',
      side_effects: [
        'Same as Inexium — headache, nausea, diarrhea, constipation'
      ],
      warnings: [
        'Do not use with clopidogrel — use pantoprazole instead',
        'Long-term use may deplete magnesium and B12'
      ],
      interactions: [
        'Same as Inexium'
      ],
      algeria_brands: [
        'Nexium 20mg',
        'Nexium 40mg'
      ],
      pharmnet: null
    },
];

module.exports = algerianMedications;