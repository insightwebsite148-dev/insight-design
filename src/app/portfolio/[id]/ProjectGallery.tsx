'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { getOptimizedUrl } from '@/lib/cloudinary';

export default function ProjectGallery({ images, title }: { images: string[], title: string }) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex + 1) % images.length);
    }
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex - 1 + images.length) % images.length);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') setSelectedIndex(null);
    if (e.key === 'ArrowRight') handleNext(e as any);
    if (e.key === 'ArrowLeft') handlePrev(e as any);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 mb-24">
        {/* Main Image */}
        {images[0] && (
          <div 
            onClick={() => setSelectedIndex(0)}
            className="md:col-span-12 relative aspect-[21/9] overflow-hidden rounded-[24px] cursor-zoom-in group shadow-2xl"
          >
            <Image
              src={getOptimizedUrl(images[0], 1600)}
              alt={`${title} - Main Cover`}
              fill
              sizes="100vw"
              className="object-cover group-hover:scale-105 transition-transform duration-1000 ease-[0.16,1,0.3,1]"
              priority
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />
            <div className="absolute bottom-6 right-6 bg-black/40 backdrop-blur-md text-white px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity">
              View Fullscreen
            </div>
          </div>
        )}
        
        {/* Additional Images Grid */}
        <div className="md:col-span-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
          {images.slice(1).map((img: string, i: number) => (
            <div 
              key={i} 
              onClick={() => setSelectedIndex(i + 1)}
              className="relative aspect-square md:aspect-[4/5] overflow-hidden rounded-[16px] cursor-zoom-in group shadow-lg"
            >
              <Image
                src={getOptimizedUrl(img, 800)}
                alt={`${title} - View ${i + 2}`}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover group-hover:scale-110 transition-transform duration-1000 ease-[0.16,1,0.3,1]"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />
            </div>
          ))}
        </div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 md:p-8"
            onClick={() => setSelectedIndex(null)}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            autoFocus
          >
            <motion.button
              initial={{ opacity: 0, scale: 0.7, rotate: -90 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.1)' }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSelectedIndex(null)}
              className="absolute top-6 right-6 w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white z-50 transition-colors"
            >
              <X size={18} />
            </motion.button>

            {images.length > 1 && (
              <>
                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.1)' }}
                  onClick={handlePrev}
                  className="absolute left-4 md:left-10 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white z-50 transition-colors"
                >
                  <ChevronLeft size={24} />
                </motion.button>
                <motion.button
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.1)' }}
                  onClick={handleNext}
                  className="absolute right-4 md:right-10 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white z-50 transition-colors"
                >
                  <ChevronRight size={24} />
                </motion.button>
              </>
            )}

            <motion.div
              key={selectedIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative max-w-7xl w-full h-full max-h-[90vh] rounded-[24px] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={getOptimizedUrl(images[selectedIndex], 1600)}
                alt={`${title} - View ${selectedIndex + 1}`}
                fill
                sizes="100vw"
                className="object-contain"
                priority
              />
              
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/50 text-[10px] uppercase tracking-[0.3em] font-bold">
                {selectedIndex + 1} / {images.length}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
