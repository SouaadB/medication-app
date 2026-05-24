"""
enrich_medications.py
─────────────────────────────────────────────────────────────────────────────
Enriches your algerianmedication.js with official Algerian pharmnet data.

HOW TO USE
──────────
1. Place this script in the same folder as:
      algerianmedication.js   ← your existing dictionary
      meds.json               ← DZ-Pharma-Data file
2. pip install pyjson5
3. python enrich_medications.py
4. Outputs:
      enriched_medications.js   → rename to algerianmedication.js
      pharmnet_lookup.json      → keep in backend/data/ for runtime use
"""

import json, re, sys
from collections import defaultdict
from pathlib import Path

try:
    import pyjson5
except ImportError:
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "pyjson5", "--break-system-packages", "-q"])
    import pyjson5

# ─── CONFIGURATION ───────────────────────────────────────────────────────────

PHARMNET_JSON   = Path("meds.json")
INPUT_DICT_PATH = Path("algerianMedications.js")
OUTPUT_PATH     = Path("enriched_Medications.js")

# Verified aliases: your dict name (UPPERCASE) → pharmnet commercial_name
# None = confirmed not in the Algerian registry
ALIASES = {
    # ── DIABETES ────────────────────────────────────────────────
    'NOVOMIX':      'NOVOMIX 30 FLEXPEN',
    'GLUCOR':       'GLUCOBAY',
    'NOVORAPID':    'NOVORAPID FLEXPEN',
    'GALVUS MET':   'GALVUS',
    'LEVEMIR':      'LEVEMIR FLEXPEN',
    'MIXTARD':      'MIXTARD 30HM',
    'AMARYL':       None,
    'TRAJENTA':     None,
    'ONGLYZA':      None,
    'FORXIGA':      None,
    'JARDIANCE':    None,
    'OZEMPIC':      None,
    'TRULICITY':    None,
    'HUMINSULIN':   None,
    'JANUMET':      None,
    'EUCREAS':      None,
    'INVOKANA':     None,

    # ── CARDIOLOGY ──────────────────────────────────────────────
    'TENORMINE':    'TENORMED',
    'KARDÉGIC':     'KARDEGIC',
    'KONAKION':     'KONAKION  MM',
    'LERCAN':       'LERCA',
    'LISINOPRIL':   'LISINOX',
    'ZOCOR':        None,
    'NORVASC':      None,
    'ADALATE':      None,
    'LODOZ':        None,
    'NATRILIX':     None,
    'CARDENSIEL':   None,
    'MONICOR':      None,
    'CONCOR':       None,
    'TRANDATE':     None,
    'TRITACE':      None,
    'ISOPTINE':     None,
    'PREVISCAN':    None,
    'NICORANDIL':   None,

    # ── THYROID ─────────────────────────────────────────────────
    'BASDÈNE':      'BASDENE',
    'THYROZOL':     None,
    'NÉOMERCAZOLE': None,
    'PROPYLEX':     None,
    'L-THYROXINE':  None,
    'IODE 131':     None,

    # ── RESPIRATORY ─────────────────────────────────────────────
    'SERETIDE':     'SERETIDE DISKUS',
    'SYMBICORT':    'SYMBICORT TURBUHALER',
    'ATROVENT':     'ATROVENT ADUL .',
    'RHINATHIOL':   'RHINATHIOL  ADULTE',
    'THÉOPHYLLINE': 'THEOPHYLLINE',
    'BERODUAL':     None,
    'ALVESCO':      None,
    'ONBREZ':       None,
    'ULTIBRO':      None,

    # ── PAIN / INFLAMMATION ─────────────────────────────────────
    'VOLTARÈNE':            'VOLTARENE',
    'BI-PROFÉNID':          'BIPROFENID',
    'MÉDROL':               'MEDROL',
    'HYDROCORTISONE':       'HYDROCORTISONE ROUSSEL',
    'TRAMADOL':             'TRAMADOL BEKER',
    'COLCHICINE':           'COLCHICINE OPOCALCIUM',
    'BÉTAMÉTHASONE CRÈME':  'BETAMETHASONE NOVAGENERICS',
    'CORTANCYL':            None,
    'ARCOXIA':              None,
    'BREXIN':               None,
    'COLTRAMYL':            None,
    'SOLPADOL':             None,

    # ── GASTRO ──────────────────────────────────────────────────
    'DÉBRIDAT':         'DEBRIDAT',
    'DOMPÉRIDONE':      'DOMPERIDONE',
    'MÉTOCLOPRAMIDE':   'METOCLOPRAMIDE',
    'HÉMORROÏDAL':      'HEMORECT',
    'CRÉON':            'CREON',
    'PANTOLOC':         'PANTODAR',
    'MOPRAL':           None,
    'PARIET':           None,
    'ANTACID MAGNÉ':    None,
    'NEXIUM':           None,

    # ── ANTIBIOTICS ─────────────────────────────────────────────
    'AMOXICILLINE':     'AMOXICILLINE EG',
    'PÉNICILLINE V':    'PENICILLINE-CIMEX',
    'NITROFURANTOÏNE':  'NITROCINE',
    'CIFLOX':           None,   # Ciprofloxacin ≠ Ciflodine (Folic acid)
    'BACTRIM':          None,   # Trimethoprim ≠ Bactroban (Mupirocin)
    'RIFAMPICINE':      None,   # Rifampicin ≠ Rifamycine Chibret
    'RULID':            None,
    'DOXYCYCLINE':      None,
    'ROCÉPHINE':        None,
    'AMIKACINE':        None,
    'PÉFLACINE':        None,

    # ── VITAMINS / SUPPLEMENTS ──────────────────────────────────
    'ACIDE FOLIQUE':            'ACIDE FOLIQUE - API',
    'VITAMINE B12':             'VITAMINE B1 B6 BGL',
    'POTASSIUM EFFERVESCENT':   'POTASSIUM GLUCONATE',
    'CALCIPRAT':                None,
    'FERO-GRAD':                None,
    'NEUROBION':                None,
    'VITAMINE D3':              None,
    'PHOSPHORE SANDOZ':         None,
    'OMÉGA 3':                  None,
    'ALVITYL':                  None,
    'BEFOL':                    None,
    'RÉÉQUILIBRE':              None,

    # ── NEUROLOGY ───────────────────────────────────────────────
    'TÉGRÉTOL':     'TEGRETOL',
    'PHENOBARBITAL': 'PHENOBARBIAL',
    'NEURONTIN':    None,   # Gabapentin ≠ Phenobarbital (NEUROLAL)
    'LAMICTAL':     None,
    'RIVOTRIL':     None,

    # ── PSYCHIATRY ──────────────────────────────────────────────
    'EFFEXOR':      'EFFEXOR LP',
    'TÉMÉSTA':      'TEMESTA',
    'SÉROPLEX':     None,
    'PROZAC':       None,
    'LEXOMIL':      None,
    'TERCIAN':      None,
    'ZYPREXA':      None,
    'IMOVANE':      None,
    'PAXIL':        None,
    'STABLON':      None,
    'URBANYL':      None,

    # ── UROLOGY ─────────────────────────────────────────────────
    'XATRAL':           'XATRAL LP',
    'JOSIR':            None,
    'CHIBRO-PROSCAR':   None,   # Finasteride ≠ Chibro-Cadron

    # ── BONE / EYE ──────────────────────────────────────────────
    'FOSAMAX':      None,
    'TIMOPTOL':     None,

    # ── DERMATOLOGY ─────────────────────────────────────────────
    'TERBINAFINE':  'TERBINAFINE BEKER',
    'DAKTARIN':     'DAKTAZOL',

    # ── MIGRAINE ────────────────────────────────────────────────
    'MIGRANAL':     None,   # DHE ≠ Migramol (Paracetamol)
    'IMIGRANE':     None,

    # ── ONCOLOGY / RHEUMATOLOGY ─────────────────────────────────
    'MÉTHOTREXATE': 'METHOTREXATE BELLON',
    'SALAZOPYRINE': 'SALAZOPYRIN EN',
    'SOMATULINE':   'SOMATULINE LP',
    'LEUCOVORINE':  'LEUCODININE B',
    'SYNACTHEN':    None,
    'ADALIMUMAB':   None,
    'ZOFRAN':       None,
    'MIFÉGYNE':     None,
    'PREMARIN':     None,
    'DECADRON':     None,   # Dexamethasone ≠ Deca-Durabolin (Nandrolone)
    'CYTOTEC':      None,   # Misoprostol ≠ Cytotam (Tamoxifen)

    # ── ANTIPARASITIC / ANTIMALARIAL ────────────────────────────
    'ZENTEL':       None,
    'ARALEN':       None,
    'MALARONE':     None,

    # ── ALLERGY ─────────────────────────────────────────────────
    'AERIUS':       None,
    'PHENERGAN':    None,

    # ── OTHER ────────────────────────────────────────────────────
    'SILYMARINE':       None,
    'STREPSILS':        None,
    'NAPHAZOLINE':      None,
    'CODIPRONT':        None,
    'IMODIUM':          None,
    'ACTIVATED CHARCOAL': None,
}

