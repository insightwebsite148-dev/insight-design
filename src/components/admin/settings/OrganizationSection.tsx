'use client';

import React from 'react';
import { Building2, MapPin, PhoneCall } from 'lucide-react';

interface OrganizationSectionProps {
  settings: any;
  setSettings: (s: any | ((prev: any) => any)) => void;
}

import { useAdminLanguage } from '@/context/AdminLanguageContext';

export default function OrganizationSection({ settings, setSettings }: OrganizationSectionProps) {
  const { lang, t } = useAdminLanguage();
  const orgT = t.marketing.org;

  const updateOrg = (key: string, value: any) => {
    setSettings((prev: any) => ({
      ...prev,
      organization: {
        ...(prev.organization || {}),
        [key]: value
      }
    }));
  };

  const inputClass = `w-full border border-gray-200 bg-gray-50/50 rounded-lg px-4 py-3.5 text-sm font-semibold text-gray-900 placeholder:text-gray-400 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all ${lang === 'ar' ? 'text-right' : ''}`;
  const labelClass = `text-[13px] font-bold text-gray-700 block mb-2 ${lang === 'ar' ? 'text-right' : ''}`;

  return (
    <div className={`space-y-10 ${lang === 'ar' ? 'font-sans' : ''}`}>
      {/* Legal Identity */}
      <section className="space-y-5">
        <div className={`flex items-center gap-3 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
          <div className="w-7 h-7 rounded-md bg-accent/10 flex items-center justify-center">
            <Building2 size={14} className="text-accent" />
          </div>
          <span className="text-[13px] font-bold text-gray-600">{orgT.legalIdentity}</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className={labelClass}>{orgT.legalName}</label>
            <input 
              type="text"
              value={settings.organization?.legalName || ''}
              onChange={(e) => updateOrg('legalName', e.target.value)}
              placeholder={lang === 'ar' ? 'مثال: شركة إنسايت للتصميم المعماري' : 'e.g. Insight Architectural Design LLC'}
              className={inputClass}
            />
          </div>

          <div className="space-y-2">
            <label className={labelClass}>{orgT.foundingYear}</label>
            <input 
              type="text"
              value={settings.organization?.foundingOrder || ''}
              onChange={(e) => updateOrg('foundingOrder', e.target.value)}
              placeholder={lang === 'ar' ? 'مثال: 2015' : 'e.g. 2015'}
              className={inputClass}
            />
          </div>
        </div>
      </section>

      {/* Physical Headquarters */}
      <section className="space-y-5 pt-6 border-t border-gray-100">
        <div className={`flex items-center gap-3 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
          <div className="w-7 h-7 rounded-md bg-accent/10 flex items-center justify-center">
            <MapPin size={14} className="text-accent" />
          </div>
          <span className="text-[13px] font-bold text-gray-600">{orgT.hqAddress}</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className={labelClass}>{orgT.street}</label>
            <input 
              type="text"
              value={settings.organization?.street || ''}
              onChange={(e) => updateOrg('street', e.target.value)}
              className={inputClass}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className={labelClass}>{orgT.city}</label>
              <input 
                type="text"
                value={settings.organization?.locality || ''}
                onChange={(e) => updateOrg('locality', e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="space-y-2">
              <label className={labelClass}>{orgT.postCode}</label>
              <input 
                type="text"
                value={settings.organization?.postalCode || ''}
                onChange={(e) => updateOrg('postalCode', e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Global Contact Points */}
      <section className="space-y-5 pt-6 border-t border-gray-100">
        <div className={`flex items-center gap-3 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
          <div className="w-7 h-7 rounded-md bg-accent/10 flex items-center justify-center">
            <PhoneCall size={14} className="text-accent" />
          </div>
          <span className="text-[13px] font-bold text-gray-600">{orgT.contactPoints}</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="space-y-2">
            <label className={labelClass}>{orgT.supportPhone}</label>
            <input 
              type="text"
              value={settings.organization?.phone || ''}
              onChange={(e) => updateOrg('phone', e.target.value)}
              className={inputClass}
            />
          </div>
          <div className="col-span-2 space-y-2">
            <label className={labelClass}>{orgT.taxId}</label>
            <input 
              type="text"
              value={settings.organization?.taxId || ''}
              onChange={(e) => updateOrg('taxId', e.target.value)}
              className={inputClass}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
