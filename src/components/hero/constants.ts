// Hero default values and shared types
export const defaultHero = {
  heroHeadline: 'INSIGHT DESIGN & CONSTRUCTION',
  heroSubheadline: 'Crafting breathtaking, elegant, and luxurious spaces that captivate the senses and redefine modern living.',
  heroButton1: 'Explore Projects',
  heroButton2: 'Our Vision',
  heroImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop',
  heroHeight: '100vh'
};

export type HeroData = typeof defaultHero;

// Deterministic particle positions (avoid hydration mismatch)
export const PARTICLES = [
  { w: 95, h: 75, l: '12%', t: '25%' },
  { w: 110, h: 60, l: '78%', t: '65%' },
  { w: 70, h: 90, l: '45%', t: '10%' },
  { w: 85, h: 55, l: '30%', t: '80%' },
  { w: 100, h: 80, l: '65%', t: '40%' },
  { w: 60, h: 100, l: '90%', t: '55%' },
];
