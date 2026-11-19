# Dirbtinio intelekto (AI) paieška – stiklutamsinimas.eu

Kad ChatGPT, Google AI apžvalgos (Gemini), Microsoft Copilot, Perplexity ir Claude, paklausti
„kur Panevėžyje patamsinti automobilio stiklus?“, rastų ir rekomenduotų stiklutamsinimas.eu.

## Kas jau padaryta svetainėje

- **Visi AI robotai įleidžiami** – `robots.txt` aiškiai leidžia ChatGPT, Google, Bing/Copilot, Perplexity, Claude, Apple ir kitų robotams (uždrausta tik /admin).
- **/llms.txt** – AI skirta svetainės santrauka: faktai, kainos, adresai, rajonai, paslaugos, DUK, straipsniai ir trumpas aprašymas anglų kalba. Sugeneruojama automatiškai iš svetainės turinio – pakeitus kainas ar paslaugas atsinaujina pati.
- **/apie-mus** – visi svarbiausi faktai vienoje vietoje (nuo 2007 m., dirbtuvės, garantija, plėvelės, kainos, įvertinimas).
- **Struktūriniai duomenys (schema.org)** – įmonė, 4 padaliniai su adresais ir aptarnaujamomis vietovėmis, paslaugos, kainų katalogas, DUK, straipsniai.
- **Ilgos ištraukos leidžiamos** – Google AI apžvalgos gali cituoti visą atsakymą.
- **Sitemap su straipsnių datomis** – Bing (ChatGPT, Copilot) ir Google žino, kas nauja.
- Svetainė statinė – AI robotai mato visą tekstą be JavaScript.

> Kol svetainė veikia laikiname adrese (*.pages.dev), ji sąmoningai neindeksuojama. Visas poveikis – **prijungus domeną stiklutamsinimas.eu**. AI paieškose rezultatai paprastai pasirodo po 2–8 savaičių.

## Ką padaryti jums (prijungus domeną)

### 1. Bing Webmaster Tools – SVARBIAUSIA ChatGPT ir Copilot
ChatGPT paieška ir Microsoft Copilot remiasi **Bing** paieška.
1. Eikite į https://www.bing.com/webmasters ir prisijunkite Google paskyra.
2. Pasirinkite **„Importuoti iš Google Search Console“** (paprasčiausia) arba pridėkite svetainę rankiniu būdu.
3. **Sitemaps** → pateikite `https://stiklutamsinimas.eu/sitemap-index.xml`.

### 2. Google Search Console – Gemini ir Google AI apžvalgos
1. https://search.google.com/search-console → pridėkite domeną `stiklutamsinimas.eu`.
2. Pateikite `https://stiklutamsinimas.eu/sitemap-index.xml`.

### 3. Cloudflare – neužblokuokite AI robotų
Cloudflare naujiems domenams kartais **pagal nutylėjimą blokuoja AI robotus**. Prijungus domeną:
1. Cloudflare → jūsų domenas → **AI Crawl Control** (arba *Security → Bots*).
2. Įsitikinkite, kad **„Block AI bots“ išjungta**, o paieškos robotai (OAI-SearchBot, ChatGPT-User, PerplexityBot, Claude-SearchBot, Googlebot, Bingbot) – **Allow**.
3. **„Managed robots.txt“ neįjunkite** – svetainė turi savo `robots.txt`.
4. **Caching → Configuration → Crawler Hints → On** – Cloudflare automatiškai praneš Bing ir kitoms paieškoms apie naujus straipsnius (IndexNow).

### 4. Google verslo profiliai (AI žemėlapių atsakymai)
Klausimus „kur netoliese…“ AI atsako remdamasis Google ir Bing žemėlapiais.
- Sukurkite profilius **Rokiškiui ir Panevėžiui** (Kupiškis jau yra). Svetainės nuoroda – miesto puslapis.
- **Bing Places** (https://www.bingplaces.com) – galima importuoti iš Google verslo profilio per kelias minutes. Tai tiesiogiai naudoja Copilot ir ChatGPT.
- Pavadinimas, adresas ir telefonas **visur turi būti vienodi** (svetainėje, Google, Bing, Facebook, kataloguose).

### 5. Atsiliepimai
AI dažnai rekomenduoja įmones su daugiausia gerų atsiliepimų. Po kiekvieno darbo paprašykite atsiliepimo Google ir kad klientas paminėtų paslaugą bei miestą („tamsino galinius stiklus Panevėžyje“).

### 6. Paminėjimai kitur
AI labiau pasitiki įmone, kurią mini ir kitos svetainės. Įrašykite įmonę (vienodais duomenimis, su nuoroda į stiklutamsinimas.eu) į Lietuvos įmonių katalogus, pvz. rekvizitai.lt, 118.lt, imones.lt, ir užpildykite Facebook puslapio „Apie“ skiltį.

### 7. Straipsniai
Naujus straipsnius (/admin) rašykite kaip **atsakymus į klausimus**: antraštėje – klausimas („Kiek kainuoja…?“, „Ar galima…?“), **pirmame sakinyje – trumpas tiesus atsakymas**, toliau – detalės. AI būtent tokius tekstus cituoja dažniausiai.

## Kaip patikrinti

Praėjus kelioms savaitėms po domeno prijungimo paklauskite (su įjungta paieška):
- ChatGPT: „Kur Panevėžyje patamsinti automobilio stiklus ir kiek kainuoja?“
- Perplexity: „automobilio stiklų tamsinimas Kupiškis“
- Google (AI režimas / AI apžvalga): „stiklų tamsinimas Rokiškis kaina“
- Copilot: „langų plėvelė nuo saulės Vilnius“

Taip pat galite atidaryti `https://stiklutamsinimas.eu/llms.txt` – ten matysite, ką apie jus „skaito“ AI.
