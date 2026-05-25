"""
enrich_medications.py  — fixed version
Handles apostrophes and special characters in medication descriptions.
"""

import json, re, sys
from collections import defaultdict
from pathlib import Path

try:
    import pyjson5
except ImportError:
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "pyjson5",
                           "--break-system-packages", "-q"])
    import pyjson5

PHARMNET_JSON   = Path("meds.json")
INPUT_DICT_PATH = Path("algerianMedications.js")
OUTPUT_PATH     = Path("enriched_Medications.js")

ALIASES = {
    "NOVOMIX":              "NOVOMIX 30 FLEXPEN",
    "NOVORAPID":            "NOVORAPID FLEXPEN",
    "LEVEMIR":              "LEVEMIR FLEXPEN",
    "MIXTARD":              "MIXTARD 30HM",
    "GALVUS MET":           "GALVUS",
    "LERCAN":               "LERCA",
    "KONAKION":             "KONAKION  MM",
    "THYROZOL":             "ATHYROZOL",
    "SERETIDE":             "SERETIDE DISKUS",
    "SYMBICORT":            "SYMBICORT TURBUHALER",
    "ATROVENT":             "ATROVENT ADUL .",
    "RHINATHIOL":           "RHINATHIOL  ADULTE",
    "TRAMADOL":             "TRAMADOL BEKER",
    "HYDROCORTISONE":       "HYDROCORTISONE ROUSSEL",
    "COLCHICINE":           "COLCHICINE OPOCALCIUM",
    "NEXIUM":               "INEXIUM",
    "AMOXICILLINE":         "AMOXICILLINE EG",
    "VITAMINE D3":          "VITAMINE D3 B.O.N",
    "ACIDE FOLIQUE":        "ACIDE FOLIQUE - API",
    "VITAMINE B12":         "VITAMINE B12 RAZES",
    "EFFEXOR":              "EFFEXOR LP",
    "XATRAL":               "XATRAL LP",
    "SOMATULINE":           "SOMATULINE LP",
    "TERBINAFINE":          "TERBINAFINE BEKER",
    "MÉTOCLOPRAMIDE":       "CLOPRAMID",
    "KARDÉGIC":             "KARDEGIC",
    "VOLTARÈNE":            "VOLTARENE",
    "DÉBRIDAT":             "DEBRIDAT",
    "TÉGRÉTOL":             "TEGRETOL",
    "MÉTHOTREXATE":         "METHOTREXATE BELLON",
    "PÉNICILLINE V":        "PENICILLINE-CIMEX",
    "BI-PROFÉNID":          "BIPROFENID",
    "DAKTARIN":             "DAKTAZOL",
    "LEUCOVORINE":          "LEUCODININE B",
    "VITAMINE C":           "VITAMINE C 500MG",
    "VITAMAG":              "VITAMAG",
    "TARDYFERON":           "TARDYFERON",
    "SMECTA":               "SMECTA",
    "NIFUROXAZIDE":         "NIFUROXAZIDE",
    "FORLAX":               "FORLAX",
    "DUPHALAC":             "DUPHALAC",
    "METEOSPASMYL":         "METEOSPASMYL",
    "GAVISCON":             "GAVISCON",
    "DAFLON":               "DAFLON",
    "URSOLVAN":             "URSOLVAN",
    "AUGMENTIN":            "AUGMENTIN",
    "ZOMAX":                "ZOMAX",
    "OFLOCET":              "OFLOCET",
    "TAVANIC":              "TAVANIC",
    "ZINNAT":               "ZINNAT",
    "FLAGYL":               "FLAGYL",
    "JOSACINE":             "JOSACINE",
    "ROVAMYCINE":           "ROVAMYCINE",
    "KEFORAL":              "KEFORAL",
    "ISONIAZIDE":           "ISONIAZIDE",
    "CUTACNYL":             "CUTACNYL",
    "LAMISIL":              "LAMISIL",
    "PLAQUENIL":            "PLAQUENIL",
    "DEPAKINE":             "DEPAKINE",
    "HALDOL":               "HALDOL",
    "RISPERDAL":            "RISPERDAL",
    "STILNOX":              "STILNOX",
    "LAROXYL":              "LAROXYL",
    "ANAFRANIL":            "ANAFRANIL",
    "ZOLOFT":               "ZOLOFT",
    "SURMONTIL":            "SURMONTIL",
    "TEMESTA":              "TEMESTA",
    "ACTONEL":              "ACTONEL",
    "DOSTINEX":             "DOSTINEX",
    "XALATAN":              "XALATAN",
    "DUPHASTON":            "DUPHASTON",
    "UTROGESTAN":           "UTROGESTAN",
    "CLOMID":               "CLOMID",
    "FASIGYNE":             "FASIGYNE",
    "NIVAQUINE":            "NIVAQUINE",
    "ZYRTEC":               "ZYRTEC",
    "CLARITYNE":            "CLARITYNE",
    "NASONEX":              "NASONEX",
    "AVAMYS":               "AVAMYS",
    "POLARAMINE":           "POLARAMINE",
    "HEXASPRAY":            "HEXASPRAY",
    "RHINOFLUIMUCIL":       "RHINOFLUIMUCIL",
    "TOPLEXIL":             "TOPLEXIL",
    "SALAZOPYRINE":         "SALAZOPYRIN EN",
    "PLAVIX":               "PLAVIX",
    "SINTROM":              "SINTROM",
    "TAHOR":                "TAHOR",
    "COVERSYL":             "COVERSYL",
    "APROVEL":              "APROVEL",
    "TAREG":                "TAREG",
    "AMLOR":                "AMLOR",
    "SECTRAL":              "SECTRAL",
    "LASILIX":              "LASILIX",
    "ALDACTONE":            "ALDACTONE",
    "MICARDIS":             "MICARDIS",
    "COZAAR":               "COZAAR",
    "RENITEC":              "RENITEC",
    "SPIROZIDE":            "SPIROZIDE",
    "CATAPRESSAN":          "CATAPRESSAN",
    "HYZAAR":               "HYZAAR",
    "EXFORGE":              "EXFORGE",
    "ATACAND":              "ATACAND",
    "CORDARONE":            "CORDARONE",
    "TILDIEM":              "TILDIEM",
    "VASTAREL":             "VASTAREL",
    "PROCORALAN":           "PROCORALAN",
    "EZETROL":              "EZETROL",
    "LESCOL":               "LESCOL",
    "CRESTOR":              "CRESTOR",
    "LIPANTHYL":            "LIPANTHYL",
    "DIGOXINE":             "DIGOXINE",
    "XARELTO":              "XARELTO",
    "ELIQUIS":              "ELIQUIS",
    "PRADAXA":              "PRADAXA",
    "LEVOTHYROX":           "LEVOTHYROX",
    "BASDÈNE":              "BASDENE",
    "VENTOLINE":            "VENTOLINE",
    "SPIRIVA":              "SPIRIVA",
    "FOSTER":               "FOSTER",
    "FLIXOTIDE":            "FLIXOTIDE",
    "BRICANYL":             "BRICANYL",
    "PULMICORT":            "PULMICORT",
    "SINGULAIR":            "SINGULAIR",
    "SOLMUCOL":             "SOLMUCOL",
    "DOLYC":                "DOLYC",
    "PROFENID":             "PROFENID",
    "CELEBREX":             "CELEBREX",
    "ACUPAN":               "ACUPAN",
    "DEXAMETHASONE":        "DEXAMETHASONE",
    "LYRICA":               "LYRICA",
    "INEXIUM":              "INEXIUM",
    "PANTOLOC":             "PANTODAR",
    "MOPRAL":               None,
    "INEXIUM":              "INEXIUM",
    "MEDROL":               "MEDROL",
    "LANTUS":               "LANTUS",
    "JANUVIA":              "JANUVIA",
    "STAGID":               "STAGID",
    "VICTOZA":              "VICTOZA",
    "ACTOS":                "ACTOS",
    "HUMALOG":              "HUMALOG",
    "DIAMICRON":            "DIAMICRON",
    "GALVUS":               "GALVUS",

    # Confirmed not in registry
    "GLUCOR":None,"AMARYL":None,"TRAJENTA":None,"ONGLYZA":None,
    "FORXIGA":None,"JARDIANCE":None,"OZEMPIC":None,"TRULICITY":None,
    "HUMINSULIN":None,"JANUMET":None,"EUCREAS":None,"INVOKANA":None,
    "TENORMINE":None,"NORVASC":None,"ADALATE":None,"LODOZ":None,
    "NATRILIX":None,"CONCOR":None,"TRANDATE":None,"TRITACE":None,
    "LISINOPRIL":None,"ZOCOR":None,"CARDENSIEL":None,"MONICOR":None,
    "ISOPTINE":None,"PREVISCAN":None,"NICORANDIL":None,"NÉOMERCAZOLE":None,
    "PROPYLEX":None,"L-THYROXINE":None,"IODE 131":None,"BERODUAL":None,
    "THÉOPHYLLINE":None,"ALVESCO":None,"ONBREZ":None,"ULTIBRO":None,
    "CODIPRONT":None,"SPASFON":None,"CORTANCYL":None,"ARCOXIA":None,
    "BREXIN":None,"COLTRAMYL":None,"SOLPADOL":None,"MÉDROL":None,
    "NEURONTIN":None,"ALLOPURINOL":None,"FÉBURIC":None,"MYOLASTAN":None,
    "PARIET":None,"DOMPÉRIDONE":None,"ANTACID MAGNÉ":None,
    "HÉMORROÏDAL":None,"CRÉON":None,"SILYMARINE":None,"IMODIUM":None,
    "ACTIVATED CHARCOAL":None,"CIFLOX":None,"RULID":None,
    "DOXYCYCLINE":None,"ROCÉPHINE":None,"AMIKACINE":None,
    "RIFAMPICINE":None,"NITROFURANTOÏNE":None,"PÉFLACINE":None,
    "BACTRIM":None,"CALCIPRAT":None,"FERO-GRAD":None,"NEUROBION":None,
    "PHOSPHORE SANDOZ":None,"POTASSIUM EFFERVESCENT":None,"OMÉGA 3":None,
    "ALVITYL":None,"BEFOL":None,"RÉÉQUILIBRE":None,"LAMICTAL":None,
    "RIVOTRIL":None,"PHENOBARBITAL":None,"SÉROPLEX":None,"PROZAC":None,
    "LEXOMIL":None,"TERCIAN":None,"ZYPREXA":None,"IMOVANE":None,
    "PAXIL":None,"STABLON":None,"TÉMÉSTA":None,"URBANYL":None,
    "MIGRANAL":None,"IMIGRANE":None,"JOSIR":None,"CHIBRO-PROSCAR":None,
    "FOSAMAX":None,"SYNACTHEN":None,"BÉTAMÉTHASONE CRÈME":None,
    "ADALIMUMAB":None,"ZOFRAN":None,"DECADRON":None,"MIFÉGYNE":None,
    "PREMARIN":None,"CYTOTEC":None,"ZENTEL":None,"ARALEN":None,
    "MALARONE":None,"AERIUS":None,"PHENERGAN":None,"STREPSILS":None,
}

