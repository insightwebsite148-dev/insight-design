'use client';

import { motion } from 'framer-motion';
import { Package, Truck, RefreshCw } from 'lucide-react';
import EditableWrapper from './EditableWrapper';
import { useSettings } from '@/context/SettingsContext';

export default function FeaturesSection() {
  const { settings: globalSettings } = useSettings();
  const s = globalSettings || {};

  const features = [
    { id: 1, title: s.feature1Title || 'Made Your Order', description: s.feature1Desc || 'Bespoke customization to fit your sophisticated lifestyle perfectly.', icon: Package, titleField: 'feature1Title', descField: 'feature1Desc' },
    { id: 2, title: s.feature2Title || 'Free Delivery', description: s.feature2Desc || 'Complimentary white-glove delivery on all premium orders.', icon: Truck, titleField: 'feature2Title', descField: 'feature2Desc' },
    { id: 3, title: s.feature3Title || 'Free Exchange', description: s.feature3Desc || 'Hassle-free returns and exchanges within 30 days.', icon: RefreshCw, titleField: 'feature3Title', descField: 'feature3Desc' },
  ];

  return (
    <section className="bg-background py-24 px-6">
      <div className="max-w-[1400px] mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="flex flex-col items-center text-center p-12 rounded-3xl bg-secondary/30 transition-shadow duration-300 hover:shadow-xl hover:bg-white"
            >
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center text-accent mb-8">
                <feature.icon size={28} strokeWidth={1.5} />
              </div>
              <EditableWrapper
                collection="settings"
                documentId="general"
                field={feature.titleField}
                value={feature.title}
                type="text"
                styleField={`feature${index + 1}Title`}
              >
                <h3 className="text-xl font-bold tracking-tight text-primary mb-4">
                  {feature.title}
                </h3>
              </EditableWrapper>
              <EditableWrapper
                collection="settings"
                documentId="general"
                field={feature.descField}
                value={feature.description}
                type="text"
                styleField={`feature${index + 1}Desc`}
              >
                <p className="text-[15px] leading-relaxed text-muted px-4">
                  {feature.description}
                </p>
              </EditableWrapper>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
