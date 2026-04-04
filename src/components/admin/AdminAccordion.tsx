'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Layers } from 'lucide-react';

interface AdminAccordionProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

import { useAdminLanguage } from '@/context/AdminLanguageContext';

export default function AdminAccordion({ title, icon, children, defaultOpen = false }: AdminAccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const { lang } = useAdminLanguage();

  return (
    <div className={`overflow-hidden transition-all duration-300 rounded-xl ${isOpen ? 'shadow-lg shadow-black/8 ring-2 ring-black/10' : 'shadow-sm ring-1 ring-black/[0.06] hover:ring-black/15 hover:shadow-md'} ${lang === 'ar' ? 'font-sans' : ''}`}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-6 py-4.5 flex items-center justify-between transition-all duration-300 group ${isOpen ? 'bg-gradient-to-r from-black via-gray-900 to-black text-white' : 'bg-white text-gray-900 hover:bg-gray-50/80'} ${lang === 'ar' ? 'flex-row-reverse text-right' : 'text-left'}`}
      >
        <div className={`flex items-center gap-4 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-500 ${isOpen ? 'bg-white/15 text-white shadow-inner' : 'bg-gray-100 text-gray-600 group-hover:bg-accent/10 group-hover:text-accent'} group-hover:scale-110`}>
            {icon || <Layers size={16} />}
          </div>
          <span className={`text-[13px] font-extrabold uppercase tracking-wide ${isOpen ? 'text-white' : 'text-gray-800'}`}>{title}</span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <ChevronDown size={18} className={`transition-colors duration-300 ${isOpen ? 'text-accent' : 'text-gray-300 group-hover:text-gray-500'}`} />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className={`px-7 pb-8 pt-7 bg-white border-t border-gray-100 ${lang === 'ar' ? 'text-right' : ''}`}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
