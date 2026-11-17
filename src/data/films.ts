/**
 * Automobilių stiklų tamsinimo plėvelių pavyzdžiai.
 * „Tamsumas“ – kiek plėvelė patamsina stiklą (100 % – tamsumas ≈ kiek šviesos praleidžia).
 * Nuotraukos – src/assets/pleveles/<aplankas>/
 */
export type FilmUse = 'galiniai' | 'priekiniai';

export interface Film {
  id: string;
  name: string;
  use: FilmUse;
  /** Tamsumas procentais; serijai – keli variantai */
  darkness: number[];
  tone: string;
  text: string;
  folder: string;
}

export const films: Film[] = [
  // ---- Galiniams langams
  {
    id: 'onyx-15',
    name: 'ONYX 15',
    use: 'galiniai',
    darkness: [85],
    tone: 'Grafito spalva',
    text: 'Tamsi grafito atspalvio plėvelė galiniams langams – daug privatumo, salone mažiau saulės ir akinimo.',
    folder: 'pleveles/onyx-15',
  },
  {
    id: 'select',
    name: 'Solar Screen Select',
    use: 'galiniai',
    darkness: [55, 65, 75, 85, 95],
    tone: 'Neutralus juodas atspalvis',
    text: 'Plėvelių serija, kurioje galite pasirinkti norimą tamsumą – nuo lengvo atspalvio iki visiško privatumo.',
    folder: 'pleveles/select',
  },
  // ---- Priekiniams langams (leidžiama patamsinti iki 30 %)
  {
    id: 'panthera-230c',
    name: 'Panthera 230 C',
    use: 'priekiniai',
    darkness: [30],
    tone: 'Lengvas neutralus atspalvis',
    text: 'Tamsiausia leistina plėvelė priekiniams langams – vienodas vaizdas su tamsintais galiniais langais.',
    folder: 'pleveles/panthera-230c',
  },
  {
    id: 'sk-20',
    name: 'SK 20',
    use: 'priekiniai',
    darkness: [20],
    tone: 'Chameleono efektas – melsvas, violetinis',
    text: 'Plėvelė, kurios atspalvis keičiasi priklausomai nuo kampo ir šviesos – automobilis išsiskiria iš kitų.',
    folder: 'pleveles/sk-20',
  },
  {
    id: 'spectra-15c',
    name: 'Spectra 15 C',
    use: 'priekiniai',
    darkness: [15],
    tone: 'Beveik nematoma',
    text: 'Skaidri plėvelė priekiniams langams – mažiau karščio ir akinimo, o išvaizda lieka kaip gamyklinė.',
    folder: 'pleveles/spectra-15c',
  },
  {
    id: 'ultravision-ms93c',
    name: 'Ultra Vision MS93C',
    use: 'priekiniai',
    darkness: [15],
    tone: 'Melsvas atspalvis, aterminė',
    text: 'Aterminė plėvelė priekiniam stiklui ir šoniniams langams – atspindi dalį saulės šilumos, matomumas išlieka geras.',
    folder: 'pleveles/ultravision-ms93c',
  },
  {
    id: 'red-12',
    name: 'Red 12',
    use: 'priekiniai',
    darkness: [12],
    tone: 'Chameleono efektas – rausvas, auksinis',
    text: 'Ryškaus chameleono efekto plėvelė su šiltu rausvu atspalviu – saulėje mirguliuoja skirtingomis spalvomis.',
    folder: 'pleveles/red-12',
  },
];

export const filmUseLabels: Record<FilmUse, { title: string; note: string }> = {
  galiniai: {
    title: 'Galiniams langams',
    note: 'Galinius šoninius langus ir galinį stiklą galima tamsinti laisvai – rinkitės pagal norimą privatumą.',
  },
  priekiniai: {
    title: 'Priekiniams langams',
    note: 'Priekinį stiklą ir priekinius šoninius langus leidžiama patamsinti ne daugiau kaip 30 % – visos šios plėvelės atitinka reikalavimą.',
  },
};
