'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import ClientCard from './clients/ClientCard';
import EditableWrapper from './EditableWrapper';
import { useSettings } from '@/context/SettingsContext';

interface OurClientsProps {
  initialClients?: any[];
  initialSettings?: any;
}

export default function OurClients({ initialClients = [], initialSettings }: OurClientsProps) {
  const { settings: globalSettings } = useSettings();
  const [logoSize, setLogoSize] = useState(initialSettings?.clientLogoSize || '80px');
  const [sectionHeadline, setSectionHeadline] = useState(initialSettings?.clientsHeadline || 'Trusted Partners');
  const [sectionSubheadline, setSectionSubheadline] = useState(initialSettings?.clientsSubheadline || 'Our Clients');
  const [sectionDescription, setSectionDescription] = useState(initialSettings?.clientsDescription || 'We work with the best companies to provide high-quality finishing and design services.');

  useEffect(() => {
    if (globalSettings) {
      setLogoSize(globalSettings.clientLogoSize || '80px');
      setSectionHeadline(globalSettings.clientsHeadline || 'Trusted Partners');
      setSectionSubheadline(globalSettings.clientsSubheadline || 'Our Clients');
      setSectionDescription(globalSettings.clientsDescription || 'We work with the best companies to provide high-quality finishing and design services.');
    }
  }, [globalSettings]);

  const clients = initialClients;

  if (!clients || clients.length === 0) return null;

  return (
    <section className="section-padding bg-background relative overflow-hidden border-t border-accent/10">
      <div className="max-w-[1400px] mx-auto relative z-10">
        <div className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-16">
          <div className="max-w-3xl space-y-6">
            <div className="flex items-center gap-3">
              <span className="h-[1px] w-8 bg-accent/30"></span>
              <EditableWrapper
                collection="settings"
                documentId="general"
                field="clientsSubheadline"
                value={sectionSubheadline}
                type="text"
              >
                <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-accent">
                  {sectionSubheadline}
                </span>
              </EditableWrapper>
            </div>
            <EditableWrapper
              collection="settings"
              documentId="general"
              field="clientsHeadline"
              value={sectionHeadline}
              type="text"
              styleField="clientsHeadline"
            >
              <h2 className="text-5xl md:text-6xl font-bold tracking-tight leading-none text-primary uppercase">
                {sectionHeadline}
              </h2>
            </EditableWrapper>
          </div>
          <div className="max-w-md">
            <EditableWrapper
              collection="settings"
              documentId="general"
              field="clientsDescription"
              value={sectionDescription}
              type="text"
            >
              <p className="text-lg font-light text-muted leading-relaxed border-l border-accent/20 pl-8 hidden md:block">
                {sectionDescription}
              </p>
            </EditableWrapper>
          </div>
        </div>

        {/* Clients Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-8 md:gap-12">
          {clients.map((client, index) => (
            <motion.div
              key={client.id || index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -5, transition: { duration: 0.3 } }}
              className="flex items-center justify-center p-8 bg-white grayscale hover:grayscale-0 transition-all duration-700 border border-black/5 hover:border-accent hover:shadow-2xl rounded-none"
            >
              <ClientCard client={client} index={index} logoSize={logoSize} />
            </motion.div>
          ))}
        </div>

        {/* Footer Text */}
        <div className="mt-32 pt-16 border-t border-accent/10 flex flex-col md:flex-row justify-between items-center gap-12">
          <span className="text-[12px] font-bold uppercase tracking-[0.3em] text-muted">A Legacy of Excellence</span>
          <div className="flex gap-12">
            {['Vision', 'Precision', 'Heritage'].map((val) => (
              <span key={val} className="text-[12px] font-bold uppercase tracking-[0.2em] text-accent/60 hover:text-accent transition-colors duration-500 cursor-default">{val}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
