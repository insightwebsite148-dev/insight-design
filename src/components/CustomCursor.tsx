'use client';

import { useEffect, useState, useRef } from 'react';
import { useSettings } from '@/context/SettingsContext';

export default function CustomCursor() {
  const { settings: config } = useSettings();
  const [accentColor, setAccentColor] = useState('#ca8a04');
  
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>(0);
  const isHiddenRef = useRef<boolean>(true);

  // Store target and current coords for interpolation
  const mouseX = useRef(-100);
  const mouseY = useRef(-100);
  const outerX = useRef(-100);
  const outerY = useRef(-100);

  // Read accent color from CSS variable (set by ThemeManager)
  useEffect(() => {
    const root = document.documentElement;
    const readAccent = () => {
      const accent = getComputedStyle(root).getPropertyValue('--accent').trim();
      if (accent) setAccentColor(accent);
    };
    readAccent();
    const observer = new MutationObserver(readAccent);
    observer.observe(root, { attributes: true, attributeFilter: ['style'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const isMobile = window.matchMedia('(pointer: coarse)').matches;
    if (isMobile || !config || config.cursorEnabled === false) return;

    const moveCursor = (e: MouseEvent) => {
      mouseX.current = e.clientX;
      mouseY.current = e.clientY;
      if (isHiddenRef.current) {
        isHiddenRef.current = false;
        if (outerRef.current) outerRef.current.style.opacity = String(config.cursorOuterOpacity || 0.4);
        if (innerRef.current) innerRef.current.style.opacity = String(config.cursorInnerOpacity || 1);
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isClickable = 
        target.closest('a') || 
        target.closest('button') || 
        target.closest('[role="button"]') ||
        window.getComputedStyle(target).cursor === 'pointer';
      
      const hoverScale = parseFloat(config.cursorHoverScale) || 2.5;
      if (outerRef.current) outerRef.current.style.transform = `translate(-50%, -50%) scale(${isClickable ? hoverScale : 1})`;
      if (innerRef.current) innerRef.current.style.transform = `translate(-50%, -50%) scale(${isClickable ? 0.5 : 1})`;
    };

    const handleMouseOut = () => {
      isHiddenRef.current = true;
      if (outerRef.current) outerRef.current.style.opacity = '0';
      if (innerRef.current) innerRef.current.style.opacity = '0';
    };
    const handleMouseEnter = () => {
      isHiddenRef.current = false;
      if (outerRef.current) outerRef.current.style.opacity = String(config.cursorOuterOpacity || 0.4);
      if (innerRef.current) innerRef.current.style.opacity = String(config.cursorInnerOpacity || 1);
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseleave', handleMouseOut);
    document.addEventListener('mouseenter', handleMouseEnter);

    // Hardware accelerated layout-free animation loop
    const render = () => {
      outerX.current += (mouseX.current - outerX.current) * 0.15;
      outerY.current += (mouseY.current - outerY.current) * 0.15;

      if (outerRef.current) {
        outerRef.current.style.left = `${outerX.current}px`;
        outerRef.current.style.top = `${outerY.current}px`;
      }
      if (innerRef.current) {
        innerRef.current.style.left = `${mouseX.current}px`;
        innerRef.current.style.top = `${mouseY.current}px`;
      }

      requestRef.current = requestAnimationFrame(render);
    };
    requestRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseleave', handleMouseOut);
      document.removeEventListener('mouseenter', handleMouseEnter);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [config]);

  // Dynamically manage default cursor visibility
  useEffect(() => {
    const isMobile = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;
    const shouldHide = config?.cursorEnabled !== false && !isMobile;
    
    let styleTag: HTMLStyleElement | null = null;
    if (shouldHide) {
      styleTag = document.createElement('style');
      styleTag.id = 'dynamic-cursor-hide';
      styleTag.innerHTML = `* { cursor: none !important; }`;
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

  const outerSize = config.cursorOuterSize ? `${config.cursorOuterSize}px` : '32px';
  const innerSize = config.cursorInnerSize ? `${config.cursorInnerSize}px` : '6px';

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none select-none">
      <div
        ref={outerRef}
        className="fixed top-0 left-0"
        style={{
          width: outerSize,
          height: outerSize,
          borderRadius: getShapeRadius(config.cursorShape || 'circle'),
          border: `${config.cursorBorderWidth || 1}px solid ${config.cursorOuterColor || accentColor}`,
          opacity: 0,
          transform: 'translate(-50%, -50%) scale(1)',
          transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease',
          willChange: 'left, top, transform'
        }}
      />
      <div
        ref={innerRef}
        className="fixed top-0 left-0"
        style={{
          width: innerSize,
          height: innerSize,
          borderRadius: getShapeRadius(config.cursorShape || 'circle'),
          backgroundColor: config.cursorInnerColor || accentColor,
          opacity: 0,
          transform: 'translate(-50%, -50%) scale(1)',
          transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease',
          willChange: 'left, top, transform'
        }}
      />
    </div>
  );
}
