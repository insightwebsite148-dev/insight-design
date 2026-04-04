'use client';

import React, { useState, useRef } from 'react';
import { Upload, Link as LinkIcon, Clipboard, X, RefreshCcw, Image as ImageIcon } from 'lucide-react';
import { uploadImage, handleClipboardPaste } from '@/lib/upload';
import { useAdminLanguage } from '@/context/AdminLanguageContext';

interface AdminImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  folder?: string;
}

export default function AdminImageUploader({ value, onChange, label, folder = 'uploads' }: AdminImageUploaderProps) {
  const { lang, t } = useAdminLanguage();
  const cT = t.common;
  const [loading, setLoading] = useState(false);
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
      // Image was handled by the utility
    }
  };

  const handleUrlSubmit = () => {
    if (tempUrl.trim() !== value) {
      onChange(tempUrl);
    }
  };

  const clear = () => {
    onChange('');
    setTempUrl('');
  };

  return (
    <div className={`space-y-4 font-bold ${lang === 'ar' ? 'font-sans' : ''}`} onPaste={handlePaste}>
      {label && (
        <label className="text-[12px] font-black uppercase tracking-normal text-black flex items-center gap-2">
           <ImageIcon size={14} /> {label}
        </label>
      )}

      {/* Main Container */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 items-start">
        
        {/* Preview & Action Zone */}
        <div className="md:col-span-1">
          <div className="relative aspect-square bg-white border-2 border-black flex items-center justify-center overflow-hidden group">
            {value ? (
              <>
                <img src={value} alt="Preview" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                   <button type="button" onClick={clear} className="p-3 bg-white text-black hover:bg-black hover:text-white transition-all">
                      <X size={16} />
                   </button>
                   <button type="button" onClick={() => fileInputRef.current?.click()} className="p-3 bg-accent text-white hover:bg-black transition-all">
                      <RefreshCcw size={16} />
                   </button>
                </div>
              </>
            ) : (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center gap-4 cursor-pointer hover:bg-black/5 w-full h-full justify-center transition-colors"
              >
                <div className="w-10 h-10 border-2 border-black border-dashed flex items-center justify-center text-black/20 group-hover:text-black group-hover:border-solid transition-all">
                   {loading ? <div className="w-5 h-5 border-2 border-black border-t-transparent animate-spin" /> : <Upload size={20} />}
                </div>
                <span className="text-[10px] font-black uppercase text-black/30 group-hover:text-black">{cT.dropOrClick}</span>
              </div>
            )}
          </div>
        </div>

        {/* Inputs Zone */}
        <div className="md:col-span-3 space-y-4">
           {/* Direct Link Input */}
           <div className="relative group">
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={`absolute ${lang === 'ar' ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-black/20 hover:text-accent transition-colors z-10`}
                title={cT.browseDevice}
              >
                 <Upload size={14} />
              </button>
              <input 
                type="text"
                placeholder={cT.pastedUrlPlaceholder}
                className={`w-full ${lang === 'ar' ? 'pr-12 pl-24' : 'pl-12 pr-24'} border-2 border-black h-12 text-[13px] font-black uppercase tracking-normal focus:border-accent`}
                value={tempUrl}
                onChange={(e) => setTempUrl(e.target.value)}
                onBlur={handleUrlSubmit}
              />
              <div className={`absolute ${lang === 'ar' ? 'left-2 border-r pr-3' : 'right-2 border-l pl-3'} top-2 bottom-2 bg-black/[0.03] flex items-center text-[10px] font-black text-black/20 uppercase border-black/5 italic`}>
                 {cT.liveLink}
              </div>
           </div>

           {/* Paste Info & Paste Zone Helper */}
           <div 
             className="border-2 border-black border-dashed p-6 flex items-center justify-between group hover:border-solid transition-all bg-white/50 cursor-default"
             title={lang === 'ar' ? 'انقر هنا واضغط Ctrl+V' : 'Click here and press Ctrl+V'}
           >
              <div className="flex items-center gap-5">
                 <div className="w-12 h-12 bg-black text-white flex items-center justify-center shrink-0">
                    <Clipboard size={18} />
                 </div>
                 <div>
                    <p className="text-[12px] font-black uppercase text-black leading-none mb-1.5">{cT.masterPasteLayer}</p>
                    <p className="text-[10px] font-bold text-black/40 uppercase leading-tight">
                      {cT.copyPasteInstruction.replace('{key}', 'CTRL+V')}
                    </p>
                 </div>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                 <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-6 py-3 bg-black text-white text-[10px] font-black uppercase hover:bg-accent transition-all whitespace-nowrap"
                 >
                    {cT.browseDevice}
                 </button>
              </div>
           </div>
        </div>
      </div>
      
      {/* Hidden File Input */}
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
