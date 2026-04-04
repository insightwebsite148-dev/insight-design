'use client';

import { Edit3, Trash2, MapPin } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface ProjectTableRowProps {
  project: any;
  onEdit: (project: any) => void;
  onDelete: (id: string, title: string) => void;
}

import { useAdminLanguage } from '@/context/AdminLanguageContext';

export default function ProjectTableRow({ project, onEdit, onDelete }: ProjectTableRowProps) {
  const { lang, t } = useAdminLanguage();
  const pT = t.projects;

  return (
    <tr className={`hover:bg-slate-50/80 transition-colors group border-b border-border/50 ${lang === 'ar' ? 'font-sans' : ''}`}>
      <td className="p-3.5">
        <div className={`flex items-center gap-5 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
          <div className="w-14 h-14 relative border border-border/40 overflow-hidden bg-slate-100 shadow-inner group-hover:scale-105 transition-transform duration-500 rounded-sm leading-none shrink-0">
            <Image 
              src={(project.images?.[0] || project.image || '/placeholder.png').replace('/upload/', '/upload/w_120,c_fill,q_auto,f_auto/')} 
              alt={project.title} 
              fill 
              sizes="64px" 
              className="object-cover"
              loading="lazy"
            />
          </div>
          <div className={lang === 'ar' ? 'text-right' : ''}>
            <p className="font-bold text-base text-slate-800 group-hover:text-accent transition-colors leading-tight mb-0.5">{project.title}</p>
            <p className={`text-[13px] text-slate-500 flex items-center font-medium ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
              <MapPin size={12} className={`${lang === 'ar' ? 'ml-1.5' : 'mr-1.5'} text-accent/70`} /> 
              {project.location}
            </p>
          </div>
        </div>
      </td>
      <td className="p-3.5">
        <div className={`space-y-0.5 ${lang === 'ar' ? 'text-right' : ''}`}>
          <span className="text-sm font-bold text-slate-700 block">{project.category}</span>
          <span className="text-[13px] font-medium text-slate-400">{project.style}</span>
        </div>
      </td>
      <td className="p-3.5 text-center">
        <span className={`px-2.5 py-1 rounded-sm text-[10px] font-black uppercase tracking-widest border ${
          project.status === 'Completed' 
            ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
            : 'bg-amber-50 text-amber-700 border-amber-100'
        }`}>
          {project.status || 'Draft'}
        </span>
      </td>
      <td className={`p-3.5 ${lang === 'ar' ? 'text-left' : 'text-right'}`}>
        <div className={`flex items-center gap-2 opacity-40 group-hover:opacity-100 transition-opacity ${lang === 'ar' ? 'justify-start' : 'justify-end'}`}>
          <button 
            onClick={() => onEdit(project)}
            className="p-2.5 bg-white border border-border shadow-sm hover:text-accent hover:border-accent transition-all rounded-sm"
          >
            <Edit3 size={15} />
          </button>
          <button 
            onClick={() => onDelete(project.id, project.title)}
            className="p-2.5 bg-white border border-border shadow-sm hover:text-red-500 hover:border-red-500 transition-all rounded-sm"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </td>
    </tr>
  );
}
