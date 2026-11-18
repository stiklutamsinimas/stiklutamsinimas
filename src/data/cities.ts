/**
 * MIESTŲ PUSLAPIAI – /stiklu-tamsinimas-<slug> (pvz. /stiklu-tamsinimas-kupiskis).
 *
 * Svarbiausi miestai – Kupiškis, Rokiškis, Panevėžys ir aplinkiniai rajonai:
 * čia tamsiname automobilius ir klijuojame plėveles pastatams.
 * Vilnius ir Kaunas – TIK pastatai / objektai (langų, durų, pertvarų plėvelės).
 */
export interface City {
  slug: string;
  /** Vardininkas: Kupiškis */
  name: string;
  /** Vietininkas: Kupiškyje */
  nameIn: string;
  /** Kilmininkas: Kupiškio */
  nameOf: string;
  /** Ar šiame mieste tamsiname automobilius */
  cars: boolean;
  /** Pagrindinė frazė (H1, nuorodos): „Stiklų tamsinimas“ / „Langų tamsinimas“ */
  keyword: string;
  /** Adresas iš site.locations (miesto pavadinimas). Jei nėra – dirbama tik atvykus */
  location?: string;
  seoTitle: string;
  seoDescription: string;
  lead: string;
  intro: string[];
  /** Aplinkinės vietovės (rajonas ir kaimyniniai miestai) */
  areas: string[];
  areasText: string;
  /** Paslaugų id tvarka (pirmos – svarbiausios šiame mieste) */
  services: string[];
  /** Nuotraukos iš src/assets (be plėtinio) */
  gallery: string[];
  faq: { q: string; a: string }[];
}

const priceAnswer =
  'Galinių stiklų tamsinimas: hečbekui 90–120 €, kupė 90–110 €, sedanui 100–130 €, visureigiui 110–130 €, minivenui 120–150 €, mikroautobusui 145–180 €. Tikslią kainą pasakysime pagal automobilio modelį ir plėvelę.';
const carServices = ['automobilio-stiklu-tamsinimas', 'priekiniu-stiklu-tamsinimas', 'zibintu-tamsinimas', 'zibintu-poliravimas', 'automobiliu-stiklu-keitimas'];
const buildingServices = ['langu-tamsinimas', 'stiklo-dekoravimas', 'apsaugine-plevele'];
const objectsOnly = 'Automobilių stiklus tamsiname mūsų dirbtuvėse Kupiškyje, Rokiškyje ir Panevėžyje.';

