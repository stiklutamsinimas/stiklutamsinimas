/**
 * MIESTŲ PUSLAPIAI – /stiklu-tamsinimas-<slug> (pvz. /stiklu-tamsinimas-vilnius).
 * Žmonės Google dažniausiai ieško „stiklų / langų tamsinimas + miestas (+ kaina)“,
 * todėl kiekvienam miestui – atskiras puslapis su unikaliu tekstu, adresu, žemėlapiu ir DUK.
 */
export interface City {
  slug: string;
  /** Vardininkas: Vilnius */
  name: string;
  /** Vietininkas: Vilniuje */
  nameIn: string;
  /** Kilmininkas: Vilniaus */
  nameOf: string;
  /** Adresas iš site.locations (miesto pavadinimas). Jei nėra – dirbama tik mobiliai */
  location?: string;
  seoTitle: string;
  seoDescription: string;
  lead: string;
  intro: string[];
  /** Paslaugų id tvarka (pirmos – svarbiausios šiame mieste) */
  services: string[];
  /** Nuotraukos iš src/assets (be plėtinio) */
  gallery: string[];
  faq: { q: string; a: string }[];
}

const priceAnswer =
  'Galinių stiklų tamsinimas: hečbekui 90–120 €, kupė 90–110 €, sedanui 100–130 €, visureigiui 110–130 €, minivenui 120–150 €, mikroautobusui 145–180 €. Tikslią kainą pasakysime pagal automobilio modelį ir plėvelę.';

