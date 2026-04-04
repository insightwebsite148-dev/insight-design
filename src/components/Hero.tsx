'use client';

import { useEffect, useState, useRef } from 'react';
import { DEFAULT_SETTINGS } from '@/lib/constants';
import HeroBackground from './hero/HeroBackground';
import HeroContent from './hero/HeroContent';
import HeroImage from './hero/HeroImage';
import EditableWrapper from './EditableWrapper';
import { useSettings } from '@/context/SettingsContext';

export default function Hero({ initialSettings }: { initialSettings?: any }) {
  const { settings: globalSettings } = useSettings();

  const resolvedSettings = globalSettings || initialSettings || {};

  const normalizeUnit = (val: string, defaultUnit = 'px') => {
    if (!val) return '';
    const trimmed = val.trim().replace(/\s/g, '');
    if (/^\d+$/.test(trimmed)) return `${trimmed}${defaultUnit}`;
    return trimmed;
  };

  const data = {
    heroHeadline: resolvedSettings.heroHeadline || DEFAULT_SETTINGS.heroHeadline,
    heroSubheadline: resolvedSettings.heroSubheadline || DEFAULT_SETTINGS.heroSubheadline,
    heroButton1: resolvedSettings.heroButton1 || 'Explore Works',
    heroButton2: resolvedSettings.heroButton2 || 'WhatsApp Us',
    heroImage: resolvedSettings.heroImage || '',
    heroHeight: normalizeUnit(resolvedSettings.heroHeight, 'vh') || '100vh',
    typingSpeed: resolvedSettings.typingSpeed || 120,
    typingPause: resolvedSettings.typingPause || 4000,
  };
  
  const [typedText, setTypedText] = useState('');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Robust Typing Effect Logic
  useEffect(() => {
    let index = 0;
    let isDeleting = false;
    const fullText = data.heroHeadline || '';

    const handleTyping = () => {
      const currentText = fullText.substring(0, index);
      setTypedText(currentText);

      let delta = isDeleting ? data.typingSpeed / 2 : data.typingSpeed;

      if (!isDeleting && index === fullText.length) {
        delta = data.typingPause;
        isDeleting = true;
      } else if (isDeleting && index === 0) {
        isDeleting = false;
        delta = 500;
      }

      index = isDeleting ? index - 1 : index + 1;
      
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(handleTyping, delta);
    };

    timerRef.current = setTimeout(handleTyping, 1000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [data.heroHeadline, data.typingSpeed, data.typingPause]);

  return (
    <section 
      className="relative flex items-center justify-center overflow-hidden w-full bg-primary"
      style={{ minHeight: `calc(${data.heroHeight} - 80px)` }}
    >
      <div className="absolute inset-0 z-0 bg-neutral-900">
        {data.heroImage ? (
          <EditableWrapper
            collection="settings"
            documentId="general"
            field="heroImage"
            value={data.heroImage}
            type="image"
          >
            <HeroImage src={data.heroImage} isBackground={true} />
          </EditableWrapper>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-neutral-900 via-neutral-800 to-black animate-pulse" />
        )}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="container relative z-10 mx-auto px-6 lg:px-16 flex flex-col items-center justify-center text-center py-20">
        <HeroContent data={data} typedText={typedText} />
      </div>
    </section>
  );
}
