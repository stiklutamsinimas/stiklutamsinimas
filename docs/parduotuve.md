# Internetinė parduotuvė – stiklutamsinimas.eu/parduotuve

Dvi kategorijos: **Plėvelės** (`/parduotuve/pleveles`) ir **Įrankiai** (`/parduotuve/irankiai`).
Meniu nuoroda „Parduotuvė“ ir krepšelio ženkliukas atsiranda **automatiškai, kai paskelbiama pirma prekė**. Kol prekių nėra, parduotuvė nerodoma meniu ir neįtraukiama į Google.

## 1. Prekių kėlimas

1. Atidarykite **stiklutamsinimas.eu/admin** → **Parduotuvė – prekės**.
2. Paprasčiausia: atidarykite pavyzdį („PAVYZDYS – automobilio tamsinimo plėvelė“ arba „PAVYZDYS – mentelė…“) → **Duplicate** (Kopijuoti) → pakeiskite duomenis → **nuimkite „Juodraštis“** → **Save**.
   Arba: **New Prekė** ir užpildykite viską nuo pradžių.
3. Po ~2 min. prekė bus svetainėje.

| Laukas | Patarimas |
|---|---|
| Pavadinimas | Su raktažodžiais: „Saulės kontrolės plėvelė Silver 20“, ne „Plėvelė 1“. Iš jo sudaromas adresas. |
| Kategorija | Plėvelės arba Įrankiai |
| Kaina, € | Galutinė kaina pirkėjui. Jei variantų kainos skiriasi – mažiausia. |
| Matavimo vienetas | Plėvelėms metrais – „m“ (kaina už 1 m), įrankiams – „vnt.“ |
| Mažiausias kiekis | Pvz. plėvelę parduodate nuo 2 m – įrašykite 2 |
| Nuotraukos | Pirma – pagrindinė. Kvadratinės (pvz. 1200×1200) atrodo geriausiai. Be automobilių numerių. |
| Variantai | Pvz. tamsumas (5 %, 15 %, 35 %) arba plotis (76 cm, 152 cm). Kitokia kaina – tik jei skiriasi. |
| Techniniai duomenys | Šviesos pralaidumas, plotis, storis, garantija – rodoma lentele |
| Turime sandėlyje | Nuėmus varnelę prekė rodoma „Laikinai nėra“ ir jos nupirkti negalima |
| Populiari / Eiliškumas | Kurios prekės rodomos pirmiau |

## 2. Nustatymai (prieš paskelbiant pirmą prekę)

**/admin → Nustatymai → Parduotuvė – pristatymas, apmokėjimas, rekvizitai**

- [ ] **Pardavėjo rekvizitai** – įmonės pavadinimas ir kodas (arba vardas, pavardė ir individualios veiklos nr.), adresas, PVM kodas (jei esate PVM mokėtojas). Įstatymas reikalauja juos nurodyti – rodoma `/pirkimo-taisykles`.
- [ ] **Pristatymo kainos** – dabar įrašytos **pavyzdinės**: paštomatas 3,50 €, kurjeris 5,90 €. Įrašykite savo (pagal LP Express / Omniva / DPD sutartį).
- [ ] **Banko rekvizitai** (gavėjas, IBAN) – tada pirkėjas, pasirinkęs pavedimą, rekvizitus pamatys iškart. Jei tuščia – rašoma, kad sąskaitą atsiųsite el. paštu.
- [ ] Peržiūrėkite **/pirkimo-taisykles** (grąžinimas, pristatymas) – jei reikia ką pakeisti, parašykite.
- [ ] Nemokamas pristatymas nuo tam tikros sumos – jei norite (0 – išjungta).

## 3. Kaip ateina užsakymai

| Kas įjungta | Kas vyksta pateikus užsakymą |
|---|---|
| **Niekas (dabar)** | Pirkėjas mato „Liko paskutinis žingsnis“ ir užsakymą jums išsiunčia vienu paspaudimu – el. paštu, WhatsApp arba Viber (kaip užklausos forma). Apmokėjimas – pavedimu arba atsiimant. |
| **+ El. laiškai (Resend)** | Užsakymas ateina į jūsų el. paštą automatiškai, pirkėjas gauna patvirtinimą su užsakymo nr. (ir banko rekvizitais). |
| **+ Paysera ir (ar) Stripe** | Pirkėjas iškart apmoka el. bankininkyste ar kortele. Jūs gaunate laišką „Naujas užsakymas“, o apmokėjus – „APMOKĖTA: užsakymas …“. |

Kiekvienas užsakymas turi numerį, pvz. **261125-7K3Q** (data + 4 simboliai). Kainas serveris perskaičiuoja pats – naršyklėje pakeista kaina neturi įtakos.

