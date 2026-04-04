'use client';

import { FONT_CATALOG, getFontCSS } from './FontCatalog';
import FontSizeControls from './FontSizeControls';

interface TypographyLabProps {
  settings: any;
  setSettings: (s: any) => void;
}

import { useAdminLanguage } from '@/context/AdminLanguageContext';

export default function TypographyLab({ settings, setSettings }: TypographyLabProps) {
  const { lang, t } = useAdminLanguage();
  const typo = t.settings.typography;

  const FontOption = ({ font, current, onSelect }: any) => (
    <button
      type="button"
      onClick={() => onSelect(font.name)}
      className={`w-full text-left px-5 py-3.5 border transition-all flex items-center justify-between group/btn rounded-sm ${
        current === font.name 
          ? 'bg-primary text-white border-primary shadow-lg' 
          : 'bg-white border-slate-100/80 hover:border-accent/40 hover:bg-slate-50'
      }`}
    >
      <span className="text-[13px] font-medium truncate" style={{ fontFamily: font.css }}>{font.name}</span>
      <span className={`text-[7px] font-bold uppercase tracking-widest ${current === font.name ? 'text-white/60' : 'text-slate-400'}`}>
        {font.desc}
      </span>
    </button>
  );

  return (
    <div className={`bg-white border border-border overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.08)] ${lang === 'ar' ? 'font-sans' : ''}`}>
      <div className="bg-slate-50/80 backdrop-blur-md px-10 py-8 border-b border-border flex items-center justify-between">
        <div>
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">{typo.foundation}</h3>
          <p className="text-[10px] font-bold text-slate-500 mt-1.5 uppercase tracking-widest">{typo.protocol}</p>
        </div>
        <div className="w-12 h-12 rounded-full border border-accent/20 flex items-center justify-center text-accent bg-accent/5">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 7V4h16v3M9 20h6M12 4v16"/></svg>
        </div>
      </div>
      
      <div className="p-10 space-y-14">
        {/* Live Preview Type-Tester */}
        <div className="p-12 border border-slate-100 bg-slate-50/50 relative overflow-hidden flex flex-col items-center text-center">
          <span className="absolute top-4 left-4 text-[9px] font-black tracking-[0.4em] text-slate-300 uppercase">{typo.analysis}</span>
          <div className="space-y-8 pt-6 max-w-2xl px-4">
             <h1 
               className="text-4xl lg:text-5.5xl leading-[1.1] tracking-tight pb-6 border-b border-accent/5" 
               style={{ fontFamily: getFontCSS(settings.headlineFont), fontWeight: settings.headlineWeight }}
             >
               {typo.testerHeadline}
             </h1>
             <p 
               className="text-[13px] md:text-[15px] leading-relaxed text-slate-500 uppercase tracking-widest"
               style={{ fontFamily: getFontCSS(settings.bodyFont), fontWeight: settings.bodyWeight }}
             >
               {typo.testerBody}
             </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Headline Font Selection */}
          <div className="space-y-6">
            <label className="text-[10px] font-black uppercase tracking-[0.4em] text-accent flex items-center gap-3">
              <span className="h-[1px] w-8 bg-accent" /> {typo.headlineIdentity}
            </label>

            {Object.entries(FONT_CATALOG).map(([category, fonts]) => (
              <div key={category}>
                <p className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-400 mb-3 ml-1">{category}</p>
                <div className="grid grid-cols-1 gap-1.5">
                  {fonts.map(font => (
                    <FontOption key={font.name} font={font} current={settings.headlineFont} onSelect={(name: string) => setSettings((prev: any) => ({ ...prev, headlineFont: name }))} />
                  ))}
                </div>
              </div>
            ))}

            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                <span>{typo.density}</span>
                <span className="text-primary">{settings.headlineWeight}</span>
              </div>
              <input type="range" min="100" max="900" step="100"
                value={settings.headlineWeight}
                onChange={(e) => setSettings((prev: any) => ({...prev, headlineWeight: e.target.value}))}
                className="w-full accent-primary h-1 rounded-full cursor-pointer"
              />
              <div className="h-14 bg-slate-50/50 border border-slate-100 flex items-center justify-center overflow-hidden">
                <span className="truncate" style={{ fontFamily: getFontCSS(settings.headlineFont), fontWeight: settings.headlineWeight, fontSize: '24px' }}>
                  {lang === 'ar' ? 'نموذج الخط' : 'Weight Preview'}
                </span>
              </div>
            </div>
          </div>

          {/* Body Font Selection */}
          <div className="space-y-6">
            <label className="text-[10px] font-black uppercase tracking-[0.4em] text-accent flex items-center gap-3">
              <span className="h-[1px] w-8 bg-accent" /> {typo.readingSurface}
            </label>
            
            {Object.entries(FONT_CATALOG).map(([category, fonts]) => (
              <div key={category}>
                <p className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-400 mb-3 ml-1">{category}</p>
                <div className="grid grid-cols-1 gap-1.5">
                  {fonts.map(font => (
                    <FontOption key={font.name} font={font} current={settings.bodyFont} onSelect={(name: string) => setSettings((prev: any) => ({ ...prev, bodyFont: name }))} />
                  ))}
                </div>
              </div>
            ))}

            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                <span>{typo.readability}</span>
                <span className="text-primary">{settings.bodyWeight}</span>
              </div>
              <input type="range" min="100" max="900" step="100"
                value={settings.bodyWeight}
                onChange={(e) => setSettings((prev: any) => ({...prev, bodyWeight: e.target.value}))}
                className="w-full accent-primary h-1 rounded-full cursor-pointer"
              />
              <div className="h-14 bg-slate-50/50 border border-slate-100 flex items-center justify-center overflow-hidden">
                <span className="truncate" style={{ fontFamily: getFontCSS(settings.bodyFont), fontWeight: settings.bodyWeight, fontSize: '18px' }}>
                  {lang === 'ar' ? 'نموذج الخط' : 'Weight Preview'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <FontSizeControls settings={settings} setSettings={setSettings} />
      </div>
    </div>
  );
}
