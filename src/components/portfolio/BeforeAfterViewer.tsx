'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

interface BeforeAfterViewerProps {
  before: string;
  after: string;
  title?: string;
}

export default function BeforeAfterViewer({ before, after, title }: BeforeAfterViewerProps) {
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const position = ((x - rect.left) / rect.width) * 100;
    
    setSliderPos(Math.min(Math.max(position, 0), 100));
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onTouchMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setSliderPos(50); // Reset to center
      }}
      className="relative w-full aspect-[4/3] bg-black overflow-hidden group cursor-col-resize select-none border-4 border-black border-sharp"
    >
      {/* After Image (Background) */}
      <img 
        src={after} 
        alt="After" 
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Before Image (Overlay - Clipped) */}
      <div 
        className="absolute inset-0 w-full h-full object-cover transition-all duration-100"
        style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
      >
        <img 
          src={before} 
          alt="Before" 
          className="w-full h-full object-cover grayscale-[0.3]"
        />
        {/* Label Before */}
        <div className="absolute top-6 left-6 px-4 py-2 bg-black text-white text-[8px] font-black uppercase tracking-widest z-10 border border-white/20">
          BEFORE
        </div>
      </div>

      {/* Label After */}
      <div className="absolute top-6 right-6 px-4 py-2 bg-accent text-white text-[8px] font-black uppercase tracking-widest z-10">
        AFTER
      </div>

      {/* Comparison Slider Line */}
      <div 
        className="absolute top-0 bottom-0 w-[4px] bg-white z-20 pointer-events-none flex items-center justify-center shadow-[0_0_20px_rgba(0,0,0,0.5)]"
        style={{ left: `${sliderPos}%` }}
      >
        <div className="w-12 h-12 rounded-none bg-white border-2 border-black flex flex-col items-center justify-center gap-1 -translate-x-1/2">
           <div className="flex gap-1">
              <ChevronLeft size={10} className="text-black" />
              <ChevronRight size={10} className="text-black" />
           </div>
        </div>
      </div>

      {/* Interaction Hint Overlay */}
      <AnimatePresence>
        {!isHovered && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/20 flex flex-col items-center justify-center pointer-events-none z-30"
          >
            <div className="p-4 bg-white/95 border-2 border-black text-black">
               <p className="text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-3">
                  <Maximize2 size={12} /> Hover to compare transformation
               </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