Visi kintamieji įrašomi: **Cloudflare → Workers & Pages → stiklutamsinimas → Settings → Variables and Secrets** (Production). Raktai – tipas **Secret**. Įrašius – **Deployments → naujausias → Retry deployment** (kintamieji įsigalioja po naujo diegimo).

### 3.1. El. laiškai – Resend (nemokamai iki 3000 laiškų/mėn.)

1. Užsiregistruokite **resend.com** → **Domains → Add domain** → `stiklutamsinimas.eu`.
2. Resend parodys kelis DNS įrašus – įrašykite juos **Cloudflare → DNS**. **Esamų Zoho pašto įrašų (MX, SPF) neliesti** – Resend įrašai jiems netrukdo.
3. Kai domenas „Verified“ – **API Keys → Create API key** (teisė „Sending access“).
4. Cloudflare kintamieji:
   - `RESEND_API_KEY` = `re_…` (Secret)
   - `ORDER_EMAIL_FROM` = `Stiklų tamsinimas <uzsakymai@stiklutamsinimas.eu>`
   - `ORDER_EMAIL_TO` = kur siųsti užsakymus (nebūtina – numatyta steponas@stiklutamsinimas.eu)

### 3.2. Paysera (Lietuvos bankai + kortelės)

1. **paysera.lt → Verslui → Mokėjimų surinkimas** – sudarykite sutartį, sukurkite projektą su svetaine `stiklutamsinimas.eu`.
2. Jei Paysera prašo patvirtinti svetainę (failu ar meta žyma) – atsiųskite man, įdėsiu.
3. Projekto nustatymuose rasite **projekto ID** ir **parašo slaptažodį** (sign password).
4. Cloudflare kintamieji:
   - `PAYSERA_PROJECT_ID` = projekto numeris
   - `PAYSERA_SIGN_PASSWORD` = slaptažodis (Secret)
   - `PAYSERA_TEST` = `1` – bandymams (pinigai nenuskaičiuojami). Išbandę pakeiskite į `0`.
5. Atsakymo (callback) adreso nustatyti nereikia – svetainė jį perduoda pati: `https://stiklutamsinimas.eu/api/mokejimas/paysera`.

### 3.3. Stripe (kortelės, Apple Pay, Google Pay)

1. **stripe.com** – paskyra, patvirtinkite įmonę.
2. **Developers → API keys** → Secret key (`sk_live_…`, bandymams `sk_test_…`).
3. **Developers → Webhooks → Add endpoint**: `https://stiklutamsinimas.eu/api/mokejimas/stripe`, įvykiai `checkout.session.completed` ir `checkout.session.async_payment_succeeded` → nukopijuokite **Signing secret** (`whsec_…`).
4. Cloudflare kintamieji: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` (abu Secret).

> El. mokėjimai krepšelyje atsiranda tik tada, kai įjungti ir **el. laiškai** – kitaip užsakymo turinys (kokios prekės, kur siųsti) jūsų nepasiektų.

### Kaip išbandyti

1. Įjunkite bandomąjį režimą (`PAYSERA_TEST=1` arba Stripe `sk_test_…` raktus).
2. Paskelbkite prekę, įdėkite į krepšelį, pateikite užsakymą ir apmokėkite (Stripe bandomoji kortelė: 4242 4242 4242 4242, bet kokia ateities data ir CVC).
3. Turite gauti 2 laiškus: „Naujas užsakymas …“ ir „[BANDYMAS] APMOKĖTA …“.

## 4. Techniškai (programuotojui)

| Failas | Kas |
|---|---|
| `src/content/produktai/*.md` | Prekės (redaguojamos per /admin) |
| `src/data/parduotuve.json` | Pristatymas, rekvizitai (per /admin) |
| `src/lib/shop.ts` | Kategorijos, prekių sąrašai, katalogas |
| `src/lib/shop-core.ts` | Kainų skaičiavimas, patikros, užsakymo tekstas (bendras naršyklei ir serveriui) |
| `src/pages/parduotuve/*` | Puslapiai, krepšelis, `katalogas.json` |
| `src/scripts/cart.ts` | Krepšelis naršyklėje (localStorage) |
| `functions/api/*` | Cloudflare Pages Functions: `uzsakymas`, `mokejimai`, `mokejimas/paysera`, `mokejimas/stripe` |
| `src/server/shop/*` | El. laiškai (Resend), Paysera, Stripe, MD5 |

Nauja kategorija: `src/lib/shop.ts` (`shopCategories`) + `src/content.config.ts` (`category` enum) + `public/admin/config.yml` (pasirinkimai).
Išjungti parduotuvę visai: `src/config/site.ts` → `features.shop = false`.
