'use client';

import { useEffect } from 'react';
import { useSettings } from '@/context/SettingsContext';

export default function FaviconManager() {
  const { settings } = useSettings();

  useEffect(() => {
    const faviconUrl = settings?.siteFavicon;
    if (faviconUrl) {
      let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      link.href = faviconUrl;
    }
  }, [settings?.siteFavicon]);

  return null;
}
