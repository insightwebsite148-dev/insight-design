'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Edit3, Trash2, Image as ImageIcon } from 'lucide-react';

interface ClientCardAdminProps {
  client: any;
  index: number;
  onEdit: (client: any) => void;
  onDelete: (id: string, name: string) => void;
}

import { useAdminLanguage } from '@/context/AdminLanguageContext';

export default function ClientCardAdmin({ client, index, onEdit, onDelete }: ClientCardAdminProps) {
  const { lang, t } = useAdminLanguage();

  return (
    <motion.div 
      key={client.id} 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.05 }}
      className={`bg-white p-10 border border-border group relative shadow-sm hover:shadow-edge transition-all duration-500 rounded-sm ${lang === 'ar' ? 'font-sans text-right' : ''}`}
    >
      <div className={`absolute top-4 ${lang === 'ar' ? 'left-4' : 'right-4'} flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
        <button 
          onClick={() => onEdit(client)}
          className="p-2 bg-white border border-border text-primary hover:text-accent hover:border-accent transition-all rounded-sm"
        >
          <Edit3 size={14} />
        </button>
        <button 
          onClick={() => onDelete(client.id, client.name)}
          className="p-2 bg-white border border-border text-primary hover:text-red-500 hover:border-red-500 transition-all rounded-sm"
        >
          <Trash2 size={14} />
        </button>
      </div>

      <div className="w-full aspect-square relative mb-8 flex items-center justify-center p-6 bg-slate-50/50 rounded-sm border border-slate-100/50 group-hover:border-accent/10 transition-colors">
        {client.logo ? (
          <Image 
            src={client.logo} alt={client.name} fill 
            sizes="(max-width: 768px) 150px, 150px"
            className="object-contain p-4 group-hover:scale-110 transition-transform duration-700" 
          />
        ) : (
          <ImageIcon size={32} className="text-muted/20" />
        )}
      </div>
      
      <div className="text-center">
        <p className="text-[8px] font-black tracking-[0.4em] text-accent uppercase mb-2">{t.clients.corporateIdentity}</p>
        <h4 className="font-black tracking-[0.1em] text-xs uppercase text-primary group-hover:text-accent transition-colors">
          {client.name}
        </h4>
      </div>
    </motion.div>
  );
}
