'use client';

import { useAdminLanguage } from '@/context/AdminLanguageContext';
import { MessageCircle, Phone } from 'lucide-react';

interface WhatsAppSettingsSectionProps {
  settings: any;
  setSettings: (s: any | ((prev: any) => any)) => void;
}

export default function WhatsAppSettingsSection({ settings, setSettings }: WhatsAppSettingsSectionProps) {
  const { lang, t } = useAdminLanguage();
  const wa = t.settings.whatsapp;

  return (
    <div className={`bg-white p-10 border border-border shadow-sm ${lang === 'ar' ? 'font-sans' : ''}`}>
      <div className="flex items-center space-x-3 mb-8 pb-4 border-b border-border">
        <MessageCircle size={20} className="text-[#25D366]" />
        <h3 className={`text-xl font-bold tracking-tighter uppercase ${lang === 'ar' ? 'mr-3' : ''}`}>{wa.title}</h3>
      </div>
      
      <div className="space-y-6">
        <div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-muted block mb-2">{wa.numberLabel}</label>
          <div className="relative group">
            <input 
              type="text" 
              value={settings.whatsappNumber} 
              onChange={(e) => setSettings((prev: any) => ({...prev, whatsappNumber: e.target.value}))} 
              placeholder={wa.numberPlaceholder} 
              className={`w-full bg-slate-50 border border-border px-4 py-3 ${lang === 'ar' ? 'pr-10' : 'pl-10'} text-xs font-bold focus:outline-none focus:border-[#25D366] transition-all`} 
            />
            <Phone size={14} className={`absolute ${lang === 'ar' ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-[#25D366] transition-colors`} />
          </div>
          <p className="text-[8px] text-slate-400 mt-2 italic">{wa.formatStep}</p>
        </div>

        <div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-muted block mb-2">{wa.messageLabel}</label>
          <textarea 
            rows={4}
            value={settings.whatsappMessage} 
            onChange={(e) => setSettings((prev: any) => ({...prev, whatsappMessage: e.target.value}))} 
            placeholder={wa.messagePlaceholder} 
            className="w-full bg-slate-50 border border-border px-4 py-3 text-xs font-bold focus:outline-none focus:border-[#25D366] transition-all resize-none" 
          />
          <div className={`mt-3 p-4 bg-slate-50 ${lang === 'ar' ? 'border-r-2' : 'border-l-2'} border-accent`}>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-primary mb-2">{wa.variablesTitle}</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="text-[9px]"><code className="text-accent font-black">{`{NAME}`}</code> - {wa.nameVar}</div>
              <div className="text-[9px]"><code className="text-accent font-black">{`{TYPE}`}</code> - {wa.typeVar}</div>
              <div className="text-[9px]"><code className="text-accent font-black">{`{MESSAGE}`}</code> - {wa.messageVar}</div>
            </div>
            <p className="text-[8px] text-slate-400 mt-2 italic">{wa.exampleTip}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
