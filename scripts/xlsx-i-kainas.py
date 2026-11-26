#!/usr/bin/env python3
"""
Excel kainininkas (stiklutamsinimas_eu_kainininkas-vX.xlsx) -> kainos.json

Naudojimas:
    python3 scripts/xlsx-i-kainas.py kainininkas.xlsx src/data/kainos.json

Jei kainos.json jau yra, išsaugomi jo nustatymai (pastabos, indeksavimas).
Iš Excel perrašomos tik pastatų plėvelių ir lipdukų kainos
(automobilių lapas skaičiuoklėje nenaudojamas).
Reikia: pip install openpyxl
"""
import json
import sys
from collections import Counter
from datetime import date
from pathlib import Path

import openpyxl

LAPAS_AUTO = "Automobiliai (2026–2030)"
LAPAS_PASTATAI = "Pastatų stiklai (2026–2030)"
LAPAS_LIPDUKAI = "Lipdukai (2026–2030)"
LAPAS_SUVESTINE = "Suvestinė ir infliacija"

# Kėbulų tipai, kai kliento modelio sąraše nėra (iš Excel A3 eilutės).
# "grupe" – pagal ką modeliai priskiriami priekinių stiklų kainoms skaičiuoti.
KEBULAI = [
    ("Hečbekas (2 durų)", 90, 90, ["Hečbekas (2 durų)"]),
    ("Hečbekas (4 durų)", 100, 100, ["Hečbekas (4 durų)"]),
    ("Kupė", 90, 110, ["Kupė"]),
    ("Sedanas / Universalas / Liftbekas", 110, 130, ["Sedanas", "Universalas", "Liftbekas"]),
    ("Visureigis (SUV)", 110, 130, ["Visureigis"]),
    ("Minivenas (MPV)", 120, 150, ["Vienatūris"]),
    ("Mikroautobusas", 155, 155, ["Mikroautobusas"]),
    ("Mikroautobusas (ilgintas)", 180, 180, ["Mikroautobusas (ilgintas)"]),
]


def num(v):
    if v is None or v == "":
        return None
    if isinstance(v, (int, float)):
        return int(round(v))
    raise ValueError(f"Ne skaičius: {v!r}")


def skaityti_auto(wb):
    ws = wb[LAPAS_AUTO]
    modeliai = []
    for r in range(7, ws.max_row + 1):
        marke = ws.cell(r, 1).value
        if not marke or str(marke).startswith("VIDUTINĖ"):
            continue
        modeliai.append({
            "marke": str(marke).strip(),
            "modelis": str(ws.cell(r, 2).value).strip(),
            "kebulas": str(ws.cell(r, 3).value or "").strip(),
            "metai": str(ws.cell(r, 4).value or "").strip(),
            "galas": num(ws.cell(r, 5).value),
            "durys_std": num(ws.cell(r, 6).value),
            "durys_sol": num(ws.cell(r, 7).value),
            "priekinis_std": num(ws.cell(r, 8).value),
            "priekinis_sol": num(ws.cell(r, 9).value),
        })
    modeliai.sort(key=lambda m: (m["marke"].replace("Š", "Sz"), m["modelis"]))
    return modeliai


def kebulai_is_modeliu(modeliai):
    """Kėbulų tipams parenka dažniausias priekinių stiklų kainas iš modelių."""
    out = []
    for pav, nuo, iki, raktai in KEBULAI:
        def tinka(m):
            k = m["kebulas"]
            if "ilgintas" in k:
                return raktai == ["Mikroautobusas (ilgintas)"]
            if raktai == ["Mikroautobusas (ilgintas)"]:
                return False
            return any(k.startswith(x) for x in raktai)
        grupe = [m for m in modeliai if tinka(m)] or modeliai
        def daz(lauk):
            return Counter(m[lauk] for m in grupe).most_common(1)[0][0]
        out.append({
            "pavadinimas": pav,
            "galas_nuo": nuo,
            "galas_iki": iki,
            "durys_std": daz("durys_std"),
            "durys_sol": daz("durys_sol"),
            "priekinis_std": daz("priekinis_std"),
            "priekinis_sol": daz("priekinis_sol"),
        })
    return out


