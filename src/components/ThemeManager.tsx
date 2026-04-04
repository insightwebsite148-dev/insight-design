'use client';

import { useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const defaultTheme = {
  // Core Identity - Extreme High Contrast
  background: '#ffffff',
  foreground: '#000000',
  primary: '#000000',
  primaryForeground: '#ffffff',

  // Accent & Brand (Signature Orange)
  accent: '#f25c27',
  accentForeground: '#ffffff',
  accentHover: '#d64f20',

  // Surfaces & Depth - Pure Black/White
  surface: '#ffffff',
  surfaceAlt: '#fcfcfc',
  card: '#ffffff',
  cardForeground: '#000000',

  // Typography - No Gray allowed as text
  muted: '#000000',
  mutedForeground: '#000000',

  // Borders - Sharp Black
  border: '#000000',
  borderHover: '#000000',
  ring: '#f25c27',

  // Status - High Contrast
  success: '#000000',
  danger: '#000000',
  warning: '#f25c27',
};

export default function ThemeManager() {
  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'settings', 'theme'), (snapshot) => {
      const theme: Record<string, any> = snapshot.exists() ? snapshot.data() : defaultTheme;

      const root = document.documentElement;
      
      // Inject CSS Variables dynamically from Firestore
      Object.entries(theme).forEach(([key, value]) => {
        // Convert camelCase to kebab-case if needed, or just map directly
        const cssVar = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
        root.style.setProperty(cssVar, value as string);
      });

      // Fallback for missing keys from default theme
      Object.entries(defaultTheme).forEach(([key, value]) => {
        const cssVar = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
        if (!theme[key]) {
          root.style.setProperty(cssVar, value as string);
        }
      });
    });

    return () => unsubscribe();
  }, []);

  return null;
}
