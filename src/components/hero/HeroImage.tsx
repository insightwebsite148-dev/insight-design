'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

import { getOptimizedUrl } from '@/lib/cloudinary';

interface HeroImageProps {
  src: string;
  isBackground?: boolean;
}

export default function HeroImage({ src, isBackground }: HeroImageProps) {
  if (isBackground) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
        className="w-full h-full absolute inset-0"
      >
        <Image
          src={getOptimizedUrl(src, 2560)}
          alt="Insight Premium Design"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>
    );
  }

  return (
    <div className="relative flex justify-center lg:justify-end items-center h-full w-full min-h-[50vh] xl:min-h-[75vh]">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-[90%] lg:max-w-[95%] h-[500px] lg:h-[700px] z-10 overflow-visible"
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full h-full relative"
        >
          <Image
            src={getOptimizedUrl(src, 1200)}
            alt="Insight Premium Design"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-contain transition-all duration-700"
          />
          <div className="absolute -bottom-1 -left-1 -right-1 h-1/2 bg-gradient-to-t from-background via-background/60 to-transparent pointer-events-none z-20" />
        </motion.div>
      </motion.div>
    </div>
  );
}
