'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, Link as LinkIcon } from 'lucide-react';
import { handleClipboardPaste } from '@/lib/upload';
import { useAdminLanguage } from '@/context/AdminLanguageContext';

interface ClientModalProps {
  isOpen: boolean;
  editingClient: any;
  onClose: () => void;
  onSave: (formData: { name: string; logo: string }) => Promise<void>;
}

export default function ClientModal({ isOpen, editingClient, onClose, onSave }: ClientModalProps) {
  const { lang, t } = useAdminLanguage();
  const m = t.clients.modal;

  const [formData, setFormData] = useState({
    name: editingClient?.name || '',
    logo: editingClient?.logo || ''
  });
  const [isSaving, setIsSaving] = useState(false);

  // Sync form when editingClient changes
  useState(() => {
    setFormData({
      name: editingClient?.name || '',
      logo: editingClient?.logo || ''
    });
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.logo.trim()) {
      alert(m.requiredError);
      return;
    }
    setIsSaving(true);
    try {
      await onSave(formData);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-primary/20 backdrop-blur-xl p-6"
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
            className={`bg-white max-w-sm w-full shadow-edge border border-border rounded-sm overflow-hidden ${lang === 'ar' ? 'font-sans text-right' : ''}`}
          >
            <div className="px-10 py-8 border-b border-border flex justify-between items-center bg-slate-50/50">
              <div className={lang === 'ar' ? 'order-2' : ''}>
                <h3 className="text-sm font-black tracking-tighter uppercase">
                  {editingClient ? m.editPartner : m.newPartner}
                </h3>
                <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-accent">{m.identityVerify}</p>
              </div>
              <button onClick={onClose}
                className={`w-10 h-10 rounded-full hover:bg-white flex items-center justify-center text-muted transition-colors border border-transparent hover:border-border ${lang === 'ar' ? 'order-1' : ''}`}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-10 space-y-8">
              <div>
                <label className="text-[9px] font-black uppercase tracking-[0.4em] text-muted mb-3 block">{m.corpName}</label>
                <input required type="text" value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value.toUpperCase()})}
                  placeholder={m.placeholderName}
                  className={`w-full bg-slate-50 border border-border px-5 py-4 text-[10px] font-black focus:outline-none focus:border-accent transition-all uppercase tracking-widest ${lang === 'ar' ? 'text-right' : ''}`}
                />
              </div>
              <div>
                <label className="text-[9px] font-black uppercase tracking-[0.4em] text-muted mb-3 block">{m.identityMark}</label>
                <div className="relative group">
                  <input required type="text" value={formData.logo}
                    onChange={(e) => setFormData({...formData, logo: e.target.value})}
                    onPaste={(e) => handleClipboardPaste(e, (url) => setFormData({...formData, logo: url}), 'clients')}
                    placeholder={m.placeholderLogo}
                    className={`w-full bg-slate-50 border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:border-accent ${lang === 'ar' ? 'text-right pl-12' : 'pr-12'}`}
                  />
                  <LinkIcon size={14} className={`absolute ${lang === 'ar' ? 'left-5' : 'right-5'} top-1/2 -translate-y-1/2 text-muted group-hover:text-accent transition-colors`} />
                </div>
                <p className="text-[10px] text-slate-400 mt-2 italic text-center">{m.pasteTip}</p>
              </div>

              <div className="pt-4">
                <button type="submit" disabled={isSaving}
                  className={`w-full bg-primary text-background py-5 text-[10px] font-black uppercase tracking-[0.5em] hover:bg-accent transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-3 rounded-sm group ${lang === 'ar' ? 'flex-row-reverse' : ''}`}
                >
                  {isSaving ? <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" /> : <CheckCircle2 size={16} className="group-hover:rotate-12 transition-transform" />}
                  <span>{isSaving ? m.syncing : (editingClient ? m.finalize : m.addToRegistry)}</span>
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
