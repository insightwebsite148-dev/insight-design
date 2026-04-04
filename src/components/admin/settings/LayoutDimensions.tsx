'use client';

import { SmartRange } from '../SmartControls';
import { useAdminLanguage } from '@/context/AdminLanguageContext';

interface LayoutDimensionsProps {
  settings: any;
  setSettings: (s: any | ((prev: any) => any)) => void;
}

export default function LayoutDimensions({ settings, setSettings }: LayoutDimensionsProps) {
  const { lang, t } = useAdminLanguage();
  const l = t.layout;

  return (
    <div className={`space-y-10 ${lang === 'ar' ? 'font-sans' : ''}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Hero Height */}
        <SmartRange 
          label={l.heroHeight}
          value={settings.heroHeight || 100}
          min={50}
          max={100}
          unit="vh"
          onChange={(val) => setSettings((prev: any) => ({...prev, heroHeight: `${val}vh`}))}
        />

        {/* Slider Height */}
        <SmartRange 
          label={l.sliderHeight}
          value={settings.sliderHeight || 600}
          min={300}
          max={1000}
          step={50}
          unit="px"
          onChange={(val) => setSettings((prev: any) => ({...prev, sliderHeight: `${val}px`}))}
        />

        {/* Client Logo Scale */}
        <SmartRange 
          label={l.logoScale}
          value={settings.clientLogoSize || 80}
          min={40}
          max={180}
          step={10}
          unit="px"
          onChange={(val) => setSettings((prev: any) => ({...prev, clientLogoSize: `${val}px`}))}
        />
      </div>

      {/* Modern Visualization Preview */}
      <div className="pt-8 border-t border-gray-100">
        <div className="flex items-center gap-4 mb-8">
           <span className="text-[12px] font-bold text-gray-400">{l.previewTitle}</span>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Mockup 1: Hero & Slider */}
          <div className="aspect-video bg-gray-50 rounded-xl border border-gray-100 p-10 flex flex-col items-center justify-center gap-6 relative group overflow-hidden">
             <div className="w-full max-w-[200px] border border-gray-200 bg-white rounded-lg transition-all duration-500 shadow-lg" style={{ height: `calc(${(parseInt(settings.heroHeight) || 100) / 2}px)` }}>
                <div className="w-full h-full flex flex-col items-center justify-center gap-2 p-4">
                   <div className="w-1/2 h-2 bg-gray-100 rounded" />
                   <div className="w-1/3 h-1 bg-accent/30 rounded" />
                </div>
             </div>
             <div className="w-full max-w-[150px] bg-white border border-gray-200 rounded-lg shadow-md transition-all duration-500" style={{ height: `calc(${(parseInt(settings.sliderHeight) || 600) / 8}px)` }} />
             <span className={`absolute bottom-4 ${lang === 'ar' ? 'right-6' : 'left-6'} text-[10px] font-semibold text-gray-300`}>{l.impactLabel}</span>
          </div>

          {/* Mockup 2: Logo Scale */}
          <div className="aspect-video bg-gray-50 rounded-xl border border-gray-100 p-10 grid grid-cols-3 items-center justify-items-center relative overflow-hidden">
             {[1, 2, 3].map(i => (
                <div 
                  key={i}
                  className="bg-white border border-gray-100 rounded-lg flex items-center justify-center transition-all duration-700 shadow-sm"
                  style={{ 
                    width: `calc(${(parseInt(settings.clientLogoSize) || 80) * 0.8}px)`, 
                    height: `calc(${(parseInt(settings.clientLogoSize) || 80) * 0.8}px)` 
                  }}
                >
                  <div className="w-1/2 h-1/2 bg-gray-100 rounded-full" />
                </div>
             ))}
             <span className={`absolute bottom-4 ${lang === 'ar' ? 'right-6' : 'left-6'} text-[10px] font-semibold text-gray-300`}>{l.scaleLabel}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
