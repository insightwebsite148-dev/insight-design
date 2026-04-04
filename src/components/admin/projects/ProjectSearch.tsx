'use client';

import { Search, Plus } from 'lucide-react';

interface ProjectSearchProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onAddClick: () => void;
}

import { useAdminLanguage } from '@/context/AdminLanguageContext';

export default function ProjectSearch({ searchTerm, onSearchChange, onAddClick }: ProjectSearchProps) {
  const { lang, t } = useAdminLanguage();

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <div className="relative w-full md:w-96 group">
        <Search className={`absolute ${lang === 'ar' ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-muted group-focus-within:text-accent transition-colors`} size={16} />
        <input 
          type="text" 
          placeholder={t.projects.searchPlaceholder} 
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className={`w-full bg-white border border-border ${lang === 'ar' ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-2.5 text-[12px] font-bold uppercase tracking-widest focus:outline-none focus:border-accent shadow-sm transition-all`}
        />
      </div>
      <button 
        onClick={onAddClick}
        className="bg-primary text-background px-6 py-2.5 text-[12px] font-bold uppercase tracking-widest flex items-center space-x-3 gap-3 hover:bg-accent hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all w-full md:w-auto justify-center rounded-sm"
      >
        <Plus size={18} />
        <span>{t.projects.addProject}</span>
      </button>
    </div>
  );
}