export const cities: City[] = [
  {
    slug: 'kupiskis',
    name: 'Kupiškis',
    nameIn: 'Kupiškyje',
    nameOf: 'Kupiškio',
    cars: true,
    keyword: 'Stiklų tamsinimas',
    location: 'Kupiškis',
    seoTitle: 'Stiklų tamsinimas Kupiškyje – automobiliai, langai',
    seoDescription:
      'Automobilio stiklų tamsinimas Kupiškyje, Gedimino g. 67 – nuo 90 €, 5–10 m. garantija, 5,0 ★ Google. Žibintai, langų plėvelės visame Kupiškio rajone.',
    lead: 'Automobilio stiklų tamsinimas, žibintų tamsinimas ir poliravimas, langų plėvelės ir reklama Kupiškyje – Gedimino g. 67. Aptarnaujame visą Kupiškio rajoną.',
    intro: [
      'Kupiškyje dirbame adresu **Gedimino g. 67**. Mūsų Google verslo profilis čia įvertintas **5,0 ★** – klientai mini tvarkingą ir profesionalų darbą. Tamsiname automobilių galinius stiklus, klijuojame atermines plėveles ant priekinių langų, tamsiname ir poliruojame žibintus. Galinių stiklų tamsinimas dažniausiai trunka 2–3 valandas.',
      'Kupiškyje taip pat gaminame **lipdukus ir reklamą** – ploteriuotus užrašus, reklamą ant automobilių ir vitrinų – bei klijuojame **langų plėveles** namams ir įmonėms: veidrodines, matines ir apsaugines.',
    ],
    areas: ['Subačius', 'Skapiškis', 'Šimonys', 'Noriūnai', 'Alizava', 'Salamiestis', 'Antašava', 'Anykščiai', 'Biržai'],
    areasText:
      'Į dirbtuves Kupiškyje patogu atvykti iš viso Kupiškio rajono, taip pat iš Anykščių ir Biržų. Pastatų langus klijuojame atvykę į objektą visame rajone.',
    services: ['automobilio-stiklu-tamsinimas', 'priekiniu-stiklu-tamsinimas', 'zibintu-tamsinimas', 'zibintu-poliravimas', 'lipduku-spausdinimas', 'langu-tamsinimas', 'stiklo-dekoravimas', 'apsaugine-plevele', 'mobilus-stiklu-tamsinimas', 'automobiliu-stiklu-keitimas'],
    gallery: [
      'darbai/audi-q7-tamsinti-galiniai-stiklai',
      'reklama/spauda/pastato-reklaminis-baneris',
      'darbai/skoda-octavia-raudona',
      'zibintai/vw-golf-tamsinti-galiniai-zibintai',
      'darbai/vw-passat-tamsinti-stiklai',
      'reklama/lipdukai/mercedes-vito-lipdukai',
      'darbai/toyota-auris-tamsinti-stiklai',
      'matines/dvigubu-duru-matinimas',
      'darbai/peugeot-rifter-tamsinti-langai',
    ],
    faq: [
      { q: 'Kur atliekate automobilio stiklų tamsinimą Kupiškyje?', a: 'Kupiškyje dirbame adresu Gedimino g. 67. Darbai atliekami tik iš anksto susitarus – paskambinkite ir suderinsime jums patogų laiką.' },
      { q: 'Kiek kainuoja automobilio stiklų tamsinimas Kupiškyje?', a: priceAnswer },
      { q: 'Ar atvykstate į Kupiškio rajoną?', a: 'Taip. Pastatų langus, duris ir vitrinas klijuojame atvykę į objektą – Subačiuje, Skapiškyje, Šimonyse, Noriūnuose, Alizavoje ir kitur rajone. Dėl automobilio tamsinimo pas jus susitarsime individualiai.' },
      { q: 'Ar gaminate lipdukus ir reklamą Kupiškyje?', a: 'Taip – ploteriuotus lipdukus, reklamą ant automobilių, vitrinų ir banerius. Maketą galime paruošti patys arba pritaikyti jūsų turimą.' },
      { q: 'Kokia garantija suteikiama?', a: 'Atliktiems darbams suteikiame nuo 5 iki 10 metų garantiją – trukmė priklauso nuo plėvelės rūšies.' },
    ],
  },
  {
    slug: 'rokiskis',
    name: 'Rokiškis',
    nameIn: 'Rokiškyje',
    nameOf: 'Rokiškio',
    cars: true,
    keyword: 'Stiklų tamsinimas',
    location: 'Rokiškis',
    seoTitle: 'Stiklų tamsinimas Rokiškyje – automobiliai, langai',
    seoDescription:
      'Automobilio stiklų tamsinimas Rokiškyje, Miškininkų g. 5c – nuo 90 €, darbas per 2–3 val., 5–10 m. garantija. Žibintai ir langų plėvelės Rokiškio rajone.',
    lead: 'Automobilio stiklų tamsinimas, aterminės plėvelės priekiniams stiklams, žibintų tamsinimas ir langų plėvelės Rokiškyje – Miškininkų g. 5c. Aptarnaujame visą Rokiškio rajoną.',
    intro: [
      'Rokiškyje dirbame adresu **Miškininkų g. 5c**. Tamsiname automobilių galinius stiklus – nuo lengvo atspalvio iki visiško privatumo – ir klijuojame **atermines plėveles** priekiniams langams, kurios sumažina karštį, bet neviršija leistinos 30 % ribos.',
      'Rokiškėnams taip pat tamsiname ir poliruojame **žibintus**, o namų ir įmonių langams klijuojame **veidrodines, saulės kontrolės ir matines** plėveles. Pastatų langus klijuojame atvykę į objektą.',
    ],
    areas: ['Obeliai', 'Pandėlys', 'Juodupė', 'Kamajai', 'Panemunėlis', 'Kazliškis', 'Jūžintai', 'Zarasai', 'Utena'],
    areasText:
      'Į dirbtuves Rokiškyje patogu atvykti iš viso Rokiškio rajono, taip pat iš Zarasų ir Utenos. Pastatų langus klijuojame atvykę į objektą visame rajone.',
    services: ['automobilio-stiklu-tamsinimas', 'priekiniu-stiklu-tamsinimas', 'zibintu-tamsinimas', 'zibintu-poliravimas', 'langu-tamsinimas', 'stiklo-dekoravimas', 'apsaugine-plevele', 'mobilus-stiklu-tamsinimas', 'lipduku-spausdinimas', 'automobiliu-stiklu-keitimas'],
    gallery: [
      'darbai/jaguar-f-pace-raudonas',
      'pleveles/sk-20/sk-20-saulelydis',
      'darbai/bmw-x1-baltas-tamsinti-stiklai',
      'zibintai/mercedes-e-tamsinti-zibintai',
      'darbai/skoda-kodiaq-juodas',
      'veidrodines/dideli-langai-veidrodine-plevele',
      'darbai/jaguar-e-pace-tamsinti-stiklai',
      'pleveles/ultravision-ms93c/ultravision-ms93c-priekinis-stiklas',
      'darbai/vw-golf-tamsinti-stiklai',
    ],
    faq: [
      { q: 'Kur jus rasti Rokiškyje?', a: 'Rokiškyje dirbame adresu Miškininkų g. 5c. Darbai atliekami tik iš anksto susitarus – paskambinkite prieš atvykdami.' },
      { q: 'Kiek kainuoja automobilio stiklų tamsinimas Rokiškyje?', a: priceAnswer },
      { q: 'Ar atvykstate į Rokiškio rajoną?', a: 'Taip. Pastatų langus klijuojame atvykę į objektą – Obeliuose, Pandėlyje, Juodupėje, Kamajuose ir kitur rajone. Dėl automobilio tamsinimo pas jus susitarsime individualiai.' },
      { q: 'Kokią plėvelę rinktis priekiniams langams?', a: 'Priekiniams langams naudojame šviesias atermines (soliarines) ir chameleono plėveles – jos sumažina karštį, o bendras šviesos pralaidumas lieka ne mažesnis kaip 70 %.' },
      { q: 'Kiek laiko trunka automobilio stiklų tamsinimas?', a: 'Galinių stiklų tamsinimas dažniausiai trunka 2–3 valandas – automobilį atsiimsite tą pačią dieną.' },
    ],
  },
  {
    slug: 'panevezys',
    name: 'Panevėžys',
    nameIn: 'Panevėžyje',
    nameOf: 'Panevėžio',
    cars: true,
    keyword: 'Stiklų tamsinimas',
    location: 'Panevėžys',
    seoTitle: 'Stiklų tamsinimas Panevėžyje – automobiliai, žibintai',
    seoDescription:
      'Automobilio stiklų tamsinimas ir žibintų poliravimas Panevėžyje, Molainių g. 15. Nuo 90 €, 5–10 m. garantija. Langų plėvelės visame Panevėžio rajone.',
    lead: 'Automobilio stiklų tamsinimas, žibintų tamsinimas ir poliravimas bei langų plėvelės Panevėžyje – Molainių g. 15. Aptarnaujame ir Panevėžio rajoną.',
    intro: [
      'Panevėžyje mus rasite adresu **Molainių g. 15**. Čia tamsiname automobilių stiklus kokybiškomis Solar Screen, Global Window Films ir Ultra Vision plėvelėmis, klijuojame atermines plėveles ant priekinių stiklų.',
      'Panevėžiečiai dažnai kreipiasi ir dėl **žibintų poliravimo** – pageltę, matiniai žibintai po poliravimo vėl tampa skaidrūs ir geriau apšviečia kelią. Taip pat tamsiname žibintus plėvele, klijuojame **veidrodines, matines ir apsaugines** plėveles namams, biurams ir parduotuvėms.',
    ],
    areas: ['Ramygala', 'Velžys', 'Krekenava', 'Naujamiestis', 'Smilgiai', 'Raguva', 'Miežiškiai', 'Upytė', 'Pasvalys', 'Kėdainiai'],
    areasText:
      'Į dirbtuves Panevėžyje patogu atvykti iš viso Panevėžio rajono, taip pat iš Pasvalio ir Kėdainių. Pastatų langus klijuojame atvykę į objektą visame rajone.',
    services: ['automobilio-stiklu-tamsinimas', 'zibintu-poliravimas', 'zibintu-tamsinimas', 'priekiniu-stiklu-tamsinimas', 'langu-tamsinimas', 'stiklo-dekoravimas', 'apsaugine-plevele', 'lipduku-spausdinimas', 'mobilus-stiklu-tamsinimas', 'automobiliu-stiklu-keitimas'],
    gallery: [
      'darbai/land-rover-discovery-sport-raudonas',
      'poliravimas/bmw-5-nupoliruoti-zibintai',
      'darbai/skoda-kodiaq-tamsinti-stiklai',
      'zibintai/range-rover-tamsinti-galiniai-zibintai',
      'darbai/volvo-xc60-tamsinti-stiklai',
      'poliravimas/honda-zibintu-poliravimas',
      'darbai/hyundai-tucson-tamsinti-stiklai',
      'veidrodines/namo-fasado-veidrodine-plevele',
      'darbai/ford-kuga-tamsinti-stiklai',
    ],
    faq: [
      { q: 'Kur jus rasti Panevėžyje?', a: 'Panevėžyje dirbame adresu Molainių g. 15. Darbai atliekami tik iš anksto susitarus – prieš atvykdami paskambinkite.' },
      { q: 'Kiek kainuoja automobilio stiklų tamsinimas Panevėžyje?', a: priceAnswer },
      { q: 'Ar poliruojate žibintus Panevėžyje?', a: 'Taip. Pašaliname pageltimą ir matiškumą, nupoliruojame ir padengiame apsaugine danga, kad žibintai vėl greitai nepageltų.' },
      { q: 'Ar atvykstate į Panevėžio rajoną?', a: 'Taip. Langų plėveles namams ir įmonėms klijuojame atvykę į objektą – Ramygaloje, Velžyje, Krekenavoje, Naujamiestyje ir kitur rajone.' },
      { q: 'Kiek laiko trunka automobilio stiklų tamsinimas?', a: 'Galinių stiklų tamsinimas dažniausiai trunka 2–3 valandas – automobilį atsiimsite tą pačią dieną.' },
    ],
  },
  {
    slug: 'vilnius',
    name: 'Vilnius',
    nameIn: 'Vilniuje',
    nameOf: 'Vilniaus',
    cars: false,
    keyword: 'Langų tamsinimas',
    location: 'Vilnius',
    seoTitle: 'Langų tamsinimas Vilniuje – plėvelės pastatams',
    seoDescription:
      'Langų tamsinimas ir plėvelės pastatams Vilniuje: veidrodinė plėvelė langams, plėvelės nuo saulės ir karščio, matinės ir apsauginės plėvelės biurams.',
    lead: 'Langų tamsinimas ir plėvelės pastatams Vilniuje – veidrodinės, saulės kontrolės, matinės ir apsauginės plėvelės namams, biurams ir verslui. Atvykstame į objektą.',
    intro: [
      'Vilniuje klijuojame **plėveles pastatams**: langams, stiklinėms durims, pertvaroms ir vitrinoms. Atvykstame į objektą, įvertiname stiklus ir pasiūlome tinkamą plėvelę. Kontaktinis adresas Vilniuje – **Verkių g. 50**.',
      'Sostinėje daug biurų ir naujos statybos namų su dideliais langais, todėl populiarios **veidrodinės ir saulės kontrolės plėvelės** – jos sumažina karštį ir akinimą, o biurams – ir **matinės plėvelės** stiklinėms pertvaroms. Aukštus stiklinius fasadus klijuojame naudodami keltuvą.',
    ],
    areas: [],
    areasText: `Pastatų langus klijuojame visame Vilniuje ir Vilniaus rajone. ${objectsOnly}`,
    services: [...buildingServices, 'mobilus-stiklu-tamsinimas'],
    gallery: [
      'veidrodines/fasado-stiklu-klijavimas-keltuvu',
      'matines/biuro-duru-ir-sienos-matinimas',
      'veidrodines/modernaus-namo-veidrodine-plevele',
      'dekoravimas/biuro-stiklo-dekoravimas',
      'veidrodines/stiklinio-fasado-klijavimas',
      'matines/laukiamojo-pertvaru-matinimas',
      'veidrodines/namo-fasado-veidrodine-plevele',
      'dekoravimas/spalvota-plevele-biuro-pertvarai',
      'matines/biuro-pertvaros-matine-plevele',
    ],
    faq: [
      { q: 'Ar atvykstate klijuoti langų plėvelių į biurą ar namus Vilniuje?', a: 'Taip. Pastatų langus, stiklines duris, pertvaras ir vitrinas klijuojame objekte – visame Vilniuje. Aukštus stiklinius fasadus klijuojame naudodami keltuvą.' },
      { q: 'Ar tamsinate automobilius Vilniuje?', a: `Vilniuje klijuojame tik plėveles pastatų langams, durims ir pertvaroms. ${objectsOnly} Iki Panevėžio – apie 1,5 val. kelio, o darbas trunka 2–3 val., todėl automobilį atsiimsite tą pačią dieną.` },
      { q: 'Kiek kainuoja langų tamsinimas Vilniuje?', a: 'Kaina priklauso nuo stiklų ploto, plėvelės rūšies ir darbo sąlygų (pvz., ar reikia keltuvo). Atvykstame įvertinti ir pateikiame pasiūlymą iš anksto.' },
      { q: 'Ar pro veidrodinę plėvelę matysis vakare?', a: 'Dieną veidrodinė plėvelė iš lauko atrodo kaip veidrodis. Vakare, įjungus šviesą viduje, efektas apsiverčia – privatumui tada reikia užuolaidų arba matinės plėvelės.' },
      { q: 'Kokia garantija suteikiama?', a: 'Atliktiems darbams suteikiame nuo 5 iki 10 metų garantiją – trukmė priklauso nuo plėvelės rūšies.' },
    ],
  },
  {
    slug: 'kaunas',
    name: 'Kaunas',
    nameIn: 'Kaune',
    nameOf: 'Kauno',
    cars: false,
    keyword: 'Langų tamsinimas',
    seoTitle: 'Langų tamsinimas Kaune – plėvelės pastatams',
    seoDescription:
      'Langų tamsinimas ir plėvelės pastatams Kaune – atvykstame į objektą: veidrodinės, saulės kontrolės, matinės ir apsauginės plėvelės namams ir biurams.',
    lead: 'Langų tamsinimas ir plėvelės pastatams Kaune – atvykstame į jūsų namus, biurą ar įmonę ir klijuojame plėveles langams, durims ir pertvaroms vietoje.',
    intro: [
      'Kaune klijuojame **plėveles pastatams** – atvykstame į objektą su visa reikalinga įranga. Namams, biurams ir parduotuvėms klijuojame **veidrodines, saulės kontrolės, matines ir apsaugines** plėveles.',
      'Didelius biurų langus ir stiklines pertvaras dažnai renkamasi apklijuoti **matine plėvele** – patalpa lieka šviesi, o vaizdas į vidų paslepiamas. Saulėtoje pusėje esantiems langams siūlome **saulės kontrolės plėveles**, kurios sumažina karštį ir akinimą.',
    ],
    areas: [],
    areasText: `Pastatų langus klijuojame visame Kaune ir Kauno rajone – pagal susitarimą. ${objectsOnly}`,
    services: [...buildingServices, 'mobilus-stiklu-tamsinimas'],
    gallery: [
      'veidrodines/veidrodine-plevele-dideliam-langui',
      'matines/laukiamojo-pertvaru-matinimas',
      'veidrodines/dideli-langai-veidrodine-plevele',
      'matines/stumdomu-duru-matinimas',
      'dekoravimas/duru-stiklo-dekoravimas',
      'veidrodines/pastato-langu-veidrodine-plevele',
      'matines/stiklo-sienos-matinimas',
      'veidrodines/veidrodine-plevele-langams',
      'dekoravimas/matines-juostos-stiklo-durims',
    ],
    faq: [
      { q: 'Ar turite dirbtuves Kaune?', a: 'Ne – Kaune dirbame atvykę į objektą. Darbai atliekami tik iš anksto susitarus.' },
      { q: 'Ar tamsinate automobilius Kaune?', a: `Kaune klijuojame tik plėveles pastatų langams, durims ir pertvaroms. ${objectsOnly} Iki Panevėžio – apie 1,5 val. kelio, o darbas trunka 2–3 val., todėl automobilį atsiimsite tą pačią dieną.` },
      { q: 'Kiek kainuoja langų tamsinimas Kaune?', a: 'Kaina priklauso nuo stiklų ploto, plėvelės rūšies ir atvykimo. Atsiųskite langų nuotraukas ar matmenis – pateiksime pasiūlymą iš anksto.' },
      { q: 'Ar klijuojate matines plėveles biurų pertvaroms Kaune?', a: 'Taip – matines, dekoratyvines ir spalvotas plėveles stiklinėms pertvaroms ir durims, taip pat logotipus ant stiklo.' },
      { q: 'Kokia garantija suteikiama?', a: 'Atliktiems darbams suteikiame nuo 5 iki 10 metų garantiją – trukmė priklauso nuo plėvelės rūšies.' },
    ],
  },
];

export const cityUrl = (slug: string) => `/stiklu-tamsinimas-${slug}`;
/** Nuorodos tekstas: „Stiklų tamsinimas Kupiškyje“ / „Langų tamsinimas Vilniuje“ */
export const cityAnchor = (c: City) => `${c.keyword} ${c.nameIn}`;
export const carCities = cities.filter((c) => c.cars);
export { carServices, buildingServices };
