'use client';

interface SliderSettingsSectionProps {
  settings: any;
  setSettings: (s: any) => void;
}

import { useAdminLanguage } from '@/context/AdminLanguageContext';

export default function SliderSettingsSection({ settings, setSettings }: SliderSettingsSectionProps) {
  const { lang, t } = useAdminLanguage();
  const s = t.slider;

  const inputClass = `w-full border border-gray-200 bg-gray-50/50 rounded-lg px-4 py-3.5 text-sm font-semibold text-gray-900 placeholder:text-gray-400 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all ${lang === 'ar' ? 'text-right' : ''}`;
  const labelClass = `text-[13px] font-bold text-gray-700 block mb-2 ${lang === 'ar' ? 'text-right' : ''}`;

  return (
    <div className={`space-y-6 ${lang === 'ar' ? 'font-sans' : ''}`}>
      <h3 className="text-lg font-bold text-gray-800 pb-3 border-b border-gray-100">{s.title}</h3>
      <div className="space-y-5">
        <div>
          <label className={labelClass}>{s.headlineLabel}</label>
          <input 
            type="text" 
            value={settings.sliderHeadline} 
            onChange={(e) => setSettings({...settings, sliderHeadline: e.target.value})} 
            placeholder={s.headlinePlaceholder} 
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>{s.subLabel}</label>
          <input 
            type="text" 
            value={settings.sliderSubheadline} 
            onChange={(e) => setSettings({...settings, sliderSubheadline: e.target.value})} 
            placeholder={s.subPlaceholder} 
            className={inputClass}
          />
        </div>
      </div>
    </div>
  );
}
