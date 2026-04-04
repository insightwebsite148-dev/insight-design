'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Mail, Phone, MapPin, Instagram, Facebook, Send } from 'lucide-react';
import PageHero from '@/components/PageHero';
import EditableWrapper from '@/components/EditableWrapper';
import { useSettings } from '@/context/SettingsContext';
import { toEmbedUrl } from '@/lib/mapUtils';

const TikTokIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.75a8.18 8.18 0 004.76 1.52V6.84a4.84 4.84 0 01-1-.15z"/>
  </svg>
);

const defaultContact = {
  heroHeadline: 'GET IN TOUCH',
  heroSubheadline: "Have a project in mind? Let's discuss how we can bring your vision to life.",
  heroImage: ''
};

const defaultSettingsValues = {
  address: 'Luxury Tower, Downtown Dubai',
  phone: '+971 4 000 0000',
  email: 'info@insightdesign.com',
  mapEmbedUrl: ''
};

export default function ContactPageClient({ initialData, initialSettings }: { initialData?: any; initialSettings?: any }) {
  const { settings: globalSettings } = useSettings();
  
  const d = initialData || {};
  const data = {
    heroHeadline: d.heroHeadline || defaultContact.heroHeadline,
    heroSubheadline: d.heroSubheadline || defaultContact.heroSubheadline,
    heroImage: d.heroImage || defaultContact.heroImage
  };

  const s = globalSettings || initialSettings || {};
  const rawMapUrl = s.mapEmbedUrl || defaultSettingsValues.mapEmbedUrl;
  const settings = {
    address: s.address || defaultSettingsValues.address,
    phone: s.phone || defaultSettingsValues.phone,
    email: s.email || defaultSettingsValues.email,
    mapEmbedUrl: toEmbedUrl(rawMapUrl) || '',
    schema: s.schema || {}
  };

  const [formState, setFormState] = useState({ name: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fireConversionEvents = () => {
    // Meta (Facebook) Pixel — Lead event
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'Lead', {
        content_name: 'Contact Form',
        content_category: 'Lead Generation'
      });
    }

    // Google Analytics 4 — generate_lead event
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'generate_lead', {
        event_category: 'Contact',
        event_label: 'Contact Form Submission'
      });
    }

    // Google Ads — conversion event (reads from global settings injected via layout)
    if (typeof window !== 'undefined' && (window as any).gtag && (window as any).__GADS_CONVERSION_ID) {
      const convId = (window as any).__GADS_CONVERSION_ID;
      const convLabel = (window as any).__GADS_CONVERSION_LABEL;
      if (convId && convLabel) {
        (window as any).gtag('event', 'conversion', {
          send_to: `${convId}/${convLabel}`
        });
      }
    }

    // TikTok Pixel — SubmitForm event
    if (typeof window !== 'undefined' && (window as any).ttq) {
      (window as any).ttq.track('SubmitForm', {
        content_name: 'Contact Form'
      });
    }

    // Snapchat Pixel — SIGN_UP event (used for lead gen)
    if (typeof window !== 'undefined' && (window as any).snaptr) {
      (window as any).snaptr('track', 'SIGN_UP');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Fire conversion events on all platforms
    fireConversionEvents();

    const phoneNumber = settings.phone.replace(/[^\d+]/g, '');
    const message = `Hello, I would like to inquire about a project.\n\n*Full Name:* ${formState.name}\n*Message:* ${formState.message}`;
    
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');
    
    setTimeout(() => {
      setIsSubmitting(false);
      setFormState({ name: '', message: '' });
    }, 1000);
  };

  return (
    <div className="flex flex-col bg-surface min-h-screen">
      {/* Hero Header */}
      <PageHero 
        title={data.heroHeadline} 
        subtitle={data.heroSubheadline} 
        image={data.heroImage} 
        height="50vh"
        editCollection="pages"
        editDocumentId="contact"
        imageField="heroImage"
      /> 

      {/* Main Content */}
      <section className="py-24 px-6 bg-white/50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20">
          
          {/* Contact Info */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-12"
          >
            <div>
              <h2 className="text-3xl font-bold tracking-tighter uppercase mb-2 text-primary">OFFICE DETAILS</h2>
              <div className="h-1 w-20 bg-accent" />
            </div>

            <div className="space-y-8">
              <div className="flex items-start space-x-6 group">
                <div className="w-12 h-12 bg-white border border-border flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all duration-500">
                  <MapPin size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted mb-1">Our Location</p>
                  <EditableWrapper
                    collection="settings"
                    documentId="general"
                    field="address"
                    value={settings.address}
                    type="text"
                  >
                    <p className="text-sm font-bold uppercase tracking-tight text-primary transition-colors group-hover:text-accent">{settings.address}</p>
                  </EditableWrapper>
                </div>
              </div>

              <div className="flex items-start space-x-6 group">
                <div className="w-12 h-12 bg-white border border-border flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all duration-500">
                  <Phone size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted mb-1">Call Us</p>
                  <EditableWrapper
                    collection="settings"
                    documentId="general"
                    field="phone"
                    value={settings.phone}
                    type="text"
                  >
                    <p className="text-sm font-bold uppercase tracking-tight text-primary transition-colors group-hover:text-accent">{settings.phone}</p>
                  </EditableWrapper>
                </div>
              </div>

              <div className="flex items-start space-x-6 group">
                <div className="w-12 h-12 bg-white border border-border flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all duration-500">
                  <Mail size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted mb-1">Email Us</p>
                  <EditableWrapper
                    collection="settings"
                    documentId="general"
                    field="email"
                    value={settings.email}
                    type="text"
                  >
                    <p className="text-sm font-bold uppercase tracking-tight text-primary transition-colors group-hover:text-accent">{settings.email}</p>
                  </EditableWrapper>
                </div>
              </div>
            </div>

            {settings.mapEmbedUrl && (
              <div className="pt-10">
                <div className="w-full h-80 border-2 border-white shadow-2xl overflow-hidden rounded-sm grayscale group hover:grayscale-0 transition-all duration-1000">
                  <iframe 
                    src={settings.mapEmbedUrl}
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            )}

            <div className="pt-10">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] mb-6 text-muted">Follow Us</p>
              <div className="flex space-x-4">
                {settings.schema?.facebook && (
                  <a href={settings.schema.facebook} target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-primary text-background flex items-center justify-center hover:bg-accent transition-all">
                    <Facebook size={20} />
                  </a>
                )}
                {settings.schema?.instagram && (
                  <a href={settings.schema.instagram} target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-primary text-background flex items-center justify-center hover:bg-accent transition-all">
                    <Instagram size={20} />
                  </a>
                )}
                {settings.schema?.tiktok && (
                  <a href={settings.schema.tiktok} target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-primary text-background flex items-center justify-center hover:bg-accent transition-all">
                    <TikTokIcon size={20} />
                  </a>
                )}
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white p-10 border border-border shadow-xl"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted pl-1">Full Name</label>
                <input 
                  type="text" 
                  required
                  value={formState.name}
                  onChange={e => setFormState({...formState, name: e.target.value})}
                  className="w-full bg-surface border border-border px-4 py-3 text-sm font-bold focus:outline-none focus:border-accent"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted pl-1">Message</label>
                <textarea 
                  required
                  rows={6}
                  value={formState.message}
                  onChange={e => setFormState({...formState, message: e.target.value})}
                  className="w-full bg-surface border border-border px-4 py-3 text-sm font-bold focus:outline-none focus:border-accent resize-none"
                />
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-primary text-background py-4 font-bold uppercase tracking-widest text-xs hover:bg-accent transition-all shadow-lg flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                {!isSubmitting && <Send size={16} />}
              </button>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
