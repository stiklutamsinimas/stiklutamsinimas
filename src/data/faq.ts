/**
 * Dažniausi klausimai (pradžios puslapis, /apie-mus ir /llms.txt – santrauka dirbtinio intelekto paieškoms).
 * Kainos čia įrašytos tekstu – pakeitus src/data/prices.ts, pataisykite ir čia.
 */
import { site } from '@/config/site';

export const homeFaq: { q: string; a: string }[] = [
  { q: 'Kiek laiko užtrunka tamsinimas?', a: 'Automobilio galinių langų tamsinimas dažniausiai trunka 2–3 valandas – automobilį atsiimsite tą pačią dieną. Pastatų langams laikas priklauso nuo ploto, dažniausiai pakanka vienos dienos.' },
  { q: 'Ar galima tamsinti priekinius langus?', a: 'Taip, bet ribotai: priekinį stiklą ir priekinius šoninius langus leidžiama patamsinti ne daugiau kaip 30 % – jie turi praleisti ne mažiau kaip 70 % šviesos. Tam naudojame skaidrias atermines ir chameleono plėveles.' },
  { q: 'Kada galima nuleisti langus ir juos plauti?', a: 'Kelias dienas po tamsinimo langų nenuleiskite – plėvelei reikia laiko visiškai prilipti. Pirmomis dienomis matomas lengvas drumstumas ar smulkūs lašeliai yra normalu – jie išnyksta plėvelei išdžiūvus. Valykite minkšta šluoste, be abrazyvinių priemonių.' },
  { q: 'Ar plėvelė netrikdys GPS ir mobiliojo ryšio?', a: 'Metalo dalelių turinčios plėvelės gali silpninti radijo ir telefono signalą, todėl automobiliams siūlome plėveles be metalo – jos ryšio netrikdo.' },
  { q: 'Ar suteikiate garantiją?', a: `Taip. Atliktiems darbams suteikiame nuo 5 iki 10 metų garantiją – trukmė priklauso nuo plėvelės rūšies. Dirbame nuo ${site.foundedYear} m.` },
  { q: 'Ar galima tamsinti stiklus žiemą?', a: 'Taip. Plėvelė klijuojama šiltoje patalpoje, todėl oras lauke darbui įtakos neturi. Kokybiškos plėvelės atsparios šalčiui, karščiui ir drėgmei.' },
  { q: 'Kur atliekate darbus?', a: `Automobilių stiklus tamsiname dirbtuvėse Kupiškyje, Rokiškyje ir Panevėžyje – atvykti galite iš bet kurios Lietuvos vietos, darbas trunka 2–3 val., tad automobilį atsiimsite tą pačią dieną. Pastatų langus klijuojame atvykę į objektą: Kupiškio, Rokiškio ir Panevėžio rajonuose, Vilniuje, Kaune, o kitur Lietuvoje – pagal susitarimą. ${site.appointmentNote}.` },
  { q: 'Kiek kainuoja automobilio stiklų tamsinimas?', a: 'Galinių stiklų tamsinimas: hečbekui 90–120 €, kupė 90–110 €, sedanui 100–130 €, visureigiui 110–130 €, minivenui 120–150 €, mikroautobusui 145–180 €. Tikslią kainą pasakysime iš anksto pagal automobilio modelį ir pasirinktą plėvelę.' },
];
