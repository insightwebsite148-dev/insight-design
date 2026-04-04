'use client';

import { motion } from 'framer-motion';
import EditableWrapper from './EditableWrapper';
import { useSettings } from '@/context/SettingsContext';
import { toEmbedUrl } from '@/lib/mapUtils';

const defaultMapEmbedUrl = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14436.438287612665!2d55.26344933924376!3d25.2014498!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f43343a464551%3A0xd8aa39f2cc833fa7!2sBurj%20Khalifa!5e0!3m2!1sen!2sae!4v1710547600000!5m2!1sen!2sae';

export default function MapSection({ initialSettings }: { initialSettings?: any }) {
  const { settings: globalSettings } = useSettings();

  const rawUrl = globalSettings?.mapEmbedUrl || initialSettings?.mapEmbedUrl || '';
  
  // Try to convert the URL to an embed URL, or fall back to default
  const mapEmbedUrl = toEmbedUrl(rawUrl) || defaultMapEmbedUrl;

  return (
    <section className="w-full bg-slate-50 border-y border-border overflow-hidden">
      <EditableWrapper
        collection="settings"
        documentId="general"
        field="mapEmbedUrl"
        value={rawUrl || mapEmbedUrl}
        type="text"
      >
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="w-full h-[500px] grayscale-[0.3] hover:grayscale-0 transition-all duration-1000 group relative"
        >
          <iframe 
            src={mapEmbedUrl}
            className="w-full h-full border-0"
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          
          {/* Architectural Grid Overlay */}
          <div className="absolute inset-0 pointer-events-none border-[20px] border-background/20" />
          <div className="absolute top-0 left-0 w-full h-[1px] bg-primary/5 translate-y-1/4" />
          <div className="absolute top-0 left-0 w-full h-[1px] bg-primary/5 translate-y-2/4" />
          <div className="absolute top-0 left-0 w-full h-[1px] bg-primary/5 translate-y-3/4" />
        </motion.div>
      </EditableWrapper>
    </section>
  );
}
