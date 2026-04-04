'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { getOptimizedUrl } from '@/lib/cloudinary';

interface ClientCardProps {
  client: { id?: string; name: string; logo: string };
  index: number;
  logoSize: string;
}

export default function ClientCard({ client, index, logoSize }: ClientCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="group bg-white p-12 flex flex-col items-center justify-center text-center transition-all duration-700 hover:bg-slate-50 relative aspect-square lg:aspect-auto lg:h-[280px]"
    >
      {/* Hover Glow */}
      <div className="absolute inset-0 bg-gradient-to-t from-accent/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      
      <div 
        className="relative transition-all duration-700 group-hover:scale-110 mb-8"
        style={{ width: logoSize, height: logoSize, filter: 'grayscale(100%) opacity(0.4)' }}
      >
        <div className="absolute inset-0 group-hover:opacity-0 transition-opacity duration-700">
          <Image src={getOptimizedUrl(client.logo, 200)} alt={client.name} fill sizes={logoSize} className="object-contain" />
        </div>
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" style={{ filter: 'grayscale(0%) opacity(1)' }}>
          <Image src={getOptimizedUrl(client.logo, 200)} alt={client.name} fill sizes={logoSize} className="object-contain" />
        </div>
      </div>
      
      <div className="space-y-2 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
        <div className="h-px w-8 bg-accent mx-auto mb-4" />
        <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-primary">
          {client.name}
        </h4>
      </div>

      {/* Corner Decoration */}
      <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-transparent group-hover:border-accent/20 transition-all duration-700" />
    </motion.div>
  );
}
