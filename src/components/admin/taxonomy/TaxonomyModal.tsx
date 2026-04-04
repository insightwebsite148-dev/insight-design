'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, Sparkles, Clock } from 'lucide-react';
import { useAdminLanguage } from '@/context/AdminLanguageContext';

interface TaxonomyModalProps {
  type: 'category' | 'location' | null;
  editingItem: any;
  parentId?: string | null;
  categories?: any[];
  onClose: () => void;
  onSave: (name: string, parentId?: string | null, badge?: string | null) => Promise<void>;
}

export default function TaxonomyModal({ type, editingItem, parentId, categories = [], onClose, onSave }: TaxonomyModalProps) {
  const { lang, t } = useAdminLanguage();
  const tm = t.taxonomy.modal;
  const [name, setName] = useState('');
  const [selectedParent, setSelectedParent] = useState<string | null>(null);
  const [badge, setBadge] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Reset form when modal opens
  useEffect(() => {
    if (type) {
      setName(editingItem?.name || '');
      setSelectedParent(editingItem?.parentId || parentId || null);
      setBadge(editingItem?.badge || null);
    }
  }, [type, editingItem, parentId]);

  // Get possible parent categories (only root and level 1 — max depth 3)
  const possibleParents = categories.filter(c => {
    if (editingItem && c.id === editingItem.id) return false; // Can't be own parent
    const level = c.level || 0;
    return level < 2; // Allow nesting up to 3 levels deep
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setIsSaving(true);
    try {
      if (type === 'category') {
        await onSave(name.trim(), selectedParent, badge);
      } else {
        await onSave(name.trim().toUpperCase());
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {type && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/10 backdrop-blur-sm p-6"
        >
          <motion.div 
            initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
            className={`bg-white max-w-md w-full shadow-2xl rounded-sm border border-slate-100 overflow-hidden ${lang === 'ar' ? 'font-sans text-right' : ''}`}
          >
            <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
              <h3 className={`text-sm font-bold text-slate-800 uppercase ${lang === 'ar' ? 'order-2' : ''}`}>
                {editingItem ? t.taxonomy.edit : t.taxonomy.add} {type === 'category' ? t.sidebar.categories : t.taxonomy.locationsTitle}
              </h3>
              <button onClick={onClose} className={`text-slate-400 hover:text-slate-600 ${lang === 'ar' ? 'order-1' : ''}`}><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {/* Name */}
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-2 uppercase tracking-wide">
                  {tm.nameLabel}
                </label>
                <input 
                  autoFocus required type="text" value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={type === 'category' ? (lang === 'ar' ? 'مثال: تشطيبات' : 'e.g. Finishing') : tm.locPlaceholder}
                  className={`w-full bg-slate-50 border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:border-accent rounded-sm ${lang === 'ar' ? 'text-right' : ''}`}
                />
              </div>

              {/* Parent Category Selector (category only) */}
              {type === 'category' && (
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-2 uppercase tracking-wide">
                    {lang === 'ar' ? 'التصنيف الأب' : 'Parent Category'}
                  </label>
                  <select
                    value={selectedParent || ''}
                    onChange={(e) => setSelectedParent(e.target.value || null)}
                    className={`w-full bg-slate-50 border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:border-accent rounded-sm ${lang === 'ar' ? 'text-right' : ''}`}
                  >
                    <option value="">{lang === 'ar' ? '— تصنيف رئيسي (بدون أب) —' : '— Root (No Parent) —'}</option>
                    {possibleParents.map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {'  '.repeat(cat.level || 0)}{cat.level > 0 ? '└ ' : ''}{cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Badge Selector (category only) */}
              {type === 'category' && (
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-2 uppercase tracking-wide">
                    {lang === 'ar' ? 'شارة' : 'Badge'}
                  </label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setBadge(null)}
                      className={`px-4 py-2 text-xs font-bold rounded-sm border transition-all ${!badge ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400'}`}
                    >
                      {lang === 'ar' ? 'بدون' : 'None'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setBadge('جديد')}
                      className={`px-4 py-2 text-xs font-bold rounded-sm border transition-all flex items-center gap-2 ${badge === 'جديد' ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white text-slate-500 border-slate-200 hover:border-emerald-400'}`}
                    >
                      <Sparkles size={12} /> {lang === 'ar' ? 'جديد' : 'NEW'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setBadge('قريباً')}
                      className={`px-4 py-2 text-xs font-bold rounded-sm border transition-all flex items-center gap-2 ${badge === 'قريباً' ? 'bg-amber-500 text-white border-amber-500' : 'bg-white text-slate-500 border-slate-200 hover:border-amber-400'}`}
                    >
                      <Clock size={12} /> {lang === 'ar' ? 'قريباً' : 'SOON'}
                    </button>
                  </div>
                </div>
              )}

              <button type="submit" disabled={isSaving || !name.trim()}
                className={`w-full bg-slate-800 text-white py-3.5 text-xs font-bold rounded-sm flex items-center justify-center gap-3 hover:bg-accent hover:text-primary transition-all disabled:opacity-50 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}
              >
                {isSaving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <CheckCircle2 size={16} />}
                <span>{isSaving ? tm.saving : tm.confirm}</span>
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
