'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, Layout, Type, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import ProjectTaxonomyFields from './ProjectTaxonomyFields';
import SimpleImageUploader from '../shared/SimpleImageUploader';
import MultiImageUploader from '../shared/MultiImageUploader';
import { useAdminLanguage } from '@/context/AdminLanguageContext';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingProject: any;
  formData: any;
  setFormData: (data: any | ((prev: any) => any)) => void;
  onSave: (e: React.FormEvent) => void;
  isSaving: boolean;
}

export default function ProjectModal({
  isOpen, onClose, editingProject, formData, setFormData, onSave, isSaving
}: ProjectModalProps) {
  const { lang, t } = useAdminLanguage();
  const f = t.projects.fields;
  const a = t.projects.assets;
  const m = t.projects.modal;
  
  const [categories, setCategories] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const qCat = query(collection(db, 'categories'), orderBy('name', 'asc'));
        const qLoc = query(collection(db, 'locations'), orderBy('name', 'asc'));
        const [catSnap, locSnap] = await Promise.all([getDocs(qCat), getDocs(qLoc)]);
        setCategories(catSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setLocations(locSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error('Error fetching taxonomy for modal:', error);
      }
    };
    if (isOpen) fetchData();
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-xl p-6"
        >
          <motion.div 
            initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
            dir={lang === 'ar' ? 'rtl' : 'ltr'}
            className={`bg-white max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-4xl border border-black/5 rounded-none relative flex flex-col ${lang === 'ar' ? 'font-sans' : ''}`}
          >
            {/* Header */}
            <div className="bg-white px-8 py-7 border-b border-black/[0.03] flex justify-between items-center">
              <div>
                <h3 className="text-3xl font-black tracking-tighter uppercase leading-none mb-2">
                  {editingProject ? m.editTitle : m.newTitle}
                </h3>
                <p className="text-[11px] font-black uppercase text-black/40">{a.registrySubtitle}</p>
              </div>
              <button 
                onClick={onClose}
                className="w-12 h-12 rounded-full hover:bg-black/[0.03] flex items-center justify-center text-black/40 hover:text-black transition-all"
              >
                <X size={24} />
              </button>
            </div>

            {/* Form Content */}
            <form onSubmit={onSave} className="flex-1 overflow-y-auto p-10 space-y-12">
              
              {/* SECTION: PRIMARY DISCOVERY (THE 5 CORE FIELDS) */}
              <div className="space-y-12">
                
                {/* 1. Project Identity */}
                <div className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Type size={14} className="text-accent" />
                      <label className="text-[12px] font-black uppercase text-black/60">{f.title}</label>
                    </div>
                    <input required type="text" value={formData.title}
                      onChange={(e) => setFormData((prev: any) => ({...prev, title: e.target.value}))}
                      placeholder={f.placeholderTitle}
                      className={`w-full bg-black/[0.02] border border-black/5 px-6 py-4.5 text-lg font-black outline-none focus:border-accent ${lang === 'en' ? 'uppercase' : ''} transition-all`}
                    />
                  </div>
                  
                  <ProjectTaxonomyFields 
                    categories={categories} 
                    locations={locations} 
                    formData={formData} 
                    setFormData={setFormData} 
                  />
                </div>

                {/* 2. Project Visuals Grid */}
                <div className="pt-8 border-t border-black/5">
                  <div className="flex items-center gap-2 mb-6">
                     <Layout size={14} className="text-accent" />
                     <label className="text-[12px] font-black uppercase text-black">{f.visualAssets} {m.galleryLabel || 'Gallery'}</label>
                  </div>
                  
                  <div className="w-full">
                    <MultiImageUploader 
                      label={m.gallerySubtitle || 'Photos Gallery'} 
                      value={formData.images || (formData.image ? [formData.image] : [])} 
                      onChange={(urls) => setFormData((prev: any) => ({...prev, images: urls, image: urls[0] || ''}))} 
                    />
                  </div>
                </div>

              </div>

              {/* Action Bar */}
              <div className="flex justify-end pt-8 border-t border-black/5 mt-8 bg-white sticky bottom-0 z-[10] py-4">
                <button type="submit" disabled={isSaving}
                  className="bg-black text-white px-12 py-4 text-sm font-black uppercase tracking-normal hover:bg-accent transition-all shadow-xl active:scale-95 disabled:opacity-50 flex items-center gap-6"
                >
                  {isSaving ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <CheckCircle2 size={18} />
                  )}
                  <span>{isSaving ? m.saving : m.save}</span>
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
