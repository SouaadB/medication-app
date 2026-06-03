const algerianMedications = [

  // ─── DIABETES ───────────────────────────────────────────────────────────
  {
    name: `Glucophage`,
    scientific_name: `Metformin`,
    category: `Diabetes`,
    emoji: `💊`,
    description: `Glucophage (Metformin) is the most commonly prescribed medication for type 2 diabetes in Algeria. It works by reducing the amount of sugar your liver releases into your blood and helps your body respond better to insulin.`,
    how_to_take: `Take with meals to reduce stomach upset. Usually taken 2-3 times daily. Swallow whole with a full glass of water.`,
    side_effects: [
      `Nausea or vomiting (especially at start)`,
      `Diarrhea or stomach pain`,
      `Loss of appetite`,
      `Metallic taste in mouth`
    ],
    warnings: [
      `Do not take if you have kidney problems`,
      `Stop before any surgery or X-ray with contrast dye`,
      `Avoid excessive alcohol`,
      `Tell your doctor if you feel unusually tired or have muscle pain`
    ],
    interactions: [
      `Alcohol can increase risk of lactic acidosis`,
      `Iodinated contrast media — stop 48h before`,
      `Some diuretics may interact`
    ],
    algeria_brands: [
      `Glucophage 500mg`,
      `Glucophage 850mg`,
      `Glucophage 1000mg`,
      `Metformine Biogaran`,
      `Stagid 700mg`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste I`,
      lab: `MERCK SANTE S.A.S`,
      generic_official: `METFORMINE CHLORHYDRATE`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=5861`,
      pharmnet_url: `https://pharmnet-dz.com/m-5861-glucophage-1000mg-comp-pelli-sec-b-30`,
      dosage_variants: [
        {
          dosage: `1000MG`,
          form: `COMP. PELLI`,
          conditioning: `B/30`,
          ppa: null
        },
        {
          dosage: `850MG`,
          form: `COMP. PELLI`,
          conditioning: `B/100`,
          ppa: `492.00 DA`
        }
      ]
    }
  },
  {
    name: `Diamicron`,
    scientific_name: `Gliclazide`,
    category: `Diabetes`,
    emoji: `💊`,
    description: `Diamicron belongs to the sulfonylurea class and stimulates your pancreas to produce more insulin. Widely used in Algeria for type 2 diabetes management.`,
    how_to_take: `Take once daily with breakfast. Modified-release tablets (MR) should be swallowed whole, not crushed.`,
    side_effects: [
      `Low blood sugar (hypoglycemia)`,
      `Weight gain`,
      `Nausea`,
      `Stomach upset`
    ],
    warnings: [
      `Monitor blood sugar regularly`,
      `Eat regular meals — skipping meals increases hypoglycemia risk`,
      `Avoid alcohol`,
      `Not for type 1 diabetes`
    ],
    interactions: [
      `NSAIDs like ibuprofen may enhance effect`,
      `Beta-blockers may mask hypoglycemia symptoms`,
      `Fluconazole increases gliclazide levels`
    ],
    algeria_brands: [
      `Diamicron 80mg`,
      `Diamicron MR 30mg`,
      `Diamicron MR 60mg`,
      `Gliclazide Mylan`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste I`,
      lab: `SERVIER`,
      generic_official: `GLICLAZIDE`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=3711`,
      pharmnet_url: `https://pharmnet-dz.com/m-3711-diamicron-30mg-comp-lm-b-30-`,
      dosage_variants: [
        {
          dosage: `30MG`,
          form: `COMP. PELLI. LP`,
          conditioning: `B/30`,
          ppa: null
        }
      ]
    }
  },
  {
    name: `Novomix`,
    scientific_name: `Insulin Aspart (Biphasic)`,
    category: `Diabetes`,
    emoji: `💉`,
    description: `Novomix is a biphasic insulin used for type 1 and type 2 diabetes. It contains both fast-acting and intermediate-acting insulin to control blood sugar around meals and between meals.`,
    how_to_take: `Inject subcutaneously (under the skin) just before meals. Rotate injection sites. Keep refrigerated.`,
    side_effects: [
      `Low blood sugar (hypoglycemia)`,
      `Injection site reactions`,
      `Weight gain`,
      `Lipodystrophy at injection site`
    ],
    warnings: [
      `Never inject into a vein`,
      `Do not use if insulin appears cloudy or has particles`,
      `Carry glucose tablets in case of hypoglycemia`,
      `Do not share pen or needles`
    ],
    interactions: [
      `Alcohol can unpredictably alter blood sugar`,
      `Beta-blockers may mask hypoglycemia`,
      `Steroids increase blood sugar needs`
    ],
    algeria_brands: [
      `Novomix 30 FlexPen`,
      `Novomix 50 FlexPen`,
      `Novomix 70 FlexPen`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste II`,
      lab: `NOVO NORDISK`,
      generic_official: `INSULINE ASPARTE / INSULINE ASPARTE PROTAMINE 30/70%`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=3310`,
      pharmnet_url: `https://pharmnet-dz.com/m-3310-novomix-30-flexpen-100ui-ml-susp-inj-b-05-stylos-multidoses-pre-remplis-jetables-de-3ml`,
      dosage_variants: [
        {
          dosage: `100UI/ML`,
          form: `SUSP. INJ`,
          conditioning: `B/05 STYLOS MULTIDOSES PRE-REMPLIS JETABLES DE 3ML`,
          ppa: `5906.96 DA`
        }
      ]
    }
  },
  {
    name: `Lantus`,
    scientific_name: `Insulin Glargine`,
    category: `Diabetes`,
    emoji: `💉`,
    description: `Lantus is a long-acting insulin taken once daily to provide a steady background level of insulin throughout the day and night.`,
    how_to_take: `Inject once daily at the same time each day. Usually given at bedtime. Do not mix with other insulins.`,
    side_effects: [
      `Hypoglycemia`,
      `Injection site pain or redness`,
      `Weight gain`
    ],
    warnings: [
      `Do not dilute or mix with other insulins`,
      `Store unopened vials in refrigerator`,
      `Once opened, store at room temperature up to 28 days`
    ],
    interactions: [
      `Thiazolidinediones may cause fluid retention with insulin`,
      `Alcohol alters blood sugar control`
    ],
    algeria_brands: [
      `Lantus SoloStar`,
      `Toujeo SoloStar (300U/mL)`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste II`,
      lab: `SANOFI AVENTIS`,
      generic_official: `INSULINE GLARGINE`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=3304`,
      pharmnet_url: `https://pharmnet-dz.com/m-3304-lantus-100ui-ml-sol-inj-sc-en-cart-b-5cart-de-3ml--pour-optipen-`,
      dosage_variants: [
        {
          dosage: `100UI/ML`,
          form: `SOL. INJ`,
          conditioning: `B/5CART. DE 3ML  (POUR OPTIPEN )`,
          ppa: `7103.00 DA`
        },
        {
          dosage: `100UI/ML`,
          form: `SOL. INJ`,
          conditioning: `B/1FL DE 10ML`,
          ppa: null
        }
      ]
    }
  },
  {
    name: `Januvia`,
    scientific_name: `Sitagliptin`,
    category: `Diabetes`,
    emoji: `💊`,
    description: `Januvia is a DPP-4 inhibitor that helps lower blood sugar by increasing insulin release when blood sugar is high and decreasing sugar production by the liver.`,
    how_to_take: `Take once daily with or without food. Usually 100mg per day.`,
    side_effects: [
      `Stuffy or runny nose`,
      `Sore throat`,
      `Upper respiratory infection`,
      `Headache`,
      `Rarely: joint pain`
    ],
    warnings: [
      `Dose adjustment needed for kidney disease`,
      `Report severe joint pain to doctor`,
      `May cause pancreatitis — seek care for severe stomach pain`
    ],
    interactions: [
      `Works well with metformin`,
      `May need dose adjustment with certain antifungals`
    ],
    algeria_brands: [
      `Januvia 100mg`,
      `Janumet (Sitagliptin + Metformin)`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste I`,
      lab: `MERCK SCHARP & DOHME LTD`,
      generic_official: `SITAGLIPTINE PHOSPHATE MONOHYDRATE EXPRIME EN SITAGLIPTINE`,
      notice_url: `https://pharmnet-dz.com//notice.ashx?id=6078`,
      pharmnet_url: `https://pharmnet-dz.com/m-3727-januvia-100mg-comp-pelli-b-28`,
      dosage_variants: [
        {
          dosage: `100MG`,
          form: `COMP. PELLI`,
          conditioning: `B/28`,
          ppa: null
        }
      ]
    }
  },

  {
    name: `Victoza`,
    scientific_name: `Liraglutide`,
    category: `Diabetes`,
    emoji: `💉`,
    description: `Victoza is a GLP-1 receptor agonist injectable medication for type 2 diabetes. It stimulates insulin release, reduces glucagon, slows gastric emptying and reduces appetite. Also provides cardiovascular protection.`,
    how_to_take: `Inject once daily at any time, with or without meals. Inject under the skin of abdomen, thigh, or upper arm. Rotate injection sites.`,
    side_effects: [
      `Nausea (very common at start)`,
      `Vomiting`,
      `Diarrhea`,
      `Decreased appetite`,
      `Injection site reactions`
    ],
    warnings: [
      `Not for type 1 diabetes`,
      `Stop and seek care for severe abdominal pain (pancreatitis)`,
      `Not recommended with personal or family history of thyroid cancer`,
      `Monitor heart rate`
    ],
    interactions: [
      `Slows gastric emptying — may affect absorption of oral medications`,
      `Insulin — hypoglycemia risk increases`
    ],
    algeria_brands: [
      `Victoza 6mg/mL pen`,
      `Ozempic (Semaglutide — related drug)`
    ],
    pharmnet: {
      refundable: null,
      prescription_list: `N/D`,
      lab: `NOVONORDISK`,
      generic_official: null,
      notice_url: `https://pharmnet-dz.com//notice.ashx?id=6078`,
      pharmnet_url: `https://pharmnet-dz.com/m-3484-victoza-6mg-ml-sol-inj-s-c-en-stylo-preremplie-multidose-b-02-stylos-de-3ml`,
      dosage_variants: [
        {
          dosage: `6MG/ML`,
          form: `SOL. INJ`,
          conditioning: `B/02 STYLOS DE 3ML`,
          ppa: null
        }
      ]
    }
  },
  {
    name: `Stagid`,
    scientific_name: `Metformin (sustained release)`,
    category: `Diabetes`,
    emoji: `💊`,
    description: `Stagid is a sustained-release form of metformin that is gentler on the stomach than regular metformin. Widely available in Algeria.`,
    how_to_take: `Take during or immediately after meals. Swallow whole — do not crush or chew. Usually once or twice daily.`,
    side_effects: [
      `Fewer stomach side effects than regular metformin`,
      `Nausea`,
      `Diarrhea (less common)`
    ],
    warnings: [
      `Same precautions as regular metformin`,
      `Do not use with severe kidney or liver disease`,
      `Stop before contrast X-rays`
    ],
    interactions: [
      `Same as metformin — alcohol, contrast media, diuretics`
    ],
    algeria_brands: [
      `Stagid 700mg`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste I`,
      lab: `MERCK LIPHA SANTE`,
      generic_official: `METFORMINE EMBONATE`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=3635`,
      pharmnet_url: `https://pharmnet-dz.com/m-3635-stagid-700mg-comp-sec-b-30`,
      dosage_variants: [
        {
          dosage: `700MG`,
          form: `COMP. SEC`,
          conditioning: `B/30`,
          ppa: null
        }
      ]
    }
  },
  {
    name: `Novorapid`,
    scientific_name: `Insulin Aspart (Rapid-acting)`,
    category: `Diabetes`,
    emoji: `💉`,
    description: `Novorapid is a rapid-acting insulin analog that starts working within 10-20 minutes of injection. Used to control blood sugar spikes at mealtimes.`,
    how_to_take: `Inject immediately before meals. Can also be given just after meals if necessary. Inject subcutaneously.`,
    side_effects: [
      `Hypoglycemia`,
      `Injection site reactions`,
      `Weight gain`
    ],
    warnings: [
      `Always carry fast-acting glucose (sugar, juice)`,
      `Do not use if solution is not clear and colorless`,
      `Rotate injection sites to prevent lipodystrophy`
    ],
    interactions: [
      `Alcohol alters blood sugar unpredictably`,
      `Beta-blockers mask hypoglycemia symptoms`
    ],
    algeria_brands: [
      `NovoRapid FlexPen 100U/mL`,
      `NovoRapid Penfill`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste II`,
      lab: `NOVO NORDISK`,
      generic_official: `INSULINE ASPARTE`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=3308`,
      pharmnet_url: `https://pharmnet-dz.com/m-3308-novorapid-flexpen-100ui-ml-sol-inj-b-05-stylos-multidoses-pre-remplis-jetables-de-3ml`,
      dosage_variants: [
        {
          dosage: `100UI/ML`,
          form: `SOL. INJ`,
          conditioning: `B/05 STYLOS MULTIDOSES PRE-REMPLIS JETABLES DE 3ML`,
          ppa: `5800.73 DA`
        }
      ]
    }
  },

  {
    name: `Galvus`,
    scientific_name: `Vildagliptin`,
    category: `Diabetes`,
    emoji: `💊`,
    description: `Galvus is used for type 2 diabetes to help control blood sugar by increasing insulin release and reducing glucose production.`,
    how_to_take: `Take once or twice daily with or without food.`,
    side_effects: [
      `Headache`,
      `Dizziness`,
      `Nausea`,
      `Fatigue`
    ],
    warnings: [
      `Monitor liver function regularly`,
      `Report severe abdominal pain`
    ],
    interactions: [
      `Insulin may increase hypoglycemia risk`
    ],
    algeria_brands: [
      `Galvus 50mg`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste I`,
      lab: `NOVARTIS`,
      generic_official: `VILDAGLIPTINE`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=3728`,
      pharmnet_url: `https://pharmnet-dz.com/m-3728-galvus-50mg-comp-b-28`,
      dosage_variants: [
        {
          dosage: `50MG`,
          form: `COMP`,
          conditioning: `B/28`,
          ppa: `2747.00 DA`
        }
      ]
    }
  },
  {
    name: `Galvus Met`,
    scientific_name: `Vildagliptin + Metformin`,
    category: `Diabetes`,
    emoji: `💊`,
    description: `Galvus Met combines vildagliptin and metformin to improve blood sugar control in type 2 diabetes.`,
    how_to_take: `Take with meals to reduce stomach upset.`,
    side_effects: [
      `Diarrhea`,
      `Nausea`,
      `Headache`,
      `Low blood sugar`
    ],
    warnings: [
      `Monitor kidney function`,
      `Avoid excessive alcohol`
    ],
    interactions: [
      `Alcohol increases lactic acidosis risk`
    ],
    algeria_brands: [
      `Galvus Met 50mg/500mg`,
      `Galvus Met 50mg/850mg`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste I`,
      lab: `NOVARTIS`,
      generic_official: `VILDAGLIPTINE`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=3728`,
      pharmnet_url: `https://pharmnet-dz.com/m-3728-galvus-50mg-comp-b-28`,
      dosage_variants: [
        {
          dosage: `50MG`,
          form: `COMP`,
          conditioning: `B/28`,
          ppa: `2747.00 DA`
        }
      ]
    }
  },
  {
    name: `Actos`,
    scientific_name: `Pioglitazone`,
    category: `Diabetes`,
    emoji: `💊`,
    description: `Actos improves insulin sensitivity in patients with type 2 diabetes.`,
    how_to_take: `Take once daily with or without food.`,
    side_effects: [
      `Weight gain`,
      `Swelling`,
      `Headache`,
      `Muscle pain`
    ],
    warnings: [
      `Use cautiously in heart failure`,
      `Monitor liver function`
    ],
    interactions: [
      `Insulin increases edema risk`
    ],
    algeria_brands: [
      `Actos 15mg`,
      `Actos 30mg`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste I`,
      lab: `ARAB PHARM`,
      generic_official: `PIOGLITAZONE CHLORHYDRATE EXPRIME EN PIOGLITAZONE`,
      notice_url: `https://pharmnet-dz.com//notice.ashx?id=6078`,
      pharmnet_url: `https://pharmnet-dz.com/m-3716-actos-15mg-comp--b-30`,
      dosage_variants: [
        {
          dosage: `15MG`,
          form: `COMP`,
          conditioning: `B/30`,
          ppa: null
        },
        {
          dosage: `30MG`,
          form: `COMP`,
          conditioning: `B/30`,
          ppa: null
        }
      ]
    }
  },
  {
    name: `Levemir`,
    scientific_name: `Insulin Detemir`,
    category: `Diabetes`,
    emoji: `💉`,
    description: `Levemir is a long-acting insulin used to provide stable blood sugar control throughout the day.`,
    how_to_take: `Inject once or twice daily at the same time each day.`,
    side_effects: [
      `Hypoglycemia`,
      `Weight gain`,
      `Injection site reactions`
    ],
    warnings: [
      `Rotate injection sites`,
      `Monitor blood sugar regularly`
    ],
    interactions: [
      `Alcohol may alter blood sugar levels`
    ],
    algeria_brands: [
      `Levemir FlexPen`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste II`,
      lab: `NOVO NORDISK`,
      generic_official: `INSULINE DETEMIR`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=3312`,
      pharmnet_url: `https://pharmnet-dz.com/m-3312-levemir-flexpen-100u-ml-ou-100ui-ml-sol-inj-s-c-b-05-stylos-pre-remplis-multidose-jetables-de-3ml`,
      dosage_variants: [
        {
          dosage: `100U/ML (OU 100UI/ML)`,
          form: `SOL. INJ`,
          conditioning: `B/05 STYLOS PRE REMPLIS MULTIDOSE JETABLES DE 3ML`,
          ppa: `8982.08 DA`
        }
      ]
    }
  },
  {
    name: `Humalog`,
    scientific_name: `Insulin Lispro`,
    category: `Diabetes`,
    emoji: `💉`,
    description: `Humalog is a rapid-acting insulin used to control blood sugar spikes during meals.`,
    how_to_take: `Inject within 15 minutes before meals.`,
    side_effects: [
      `Hypoglycemia`,
      `Weight gain`,
      `Injection site reactions`
    ],
    warnings: [
      `Always carry sugar for hypoglycemia`
    ],
    interactions: [
      `Beta-blockers may mask hypoglycemia symptoms`
    ],
    algeria_brands: [
      `Humalog KwikPen`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste II`,
      lab: `ELI LILLY`,
      generic_official: `INSULINE LISPRO`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=3744`,
      pharmnet_url: `https://pharmnet-dz.com/m-3744-humalog-100ui-ml-3-5mg-ml-sol-inj-sc-iv-en-cartouche-pour-stylo-b-05-cartouches-de-3ml`,
      dosage_variants: [
        {
          dosage: `100UI/ML (3,5MG/ML)`,
          form: `SOL. INJ`,
          conditioning: `B/05 CARTOUCHES DE 3ML`,
          ppa: `3999.28 DA`
        },
        {
          dosage: `100UI/ML (3,5MG/ML)`,
          form: `SOL. INJ`,
          conditioning: `B/01FL.DE 10ML`,
          ppa: null
        }
      ]
    }
  },





  {
    name: `Mixtard`,
    scientific_name: `Insulin Human (Biphasic)`,
    category: `Diabetes`,
    emoji: `💉`,
    description: `Mixtard is a premixed human insulin containing both short-acting and intermediate-acting insulin. Used twice daily for simplified diabetes management.`,
    how_to_take: `Inject subcutaneously 30 minutes before breakfast and dinner. Mix gently before use.`,
    side_effects: [
      `Hypoglycemia`,
      `Weight gain`,
      `Injection site reactions`
    ],
    warnings: [
      `Inject 30 minutes before meals — timing is critical`,
      `Do not skip meals after injection`,
      `Rotate injection sites`
    ],
    interactions: [
      `Same as other insulins — alcohol, beta-blockers, steroids`
    ],
    algeria_brands: [
      `Mixtard 30 HM`,
      `Mixtard 50 HM`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste II`,
      lab: `NOVO NORDISK`,
      generic_official: `INSULINE HUMAINE (rDNA) 30% / INSULINE HUMAINE ISOPHANE 70%`,
      notice_url: `https://pharmnet-dz.com//notice.ashx?id=6078`,
      pharmnet_url: `https://pharmnet-dz.com/m-3736-mixtard-30hm-100ui-ml-susp-inj-fl-10ml`,
      dosage_variants: [
        {
          dosage: `100UI/ML`,
          form: `SUSP. INJ`,
          conditioning: `FL/10ML`,
          ppa: null
        }
      ]
    }
  },


  // ─── HYPERTENSION ───────────────────────────────────────────────────────────
  {
    name: `Coversyl`,
    scientific_name: `Perindopril`,
    category: `Hypertension`,
    emoji: `❤️`,
    description: `Coversyl is an ACE inhibitor used to treat high blood pressure and heart failure. It relaxes blood vessels so your heart does not have to work as hard.`,
    how_to_take: `Take once daily, preferably in the morning before eating. Take at the same time each day.`,
    side_effects: [
      `Dry cough (very common)`,
      `Dizziness`,
      `Headache`,
      `Fatigue`,
      `Rarely: swelling of face/lips/tongue (angioedema)`
    ],
    warnings: [
      `Tell your doctor immediately if you develop swelling of the face or throat`,
      `Monitor potassium levels`,
      `Not safe during pregnancy`,
      `Can cause dizziness when standing up`
    ],
    interactions: [
      `Potassium supplements increase hyperkalemia risk`,
      `NSAIDs reduce effectiveness`,
      `Diuretics increase hypotension risk`
    ],
    algeria_brands: [
      `Coversyl 5mg`,
      `Coversyl 10mg`,
      `Coversyl Plus (+ Indapamide)`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste I`,
      lab: `SERVIER`,
      generic_official: `PERINDOPRIL ARGININE`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=3217`,
      pharmnet_url: `https://pharmnet-dz.com/m-3217-coversyl-10mg-comp-pelli-b-30`,
      dosage_variants: [
        {
          dosage: `10MG`,
          form: `COMP. PELLI`,
          conditioning: `B/30`,
          ppa: null
        },
        {
          dosage: `5MG`,
          form: `COMP. PELLI`,
          conditioning: `B/30`,
          ppa: `812.00 DA`
        }
      ]
    }
  },
  {
    name: `Aprovel`,
    scientific_name: `Irbesartan`,
    category: `Hypertension`,
    emoji: `❤️`,
    description: `Aprovel is an ARB (angiotensin receptor blocker) used to treat high blood pressure and protect the kidneys in diabetic patients with hypertension.`,
    how_to_take: `Take once daily with or without food. Usually 150-300mg per day.`,
    side_effects: [
      `Dizziness`,
      `Fatigue`,
      `Nausea`,
      `Diarrhea`
    ],
    warnings: [
      `Not safe during pregnancy`,
      `Monitor kidney function and potassium`,
      `Avoid potassium supplements unless prescribed`
    ],
    interactions: [
      `NSAIDs reduce effectiveness`,
      `Potassium-sparing diuretics increase hyperkalemia risk`,
      `Lithium levels may increase`
    ],
    algeria_brands: [
      `Aprovel 150mg`,
      `Aprovel 300mg`,
      `CoAprovel (+ Hydrochlorothiazide)`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste I`,
      lab: `SANOFI AVENTIS`,
      generic_official: `IRBESARTAN`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=209`,
      pharmnet_url: `https://pharmnet-dz.com/m-209-aprovel-150mg-comp-pelli-b-28`,
      dosage_variants: [
        {
          dosage: `150MG`,
          form: `COMP. PELLI`,
          conditioning: `B/28`,
          ppa: `1204.00 DA`
        },
        {
          dosage: `300MG`,
          form: `COMP. PELLI`,
          conditioning: `B/28`,
          ppa: `1204.00 DA`
        }
      ]
    }
  },
  {
    name: `Tareg`,
    scientific_name: `Valsartan`,
    category: `Hypertension`,
    emoji: `❤️`,
    description: `Tareg (Valsartan) is used to treat high blood pressure and heart failure. It blocks angiotensin II, a chemical that narrows blood vessels.`,
    how_to_take: `Take once or twice daily. Can be taken with or without food.`,
    side_effects: [
      `Dizziness`,
      `Headache`,
      `Fatigue`,
      `Back pain`
    ],
    warnings: [
      `Not safe in pregnancy`,
      `Monitor kidney function`,
      `May cause low blood pressure`
    ],
    interactions: [
      `NSAIDs reduce effectiveness`,
      `Potassium-sparing diuretics`,
      `Lithium`
    ],
    algeria_brands: [
      `Tareg 80mg`,
      `Tareg 160mg`,
      `Tareg 320mg`,
      `Co-Tareg`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste I`,
      lab: `NOVARTIS`,
      generic_official: `VALSARTAN`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=3088`,
      pharmnet_url: `https://pharmnet-dz.com/m-3088-tareg-160mg-comp-pelli-b-28`,
      dosage_variants: [
        {
          dosage: `160MG`,
          form: `COMP. PELLI`,
          conditioning: `B/28`,
          ppa: `2315.00 DA`
        },
        {
          dosage: `80MG`,
          form: `COMP. PELLI`,
          conditioning: `B/28`,
          ppa: `1646.00 DA`
        }
      ]
    }
  },

  {
    name: `Amlor`,
    scientific_name: `Amlodipine`,
    category: `Hypertension`,
    emoji: `❤️`,
    description: `Amlor is a calcium channel blocker used to treat high blood pressure and chest pain (angina). It relaxes blood vessels and reduces the workload on the heart.`,
    how_to_take: `Take once daily, with or without food. Take at the same time each day.`,
    side_effects: [
      `Ankle swelling`,
      `Flushing`,
      `Headache`,
      `Fatigue`,
      `Palpitations`
    ],
    warnings: [
      `Tell doctor if ankle swelling is severe`,
      `Do not stop suddenly for angina treatment`,
      `Grapefruit juice may increase drug levels`
    ],
    interactions: [
      `Simvastatin — limit simvastatin to 20mg`,
      `Cyclosporine levels may increase`,
      `Rifampicin reduces effectiveness`
    ],
    algeria_brands: [
      `Amlor 5mg`,
      `Amlor 10mg`,
      `Amlodipine Mylan`,
      `Exforge (+ Valsartan)`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste I`,
      lab: `PFIZER PHARM ALGERIE`,
      generic_official: `AMLODIPINE BESYLATE EXPRIME EN AMLODIPINE`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=88`,
      pharmnet_url: `https://pharmnet-dz.com/m-88-amlor-10mg-gles-b-28`,
      dosage_variants: [
        {
          dosage: `10MG`,
          form: `GLES`,
          conditioning: `B/28`,
          ppa: null
        },
        {
          dosage: `5MG`,
          form: `GLES`,
          conditioning: `B/28 ET B/98`,
          ppa: `2000.00 DA`
        }
      ]
    }
  },

  // ─── HEART ───────────────────────────────────────────────────────────
  {
    name: `Kardégic`,
    scientific_name: `Aspirin (low dose)`,
    category: `Heart`,
    emoji: `💊`,
    description: `Kardégic is low-dose aspirin used to prevent blood clots, heart attacks, and strokes. It is not a painkiller at this dose — it works as a blood thinner.`,
    how_to_take: `Take once daily, usually 75mg or 160mg. Dissolve in water before taking. Take with or after food.`,
    side_effects: [
      `Stomach irritation`,
      `Heartburn`,
      `Nausea`,
      `Rarely: stomach bleeding`
    ],
    warnings: [
      `Tell your dentist and surgeon you take aspirin`,
      `Do not take ibuprofen regularly without consulting your doctor`,
      `Stop if you notice black stools or vomiting blood`
    ],
    interactions: [
      `Ibuprofen and naproxen interfere with antiplatelet effect`,
      `Warfarin — increased bleeding risk`,
      `Clopidogrel — usually prescribed together`
    ],
    algeria_brands: [
      `Kardégic 75mg`,
      `Kardégic 160mg`,
      `Aspirine UPSA 100mg`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `N/D`,
      lab: `SANOFI AVENTIS`,
      generic_official: `ACIDE ACETYLSALICYLIQUE`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=1709`,
      pharmnet_url: `https://pharmnet-dz.com/m-1709-kardegic-160mg-sachet--288mg-sachet-acetylsalicylate-de-dl-lysine-pdre-sol-buv-b-30-sachets-dose`,
      dosage_variants: [
        {
          dosage: `160MG/SACHET** (288MG/SACHET ACETYLSALICYLATE DE DL LYSINE)`,
          form: `PDRE. SOL. BUV`,
          conditioning: `B/30 SACHETS DOSE`,
          ppa: null
        },
        {
          dosage: `75MG/SACHET** (135MG/SACH. ACETYLSALICYLATE DE DL LYSINE)`,
          form: `PDRE. SOL. BUV`,
          conditioning: `B/30`,
          ppa: null
        }
      ]
    }
  },
  {
    name: `Cordarone`,
    scientific_name: `Amiodarone`,
    category: `Heart`,
    emoji: `❤️`,
    description: `Cordarone is used to treat serious heart rhythm problems (arrhythmias). It is a powerful medication that requires careful monitoring.`,
    how_to_take: `Take with food to reduce stomach upset. Do not crush tablets. Follow your doctor's dose schedule exactly.`,
    side_effects: [
      `Sensitivity to sunlight`,
      `Thyroid problems`,
      `Lung toxicity (rare)`,
      `Visual disturbances`,
      `Liver effects`
    ],
    warnings: [
      `Use high-SPF sunscreen outdoors`,
      `Regular thyroid, liver, and lung monitoring required`,
      `Interacts with many medications — always inform any new doctor`
    ],
    interactions: [
      `Warfarin — significantly increases anticoagulant effect`,
      `Digoxin — increases digoxin levels`,
      `Many other interactions — always check with pharmacist`
    ],
    algeria_brands: [
      `Cordarone 200mg`,
      `Amiodarone Mylan`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste II`,
      lab: `SANOFI SYNTHELABO`,
      generic_official: `AMIODARONE CHLORHYDRATE`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=131`,
      pharmnet_url: `https://pharmnet-dz.com/m-131-cordarone-200mg-comp-sec-b-30`,
      dosage_variants: [
        {
          dosage: `200MG`,
          form: `COMP SEC`,
          conditioning: `B/30`,
          ppa: null
        },
        {
          dosage: `50MG/ML (150MG/3ML)`,
          form: `SOL. INJ`,
          conditioning: `B/06 AMP. DE 3ML`,
          ppa: null
        }
      ]
    }
  },
  {
    name: `Plavix`,
    scientific_name: `Clopidogrel`,
    category: `Heart`,
    emoji: `🩸`,
    description: `Plavix is an antiplatelet medication that prevents blood clots. Used after heart attack, stroke, or stent placement to keep blood vessels open.`,
    how_to_take: `Take once daily with or without food. Do not stop without consulting your doctor — stopping suddenly can trigger a heart attack.`,
    side_effects: [
      `Easy bruising or bleeding`,
      `Stomach pain`,
      `Nausea`,
      `Headache`,
      `Diarrhea`
    ],
    warnings: [
      `Tell all doctors and dentists you take Plavix before any procedure`,
      `Do not stop suddenly`,
      `Seek care if you notice unusual bleeding`,
      `Avoid omeprazole — use pantoprazole instead`
    ],
    interactions: [
      `Omeprazole reduces effectiveness significantly`,
      `Aspirin — usually taken together but increases bleeding risk`,
      `NSAIDs — increased bleeding risk`,
      `Warfarin — increased bleeding risk`
    ],
    algeria_brands: [
      `Plavix 75mg`,
      `Clopidogrel Mylan`,
      `Ceruvin 75mg`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste I`,
      lab: `SANOFI AVENTIS`,
      generic_official: `CLOPIDOGREL HYDROGENOSULFATE EXPRIME EN CLOPIDOGREL`,
      notice_url: `https://pharmnet-dz.com//notice.ashx?id=93`,
      pharmnet_url: `https://pharmnet-dz.com/m-6086-plavix-300-mg-cp-pellicule-b-30`,
      dosage_variants: [
        {
          dosage: `300 MG`,
          form: `COMP. PELLI`,
          conditioning: `B/30`,
          ppa: null
        },
        {
          dosage: `75MG`,
          form: `COMP. PELLI`,
          conditioning: `B/28`,
          ppa: `1680.00 DA`
        }
      ]
    }
  },
  {
    name: `Sintrom`,
    scientific_name: `Acenocoumarol`,
    category: `Heart`,
    emoji: `🩸`,
    description: `Sintrom is an oral anticoagulant (blood thinner) used to prevent and treat blood clots, deep vein thrombosis, pulmonary embolism, and to prevent stroke in patients with atrial fibrillation. Very commonly used in Algeria.`,
    how_to_take: `Take at the same time each day, usually in the evening. Regular INR blood tests are essential to adjust the dose.`,
    side_effects: [
      `Bleeding (the main risk)`,
      `Easy bruising`,
      `Nosebleeds`,
      `Prolonged bleeding from cuts`
    ],
    warnings: [
      `Regular INR monitoring is mandatory`,
      `Many foods and medications affect its action`,
      `Tell all doctors, dentists, and pharmacists you take Sintrom`,
      `Seek immediate care for unusual or heavy bleeding`,
      `Avoid contact sports`
    ],
    interactions: [
      `Aspirin and NSAIDs — greatly increased bleeding risk`,
      `Antibiotics can increase effect`,
      `Vitamin K-rich foods (spinach, broccoli) reduce effect`,
      `Many drug interactions — always check before starting any new medication`
    ],
    algeria_brands: [
      `Sintrom 4mg`,
      `Sintrom 1mg`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste I`,
      lab: `NOVARTIS`,
      generic_official: `ACENOCOUMAROL`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=3066`,
      pharmnet_url: `https://pharmnet-dz.com/m-3066-sintrom-4mg-comp-sec-b-30`,
      dosage_variants: [
        {
          dosage: `4MG`,
          form: `COMP. SEC`,
          conditioning: `B/30`,
          ppa: `188.00 DA`
        }
      ]
    }
  },
  {
    name: `Tahor`,
    scientific_name: `Atorvastatin`,
    category: `Heart`,
    emoji: `💊`,
    description: `Tahor is a statin used to lower cholesterol and reduce the risk of heart attack and stroke. It is one of the most prescribed medications worldwide.`,
    how_to_take: `Take once daily at any time of day, with or without food. Take at the same time each day.`,
    side_effects: [
      `Muscle pain or weakness (important — report to doctor)`,
      `Headache`,
      `Nausea`,
      `Joint pain`,
      `Liver enzyme elevation (rare)`
    ],
    warnings: [
      `Report any unexplained muscle pain or weakness immediately`,
      `Avoid grapefruit juice`,
      `Regular liver function tests recommended`,
      `Inform doctor if planning pregnancy`
    ],
    interactions: [
      `Grapefruit juice increases drug levels significantly`,
      `Amlodipine — limit atorvastatin to 40mg`,
      `Rifampicin reduces effectiveness`,
      `Niacin increases myopathy risk`
    ],
    algeria_brands: [
      `Tahor 10mg`,
      `Tahor 20mg`,
      `Tahor 40mg`,
      `Tahor 80mg`,
      `Atorvastatine Mylan`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste I`,
      lab: `PFIZER PHARM ALGERIE`,
      generic_official: `ATORVASTATINE CALCIQUE TRIHYDRATE EXPRIME EN ATORVASTATINE`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=1564`,
      pharmnet_url: `https://pharmnet-dz.com/m-1564-tahor-10mg-comp-pelli-b-28`,
      dosage_variants: [
        {
          dosage: `10MG`,
          form: `COMP. PELLI`,
          conditioning: `B/28`,
          ppa: null
        },
        {
          dosage: `20MG`,
          form: `COMP. PELLI`,
          conditioning: `B/28`,
          ppa: null
        },
        {
          dosage: `40MG`,
          form: `COMP. PELLI`,
          conditioning: `B/28`,
          ppa: null
        }
      ]
    }
  },

  {
    name: `Lescol`,
    scientific_name: `Fluvastatin`,
    category: `Heart`,
    emoji: `💊`,
    description: `Lescol is a statin used to lower cholesterol levels and reduce the risk of cardiovascular disease. It is one of the statins available in Algeria.`,
    how_to_take: `Take once daily in the evening, with or without food. Extended-release form can be taken at any time.`,
    side_effects: [
      `Muscle pain`,
      `Headache`,
      `Indigestion`,
      `Nausea`,
      `Insomnia`
    ],
    warnings: [
      `Report muscle pain or weakness immediately`,
      `Liver function monitoring recommended`,
      `Avoid in pregnancy`
    ],
    interactions: [
      `Cyclosporine increases fluvastatin levels`,
      `Rifampicin reduces effectiveness`,
      `Fluconazole increases levels`
    ],
    algeria_brands: [
      `Lescol 20mg`,
      `Lescol 40mg`,
      `Lescol XL 80mg`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste I`,
      lab: `NOVARTIS`,
      generic_official: `FLUVASTATINE SODIQUE`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=1553`,
      pharmnet_url: `https://pharmnet-dz.com/m-1553-lescol-40mg-gles-b-28`,
      dosage_variants: [
        {
          dosage: `40MG`,
          form: `GLES`,
          conditioning: `B/28`,
          ppa: null
        }
      ]
    }
  },

  // ─── HYPERTENSION ───────────────────────────────────────────────────────────
  {
    name: `Sectral`,
    scientific_name: `Acebutolol`,
    category: `Hypertension`,
    emoji: `❤️`,
    description: `Sectral is a cardioselective beta-blocker used to treat hypertension, angina, and heart rhythm disorders. It has less effect on the airways than non-selective beta-blockers.`,
    how_to_take: `Take once or twice daily, with or without food. Do not stop suddenly.`,
    side_effects: [
      `Fatigue`,
      `Dizziness`,
      `Cold extremities`,
      `Sleep disturbances`,
      `Slow heart rate`
    ],
    warnings: [
      `Do not stop abruptly — taper dose under medical supervision`,
      `Use with caution in asthma`,
      `May mask hypoglycemia symptoms in diabetics`
    ],
    interactions: [
      `Verapamil — risk of severe bradycardia`,
      `Clonidine — rebound hypertension risk`,
      `Digoxin — additive bradycardia`
    ],
    algeria_brands: [
      `Sectral 200mg`,
      `Sectral 400mg`,
      `Acebutolol Mylan`
    ],
    pharmnet: {
      refundable: null,
      prescription_list: `Liste I`,
      lab: `SAIDAL GROUPE`,
      generic_official: `ACEBUTOLOL CHLORHYDRATE`,
      notice_url: `https://pharmnet-dz.com//notice.ashx?id=93`,
      pharmnet_url: `https://pharmnet-dz.com/m-3231-sectral-200mg-comp-pelli-sec-b-30`,
      dosage_variants: [
        {
          dosage: `200MG`,
          form: `COMP. PELLI`,
          conditioning: `B/30`,
          ppa: `487.00 DA`
        },
        {
          dosage: `400MG`,
          form: `COMP. PELLI`,
          conditioning: `B/30`,
          ppa: `906.00 DA`
        }
      ]
    }
  },
  {
    name: `Lasilix`,
    scientific_name: `Furosemide`,
    category: `Hypertension`,
    emoji: `💊`,
    description: `Lasilix is a powerful loop diuretic (water pill) used to treat fluid retention (edema) in heart failure, kidney disease, and liver cirrhosis, and to treat high blood pressure.`,
    how_to_take: `Take in the morning or early afternoon to avoid nighttime urination. Take with food to reduce stomach upset.`,
    side_effects: [
      `Frequent urination`,
      `Dizziness`,
      `Low potassium (weakness, cramps)`,
      `Dehydration`,
      `Low blood pressure`,
      `Sensitivity to sunlight`
    ],
    warnings: [
      `Monitor potassium levels — may need potassium supplements`,
      `Stay hydrated`,
      `Rise slowly to prevent dizziness`,
      `Regular blood tests required`
    ],
    interactions: [
      `Digoxin — low potassium increases toxicity risk`,
      `NSAIDs reduce effectiveness`,
      `Aminoglycoside antibiotics — increased kidney toxicity`,
      `Lithium — toxicity risk increases`
    ],
    algeria_brands: [
      `Lasilix 20mg`,
      `Lasilix 40mg`,
      `Lasilix 500mg (high dose)`,
      `Furosémide Mylan`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste II`,
      lab: `SANOFI AVENTIS`,
      generic_official: `FUROSEMIDE`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=3288`,
      pharmnet_url: `https://pharmnet-dz.com/m-3288-lasilix-20mg-comp-b-30`,
      dosage_variants: [
        {
          dosage: `20MG`,
          form: `COMP`,
          conditioning: `B/30`,
          ppa: null
        }
      ]
    }
  },
  {
    name: `Aldactone`,
    scientific_name: `Spironolactone`,
    category: `Hypertension`,
    emoji: `❤️`,
    description: `Aldactone is a potassium-sparing diuretic used for heart failure, high blood pressure, and conditions causing high aldosterone levels. It also has anti-androgenic effects.`,
    how_to_take: `Take once daily with food to improve absorption and reduce stomach upset.`,
    side_effects: [
      `Increased potassium`,
      `Breast tenderness or enlargement (men)`,
      `Menstrual irregularities (women)`,
      `Dizziness`,
      `Nausea`
    ],
    warnings: [
      `Monitor potassium levels — can cause dangerous hyperkalemia`,
      `Avoid potassium supplements`,
      `Regular kidney function tests`,
      `Not safe in pregnancy`
    ],
    interactions: [
      `ACE inhibitors and ARBs — hyperkalemia risk`,
      `NSAIDs reduce effectiveness`,
      `Digoxin levels may increase`
    ],
    algeria_brands: [
      `Aldactone 25mg`,
      `Aldactone 50mg`,
      `Aldactone 75mg`,
      `Spirozide (combination)`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste II`,
      lab: `PFIZER HOLDING FRANCE`,
      generic_official: `SPIRONOLACTONE MICRONISEE`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=1481`,
      pharmnet_url: `https://pharmnet-dz.com/m-1481-aldactone-75mg-comp-pelli-sec-b-30`,
      dosage_variants: [
        {
          dosage: `75MG`,
          form: `COMP. PELLI`,
          conditioning: `B/30`,
          ppa: null
        }
      ]
    }
  },
  {
    name: `Micardis`,
    scientific_name: `Telmisartan`,
    category: `Hypertension`,
    emoji: `❤️`,
    description: `Micardis is an ARB (angiotensin receptor blocker) used to treat high blood pressure and reduce the risk of cardiovascular events. It also protects the kidneys in diabetic patients.`,
    how_to_take: `Take once daily with or without food. Take at the same time each day.`,
    side_effects: [
      `Dizziness`,
      `Back pain`,
      `Sinusitis`,
      `Diarrhea`,
      `Upper respiratory infection`
    ],
    warnings: [
      `Not safe during pregnancy`,
      `Monitor kidney function`,
      `Can cause low blood pressure especially with diuretics`
    ],
    interactions: [
      `Digoxin — increases digoxin levels`,
      `Lithium — toxicity risk`,
      `NSAIDs reduce effectiveness`,
      `Potassium-sparing diuretics — hyperkalemia risk`
    ],
    algeria_brands: [
      `Micardis 40mg`,
      `Micardis 80mg`,
      `MicardisPlus (+ Hydrochlorothiazide)`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste I`,
      lab: `BOEHRINGER INGELHEIM`,
      generic_official: `TELMISARTAN`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=3202`,
      pharmnet_url: `https://pharmnet-dz.com/m-3202-micardis-40mg-comp--b-28`,
      dosage_variants: [
        {
          dosage: `40MG`,
          form: `COMP`,
          conditioning: `B/28`,
          ppa: null
        },
        {
          dosage: `80MG`,
          form: `COMP`,
          conditioning: `B/28`,
          ppa: null
        }
      ]
    }
  },

  // ─── HEART ───────────────────────────────────────────────────────────
  {
    name: `Digoxine`,
    scientific_name: `Digoxin`,
    category: `Heart`,
    emoji: `❤️`,
    description: `Digoxine strengthens heart contractions and slows the heart rate. Used for heart failure and certain irregular heart rhythms (atrial fibrillation). Has a narrow safety margin requiring careful monitoring.`,
    how_to_take: `Take at the same time each day. Can be taken with or without food. Do not change brand without consulting your doctor.`,
    side_effects: [
      `Nausea and vomiting`,
      `Loss of appetite`,
      `Visual disturbances (yellow-green halos)`,
      `Irregular heartbeat`,
      `Fatigue`
    ],
    warnings: [
      `Regular blood level monitoring is essential — toxicity is dangerous`,
      `Tell your doctor immediately about vision changes or severe nausea`,
      `Low potassium increases toxicity risk`,
      `Many drug interactions`
    ],
    interactions: [
      `Amiodarone — greatly increases digoxin levels`,
      `Furosemide — low potassium increases toxicity`,
      `Antibiotics like clarithromycin — increase levels`,
      `Calcium channel blockers — increase levels`
    ],
    algeria_brands: [
      `Digoxine 0.25mg`,
      `Hemigoxine 0.125mg`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste I`,
      lab: `BIOLOGICI`,
      generic_official: `DIGOXINE`,
      notice_url: `https://pharmnet-dz.com//notice.ashx?id=93`,
      pharmnet_url: `https://pharmnet-dz.com/m-3276-digoxine-0-5mg-2ml-sol-inj-iv-b-05-`,
      dosage_variants: [
        {
          dosage: `0,5MG/2ML`,
          form: `SOL. INJ`,
          conditioning: `B/05`,
          ppa: null
        }
      ]
    }
  },

  // ─── HYPERTENSION ───────────────────────────────────────────────────────────
  {
    name: `Cozaar`,
    scientific_name: `Losartan`,
    category: `Hypertension`,
    emoji: `❤️`,
    description: `Cozaar is an ARB medication used to lower blood pressure and protect the kidneys in diabetic patients.`,
    how_to_take: `Take once daily with or without food.`,
    side_effects: [
      `Dizziness`,
      `Fatigue`,
      `Back pain`
    ],
    warnings: [
      `Monitor kidney function and potassium levels`
    ],
    interactions: [
      `NSAIDs reduce effectiveness`
    ],
    algeria_brands: [
      `Cozaar 50mg`,
      `Cozaar 100mg`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste I`,
      lab: `MSD FRANCE`,
      generic_official: `LOSARTAN POTASSIQUE`,
      notice_url: `https://pharmnet-dz.com//notice.ashx?id=93`,
      pharmnet_url: `https://pharmnet-dz.com/m-5762-cozaar-100mg-comp-pelli-b-28`,
      dosage_variants: [
        {
          dosage: `100MG`,
          form: `COMP. PELLI`,
          conditioning: `B/28`,
          ppa: null
        },
        {
          dosage: `50MG`,
          form: `COMP SEC`,
          conditioning: `B/28`,
          ppa: null
        }
      ]
    }
  },
  {
    name: `Renitec`,
    scientific_name: `Enalapril`,
    category: `Hypertension`,
    emoji: `❤️`,
    description: `Renitec is an ACE inhibitor used for high blood pressure and heart failure.`,
    how_to_take: `Take once or twice daily before or after meals.`,
    side_effects: [
      `Dry cough`,
      `Dizziness`,
      `Low blood pressure`
    ],
    warnings: [
      `Monitor kidney function`,
      `Not safe during pregnancy`
    ],
    interactions: [
      `Potassium supplements increase hyperkalemia risk`
    ],
    algeria_brands: [
      `Renitec 5mg`,
      `Renitec 20mg`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste I`,
      lab: `MERCK SCHARP & DOHME LTD`,
      generic_official: `ENALAPRIL MALEATE`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=160`,
      pharmnet_url: `https://pharmnet-dz.com/m-160-renitec-20mg-comp-sec-b-28`,
      dosage_variants: [
        {
          dosage: `20MG`,
          form: `COMP. SEC`,
          conditioning: `B/28`,
          ppa: null
        },
        {
          dosage: `5MG`,
          form: `COMP. SEC`,
          conditioning: `B/28`,
          ppa: null
        }
      ]
    }
  },


  // ─── HEART ───────────────────────────────────────────────────────────
  {
    name: `Crestor`,
    scientific_name: `Rosuvastatin`,
    category: `Heart`,
    emoji: `💊`,
    description: `Crestor lowers cholesterol and reduces the risk of heart attack and stroke.`,
    how_to_take: `Take once daily with or without food.`,
    side_effects: [
      `Muscle pain`,
      `Headache`,
      `Nausea`
    ],
    warnings: [
      `Report muscle pain immediately`
    ],
    interactions: [
      `Warfarin increases bleeding risk`
    ],
    algeria_brands: [
      `Crestor 10mg`,
      `Crestor 20mg`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste I`,
      lab: `ASTRAZENECA`,
      generic_official: `ROSUVASTATINE  CALCIQUE EXPRIME EN ROSUVASTATINE`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=1614`,
      pharmnet_url: `https://pharmnet-dz.com/m-1614-crestor-10mg-comp-pelli-b-28`,
      dosage_variants: [
        {
          dosage: `10MG`,
          form: `COMP. PELLI`,
          conditioning: `B/28`,
          ppa: null
        },
        {
          dosage: `20MG`,
          form: `COMP. PELLI`,
          conditioning: `B/28`,
          ppa: null
        },
        {
          dosage: `5MG`,
          form: `COMP. PELLI`,
          conditioning: `B/28`,
          ppa: null
        }
      ]
    }
  },
  {
    name: `Lipanthyl`,
    scientific_name: `Fenofibrate`,
    category: `Heart`,
    emoji: `💊`,
    description: `Lipanthyl is used to reduce triglycerides and cholesterol levels.`,
    how_to_take: `Take with meals.`,
    side_effects: [
      `Stomach pain`,
      `Muscle pain`,
      `Nausea`
    ],
    warnings: [
      `Monitor liver function`
    ],
    interactions: [
      `Statins increase muscle toxicity risk`
    ],
    algeria_brands: [
      `Lipanthyl 160mg`
    ],
    pharmnet: {
      refundable: null,
      prescription_list: `Liste II`,
      lab: `FOURNIER`,
      generic_official: `FENOFIBRATE`,
      notice_url: `https://pharmnet-dz.com//notice.ashx?id=93`,
      pharmnet_url: `https://pharmnet-dz.com/m-1578-lipanthyl-160mg-comp-pelli--lm-b-30`,
      dosage_variants: [
        {
          dosage: `160MG`,
          form: `COMP. PELLI`,
          conditioning: `B/30`,
          ppa: null
        }
      ]
    }
  },

  {
    name: `Tildiem`,
    scientific_name: `Diltiazem`,
    category: `Heart`,
    emoji: `❤️`,
    description: `Tildiem is used for angina, hypertension, and certain heart rhythm disorders.`,
    how_to_take: `Take once or twice daily with food.`,
    side_effects: [
      `Slow heartbeat`,
      `Constipation`,
      `Dizziness`
    ],
    warnings: [
      `Monitor heart rate regularly`
    ],
    interactions: [
      `Beta-blockers increase bradycardia risk`
    ],
    algeria_brands: [
      `Tildiem 60mg`,
      `Tildiem LP 200mg`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste I`,
      lab: `SANOFI SYNTHELABO`,
      generic_official: `DILTIAZEM CHLORHYDRATE`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=49`,
      pharmnet_url: `https://pharmnet-dz.com/m-49-tildiem-60mg-comp-b-30`,
      dosage_variants: [
        {
          dosage: `60MG`,
          form: `COMP`,
          conditioning: `B/30`,
          ppa: `376.00 DA`
        }
      ]
    }
  },

  // ─── HYPERTENSION ───────────────────────────────────────────────────────────
  {
    name: `Spirozide`,
    scientific_name: `Spironolactone + Hydrochlorothiazide`,
    category: `Hypertension`,
    emoji: `❤️`,
    description: `Spirozide combines two diuretics to treat high blood pressure, heart failure, and fluid retention. Spironolactone also helps protect the heart.`,
    how_to_take: `Take once daily in the morning with or after breakfast. Avoid taking late in the day to prevent nighttime urination.`,
    side_effects: [
      `Increased urination`,
      `Dizziness`,
      `Electrolyte imbalances`,
      `Breast tenderness`,
      `Sensitivity to sunlight`
    ],
    warnings: [
      `Monitor potassium levels`,
      `Stay hydrated`,
      `Rise slowly from sitting/lying to prevent dizziness`,
      `Avoid potassium supplements unless prescribed`
    ],
    interactions: [
      `ACE inhibitors and ARBs — increased potassium risk`,
      `NSAIDs reduce diuretic effectiveness`,
      `Digoxin levels may change`
    ],
    algeria_brands: [
      `Spirozide 25mg/25mg`,
      `Spirozide 50mg/50mg`,
      `Aldactazine`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste II`,
      lab: `BIO-GALENIC`,
      generic_official: `SPIRONOLACTONE / ALTIZIDE`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=1484`,
      pharmnet_url: `https://pharmnet-dz.com/m-1484-spirozide-25mg-15mg-comp-pelli-sec-b-30`,
      dosage_variants: [
        {
          dosage: `25MG/15MG`,
          form: `COMP. PELLI`,
          conditioning: `B/30`,
          ppa: null
        }
      ]
    }
  },


  // ─── HEART ───────────────────────────────────────────────────────────
  {
    name: `Konakion`,
    scientific_name: `Phytomenadione (Vitamin K1)`,
    category: `Heart`,
    emoji: `🩸`,
    description: `Konakion is used to reverse the effects of anticoagulants like Sintrom (acenocoumarol) and warfarin, and to treat or prevent bleeding due to vitamin K deficiency.`,
    how_to_take: `Dosage determined by the doctor based on INR levels. Available as injectable and oral solution.`,
    side_effects: [
      `Flushing with IV administration`,
      `Rarely: allergic reactions`
    ],
    warnings: [
      `Do not alter Sintrom or warfarin dose without INR check first`,
      `Inform anticoagulation clinic before taking`
    ],
    interactions: [
      `Directly reverses the effect of oral anticoagulants`,
      `Antibiotics may reduce vitamin K produced by gut bacteria`
    ],
    algeria_brands: [
      `Konakion MM 10mg/mL`,
      `Konakion MM Paediatric 2mg/0.2mL`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `N/D`,
      lab: `HOFFMAN LAROCHE`,
      generic_official: `PHYTOMENADIONE`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=1744`,
      pharmnet_url: `https://pharmnet-dz.com/m-1744-konakion-mm-10mg-ml-sol-inj-iv-b-05amp-de-1ml`,
      dosage_variants: [
        {
          dosage: `10MG/ML`,
          form: `SOL. INJ`,
          conditioning: `B/05AMP. DE 1ML`,
          ppa: null
        }
      ]
    }
  },
  {
    name: `Xarelto`,
    scientific_name: `Rivaroxaban`,
    category: `Heart`,
    emoji: `🩸`,
    description: `Xarelto is a newer oral anticoagulant (NOAC/DOAC) used to prevent stroke in atrial fibrillation, treat blood clots, and prevent DVT after surgery. Unlike Sintrom, it does not require regular INR monitoring.`,
    how_to_take: `Take with the evening meal for atrial fibrillation (20mg). For DVT/PE treatment, take 15mg twice daily for 3 weeks, then 20mg once daily.`,
    side_effects: [
      `Bleeding (the main risk)`,
      `Nausea`,
      `Anemia`,
      `Easy bruising`
    ],
    warnings: [
      `Seek care immediately for any serious bleeding`,
      `Tell all doctors and dentists you take Xarelto`,
      `Avoid in severe kidney disease`,
      `Do not stop without medical advice`
    ],
    interactions: [
      `NSAIDs and aspirin — increased bleeding risk`,
      `Ketoconazole and ritonavir — increase drug levels`,
      `Rifampicin — reduces effectiveness`
    ],
    algeria_brands: [
      `Xarelto 10mg`,
      `Xarelto 15mg`,
      `Xarelto 20mg`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste I`,
      lab: `BAYER`,
      generic_official: `RIVAROXABAN`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=1818`,
      pharmnet_url: `https://pharmnet-dz.com/m-1818-xarelto-10mg-comp-pelli-b-05--b-10--b-30--b-100`,
      dosage_variants: [
        {
          dosage: `10MG`,
          form: `COMP. PELLI`,
          conditioning: `B/05 - B/10 - B/30 - B/100`,
          ppa: null
        },
        {
          dosage: `15MG`,
          form: `COMP. PELLI`,
          conditioning: `B/14 - B/42 - B/100`,
          ppa: null
        },
        {
          dosage: `20MG`,
          form: `COMP. PELLI`,
          conditioning: `B/28 - B/100`,
          ppa: null
        }
      ]
    }
  },
  {
    name: `Eliquis`,
    scientific_name: `Apixaban`,
    category: `Heart`,
    emoji: `🩸`,
    description: `Eliquis is a NOAC (newer oral anticoagulant) used to prevent stroke in atrial fibrillation, treat DVT and pulmonary embolism, and prevent clots after hip or knee surgery.`,
    how_to_take: `Take twice daily (5mg) with or without food. Take at regular 12-hour intervals.`,
    side_effects: [
      `Bleeding`,
      `Bruising`,
      `Nausea`,
      `Anemia`
    ],
    warnings: [
      `Do not stop without medical advice — serious clotting risk`,
      `Inform all healthcare providers before any procedures`,
      `Avoid in severe liver or kidney disease`
    ],
    interactions: [
      `Strong CYP3A4/P-gp inhibitors (ketoconazole, ritonavir) increase levels`,
      `Rifampicin reduces effectiveness`,
      `NSAIDs — bleeding risk`
    ],
    algeria_brands: [
      `Eliquis 2.5mg`,
      `Eliquis 5mg`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste I`,
      lab: `PFIZER`,
      generic_official: `APIXABAN`,
      notice_url: `https://pharmnet-dz.com//notice.ashx?id=93`,
      pharmnet_url: `https://pharmnet-dz.com/m-6087-eliquis-2-5-mg-comp-pelli-b-20`,
      dosage_variants: [
        {
          dosage: `2,5 MG`,
          form: `COMP`,
          conditioning: `B/20`,
          ppa: null
        },
        {
          dosage: `2,5 MG`,
          form: `COMP. PELLI`,
          conditioning: `B/60`,
          ppa: null
        }
      ]
    }
  },
  {
    name: `Pradaxa`,
    scientific_name: `Dabigatran`,
    category: `Heart`,
    emoji: `🩸`,
    description: `Pradaxa is a direct thrombin inhibitor anticoagulant used for stroke prevention in atrial fibrillation and treatment of venous thromboembolism.`,
    how_to_take: `Take twice daily (110mg or 150mg) with a full glass of water. Swallow whole — do not open capsules.`,
    side_effects: [
      `Bleeding`,
      `Nausea`,
      `Dyspepsia`,
      `Stomach pain`
    ],
    warnings: [
      `Do not crush or chew capsules`,
      `Do not use with severe kidney disease`,
      `Tell all healthcare providers`,
      `A specific antidote (idarucizumab) is available for emergency reversal`
    ],
    interactions: [
      `P-gp inhibitors (amiodarone, verapamil) — increase levels`,
      `Rifampicin — reduces levels`,
      `NSAIDs — bleeding risk`
    ],
    algeria_brands: [
      `Pradaxa 110mg`,
      `Pradaxa 150mg`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste I`,
      lab: `BOEHRINGER INGELHEIM`,
      generic_official: `DABIGATRAN ETEXILATE MESILATE`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=6036`,
      pharmnet_url: `https://pharmnet-dz.com/m-6036-pradaxa-110-mg-gelule-b-30-`,
      dosage_variants: [
        {
          dosage: `110MG`,
          form: `GLES`,
          conditioning: `B/30`,
          ppa: null
        },
        {
          dosage: `110MG`,
          form: `GLES`,
          conditioning: `B/60`,
          ppa: null
        },
        {
          dosage: `150MG`,
          form: `GLES`,
          conditioning: `B/60`,
          ppa: null
        },
        {
          dosage: `75 MG`,
          form: `GLES`,
          conditioning: `B/30`,
          ppa: null
        }
      ]
    }
  },
  {
    name: `Vastarel`,
    scientific_name: `Trimetazidine`,
    category: `Heart`,
    emoji: `❤️`,
    description: `Vastarel is used as an add-on therapy for stable angina to improve myocardial energy metabolism and reduce angina frequency. Widely used in Algeria for heart disease management.`,
    how_to_take: `Take twice daily (35mg modified-release) with meals.`,
    side_effects: [
      `Nausea`,
      `Diarrhea`,
      `Dizziness`,
      `Headache`,
      `Rarely: Parkinson-like symptoms in elderly`
    ],
    warnings: [
      `Not for acute angina attacks`,
      `Not for Parkinson's disease or movement disorders`,
      `Reduce dose in kidney disease`
    ],
    interactions: [
      `Few significant drug interactions`
    ],
    algeria_brands: [
      `Vastarel MR 35mg`,
      `Trimetazidine Mylan`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste II`,
      lab: `SERVIER`,
      generic_official: `TRIMETAZIDINE DICHLORHYDRATE`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=1517`,
      pharmnet_url: `https://pharmnet-dz.com/m-1517-vastarel-35mg-comp-pelli-lm-b-60`,
      dosage_variants: [
        {
          dosage: `35MG`,
          form: `COMP. PELLI`,
          conditioning: `B/60`,
          ppa: null
        }
      ]
    }
  },
  {
    name: `Procoralan`,
    scientific_name: `Ivabradine`,
    category: `Heart`,
    emoji: `❤️`,
    description: `Procoralan slows the heart rate by a specific mechanism without affecting blood pressure. Used for chronic heart failure and angina in patients whose heart rate is too fast.`,
    how_to_take: `Take twice daily with food (morning and evening meals).`,
    side_effects: [
      `Visual brightness (phosphenes — light flashing in vision)`,
      `Slow heart rate`,
      `Headache`,
      `Dizziness`,
      `Blurred vision`
    ],
    warnings: [
      `Not for use in atrial fibrillation`,
      `Do not use if heart rate is below 60 bpm at rest`,
      `Driving may be affected by visual side effects`
    ],
    interactions: [
      `Azithromycin and other QT-prolonging drugs`,
      `CYP3A4 inhibitors (diltiazem, verapamil) increase levels`,
      `Grapefruit juice increases levels`
    ],
    algeria_brands: [
      `Procoralan 5mg`,
      `Procoralan 7.5mg`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste I`,
      lab: `SERVIER`,
      generic_official: `IVABRADINE CHLORHYDRATE EXPRIME EN IVABRADINE`,
      notice_url: `https://pharmnet-dz.com//notice.ashx?id=93`,
      pharmnet_url: `https://pharmnet-dz.com/m-122-procoralan-5mg-comp-pelli-b-56`,
      dosage_variants: [
        {
          dosage: `5MG`,
          form: `COMP. PELLI`,
          conditioning: `B/56`,
          ppa: null
        },
        {
          dosage: `7,5MG`,
          form: `COMP. PELLI`,
          conditioning: `B/56`,
          ppa: null
        }
      ]
    }
  },
  {
    name: `Ezetrol`,
    scientific_name: `Ezetimibe`,
    category: `Heart`,
    emoji: `💊`,
    description: `Ezetrol reduces cholesterol by blocking its absorption in the intestine. Often combined with a statin for better cholesterol control in patients with cardiovascular disease.`,
    how_to_take: `Take once daily (10mg) at any time of day, with or without food. Can be taken at the same time as a statin.`,
    side_effects: [
      `Headache`,
      `Stomach pain`,
      `Diarrhea`,
      `Fatigue`,
      `Muscle pain (rare)`
    ],
    warnings: [
      `Report unusual muscle pain or weakness`,
      `Monitor liver function when combined with statin`,
      `Not for active liver disease`
    ],
    interactions: [
      `Bile acid sequestrants (cholestyramine) — take Ezetrol 2 hours before or 4 hours after`,
      `Cyclosporine — increases ezetimibe levels`
    ],
    algeria_brands: [
      `Ezetrol 10mg`,
      `Inegy (Ezetimibe + Simvastatin)`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste I`,
      lab: `MERCK SCHARP & DOHME LTD`,
      generic_official: `EZETIMIBE`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=1627`,
      pharmnet_url: `https://pharmnet-dz.com/m-1627-ezetrol-10mg-comp-b-30`,
      dosage_variants: [
        {
          dosage: `10MG`,
          form: `COMP`,
          conditioning: `B/30`,
          ppa: null
        }
      ]
    }
  },

  // ─── HYPERTENSION ───────────────────────────────────────────────────────────

  {
    name: `Catapressan`,
    scientific_name: `Clonidine`,
    category: `Hypertension`,
    emoji: `❤️`,
    description: `Catapressan is a centrally acting antihypertensive used for moderate to severe hypertension that is not controlled by other medications.`,
    how_to_take: `Take 2-3 times daily. Must never be stopped suddenly.`,
    side_effects: [
      `Dry mouth (very common)`,
      `Drowsiness`,
      `Dizziness`,
      `Constipation`,
      `Depression`
    ],
    warnings: [
      `Never stop abruptly — risk of dangerous rebound hypertension`,
      `Do not drive or operate machinery if drowsy`,
      `Avoid alcohol`
    ],
    interactions: [
      `Beta-blockers — severe rebound hypertension if clonidine is stopped first`,
      `Tricyclic antidepressants reduce effectiveness`
    ],
    algeria_brands: [
      `Catapressan 0.15mg`,
      `Clonidine injectable`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste II`,
      lab: `BOEHRINGER INGELHEIM`,
      generic_official: `CLONIDINE`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=144`,
      pharmnet_url: `https://pharmnet-dz.com/m-144-catapressan-0-15mg-comp-b-20`,
      dosage_variants: [
        {
          dosage: `0,15MG`,
          form: `COMP`,
          conditioning: `B/20`,
          ppa: null
        },
        {
          dosage: `0,15MG/ML`,
          form: `SOL. INJ`,
          conditioning: `B/30`,
          ppa: null
        }
      ]
    }
  },

  {
    name: `Lercan`,
    scientific_name: `Lercanidipine`,
    category: `Hypertension`,
    emoji: `❤️`,
    description: `Lercan is a third-generation calcium channel blocker for hypertension that causes less ankle swelling than older calcium channel blockers.`,
    how_to_take: `Take once daily, 15 minutes before a meal. Do not take with grapefruit juice.`,
    side_effects: [
      `Headache`,
      `Flushing`,
      `Ankle swelling (less than older CCBs)`,
      `Palpitations`,
      `Dizziness`
    ],
    warnings: [
      `Not for unstable angina`,
      `Avoid grapefruit`,
      `Do not use in severe liver or kidney disease`
    ],
    interactions: [
      `Cyclosporine — mutual increase in levels`,
      `CYP3A4 inhibitors (ketoconazole) increase lercanidipine levels`,
      `Rifampicin reduces effectiveness`
    ],
    algeria_brands: [
      `Lercan 10mg`,
      `Lercan 20mg`,
      `Zanidip 10mg`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste I`,
      lab: `NOVAPHARM TRADING`,
      generic_official: `LERCANIDIPINE CHLORHYDRATE`,
      notice_url: `https://pharmnet-dz.com//notice.ashx?id=93`,
      pharmnet_url: `https://pharmnet-dz.com/m-5755-lerca-10mg-comp-pelli-sec-b-30-`,
      dosage_variants: [
        {
          dosage: `10MG`,
          form: `COMP. PELLI`,
          conditioning: `B/30`,
          ppa: null
        }
      ]
    }
  },
  {
    name: `Hyzaar`,
    scientific_name: `Losartan + Hydrochlorothiazide`,
    category: `Hypertension`,
    emoji: `❤️`,
    description: `Hyzaar combines losartan (ARB) and hydrochlorothiazide (diuretic) for patients whose blood pressure is not controlled by either medication alone.`,
    how_to_take: `Take once daily with or without food.`,
    side_effects: [
      `Dizziness`,
      `Fatigue`,
      `Increased urination`,
      `Low potassium`,
      `Back pain`
    ],
    warnings: [
      `Not safe in pregnancy`,
      `Monitor kidney function and electrolytes`,
      `Stay hydrated in hot weather`
    ],
    interactions: [
      `NSAIDs reduce effectiveness`,
      `Lithium — toxicity risk`,
      `Potassium-sparing diuretics — electrolyte imbalance`
    ],
    algeria_brands: [
      `Hyzaar 50mg/12.5mg`,
      `Hyzaar 100mg/25mg`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste I`,
      lab: `MSD FRANCE`,
      generic_official: `LOSARTAN POTASSIQUE /  HYDROCHLOROTHIAZIDE`,
      notice_url: `https://pharmnet-dz.com//notice.ashx?id=93`,
      pharmnet_url: `https://pharmnet-dz.com/m-5753-hyzaar-50mg-12-5mg-comp-b-28`,
      dosage_variants: [
        {
          dosage: `50MG/12,5MG`,
          form: `COMP`,
          conditioning: `B/28`,
          ppa: null
        }
      ]
    }
  },
  {
    name: `Exforge`,
    scientific_name: `Amlodipine + Valsartan`,
    category: `Hypertension`,
    emoji: `❤️`,
    description: `Exforge is a fixed-dose combination of amlodipine (calcium channel blocker) and valsartan (ARB) for patients who need two medications to control blood pressure.`,
    how_to_take: `Take once daily with or without food.`,
    side_effects: [
      `Ankle swelling`,
      `Headache`,
      `Dizziness`,
      `Fatigue`,
      `Flushing`
    ],
    warnings: [
      `Not safe in pregnancy`,
      `Monitor kidney function and potassium`,
      `Avoid grapefruit juice`
    ],
    interactions: [
      `NSAIDs reduce effectiveness`,
      `CYP3A4 inhibitors increase amlodipine levels`,
      `Potassium-sparing diuretics — hyperkalemia`
    ],
    algeria_brands: [
      `Exforge 5mg/80mg`,
      `Exforge 5mg/160mg`,
      `Exforge 10mg/160mg`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste I`,
      lab: `NOVARTIS`,
      generic_official: `AMLODIPINE BESILATE EXPRIME EN AMLODIPINE / VALSARTAN`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=3198`,
      pharmnet_url: `https://pharmnet-dz.com/m-3198-exforge-10mg-160mg-comp-pelli-b-28`,
      dosage_variants: [
        {
          dosage: `10MG/160MG`,
          form: `COMP. PELLI`,
          conditioning: `B/28`,
          ppa: `1400.00 DA`
        },
        {
          dosage: `5MG/160MG`,
          form: `COMP. PELLI`,
          conditioning: `B/28`,
          ppa: `1718.00 DA`
        },
        {
          dosage: `5MG/80MG`,
          form: `COMP. PELLI`,
          conditioning: `B/28`,
          ppa: `1400.00 DA`
        }
      ]
    }
  },
  {
    name: `Atacand`,
    scientific_name: `Candesartan`,
    category: `Hypertension`,
    emoji: `❤️`,
    description: `Atacand is an ARB used to treat hypertension and heart failure. It also reduces the risk of cardiovascular events in heart failure patients.`,
    how_to_take: `Take once daily (4-32mg) with or without food.`,
    side_effects: [
      `Dizziness`,
      `Headache`,
      `Respiratory infections`,
      `Back pain`
    ],
    warnings: [
      `Not safe in pregnancy`,
      `Monitor kidney function and potassium`,
      `Can cause low blood pressure with first dose`
    ],
    interactions: [
      `NSAIDs reduce effectiveness`,
      `Potassium-sparing diuretics — hyperkalemia`,
      `Lithium — toxicity risk`
    ],
    algeria_brands: [
      `Atacand 4mg`,
      `Atacand 8mg`,
      `Atacand 16mg`,
      `Atacand 32mg`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste I`,
      lab: `ASTRAZENECA`,
      generic_official: `CANDESARTAN CILEXETIL`,
      notice_url: `https://pharmnet-dz.com//notice.ashx?id=93`,
      pharmnet_url: `https://pharmnet-dz.com/m-6095-atacand-16mg-comp-sec--b-30-`,
      dosage_variants: [
        {
          dosage: `16 MG`,
          form: `COMP SEC`,
          conditioning: `B/30`,
          ppa: null
        },
        {
          dosage: `4MG`,
          form: `COMP. SEC`,
          conditioning: `B/28`,
          ppa: null
        },
        {
          dosage: `8MG`,
          form: `COMP. SEC`,
          conditioning: `B/30`,
          ppa: null
        }
      ]
    }
  },

  


  // ─── THYROID ───────────────────────────────────────────────────────────
  {
    name: `Levothyrox`,
    scientific_name: `Levothyroxine Sodium`,
    category: `Thyroid`,
    emoji: `🦋`,
    description: `Levothyrox replaces the thyroid hormone that your thyroid gland cannot produce enough of. Used for hypothyroidism (underactive thyroid). Must be taken consistently every day.`,
    how_to_take: `Take on an empty stomach, 30-60 minutes before breakfast. Take at the same time every morning. Do not skip doses.`,
    side_effects: [
      `At correct dose: usually none`,
      `If dose too high: rapid heartbeat, weight loss, anxiety, sweating, insomnia`
    ],
    warnings: [
      `Very important to take every single day`,
      `Never change brand without telling your doctor`,
      `Many foods and medications interfere with absorption`,
      `Regular blood tests (TSH) are essential`
    ],
    interactions: [
      `Calcium supplements — take 4 hours apart`,
      `Iron supplements — take 4 hours apart`,
      `Antacids — take 4 hours apart`,
      `Certain diabetes medications may need dose adjustment`
    ],
    algeria_brands: [
      `Levothyrox 25mcg`,
      `Levothyrox 50mcg`,
      `Levothyrox 75mcg`,
      `Levothyrox 100mcg`,
      `Levothyrox 125mcg`,
      `Levothyrox 150mcg`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste II`,
      lab: `MERCK SANTE S.A.S`,
      generic_official: `LEVOTHYROXINE  SODIQUE`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=3806`,
      pharmnet_url: `https://pharmnet-dz.com/m-3806-levothyrox-100Âµg-comp-sec-b-30`,
      dosage_variants: [
        {
          dosage: `100ÂµG`,
          form: `COMP. SEC`,
          conditioning: `B/30`,
          ppa: null
        },
        {
          dosage: `25ÂµG`,
          form: `COMP. SEC`,
          conditioning: `B/30`,
          ppa: null
        },
        {
          dosage: `50ÂµG`,
          form: `COMP. SEC`,
          conditioning: `B/30`,
          ppa: null
        },
        {
          dosage: `75ÂµG`,
          form: `COMP. SEC`,
          conditioning: `B/30`,
          ppa: null
        }
      ]
    }
  },
  {
    name: `Thyrozol`,
    scientific_name: `Thiamazole (Methimazole)`,
    category: `Thyroid`,
    emoji: `🦋`,
    description: `Thyrozol is used to treat hyperthyroidism (overactive thyroid). It reduces the amount of thyroid hormone produced by the thyroid gland.`,
    how_to_take: `Take at regular intervals throughout the day. Take with food to reduce stomach upset.`,
    side_effects: [
      `Nausea`,
      `Headache`,
      `Skin rash or itching`,
      `Joint pain`,
      `Rarely: agranulocytosis (low white blood cells)`
    ],
    warnings: [
      `Seek immediate care if you develop fever, sore throat, or mouth ulcers — may indicate agranulocytosis`,
      `Regular blood tests needed`,
      `Not for use in first trimester of pregnancy`
    ],
    interactions: [
      `Warfarin — may increase anticoagulant effect`,
      `Beta-blockers used with it for symptom control`
    ],
    algeria_brands: [
      `Thyrozol 5mg`,
      `Thyrozol 10mg`,
      `Thyrozol 20mg`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `N/D`,
      lab: `GENERIC LAB`,
      generic_official: `CARBIMAZOLE`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=617`,
      pharmnet_url: `https://pharmnet-dz.com/m-617-athyrozol-5mg-comp-sec-b-50`,
      dosage_variants: [
        {
          dosage: `5MG`,
          form: `COMP. SEC`,
          conditioning: `B/50`,
          ppa: null
        }
      ]
    }
  },

  {
    name: `Basdène`,
    scientific_name: `Benzylthiouracil`,
    category: `Thyroid`,
    emoji: `🦋`,
    description: `Basdène is used to treat hyperthyroidism by reducing thyroid hormone production.`,
    how_to_take: `Take regularly with meals.`,
    side_effects: [
      `Skin rash`,
      `Joint pain`,
      `Nausea`
    ],
    warnings: [
      `Seek medical help for fever or sore throat`
    ],
    interactions: [
      `Warfarin effect may increase`
    ],
    algeria_brands: [
      `Basdène 25mg`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste I`,
      lab: `BOUCHARA-RECORDATI`,
      generic_official: `BENZYLTHIOURACILE`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=620`,
      pharmnet_url: `https://pharmnet-dz.com/m-620-basdene-25mg-comp-b-50`,
      dosage_variants: [
        {
          dosage: `25MG`,
          form: `COMP`,
          conditioning: `B/50`,
          ppa: null
        }
      ]
    }
  },


  // ─── RESPIRATORY ───────────────────────────────────────────────────────────
  {
    name: `Ventoline`,
    scientific_name: `Salbutamol (Albuterol)`,
    category: `Respiratory`,
    emoji: `🫁`,
    description: `Ventoline is a short-acting bronchodilator (reliever inhaler) used to quickly open the airways during asthma attacks or breathing difficulties. It is the most commonly used rescue inhaler in Algeria.`,
    how_to_take: `Shake well before use. Breathe out fully, place mouthpiece in mouth, press and breathe in slowly, hold breath for 10 seconds. Usually 1-2 puffs as needed.`,
    side_effects: [
      `Trembling or shaking`,
      `Fast heartbeat`,
      `Headache`,
      `Feeling nervous`,
      `Low potassium with high doses`
    ],
    warnings: [
      `Do not use more than prescribed — overuse suggests poorly controlled asthma`,
      `Seek emergency care if usual dose does not relieve attack`,
      `Tell doctor if you need it more than twice a week`
    ],
    interactions: [
      `Beta-blockers reduce effectiveness`,
      `Other bronchodilators — additive effects`,
      `Diuretics — low potassium risk`
    ],
    algeria_brands: [
      `Ventoline 100mcg inhaler`,
      `Ventoline 2mg/5mL syrup`,
      `Ventoline nebulizer solution`,
      `Salbutamol Mylan`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste I`,
      lab: `GLAXO SMITHKLINE`,
      generic_official: `SALBUTAMOL`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=2074`,
      pharmnet_url: `https://pharmnet-dz.com/m-2074-ventoline-0-5mg-ml-sol-inj-s-c-b-6amp`,
      dosage_variants: [
        {
          dosage: `0,5MG/ML`,
          form: `SOL. INJ`,
          conditioning: `B/6AMP`,
          ppa: null
        },
        {
          dosage: `100ÂµG/DOSE`,
          form: `AERO`,
          conditioning: `FL/200DOSES`,
          ppa: null
        },
        {
          dosage: `2MG`,
          form: `COMP`,
          conditioning: `B/40`,
          ppa: null
        },
        {
          dosage: `5MG/ML`,
          form: `AERO`,
          conditioning: `FL/10ML`,
          ppa: null
        }
      ]
    }
  },
  {
    name: `Seretide`,
    scientific_name: `Fluticasone + Salmeterol`,
    category: `Respiratory`,
    emoji: `🫁`,
    description: `Seretide combines a corticosteroid (fluticasone) to reduce airway inflammation with a long-acting bronchodilator (salmeterol) to keep airways open. Used as a maintenance inhaler for asthma and COPD.`,
    how_to_take: `Use twice daily, morning and evening. Rinse mouth with water after each use to prevent oral thrush. Do not use as a rescue inhaler.`,
    side_effects: [
      `Oral thrush (fungal infection in mouth)`,
      `Hoarse voice`,
      `Headache`,
      `Throat irritation`,
      `Muscle cramps`
    ],
    warnings: [
      `Never use as rescue inhaler — always have Ventoline for attacks`,
      `Rinse mouth after every use`,
      `Do not stop suddenly`,
      `Report increased breathlessness`
    ],
    interactions: [
      `Ritonavir and ketoconazole increase fluticasone levels`,
      `Beta-blockers may reduce salmeterol effectiveness`
    ],
    algeria_brands: [
      `Seretide 25/50mcg Evohaler`,
      `Seretide 25/125mcg`,
      `Seretide 25/250mcg`,
      `Seretide Diskus`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste I`,
      lab: `GLAXO SMITHKLINE`,
      generic_official: `FLUTICASONE PROPIONATE / SALMETEROL XINAFOATE EXPRIME EN SALMETEROL`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=2127`,
      pharmnet_url: `https://pharmnet-dz.com/m-2127-seretide-diskus-100Âµg-50Âµg-dose-pdre-p-inhal-f-60doses`,
      dosage_variants: [
        {
          dosage: `100ÂµG/50ÂµG/DOSE`,
          form: `PDRE. INHAL`,
          conditioning: `F/60DOSES`,
          ppa: null
        },
        {
          dosage: `250ÂµG/50ÂµG/DOSE`,
          form: `PDRE. INHAL`,
          conditioning: `F/60DOSES`,
          ppa: null
        },
        {
          dosage: `500ÂµG/50ÂµG/DOSE`,
          form: `PDRE. INHAL`,
          conditioning: `F/60DOSES`,
          ppa: `3046.00 DA`
        }
      ]
    }
  },
  {
    name: `Symbicort`,
    scientific_name: `Budesonide + Formoterol`,
    category: `Respiratory`,
    emoji: `🫁`,
    description: `Symbicort is a combination inhaler used for maintenance treatment of asthma and COPD. It contains a steroid and a long-acting bronchodilator.`,
    how_to_take: `Inhale once or twice daily as prescribed. Rinse mouth after use. Can be used as both maintenance and reliever (SMART therapy) in asthma.`,
    side_effects: [
      `Oral thrush`,
      `Hoarse voice`,
      `Headache`,
      `Throat irritation`,
      `Trembling`
    ],
    warnings: [
      `Rinse mouth after every use`,
      `Do not use as sole rescue inhaler unless prescribed for SMART therapy`,
      `Report worsening symptoms immediately`
    ],
    interactions: [
      `Ketoconazole increases budesonide levels`,
      `Beta-blockers reduce formoterol effectiveness`
    ],
    algeria_brands: [
      `Symbicort Turbuhaler 80/4.5mcg`,
      `Symbicort Turbuhaler 160/4.5mcg`,
      `Symbicort 320/9mcg`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste I`,
      lab: `ASTRAZENECA`,
      generic_official: `BUDESONIDE / FORMOTEROL`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=1354`,
      pharmnet_url: `https://pharmnet-dz.com/m-1354-symbicort-turbuhaler-100Âµg-6Âµg-dose-pdre-p-inhal-fl-120doses`,
      dosage_variants: [
        {
          dosage: `100ÂµG/6ÂµG/DOSE`,
          form: `PDRE. INHAL`,
          conditioning: `FL./120DOSES`,
          ppa: null
        },
        {
          dosage: `200ÂµG/6ÂµG/DOSE`,
          form: `PDRE. INHAL`,
          conditioning: `FL./120DOSES`,
          ppa: null
        },
        {
          dosage: `400ÂµG/12ÂµG/DOSE`,
          form: `PDRE. INHAL`,
          conditioning: `FL./60DOSES`,
          ppa: `3088.00 DA`
        }
      ]
    }
  },
  {
    name: `Spiriva`,
    scientific_name: `Tiotropium`,
    category: `Respiratory`,
    emoji: `🫁`,
    description: `Spiriva is a long-acting anticholinergic bronchodilator used once daily for COPD (chronic bronchitis and emphysema). It keeps the airways open throughout the day.`,
    how_to_take: `Use once daily at the same time each morning. Insert capsule into HandiHaler device and inhale. Do not swallow the capsule.`,
    side_effects: [
      `Dry mouth (very common)`,
      `Constipation`,
      `Urinary retention`,
      `Blurred vision`,
      `Throat irritation`
    ],
    warnings: [
      `Do not get powder in eyes — can cause blurred vision or glaucoma`,
      `Tell doctor if you have prostate or bladder problems`,
      `Not for acute breathlessness — use Ventoline for attacks`
    ],
    interactions: [
      `Other anticholinergics — avoid combining`,
      `Limited systemic interactions`
    ],
    algeria_brands: [
      `Spiriva HandiHaler 18mcg`,
      `Spiriva Respimat 2.5mcg`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste I`,
      lab: `BOEHRINGER INGELHEIM`,
      generic_official: `TIOTROPIUM BROMURE MONOHYDRATE EXPRIME EN TIOTROPIUM`,
      notice_url: `https://pharmnet-dz.com//notice.ashx?id=6011`,
      pharmnet_url: `https://pharmnet-dz.com/m-2141-spiriva-18Âµg-pdre-p-inhalation-en-gles-b-30-et-b-30-inhalateur-handihaler-`,
      dosage_variants: [
        {
          dosage: `18ÂµG`,
          form: `PDRE. INHAL`,
          conditioning: `B/30 ET B/30+INHALATEUR (HanDihaler)`,
          ppa: null
        }
      ]
    }
  },
  {
    name: `Atrovent`,
    scientific_name: `Ipratropium`,
    category: `Respiratory`,
    emoji: `🫁`,
    description: `Atrovent is a bronchodilator used in COPD and chronic bronchitis to improve breathing.`,
    how_to_take: `Use inhaler regularly as prescribed.`,
    side_effects: [
      `Dry mouth`,
      `Cough`,
      `Headache`
    ],
    warnings: [
      `Avoid spraying into eyes`
    ],
    interactions: [
      `Other anticholinergics increase side effects`
    ],
    algeria_brands: [
      `Atrovent inhaler`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste I`,
      lab: `BOEHRINGER INGELHEIM`,
      generic_official: `IPRATROPIUM BROMURE`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=2104`,
      pharmnet_url: `https://pharmnet-dz.com/m-2104-atrovent-adul--0-50mg-2ml-sol-inhal-par-nebuliseur-b-10-recipients-unidoses-de-2ml`,
      dosage_variants: [
        {
          dosage: `0,50MG/2ML`,
          form: `SOL. INHAL`,
          conditioning: `B/10 RECIPIENTS UNIDOSES DE  2ML`,
          ppa: null
        }
      ]
    }
  },
  {
    name: `Foster`,
    scientific_name: `Beclometasone + Formoterol`,
    category: `Respiratory`,
    emoji: `🫁`,
    description: `Foster combines a corticosteroid and bronchodilator for asthma and COPD maintenance treatment.`,
    how_to_take: `Use twice daily and rinse mouth afterward.`,
    side_effects: [
      `Oral thrush`,
      `Hoarse voice`,
      `Headache`
    ],
    warnings: [
      `Not for acute asthma attacks`
    ],
    interactions: [
      `Beta-blockers reduce effectiveness`
    ],
    algeria_brands: [
      `Foster 100/6 inhaler`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste I`,
      lab: `CHIESI S.A.`,
      generic_official: `BECLOMETASONE DIPROPIONATE/ FORMOTEROL FUMARATE DIHYDRATE`,
      notice_url: `https://pharmnet-dz.com//notice.ashx?id=6011`,
      pharmnet_url: `https://pharmnet-dz.com/m-1362-foster-100Âµg-6Âµg-sol-p-inhalation-fl-120-doses`,
      dosage_variants: [
        {
          dosage: `100ÂµG/6ÂµG`,
          form: `SOL. INHAL`,
          conditioning: `FL/120 DOSES`,
          ppa: `3127.58 DA`
        }
      ]
    }
  },
  {
    name: `Flixotide`,
    scientific_name: `Fluticasone`,
    category: `Respiratory`,
    emoji: `🫁`,
    description: `Flixotide is an inhaled corticosteroid used to control chronic asthma inflammation.`,
    how_to_take: `Use regularly and rinse mouth after use.`,
    side_effects: [
      `Oral thrush`,
      `Hoarse voice`,
      `Cough`
    ],
    warnings: [
      `Do not stop suddenly`
    ],
    interactions: [
      `Ketoconazole increases fluticasone levels`
    ],
    algeria_brands: [
      `Flixotide 125mcg`,
      `Flixotide 250mcg`
    ],
    pharmnet: {
      refundable: null,
      prescription_list: `Liste I`,
      lab: `GLAXO SMITHKLINE`,
      generic_official: `FLUTICASONE PROPIONATE`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=2115`,
      pharmnet_url: `https://pharmnet-dz.com/m-2115-flixotide-125Âµg-dose-susp-inhal-buccale-fl-120doses`,
      dosage_variants: [
        {
          dosage: `125ÂµG/DOSE`,
          form: `SUSP. INHAL`,
          conditioning: `FL/120DOSES`,
          ppa: null
        },
        {
          dosage: `250ÂµG/DOSE`,
          form: `SUSP. INHAL`,
          conditioning: `FL/60DOSES`,
          ppa: null
        },
        {
          dosage: `50ÂµG/DOSE`,
          form: `SUSP. INHAL`,
          conditioning: `FL./120DOSES`,
          ppa: null
        }
      ]
    }
  },

  {
    name: `Bricanyl`,
    scientific_name: `Terbutaline`,
    category: `Respiratory`,
    emoji: `🫁`,
    description: `Bricanyl is a short-acting beta-2 agonist bronchodilator used to relieve bronchospasm in asthma and COPD. Available as inhaler and nebulizer solution.`,
    how_to_take: `Inhale 1-2 puffs as needed for breathlessness. Nebulizer solution diluted and used 3-4 times daily if needed.`,
    side_effects: [
      `Tremors`,
      `Fast heartbeat`,
      `Headache`,
      `Nervousness`,
      `Low potassium at high doses`
    ],
    warnings: [
      `Seek emergency care if relief is inadequate`,
      `Do not use more frequently than prescribed`
    ],
    interactions: [
      `Beta-blockers reduce effectiveness`,
      `Diuretics — low potassium risk`
    ],
    algeria_brands: [
      `Bricanyl Turbuhaler 0.5mg`,
      `Bricanyl 0.5mg/mL nebulizer`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste I`,
      lab: `ASTRAZENECA`,
      generic_official: `TERBUTALINE SULFATE`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=2109`,
      pharmnet_url: `https://pharmnet-dz.com/m-2109-bricanyl-5mg-2ml-sol-p-inhal-bucc-par-nebuliseur-en-recipient-unidose-de-2ml-b-50`,
      dosage_variants: [
        {
          dosage: `5MG/2ML`,
          form: `SOL. INHAL`,
          conditioning: `B/50`,
          ppa: null
        },
        {
          dosage: `0,5MG/ML`,
          form: `SOL. INJ`,
          conditioning: `B/8`,
          ppa: null
        }
      ]
    }
  },
  {
    name: `Pulmicort`,
    scientific_name: `Budesonide`,
    category: `Respiratory`,
    emoji: `🫁`,
    description: `Pulmicort is an inhaled corticosteroid used as a maintenance treatment to prevent asthma attacks and control airway inflammation. Available as Turbuhaler and nebulizer suspension.`,
    how_to_take: `Use once or twice daily as prescribed. Rinse mouth with water and spit after each dose.`,
    side_effects: [
      `Oral thrush`,
      `Hoarse voice`,
      `Cough`,
      `Throat irritation`
    ],
    warnings: [
      `Rinse mouth after every use`,
      `Do not use as a rescue inhaler`,
      `Do not stop suddenly`
    ],
    interactions: [
      `Ketoconazole and itraconazole increase budesonide blood levels`
    ],
    algeria_brands: [
      `Pulmicort Turbuhaler 100mcg`,
      `Pulmicort Turbuhaler 200mcg`,
      `Pulmicort 0.25mg nebulizer`,
      `Pulmicort 0.5mg nebulizer`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste I`,
      lab: `ASTRAZENECA`,
      generic_official: `BUDESONIDE`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=2120`,
      pharmnet_url: `https://pharmnet-dz.com/m-2120-pulmicort-0-5mg-2ml-susp-p--inhal-par-nebuliseur-en-recipient-unidose-b-04etuis-de-05-recipients-unidoses`,
      dosage_variants: [
        {
          dosage: `0,5MG/2ML`,
          form: `SUSP. INHAL`,
          conditioning: `B/04ETUIS DE 05 RECIPIENTS UNIDOSES`,
          ppa: `3006.00 DA`
        },
        {
          dosage: `1MG/ 2ML`,
          form: `SUSP. INHAL`,
          conditioning: `B/04ETUIS DE 05 RECIPIENTS UNIDOSES`,
          ppa: `1851.00 DA`
        }
      ]
    }
  },
  {
    name: `Singulair`,
    scientific_name: `Montelukast`,
    category: `Respiratory`,
    emoji: `🫁`,
    description: `Singulair is a leukotriene receptor antagonist used as an add-on treatment for asthma and to relieve seasonal allergic rhinitis. Often used in children and adults with both conditions.`,
    how_to_take: `Take once daily in the evening. Can be taken with or without food. Chewable tablets for children.`,
    side_effects: [
      `Headache`,
      `Stomach pain`,
      `Thirst`,
      `Rarely: sleep disturbances, mood changes, depression`
    ],
    warnings: [
      `Report any behavioral changes, depression, or mood disturbances — particularly in children`,
      `Not for acute asthma attacks`
    ],
    interactions: [
      `Phenobarbital and rifampicin reduce effectiveness`,
      `Few significant interactions`
    ],
    algeria_brands: [
      `Singulair 5mg (chewable)`,
      `Singulair 10mg`,
      `Montelukast Mylan`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste I`,
      lab: `MERCK SCHARP & DOHME LTD`,
      generic_official: `MONTELUKAST SODIQUE EXPRIME EN MONTELUKAST`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=2132`,
      pharmnet_url: `https://pharmnet-dz.com/m-2132-singulair-10mg-comp-pelli-b-28`,
      dosage_variants: [
        {
          dosage: `10MG`,
          form: `COMP. PELLI`,
          conditioning: `B/28`,
          ppa: null
        },
        {
          dosage: `4MG`,
          form: `COMP. A CROQ`,
          conditioning: `B/28`,
          ppa: `2566.00 DA`
        },
        {
          dosage: `4MG/SACHET`,
          form: `GRLES`,
          conditioning: `B/28 SACHETS`,
          ppa: null
        },
        {
          dosage: `5MG`,
          form: `COMP. A CROQ`,
          conditioning: `B/28`,
          ppa: null
        }
      ]
    }
  },
  {
    name: `Rhinathiol`,
    scientific_name: `Carbocisteine`,
    category: `Respiratory`,
    emoji: `🫁`,
    description: `Rhinathiol is a mucolytic agent that reduces the viscosity of mucus in the airways, making it easier to cough up. Used for bronchitis, COPD, and respiratory infections with thick secretions.`,
    how_to_take: `Take 3 times daily with water. Syrup form available for children and adults.`,
    side_effects: [
      `Nausea`,
      `Stomach pain`,
      `Diarrhea`,
      `Skin rash (rare)`
    ],
    warnings: [
      `Not recommended for children under 2`,
      `Drink plenty of fluids`,
      `Consult doctor if symptoms worsen`
    ],
    interactions: [
      `Few clinically significant interactions`
    ],
    algeria_brands: [
      `Rhinathiol 5% adult syrup`,
      `Rhinathiol 2% pediatric syrup`,
      `Rhinathiol 375mg capsules`
    ],
    pharmnet: {
      refundable: null,
      prescription_list: `N/D`,
      lab: `INSTITUT MEDICAL ALGERIEN`,
      generic_official: `CARBOCISTEINE`,
      notice_url: `https://pharmnet-dz.com//notice.ashx?id=6011`,
      pharmnet_url: `https://pharmnet-dz.com/m-1320-rhinathiol-adulte-0-05-sirop-fl-125ml`,
      dosage_variants: [
        {
          dosage: `0.05`,
          form: `SIROP`,
          conditioning: `FL/125ML`,
          ppa: `165.00 DA`
        }
      ]
    }
  },
  {
    name: `Solmucol`,
    scientific_name: `Acetylcysteine`,
    category: `Respiratory`,
    emoji: `🫁`,
    description: `Solmucol is a mucolytic agent that breaks down mucus in the airways and has antioxidant properties. Used for bronchitis, COPD, and as an antidote in paracetamol overdose (IV form).`,
    how_to_take: `Dissolve effervescent sachet or tablet in water. Take 1-3 times daily depending on the form and dose.`,
    side_effects: [
      `Nausea`,
      `Vomiting`,
      `Stomach pain`,
      `Skin rash`,
      `Rarely: bronchospasm in asthmatics`
    ],
    warnings: [
      `Use with caution in asthma patients`,
      `Drink plenty of fluids`,
      `IV form used in hospitals for paracetamol overdose`
    ],
    interactions: [
      `Nitroglycerin — may increase hypotension and headache`,
      `Do not mix with other medications in nebulizer`
    ],
    algeria_brands: [
      `Solmucol 200mg sachet`,
      `Solmucol 600mg effervescent`,
      `Mucomyst 200mg`
    ],
    pharmnet: {
      refundable: null,
      prescription_list: `N/D`,
      lab: `PHARMA IVAL`,
      generic_official: `N-ACETYLCYSTEINE`,
      notice_url: `https://pharmnet-dz.com//notice.ashx?id=6011`,
      pharmnet_url: `https://pharmnet-dz.com/m-1334-solmucol-200mg-grles-sol-buv-sach-dose-b-20-`,
      dosage_variants: [
        {
          dosage: `200MG`,
          form: `GRLES. SOL. BUV`,
          conditioning: `B/20`,
          ppa: null
        }
      ]
    }
  },


  // ─── PAIN ───────────────────────────────────────────────────────────
  {
    name: `Voltarène`,
    scientific_name: `Diclofenac`,
    category: `Pain`,
    emoji: `🩹`,
    description: `Voltarène is a non-steroidal anti-inflammatory drug (NSAID) used to treat pain, inflammation, and fever. Available as tablets, injections, and topical gel.`,
    how_to_take: `Take with food or milk to protect the stomach. Voltarène Emulgel: apply to affected area 3-4 times daily and rub in gently.`,
    side_effects: [
      `Stomach upset or pain`,
      `Nausea`,
      `Headache`,
      `Dizziness`,
      `Skin reactions with gel`
    ],
    warnings: [
      `Avoid if you have stomach ulcers`,
      `Not for long-term use without medical supervision`,
      `Avoid if you have kidney or heart problems`,
      `Do not apply gel to broken skin`
    ],
    interactions: [
      `Increases risk of bleeding with aspirin or warfarin`,
      `May reduce effectiveness of blood pressure medications`,
      `Increases methotrexate toxicity`
    ],
    algeria_brands: [
      `Voltarène 25mg`,
      `Voltarène 50mg`,
      `Voltarène 75mg SR`,
      `Voltarène Emulgel 1%`,
      `Diclofenac Mylan`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste II`,
      lab: `NOVARTIS`,
      generic_official: `DICLOFENAC SODIQUE`,
      notice_url: `https://pharmnet-dz.com//notice.ashx?id=961`,
      pharmnet_url: `https://pharmnet-dz.com/m-2715-voltarene-25mg-suppo-b-10`,
      dosage_variants: [
        {
          dosage: `25MG`,
          form: `SUPPO`,
          conditioning: `B/10`,
          ppa: null
        },
        {
          dosage: `100MG`,
          form: `SUPPO`,
          conditioning: `B/10`,
          ppa: null
        }
      ]
    }
  },
  {
    name: `Dolyc`,
    scientific_name: `Paracetamol + Lysine`,
    category: `Pain`,
    emoji: `🩹`,
    description: `Dolyc is a combination of paracetamol and lysine used to treat mild to moderate pain and fever. Commonly used in Algeria for headaches, dental pain, and body aches.`,
    how_to_take: `Take 1 tablet every 6-8 hours as needed. Do not exceed the recommended dose. Can be taken with or without food.`,
    side_effects: [
      `Rarely causes side effects at normal doses`,
      `Skin rash (allergic reaction — rare)`
    ],
    warnings: [
      `Do not exceed recommended dose — liver damage risk with overdose`,
      `Avoid alcohol`,
      `Do not combine with other paracetamol-containing products`
    ],
    interactions: [
      `Warfarin — may slightly increase anticoagulant effect with long-term use`,
      `Alcohol increases liver toxicity risk`
    ],
    algeria_brands: [
      `Dolyc 1g`,
      `Dolyc 500mg`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `N/D`,
      lab: `MERINAL`,
      generic_official: `PARACETAMOL`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=2631`,
      pharmnet_url: `https://pharmnet-dz.com/m-2631-dolyc-1g-comp-b-10`,
      dosage_variants: [
        {
          dosage: `1G`,
          form: `COMP. SEC`,
          conditioning: `B/10`,
          ppa: null
        },
        {
          dosage: `500MG`,
          form: `COMP`,
          conditioning: `B/20`,
          ppa: null
        }
      ]
    }
  },

  {
    name: `Profenid`,
    scientific_name: `Ketoprofen`,
    category: `Pain`,
    emoji: `🩹`,
    description: `Profenid is an NSAID used to treat pain and inflammation in arthritis, muscle pain, and post-surgical pain. Available in tablets, gel, and injectable forms.`,
    how_to_take: `Take with food or milk. For gel: apply to affected area 2-3 times daily and massage gently. Wash hands after applying.`,
    side_effects: [
      `Stomach pain`,
      `Nausea`,
      `Indigestion`,
      `Skin sensitivity to sunlight with gel`,
      `Headache`
    ],
    warnings: [
      `Avoid prolonged sun exposure when using gel — risk of photosensitivity`,
      `Avoid in stomach ulcer`,
      `Not for long-term use without supervision`,
      `Not safe in third trimester of pregnancy`
    ],
    interactions: [
      `Warfarin — increased bleeding risk`,
      `Lithium — toxicity risk increases`,
      `Diuretics — reduced effectiveness`
    ],
    algeria_brands: [
      `Profenid 100mg`,
      `Profenid LP 200mg`,
      `Profenid gel`,
      `Profenid injectable 100mg`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `N/D`,
      lab: `SANOFI AVENTIS`,
      generic_official: `KETOPROFENE`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=2807`,
      pharmnet_url: `https://pharmnet-dz.com/m-2807-profenid-100mg-comp-pelli-b-30`,
      dosage_variants: [
        {
          dosage: `100MG`,
          form: `COMP. PELLI`,
          conditioning: `B/30`,
          ppa: null
        },
        {
          dosage: `100MG`,
          form: `SUPPO`,
          conditioning: `B/12`,
          ppa: null
        },
        {
          dosage: `50MG/ML (100MG/2ML)`,
          form: `SOL. INJ`,
          conditioning: `B/06 AMP. DE 2ML`,
          ppa: null
        }
      ]
    }
  },

  {
    name: `Celebrex`,
    scientific_name: `Celecoxib`,
    category: `Pain`,
    emoji: `🩹`,
    description: `Celebrex is used for arthritis and chronic joint pain by reducing inflammation.`,
    how_to_take: `Take once or twice daily with food.`,
    side_effects: [
      `Stomach pain`,
      `Headache`,
      `Dizziness`
    ],
    warnings: [
      `Use cautiously in heart disease`
    ],
    interactions: [
      `Warfarin increases bleeding risk`
    ],
    algeria_brands: [
      `Celebrex 100mg`,
      `Celebrex 200mg`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste I`,
      lab: `PFIZER PHARM ALGERIE`,
      generic_official: `CELECOXIB`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=2808`,
      pharmnet_url: `https://pharmnet-dz.com/m-2808-celebrex-100mg-gles-b-20`,
      dosage_variants: [
        {
          dosage: `100MG`,
          form: `GLES`,
          conditioning: `B/20`,
          ppa: null
        },
        {
          dosage: `200MG`,
          form: `GLES`,
          conditioning: `B/10 - B/15 - B/30`,
          ppa: null
        }
      ]
    }
  },


  {
    name: `Bi-Profénid`,
    scientific_name: `Ketoprofen (extended-release)`,
    category: `Pain`,
    emoji: `🩹`,
    description: `Bi-Profénid is an extended-release form of ketoprofen NSAID providing longer-lasting anti-inflammatory and analgesic effects for arthritis, back pain, and musculoskeletal pain.`,
    how_to_take: `Take once daily with food. Swallow whole — do not crush or chew.`,
    side_effects: [
      `Stomach pain`,
      `Nausea`,
      `Heartburn`,
      `Dizziness`,
      `Photosensitivity`
    ],
    warnings: [
      `Avoid prolonged sun exposure`,
      `Take with food to protect the stomach`,
      `Avoid in stomach ulcer, kidney failure, or severe heart disease`
    ],
    interactions: [
      `Warfarin — bleeding risk`,
      `Lithium — toxicity`,
      `Methotrexate — toxicity`,
      `Diuretics — reduced effectiveness`
    ],
    algeria_brands: [
      `Bi-Profénid 150mg`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste II`,
      lab: `SANOFI AVENTIS`,
      generic_official: `KETOPROFENE`,
      notice_url: `https://pharmnet-dz.com//notice.ashx?id=961`,
      pharmnet_url: `https://pharmnet-dz.com/m-937-biprofenid-150mg-comp-sec-b-20`,
      dosage_variants: [
        {
          dosage: `150MG`,
          form: `COMP. SEC`,
          conditioning: `B/20`,
          ppa: null
        }
      ]
    }
  },

  {
    name: `Tramadol`,
    scientific_name: `Tramadol`,
    category: `Pain`,
    emoji: `🩹`,
    description: `Tramadol is a centrally acting opioid analgesic used for moderate to severe pain. It has a dual mechanism of action combining opioid receptor activity with serotonin/noradrenaline effects.`,
    how_to_take: `Take every 4-6 hours as needed (immediate-release) or once or twice daily (extended-release). Take with water.`,
    side_effects: [
      `Nausea and vomiting (especially at start)`,
      `Dizziness`,
      `Constipation`,
      `Drowsiness`,
      `Headache`,
      `Sweating`
    ],
    warnings: [
      `Can cause dependence with prolonged use`,
      `Do not drive or operate machinery`,
      `Avoid alcohol`,
      `Risk of seizures especially with antidepressants`,
      `Do not stop suddenly after long-term use`
    ],
    interactions: [
      `MAOIs — serious, potentially fatal interaction`,
      `SSRIs and SNRIs — serotonin syndrome risk`,
      `Carbamazepine — reduces tramadol effect`,
      `Benzodiazepines — increased sedation and respiratory risk`
    ],
    algeria_brands: [
      `Tramadol 50mg capsules`,
      `Contramal 100mg LP`,
      `Zamudol 50mg`,
      `Topalgic 50mg`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste I`,
      lab: `BEKER LABORATOIRES`,
      generic_official: `TRAMADOL CHLORHYDRATE EXPRIME EN TRAMADOL`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=5717`,
      pharmnet_url: `https://pharmnet-dz.com/m-5717-tramadol-beker-50mg-gles-b-30`,
      dosage_variants: [
        {
          dosage: `50MG`,
          form: `GLES`,
          conditioning: `B/30`,
          ppa: `270 DA`
        }
      ]
    }
  },
  {
    name: `Acupan`,
    scientific_name: `Nefopam`,
    category: `Pain`,
    emoji: `🩹`,
    description: `Acupan is a non-opioid centrally acting analgesic used for moderate to severe pain, particularly post-operative pain. It does not cause respiratory depression like opioids.`,
    how_to_take: `Oral: 1 tablet 3 times daily. IV: administered by healthcare professionals in a clinical setting.`,
    side_effects: [
      `Nausea and vomiting`,
      `Sweating`,
      `Dry mouth`,
      `Drowsiness`,
      `Fast heartbeat`,
      `Urinary retention`
    ],
    warnings: [
      `Do not use with MAOIs`,
      `Use with caution in elderly and patients with urinary problems`,
      `Can cause confusion in elderly`
    ],
    interactions: [
      `MAOIs — contraindicated`,
      `Atropine-like drugs — additive anticholinergic effects`,
      `Tricyclic antidepressants — additive effects`
    ],
    algeria_brands: [
      `Acupan 30mg tablets`,
      `Acupan 20mg/mL injectable`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste I`,
      lab: `BIOCODEX`,
      generic_official: `NEFOPAM CHLORHYDRATE`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=2695`,
      pharmnet_url: `https://pharmnet-dz.com/m-2695-acupan-10mg-ml-ou-20mg-2ml-sol-inj-im-iv-b-05amp-de-2ml`,
      dosage_variants: [
        {
          dosage: `10MG/ML (OU 20MG/2ML)`,
          form: `SOL. INJ`,
          conditioning: `B/05AMP. DE 2ML`,
          ppa: null
        }
      ]
    }
  },

  {
    name: `Hydrocortisone`,
    scientific_name: `Hydrocortisone`,
    category: `Pain`,
    emoji: `💊`,
    description: `Hydrocortisone is used to treat adrenal insufficiency (Addison's disease), as well as inflammatory and autoimmune conditions. It is the natural stress hormone of the body.`,
    how_to_take: `Take 2-3 times daily simulating the body's natural cortisol pattern (higher dose in morning, lower in evening). Take with food.`,
    side_effects: [
      `Weight gain`,
      `Elevated blood sugar`,
      `Mood changes`,
      `Insomnia`,
      `Sodium retention`,
      `Fluid retention`
    ],
    warnings: [
      `Never stop suddenly if used for adrenal insufficiency — can be life-threatening`,
      `Increase dose during illness, surgery, or stress`,
      `Carry medical alert card or bracelet`
    ],
    interactions: [
      `Rifampicin and phenytoin — reduce corticosteroid effect`,
      `NSAIDs — stomach ulcer risk`,
      `Warfarin — altered anticoagulant effect`
    ],
    algeria_brands: [
      `Hydrocortisone 10mg`,
      `Hydrocortisone 20mg`,
      `Solu-Cortef injectable 100mg/250mg/500mg`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste I`,
      lab: `SANOFI AVENTIS`,
      generic_official: `HYDROCORTISONE`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=653`,
      pharmnet_url: `https://pharmnet-dz.com/m-653-hydrocortisone-roussel-10mg-comp-b-25-`,
      dosage_variants: [
        {
          dosage: `10MG`,
          form: `COMP SEC`,
          conditioning: `B/25`,
          ppa: null
        }
      ]
    }
  },
  {
    name: `Dexamethasone`,
    scientific_name: `Dexamethasone`,
    category: `Pain`,
    emoji: `💊`,
    description: `Dexamethasone is a potent corticosteroid used for severe allergic reactions, inflammation, autoimmune conditions, cerebral edema, and certain cancers. Frequently used in hospitals in Algeria.`,
    how_to_take: `Oral: take in the morning with food. Injectable: given by healthcare professionals. Dose varies significantly by indication.`,
    side_effects: [
      `Elevated blood sugar`,
      `Fluid retention`,
      `Mood changes`,
      `Insomnia`,
      `Increased infection risk`,
      `Osteoporosis`
    ],
    warnings: [
      `Never stop abruptly after prolonged use`,
      `Monitor blood sugar carefully`,
      `Avoid live vaccines during treatment`,
      `Report any signs of infection promptly`
    ],
    interactions: [
      `Rifampicin — greatly reduces dexamethasone effect`,
      `Warfarin — altered anticoagulant effect`,
      `Diabetes medications — dose adjustment needed`,
      `NSAIDs — stomach ulcer risk`
    ],
    algeria_brands: [
      `Dexamethasone 0.5mg`,
      `Dexamethasone injectable 4mg/mL`,
      `Soludécadron injectable`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste I`,
      lab: `RENAUDIN`,
      generic_official: `DEXAMETHASONE (PHOSPHATE)`,
      notice_url: `https://pharmnet-dz.com//notice.ashx?id=668`,
      pharmnet_url: `https://pharmnet-dz.com/m-643-dexamethasone-20mg-sol-inj-b-5`,
      dosage_variants: [
        {
          dosage: `20MG`,
          form: `SOL. INJ`,
          conditioning: `B/5`,
          ppa: null
        }
      ]
    }
  },
  {
    name: `Lyrica`,
    scientific_name: `Pregabalin`,
    category: `Pain`,
    emoji: `💊`,
    description: `Lyrica is used for neuropathic pain (nerve pain from diabetes, shingles, spinal cord injury), fibromyalgia, and as an add-on treatment for epilepsy. Also used for generalized anxiety disorder.`,
    how_to_take: `Take 2-3 times daily with or without food. Start at low dose and gradually increase.`,
    side_effects: [
      `Drowsiness (very common)`,
      `Dizziness`,
      `Weight gain`,
      `Blurred vision`,
      `Swelling in hands and feet`,
      `Dry mouth`
    ],
    warnings: [
      `Do not drive until you know how it affects you`,
      `Do not stop suddenly — taper gradually`,
      `Avoid alcohol`,
      `Can cause dependence — use only as prescribed`
    ],
    interactions: [
      `Opioids — increased CNS depression and respiratory risk`,
      `Benzodiazepines — increased sedation`,
      `Alcohol — additive sedation`
    ],
    algeria_brands: [
      `Lyrica 25mg`,
      `Lyrica 75mg`,
      `Lyrica 150mg`,
      `Lyrica 300mg`,
      `Prégabaline Mylan`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste I`,
      lab: `PFIZER LIMITED`,
      generic_official: `PREGABALINE`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=2413`,
      pharmnet_url: `https://pharmnet-dz.com/m-2413-lyrica-25mg-gles-b-56`,
      dosage_variants: [
        {
          dosage: `25MG`,
          form: `GLES`,
          conditioning: `B/56`,
          ppa: null
        },
        {
          dosage: `300MG`,
          form: `GLES`,
          conditioning: `B/56`,
          ppa: null
        },
        {
          dosage: `50MG`,
          form: `GLES`,
          conditioning: `B/56`,
          ppa: null
        }
      ]
    }
  },
 
  {
    name: `Colchicine`,
    scientific_name: `Colchicine`,
    category: `Pain`,
    emoji: `🩹`,
    description: `Colchicine is used to treat acute gout attacks and to prevent gout flares. It works by reducing inflammation caused by uric acid crystal deposits in joints.`,
    how_to_take: `For acute gout: 1mg immediately then 0.5mg one hour later. For prevention: 0.5mg once or twice daily.`,
    side_effects: [
      `Nausea and vomiting (very common)`,
      `Diarrhea`,
      `Abdominal pain`,
      `Muscle weakness (with long-term use)`,
      `Bone marrow suppression (rare)`
    ],
    warnings: [
      `Do not exceed recommended dose — toxicity risk`,
      `Dose reduction in kidney or liver disease`,
      `Watch for muscle weakness or pain`,
      `Seek care if severe vomiting or diarrhea`
    ],
    interactions: [
      `Clarithromycin and statins — increase colchicine toxicity risk significantly`,
      `Ciclosporin — increased toxicity`,
      `P-gp inhibitors increase levels`
    ],
    algeria_brands: [
      `Colchicine 1mg`,
      `Colchicine 0.5mg`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste I`,
      lab: `GALENIQUES VERNIN`,
      generic_official: `COLCHICINE CRISTALISEE`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=1402`,
      pharmnet_url: `https://pharmnet-dz.com/m-1402-colchicine-opocalcium-1mg-comp-b-20`,
      dosage_variants: [
        {
          dosage: `1MG`,
          form: `COMP`,
          conditioning: `B/20`,
          ppa: null
        }
      ]
    }
  },


  // ─── STOMACH ───────────────────────────────────────────────────────────
  {
    name: `Inexium`,
    scientific_name: `Esomeprazole`,
    category: `Stomach`,
    emoji: `🫁`,
    description: `Inexium reduces stomach acid production. Used for acid reflux, heartburn, stomach ulcers, and to protect the stomach when taking anti-inflammatory drugs.`,
    how_to_take: `Take 30 minutes before a meal, usually in the morning. Swallow whole — do not crush.`,
    side_effects: [
      `Headache`,
      `Nausea`,
      `Diarrhea or constipation`,
      `Stomach pain`,
      `Flatulence`
    ],
    warnings: [
      `Long-term use may reduce magnesium and B12 levels`,
      `Should not be used long-term without medical supervision`,
      `May mask symptoms of stomach cancer`
    ],
    interactions: [
      `Clopidogrel — omeprazole reduces its effectiveness (use pantoprazole instead)`,
      `Methotrexate levels may increase`,
      `Reduces absorption of some medications`
    ],
    algeria_brands: [
      `Inexium 20mg`,
      `Inexium 40mg`,
      `Esomeprazole Mylan`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste II`,
      lab: `ASTRAZENECA`,
      generic_official: `ESOMEPRAZOLE`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=3888`,
      pharmnet_url: `https://pharmnet-dz.com/m-3888-inexium-40mg-comp-gastroresist-b-14`,
      dosage_variants: [
        {
          dosage: `40MG`,
          form: `COMP. PELLI`,
          conditioning: `B/14`,
          ppa: null
        },
        {
          dosage: `40MG/FL. DE PDRE.`,
          form: `PDRE. SOL. INJ`,
          conditioning: `B/10FL. DE PDRE.`,
          ppa: null
        }
      ]
    }
  },

  {
    name: `Forlax`,
    scientific_name: `Macrogol (Polyethylene Glycol)`,
    category: `Stomach`,
    emoji: `🫁`,
    description: `Forlax is an osmotic laxative used to treat constipation. It works by retaining water in the bowel to soften stools.`,
    how_to_take: `Dissolve 1-2 sachets in a glass of water. Take once daily, preferably in the morning.`,
    side_effects: [
      `Bloating`,
      `Stomach cramps`,
      `Nausea`,
      `Diarrhea if dose too high`
    ],
    warnings: [
      `Not for prolonged use without medical advice`,
      `Ensure adequate fluid intake`,
      `Not for bowel obstruction`
    ],
    interactions: [
      `May affect absorption of other medications taken at same time`
    ],
    algeria_brands: [
      `Forlax 10g sachet`,
      `Forlax 4g sachet (pediatric)`,
      `Movicol`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `N/D`,
      lab: `IPSEN PHARMA`,
      generic_official: `MACROGOL 4000 (POLYETHYLENE GLYCOL)`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=2942`,
      pharmnet_url: `https://pharmnet-dz.com/m-2942-forlax-10g-sachet--prde-sol-buv-b-20-sachets-dose-`,
      dosage_variants: [
        {
          dosage: `10G/SACHET**`,
          form: `PDRE. SOL. BUV`,
          conditioning: `B/20 SACHETS DOSE`,
          ppa: `455.00 DA`
        },
        {
          dosage: `4G/SACH.`,
          form: `PDRE. SOL. BUV`,
          conditioning: `B/20SACH-DOSE`,
          ppa: null
        }
      ]
    }
  },
  {
    name: `Débridat`,
    scientific_name: `Trimebutine`,
    category: `Stomach`,
    emoji: `🫁`,
    description: `Débridat regulates intestinal motility and is used for irritable bowel syndrome, functional digestive disorders, and abdominal cramps. Very commonly prescribed in Algeria.`,
    how_to_take: `Take 1 tablet 3 times daily before meals. Can be taken with or without food.`,
    side_effects: [
      `Dry mouth`,
      `Nausea`,
      `Constipation or diarrhea`,
      `Drowsiness`
    ],
    warnings: [
      `Tell doctor if you are pregnant or breastfeeding`,
      `Report persistent digestive symptoms`
    ],
    interactions: [
      `Few known interactions at therapeutic doses`
    ],
    algeria_brands: [
      `Débridat 100mg`,
      `Débridat 200mg`,
      `Trimébutine Mylan`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste II`,
      lab: `PFIZER`,
      generic_official: `TRIMEBUTINE`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=2896`,
      pharmnet_url: `https://pharmnet-dz.com/m-2896-debridat-0-7870g-pour-100g-pdre-susp-buv--en-flacon-fl-250ml`,
      dosage_variants: [
        {
          dosage: `0,7870G POUR 100G`,
          form: `PDRE. SUSP. BUV`,
          conditioning: `FL/250ML`,
          ppa: null
        },
        {
          dosage: `100MG`,
          form: `COMP. PELLI`,
          conditioning: `B/20`,
          ppa: `181.00 DA`
        },
        {
          dosage: `200MG`,
          form: `COMP. PELLI`,
          conditioning: `B/30`,
          ppa: null
        }
      ]
    }
  },

  {
    name: `Gaviscon`,
    scientific_name: `Sodium Alginate + Antacids`,
    category: `Stomach`,
    emoji: `🫁`,
    description: `Gaviscon relieves acid reflux and heartburn by forming a protective barrier in the stomach.`,
    how_to_take: `Take after meals and before bedtime.`,
    side_effects: [
      `Bloating`,
      `Nausea`
    ],
    warnings: [
      `Do not exceed recommended doses`
    ],
    interactions: [
      `May reduce absorption of other medications`
    ],
    algeria_brands: [
      `Gaviscon syrup`,
      `Gaviscon tablets`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `N/D`,
      lab: `SMITHKLINE BEECHAM`,
      generic_official: `ALGINATE DE SODIUM / BICARBONATE DE SODIUM`,
      notice_url: null,
      pharmnet_url: `https://pharmnet-dz.com/m-2917-gaviscon-susp-buv-fl-250-ml`,
      dosage_variants: [
        {
          dosage: `50MG/26.7MG`,
          form: `SUSP. BUV`,
          conditioning: `FL/250 ML`,
          ppa: null
        }
      ]
    }
  },
  {
    name: `Duphalac`,
    scientific_name: `Lactulose`,
    category: `Stomach`,
    emoji: `🫁`,
    description: `Duphalac is a laxative used to treat chronic constipation in elderly patients.`,
    how_to_take: `Take once daily with water or juice.`,
    side_effects: [
      `Bloating`,
      `Gas`,
      `Diarrhea`
    ],
    warnings: [
      `Drink plenty of fluids`
    ],
    interactions: [
      `Few significant interactions`
    ],
    algeria_brands: [
      `Duphalac syrup`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `N/D`,
      lab: `SOLVAY PHARMA`,
      generic_official: `LACTULOSE`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=2937`,
      pharmnet_url: `https://pharmnet-dz.com/m-2937-duphalac-10g-15ml-sol-buv-sachet-b-20-`,
      dosage_variants: [
        {
          dosage: `10G/15ML`,
          form: `SOL. BUV. SACHET`,
          conditioning: `B/20`,
          ppa: null
        }
      ]
    }
  },
  {
    name: `Meteospasmyl`,
    scientific_name: `Alverine + Simethicone`,
    category: `Stomach`,
    emoji: `🫁`,
    description: `Meteospasmyl is used for irritable bowel syndrome and digestive spasms.`,
    how_to_take: `Take before meals.`,
    side_effects: [
      `Nausea`,
      `Dizziness`
    ],
    warnings: [
      `Consult doctor if symptoms persist`
    ],
    interactions: [
      `Few known interactions`
    ],
    algeria_brands: [
      `Meteospasmyl capsules`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `N/D`,
      lab: `MAYOLY SPINDLER`,
      generic_official: `ALVERINE/SIMETICONE`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=2852`,
      pharmnet_url: `https://pharmnet-dz.com/m-2852-meteospasmyl-60mg-300mg-caps-b-20`,
      dosage_variants: [
        {
          dosage: `60MG/300MG`,
          form: `CAPS`,
          conditioning: `B/20`,
          ppa: null
        }
      ]
    }
  },
  {
    name: `Pantoloc`,
    scientific_name: `Pantoprazole`,
    category: `Stomach`,
    emoji: `🫁`,
    description: `Pantoloc is the preferred proton pump inhibitor for patients on clopidogrel (Plavix) because it does not interfere with clopidogrel's antiplatelet effect, unlike omeprazole. Used for reflux, ulcers, and gastro-oesophageal reflux disease.`,
    how_to_take: `Take 30-60 minutes before a meal. Swallow whole — do not crush. Usually once daily (40mg).`,
    side_effects: [
      `Headache`,
      `Diarrhea`,
      `Nausea`,
      `Flatulence`,
      `Stomach pain`
    ],
    warnings: [
      `Preferred PPI for patients on clopidogrel`,
      `Long-term use may reduce magnesium and B12`,
      `May mask symptoms of stomach cancer`
    ],
    interactions: [
      `Does not significantly interact with clopidogrel (unlike omeprazole)`,
      `Reduces absorption of ketoconazole and itraconazole`,
      `Methotrexate levels may increase`
    ],
    algeria_brands: [
      `Pantoloc 20mg`,
      `Pantoloc 40mg`,
      `Eupantol 40mg`,
      `Pantoprazole Mylan`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste II`,
      lab: `DAR AL DAWA`,
      generic_official: `PANTOPRAZOLE`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=3875`,
      pharmnet_url: `https://pharmnet-dz.com/m-3875-pantodar-40mg-comp-gastroresist-b-14`,
      dosage_variants: [
        {
          dosage: `40MG`,
          form: `COMP. ENRO`,
          conditioning: `B/14`,
          ppa: null
        }
      ]
    }
  },

  {
    name: `Métoclopramide`,
    scientific_name: `Metoclopramide`,
    category: `Stomach`,
    emoji: `🫁`,
    description: `Métoclopramide is a prokinetic antiemetic used to treat nausea, vomiting, and delayed gastric emptying. It is also used to facilitate intestinal intubation.`,
    how_to_take: `Take 10mg up to 3 times daily, 30 minutes before meals.`,
    side_effects: [
      `Drowsiness`,
      `Restlessness`,
      `Fatigue`,
      `Involuntary movements (dystonia — especially in young patients)`,
      `Breast milk production`
    ],
    warnings: [
      `Risk of involuntary movements especially in young patients and with high doses — seek urgent care if this occurs`,
      `Do not exceed recommended dose or duration (max 5 days for acute use)`,
      `Avoid in Parkinson's disease`
    ],
    interactions: [
      `Alcohol and sedatives — increased drowsiness`,
      `Levodopa — reduced effectiveness`,
      `Opioids — reduce metoclopramide prokinetic effect`
    ],
    algeria_brands: [
      `Primpéran 10mg tablets`,
      `Primpéran injectable`,
      `Métoclopramide Mylan`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste II`,
      lab: `SAIDAL GROUPE`,
      generic_official: `METOCLOPRAMIDE`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=2861`,
      pharmnet_url: `https://pharmnet-dz.com/m-2861-clopramid-0-001-sol-buv-fl-125ml`,
      dosage_variants: [
        {
          dosage: `0.001`,
          form: `SOL. BUV`,
          conditioning: `FL/125ML`,
          ppa: `85 DA`
        }
      ]
    }
  },
  {
    name: `Smecta`,
    scientific_name: `Diosmectite`,
    category: `Stomach`,
    emoji: `🫁`,
    description: `Smecta is an intestinal adsorbent used to treat acute and chronic diarrhea in adults and children. It adsorbs toxins, bacteria, and viruses in the gut without being absorbed into the bloodstream.`,
    how_to_take: `Dissolve 1 sachet in half a glass of water. Take 3 sachets per day for adults. For infants, mix in bottle. Take between meals.`,
    side_effects: [
      `Constipation (if overused)`,
      `Bloating`
    ],
    warnings: [
      `Take 2 hours apart from other medications — may reduce their absorption`,
      `Seek medical care if diarrhea persists more than 48 hours`,
      `Ensure adequate hydration with oral rehydration salts`
    ],
    interactions: [
      `May reduce absorption of other oral medications — take 2 hours apart`
    ],
    algeria_brands: [
      `Smecta 3g sachet`,
      `Smectalia 3g sachet`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `N/D`,
      lab: `AT PHARMA SPA`,
      generic_official: `DIOSMECTITE`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=3901`,
      pharmnet_url: `https://pharmnet-dz.com/m-3901-smecta-3g-sachet-pdre-p-susp-buv-en-sachet-dose-b-30-sachets`,
      dosage_variants: [
        {
          dosage: `3G/SACHET`,
          form: `SUSP. BUV`,
          conditioning: `B/30 SACHETS`,
          ppa: null
        }
      ]
    }
  },
  
  {
    name: `Daflon`,
    scientific_name: `Micronized Purified Flavonoid Fraction`,
    category: `Stomach`,
    emoji: `💊`,
    description: `Daflon is a phlebotonic agent used to treat chronic venous insufficiency, hemorrhoids, and swollen legs. It strengthens vein walls and reduces inflammation.`,
    how_to_take: `Take 1 tablet (500mg) twice daily with meals. For hemorrhoids: 6 tablets per day for 4 days then 4 tablets for 3 days.`,
    side_effects: [
      `Nausea`,
      `Diarrhea`,
      `Stomach pain`,
      `Headache (rare)`
    ],
    warnings: [
      `Not a substitute for compression stockings`,
      `Inform doctor if symptoms do not improve`,
      `Consult doctor during pregnancy`
    ],
    interactions: [
      `Few significant drug interactions`
    ],
    algeria_brands: [
      `Daflon 500mg`,
      `Detralex 500mg`
    ],
    pharmnet: {
      refundable: null,
      prescription_list: `N/D`,
      lab: `SERVIER`,
      generic_official: `DIOSMINE`,
      notice_url: `https://pharmnet-dz.com//notice.ashx?id=93`,
      pharmnet_url: `https://pharmnet-dz.com/m-1519-daflon-300mg-150mg-en-diosmine-et-150mg-en-hesperidine-comp-enro-b-30`,
      dosage_variants: [
        {
          dosage: `300MG (150MG EN DIOSMINE ET 150MG EN HESPERIDINE)`,
          form: `COMP`,
          conditioning: `B/30`,
          ppa: null
        },
        {
          dosage: `500MG (450MG EN DIOSMINE ET 50MG EN FLAVONOIDES EXPRIMES EN HESPERIDINE)`,
          form: `COMP. ENRO`,
          conditioning: `B/15  ET  B/30`,
          ppa: null
        }
      ]
    }
  },


  // ─── ANTIBIOTICS ───────────────────────────────────────────────────────────
  {
    name: `Augmentin`,
    scientific_name: `Amoxicillin + Clavulanic Acid`,
    category: `Antibiotics`,
    emoji: `🦠`,
    description: `Augmentin is a broad-spectrum antibiotic used to treat bacterial infections of the ear, sinuses, lungs, skin, and urinary tract.`,
    how_to_take: `Take with food to reduce stomach upset. Complete the full course even if you feel better.`,
    side_effects: [
      `Diarrhea (very common)`,
      `Nausea`,
      `Skin rash`,
      `Yeast infections`
    ],
    warnings: [
      `Tell your doctor if you are allergic to penicillin`,
      `Complete the full course to prevent antibiotic resistance`,
      `Probiotics may help prevent diarrhea`
    ],
    interactions: [
      `Warfarin — increased bleeding risk`,
      `Methotrexate — increased toxicity`,
      `Oral contraceptives — may reduce effectiveness`
    ],
    algeria_brands: [
      `Augmentin 500mg/125mg`,
      `Augmentin 875mg/125mg`,
      `Augmentin 1g/125mg`,
      `Clamoxyl`
    ],
    pharmnet: {
      refundable: null,
      prescription_list: `Liste I`,
      lab: `GLAXO SMITHKLINE`,
      generic_official: `AMOXICILLINE SODIQUE EXPRIME EN AMOXICILLINE / ACIDE CLAVULANIQUE POTASSIQUE EXPRIME EN ACIDE CLAVULANIQUE`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=289`,
      pharmnet_url: `https://pharmnet-dz.com/m-289-augmentin-1g-200mg-pdre-sol-inj-b-10`,
      dosage_variants: [
        {
          dosage: `1G/200MG`,
          form: `PDRE. SOL. INJ`,
          conditioning: `B/10`,
          ppa: null
        },
        {
          dosage: `250MG/62,5MG/5ML`,
          form: `PDRE. SUSP. BUV`,
          conditioning: `FL/60ML`,
          ppa: null
        },
        {
          dosage: `2G/200MG`,
          form: `PDRE. SOL. INJ`,
          conditioning: `B/10`,
          ppa: null
        },
        {
          dosage: `500MG`,
          form: `COMP. PELLI`,
          conditioning: `B/12`,
          ppa: null
        },
        {
          dosage: `500MG/50MG`,
          form: `PDRE. SOL. INJ`,
          conditioning: `B/1`,
          ppa: null
        }
      ]
    }
  },
  {
    name: `Amoxicilline`,
    scientific_name: `Amoxicillin`,
    category: `Antibiotics`,
    emoji: `🦠`,
    description: `Amoxicilline is one of the most commonly used antibiotics for treating bacterial infections including throat, ear, chest, and urinary tract infections.`,
    how_to_take: `Take at evenly spaced intervals throughout the day. Can be taken with or without food. Complete the full course.`,
    side_effects: [
      `Diarrhea`,
      `Nausea`,
      `Skin rash`,
      `Stomach upset`
    ],
    warnings: [
      `Tell your doctor about penicillin allergy`,
      `Complete the full course`,
      `Seek care immediately for severe rash or difficulty breathing`
    ],
    interactions: [
      `Methotrexate toxicity increases`,
      `May reduce effectiveness of oral contraceptives`
    ],
    algeria_brands: [
      `Amoxicilline 500mg`,
      `Amoxicilline 1g`,
      `Clamoxyl 500mg`,
      `Flemoxin`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste I`,
      lab: `HUP.P.PHARMA SARL`,
      generic_official: `AMOXICILLINE TRIHYDRATE EXPRIME EN AMOXICILLINE`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=891`,
      pharmnet_url: `https://pharmnet-dz.com/m-891-amoxicilline-eg-125mg-5ml-pdre-susp-buv-fl-60ml`,
      dosage_variants: [
        {
          dosage: `125MG/5ML`,
          form: `PDRE. SUSP. BUV`,
          conditioning: `FL./60ML`,
          ppa: null
        },
        {
          dosage: `1G`,
          form: `COMP. DISPERS`,
          conditioning: `B/14`,
          ppa: null
        },
        {
          dosage: `250MG/5ML`,
          form: `PDRE. SUSP. BUV`,
          conditioning: `B/1FL. DE 60ML DE SUSP. BUV. APRES RECONST. + UNE CUILLERE-MESURE`,
          ppa: null
        },
        {
          dosage: `500MG/5ML`,
          form: `PDRE. SOL. BUV`,
          conditioning: `B/1FL. DE 60ML DE SUSP. BUV. APRES RECONST. + UNE CUILLERE-MESURE`,
          ppa: null
        }
      ]
    }
  },
  {
    name: `Zomax`,
    scientific_name: `Azithromycin`,
    category: `Antibiotics`,
    emoji: `🦠`,
    description: `Zomax (Azithromycin) is a macrolide antibiotic used to treat respiratory infections, skin infections, and sexually transmitted infections.`,
    how_to_take: `Take once daily. Usually a 3 or 5 day course. Can be taken with or without food.`,
    side_effects: [
      `Nausea`,
      `Diarrhea`,
      `Stomach pain`,
      `Headache`
    ],
    warnings: [
      `Tell doctor about heart rhythm problems`,
      `Complete the full course`,
      `May prolong QT interval — inform all doctors`
    ],
    interactions: [
      `Antacids containing aluminum or magnesium — take 1 hour apart`,
      `Warfarin — increased bleeding risk`,
      `Some heart medications — QT prolongation risk`
    ],
    algeria_brands: [
      `Zomax 250mg`,
      `Zomax 500mg`,
      `Azithromycine Mylan`,
      `Zithromax`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste I`,
      lab: `HIKMA PHARMACEUTICALS`,
      generic_official: `AZITHROMYCINE DIHYDRATE`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=805`,
      pharmnet_url: `https://pharmnet-dz.com/m-805-zomax-40mg-ml--200mg-5ml-et-300mg-7-5ml--pdre-p-susp-buv-b-1fl-de-15ml-apres-reconstit--200mg-5ml-une-amp-d-eau-purifiee--une-cuillere-mesure-de-5ml-et-b-1fl-de-22-5ml-apres-reconstit-300mg-7-5ml-une-amp-d-eau-purifiee--une-cuillere-mes`,
      dosage_variants: [
        {
          dosage: `40MG/ML** (200MG/5ML ET 300MG/7,5ML)**`,
          form: `PDRE. SOL. BUV`,
          conditioning: `B/1FL. DE 15ML APRES RECONSTIT. (200MG/5ML)+UNE AMP. D'EAU PURIFIEE + UNE CUILLERE MESURE DE 5ML ET  B/1FL. DE 22,5ML APRES RECONSTIT.(300MG/7,5ML)+UNE AMP. D'EAU PURIFIEE + UNE CUILLERE MESURE DE 5ML`,
          ppa: null
        },
        {
          dosage: `500MG`,
          form: `COMP. PELLI`,
          conditioning: `B/03`,
          ppa: null
        }
      ]
    }
  },

  {
    name: `Pénicilline V`,
    scientific_name: `Phenoxymethylpenicillin`,
    category: `Antibiotics`,
    emoji: `🦠`,
    description: `Pénicilline V is an oral penicillin used for streptococcal throat infections (angina), and for long-term prevention of rheumatic fever in children and adults in Algeria.`,
    how_to_take: `Take on an empty stomach 30-60 minutes before meals for best absorption. Take at evenly spaced intervals.`,
    side_effects: [
      `Nausea`,
      `Diarrhea`,
      `Stomach pain`,
      `Skin rash`
    ],
    warnings: [
      `Tell doctor if allergic to penicillin`,
      `Complete the full course`,
      `Seek urgent care for severe rash or breathing difficulty`
    ],
    interactions: [
      `May reduce oral contraceptive effectiveness (rare)`,
      `Methotrexate toxicity increases`
    ],
    algeria_brands: [
      `Oracilline 1 MUI`,
      `Oracilline 2 MUI`,
      `Pénicilline V Mylan`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste I`,
      lab: `KPMA LABORATOIRES`,
      generic_official: `PHENOXYMETHYLPENICILLINE POTASSIQUE EXPRIME EN PHENOXYMETHYLPENICILLINE`,
      notice_url: `https://pharmnet-dz.com//notice.ashx?id=896`,
      pharmnet_url: `https://pharmnet-dz.com/m-271-penicilline-cimex-1-000-000ui--comp-pelli-b-12`,
      dosage_variants: [
        {
          dosage: `1 000 000UI**`,
          form: `COMP. PELLI`,
          conditioning: `B/12`,
          ppa: `257.00 DA`
        },
        {
          dosage: `250 000UI/5ML`,
          form: `PDRE. SOL. BUV`,
          conditioning: `B/1FL. DE 60ML DE SUSP. BUV. APRES RECONSTITUTION +UNE CUILLERE MESURE`,
          ppa: null
        }
      ]
    }
  },
  {
    name: `Rovamycine`,
    scientific_name: `Spiramycin`,
    category: `Antibiotics`,
    emoji: `🦠`,
    description: `Rovamycine is a macrolide antibiotic used for respiratory and oral infections, and importantly for toxoplasmosis during pregnancy to protect the fetus.`,
    how_to_take: `Take 2-3 times daily. Can be taken with or without food.`,
    side_effects: [
      `Nausea`,
      `Vomiting`,
      `Diarrhea`,
      `Stomach pain`,
      `Skin rash`
    ],
    warnings: [
      `Inform your doctor if pregnant — special dosing for toxoplasmosis prevention`,
      `Complete the full course`
    ],
    interactions: [
      `Levodopa — may reduce its effectiveness`,
      `Few other significant interactions`
    ],
    algeria_brands: [
      `Rovamycine 1.5 MUI`,
      `Rovamycine 3 MUI`,
      `Spiramycine Mylan`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste I`,
      lab: `SAIDAL GROUPE`,
      generic_official: `SPIRAMYCINE`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=789`,
      pharmnet_url: `https://pharmnet-dz.com/m-789-rovamycine-1-500-000ui-comp-pelli-b-16`,
      dosage_variants: [
        {
          dosage: `1 500 000UI`,
          form: `COMP. PELLI`,
          conditioning: `B/16`,
          ppa: null
        },
        {
          dosage: `3 000 000UI`,
          form: `COMP. PELLI`,
          conditioning: `B/10 ET B/16`,
          ppa: null
        }
      ]
    }
  },
  {
    name: `Josacine`,
    scientific_name: `Josamycin`,
    category: `Antibiotics`,
    emoji: `🦠`,
    description: `Josacine is a macrolide antibiotic used for respiratory tract infections and as an alternative to penicillin in allergic patients. Also used for Helicobacter pylori eradication regimens.`,
    how_to_take: `Take 2 times daily with food to reduce stomach upset. Complete the full course.`,
    side_effects: [
      `Nausea`,
      `Vomiting`,
      `Diarrhea`,
      `Stomach pain`,
      `Skin rash`
    ],
    warnings: [
      `Tell doctor about any liver disease`,
      `Complete the full course`
    ],
    interactions: [
      `Warfarin — increased anticoagulant effect`,
      `Statins — increased myopathy risk`
    ],
    algeria_brands: [
      `Josacine 500mg`,
      `Josacine 1g`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste I`,
      lab: `ASTELLAS PHARMA`,
      generic_official: `JOSAMYCINE PROPIONATE EXPRIME EN JOSAMYCINE`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=810`,
      pharmnet_url: `https://pharmnet-dz.com/m-810-josacine-125mg-5-ml-grles-susp-buv-b-01-fl-de-15g-correspondant-a-60ml-de-susp-reconstituee-avec-seringue-p-administration-orale`,
      dosage_variants: [
        {
          dosage: `125MG/5 ML`,
          form: `GRLES. SOL. BUV`,
          conditioning: `B/01 FL. DE 15G CORRESPONDANT A 60ML DE SUSP. RECONSTITUEE AVEC SERINGUE P. ADMINISTRATION ORALE`,
          ppa: null
        },
        {
          dosage: `250MG`,
          form: `PDRE. SOL. BUV`,
          conditioning: `B/12`,
          ppa: null
        },
        {
          dosage: `250MG/5ML`,
          form: `GRLES. SOL. BUV`,
          conditioning: `B/01 FL. DE 15G CORRESPONDANT A 60ML DE SUSP. RECONSTITUEE AVEC SERINGUE P. ADMINISTRATION ORALE`,
          ppa: null
        },
        {
          dosage: `500MG /5ML`,
          form: `GRLES. SOL. BUV`,
          conditioning: `B/01 FL. DE 20G CORRESPONDANT A 60ML DE SUSP. RECONSTITUEE AVEC SERINGUE P. ADMINISTRATION ORALE`,
          ppa: `904.68 DA`
        },
        {
          dosage: `500MG`,
          form: `COMP. PELLI`,
          conditioning: `B/20`,
          ppa: null
        },
        {
          dosage: `500MG`,
          form: `PDRE. SOL. BUV`,
          conditioning: `B/12`,
          ppa: null
        }
      ]
    }
  },

  {
    name: `Oflocet`,
    scientific_name: `Ofloxacin`,
    category: `Antibiotics`,
    emoji: `🦠`,
    description: `Oflocet is a fluoroquinolone antibiotic used for urinary tract infections, respiratory infections, and sexually transmitted infections.`,
    how_to_take: `Take twice daily with plenty of water. Can be taken with or without food.`,
    side_effects: [
      `Nausea`,
      `Diarrhea`,
      `Headache`,
      `Dizziness`,
      `Tendon pain`,
      `Photosensitivity`
    ],
    warnings: [
      `Stop if tendon pain develops — tendon rupture risk`,
      `Avoid sun exposure`,
      `Do not take with antacids or iron`
    ],
    interactions: [
      `Antacids and iron — take 2 hours apart`,
      `Warfarin — increased bleeding risk`,
      `NSAIDs — seizure risk`
    ],
    algeria_brands: [
      `Oflocet 200mg`,
      `Ofloxacine Mylan`
    ],
    pharmnet: {
      refundable: null,
      prescription_list: `Liste I`,
      lab: `ROUSSEL`,
      generic_official: `OFLOXACINE`,
      notice_url: `https://pharmnet-dz.com//notice.ashx?id=896`,
      pharmnet_url: `https://pharmnet-dz.com/m-356-oflocet-200mg-comp-b-10`,
      dosage_variants: [
        {
          dosage: `200MG`,
          form: `COMP. PELLI`,
          conditioning: `B/10`,
          ppa: null
        },
        {
          dosage: `200MG/40ML`,
          form: `SOL. INJ`,
          conditioning: `FL/40ML`,
          ppa: null
        }
      ]
    }
  },
  {
    name: `Tavanic`,
    scientific_name: `Levofloxacin`,
    category: `Antibiotics`,
    emoji: `🦠`,
    description: `Tavanic is a broad-spectrum fluoroquinolone antibiotic used for community-acquired pneumonia, urinary tract infections, and sinusitis in Algeria.`,
    how_to_take: `Take once daily with plenty of water. Can be taken with or without food.`,
    side_effects: [
      `Nausea`,
      `Diarrhea`,
      `Headache`,
      `Dizziness`,
      `Tendon pain`,
      `Photosensitivity`,
      `Insomnia`
    ],
    warnings: [
      `Stop immediately if tendon pain or swelling — risk of tendon rupture`,
      `Avoid sun exposure`,
      `Risk of QT prolongation`,
      `Elderly patients especially at risk for tendon problems`
    ],
    interactions: [
      `Antacids, iron, calcium — take 2 hours apart`,
      `Warfarin — increased bleeding risk`,
      `QT-prolonging drugs — cardiac risk`,
      `NSAIDs — seizure risk increases`
    ],
    algeria_brands: [
      `Tavanic 250mg`,
      `Tavanic 500mg`,
      `Levofloxacine Mylan`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste I`,
      lab: `SANOFI AVENTIS`,
      generic_official: `LEVOFLOXACINE HEMIHYDRATE EXPRIME EN LEVOFLOXACINE`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=364`,
      pharmnet_url: `https://pharmnet-dz.com/m-364-tavanic-250mg-comp-pelli-sec-b-05`,
      dosage_variants: [
        {
          dosage: `250MG`,
          form: `COMP. PELLI`,
          conditioning: `B/05`,
          ppa: null
        },
        {
          dosage: `500MG`,
          form: `COMP. PELLI`,
          conditioning: `B/05`,
          ppa: null
        }
      ]
    }
  },

  {
    name: `Keforal`,
    scientific_name: `Cefalexin`,
    category: `Antibiotics`,
    emoji: `🦠`,
    description: `Keforal is a first-generation cephalosporin antibiotic used for skin and soft tissue infections, urinary tract infections, and respiratory tract infections.`,
    how_to_take: `Take 2-4 times daily with or without food. Complete the full course.`,
    side_effects: [
      `Nausea`,
      `Diarrhea`,
      `Stomach pain`,
      `Skin rash`,
      `Yeast infections`
    ],
    warnings: [
      `Tell doctor if allergic to penicillin`,
      `Complete the full course`,
      `Seek urgent care for severe rash or breathing difficulty`
    ],
    interactions: [
      `Warfarin — increased anticoagulant effect`,
      `Metformin — monitor kidney function`
    ],
    algeria_brands: [
      `Keforal 500mg`,
      `Céfalexine Mylan`,
      `Ospexin 500mg`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste I`,
      lab: `ELI LILLY`,
      generic_official: `CEFALEXINE`,
      notice_url: `https://pharmnet-dz.com//notice.ashx?id=896`,
      pharmnet_url: `https://pharmnet-dz.com/m-1897-keforal-125mg-5ml-pdre-susp-buv-fl-100ml`,
      dosage_variants: [
        {
          dosage: `125MG/5ML`,
          form: `GRLES. SOL. BUV`,
          conditioning: `FL/100ML`,
          ppa: null
        },
        {
          dosage: `250MG/5ML`,
          form: `PDRE. SOL. BUV`,
          conditioning: `FL/60ML`,
          ppa: `383.00 DA`
        },
        {
          dosage: `500MG**`,
          form: `COMP. PELLI`,
          conditioning: `B/12`,
          ppa: null
        }
      ]
    }
  },
  {
    name: `Zinnat`,
    scientific_name: `Cefuroxime`,
    category: `Antibiotics`,
    emoji: `🦠`,
    description: `Zinnat is a second-generation cephalosporin antibiotic used for upper and lower respiratory tract infections, urinary tract infections, skin infections, and Lyme disease.`,
    how_to_take: `Take twice daily with food to improve absorption and reduce stomach upset.`,
    side_effects: [
      `Diarrhea`,
      `Nausea`,
      `Stomach pain`,
      `Headache`,
      `Skin rash`
    ],
    warnings: [
      `Tell doctor if allergic to penicillin`,
      `Complete the full course`,
      `Take with food — improves absorption`
    ],
    interactions: [
      `Antacids — reduce absorption`,
      `Warfarin — increased anticoagulant effect`
    ],
    algeria_brands: [
      `Zinnat 250mg`,
      `Zinnat 500mg`,
      `Céfuroxime Mylan`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste I`,
      lab: `GLAXO SMITHKLINE`,
      generic_official: `CEFUROXIME AXETIL EXPRIME EN CEFUROXIME`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=702`,
      pharmnet_url: `https://pharmnet-dz.com/m-702-zinnat-125mg-comp-b-14`,
      dosage_variants: [
        {
          dosage: `125MG`,
          form: `COMP`,
          conditioning: `B/14`,
          ppa: `653.00 DA`
        },
        {
          dosage: `125MG/5ML`,
          form: `SUSP. BUV`,
          conditioning: `FL/70ML`,
          ppa: `656.30 DA`
        },
        {
          dosage: `250MG`,
          form: `COMP. PELLI`,
          conditioning: `B/14`,
          ppa: `537.00 DA`
        }
      ]
    }
  },
  {
    name: `Flagyl`,
    scientific_name: `Metronidazole`,
    category: `Antibiotics`,
    emoji: `🦠`,
    description: `Flagyl is an antibiotic and antiprotozoal medication used for bacterial vaginosis, anaerobic bacterial infections, H. pylori eradication, C. difficile colitis, and protozoal infections like giardiasis and amebiasis.`,
    how_to_take: `Take with food to reduce stomach upset. Do not crush tablets. Complete the full course.`,
    side_effects: [
      `Metallic taste (very common)`,
      `Nausea`,
      `Headache`,
      `Diarrhea`,
      `Urine may turn dark/reddish (harmless)`
    ],
    warnings: [
      `Absolutely avoid alcohol during treatment and for 48 hours after — severe reaction (disulfiram-like)`,
      `Avoid sun exposure`,
      `Report numbness or tingling`
    ],
    interactions: [
      `Alcohol — severe reaction (nausea, vomiting, flushing, rapid heartbeat)`,
      `Warfarin — greatly increased anticoagulant effect`,
      `Lithium — toxicity risk`,
      `Phenytoin — levels increase`
    ],
    algeria_brands: [
      `Flagyl 250mg`,
      `Flagyl 500mg`,
      `Métronidazole Mylan`,
      `Rodogyl (Metronidazole + Spiramycin)`
    ],
    pharmnet: {
      refundable: null,
      prescription_list: `Liste I`,
      lab: `BIOPHARM`,
      generic_official: `METRONIDAZOLE`,
      notice_url: `https://pharmnet-dz.com//notice.ashx?id=896`,
      pharmnet_url: `https://pharmnet-dz.com/m-864-flagyl-125mg-5ml-susp-buv-fl-120-ml--cuillere-mesure-de-5ml`,
      dosage_variants: [
        {
          dosage: `125MG/5ML`,
          form: `SUSP. BUV`,
          conditioning: `FL/120 ML + CUILLERE MESURE DE 5ML`,
          ppa: `183.00 DA`
        },
        {
          dosage: `250MG`,
          form: `COMP. PELLI`,
          conditioning: `B/20`,
          ppa: null
        },
        {
          dosage: `500MG`,
          form: `OVULE`,
          conditioning: `B/10`,
          ppa: null
        }
      ]
    }
  },

  {
    name: `Isoniazide`,
    scientific_name: `Isoniazid`,
    category: `Antibiotics`,
    emoji: `🦠`,
    description: `Isoniazide is a cornerstone of tuberculosis treatment, given as part of combination regimens. Used for both active TB treatment and latent TB infection prevention.`,
    how_to_take: `Take once daily on an empty stomach or with food if stomach upset. Take with vitamin B6 (pyridoxine) to prevent peripheral neuropathy.`,
    side_effects: [
      `Peripheral neuropathy (numbness/tingling) — prevented by vitamin B6`,
      `Liver toxicity (hepatitis)`,
      `Skin rash`,
      `Mood changes`
    ],
    warnings: [
      `Take with pyridoxine (vitamin B6) to prevent nerve damage`,
      `Regular liver function tests required`,
      `Avoid alcohol`,
      `Report any numbness, tingling, or weakness in hands or feet`
    ],
    interactions: [
      `Phenytoin — increases phenytoin levels`,
      `Carbamazepine — increases toxicity`,
      `Antacids containing aluminum — reduce absorption (take separately)`
    ],
    algeria_brands: [
      `Isoniazide 100mg`,
      `Isoniazide 300mg`,
      `Included in TB fixed-dose combinations: Rimstar, Rifinah`
    ],
    pharmnet: {
      refundable: null,
      prescription_list: `Liste I`,
      lab: `GRUPPO LEPETIT`,
      generic_official: `ISONIAZIDE`,
      notice_url: `https://pharmnet-dz.com//notice.ashx?id=896`,
      pharmnet_url: `https://pharmnet-dz.com/m-3587-isoniazide-100mg-comp-b-1000`,
      dosage_variants: [
        {
          dosage: `100MG`,
          form: `COMP`,
          conditioning: `B/1000`,
          ppa: null
        }
      ]
    }
  },


  // ─── VITAMINS ───────────────────────────────────────────────────────────
 
  {
    name: `Vitamag`,
    scientific_name: `Magnesium Pidolate`,
    category: `Vitamins`,
    emoji: `💊`,
    description: `Vitamag provides magnesium in the form of pidolate, which is well absorbed. Used for magnesium deficiency, muscle cramps, fatigue, and stress.`,
    how_to_take: `Dilute the oral solution in a glass of water. Take 1-2 ampoules daily, usually morning and noon.`,
    side_effects: [
      `Diarrhea at high doses`,
      `Stomach discomfort`
    ],
    warnings: [
      `Dose adjustment needed for kidney disease`,
      `Consult doctor if taking for more than 1 month`
    ],
    interactions: [
      `May reduce absorption of some antibiotics (take 2 hours apart)`,
      `Bisphosphonates — take 2 hours apart`
    ],
    algeria_brands: [
      `Vitamag SOL.BUV 127mg/5mL`,
      `Mag 2 (Magnesium chloride)`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `N/D`,
      lab: `LAD PHARMA`,
      generic_official: `MAGNESIUM ELEMENT  (SOUS FORME DE MAGNESIUM PIDOLATE)`,
      notice_url: `https://pharmnet-dz.com//notice.ashx?id=6078`,
      pharmnet_url: `https://pharmnet-dz.com/m-3412-vitamag-127mg-5ml-de-magnesium--1-5g-5ml-de-pidolate-de-magnesium--sol-buv-en-amp-b-20-amp-de-5ml--b-30amp-de-5ml`,
      dosage_variants: [
        {
          dosage: `127MG/5ML DE MAGNESIUM  (1,5G/5ML DE PIDOLATE DE MAGNESIUM))`,
          form: `SOL. BUV`,
          conditioning: `B/20 AMP. DE 5ML  - B/30AMP. DE 5ML`,
          ppa: null
        },
        {
          dosage: `61MG/5ML DE MAGNESIUM (SOIT 0,75G/5ML OU 15% DE MAGNESIUM PIDOLATE )`,
          form: `SOL. BUV`,
          conditioning: `FL./125ML`,
          ppa: null
        }
      ]
    }
  },
 
  {
    name: `Vitamine D3`,
    scientific_name: `Cholecalciferol`,
    category: `Vitamins`,
    emoji: `☀️`,
    description: `Vitamine D3 supplements are widely prescribed in Algeria to correct deficiency, support calcium absorption for bone health, and boost immune function. Deficiency is very common in Algeria despite the sunny climate.`,
    how_to_take: `High-dose ampoules (100,000 IU) taken as a single monthly or quarterly dose. Daily lower doses taken with meals.`,
    side_effects: [
      `At recommended doses: minimal side effects`,
      `Overdose: hypercalcemia — nausea, thirst, frequent urination, confusion`
    ],
    warnings: [
      `Do not take high doses without confirmed blood level deficiency`,
      `Monitor calcium levels with high-dose therapy`,
      `Regular blood level monitoring recommended`
    ],
    interactions: [
      `Thiazide diuretics — increase calcium levels, increasing hypercalcemia risk`,
      `Cholestyramine — reduces vitamin D absorption`
    ],
    algeria_brands: [
      `Uvedose 100,000 IU ampoule`,
      `ZymaD oral drops`,
      `Vitamine D3 BON 100,000 UI`,
      `Cholécalciférol Mylan`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste II`,
      lab: `SAIDAL GROUPE`,
      generic_official: `COLECALCIFEROL`,
      notice_url: `https://pharmnet-dz.com//notice.ashx?id=6078`,
      pharmnet_url: `https://pharmnet-dz.com/m-3422-vitamine-d3-b-o-n-200-000ui-ml-sol-inj-im-et-sol-buv-b-01-amp-de-1ml`,
      dosage_variants: [
        {
          dosage: `200 000UI/ML`,
          form: `SOL. INJ`,
          conditioning: `B/01 AMP. DE 1ML`,
          ppa: `124.00 DA`
        }
      ]
    }
  },
  {
    name: `Acide Folique`,
    scientific_name: `Folic Acid (Vitamin B9)`,
    category: `Vitamins`,
    emoji: `🍃`,
    description: `Acide Folique (folic acid) is essential for DNA synthesis and is critical during early pregnancy to prevent neural tube defects. Also used in anemia treatment and for patients on methotrexate.`,
    how_to_take: `For pregnancy prevention: start at least 1 month before conception and continue through first trimester. Take daily, with or without food.`,
    side_effects: [
      `Very well tolerated at recommended doses`,
      `Rarely: nausea, bloating, sleep disturbances at high doses`
    ],
    warnings: [
      `High doses can mask vitamin B12 deficiency — check B12 levels if anemia is present`,
      `Essential for all women planning pregnancy`
    ],
    interactions: [
      `Methotrexate — antagonist (folic acid supplements help reduce methotrexate toxicity)`,
      `Phenytoin — folic acid may reduce phenytoin levels`
    ],
    algeria_brands: [
      `Acide Folique 0.4mg (5mg)`,
      `Spéciafoldine 5mg`,
      `B9 Bébé (preconception)`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `N/D`,
      lab: `API`,
      generic_official: `ACIDE FOLIQUE`,
      notice_url: `https://pharmnet-dz.com//notice.ashx?id=6053`,
      pharmnet_url: `https://pharmnet-dz.com/m-1746-acide-folique--api-5mg-comp-b-20`,
      dosage_variants: [
        {
          dosage: `5MG`,
          form: `COMP`,
          conditioning: `B/20`,
          ppa: `170.00 DA`
        }
      ]
    }
  },
  {
    name: `Tardyferon`,
    scientific_name: `Ferrous Sulfate (sustained release)`,
    category: `Vitamins`,
    emoji: `🩸`,
    description: `Tardyferon is a sustained-release iron supplement for iron-deficiency anemia that causes fewer gastrointestinal side effects than immediate-release iron formulations.`,
    how_to_take: `Take 1 tablet once or twice daily. Take on an empty stomach, but if stomach upset occurs, take with a light meal.`,
    side_effects: [
      `Black or dark stools (normal)`,
      `Constipation (less than regular iron)`,
      `Nausea (less common)`,
      `Stomach pain`
    ],
    warnings: [
      `Dark stools are normal and expected`,
      `Keep out of reach of children — iron overdose dangerous`,
      `Do not take with antacids or milk`
    ],
    interactions: [
      `Levothyrox — take 4 hours apart`,
      `Quinolones and tetracyclines — take 2-3 hours apart`,
      `Calcium — reduces iron absorption`
    ],
    algeria_brands: [
      `Tardyferon 80mg`,
      `Tardyferon B9 (with folic acid)`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `N/D`,
      lab: `PIERRE FABRE`,
      generic_official: `FER FERREUX (DCI)   (SOUS FORME DE SULFATE FERREUX)`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=1793`,
      pharmnet_url: `https://pharmnet-dz.com/m-1793-tardyferon-80mg-comp-enro-b-30`,
      dosage_variants: [
        {
          dosage: `80MG`,
          form: `COMP. PELLI`,
          conditioning: `B/30`,
          ppa: null
        }
      ]
    }
  },
  {
    name: `Vitamine B12`,
    scientific_name: `Cyanocobalamin / Hydroxocobalamin`,
    category: `Vitamins`,
    emoji: `💊`,
    description: `Vitamine B12 is used to treat deficiency from dietary insufficiency, malabsorption, or metformin use. Essential for nerve function, red blood cell formation, and DNA synthesis.`,
    how_to_take: `Oral tablets: daily supplementation. Injectable form (IM): given weekly for 4 weeks, then monthly for maintenance of deficiency.`,
    side_effects: [
      `Very safe — excess is excreted in urine`,
      `Rarely: acne, allergic reactions with injectable form`
    ],
    warnings: [
      `Metformin users should check B12 levels regularly`,
      `Vegan/vegetarian patients at risk — supplement routinely`,
      `Injectable form preferred for malabsorption`
    ],
    interactions: [
      `Metformin — reduces B12 absorption over time`,
      `Proton pump inhibitors (omeprazole) — reduce B12 absorption with long-term use`
    ],
    algeria_brands: [
      `Vitamine B12 1000mcg injectable`,
      `Rubranova 1000mcg injectable`,
      `Dodécavit injectable`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `N/D`,
      lab: `FRATER RAZES`,
      generic_official: `CYANOCOBALAMINE (OU VIT.B12)`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=5844`,
      pharmnet_url: `https://pharmnet-dz.com/m-5844-vitamine-b12-razes-500-Âµg-ml-ou-1000Âµg-2ml-sol-inj-et-buv-b-5amp`,
      dosage_variants: [
        {
          dosage: `500 ÂµG/ML (OU 1000ÂµG/2ML)`,
          form: `SOL. INJ`,
          conditioning: `B/5AMP`,
          ppa: `220.00 DA`
        }
      ]
    }
  },


  // ─── NEUROLOGICAL ───────────────────────────────────────────────────────────
  {
    name: `Depakine`,
    scientific_name: `Valproate Sodium`,
    category: `Neurological`,
    emoji: `🧠`,
    description: `Depakine is an anticonvulsant used to treat epilepsy and bipolar disorder. It is a widely used epilepsy medication in Algeria but has serious risks in pregnancy.`,
    how_to_take: `Take with food to reduce stomach upset. Swallow whole — do not crush extended-release tablets. Take at the same time each day.`,
    side_effects: [
      `Nausea and vomiting (especially at start)`,
      `Tremor`,
      `Weight gain`,
      `Hair loss (usually temporary)`,
      `Drowsiness`,
      `Liver toxicity`
    ],
    warnings: [
      `ABSOLUTELY NOT to be used in pregnancy — serious risk of birth defects and developmental problems`,
      `Women of childbearing age must use effective contraception and be enrolled in a pregnancy prevention program`,
      `Regular liver function tests`,
      `Report unusual bleeding or bruising`
    ],
    interactions: [
      `Carbamazepine — reduces valproate levels`,
      `Phenytoin — unpredictable mutual interaction`,
      `Aspirin — increases valproate levels`,
      `Lamotrigine — valproate greatly increases lamotrigine levels`
    ],
    algeria_brands: [
      `Dépakine 200mg`,
      `Dépakine 500mg LP`,
      `Dépakine Chrono 500mg`,
      `Dépakine 200mg/mL oral solution`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste II`,
      lab: `SANOFI AVENTIS`,
      generic_official: `VALPROATE DE SODIUM`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=3485`,
      pharmnet_url: `https://pharmnet-dz.com/m-3485-depakine-200mg-comp-gastroresist-b-40`,
      dosage_variants: [
        {
          dosage: `200MG`,
          form: `COMP`,
          conditioning: `B/40`,
          ppa: null
        },
        {
          dosage: `200MG/ML`,
          form: `SOL. BUV`,
          conditioning: `B/1FL DE 40ML + SERING. P. ADMINIST. ORALE GRADUEE EN MG`,
          ppa: null
        },
        {
          dosage: `500MG`,
          form: `COMP`,
          conditioning: `B/40`,
          ppa: null
        }
      ]
    }
  },
  {
    name: `Tégrétol`,
    scientific_name: `Carbamazepine`,
    category: `Neurological`,
    emoji: `🧠`,
    description: `Tégrétol is an anticonvulsant used for epilepsy, trigeminal neuralgia (severe facial pain), and bipolar disorder. One of the most used antiepileptics in Algeria.`,
    how_to_take: `Take with food. Start at low dose and increase gradually. Take at the same time each day.`,
    side_effects: [
      `Dizziness and drowsiness (especially at start)`,
      `Nausea`,
      `Blurred vision`,
      `Skin rash (stop immediately for severe rash)`,
      `Low sodium levels`,
      `Rarely: Stevens-Johnson syndrome`
    ],
    warnings: [
      `Stop immediately and seek care for severe skin rash`,
      `Blood tests to monitor levels, liver function, and blood counts required`,
      `Reduces effectiveness of many medications including contraceptives`,
      `Interacts with many medications — always check before adding new drugs`
    ],
    interactions: [
      `Many CYP enzyme inducers/inhibitors — complex interactions`,
      `Reduces effectiveness of oral contraceptives, warfarin, antidepressants`,
      `Valproate — complex mutual interaction`,
      `Erythromycin and azithromycin — increase carbamazepine levels`
    ],
    algeria_brands: [
      `Tégrétol 200mg`,
      `Tégrétol 400mg`,
      `Tégrétol LP 200mg`,
      `Tégrétol LP 400mg`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste II`,
      lab: `NOVARTIS`,
      generic_official: `CARBAMAZEPINE`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=3509`,
      pharmnet_url: `https://pharmnet-dz.com/m-3509-tegretol-100mg-5ml-susp-buv-fl-150ml`,
      dosage_variants: [
        {
          dosage: `100MG/5ML`,
          form: `SUSP. BUV`,
          conditioning: `FL/150ML`,
          ppa: null
        },
        {
          dosage: `200MG`,
          form: `COMP`,
          conditioning: `B/50`,
          ppa: null
        }
      ]
    }
  },

  {
    name: `Laroxyl`,
    scientific_name: `Amitriptyline`,
    category: `Neurological`,
    emoji: `🧠`,
    description: `Laroxyl is a tricyclic antidepressant used for depression, neuropathic pain, migraine prevention, and insomnia. At low doses (10-25mg) it is widely used in Algeria for chronic pain management.`,
    how_to_take: `Take at bedtime (the sedating effect is a benefit). Start at low dose and increase gradually. Take with or without food.`,
    side_effects: [
      `Dry mouth (very common)`,
      `Drowsiness`,
      `Constipation`,
      `Urinary retention`,
      `Dizziness on standing`,
      `Weight gain`,
      `Blurred vision`
    ],
    warnings: [
      `Do not drive until effects are known`,
      `Do not stop suddenly after prolonged use`,
      `Use with caution in elderly — falls risk`,
      `Avoid in cardiac arrhythmias and recent heart attack`
    ],
    interactions: [
      `MAOIs — contraindicated (potentially fatal)`,
      `Alcohol and sedatives — severe drowsiness`,
      `Tramadol and SSRIs — serotonin syndrome risk`,
      `Anticholinergic drugs — additive effects`
    ],
    algeria_brands: [
      `Laroxyl 25mg`,
      `Laroxyl 50mg`,
      `Laroxyl drops 40mg/mL`,
      `Amitriptyline Mylan`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste I`,
      lab: `ROCHE`,
      generic_official: `AMITRIPTYLINE CHLORHYDRATE EXPRIME EN AMITRIPTYLINE`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=2516`,
      pharmnet_url: `https://pharmnet-dz.com/m-2516-laroxyl-25mg-comp-pelli-b-60-`,
      dosage_variants: [
        {
          dosage: `25MG`,
          form: `COMP. PELLI`,
          conditioning: `B/60`,
          ppa: null
        },
        {
          dosage: `50MG`,
          form: `COMP. PELLI`,
          conditioning: `B/20`,
          ppa: null
        }
      ]
    }
  },
  {
    name: `Effexor`,
    scientific_name: `Venlafaxine`,
    category: `Neurological`,
    emoji: `🧠`,
    description: `Effexor is an SNRI (serotonin-norepinephrine reuptake inhibitor) antidepressant used for major depression, generalized anxiety disorder, social anxiety, and panic disorder.`,
    how_to_take: `Take once daily with food (extended-release). Start at low dose and increase gradually. Do not crush extended-release capsules.`,
    side_effects: [
      `Nausea (especially at start)`,
      `Headache`,
      `Dizziness`,
      `Dry mouth`,
      `Sweating`,
      `Elevated blood pressure at higher doses`,
      `Sexual dysfunction`
    ],
    warnings: [
      `Monitor blood pressure — may increase at higher doses`,
      `Do not stop suddenly — withdrawal symptoms can be severe`,
      `Allow 14 days after stopping MAOIs`,
      `Monitor for suicidal thoughts`
    ],
    interactions: [
      `MAOIs — contraindicated`,
      `Tramadol — serotonin syndrome risk`,
      `Sumatriptan — serotonin syndrome risk`,
      `Warfarin — monitor closely`
    ],
    algeria_brands: [
      `Effexor LP 37.5mg`,
      `Effexor LP 75mg`,
      `Effexor LP 150mg`,
      `Venlafaxine Mylan`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste I`,
      lab: `WYETH PHARMACEUTICALS`,
      generic_official: `VENLAFAXINE CHLORHYDRATE EXPRIME EN VENLAFAXINE`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=2575`,
      pharmnet_url: `https://pharmnet-dz.com/m-2575-effexor-lp-37-5mg-gles-lp-b-30`,
      dosage_variants: [
        {
          dosage: `37,5MG`,
          form: `GLES. LP`,
          conditioning: `B/30`,
          ppa: null
        }
      ]
    }
  },

  {
    name: `Haldol`,
    scientific_name: `Haloperidol`,
    category: `Neurological`,
    emoji: `🧠`,
    description: `Haldol is a first-generation antipsychotic used for schizophrenia, acute psychosis, and severe agitation. Available in tablets, injectable, and long-acting injectable (depot) forms.`,
    how_to_take: `Take as directed by psychiatrist. Oral tablets taken 2-3 times daily. Long-acting injectable given monthly by healthcare professional.`,
    side_effects: [
      `Movement disorders (extrapyramidal effects — stiffness, tremor, restlessness)`,
      `Drowsiness`,
      `Weight gain`,
      `QT prolongation`,
      `Tardive dyskinesia with long-term use`
    ],
    warnings: [
      `Report any muscle stiffness, tremor, or involuntary movements immediately`,
      `Monitor ECG for QT prolongation`,
      `Avoid in Parkinson's disease`,
      `Do not stop without medical guidance`
    ],
    interactions: [
      `QT-prolonging drugs — additive cardiac risk`,
      `CNS depressants — additive sedation`,
      `Lithium — increased neurotoxicity risk`,
      `Rifampicin — reduces haloperidol levels`
    ],
    algeria_brands: [
      `Haldol 1mg`,
      `Haldol 5mg`,
      `Haldol Decanoas 50mg/mL injectable`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste I`,
      lab: `JANSSEN CILAG`,
      generic_official: `HALOPERIDOL`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=2228`,
      pharmnet_url: `https://pharmnet-dz.com/m-2228-haldol-5mg-ml-sol-inj-b-5-amp-de-1ml`,
      dosage_variants: [
        {
          dosage: `5MG/ML`,
          form: `SOL. INJ`,
          conditioning: `B/5 AMP de 1ML`,
          ppa: null
        }
      ]
    }
  },

  {
    name: `Risperdal`,
    scientific_name: `Risperidone`,
    category: `Neurological`,
    emoji: `🧠`,
    description: `Risperdal is an atypical antipsychotic used for schizophrenia, bipolar disorder, and behavioral disturbances in dementia. Increasingly available in Algeria.`,
    how_to_take: `Take once or twice daily with or without food. Oral solution available for patients who cannot swallow tablets.`,
    side_effects: [
      `Weight gain`,
      `Drowsiness`,
      `Dizziness`,
      `Movement disorders (less than typical antipsychotics)`,
      `Elevated prolactin (breast changes, menstrual irregularities)`,
      `QT prolongation`
    ],
    warnings: [
      `Monitor weight and metabolic parameters regularly`,
      `Avoid in elderly with dementia — increased mortality risk`,
      `Monitor for signs of high blood sugar`,
      `Do not stop suddenly`
    ],
    interactions: [
      `QT-prolonging drugs — cardiac risk`,
      `Carbamazepine — reduces risperidone levels`,
      `CNS depressants — additive sedation`
    ],
    algeria_brands: [
      `Risperdal 1mg`,
      `Risperdal 2mg`,
      `Risperdal 4mg`,
      `Risperdal Consta (monthly injection)`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste I`,
      lab: `JANSSEN CILAG`,
      generic_official: `RISPERIDONE`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=2263`,
      pharmnet_url: `https://pharmnet-dz.com/m-2263-risperdal-1mg-ml-sol-buv-fl-60ml`,
      dosage_variants: [
        {
          dosage: `1MG/ML`,
          form: `SOL. BUV. GTTES`,
          conditioning: `FL./60ML`,
          ppa: null
        }
      ]
    }
  },

  {
    name: `Stilnox`,
    scientific_name: `Zolpidem`,
    category: `Neurological`,
    emoji: `🌙`,
    description: `Stilnox is a non-benzodiazepine hypnotic for short-term insomnia treatment. It works quickly (within 15 minutes) and should be taken just before sleep.`,
    how_to_take: `Take 10mg immediately before bed. Be ready to sleep when you take it. Do not take if you will not have 7-8 hours for sleep.`,
    side_effects: [
      `Drowsiness next morning`,
      `Dizziness`,
      `Headache`,
      `Paradoxical agitation (rare)`,
      `Sleepwalking, sleep-eating, sleep-driving (rare but serious)`
    ],
    warnings: [
      `Risk of complex sleep behaviors — stop and tell doctor if unusual nighttime behaviors occur`,
      `Do not drive the next day`,
      `Short-term use only`,
      `Avoid alcohol`
    ],
    interactions: [
      `Alcohol — dangerous respiratory depression and complex sleep behaviors`,
      `CNS depressants — additive sedation`,
      `Ketoconazole — increases zolpidem levels`
    ],
    algeria_brands: [
      `Stilnox 10mg`,
      `Zolpidem Mylan 10mg`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste I`,
      lab: `SANOFI AVENTIS`,
      generic_official: `ZOLPIDEM`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=2191`,
      pharmnet_url: `https://pharmnet-dz.com/m-2191-stilnox-10mg-comp-pelli-sec-b-14`,
      dosage_variants: [
        {
          dosage: `10MG`,
          form: `COMP. PELLI`,
          conditioning: `B/14`,
          ppa: `267.00 DA`
        }
      ]
    }
  },

  // ─── UROLOGY ───────────────────────────────────────────────────────────

  {
    name: `Xatral`,
    scientific_name: `Alfuzosin`,
    category: `Urology`,
    emoji: `🫀`,
    description: `Xatral is an alpha-blocker for benign prostatic hyperplasia symptoms. It relaxes smooth muscle in the prostate and bladder neck to improve urine flow.`,
    how_to_take: `Take 1 tablet (10mg) once daily immediately after the same meal each day. Swallow whole.`,
    side_effects: [
      `Dizziness on standing`,
      `Headache`,
      `Fatigue`,
      `Digestive disturbance`
    ],
    warnings: [
      `Rise slowly to avoid dizziness`,
      `Tell ophthalmologist before eye surgery`,
      `Avoid with potent CYP3A4 inhibitors`
    ],
    interactions: [
      `Ketoconazole and ritonavir — avoid combination`,
      `Other antihypertensives — additive hypotension`,
      `PDE5 inhibitors — hypotension risk`
    ],
    algeria_brands: [
      `Xatral OD 10mg`,
      `Alfuzosine Mylan`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `N/D`,
      lab: `SANOFI AVENTIS`,
      generic_official: `ALFUZOSINE CHLORHYDRATE`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=1158`,
      pharmnet_url: `https://pharmnet-dz.com/m-1158-xatral-lp-5mg-comp-pelli-lp-b-56`,
      dosage_variants: [
        {
          dosage: `5MG`,
          form: `COMP. PELLI. LP`,
          conditioning: `B/56`,
          ppa: `1813.00 DA`
        }
      ]
    }
  },

  {
    name: `Actonel`,
    scientific_name: `Risedronate`,
    category: `Endocrine`,
    emoji: `🦴`,
    description: `Actonel is a bisphosphonate for osteoporosis prevention and treatment. Available weekly or monthly, making it convenient for patients.`,
    how_to_take: `Take once weekly or monthly with a full glass of plain water. Take at least 30 minutes before first food. Stay upright for at least 30 minutes.`,
    side_effects: [
      `Esophageal irritation`,
      `Stomach pain`,
      `Nausea`,
      `Muscle and joint pain`,
      `Jaw osteonecrosis (rare, long-term)`
    ],
    warnings: [
      `Stay upright after taking`,
      `Take with plain water only`,
      `Tell dentist about use before any dental procedures`,
      `Also take calcium and vitamin D unless levels are adequate`
    ],
    interactions: [
      `Calcium, antacids — take separately`,
      `NSAIDs — GI irritation risk`
    ],
    algeria_brands: [
      `Actonel 35mg weekly`,
      `Actonel 75mg two-day monthly course`,
      `Risédronique Mylan`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste I`,
      lab: `SANOFI AVENTIS`,
      generic_official: `ACIDE RISEDRONIQUE SEL MONOSODIQUE`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=1415`,
      pharmnet_url: `https://pharmnet-dz.com/m-1415-actonel-5mg-comp-pell-b-28`,
      dosage_variants: [
        {
          dosage: `5MG`,
          form: `COMP. PELLI`,
          conditioning: `B/28`,
          ppa: `3,656.25 DA`
        },
        {
          dosage: `35MG`,
          form: `COMP. PELLI`,
          conditioning: `B/28`,
          ppa: `3,656.25 DA`
        }
      ]
    }
  },

  // ─── OPHTHALMOLOGY ───────────────────────────────────────────────────────────

  {
    name: `Xalatan`,
    scientific_name: `Latanoprost (eye drops)`,
    category: `Ophthalmology`,
    emoji: `👁️`,
    description: `Xalatan is a prostaglandin analogue eye drop for glaucoma that reduces intraocular pressure by increasing fluid drainage from the eye. Used once daily at bedtime.`,
    how_to_take: `Instill 1 drop in affected eye(s) at bedtime. Remove contact lenses before instilling and wait 15 minutes before reinserting.`,
    side_effects: [
      `Permanent darkening of iris color (especially in hazel/blue eyes)`,
      `Eyelash growth and darkening`,
      `Eye redness and irritation`,
      `Darkening of skin around eye`
    ],
    warnings: [
      `Warn patients that eye and eyelash color may permanently change`,
      `Do not use if using two different prostaglandin eye drops`,
      `Refrigerate until opening — can store at room temperature for 6 weeks once opened`
    ],
    interactions: [
      `Bimatoprost and other prostaglandin eye drops — avoid combination (reduces effect)`,
      `Thimerosal-containing drops — do not use together`
    ],
    algeria_brands: [
      `Xalatan 0.005% eye drops`,
      `Latanoprost Mylan`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste I`,
      lab: `PHARMACIA UPJOHN`,
      generic_official: `LATANOPROST`,
      notice_url: null,
      pharmnet_url: `https://pharmnet-dz.com/m-2363-xalatan-50Âµg-ml-0-005--colly-f-2-5ml`,
      dosage_variants: [
        {
          dosage: `50ÂµG/ML (0,005%)`,
          form: `COLLY. SOL`,
          conditioning: `F/2,5ML`,
          ppa: `1528.78 DA`
        }
      ]
    }
  },

  // ─── DERMATOLOGY ───────────────────────────────────────────────────────────
  {
    name: `Cutacnyl`,
    scientific_name: `Benzoyl Peroxide`,
    category: `Dermatology`,
    emoji: `🧴`,
    description: `Cutacnyl is used topically for mild to moderate acne. It kills acne-causing bacteria and helps unblock pores. Widely available in Algerian pharmacies.`,
    how_to_take: `Apply a thin layer to affected areas once or twice daily after washing face. Start with lower concentration to minimize irritation.`,
    side_effects: [
      `Skin dryness and peeling (very common at start)`,
      `Redness and irritation`,
      `Bleaching of fabrics (avoid white clothes, towels, and pillowcases)`,
      `Rarely: allergic contact dermatitis`
    ],
    warnings: [
      `Bleaches fabrics — avoid contact with clothing and bedding`,
      `Use sunscreen daily — increases photosensitivity`,
      `Avoid contact with eyes and mouth`,
      `Start with lower strength (2.5%) if skin is sensitive`
    ],
    interactions: [
      `Other acne treatments (tretinoin) — increased skin irritation if used together`
    ],
    algeria_brands: [
      `Cutacnyl 5% gel`,
      `Cutacnyl 10% gel`,
      `Benzaknen 5%`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste II`,
      lab: `GALDERMA INTERNATIONAL`,
      generic_official: `PEROXYDE DE BENZOYLE`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=1663`,
      pharmnet_url: `https://pharmnet-dz.com/m-1663-cutacnyl-0-025-gel-derm-t-40g`,
      dosage_variants: [
        {
          dosage: `0.025`,
          form: `GEL. DERM`,
          conditioning: `T/40G`,
          ppa: `216.00 DA`
        },
        {
          dosage: `0.05`,
          form: `GEL. DERM`,
          conditioning: `T/40G`,
          ppa: null
        },
        {
          dosage: `0.1`,
          form: `GEL. DERM`,
          conditioning: `T/40G`,
          ppa: null
        }
      ]
    }
  },
  {
    name: `Lamisil`,
    scientific_name: `Terbinafine`,
    category: `Dermatology`,
    emoji: `🍄`,
    description: `Lamisil is an antifungal used for athlete's foot, ringworm, nail fungus, and other dermatophyte infections. Available in oral and topical forms.`,
    how_to_take: `Cream: apply once or twice daily for 1-2 weeks. Tablets: once daily for nail infections (6 weeks for fingernails, 12 weeks for toenails).`,
    side_effects: [
      `Cream: skin irritation (rare)`,
      `Tablets: nausea, stomach pain, taste disturbances (sometimes prolonged), headache, liver toxicity (rare)`
    ],
    warnings: [
      `Tablet form: monitor liver function — stop if jaundice develops`,
      `Taste disturbances may persist for weeks after stopping`,
      `Nail treatment requires patience — months to see full results`
    ],
    interactions: [
      `Tablets: rifampicin — reduces terbinafine levels`,
      `Cimetidine — increases terbinafine levels`,
      `Warfarin — levels may change`,
      `CYP2D6 substrates — terbinafine inhibits this enzyme`
    ],
    algeria_brands: [
      `Lamisil 1% cream`,
      `Lamisil 250mg tablets`,
      `Terbinafine Mylan`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste II`,
      lab: `NOVARTIS`,
      generic_official: `TERBINAFINE CHLORHYDRATE`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=478`,
      pharmnet_url: `https://pharmnet-dz.com/m-478-lamisil-0-01-sol-pulv-cutanee-fl-15ml`,
      dosage_variants: [
        {
          dosage: `0.01`,
          form: `SOL. APP. LOCALE`,
          conditioning: `FL./15ML`,
          ppa: null
        }
      ]
    }
  },
  {
    name: `Terbinafine`,
    scientific_name: `Terbinafine`,
    category: `Dermatology`,
    emoji: `🍄`,
    description: `Generic terbinafine for fungal skin and nail infections — same as Lamisil but available at lower cost in Algeria.`,
    how_to_take: `Same as Lamisil — cream once or twice daily; tablets once daily.`,
    side_effects: [
      `Same as Lamisil brand`
    ],
    warnings: [
      `Same as Lamisil brand — monitor liver function with tablets`
    ],
    interactions: [
      `Same as Lamisil brand`
    ],
    algeria_brands: [
      `Terbinafine Mylan 250mg`,
      `Terbinafine 1% crème`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste II`,
      lab: `BEKER LABORATOIRES`,
      generic_official: `TERBINAFINE CHLORHYDRATE EXPRIME EN TERBINAFINE`,
      notice_url: `https://pharmnet-dz.com//notice.ashx?id=896`,
      pharmnet_url: `https://pharmnet-dz.com/m-4570-terbinafine-beker-250mg-comp-secable-b-20`,
      dosage_variants: [
        {
          dosage: `250MG`,
          form: `COMP. SEC`,
          conditioning: `B/20`,
          ppa: `1500.00 DA`
        }
      ]
    }
  },
  {
    name: `Daktarin`,
    scientific_name: `Miconazole`,
    category: `Dermatology`,
    emoji: `🍄`,
    description: `Daktarin is a topical antifungal cream used for skin and nail fungal infections, oral thrush (gel form), and athlete's foot. Very commonly used in Algeria.`,
    how_to_take: `Cream: Apply twice daily to affected area and rub in gently. Continue for at least 1 week after symptoms clear. Oral gel: apply to affected area in mouth 4 times daily.`,
    side_effects: [
      `Skin irritation`,
      `Burning sensation`,
      `Contact dermatitis (rare)`
    ],
    warnings: [
      `Oral gel may interact with warfarin and oral antidiabetics — inform your doctor`,
      `Continue full course even after symptoms improve to prevent recurrence`
    ],
    interactions: [
      `Oral gel: warfarin — significantly increases anticoagulant effect`,
      `Oral gel: sulfonylureas — may increase hypoglycemia risk`
    ],
    algeria_brands: [
      `Daktarin 2% cream`,
      `Daktarin oral gel 20mg/g`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste I`,
      lab: `EL KENDI`,
      generic_official: `MICONAZOLE`,
      notice_url: `https://pharmnet-dz.com//notice.ashx?id=1142`,
      pharmnet_url: `https://pharmnet-dz.com/m-5922-daktazol-2g-gel-buccal-t-40g`,
      dosage_variants: [
        {
          dosage: `2G%`,
          form: `GEL`,
          conditioning: `T/40G`,
          ppa: null
        }
      ]
    }
  },


  // ─── NEUROLOGICAL ───────────────────────────────────────────────────────────
  {
    name: `Surmontil`,
    scientific_name: `Trimipramine`,
    category: `Neurological`,
    emoji: `🧠`,
    description: `Surmontil is a tricyclic antidepressant with sedating properties used for depression with anxiety and insomnia. Also prescribed for neuropathic pain at lower doses.`,
    how_to_take: `Take at bedtime (main dose) with or without food. May divide into 2-3 doses during the day.`,
    side_effects: [
      `Drowsiness`,
      `Dry mouth`,
      `Constipation`,
      `Urinary retention`,
      `Dizziness on standing`,
      `Weight gain`
    ],
    warnings: [
      `Do not stop suddenly after prolonged use`,
      `Do not drive`,
      `Avoid alcohol`,
      `Use with caution in cardiac disease and elderly`
    ],
    interactions: [
      `MAOIs — contraindicated`,
      `Alcohol and CNS depressants — severe sedation`,
      `Anticholinergic drugs — additive effects`
    ],
    algeria_brands: [
      `Surmontil 25mg`,
      `Surmontil 100mg`
    ],
    pharmnet: {
      refundable: null,
      prescription_list: `Liste I`,
      lab: `BIOPHARM`,
      generic_official: `TRIMIPRAMINE`,
      notice_url: null,
      pharmnet_url: `https://pharmnet-dz.com/m-2547-surmontil-0-04-sol-buv-gttes-fl-compte-gttes-30ml`,
      dosage_variants: [
        {
          dosage: `0.04`,
          form: `SOL. BUV. GTTES`,
          conditioning: `FL.COMPTE GTTES./30ML`,
          ppa: null
        },
        {
          dosage: `25MG`,
          form: `COMP`,
          conditioning: `B/50`,
          ppa: null
        }
      ]
    }
  },
  {
    name: `Anafranil`,
    scientific_name: `Clomipramine`,
    category: `Neurological`,
    emoji: `🧠`,
    description: `Anafranil is a tricyclic antidepressant specifically effective for obsessive-compulsive disorder (OCD), panic disorder, and depression. It has a strong serotonergic component.`,
    how_to_take: `Take with food. Start at low dose and increase gradually. Take the main dose at bedtime to reduce daytime drowsiness.`,
    side_effects: [
      `Dry mouth`,
      `Constipation`,
      `Drowsiness`,
      `Weight gain`,
      `Sexual dysfunction`,
      `Urinary retention`,
      `Tremor`
    ],
    warnings: [
      `Do not stop suddenly`,
      `Avoid in patients with heart disease`,
      `Seizure threshold lowered`,
      `Allow 14 days between stopping MAOIs and starting`
    ],
    interactions: [
      `MAOIs — contraindicated`,
      `Alcohol and CNS depressants`,
      `SSRIs — serotonin syndrome risk if combined`
    ],
    algeria_brands: [
      `Anafranil 10mg`,
      `Anafranil 25mg`,
      `Anafranil 75mg LP`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste I`,
      lab: `DEFIANTE FARMACEUTICA LDA`,
      generic_official: `CLOMIPRAMINE CHLORHYDRATE`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=2532`,
      pharmnet_url: `https://pharmnet-dz.com/m-2532-anafranil-10mg-comp-enro-b-60`,
      dosage_variants: [
        {
          dosage: `10MG`,
          form: `COMP. PELLI`,
          conditioning: `B/60`,
          ppa: `282.00 DA`
        },
        {
          dosage: `25MG`,
          form: `COMP. PELLI`,
          conditioning: `B/50`,
          ppa: null
        },
        {
          dosage: `25MG/2ML`,
          form: `SOL. INJ`,
          conditioning: `B/05`,
          ppa: null
        },
        {
          dosage: `75MG`,
          form: `COMP. PELLI`,
          conditioning: `B/20`,
          ppa: null
        }
      ]
    }
  },

  {
    name: `Zoloft`,
    scientific_name: `Sertraline`,
    category: `Neurological`,
    emoji: `🧠`,
    description: `Zoloft is an SSRI antidepressant used for depression, OCD, panic disorder, PTSD, and social anxiety. Generally well tolerated with a favorable safety profile in various populations.`,
    how_to_take: `Take once daily, morning or evening, with or without food. Therapeutic effects take 2-4 weeks.`,
    side_effects: [
      `Nausea`,
      `Diarrhea`,
      `Insomnia`,
      `Sexual dysfunction`,
      `Dry mouth`,
      `Tremor`,
      `Sweating`
    ],
    warnings: [
      `Do not stop suddenly — taper gradually`,
      `Monitor for suicidal ideation in young adults`,
      `Allow 14 days after stopping MAOIs`,
      `Can interact with many medications`
    ],
    interactions: [
      `MAOIs — contraindicated`,
      `Tramadol — serotonin syndrome risk`,
      `Warfarin — increased anticoagulant effect`,
      `Pimozide — contraindicated`
    ],
    algeria_brands: [
      `Zoloft 50mg`,
      `Zoloft 100mg`,
      `Sertraline Mylan`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste I`,
      lab: `PFIZER PHARM ALGERIE`,
      generic_official: `SERTRALINE CHLORHYDRATE EXPRIME EN SERTRALINE`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=2562`,
      pharmnet_url: `https://pharmnet-dz.com/m-2562-zoloft-50mg-gles-b-14-`,
      dosage_variants: [
        {
          dosage: `50MG`,
          form: `GLES`,
          conditioning: `B/14`,
          ppa: `602.00 DA`
        }
      ]
    }
  },

  // ─── ENDOCRINE ───────────────────────────────────────────────────────────

  {
    name: `Dostinex`,
    scientific_name: `Cabergoline`,
    category: `Endocrine`,
    emoji: `💊`,
    description: `Dostinex is a dopamine agonist used to treat elevated prolactin levels (hyperprolactinemia) from pituitary adenoma, and to suppress breast milk production after delivery.`,
    how_to_take: `Take twice weekly with food. Take at the same time on the same two days each week.`,
    side_effects: [
      `Nausea`,
      `Headache`,
      `Dizziness`,
      `Fatigue`,
      `Constipation`,
      `Orthostatic hypotension (especially first dose)`
    ],
    warnings: [
      `First dose may cause sudden drop in blood pressure — sit or lie down after taking`,
      `Monitor heart valves with long-term use`,
      `Psychiatric symptoms can occur (compulsive behaviors)`
    ],
    interactions: [
      `Antihypertensives — additive hypotension`,
      `Metoclopramide and domperidone — reduce effectiveness (dopamine antagonists)`,
      `Erythromycin — increases cabergoline levels`
    ],
    algeria_brands: [
      `Dostinex 0.5mg`,
      `Cabergoline Mylan`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste I`,
      lab: `PFIZER HOLDING FRANCE`,
      generic_official: `CABERGOLINE`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=616`,
      pharmnet_url: `https://pharmnet-dz.com/m-616-dostinex-0-5mg-comp--pilulier-08`,
      dosage_variants: [
        {
          dosage: `0,5MG`,
          form: `COMP`,
          conditioning: `PILULIER/08`,
          ppa: `3129.83 DA`
        }
      ]
    }
  },
  {
    name: `Somatuline`,
    scientific_name: `Lanreotide`,
    category: `Endocrine`,
    emoji: `💉`,
    description: `Somatuline is a somatostatin analogue used to treat acromegaly (excess growth hormone) and neuroendocrine tumors. Given as a monthly deep subcutaneous injection.`,
    how_to_take: `Injected by a healthcare professional once monthly into the upper outer buttock area.`,
    side_effects: [
      `Diarrhea`,
      `Gallstones (long-term)`,
      `Stomach pain`,
      `Injection site reactions`,
      `Blood sugar changes`
    ],
    warnings: [
      `Gallbladder monitoring recommended with long-term use`,
      `Monitor blood sugar — may reduce insulin secretion`,
      `Do not administer intravenously`
    ],
    interactions: [
      `Cyclosporine — reduce cyclosporine dose when starting lanreotide`,
      `Insulin and antidiabetics — dose adjustment may be needed`
    ],
    algeria_brands: [
      `Somatuline Autogel 60mg`,
      `Somatuline Autogel 90mg`,
      `Somatuline Autogel 120mg`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste I`,
      lab: `IPSEN PHARMA`,
      generic_official: `LANREOTIDE ACETATE EXPRIME EN LANREOTIDE`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=3832`,
      pharmnet_url: `https://pharmnet-dz.com/m-3832-somatuline-lp-120mg-sering-de-0-5ml-sol-inj-sc-profonde-lp-en-sering-prerempl-b-01seringue-preremplie-de-0-5ml-avec-un-systÃ¨me-de-securite--aiguille`,
      dosage_variants: [
        {
          dosage: `120MG/SERING. DE 0,5ML`,
          form: `SOL. INJ. LP`,
          conditioning: `B/01SERINGUE PREREMPLIE DE 0,5ML AVEC UN SYSTÃME DE SECURITE + AIGUILLE`,
          ppa: `140671.00 DA`
        },
        {
          dosage: `30MG`,
          form: `PDRE. SOL. INJ`,
          conditioning: `B/1+1`,
          ppa: null
        },
        {
          dosage: `60MG/SERING. DE 0,5ML`,
          form: `SOL. INJ. LP`,
          conditioning: `B/01SERINGUE PREREMPLIE DE 0,5ML AVEC UN SYSTÃME DE SECURITE + AIGUILLE`,
          ppa: `103906.00 DA`
        },
        {
          dosage: `90MG/SERING. DE 0,5ML`,
          form: `SOL. INJ. LP`,
          conditioning: `B/01SERINGUE PREREMPLIE DE 0,5ML AVEC UN SYSTÃME DE SECURITE + AIGUILLE`,
          ppa: `129820.00 DA`
        }
      ]
    }
  },

  // ─── RHEUMATOLOGY ───────────────────────────────────────────────────────────
  {
    name: `Méthotrexate`,
    scientific_name: `Methotrexate`,
    category: `Rheumatology`,
    emoji: `💊`,
    description: `Méthotrexate is a disease-modifying antirheumatic drug (DMARD) used for rheumatoid arthritis, psoriasis, and psoriatic arthritis. At low weekly doses it suppresses the overactive immune response causing joint destruction.`,
    how_to_take: `Take ONCE PER WEEK (not daily) — this is critical. Take on the same day each week. Always take with folic acid (on non-methotrexate days).`,
    side_effects: [
      `Nausea and vomiting`,
      `Mouth ulcers`,
      `Fatigue`,
      `Liver toxicity`,
      `Bone marrow suppression`,
      `Lung toxicity (rare)`
    ],
    warnings: [
      `NEVER take daily — weekly dosing only — daily dosing is potentially fatal`,
      `Take folic acid supplementation on non-methotrexate days to reduce side effects`,
      `Regular blood tests (CBC, liver function) are mandatory`,
      `Report any breathlessness, persistent cough, mouth ulcers, or unusual bruising`,
      `Not safe in pregnancy — teratogenic`
    ],
    interactions: [
      `NSAIDs — increase methotrexate toxicity`,
      `Trimethoprim/Bactrim — serious toxicity`,
      `Penicillins — increase methotrexate levels`,
      `Alcohol — increases liver toxicity`
    ],
    algeria_brands: [
      `Méthotrexate 2.5mg tablets`,
      `Méthotrexate 25mg/mL injectable`,
      `Novatrex 2.5mg`,
      `Imeth 7.5mg/15mg/25mg auto-injector`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste I`,
      lab: `RHONE POULENC RORER`,
      generic_official: `METHOTREXATE`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=989`,
      pharmnet_url: `https://pharmnet-dz.com/m-989-methotrexate-bellon-2-5mg-comp-b-20`,
      dosage_variants: [
        {
          dosage: `2,5MG`,
          form: `COMP`,
          conditioning: `B/20`,
          ppa: null
        },
        {
          dosage: `500MG/FL. DE PDRE.`,
          form: `PDRE. SOL. INJ`,
          conditioning: `B/10 FL (500 MG/20ML)`,
          ppa: null
        },
        {
          dosage: `5MG/2ML`,
          form: `SOL. INJ`,
          conditioning: `B/1FL`,
          ppa: null
        }
      ]
    }
  },
  {
    name: `Plaquenil`,
    scientific_name: `Hydroxychloroquine`,
    category: `Rheumatology`,
    emoji: `💊`,
    description: `Plaquenil is a disease-modifying drug used for rheumatoid arthritis, lupus (SLE), and other autoimmune conditions. It also has antimalarial properties. Requires regular eye monitoring.`,
    how_to_take: `Take once or twice daily with food to reduce stomach upset. Therapeutic effect takes 3-6 months to appear.`,
    side_effects: [
      `Nausea and stomach upset`,
      `Headache`,
      `Skin rash`,
      `Rare but important: retinal damage with long-term use`
    ],
    warnings: [
      `Annual eye examination (retinal screening) is mandatory with long-term use`,
      `Stop and inform doctor if any visual changes occur`,
      `May prolong QT interval`,
      `Do not use in patients with G6PD deficiency`
    ],
    interactions: [
      `Amiodarone and other QT-prolonging drugs — cardiac risk`,
      `Antidiabetics — may enhance glucose lowering`,
      `Cyclosporine — levels may increase`
    ],
    algeria_brands: [
      `Plaquenil 200mg`,
      `Hydroxychloroquine Mylan`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `N/D`,
      lab: `SANOFI SYNTHELABO`,
      generic_official: `HYDROXYCHLOROQUINE`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=1414`,
      pharmnet_url: `https://pharmnet-dz.com/m-1414-plaquenil-200mg-comp-enro-b-30`,
      dosage_variants: [
        {
          dosage: `200MG`,
          form: `COMP. PELLI`,
          conditioning: `B/30`,
          ppa: null
        }
      ]
    }
  },

  {
    name: `Salazopyrine`,
    scientific_name: `Sulfasalazine`,
    category: `Rheumatology`,
    emoji: `💊`,
    description: `Salazopyrine is a DMARD used for rheumatoid arthritis, ankylosing spondylitis, and inflammatory bowel disease (Crohn's, ulcerative colitis).`,
    how_to_take: `Take with food and plenty of water. Start at low dose and increase gradually. Take 2-4 times daily.`,
    side_effects: [
      `Nausea and vomiting`,
      `Headache`,
      `Skin rash`,
      `Urine/skin may turn orange (harmless)`,
      `Reduced male fertility (reversible)`,
      `Blood count changes`
    ],
    warnings: [
      `Tell doctor if sulfonamide or aspirin allergic`,
      `Regular blood tests required`,
      `Orange discoloration of urine is normal and harmless`,
      `Drink plenty of fluids`
    ],
    interactions: [
      `Warfarin — increased anticoagulant effect`,
      `Methotrexate — increased toxicity risk`,
      `Digoxin — reduced digoxin absorption`,
      `Folic acid — reduces absorption (take at different times)`
    ],
    algeria_brands: [
      `Salazopyrine 500mg`,
      `Sulfasalazine Mylan`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `N/D`,
      lab: `PHARMACIA UPJOHN`,
      generic_official: `SALAZOSULFAPYRIDINE`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=2980`,
      pharmnet_url: `https://pharmnet-dz.com/m-2980-salazopyrin-en-500mg-comp-b-100`,
      dosage_variants: [
        {
          dosage: `500MG`,
          form: `COMP`,
          conditioning: `B/100`,
          ppa: null
        }
      ]
    }
  },

  // ─── ONCOLOGY SUPPORT ───────────────────────────────────────────────────────────

  {
    name: `Leucovorine`,
    scientific_name: `Calcium Folinate (Leucovorin)`,
    category: `Oncology Support`,
    emoji: `💊`,
    description: `Leucovorine is used to reduce the toxic effects of methotrexate (leucovorin rescue), and as part of colorectal cancer chemotherapy regimens (FOLFOX, FOLFIRI) to enhance the effect of 5-fluorouracil.`,
    how_to_take: `Administered by healthcare professionals in oncology or rheumatology settings. Timing critical relative to methotrexate.`,
    side_effects: [
      `Nausea`,
      `Allergic reactions`,
      `Rarely: seizures with high doses`
    ],
    warnings: [
      `Not a substitute for folic acid supplementation in methotrexate-treated patients`,
      `Timing of administration relative to methotrexate is critical`
    ],
    interactions: [
      `Methotrexate — rescue agent, given 24 hours after methotrexate for high-dose protocols`,
      `5-Fluorouracil — leucovorin enhances its anticancer effect`
    ],
    algeria_brands: [
      `Leucovorine calcique 25mg injectable`,
      `Calcium Folinate 50mg/mL`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `N/D`,
      lab: `CLS PHARMA`,
      generic_official: `MEQUINOL`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=526`,
      pharmnet_url: `https://pharmnet-dz.com/m-526-leucodinine-b-0-1-pde-t-30g`,
      dosage_variants: [
        {
          dosage: `0.1`,
          form: `PDE. DERM`,
          conditioning: `T/30G`,
          ppa: null
        }
      ]
    }
  },

  // ─── GYNECOLOGY ───────────────────────────────────────────────────────────
  {
    name: `Duphaston`,
    scientific_name: `Dydrogesterone`,
    category: `Gynecology`,
    emoji: `🩺`,
    description: `Duphaston is a synthetic progestogen used for endometriosis, irregular menstruation, threatened miscarriage, premenstrual syndrome, and hormone replacement therapy. Very widely prescribed in Algeria.`,
    how_to_take: `Dosage and timing depend on indication. For threatened miscarriage: usually 40mg immediately then 10mg every 8 hours. Follow prescribed schedule precisely.`,
    side_effects: [
      `Headache`,
      `Nausea`,
      `Breast tenderness`,
      `Irregular bleeding`,
      `Dizziness`
    ],
    warnings: [
      `Do not stop suddenly in threatened miscarriage without medical guidance`,
      `Tell doctor if you have liver disease or a history of blood clots`,
      `Inform doctor if you miss a period while taking it`
    ],
    interactions: [
      `Rifampicin and other liver enzyme inducers — reduce effectiveness`,
      `Phenytoin and carbamazepine — reduce effectiveness`
    ],
    algeria_brands: [
      `Duphaston 10mg`,
      `Dydrogestérone Mylan`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste I`,
      lab: `SOLVAY PHARMA`,
      generic_official: `DYDROGESTERONE`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=3816`,
      pharmnet_url: `https://pharmnet-dz.com/m-3816-duphaston-10mg-comp-pelli-b-10`,
      dosage_variants: [
        {
          dosage: `10MG`,
          form: `COMP. PELLI`,
          conditioning: `B/10`,
          ppa: null
        }
      ]
    }
  },
  {
    name: `Utrogestan`,
    scientific_name: `Micronised Progesterone`,
    category: `Gynecology`,
    emoji: `🩺`,
    description: `Utrogestan is a natural progesterone supplement used for luteal phase support in fertility treatments, threatened miscarriage prevention, and hormone replacement therapy.`,
    how_to_take: `Can be taken orally or inserted vaginally (vaginal route preferred for fertility treatment). Usually 1-3 capsules daily as prescribed.`,
    side_effects: [
      `Drowsiness (oral route — common)`,
      `Dizziness`,
      `Breast tenderness`,
      `Headache`,
      `Nausea`
    ],
    warnings: [
      `Oral use causes drowsiness — take at bedtime`,
      `Vaginal route avoids first-pass metabolism and drowsiness`,
      `Not a contraceptive`
    ],
    interactions: [
      `Rifampicin, phenytoin, carbamazepine — reduce effectiveness`
    ],
    algeria_brands: [
      `Utrogestan 100mg capsules`,
      `Utrogestan 200mg capsules`,
      `Progesterone Mylan`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste I`,
      lab: `BESINS INTERNATIONAL`,
      generic_official: `PROGESTERONE`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=3822`,
      pharmnet_url: `https://pharmnet-dz.com/m-3822-utrogestan-100mg-caps-molle-ora-ou-vagi-b-30-`,
      dosage_variants: [
        {
          dosage: `100MG`,
          form: `CAPS. MOLLE`,
          conditioning: `B/30`,
          ppa: `728.00 DA`
        },
        {
          dosage: `200MG`,
          form: `CAPS. MOLLE`,
          conditioning: `B/15`,
          ppa: null
        }
      ]
    }
  },
  {
    name: `Clomid`,
    scientific_name: `Clomiphene Citrate`,
    category: `Gynecology`,
    emoji: `🩺`,
    description: `Clomid is used to stimulate ovulation in women with infertility due to anovulation (absence of ovulation), including polycystic ovarian syndrome (PCOS). Widely used in Algerian fertility clinics.`,
    how_to_take: `Take once daily for 5 days starting on day 2-5 of menstrual cycle. Used for up to 6 cycles typically.`,
    side_effects: [
      `Hot flushes`,
      `Nausea`,
      `Breast tenderness`,
      `Mood changes`,
      `Headache`,
      `Visual disturbances (stop and seek care)`,
      `Ovarian cysts`
    ],
    warnings: [
      `Stop and inform doctor immediately for any visual disturbances`,
      `Risk of multiple pregnancy (twins)`,
      `Ovarian hyperstimulation syndrome risk`,
      `Ovarian cysts should resolve between cycles`
    ],
    interactions: [
      `Few significant drug interactions at standard doses`
    ],
    algeria_brands: [
      `Clomid 50mg`,
      `Clomiphène Mylan 50mg`,
      `Prolifen 50mg`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste I`,
      lab: `SANOFI AVENTIS`,
      generic_official: `CLOMIFENE CITRATE`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=3810`,
      pharmnet_url: `https://pharmnet-dz.com/m-3810-clomid-50mg-comp-b-5-`,
      dosage_variants: [
        {
          dosage: `50MG`,
          form: `COMP. SEC`,
          conditioning: `B/5`,
          ppa: null
        }
      ]
    }
  },


  // ─── INFECTIOUS DISEASE ───────────────────────────────────────────────────────────

  {
    name: `Fasigyne`,
    scientific_name: `Tinidazole`,
    category: `Infectious Disease`,
    emoji: `🦠`,
    description: `Fasigyne is an antiprotozoal and antibacterial agent used for giardiasis, amoebic dysentery, bacterial vaginosis, trichomoniasis, and H. pylori eradication. Single or short-course therapy.`,
    how_to_take: `Take with food to reduce stomach upset. Usually single dose (2g) or 3-5 day course depending on indication.`,
    side_effects: [
      `Metallic taste`,
      `Nausea`,
      `Stomach discomfort`,
      `Headache`,
      `Urine may darken (harmless)`
    ],
    warnings: [
      `Absolutely avoid alcohol during treatment and for 72 hours after — serious disulfiram-like reaction`,
      `Not for use in first trimester of pregnancy`
    ],
    interactions: [
      `Alcohol — severe disulfiram-like reaction (avoid for 72 hours after)`,
      `Warfarin — increased anticoagulant effect`
    ],
    algeria_brands: [
      `Fasigyne 500mg`,
      `Tinidazole Mylan`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste I`,
      lab: `PFIZER PHARM ALGERIE`,
      generic_official: `TINIDAZOLE`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=2057`,
      pharmnet_url: `https://pharmnet-dz.com/m-2057-fasigyne-500mg-comp-enro-b-4`,
      dosage_variants: [
        {
          dosage: `500MG`,
          form: `COMP. PELLI`,
          conditioning: `B/4`,
          ppa: null
        }
      ]
    }
  },
  {
    name: `Nivaquine`,
    scientific_name: `Chloroquine`,
    category: `Infectious Disease`,
    emoji: `🦠`,
    description: `Nivaquine is used for malaria prevention and treatment, and for autoimmune conditions (lupus, rheumatoid arthritis). Requires regular eye monitoring with long-term use.`,
    how_to_take: `For malaria prevention: take once weekly starting 1 week before travel. For treatment: dose prescribed by physician. With food to reduce stomach upset.`,
    side_effects: [
      `Nausea`,
      `Headache`,
      `Visual disturbances`,
      `Skin rash`,
      `Retinal damage with long-term use`,
      `QT prolongation`
    ],
    warnings: [
      `Annual eye exam mandatory for long-term use`,
      `Stop and seek care for any visual changes`,
      `Not for use with epilepsy`,
      `QT prolongation — avoid with other QT-prolonging drugs`
    ],
    interactions: [
      `QT-prolonging drugs — cardiac risk`,
      `Antacids — reduce absorption (take 4 hours apart)`,
      `Amiodarone — increased arrhythmia risk`
    ],
    algeria_brands: [
      `Nivaquine 100mg`,
      `Chloroquine Mylan`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste II`,
      lab: `RHONE POULENC RORER`,
      generic_official: `CHLOROQUINE`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=2054`,
      pharmnet_url: `https://pharmnet-dz.com/m-2054-nivaquine-100mg-comp-b-20`,
      dosage_variants: [
        {
          dosage: `100MG`,
          form: `COMP`,
          conditioning: `B/20`,
          ppa: null
        }
      ]
    }
  },


  // ─── ALLERGY ───────────────────────────────────────────────────────────
  {
    name: `Zyrtec`,
    scientific_name: `Cetirizine`,
    category: `Allergy`,
    emoji: `🌿`,
    description: `Zyrtec is a second-generation antihistamine used for allergic rhinitis, urticaria (hives), and other allergic conditions. Less sedating than older antihistamines.`,
    how_to_take: `Take 1 tablet (10mg) once daily, with or without food. Can be taken at night if drowsiness occurs.`,
    side_effects: [
      `Drowsiness (less than older antihistamines)`,
      `Dry mouth`,
      `Headache`,
      `Fatigue`,
      `Nausea`
    ],
    warnings: [
      `May still cause drowsiness — caution when driving`,
      `Reduce dose in severe kidney disease`,
      `Avoid alcohol`
    ],
    interactions: [
      `Alcohol — increased sedation`,
      `CNS depressants — additive drowsiness`,
      `Theophylline at high doses — reduces cetirizine clearance`
    ],
    algeria_brands: [
      `Zyrtec 10mg`,
      `Cétirizine Mylan 10mg`,
      `Virlix 10mg`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste II`,
      lab: `UCB PHARMA`,
      generic_official: `CETIRIZINE DICHLORHYDRATE`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=4025`,
      pharmnet_url: `https://pharmnet-dz.com/m-4025-zyrtec-10mg-ml-sol-buv-gttes-b-01fl-compte-gttes-de-15ml`,
      dosage_variants: [
        {
          dosage: `10MG/ML`,
          form: `SOL. BUV. GTTES`,
          conditioning: `B/01FL COMPTE GTTES DE 15ML`,
          ppa: `348.00 DA`
        }
      ]
    }
  },
  {
    name: `Clarityne`,
    scientific_name: `Loratadine`,
    category: `Allergy`,
    emoji: `🌿`,
    description: `Clarityne is a non-sedating second-generation antihistamine for allergic rhinitis, urticaria, and seasonal allergies. Safe for use during the day without causing drowsiness.`,
    how_to_take: `Take 1 tablet (10mg) once daily with or without food. Consistently non-sedating at recommended dose.`,
    side_effects: [
      `Headache`,
      `Dry mouth`,
      `Fatigue`,
      `Very rarely: drowsiness`
    ],
    warnings: [
      `One of the safest antihistamines for daytime use`,
      `Reduce dose in severe liver disease`,
      `Safe in pregnancy (consult doctor)`
    ],
    interactions: [
      `Ketoconazole and erythromycin — slightly increase loratadine levels (not clinically significant at standard doses)`
    ],
    algeria_brands: [
      `Clarityne 10mg`,
      `Loratadine Mylan`,
      `Claritin 10mg`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste II`,
      lab: `SCHERING PLOUGH`,
      generic_official: `LORATADINE`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=4002`,
      pharmnet_url: `https://pharmnet-dz.com/m-4002-clarityne-1mg-ml-sirop-fl-60ml`,
      dosage_variants: [
        {
          dosage: `1MG/ML`,
          form: `SIROP`,
          conditioning: `FL./60ML`,
          ppa: `392.31 DA`
        }
      ]
    }
  },

  {
    name: `Polaramine`,
    scientific_name: `Dexchlorpheniramine`,
    category: `Allergy`,
    emoji: `🌿`,
    description: `Polaramine is a first-generation antihistamine used for allergic rhinitis, urticaria, and allergic reactions. More sedating than newer antihistamines — useful for night-time allergy symptoms.`,
    how_to_take: `Take 2mg 3-4 times daily or 6mg (slow-release) twice daily. Take with food or milk.`,
    side_effects: [
      `Significant drowsiness (very common)`,
      `Dry mouth`,
      `Constipation`,
      `Urinary retention`,
      `Blurred vision`,
      `Confusion in elderly`
    ],
    warnings: [
      `Do not drive or operate machinery`,
      `Avoid alcohol`,
      `Use with extreme caution in elderly — falls and confusion risk`,
      `Not recommended during work or driving hours`
    ],
    interactions: [
      `Alcohol and CNS depressants — severe sedation`,
      `MAOIs — prolonged anticholinergic effects`,
      `Anticholinergic drugs — additive effects`
    ],
    algeria_brands: [
      `Polaramine 2mg`,
      `Polaramine Répétabs 6mg SR`,
      `Déxchlorphéniramine Mylan`
    ],
    pharmnet: {
      refundable: null,
      prescription_list: `N/D`,
      lab: `SCHERING PLOUGH`,
      generic_official: `DEXCHLORPHENIRAMINE MALEATE`,
      notice_url: `https://pharmnet-dz.com//notice.ashx?id=6072`,
      pharmnet_url: `https://pharmnet-dz.com/m-3976-polaramine-5mg-ml-sol-inj-b-05-amp-de-1ml`,
      dosage_variants: [
        {
          dosage: `5MG/ML`,
          form: `SOL. INJ`,
          conditioning: `B/05 AMP. DE 1ML`,
          ppa: null
        }
      ]
    }
  },

  {
    name: `Nasonex`,
    scientific_name: `Mometasone (nasal spray)`,
    category: `Allergy`,
    emoji: `👃`,
    description: `Nasonex is an intranasal corticosteroid spray for allergic and non-allergic rhinitis, nasal polyps, and seasonal allergies. Minimal systemic absorption at recommended doses.`,
    how_to_take: `Spray 2 puffs into each nostril once daily. Shake well before use. Use regularly for best effect.`,
    side_effects: [
      `Nasal irritation`,
      `Epistaxis (nosebleed)`,
      `Headache`,
      `Pharyngitis`,
      `Rarely: nasal septal perforation`
    ],
    warnings: [
      `Shake before use`,
      `Avoid spraying directly at the nasal septum`,
      `If using for more than 3 months, mention to doctor`,
      `Do not use if nasal infection present without treatment`
    ],
    interactions: [
      `Ketoconazole — may slightly increase systemic absorption`,
      `Few clinically significant interactions at intranasal doses`
    ],
    algeria_brands: [
      `Nasonex 50mcg nasal spray`,
      `Mométasone Mylan nasal spray`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste I`,
      lab: `SCHERING PLOUGH`,
      generic_official: `MOMETASONE FUROATE ANHYDRE`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=1942`,
      pharmnet_url: `https://pharmnet-dz.com/m-1942-nasonex-50Âµg-dose-susp-p-pulv-nas-fl-120doses-avec-pompe-doseuse`,
      dosage_variants: [
        {
          dosage: `50ÂµG/DOSE`,
          form: `SPRAY NAS`,
          conditioning: `FL./120DOSES AVEC POMPE DOSEUSE`,
          ppa: null
        }
      ]
    }
  },
  {
    name: `Avamys`,
    scientific_name: `Fluticasone Furoate (nasal)`,
    category: `Allergy`,
    emoji: `👃`,
    description: `Avamys is an intranasal corticosteroid used for seasonal and perennial allergic rhinitis. Provides 24-hour relief from nasal symptoms with once-daily dosing.`,
    how_to_take: `Spray 2 puffs into each nostril once daily. Shake and prime before first use.`,
    side_effects: [
      `Nosebleeds`,
      `Nasal irritation`,
      `Headache`,
      `Pharyngitis`
    ],
    warnings: [
      `Shake before use`,
      `Do not spray directly onto septum`,
      `Some systemic absorption possible`
    ],
    interactions: [
      `CYP3A4 inhibitors (ketoconazole, ritonavir) may increase systemic exposure`
    ],
    algeria_brands: [
      `Avamys 27.5mcg nasal spray`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste I`,
      lab: `GLAXO SMITHKLINE`,
      generic_official: `FLUTICASONE FUROATE`,
      notice_url: `https://pharmnet-dz.com//notice.ashx?id=1943`,
      pharmnet_url: `https://pharmnet-dz.com/m-4288-avamys-27-50Âµg-dose-susp-p-pulv-nas-fl-120doses`,
      dosage_variants: [
        {
          dosage: `27,50ÂµG/DOSE`,
          form: `SUSP.NAS`,
          conditioning: `FL./120DOSES`,
          ppa: null
        }
      ]
    }
  },

  // ─── STOMACH ───────────────────────────────────────────────────────────
  {
    name: `Ursolvan`,
    scientific_name: `Ursodeoxycholic Acid (UDCA)`,
    category: `Stomach`,
    emoji: `🫀`,
    description: `Ursolvan is used to dissolve cholesterol gallstones, treat primary biliary cholangitis, and protect the liver in certain cholestatic liver conditions.`,
    how_to_take: `Take with meals (or at bedtime for gallstone dissolution). Doses are weight-based. Treatment for gallstones lasts months to years.`,
    side_effects: [
      `Nausea`,
      `Diarrhea`,
      `Stomach pain`,
      `Rarely: liver function changes`
    ],
    warnings: [
      `Not for calcified gallstones or non-functioning gallbladder`,
      `Regular liver function monitoring recommended`,
      `Gallstones may recur after stopping`
    ],
    interactions: [
      `Cholestyramine and antacids — reduce absorption`,
      `Contraceptives and clofibrate — increase cholesterol secretion counteracting UDCA`
    ],
    algeria_brands: [
      `Ursolvan 300mg`,
      `UDCA Mylan 250mg`,
      `Delursan 250mg`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste I`,
      lab: `SANOFI AVENTIS`,
      generic_official: `ACIDE URSODESOXYCHOLIQUE`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=2994`,
      pharmnet_url: `https://pharmnet-dz.com/m-2994-ursolvan-200mg-gles-b-30`,
      dosage_variants: [
        {
          dosage: `200MG`,
          form: `GLES`,
          conditioning: `B/30`,
          ppa: `587.04 DA`
        }
      ]
    }
  },

  // ─── ENT ───────────────────────────────────────────────────────────
  {
    name: `Hexaspray`,
    scientific_name: `Biclotymol`,
    category: `ENT`,
    emoji: `🗣️`,
    description: `Hexaspray is an antiseptic throat spray used for sore throat, pharyngitis, and tonsillitis. Very commonly used in Algeria for upper respiratory tract infections.`,
    how_to_take: `Spray 2-3 times into the back of the throat, 3-4 times daily. Hold breath during spraying.`,
    side_effects: [
      `Mild local irritation`,
      `Transient numbness`,
      `Rarely: allergic reactions`
    ],
    warnings: [
      `Not for children under 6 years`,
      `Do not swallow`,
      `Not for severe throat infections requiring antibiotics`
    ],
    interactions: [
      `No significant interactions at local application`
    ],
    algeria_brands: [
      `Hexaspray 0.5mg/dose spray`,
      `Hexaspray Menthol`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `N/D`,
      lab: `BOUCHARA-RECORDATI`,
      generic_official: `BICLOTYMOL`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=1133`,
      pharmnet_url: `https://pharmnet-dz.com/m-1133-hexaspray-0-75mg-30g-collu-fl-pressurise-de-30g`,
      dosage_variants: [
        {
          dosage: `0,75MG/30G`,
          form: `COLLU`,
          conditioning: `FL. PRESSURISE DE 30G`,
          ppa: `259.00 DA`
        }
      ]
    }
  },

  {
    name: `Rhinofluimucil`,
    scientific_name: `Acetylcysteine + Tuaminoheptane`,
    category: `ENT`,
    emoji: `👃`,
    description: `Rhinofluimucil nasal spray combines a mucolytic agent with a nasal decongestant for the treatment of thick nasal secretions and nasal congestion in rhinitis and sinusitis.`,
    how_to_take: `Spray 2-3 puffs into each nostril 4 times daily. Do not use for more than 7-10 days without medical advice.`,
    side_effects: [
      `Nasal dryness`,
      `Burning sensation`,
      `Sneezing`,
      `Rebound congestion with overuse`
    ],
    warnings: [
      `Do not use for more than 10 days without medical advice — rebound congestion risk`,
      `Not for children under 3 without medical guidance`,
      `Avoid in severe hypertension or hyperthyroidism`
    ],
    interactions: [
      `MAOIs — rebound hypertension risk`,
      `Tricyclic antidepressants — additive vasoconstriction`
    ],
    algeria_brands: [
      `Rhinofluimucil nasal solution 0.1%/1%`
    ],
    pharmnet: {
      refundable: false,
      prescription_list: `Liste II`,
      lab: `ZAMBON`,
      generic_official: `ACETYLCYSTEINE/TUAMINOHEPTANE/CHLORURE DE BENZALKONIUM`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=1476`,
      pharmnet_url: `https://pharmnet-dz.com/m-1476-rhinofluimucil-100mg-50mg-1-25mg-10ml-sol-pulv-nasale-fl-10ml`,
      dosage_variants: [
        {
          dosage: `100MG/50MG/1,25MG/10ML`,
          form: `SOL. NAS`,
          conditioning: `FL./10ML`,
          ppa: null
        }
      ]
    }
  },
  

  // ─── RESPIRATORY ───────────────────────────────────────────────────────────
  {
    name: `Toplexil`,
    scientific_name: `Oxomemazine`,
    category: `Respiratory`,
    emoji: `🫁`,
    description: `Toplexil is an antihistamine cough syrup used for dry, irritating cough and as a sedating antihistamine for nighttime allergy symptoms. Contains an antihistamine with antitussive properties.`,
    how_to_take: `Take 1-2 teaspoons (5-10mL) 3 times daily and at bedtime if needed.`,
    side_effects: [
      `Drowsiness (very common)`,
      `Dry mouth`,
      `Constipation`,
      `Urinary retention`,
      `Dizziness`
    ],
    warnings: [
      `Do not drive — strongly sedating`,
      `Avoid alcohol`,
      `Not for productive cough`,
      `Not for children under 12 without medical guidance`
    ],
    interactions: [
      `Alcohol — excessive sedation`,
      `MAOIs — prolonged anticholinergic effects`,
      `CNS depressants — additive sedation`
    ],
    algeria_brands: [
      `Toplexil 0.33mg/mL syrup`
    ],
    pharmnet: {
      refundable: false,
      prescription_list: `N/D`,
      lab: `SAIDAL GROUPE`,
      generic_official: `OXOMEMAZINE`,
      notice_url: `https://pharmnet-dz.com//notice.ashx?id=6011`,
      pharmnet_url: `https://pharmnet-dz.com/m-1300-toplexil-0-33mg-ml-sirop-fl-150ml`,
      dosage_variants: [
        {
          dosage: `0,33MG/ML`,
          form: `SIROP`,
          conditioning: `FL/150ML`,
          ppa: `116.00 DA`
        }
      ]
    }
  },


  // ─── STOMACH ───────────────────────────────────────────────────────────

  {
    name: `Nifuroxazide`,
    scientific_name: `Nifuroxazide`,
    category: `Stomach`,
    emoji: `🫁`,
    description: `Nifuroxazide is an intestinal antiseptic used for acute diarrhea caused by intestinal bacteria. It acts locally in the gut without significant systemic absorption.`,
    how_to_take: `Take 1 tablet (200mg) 4 times daily for 3-7 days. Can be taken with or without food.`,
    side_effects: [
      `Nausea`,
      `Stomach pain`,
      `Allergic reactions (rare)`
    ],
    warnings: [
      `Not for bloody diarrhea without medical advice`,
      `Not a replacement for oral rehydration salts`,
      `Seek care if high fever or severe dehydration`
    ],
    interactions: [
      `Alcohol — disulfiram-like reaction possible (avoid)`,
      `Few significant drug interactions`
    ],
    algeria_brands: [
      `Ercefuryl 200mg`,
      `Nifuroxazide 200mg`,
      `Diafuryl 200mg`
    ],
    pharmnet: {
      refundable: false,
      prescription_list: `Liste II`,
      lab: `PHARMAGHREB`,
      generic_official: `NIFUROXAZIDE`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=3935`,
      pharmnet_url: `https://pharmnet-dz.com/m-3935-nifuroxazide-0-04-susp-buv-fl-90ml`,
      dosage_variants: [
        {
          dosage: `0.04`,
          form: `SUSP. BUV`,
          conditioning: `FL/90ML`,
          ppa: null
        }
      ]
    }
  },

  {
    name: `Nexium`,
    scientific_name: `Esomeprazole (alternative brand)`,
    category: `Stomach`,
    emoji: `🫁`,
    description: `Nexium is the same molecule as Inexium (esomeprazole), another brand available in Algeria for acid-related disorders.`,
    how_to_take: `Take 30 minutes before a meal. Swallow whole.`,
    side_effects: [
      `Same as Inexium — headache, nausea, diarrhea, constipation`
    ],
    warnings: [
      `Do not use with clopidogrel — use pantoprazole instead`,
      `Long-term use may deplete magnesium and B12`
    ],
    interactions: [
      `Same as Inexium`
    ],
    algeria_brands: [
      `Nexium 20mg`,
      `Nexium 40mg`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste II`,
      lab: `ASTRAZENECA`,
      generic_official: `ESOMEPRAZOLE`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=3888`,
      pharmnet_url: `https://pharmnet-dz.com/m-3888-inexium-40mg-comp-gastroresist-b-14`,
      dosage_variants: [
        {
          dosage: `40MG`,
          form: `COMP. PELLI`,
          conditioning: `B/14`,
          ppa: null
        },
        {
          dosage: `40MG/FL. DE PDRE.`,
          form: `PDRE. SOL. INJ`,
          conditioning: `B/10FL. DE PDRE.`,
          ppa: null
        }
      ]
    }
  },
  // ─── NEW PHARMNET-VERIFIED MEDICATIONS ─────────────────────────────────────
// Replace the 110 unmatched medications with these pharmnet-verified ones
// Add these to algerianMedications.js replacing the unmatched ones


  // ─── DIABETES ──────────────────────────────────────
  {
    name: `AMAREL`,
    scientific_name: `Glimepiride`,
    category: `Diabetes`,
    emoji: `💊`,
    description: `Amarel (glimepiride) is a sulfonylurea used to treat type 2 diabetes in Algeria. It stimulates the pancreas to release more insulin to lower blood sugar.`,
    how_to_take: `Take once daily with breakfast. Do not skip meals.`,
    side_effects: [
      `Low blood sugar`,
      `Weight gain`,
      `Nausea`
    ],
    warnings: [
      `Monitor blood sugar regularly`,
      `Do not skip meals`,
      `Avoid excessive alcohol`
    ],
    interactions: [
      `Insulin increases hypoglycemia risk`
    ],
    algeria_brands: [
      `Amarel 1mg`,
      `Amarel 2mg`,
      `Amarel 4mg`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste I`,
      lab: `SANOFI AVENTIS`,
      generic_official: `GLIMEPIRIDE`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=3640`,
      pharmnet_url: `https://pharmnet-dz.com/m-3640-amarel-1mg-comp-b-30`,
      dosage_variants: [
        {
          dosage: `1MG`,
          form: `COMP. SEC`,
          conditioning: `B/30`,
          ppa: null
        },
        {
          dosage: `2MG`,
          form: `COMP. SEC`,
          conditioning: `B/30`,
          ppa: null
        },
        {
          dosage: `3MG`,
          form: `COMP. SEC`,
          conditioning: `B/30`,
          ppa: null
        },
        {
          dosage: `4MG`,
          form: `COMP. SEC`,
          conditioning: `B/30`,
          ppa: null
        },
        {
          dosage: `6MG`,
          form: `COMP. PELLI`,
          conditioning: `B/30`,
          ppa: null
        }
      ]
    }
  },
  {
    name: `ACTRAPID HM`,
    scientific_name: `Insulin Human (Rapid-acting)`,
    category: `Diabetes`,
    emoji: `💉`,
    description: `Actrapid HM is a rapid-acting human insulin used to control blood sugar at mealtimes in type 1 and type 2 diabetes.`,
    how_to_take: `Inject subcutaneously 30 minutes before meals. Rotate injection sites.`,
    side_effects: [
      `Hypoglycemia`,
      `Injection site reactions`,
      `Weight gain`
    ],
    warnings: [
      `Always carry fast-acting glucose`,
      `Do not inject into vein`,
      `Rotate injection sites`
    ],
    interactions: [
      `Alcohol alters blood sugar`,
      `Beta-blockers mask hypoglycemia`
    ],
    algeria_brands: [
      `Actrapid HM 100IU/mL`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste II`,
      lab: `NOVO NORDISK`,
      generic_official: `INSULINE HUMAINE MONOCOMPOSEE`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=3743`,
      pharmnet_url: `https://pharmnet-dz.com/m-3743-actrapid-hm-100ui-ml-sol-inj-fl-10ml`,
      dosage_variants: [
        {
          dosage: `100UI/ML`,
          form: `SOL. INJ`,
          conditioning: `FL/10ML`,
          ppa: `797.00 DA`
        }
      ]
    }
  },
  {
    name: `ABASAGLAR`,
    scientific_name: `Insulin Glargine Biosimilar`,
    category: `Diabetes`,
    emoji: `💉`,
    description: `Abasaglar is a biosimilar long-acting insulin glargine used once daily to provide steady background insulin control for diabetes.`,
    how_to_take: `Inject once daily at the same time each day subcutaneously. Do not mix with other insulins.`,
    side_effects: [
      `Hypoglycemia`,
      `Injection site pain`,
      `Weight gain`
    ],
    warnings: [
      `Do not mix with other insulins`,
      `Rotate injection sites`,
      `Store opened pen at room temperature max 28 days`
    ],
    interactions: [
      `Alcohol alters blood sugar control`
    ],
    algeria_brands: [
      `Abasaglar 100U/mL KwikPen`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste II`,
      lab: `ELI LILLY`,
      generic_official: `INSULINE GLARGINE`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=5866`,
      pharmnet_url: `https://pharmnet-dz.com/m-5866-abasaglar-100ui-ml-3-64mg-ml-sol-inj-en-stylo-prerempli-kwikpen-b-05-stylos-preremlis-de-3-ml`,
      dosage_variants: [
        {
          dosage: `100UI/ML (3,64MG/ML)`,
          form: `SOL. INJ`,
          conditioning: `B/05 STYLOS PREREMLIS DE 3 ML`,
          ppa: `6708.11 DA`
        }
      ]
    }
  },
  {
    name: `DALVEX`,
    scientific_name: `Sitagliptin`,
    category: `Diabetes`,
    emoji: `💊`,
    description: `Dalvex (sitagliptin) is a DPP-4 inhibitor that helps lower blood sugar by increasing insulin release when blood sugar is high in type 2 diabetes.`,
    how_to_take: `Take once daily (100mg) with or without food.`,
    side_effects: [
      `Stuffy nose`,
      `Headache`,
      `Upper respiratory infection`
    ],
    warnings: [
      `Dose adjustment needed for kidney disease`,
      `Report severe joint pain`
    ],
    interactions: [
      `Works well with metformin`
    ],
    algeria_brands: [
      `Dalvex 100mg`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste I`,
      lab: `PHYSIOPHARM SARL`,
      generic_official: `SITAGLIPTINE PHOSPHATE MONOHYDRATE EXPRIME EN SITAGLIPTINE`,
      notice_url: `https://pharmnet-dz.com//notice.ashx?id=6078`,
      pharmnet_url: `https://pharmnet-dz.com/m-5864-dalvex-100mg-comp-pelli-b-30`,
      dosage_variants: [
        {
          dosage: `100MG`,
          form: `COMP`,
          conditioning: `B/30`,
          ppa: null
        }
      ]
    }
  },
  {
    name: `DIABAMINE BGL`,
    scientific_name: `Metformin`,
    category: `Diabetes`,
    emoji: `💊`,
    description: `Diabamine BGL is a metformin product for type 2 diabetes produced by an Algerian pharmaceutical laboratory, providing an affordable local alternative to imported brands.`,
    how_to_take: `Take with meals to reduce stomach upset. Usually 2-3 times daily.`,
    side_effects: [
      `Nausea`,
      `Diarrhea`,
      `Metallic taste`
    ],
    warnings: [
      `Do not use with severe kidney disease`,
      `Stop before contrast X-rays`
    ],
    interactions: [
      `Alcohol increases lactic acidosis risk`
    ],
    algeria_brands: [
      `Diabamine BGL 500mg`,
      `Diabamine BGL 850mg`,
      `Diabamine BGL 1000mg`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste I`,
      lab: `BIO-GALENIC`,
      generic_official: `METFORMINE CHLORHYDRATE`,
      notice_url: `https://pharmnet-dz.com//notice.ashx?id=6078`,
      pharmnet_url: `https://pharmnet-dz.com/m-3703-diabamine-bgl-1000mg-comp-pell-b-30`,
      dosage_variants: [
        {
          dosage: `1000MG`,
          form: `COMP. PELLI`,
          conditioning: `B/30`,
          ppa: `172.00 DA`
        },
        {
          dosage: `500MG`,
          form: `COMP. PELLI`,
          conditioning: `B/50`,
          ppa: `184.00 DA`
        },
        {
          dosage: `850MG`,
          form: `COMP. PELLI`,
          conditioning: `B/100`,
          ppa: `490.00 DA`
        }
      ]
    }
  },

  // ─── HYPERTENSION ──────────────────────────────────────
  {
    name: `BISOPROLOL BEKER`,
    scientific_name: `Bisoprolol`,
    category: `Hypertension`,
    emoji: `❤️`,
    description: `Bisoprolol is a cardioselective beta-blocker used in Algeria to treat hypertension, stable angina, and chronic heart failure. Available from local manufacturer BEKER.`,
    how_to_take: `Take once daily in the morning with or without food. Never stop abruptly.`,
    side_effects: [
      `Fatigue`,
      `Cold extremities`,
      `Slow heartbeat`,
      `Dizziness`
    ],
    warnings: [
      `Never stop abruptly — taper gradually`,
      `Caution in asthma`,
      `Masks hypoglycemia in diabetics`
    ],
    interactions: [
      `Verapamil — severe bradycardia risk`,
      `NSAIDs reduce effectiveness`
    ],
    algeria_brands: [
      `Bisoprolol Beker 5mg`,
      `Bisoprolol Beker 10mg`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste I`,
      lab: `BEKER LABORATOIRES`,
      generic_official: `BISOPROLOL FUMARATE`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=3246`,
      pharmnet_url: `https://pharmnet-dz.com/m-3246-bisoprolol-beker-10mg-comp-pell-sec-b-30-et-b-90`,
      dosage_variants: [
        {
          dosage: `10MG`,
          form: `COMP. PELLI`,
          conditioning: `B/30 ET B/90`,
          ppa: `585.00 DA`
        },
        {
          dosage: `5MG`,
          form: `COMP. PELLI`,
          conditioning: `B/30 ET B/90`,
          ppa: `290.00 DA`
        }
      ]
    }
  },
  {
    name: `ADEX LP`,
    scientific_name: `Indapamide`,
    category: `Hypertension`,
    emoji: `💊`,
    description: `Adex LP is an indapamide diuretic used in Algeria to lower blood pressure. Available as a sustained-release formulation for once-daily dosing.`,
    how_to_take: `Take once daily in the morning to prevent nighttime urination.`,
    side_effects: [
      `Frequent urination`,
      `Low potassium`,
      `Dizziness`
    ],
    warnings: [
      `Monitor electrolytes regularly`,
      `Stay hydrated`
    ],
    interactions: [
      `Digoxin toxicity risk with low potassium`
    ],
    algeria_brands: [
      `Adex LP 1.5mg`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste II`,
      lab: `INPHA MEDIS`,
      generic_official: `INDAPAMIDE`,
      notice_url: `https://pharmnet-dz.com//notice.ashx?id=93`,
      pharmnet_url: `https://pharmnet-dz.com/m-1485-adex-lp-1-5mg-comp-pelli-lp-b-30`,
      dosage_variants: [
        {
          dosage: `1,5MG`,
          form: `COMP. PELLI. LP`,
          conditioning: `B/30`,
          ppa: `690.00 DA`
        }
      ]
    }
  },
  {
    name: `AMLODIPINE BEKER`,
    scientific_name: `Amlodipine`,
    category: `Hypertension`,
    emoji: `❤️`,
    description: `Amlodipine Beker is a locally manufactured calcium channel blocker for hypertension and angina. Same molecule as Amlor but produced in Algeria by BEKER laboratories.`,
    how_to_take: `Take once daily at the same time each day with or without food.`,
    side_effects: [
      `Ankle swelling`,
      `Headache`,
      `Flushing`,
      `Fatigue`
    ],
    warnings: [
      `Report severe ankle swelling`,
      `Avoid grapefruit juice`
    ],
    interactions: [
      `Simvastatin — limit simvastatin to 20mg`
    ],
    algeria_brands: [
      `Amlodipine Beker 5mg`,
      `Amlodipine Beker 10mg`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste I`,
      lab: `BEKER LABORATOIRES`,
      generic_official: `AMLODIPINE BESYLATE EXPRIME EN AMLODIPINE`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=86`,
      pharmnet_url: `https://pharmnet-dz.com/m-86-amlodipine-beker-10mg-gles-b-30-et-b-90`,
      dosage_variants: [
        {
          dosage: `10MG`,
          form: `GLES`,
          conditioning: `B/30 ET B/90`,
          ppa: `663.00 DA`
        },
        {
          dosage: `5MG`,
          form: `GLES`,
          conditioning: `B/30 ET B/90`,
          ppa: `489.00 DA`
        }
      ]
    }
  },
  {
    name: `RAMIPRIL BEKER`,
    scientific_name: `Ramipril`,
    category: `Hypertension`,
    emoji: `❤️`,
    description: `Ramipril Beker is an ACE inhibitor made locally in Algeria used for hypertension, heart failure, and kidney protection in diabetic patients.`,
    how_to_take: `Take once daily with or without food at the same time each day.`,
    side_effects: [
      `Dry cough`,
      `Dizziness`,
      `Headache`,
      `Elevated potassium`
    ],
    warnings: [
      `Not safe in pregnancy`,
      `Stop for facial swelling or throat tightness`,
      `Monitor potassium`
    ],
    interactions: [
      `NSAIDs reduce effectiveness`,
      `Potassium supplements — hyperkalemia`
    ],
    algeria_brands: [
      `Ramipril Beker 2.5mg`,
      `Ramipril Beker 5mg`,
      `Ramipril Beker 10mg`
    ],
    pharmnet: null
  },
  {
    name: `LISINOX`,
    scientific_name: `Lisinopril`,
    category: `Hypertension`,
    emoji: `❤️`,
    description: `Lisinox is a locally registered lisinopril ACE inhibitor for hypertension, heart failure, and after heart attack. Manufactured in Algeria.`,
    how_to_take: `Take once daily with or without food.`,
    side_effects: [
      `Dry cough`,
      `Dizziness`,
      `Headache`
    ],
    warnings: [
      `Not safe in pregnancy`,
      `Monitor kidney function and potassium`
    ],
    interactions: [
      `NSAIDs reduce effectiveness`
    ],
    algeria_brands: [
      `Lisinox 5mg`,
      `Lisinox 10mg`,
      `Lisinox 20mg`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste II`,
      lab: `PHARMALLIANCE`,
      generic_official: `ESOMEPRAZOLE MAGNESIUM TRIHYDRATE EXPRIME EN ESOMEPRAZOLE`,
      notice_url: null,
      pharmnet_url: `https://pharmnet-dz.com/m-3883-lisinox-20mg-comp-pelli-gastroresist-b-07--b-14--b-28`,
      dosage_variants: [
        {
          dosage: `20MG`,
          form: `GLES. A MICROG. GASTRORESIST`,
          conditioning: `B/07 - B/14 - B/28`,
          ppa: `600.00 DA`
        },
        {
          dosage: `40MG`,
          form: `COMP. PELLI`,
          conditioning: `B/07 - B/14 - B/28`,
          ppa: null
        }
      ]
    }
  },
  {
    name: `ACUILIX`,
    scientific_name: `Quinapril`,
    category: `Hypertension`,
    emoji: `❤️`,
    description: `Acuilix contains quinapril, an ACE inhibitor used for hypertension and heart failure. Registered and available in Algerian pharmacies.`,
    how_to_take: `Take once daily with or without food.`,
    side_effects: [
      `Dry cough`,
      `Dizziness`,
      `Hyperkalemia`
    ],
    warnings: [
      `Not safe in pregnancy`,
      `Monitor kidney function`
    ],
    interactions: [
      `NSAIDs and potassium supplements interactions`
    ],
    algeria_brands: [
      `Acuilix 5mg`,
      `Acuilix 20mg`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste I`,
      lab: `PFIZER`,
      generic_official: `QUINAPRIL CHLORHYDRATE EXPRIME EN QUINAPRIL / HYDROCHLOROTHIAZIDE`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=184`,
      pharmnet_url: `https://pharmnet-dz.com/m-184-acuilix-20mg-12-5mg-comp-pelli-sec-b-28`,
      dosage_variants: [
        {
          dosage: `20MG/12,5MG`,
          form: `COMP. PELLI`,
          conditioning: `B/28`,
          ppa: `1075.00 DA`
        }
      ]
    }
  },
  {
    name: `ALDACTAZINE`,
    scientific_name: `Spironolactone + Hydrochlorothiazide`,
    category: `Hypertension`,
    emoji: `❤️`,
    description: `Aldactazine combines spironolactone and hydrochlorothiazide for patients who need two diuretics to control blood pressure and fluid retention.`,
    how_to_take: `Take once daily in the morning with food.`,
    side_effects: [
      `Increased urination`,
      `Electrolyte imbalances`,
      `Breast tenderness`
    ],
    warnings: [
      `Monitor potassium regularly`,
      `Avoid potassium supplements`
    ],
    interactions: [
      `ACE inhibitors — hyperkalemia risk`
    ],
    algeria_brands: [
      `Aldactazine 25mg/15mg`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste II`,
      lab: `PFIZER HOLDING FRANCE`,
      generic_official: `SPIRONOLACTONE / ALTIZIDE`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=1483`,
      pharmnet_url: `https://pharmnet-dz.com/m-1483-aldactazine-25mg-15mg-comp-pelli-sec-b-30`,
      dosage_variants: [
        {
          dosage: `25MG/15MG`,
          form: `COMP. PELLI`,
          conditioning: `B/30`,
          ppa: null
        }
      ]
    }
  },
  {
    name: `METOPROLOL BEKER`,
    scientific_name: `Metoprolol`,
    category: `Hypertension`,
    emoji: `❤️`,
    description: `Metoprolol Beker is a cardioselective beta-blocker for hypertension, angina, and heart failure. Manufactured locally in Algeria.`,
    how_to_take: `Take once or twice daily with food. Never stop abruptly.`,
    side_effects: [
      `Fatigue`,
      `Dizziness`,
      `Cold extremities`,
      `Slow heartbeat`
    ],
    warnings: [
      `Never stop abruptly`,
      `Caution in asthma`
    ],
    interactions: [
      `Verapamil — heart block risk`
    ],
    algeria_brands: [
      `Metoprolol Beker 50mg`,
      `Metoprolol Beker 100mg`
    ],
    pharmnet: null
  },
  {
    name: `AMLODIPINE+VALSARTAN LDM`,
    scientific_name: `Amlodipine + Valsartan`,
    category: `Hypertension`,
    emoji: `❤️`,
    description: `A locally manufactured fixed-dose combination of amlodipine and valsartan for patients requiring two medications to control blood pressure.`,
    how_to_take: `Take once daily with or without food.`,
    side_effects: [
      `Ankle swelling`,
      `Dizziness`,
      `Headache`
    ],
    warnings: [
      `Not safe in pregnancy`,
      `Monitor kidney function`
    ],
    interactions: [
      `NSAIDs reduce effectiveness`
    ],
    algeria_brands: [
      `Amlodipine+Valsartan LDM 5/80mg`,
      `Amlodipine+Valsartan LDM 5/160mg`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste I`,
      lab: `LDM (LABORATOIRE DE DIAGNOSTIC MAGHREBINS)`,
      generic_official: `AMLODIPINE BESILATE EXPRIME EN AMLODIPINE / VALSARTAN`,
      notice_url: `https://pharmnet-dz.com//notice.ashx?id=93`,
      pharmnet_url: `https://pharmnet-dz.com/m-3195-amlodipine-valsartan-ldm-10mg-160mg-comp-pelli-b-30`,
      dosage_variants: [
        {
          dosage: `10MG/160MG`,
          form: `COMP. PELLI`,
          conditioning: `B/30`,
          ppa: `1650.00 DA`
        },
        {
          dosage: `5MG/160MG`,
          form: `COMP. PELLI`,
          conditioning: `B/30`,
          ppa: `1630.00 DA`
        },
        {
          dosage: `5MG/80MG`,
          form: `COMP. PELLI`,
          conditioning: `B/30`,
          ppa: `1650.00 DA`
        }
      ]
    }
  },

  // ─── HEART ──────────────────────────────────────
  {
    name: `ASPIRINE CARDIO`,
    scientific_name: `Aspirin (low dose)`,
    category: `Heart`,
    emoji: `💊`,
    description: `Aspirine Cardio is a low-dose aspirin registered in Algeria used to prevent blood clots, heart attacks, and strokes as an antiplatelet agent.`,
    how_to_take: `Take once daily after a meal with a full glass of water.`,
    side_effects: [
      `Stomach irritation`,
      `Heartburn`,
      `Rarely: stomach bleeding`
    ],
    warnings: [
      `Tell dentist and surgeon you take aspirin`,
      `Stop if black stools appear`
    ],
    interactions: [
      `Warfarin — increased bleeding risk`,
      `Ibuprofen interferes with antiplatelet effect`
    ],
    algeria_brands: [
      `Aspirine Cardio 75mg`,
      `Aspirine Cardio 100mg`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `N/D`,
      lab: `BIOPHARM`,
      generic_official: `ACIDE ACETYLSALICYLIQUE`,
      notice_url: `https://pharmnet-dz.com//notice.ashx?id=6053`,
      pharmnet_url: `https://pharmnet-dz.com/m-1705-aspirine-cardio-100mg-comp-pilulier-60`,
      dosage_variants: [
        {
          dosage: `100MG`,
          form: `COMP`,
          conditioning: `PILULIER/60`,
          ppa: null
        }
      ]
    }
  },
  {
    name: `ATOR`,
    scientific_name: `Atorvastatin`,
    category: `Heart`,
    emoji: `💊`,
    description: `Ator is a locally manufactured atorvastatin statin for lowering cholesterol and reducing cardiovascular risk. Made by an Algerian pharmaceutical company as an affordable alternative.`,
    how_to_take: `Take once daily at any time with or without food.`,
    side_effects: [
      `Muscle pain`,
      `Headache`,
      `Liver enzyme elevation`
    ],
    warnings: [
      `Report unexplained muscle pain immediately`,
      `Avoid grapefruit juice`
    ],
    interactions: [
      `Grapefruit increases drug levels`,
      `Amlodipine — limit to 40mg`
    ],
    algeria_brands: [
      `Ator 10mg`,
      `Ator 20mg`,
      `Ator 40mg`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste I`,
      lab: `INPHA MEDIS`,
      generic_official: `ATORVASTATINE CALCIQUE TRIHYDRATE EXPRIME EN ATORVASTATINE`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=1557`,
      pharmnet_url: `https://pharmnet-dz.com/m-1557-ator-10mg-comp-pelli-sec-b-28-`,
      dosage_variants: [
        {
          dosage: `10MG`,
          form: `COMP. PELLI`,
          conditioning: `B/28`,
          ppa: `781.00 DA`
        },
        {
          dosage: `20MG`,
          form: `COMP. PELLI`,
          conditioning: `B/28`,
          ppa: null
        },
        {
          dosage: `40MG`,
          form: `COMP. PELLI`,
          conditioning: `B/28`,
          ppa: `1848.00 DA`
        },
        {
          dosage: `80MG`,
          form: `COMP. PELLI`,
          conditioning: `B/28`,
          ppa: `1904.00 DA`
        }
      ]
    }
  },
  {
    name: `ANGODAL`,
    scientific_name: `Isosorbide Dinitrate`,
    category: `Heart`,
    emoji: `❤️`,
    description: `Angodal contains isosorbide dinitrate, a nitrate used to prevent and treat angina attacks by dilating blood vessels to reduce the heart workload.`,
    how_to_take: `Take as prescribed. Allow nitrate-free interval daily to prevent tolerance.`,
    side_effects: [
      `Headache (very common at start)`,
      `Flushing`,
      `Dizziness`,
      `Low blood pressure`
    ],
    warnings: [
      `Allow nitrate-free interval daily to prevent tolerance`,
      `Rise slowly`
    ],
    interactions: [
      `Do not combine with erectile dysfunction medications — severe hypotension`
    ],
    algeria_brands: [
      `Angodal 20mg`,
      `Angodal 40mg`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste II`,
      lab: `SAIDAL GROUPE`,
      generic_official: `ISOSORBIDE DINITRATE`,
      notice_url: `https://pharmnet-dz.com//notice.ashx?id=93`,
      pharmnet_url: `https://pharmnet-dz.com/m-106-angodal-10mg-comp-sec-b-60`,
      dosage_variants: [
        {
          dosage: `10MG`,
          form: `COMP. SEC`,
          conditioning: `B/60`,
          ppa: null
        },
        {
          dosage: `20MG`,
          form: `COMP. LP`,
          conditioning: `B/60`,
          ppa: null
        }
      ]
    }
  },
  {
    name: `AMIOCARDONE`,
    scientific_name: `Amiodarone`,
    category: `Heart`,
    emoji: `❤️`,
    description: `Amiocardone is an Algerian brand of amiodarone for serious heart rhythm problems. Requires careful monitoring due to multiple organ effects.`,
    how_to_take: `Take with food. Follow prescribed dose schedule exactly.`,
    side_effects: [
      `Sun sensitivity`,
      `Thyroid problems`,
      `Lung toxicity (rare)`,
      `Visual disturbances`
    ],
    warnings: [
      `Use high-SPF sunscreen`,
      `Regular thyroid and liver monitoring required`
    ],
    interactions: [
      `Warfarin — significantly increases anticoagulant effect`
    ],
    algeria_brands: [
      `Amiocardone 200mg`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste II`,
      lab: `SAIDAL GROUPE`,
      generic_official: `AMIODARONE CHLORHYDRATE`,
      notice_url: `https://pharmnet-dz.com//notice.ashx?id=93`,
      pharmnet_url: `https://pharmnet-dz.com/m-127-amiocardone-200mg-comp-sec-b-30`,
      dosage_variants: [
        {
          dosage: `200MG`,
          form: `COMP SEC`,
          conditioning: `B/30`,
          ppa: `420 DA`
        },
        {
          dosage: `50MG/ML (150MG/3ML)`,
          form: `SOL. INJ`,
          conditioning: `B/06 AMP. DE 3ML ET B/50 AMP. DE 3ML`,
          ppa: null
        }
      ]
    }
  },
  {
    name: `AROVAN`,
    scientific_name: `Atorvastatin`,
    category: `Heart`,
    emoji: `💊`,
    description: `Arovan is another Algerian brand of atorvastatin for cholesterol management, providing a locally manufactured cost-effective option.`,
    how_to_take: `Take once daily with or without food.`,
    side_effects: [
      `Muscle pain`,
      `Nausea`,
      `Headache`
    ],
    warnings: [
      `Report muscle weakness immediately`,
      `Avoid grapefruit`
    ],
    interactions: [
      `Rifampicin reduces effectiveness`
    ],
    algeria_brands: [
      `Arovan 10mg`,
      `Arovan 20mg`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste I`,
      lab: `EL KENDI`,
      generic_official: `ATORVASTATINE CALCIQUE TRIHYDRATE EXPRIME EN ATORVASTATINE`,
      notice_url: `https://pharmnet-dz.com//notice.ashx?id=93`,
      pharmnet_url: `https://pharmnet-dz.com/m-1556-arovan-10mg-comp-pelli--b-30`,
      dosage_variants: [
        {
          dosage: `10MG`,
          form: `COMP. PELLI`,
          conditioning: `B/30`,
          ppa: null
        },
        {
          dosage: `20MG`,
          form: `COMP. PELLI`,
          conditioning: `B/30`,
          ppa: null
        },
        {
          dosage: `40MG`,
          form: `COMP. PELLI`,
          conditioning: `B/30`,
          ppa: null
        },
        {
          dosage: `80MG`,
          form: `COMP. PELLI`,
          conditioning: `B/30`,
          ppa: null
        }
      ]
    }
  },

  // ─── NEUROLOGICAL ──────────────────────────────────────
  {
    name: `AMITRAL`,
    scientific_name: `Lamotrigine`,
    category: `Neurological`,
    emoji: `🧠`,
    description: `Amitral is a locally registered lamotrigine antiepileptic used for epilepsy and bipolar disorder in Algeria. Start at very low dose and increase slowly.`,
    how_to_take: `Start at low dose and increase very slowly. Take once or twice daily.`,
    side_effects: [
      `Skin rash (stop immediately)`,
      `Dizziness`,
      `Headache`,
      `Blurred vision`
    ],
    warnings: [
      `Stop immediately for any rash — Stevens-Johnson syndrome risk`,
      `Do not stop suddenly`
    ],
    interactions: [
      `Valproate doubles lamotrigine levels`,
      `Carbamazepine reduces levels`
    ],
    algeria_brands: [
      `Amitral 25mg`,
      `Amitral 50mg`,
      `Amitral 100mg`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste I`,
      lab: `EL KENDI`,
      generic_official: `LAMOTRIGINE`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=2408`,
      pharmnet_url: `https://pharmnet-dz.com/m-2408-amitral-100mg-comp-dispers--b-30`,
      dosage_variants: [
        {
          dosage: `100MG`,
          form: `COMP. DISPERS`,
          conditioning: `B/30`,
          ppa: `1943.00 DA`
        },
        {
          dosage: `25MG`,
          form: `COMP. DISPERS`,
          conditioning: `B/30`,
          ppa: `742.00 DA`
        },
        {
          dosage: `5MG`,
          form: `COMP. DISPERS`,
          conditioning: `B/30`,
          ppa: `409.00 DA`
        }
      ]
    }
  },
  {
    name: `ANXYPAM`,
    scientific_name: `Bromazepam`,
    category: `Neurological`,
    emoji: `🧠`,
    description: `Anxypam is a benzodiazepine anxiolytic registered in Algeria for anxiety and short-term insomnia. Use minimum effective dose for shortest time.`,
    how_to_take: `Take as prescribed. Short-term use only.`,
    side_effects: [
      `Drowsiness`,
      `Dizziness`,
      `Memory impairment`,
      `Dependence`
    ],
    warnings: [
      `Short-term use only — dependence risk`,
      `Do not drive`,
      `Avoid alcohol`
    ],
    interactions: [
      `Alcohol — serious respiratory depression`
    ],
    algeria_brands: [
      `Anxypam 6mg`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste I`,
      lab: `GROUPE SANTE`,
      generic_official: `BROMAZEPAM`,
      notice_url: null,
      pharmnet_url: `https://pharmnet-dz.com/m-5887-anxypam-6mg-comp-quadrisec-b-30`,
      dosage_variants: [
        {
          dosage: `6MG`,
          form: `COMP SEC`,
          conditioning: `B/30`,
          ppa: null
        }
      ]
    }
  },
  {
    name: `AMITRIPTYLINE`,
    scientific_name: `Amitriptyline`,
    category: `Neurological`,
    emoji: `🧠`,
    description: `Amitriptyline is a tricyclic antidepressant registered in Algeria for depression, neuropathic pain, and insomnia. Take at bedtime.`,
    how_to_take: `Take at bedtime. Start at low dose and increase gradually.`,
    side_effects: [
      `Dry mouth`,
      `Drowsiness`,
      `Constipation`,
      `Weight gain`
    ],
    warnings: [
      `Do not drive`,
      `Avoid in cardiac arrhythmias`,
      `Do not stop suddenly`
    ],
    interactions: [
      `MAOIs — contraindicated`,
      `Alcohol — severe sedation`
    ],
    algeria_brands: [
      `Amitriptyline 25mg`,
      `Amitriptyline 50mg`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste I`,
      lab: `PHARMAGHREB`,
      generic_official: `AMITRIPTYLINE CHLORHYDRATE EXPRIME EN AMITRIPTYLINE`,
      notice_url: null,
      pharmnet_url: `https://pharmnet-dz.com/m-2524-amitriptyline-4--40mg-ml-sol-buv-gttes-fl-20ml`,
      dosage_variants: [
        {
          dosage: `4% (40MG/ML)`,
          form: `SOL. BUV. GTTES`,
          conditioning: `FL./20ML`,
          ppa: `115.00 DA`
        }
      ]
    }
  },
  {
    name: `ARIPIPRAZOLE BEKER`,
    scientific_name: `Aripiprazole`,
    category: `Neurological`,
    emoji: `🧠`,
    description: `Aripiprazole Beker is a locally manufactured atypical antipsychotic for schizophrenia and bipolar disorder with a favorable metabolic profile.`,
    how_to_take: `Take once daily with or without food at the same time each day.`,
    side_effects: [
      `Nausea`,
      `Insomnia`,
      `Headache`,
      `Restlessness`
    ],
    warnings: [
      `Do not stop without medical guidance`,
      `Monitor weight and blood sugar`
    ],
    interactions: [
      `CYP2D6 inhibitors increase levels`
    ],
    algeria_brands: [
      `Aripiprazole Beker 10mg`,
      `Aripiprazole Beker 15mg`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste I`,
      lab: `BEKER LABORATOIRES`,
      generic_official: `ARIPIPRAZOLE`,
      notice_url: null,
      pharmnet_url: `https://pharmnet-dz.com/m-4694-aripiprazole-beker-15mg-comp-b-30`,
      dosage_variants: [
        {
          dosage: `15MG`,
          form: `COMP`,
          conditioning: `B/30`,
          ppa: `5842.20 DA`
        },
        {
          dosage: `20MG`,
          form: `COMP`,
          conditioning: `B/30`,
          ppa: `6510.00 DA`
        },
        {
          dosage: `10MG`,
          form: `COMP`,
          conditioning: `B/30`,
          ppa: `5842,20 DA`
        }
      ]
    }
  },
  {
    name: `ARIDONE HUP`,
    scientific_name: `Donepezil`,
    category: `Neurological`,
    emoji: `🧠`,
    description: `Aridone HUP is a donepezil cholinesterase inhibitor for Alzheimer disease to slow cognitive decline. Registered in Algeria.`,
    how_to_take: `Take once daily at bedtime with or without food.`,
    side_effects: [
      `Nausea`,
      `Diarrhea`,
      `Insomnia`,
      `Muscle cramps`
    ],
    warnings: [
      `Only for Alzheimer diagnosis`,
      `Does not cure progression`
    ],
    interactions: [
      `Anticholinergic drugs reduce effectiveness`
    ],
    algeria_brands: [
      `Aridone HUP 5mg`,
      `Aridone HUP 10mg`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste I`,
      lab: `HUP.P.PHARMA SARL`,
      generic_official: `DONEPEZIL CHLORHYDRATE`,
      notice_url: `https://pharmnet-dz.com//notice.ashx?id=6066`,
      pharmnet_url: `https://pharmnet-dz.com/m-2496-aridone-hup-10mg-comp-pelli-sec-b-28`,
      dosage_variants: [
        {
          dosage: `10MG`,
          form: `COMP. PELLI`,
          conditioning: `B/28`,
          ppa: null
        },
        {
          dosage: `5MG`,
          form: `COMP. PELLI`,
          conditioning: `B/28`,
          ppa: null
        }
      ]
    }
  },
  {
    name: `LEVETIRACETAM BEKER`,
    scientific_name: `Levetiracetam`,
    category: `Neurological`,
    emoji: `🧠`,
    description: `Levetiracetam Beker is a locally manufactured antiepileptic for partial and generalized seizures with fewer drug interactions than older antiepileptics.`,
    how_to_take: `Take twice daily with or without food. Do not stop suddenly.`,
    side_effects: [
      `Drowsiness`,
      `Dizziness`,
      `Behavioral changes`,
      `Headache`
    ],
    warnings: [
      `Do not stop suddenly — seizure risk`,
      `Report mood or behavioral changes`
    ],
    interactions: [
      `Few significant drug interactions`
    ],
    algeria_brands: [
      `Levetiracetam Beker 250mg`,
      `Levetiracetam Beker 500mg`,
      `Levetiracetam Beker 1000mg`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste I`,
      lab: `BEKER LABORATOIRES`,
      generic_official: `LEVETIRACETAM`,
      notice_url: `https://pharmnet-dz.com//notice.ashx?id=6066`,
      pharmnet_url: `https://pharmnet-dz.com/m-4664-levetiracetam-beker-250mg-comp-pell-secable-b-60`,
      dosage_variants: [
        {
          dosage: `250MG`,
          form: `COMP. SEC`,
          conditioning: `B/60`,
          ppa: `1771.80 DA`
        },
        {
          dosage: `500MG`,
          form: `COMP. PELLI`,
          conditioning: `B/60`,
          ppa: `3550.20 DA`
        }
      ]
    }
  },
  {
    name: `QUETIAPINE BEKER`,
    scientific_name: `Quetiapine`,
    category: `Neurological`,
    emoji: `🧠`,
    description: `Quetiapine Beker is a locally manufactured atypical antipsychotic for schizophrenia, bipolar disorder, and as adjunct for depression.`,
    how_to_take: `Start at low dose. Take once or twice daily. Do not stop abruptly.`,
    side_effects: [
      `Drowsiness`,
      `Weight gain`,
      `Dry mouth`,
      `Elevated blood sugar`
    ],
    warnings: [
      `Monitor weight and blood sugar`,
      `Do not drive until stable`
    ],
    interactions: [
      `CYP3A4 inhibitors increase levels`,
      `Carbamazepine reduces levels`
    ],
    algeria_brands: [
      `Quetiapine Beker 25mg`,
      `Quetiapine Beker 100mg`,
      `Quetiapine Beker 200mg`
    ],
    pharmnet: null
  },
  {
    name: `SERTRALINE BEKER`,
    scientific_name: `Sertraline`,
    category: `Neurological`,
    emoji: `🧠`,
    description: `Sertraline Beker is a locally manufactured SSRI antidepressant for depression, OCD, and anxiety disorders.`,
    how_to_take: `Take once daily with or without food. Effects take 2-4 weeks.`,
    side_effects: [
      `Nausea`,
      `Diarrhea`,
      `Insomnia`,
      `Sexual dysfunction`
    ],
    warnings: [
      `Do not stop suddenly`,
      `Monitor young adults for suicidal thoughts`
    ],
    interactions: [
      `MAOIs — contraindicated`,
      `Tramadol — serotonin syndrome risk`
    ],
    algeria_brands: [
      `Sertraline Beker 50mg`,
      `Sertraline Beker 100mg`
    ],
    pharmnet: null
  },

  // ─── RESPIRATORY ──────────────────────────────────────
  {
    name: `AEROLIN`,
    scientific_name: `Salbutamol`,
    category: `Respiratory`,
    emoji: `🫁`,
    description: `Aerolin is an Algerian brand of salbutamol bronchodilator for quick relief of asthma and COPD symptoms. Locally manufactured making it widely accessible.`,
    how_to_take: `Shake well. Inhale 1-2 puffs as needed.`,
    side_effects: [
      `Trembling`,
      `Fast heartbeat`,
      `Headache`
    ],
    warnings: [
      `Do not overuse — seek care if needed more than twice weekly`
    ],
    interactions: [
      `Beta-blockers reduce effectiveness`
    ],
    algeria_brands: [
      `Aerolin 100mcg inhaler`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste I`,
      lab: `EIPICO`,
      generic_official: `SALBUTAMOL`,
      notice_url: `https://pharmnet-dz.com//notice.ashx?id=6011`,
      pharmnet_url: `https://pharmnet-dz.com/m-2087-aerolin-100Âµg-bouffee-aero-fl-400doses`,
      dosage_variants: [
        {
          dosage: `100ÂµG/BOUFFEE`,
          form: `AERO`,
          conditioning: `FL/400DOSES`,
          ppa: null
        }
      ]
    }
  },
  {
    name: `AMBOLAR`,
    scientific_name: `Ambroxol`,
    category: `Respiratory`,
    emoji: `🫁`,
    description: `Ambolar contains ambroxol, a mucolytic that thins mucus in the airways. Used for bronchitis and respiratory infections.`,
    how_to_take: `Take 3 times daily with meals. Drink plenty of fluids.`,
    side_effects: [
      `Nausea`,
      `Stomach discomfort`,
      `Diarrhea`
    ],
    warnings: [
      `Drink plenty of fluids`,
      `Consult doctor if symptoms worsen after 7 days`
    ],
    interactions: [
      `Few significant drug interactions`
    ],
    algeria_brands: [
      `Ambolar 30mg tablets`,
      `Ambolar syrup`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste II`,
      lab: `DAR AL DAWA`,
      generic_official: `AMBROXOL`,
      notice_url: `https://pharmnet-dz.com//notice.ashx?id=6011`,
      pharmnet_url: `https://pharmnet-dz.com/m-1325-ambolar-0-003-sol-buv-fl-150ml`,
      dosage_variants: [
        {
          dosage: `0.003`,
          form: `SOL. BUV`,
          conditioning: `FL/150ML`,
          ppa: null
        }
      ]
    }
  },
  {
    name: `BECLATE`,
    scientific_name: `Beclometasone`,
    category: `Respiratory`,
    emoji: `🫁`,
    description: `Beclate is an inhaled corticosteroid for maintenance treatment of asthma. Reduces airway inflammation when used regularly.`,
    how_to_take: `Use twice daily. Rinse mouth with water after each use.`,
    side_effects: [
      `Oral thrush`,
      `Hoarse voice`,
      `Throat irritation`
    ],
    warnings: [
      `Rinse mouth after every use`,
      `Do not use as rescue inhaler`
    ],
    interactions: [
      `Ketoconazole increases levels`
    ],
    algeria_brands: [
      `Beclate 100mcg`,
      `Beclate 250mcg`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste I`,
      lab: `CIPLA LIMITED`,
      generic_official: `BECLOMETASONE`,
      notice_url: `https://pharmnet-dz.com//notice.ashx?id=6011`,
      pharmnet_url: `https://pharmnet-dz.com/m-2059-beclate-250Âµg-bouffee-susp-inhal-fl-200doses`,
      dosage_variants: [
        {
          dosage: `250ÂµG/BOUFFEE`,
          form: `AERO`,
          conditioning: `FL/200DOSES`,
          ppa: null
        }
      ]
    }
  },
  {
    name: `ATUSSINE ADULTES`,
    scientific_name: `Dextromethorphan + Antihistamine`,
    category: `Respiratory`,
    emoji: `🫁`,
    description: `Atussine Adultes is a combination cough syrup for dry irritating cough registered in Algeria.`,
    how_to_take: `Take 1-2 teaspoons 3 times daily. Do not exceed recommended dose.`,
    side_effects: [
      `Drowsiness`,
      `Dry mouth`,
      `Dizziness`
    ],
    warnings: [
      `Do not drive`,
      `Avoid alcohol`,
      `Not for productive cough`
    ],
    interactions: [
      `Alcohol and sedatives — additive drowsiness`
    ],
    algeria_brands: [
      `Atussine Adultes syrup 150mL`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `N/D`,
      lab: `UPC (UNION PHARMACEUTIQUE CONSTANTINOISE)`,
      generic_official: `DEXTROMETHORPHANE BROMHYDRATE / MEPYRAMINE MALEATE`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=2154`,
      pharmnet_url: `https://pharmnet-dz.com/m-2154-atussine-adultes-0-2g-0-2g-100ml-sirop-fl-125ml`,
      dosage_variants: [
        {
          dosage: `0,2G/0,2G/100ML`,
          form: `SIROP`,
          conditioning: `FL/125ML`,
          ppa: `167.00 DA`
        }
      ]
    }
  },

  // ─── PAIN ──────────────────────────────────────
  {
    name: `IBUFEN`,
    scientific_name: `Ibuprofen`,
    category: `Pain`,
    emoji: `🩹`,
    description: `Ibufen is an ibuprofen NSAID registered in Algeria for pain, inflammation, and fever. Available widely in Algerian pharmacies.`,
    how_to_take: `Take with food or milk. 200-400mg every 4-6 hours as needed.`,
    side_effects: [
      `Stomach upset`,
      `Nausea`,
      `Heartburn`,
      `Rarely: stomach bleeding`
    ],
    warnings: [
      `Avoid in stomach ulcer`,
      `Take with food`,
      `Not for kidney or heart disease`
    ],
    interactions: [
      `Warfarin — increased bleeding risk`
    ],
    algeria_brands: [
      `Ibufen 200mg`,
      `Ibufen 400mg`,
      `Ibufen 600mg`
    ],
    pharmnet: {
      refundable: false,
      prescription_list: `Liste I`,
      lab: `LAD PHARMA`,
      generic_official: `IBUPROFENE`,
      notice_url: `https://pharmnet-dz.com//notice.ashx?id=961`,
      pharmnet_url: `https://pharmnet-dz.com/m-4223-ibufen-20mg-ml-100mg-5ml-sol-buv-fl-125-ml`,
      dosage_variants: [
        {
          dosage: `20MG/ML (100MG/5ML)`,
          form: `SOL. BUV`,
          conditioning: `FL/125 ML`,
          ppa: null
        }
      ]
    }
  },
  {
    name: `MELOXICAM BEKER`,
    scientific_name: `Meloxicam`,
    category: `Pain`,
    emoji: `🩹`,
    description: `Meloxicam Beker is a COX-2 preferential NSAID for osteoarthritis and rheumatoid arthritis. Causes fewer stomach side effects than older NSAIDs.`,
    how_to_take: `Take once daily with food. 7.5mg or 15mg daily.`,
    side_effects: [
      `Stomach pain`,
      `Nausea`,
      `Headache`,
      `Dizziness`
    ],
    warnings: [
      `Avoid in kidney or heart disease`,
      `Take with food`
    ],
    interactions: [
      `Warfarin — increased bleeding risk`
    ],
    algeria_brands: [
      `Meloxicam Beker 7.5mg`,
      `Meloxicam Beker 15mg`
    ],
    pharmnet: null
  },
  {
    name: `ZYLORIC`,
    scientific_name: `Allopurinol`,
    category: `Pain`,
    emoji: `🩹`,
    description: `Zyloric is an allopurinol xanthine oxidase inhibitor for long-term gout prevention. Reduces uric acid production to prevent joint deposits.`,
    how_to_take: `Take once daily after a meal. Start at low dose and increase gradually. Drink 2 liters of water daily.`,
    side_effects: [
      `Skin rash (stop immediately)`,
      `Nausea`,
      `Drowsiness`
    ],
    warnings: [
      `Stop immediately for skin rash`,
      `Drink 2 liters of water daily`,
      `Do not start during acute gout attack`
    ],
    interactions: [
      `Azathioprine — serious toxicity — reduce dose significantly`,
      `Warfarin — increased anticoagulant effect`
    ],
    algeria_brands: [
      `Zyloric 100mg`,
      `Zyloric 300mg`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste I`,
      lab: `ASPEN PHARMA TRADING LIMITED`,
      generic_official: `ALLOPURINOL`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=1397`,
      pharmnet_url: `https://pharmnet-dz.com/m-1397-zyloric-100mg-comp-b-28`,
      dosage_variants: [
        {
          dosage: `100MG`,
          form: `COMP`,
          conditioning: `B/28`,
          ppa: null
        },
        {
          dosage: `300MG`,
          form: `COMP`,
          conditioning: `B/28`,
          ppa: null
        }
      ]
    }
  },
  {
    name: `PREDNISOLONE BEKER`,
    scientific_name: `Prednisolone`,
    category: `Pain`,
    emoji: `💊`,
    description: `Prednisolone Beker is a locally manufactured corticosteroid for inflammatory and autoimmune conditions.`,
    how_to_take: `Take in the morning with food. Do not stop suddenly after prolonged use.`,
    side_effects: [
      `Weight gain`,
      `Elevated blood sugar`,
      `Mood changes`,
      `Insomnia`
    ],
    warnings: [
      `Never stop abruptly after extended use`,
      `Monitor blood sugar in diabetics`
    ],
    interactions: [
      `NSAIDs — stomach ulcer risk`,
      `Live vaccines contraindicated`
    ],
    algeria_brands: [
      `Prednisolone Beker 5mg`,
      `Prednisolone Beker 20mg`
    ],
    pharmnet: null
  },
  {
    name: `B-CORTOSONE`,
    scientific_name: `Betamethasone`,
    category: `Pain`,
    emoji: `💊`,
    description: `B-Cortosone contains betamethasone, a potent corticosteroid for severe inflammatory and autoimmune conditions. Available by injection in Algeria.`,
    how_to_take: `Dose and route determined by physician. Take oral forms with food in the morning.`,
    side_effects: [
      `Weight gain`,
      `Elevated blood sugar`,
      `Mood changes`
    ],
    warnings: [
      `Never stop abruptly`,
      `Monitor blood sugar`
    ],
    interactions: [
      `NSAIDs — stomach ulcer risk`
    ],
    algeria_brands: [
      `B-Cortosone injectable`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste I`,
      lab: `PHARMIDAL`,
      generic_official: `BETAMETHASONE`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=4622`,
      pharmnet_url: `https://pharmnet-dz.com/m-4622-b-cortosone-0-5mg-ml-0-05--sol-buv-gttes-b-30ml`,
      dosage_variants: [
        {
          dosage: `0,5MG/ML (0,05%)`,
          form: `SUSP. BUV. GTTES`,
          conditioning: `B/30ML`,
          ppa: null
        }
      ]
    }
  },

  // ─── STOMACH ──────────────────────────────────────
  {
    name: `ANTAG`,
    scientific_name: `Omeprazole`,
    category: `Stomach`,
    emoji: `🫁`,
    description: `Antag is an Algerian brand of omeprazole for acid reflux, gastritis, and stomach ulcers. Locally manufactured providing an affordable alternative.`,
    how_to_take: `Take 30 minutes before the first meal. Swallow capsule whole.`,
    side_effects: [
      `Headache`,
      `Diarrhea`,
      `Nausea`,
      `Flatulence`
    ],
    warnings: [
      `Avoid with clopidogrel — use pantoprazole instead`,
      `Long-term use may reduce magnesium and B12`
    ],
    interactions: [
      `Clopidogrel — avoid combination`
    ],
    algeria_brands: [
      `Antag 20mg`,
      `Antag 40mg`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste II`,
      lab: `BIOCARE LABORATOIRES`,
      generic_official: `OMEPRAZOLE`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=3836`,
      pharmnet_url: `https://pharmnet-dz.com/m-3836-antag-20mg-gles-a-microg-gastroresist-b-14`,
      dosage_variants: [
        {
          dosage: `20MG`,
          form: `GLES. A MICROG. GASTRORESIST`,
          conditioning: `B/14`,
          ppa: `196.00 DA`
        }
      ]
    }
  },
  {
    name: `COLOSTOP`,
    scientific_name: `Trimebutine`,
    category: `Stomach`,
    emoji: `🫁`,
    description: `Colostop contains trimebutine for irritable bowel syndrome and digestive spasms. Locally manufactured Algerian brand.`,
    how_to_take: `Take 3 times daily before meals.`,
    side_effects: [
      `Dry mouth`,
      `Nausea`,
      `Constipation or diarrhea`
    ],
    warnings: [
      `Consult doctor for persistent symptoms`
    ],
    interactions: [
      `Few known interactions`
    ],
    algeria_brands: [
      `Colostop 100mg`,
      `Colostop 200mg`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste II`,
      lab: `PHYSIOPHARM SARL`,
      generic_official: `TRIMEBUTINE MALEATE`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=2887`,
      pharmnet_url: `https://pharmnet-dz.com/m-2887-colostop-100mg-comp-b-20`,
      dosage_variants: [
        {
          dosage: `100MG`,
          form: `COMP. PELLI`,
          conditioning: `B/20`,
          ppa: `181.00 DA`
        },
        {
          dosage: `200MG`,
          form: `COMP`,
          conditioning: `B/30`,
          ppa: null
        }
      ]
    }
  },
  {
    name: `CONSTILAX`,
    scientific_name: `Macrogol`,
    category: `Stomach`,
    emoji: `🫁`,
    description: `Constilax is an osmotic laxative for constipation. Locally manufactured Algerian brand equivalent to Forlax.`,
    how_to_take: `Dissolve 1-2 sachets in water. Take once daily preferably in the morning.`,
    side_effects: [
      `Bloating`,
      `Stomach cramps`,
      `Diarrhea if dose too high`
    ],
    warnings: [
      `Not for bowel obstruction`,
      `Ensure adequate fluid intake`
    ],
    interactions: [
      `May affect absorption of other medications taken simultaneously`
    ],
    algeria_brands: [
      `Constilax 10g sachet`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `N/D`,
      lab: `SAIDAL GROUPE`,
      generic_official: `MACROGOL 4000 (POLYETHYLENE GLYCOL)`,
      notice_url: null,
      pharmnet_url: `https://pharmnet-dz.com/m-2941-constilax-10g-sachet-pdre-sol-buv-b-20-sachets`,
      dosage_variants: [
        {
          dosage: `10G/SACHET`,
          form: `PDRE. SOL. BUV`,
          conditioning: `B/20 SACHETS`,
          ppa: null
        }
      ]
    }
  },
  {
    name: `AZANTAC`,
    scientific_name: `Ranitidine`,
    category: `Stomach`,
    emoji: `🫁`,
    description: `Azantac is ranitidine, an H2 blocker for acid reflux, peptic ulcers, and heartburn. An alternative to proton pump inhibitors for mild acid-related conditions.`,
    how_to_take: `Take twice daily or once at bedtime.`,
    side_effects: [
      `Headache`,
      `Diarrhea`,
      `Constipation`
    ],
    warnings: [
      `Long-term use requires periodic review`
    ],
    interactions: [
      `Antacids reduce absorption — take 2 hours apart`
    ],
    algeria_brands: [
      `Azantac 150mg`,
      `Azantac 300mg`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste II`,
      lab: `GLAXO SMITHKLINE`,
      generic_official: `RANITIDINE`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=3851`,
      pharmnet_url: `https://pharmnet-dz.com/m-3851-azantac-50mg-2ml-sol-inj-b-05`,
      dosage_variants: [
        {
          dosage: `50MG/2ML`,
          form: `SOL. INJ`,
          conditioning: `B/05`,
          ppa: null
        }
      ]
    }
  },
  {
    name: `CLORAMID`,
    scientific_name: `Metoclopramide`,
    category: `Stomach`,
    emoji: `🫁`,
    description: `Cloramid is a locally registered metoclopramide for nausea, vomiting, and delayed gastric emptying. Manufactured in Algeria.`,
    how_to_take: `Take 10mg up to 3 times daily 30 minutes before meals. Maximum 5 days.`,
    side_effects: [
      `Drowsiness`,
      `Restlessness`,
      `Involuntary movements`
    ],
    warnings: [
      `Risk of involuntary movements — seek urgent care if occurs`,
      `Maximum 5 days for acute use`
    ],
    interactions: [
      `Levodopa — reduced effectiveness`
    ],
    algeria_brands: [
      `Cloramid 10mg tablets`,
      `Cloramid injectable`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste II`,
      lab: `SAIDAL GROUPE`,
      generic_official: `METOCLOPRAMIDE`,
      notice_url: null,
      pharmnet_url: `https://pharmnet-dz.com/m-2860-cloramid-10mg-comp-b-40-`,
      dosage_variants: [
        {
          dosage: `10MG`,
          form: `COMP`,
          conditioning: `B/40`,
          ppa: null
        },
        {
          dosage: `10MG /2ML`,
          form: `SOL. INJ`,
          conditioning: `B/50`,
          ppa: null
        }
      ]
    }
  },
  {
    name: `PANTODAC`,
    scientific_name: `Pantoprazole`,
    category: `Stomach`,
    emoji: `🫁`,
    description: `Pantodac is an Algerian brand of pantoprazole — the preferred PPI for patients on clopidogrel. Does not interfere with clopidogrel antiplatelet activity.`,
    how_to_take: `Take 30-60 minutes before a meal. Swallow whole — do not crush.`,
    side_effects: [
      `Headache`,
      `Diarrhea`,
      `Nausea`
    ],
    warnings: [
      `Preferred PPI with clopidogrel`
    ],
    interactions: [
      `Does not significantly interact with clopidogrel`
    ],
    algeria_brands: [
      `Pantodac 20mg`,
      `Pantodac 40mg`
    ],
    pharmnet: null
  },

  // ─── ANTIBIOTICS ──────────────────────────────────────
  {
    name: `AMOCLAN BID`,
    scientific_name: `Amoxicillin + Clavulanic Acid`,
    category: `Antibiotics`,
    emoji: `🦠`,
    description: `Amoclan BID is a locally manufactured amoxicillin-clavulanate antibiotic for respiratory, urinary, and skin infections. Algerian brand.`,
    how_to_take: `Take with food to reduce stomach upset. Complete the full course.`,
    side_effects: [
      `Diarrhea`,
      `Nausea`,
      `Skin rash`
    ],
    warnings: [
      `Tell doctor about penicillin allergy`,
      `Complete the full course`
    ],
    interactions: [
      `Warfarin — increased bleeding risk`
    ],
    algeria_brands: [
      `Amoclan BID 500mg/125mg`,
      `Amoclan BID 875mg/125mg`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste I`,
      lab: `HIKMA PHARMACEUTICALS`,
      generic_official: `AMOXICILLINE / ACIDE CLAVULANIQUE`,
      notice_url: `https://pharmnet-dz.com//notice.ashx?id=896`,
      pharmnet_url: `https://pharmnet-dz.com/m-325-amoclan-bid-200mg-28-5mg-5ml-pdre-p--susp-buv-b-1fl-70ml`,
      dosage_variants: [
        {
          dosage: `200MG/28,5MG /5ML`,
          form: `PDRE. SUSP. BUV`,
          conditioning: `B/1FL/70ML`,
          ppa: null
        },
        {
          dosage: `400MG/57MG/5ML`,
          form: `PDRE. SUSP. BUV`,
          conditioning: `B/1FL. DE 35ML ET B/1FL. DE 70ML (DE SUSPENSION BUVABLE APRES RECONSTITUTION) AVEC PIPIETTE GRADUEE EN KG`,
          ppa: null
        },
        {
          dosage: `875MG/125MG`,
          form: `COMP. PELLI`,
          conditioning: `PILULIER/10`,
          ppa: null
        }
      ]
    }
  },
  {
    name: `CIPROFLOXACINE BEKER`,
    scientific_name: `Ciprofloxacin`,
    category: `Antibiotics`,
    emoji: `🦠`,
    description: `Ciprofloxacine Beker is a locally manufactured fluoroquinolone for urinary, respiratory, and gastrointestinal infections.`,
    how_to_take: `Take with plenty of water. Complete the full course.`,
    side_effects: [
      `Nausea`,
      `Diarrhea`,
      `Tendon pain`,
      `Photosensitivity`
    ],
    warnings: [
      `Stop if tendon pain`,
      `Avoid sun`,
      `Do not take with antacids or iron`
    ],
    interactions: [
      `Antacids — take 2 hours apart`,
      `Warfarin — increased bleeding risk`
    ],
    algeria_brands: [
      `Ciprofloxacine Beker 250mg`,
      `Ciprofloxacine Beker 500mg`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste I`,
      lab: `BEKER LABORATOIRES`,
      generic_official: `CIPROFLOXACINE CHLORHYDRATE (EXPRIME EN CIPROFLOXACINE)`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=380`,
      pharmnet_url: `https://pharmnet-dz.com/m-380-ciprofloxacine-beker-500mg-comp-pelli-sec-b-10`,
      dosage_variants: [
        {
          dosage: `500MG`,
          form: `COMP. PELLI`,
          conditioning: `B/10`,
          ppa: `800 DA`
        },
        {
          dosage: `750MG`,
          form: `COMP. PELLI`,
          conditioning: `B/10`,
          ppa: `1050.00 DA`
        }
      ]
    }
  },
  {
    name: `CEFTRIAXONE BEKER`,
    scientific_name: `Ceftriaxone`,
    category: `Antibiotics`,
    emoji: `🦠`,
    description: `Ceftriaxone Beker is a locally manufactured third-generation cephalosporin antibiotic for serious bacterial infections requiring injection.`,
    how_to_take: `Injected once daily by a healthcare professional.`,
    side_effects: [
      `Pain at injection site`,
      `Diarrhea`,
      `Skin rash`
    ],
    warnings: [
      `Tell doctor if allergic to penicillin`,
      `Do not mix with calcium solutions`
    ],
    interactions: [
      `Calcium-containing products — do not mix in same IV line`
    ],
    algeria_brands: [
      `Ceftriaxone Beker 1g injectable`,
      `Ceftriaxone Beker 2g injectable`
    ],
    pharmnet: null
  },
  {
    name: `RIFAMPICINE BEKER`,
    scientific_name: `Rifampicin`,
    category: `Antibiotics`,
    emoji: `🦠`,
    description: `Rifampicine Beker is a locally manufactured rifampicin essential in tuberculosis treatment regimens. Part of Algeria national TB program.`,
    how_to_take: `Take on empty stomach 30 minutes before a meal. Part of multi-drug TB regimen.`,
    side_effects: [
      `Orange discoloration of urine and sweat (harmless)`,
      `Nausea`,
      `Liver toxicity`
    ],
    warnings: [
      `Warn about orange body fluids`,
      `Regular liver function tests`,
      `Reduces many drug levels`
    ],
    interactions: [
      `Reduces levels of many drugs — oral contraceptives, warfarin, diabetes medications`
    ],
    algeria_brands: [
      `Rifampicine Beker 300mg`,
      `Rifampicine Beker 600mg`
    ],
    pharmnet: null
  },
  {
    name: `DOXYCYCLINE BEKER`,
    scientific_name: `Doxycycline`,
    category: `Antibiotics`,
    emoji: `🦠`,
    description: `Doxycycline Beker is a locally registered tetracycline for respiratory, skin, and sexually transmitted infections.`,
    how_to_take: `Take with food and plenty of water. Sit upright for 30 minutes after taking.`,
    side_effects: [
      `Nausea`,
      `Photosensitivity`,
      `Esophageal irritation`
    ],
    warnings: [
      `Not for children under 8 or pregnant women`,
      `Use sunscreen daily`
    ],
    interactions: [
      `Dairy and antacids reduce absorption — take 2-3 hours apart`
    ],
    algeria_brands: [
      `Doxycycline Beker 100mg`
    ],
    pharmnet: null
  },
  {
    name: `METRONIDAZOLE BEKER`,
    scientific_name: `Metronidazole`,
    category: `Antibiotics`,
    emoji: `🦠`,
    description: `Metronidazole Beker is a locally manufactured antibiotic and antiprotozoal for anaerobic bacterial infections, H. pylori, and protozoal infections.`,
    how_to_take: `Take with food. Complete the full course.`,
    side_effects: [
      `Metallic taste`,
      `Nausea`,
      `Headache`
    ],
    warnings: [
      `Absolutely avoid alcohol during treatment and 48 hours after — severe reaction`
    ],
    interactions: [
      `Alcohol — severe disulfiram-like reaction`,
      `Warfarin — greatly increased anticoagulant effect`
    ],
    algeria_brands: [
      `Metronidazole Beker 250mg`,
      `Metronidazole Beker 500mg`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste I`,
      lab: `BEKER LABORATOIRES`,
      generic_official: `METRONIDAZOLE`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=861`,
      pharmnet_url: `https://pharmnet-dz.com/m-861-metronidazole-beker-250mg-gles-b-30`,
      dosage_variants: [
        {
          dosage: `250MG`,
          form: `COMP. PELLI`,
          conditioning: `B/30`,
          ppa: `160.5 DA`
        },
        {
          dosage: `500MG`,
          form: `COMP. PELLI`,
          conditioning: `B/20`,
          ppa: `160.00 DA`
        }
      ]
    }
  },
  {
    name: `FOSFOCINE`,
    scientific_name: `Fosfomycin`,
    category: `Antibiotics`,
    emoji: `🦠`,
    description: `Fosfocine contains fosfomycin, a single-dose antibiotic for uncomplicated urinary tract infections in women. Very convenient — one sachet as a single dose.`,
    how_to_take: `Dissolve 1 sachet (3g) in water and take as a SINGLE dose on empty stomach.`,
    side_effects: [
      `Diarrhea`,
      `Nausea`,
      `Headache`
    ],
    warnings: [
      `Single dose only — do not repeat without medical advice`
    ],
    interactions: [
      `Metoclopramide reduces fosfomycin levels`
    ],
    algeria_brands: [
      `Fosfocine 3g sachet`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste I`,
      lab: `SANOFI SYNTHELABO`,
      generic_official: `FOSFOMYCINE`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=410`,
      pharmnet_url: `https://pharmnet-dz.com/m-410-fosfocine-1g-prep-inj-perf-b-1amp-`,
      dosage_variants: [
        {
          dosage: `1G`,
          form: `SOL. INJ`,
          conditioning: `B/1AMP`,
          ppa: null
        },
        {
          dosage: `4G`,
          form: `SOL. INJ`,
          conditioning: `B/1AMP`,
          ppa: null
        }
      ]
    }
  },

  // ─── VITAMINS ──────────────────────────────────────
  {
    name: `ADCAL`,
    scientific_name: `Calcium Carbonate`,
    category: `Vitamins`,
    emoji: `🦴`,
    description: `Adcal is a calcium supplement for osteoporosis prevention and treatment, and calcium deficiency. Commonly prescribed with vitamin D.`,
    how_to_take: `Chew or dissolve tablet. Take with meals for better absorption.`,
    side_effects: [
      `Constipation`,
      `Nausea`,
      `Bloating`
    ],
    warnings: [
      `Do not exceed prescribed dose`,
      `Space from other medications`
    ],
    interactions: [
      `Levothyrox — take 4 hours apart`,
      `Iron — take 2 hours apart`
    ],
    algeria_brands: [
      `Adcal 600mg`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `N/D`,
      lab: `JPM (JORDANIAN PHARMACEUTICAL MANIFACTURING)`,
      generic_official: `CALCIUM CARBONATE`,
      notice_url: `https://pharmnet-dz.com//notice.ashx?id=6078`,
      pharmnet_url: `https://pharmnet-dz.com/m-3389-adcal-500mg-comp-b-60`,
      dosage_variants: [
        {
          dosage: `500MG`,
          form: `COMP`,
          conditioning: `B/60`,
          ppa: null
        }
      ]
    }
  },
  {
    name: `APIROVIT`,
    scientific_name: `Vitamin B1 + B6`,
    category: `Vitamins`,
    emoji: `💊`,
    description: `Apirovit is an Algerian vitamin B complex combining thiamine and pyridoxine for peripheral neuropathy, particularly in diabetic patients.`,
    how_to_take: `Take once daily after meals.`,
    side_effects: [
      `Nausea at high doses`
    ],
    warnings: [
      `Do not exceed recommended dose`
    ],
    interactions: [
      `Levodopa — high-dose B6 reduces effectiveness without carbidopa`
    ],
    algeria_brands: [
      `Apirovit tablets`,
      `Apirovit injectable`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `N/D`,
      lab: `API`,
      generic_official: `THIAMINE CHLORHYDRATE / PYRIDOXINE CHLORHYDRATE`,
      notice_url: `https://pharmnet-dz.com//notice.ashx?id=6078`,
      pharmnet_url: `https://pharmnet-dz.com/m-3436-apirovit-250mg-250mg-comp-sec-b-20`,
      dosage_variants: [
        {
          dosage: `250MG/250MG`,
          form: `COMP`,
          conditioning: `B/20`,
          ppa: null
        }
      ]
    }
  },
  {
    name: `VITAMINE D3 B.O.N`,
    scientific_name: `Cholecalciferol`,
    category: `Vitamins`,
    emoji: `☀️`,
    description: `Vitamine D3 B.O.N is a high-dose vitamin D3 supplement registered in Algeria for correcting vitamin D deficiency, which is very common despite the sunny climate.`,
    how_to_take: `High-dose ampoules (100,000 IU): take monthly or quarterly as prescribed.`,
    side_effects: [
      `At correct doses: minimal`,
      `Overdose: hypercalcemia — nausea, thirst, confusion`
    ],
    warnings: [
      `Do not take high doses without confirmed deficiency`,
      `Monitor calcium with high-dose therapy`
    ],
    interactions: [
      `Thiazide diuretics — increase hypercalcemia risk`
    ],
    algeria_brands: [
      `Vitamine D3 B.O.N 100,000 IU ampoule`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste II`,
      lab: `SAIDAL GROUPE`,
      generic_official: `COLECALCIFEROL`,
      notice_url: `https://pharmnet-dz.com//notice.ashx?id=6078`,
      pharmnet_url: `https://pharmnet-dz.com/m-3422-vitamine-d3-b-o-n-200-000ui-ml-sol-inj-im-et-sol-buv-b-01-amp-de-1ml`,
      dosage_variants: [
        {
          dosage: `200 000UI/ML`,
          form: `SOL. INJ`,
          conditioning: `B/01 AMP. DE 1ML`,
          ppa: `124.00 DA`
        }
      ]
    }
  },
  {
    name: `ACTICAL`,
    scientific_name: `Calcium Pidolate`,
    category: `Vitamins`,
    emoji: `🦴`,
    description: `Actical provides calcium in the easily absorbed pidolate form for calcium deficiency and osteoporosis prevention.`,
    how_to_take: `Take 1-2 tablets daily with meals.`,
    side_effects: [
      `Constipation`,
      `Nausea`
    ],
    warnings: [
      `Monitor calcium levels with prolonged use`
    ],
    interactions: [
      `Levothyrox — take 4 hours apart`
    ],
    algeria_brands: [
      `Actical tablets`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `N/D`,
      lab: `SAIDAL GROUPE`,
      generic_official: `CALCIUM PIDOLATE`,
      notice_url: `https://pharmnet-dz.com//notice.ashx?id=6078`,
      pharmnet_url: `https://pharmnet-dz.com/m-3387-actical-0-1-sirop-fl-125ml`,
      dosage_variants: [
        {
          dosage: `0.1`,
          form: `SIROP`,
          conditioning: `FL./125ML`,
          ppa: null
        },
        {
          dosage: `135MG/10ML DE CALCIUM** (1G/10ML OU 10% DE PIDOLATE DE CALCIUM)`,
          form: `AMP. BUV`,
          conditioning: `B/20AMP. DE 10ML`,
          ppa: null
        }
      ]
    }
  },
  {
    name: `ASTENIA`,
    scientific_name: `Multivitamin + Minerals`,
    category: `Vitamins`,
    emoji: `💊`,
    description: `Astenia is an Algerian multivitamin and mineral supplement for fatigue, nutritional deficiencies, and periods of increased nutritional needs.`,
    how_to_take: `Take 1 tablet daily with a meal.`,
    side_effects: [
      `Nausea at high doses`
    ],
    warnings: [
      `Do not combine with other multivitamin supplements`
    ],
    interactions: [
      `May interfere with absorption of certain medications — take 2 hours apart`
    ],
    algeria_brands: [
      `Astenia tablets`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `N/D`,
      lab: `API`,
      generic_official: `VITAMINE A / VITAMINE D3 / VIATAMINE E / VITAMINE B1 /  VITAMINE B2/ VITAMINE B6 / NICOTINAMIDE /ACIDE FOLIQUE / ACIDE PANTHOTENIQUE / BIOTINE / VITAMINE B12 / VITAMINE C / BETA CAROTENE`,
      notice_url: `https://pharmnet-dz.com//notice.ashx?id=6078`,
      pharmnet_url: `https://pharmnet-dz.com/m-3464-astenia-0-4mg-0-005mg-10mg-1-4mg-1-6mg-2mg-18mg-0-2mg-6mg-0-150mg-0-001mg--60mg-2-4mg-comp-efferv-t-20`,
      dosage_variants: [
        {
          dosage: `0,4MG/0,005MG/10MG/1,4MG/1,6MG/2MG/18MG/0,2MG/6MG/0,150MG/0,001MG/  60MG/2,4MG`,
          form: `COMP. EFFERV`,
          conditioning: `T/20`,
          ppa: null
        }
      ]
    }
  },

  // ─── ALLERGY ──────────────────────────────────────
  {
    name: `AIRDITINE`,
    scientific_name: `Desloratadine`,
    category: `Allergy`,
    emoji: `🌿`,
    description: `Airditine is a locally manufactured desloratadine non-sedating antihistamine for chronic urticaria and allergic rhinitis. Algerian brand of the Aerius molecule.`,
    how_to_take: `Take 1 tablet (5mg) once daily with or without food.`,
    side_effects: [
      `Headache`,
      `Fatigue`,
      `Dry mouth`
    ],
    warnings: [
      `One of the most non-sedating antihistamines`
    ],
    interactions: [
      `Few clinically significant interactions`
    ],
    algeria_brands: [
      `Airditine 5mg`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste II`,
      lab: `EL KENDI`,
      generic_official: `DESLORATADINE`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=4030`,
      pharmnet_url: `https://pharmnet-dz.com/m-4030-airditine-0-5mg-ml-sirop-b-1fl-de-120ml--bouchon-doseur-gradue`,
      dosage_variants: [
        {
          dosage: `0,5MG/ML`,
          form: `SIROP`,
          conditioning: `B/1FL. DE 120ML + BOUCHON DOSEUR GRADUE`,
          ppa: `370.80 DA`
        },
        {
          dosage: `5MG`,
          form: `COMP. PELLI`,
          conditioning: `B/10`,
          ppa: null
        }
      ]
    }
  },
  {
    name: `ATARAX`,
    scientific_name: `Hydroxyzine`,
    category: `Allergy`,
    emoji: `🌿`,
    description: `Atarax is hydroxyzine, an older antihistamine for anxiety, allergic pruritus, and as premedication for sedation.`,
    how_to_take: `For allergy: 25mg 3-4 times daily. For anxiety: 25-100mg as prescribed.`,
    side_effects: [
      `Significant drowsiness`,
      `Dry mouth`,
      `Blurred vision`
    ],
    warnings: [
      `Do not drive — strongly sedating`,
      `Avoid alcohol`,
      `Use with caution in elderly`
    ],
    interactions: [
      `Alcohol — severe sedation`,
      `MAOIs — serious interactions`
    ],
    algeria_brands: [
      `Atarax 25mg tablets`,
      `Atarax syrup`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste I`,
      lab: `UCB PHARMA`,
      generic_official: `HYDROXYZINE`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=2610`,
      pharmnet_url: `https://pharmnet-dz.com/m-2610-atarax-100mg-comp-pelli-sec-b-30-`,
      dosage_variants: [
        {
          dosage: `100MG`,
          form: `COMP`,
          conditioning: `B/30`,
          ppa: null
        },
        {
          dosage: `25MG`,
          form: `COMP`,
          conditioning: `B/30`,
          ppa: `1204.00 DA`
        },
        {
          dosage: `2MG/ML`,
          form: `SOL. BUV`,
          conditioning: `FL/200ML`,
          ppa: `204.00 DA`
        },
        {
          dosage: `50MG/ML`,
          form: `SOL. INJ`,
          conditioning: `B/6AMP. DE 2ML`,
          ppa: null
        }
      ]
    }
  },
  {
    name: `BUDEK PLUS`,
    scientific_name: `Budesonide + Formoterol`,
    category: `Allergy`,
    emoji: `🌿`,
    description: `Budek Plus combines inhaled corticosteroid and long-acting bronchodilator for severe allergic asthma requiring combination therapy.`,
    how_to_take: `Use twice daily. Rinse mouth after each use. Do not use as rescue inhaler.`,
    side_effects: [
      `Oral thrush`,
      `Hoarse voice`,
      `Headache`
    ],
    warnings: [
      `Rinse mouth after use`,
      `Never as rescue inhaler`
    ],
    interactions: [
      `Beta-blockers reduce formoterol effectiveness`
    ],
    algeria_brands: [
      `Budek Plus 80/4.5mcg`,
      `Budek Plus 160/4.5mcg`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste I`,
      lab: `LABORATORIO DE PRODUCTOS ETICOS C.E.I.S.A`,
      generic_official: `BUDESONIDE / FORMOTEROL`,
      notice_url: `https://pharmnet-dz.com//notice.ashx?id=6011`,
      pharmnet_url: `https://pharmnet-dz.com/m-5915-budek-plus-400Âµg-12Âµg-dose-pdre-p-inhal-en-gelule-b-01-fl-60-gelules--inhalateur-oral`,
      dosage_variants: [
        {
          dosage: `400ÂµG/12ÂµG/DOSE`,
          form: `PDRE. INHAL`,
          conditioning: `B/01 FL./60 GELULES + INHALATEUR ORAL`,
          ppa: null
        }
      ]
    }
  },

  // ─── THYROID ──────────────────────────────────────
  {
    name: `BERLTHYROX`,
    scientific_name: `Levothyroxine`,
    category: `Thyroid`,
    emoji: `🦋`,
    description: `Berlthyrox is a levothyroxine brand registered in Algeria as an alternative to Levothyrox for hypothyroidism. Patients should remain consistent with one brand.`,
    how_to_take: `Take on empty stomach 30-60 minutes before breakfast at the same time daily.`,
    side_effects: [
      `At correct dose: none expected`,
      `If overdosed: palpitations, weight loss, insomnia`
    ],
    warnings: [
      `Never change brand without informing doctor`,
      `Take 4 hours apart from calcium, iron, antacids`
    ],
    interactions: [
      `Calcium, iron, antacids all reduce absorption`
    ],
    algeria_brands: [
      `Berlthyrox 50mcg`,
      `Berlthyrox 75mcg`,
      `Berlthyrox 100mcg`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste II`,
      lab: `BERLIN CHEMIE AG`,
      generic_official: `LEVOTHYROXINE  SODIQUE`,
      notice_url: `https://pharmnet-dz.com//notice.ashx?id=668`,
      pharmnet_url: `https://pharmnet-dz.com/m-4464-berlthyrox-50Âµg-comp-sec-b-50-et-b-100`,
      dosage_variants: [
        {
          dosage: `50ÂµG`,
          form: `COMP. SEC`,
          conditioning: `B/50 ET B/100`,
          ppa: null
        }
      ]
    }
  },
  {
    name: `CARBIMAZOLE GS`,
    scientific_name: `Carbimazole`,
    category: `Thyroid`,
    emoji: `🦋`,
    description: `Carbimazole GS is a locally registered carbimazole for hyperthyroidism. Reduces thyroid hormone production. Same active metabolite as Néomercazole.`,
    how_to_take: `Take at regular intervals throughout the day with food. Doses gradually reduced as levels normalize.`,
    side_effects: [
      `Nausea`,
      `Skin rash`,
      `Joint pain`,
      `Rarely: dangerous drop in white blood cells`
    ],
    warnings: [
      `Seek urgent care for fever or sore throat immediately`,
      `Regular blood counts required`
    ],
    interactions: [
      `Warfarin — increased anticoagulant effect`
    ],
    algeria_brands: [
      `Carbimazole GS 5mg`,
      `Carbimazole GS 10mg`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `N/D`,
      lab: `GROUPE SANTE`,
      generic_official: `CARBIMAZOLE`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=618`,
      pharmnet_url: `https://pharmnet-dz.com/m-618-carbimazole-gs-5mg-comp-sec-b-50`,
      dosage_variants: [
        {
          dosage: `5MG`,
          form: `COMP. SEC`,
          conditioning: `B/50`,
          ppa: null
        }
      ]
    }
  },

  // ─── RHEUMATOLOGY ──────────────────────────────────────
  {
    name: `ARAVA`,
    scientific_name: `Leflunomide`,
    category: `Rheumatology`,
    emoji: `💊`,
    description: `Arava is a DMARD for active rheumatoid arthritis and psoriatic arthritis when methotrexate is not suitable.`,
    how_to_take: `Take once daily (20mg) with or without food.`,
    side_effects: [
      `Diarrhea`,
      `Nausea`,
      `Liver enzyme elevation`,
      `Hair thinning`
    ],
    warnings: [
      `Regular liver function monitoring mandatory`,
      `Effective contraception required — teratogenic`
    ],
    interactions: [
      `Methotrexate — increased liver toxicity (avoid)`,
      `Warfarin — increased anticoagulant effect`
    ],
    algeria_brands: [
      `Arava 10mg`,
      `Arava 20mg`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste I`,
      lab: `SANOFI AVENTIS`,
      generic_official: `LEFLUNOMIDE`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=1419`,
      pharmnet_url: `https://pharmnet-dz.com/m-1419-arava-100mg-comp-pelli-b-3`,
      dosage_variants: [
        {
          dosage: `100MG`,
          form: `COMP. PELLI`,
          conditioning: `B/3`,
          ppa: `3,702.26 DA`
        },
        {
          dosage: `10MG`,
          form: `COMP. PELLI`,
          conditioning: `B/30`,
          ppa: `3,990.00 DA`
        },
        {
          dosage: `20MG`,
          form: `COMP. PELLI`,
          conditioning: `B/30`,
          ppa: `5,895.00 DA`
        }
      ]
    }
  },
  {
    name: `HUMIRA`,
    scientific_name: `Adalimumab`,
    category: `Rheumatology`,
    emoji: `💉`,
    description: `Humira is the original adalimumab anti-TNF biologic for moderate-to-severe rheumatoid arthritis and other inflammatory conditions registered in Algeria.`,
    how_to_take: `Inject subcutaneously every 2 weeks into abdomen or thigh.`,
    side_effects: [
      `Injection site reactions`,
      `Increased infection risk including TB reactivation`
    ],
    warnings: [
      `Screen for TB before starting`,
      `Report any infection signs promptly`
    ],
    interactions: [
      `Anakinra — serious infection risk (contraindicated)`
    ],
    algeria_brands: [
      `Humira 40mg/0.8mL pre-filled pen`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste I`,
      lab: `ABBOTT`,
      generic_official: `ADALIMUMAB`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=1450`,
      pharmnet_url: `https://pharmnet-dz.com/m-1450-humira-40mg-0-8ml-sol-inj-sc-en-sering-prerempl-b-02-sering-unidoses-prerempl-de-0-8ml-02tampons-d-alcool`,
      dosage_variants: [
        {
          dosage: `40MG/0,8ML`,
          form: `SOL. INJ`,
          conditioning: `B/02 SERING. UNIDOSES PREREMPL. DE 0,8ML+ 02TAMPONS D'ALCOOL`,
          ppa: null
        }
      ]
    }
  },
  {
    name: `IMUREL`,
    scientific_name: `Azathioprine`,
    category: `Rheumatology`,
    emoji: `💊`,
    description: `Imurel contains azathioprine, an immunosuppressant for rheumatoid arthritis, lupus, and inflammatory bowel disease.`,
    how_to_take: `Take once daily with food. Regular blood monitoring essential.`,
    side_effects: [
      `Bone marrow suppression`,
      `Nausea`,
      `Liver toxicity`,
      `Increased infection risk`
    ],
    warnings: [
      `Regular blood counts mandatory`,
      `Avoid live vaccines`
    ],
    interactions: [
      `Allopurinol — serious toxicity — reduce azathioprine to 25% of dose`
    ],
    algeria_brands: [
      `Imurel 25mg`,
      `Imurel 50mg`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste I`,
      lab: `ASPEN PHARMA TRADING LIMITED`,
      generic_official: `AZATHIOPRINE`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=1019`,
      pharmnet_url: `https://pharmnet-dz.com/m-1019-imurel-50mg-comp-pelli-b-100`,
      dosage_variants: [
        {
          dosage: `50MG`,
          form: `COMP. PELLI`,
          conditioning: `B/100`,
          ppa: null
        }
      ]
    }
  },
  {
    name: `ENBREL`,
    scientific_name: `Etanercept`,
    category: `Rheumatology`,
    emoji: `💉`,
    description: `Enbrel is an etanercept anti-TNF biologic for rheumatoid arthritis, ankylosing spondylitis, and psoriasis.`,
    how_to_take: `Inject subcutaneously once or twice weekly.`,
    side_effects: [
      `Injection site reactions`,
      `Increased infection risk`
    ],
    warnings: [
      `Screen for TB before starting`,
      `Do not use with live vaccines`
    ],
    interactions: [
      `Anakinra — avoid combination`
    ],
    algeria_brands: [
      `Enbrel 25mg injectable`,
      `Enbrel 50mg injectable`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste I`,
      lab: `PFIZER`,
      generic_official: `ETANERCEPT`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=4433`,
      pharmnet_url: `https://pharmnet-dz.com/m-4433-enbrel-25mg-sering-sol-inj-sc-en-sering-prerempl-coffret-04-sering-prerempl-de-1ml--04-tampons-alcoolises`,
      dosage_variants: [
        {
          dosage: `25MG/SERING`,
          form: `SOL. INJ`,
          conditioning: `COFFRET 04 SERING. PREREMPL. DE 1ML + 04 TAMPONS ALCOOLISES`,
          ppa: null
        },
        {
          dosage: `50MG/SERING.`,
          form: `SOL. INJ`,
          conditioning: `COFFRET 04 SERING. PREREMPL. DE 1ML + 04 TAMPONS ALCOOLISES`,
          ppa: null
        }
      ]
    }
  },

  // ─── GYNECOLOGY ──────────────────────────────────────
  {
    name: `DIANE 35`,
    scientific_name: `Cyproterone + Ethinylestradiol`,
    category: `Gynecology`,
    emoji: `🩺`,
    description: `Diane 35 is registered in Algeria for acne in women, hirsutism, and PCOS. Also acts as a contraceptive.`,
    how_to_take: `Take once daily for 21 days then 7 day break. Start on day 1 of period.`,
    side_effects: [
      `Nausea`,
      `Breast tenderness`,
      `Headache`,
      `Increased clotting risk`
    ],
    warnings: [
      `Increased blood clot risk`,
      `Not for smoking women over 35`
    ],
    interactions: [
      `Rifampicin and anticonvulsants — reduce effectiveness`
    ],
    algeria_brands: [
      `Diane 35 tablets`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste I`,
      lab: `SCHERING SA`,
      generic_official: `CYPROTERONE /  ETHINYLESTRADIOL`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=3825`,
      pharmnet_url: `https://pharmnet-dz.com/m-3825-diane-35-2mg-35Âµg-comp-enro-b-21-`,
      dosage_variants: [
        {
          dosage: `2MG /35ÂµG`,
          form: `COMP. PELLI`,
          conditioning: `B/21`,
          ppa: null
        }
      ]
    }
  },
  {
    name: `CERAZETTE`,
    scientific_name: `Desogestrel`,
    category: `Gynecology`,
    emoji: `🩺`,
    description: `Cerazette is a progestogen-only contraceptive pill for women who cannot use estrogen-containing contraceptives including breastfeeding women.`,
    how_to_take: `Take one tablet daily at the same time each day without a break between packs.`,
    side_effects: [
      `Irregular menstrual bleeding`,
      `Headache`,
      `Mood changes`
    ],
    warnings: [
      `Take at the same time daily — 12-hour window`
    ],
    interactions: [
      `Rifampicin and anticonvulsants — reduce effectiveness`
    ],
    algeria_brands: [
      `Cerazette 75mcg tablets`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste I`,
      lab: `ORGANON`,
      generic_official: `DESOGESTREL`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=3056`,
      pharmnet_url: `https://pharmnet-dz.com/m-3056-cerazette-0-075mg-comp-b-28`,
      dosage_variants: [
        {
          dosage: `0,075MG`,
          form: `COMP`,
          conditioning: `B/28`,
          ppa: null
        }
      ]
    }
  },
  {
    name: `FEMARA`,
    scientific_name: `Letrozole`,
    category: `Gynecology`,
    emoji: `🩺`,
    description: `Femara contains letrozole used in Algeria for breast cancer treatment in postmenopausal women and for ovulation induction in infertility treatment.`,
    how_to_take: `For breast cancer: 2.5mg once daily. For infertility: as prescribed by specialist.`,
    side_effects: [
      `Hot flushes`,
      `Joint and muscle pain`,
      `Fatigue`,
      `Bone loss with long-term use`
    ],
    warnings: [
      `Bone density monitoring needed with long-term use`,
      `Multiple pregnancy risk for fertility use`
    ],
    interactions: [
      `Tamoxifen — avoid combination for breast cancer treatment`
    ],
    algeria_brands: [
      `Femara 2.5mg`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste I`,
      lab: `NOVARTIS`,
      generic_official: `LETROZOLE`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=597`,
      pharmnet_url: `https://pharmnet-dz.com/m-597-femara-2-5mg-comp-pelli-b-30`,
      dosage_variants: [
        {
          dosage: `2,5MG`,
          form: `COMP. PELLI`,
          conditioning: `B/30`,
          ppa: null
        }
      ]
    }
  },
  {
    name: `CLIMASTON`,
    scientific_name: `Estradiol + Dydrogesterone`,
    category: `Gynecology`,
    emoji: `🩺`,
    description: `Climaston is a combined hormone replacement therapy for menopausal symptoms in women with a uterus.`,
    how_to_take: `Take once daily continuously following prescribed schedule.`,
    side_effects: [
      `Breast tenderness`,
      `Nausea`,
      `Headache`,
      `Irregular bleeding initially`
    ],
    warnings: [
      `Annual gynecological review essential`,
      `Increased breast cancer risk with prolonged combined HRT`
    ],
    interactions: [
      `Rifampicin reduces effectiveness`
    ],
    algeria_brands: [
      `Climaston 1mg/5mg`,
      `Climaston 2mg/10mg`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste II`,
      lab: `SOLVAY PHARMA`,
      generic_official: `ESTRADIOL /DYDROGESTERONE`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=3030`,
      pharmnet_url: `https://pharmnet-dz.com/m-3030-climaston-1mg-10mg-comp-pelli-b-28`,
      dosage_variants: [
        {
          dosage: `1MG/10MG`,
          form: `COMP. PELLI`,
          conditioning: `B/28`,
          ppa: `663.88  DA`
        },
        {
          dosage: `1MG/5MG`,
          form: `COMP. PELLI`,
          conditioning: `B/28`,
          ppa: null
        },
        {
          dosage: `2MG/10MG`,
          form: `COMP. PELLI`,
          conditioning: `B/28`,
          ppa: null
        }
      ]
    }
  },

  // ─── UROLOGY ──────────────────────────────────────
  {
    name: `FRAXAL`,
    scientific_name: `Alfuzosin`,
    category: `Urology`,
    emoji: `🫀`,
    description: `Fraxal is a locally registered alfuzosin alpha-blocker for benign prostatic hyperplasia symptoms. Manufactured in Algeria.`,
    how_to_take: `Take 1 tablet (10mg) once daily immediately after the same meal each day.`,
    side_effects: [
      `Dizziness on standing`,
      `Headache`,
      `Fatigue`
    ],
    warnings: [
      `Rise slowly to avoid dizziness`,
      `Tell ophthalmologist before eye surgery`
    ],
    interactions: [
      `Ketoconazole and ritonavir — avoid combination`
    ],
    algeria_brands: [
      `Fraxal 10mg`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste I`,
      lab: `FRATER RAZES`,
      generic_official: `ALFUZOSINE CHLORHYDRATE`,
      notice_url: null,
      pharmnet_url: `https://pharmnet-dz.com/m-6106-fraxal-10mg-comp-pell-lp-b-30`,
      dosage_variants: [
        {
          dosage: `10 MG`,
          form: `COMP. PELLI. LP`,
          conditioning: `B/30`,
          ppa: null
        },
        {
          dosage: `5MG`,
          form: `COMP. PELLI. LP`,
          conditioning: `B/60`,
          ppa: null
        }
      ]
    }
  },
  {
    name: `DITROPAN`,
    scientific_name: `Oxybutynin`,
    category: `Urology`,
    emoji: `🫀`,
    description: `Ditropan contains oxybutynin for overactive bladder, urinary incontinence, and frequent urination.`,
    how_to_take: `Take 2-3 times daily with or without food.`,
    side_effects: [
      `Dry mouth (very common)`,
      `Constipation`,
      `Blurred vision`
    ],
    warnings: [
      `Avoid in glaucoma`,
      `Use with caution in elderly — cognitive effects`
    ],
    interactions: [
      `Anticholinergic drugs — additive effects`
    ],
    algeria_brands: [
      `Ditropan 5mg`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste II`,
      lab: `SANOFI SYNTHELABO`,
      generic_official: `OXYBUTYNINE CHLORHYDRATE`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=1185`,
      pharmnet_url: `https://pharmnet-dz.com/m-1185-ditropan-5mg-comp-sec-b-60`,
      dosage_variants: [
        {
          dosage: `5MG`,
          form: `COMP SEC`,
          conditioning: `B/60`,
          ppa: null
        }
      ]
    }
  },
  {
    name: `GENTIX`,
    scientific_name: `Tadalafil`,
    category: `Urology`,
    emoji: `🫀`,
    description: `Gentix contains tadalafil for erectile dysfunction and benign prostatic hyperplasia symptoms. Registered in Algeria.`,
    how_to_take: `For ED: 10-20mg before sexual activity or 5mg daily. For BPH: 5mg once daily.`,
    side_effects: [
      `Headache`,
      `Flushing`,
      `Dyspepsia`,
      `Back pain`
    ],
    warnings: [
      `Absolutely contraindicated with nitrates — fatal hypotension`
    ],
    interactions: [
      `Nitrates — ABSOLUTELY contraindicated`,
      `Alpha-blockers — hypotension risk`
    ],
    algeria_brands: [
      `Gentix 5mg`,
      `Gentix 10mg`,
      `Gentix 20mg`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste I`,
      lab: `SAIDAL GROUPE`,
      generic_official: `TADALAFIL`,
      notice_url: null,
      pharmnet_url: `https://pharmnet-dz.com/m-1229-gentix-20mg-comp-pelli-b-02--b-08`,
      dosage_variants: [
        {
          dosage: `20MG`,
          form: `COMP. PELLI`,
          conditioning: `B/02 - B/08`,
          ppa: `490.00 DA`
        }
      ]
    }
  },

  // ─── ENDOCRINE ──────────────────────────────────────
  {
    name: `CIBACALCINE`,
    scientific_name: `Calcitonin`,
    category: `Endocrine`,
    emoji: `💊`,
    description: `Cibacalcine is a synthetic calcitonin for osteoporosis and Paget disease of bone. Reduces bone resorption.`,
    how_to_take: `Administered by injection or nasal spray as prescribed.`,
    side_effects: [
      `Nausea`,
      `Flushing`,
      `Rhinitis with nasal spray`
    ],
    warnings: [
      `Monitor calcium levels`
    ],
    interactions: [
      `Lithium — calcitonin may reduce levels`
    ],
    algeria_brands: [
      `Cibacalcine injectable`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste II`,
      lab: `NOVARTIS`,
      generic_official: `CALCITONINE HUMAINE DE SYNTHESE`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=1407`,
      pharmnet_url: `https://pharmnet-dz.com/m-1407-cibacalcine-0-5mg-pdre-sol-inj-b-5-5`,
      dosage_variants: [
        {
          dosage: `0,5MG`,
          form: `PDRE. SOL. INJ`,
          conditioning: `B/5+5`,
          ppa: null
        }
      ]
    }
  },
  {
    name: `BRONOVA`,
    scientific_name: `Bromocriptine`,
    category: `Endocrine`,
    emoji: `💊`,
    description: `Bronova contains bromocriptine, a dopamine agonist for hyperprolactinemia, Parkinson disease, and acromegaly.`,
    how_to_take: `Take with meals starting at low dose and increasing gradually.`,
    side_effects: [
      `Nausea`,
      `Dizziness`,
      `Postural hypotension`
    ],
    warnings: [
      `First dose may cause sudden blood pressure drop`
    ],
    interactions: [
      `Antihypertensives — additive hypotension`
    ],
    algeria_brands: [
      `Bronova 2.5mg`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste I`,
      lab: `NOVA ARGENTIA SPA`,
      generic_official: `BROMOCRIPTINE`,
      notice_url: `https://pharmnet-dz.com//notice.ashx?id=6066`,
      pharmnet_url: `https://pharmnet-dz.com/m-2476-bronova-10mg-gles-b-30`,
      dosage_variants: [
        {
          dosage: `10MG`,
          form: `GLES`,
          conditioning: `B/30`,
          ppa: null
        }
      ]
    }
  },
  {
    name: `DEPRISOLE`,
    scientific_name: `Prednisolone`,
    category: `Endocrine`,
    emoji: `💊`,
    description: `Deprisole is a locally registered prednisolone for inflammatory, autoimmune, and allergic conditions requiring systemic corticosteroid treatment.`,
    how_to_take: `Take in the morning with food. Do not stop suddenly after prolonged use.`,
    side_effects: [
      `Weight gain`,
      `Elevated blood sugar`,
      `Mood changes`
    ],
    warnings: [
      `Never stop abruptly`,
      `Monitor blood sugar in diabetics`
    ],
    interactions: [
      `NSAIDs — stomach ulcer risk`
    ],
    algeria_brands: [
      `Deprisole 5mg`,
      `Deprisole 20mg`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste I`,
      lab: `BIO-GALENIC`,
      generic_official: `PREDNISOLONE`,
      notice_url: `https://pharmnet-dz.com//notice.ashx?id=668`,
      pharmnet_url: `https://pharmnet-dz.com/m-3772-deprisole-20mg-comp-orodispersible-b-20`,
      dosage_variants: [
        {
          dosage: `20MG`,
          form: `COMP. ORODISPERS`,
          conditioning: `B/20`,
          ppa: null
        },
        {
          dosage: `5MG`,
          form: `COMP. ORODISPERS`,
          conditioning: `B/30`,
          ppa: null
        }
      ]
    }
  },

  // ─── INFECTIOUS DISEASE ──────────────────────────────────────
  {
    name: `BENDAZOLE`,
    scientific_name: `Mebendazole`,
    category: `Infectious Disease`,
    emoji: `🦠`,
    description: `Bendazole contains mebendazole for intestinal worm infections including roundworms, threadworms, and hookworms.`,
    how_to_take: `For pinworms: single 100mg dose repeated after 2-3 weeks. For other worms: 100mg twice daily for 3 days.`,
    side_effects: [
      `Stomach pain`,
      `Diarrhea`,
      `Nausea`
    ],
    warnings: [
      `Repeat treatment for all household members for pinworm`
    ],
    interactions: [
      `Metronidazole — rarely, neurological effects when combined`
    ],
    algeria_brands: [
      `Bendazole 100mg tablets`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste II`,
      lab: `JPM (JORDANIAN PHARMACEUTICAL MANIFACTURING)`,
      generic_official: `MEBENDAZOLE`,
      notice_url: `https://pharmnet-dz.com//notice.ashx?id=2056`,
      pharmnet_url: `https://pharmnet-dz.com/m-2041-bendazole-100mg-comp-b-6`,
      dosage_variants: [
        {
          dosage: `100MG`,
          form: `COMP. A CROQ`,
          conditioning: `B/6`,
          ppa: null
        }
      ]
    }
  },
  {
    name: `DIFLUCARE`,
    scientific_name: `Fluconazole`,
    category: `Infectious Disease`,
    emoji: `🍄`,
    description: `Diflucare contains fluconazole for systemic and mucosal fungal infections including oral thrush and vaginal candidiasis.`,
    how_to_take: `Dosage depends on infection. Single 150mg dose for vaginal candidiasis.`,
    side_effects: [
      `Nausea`,
      `Headache`,
      `Stomach pain`
    ],
    warnings: [
      `Liver function monitoring with prolonged use`
    ],
    interactions: [
      `Warfarin — greatly increased anticoagulant effect`,
      `Many interactions through CYP2C9 inhibition`
    ],
    algeria_brands: [
      `Diflucare 50mg`,
      `Diflucare 150mg`,
      `Diflucare 200mg`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste I`,
      lab: `BIOCARE LABORATOIRES`,
      generic_official: `FLUCONAZOLE`,
      notice_url: `https://pharmnet-dz.com//notice.ashx?id=896`,
      pharmnet_url: `https://pharmnet-dz.com/m-5849-diflucare-50mg-gles-b-03`,
      dosage_variants: [
        {
          dosage: `50MG`,
          form: `GLES`,
          conditioning: `B/03`,
          ppa: null
        }
      ]
    }
  },
  {
    name: `CHLOROQUINE`,
    scientific_name: `Chloroquine`,
    category: `Infectious Disease`,
    emoji: `🦠`,
    description: `Chloroquine is registered in Algeria for malaria prevention and treatment, and for autoimmune conditions.`,
    how_to_take: `For malaria prevention: take once weekly starting 1 week before travel.`,
    side_effects: [
      `Nausea`,
      `Headache`,
      `Visual disturbances`,
      `Retinal damage with long-term use`
    ],
    warnings: [
      `Annual eye exam mandatory for long-term use`
    ],
    interactions: [
      `QT-prolonging drugs — cardiac risk`
    ],
    algeria_brands: [
      `Chloroquine 100mg`,
      `Chloroquine 250mg`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste II`,
      lab: `PIERRE FABRE`,
      generic_official: `CHLOROQUINE`,
      notice_url: `https://pharmnet-dz.com//notice.ashx?id=2056`,
      pharmnet_url: `https://pharmnet-dz.com/m-2053-chloroquine-100mg-comp-b-30`,
      dosage_variants: [
        {
          dosage: `100MG`,
          form: `COMP`,
          conditioning: `B/30`,
          ppa: null
        }
      ]
    }
  },

  // ─── OPHTHALMOLOGY ──────────────────────────────────────
  {
    name: `BETOPTIC`,
    scientific_name: `Betaxolol`,
    category: `Ophthalmology`,
    emoji: `👁️`,
    description: `Betoptic eye drops contain betaxolol, a cardioselective beta-blocker for glaucoma. Safer than timolol for patients with respiratory disease.`,
    how_to_take: `Instill 1 drop twice daily. Press on inner corner of eye for 1 minute after instilling.`,
    side_effects: [
      `Stinging on instillation`,
      `Blurred vision temporarily`
    ],
    warnings: [
      `Safer than timolol in respiratory disease but still has some systemic effects`
    ],
    interactions: [
      `Oral beta-blockers — additive systemic effects`
    ],
    algeria_brands: [
      `Betoptic 0.5% eye drops`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste I`,
      lab: `ALCON`,
      generic_official: `BETAXOLOL CHLORHYDRATE`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=2349`,
      pharmnet_url: `https://pharmnet-dz.com/m-2349-betoptic-0-005-colly-fl-3ml`,
      dosage_variants: [
        {
          dosage: `0.005`,
          form: `COLLY. SOL`,
          conditioning: `FL/3ML`,
          ppa: `198.35 DA`
        }
      ]
    }
  },
  {
    name: `AZOPT`,
    scientific_name: `Brinzolamide`,
    category: `Ophthalmology`,
    emoji: `👁️`,
    description: `Azopt eye drops contain brinzolamide, a carbonic anhydrase inhibitor for glaucoma.`,
    how_to_take: `Instill 1 drop 2-3 times daily. Shake well before use.`,
    side_effects: [
      `Blurred vision temporarily`,
      `Bitter taste`,
      `Eye discomfort`
    ],
    warnings: [
      `Remove contact lenses before instilling`
    ],
    interactions: [
      `Oral carbonic anhydrase inhibitors — avoid combination`
    ],
    algeria_brands: [
      `Azopt 1% eye drops`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste I`,
      lab: `ALCON`,
      generic_official: `BRINZOLAMIDE`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=2365`,
      pharmnet_url: `https://pharmnet-dz.com/m-2365-azopt-10mg-ml-colly-en-susp-fl-5ml`,
      dosage_variants: [
        {
          dosage: `10MG/ML`,
          form: `COLLY. SOL`,
          conditioning: `FL./5ML`,
          ppa: `987.43 DA`
        }
      ]
    }
  },
  {
    name: `CARTEOL`,
    scientific_name: `Carteolol`,
    category: `Ophthalmology`,
    emoji: `👁️`,
    description: `Carteol eye drops contain carteolol, a non-selective beta-blocker for glaucoma.`,
    how_to_take: `Instill 1 drop twice daily. Press on inner corner after instilling.`,
    side_effects: [
      `Stinging`,
      `Blurred vision`,
      `Systemic beta-blocker effects`
    ],
    warnings: [
      `Tell doctor if asthma or heart disease`
    ],
    interactions: [
      `Oral beta-blockers — additive effects`
    ],
    algeria_brands: [
      `Carteol 1% eye drops`,
      `Carteol 2% eye drops`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste I`,
      lab: `CHAUVIN`,
      generic_official: `CARTEOLOL`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=2350`,
      pharmnet_url: `https://pharmnet-dz.com/m-2350-carteol-0-01-colly-fl-3ml`,
      dosage_variants: [
        {
          dosage: `0.01`,
          form: `COLLY. SOL`,
          conditioning: `FL/3ML`,
          ppa: `365.00 DA`
        },
        {
          dosage: `0.02`,
          form: `COLLY. SOL`,
          conditioning: `FL/3ML`,
          ppa: `494.00 DA`
        }
      ]
    }
  },
  {
    name: `ALZOR`,
    scientific_name: `Dorzolamide`,
    category: `Ophthalmology`,
    emoji: `👁️`,
    description: `Alzor contains dorzolamide, a carbonic anhydrase inhibitor eye drop for glaucoma.`,
    how_to_take: `Instill 1 drop 3 times daily alone or twice daily when combined with a beta-blocker.`,
    side_effects: [
      `Burning or stinging`,
      `Bitter taste`,
      `Blurred vision`
    ],
    warnings: [
      `Remove contact lenses before instilling`
    ],
    interactions: [
      `Oral sulfonamides — avoid combination`
    ],
    algeria_brands: [
      `Alzor 2% eye drops`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste I`,
      lab: `UNIMED`,
      generic_official: `DORZOLAMIDE CHLORHYDRATE EXPRIME EN DORZOLAMIDE`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=2361`,
      pharmnet_url: `https://pharmnet-dz.com/m-2361-alzor-2--20mg-ml-colly-en-sol-fl-5ml`,
      dosage_variants: [
        {
          dosage: `2% (20MG/ML)`,
          form: `COLLY. SOL`,
          conditioning: `FL./5ML`,
          ppa: `631.05 DA`
        }
      ]
    }
  },

  // ─── ENT ──────────────────────────────────────
  {
    name: `BECLATE - NASAL`,
    scientific_name: `Beclometasone nasal spray`,
    category: `ENT`,
    emoji: `👃`,
    description: `Beclate Nasal is an intranasal beclometasone corticosteroid spray for allergic rhinitis and nasal polyps.`,
    how_to_take: `Spray 1-2 puffs into each nostril twice daily. Shake before use.`,
    side_effects: [
      `Nasal dryness`,
      `Nosebleeds`,
      `Headache`
    ],
    warnings: [
      `Do not spray directly onto septum`,
      `Regular use gives best results`
    ],
    interactions: [
      `Few clinically significant interactions`
    ],
    algeria_brands: [
      `Beclate Nasal spray`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste I`,
      lab: `CIPLA LIMITED`,
      generic_official: `BECLOMETASONE`,
      notice_url: `https://pharmnet-dz.com//notice.ashx?id=6011`,
      pharmnet_url: `https://pharmnet-dz.com/m-2112-beclate--nasal-50Âµg-bouffee-aero-nas-fl-120doses`,
      dosage_variants: [
        {
          dosage: `50ÂµG/BOUFFEE`,
          form: `AERO`,
          conditioning: `FL./120DOSES`,
          ppa: null
        }
      ]
    }
  },
  {
    name: `BI-OROGYL`,
    scientific_name: `Spiramycin + Metronidazole`,
    category: `ENT`,
    emoji: `🗣️`,
    description: `Bi-Orogyl combines spiramycin and metronidazole for dental and oral bacterial infections. Widely used in Algerian dental practice.`,
    how_to_take: `Take 3 times daily for 5-7 days with food.`,
    side_effects: [
      `Metallic taste`,
      `Nausea`,
      `Diarrhea`
    ],
    warnings: [
      `Absolutely avoid alcohol during treatment and 48 hours after`
    ],
    interactions: [
      `Alcohol — severe disulfiram-like reaction`,
      `Warfarin — increased anticoagulant effect`
    ],
    algeria_brands: [
      `Bi-Orogyl tablets`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste I`,
      lab: `BIOCARE LABORATOIRES`,
      generic_official: `SPIRAMYCINE / METRONIDAZOLE`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=844`,
      pharmnet_url: `https://pharmnet-dz.com/m-844-bi-orogyl-1-5mui-250mg-comp-pelli-b-10`,
      dosage_variants: [
        {
          dosage: `1,5MUI/250MG`,
          form: `COMP. PELLI`,
          conditioning: `B/10`,
          ppa: null
        }
      ]
    }
  },

  // ─── ONCOLOGY SUPPORT ──────────────────────────────────────
  {
    name: `ONDANSETRON BEKER`,
    scientific_name: `Ondansetron`,
    category: `Oncology Support`,
    emoji: `💊`,
    description: `Ondansetron Beker is a locally manufactured antiemetic for chemotherapy, radiotherapy, and surgery-related nausea.`,
    how_to_take: `Take 30 minutes before chemotherapy or radiotherapy.`,
    side_effects: [
      `Headache`,
      `Constipation`,
      `QT prolongation at higher doses`
    ],
    warnings: [
      `Monitor ECG if at risk`
    ],
    interactions: [
      `QT-prolonging drugs — cardiac risk`
    ],
    algeria_brands: [
      `Ondansetron Beker 4mg`,
      `Ondansetron Beker 8mg`
    ],
    pharmnet: null
  },
  {
    name: `DEXAL`,
    scientific_name: `Dexamethasone`,
    category: `Oncology Support`,
    emoji: `💊`,
    description: `Dexal is a dexamethasone corticosteroid used in oncology as antiemetic and for cerebral edema.`,
    how_to_take: `Dose determined by oncologist. For antiemesis taken morning of and 2-3 days after chemotherapy.`,
    side_effects: [
      `Insomnia`,
      `Elevated blood sugar`,
      `Mood changes`
    ],
    warnings: [
      `Monitor blood sugar`,
      `Do not stop abruptly`
    ],
    interactions: [
      `Rifampicin reduces effect`
    ],
    algeria_brands: [
      `Dexal 4mg`,
      `Dexal 8mg`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste I`,
      lab: `GROUPE SANTE`,
      generic_official: `DEXAMETHASONE`,
      notice_url: `https://pharmnet-dz.com//notice.ashx?id=668`,
      pharmnet_url: `https://pharmnet-dz.com/m-645-dexal-0-5mg-comp-b-30`,
      dosage_variants: [
        {
          dosage: `0,5MG`,
          form: `COMP`,
          conditioning: `B/30`,
          ppa: null
        }
      ]
    }
  },
  {
    name: `DEPO-MEDROL`,
    scientific_name: `Methylprednisolone depot`,
    category: `Oncology Support`,
    emoji: `💊`,
    description: `Depo-Medrol is a long-acting methylprednisolone depot injection used in oncology support and severe inflammatory conditions.`,
    how_to_take: `Administered by injection by a healthcare professional.`,
    side_effects: [
      `Elevated blood sugar`,
      `Fluid retention`,
      `Increased infection risk`
    ],
    warnings: [
      `Monitor blood sugar`,
      `Avoid live vaccines`
    ],
    interactions: [
      `NSAIDs — stomach ulcer risk`
    ],
    algeria_brands: [
      `Depo-Medrol 40mg/mL injectable`,
      `Depo-Medrol 80mg/2mL injectable`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste I`,
      lab: `PHARMACIA UPJOHN`,
      generic_official: `METHYLPREDNISOLONE ACETATE`,
      notice_url: `https://pharmnet-dz.com//notice.ashx?id=668`,
      pharmnet_url: `https://pharmnet-dz.com/m-3754-depo-medrol-40mg-ml-susp-inj-b-1sering-prerempl-de-2ml`,
      dosage_variants: [
        {
          dosage: `40MG/ML`,
          form: `SUSP. INJ`,
          conditioning: `B/1SERING. PREREMPL. DE 2ML`,
          ppa: null
        }
      ]
    }
  },

  // ─── DERMATOLOGY ──────────────────────────────────────
  {
    name: `ADAPALENE NOVAGENERICS`,
    scientific_name: `Adapalene`,
    category: `Dermatology`,
    emoji: `🧴`,
    description: `Adapalene Novagenerics is a topical retinoid for acne registered and manufactured in Algeria. More stable and less irritating than tretinoin.`,
    how_to_take: `Apply a thin layer to affected areas once daily at bedtime.`,
    side_effects: [
      `Skin dryness`,
      `Peeling`,
      `Redness`,
      `Increased sun sensitivity`
    ],
    warnings: [
      `Use sunscreen daily`,
      `Avoid eye area`,
      `Start slowly`
    ],
    interactions: [
      `Other acne treatments may increase irritation`
    ],
    algeria_brands: [
      `Adapalene Novagenerics 0.1% gel`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste I`,
      lab: `NOVAPHARM TRADING`,
      generic_official: `ADAPALENE`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=1660`,
      pharmnet_url: `https://pharmnet-dz.com/m-1660-adapalene-novagenerics-0-001-gel-p-appli-locale-t-30g`,
      dosage_variants: [
        {
          dosage: `0.001`,
          form: `SOL. APP. LOCALE`,
          conditioning: `T/30G`,
          ppa: null
        }
      ]
    }
  },
  {
    name: `AKNETT`,
    scientific_name: `Isotretinoin`,
    category: `Dermatology`,
    emoji: `🧴`,
    description: `Aknett contains isotretinoin for severe or treatment-resistant acne. One of the most effective acne treatments but requires careful monitoring.`,
    how_to_take: `Take once or twice daily with fatty meal. Dose based on body weight.`,
    side_effects: [
      `Severe skin dryness`,
      `Dry lips`,
      `Elevated triglycerides`
    ],
    warnings: [
      `ABSOLUTELY contraindicated in pregnancy`,
      `Monthly pregnancy tests in females`,
      `Regular blood tests`
    ],
    interactions: [
      `Vitamin A supplements — avoid`,
      `Tetracyclines — increased intracranial pressure risk`
    ],
    algeria_brands: [
      `Aknett 10mg`,
      `Aknett 20mg`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste I`,
      lab: `BIOVITAL`,
      generic_official: `ISOTRETINOINE`,
      notice_url: null,
      pharmnet_url: `https://pharmnet-dz.com/m-529-aknett-10mg-caps-molles-b-30`,
      dosage_variants: [
        {
          dosage: `10MG`,
          form: `CAPS. MOLLE`,
          conditioning: `B/30`,
          ppa: null
        },
        {
          dosage: `20MG`,
          form: `CAPS. MOLLE`,
          conditioning: `B/30`,
          ppa: null
        }
      ]
    }
  },
  {
    name: `BETACYL`,
    scientific_name: `Betamethasone dipropionate`,
    category: `Dermatology`,
    emoji: `🧴`,
    description: `Betacyl contains betamethasone dipropionate, a potent topical corticosteroid for eczema, psoriasis, and inflammatory skin conditions. Locally manufactured.`,
    how_to_take: `Apply a thin layer to affected skin once or twice daily.`,
    side_effects: [
      `Skin thinning with prolonged use`,
      `Stretch marks`
    ],
    warnings: [
      `Do not use on face for extended periods`,
      `Not for prolonged use`
    ],
    interactions: [
      `Systemic effects possible with extensive use`
    ],
    algeria_brands: [
      `Betacyl 0.05% cream`,
      `Betacyl 0.05% ointment`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste I`,
      lab: `SAIDAL GROUPE`,
      generic_official: `BETAMETHASONE DIPROPIONATE EXPRIME EN BETAMETHASONE / ACIDE SALICYLIQUE`,
      notice_url: `https://pharmnet-dz.com/notice.ashx?id=501`,
      pharmnet_url: `https://pharmnet-dz.com/m-501-betacyl-0-05g-3g-pde-derm-t-15g`,
      dosage_variants: [
        {
          dosage: `0,05G%/3G%`,
          form: `PDE. DERM`,
          conditioning: `T/15G`,
          ppa: null
        }
      ]
    }
  },
  {
    name: `BETAMETHASONE NOVAGENERICS`,
    scientific_name: `Betamethasone`,
    category: `Dermatology`,
    emoji: `🧴`,
    description: `Betamethasone Novagenerics is a locally manufactured betamethasone corticosteroid cream for inflammatory skin conditions. Affordable Algerian alternative.`,
    how_to_take: `Apply thin layer to affected skin 1-2 times daily. Rub in gently.`,
    side_effects: [
      `Skin thinning with prolonged use`,
      `Local irritation`
    ],
    warnings: [
      `Not for prolonged use on face`,
      `Not for infected skin without antibiotic`
    ],
    interactions: [
      `Systemic effects with extensive use`
    ],
    algeria_brands: [
      `Betamethasone Novagenerics 0.05% cream`
    ],
    pharmnet: {
      refundable: true,
      prescription_list: `Liste I`,
      lab: `NOVAPHARM TRADING`,
      generic_official: `BETAMETHASONE`,
      notice_url: null,
      pharmnet_url: `https://pharmnet-dz.com/m-4364-betamethasone-novagenerics-0-0005-creme-t-15g`,
      dosage_variants: [
        {
          dosage: `0.05%`,
          form: `CRÃME`,
          conditioning: `T/15G`,
          ppa: null
        },
        {
          dosage: `0.0005`,
          form: `PDE. DERM`,
          conditioning: `T/15G`,
          ppa: null
        },
        {
          dosage: `0.001`,
          form: `PDE. DERM`,
          conditioning: `T/15G`,
          ppa: null
        }
      ]
    }
  },
  // ─── 70 NEW PHARMNET-VERIFIED MEDICATIONS ──────────────────────────────────
// Add these entries to your algerianMedications.js array

  {
    name: `Actrapid HM Penfill`,
    scientific_name: `Insulin Human (Rapid-acting)`,
    category: `Diabetes`,
    emoji: `💉`,
    description: `Actrapid HM Penfill is a rapid-acting human insulin in cartridge form for use with reusable insulin pens. Widely available in Algerian pharmacies for meal-time blood sugar control.`,
    how_to_take: `Insert cartridge into reusable pen. Inject subcutaneously 30 minutes before meals. Rotate injection sites between abdomen, thigh, and upper arm.`,
    side_effects: [
      `Hypoglycemia`,
      `Injection site reactions`,
      `Weight gain`,
      `Lipodystrophy at injection site`,
    ],
    warnings: [
      `Always carry fast-acting glucose`,
      `Rotate injection sites`,
      `Store opened cartridge at room temperature max 4 weeks`,
    ],
    interactions: [
      `Alcohol alters blood sugar unpredictably`,
      `Beta-blockers mask hypoglycemia symptoms`,
      `Steroids increase insulin requirements`,
    ],
    algeria_brands: [
      `Actrapid HM Penfill 100UI/mL 3mL cartridge`,
    ],
    pharmnet: {
        refundable: true,
        prescription_list: `Liste II`,
        lab: `NOVO NORDISK`,
        generic_official: `INSULINE HUMAINE RAPIDE`,
        notice_url: `https://pharmnet-dz.com/notice.ashx?id=3730`,
        pharmnet_url: `https://pharmnet-dz.com/m-3730-actrapid-hm-penfill-100ui-ml-sol-inj-b-5-cart-de-1-5-ml-et-b-5cart-de-3ml-`,
        dosage_variants: [
          {
            dosage: `100UI/ML`,
            form: `SOL. INJ`,
            conditioning: `B/5 CART. de 1,5 ML ET B/5CART  DE 3ML`,
            ppa: `2614.61 DA`
          }
        ]
      }
  },
  {
    name: `Amapiride`,
    scientific_name: `Glimepiride`,
    category: `Diabetes`,
    emoji: `💊`,
    description: `Amapiride is a locally registered glimepiride sulfonylurea manufactured by HUP Pharma Algeria. It stimulates the pancreas to produce more insulin to lower blood sugar in type 2 diabetes.`,
    how_to_take: `Take once daily with breakfast. Do not skip meals after taking this medication.`,
    side_effects: [
      `Low blood sugar (hypoglycemia)`,
      `Weight gain`,
      `Nausea`,
      `Dizziness`,
    ],
    warnings: [
      `Monitor blood sugar regularly`,
      `Do not skip meals`,
      `Avoid excessive alcohol`,
      `Use with caution in elderly`,
    ],
    interactions: [
      `Insulin increases hypoglycemia risk`,
      `Fluconazole increases glimepiride levels`,
      `Beta-blockers mask hypoglycemia signs`,
    ],
    algeria_brands: [
      `Amapiride 1mg`,
      `Amapiride 2mg`,
      `Amapiride 4mg`,
    ],
    pharmnet: {
        refundable: true,
        prescription_list: `Liste I`,
        lab: `HUP.P.PHARMA SARL`,
        generic_official: `GLIMEPIRIDE`,
        notice_url: `https://pharmnet-dz.com//notice.ashx?id=6078`,
        pharmnet_url: `https://pharmnet-dz.com/m-3639-amapiride-hup-1mg-comp-sec-b-30`,
        dosage_variants: [
          {
            dosage: `1MG`,
            form: `COMP. SEC`,
            conditioning: `B/30`,
            ppa: `250.00 DA`
          },
          {
            dosage: `2MG`,
            form: `COMP. SEC`,
            conditioning: `B/30`,
            ppa: `480.00 DA`
          },
          {
            dosage: `3MG`,
            form: `COMP. SEC`,
            conditioning: `B/30`,
            ppa: `720.00 DA`
          },
          {
            dosage: `4MG`,
            form: `COMP. SEC`,
            conditioning: `B/30`,
            ppa: `750.00 DA`
          }
        ]
      }
  },
  {
    name: `Apidra`,
    scientific_name: `Insulin Glulisine (Rapid-acting)`,
    category: `Diabetes`,
    emoji: `💉`,
    description: `Apidra is a rapid-acting insulin analogue that starts working within 10-15 minutes of injection. Slightly faster onset than Novorapid, offering flexibility to inject just before or right after meals.`,
    how_to_take: `Inject subcutaneously immediately before meals (within 15 minutes). Can inject up to 20 minutes after meal start. Use abdomen for fastest absorption.`,
    side_effects: [
      `Hypoglycemia`,
      `Injection site reactions`,
      `Weight gain`,
    ],
    warnings: [
      `Act quickly at mealtime — keep glucose tablets accessible`,
      `Use within 4 weeks of opening`,
      `Do not mix with other insulins except NPH`,
    ],
    interactions: [
      `Alcohol alters blood sugar`,
      `Beta-blockers mask hypoglycemia`,
    ],
    algeria_brands: [
      `Apidra 100U/mL vial`,
      `Apidra SoloStar pen`,
    ],
    pharmnet: {
        refundable: true,
        prescription_list: `Liste II`,
        lab: `SANOFI AVENTIS`,
        generic_official: `INSULINE GLARGINE`,
        notice_url: `https://pharmnet-dz.com/notice.ashx?id=3314`,
        pharmnet_url: `https://pharmnet-dz.com/m-3314-apidra-100ui-ml-sol-inj-en-cartouche-sc-b-03-cart--de-3ml-pour-opticlik-ou-pour-optipen-`,
        dosage_variants: [
          {
            dosage: `100UI/ML`,
            form: `SOL. INJ`,
            conditioning: `B/03 CART.  DE 3ML POUR (OPTICLIK OU POUR OPTIPEN)`,
            ppa: null
          },
          {
            dosage: `100UI/ML`,
            form: `SOL. INJ`,
            conditioning: `B/1FL.DE 10ML`,
            ppa: `3,314.44 DA`
          }
        ]
      }
  },
  {
    name: `Diaguanid`,
    scientific_name: `Metformin`,
    category: `Diabetes`,
    emoji: `💊`,
    description: `Diaguanid is an Algerian-manufactured metformin for type 2 diabetes, providing a locally produced affordable alternative to imported brands like Glucophage.`,
    how_to_take: `Take with meals to reduce stomach upset. Usually 2-3 times daily. Swallow whole with water.`,
    side_effects: [
      `Nausea`,
      `Diarrhea`,
      `Stomach pain`,
      `Metallic taste in mouth`,
    ],
    warnings: [
      `Do not use with severe kidney disease`,
      `Stop before surgery or contrast X-rays`,
      `Avoid excessive alcohol`,
    ],
    interactions: [
      `Alcohol increases lactic acidosis risk`,
      `Iodinated contrast — stop 48h before`,
    ],
    algeria_brands: [
      `Diaguanid 500mg`,
      `Diaguanid 850mg`,
      `Diaguanid 1000mg`,
    ],
    pharmnet: {
        refundable: null,
        prescription_list: `Liste I`,
        lab: `SAIDAL GROUPE`,
        generic_official: `METFORMINE CHLORHYDRATE`,
        notice_url: `https://pharmnet-dz.com//notice.ashx?id=6078`,
        pharmnet_url: `https://pharmnet-dz.com/m-3704-diaguanid-1000mg-comp-pelli-sec-b-30`,
        dosage_variants: [
          {
            dosage: `1000MG`,
            form: `COMP. PELLI`,
            conditioning: `B/30`,
            ppa: `165.00 DA`
          },
          {
            dosage: `850MG`,
            form: `COMP. PELLI`,
            conditioning: `B/30 ET B/120`,
            ppa: null
          }
        ]
      }
  },
  {
    name: `Alodipine`,
    scientific_name: `Amlodipine`,
    category: `Hypertension`,
    emoji: `❤️`,
    description: `Alodipine is an Algerian-manufactured amlodipine calcium channel blocker for hypertension and angina. Provides the same efficacy as imported brands at a more affordable price.`,
    how_to_take: `Take once daily at the same time each day with or without food.`,
    side_effects: [
      `Ankle swelling`,
      `Headache`,
      `Flushing`,
      `Fatigue`,
      `Palpitations`,
    ],
    warnings: [
      `Report severe ankle swelling`,
      `Avoid grapefruit juice`,
      `Do not stop suddenly for angina treatment`,
    ],
    interactions: [
      `Simvastatin — limit to 20mg`,
      `Cyclosporine levels may increase`,
    ],
    algeria_brands: [
      `Alodipine 5mg`,
      `Alodipine 10mg`,
    ],
    pharmnet: {
        refundable: true,
        prescription_list: `Liste I`,
        lab: `PHARMALLIANCE`,
        generic_official: `AMLODIPINE BESYLATE EXPRIME EN AMLODIPINE`,
        notice_url: `https://pharmnet-dz.com//notice.ashx?id=93`,
        pharmnet_url: `https://pharmnet-dz.com/m-84-alodipine-10mg-gles-b-30`,
        dosage_variants: [
          {
            dosage: `10MG`,
            form: `GLES`,
            conditioning: `B/30`,
            ppa: null
          },
          {
            dosage: `5MG`,
            form: `GLES`,
            conditioning: `B/30`,
            ppa: null
          }
        ]
      }
  },
  {
    name: `Amloval`,
    scientific_name: `Amlodipine + Valsartan`,
    category: `Hypertension`,
    emoji: `❤️`,
    description: `Amloval is a locally manufactured fixed-dose combination of amlodipine and valsartan for patients requiring both a calcium channel blocker and ARB to control blood pressure.`,
    how_to_take: `Take once daily with or without food.`,
    side_effects: [
      `Ankle swelling`,
      `Dizziness`,
      `Headache`,
      `Fatigue`,
    ],
    warnings: [
      `Not safe in pregnancy`,
      `Monitor kidney function and potassium`,
      `Avoid grapefruit juice`,
    ],
    interactions: [
      `NSAIDs reduce effectiveness`,
      `Potassium-sparing diuretics — hyperkalemia risk`,
    ],
    algeria_brands: [
      `Amloval 5mg/80mg`,
      `Amloval 5mg/160mg`,
      `Amloval 10mg/160mg`,
    ],
    pharmnet: {
        refundable: true,
        prescription_list: `Liste I`,
        lab: `SOPHAL (SOCIETE PHARMACEUTIQUE ALGERIENNE)`,
        generic_official: `AMLODIPINE BESILATE EXPRIME EN AMLODIPINE / VALSARTAN`,
        notice_url: `https://pharmnet-dz.com//notice.ashx?id=93`,
        pharmnet_url: `https://pharmnet-dz.com/m-4246-amloval-10mg-160mg-comp-pelli-b-30`,
        dosage_variants: [
          {
            dosage: `10MG/160MG`,
            form: `COMP. PELLI`,
            conditioning: `B/30`,
            ppa: null
          },
          {
            dosage: `5MG/160MG`,
            form: `COMP. PELLI`,
            conditioning: `B/30`,
            ppa: null
          },
          {
            dosage: `5MG/80MG`,
            form: `COMP. PELLI`,
            conditioning: `B/30`,
            ppa: null
          }
        ]
      }
  },
  {
    name: `Angiopril`,
    scientific_name: `Enalapril`,
    category: `Hypertension`,
    emoji: `❤️`,
    description: `Angiopril is a locally registered enalapril ACE inhibitor for hypertension and heart failure. Manufactured in Algeria as an affordable alternative to imported Renitec.`,
    how_to_take: `Take once or twice daily with or without food at the same time each day.`,
    side_effects: [
      `Dry cough (very common)`,
      `Dizziness`,
      `Headache`,
      `Elevated potassium`,
    ],
    warnings: [
      `Not safe in pregnancy`,
      `Stop immediately for facial/throat swelling`,
      `Monitor potassium and kidney function`,
    ],
    interactions: [
      `Potassium supplements — hyperkalemia risk`,
      `NSAIDs reduce effectiveness`,
    ],
    algeria_brands: [
      `Angiopril 5mg`,
      `Angiopril 10mg`,
      `Angiopril 20mg`,
    ],
    pharmnet: {
        refundable: true,
        prescription_list: `Liste I`,
        lab: `PETRA PHARM`,
        generic_official: `ENALAPRIL MALEATE`,
        notice_url: `https://pharmnet-dz.com//notice.ashx?id=93`,
        pharmnet_url: `https://pharmnet-dz.com/m-152-angiopril-20mg-comp-b-20`,
        dosage_variants: [
          {
            dosage: `20MG`,
            form: `COMP. SEC`,
            conditioning: `B/20`,
            ppa: null
          },
          {
            dosage: `5MG`,
            form: `COMP. SEC`,
            conditioning: `B/30`,
            ppa: null
          }
        ]
      }
  },
  {
    name: `Angiozide`,
    scientific_name: `Enalapril + Hydrochlorothiazide`,
    category: `Hypertension`,
    emoji: `❤️`,
    description: `Angiozide is a locally manufactured fixed-dose combination of enalapril and hydrochlorothiazide for patients who need both an ACE inhibitor and diuretic to control blood pressure.`,
    how_to_take: `Take once daily in the morning with or without food.`,
    side_effects: [
      `Dry cough`,
      `Frequent urination`,
      `Dizziness`,
      `Low potassium`,
      `Headache`,
    ],
    warnings: [
      `Not safe in pregnancy`,
      `Monitor electrolytes regularly`,
      `Stay hydrated`,
    ],
    interactions: [
      `Potassium supplements — complex interaction`,
      `NSAIDs reduce effectiveness`,
    ],
    algeria_brands: [
      `Angiozide 10mg/25mg`,
      `Angiozide 20mg/12.5mg`,
    ],
    pharmnet: {
        refundable: true,
        prescription_list: `Liste I`,
        lab: `JPM (JORDANIAN PHARMACEUTICAL MANIFACTURING)`,
        generic_official: `ENALAPRIL MALEATE / HYDROCHLOROTHIAZIDE`,
        notice_url: `https://pharmnet-dz.com//notice.ashx?id=93`,
        pharmnet_url: `https://pharmnet-dz.com/m-3136-angiozide-20mg-12-5mg-comp-b-20`,
        dosage_variants: [
          {
            dosage: `20MG/12,5MG`,
            form: `COMP`,
            conditioning: `B/20`,
            ppa: null
          }
        ]
      }
  },
  {
    name: `Atorin`,
    scientific_name: `Atorvastatin`,
    category: `Heart`,
    emoji: `💊`,
    description: `Atorin is an Algerian-manufactured atorvastatin statin for cholesterol reduction and cardiovascular risk prevention. Locally produced providing significant cost savings.`,
    how_to_take: `Take once daily at any time with or without food.`,
    side_effects: [
      `Muscle pain (report immediately)`,
      `Headache`,
      `Nausea`,
      `Liver enzyme elevation`,
    ],
    warnings: [
      `Report unexplained muscle pain immediately`,
      `Avoid grapefruit juice`,
      `Regular liver function monitoring recommended`,
    ],
    interactions: [
      `Grapefruit juice increases drug levels`,
      `Rifampicin reduces effectiveness`,
    ],
    algeria_brands: [
      `Atorin 10mg`,
      `Atorin 20mg`,
      `Atorin 40mg`,
    ],
    pharmnet: {
        refundable: true,
        prescription_list: `Liste I`,
        lab: `BEKER LABORATOIRES`,
        generic_official: `ATORVASTATINE CALCIQUE TRIHYDRATE EXPRIME EN ATORVASTATINE`,
        notice_url: `https://pharmnet-dz.com/notice.ashx?id=1558`,
        pharmnet_url: `https://pharmnet-dz.com/m-1558-atorin-10mg-comp-pelli-b-30`,
        dosage_variants: [
          {
            dosage: `10MG`,
            form: `COMP. PELLI`,
            conditioning: `B/30`,
            ppa: `837.59 DA`
          },
          {
            dosage: `20MG`,
            form: `COMP. PELLI`,
            conditioning: `B/30`,
            ppa: `1247.40 DA`
          },
          {
            dosage: `40MG`,
            form: `COMP. PELLI`,
            conditioning: `B/30`,
            ppa: `1979.99 DA`
          },
          {
            dosage: `80MG`,
            form: `COMP. PELLI`,
            conditioning: `B/30`,
            ppa: `2039.99 DA`
          }
        ]
      }
  },
  {
    name: `Cardioflux`,
    scientific_name: `Clopidogrel + Aspirin`,
    category: `Heart`,
    emoji: `🩸`,
    description: `Cardioflux is a fixed-dose combination of clopidogrel and aspirin registered in Algeria for patients who require dual antiplatelet therapy after heart attack or stent placement.`,
    how_to_take: `Take once daily with food to reduce stomach upset.`,
    side_effects: [
      `Easy bruising or bleeding`,
      `Stomach pain`,
      `Nausea`,
      `Headache`,
    ],
    warnings: [
      `Tell all doctors and dentists before any procedure`,
      `Do not stop without medical advice — serious clotting risk`,
      `Use pantoprazole for stomach protection`,
    ],
    interactions: [
      `NSAIDs — increased bleeding risk`,
      `Warfarin — greatly increased bleeding risk`,
      `Omeprazole reduces clopidogrel effectiveness`,
    ],
    algeria_brands: [
      `Cardioflux 75mg/100mg`,
    ],
    pharmnet: {
        refundable: true,
        prescription_list: `Liste I`,
        lab: `BIOVITAL`,
        generic_official: `CLOPIDOGREL / ACIDE ACETYLSALICYLIQUE`,
        notice_url: `https://pharmnet-dz.com//notice.ashx?id=93`,
        pharmnet_url: `https://pharmnet-dz.com/m-1518-cardioflux-75mg-75mg-comp-b-30`,
        dosage_variants: [
          {
            dosage: `75MG/75MG`,
            form: `COMP`,
            conditioning: `B/30`,
            ppa: null
          }
        ]
      }
  },
  {
    name: `Clodipral`,
    scientific_name: `Clopidogrel`,
    category: `Heart`,
    emoji: `🩸`,
    description: `Clodipral is an Algerian-manufactured clopidogrel antiplatelet for preventing blood clots after heart attack, stroke, and stent placement. Locally produced affordable alternative to Plavix.`,
    how_to_take: `Take once daily with or without food. Do not stop without consulting your doctor.`,
    side_effects: [
      `Easy bruising`,
      `Stomach pain`,
      `Nausea`,
      `Diarrhea`,
    ],
    warnings: [
      `Do not stop suddenly`,
      `Tell all doctors before any procedure`,
      `Use pantoprazole (not omeprazole) for stomach protection`,
    ],
    interactions: [
      `Omeprazole reduces effectiveness — use pantoprazole instead`,
      `NSAIDs — increased bleeding risk`,
    ],
    algeria_brands: [
      `Clodipral 75mg`,
      `Clodipral 300mg`,
    ],
    pharmnet: {
        refundable: true,
        prescription_list: `Liste I`,
        lab: `SOPHAL (SOCIETE PHARMACEUTIQUE ALGERIENNE)`,
        generic_official: `CLOPIDOGREL BISULFATE EXPRIME EN CLOPIDOGREL`,
        notice_url: `https://pharmnet-dz.com//notice.ashx?id=93`,
        pharmnet_url: `https://pharmnet-dz.com/m-1504-clodipral-75mg-comp-pelli-b-30`,
        dosage_variants: [
          {
            dosage: `75MG`,
            form: `COMP. PELLI`,
            conditioning: `B/30`,
            ppa: `366.00 DA`
          }
        ]
      }
  },
  {
    name: `Abdifly`,
    scientific_name: `Aripiprazole`,
    category: `Neurological`,
    emoji: `🧠`,
    description: `Abdifly is an Algerian-registered aripiprazole atypical antipsychotic for schizophrenia and bipolar disorder. Has a more favorable metabolic profile than older antipsychotics with lower risk of weight gain.`,
    how_to_take: `Take once daily with or without food at the same time each day.`,
    side_effects: [
      `Nausea`,
      `Insomnia`,
      `Headache`,
      `Restlessness (akathisia)`,
      `Dizziness`,
    ],
    warnings: [
      `Do not stop without medical guidance`,
      `Monitor weight and blood sugar`,
      `Report any unusual movements`,
    ],
    interactions: [
      `CYP2D6 inhibitors (fluoxetine, paroxetine) increase levels`,
      `Carbamazepine reduces levels`,
    ],
    algeria_brands: [
      `Abdifly 10mg`,
      `Abdifly 15mg`,
      `Abdifly 30mg`,
    ],
    pharmnet: {
        refundable: true,
        prescription_list: `Liste I`,
        lab: `ABDI IBRAHIM`,
        generic_official: `ARIPIPRAZOLE`,
        notice_url: null,
        pharmnet_url: `https://pharmnet-dz.com/m-6145-abdifly-10mg-comprime-b-28`,
        dosage_variants: [
          {
            dosage: `10MG`,
            form: `COMP`,
            conditioning: `B/28`,
            ppa: null
          },
          {
            dosage: `15MG`,
            form: `COMP`,
            conditioning: `B/28`,
            ppa: null
          }
        ]
      }
  },
  {
    name: `Amatriline`,
    scientific_name: `Amitriptyline`,
    category: `Neurological`,
    emoji: `🧠`,
    description: `Amatriline is a locally registered amitriptyline tricyclic antidepressant for depression, neuropathic pain, and insomnia. Made in Algeria providing affordable access to this versatile medication.`,
    how_to_take: `Take at bedtime. Start at low dose and increase gradually. The sedating effect is beneficial when taken at night.`,
    side_effects: [
      `Dry mouth (very common)`,
      `Drowsiness`,
      `Constipation`,
      `Weight gain`,
      `Blurred vision`,
      `Urinary retention`,
    ],
    warnings: [
      `Do not drive until effects are known`,
      `Avoid in cardiac arrhythmias`,
      `Do not stop suddenly`,
    ],
    interactions: [
      `MAOIs — contraindicated (potentially fatal)`,
      `Tramadol and SSRIs — serotonin syndrome risk`,
      `Alcohol — severe sedation`,
    ],
    algeria_brands: [
      `Amatriline 25mg`,
      `Amatriline 50mg`,
    ],
    pharmnet: {
        refundable: true,
        prescription_list: `Liste I`,
        lab: `SOMEDIAL`,
        generic_official: `AMITRIPTYLINE CHLORHYDRATE EXPRIME EN AMITRIPTYLINE`,
        notice_url: null,
        pharmnet_url: `https://pharmnet-dz.com/m-2523-amatriline-4--40mg-ml-sol-buv-gttes-fl-30ml`,
        dosage_variants: [
          {
            dosage: `4% (40MG/ML)`,
            form: `SOL. BUV. GTTES`,
            conditioning: `FL./30ML`,
            ppa: null
          }
        ]
      }
  },
  {
    name: `Amotridal`,
    scientific_name: `Lamotrigine`,
    category: `Neurological`,
    emoji: `🧠`,
    description: `Amotridal is a locally registered lamotrigine antiepileptic and mood stabilizer for epilepsy and bipolar disorder. Start at very low dose and increase slowly to minimize skin rash risk.`,
    how_to_take: `Start at very low dose and increase very slowly over weeks. Take once or twice daily with or without food.`,
    side_effects: [
      `Skin rash (STOP immediately if occurs)`,
      `Dizziness`,
      `Headache`,
      `Blurred or double vision`,
      `Nausea`,
    ],
    warnings: [
      `Stop immediately for ANY skin rash — Stevens-Johnson syndrome risk`,
      `Never stop suddenly — seizure risk`,
      `Valproate greatly increases lamotrigine levels`,
    ],
    interactions: [
      `Valproate — doubles lamotrigine levels (halve dose)`,
      `Carbamazepine — reduces lamotrigine levels`,
      `Oral contraceptives — reduce lamotrigine levels`,
    ],
    algeria_brands: [
      `Amotridal 25mg`,
      `Amotridal 50mg`,
      `Amotridal 100mg`,
    ],
    pharmnet: {
        refundable: true,
        prescription_list: `Liste I`,
        lab: `SAIDAL GROUPE`,
        generic_official: `LAMOTRIGINE`,
        notice_url: `https://pharmnet-dz.com//notice.ashx?id=6066`,
        pharmnet_url: `https://pharmnet-dz.com/m-2410-amotridal-100mg-comp-dispers-b-28`,
        dosage_variants: [
          {
            dosage: `100MG`,
            form: `COMP. DISPERS`,
            conditioning: `B/28`,
            ppa: null
          },
          {
            dosage: `25MG`,
            form: `COMP. DISPERS`,
            conditioning: `B/28`,
            ppa: null
          },
          {
            dosage: `50MG`,
            form: `COMP. DISPERS`,
            conditioning: `B/28`,
            ppa: null
          },
          {
            dosage: `5MG`,
            form: `COMP. DISPERS`,
            conditioning: `B/28`,
            ppa: null
          }
        ]
      }
  },
  {
    name: `Avisine`,
    scientific_name: `Venlafaxine`,
    category: `Neurological`,
    emoji: `🧠`,
    description: `Avisine is an Algerian-manufactured venlafaxine SNRI antidepressant for depression, generalized anxiety disorder, and panic disorder. Locally produced affordable alternative to Effexor.`,
    how_to_take: `Take once daily with food (extended-release). Do not crush extended-release capsules. Start at low dose and increase gradually.`,
    side_effects: [
      `Nausea (especially at start)`,
      `Headache`,
      `Dizziness`,
      `Dry mouth`,
      `Sweating`,
      `Elevated blood pressure at higher doses`,
    ],
    warnings: [
      `Monitor blood pressure — may increase at higher doses`,
      `Do not stop suddenly — severe withdrawal symptoms`,
      `Allow 14 days after stopping MAOIs`,
    ],
    interactions: [
      `MAOIs — contraindicated`,
      `Tramadol — serotonin syndrome risk`,
      `Warfarin — monitor closely`,
    ],
    algeria_brands: [
      `Avisine LP 37.5mg`,
      `Avisine LP 75mg`,
      `Avisine LP 150mg`,
    ],
    pharmnet: {
        refundable: true,
        prescription_list: `Liste I`,
        lab: `CPCM`,
        generic_official: `VENLAFAXINE CHLORHYDRATE EXPRIME EN VENLAFAXINE`,
        notice_url: null,
        pharmnet_url: `https://pharmnet-dz.com/m-2574-avisine-37-5mg-gles-lp-b-30`,
        dosage_variants: [
          {
            dosage: `37,5MG`,
            form: `GLES. LP`,
            conditioning: `B/30`,
            ppa: `800.00 DA`
          },
          {
            dosage: `75 MG`,
            form: `GLES. LP`,
            conditioning: `B/30`,
            ppa: `1700.00 DA`
          }
        ]
      }
  },
  {
    name: `Asmadil`,
    scientific_name: `Salbutamol`,
    category: `Respiratory`,
    emoji: `🫁`,
    description: `Asmadil is an Algerian-manufactured salbutamol rescue inhaler for quick relief of asthma and COPD symptoms. Locally produced making it widely accessible and affordable throughout Algeria.`,
    how_to_take: `Shake well before use. Inhale 1-2 puffs as needed. Press and breathe in slowly, hold breath for 10 seconds.`,
    side_effects: [
      `Trembling or shaking`,
      `Fast heartbeat`,
      `Headache`,
      `Nervousness`,
    ],
    warnings: [
      `Do not overuse — seek care if needed more than twice weekly`,
      `Keep for emergencies — always have a spare`,
    ],
    interactions: [
      `Beta-blockers reduce effectiveness`,
      `Diuretics — low potassium risk with high doses`,
    ],
    algeria_brands: [
      `Asmadil 100mcg inhaler`,
      `Asmadil nebulizer solution`,
    ],
    pharmnet: {
        refundable: true,
        prescription_list: `Liste I`,
        lab: `ARAB PHARM`,
        generic_official: `SALBUTAMOL`,
        notice_url: `https://pharmnet-dz.com//notice.ashx?id=6011`,
        pharmnet_url: `https://pharmnet-dz.com/m-2075-asmadil-2mg-comp-b-30`,
        dosage_variants: [
          {
            dosage: `2MG`,
            form: `COMP`,
            conditioning: `B/30`,
            ppa: null
          }
        ]
      }
  },
  {
    name: `Beclojet`,
    scientific_name: `Beclometasone`,
    category: `Respiratory`,
    emoji: `🫁`,
    description: `Beclojet is an Algerian-registered beclometasone inhaled corticosteroid for maintenance treatment of asthma. Used regularly to prevent asthma attacks by reducing airway inflammation.`,
    how_to_take: `Use twice daily. Rinse mouth with water after each use to prevent oral thrush. Do not use as rescue inhaler.`,
    side_effects: [
      `Oral thrush`,
      `Hoarse voice`,
      `Throat irritation`,
      `Cough`,
    ],
    warnings: [
      `Rinse mouth after every use`,
      `Not a rescue inhaler`,
      `Do not stop suddenly`,
    ],
    interactions: [
      `Ketoconazole increases beclometasone levels`,
    ],
    algeria_brands: [
      `Beclojet 100mcg inhaler`,
      `Beclojet 250mcg inhaler`,
    ],
    pharmnet: {
        refundable: true,
        prescription_list: `Liste I`,
        lab: `CHIESI S.A.`,
        generic_official: `BECLOMETASONE`,
        notice_url: `https://pharmnet-dz.com/notice.ashx?id=2060`,
        pharmnet_url: `https://pharmnet-dz.com/m-2060-beclojet-250Âµg-bouffee-susp-inhal-buccale-fl-200doses`,
        dosage_variants: [
          {
            dosage: `250ÂµG/BOUFFEE`,
            form: `AERO`,
            conditioning: `FL/200DOSES`,
            ppa: null
          }
        ]
      }
  },
  {
    name: `Acetadol`,
    scientific_name: `Paracetamol`,
    category: `Pain`,
    emoji: `🩹`,
    description: `Acetadol is an Algerian-manufactured paracetamol for mild to moderate pain and fever. One of the most commonly used analgesics in Algeria, available widely and affordably.`,
    how_to_take: `Take 500mg-1g every 4-6 hours as needed. Do not exceed 4g (4000mg) per day. Can be taken with or without food.`,
    side_effects: [
      `Very well tolerated at correct doses`,
      `Skin rash (rare allergic reaction)`,
    ],
    warnings: [
      `Do not exceed maximum dose — liver damage risk`,
      `Avoid alcohol`,
      `Do not combine with other paracetamol-containing products`,
    ],
    interactions: [
      `Warfarin — may slightly increase anticoagulant effect with long-term use`,
      `Alcohol increases liver toxicity`,
    ],
    algeria_brands: [
      `Acetadol 500mg`,
      `Acetadol 1g`,
    ],
    pharmnet: {
        refundable: true,
        prescription_list: `Liste I`,
        lab: `N/D`,
        generic_official: `PARACETAMOL`,
        notice_url: `https://pharmnet-dz.com//notice.ashx?id=5735`,
        pharmnet_url: `https://pharmnet-dz.com/m-4604-acetadol-0-03-sol-buv-b-1-fl-de-100ml-pipette-graduee`,
        dosage_variants: [
          {
            dosage: `3%`,
            form: `SOL. BUV`,
            conditioning: `B/1 FL DE 100ML+PIPETTE GRADUEE`,
            ppa: null
          }
        ]
      }
  },
  {
    name: `Alprofene`,
    scientific_name: `Ketoprofen`,
    category: `Pain`,
    emoji: `🩹`,
    description: `Alprofene is an Algerian-manufactured ketoprofen NSAID for pain and inflammation in arthritis, muscle pain, and dental pain. Locally produced alternative to Profenid.`,
    how_to_take: `Take with food or milk. Usually 50-100mg 2-3 times daily.`,
    side_effects: [
      `Stomach pain`,
      `Nausea`,
      `Heartburn`,
      `Headache`,
      `Photosensitivity`,
    ],
    warnings: [
      `Avoid in stomach ulcer`,
      `Take with food`,
      `Not for kidney or heart disease`,
      `Use sunscreen with gel form`,
    ],
    interactions: [
      `Warfarin — increased bleeding risk`,
      `Lithium — toxicity risk`,
      `Methotrexate — toxicity`,
    ],
    algeria_brands: [
      `Alprofene 50mg`,
      `Alprofene 100mg`,
    ],
    pharmnet: {
        refundable: true,
        prescription_list: `Liste II`,
        lab: `LABORATOIRES SALEM`,
        generic_official: `KETOPROFENE`,
        notice_url: `https://pharmnet-dz.com/notice.ashx?id=2745`,
        pharmnet_url: `https://pharmnet-dz.com/m-2745-alprofene-100mg-suppo-b-10`,
        dosage_variants: [
          {
            dosage: `100MG`,
            form: `SUPPO`,
            conditioning: `B/10`,
            ppa: `200.00 DA`
          }
        ]
      }
  },
  {
    name: `Antium`,
    scientific_name: `Esomeprazole`,
    category: `Stomach`,
    emoji: `🫁`,
    description: `Antium is an Algerian-manufactured esomeprazole proton pump inhibitor for acid reflux, gastritis, and stomach ulcers. Locally produced providing an affordable alternative to Inexium.`,
    how_to_take: `Take 30 minutes before the first meal. Swallow whole — do not crush.`,
    side_effects: [
      `Headache`,
      `Nausea`,
      `Diarrhea`,
      `Flatulence`,
      `Stomach pain`,
    ],
    warnings: [
      `Avoid with clopidogrel — use pantoprazole instead`,
      `Long-term use may reduce magnesium and B12`,
    ],
    interactions: [
      `Clopidogrel — avoid combination`,
      `Methotrexate levels may increase`,
    ],
    algeria_brands: [
      `Antium 20mg`,
      `Antium 40mg`,
    ],
    pharmnet: {
        refundable: true,
        prescription_list: `Liste II`,
        lab: `BIOCARE LABORATOIRES`,
        generic_official: `ESOMEPRAZOLE MAGNESIUM TRIHYDRATE EXPRIME EN ESOMEPRAZOLE`,
        notice_url: null,
        pharmnet_url: `https://pharmnet-dz.com/m-6196-antium-20mg-granules-en-gelule-gastro-resistants--b-28`,
        dosage_variants: [
          {
            dosage: `20MG`,
            form: `GLES. A MICROG. GASTRORESIST`,
            conditioning: `B/28`,
            ppa: null
          },
          {
            dosage: `20MG`,
            form: `GLES. A MICROG. GASTRORESIST`,
            conditioning: `B/14`,
            ppa: null
          },
          {
            dosage: `40MG`,
            form: `GLES. A MICROG. GASTRORESIST`,
            conditioning: `B/28`,
            ppa: null
          }
        ]
      }
  },
  {
    name: `Apitidine`,
    scientific_name: `Ranitidine`,
    category: `Stomach`,
    emoji: `🫁`,
    description: `Apitidine is an Algerian-registered ranitidine H2 blocker for acid reflux, peptic ulcers, and heartburn. An alternative to proton pump inhibitors for mild to moderate acid-related conditions.`,
    how_to_take: `Take twice daily or once at bedtime depending on indication.`,
    side_effects: [
      `Headache`,
      `Diarrhea`,
      `Constipation`,
      `Nausea`,
    ],
    warnings: [
      `Long-term use requires periodic medical review`,
      `Tell doctor about kidney disease — dose adjustment needed`,
    ],
    interactions: [
      `Antacids reduce absorption — take 2 hours apart`,
      `Warfarin — slight increase in anticoagulant effect`,
    ],
    algeria_brands: [
      `Apitidine 150mg`,
      `Apitidine 300mg`,
    ],
    pharmnet: {
        refundable: true,
        prescription_list: `Liste II`,
        lab: `API`,
        generic_official: `RANITIDINE`,
        notice_url: null,
        pharmnet_url: `https://pharmnet-dz.com/m-3858-apitidine-150mg-comp-b-20`,
        dosage_variants: [
          {
            dosage: `150MG`,
            form: `COMP. PELLI`,
            conditioning: `B/20`,
            ppa: null
          },
          {
            dosage: `150MG`,
            form: `COMP. EFFERV`,
            conditioning: `B/20`,
            ppa: null
          },
          {
            dosage: `300MG`,
            form: `COMP. PELLI`,
            conditioning: `B/10`,
            ppa: null
          },
          {
            dosage: `300MG`,
            form: `COMP. EFFERV`,
            conditioning: `B/10`,
            ppa: null
          }
        ]
      }
  },
  {
    name: `Coloclean`,
    scientific_name: `Macrogol`,
    category: `Stomach`,
    emoji: `🫁`,
    description: `Coloclean is a bowel preparation and osmotic laxative containing macrogol for constipation treatment and bowel cleansing before procedures. Registered in Algeria.`,
    how_to_take: `For constipation: dissolve 1-2 sachets in water daily. For bowel prep: follow prescribed protocol.`,
    side_effects: [
      `Bloating`,
      `Stomach cramps`,
      `Nausea`,
      `Diarrhea`,
    ],
    warnings: [
      `Not for bowel obstruction`,
      `Ensure adequate fluid intake`,
      `Bowel prep requires full protocol adherence`,
    ],
    interactions: [
      `May affect absorption of other medications — take 2 hours apart`,
    ],
    algeria_brands: [
      `Coloclean sachet`,
      `Coloclean bowel prep solution`,
    ],
    pharmnet: {
        refundable: true,
        prescription_list: `N/D`,
        lab: `GEOPHARM`,
        generic_official: `MACROGOL 3350 (POLYETHYLENE GLYCOL 3350) / SULFATE SODIUM ANHYDRE / BICARBONATE SODIUM / CHLORURE SODIUM / CHLORURE POTASSIUM`,
        notice_url: null,
        pharmnet_url: `https://pharmnet-dz.com/m-2949-coloclean-59g-5-68g-1-68g-1-64g-0-75g-sachet-pdre-sol-buv-b-04-sach-`,
        dosage_variants: [
          {
            dosage: `59G/5,68G/1,68G/1,64G/0,75G/SACHET`,
            form: `PDRE. SOL. BUV`,
            conditioning: `B/04 SACH.`,
            ppa: null
          }
        ]
      }
  },
  {
    name: `Amoclan 8:1`,
    scientific_name: `Amoxicillin + Clavulanic Acid`,
    category: `Antibiotics`,
    emoji: `🦠`,
    description: `Amoclan 8:1 is a locally manufactured amoxicillin-clavulanate antibiotic with an 8:1 ratio formulation that reduces gastrointestinal side effects. Algerian brand for respiratory, urinary, and skin infections.`,
    how_to_take: `Take with food to reduce stomach upset. Complete the full course.`,
    side_effects: [
      `Diarrhea (less than standard Augmentin due to 8:1 ratio)`,
      `Nausea`,
      `Skin rash`,
    ],
    warnings: [
      `Tell doctor about penicillin allergy`,
      `Complete the full course`,
      `8:1 ratio causes fewer GI side effects`,
    ],
    interactions: [
      `Warfarin — increased bleeding risk`,
      `Methotrexate toxicity increases`,
    ],
    algeria_brands: [
      `Amoclan 8:1 875mg/125mg tablets`,
      `Amoclan 8:1 pediatric suspension`,
    ],
    pharmnet: {
        refundable: true,
        prescription_list: `Liste I`,
        lab: `HIKMA PHARMACEUTICALS`,
        generic_official: `AMOXICILLINE TRIHYDRATEE EXPRIME EN AMOXICILLINE / ACIDE CLAVULANIQUE POTASSIQUE EXPRIME EN ACIDE CLAVULANIQUE`,
        notice_url: `https://pharmnet-dz.com/notice.ashx?id=283`,
        pharmnet_url: `https://pharmnet-dz.com/m-283-amoclan-8-1-100mg-12-5mg-ml-pdre-p-susp-buv-enfant-et-nourrisson-b-1fl-de-30ml-nourrisson--b-1fl-de-60ml-enfant-de-susp-buv-apres-reconst--pipette-graduee`,
        dosage_variants: [
          {
            dosage: `100MG/12,5MG/ML`,
            form: `PDRE. SOL. BUV`,
            conditioning: `B/1FL.DE 30ML (NOURRISSON) - B/1FL.DE 60ML (ENFANT) DE SUSP. BUV. APRES RECONST. + PIPETTE GRADUEE`,
            ppa: null
          },
          {
            dosage: `1G/125MG/SACHET`,
            form: `PDRE. SUSP. BUV`,
            conditioning: `B/14 ET B/12`,
            ppa: `593.00 DA`
          },
          {
            dosage: `500MG/62,5MG`,
            form: `PDRE. SOL. BUV`,
            conditioning: `B/12 ET B/14`,
            ppa: null
          }
        ]
      }
  },
  {
    name: `Amodex`,
    scientific_name: `Amoxicillin`,
    category: `Antibiotics`,
    emoji: `🦠`,
    description: `Amodex is a locally manufactured amoxicillin for common bacterial infections including throat, ear, chest, urinary tract, and skin infections. Widely used in Algerian healthcare.`,
    how_to_take: `Take at evenly spaced intervals. Can be taken with or without food. Complete the full course.`,
    side_effects: [
      `Diarrhea`,
      `Nausea`,
      `Skin rash`,
      `Yeast infections`,
    ],
    warnings: [
      `Tell doctor about penicillin allergy`,
      `Complete the full course`,
      `Seek care for severe rash or breathing difficulty`,
    ],
    interactions: [
      `Methotrexate toxicity increases`,
      `May reduce oral contraceptive effectiveness`,
    ],
    algeria_brands: [
      `Amodex 500mg`,
      `Amodex 1g`,
      `Amodex pediatric suspension`,
    ],
    pharmnet: null
  },
  {
    name: `Akaryd`,
    scientific_name: `Loratadine`,
    category: `Allergy`,
    emoji: `🌿`,
    description: `Akaryd is an Algerian-manufactured loratadine non-sedating antihistamine for allergic rhinitis and urticaria. Locally produced providing an affordable alternative to Clarityne.`,
    how_to_take: `Take 1 tablet (10mg) once daily with or without food.`,
    side_effects: [
      `Headache`,
      `Dry mouth`,
      `Fatigue`,
      `Very rarely: drowsiness`,
    ],
    warnings: [
      `One of the safest antihistamines for daytime use`,
      `Reduce dose in severe liver disease`,
    ],
    interactions: [
      `Ketoconazole and erythromycin may slightly increase levels`,
    ],
    algeria_brands: [
      `Akaryd 10mg`,
    ],
    pharmnet: {
        refundable: true,
        prescription_list: `Liste II`,
        lab: `MERINAL`,
        generic_official: `LORATADINE`,
        notice_url: `https://pharmnet-dz.com//notice.ashx?id=6072`,
        pharmnet_url: `https://pharmnet-dz.com/m-3987-akaryd-10mg-comp-pelli--b-20`,
        dosage_variants: [
          {
            dosage: `10MG`,
            form: `COMP. SEC`,
            conditioning: `B/20`,
            ppa: `239.10 DA`
          }
        ]
      }
  },
  {
    name: `Artiz`,
    scientific_name: `Cetirizine`,
    category: `Allergy`,
    emoji: `🌿`,
    description: `Artiz is an Algerian-manufactured cetirizine antihistamine for allergic rhinitis, urticaria, and seasonal allergies. Locally produced affordable alternative to Zyrtec.`,
    how_to_take: `Take 1 tablet (10mg) once daily with or without food. Can be taken at night if drowsiness occurs.`,
    side_effects: [
      `Drowsiness (less than older antihistamines)`,
      `Dry mouth`,
      `Headache`,
      `Fatigue`,
    ],
    warnings: [
      `May cause drowsiness — caution when driving`,
      `Reduce dose in severe kidney disease`,
      `Avoid alcohol`,
    ],
    interactions: [
      `Alcohol — increased sedation`,
      `Theophylline at high doses reduces cetirizine clearance`,
    ],
    algeria_brands: [
      `Artiz 10mg`,
    ],
    pharmnet: {
        refundable: true,
        prescription_list: `Liste II`,
        lab: `EL KENDI`,
        generic_official: `CETIRIZINE DICHLORHYDRATE`,
        notice_url: `https://pharmnet-dz.com/notice.ashx?id=3972`,
        pharmnet_url: `https://pharmnet-dz.com/m-3972-artiz-10mg-comp-pelli-b-10`,
        dosage_variants: [
          {
            dosage: `10MG`,
            form: `COMP`,
            conditioning: `B/10`,
            ppa: `111.00 DA`
          },
          {
            dosage: `10MG/ML`,
            form: `SOL. BUV`,
            conditioning: `B /FL 30ML +PIPETTE GRADUEE`,
            ppa: `480.30 DA`
          }
        ]
      }
  },
  {
    name: `Brequal`,
    scientific_name: `Fluticasone + Salmeterol`,
    category: `Allergy`,
    emoji: `🌿`,
    description: `Brequal is an Algerian-registered combination inhaler of fluticasone and salmeterol for severe allergic asthma requiring both a corticosteroid and long-acting bronchodilator.`,
    how_to_take: `Use twice daily. Rinse mouth after each use. Never use as rescue inhaler.`,
    side_effects: [
      `Oral thrush`,
      `Hoarse voice`,
      `Headache`,
      `Throat irritation`,
      `Muscle cramps`,
    ],
    warnings: [
      `Rinse mouth after every use`,
      `Always have Ventoline for acute attacks`,
      `Do not stop suddenly`,
    ],
    interactions: [
      `Ritonavir and ketoconazole increase fluticasone levels`,
      `Beta-blockers may reduce salmeterol effectiveness`,
    ],
    algeria_brands: [
      `Brequal 25/50mcg`,
      `Brequal 25/125mcg`,
      `Brequal 25/250mcg`,
    ],
    pharmnet: {
        refundable: true,
        prescription_list: `Liste I`,
        lab: `ABDI IBRAHIM`,
        generic_official: `FLUTICASONE PROPIONATE / SALMETEROL XINAFOATE EXPRIME EN SALMETEROL`,
        notice_url: `https://pharmnet-dz.com//notice.ashx?id=6011`,
        pharmnet_url: `https://pharmnet-dz.com/m-5914-brequal-100Âµg-50Âµg-capsules-contenant-pdre-pr-inhal-b-60-`,
        dosage_variants: [
          {
            dosage: `100ÂµG/50ÂµG`,
            form: `PDRE. INHAL`,
            conditioning: `B/60`,
            ppa: null
          },
          {
            dosage: `250ÂµG/50ÂµG`,
            form: `PDRE. INHAL`,
            conditioning: `B/60 +INHALATEUR DE QHALER`,
            ppa: null
          },
          {
            dosage: `500ÂµG/50ÂµG`,
            form: `PDRE. INHAL`,
            conditioning: `B/60 +INHALATEUR DE QHALER`,
            ppa: null
          }
        ]
      }
  },
  {
    name: `Biorava`,
    scientific_name: `Leflunomide`,
    category: `Rheumatology`,
    emoji: `💊`,
    description: `Biorava is an Algerian-registered leflunomide DMARD for active rheumatoid arthritis and psoriatic arthritis when methotrexate is not suitable or has failed.`,
    how_to_take: `Take once daily (20mg) with or without food at the same time each day.`,
    side_effects: [
      `Diarrhea`,
      `Nausea`,
      `Liver enzyme elevation`,
      `Hair thinning`,
      `Skin rash`,
    ],
    warnings: [
      `Regular liver function monitoring mandatory`,
      `Effective contraception required — teratogenic`,
      `Long half-life — washout procedure needed before pregnancy`,
    ],
    interactions: [
      `Methotrexate — increased liver toxicity (avoid combination)`,
      `Warfarin — increased anticoagulant effect`,
    ],
    algeria_brands: [
      `Biorava 10mg`,
      `Biorava 20mg`,
    ],
    pharmnet: {
        refundable: true,
        prescription_list: `Liste I`,
        lab: `BIOCARE LABORATOIRES`,
        generic_official: `LEFLUNOMIDE`,
        notice_url: `https://pharmnet-dz.com//notice.ashx?id=6047`,
        pharmnet_url: `https://pharmnet-dz.com/m-6219-biorava-10mg-comprime-pellicule-b-30`,
        dosage_variants: [
          {
            dosage: `10MG`,
            form: `COMP. PELLI`,
            conditioning: `B/30`,
            ppa: null
          },
          {
            dosage: `20MG`,
            form: `COMP. PELLI`,
            conditioning: `B/30`,
            ppa: null
          }
        ]
      }
  },
  {
    name: `Cytotrex`,
    scientific_name: `Methotrexate`,
    category: `Rheumatology`,
    emoji: `💊`,
    description: `Cytotrex is an Algerian-registered methotrexate DMARD for rheumatoid arthritis and psoriasis. MUST be taken ONCE WEEKLY only — daily dosing is potentially fatal.`,
    how_to_take: `Take ONCE PER WEEK ONLY on the same day each week. Always take folic acid on non-methotrexate days.`,
    side_effects: [
      `Nausea`,
      `Mouth ulcers`,
      `Fatigue`,
      `Liver toxicity`,
      `Bone marrow suppression`,
    ],
    warnings: [
      `NEVER take daily — weekly dosing only — CRITICAL SAFETY WARNING`,
      `Take folic acid on non-methotrexate days`,
      `Regular blood tests mandatory`,
      `Not safe in pregnancy`,
    ],
    interactions: [
      `NSAIDs — increase methotrexate toxicity`,
      `Trimethoprim/Bactrim — serious toxicity`,
      `Alcohol — increases liver toxicity`,
    ],
    algeria_brands: [
      `Cytotrex 2.5mg`,
      `Cytotrex 10mg injectable`,
    ],
    pharmnet: {
        refundable: true,
        prescription_list: `Liste I`,
        lab: `CIPLA LIMITED`,
        generic_official: `METHOTREXATE`,
        notice_url: `https://pharmnet-dz.com//notice.ashx?id=998`,
        pharmnet_url: `https://pharmnet-dz.com/m-990-cytotrex-2-5mg-comp-b-20`,
        dosage_variants: [
          {
            dosage: `2,5MG`,
            form: `COMP`,
            conditioning: `B/20`,
            ppa: null
          }
        ]
      }
  },
  {
    name: `Naquine`,
    scientific_name: `Hydroxychloroquine`,
    category: `Rheumatology`,
    emoji: `💊`,
    description: `Naquine is an Algerian-registered hydroxychloroquine for rheumatoid arthritis, lupus, and autoimmune conditions. Annual eye monitoring is mandatory with long-term use.`,
    how_to_take: `Take once or twice daily with food. Therapeutic effect takes 3-6 months to appear.`,
    side_effects: [
      `Nausea`,
      `Headache`,
      `Skin rash`,
      `Retinal damage with long-term use (rare)`,
    ],
    warnings: [
      `Annual eye examination mandatory with long-term use`,
      `Stop immediately for any visual changes`,
      `May prolong QT interval`,
    ],
    interactions: [
      `Amiodarone and other QT-prolonging drugs — cardiac risk`,
      `Antidiabetics — may enhance glucose lowering`,
    ],
    algeria_brands: [
      `Naquine 200mg`,
    ],
    pharmnet: {
        refundable: true,
        prescription_list: `N/D`,
        lab: `NOVA ARGENTIA SPA`,
        generic_official: `HYDROXYCHLOROQUINE`,
        notice_url: `https://pharmnet-dz.com//notice.ashx?id=6047`,
        pharmnet_url: `https://pharmnet-dz.com/m-1413-naquine-200mg-drg-b-30`,
        dosage_variants: [
          {
            dosage: `200MG`,
            form: `COMP. PELLI`,
            conditioning: `B/30`,
            ppa: null
          }
        ]
      }
  },
  {
    name: `Cabernex`,
    scientific_name: `Cabergoline`,
    category: `Endocrine`,
    emoji: `💊`,
    description: `Cabernex is an Algerian-registered cabergoline dopamine agonist for hyperprolactinemia and pituitary adenoma. Alternative to Dostinex manufactured or registered locally.`,
    how_to_take: `Take twice weekly with food on the same two days each week.`,
    side_effects: [
      `Nausea`,
      `Headache`,
      `Dizziness`,
      `Fatigue`,
      `Orthostatic hypotension (especially first dose)`,
    ],
    warnings: [
      `First dose may cause sudden blood pressure drop — sit or lie down after taking`,
      `Monitor heart valves with long-term use`,
    ],
    interactions: [
      `Antihypertensives — additive hypotension`,
      `Metoclopramide and domperidone — reduce effectiveness`,
    ],
    algeria_brands: [
      `Cabernex 0.5mg`,
    ],
    pharmnet: {
        refundable: true,
        prescription_list: `Liste I`,
        lab: `BIOCARE LABORATOIRES`,
        generic_official: `CABERGOLINE`,
        notice_url: `https://pharmnet-dz.com//notice.ashx?id=668`,
        pharmnet_url: `https://pharmnet-dz.com/m-5812-cabernex-0-5mg-comp--b-08`,
        dosage_variants: [
          {
            dosage: `0,5MG`,
            form: `COMP`,
            conditioning: `B/08`,
            ppa: `2190 DA`
          }
        ]
      }
  },
  {
    name: `Corten`,
    scientific_name: `Hydrocortisone`,
    category: `Endocrine`,
    emoji: `💊`,
    description: `Corten is an Algerian-registered hydrocortisone for adrenal insufficiency (Addison disease) and inflammatory conditions. Used to replace the natural cortisol that the adrenal glands cannot produce.`,
    how_to_take: `Take 2-3 times daily simulating the body's natural pattern (higher dose morning, lower evening). Take with food.`,
    side_effects: [
      `At correct replacement dose: minimal side effects`,
      `Overdose: weight gain, elevated blood sugar, mood changes`,
    ],
    warnings: [
      `Never stop suddenly if used for adrenal insufficiency — life-threatening`,
      `Double dose during illness or surgery (sick day rules)`,
      `Carry medical alert identification`,
    ],
    interactions: [
      `Rifampicin and phenytoin reduce corticosteroid effect`,
      `NSAIDs — stomach ulcer risk`,
    ],
    algeria_brands: [
      `Corten 10mg`,
      `Corten 20mg`,
    ],
    pharmnet: {
        refundable: true,
        prescription_list: `Liste I`,
        lab: `BEIT JALA PHARMACEUTICALS Co`,
        generic_official: `HYDROCORTISONE`,
        notice_url: `https://pharmnet-dz.com/notice.ashx?id=508`,
        pharmnet_url: `https://pharmnet-dz.com/m-508-corten-1--creme-derm-t-15g`,
        dosage_variants: [
          {
            dosage: `1%**`,
            form: `CRÃME`,
            conditioning: `T/15G`,
            ppa: null
          }
        ]
      }
  },
  {
    name: `Apicarpin`,
    scientific_name: `Pilocarpine (eye drops)`,
    category: `Ophthalmology`,
    emoji: `👁️`,
    description: `Apicarpin eye drops contain pilocarpine, used to treat glaucoma and to constrict the pupil before eye surgery. One of the oldest effective glaucoma treatments.`,
    how_to_take: `Instill 1-2 drops in affected eye(s) 3-4 times daily. Press inner corner for 1 minute after instilling.`,
    side_effects: [
      `Dim vision (pupil constriction)`,
      `Brow ache`,
      `Eye irritation`,
      `Headache`,
    ],
    warnings: [
      `Vision will be dimmer — caution driving especially at night`,
      `Tell all doctors and dentists you use these drops`,
    ],
    interactions: [
      `Other cholinergic agents — additive effects`,
      `Anticholinergic drugs — reduce pilocarpine effectiveness`,
    ],
    algeria_brands: [
      `Apicarpin 1% eye drops`,
      `Apicarpin 2% eye drops`,
      `Apicarpin 4% eye drops`,
    ],
    pharmnet: {
        refundable: true,
        prescription_list: `Liste I`,
        lab: `AMMAN PHARMACEUTICAL INDUSTRIE`,
        generic_official: `PILOCARPINE`,
        notice_url: null,
        pharmnet_url: `https://pharmnet-dz.com/m-2351-apicarpin-0-01-colly-fl-10ml`,
        dosage_variants: [
          {
            dosage: `0.01`,
            form: `COLLY. SOL`,
            conditioning: `FL/10ML`,
            ppa: null
          },
          {
            dosage: `0.02`,
            form: `COLLY. SOL`,
            conditioning: `FL/10ML`,
            ppa: null
          }
        ]
      }
  },
  {
    name: `Bertocil`,
    scientific_name: `Betaxolol (eye drops)`,
    category: `Ophthalmology`,
    emoji: `👁️`,
    description: `Bertocil eye drops contain betaxolol, a cardioselective beta-blocker for glaucoma. Safer option than timolol for patients with asthma or COPD as it selectively targets beta-1 receptors.`,
    how_to_take: `Instill 1 drop in affected eye(s) twice daily. Press inner corner for 1 minute to reduce systemic absorption.`,
    side_effects: [
      `Stinging on instillation`,
      `Temporary blurred vision`,
      `Systemic effects less than timolol`,
    ],
    warnings: [
      `Still has some systemic beta-blocker effects — tell all doctors`,
      `Safer than timolol in respiratory disease but still monitor`,
    ],
    interactions: [
      `Oral beta-blockers — additive systemic effects (additive but less than timolol)`,
    ],
    algeria_brands: [
      `Bertocil 0.5% eye drops`,
    ],
    pharmnet: {
        refundable: true,
        prescription_list: `Liste I`,
        lab: `GROUPEMENT PHARMACEUTIQUE ALGERIEN (GPA)`,
        generic_official: `BETAXOLOL CHLORHYDRATE`,
        notice_url: null,
        pharmnet_url: `https://pharmnet-dz.com/m-5900-bertocil--5mg-ml-0-5-colly-fl-5ml`,
        dosage_variants: [
          {
            dosage: `( 5MG/ML) 0,5%`,
            form: `COLLY`,
            conditioning: `FL/5ML`,
            ppa: `198.35  DA`
          }
        ]
      }
  },
  {
    name: `Carteol LP`,
    scientific_name: `Carteolol (eye drops)`,
    category: `Ophthalmology`,
    emoji: `👁️`,
    description: `Carteol LP is a sustained-release carteolol beta-blocker eye drop for glaucoma. The LP (long-acting) formulation allows twice-daily dosing with improved tolerability.`,
    how_to_take: `Instill 1 drop twice daily. Press inner corner of eye for 1 minute after instilling.`,
    side_effects: [
      `Stinging`,
      `Blurred vision temporarily`,
      `Systemic beta-blocker effects`,
    ],
    warnings: [
      `Tell doctor about asthma or heart disease`,
      `Use nasolacrimal occlusion to reduce systemic absorption`,
    ],
    interactions: [
      `Oral beta-blockers — additive systemic effects`,
    ],
    algeria_brands: [
      `Carteol LP 1% eye drops`,
      `Carteol LP 2% eye drops`,
    ],
    pharmnet: {
        refundable: true,
        prescription_list: `Liste I`,
        lab: `CHAUVIN`,
        generic_official: `CARTEOLOL`,
        notice_url: `https://pharmnet-dz.com/notice.ashx?id=2368`,
        pharmnet_url: `https://pharmnet-dz.com/m-2368-carteol-lp-0-01-colly-en-sol-lp-fl-3ml`,
        dosage_variants: [
          {
            dosage: `0.01`,
            form: `COLLY. SOL. LP`,
            conditioning: `FL./3ML`,
            ppa: `448.68 DA`
          },
          {
            dosage: `0.02`,
            form: `COLLY. SOL. LP`,
            conditioning: `FL./3ML`,
            ppa: `587.82 DA`
          }
        ]
      }
  },
  {
    name: `Cosopt`,
    scientific_name: `Dorzolamide + Timolol (eye drops)`,
    category: `Ophthalmology`,
    emoji: `👁️`,
    description: `Cosopt combines two glaucoma medications in one convenient twice-daily eye drop: dorzolamide (carbonic anhydrase inhibitor) and timolol (beta-blocker) for patients needing two agents.`,
    how_to_take: `Instill 1 drop in affected eye(s) twice daily. Press inner corner for 1 minute after instilling.`,
    side_effects: [
      `Stinging or burning`,
      `Bitter taste`,
      `Blurred vision temporarily`,
      `Systemic beta-blocker effects`,
    ],
    warnings: [
      `Tell doctor about asthma, COPD, or heart disease`,
      `Remove contact lenses before instilling`,
    ],
    interactions: [
      `Oral carbonic anhydrase inhibitors — avoid combination`,
      `Oral beta-blockers — additive systemic effects`,
    ],
    algeria_brands: [
      `Cosopt 20mg/mL + 5mg/mL eye drops`,
    ],
    pharmnet: {
        refundable: true,
        prescription_list: `Liste I`,
        lab: `MERCK SCHARP & DOHME LTD`,
        generic_official: `DORZOLAMIDE CHLORHYDRATE EXPRIME EN DORZOLAMIDE / TIMOLOL MALEATE EXPRIME EN TIMOLOL`,
        notice_url: `https://pharmnet-dz.com/notice.ashx?id=2366`,
        pharmnet_url: `https://pharmnet-dz.com/m-2366-cosopt-20mg-5mg-ml-colly-en-sol-fl-5ml`,
        dosage_variants: [
          {
            dosage: `20MG/5MG/ML`,
            form: `COLLY. SOL`,
            conditioning: `FL./5ML`,
            ppa: `1004.20 DA`
          }
        ]
      }
  },
  {
    name: `Betamethasone-Acide Salicylique Novagenerics`,
    scientific_name: `Betamethasone + Salicylic Acid`,
    category: `Dermatology`,
    emoji: `🧴`,
    description: `This combination cream of betamethasone dipropionate and salicylic acid is used for thick, scaly inflammatory skin conditions like psoriasis. The salicylic acid helps remove scales allowing better penetration of betamethasone.`,
    how_to_take: `Apply a thin layer to affected skin once or twice daily. Rub in gently. Do not use under occlusive dressings.`,
    side_effects: [
      `Skin thinning with prolonged use`,
      `Local irritation`,
      `Salicylate absorption with extensive use`,
    ],
    warnings: [
      `Not for prolonged use especially on large areas`,
      `Not for face, underarms, or groin`,
      `Not for infected skin`,
    ],
    interactions: [
      `Systemic effects possible with extensive use — may affect blood sugar`,
    ],
    algeria_brands: [
      `Betamethasone-Acide Salicylique Novagenerics cream`,
    ],
    pharmnet: {
        refundable: true,
        prescription_list: `Liste I`,
        lab: `NOVAPHARM TRADING`,
        generic_official: `BETAMETHASONE DIPROPIONATE EXPRIME EN BETAMETHASONE / ACIDE SALICYLIQUE`,
        notice_url: null,
        pharmnet_url: `https://pharmnet-dz.com/m-502-betamethasone-acide-salicylique-novagenerics-0-05g-3g-100g-pde-derm-t-15g`,
        dosage_variants: [
          {
            dosage: `0,05G/3G/100G`,
            form: `PDE. DERM`,
            conditioning: `T/15G`,
            ppa: null
          }
        ]
      }
  },
  {
    name: `Canesten`,
    scientific_name: `Clotrimazole`,
    category: `Dermatology`,
    emoji: `🍄`,
    description: `Canesten is a clotrimazole antifungal for athlete's foot, ringworm, candidal skin infections, and vaginal thrush. Available as cream, powder, and vaginal tablets in Algeria.`,
    how_to_take: `Cream: apply 2-3 times daily to affected area. Continue for at least 2 weeks after symptoms clear. Vaginal: insert tablet at bedtime.`,
    side_effects: [
      `Local burning or stinging`,
      `Skin irritation`,
      `Rarely: allergic contact dermatitis`,
    ],
    warnings: [
      `Continue for full course even after symptoms improve`,
      `Keep skin dry`,
      `Vaginal tablets: avoid during menstruation`,
    ],
    interactions: [
      `Vaginal tablets may damage latex condoms and diaphragms`,
    ],
    algeria_brands: [
      `Canesten 1% cream`,
      `Canesten 1% powder`,
      `Canesten 500mg vaginal tablet`,
    ],
    pharmnet: {
        refundable: true,
        prescription_list: `N/D`,
        lab: `BAYER`,
        generic_official: `CLOTRIMAZOLE`,
        notice_url: `https://pharmnet-dz.com/notice.ashx?id=1688`,
        pharmnet_url: `https://pharmnet-dz.com/m-1688-canesten-1g-creme-derm-t-30g`,
        dosage_variants: [
          {
            dosage: `1G%`,
            form: `CRÃME`,
            conditioning: `T/30G`,
            ppa: null
          }
        ]
      }
  },
  {
    name: `Célestène Chronodose`,
    scientific_name: `Betamethasone (injectable)`,
    category: `Dermatology`,
    emoji: `🧴`,
    description: `Célestène Chronodose is a long-acting injectable betamethasone used by dermatologists and rheumatologists for intralesional, periarticular, or intramuscular injections for inflammatory conditions.`,
    how_to_take: `Administered by physician only — not for self-injection. Given intralesionally, periarticulary, or intramuscularly depending on indication.`,
    side_effects: [
      `Skin atrophy at injection site`,
      `Systemic corticosteroid effects with high doses`,
      `Post-injection flare (rare)`,
    ],
    warnings: [
      `Administered by healthcare professional only`,
      `Monitor blood sugar in diabetics`,
    ],
    interactions: [
      `Diabetes medications — dose adjustment may be needed`,
      `NSAIDs — stomach ulcer risk`,
    ],
    algeria_brands: [
      `Célestène Chronodose injectable 5.7mg/mL`,
    ],
    pharmnet: {
        refundable: true,
        prescription_list: `Liste I`,
        lab: `SCHERING PLOUGH`,
        generic_official: `BETAMETHASONE (ACETATE) / BETAMETHASONE  (PHOSPHATE DISODIQUE)`,
        notice_url: `https://pharmnet-dz.com/notice.ashx?id=630`,
        pharmnet_url: `https://pharmnet-dz.com/m-630-celestene-chronodose-2-7mg-3mg-amp-susp-inj-b-1amp--1seringue--2aiguilles`,
        dosage_variants: [
          {
            dosage: `2,7MG/3MG/AMP.`,
            form: `SUSP. INJ`,
            conditioning: `B/1AMP. +1SERINGUE + 2AIGUILLES`,
            ppa: `223.00 DA`
          }
        ]
      }
  },
  {
    name: `Curacne`,
    scientific_name: `Isotretinoin`,
    category: `Dermatology`,
    emoji: `🧴`,
    description: `Curacne is an Algerian-registered isotretinoin for severe or treatment-resistant acne. One of the most effective acne treatments available but requires careful monitoring and strict safety measures.`,
    how_to_take: `Take once or twice daily with a fatty meal. Dose based on body weight. Course typically 4-6 months.`,
    side_effects: [
      `Severe skin and lip dryness`,
      `Dry eyes`,
      `Elevated triglycerides and cholesterol`,
      `Mood changes`,
      `Liver effects`,
    ],
    warnings: [
      `ABSOLUTELY contraindicated in pregnancy — severe teratogen`,
      `Monthly pregnancy tests in females of childbearing age`,
      `Regular blood tests for liver and lipids`,
      `Mental health monitoring`,
    ],
    interactions: [
      `Vitamin A supplements — avoid (additive toxicity)`,
      `Tetracyclines — increased intracranial pressure risk (contraindicated)`,
    ],
    algeria_brands: [
      `Curacne 10mg`,
      `Curacne 20mg`,
    ],
    pharmnet: {
        refundable: true,
        prescription_list: `Liste I`,
        lab: `PIERRE FABRE DERMATOLOGIE`,
        generic_official: `ISOTRETINOINE`,
        notice_url: `https://pharmnet-dz.com/notice.ashx?id=528`,
        pharmnet_url: `https://pharmnet-dz.com/m-528-curacne-10mg-caps-molles-b-30`,
        dosage_variants: [
          {
            dosage: `10MG`,
            form: `CAPS. MOLLE`,
            conditioning: `B/30`,
            ppa: `2477.00 DA`
          },
          {
            dosage: `20MG`,
            form: `CAPS. MOLLE`,
            conditioning: `B/30`,
            ppa: null
          },
          {
            dosage: `5MG`,
            form: `CAPS. MOLLE`,
            conditioning: `B/30`,
            ppa: null
          }
        ]
      }
  },
  {
    name: `Adepal`,
    scientific_name: `Levonorgestrel + Ethinylestradiol`,
    category: `Gynecology`,
    emoji: `🩺`,
    description: `Adepal is a combined oral contraceptive pill registered in Algeria containing levonorgestrel and ethinylestradiol. Used for contraception and may improve menstrual regularity.`,
    how_to_take: `Take once daily for 21 days then 7-day break. Start on day 1 of period or as directed. Take at the same time each day.`,
    side_effects: [
      `Nausea`,
      `Breast tenderness`,
      `Headache`,
      `Mood changes`,
      `Irregular bleeding initially`,
      `Increased clotting risk`,
    ],
    warnings: [
      `Increased blood clot risk — especially in smokers over 35`,
      `Regular blood pressure monitoring`,
      `Report any severe headache, visual disturbances, or leg pain`,
    ],
    interactions: [
      `Rifampicin and anticonvulsants reduce effectiveness`,
      `St. Johns Wort reduces effectiveness`,
    ],
    algeria_brands: [
      `Adepal 21 tablets`,
    ],
    pharmnet: {
        refundable: true,
        prescription_list: `Liste I`,
        lab: `WYETH LEDERLE`,
        generic_official: `LEVONORGESTREL / ETHINYLESTRADIOL`,
        notice_url: `https://pharmnet-dz.com/notice.ashx?id=3040`,
        pharmnet_url: `https://pharmnet-dz.com/m-3040-adepal-0-15mg-0-03mg-blancs--et-0-20mg-0-04mg-rose-orange-comp-b-3x21-7blancs--14-rose-orange-`,
        dosage_variants: [
          {
            dosage: `0,15MG/0,03MG(BLANCS)  ET 0,20MG/0,04MG(ROSE ORANGE)`,
            form: `COMP`,
            conditioning: `B/3X21(7BLANCS + 14 ROSE ORANGE)`,
            ppa: null
          }
        ]
      }
  },
  {
    name: `Climene`,
    scientific_name: `Estradiol Valerate + Cyproterone`,
    category: `Gynecology`,
    emoji: `🩺`,
    description: `Climene is a sequential hormone replacement therapy combining estradiol valerate and cyproterone acetate for menopausal symptoms. Also used for polycystic ovary syndrome.`,
    how_to_take: `Take once daily continuously following the calendar pack instructions (different tablets for different days).`,
    side_effects: [
      `Breast tenderness`,
      `Nausea`,
      `Headache`,
      `Mood changes`,
      `Irregular bleeding initially`,
    ],
    warnings: [
      `Annual gynecological review essential`,
      `Increased blood clot risk`,
      `Regular mammography recommended with long-term use`,
    ],
    interactions: [
      `Rifampicin reduces effectiveness`,
      `Thyroid medication may need dose adjustment`,
    ],
    algeria_brands: [
      `Climene 21 + 7 tablet calendar pack`,
    ],
    pharmnet: {
        refundable: true,
        prescription_list: `Liste I`,
        lab: `SCHERING SA`,
        generic_official: `ESTRADIOL VALERATE / CYPROTERONE ACETATE`,
        notice_url: `https://pharmnet-dz.com/notice.ashx?id=3052`,
        pharmnet_url: `https://pharmnet-dz.com/m-3052-climene-2mg-1mg-comp-enro-b-21`,
        dosage_variants: [
          {
            dosage: `2MG/1MG`,
            form: `COMP. PELLI`,
            conditioning: `B/21`,
            ppa: null
          }
        ]
      }
  },
  {
    name: `Dermestril`,
    scientific_name: `Estradiol (transdermal)`,
    category: `Gynecology`,
    emoji: `🩺`,
    description: `Dermestril is a transdermal estradiol patch for hormone replacement therapy in menopausal women. Avoids first-pass liver metabolism providing more stable estradiol levels than oral HRT.`,
    how_to_take: `Apply patch to clean dry skin of lower abdomen or buttocks. Change every 3-4 days (or as prescribed). Rotate sites.`,
    side_effects: [
      `Skin irritation at patch site`,
      `Breast tenderness`,
      `Headache`,
      `Nausea`,
      `Irregular bleeding`,
    ],
    warnings: [
      `Always combine with progestogen if uterus is intact`,
      `Annual gynecological review essential`,
      `Increased blood clot risk`,
    ],
    interactions: [
      `Rifampicin reduces effectiveness`,
      `Thyroid medication dose may need adjustment`,
    ],
    algeria_brands: [
      `Dermestril 25mcg/24h patch`,
      `Dermestril 50mcg/24h patch`,
      `Dermestril 100mcg/24h patch`,
    ],
    pharmnet: {
        refundable: true,
        prescription_list: `Liste II`,
        lab: `SANOFI WINTHROP`,
        generic_official: `ESTRADIOL`,
        notice_url: `https://pharmnet-dz.com//notice.ashx?id=668`,
        pharmnet_url: `https://pharmnet-dz.com/m-624-dermestril-25Âµg-24h-patch-b-8`,
        dosage_variants: [
          {
            dosage: `25ÂµG/24H`,
            form: `PATCH`,
            conditioning: `B/8`,
            ppa: null
          }
        ]
      }
  },
  {
    name: `Desirett`,
    scientific_name: `Desogestrel`,
    category: `Gynecology`,
    emoji: `🩺`,
    description: `Desirett is an Algerian-registered desogestrel progestogen-only contraceptive for women who cannot use estrogen-containing contraceptives, including breastfeeding women.`,
    how_to_take: `Take one tablet daily at the same time each day without a break between packs. 12-hour window for late doses.`,
    side_effects: [
      `Irregular menstrual bleeding (very common)`,
      `Headache`,
      `Mood changes`,
      `Acne`,
      `Breast tenderness`,
    ],
    warnings: [
      `Take at same time daily — 12-hour window unlike most progestogen-only pills`,
      `Not 100% effective if taken more than 12 hours late`,
    ],
    interactions: [
      `Rifampicin and anticonvulsants reduce effectiveness`,
      `St. Johns Wort reduces effectiveness`,
    ],
    algeria_brands: [
      `Desirett 75mcg tablets`,
    ],
    pharmnet: {
        refundable: true,
        prescription_list: `Liste I`,
        lab: `EXELTIS GERMANY GMBH`,
        generic_official: `DESOGESTREL`,
        notice_url: `https://pharmnet-dz.com//notice.ashx?id=3062`,
        pharmnet_url: `https://pharmnet-dz.com/m-5842-desirett-0-075mg-comp-pell-b-28`,
        dosage_variants: [
          {
            dosage: `0,075 MG`,
            form: `COMP. PELLI`,
            conditioning: `B/28`,
            ppa: null
          }
        ]
      }
  },
  {
    name: `Ciafal`,
    scientific_name: `Tadalafil`,
    category: `Urology`,
    emoji: `🫀`,
    description: `Ciafal is an Algerian-registered tadalafil for erectile dysfunction and benign prostatic hyperplasia. The long duration of action (up to 36 hours) allows more spontaneous sexual activity compared to shorter-acting options.`,
    how_to_take: `For ED on-demand: 10-20mg at least 30 minutes before activity. Daily dose: 5mg once daily. For BPH: 5mg once daily.`,
    side_effects: [
      `Headache`,
      `Flushing`,
      `Dyspepsia`,
      `Back pain`,
      `Nasal congestion`,
      `Muscle aches`,
    ],
    warnings: [
      `Absolutely contraindicated with nitrates — fatal hypotension`,
      `Tell doctor about heart conditions`,
      `Seek care for erection lasting more than 4 hours`,
    ],
    interactions: [
      `Nitrates — ABSOLUTELY CONTRAINDICATED`,
      `Alpha-blockers — hypotension risk`,
      `CYP3A4 inhibitors increase tadalafil levels`,
    ],
    algeria_brands: [
      `Ciafal 5mg`,
      `Ciafal 10mg`,
      `Ciafal 20mg`,
    ],
    pharmnet: {
        refundable: true,
        prescription_list: `Liste I`,
        lab: `SOPHAL (SOCIETE PHARMACEUTIQUE ALGERIENNE)`,
        generic_official: `TADALAFIL`,
        notice_url: null,
        pharmnet_url: `https://pharmnet-dz.com/m-5933-ciafal-20mg-comp-pelli--b-2-`,
        dosage_variants: [
          {
            dosage: `20MG`,
            form: `COMP. PELLI`,
            conditioning: `B/02`,
            ppa: null
          },
          {
            dosage: `20MG`,
            form: `COMP. PELLI`,
            conditioning: `B/1`,
            ppa: null
          }
        ]
      }
  },
  {
    name: `Biodazole`,
    scientific_name: `Metronidazole`,
    category: `Infectious Disease`,
    emoji: `🦠`,
    description: `Biodazole is an Algerian-manufactured metronidazole for anaerobic bacterial infections, H. pylori eradication, protozoal infections, and bacterial vaginosis.`,
    how_to_take: `Take with food to reduce stomach upset. Complete the full course.`,
    side_effects: [
      `Metallic taste (very common)`,
      `Nausea`,
      `Headache`,
      `Diarrhea`,
      `Urine may turn dark (harmless)`,
    ],
    warnings: [
      `Absolutely avoid alcohol during treatment and 48 hours after — severe disulfiram-like reaction`,
      `Report numbness or tingling in hands or feet`,
    ],
    interactions: [
      `Alcohol — severe reaction (vomiting, flushing, rapid heartbeat)`,
      `Warfarin — greatly increased anticoagulant effect`,
      `Lithium — toxicity risk`,
    ],
    algeria_brands: [
      `Biodazole 250mg`,
      `Biodazole 500mg`,
    ],
    pharmnet: {
        refundable: true,
        prescription_list: `Liste I`,
        lab: `BIOPHARM`,
        generic_official: `METRONIDAZOLE`,
        notice_url: `https://pharmnet-dz.com//notice.ashx?id=896`,
        pharmnet_url: `https://pharmnet-dz.com/m-4338-biodazole-500mg-comp-pelli-b-20`,
        dosage_variants: [
          {
            dosage: `500MG`,
            form: `COMP. PELLI`,
            conditioning: `B/20`,
            ppa: null
          },
          {
            dosage: `500MG`,
            form: `SOL. INJ`,
            conditioning: `B/1FL. DE 100ML`,
            ppa: null
          }
        ]
      }
  },
  {
    name: `Birodogyl`,
    scientific_name: `Spiramycin + Metronidazole`,
    category: `Infectious Disease`,
    emoji: `🗣️`,
    description: `Birodogyl combines spiramycin and metronidazole for dental infections and oral bacterial infections. Widely used in Algerian dental practice for periodontal and dental abscesses.`,
    how_to_take: `Take 3 times daily for 5-7 days with food.`,
    side_effects: [
      `Metallic taste`,
      `Nausea`,
      `Diarrhea`,
      `Stomach discomfort`,
    ],
    warnings: [
      `Absolutely avoid alcohol during treatment and 48 hours after`,
      `Complete the full course`,
      `Tell dentist about all current medications`,
    ],
    interactions: [
      `Alcohol — severe disulfiram-like reaction`,
      `Warfarin — greatly increased anticoagulant effect`,
    ],
    algeria_brands: [
      `Birodogyl tablets`,
    ],
    pharmnet: {
        refundable: true,
        prescription_list: `Liste I`,
        lab: `SANOFI AVENTIS`,
        generic_official: `SPIRAMYCINE / METRONIDAZOLE`,
        notice_url: `https://pharmnet-dz.com/notice.ashx?id=845`,
        pharmnet_url: `https://pharmnet-dz.com/m-845-birodogyl-1-5mui-250mg-comp-pelli-b-10`,
        dosage_variants: [
          {
            dosage: `1,5MUI/250MG`,
            form: `COMP. PELLI`,
            conditioning: `B/10`,
            ppa: `384.00 DA`
          }
        ]
      }
  },
  {
    name: `Fagyx`,
    scientific_name: `Tinidazole`,
    category: `Infectious Disease`,
    emoji: `🦠`,
    description: `Fagyx is an Algerian-registered tinidazole for giardiasis, amoebic dysentery, bacterial vaginosis, trichomoniasis, and H. pylori eradication. Often effective as a shorter course than metronidazole.`,
    how_to_take: `Take with food to reduce stomach upset. Usually single dose (2g) or 3-5 day course depending on indication.`,
    side_effects: [
      `Metallic taste`,
      `Nausea`,
      `Stomach discomfort`,
      `Headache`,
      `Urine may darken (harmless)`,
    ],
    warnings: [
      `Absolutely avoid alcohol during treatment and 72 hours after — serious reaction`,
      `Not for first trimester of pregnancy`,
    ],
    interactions: [
      `Alcohol — severe disulfiram-like reaction (avoid for 72 hours after)`,
      `Warfarin — increased anticoagulant effect`,
    ],
    algeria_brands: [
      `Fagyx 500mg`,
    ],
    pharmnet: {
        refundable: true,
        prescription_list: `Liste I`,
        lab: `BIOCARE LABORATOIRES`,
        generic_official: `TINIDAZOLE`,
        notice_url: `https://pharmnet-dz.com/notice.ashx?id=2056`,
        pharmnet_url: `https://pharmnet-dz.com/m-2056-fagyx-500mg-comp-pelli-b-4`,
        dosage_variants: [
          {
            dosage: `500MG`,
            form: `COMP. PELLI`,
            conditioning: `B/4`,
            ppa: `200.00 DA`
          }
        ]
      }
  },
  {
    name: `Fluimucil`,
    scientific_name: `Acetylcysteine (nasal/ENT)`,
    category: `ENT`,
    emoji: `👃`,
    description: `Fluimucil is a registered acetylcysteine formulation used as an ENT mucolytic for sinusitis and thick nasal secretions. Thins mucus in the sinuses and airways for easier clearance.`,
    how_to_take: `Take as prescribed. Nasal solution: irrigate or use as drops. Oral sachets: dissolve in water.`,
    side_effects: [
      `Nausea`,
      `Nasal irritation`,
      `Sneezing`,
    ],
    warnings: [
      `Drink plenty of fluids to enhance effect`,
      `Bronchospasm possible in asthmatics with inhaled form`,
    ],
    interactions: [
      `Nitroglycerin — may increase hypotension`,
      `Do not mix with other medications in nebulizer`,
    ],
    algeria_brands: [
      `Fluimucil 200mg sachet`,
      `Fluimucil nasal solution`,
    ],
    pharmnet: {
        refundable: true,
        prescription_list: `N/D`,
        lab: `ZAMBON FRANCE`,
        generic_official: `N-ACETYLCYSTEINE`,
        notice_url: `https://pharmnet-dz.com/notice.ashx?id=1333`,
        pharmnet_url: `https://pharmnet-dz.com/m-1333-fluimucil-200mg-sachet-dose-granules-sol-buv-en-sachet-dose-b-30-sachets`,
        dosage_variants: [
          {
            dosage: `200MG/SACHET-DOSE`,
            form: `GRLES. SOL. BUV`,
            conditioning: `B/30 SACHETS`,
            ppa: `314.00 DA`
          }
        ]
      }
  },
  {
    name: `Hexalyse`,
    scientific_name: `Biclotymol + Lysozyme + Enoxolone`,
    category: `ENT`,
    emoji: `🗣️`,
    description: `Hexalyse is a triple-action throat lozenge combining an antiseptic (biclotymol), antibacterial enzyme (lysozyme), and anti-inflammatory (enoxolone) for comprehensive sore throat treatment.`,
    how_to_take: `Dissolve 1 lozenge slowly in the mouth every 2-3 hours. Maximum 8 lozenges per day.`,
    side_effects: [
      `Mild local irritation`,
      `Transient numbness`,
      `Rarely: allergic reactions`,
    ],
    warnings: [
      `Not for children under 6 years`,
      `Do not swallow whole`,
      `Not a substitute for antibiotics in bacterial infections`,
    ],
    interactions: [
      `No significant drug interactions at local application`,
    ],
    algeria_brands: [
      `Hexalyse lozenges`,
    ],
    pharmnet: {
        refundable: true,
        prescription_list: `N/D`,
        lab: `BOUCHARA-RECORDATI`,
        generic_official: `BICLOTYMOL/LYSOZYME/ENOXOLONE`,
        notice_url: `https://pharmnet-dz.com/notice.ashx?id=1936`,
        pharmnet_url: `https://pharmnet-dz.com/m-1936-hexalyse-5mg-5mg-5mg-comp-a-sucer-b-30`,
        dosage_variants: [
          {
            dosage: `5MG/5MG/5MG`,
            form: `COMP. A SUCER`,
            conditioning: `B/30`,
            ppa: `158.00 DA`
          }
        ]
      }
  },
  {
    name: `Rinoclenil`,
    scientific_name: `Beclometasone (nasal)`,
    category: `ENT`,
    emoji: `👃`,
    description: `Rinoclenil is an Algerian-registered intranasal beclometasone corticosteroid spray for allergic rhinitis, nasal polyps, and perennial rhinitis. Provides local anti-inflammatory action with minimal systemic absorption.`,
    how_to_take: `Spray 1-2 puffs into each nostril twice daily. Shake before use. Use regularly for best effect.`,
    side_effects: [
      `Nasal dryness`,
      `Nosebleeds`,
      `Headache`,
      `Throat irritation`,
    ],
    warnings: [
      `Do not spray directly at the nasal septum`,
      `Shake before each use`,
      `Use regularly — not just when symptomatic`,
    ],
    interactions: [
      `Ketoconazole may slightly increase systemic absorption`,
    ],
    algeria_brands: [
      `Rinoclenil 50mcg nasal spray`,
    ],
    pharmnet: {
        refundable: true,
        prescription_list: `Liste I`,
        lab: `CHIESI S.A.`,
        generic_official: `BECLOMETASONE DIPROPIONATE`,
        notice_url: `https://pharmnet-dz.com//notice.ashx?id=1943`,
        pharmnet_url: `https://pharmnet-dz.com/m-1941-rinoclenil-100Âµg-dose-susp-en-spray-nasale-fl-200doses`,
        dosage_variants: [
          {
            dosage: `100ÂµG/DOSE`,
            form: `SPRAY NAS`,
            conditioning: `FL./200DOSES`,
            ppa: null
          }
        ]
      }
  },
  {
    name: `Chibro-Cadron`,
    scientific_name: `Dexamethasone + Neomycin (eye/ear)`,
    category: `Oncology Support`,
    emoji: `💊`,
    description: `Chibro-Cadron combines dexamethasone and neomycin for ocular and ear inflammatory infections. Also used in oncology settings for inflammatory complications. Registered in Algeria.`,
    how_to_take: `Eye drops: instill 1-2 drops 4-6 times daily. Ear drops: instill 3-4 drops 3-4 times daily.`,
    side_effects: [
      `Increased intraocular pressure with prolonged use`,
      `Posterior subcapsular cataracts (long-term)`,
      `Masked infection signs`,
    ],
    warnings: [
      `Not for viral eye infections (herpes) or fungal infections`,
      `Monitor intraocular pressure with long-term use`,
      `Maximum 10 days use without specialist review`,
    ],
    interactions: [
      `Systemic corticosteroid interactions possible with prolonged use`,
    ],
    algeria_brands: [
      `Chibro-Cadron eye/ear drops`,
    ],
    pharmnet: {
        refundable: true,
        prescription_list: `Liste I`,
        lab: `THEA`,
        generic_official: `DEXAMETHASONE / NEOMYCINE`,
        notice_url: `https://pharmnet-dz.com/notice.ashx?id=2381`,
        pharmnet_url: `https://pharmnet-dz.com/m-2381-chibro-cadron-100mg-350000ui-100ml-colly-fl-5ml`,
        dosage_variants: [
          {
            dosage: `100MG/350000UI/100ML`,
            form: `COLLY`,
            conditioning: `FL/5ML`,
            ppa: `216.64 DA`
          }
        ]
      }
  },
  {
    name: `Dexafree`,
    scientific_name: `Dexamethasone (preservative-free)`,
    category: `Oncology Support`,
    emoji: `💊`,
    description: `Dexafree is a preservative-free dexamethasone eye drop solution for post-operative ocular inflammation and anterior segment inflammation. Preservative-free formulation reduces local toxicity.`,
    how_to_take: `Instill 1-2 drops in affected eye 4-6 times daily or as directed by ophthalmologist.`,
    side_effects: [
      `Elevated intraocular pressure with prolonged use`,
      `Posterior subcapsular cataracts`,
      `Delayed wound healing`,
    ],
    warnings: [
      `Monitor intraocular pressure`,
      `Not for viral or fungal eye infections`,
      `Taper rather than stop abruptly`,
    ],
    interactions: [
      `Few significant systemic interactions at ophthalmic doses`,
    ],
    algeria_brands: [
      `Dexafree 0.1% preservative-free eye drops`,
    ],
    pharmnet: {
        refundable: true,
        prescription_list: `Liste I`,
        lab: `THEA`,
        generic_official: `DEXAMETHASONE PHOSPHATE SODIQUE EXPRIME EN DEXAMETHASONE PHOSPHATE`,
        notice_url: `https://pharmnet-dz.com/notice.ashx?id=1985`,
        pharmnet_url: `https://pharmnet-dz.com/m-1985-dexafree-1mg-ml-collyre-b-30`,
        dosage_variants: [
          {
            dosage: `1MG/ML`,
            form: `COLLY`,
            conditioning: `B/30`,
            ppa: null
          }
        ]
      }
  },
];

module.exports = algerianMedications;