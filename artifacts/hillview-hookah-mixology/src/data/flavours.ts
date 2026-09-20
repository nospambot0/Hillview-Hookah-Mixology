export type Strength = 'Light' | 'Medium' | 'Strong';

export type Flavour = {
  id: string;
  name: string;
  brand: string;
  tags: string[];
  strength: Strength;
  character: string;
  orb: {
    light: string;
    mid: string;
    deep: string;
  };
};

export const TASTE_OPTIONS = [
  'Fruity',
  'Sweet',
  'Fresh',
  'Minty',
  'Spiced',
  'Exotic',
  'Floral',
  'Citrus',
  'Tart',
  'Cooling',
  'Creamy',
  'Classic',
] as const;

export const AVOID_OPTIONS = [
  'Too Sweet',
  'Too Strong',
  'Too Minty',
  'Too Spicy',
  'Too Cooling',
  'Too Floral',
] as const;

export const flavours: Flavour[] = [
  { id: 'al-fauz-blue-berry', name: 'Blue Berry', brand: 'AL FAUZ', tags: ['Fruity', 'Tart', 'Sweet'], strength: 'Light', character: 'Jammy berry with a cool, dark edge.', orb: { light: 'hsl(215 78% 77%)', mid: 'hsl(224 57% 53%)', deep: 'hsl(245 45% 27%)' } },
  { id: 'al-fauz-orange', name: 'Orange', brand: 'AL FAUZ', tags: ['Citrus', 'Fruity', 'Fresh'], strength: 'Light', character: 'Bright orange peel and a clean finish.', orb: { light: 'hsl(41 91% 77%)', mid: 'hsl(28 87% 53%)', deep: 'hsl(13 66% 29%)' } },
  { id: 'al-fauz-grape', name: 'Grape', brand: 'AL FAUZ', tags: ['Fruity', 'Sweet', 'Classic'], strength: 'Medium', character: 'Ripe purple grape, rounded and familiar.', orb: { light: 'hsl(293 60% 76%)', mid: 'hsl(278 51% 48%)', deep: 'hsl(265 43% 26%)' } },
  { id: 'al-fauz-rose', name: 'Rose', brand: 'AL FAUZ', tags: ['Floral', 'Sweet', 'Exotic'], strength: 'Medium', character: 'Soft rose petals with a perfumed lift.', orb: { light: 'hsl(350 78% 82%)', mid: 'hsl(348 51% 61%)', deep: 'hsl(340 42% 31%)' } },
  { id: 'al-fakher-mint', name: 'Mint', brand: 'AL FAKHER', tags: ['Minty', 'Cooling', 'Fresh'], strength: 'Strong', character: 'A direct, crisp mint that resets the palate.', orb: { light: 'hsl(157 56% 80%)', mid: 'hsl(163 52% 45%)', deep: 'hsl(167 43% 22%)' } },
  { id: 'al-fakher-vanilla', name: 'Vanilla', brand: 'AL FAKHER', tags: ['Creamy', 'Sweet', 'Classic'], strength: 'Light', character: 'Silky vanilla custard with gentle warmth.', orb: { light: 'hsl(45 75% 85%)', mid: 'hsl(39 57% 63%)', deep: 'hsl(31 44% 31%)' } },
  { id: 'al-fakher-double-apple', name: 'Double Apple', brand: 'AL FAKHER', tags: ['Classic', 'Fruity', 'Spiced'], strength: 'Strong', character: 'Anise-led apple with a traditional backbone.', orb: { light: 'hsl(74 64% 78%)', mid: 'hsl(85 45% 49%)', deep: 'hsl(91 35% 25%)' } },
  { id: 'afzal-watermelon', name: 'Watermelon', brand: 'AFZAL', tags: ['Fruity', 'Sweet', 'Fresh'], strength: 'Light', character: 'Juicy summer melon, easy and bright.', orb: { light: 'hsl(2 84% 80%)', mid: 'hsl(2 67% 56%)', deep: 'hsl(342 46% 28%)' } },
  { id: 'afzal-pan-raas', name: 'Pan Raas', brand: 'AFZAL', tags: ['Spiced', 'Exotic', 'Classic'], strength: 'Strong', character: 'Aromatic paan spice with a deep linger.', orb: { light: 'hsl(106 47% 76%)', mid: 'hsl(126 43% 39%)', deep: 'hsl(144 42% 19%)' } },
  { id: 'afzal-mango', name: 'Mango', brand: 'AFZAL', tags: ['Fruity', 'Sweet', 'Exotic'], strength: 'Medium', character: 'Dense golden mango with tropical richness.', orb: { light: 'hsl(49 91% 78%)', mid: 'hsl(34 86% 51%)', deep: 'hsl(17 68% 29%)' } },
  { id: 'afzal-cigar', name: 'Cigar', brand: 'AFZAL', tags: ['Classic', 'Spiced'], strength: 'Strong', character: 'Dry tobacco warmth for a slow, serious session.', orb: { light: 'hsl(31 61% 69%)', mid: 'hsl(24 46% 42%)', deep: 'hsl(19 42% 20%)' } },
  { id: 'royal-smoking-spring-water', name: 'Spring Water', brand: 'ROYAL SMOKING', tags: ['Fresh', 'Cooling'], strength: 'Light', character: 'Barely-there freshness that opens a blend.', orb: { light: 'hsl(188 74% 83%)', mid: 'hsl(190 54% 57%)', deep: 'hsl(201 49% 28%)' } },
  { id: 'royal-smoking-kiwi', name: 'Kiwi', brand: 'ROYAL SMOKING', tags: ['Tart', 'Fruity', 'Fresh'], strength: 'Medium', character: 'Sharp green kiwi with a lively tang.', orb: { light: 'hsl(77 67% 78%)', mid: 'hsl(83 57% 48%)', deep: 'hsl(101 46% 24%)' } },
  { id: 'huqqle-puff-american-freezer', name: 'American Freezer', brand: 'HUQQLE PUFF', tags: ['Cooling', 'Minty', 'Fruity'], strength: 'Strong', character: 'Icy blue freshness with a candy-fruit finish.', orb: { light: 'hsl(198 92% 83%)', mid: 'hsl(196 73% 49%)', deep: 'hsl(211 60% 25%)' } },
  { id: 'starwalker-sub-zero', name: 'Sub-Zero', brand: 'STARWALKER', tags: ['Cooling', 'Minty', 'Fresh'], strength: 'Strong', character: 'A clean, unmistakably cold inhale.', orb: { light: 'hsl(183 72% 82%)', mid: 'hsl(184 57% 51%)', deep: 'hsl(192 55% 24%)' } },
  { id: 'starwalker-astro-love', name: 'Astro Love', brand: 'STARWALKER', tags: ['Fruity', 'Floral', 'Exotic'], strength: 'Medium', character: 'Airy fruit and petals with a playful orbit.', orb: { light: 'hsl(323 73% 84%)', mid: 'hsl(307 56% 56%)', deep: 'hsl(278 47% 27%)' } },
  { id: 'mahroosh-god-father', name: 'God Father', brand: 'MAHROOSH', tags: ['Classic', 'Spiced', 'Strong'], strength: 'Strong', character: 'Bold spice and dry depth with a long finish.', orb: { light: 'hsl(31 61% 72%)', mid: 'hsl(20 58% 42%)', deep: 'hsl(14 55% 21%)' } },
  { id: 'mahroosh-red-devil', name: 'Red Devil', brand: 'MAHROOSH', tags: ['Fruity', 'Tart', 'Spiced'], strength: 'Strong', character: 'Dark red fruit with a peppery spark.', orb: { light: 'hsl(4 84% 75%)', mid: 'hsl(5 68% 48%)', deep: 'hsl(351 57% 24%)' } },
  { id: 'adalya-lady-killer', name: 'Lady Killer', brand: 'ADALYA', tags: ['Fruity', 'Floral', 'Exotic'], strength: 'Medium', character: 'A lounge favourite: tropical, floral, and smooth.', orb: { light: 'hsl(337 80% 82%)', mid: 'hsl(341 60% 54%)', deep: 'hsl(317 45% 28%)' } },
  { id: 'adalya-love-66', name: 'Love 66', brand: 'ADALYA', tags: ['Fruity', 'Citrus', 'Exotic'], strength: 'Medium', character: 'Tropical citrus with an easy crowd-pleasing pull.', orb: { light: 'hsl(55 87% 80%)', mid: 'hsl(44 79% 52%)', deep: 'hsl(25 66% 27%)' } },
];

export const brands = [...new Set(flavours.map((flavour) => flavour.brand))];

export const getFlavour = (id: string) => flavours.find((flavour) => flavour.id === id);