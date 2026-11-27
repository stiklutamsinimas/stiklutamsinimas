# Prisijungimas prie /admin (turinys, prekės, importas)

Svetainės turinys (straipsniai, prekės, nustatymai) saugomas **GitHub** saugykloje `stiklutamsinimas/stiklutamsinimas`.
Todėl prie **stiklutamsinimas.eu/admin** ir **stiklutamsinimas.eu/admin/importas** jungiamasi **GitHub paskyra** – ta pačia, kuria valdoma svetainė (`stiklutamsinimas`). Jokių atskirų slaptažodžių svetainėje nėra.

## Vieną kartą: įjungti mygtuką „Sign In with GitHub“ (~5 min.)

1. Prisijunkite prie **github.com** paskyra `stiklutamsinimas`. Pamiršote slaptažodį – **Forgot password** (atkūrimas el. paštu).
2. Atidarykite **https://github.com/settings/applications/new** ir užpildykite:
   - **Application name:** `stiklutamsinimas.eu administravimas`
   - **Homepage URL:** `https://stiklutamsinimas.eu`
   - **Authorization callback URL:** `https://stiklutamsinimas.eu/api/callback`
   - „Enable Device Flow“ – nežymėti.
   → **Register application**.
3. Nukopijuokite **Client ID**. Spauskite **Generate a new client secret** ir nukopijuokite jį (rodomas tik vieną kartą).
4. **Cloudflare** → Workers & Pages → `stiklutamsinimas` → **Settings → Variables and Secrets → Add** (aplinka *Production*):
   - `GITHUB_CLIENT_ID` = Client ID (tipas *Text*)
   - `GITHUB_CLIENT_SECRET` = client secret (tipas **Secret**)
   → **Save**.
5. **Deployments** → naujausias → **⋯ → Retry deployment** (kintamieji įsigalioja po naujo diegimo, ~2 min.).

## Kaip prisijungti

- **stiklutamsinimas.eu/admin** → **Sign In with GitHub** → (pirmą kartą) **Authorize**. Naršyklė prisijungimą atsimena.
- **stiklutamsinimas.eu/admin/importas** – jei jau prisijungėte prie /admin toje pačioje naršyklėje, prisijungta automatiškai; jei ne – **Prisijungti su GitHub**.

Kitas žmogus (pvz. darbuotojas) galės prisijungti tik jei jį pakviesite: GitHub → saugykla → **Settings → Collaborators → Add people**.

## Atsarginis būdas – GitHub raktas

Jei mygtukas dar neįjungtas: GitHub → **Settings → Developer settings → Fine-grained tokens → Generate new token** → saugykla `stiklutamsinimas`, leidimas **Contents: Read and write** → nukopijuotą raktą įklijuokite /admin lange **Sign In Using Access Token** (arba importo puslapyje „Turite GitHub raktą?“).

## Rekomendacija: padarykite saugyklą privačią

Saugykla dabar **vieša** – bet kas GitHub'e gali matyti svetainės failus, o importuotų prekių faile – ir **tiekėjo nuorodą bei kainą**. Svetainė veiks lygiai taip pat ir su privačia saugykla:
GitHub → saugykla → **Settings → General → Danger Zone → Change repository visibility → Private**.