# ── LOAD PHARMNET ─────────────────────────────────────────────────────────────
print("Loading pharmnet data...")
with open(PHARMNET_JSON, encoding="utf-8") as f:
    raw = json.load(f)
all_entries = [med for letter in raw.values() for med in letter]
print(f"  {len(all_entries)} total entries loaded")

index = defaultdict(list)
for entry in all_entries:
    key = entry.get("commercial_name", "").strip().upper()
    if key:
        index[key].append(entry)
print(f"  {len(index)} unique commercial names indexed\n")

# ── BUILD PHARMNET BLOCK ──────────────────────────────────────────────────────
def build_pharmnet_block(commercial_name):
    key = commercial_name.strip().upper()
    if key in ALIASES:
        alias = ALIASES[key]
        if alias is None:
            return None
        lookup_key = alias.upper()
    else:
        lookup_key = key

    matches = index.get(lookup_key, [])
    if not matches:
        return None

    first = matches[0]
    dosage_variants = []
    for m in matches:
        ppa = m.get("ppa")
        if ppa in ("--- DA", "", None):
            ppa = None
        dosage_variants.append({
            "dosage":       m.get("dosage"),
            "form":         m.get("form"),
            "conditioning": m.get("conditioning"),
            "ppa":          ppa,
        })

    return {
        "refundable":        first.get("refundable"),
        "prescription_list": first.get("list"),
        "lab":               first.get("lab", {}).get("name") if isinstance(first.get("lab"), dict) else first.get("lab"),
        "generic_official":  first.get("generic"),
        "notice_url":        first.get("notice"),
        "pharmnet_url":      first.get("link"),
        "dosage_variants":   dosage_variants,
    }