# ─── LOAD PHARMNET ───────────────────────────────────────────────────────────

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

# ─── BUILD ENRICHMENT BLOCK ──────────────────────────────────────────────────

def build_pharmnet_block(commercial_name):
    key = commercial_name.strip().upper()

    # Check alias map first
    if key in ALIASES:
        alias = ALIASES[key]
        if alias is None:
            return None          # confirmed not in registry
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
        "lab":               first.get("lab", {}).get("name"),
        "generic_official":  first.get("generic"),
        "notice_url":        first.get("notice"),
        "pharmnet_url":      first.get("link"),
        "dosage_variants":   dosage_variants,
    }

# ─── PARSE YOUR JS DICTIONARY ────────────────────────────────────────────────

print(f"Reading {INPUT_DICT_PATH}...")
js_source = INPUT_DICT_PATH.read_text(encoding="utf-8")
js_clean = re.sub(r"//[^\n]*", "", js_source)
js_clean = re.sub(r"const\s+\w+\s*=\s*", "", js_clean)
js_clean = re.sub(r";\s*module\.exports.*", "", js_clean).strip().rstrip(";")

try:
    medications = pyjson5.loads(js_clean)
    print(f"  Parsed {len(medications)} medications\n")
except Exception as e:
    print(f"ERROR: Could not parse JS file: {e}")
    sys.exit(1)

