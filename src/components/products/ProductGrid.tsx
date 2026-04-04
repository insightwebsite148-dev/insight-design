'use client';

import { motion } from 'framer-motion';
import ProductCard from './ProductCard';
import EditableWrapper from '../EditableWrapper';
import { useSettings } from '@/context/SettingsContext';

export default function ProductGrid({ initialProjects }: { initialProjects?: any[] }) {
  const { settings: globalSettings, projects: globalProjects } = useSettings();

  // Use global projects (real-time), fallback to SSR initial
  const products = globalProjects.length > 0 
    ? globalProjects.slice(0, 8) 
    : (initialProjects || []).slice(0, 8);

  const s = globalSettings || {};
  const settings = {
    headline: s.collectionsHeadline || 'Our New Collections',
    subheadline: s.collectionsSubheadline || 'Curated Excellence',
    description: s.collectionsDescription || 'Explore our latest architectural masterpieces and interior designs, crafted with precision and passion.',
    whatsappNumber: s.whatsappNumber || ''
  };

  return (
    <section className="bg-background py-16 px-6 max-w-[1800px] mx-auto w-full">
      <div className="flex flex-col items-center justify-center text-center mb-24 space-y-6">
        <div className="flex items-center gap-4">
          <span className="h-[1px] w-12 bg-accent/30"></span>
          <EditableWrapper
            collection="settings"
            documentId="general"
            field="collectionsSubheadline"
            value={settings.subheadline}
            type="text"
          >
            <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-accent">
              {settings.subheadline}
            </span>
          </EditableWrapper>
          <span className="h-[1px] w-12 bg-accent/30"></span>
        </div>
        <EditableWrapper
          collection="settings"
          documentId="general"
          field="collectionsHeadline"
          value={settings.headline}
          type="text"
          styleField="collectionsHeadline"
        >
          <h2 className="text-5xl md:text-6xl font-black tracking-tight text-primary uppercase">
            {settings.headline}
          </h2>
        </EditableWrapper>
        <EditableWrapper
          collection="settings"
          documentId="general"
          field="collectionsDescription"
          value={settings.description}
          type="text"
        >
          <p className="text-muted max-w-xl mx-auto font-light text-lg">
            {settings.description}
          </p>
        </EditableWrapper>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8 lg:gap-12 w-full">
        {products.map((product: any, index: number) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <ProductCard product={product} index={index} whatsappNumber={settings.whatsappNumber} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
