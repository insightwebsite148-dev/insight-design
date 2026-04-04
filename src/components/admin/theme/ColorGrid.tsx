'use client';

import ColorInput from './ColorInput';
import { Palette, Paintbrush, Layers, Type, AlertTriangle } from 'lucide-react';

interface ColorGridProps {
  theme: Record<string, string>;
  update: (key: string, val: string) => void;
}

import { useAdminLanguage } from '@/context/AdminLanguageContext';

export default function ColorGrid({ theme, update }: ColorGridProps) {
  const { lang, t } = useAdminLanguage();
  const colors = t.settings.colors;

  return (
    <div className={`space-y-12 ${lang === 'ar' ? 'font-sans' : ''}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Basic Brand Colors */}
        <div className="bg-slate-50/50 border border-slate-100 p-10 space-y-8 rounded-sm">
          <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-200/50">
            <Palette size={20} className="text-accent" />
            <h3 className="text-sm font-black uppercase tracking-widest">{lang === 'ar' ? 'الألوان الأساسية' : 'Core Colors'}</h3>
          </div>
          <ColorInput label={colors.background} value={theme.background} onChange={(v) => update('background', v)} />
          <ColorInput label={colors.foreground} value={theme.foreground} onChange={(v) => update('foreground', v)} />
        </div>

        {/* Action Colors */}
        <div className="bg-slate-50/50 border border-slate-100 p-10 space-y-8 rounded-sm">
          <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-200/50">
            <Paintbrush size={20} className="text-accent" />
            <h3 className="text-sm font-black uppercase tracking-widest">{lang === 'ar' ? 'ألوان التفاعل' : 'Action Colors'}</h3>
          </div>
          <ColorInput label={colors.primary} value={theme.primary} onChange={(v) => update('primary', v)} />
          <ColorInput label={colors.accentLabel} value={theme.accent} onChange={(v) => update('accent', v)} />
        </div>
      </div>
      
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center italic">
        {lang === 'ar' 
          ? 'ملاحظة: يتم تعديل بقية الألوان تلقائياً بناءً على اختيارك للألوان الأساسية لضمان تناسق الموقع.' 
          : 'Note: Other site colors are automatically adjusted based on your core selections to ensure consistency.'}
      </p>
    </div>
  );
}
