'use client';
 
import { motion, animate } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import { useSettings } from '@/context/SettingsContext';
import { DEFAULT_SETTINGS } from '@/lib/constants';
import EditableWrapper from './EditableWrapper';

function Counter({ value }: { value: string }) {
  const numericValue = parseInt(value) || 0;
  const suffix = value.replace(numericValue.toString(), '');
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const controls = animate(0, numericValue, {
      duration: 2,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => setDisplayValue(Math.floor(latest)),
    });
    return () => controls.stop();
  }, [numericValue]);

  return (
    <>
      {displayValue}
      {suffix}
    </>
  );
}

export default function StatsBar({ initialSettings }: { initialSettings?: any }) {
  const { settings: globalSettings } = useSettings();
  const [stats, setStats] = useState(() => {
    const s = initialSettings || {};
    return [
      { value: s.stats1Value || DEFAULT_SETTINGS.stats1Value, label: s.stats1Label || DEFAULT_SETTINGS.stats1Label, valueField: 'stats1Value', labelField: 'stats1Label' },
      { value: s.stats2Value || DEFAULT_SETTINGS.stats2Value, label: s.stats2Label || DEFAULT_SETTINGS.stats2Label, valueField: 'stats2Value', labelField: 'stats2Label' },
      { value: s.stats3Value || DEFAULT_SETTINGS.stats3Value, label: s.stats3Label || DEFAULT_SETTINGS.stats3Label, valueField: 'stats3Value', labelField: 'stats3Label' },
      { value: s.stats4Value || DEFAULT_SETTINGS.stats4Value, label: s.stats4Label || DEFAULT_SETTINGS.stats4Label, valueField: 'stats4Value', labelField: 'stats4Label' },
    ];
  });

  useEffect(() => {
    if (globalSettings) {
      setStats([
        { value: globalSettings.stats1Value || DEFAULT_SETTINGS.stats1Value, label: globalSettings.stats1Label || DEFAULT_SETTINGS.stats1Label, valueField: 'stats1Value', labelField: 'stats1Label' },
        { value: globalSettings.stats2Value || DEFAULT_SETTINGS.stats2Value, label: globalSettings.stats2Label || DEFAULT_SETTINGS.stats2Label, valueField: 'stats2Value', labelField: 'stats2Label' },
        { value: globalSettings.stats3Value || DEFAULT_SETTINGS.stats3Value, label: globalSettings.stats3Label || DEFAULT_SETTINGS.stats3Label, valueField: 'stats3Value', labelField: 'stats3Label' },
        { value: globalSettings.stats4Value || DEFAULT_SETTINGS.stats4Value, label: globalSettings.stats4Label || DEFAULT_SETTINGS.stats4Label, valueField: 'stats4Value', labelField: 'stats4Label' },
      ]);
    }
  }, [globalSettings]);

  return (
    <div className="bg-white py-24 px-6 border-y border-black/5">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-16 md:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.valueField}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 1.2, 
                delay: index * 0.15,
                ease: [0.16, 1, 0.3, 1] 
              }}
              className="text-center group"
            >
              <div className="mb-6 flex justify-center">
                 <div className="h-px w-24 bg-accent/20 group-hover:w-32 group-hover:bg-accent transition-all duration-700" />
              </div>
              <EditableWrapper
                collection="settings"
                documentId="general"
                field={stat.valueField}
                value={stat.value}
                type="text"
                styleField={`stat${index + 1}Value`}
              >
                <h3 className="text-5xl md:text-7xl font-black mb-4 text-primary tracking-tighter tabular-nums">
                  <Counter value={stat.value} />
                </h3>
              </EditableWrapper>
              <EditableWrapper
                collection="settings"
                documentId="general"
                field={stat.labelField}
                value={stat.label}
                type="text"
                styleField={`stat${index + 1}Label`}
              >
                <p className="text-[12px] font-bold uppercase tracking-[0.4em] text-accent group-hover:tracking-[0.5em] transition-all duration-700">
                  {stat.label}
                </p>
              </EditableWrapper>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
