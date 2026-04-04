'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Edit3, Trash2, Plus } from 'lucide-react';

interface TaxonomyListProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  items: any[];
  type: 'category' | 'location';
  onAdd: () => void;
  onEdit: (item: any) => void;
  onDelete: (id: string, type: 'category' | 'location', name: string) => void;
}

import { useAdminLanguage } from '@/context/AdminLanguageContext';

export default function TaxonomyList({ title, subtitle, icon, items, type, onAdd, onEdit, onDelete }: TaxonomyListProps) {
  const { lang, t } = useAdminLanguage();

  return (
    <section>
      <div className={`flex flex-col md:flex-row justify-between items-start md:items-end mb-5 border-b border-slate-100 pb-3 gap-4`}>
        <div>
          <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
            {icon}
            {title}
          </h3>
          <p className="text-sm text-slate-400 mt-1">{subtitle}</p>
        </div>
        <button 
          onClick={onAdd}
          className="bg-slate-800 text-white px-5 py-2 text-sm font-bold rounded-md flex items-center gap-3 hover:bg-slate-700 transition-all shadow-sm group"
        >
          <Plus size={16} className={`group-hover:rotate-180 transition-transform duration-500`} />
          <span>{t.taxonomy.add} {type === 'category' ? t.sidebar.categories : t.taxonomy.locationsTitle}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <AnimatePresence mode="popLayout">
          {items.map((item) => (
            <motion.div 
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`bg-white p-3 border border-slate-100 shadow-sm rounded-lg flex items-center justify-between group ${lang === 'ar' ? 'font-sans' : ''}`}
            >
              <span className="text-base font-bold text-slate-700">{item.name}</span>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => onEdit(item)} className="p-1.5 text-slate-400 hover:text-accent transition-colors">
                  <Edit3 size={14} />
                </button>
                <button onClick={() => onDelete(item.id, type, item.name)} className="p-1.5 text-slate-400 hover:text-red-500 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
}
