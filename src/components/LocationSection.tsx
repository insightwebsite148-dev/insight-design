'use client';

import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, ExternalLink } from 'lucide-react';
import EditableWrapper from './EditableWrapper';
import { useSettings } from '@/context/SettingsContext';
import { DEFAULT_SETTINGS } from '@/lib/constants';

const defaultWorkingHours = 'Mon - Sat: 09:00 AM - 06:00 PM';

export default function LocationSection({ initialSettings }: { initialSettings?: any }) {
  const { settings: globalSettings } = useSettings();

  const s = globalSettings || initialSettings || {};
  const settings = {
    address: s.address || DEFAULT_SETTINGS.address,
    phone: s.phone || DEFAULT_SETTINGS.phone,
    email: s.email || DEFAULT_SETTINGS.email,
    workingHours: s.workingHours || defaultWorkingHours,
    mapLink: s.mapLink || '#',
  };

  return (
    <section className="bg-background py-24 px-6 border-t border-border">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start gap-16">
          <div className="max-w-xl">
            <span className="text-[12px] font-bold uppercase tracking-[0.5em] text-accent mb-4 block">
              Connect With Us
            </span>
            <h2 className="font-bold tracking-tighter uppercase mb-8 leading-none" style={{ fontSize: 'var(--section-font-size, 3.5rem)' }}>
              VISIT OUR <br /> STUDIO
            </h2>
            <p className="text-muted text-sm md:text-base leading-relaxed mb-10 opacity-80">
              Experience our architectural language in person. Our studio is a space of innovation and discovery, where visions take shape.
            </p>
            
            <a 
              href={settings.mapLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-4 bg-primary text-background px-10 py-5 text-[12px] font-black uppercase tracking-[0.4em] hover:bg-accent transition-all shadow-xl"
            >
              <span>Get Directions</span>
              <ExternalLink size={14} />
            </a>
          </div>

          <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-10 border-l border-border/30 pl-0 md:pl-16">
            <div className="space-y-2">
              <div className="flex items-center gap-3 text-accent mb-3">
                <MapPin size={16} />
                <h4 className="font-black text-[11px] uppercase tracking-normal">Headquarters</h4>
              </div>
              <EditableWrapper collection="settings" documentId="general" field="address" value={settings.address} type="text">
                <p className="text-xs font-bold uppercase tracking-tight leading-loose text-primary/80">
                  {settings.address}
                </p>
              </EditableWrapper>
            </div>

            <div className="space-y-4 pt-4 border-t border-black/5">
              <div className="flex items-center gap-3">
                <div className="w-4 h-px bg-accent" />
                <h4 className="font-black text-[11px] uppercase tracking-normal">Inquiries</h4>
              </div>
              <EditableWrapper collection="settings" documentId="general" field="phone" value={settings.phone} type="text">
                <p className="text-xs font-bold uppercase tracking-tight text-primary/80">{settings.phone}</p>
              </EditableWrapper>
            </div>

            <div className="space-y-4 pt-4 border-t border-black/5">
              <div className="flex items-center gap-3">
                <div className="w-4 h-px bg-accent" />
                <h4 className="font-black text-[11px] uppercase tracking-normal">Architecture</h4>
              </div>
              <EditableWrapper collection="settings" documentId="general" field="email" value={settings.email} type="text">
                <p className="text-xs font-bold uppercase tracking-tight text-primary/80">{settings.email}</p>
              </EditableWrapper>
            </div>

            <div className="space-y-4 pt-4 border-t border-black/5">
              <div className="flex items-center gap-3">
                <div className="w-4 h-px bg-accent" />
                <h4 className="font-black text-[11px] uppercase tracking-normal">Studio Hours</h4>
              </div>
              <EditableWrapper collection="settings" documentId="general" field="workingHours" value={settings.workingHours} type="text">
                <p className="text-xs font-bold uppercase tracking-tight text-primary/80">{settings.workingHours}</p>
              </EditableWrapper>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
