/**
 * Nuotraukų aplankai (src/assets/...), iš kurių sudaromos galerijos.
 * Nauja nuotrauka galerijoje atsiras tiesiog įkėlus ją į atitinkamą aplanką.
 */
export const galleryFolders = [
  'darbai',
  'zibintai',
  'poliravimas',
  'matines',
  'veidrodines',
  'dekoravimas',
  'reklama/lipdukai',
  'reklama/spauda',
] as const;

export type GalleryFolder = (typeof galleryFolders)[number];

/** Galerijų pavadinimai (rodomi skirtukuose) */
export const galleryTitles: Record<GalleryFolder, string> = {
  darbai: 'Automobilių stiklų tamsinimas',
  zibintai: 'Žibintų tamsinimas',
  poliravimas: 'Žibintų poliravimas',
  matines: 'Matinės plėvelės klijavimas',
  veidrodines: 'Veidrodinės plėvelės klijavimas',
  dekoravimas: 'Stiklų dekoravimas',
  'reklama/lipdukai': 'Ploteriuoti lipdukai',
  'reklama/spauda': 'Spauda',
};
