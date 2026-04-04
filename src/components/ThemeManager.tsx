'use client';

import { useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

/**
 * ThemeManager — All color values come from Firestore `settings/theme`.
 * The defaultTheme is ONLY used as a last-resort fallback when the
 * database document does not exist at all (e.g. first-time setup).
 */
const defaultTheme: Record<string, string> = {
  // Core Identity
  background: '#ffffff',
  foreground: '#000000',
  primary: '#000000',
  primaryForeground: '#ffffff',

  // Accent & Brand
  accent: '#f25c27',
  accentForeground: '#ffffff',
  accentHover: '#d64f20',

  // Surfaces & Depth
  surface: '#ffffff',
  surfaceAlt: '#fcfcfc',
  card: '#ffffff',
  cardForeground: '#000000',

  // Typography
  muted: '#000000',
  mutedForeground: '#000000',

  // Borders
  border: '#000000',
  borderHover: '#000000',
  ring: '#f25c27',
  input: '#e8e8e8',

  // Status
  success: '#000000',
  danger: '#000000',
  warning: '#f25c27',

  // Destructive
  destructive: '#ef4444',
  destructiveForeground: '#ffffff',

  // Popover (defaults to card values)
  popover: '#ffffff',
  popoverForeground: '#000000',

  // Secondary
  secondary: '#f4f4f4',
  secondaryForeground: '#000000',
};

export default function ThemeManager() {
  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'settings', 'theme'), (snapshot) => {
      const dbTheme: Record<string, any> = snapshot.exists() ? snapshot.data() : {};
      
      // Merge: database values take priority, then defaults fill gaps
      const theme = { ...defaultTheme, ...dbTheme };

      const root = document.documentElement;
      
      // Inject all CSS variables dynamically from the merged theme
      Object.entries(theme).forEach(([key, value]) => {
        const cssVar = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
        root.style.setProperty(cssVar, value as string);
      });

      // Also set derived chart variables based on theme colors
      root.style.setProperty('--chart-1', theme.primary || defaultTheme.primary);
      root.style.setProperty('--chart-2', theme.muted || defaultTheme.muted);
      root.style.setProperty('--chart-3', theme.accent || defaultTheme.accent);
      root.style.setProperty('--chart-4', theme.secondary || defaultTheme.secondary);
      root.style.setProperty('--chart-5', theme.background || defaultTheme.background);

      // Grid tokens derived from accent
      const accentHex = theme.accent || defaultTheme.accent;
      const r = parseInt(accentHex.slice(1, 3), 16);
      const g = parseInt(accentHex.slice(3, 5), 16);
      const b = parseInt(accentHex.slice(5, 7), 16);
      root.style.setProperty('--grid-line', `rgba(${r}, ${g}, ${b}, 0.03)`);

      const bgHex = theme.background || defaultTheme.background;
      const br = parseInt(bgHex.slice(1, 3), 16);
      const bg2 = parseInt(bgHex.slice(3, 5), 16);
      const bb = parseInt(bgHex.slice(5, 7), 16);
      root.style.setProperty('--grid-bg-stop', `rgba(${br}, ${bg2}, ${bb}, 0)`);
    });

    return () => unsubscribe();
  }, []);

  return null;
}
