# stiklutamsinimas.eu

Stiklų tamsinimo verslo svetainė. Sukurta su **Astro 7** + **Tailwind CSS 4**: statiniai HTML puslapiai, minimalus JavaScript, automatiškai optimizuoti paveikslėliai (AVIF/WebP), pilni SEO duomenys (schema.org, sitemap, Open Graph).

## Paleidimas savo kompiuteryje

Reikia [Node.js](https://nodejs.org) (22 ar naujesnės versijos).

```bash
npm install        # vieną kartą – įdiegia priklausomybes
npm run dev        # kūrimo režimas: http://localhost:4321 (pakeitimai matomi iš karto)
npm run build      # patikrina klaidas ir sukuria galutinę svetainę į dist/
npm run preview    # peržiūrėti galutinę (dist/) versiją
```

`npm run build` pirmiausia paleidžia `astro check`, todėl jei turinyje ar kode yra klaida (pvz. per ilgas SEO aprašymas, neegzistuojanti nuotrauka ar nuoroda į neegzistuojančią paslaugą), svetainė **nesusikompiliuos** ir parodys, kur klaida. Taip klaidos nepatenka į gyvą svetainę.

## Kur kas yra

| Ką keisti | Failas |
|---|---|
| Telefonas, el. paštas, adresai, WhatsApp/Viber | `src/config/site.ts` |
| Paslaugų tekstai, kainos, DUK, galerijos | `src/content/services/*.md` |
| Pagrindinis puslapis | `src/pages/index.astro` |
| Kontaktų puslapis | `src/pages/kontaktai.astro` |
| Spalvos ir šriftai | `src/styles/global.css` (`@theme`) |
| Nuotraukos | `src/assets/<kategorija>/` |
| Meniu ir poraštė | `src/components/layout/` |
| Seni adresai → nauji (301) | `public/_redirects` |
| Logotipas ir ikonos | `src/assets/brand/logo-s.png` → `npm run icons` |

## Kaip redaguoti paslaugą

Atidarykite `src/content/services/<paslauga>.md`. Viršuje (tarp `---`) yra struktūriniai duomenys:

- `seoTitle` / `seoDescription` – ką Google rodo paieškoje (iki 65 / 165 simbolių);
- `h1`, `lead` – puslapio antraštė ir įžanga;
- `prices` – kainos (rodomos ir pagrindiniame puslapyje, jei tai automobilių tamsinimas);
- `gallery` – nuotraukos su aprašymais (`alt` – svarbu SEO);
- `faq` – klausimai ir atsakymai (Google gali juos rodyti paieškoje);
- `related` – susijusios paslaugos apačioje.

Po `---` rašomas ilgesnis tekstas (Markdown formatu): `## Antraštė`, `**paryškinta**`, `[nuoroda](/kontaktai)`, `- sąrašas`.

### Nauja paslauga

1. Nukopijuokite esamą `.md` failą ir pervadinkite. **Failo pavadinimas = URL adresas** (pvz. `ppf-plevele.md` → `stiklutamsinimas.eu/ppf-plevele`).
2. Įkelkite nuotraukas į `src/assets/...` ir nurodykite kelią `cover` bei `gallery` laukuose.
3. Paslauga automatiškai atsiras meniu, poraštėje, paslaugų puslapyje, užklausos formoje ir sitemap.xml.

## Tinklaraštis (paruoštas ateičiai)

Tinklaraštis jau suprogramuotas, bet kol nėra publikuotų įrašų, jo nesimato.

1. Nukopijuokite `src/content/blog/pavyzdinis-irasas.md`, pervadinkite (failo pavadinimas = URL).
2. Parašykite turinį ir nustatykite `draft: false`.
3. Po `npm run build` automatiškai atsiras `/tinklarastis` puslapis, nuoroda meniu ir įrašai sitemap.xml.

Senos svetainės straipsnių tekstai išsaugoti `docs/senos-svetaines-tekstai.txt` – juos galima perrašyti ir publikuoti kaip naujus įrašus (tada atnaujinkite `public/_redirects`, kad senas adresas vestų į naują įrašą).

## E. parduotuvė (ateityje)

Architektūra tam paruošta:

- Prekės bus atskira turinio kolekcija (`src/content.config.ts` → `products`) ir puslapiai `/parduotuve/...`.
- Mokėjimams rekomenduojama **Stripe Checkout** arba **Shopify Storefront** – krepšelis ir mokėjimai vyksta jų pusėje, svetainė lieka greita ir saugi.
- Serveriui reikalingoms funkcijoms (užsakymų patvirtinimas, formų siuntimas) pridedamas `@astrojs/cloudflare` adapteris – likę puslapiai lieka statiniai.

## Įkėlimas į internetą (Cloudflare Pages – nemokamai)

1. Įkelkite projektą į GitHub (saugykla jau prijungta: `origin`).
2. [Cloudflare Dashboard](https://dash.cloudflare.com) → **Workers & Pages** → **Create** → **Pages** → prijunkite GitHub saugyklą.
3. Nustatymai: **Build command** `npm run build`, **Output directory** `dist`, aplinkos kintamasis `NODE_VERSION` = `22`.
4. **Custom domains** → pridėkite `stiklutamsinimas.eu` ir `www.stiklutamsinimas.eu` (www nukreipkite į pagrindinį).
5. Kiekvienas `git push` automatiškai atnaujins svetainę.

`public/_redirects` (301 peradresavimai) ir `public/_headers` (saugumo ir talpyklos antraštės) veikia Cloudflare Pages automatiškai.

## Po paleidimo – SEO darbai

- [ ] **Google Search Console**: pridėkite domeną, pateikite `https://stiklutamsinimas.eu/sitemap-index.xml`.
- [ ] **Google Business Profile** kiekvienam adresui (Kupiškis, Rokiškis, Panevėžys, Vilnius) – svarbiausia vietinei paieškai ir Google Maps. Nuoroda į svetainę – `https://stiklutamsinimas.eu/kontaktai`.
- [ ] Paprašykite klientų atsiliepimų Google – vėliau juos galima rodyti svetainėje.
- [ ] Patikrinkite struktūrinius duomenis: [Rich Results Test](https://search.google.com/test/rich-results).
- [ ] Patikrinkite greitį: [PageSpeed Insights](https://pagespeed.web.dev).
