'use client';

import { motion } from 'framer-motion';
import { EASE_OUT_EXPO } from './SliderConstants';

const variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE_OUT_EXPO, delay },
  }),
};

export default function StatItem({ icon: Icon, label, value, delay, visible }: {
  icon: any; label: string; value: string; delay: number; visible: boolean;
}) {
  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate={visible ? 'visible' : 'hidden'}
      custom={delay}
      className="flex flex-col items-center text-center"
    >
      <Icon size={15} className="text-accent/40 group-hover:text-accent transition-colors duration-300" />
      <p className="text-[9px] font-bold uppercase text-muted/50 tracking-widest">{label}</p>
      <p className="text-xs font-bold tracking-wide truncate">{value}</p>
    </motion.div>
  );
}
