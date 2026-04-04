export const FONT_CATALOG = {
  'Serif Fonts': [
    { name: 'Cormorant Garamond', css: 'var(--font-cormorant)', desc: 'Elegant & luxurious' },
    { name: 'Playfair Display', css: 'var(--font-playfair)', desc: 'Classic editorial' },
    { name: 'DM Serif Display', css: 'var(--font-dm-serif)', desc: 'Bold & modern serif' },
    { name: 'Libre Baskerville', css: 'var(--font-libre-baskerville)', desc: 'Refined & readable' },
    { name: 'Lora', css: 'var(--font-lora)', desc: 'Warm contemporary' },
    { name: 'Merriweather', css: 'var(--font-merriweather)', desc: 'Strong & dignified' },
    { name: 'Crimson Pro', css: 'var(--font-crimson)', desc: 'Scholarly & clean' },
  ],
  'Sans-Serif Fonts': [
    { name: 'Inter', css: 'var(--font-inter)', desc: 'Ultra-clean UI font' },
    { name: 'Montserrat', css: 'var(--font-montserrat)', desc: 'Geometric modern' },
    { name: 'Raleway', css: 'var(--font-raleway)', desc: 'Sleek & minimal' },
    { name: 'Poppins', css: 'var(--font-poppins)', desc: 'Friendly geometric' },
    { name: 'Outfit', css: 'var(--font-outfit)', desc: 'Soft & contemporary' },
    { name: 'Josefin Sans', css: 'var(--font-josefin)', desc: 'Art Deco vibes' },
    { name: 'Space Grotesk', css: 'var(--font-space-grotesk)', desc: 'Tech-forward' },
    { name: 'Sora', css: 'var(--font-sora)', desc: 'Precise & modern' },
    { name: 'Plus Jakarta Sans', css: 'var(--font-jakarta)', desc: 'Premium versatile' },
  ],
};

export const ALL_FONTS = [...FONT_CATALOG['Serif Fonts'], ...FONT_CATALOG['Sans-Serif Fonts']];

export function getFontCSS(fontName: string): string {
  const found = ALL_FONTS.find(f => f.name === fontName);
  return found ? found.css : 'inherit';
}
