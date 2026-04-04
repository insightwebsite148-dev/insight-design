'use client';

import React, { useState, useRef } from 'react';
import { Upload, Link as LinkIcon, Clipboard, X, RefreshCcw, Image as ImageIcon, Check, Plus, Trash2, GripVertical } from 'lucide-react';
import { uploadImage, handleClipboardPaste } from '@/lib/upload';
import { useAdminLanguage } from '@/context/AdminLanguageContext';
import { motion, AnimatePresence } from 'framer-motion';

interface MultiImageUploaderProps {
  value: string[];
  onChange: (urls: string[]) => void;
  label?: string;
  folder?: string;
}

export default function MultiImageUploader({ value = [], onChange, label, folder = 'projects' }: MultiImageUploaderProps) {
  const { lang, t } = useAdminLanguage();
  const cT = t.common;
  const [loading, setLoading] = useState(false);
  const [isPasting, setIsPasting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [urlInput, setUrlInput] = useState('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    
    setLoading(true);
    try {
      const uploadPromises = files.map(file => uploadImage(file, `${folder}/${Date.now()}-${file.name}`));
      const newUrls = await Promise.all(uploadPromises);
      onChange([...value, ...newUrls]);
    } catch (err) {
      console.error(err);
      alert(cT.failed || 'Upload failed');
    } finally {
      setLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handlePaste = async (e: React.ClipboardEvent) => {
    // Check if clipboard has multiple items (modern browsers support this)
    const items = Array.from(e.clipboardData.items);
    const files = items.filter(item => item.type.indexOf('image') !== -1).map(item => item.getAsFile());
    
    if (files.length > 0) {
      setLoading(true);
      try {
        const uploadPromises = files.filter((f): f is File => f !== null).map(file => 
          uploadImage(file, `${folder}/pasted-${Date.now()}-${file.name || 'image'}.png`)
        );
        const newUrls = await Promise.all(uploadPromises);
        onChange([...value, ...newUrls]);
        setIsPasting(true);
        setTimeout(() => setIsPasting(false), 2000);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleAddUrl = () => {
    if (urlInput.trim()) {
      onChange([...value, urlInput.trim()]);
      setUrlInput('');
    }
  };

  const removeImage = (index: number) => {
    const newList = [...value];
    newList.splice(index, 1);
    onChange(newList);
  };

  return (
    <div 
      className={`space-y-6 bg-black/[0.01] border border-black/[0.03] p-8 ${lang === 'ar' ? 'font-sans text-right' : ''}`}
      onPaste={handlePaste}
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-black/[0.03] pb-6">
        <div>
          <label className="text-[11px] font-black uppercase text-black/60 tracking-widest block mb-1">{label || 'Project Gallery'}</label>
          <p className="text-[10px] font-bold text-black/20 uppercase">{lang === 'ar' ? 'يمكنك رفع عدة صور أو لصقها من الحافظة' : 'Upload multiple images or paste from clipboard'}</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-3 px-6 py-3 bg-black text-white text-[10px] font-black uppercase hover:bg-accent transition-all shadow-xl active:scale-95"
          >
            <Upload size={14} />
            <span>{lang === 'ar' ? 'رفع صور' : 'Upload Photos'}</span>
          </button>
          
          <AnimatePresence>
             {isPasting && (
               <motion.span 
                 initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                 className="px-3 py-1 bg-green-500 text-white text-[9px] font-black uppercase rounded-full"
               >
                 {lang === 'ar' ? 'تم اللصق' : 'Pasted'}
               </motion.span>
             )}
          </AnimatePresence>
        </div>
      </div>

      {/* URL Input Area */}
      <div className="flex gap-2">
        <input 
          type="text"
          placeholder={lang === 'ar' ? 'أضف صورة برابط مباشر...' : 'Add image via direct URL...'}
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddUrl())}
          className="flex-1 h-12 bg-white border border-black/5 px-6 text-[12px] font-bold outline-none focus:border-accent transition-all"
        />
        <button 
          type="button" 
          onClick={handleAddUrl}
          className="px-6 h-12 bg-slate-100 text-black text-[12px] font-black uppercase hover:bg-slate-200 transition-all"
        >
          {lang === 'ar' ? 'إضافة' : 'Add'}
        </button>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 min-h-[140px] p-6 bg-white border border-black/[0.02] shadow-inner relative">
        <AnimatePresence mode="popLayout">
          {value.length === 0 ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center opacity-10">
               <ImageIcon size={48} className="mb-2" />
               <p className="text-[10px] font-black uppercase tracking-[0.2em]">{lang === 'ar' ? 'لا توجد صور حالياً' : 'No images currently'}</p>
            </div>
          ) : (
            value.map((url, index) => (
              <motion.div 
                key={url + index}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="group relative aspect-square bg-slate-100 border border-black/[0.05] overflow-hidden"
              >
                <img src={url} alt={`Gallery ${index}`} className="w-full h-full object-cover" />
                
                {/* Overlay Controls */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                   <button 
                    type="button"
                    onClick={() => removeImage(index)}
                    className="p-2 bg-red-500 text-white rounded-full hover:scale-110 transition-transform"
                    title={lang === 'ar' ? 'حذف' : 'Remove'}
                   >
                     <Trash2 size={14} />
                   </button>
                   {index === 0 && (
                     <div className="absolute top-2 left-2 bg-accent text-white text-[8px] font-black uppercase px-2 py-0.5 pointer-events-none">
                        Main
                     </div>
                   )}
                </div>
                
                {/* Index Badge */}
                <div className="absolute bottom-2 right-2 bg-black/40 backdrop-blur-md text-white text-[8px] font-black w-5 h-5 flex items-center justify-center">
                  {index + 1}
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
        
        {loading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-20">
             <div className="flex flex-col items-center gap-3">
                <RefreshCcw size={24} className="animate-spin text-accent" />
                <span className="text-[10px] font-black uppercase tracking-widest text-black/40">{lang === 'ar' ? 'جاري الرفع...' : 'Uploading...'}</span>
             </div>
          </div>
        )}
      </div>

      <input 
        type="file" 
        multiple
        className="hidden" 
        ref={fileInputRef} 
        accept="image/*"
        onChange={handleFileChange}
      />
      
      <p className="text-[9px] font-bold text-black/30 uppercase italic">
        {lang === 'ar' ? '* الصورة الأولى ستُستخدم كصورة أساسية للمشروع.' : '* The first image will be used as the primary project image.'}
      </p>
    </div>
  );
}
