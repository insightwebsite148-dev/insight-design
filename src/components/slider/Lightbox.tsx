'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { X } from 'lucide-react';
import { SPRING, EASE_OUT_EXPO } from './SliderConstants';

export default function Lightbox({ project, onClose }: { project: any; onClose: () => void; }) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-primary/95 p-4 md:p-10"
      onClick={onClose}
    >
      <motion.div
        layoutId={`project-image-${project.id}`}
        transition={SPRING}
        className="relative max-w-6xl w-full h-full max-h-[85vh] rounded-[32px] overflow-hidden shadow-2xl bg-surface/10"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={project.image || (project.images && project.images[0])}
          alt={project.title}
          fill
          sizes="(max-width: 1200px) 100vw, 80vw"
          className="object-contain"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-transparent to-transparent pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5, ease: EASE_OUT_EXPO }}
          className="absolute bottom-0 left-0 p-8 md:p-16 text-background max-w-3xl pointer-events-none"
        >
          <span className="text-[9px] font-bold uppercase tracking-[0.45em] text-accent mb-4 block">
            {project.category}
          </span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter uppercase mb-6 leading-[1.05]">
            {project.title}
          </h2>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, scale: 0.7, rotate: -90 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ delay: 0.15, ...SPRING }}
          whileHover={{ scale: 1.1, rotate: 90, backgroundColor: 'rgb(239 68 68)' }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="absolute top-6 right-6 w-12 h-12 rounded-full bg-background/20 border border-background/20 flex items-center justify-center text-background z-50 transition-colors"
        >
          <X size={18} />
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
