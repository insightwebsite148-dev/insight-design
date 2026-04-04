'use client';

import AdminImageUploader from '../shared/AdminImageUploader';
import { useAdminLanguage } from '@/context/AdminLanguageContext';

interface BrandingSectionProps {
  settings: any;
  setSettings: (s: any) => void;
}

export default function BrandingSection({ settings, setSettings }: BrandingSectionProps) {
  const { lang, t } = useAdminLanguage();
  const brand = t.settings.branding;

  return (
    <div className={`space-y-10 ${lang === 'ar' ? 'font-sans' : ''}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className={`text-[13px] font-bold text-gray-800 block ${lang === 'ar' ? 'text-right' : ''}`}>{brand.brandName}</label>
          <input 
            type="text" 
            placeholder={brand.placeholderBrand}
            value={settings.brandName || ''} 
            onChange={(e) => setSettings({...settings, brandName: e.target.value})} 
            className={`w-full border border-gray-200 bg-gray-50/50 rounded-lg px-4 py-3.5 text-sm font-semibold text-gray-900 placeholder:text-gray-400 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all ${lang === 'ar' ? 'text-right' : ''}`}
          />
        </div>
        <div className="space-y-2">
          <label className={`text-[13px] font-bold text-gray-800 block ${lang === 'ar' ? 'text-right' : ''}`}>{brand.slogan}</label>
          <input 
            type="text" 
            placeholder={brand.placeholderSlogan}
            value={settings.brandSlogan || ''} 
            onChange={(e) => setSettings({...settings, brandSlogan: e.target.value})} 
            className={`w-full border border-gray-200 bg-gray-50/50 rounded-lg px-4 py-3.5 text-sm font-semibold text-gray-900 placeholder:text-gray-400 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all ${lang === 'ar' ? 'text-right' : ''}`}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-10 pt-8 border-t border-gray-100">
        <div className="space-y-6">
          <AdminImageUploader 
            label={brand.logo}
            value={settings.siteLogo || ''}
            onChange={(url) => setSettings({...settings, siteLogo: url})}
            folder="branding"
          />
          
          {/* Logo Size Control */}
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 space-y-4">
             <div className="flex justify-between items-center">
                <label className="text-[13px] font-bold text-gray-700">{brand.logoScaling}</label>
                <span className="text-[12px] font-bold text-accent bg-accent/10 px-3 py-1 rounded-md">{settings.siteLogoSize || 48}px</span>
             </div>
             <input 
                type="range" 
                min="20" 
                max="200" 
                value={settings.siteLogoSize || 48}
                onChange={(e) => setSettings({...settings, siteLogoSize: Number(e.target.value)})}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
             />
             <div className="flex justify-between text-[11px] font-semibold text-gray-400">
                <span>{brand.micro}</span>
                <span>{brand.standard}</span>
                <span>{brand.max}</span>
             </div>
          </div>
        </div>
        
        <AdminImageUploader 
          label={brand.favicon}
          value={settings.siteFavicon || ''}
          onChange={(url) => setSettings({...settings, siteFavicon: url})}
          folder="branding"
        />
      </div>
    </div>
  );
}
