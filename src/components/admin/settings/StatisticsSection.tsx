'use client';

interface StatisticsSectionProps {
  settings: any;
  setSettings: (s: any) => void;
}

import { useAdminLanguage } from '@/context/AdminLanguageContext';

export default function StatisticsSection({ settings, setSettings }: StatisticsSectionProps) {
  const { lang, t } = useAdminLanguage();
  const st = t.stats;

  const inputClass = `w-full border border-gray-200 bg-gray-50/50 rounded-lg px-4 py-3 text-sm font-semibold text-gray-900 placeholder:text-gray-400 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all ${lang === 'ar' ? 'text-right' : ''}`;

  return (
    <div className={`space-y-6 ${lang === 'ar' ? 'font-sans' : ''}`}>
      <h3 className="text-lg font-bold text-gray-800 pb-3 border-b border-gray-100">{st.title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((num) => (
          <div key={num} className="p-5 bg-gray-50/70 rounded-xl border border-gray-100 space-y-3">
            <span className="text-[12px] font-bold text-accent">{st.statPrefix} {num}</span>
            <div className="grid grid-cols-2 gap-3">
              <input 
                placeholder={st.valuePlaceholder} 
                type="text" 
                value={(settings as any)[`stats${num}Value`]} 
                onChange={(e) => setSettings({...settings, [`stats${num}Value`]: e.target.value})} 
                className={inputClass}
              />
              <input 
                placeholder={st.labelPlaceholder} 
                type="text" 
                value={(settings as any)[`stats${num}Label`]} 
                onChange={(e) => setSettings({...settings, [`stats${num}Label`]: e.target.value})} 
                className={inputClass}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
