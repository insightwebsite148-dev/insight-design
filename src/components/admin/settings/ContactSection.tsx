'use client';

import { useAdminLanguage } from '@/context/AdminLanguageContext';
import { MessageCircle, Globe, Facebook, Instagram, CheckCircle, AlertTriangle } from 'lucide-react';
import { toEmbedUrl } from '@/lib/mapUtils';

interface ContactSectionProps {
  settings: any;
  setSettings: (s: any | ((prev: any) => any)) => void;
}

const TikTokIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.75a8.18 8.18 0 004.76 1.52V6.84a4.84 4.84 0 01-1-.15z"/>
  </svg>
);

export default function ContactSection({ settings, setSettings }: ContactSectionProps) {
  const { lang, t } = useAdminLanguage();
  const contact = t.settings.contact;
  const wa = t.settings.whatsapp;

  const updateSchema = (key: string, value: any) => {
    setSettings((prev: any) => ({
      ...prev,
      schema: {
        ...(prev.schema || {}),
        [key]: value
      }
    }));
  };

  const inputClass = `w-full border border-gray-200 bg-gray-50/50 rounded-lg px-4 py-3.5 text-sm font-semibold text-gray-900 placeholder:text-gray-400 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all ${lang === 'ar' ? 'text-right' : ''}`;
  const labelClass = `text-[13px] font-bold text-gray-700 block mb-2 ${lang === 'ar' ? 'text-right' : ''}`;

  return (
    <div className={`space-y-10 ${lang === 'ar' ? 'font-sans' : ''}`}>
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-6 pb-3 border-b border-gray-100">{contact.title}</h3>
      </div>
      
      {/* Basic Contact Info */}
      <div className="space-y-5">
        <div>
          <label className={labelClass}>{contact.address}</label>
          <input 
            type="text" 
            value={settings.address || ''} 
            onChange={(e) => setSettings({...settings, address: e.target.value})} 
            className={inputClass}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className={labelClass}>{contact.mapUrl}</label>
            <textarea 
              value={settings.mapEmbedUrl || ''}
              onChange={(e) => {
                const raw = e.target.value;
                // Auto-convert if user pastes a regular Google Maps URL
                const embed = toEmbedUrl(raw);
                if (embed && raw !== embed && !raw.includes('/maps/embed')) {
                  setSettings({...settings, mapEmbedUrl: embed});
                } else {
                  setSettings({...settings, mapEmbedUrl: raw});
                }
              }}
              rows={2}
              className={`${inputClass} resize-none`}
            />
            {settings.mapEmbedUrl ? (
              toEmbedUrl(settings.mapEmbedUrl) ? (
                <p className={`text-[11px] font-medium text-emerald-500 mt-1.5 flex items-center gap-1 ${lang === 'ar' ? 'flex-row-reverse text-right' : ''}`}>
                  <CheckCircle size={12} /> {lang === 'ar' ? 'رابط خريطة صالح ✓' : 'Valid embed URL ✓'}
                </p>
              ) : (
                <p className={`text-[11px] font-medium text-amber-500 mt-1.5 flex items-center gap-1 ${lang === 'ar' ? 'flex-row-reverse text-right' : ''}`}>
                  <AlertTriangle size={12} /> {lang === 'ar' ? 'استخدم رابط تضمين من Google Maps (يحتوي على /maps/embed)' : 'Use a Google Maps embed URL (contains /maps/embed)'}
                </p>
              )
            ) : (
              <p className={`text-[11px] font-medium text-gray-400 mt-1.5 ${lang === 'ar' ? 'text-right' : ''}`}>
                {contact.mapTip}
              </p>
            )}
          </div>
          <div className="space-y-5">
            <div>
              <label className={labelClass}>{contact.phone}</label>
              <input 
                type="text" 
                value={settings.phone || ''} 
                onChange={(e) => setSettings({...settings, phone: e.target.value})} 
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>{contact.email}</label>
              <input 
                type="text" 
                value={settings.email || ''} 
                onChange={(e) => setSettings({...settings, email: e.target.value})} 
                className={inputClass}
              />
            </div>
          </div>
        </div>
      </div>

      {/* WhatsApp Section */}
      <div className="pt-8 border-t border-gray-100 space-y-5">
        <div className={`flex items-center gap-3 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
          <div className="w-8 h-8 rounded-lg bg-[#25D366]/10 flex items-center justify-center">
            <MessageCircle size={16} className="text-[#25D366]" />
          </div>
          <h4 className="text-[14px] font-bold text-gray-800">WhatsApp</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className={labelClass}>{wa?.numberLabel || 'WhatsApp Number'}</label>
            <input 
              type="text" 
              value={settings.whatsappNumber || ''} 
              onChange={(e) => setSettings((prev: any) => ({...prev, whatsappNumber: e.target.value}))} 
              placeholder={wa?.numberPlaceholder || '+971...'} 
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>{wa?.messageLabel || 'Default Message'}</label>
            <textarea 
              rows={2}
              value={settings.whatsappMessage || ''} 
              onChange={(e) => setSettings((prev: any) => ({...prev, whatsappMessage: e.target.value}))} 
              className={`${inputClass} resize-none`}
            />
          </div>
        </div>
      </div>

      {/* Social Links Section */}
      <div className="pt-8 border-t border-gray-100 space-y-5">
        <div className={`flex items-center gap-3 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
          <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
            <Globe size={16} className="text-accent" />
          </div>
          <h4 className="text-[14px] font-bold text-gray-800">Social Media</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className={`${labelClass} flex items-center justify-between ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
              <span>Facebook</span> <Facebook size={14} className="text-gray-400" />
            </label>
            <input 
              type="text" 
              value={settings.schema?.facebook || ''} 
              onChange={(e) => updateSchema('facebook', e.target.value)} 
              placeholder="https://facebook.com/..." 
              className={inputClass}
            />
          </div>
          <div>
            <label className={`${labelClass} flex items-center justify-between ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
              <span>Instagram</span> <Instagram size={14} className="text-gray-400" />
            </label>
            <input 
              type="text" 
              value={settings.schema?.instagram || ''} 
              onChange={(e) => updateSchema('instagram', e.target.value)} 
              placeholder="https://instagram.com/..." 
              className={inputClass}
            />
          </div>
          <div>
            <label className={`${labelClass} flex items-center justify-between ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
              <span>TikTok</span> <TikTokIcon size={14} />
            </label>
            <input 
              type="text" 
              value={settings.schema?.tiktok || ''} 
              onChange={(e) => updateSchema('tiktok', e.target.value)} 
              placeholder="https://tiktok.com/..." 
              className={inputClass}
            />
          </div>
        </div>
      </div>
      
    </div>
  );
}
