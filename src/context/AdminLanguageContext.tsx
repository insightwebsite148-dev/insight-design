'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { AdminLanguage, translations } from '@/lib/admin-translations';

interface AdminLanguageContextType {
  lang: AdminLanguage;
  setLang: (lang: AdminLanguage) => void;
  t: any;
}

const AdminLanguageContext = createContext<AdminLanguageContextType | undefined>(undefined);

export function AdminLanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<AdminLanguage>('en');

  // Persistence
  useEffect(() => {
    const saved = localStorage.getItem('admin-lang') as AdminLanguage;
    if (saved && (saved === 'en' || saved === 'ar')) {
      setLangState(saved);
    }
  }, []);

  const setLang = (newLang: AdminLanguage) => {
    setLangState(newLang);
    localStorage.setItem('admin-lang', newLang);
  };

  const t = translations[lang];

  return (
    <AdminLanguageContext.Provider value={{ lang, setLang, t }}>
      <div dir={lang === 'ar' ? 'rtl' : 'ltr'} className={lang === 'ar' ? 'font-sans' : ''}>
        {children}
      </div>
    </AdminLanguageContext.Provider>
  );
}

export function useAdminLanguage() {
  const context = useContext(AdminLanguageContext);
  if (context === undefined) {
    throw new Error('useAdminLanguage must be used within an AdminLanguageProvider');
  }
  return context;
}
