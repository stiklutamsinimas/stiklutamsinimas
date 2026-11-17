/**
 * Ikonų pavadinimai, kuriuos galima naudoti turinio failuose (frontmatter `icon:`).
 * Naują ikoną pridėkite čia ir src/components/ui/Icon.astro žemėlapyje. Visos ikonos: https://lucide.dev/icons
 */
export const iconNames = [
  'car',
  'truck',
  'building',
  'house',
  'sun',
  'thermometer',
  'eye-off',
  'shield',
  'shield-check',
  'sparkles',
  'lightbulb',
  'wrench',
  'layers',
  'sticker',
  'printer',
  'panels',
  'clock',
  'badge-check',
  'map-pin',
  'droplets',
  'gauge',
  'ruler',
  'hammer',
  'store',
  'euro',
  'scan',
  'blinds',
  'window',
  'paintbrush',
] as const;

export type IconName = (typeof iconNames)[number];
