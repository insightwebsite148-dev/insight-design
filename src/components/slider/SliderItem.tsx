'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Maximize2, ArrowRight, Calendar, Layout, Phone, Award } from 'lucide-react';
import StatItem from './StatItem';
import { EASE_OUT_EXPO, SPRING, slideIn, fadeUp } from './SliderConstants';
import { getOptimizedUrl } from '@/lib/cloudinary';
import EditableWrapper from '../EditableWrapper';
import { useSettings } from '@/context/SettingsContext';
import { DEFAULT_SETTINGS } from '@/lib/constants';

interface SliderItemProps {
  project: any;
  active: boolean;
  direction: number;
  sliderHeight: string;
  onExpand: (project: any) => void;
}

export default function SliderItem({
  project,
  active,
  direction,
  sliderHeight,
  onExpand
}: SliderItemProps) {
  const { settings: globalSettings } = useSettings();
  const settings = globalSettings || {};

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch bg-white rounded-[36px] overflow-hidden border border-muted/5 shadow-2xl">
      {/* Info Panel - Brand Centric */}
      <motion.div 
        animate={active ? 'visible' : 'hidden'}
        initial="hidden"
        className="lg:col-span-5 p-10 md:p-14 flex flex-col z-10"
      >
        <div className="flex-grow">
          <motion.div
            variants={slideIn(0)}
            className="flex items-center gap-3 text-[9px] font-bold tracking-widest text-accent mb-8"
          >
            <span className="px-3 py-1.5 border border-accent/50 rounded-full cursor-default">
              Architectural Vision
            </span>
            <span className="w-1 h-1 bg-primary/50 rounded-full" />
            <span className="text-primary/70">Insight Studio</span>
          </motion.div>

          <motion.div variants={fadeUp(0.02)}>
            <EditableWrapper
              collection="settings"
              documentId="general"
              field="brandName"
              value={settings.brandName || DEFAULT_SETTINGS.brandName}
              type="text"
            >
              <h3 className="text-3xl md:text-[2.6rem] font-bold tracking-tighter uppercase mb-5 leading-[1.05]">
                {settings.brandName || DEFAULT_SETTINGS.brandName}
              </h3>
            </EditableWrapper>
          </motion.div>

          <motion.div
            variants={fadeUp(0.04)}
            className="flex items-center text-primary/80 text-[11px] mb-8 gap-3"
          >
            <MapPin size={14} className="text-accent shrink-0" />
            <EditableWrapper
              collection="settings"
              documentId="general"
              field="address"
              value={settings.address || DEFAULT_SETTINGS.address}
              type="text"
            >
              <span className="uppercase tracking-[0.25em] font-semibold">
                {settings.address || DEFAULT_SETTINGS.address}
              </span>
            </EditableWrapper>
          </motion.div>

          <motion.div variants={fadeUp(0.06)}>
            <EditableWrapper
              collection="settings"
              documentId="general"
              field="heroDescription"
              value={settings.heroDescription || DEFAULT_SETTINGS.heroDescription}
              type="text"
            >
              <p className="text-sm text-primary/80 leading-[1.8] mb-10 max-w-sm font-normal line-clamp-4">
                {settings.heroDescription || DEFAULT_SETTINGS.heroDescription}
              </p>
            </EditableWrapper>
          </motion.div>

          <motion.div
            variants={fadeUp(0.08)}
            className="grid grid-cols-3 gap-4 mb-10 border-t border-border/30 pt-8"
          >
            <StatItem 
              icon={Layout} 
              label="Expertise" 
              value={settings.brandSlogan || DEFAULT_SETTINGS.brandSlogan} 
              delay={0.1} 
              visible={active} 
            />
            <StatItem 
              icon={Phone} 
              label="Contact" 
              value={settings.whatsappNumber || DEFAULT_SETTINGS.whatsappNumber} 
              delay={0.12} 
              visible={active} 
            />
            <StatItem 
              icon={Award} 
              label="Since" 
              value={settings.stats1Value || DEFAULT_SETTINGS.stats1Value} 
              delay={0.14} 
              visible={active} 
            />
          </motion.div>
        </div>

        <motion.button
          variants={fadeUp(0.12)}
          whileHover="hover"
          whileTap={{ scale: 0.97 }}
          className="group relative flex items-center justify-between bg-primary text-background px-7 py-4 w-full text-[10px] font-bold uppercase tracking-[0.35em] overflow-hidden rounded-2xl mt-auto"
        >
          <motion.div
            className="absolute inset-0 bg-accent origin-left"
            initial={{ scaleX: 0 }}
            variants={{ hover: { scaleX: 1, transition: { duration: 0.45, ease: EASE_OUT_EXPO } } }}
          />
          <EditableWrapper
            collection="settings"
            documentId="general"
            field="sliderButtonItemText"
            value="Initiate Project Inquiry"
            type="text"
          >
            <span className="relative z-10">Initiate Project Inquiry</span>
          </EditableWrapper>
          <motion.div className="relative z-10" variants={{ hover: { x: 5 } }}>
            <ArrowRight size={16} />
          </motion.div>
        </motion.button>
      </motion.div>

      {/* Visual Panel */}
      <div
        className="lg:col-span-7 h-[350px] lg:h-auto relative overflow-hidden bg-primary/10 group"
        style={{ height: sliderHeight !== 'auto' ? sliderHeight : undefined }}
      >
        <motion.div
          animate={{
            scale: active ? 1 : 1.05,
            opacity: active ? 1 : 0.2,
            x: active ? 0 : direction * 15,
          }}
          transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 z-10">
            {(() => {
              const imgSource = project.image || (project.images && project.images[0]);
              return imgSource ? (
                <Image
                  src={getOptimizedUrl(imgSource, 1100)}
                  alt={project.title || "Project Image"}
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover"
                  priority={active}
                />
              ) : null;
            })()}
          </div>
        </motion.div>

        <Link 
          href={`/portfolio/${project.id}`} 
          className="absolute inset-0 z-30 flex items-center justify-center opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-500 bg-primary/20 cursor-pointer"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-primary/40 border border-background/20 flex flex-col items-center justify-center gap-2 backdrop-blur-[4px] hover:bg-accent/80 transition-colors pointer-events-none"
          >
            <ArrowRight size={22} className="text-background -rotate-45" />
            <span className="text-[7px] font-bold tracking-[0.45em] uppercase text-background text-center">View<br/>Details</span>
          </motion.div>
        </Link>
      </div>
    </div>
  );
}
