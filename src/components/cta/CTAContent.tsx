'use client';

import { motion } from 'framer-motion';
import EditableWrapper from '../EditableWrapper';

interface CTAContentProps {
  headline: string;
  subheadline: string;
}

export default function CTAContent({ headline, subheadline }: CTAContentProps) {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <span className="h-[1px] w-8 bg-accent/30"></span>
        <span className="text-accent text-[11px] font-bold uppercase tracking-[0.4em]">
          Architectural Inquiry
        </span>
      </div>
      
      <EditableWrapper
        collection="settings"
        documentId="general"
        field="ctaHeadline"
        value={headline}
        type="text"
        styleField="ctaHeadline"
      >
        <h2 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1] text-primary whitespace-pre-line uppercase">
          {headline}
        </h2>
      </EditableWrapper>
      
      <EditableWrapper
        collection="settings"
        documentId="general"
        field="ctaSubheadline"
        value={subheadline}
        type="text"
        styleField="ctaSub"
      >
        <p className="text-lg text-muted font-light leading-relaxed max-w-xl">
          {subheadline}
        </p>
      </EditableWrapper>

      <div className="pt-8 flex flex-col gap-4">
        <div className="w-16 h-px bg-accent/40" />
        <p className="text-[12px] uppercase tracking-[0.3em] font-bold text-accent/80">
          Direct Collaboration Protocol
        </p>
      </div>
    </div>
  );
}
