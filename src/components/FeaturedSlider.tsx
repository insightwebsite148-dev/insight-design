'use client';

import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { AnimatePresence, motion } from 'framer-motion';
import SliderItem from './slider/SliderItem';
import Lightbox from './slider/Lightbox';
import SliderHeader from './slider/SliderHeader';
import { getDirection, EASE_OUT_EXPO } from './slider/SliderConstants';
import { useSettings } from '@/context/SettingsContext';

export default function FeaturedSlider({ initialSettings }: { initialProjects?: any[]; initialSettings?: any }) {
  const { settings: globalSettings, projects } = useSettings();
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 35 });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(0);
  const [sliderHeight, setSliderHeight] = useState(() => initialSettings?.sliderHeight || 'auto');
  const [expandedProject, setExpandedProject] = useState<any>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [headings, setHeadings] = useState({
    headline: initialSettings?.sliderHeadline || 'Bespoke Architectural Masterpieces',
    subheadline: initialSettings?.sliderSubheadline || 'Curation Of Excellence'
  });

  // Keep headings and height in sync with global settings
  useEffect(() => {
    if (globalSettings) {
      if (globalSettings.sliderHeight) setSliderHeight(globalSettings.sliderHeight);
      setHeadings({
        headline: globalSettings.sliderHeadline || 'Bespoke Architectural Masterpieces',
        subheadline: globalSettings.sliderSubheadline || 'Curation Of Excellence'
      });
    }
  }, [globalSettings]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    const next = emblaApi.selectedScrollSnap();
    setSelectedIndex((prev) => { setPrevIndex(prev); return next; });
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 500);
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    return () => { emblaApi.off('select', onSelect); };
  }, [emblaApi, onSelect]);



  if (projects.length === 0) return null;
  const direction = getDirection(selectedIndex, prevIndex, projects.length);
 
  return (
    <section 
      className="bg-background py-28 px-6 relative overflow-hidden min-h-[90vh] flex items-center"
    >
      <AnimatePresence>{expandedProject && <Lightbox project={expandedProject} onClose={() => setExpandedProject(null)} />}</AnimatePresence>

      <div className="max-w-7xl mx-auto w-full relative z-10">
        <SliderHeader 
          headline={headings.headline} subheadline={headings.subheadline} 
          onPrev={() => emblaApi?.scrollPrev()} onNext={() => emblaApi?.scrollNext()} 
          isAnimating={isAnimating} 
        />

        <div className="relative">
          <div className="embla overflow-hidden" ref={emblaRef}>
            <div className="embla__container flex">
              {projects.map((p, i) => (
                <div key={p.id} className="embla__slide flex-[0_0_100%] min-w-0 px-2 lg:px-4">
                  <SliderItem project={p} active={selectedIndex === i} direction={direction} sliderHeight={sliderHeight} onExpand={setExpandedProject} />
                </div>
              ))}
            </div>
          </div>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 lg:translate-x-0 lg:left-12 z-30 flex gap-2.5 bg-background border border-border/10 p-1 px-4 rounded-full">
            {projects.map((_, i) => (
              <motion.button key={i} onClick={() => emblaApi?.scrollTo(i)}
                animate={{ width: selectedIndex === i ? 40 : 8, opacity: selectedIndex === i ? 1 : 0.3 }}
                transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
                className={`h-[4px] rounded-full ${selectedIndex === i ? 'bg-accent' : 'bg-primary'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}