/**
 * Galerijų nuotraukos ir jų aprašymai (alt tekstai – svarbūs Google paieškai ir neregiams).
 *
 * Kaip pridėti nuotrauką:
 *  1. Įkelkite .jpg į atitinkamą aplanką, pvz. src/assets/darbai/audi-a4-tamsinti-stiklai.jpg
 *  2. (Rekomenduojama) įrašykite aprašymą žemiau ALT sąraše.
 *     Jei aprašymo nėra – jis sudaromas iš galerijos pavadinimo.
 * Rikiavimas: pirmiausia rodomos nuotraukos tokia tvarka, kokia surašyta ALT sąraše.
 */
import type { ImageMetadata } from 'astro';
import { galleryTitles, type GalleryFolder } from './gallery-folders';

const files = import.meta.glob<{ default: ImageMetadata }>('/src/assets/**/*.{jpg,jpeg,png,webp}', { eager: true });

export interface GalleryImage {
  src: ImageMetadata;
  alt: string;
  /** Kelias be plėtinio, pvz. „darbai/audi-q7-tamsinti-galiniai-stiklai“ */
  key: string;
}

export const ALT: Record<string, string> = {
  // ---- Automobilių stiklų tamsinimas – atlikti darbai
  'darbai/audi-q7-tamsinti-galiniai-stiklai': 'Baltas Audi Q7 su tamsintais galiniais stiklais',
  'darbai/range-rover-sport-pilkas': 'Pilkas Range Rover Sport su tamsintais galiniais langais',
  'darbai/jaguar-f-pace-raudonas': 'Raudonas Jaguar F-Pace su tamsintais stiklais',
  'darbai/dodge-challenger-tamsinti-langai': 'Violetinis Dodge Challenger su tamsintais langais',
  'darbai/bmw-ix1-tamsinti-stiklai': 'BMW iX1 su tamsintais galiniais stiklais',
  'darbai/maserati-granturismo-tamsinti-stiklai': 'Maserati GranTurismo su tamsintu galiniu stiklu',
  'darbai/jaguar-i-pace-tamsinti-langai': 'Jaguar I-Pace su tamsintais galiniais langais',
  'darbai/land-rover-discovery-sport-raudonas': 'Raudonas Land Rover Discovery Sport su tamsintais langais',
  'darbai/mercedes-s-klase-tamsinti-stiklai': 'Mercedes-Benz S klasė su tamsintais stiklais',
  'darbai/volvo-xc60-tamsinti-stiklai': 'Baltas Volvo XC60 su tamsintais galiniais stiklais',
  'darbai/skoda-kodiaq-tamsinti-stiklai': 'Škoda Kodiaq su tamsintais galiniais stiklais',
  'darbai/hyundai-tucson-tamsinti-stiklai': 'Baltas Hyundai Tucson su tamsintais langais',
  'darbai/land-rover-discovery-sport': 'Mėlynas Land Rover Discovery Sport su tamsintais galiniais stiklais',
  'darbai/jaguar-e-pace-tamsinti-stiklai': 'Baltas Jaguar E-Pace su tamsintais galiniais stiklais',
  'darbai/bmw-x1-baltas-tamsinti-stiklai': 'Baltas BMW X1 su tamsintais galiniais stiklais',
  'darbai/skoda-octavia-raudona': 'Raudona Škoda Octavia universalas su tamsintais stiklais',
  'darbai/jaguar-f-pace-tamsinti-stiklai': 'Juodas Jaguar F-Pace su tamsintais galiniais stiklais',
  'darbai/tesla-model-s-priekis': 'Tesla Model S po stiklų tamsinimo',
  'darbai/mercedes-e-klase-tamsinti-stiklai': 'Mercedes-Benz E klasė su tamsintais galiniais stiklais',
  'darbai/audi-q8-e-tron-tamsinti-stiklai': 'Audi Q8 e-tron su tamsintais galiniais stiklais',
  'darbai/bmw-2-coupe-tamsinti-stiklai': 'Mėlynas BMW 2 Coupe su tamsintais stiklais',
  'darbai/skoda-karoq-tamsinti-langai': 'Škoda Karoq su tamsintais galiniais langais',
  'darbai/vw-caddy-maxi-tamsinti-langai': 'VW Caddy Maxi su tamsintais salono langais',
  'darbai/volvo-s90-tamsinti-stiklai': 'Sidabrinis Volvo S90 su tamsintais galiniais stiklais',
  'darbai/bmw-ix1-sonas': 'BMW iX1 – tamsinti galiniai šoniniai langai',
  'darbai/bmw-ix1-galas': 'BMW iX1 – tamsintas galinis stiklas',
  'darbai/maserati-granturismo-sonas': 'Maserati GranTurismo – tamsinti šoniniai langai',
  'darbai/hyundai-veloster-tamsinti-stiklai': 'Hyundai Veloster su tamsintais galiniais stiklais',
  'darbai/audi-q7-sonas': 'Audi Q7 – tamsinti galiniai šoniniai langai',
  'darbai/jeep-renegade-tamsinti-stiklai': 'Jeep Renegade su tamsintais galiniais langais',
  'darbai/bmw-3-touring-juodas': 'BMW 3 serijos Touring su tamsintais langais',
  'darbai/bmw-3-touring-galas': 'BMW 3 serijos Touring – tamsintas galinis stiklas',
  'darbai/skoda-kodiaq-juodas': 'Juoda Škoda Kodiaq su tamsintais galiniais langais',
  'darbai/hyundai-tucson-pilkas': 'Pilkas Hyundai Tucson su tamsintais galiniais langais',
  'darbai/ford-kuga-tamsinti-stiklai': 'Ford Kuga su tamsintais galiniais stiklais',
  'darbai/vw-golf-tamsinti-stiklai': 'VW Golf su tamsintais galiniais stiklais',
  'darbai/vw-passat-tamsinti-stiklai': 'VW Passat su tamsintais galiniais stiklais',
  'darbai/toyota-auris-tamsinti-stiklai': 'Toyota Auris universalas su tamsintais stiklais',
  'darbai/chrysler-300-baltas': 'Baltas Chrysler 300 su tamsintais stiklais',
  'darbai/bmw-3-touring-geltonas': 'Geltonas BMW 3 serijos Touring su tamsintais langais',
  'darbai/vw-caddy-baltas': 'Baltas VW Caddy su tamsintais langais',
  'darbai/peugeot-rifter-tamsinti-langai': 'Peugeot Rifter su tamsintais galiniais langais',
  'darbai/renault-trafic-tamsinti-langai': 'Renault Trafic su tamsintais salono langais',

  // ---- Plėvelių pavyzdžiai
  'pleveles/onyx-15/onyx-15-chrysler-300': 'Chrysler 300 su ONYX 15 plėvele galiniuose languose',
  'pleveles/onyx-15/onyx-15-audi-a6-allroad': 'Audi A6 Allroad su ONYX 15 plėvele',
  'pleveles/onyx-15/onyx-15-bmw-5-universalas': 'BMW 5 serijos universalas su ONYX 15 plėvele',
  'pleveles/onyx-15/onyx-15-citroen-berlingo': 'Citroën Berlingo su ONYX 15 plėvele',
  'pleveles/select/solar-screen-select-55c': 'Solar Screen Select 55C – 55 % tamsumo plėvelės pavyzdys',
  'pleveles/select/solar-screen-select-65c': 'Solar Screen Select 65C – 65 % tamsumo plėvelės pavyzdys',
  'pleveles/select/solar-screen-select-75c': 'Solar Screen Select 75C – 75 % tamsumo plėvelės pavyzdys',
  'pleveles/select/solar-screen-select-85c': 'Solar Screen Select 85C – 85 % tamsumo plėvelės pavyzdys',
  'pleveles/select/solar-screen-select-95c': 'Solar Screen Select 95C – 95 % tamsumo plėvelės pavyzdys',
  'pleveles/panthera-230c/panthera-230c-mercedes-glc': 'Mercedes-Benz GLC su Panthera 230 C plėvele priekiniuose languose',
  'pleveles/panthera-230c/panthera-230c-mercedes-glc-priekis': 'Mercedes-Benz GLC priekinis stiklas su Panthera 230 C plėvele',
  'pleveles/panthera-230c/panthera-230c-priekinis-sonas': 'Priekinis šoninis langas su Panthera 230 C plėvele',
  'pleveles/panthera-230c/panthera-230c-land-rover-discovery-sport': 'Land Rover Discovery Sport su Panthera 230 C plėvele',
  'pleveles/red-12/red-12-audi-q5': 'Audi Q5 priekinis stiklas su Red 12 chameleono plėvele',
  'pleveles/red-12/red-12-chrysler-300': 'Chrysler 300 su Red 12 plėvele ant priekinio stiklo',
  'pleveles/red-12/red-12-priekinis-stiklas': 'Red 12 chameleono plėvelė ant priekinio stiklo',
  'pleveles/red-12/red-12-peugeot-3008': 'Peugeot 3008 su Red 12 plėvele ant priekinio stiklo',
  'pleveles/sk-20/sk-20-saulelydis': 'SK 20 chameleono plėvelė ant priekinio stiklo saulėlydžio šviesoje',
  'pleveles/sk-20/sk-20-violetinis-atspalvis': 'SK 20 plėvelė – violetinis atspalvis ant priekinio stiklo',
  'pleveles/sk-20/sk-20-melsvas-atspalvis': 'SK 20 plėvelė – melsvas atspalvis ant priekinio stiklo',
  'pleveles/sk-20/sk-20-chameleono-efektas': 'SK 20 chameleono efektas ant priekinio stiklo',
  'pleveles/sk-20/sk-20-bmw-priekinis-stiklas': 'BMW priekinis stiklas su SK 20 plėvele',
  'pleveles/sk-20/sk-20-universalas': 'Universalo priekinis stiklas su SK 20 plėvele',
  'pleveles/sk-20/sk-20-dirbtuveje': 'Priekinis stiklas su SK 20 plėvele dirbtuvėse',
  'pleveles/spectra-15c/spectra-15c-tesla-model-3': 'Tesla Model 3 su Spectra 15 C plėvele priekiniuose languose',
  'pleveles/spectra-15c/spectra-15c-tesla-model-s': 'Tesla Model S su Spectra 15 C plėvele',
  'pleveles/spectra-15c/spectra-15c-tesla-model-s-2': 'Tesla Model S – priekiniai langai su Spectra 15 C plėvele',
  'pleveles/spectra-15c/spectra-15c-bmw-6-gt': 'BMW 6 GT su Spectra 15 C plėvele',
  'pleveles/spectra-15c/spectra-15c-toyota-yaris-cross': 'Toyota Yaris Cross su Spectra 15 C plėvele',
  'pleveles/spectra-15c/spectra-15c-vw-passat': 'VW Passat su Spectra 15 C plėvele',
  'pleveles/ultravision-ms93c/ultravision-ms93c-priekinis-stiklas': 'Ultra Vision MS93C aterminė plėvelė ant priekinio stiklo',
  'pleveles/ultravision-ms93c/ultravision-ms93c-audi-q8': 'Audi Q8 priekinis stiklas su Ultra Vision MS93C plėvele',
  'pleveles/ultravision-ms93c/ultravision-ms93c-audi-q8-2': 'Audi Q8 su Ultra Vision MS93C plėvele ant priekinio stiklo',
  'pleveles/ultravision-ms93c/ultravision-ms93c-bmw-x5-priekis': 'BMW X5 su Ultra Vision MS93C plėvele',
  'pleveles/ultravision-ms93c/ultravision-ms93c-bmw-x5': 'BMW X5 priekinis stiklas su Ultra Vision MS93C plėvele',
  'pleveles/ultravision-ms93c/ultravision-ms93c-range-rover': 'Range Rover su Ultra Vision MS93C plėvele priekiniuose languose',
  'pleveles/ultravision-ms93c/ultravision-ms93c-vw-crafter': 'VW Crafter priekinis stiklas su Ultra Vision MS93C plėvele',
  'pleveles/ultravision-ms93c/ultravision-ms93c-vw-multivan': 'VW Multivan su Ultra Vision MS93C plėvele',
  'pleveles/ultravision-ms93c/ultravision-ms93c-mercedes-cls': 'Mercedes-Benz CLS su Ultra Vision MS93C plėvele',
  'pleveles/ultravision-ms93c/ultravision-ms93c-soniniai-langai': 'Priekiniai šoniniai langai su Ultra Vision MS93C plėvele',
  'pleveles/ultravision-ms93c/ultravision-ms93c-furgonas': 'Furgono priekinis stiklas su Ultra Vision MS93C plėvele',
  'pleveles/ultravision-ms93c/ultravision-ms93c-bmw': 'BMW priekinis stiklas su Ultra Vision MS93C plėvele',
  'pleveles/ultravision-ms93c/ultravision-ms93c-vw': 'VW priekinis stiklas su Ultra Vision MS93C plėvele',
  'pleveles/ultravision-ms93c/ultravision-ms93c-sidabrinis': 'Ultra Vision MS93C plėvelė ant sidabrinio automobilio priekinio stiklo',
  'pleveles/ultravision-ms93c/ultravision-ms93c-sidabrinis-2': 'Priekinis stiklas su Ultra Vision MS93C plėvele dirbtuvėse',

  // ---- Žibintų tamsinimas
  'zibintai/range-rover-tamsinti-galiniai-zibintai': 'Range Rover galiniai žibintai po tamsinimo plėvele',
  'zibintai/mercedes-e-tamsinti-zibintai': 'Mercedes-Benz E klasė su tamsintais žibintais',
  'zibintai/toyota-galinis-zibintas-su-plevele': 'Toyota galinis žibintas su tamsinimo plėvele',
  'zibintai/galinio-zibinto-tamsinimas-plevele': 'Galinio žibinto tamsinimas plėvele',
  'zibintai/vw-golf-tamsinti-galiniai-zibintai': 'VW Golf IV su tamsintais galiniais žibintais',
  'zibintai/pries-po/tesla-zibintai-pries-tamsinima': 'Tesla Model S priekiniai žibintai prieš tamsinimą',
  'zibintai/pries-po/tesla-zibintai-po-tamsinimo': 'Tesla Model S priekiniai žibintai po tamsinimo',

  // ---- Žibintų poliravimas
  'poliravimas/bmw-5-nupoliruoti-zibintai': 'BMW 5 serijos nupoliruoti priekiniai žibintai',
  'poliravimas/bmw-zibinto-poliravimas': 'BMW žibinto poliravimas',
  'poliravimas/honda-zibintu-poliravimas': 'Honda Civic žibintų poliravimas',
  'poliravimas/nupoliruoti-zibintai': 'Nupoliruoti Honda Civic žibintai',

  // ---- Matinės plėvelės
  'matines/laukiamojo-pertvaru-matinimas': 'Laukiamojo stiklinių pertvarų ir durų matinimas',
  'matines/biuro-pertvaros-matine-plevele': 'Biuro stiklinė pertvara su matine plėvele',
  'matines/biuro-duru-ir-sienos-matinimas': 'Biuro stiklo sienos ir durų matinimas',
  'matines/biuro-stiklo-sienos-matine-juosta': 'Biuro stiklo siena su matine juosta',
  'matines/dvigubu-duru-matinimas': 'Dvigubų stiklinių durų matinimas',
  'matines/stumdomu-duru-matinimas': 'Stumdomų stiklinių durų matinimas',
  'matines/mansardos-pertvaros-matinimas': 'Mansardos stiklinės pertvaros matinimas',
  'matines/sporto-sales-langu-matinimas': 'Sporto salės langų matinimas',
  'matines/duru-matine-plevele': 'Stiklinių durų matinė plėvelė',
  'matines/duru-stiklo-matinimas': 'Durų stiklo matinimas',
  'matines/stiklo-sienos-matinimas': 'Stiklo sienos matinimas',
  'matines/stumdomu-duru-matinimas-2': 'Matinė plėvelė ant stumdomų durų',
  'matines/lango-matinimas-juostos': 'Lango matinimas su skaidriomis juostomis',
  'matines/lango-matinimas': 'Lango matinimas matine plėvele',
  'matines/stiklo-matinimas-matine-plevele': 'Stiklas, padengtas matine plėvele',
  'matines/matine-juosta-ant-stiklo': 'Matinė juosta ant stiklo',

  // ---- Veidrodinės plėvelės
  'veidrodines/fasado-stiklu-klijavimas-keltuvu': 'Komercinio pastato stiklinio fasado klijavimas plėvele naudojant keltuvą',
  'veidrodines/namo-fasado-veidrodine-plevele': 'Modernaus namo langai su veidrodine plėvele',
  'veidrodines/modernaus-namo-veidrodine-plevele': 'Modernaus namo stiklinis fasadas su veidrodine plėvele',
  'veidrodines/dideli-langai-veidrodine-plevele': 'Dideli langai su veidrodine plėvele',
  'veidrodines/veidrodine-plevele-dideliam-langui': 'Didelis langas su veidrodine plėvele',
  'veidrodines/stiklinio-fasado-klijavimas': 'Stiklinio fasado klijavimas plėvele',
  'veidrodines/namo-lango-veidrodine-plevele': 'Namo langas su veidrodine plėvele',
  'veidrodines/veidrodine-plevele-langams': 'Namo langai su veidrodine plėvele',
  'veidrodines/pastato-langu-veidrodine-plevele': 'Pastato langai su veidrodine plėvele',
  'veidrodines/veidrodine-plevele-is-vidaus': 'Veidrodinė plėvelė – vaizdas iš vidaus',
  'veidrodines/stiklo-paketai-veidrodine-plevele': 'Stiklo paketų klijavimas veidrodine plėvele dirbtuvėse',

  // ---- Stiklų dekoravimas
  'dekoravimas/biuro-stiklo-dekoravimas': 'Biuro stiklinės sienos dekoravimas plėvele',
  'dekoravimas/spalvota-plevele-biuro-pertvarai': 'Oranžinė spalvota plėvelė ant biuro pertvaros',
  'dekoravimas/veidrodzio-dekoravimas': 'Veidrodinės sienos dekoravimas plėvele',
  'dekoravimas/lango-dekoratyvine-plevele': 'Lango dekoratyvinė plėvelė su medžio motyvu',
  'dekoravimas/duru-stiklo-dekoravimas': 'Durų stiklo dekoravimas plėvele su raštu',
  'dekoravimas/lango-dekoravimas-rombai': 'Lango dekoravimas – rombų raštas',
  'dekoravimas/biuro-duru-dekoravimas-linijos': 'Biuro durų dekoravimas linijų raštu',
  'dekoravimas/matines-juostos-stiklo-durims': 'Matinės juostos ant biuro stiklo durų',
  'dekoravimas/duru-stiklo-dekoravimas-juostos': 'Durų stiklas su dekoratyvinėmis juostomis',

  // ---- Reklama
  'reklama/lipdukai/mercedes-vito-lipdukai': 'Mercedes-Benz Vito su dizaino lipdukais',
  'reklama/lipdukai/lipdukas-ant-furgono-lango': 'Ploteriuotas įmonės logotipas ant furgono lango',
  'reklama/lipdukai/automobilio-dizaino-lipdukai': 'Automobilio šono dizaino lipdukai',
  'reklama/lipdukai/vycio-lipdukas': 'Vyčio lipdukas ant automobilio lango',
  'reklama/lipdukai/logotipas-ant-cisternos': 'Įmonės logotipas ant cisternos',
  'reklama/lipdukai/ploteriuotas-lipdukas-logotipas': 'Ploteriuotas įmonės logotipo lipdukas',
  'reklama/lipdukai/automobiliu-plovyklos-lipdukai': 'Automobilių plovyklos reklaminiai lipdukai',
  'reklama/spauda/pastato-reklaminis-baneris': 'Reklaminis baneris ant pastato fasado',
  'reklama/spauda/reklamine-iskaba': 'Kavinės reklaminė iškaba',
  'reklama/spauda/valties-dizaino-lipdukai': 'Valtis su spausdintais dizaino lipdukais',
  'reklama/spauda/valties-apklijavimas': 'Valties apklijavimas spausdinta plėvele',
  'reklama/spauda/spausdintas-plakatas': 'Spausdintas reklaminis plakatas',
  'reklama/spauda/stalo-apklijavimas': 'Stalo apklijavimas spausdinta plėvele',
  'reklama/spauda/spausdinta-plevele-durims': 'Stiklinės durys su spausdinta krioklio plėvele',
  'reklama/pries-po/degalu-kolonele-pries': 'Degalų kolonėlė prieš apklijavimą – nusidėvėjusi plėvelė',
  'reklama/pries-po/degalu-kolonele-po': 'Degalų kolonėlė po apklijavimo nauja spausdinta plėvele',
};

