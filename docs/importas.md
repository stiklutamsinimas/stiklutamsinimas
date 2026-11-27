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
- **Kalba:** aprašymas paimamas ta kalba, kuria rodo tiekėjo svetainė. AliExpress ir Temu su Lietuvos nustatymais rodo lietuviškai; kitur – pataisykite tekstą prieš įkeldami.
- **Tiekėjo nuoroda ir kaina** išsaugomos prekėje (/admin → prekė → „Tiekėjo nuoroda“) – pirkėjai jų nemato. Kai klientas užsako, prekę užsakote pas tiekėją jo adresu.
- **Teisės:** AliExpress ir Alibaba prekių nuotraukas leidžia naudoti perpardavėjams. Amazon, eBay ir Temu nuotraukos bei tekstai dažnai priklauso pardavėjams – geriau naudokite savo nuotraukas ir perrašykite aprašymą.
- **Atsakomybė pirkėjui:** pardavėjas esate jūs – 14 dienų grąžinimas, garantija ir CE ženklinimas taikomi kaip ir kitoms prekėms. Pristatymo laiką iš Kinijos (dažnai 1–3 sav.) nurodykite prekės aprašyme.
- Jei tiekėjo svetainė pakeičia išvaizdą, kai kurie laukai gali likti tušti – tiesiog užpildykite juos rankiniu būdu.

## Techniškai

| Failas | Kas |
|---|---|
| `src/pages/admin/importas.astro` | Importo puslapis; mygtukas surenkamas iš `src/lib/import-extract.ts` |
| `src/lib/import-extract.ts` | Prekės atpažinimas (schema.org, og žymos, AliExpress/Amazon/eBay/Alibaba/Temu ypatumai) |
| `functions/api/importas/puslapis.ts` | Įklijuotos nuorodos parsiuntimas |
| `functions/api/importas/issaugoti.ts` | Nuotraukų atsisiuntimas ir įrašymas į GitHub (vienas commit'as prekei) |
| `src/server/shop/github.ts`, `import.ts` | GitHub API, patikros (tik tikri JPG/PNG/WebP/AVIF), .md failas |
| `functions/api/auth.ts`, `callback.ts` | Prisijungimas su GitHub (/admin ir importui) |