# ── PARSE JS — using node.js to avoid Python parser issues ───────────────────
print(f"Reading {INPUT_DICT_PATH} via Node.js...")
import subprocess, tempfile, os

node_script = """
const fs = require('fs');
const src = fs.readFileSync('algerianMedications.js', 'utf8');
// Execute the module
const m = {};
const fn = new Function('module','exports', src + '\\nmodule.exports = module.exports || exports;');
fn(m, m);
const meds = m.exports || require('./algerianMedications');
fs.writeFileSync('C:/Users/HP/AppData/Local/Temp/meds_parsed.json', JSON.stringify(meds), 'utf8');
console.log('Parsed:', meds.length, 'medications');
"""

with open('C:/Users/HP/AppData/Local/Temp/parse_meds.js', 'w') as f:
    f.write(node_script)

result = subprocess.run(
    ['node', 'C:/Users/HP/AppData/Local/Temp/parse_meds.js'],
    capture_output=True, text=True,
    cwd=str(INPUT_DICT_PATH.parent)
)
if result.returncode != 0:
    print(f"Node error: {result.stderr}")
    sys.exit(1)

print(f"  {result.stdout.strip()}")
with open('C:/Users/HP/AppData/Local/Temp/meds_parsed.json', encoding='utf-8') as f:
    medications = json.load(f)