# ─── ENRICH ──────────────────────────────────────────────────────────────────

matched, unmatched = [], []
for med in medications:
    block = build_pharmnet_block(med.get("name", ""))
    med["pharmnet"] = block
    (matched if block else unmatched).append(med["name"])

# ─── WRITE ENRICHED JS ───────────────────────────────────────────────────────

def to_js_value(v, indent=0):
    pad   = "  " * indent
    inner = "  " * (indent + 1)
    if v is None:               return "null"
    if isinstance(v, bool):     return "true" if v else "false"
    if isinstance(v, (int, float)): return str(v)
    if isinstance(v, str):
        return "'" + v.replace("\\", "\\\\").replace("'", "\\'") + "'"
    if isinstance(v, list):
        if not v: return "[]"
        items = [f"{inner}{to_js_value(i, indent+1)}" for i in v]
        return "[\n" + ",\n".join(items) + f"\n{pad}]"
    if isinstance(v, dict):
        if not v: return "{}"
        parts = [f"{inner}{k}: {to_js_value(dv, indent+1)}" for k, dv in v.items()]
        return "{\n" + ",\n".join(parts) + f"\n{pad}}}"

def med_to_js(med, indent=2):
    pad   = "  " * indent
    inner = "  " * (indent + 1)
    parts = [f"{inner}{k}: {to_js_value(v, indent+1)}" for k, v in med.items()]
    return f"{pad}{{\n" + ",\n".join(parts) + f"\n{pad}}}"

print(f"Writing {OUTPUT_PATH}...")
lines = ["const algerianMedications = ["]
current_cat = None
for med in medications:
    cat = med.get("category", "")
    if cat != current_cat:
        current_cat = cat
        lines.append(f"\n  // ─── {cat.upper()} {'─' * max(0, 50 - len(cat))}────")
    lines.append(med_to_js(med) + ",")
lines.append("];\n")
lines.append("module.exports = algerianMedications;")
OUTPUT_PATH.write_text("\n".join(lines), encoding="utf-8")
print(f"  Done. {len(medications)} medications written.\n")

# ─── RUNTIME LOOKUP INDEX ────────────────────────────────────────────────────

lookup_path = Path("pharmnet_lookup.json")
print(f"Writing runtime lookup → {lookup_path}")
runtime = {}
for key, entries in index.items():
    first = entries[0]
    prices = [
        {"dosage": e.get("dosage"), "ppa": e.get("ppa")}
        for e in entries
        if e.get("ppa") and e["ppa"] not in ("--- DA", "", None)
    ]
    runtime[key] = {
        "refundable":   first.get("refundable"),
        "list":         first.get("list"),
        "lab":          first.get("lab", {}).get("name"),
        "generic":      first.get("generic"),
        "notice_url":   first.get("notice"),
        "pharmnet_url": first.get("link"),
        "prices":       prices,
    }
with open(lookup_path, "w", encoding="utf-8") as f:
    json.dump(runtime, f, ensure_ascii=False, indent=2)
print(f"  {len(runtime)} entries written.\n")

# ─── MATCH REPORT ────────────────────────────────────────────────────────────

print("=" * 60)
print("MATCH REPORT")
print("=" * 60)
print(f"✅ Matched:   {len(matched)} / {len(medications)}")
print(f"⚠️  Unmatched: {len(unmatched)} / {len(medications)}")
if unmatched:
    print("\nNot in Algerian registry (pharmnet: null):")
    for n in unmatched:
        print(f"  - {n}")
print("=" * 60)
print("\nDone! ✅")
print(f"→ Rename enriched_medications.js to algerianMedications.js")
print(f"→ Keep pharmnet_lookup.json in backend/src/data/")