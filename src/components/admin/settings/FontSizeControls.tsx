'use client';

interface FontSizeControlsProps {
  settings: any;
  setSettings: (s: any) => void;
}

import { useAdminLanguage } from '@/context/AdminLanguageContext';
import { getFontCSS } from './FontCatalog';

export default function FontSizeControls({ settings, setSettings }: FontSizeControlsProps) {
  const { lang, t } = useAdminLanguage();
  const typo = t.settings.typography;
  
  const fields = [
    { label: typo.heroSize, key: 'heroFontSize', icon: 'H1' },
    { label: typo.sectionSize, key: 'sectionFontSize', icon: 'S' },
    { label: typo.bodySize, key: 'bodyFontSize', icon: 'B' },
    { label: typo.h2Size, key: 'headlineFontSize', icon: 'H2' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pt-10 border-t border-slate-100/50">
      {fields.map(f => (
        <div key={f.key} className="space-y-4">
          <div className={`flex justify-between items-center ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-accent flex items-center gap-2">
              <span className="w-5 h-5 bg-accent/5 flex items-center justify-center text-[8px] border border-accent/20 font-bold">{f.icon}</span>
              {f.label}
            </label>
            <span className="text-[11px] font-black text-primary bg-slate-100 px-2 py-0.5 rounded-sm">{settings[f.key]}px</span>
          </div>
          
          <input 
            type="range" 
            min="8" 
            max="120"
            value={parseFloat(settings[f.key]) || 16}
            onChange={(e) => setSettings((prev: any) => ({...prev, [f.key]: e.target.value}))}
            className="w-full accent-primary h-1.5 bg-slate-100 rounded-full cursor-pointer appearance-none hover:bg-slate-200 transition-colors"
          />

          <div className="h-20 bg-slate-50 border border-slate-100/50 rounded-sm flex items-center justify-center overflow-hidden">
             <span 
               className="text-primary truncate"
               style={{ 
                 fontSize: `${parseFloat(settings[f.key]) || 16}px`,
                 fontFamily: getFontCSS(settings[f.key === 'headlineFontSize' || f.key === 'heroFontSize' ? 'headlineFont' : 'bodyFont'])
               }}
             >
               {lang === 'ar' ? 'نموذج الخط' : 'Font Preview'}
             </span>
          </div>
        </div>
      ))}
    </div>
  );
}