const order = Object.keys(ALT);
const keyOf = (path: string) => path.replace(/^\/src\/assets\//, '').replace(/\.[a-z]+$/i, '');

const all: GalleryImage[] = Object.entries(files)
  .filter(([path]) => !path.includes('/brand/'))
  .map(([path, mod]) => {
    const key = keyOf(path);
    return { key, src: mod.default, alt: ALT[key] ?? '' };
  })
  .sort((a, b) => {
    const ia = order.indexOf(a.key);
    const ib = order.indexOf(b.key);
    return (ia === -1 ? 1e6 : ia) - (ib === -1 ? 1e6 : ib) || a.key.localeCompare(b.key);
  });

/** Visos nuotraukos iš vieno aplanko (be poaplankių) */
export function getFolder(folder: string, fallbackAlt?: string): GalleryImage[] {
  return all
    .filter((img) => img.key.slice(0, img.key.lastIndexOf('/')) === folder)
    .map((img, i) => ({ ...img, alt: img.alt || `${fallbackAlt ?? galleryTitles[folder as GalleryFolder] ?? 'Atliktas darbas'} – nuotrauka ${i + 1}` }));
}

/** Viena nuotrauka pagal kelią, pvz. image('darbai/audi-q7-tamsinti-galiniai-stiklai') */
export function image(key: string): GalleryImage {
  const found = all.find((img) => img.key === key);
  if (!found) throw new Error(`Nuotrauka nerasta: src/assets/${key}.jpg`);
  return found;
}
