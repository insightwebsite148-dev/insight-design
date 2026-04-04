'use client';

import { motion } from 'framer-motion';
import { PARTICLES } from './constants';

export default function HeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
      {/* Crisp Architectural Design Elements */}
      <div className="absolute top-0 right-0 w-[60vw] h-[60vw] bg-accent/5 rounded-full transform translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 w-[50vw] h-[50vw] bg-primary/5 rounded-full transform -translate-x-1/3 translate-y-1/3" />
      
      {/* Decorative lines - already crisp but removing potential subtle blurs */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black,transparent)]" />
      <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[1px] bg-gradient-to-r from-transparent via-accent/20 to-transparent transform rotate-45" />
    </div>
  );
}
