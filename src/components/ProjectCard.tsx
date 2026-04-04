'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { MoveUpRight } from 'lucide-react';
import { getOptimizedUrl } from '@/lib/cloudinary';

interface Project {
  id: string;
  title: string;
  category: string;
  location?: string;
  image?: string;
  images?: string[];
}

export default function ProjectCard({ project, index }: { project: Project; index: number }) {
  const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

  // Create a masonry-style offset for middle items (desktop) and alternating items (tablet/xl)
  const getOffset = () => {
    // XL screens (4 cols): offset alternating columns for a dynamic wave
    const xlOffset = index % 2 === 1 ? 'xl:translate-y-20' : 'xl:translate-y-0';
    // Large screens (3 cols): middle item shifts down
    const lgOffset = index % 3 === 1 ? 'lg:translate-y-16' : 'lg:translate-y-0';
    // Medium screens (2 cols): alternating items shift down
    const mdOffset = index % 2 === 1 ? 'md:translate-y-12' : 'md:translate-y-0';
    
    return `${mdOffset} ${lgOffset} ${xlOffset} xl:mb-20 lg:mb-16 md:mb-12`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 80 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.4, delay: (index % 3) * 0.1, ease: EASE_OUT_EXPO }}
      viewport={{ once: true, margin: "-50px" }}
      className={`group relative w-full aspect-[3/4] overflow-hidden rounded-md sm:rounded-xl md:rounded-[24px] bg-[#050505] shadow-xl hover:shadow-2xl transition-shadow duration-1000 ${getOffset()}`}
    >
      <Link href={`/portfolio/${project.id}`} className="block w-full h-full relative cursor-pointer">
        
        {/* Cinematic Zoom Image */}
        <motion.div 
          className="absolute inset-0 transform-origin-center"
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <Image
            src={getOptimizedUrl(project.image || (project.images && project.images[0]) || '', 1000)}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-all duration-[2s] ease-[0.16,1,0.3,1] scale-100 group-hover:scale-110 group-hover:blur-[2px] opacity-90 group-hover:opacity-100"
          />
        </motion.div>

        {/* Elegant Fade Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-700 ease-[0.16,1,0.3,1]" />

        {/* Interactive Hover Reveal Icon */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-700 z-20">
           <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border border-white/20 bg-white/10 backdrop-blur-md flex items-center justify-center group/icon transform translate-y-10 group-hover:translate-y-0 transition-transform duration-700 ease-[0.16,1,0.3,1]">
            <MoveUpRight size={28} strokeWidth={1} className="text-white transform group-hover/icon:translate-x-1 group-hover/icon:-translate-y-1 transition-transform duration-500" />
          </div>
        </div>

        {/* Subtle Decorative Border */}
        <div className="absolute inset-0 border border-white/0 group-hover:border-white/10 rounded-md sm:rounded-xl md:rounded-[24px] transition-colors duration-1000 pointer-events-none" />
        
        {/* Subtle gradient at the bottom purely for lighting effect */}
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 mix-blend-overlay pointer-events-none" />
      </Link>
    </motion.div>
  );
}
