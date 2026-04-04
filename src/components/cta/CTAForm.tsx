'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, MessageSquare, User, Briefcase } from 'lucide-react';

interface CTAFormProps {
  categories: any[];
  loadingCats: boolean;
  whatsappNumber: string;
  whatsappMessage: string;
}

export default function CTAForm({ categories, loadingCats, whatsappNumber, whatsappMessage }: CTAFormProps) {
  const [formData, setFormData] = useState({ name: '', projectType: '', message: '' });

  useEffect(() => {
    if (categories.length > 0 && !formData.projectType) {
      setFormData(prev => ({ ...prev, projectType: categories[0].name?.toUpperCase() || '' }));
    }
  }, [categories]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const phone = whatsappNumber.replace(/\+/g, '').replace(/\s/g, '');
    
    let text = whatsappMessage
      .replace(/{NAME}/g, formData.name)
      .replace(/{TYPE}/g, formData.projectType)
      .replace(/{MESSAGE}/g, formData.message);

    if (!whatsappMessage.includes('{')) {
      text = `${whatsappMessage}\n\n*Name:* ${formData.name}\n*Project Type:* ${formData.projectType}\n*Details:* ${formData.message}`;
    }

    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className="p-[1px] bg-gradient-to-br from-accent/20 to-transparent shadow-2xl rounded-sm overflow-hidden"
    >
      <form onSubmit={handleSubmit} className="bg-white p-8 md:p-14 space-y-8 relative z-10">
        <div className="text-center mb-10">
          <h3 className="text-2xl font-black uppercase tracking-widest mb-2">Start Your Project</h3>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-accent">Initiate a dialogue with our architects</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Name Field */}
          <div className="space-y-3 group">
            <label className="flex items-center gap-2 text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] text-accent transition-colors">
              <User size={15} className="stroke-[2.5px]" /> Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 w-1 bg-accent scale-y-0 group-focus-within:scale-y-100 transition-transform duration-300 origin-bottom rounded-l-md" />
              <input 
                required type="text" placeholder="E.G. ALEXANDER ROSE"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value.toUpperCase()})}
                className="w-full bg-slate-50/80 border border-slate-200 px-5 py-4 text-[12px] font-bold tracking-widest text-slate-800 focus:outline-none focus:border-accent focus:bg-white focus:ring-4 focus:ring-accent/10 transition-all placeholder:text-slate-400 rounded-md"
              />
            </div>
          </div>

          {/* Category Field */}
          <div className="space-y-3 group">
            <label className="flex items-center gap-2 text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] text-accent transition-colors">
              <Briefcase size={15} className="stroke-[2.5px]" /> Vision Category
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 w-1 bg-accent scale-y-0 group-focus-within:scale-y-100 transition-transform duration-300 origin-bottom rounded-l-md" />
              <select 
                value={formData.projectType}
                onChange={(e) => setFormData({...formData, projectType: e.target.value})}
                disabled={loadingCats}
                className="w-full bg-slate-50/80 border border-slate-200 px-5 py-4 text-[12px] font-bold tracking-widest text-slate-800 focus:outline-none focus:border-accent focus:bg-white focus:ring-4 focus:ring-accent/10 transition-all appearance-none cursor-pointer disabled:opacity-50 uppercase rounded-md"
              >
                {loadingCats ? (
                  <option>Retreiving Categories...</option>
                ) : (
                  categories.map((cat: any) => (
                    <option key={cat.id} className="text-slate-800 font-bold bg-white" value={cat.name.toUpperCase()}>
                      {cat.name.toUpperCase()}
                    </option>
                  ))
                )}
              </select>
              {/* Custom Dropdown Arrow */}
              <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </div>
            </div>
          </div>
        </div>

        {/* Message Field */}
        <div className="space-y-3 group">
          <label className="flex items-center gap-2 text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] text-accent transition-colors">
            <MessageSquare size={15} className="stroke-[2.5px]" /> Preliminary Details
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 w-1 bg-accent scale-y-0 group-focus-within:scale-y-100 transition-transform duration-300 origin-bottom rounded-l-md" />
            <textarea 
              required rows={4} placeholder="SHARE YOUR ARCHITECTURAL VISION..."
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value.toUpperCase()})}
              className="w-full bg-slate-50/80 border border-slate-200 px-5 py-4 text-[12px] font-bold tracking-widest leading-relaxed text-slate-800 focus:outline-none focus:border-accent focus:bg-white focus:ring-4 focus:ring-accent/10 transition-all resize-none placeholder:text-slate-400 rounded-md"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button type="submit"
          className="w-full mt-4 flex items-center justify-center gap-4 py-5 bg-black text-white rounded-md overflow-hidden group relative hover:shadow-[0_15px_30px_-5px_rgba(0,0,0,0.3)] transition-all duration-500"
        >
          <div className="absolute inset-0 bg-accent translate-y-[101%] group-hover:translate-y-0 transition-transform duration-500 ease-[0.16,1,0.3,1] rounded-md" />
          <span className="relative z-10 text-[11px] font-black uppercase tracking-[0.4em] transition-transform duration-500">Initialize Connection</span>
          <div className="relative z-10 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-accent transition-colors duration-500">
            <ArrowRight size={14} className="stroke-[3px]" />
          </div>
        </button>
      </form>
    </motion.div>
  );
}
