'use client';

import CTAContent from './cta/CTAContent';
import CTAForm from './cta/CTAForm';
import { useSettings } from '@/context/SettingsContext';
import { DEFAULT_SETTINGS } from '@/lib/constants';

export default function CTASection({ initialSettings, initialCategories }: { initialSettings?: any; initialCategories?: any[] }) {
  const { settings: globalSettings, categories: globalCategories } = useSettings();

  const s = globalSettings || initialSettings || {};
  const data = {
    ctaHeadline: s.ctaHeadline || DEFAULT_SETTINGS.ctaHeadline,
    ctaSubheadline: s.ctaSubheadline || DEFAULT_SETTINGS.ctaSubheadline,
    whatsappNumber: s.whatsappNumber || DEFAULT_SETTINGS.whatsappNumber,
    whatsappMessage: 'I would like to discuss a new project with Insight.',
  };

  const categories = globalCategories.length > 0 ? globalCategories : (initialCategories || []);

  return (
    <section className="bg-background py-32 px-6 relative overflow-hidden border-t border-accent/10">
      <div className="max-w-[1400px] mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 lg:gap-32 items-center">
          <CTAContent headline={data.ctaHeadline} subheadline={data.ctaSubheadline} />
          <CTAForm 
            categories={categories} 
            loadingCats={false} 
            whatsappNumber={data.whatsappNumber} 
            whatsappMessage={data.whatsappMessage} 
          />
        </div>
      </div>
      
      {/* Background Decorative Architecture Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-accent" />
        <div className="absolute top-1/3 left-0 w-full h-[0.5px] bg-accent" />
        <div className="absolute top-2/3 left-0 w-full h-[0.5px] bg-accent" />
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-accent" />
        
        <div className="absolute top-0 left-0 w-[1px] h-full bg-accent" />
        <div className="absolute top-0 left-1/4 w-[0.5px] h-full bg-accent" />
        <div className="absolute top-0 left-2/4 w-[0.5px] h-full bg-accent" />
        <div className="absolute top-0 left-3/4 w-[0.5px] h-full bg-accent" />
        <div className="absolute top-0 right-0 w-[1px] h-full bg-accent" />
      </div>

      {/* Radial Gradient for focus */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,transparent_0%,var(--background)_100%)] pointer-events-none" />
    </section>
  );
}