export const cities: City[] = [
  {
    slug: 'vilnius',
    name: 'Vilnius',
    nameIn: 'Vilniuje',
    nameOf: 'Vilniaus',
    location: 'Vilnius',
    seoTitle: 'Stiklų tamsinimas Vilniuje – auto ir langai | stiklutamsinimas.eu',
    seoDescription:
      'Automobilio stiklų ir langų tamsinimas Vilniuje, Verkių g. 50. Kaina nuo 90 €, darbas per 2–3 val., 5–10 m. garantija. Langus klijuojame visame Vilniuje.',
    lead: 'Automobilių stiklų ir langų tamsinimas Vilniuje – Verkių g. 50. Tamsiname automobilių stiklus, klijuojame atermines plėveles, o namų ir biurų langus klijuojame atvykę į objektą visame mieste.',
    intro: [
      'Vilniuje dirbame adresu **Verkių g. 50**. Čia tamsiname automobilių galinius stiklus, klijuojame atermines ir chameleono plėveles ant priekinių stiklų, tamsiname bei poliruojame žibintus. Galinių stiklų tamsinimas dažniausiai užtrunka 2–3 valandas – automobilį atsiimate tą pačią dieną.',
      'Sostinėje daug biurų ir naujos statybos namų su dideliais langais, todėl populiarios **veidrodinės ir saulės kontrolės plėvelės** – jos sumažina karštį ir akinimą, o biurams – ir **matinės plėvelės** stiklinėms pertvaroms. Pastatų langus klijuojame atvykę į objektą, aukštus fasadus – naudodami keltuvą.',
    ],
    services: ['automobilio-stiklu-tamsinimas', 'priekiniu-stiklu-tamsinimas', 'langu-tamsinimas', 'stiklo-dekoravimas', 'zibintu-tamsinimas', 'zibintu-poliravimas', 'apsaugine-plevele', 'mobilus-stiklu-tamsinimas', 'lipduku-spausdinimas', 'automobiliu-stiklu-keitimas'],
    gallery: [
      'veidrodines/fasado-stiklu-klijavimas-keltuvu',
      'darbai/tesla-model-s-priekis',
      'darbai/mercedes-s-klase-tamsinti-stiklai',
      'matines/biuro-duru-ir-sienos-matinimas',
      'darbai/audi-q8-e-tron-tamsinti-stiklai',
      'veidrodines/modernaus-namo-veidrodine-plevele',
      'darbai/jaguar-i-pace-tamsinti-langai',
      'dekoravimas/biuro-stiklo-dekoravimas',
      'darbai/bmw-ix1-tamsinti-stiklai',
    ],
    faq: [
      { q: 'Kur atliekate stiklų tamsinimą Vilniuje?', a: 'Vilniuje dirbame adresu Verkių g. 50. Darbai atliekami tik iš anksto susitarus – paskambinkite ar parašykite, ir suderinsime laiką.' },
      { q: 'Kiek kainuoja automobilio stiklų tamsinimas Vilniuje?', a: priceAnswer },
      { q: 'Ar atvykstate klijuoti langų plėvelių į biurą ar namus Vilniuje?', a: 'Taip. Pastatų langus, stiklines pertvaras ir vitrinas visada klijuojame objekte – visame Vilniuje. Aukštus stiklinius fasadus klijuojame naudodami keltuvą.' },
      { q: 'Ar galima Vilniuje patamsinti priekinius langus?', a: 'Taip, bet ne daugiau kaip 30 % – priekinis stiklas ir priekiniai šoniniai langai turi praleisti ne mažiau kaip 70 % šviesos. Tam naudojame šviesias atermines ir chameleono plėveles.' },
      { q: 'Kokia garantija suteikiama?', a: 'Atliktiems darbams suteikiame nuo 5 iki 10 metų garantiją – trukmė priklauso nuo plėvelės rūšies.' },
    ],
  },
  {
    slug: 'panevezys',
    name: 'Panevėžys',
    nameIn: 'Panevėžyje',
    nameOf: 'Panevėžio',
    location: 'Panevėžys',
    seoTitle: 'Stiklų tamsinimas Panevėžyje | stiklutamsinimas.eu',
    seoDescription:
      'Automobilio stiklų tamsinimas, žibintų poliravimas ir langų tamsinimas Panevėžyje, Molainių g. 15. Kaina nuo 90 €, 5–10 metų garantija.',
    lead: 'Automobilio stiklų tamsinimas, žibintų tamsinimas ir poliravimas bei langų plėvelės Panevėžyje – Molainių g. 15.',
    intro: [
      'Panevėžyje mus rasite adresu **Molainių g. 15**. Čia tamsiname automobilių stiklus kokybiškomis Solar Screen, Global Window Films ir Ultra Vision plėvelėmis, klijuojame atermines plėveles ant priekinių stiklų.',
      'Panevėžiečiai dažnai kreipiasi ir dėl **žibintų poliravimo** – pageltę, matiniai žibintai po poliravimo vėl tampa skaidrūs ir geriau apšviečia kelią. Taip pat tamsiname žibintus plėvele, klijuojame **veidrodines, matines ir apsaugines** plėveles namams, biurams ir parduotuvėms.',
    ],
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
      { q: 'Kiek kainuoja stiklų tamsinimas Panevėžyje?', a: priceAnswer },
      { q: 'Ar poliruojate žibintus Panevėžyje?', a: 'Taip. Pašaliname pageltimą ir matiškumą, nupoliruojame ir padengiame apsaugine danga, kad žibintai vėl greitai nepageltų.' },
      { q: 'Ar klijuojate langų plėveles namams ir biurams Panevėžyje?', a: 'Taip – veidrodines, saulės kontrolės, matines ir apsaugines plėveles. Atvykstame į objektą, įvertiname langus ir pasiūlome tinkamą plėvelę.' },
      { q: 'Kiek laiko trunka automobilio stiklų tamsinimas?', a: 'Galinių stiklų tamsinimas dažniausiai trunka 2–3 valandas – automobilį atsiimsite tą pačią dieną.' },
    ],
  },
  {
    slug: 'kupiskis',
    name: 'Kupiškis',
    nameIn: 'Kupiškyje',
    nameOf: 'Kupiškio',
    location: 'Kupiškis',
    seoTitle: 'Stiklų tamsinimas Kupiškyje | stiklutamsinimas.eu',
    seoDescription:
      'Stiklų ir langų tamsinimas Kupiškyje, Gedimino g. 67. Automobilių stiklai nuo 90 €, žibintai, plėvelės namams. 5,0 ★ Google, 5–10 m. garantija.',
    lead: 'Automobilių stiklų tamsinimas, žibintų tamsinimas ir poliravimas, langų plėvelės ir reklama Kupiškyje – Gedimino g. 67.',
    intro: [
      'Kupiškyje dirbame adresu **Gedimino g. 67**. Mūsų Google verslo profilis čia įvertintas **5,0 ★** – klientai mini tvarkingą ir profesionalų darbą. Tamsiname automobilių galinius ir priekinius stiklus, tamsiname ir poliruojame žibintus.',
      'Kupiškyje taip pat gaminame **lipdukus ir reklamą** – ploteriuotus užrašus, reklamą ant automobilių ir vitrinų – bei klijuojame **langų plėveles** namams ir įmonėms: veidrodines, matines ir apsaugines.',
    ],
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
      { q: 'Kur atliekate stiklų tamsinimą Kupiškyje?', a: 'Kupiškyje dirbame adresu Gedimino g. 67. Darbai atliekami tik iš anksto susitarus – paskambinkite ir suderinsime jums patogų laiką.' },
      { q: 'Kiek kainuoja automobilio stiklų tamsinimas Kupiškyje?', a: priceAnswer },
      { q: 'Ar gaminate lipdukus ir reklamą Kupiškyje?', a: 'Taip – ploteriuotus lipdukus, reklamą ant automobilių, vitrinų ir banerius. Maketą galime paruošti patys arba pritaikyti jūsų turimą.' },
      { q: 'Ar galima tamsinti stiklus žiemą?', a: 'Taip. Plėvelė klijuojama šiltoje patalpoje, todėl oras lauke darbui įtakos neturi.' },
      { q: 'Kokia garantija suteikiama?', a: 'Atliktiems darbams suteikiame nuo 5 iki 10 metų garantiją – trukmė priklauso nuo plėvelės rūšies.' },
    ],
  },
  {
    slug: 'rokiskis',
    name: 'Rokiškis',
    nameIn: 'Rokiškyje',
    nameOf: 'Rokiškio',
    location: 'Rokiškis',
    seoTitle: 'Stiklų tamsinimas Rokiškyje | stiklutamsinimas.eu',
    seoDescription:
      'Automobilio stiklų ir langų tamsinimas Rokiškyje, Miškininkų g. 5c. Kaina nuo 90 €, darbas per 2–3 val., 5–10 metų garantija. Tik iš anksto susitarus.',
    lead: 'Automobilio stiklų tamsinimas, aterminės plėvelės priekiniams stiklams, žibintų tamsinimas ir langų plėvelės Rokiškyje – Miškininkų g. 5c.',
    intro: [
      'Rokiškyje dirbame adresu **Miškininkų g. 5c**. Tamsiname automobilių galinius stiklus – nuo lengvo atspalvio iki visiško privatumo – ir klijuojame **atermines plėveles** priekiniams langams, kurios sumažina karštį, bet neviršija leistinos 30 % ribos.',
      'Rokiškėnams taip pat tamsiname ir poliruojame **žibintus**, o namų ir įmonių langams klijuojame **veidrodines, saulės kontrolės ir matines** plėveles. Pastatų langus klijuojame atvykę į objektą.',
    ],
    services: ['automobilio-stiklu-tamsinimas', 'priekiniu-stiklu-tamsinimas', 'zibintu-tamsinimas', 'langu-tamsinimas', 'zibintu-poliravimas', 'stiklo-dekoravimas', 'apsaugine-plevele', 'mobilus-stiklu-tamsinimas', 'lipduku-spausdinimas', 'automobiliu-stiklu-keitimas'],
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
      { q: 'Kiek kainuoja stiklų tamsinimas Rokiškyje?', a: priceAnswer },
      { q: 'Kokią plėvelę rinktis priekiniams langams?', a: 'Priekiniams langams naudojame šviesias atermines (soliarines) ir chameleono plėveles – jos sumažina karštį, o bendras šviesos pralaidumas lieka ne mažesnis kaip 70 %.' },
      { q: 'Ar klijuojate plėveles namų langams Rokiškyje?', a: 'Taip – veidrodines, saulės kontrolės, matines ir apsaugines. Atvykstame į objektą, įvertiname langus ir pasiūlome tinkamą plėvelę.' },
      { q: 'Kiek laiko trunka automobilio stiklų tamsinimas?', a: 'Galinių stiklų tamsinimas dažniausiai trunka 2–3 valandas – automobilį atsiimsite tą pačią dieną.' },
    ],
  },
  {
    slug: 'kaunas',
    name: 'Kaunas',
    nameIn: 'Kaune',
    nameOf: 'Kauno',
    seoTitle: 'Stiklų tamsinimas Kaune – atvykstame | stiklutamsinimas.eu',
    seoDescription:
      'Mobilus stiklų tamsinimas Kaune – atvykstame pas jus ir tamsiname automobilio stiklus, klijuojame plėveles namų ir biurų langams. 5–10 m. garantija.',
    lead: 'Mobilus stiklų tamsinimas Kaune – atvykstame į jūsų namus, biurą ar įmonę ir tamsiname automobilio stiklus ar klijuojame plėveles langams vietoje.',
    intro: [
      'Kaune nuolatinių dirbtuvių neturime – čia dirbame **mobiliai**: atvykstame į jūsų nurodytą vietą su visa reikalinga įranga. Tamsiname automobilių galinius stiklus, klijuojame atermines plėveles priekiniams langams.',
      'Namams, biurams ir parduotuvėms Kaune klijuojame **veidrodines, saulės kontrolės, matines ir apsaugines** plėveles. Automobilio tamsinimui pageidautina pastogė – garažas ar stoginė, kad ant plėvelės nepatektų dulkės ir lietus.',
    ],
    services: ['mobilus-stiklu-tamsinimas', 'automobilio-stiklu-tamsinimas', 'priekiniu-stiklu-tamsinimas', 'langu-tamsinimas', 'stiklo-dekoravimas', 'apsaugine-plevele'],
    gallery: [
      'darbai/range-rover-sport-pilkas',
      'veidrodines/veidrodine-plevele-dideliam-langui',
      'darbai/maserati-granturismo-tamsinti-stiklai',
      'matines/laukiamojo-pertvaru-matinimas',
      'darbai/dodge-challenger-tamsinti-langai',
      'pleveles/spectra-15c/spectra-15c-tesla-model-3',
      'darbai/land-rover-discovery-sport',
      'veidrodines/stiklinio-fasado-klijavimas',
      'darbai/bmw-2-coupe-tamsinti-stiklai',
    ],
    faq: [
      { q: 'Ar turite dirbtuves Kaune?', a: 'Ne – Kaune dirbame mobiliai: atvykstame į jūsų nurodytą vietą. Darbai atliekami tik iš anksto susitarus.' },
      { q: 'Ko reikia, kad galėtumėte tamsinti automobilį pas mane?', a: 'Pageidautina pastogė – garažas ar stoginė, kad ant plėvelės nepatektų dulkės ir lietus. Pastato langams užtenka laisvo priėjimo prie langų.' },
      { q: 'Kiek kainuoja stiklų tamsinimas Kaune?', a: `${priceAnswer} Dėl atvykimo į Kauną kainos susitarsime individualiai.` },
      { q: 'Ar klijuojate plėveles biurų langams Kaune?', a: 'Taip – veidrodines, saulės kontrolės, matines ir apsaugines plėveles biurams, namams ir parduotuvėms.' },
      { q: 'Kokia garantija suteikiama?', a: 'Atliktiems darbams suteikiame nuo 5 iki 10 metų garantiją – trukmė priklauso nuo plėvelės rūšies.' },
    ],
  },
];

export const cityUrl = (slug: string) => `/stiklu-tamsinimas-${slug}`;
