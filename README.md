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
| Miestų puslapiai (/stiklu-tamsinimas-panevezys ir kt.) – tekstai, DUK, aplinkinės vietovės. Automobiliai – tik Kupiškis, Rokiškis, Panevėžys (`cars: true`); Vilnius, Kaunas – tik pastatai | `src/data/cities.ts` |
| Google Ads raktažodžių ir skelbimų planas | `docs/google-ads-planas.md` |
| Nuotraukų aprašymai (alt tekstai) | `src/data/galleries.ts` |
| Automobilių tamsinimo kainos (visur svetainėje) | `src/data/prices.ts` |
| Garantija, veiklos pradžios metai | `src/config/site.ts` (`warranty`, `foundedYear`) |
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
4. Straipsnis įrašomas į GitHub, o Cloudflare per ~2 min. paskelbia jį svetainėje adresu `/straipsnio-pavadinimas`. Kiekviename straipsnyje automatiškai atsiranda dalinimosi mygtukai (Facebook, Instagram, TikTok, YouTube ir nuorodos kopijavimas).

## Google atsiliepimai ir Instagram įrašai

**Atsiliepimai rodomi be jokių raktų ir mokesčių**: įvertinimas, skaičius ir atsiliepimų tekstai saugomi faile src/data/atsiliepimai.json – juos patogiausia keisti per **/admin → Atsiliepimai** (atsiradus naujam atsiliepimui Google). Žemiau aprašytas raktas – tik jei norite, kad atsiliepimai atsinaujintų visiškai automatiškai (Google reikalauja mokėjimo kortelės). Instagram įrašams be rakto rodomos jūsų darbų nuotraukos su nuoroda į Instagram. Raktai įrašomi **Cloudflare** → Workers & Pages → `stiklutamsinimas` → **Settings → Variables and Secrets → Add** (tipas *Secret*, aplinka *Production*), po to **Deployments → Retry deployment**.

### (Nebūtina) Automatiniai Google atsiliepimai – `GOOGLE_PLACES_API_KEY`

1. https://console.cloud.google.com → prisijunkite Google paskyra → sukurkite projektą (pvz. „stiklutamsinimas“).
2. **Billing** – pridėkite mokėjimo kortelę (Google to reikalauja; svetainė siunčia vos kelias užklausas per savaitę – tai telpa į nemokamą limitą).
3. **APIs & Services → Library** → raskite **Places API (New)** → **Enable**.
4. **APIs & Services → Credentials → Create credentials → API key**. Nukopijuokite raktą.
5. Rakto nustatymuose **API restrictions → Restrict key → Places API (New)** (saugumui).
6. Cloudflare įrašykite `GOOGLE_PLACES_API_KEY` = raktas. Jūsų verslo profilis surandamas automatiškai (jei rastų ne tą – papildomai įrašykite `GOOGLE_PLACE_ID`).

### Instagram įrašai – `INSTAGRAM_ACCESS_TOKEN`

1. Instagram programėlėje: **Nustatymai → Paskyros tipas** – turi būti *Profesionali* (Verslo arba Kūrėjo) paskyra.
2. https://developers.facebook.com → prisijunkite Facebook paskyra → **My Apps → Create App** → tipas *Business* (arba „Other“).
3. Programėlėje **Add product → Instagram** → **API setup with Instagram login**.
4. **Generate access tokens → Add account** → prisijunkite savo Instagram paskyra → **Generate token**. Nukopijuokite raktą.
5. Cloudflare įrašykite `INSTAGRAM_ACCESS_TOKEN` = raktas. Raktas galioja 60 d., bet kiekvieno svetainės atnaujinimo metu pratęsiamas automatiškai.

### Automatinis atnaujinimas kas savaitę (rekomenduojama)

Kad atsiliepimai ir Instagram įrašai atsinaujintų patys, o Instagram raktas nenustotų galioti:
1. Cloudflare → projektas → **Settings → Builds → Deploy hooks → Add** (pavadinimas „savaitinis“, šaka `main`) → nukopijuokite URL.
2. GitHub → saugykla → **Settings → Secrets and variables → Actions → New repository secret**: `CLOUDFLARE_DEPLOY_HOOK` = URL.

Kas pirmadienį svetainė bus perkurta automatiškai (`.github/workflows/savaitinis-atnaujinimas.yml`). Raktai į naršyklę nepatenka.

## Tiesioginis susirašinėjimas

Mygtukas „Parašykite mums“ atidaro **Messenger** (m.me nuoroda į Facebook puslapį), **WhatsApp**, **Viber**, skambutį ir el. paštą. Facebook „Customer Chat“ įskiepis Meta buvo išjungtas 2024 m., todėl naudojamos tiesioginės nuorodos – pokalbis iškart atsidaro Messenger programėlėje.

## Google Ads sekimas ir slapukų langas

Įdiegta, bet **išjungta**, kol `src/config/site.ts` → `googleAds.id` tuščias (arba nenustatytas Cloudflare kintamasis `PUBLIC_GOOGLE_ADS_ID`). Tada svetainė nenaudoja jokių slapukų ir lango nerodo.

Įrašius Google Ads ID (`AW-…`) ir konversijų žymes (`labels.call` – skambutis, `labels.lead` – žinutė / forma):
- apačioje kairėje atsiranda slapukų langas su vienodais „Sutinku“ / „Nesutinku“ mygtukais (ES reikalavimas);
- Google žyma įkeliama **tik paspaudus „Sutinku“** (Consent Mode v2), reklamos personalizavimas išjungtas;
- konversija skaičiuojama paspaudus telefono numerį, WhatsApp, Viber, Messenger, el. paštą ar išsiuntus užklausos formą;
- poraštėje atsiranda nuoroda „Slapukų nustatymai“, privatumo politikoje – slapukų aprašymas.

Instrukcija, kaip gauti ID ir žymes – `docs/google-ads-planas.md` („Konversijų sekimas“).

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

**Prijungus domeną būtinai** faile `astro.config.mjs` pakeiskite `DOMAIN_LIVE = false` į `true` (kad nuorodos, Facebook peržiūros ir Google duomenys vestų į stiklutamsinimas.eu, o ne į laikiną adresą). Po to [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) įveskite svetainės adresą ir spauskite „Scrape Again“ – Facebook pamirš seną „404“ peržiūrą.

## Po paleidimo – SEO

- [ ] **Google Search Console**: pridėti domeną, pateikti `https://stiklutamsinimas.eu/sitemap-index.xml`.
- [ ] **Google Business Profile** Rokiškiui ir Panevėžiui (Kupiškis jau yra), svetainės nuoroda – miesto puslapis, pvz. `/stiklu-tamsinimas-panevezys`.
- [ ] Prašyti klientų atsiliepimų Google.
- [ ] Patikrinti [Rich Results Test](https://search.google.com/test/rich-results) ir [PageSpeed Insights](https://pagespeed.web.dev).
