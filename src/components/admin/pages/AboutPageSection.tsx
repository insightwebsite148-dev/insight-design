'use client';

import { useState } from 'react';
import { Layout, FileText, Globe } from 'lucide-react';
import AdminImageUploader from '../shared/AdminImageUploader';

interface AboutPageSectionProps {
  data: any;
  setData: (data: any | ((prev: any) => any)) => void;
}

import { useAdminLanguage } from '@/context/AdminLanguageContext';

interface AboutPageSectionProps {
  data: any;
  setData: (data: any | ((prev: any) => any)) => void;
}

export default function AboutPageSection({ data, setData }: AboutPageSectionProps) {
  const { lang, t } = useAdminLanguage();
  const [isUploading, setIsUploading] = useState(false);
  const pT = t.pages;

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-10 ${lang === 'ar' ? 'font-sans' : ''}`}>
      {/* Hero Configuration */}
      <div className="bg-white border border-border overflow-hidden shadow-sm">
        <div className={`bg-slate-50 px-6 py-4 border-b border-border flex items-center gap-3 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
          <Layout size={16} className="text-accent" />
          <h4 className="text-[10px] font-black uppercase tracking-[0.3em]">{pT.sections.hero}</h4>
        </div>
        <div className="p-8 space-y-6">
          <div className="space-y-2 text-right">
            <label className={`text-[9px] font-bold uppercase tracking-widest text-muted block ${lang === 'ar' ? 'text-right' : ''}`}>{pT.fields.headline}</label>
            <input 
              type="text" 
              value={data.heroHeadline} 
              onChange={e => setData((prev: any) => ({...prev, heroHeadline: e.target.value}))} 
              className={`w-full bg-slate-50 border border-border px-5 py-4 text-xs font-bold focus:outline-none focus:border-accent uppercase ${lang === 'ar' ? 'text-right' : ''}`} 
            />
          </div>
          <div className="space-y-2">
            <label className={`text-[9px] font-bold uppercase tracking-widest text-muted block ${lang === 'ar' ? 'text-right' : ''}`}>{pT.fields.subtext}</label>
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
               folder="pages/about"
             />
          </div>
        </div>
      </div>

      {/* Story Configuration */}
      <div className="bg-white border border-border overflow-hidden shadow-sm">
        <div className={`bg-slate-50 px-6 py-4 border-b border-border flex items-center gap-3 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
          <FileText size={16} className="text-accent" />
          <h4 className="text-[10px] font-black uppercase tracking-[0.3em]">{pT.sections.story}</h4>
        </div>
        <div className="p-8 space-y-6">
          <div className="space-y-2">
            <label className={`text-[9px] font-bold uppercase tracking-widest text-muted block ${lang === 'ar' ? 'text-right' : ''}`}>{pT.fields.storyTitle}</label>
            <input 
              type="text" 
              value={data.storyTitle} 
              onChange={e => setData({...data, storyTitle: e.target.value})} 
              className={`w-full bg-slate-50 border border-border px-5 py-4 text-xs font-bold focus:outline-none focus:border-accent uppercase ${lang === 'ar' ? 'text-right' : ''}`} 
            />
          </div>
          <div className="space-y-2">
            <label className={`text-[9px] font-bold uppercase tracking-widest text-muted block ${lang === 'ar' ? 'text-right' : ''}`}>{pT.fields.storyContent}</label>
            <textarea 
              rows={6} 
              value={data.storyContent} 
              onChange={e => setData({...data, storyContent: e.target.value})} 
              className={`w-full bg-slate-50 border border-border px-5 py-4 text-xs font-bold focus:outline-none focus:border-accent uppercase leading-loose ${lang === 'ar' ? 'text-right' : ''}`} 
            />
          </div>
          <div className="pt-4 border-t border-border mt-4">
             <AdminImageUploader 
               value={data.storyImage} 
               onChange={url => setData({...data, storyImage: url})}
               label={pT.fields.assetUrl}
               folder="pages/about"
             />
          </div>
        </div>
      </div>

      {/* Beliefs & Visions */}
      <div className="bg-white border border-border overflow-hidden shadow-sm lg:col-span-2">
        <div className={`bg-slate-50 px-6 py-4 border-b border-border flex items-center gap-3 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
          <Globe size={16} className="text-accent" />
          <h4 className="text-[10px] font-black uppercase tracking-[0.3em]">{pT.sections.beliefs}</h4>
        </div>
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-2">
            <label className={`text-[9px] font-bold uppercase tracking-widest text-muted block ${lang === 'ar' ? 'text-right' : ''}`}>{pT.fields.mission}</label>
            <textarea 
              rows={4} 
              value={data.mission} 
              onChange={e => setData({...data, mission: e.target.value})} 
              className={`w-full bg-slate-50 border border-border px-5 py-4 text-xs font-bold focus:outline-none focus:border-accent uppercase leading-loose ${lang === 'ar' ? 'text-right' : ''}`} 
            />
          </div>
          <div className="space-y-2">
            <label className={`text-[9px] font-bold uppercase tracking-widest text-muted block ${lang === 'ar' ? 'text-right' : ''}`}>{pT.fields.vision}</label>
            <textarea 
              rows={4} 
              value={data.vision} 
              onChange={e => setData({...data, vision: e.target.value})} 
              className={`w-full bg-slate-50 border border-border px-5 py-4 text-xs font-bold focus:outline-none focus:border-accent uppercase leading-loose ${lang === 'ar' ? 'text-right' : ''}`} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
