'use client';

import { useEffect } from 'react';
import { useSettings } from '@/context/SettingsContext';

export default function TypographyManager() {
  const { settings } = useSettings();

  useEffect(() => {
    if (!settings) return;

    const normalizeUnit = (val: string, defaultUnit = 'px') => {
      if (!val) return '';
      const trimmed = val.trim().replace(/\s/g, '');
      if (/^\d+$/.test(trimmed)) return `${trimmed}${defaultUnit}`;
      return trimmed;
    };

    const root = document.documentElement;
    
    // Font Sizes
    if (settings.heroFontSize) root.style.setProperty('--hero-font-size', normalizeUnit(settings.heroFontSize));
    if (settings.sectionFontSize) root.style.setProperty('--section-font-size', normalizeUnit(settings.sectionFontSize));
    if (settings.bodyFontSize) root.style.setProperty('--body-font-size', normalizeUnit(settings.bodyFontSize));
    if (settings.headlineFontSize) root.style.setProperty('--headline-font-size', normalizeUnit(settings.headlineFontSize));

    // Font Families & Weights
    const fontMap: Record<string, string> = {
      'Cormorant Garamond': 'var(--font-cormorant)',
      'Playfair Display': 'var(--font-playfair)',
      'Montserrat': 'var(--font-montserrat)',
      'Inter': 'var(--font-inter)',
      'DM Serif Display': 'var(--font-dm-serif)',
      'Libre Baskerville': 'var(--font-libre-baskerville)',
      'Josefin Sans': 'var(--font-josefin)',
      'Raleway': 'var(--font-raleway)',
      'Poppins': 'var(--font-poppins)',
      'Lora': 'var(--font-lora)',
      'Merriweather': 'var(--font-merriweather)',
      'Outfit': 'var(--font-outfit)',
      'Space Grotesk': 'var(--font-space-grotesk)',
      'Sora': 'var(--font-sora)',
      'Plus Jakarta Sans': 'var(--font-jakarta)',
      'Crimson Pro': 'var(--font-crimson)'
    };

    const unifiedFont = settings.bodyFont || settings.headlineFont;
    if (unifiedFont) {
      const fontVar = fontMap[unifiedFont] || 'var(--font-sans)';
      root.style.setProperty('--font-headline', fontVar);
      root.style.setProperty('--font-body', fontVar);
    }
    
    if (settings.headlineWeight) {
      root.style.setProperty('--font-headline-weight', settings.headlineWeight);
    }
    if (settings.bodyWeight) {
      root.style.setProperty('--font-body-weight', settings.bodyWeight);
    }
  }, [settings]);

  return null;
}