def skaityti_pastatus(wb):
    ws = wb[LAPAS_PASTATAI]
    def eil(r):
        return ws.cell(r, 1).value, num(ws.cell(r, 4).value)
    min_kaina = eil(8)[1]
    pleveles = []
    for r, aprasymas, min_plotas in ((5, "Nuo saulės ir karščio, privatumas dieną", 2),
                                    (6, "Privatumui – ofisams, vonioms, namams", 2),
                                    (7, "Smėliuoto stiklo efektas", 2),
                                    (9, "Raštai, juostos, architektūrinis dekoras", 1)):
        pavadinimas, kaina = eil(r)
        pavadinimas = str(pavadinimas).split(" (")[0].strip()
        pleveles.append({"pavadinimas": pavadinimas, "aprasymas": aprasymas,
                         "kaina_m2": kaina, "min_kaina": min_kaina})
    return {"pleveles": pleveles, "senos_nuemimas_m2": eil(10)[1]}


def skaityti_lipdukus(wb):
    ws = wb[LAPAS_LIPDUKAI]
    k = lambda r: num(ws.cell(r, 5).value)
    tipai = [
        {"pavadinimas": "Ekonominė plėvelė (Oracal 641)", "aprasymas": "Vitrinoms, lentelėms, trumpalaikei reklamai (3–4 m.)", "kaina_m2": k(6)},
        {"pavadinimas": "Automobilinė plėvelė (Oracal 751/970)", "aprasymas": "Automobiliams, mikroautobusams, lauko reklamai (5–7 m.)", "kaina_m2": k(7)},
        {"pavadinimas": "Smulkūs / sudėtingi lipdukai", "aprasymas": "Smulkus tekstas (< 2 cm), sudėtingi logotipai", "kaina_m2": k(8)},
        {"pavadinimas": "Tik ploteriavimas (iš jūsų plėvelės)", "aprasymas": "Tik pjaustymas, be medžiagos ir išrinkinėjimo", "kaina_m2": k(5)},
    ]
    return {
        "tipai": tipai,
        "klijavimas_m2": k(9),
        "min_be_klijavimo": k(12),
        "min_su_klijavimu": k(13),
        "maketas": k(14),
        "senu_nuemimas_m2": k(15),
    }


NUMATYTA = {
    "atnaujinta": "",
    "kainu_metai": 2026,
    "pastaba": "Kainos orientacinės – tiksli kaina priklauso nuo automobilio modelio ir pasirinktos plėvelės. Ją pasakysime iš anksto.",
    "pvm_pastaba": "",
    "indeksavimas": {"ijungta": False, "bazes_metai": 2026, "metinis_proc": 10, "apvalinti_iki": 5},
}


def main():
    if len(sys.argv) < 3:
        print(__doc__)
        sys.exit(1)
    xlsx, out = Path(sys.argv[1]), Path(sys.argv[2])
    wb = openpyxl.load_workbook(xlsx)
    duom = json.loads(out.read_text(encoding="utf-8")) if out.exists() else json.loads(json.dumps(NUMATYTA))
    for k, v in NUMATYTA.items():
        duom.setdefault(k, v)
    infl = wb[LAPAS_SUVESTINE]["C5"].value
    if isinstance(infl, (int, float)):
        v = round(infl * 100, 2)
        duom["indeksavimas"]["metinis_proc"] = int(v) if float(v).is_integer() else v
    duom["pastatai"] = skaityti_pastatus(wb)
    duom["lipdukai"] = skaityti_lipdukus(wb)
    duom["atnaujinta"] = date.today().isoformat()
    # Raktų tvarka – kad failas būtų patogus skaityti
    tvarka = ["atnaujinta", "kainu_metai", "pastaba", "pvm_pastaba",
              "indeksavimas", "pastatai", "lipdukai"]
    duom = {k: duom[k] for k in tvarka if k in duom} | {k: v for k, v in duom.items() if k not in tvarka}
    out.write_text(json.dumps(duom, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Įrašyta: {out}")


if __name__ == "__main__":
    main()
