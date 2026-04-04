'use client';

import { AlertCircle } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import ProjectTableRow from './ProjectTableRow';

interface ProjectTableProps {
  projects: any[];
  loading: boolean;
  onEdit: (project: any) => void;
  onDelete: (id: string, title: string) => void;
}

import { useAdminLanguage } from '@/context/AdminLanguageContext';

export default function ProjectTable({ projects, loading, onEdit, onDelete }: ProjectTableProps) {
  const { lang, t } = useAdminLanguage();

  return (
    <div className="bg-white border border-border shadow-2xl overflow-hidden rounded-sm">
      <div className="overflow-x-auto">
        <table className={`w-full ${lang === 'ar' ? 'text-right' : 'text-left'} border-collapse min-w-[800px]`}>
          <thead>
            <tr className="bg-slate-50/50 border-b border-border">
              <th className={`p-4 text-[12px] font-black uppercase tracking-[0.2em] text-primary/40 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{t.projects.table.title}</th>
              <th className={`p-4 text-[12px] font-black uppercase tracking-[0.2em] text-primary/40 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{t.projects.table.category}</th>
              <th className="p-4 text-[12px] font-black uppercase tracking-[0.2em] text-primary/40 text-center">{t.projects.table.status}</th>
              <th className={`p-4 text-[12px] font-black uppercase tracking-[0.2em] text-primary/40 ${lang === 'ar' ? 'text-left' : 'text-right'}`}>{t.projects.table.actions}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            <AnimatePresence mode="wait">
              {loading ? (
                <tr key="loading-spinner">
                  <td colSpan={4} className="py-12 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mb-4" />
                      <span className="text-[12px] font-bold uppercase tracking-[0.3em] text-muted">{t.projects.assets.retrieving}</span>
                    </div>
                  </td>
                </tr>
              ) : projects.length === 0 ? (
                <tr key="no-projects">
                  <td colSpan={4} className="py-12 text-center">
                    <AlertCircle className="mx-auto text-muted/20 mb-4" size={48} />
                    <span className="text-[12px] font-bold uppercase tracking-[0.3em] text-muted">{t.projects.assets.noWorksFound}</span>
                  </td>
                </tr>
              ) : (
                projects.map((project) => (
                  <ProjectTableRow 
                    key={project.id} 
                    project={project} 
                    onEdit={onEdit} 
                    onDelete={onDelete} 
                  />
                ))
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
}
