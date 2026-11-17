# stiklutamsinimas.eu

Stiklų tamsinimo verslo svetainė. **Astro 7** + **Tailwind CSS 4**: statiniai HTML puslapiai (nėra serverio ir duomenų bazės, kurių būtų galima nulaužti), automatiškai optimizuotos nuotraukos (AVIF/WebP), pilni SEO duomenys (schema.org, sitemap, RSS, Open Graph), šviesi / tamsi tema pagal paros laiką.

## Paleidimas kompiuteryje

Reikia [Node.js](https://nodejs.org) 22.23 ar naujesnės versijos.

```bash
npm install        # vieną kartą
npm run dev        # http://localhost:4321 – pakeitimai matomi iš karto
npm run build      # patikrina klaidas ir sukuria svetainę į dist/
npm run preview    # peržiūrėti dist/ versiją
```

`npm run build` pirmiausia paleidžia `astro check` – jei turinyje ar kode yra klaida (per ilgas aprašymas, neegzistuojanti nuotrauka ir pan.), svetainė **nesusikompiliuos**, todėl klaidos nepatenka į internetą.

## Kur kas yra

| Ką keisti | Failas |
|---|---|
| Telefonas, el. paštas, adresai, socialiniai tinklai, Messenger | `src/config/site.ts` |
| Paslaugų tekstai, kainos, DUK, kurios galerijos rodomos | `src/content/services/*.md` |
| Straipsniai (naujienos) | `src/content/naujienos/*.md` arba **/admin** |
| Plėvelių pavyzdžiai (pavadinimai, tamsumo %) | `src/data/films.ts` |
| Nuotraukų aprašymai (alt tekstai) | `src/data/galleries.ts` |
| Pagrindinio puslapio kainos | `src/components/sections/Pricing.astro` |
| Spalvos (šviesi ir tamsi tema) | `src/styles/global.css` |
| Logotipas ir ikonos | `src/assets/brand/` → `npm run icons` |
| Saugumo antraštės, peradresavimai | `public/_headers`, `public/_redirects` |

## Nuotraukos ir galerijos

Galerijos sudaromos **automatiškai iš aplankų** `src/assets/`:

| Aplankas | Kur rodoma |
|---|---|
| `darbai/` | Automobilių stiklų tamsinimas, pradžia |
| `pleveles/<plėvelė>/` | Plėvelių pavyzdžiai (sugrupuoti pagal tamsumą) |
| `zibintai/`, `zibintai/pries-po/` | Žibintų tamsinimas (+ prieš / po) |
| `poliravimas/` | Žibintų poliravimas |
| `matines/`, `veidrodines/`, `dekoravimas/` | Biurams ir namams, Stiklų dekoravimas |
| `reklama/lipdukai/`, `reklama/spauda/`, `reklama/pries-po/` | Reklamos darbai |

Nauja nuotrauka: įkelkite `.jpg` į aplanką (pavadinimas mažosiomis raidėmis, be lietuviškų raidžių, pvz. `audi-a4-tamsinti-stiklai.jpg`) ir įrašykite aprašymą `src/data/galleries.ts`. **Prieš įkeliant uždenkite automobilių numerius.**

## Naujo straipsnio rašymas (/admin)

1. Atidarykite **https://stiklutamsinimas.eu/admin** (arba `…pages.dev/admin`).
2. Pirmą kartą: GitHub → *Settings → Developer settings → Fine-grained tokens → Generate new token*, pasirinkite saugyklą `stiklutamsinimas`, leidimas **Contents: Read and write**. Nukopijuotą raktą įklijuokite į „Sign In Using Access Token“.
3. **Naujienos → New**: pavadinimas, aprašymas, nuotrauka, tekstas → **Save**.
4. Straipsnis įrašomas į GitHub, o Cloudflare per ~2 min. paskelbia jį svetainėje adresu `/straipsnio-pavadinimas`. Kiekviename straipsnyje automatiškai atsiranda dalinimosi mygtukai (Facebook, WhatsApp, Viber, X, el. paštas, nuorodos kopijavimas).

## Google atsiliepimai ir Instagram įrašai

Be papildomų nustatymų rodoma nuoroda į Google atsiliepimus ir jūsų darbų nuotraukos su nuoroda į Instagram. Kad būtų rodomi **tikri atsiliepimai ir naujausi Instagram įrašai**, Cloudflare Pages → projektas → **Settings → Variables and Secrets** pridėkite (tipas *Secret*):

| Kintamasis | Kur gauti |
|---|---|
| `GOOGLE_PLACES_API_KEY` | Google Cloud Console → įjungti *Places API (New)* → Credentials → API key |
| `GOOGLE_PLACE_ID` | [Place ID Finder](https://developers.google.com/maps/documentation/places/web-service/place-id) – susiraskite savo verslą |
| `INSTAGRAM_ACCESS_TOKEN` | Meta for Developers → Instagram API (Instagram Login) → ilgalaikis raktas (galioja 60 d., reikia atnaujinti) |

Duomenys paimami kiekvieno svetainės atnaujinimo metu; raktai į naršyklę nepatenka.

## Tiesioginis susirašinėjimas

Mygtukas „Parašykite mums“ atidaro **Messenger** (m.me nuoroda į Facebook puslapį), **WhatsApp**, **Viber**, skambutį ir el. paštą. Facebook „Customer Chat“ įskiepis Meta buvo išjungtas 2024 m., todėl naudojamos tiesioginės nuorodos – pokalbis iškart atsidaro Messenger programėlėje.

## Šviesi / tamsi tema

Automatiškai: **šviesi nuo saulėtekio iki saulėlydžio** (skaičiuojama Lietuvai), vakare – tamsi. Lankytojas gali pasirinkti ir pats (☀ / ◐ / ☾ viršuje) – pasirinkimas įsimenamas naršyklėje.

## Internetinė parduotuvė (paslėpta)

Paruošta, bet išjungta – nėra nei puslapių, nei nuorodų. Įjungimas: `src/config/site.ts` → `features.shop = true`, produktai `src/content/produktai/*.md` (`draft: false`). Krepšelį ir apmokėjimą (Stripe, Paysera) galima pridėti vėliau.

## Saugumas

- Statinė svetainė: nėra serverio kodo, duomenų bazės ar slaptažodžių svetainėje.
- **SSL (HTTPS)** – Cloudflare suteikia ir atnaujina automatiškai; HSTS įjungtas.
- Griežta turinio saugumo politika (CSP), apsauga nuo įterpimo į svetimus puslapius, `security.txt`.
- /admin neindeksuojamas; redaguoti gali tik turintys GitHub raktą.
- Rekomenduojama: GitHub paskyroje įjungti dviejų žingsnių patvirtinimą (2FA).

## Įkėlimas į internetą (Cloudflare Pages)

Kiekvienas `git push` į `main` šaką automatiškai atnaujina svetainę (~2–3 min.). Nustatymai: Framework `Astro`, Build `npm run build`, Output `dist`, Node versija – `.node-version`.

Kai svetainė bus baigta: Cloudflare → **Custom domains** → `stiklutamsinimas.eu` ir `www.stiklutamsinimas.eu`.

## Po paleidimo – SEO

- [ ] **Google Search Console**: pridėti domeną, pateikti `https://stiklutamsinimas.eu/sitemap-index.xml`.
- [ ] **Google Business Profile** kiekvienam adresui, nuoroda į `/kontaktai`.
- [ ] Prašyti klientų atsiliepimų Google.
- [ ] Patikrinti [Rich Results Test](https://search.google.com/test/rich-results) ir [PageSpeed Insights](https://pagespeed.web.dev).
