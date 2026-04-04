'use client';

import { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';
import { useSettings } from '@/context/SettingsContext';

export default function CustomCursor() {
  const { settings: config } = useSettings();
  const [isPointer, setIsPointer] = useState(false);
  const [isHidden, setIsHidden] = useState(true);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Outer ring uses a soft spring for a trailing effect
  const outerSpringConfig = { damping: 35, stiffness: 400, restDelta: 0.001 };
  const outerXSpring = useSpring(cursorX, outerSpringConfig);
  const outerYSpring = useSpring(cursorY, outerSpringConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (isHidden) setIsHidden(false);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isClickable = 
        target.closest('a') || 
        target.closest('button') || 
        target.closest('[role="button"]') ||
        window.getComputedStyle(target).cursor === 'pointer';
      
      setIsPointer(!!isClickable);
    };

    const handleMouseOut = () => setIsHidden(true);
    const handleMouseEnter = () => setIsHidden(false);

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseleave', handleMouseOut);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseleave', handleMouseOut);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [cursorX, cursorY, isHidden]);

  // Dynamically manage default cursor visibility via style injection
  useEffect(() => {
    const isMobile = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;
    const shouldHide = config?.cursorEnabled !== false && !isMobile;
    
    let styleTag: HTMLStyleElement | null = null;

    if (shouldHide) {
      styleTag = document.createElement('style');
      styleTag.id = 'dynamic-cursor-hide';
      styleTag.innerHTML = `
        * {
          cursor: none !important;
        }
      `;
      document.head.appendChild(styleTag);
    }
    
    return () => {
      const existing = document.getElementById('dynamic-cursor-hide');
      if (existing) existing.remove();
    };
  }, [config?.cursorEnabled]);

  if (!config || config.cursorEnabled === false) return null;
  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) return null;

  const getShapeRadius = (shape: string) => {
    if (shape === 'square') return '0%';
    if (shape === 'pill') return '100px';
    return '50%';
  };

  return (
    <div 
      className={`fixed inset-0 z-[9999] pointer-events-none select-none ${isHidden ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
      style={{ mixBlendMode: config.cursorBlend as any }}
    >
      {/* Outer Kinetic Ring - uses spring for smooth trailing */}
      <motion.div
        className="fixed top-0 left-0"
        style={{
          x: outerXSpring,
          y: outerYSpring,
          translateX: '-50%',
          translateY: '-50%',
          width: config.cursorOuterSize ? `${config.cursorOuterSize}px` : '32px',
          height: config.cursorOuterSize ? `${config.cursorOuterSize}px` : '32px',
          borderRadius: getShapeRadius(config.cursorShape),
          border: `${config.cursorBorderWidth || 1}px solid ${config.cursorOuterColor || '#f25c27'}`,
          opacity: config.cursorOuterOpacity || 0.4,
          scale: isPointer ? (parseFloat(config.cursorHoverScale) || 2.5) : 1,
        }}
        transition={{
          scale: { type: 'spring', stiffness: 300, damping: 20 }
        }}
      />
      
      {/* Inner Precision Dot - follows mouse instantly, no spring */}
      <motion.div
        className="fixed top-0 left-0"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
          width: config.cursorInnerSize ? `${config.cursorInnerSize}px` : '6px',
          height: config.cursorInnerSize ? `${config.cursorInnerSize}px` : '6px',
          borderRadius: getShapeRadius(config.cursorShape),
          backgroundColor: config.cursorInnerColor || '#f25c27',
          opacity: config.cursorInnerOpacity || 1,
          scale: isPointer ? 0.5 : 1,
        }}
      />
    </div>
  );
}
