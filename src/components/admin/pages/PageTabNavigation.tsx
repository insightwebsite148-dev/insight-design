'use client';

import { Info, Mail, Briefcase, Home } from 'lucide-react';

interface PageSubTabProps {
  activeTab: 'Home' | 'About' | 'Contact' | 'Works';
  onTabChange: (tab: 'Home' | 'About' | 'Contact' | 'Works') => void;
}

import { useAdminLanguage } from '@/context/AdminLanguageContext';

export default function PageTabNavigation({ activeTab, onTabChange }: PageSubTabProps) {
  const { lang, t } = useAdminLanguage();
  const tabs: ('Home' | 'About' | 'Works' | 'Contact')[] = ['Home', 'About', 'Works', 'Contact'];

  const getTabIcon = (tab: 'Home' | 'About' | 'Works' | 'Contact') => {
    switch (tab) {
      case 'Home':
        return <Home size={14} />;
      case 'About':
        return <Info size={14} />;
      case 'Works':
        return <Briefcase size={14} />;
      case 'Contact':
        return <Mail size={14} />;
      default:
        return null;
    }
  };

  const getTabText = (tab: 'Home' | 'About' | 'Works' | 'Contact') => {
    switch (tab) {
      case 'Home':
        return lang === 'ar' ? 'الصفحة الرئيسية' : 'Hero / Home Page';
      case 'About':
        return lang === 'ar' ? 'من نحن (كاملة)' : 'About Page Full';
      case 'Works':
        return lang === 'ar' ? 'معرض الأعمال' : 'Portfolio Layout';
      case 'Contact':
        return lang === 'ar' ? 'اتصل بنا' : 'Contact Details';
      default:
        return '';
    }
  };

  return (
    <div className={`flex bg-white p-1 border border-border rounded-sm shadow-sm gap-1 ${lang === 'ar' ? 'font-sans' : ''}`}>
      {tabs.map((tab) => (
        <button 
          key={tab}
          onClick={() => onTabChange(tab)} 
          className={`flex items-center gap-2.5 px-4 py-2 text-[11px] font-bold uppercase tracking-widest transition-all rounded-sm ${
            activeTab === tab ? 'bg-primary text-background shadow-md' : 'text-muted hover:text-primary hover:bg-slate-50'
          }`}
        >
          {getTabIcon(tab)}
          <span>{getTabText(tab)}</span>
        </button>
      ))}
    </div>
  );
}
