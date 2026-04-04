'use client';

import React, { useState, useRef } from 'react';
import { Upload, Link as LinkIcon, Clipboard, X, RefreshCcw, Image as ImageIcon, Check } from 'lucide-react';
import { uploadImage, handleClipboardPaste } from '@/lib/upload';
import { useAdminLanguage } from '@/context/AdminLanguageContext';
import { motion, AnimatePresence } from 'framer-motion';

interface SimpleImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  folder?: string;
}

export default function SimpleImageUploader({ value, onChange, label, folder = 'uploads' }: SimpleImageUploaderProps) {
  const { lang, t } = useAdminLanguage();
  const cT = t.common;
  const [loading, setLoading] = useState(false);
  const [isPasting, setIsPasting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [tempUrl, setTempUrl] = useState(value);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setLoading(true);
    try {
      const url = await uploadImage(file, `${folder}/${file.name}`);
      onChange(url);
      setTempUrl(url);
    } catch (err) {
      console.error(err);
      alert(cT.failed);
    } finally {
      setLoading(false);
    }
  };

  const handlePaste = async (e: React.ClipboardEvent) => {
    const handled = await handleClipboardPaste(e, (url) => {
      onChange(url);
      setTempUrl(url);
    }, folder, setLoading);
    
    if (handled) {
      setIsPasting(true);
      setTimeout(() => setIsPasting(false), 2000);
    }
  };

  const handleUrlSubmit = () => {
    if (tempUrl.trim() !== value) {
      onChange(tempUrl);
    }
  };

  return (
    <div 
      className={`group relative bg-black/[0.02] border border-black/5 p-4 transition-all hover:border-black/10 ${lang === 'ar' ? 'font-sans' : ''}`}
      onPaste={handlePaste}
    >
      <div className="flex flex-col md:flex-row gap-6 items-center">
        {/* Compact Preview */}
        <div className="relative w-24 h-24 bg-white border border-black/10 shrink-0 overflow-hidden group/preview">
          {value ? (
            <>
              <img src={value} alt="Preview" className="w-full h-full object-cover" />
              <button 
                type="button" 
                onClick={() => onChange('')}
                className="absolute top-1 right-1 p-1 bg-black text-white opacity-0 group-hover/preview:opacity-100 transition-opacity"
              >
                <X size={10} />
              </button>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-black/10">
              <ImageIcon size={24} />
            </div>
          )}
          {loading && (
            <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
              <RefreshCcw size={16} className="animate-spin text-accent" />
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex-1 w-full space-y-3">
          <div className="flex items-center justify-between gap-4">
             <label className="text-[10px] font-black uppercase text-black/40 tracking-widest">{label}</label>
             <AnimatePresence>
               {isPasting && (
                 <motion.span 
                   initial={{ opacity: 0, x: 5 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                   className="text-[9px] font-black text-green-600 uppercase flex items-center gap-1"
                 >
                   <Check size={10} /> {lang === 'ar' ? 'تم اللصق' : 'Pasted'}
                 </motion.span>
               )}
             </AnimatePresence>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            {/* Unified Input/Action Bar */}
            <div className="relative flex-1">
              <input 
                type="text"
                placeholder={lang === 'ar' ? 'رابط الصورة...' : 'Image URL...'}
                value={tempUrl}
                onChange={(e) => setTempUrl(e.target.value)}
                onBlur={handleUrlSubmit}
                className="w-full h-10 bg-white border border-black/10 px-4 pr-20 text-[11px] font-bold outline-none focus:border-accent transition-all"
              />
              <div className="absolute right-1 top-1 bottom-1 flex gap-1">
                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="h-full px-3 bg-black text-white text-[9px] font-black uppercase hover:bg-accent transition-all"
                >
                  {cT.browseDevice}
                </button>
              </div>
            </div>

            {/* Hidden/Fast Paste Zone Area - Now integrated as a hint */}
            <div className="hidden lg:flex items-center gap-2 px-3 border border-dashed border-black/10 text-[9px] font-black text-black/20 uppercase whitespace-nowrap bg-white/50">
               <Clipboard size={10} />
               <span>{lang === 'ar' ? 'الصق هنا (Ctrl+V)' : 'Paste here (Ctrl+V)'}</span>
            </div>
          </div>
        </div>
      </div>

      <input 
        type="file" 
        className="hidden" 
        ref={fileInputRef} 
        accept="image/*"
        onChange={handleFileChange}
      />
    </div>
  );
}
