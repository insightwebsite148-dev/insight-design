'use client';

import { useState } from 'react';
import { Layout, Globe, Instagram, Linkedin, Facebook } from 'lucide-react';
import AdminImageUploader from '../shared/AdminImageUploader';
import { useAdminLanguage } from '@/context/AdminLanguageContext';

interface ContactPageSectionProps {
  data: any;
  setData: (data: any | ((prev: any) => any)) => void;
}

export default function ContactPageSection({ data, setData }: ContactPageSectionProps) {
  const { lang, t } = useAdminLanguage();
  const pT = t.pages;

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-10 ${lang === 'ar' ? 'font-sans' : ''}`}>
      <div className="bg-white border border-border overflow-hidden shadow-sm">
        <div className={`bg-slate-50 px-6 py-4 border-b border-border flex items-center gap-3 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
          <Layout size={16} className="text-accent" />
          <h4 className="text-[10px] font-black uppercase tracking-[0.3em]">{pT.sections.hero}</h4>
        </div>
        <div className="p-8 space-y-6">
          <div className="space-y-2">
            <label className={`text-[9px] font-bold uppercase tracking-widest text-muted block ${lang === 'ar' ? 'text-right' : ''}`}>{pT.fields.inquiryHeadline}</label>
            <input 
              type="text" 
              value={data.heroHeadline} 
              onChange={e => setData((prev: any) => ({...prev, heroHeadline: e.target.value}))} 
              className={`w-full bg-slate-50 border border-border px-5 py-4 text-xs font-bold focus:outline-none focus:border-accent uppercase ${lang === 'ar' ? 'text-right' : ''}`} 
            />
          </div>
          <div className="space-y-2">
            <label className={`text-[9px] font-bold uppercase tracking-widest text-muted block ${lang === 'ar' ? 'text-right' : ''}`}>{pT.fields.connectSubtext}</label>
            <textarea 
              rows={3} 
              value={data.heroSubheadline} 
              onChange={e => setData((prev: any) => ({...prev, heroSubheadline: e.target.value}))} 
              className={`w-full bg-slate-50 border border-border px-5 py-4 text-xs font-bold focus:outline-none focus:border-accent uppercase ${lang === 'ar' ? 'text-right' : ''}`} 
            />
          </div>
          <div className="pt-4 border-t border-border mt-4">
             <AdminImageUploader 
               value={data.heroImage} 
               onChange={url => setData((prev: any) => ({...prev, heroImage: url}))}
               label={pT.fields.assetUrl}
               folder="pages/contact"
             />
          </div>
        </div>
      </div>

    </div>
  );
}
