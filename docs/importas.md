# Prekių importas (dropshipping) – stiklutamsinimas.eu/admin/importas

Prekės iš **AliExpress, Alibaba, Temu, eBay, Amazon** (ir daugumos kitų parduotuvių) perkeliamos į jūsų parduotuvę su pavadinimu, nuotraukomis, aprašymu, savybėmis – ir jūsų antkainiu.

## Pirmą kartą

1. Įjunkite prisijungimą su GitHub – žr. `docs/admin-prisijungimas.md`.
2. Kompiuteryje atidarykite **stiklutamsinimas.eu/admin/importas** → prisijunkite.
3. Įjunkite žymių juostą (**Ctrl + Shift + B**) ir **nutempkite** mygtuką **„➕ Į mano parduotuvę“** į ją.
4. Nustatykite **antkainį** (pvz. 100 % = tiekėjo kaina × 2), ar apvalinti iki ,99 ir ar skelbti iškart. Nustatymai įsimenami.

## Kasdien

1. Naršykite AliExpress / Temu / Amazon… Patikusios prekės puslapyje spauskite žymę **„➕ Į mano parduotuvę“**.
2. Atsidaro importo puslapis – prekė įdėta į sąrašą. Galite uždaryti ir tęsti – sąrašas išsaugomas (šioje naršyklėje).
3. Sąraše patikrinkite: pavadinimą (lietuviškai), kategoriją, kainą, kurias nuotraukas imti (iki 8), aprašymą.
4. **Įkelti į parduotuvę** → po ~2–3 min. prekės svetainėje. Daug prekių keliama vienu kartu – svetainė atnaujinama po paskutinės.

Nuorodas galima ir **įklijuoti** (puslapio skiltis „…arba įklijuokite nuorodas“), bet Amazon, Temu ir kartais AliExpress serveriams puslapio neduoda – tada naudokite mygtuką.

## Ką verta žinoti

- **Kainos ne eurais** (pvz. eBay USD) – pardavimo kainą įrašykite eurais patys.
- **Variantai** (spalvos, dydžiai) automatiškai neperkeliami – jei reikia, pridėkite /admin → prekė → „Variantai“.
- **Kalba:** pridėta prekė **automatiškai išverčiama į lietuvių kalbą** (pavadinimas, trumpas ir išsamus aprašymas, savybės) – prie prekės matysite „✓ Lietuviškai“. Jei tekstas jau lietuviškas – neverčiama. Vertimą galima pakartoti mygtuku „Versti iš naujo“; prieš įkeldami vis tiek peržiūrėkite tekstą. Vertimas veikia per Cloudflare Workers AI (žr. „Techniškai“).
- **Pristatymas:** importuotos prekės pažymimos „Siunčiama tiesiai iš tiekėjo“ – krepšelyje joms siūlomas tik „Pristatymas iš tiekėjo“ (į namų adresą, su tikru terminu). Pavadinimą, kainą ir terminą keiskite /admin → Nustatymai → Parduotuvė → „Pristatymas iš tiekėjo“.
- **Tiekėjo nuoroda ir kaina** išsaugomos prekėje (/admin → prekė → „Tiekėjo nuoroda“) – pirkėjai jų nemato. Kai klientas užsako, prekę užsakote pas tiekėją jo adresu.
- **Teisės:** AliExpress ir Alibaba prekių nuotraukas leidžia naudoti perpardavėjams. Amazon, eBay ir Temu nuotraukos bei tekstai dažnai priklauso pardavėjams – geriau naudokite savo nuotraukas ir perrašykite aprašymą.
- **Atsakomybė pirkėjui:** pardavėjas esate jūs – 14 dienų grąžinimas, garantija ir CE ženklinimas taikomi kaip ir kitoms prekėms.
- Jei tiekėjo svetainė pakeičia išvaizdą, kai kurie laukai gali likti tušti – tiesiog užpildykite juos rankiniu būdu.

## Techniškai

| Failas | Kas |
|---|---|
| `src/pages/admin/importas.astro` | Importo puslapis; mygtukas surenkamas iš `src/lib/import-extract.ts` |
| `src/lib/import-extract.ts` | Prekės atpažinimas (schema.org, og žymos, AliExpress/Amazon/eBay/Alibaba/Temu ypatumai) |
| `functions/api/importas/puslapis.ts` | Įklijuotos nuorodos parsiuntimas |
| `functions/api/importas/issaugoti.ts` | Nuotraukų atsisiuntimas ir įrašymas į GitHub (vienas commit'as prekei) |
| `functions/api/importas/versti.ts`, `src/server/shop/translate.ts` | Vertimas į lietuvių kalbą (Cloudflare Workers AI, modelis `@cf/openai/gpt-oss-120b`, atsarginiai – Mistral Small, Gemma 3) |
| `src/lib/lt-text.ts` | Ar tekstas jau lietuviškas |
| `src/server/shop/github.ts`, `import.ts` | GitHub API, patikros (tik tikri JPG/PNG/WebP/AVIF), .md failas |
| `functions/api/auth.ts`, `callback.ts` | Prisijungimas su GitHub (/admin ir importui) |

### Vertimo įjungimas (vieną kartą)

Cloudflare → **Workers & Pages → stiklutamsinimas → Settings → Bindings → Add → Workers AI**, pavadinimas (Variable name) **`AI`** → Save → **Deployments → Retry deployment**.
Nemokamai – 10 000 „neuronų“ per dieną (apie 40–60 prekių vertimų). Jei vertimas neįjungtas, importas veikia kaip anksčiau, o prie prekės rašoma „Neišversta“.
