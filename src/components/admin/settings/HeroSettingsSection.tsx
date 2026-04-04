'use client';

import AdminImageUploader from '../shared/AdminImageUploader';
import { useAdminLanguage } from '@/context/AdminLanguageContext';

interface HeroSettingsSectionProps {
  settings: any;
  setSettings: (s: any | ((prev: any) => any)) => void;
}

export default function HeroSettingsSection({ settings, setSettings }: HeroSettingsSectionProps) {
  const { lang, t } = useAdminLanguage();
  const h = t.hero;

  const inputClass = `w-full border border-gray-200 bg-gray-50/50 rounded-lg px-4 py-3.5 text-sm font-semibold text-gray-900 placeholder:text-gray-400 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all ${lang === 'ar' ? 'text-right' : ''}`;
  const labelClass = `text-[13px] font-bold text-gray-700 block mb-2 ${lang === 'ar' ? 'text-right' : ''}`;

  return (
    <div className={`space-y-8 ${lang === 'ar' ? 'font-sans' : ''}`}>
      <div className="space-y-5">
        <div>
          <label className={labelClass}>{h.headlineLabel}</label>
          <textarea 
            placeholder={h.headlinePlaceholder} 
            value={settings.heroHeadline} 
            onChange={(e) => setSettings((prev: any) => ({...prev, heroHeadline: e.target.value}))} 
            className={`${inputClass} resize-none`}
            rows={3} 
          />
        </div>
        <div>
          <label className={labelClass}>{h.subLabel}</label>
          <textarea 
            placeholder={h.subPlaceholder} 
            value={settings.heroSubheadline} 
            onChange={(e) => setSettings((prev: any) => ({...prev, heroSubheadline: e.target.value}))} 
            className={`${inputClass} resize-none`}
            rows={2} 
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-6 border-t border-gray-100">
          <div>
            <label className={labelClass}>{h.speedLabel}</label>
            <input 
              type="number" 
              value={settings.typingSpeed || 120} 
              onChange={(e) => setSettings((prev: any) => ({...prev, typingSpeed: Number(e.target.value)}))} 
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>{h.pauseLabel}</label>
            <input 
              type="number" 
              value={settings.typingPause || 4000} 
              onChange={(e) => setSettings((prev: any) => ({...prev, typingPause: Number(e.target.value)}))} 
              className={inputClass}
            />
          </div>
        </div>

        <div className="pt-6 border-t border-gray-100">
          <AdminImageUploader 
            label={h.bgLabel}
            value={settings.heroImage || ''}
            onChange={(url) => setSettings((prev: any) => ({...prev, heroImage: url}))}
            folder="home"
          />
        </div>
      </div>
    </div>
  );
}
