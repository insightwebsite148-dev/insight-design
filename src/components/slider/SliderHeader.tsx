'use client';

import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { slideIn, fadeUp } from './SliderConstants';
import MagneticButton from './MagneticButton';
import EditableWrapper from '../EditableWrapper';

interface SliderHeaderProps {
  headline: string;
  subheadline: string;
  onPrev: () => void;
  onNext: () => void;
  isAnimating: boolean;
}

export default function SliderHeader({ headline, subheadline, onPrev, onNext, isAnimating }: SliderHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-end mb-14 gap-10">
      <div className="max-w-2xl">
        <motion.div
          variants={slideIn(0)} initial="hidden" whileInView="visible" viewport={{ once: true }}
        >
          <EditableWrapper
            collection="settings"
            documentId="general"
            field="sliderSubheadline"
            value={subheadline}
            type="text"
            styleField="sliderSub"
          >
            <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-accent/80 mb-3 block">
              {subheadline}
            </span>
          </EditableWrapper>
        </motion.div>
        <motion.div
          variants={fadeUp(0.1)} initial="hidden" whileInView="visible" viewport={{ once: true }}
        >
          <EditableWrapper
            collection="settings"
            documentId="general"
            field="sliderHeadline"
            value={headline}
            type="text"
            styleField="sliderHeadline"
          >
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase leading-[1.1] max-w-xl">
              {headline}
            </h2>
          </EditableWrapper>
        </motion.div>
      </div>

      <div className="flex gap-3">
        <button onClick={onPrev} disabled={isAnimating}
          className="w-[52px] h-[52px] rounded-full border border-border flex items-center justify-center hover:bg-primary hover:text-background hover:border-primary transition-all duration-300 group disabled:opacity-30"
        >
          <ChevronLeft size={19} className="group-hover:-translate-x-0.5 transition-transform" />
        </button>
        <button onClick={onNext} disabled={isAnimating}
          className="w-[52px] h-[52px] rounded-full bg-primary text-background flex items-center justify-center hover:bg-accent transition-all duration-300 shadow-lg group disabled:opacity-30"
        >
          <ChevronRight size={19} className="group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
}
