'use client';

import React from 'react';
import { SmartToggle } from '../SmartControls';
import { Globe, Share2, Search, Info } from 'lucide-react';

interface SchemaSectionProps {
  settings: any;
  setSettings: (s: any | ((prev: any) => any)) => void;
}

import { useAdminLanguage } from '@/context/AdminLanguageContext';

export default function SchemaSection({ settings, setSettings }: SchemaSectionProps) {
  const { lang, t } = useAdminLanguage();
  const schemaT = t.marketing.schema;

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
  const helpClass = `text-[11px] font-medium text-gray-400 mt-1.5 leading-relaxed ${lang === 'ar' ? 'text-right' : ''}`;

  return (
    <div className={`space-y-10 ${lang === 'ar' ? 'font-sans' : ''}`}>
      {/* Domain & Search Engine Essentials */}
      <section className="space-y-6">
        <div className={`flex items-center gap-3 mb-4 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
          <div className="w-7 h-7 rounded-md bg-accent/10 flex items-center justify-center">
            <Search size={14} className="text-accent" />
          </div>
          <span className="text-[13px] font-bold text-gray-600">{schemaT.searchMaster}</span>
        </div>

        {/* Site Domain */}
        <div className="space-y-2">
          <label className={labelClass}>
            {lang === 'ar' ? 'دومين الموقع (URL)' : 'Site Domain (URL)'}
          </label>
          <input 
            type="text"
            value={settings.schema?.siteUrl || ''}
            onChange={(e) => updateSchema('siteUrl', e.target.value)}
            placeholder={lang === 'ar' ? 'https://example.com' : 'https://yourdomain.com'}
            className={inputClass}
          />
          <p className={helpClass}>
            {lang === 'ar' 
              ? 'يُستخدم في Sitemap و SEO والروابط. اتركه فارغ إذا لم تشترِ دومين بعد.' 
              : 'Used for Sitemap, SEO & canonical links. Leave empty if no domain yet.'}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className={labelClass}>{schemaT.schemaType}</label>
            <select 
              value={settings.schema?.type || 'Organization'}
              onChange={(e) => updateSchema('type', e.target.value)}
              className={inputClass}
            >
              <option value="Organization">{lang === 'ar' ? 'مؤسسة (علامة تجارية عالمية)' : 'Organization (Global Brand)'}</option>
              <option value="LocalBusiness">{lang === 'ar' ? 'عمل محلي (مكتب إقليمي)' : 'Local Business (Regional Office)'}</option>
              <option value="ProfessionalService">{lang === 'ar' ? 'خدمة احترافية (عمارة/تصميم)' : 'Professional Service (Architecture/Design)'}</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className={labelClass}>{schemaT.orgLogo}</label>
            <input 
              type="text"
              value={settings.schema?.logo || ''}
              onChange={(e) => updateSchema('logo', e.target.value)}
              placeholder={lang === 'ar' ? 'رابط Cloudinary للشعار' : 'Cloudinary URL for Logo'}
              className={inputClass}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className={labelClass}>{schemaT.seoMeta}</label>
          <textarea 
            value={settings.schema?.description || ''}
            onChange={(e) => updateSchema('description', e.target.value)}
            rows={3}
            className={`${inputClass} resize-none`}
            placeholder={schemaT.seoPlaceholder}
          />
        </div>
      </section>

      {/* Advanced Knowledge Graph */}
      <section className="p-5 bg-accent/5 rounded-xl border border-accent/10">
        <div className={`flex items-start gap-4 ${lang === 'ar' ? 'flex-row-reverse text-right' : ''}`}>
          <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
            <Info size={16} className="text-accent" />
          </div>
          <div>
            <h4 className="text-[13px] font-bold text-gray-800 mb-1.5">{schemaT.algoTitle}</h4>
            <p className="text-[12px] font-medium text-gray-500 leading-relaxed">
              {schemaT.algoDesc}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
