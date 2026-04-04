'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { HeroData } from './constants';
import EditableWrapper from '../EditableWrapper';
import { useSettings } from '@/context/SettingsContext';

interface HeroContentProps {
  data: HeroData;
  typedText: string;
}

export default function HeroContent({ data, typedText }: HeroContentProps) {
  return (
    <div className="flex flex-col justify-center items-center text-center pt-10 lg:pt-0 z-20 w-full max-w-5xl mx-auto">
      {/* Tagline */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="mb-8 flex flex-col items-center gap-4"
      >
        <div className="flex items-center gap-3">
          <span className="h-[1px] w-8 bg-accent/50"></span>
          <EditableWrapper
            collection="settings"
            documentId="general"
            field="heroTagline"
            value="THE ART OF LIVING"
            type="text"
          >
            <span className="text-[12px] font-black uppercase tracking-[0.5em] text-accent">
              THE ART OF LIVING
            </span>
          </EditableWrapper>
          <span className="h-[1px] w-8 bg-accent/50"></span>
        </div>
      </motion.div>

      {/* Headline with Typing Effect */}
      <EditableWrapper
        collection="settings"
        documentId="general"
        field="heroHeadline"
        value={data.heroHeadline}
        type="text"
        styleField="heroHeadline"
      >
        <div className="mb-0 relative w-full flex justify-center">
          {/* Invisible structural layer to pre-allocate height */}
          <div className="invisible pointer-events-none select-none w-full text-center" aria-hidden="true" style={{ fontSize: 'clamp(3rem, 7vw, 6rem)' }}>
            {data.heroHeadline.split('\n').map((line: string, i: number) => (
              <div key={i} className="pb-3 leading-[1.1] text-center">
                <h1 className="font-bold tracking-tight block text-center uppercase">{line}</h1>
              </div>
            ))}
          </div>

          {/* Front visible typing layer */}
          <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center text-center">
            {typedText.split('\n').map((line: string, i: number, arr: string[]) => (
              <div key={i} className="pb-3 leading-[1.1] flex items-center justify-center w-full">
                <h1
                  className="font-bold text-white tracking-tighter block drop-shadow-[0_10px_40px_rgba(0,0,0,0.5)] text-center w-full uppercase"
                  style={{ fontSize: 'clamp(2.5rem, 8vw, 6.5rem)' }}
                >
                  {line}
                  {i === arr.length - 1 && (
                    <motion.span
                      animate={{ opacity: [1, 1, 0, 0, 1] }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="inline-block w-[2px] md:w-[4px] bg-accent ml-3"
                      style={{ height: '0.9em', verticalAlign: 'middle' }}
                    />
                  )}
                </h1>
              </div>
            ))}
          </div>
        </div>
      </EditableWrapper>

      {/* Subheadline */}
      <motion.div className="overflow-hidden mb-16 max-w-3xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 0.7, ease: [0.16, 1, 0.3, 1] as const }}
        >
          <EditableWrapper
            collection="settings"
            documentId="general"
            field="heroSubheadline"
            value={data.heroSubheadline}
            type="text"
            styleField="heroSub"
            placeholder="hero Subtext"
          >
            <p className="font-light leading-relaxed text-[#F3F0EB]/80 text-lg md:text-xl tracking-wide font-sans px-4 min-h-[1.5em]">
              {data.heroSubheadline}
            </p>
          </EditableWrapper>
        </motion.div>
      </motion.div>

      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, delay: 0.9, ease: [0.16, 1, 0.3, 1] as const }}
        className="flex flex-col sm:flex-row items-center justify-center gap-8 w-full"
      >
        {/* Portfolio CTA */}
        <Link href="/portfolio" className="relative group w-full sm:w-auto block overflow-hidden">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="relative h-16 sm:h-20 px-16 sm:px-20 bg-white shadow-2xl transition-all duration-700 flex items-center justify-center overflow-hidden border border-black/5"
          >
            <div className="absolute inset-0 bg-accent translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-[0.16,1,0.3,1]" />
            <span className="relative z-10 text-[13px] font-black uppercase tracking-[0.4em] text-primary group-hover:text-white group-hover:tracking-[0.5em] transition-all duration-700">
              Explore Works
            </span>
          </motion.div>
        </Link>

        {/* WhatsApp CTA */}
        <WhatsAppHeroButton />
      </motion.div>
    </div>
  );
}

// WhatsApp CTA button with green branding
function WhatsAppHeroButton() {
  const { settings } = useSettings();
  const phone = (settings?.whatsappNumber || settings?.phone || '').replace(/[^\d+]/g, '');
  const message = settings?.whatsappMessage || 'مرحباً، أريد الاستفسار عن مشروع.';
  const whatsappUrl = phone ? `https://wa.me/${phone}?text=${encodeURIComponent(message)}` : '#';

  return (
    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="relative group w-full sm:w-auto block overflow-hidden">
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="relative h-16 sm:h-20 px-16 sm:px-20 bg-transparent border border-[#25D366]/40 backdrop-blur-sm transition-all duration-700 flex items-center justify-center gap-4 overflow-hidden"
      >
        <div className="absolute inset-0 bg-[#25D366] translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-[0.16,1,0.3,1]" />

        <svg viewBox="0 0 24 24" fill="currentColor" className="relative z-10 w-5 h-5 text-[#25D366] group-hover:text-white transition-colors duration-700">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>

        <span className="relative z-10 text-[13px] font-black uppercase tracking-[0.4em] text-white group-hover:text-white group-hover:tracking-[0.5em] transition-all duration-700">
          WhatsApp Us
        </span>
      </motion.div>
    </a>
  );
}
