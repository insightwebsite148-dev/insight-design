'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { getOptimizedUrl } from '@/lib/cloudinary';
import EditableWrapper from './EditableWrapper';

interface PageHeroProps {
  title: string;
  subtitle?: string;
  image?: string;
  height?: string;
  editCollection?: string;
  editDocumentId?: string;
  imageField?: string;
}

export default function PageHero({ title, subtitle, image, height = '60vh', editCollection, editDocumentId, imageField }: PageHeroProps) {
  return (
    <section 
      className="relative flex items-center justify-center overflow-hidden w-full bg-[#050505]"
      style={{ minHeight: `calc(${height} - 80px)` }}
    >
      {/* Background Image & Overlays */}
      <div className="absolute inset-0 z-0">
        {image ? (
          <EditableWrapper
            collection={editCollection || 'settings'}
            documentId={editDocumentId || 'general'}
            field={imageField || 'heroImage'}
            value={image}
            type="image"
          >
            <motion.div 
              initial={{ scale: 1.05 }}
              animate={{ scale: 1 }}
              transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0"
            >
              <Image 
                src={getOptimizedUrl(image, 2560)} 
                alt={title} 
                fill 
                priority
                className="object-cover"
                sizes="100vw"
              />
            </motion.div>
          </EditableWrapper>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary via-primary/95 to-accent/20" />
        )}
        
        {/* Light Overlay for text readability only */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="container relative z-10 mx-auto px-6 lg:px-16 w-full flex flex-col items-center text-center">
        <motion.div
           initial={{ opacity: 0, y: 40 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
           className="max-w-5xl flex flex-col items-center text-center"
        >
          {/* Subtle Accent Line */}
          <div className="flex flex-col items-center gap-4 mb-8">
            <span className="h-[1px] w-12 bg-accent/80" />
            <span className="inline-block text-accent text-[11px] font-bold uppercase tracking-[0.6em]">
               Architectural Excellence
            </span>
          </div>

          <EditableWrapper
            collection={editCollection || 'settings'}
            documentId={editDocumentId || 'general'}
            field="heroHeadline"
            value={title}
            type="text"
            styleField="pageHeroTitle"
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter uppercase mb-8 leading-[0.9] whitespace-pre-line">
              {title}
            </h1>
          </EditableWrapper>

          {subtitle && (
            <EditableWrapper
              collection={editCollection || 'settings'}
              documentId={editDocumentId || 'general'}
              field="heroSubheadline"
              value={subtitle}
              type="text"
            >
              <div className="flex flex-col items-center justify-center gap-6 mt-10 border-t border-white/10 pt-8 w-full max-w-lg mx-auto">
                <span className="text-[10px] font-bold text-white/30 tracking-[0.3em] uppercase shrink-0">
                  Vol. {new Date().getFullYear()}
                </span>
                <p className="text-white/70 text-sm md:text-base font-medium max-w-2xl leading-relaxed">
                  {subtitle}
                </p>
              </div>
            </EditableWrapper>
          )}
        </motion.div>
      </div>

      {/* Decorative vertical lines */}
      <div className="absolute top-0 right-16 md:right-32 bottom-0 w-px bg-white/5 z-0" />
      <div className="absolute top-0 right-6 md:right-16 bottom-0 w-px bg-white/5 z-0" />

    </section>
  );
}