print(f"  Loaded {len(medications)} medications\n")

# ── ENRICH ────────────────────────────────────────────────────────────────────
matched, unmatched = [], []
for med in medications:
    block = build_pharmnet_block(med.get("name", ""))
    med["pharmnet"] = block
    (matched if block else unmatched).append(med["name"])

# ── WRITE OUTPUT as JSON-compatible JS ───────────────────────────────────────
print(f"Writing {OUTPUT_PATH}...")

def js_str(s):
    """Safely encode a string for JS using backtick template literals."""
    if s is None:
        return 'null'
    s = str(s)
    # escape backticks and backslashes
    s = s.replace('\\', '\\\\').replace('`', '\\`').replace('${', '\\${')
    return f'`{s}`'

def to_js(v, indent=0):
    pad   = '  ' * indent
    inner = '  ' * (indent + 1)
    if v is None:               return 'null'
    if isinstance(v, bool):     return 'true' if v else 'false'
    if isinstance(v, (int, float)): return str(v)
    if isinstance(v, str):      return js_str(v)
    if isinstance(v, list):
        if not v: return '[]'
        items = [f'{inner}{to_js(i, indent+1)}' for i in v]
        return '[\n' + ',\n'.join(items) + f'\n{pad}]'
    if isinstance(v, dict):
        if not v: return '{}'
        parts = [f'{inner}{k}: {to_js(dv, indent+1)}' for k, dv in v.items()]
        return '{\n' + ',\n'.join(parts) + f'\n{pad}}}'
    return 'null'

lines = ['const algerianMedications = [']
current_cat = None
for med in medications:
    cat = med.get('category', '')
    if cat != current_cat:
        current_cat = cat
        lines.append(f'\n  // ─── {cat.upper()} ───────────────────────────────────────────────────────────')
    inner = '  '
    parts = [f'{inner}  {k}: {to_js(v, 2)}' for k, v in med.items()]
    lines.append(f'  {{\n' + ',\n'.join(parts) + f'\n  }},')

lines.append('];\n')
lines.append('module.exports = algerianMedications;')
OUTPUT_PATH.write_text('\n'.join(lines), encoding='utf-8')
print(f"  Written {len(medications)} medications to {OUTPUT_PATH}\n")

# ── REPORT ────────────────────────────────────────────────────────────────────
print('=' * 60)
print('MATCH REPORT')
print('=' * 60)
print(f'✅ With pharmnet data: {len(matched)}')
print(f'⚪ pharmnet: null:     {len(unmatched)}')
print(f'Total:                {len(medications)}')
print('=' * 60)
print(f'\nDone! → copy enriched_Medications.js to algerianMedications.js')
