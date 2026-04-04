'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { Save, RefreshCcw, CheckCircle2, Palette } from 'lucide-react';
import TypographyLab from './settings/TypographyLab';
import ColorGrid from './theme/ColorGrid';

const defaultTheme: Record<string, string> = {
  background: '#ffffff', foreground: '#000000', 
  primary: '#000000', primaryForeground: '#ffffff',
  accent: '#ca8a04', 
  surface: '#ffffff', surfaceAlt: '#fcfcfc', 
  card: '#ffffff', cardForeground: '#000000',
  muted: '#000000', mutedForeground: '#000000',
  border: '#000000', ring: '#f25c27',
};

import { useAdminLanguage } from '@/context/AdminLanguageContext';

export default function ThemeLab() {
  const { lang, t } = useAdminLanguage();
  const themeT = t.theme;
  const [theme, setTheme] = useState(defaultTheme);
  const [typoSettings, setTypoSettings] = useState({
    headlineFont: 'Montserrat', headlineWeight: '700',
    bodyFont: 'Montserrat', bodyWeight: '400',
    heroFontSize: '', sectionFontSize: '', bodyFontSize: '', headlineFontSize: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const unsubTheme = onSnapshot(doc(db, 'settings', 'theme'), (snap) => {
      if (snap.exists()) setTheme({ ...defaultTheme, ...snap.data() });
    });

    const unsubGeneral = onSnapshot(doc(db, 'settings', 'general'), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setTypoSettings(prev => ({
          ...prev,
          headlineFont: data.headlineFont || prev.headlineFont,
          headlineWeight: data.headlineWeight || prev.headlineWeight,
          bodyFont: data.bodyFont || prev.bodyFont,
          bodyWeight: data.bodyWeight || prev.bodyWeight,
          heroFontSize: data.heroFontSize || '',
          sectionFontSize: data.sectionFontSize || '',
          bodyFontSize: data.bodyFontSize || '',
          headlineFontSize: data.headlineFontSize || '',
        }));
      }
      setLoading(false);
    });

    return () => { unsubTheme(); unsubGeneral(); };
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'theme'), theme);
      const generalRef = doc(db, 'settings', 'general');
      const generalSnap = await getDoc(generalRef);
      if (generalSnap.exists()) {
        await updateDoc(generalRef, { ...typoSettings });
      } else {
        await setDoc(generalRef, typoSettings);
      }
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (e) {
      console.error(e);
      alert(themeT.failed);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm(themeT.resetConfirm)) {
      setTheme(defaultTheme);
    }
  };

  const update = (key: string, val: string) => setTheme({ ...theme, [key]: val });

  if (loading) return (
    <div className="py-20 flex flex-col items-center">
      <div className="w-8 h-8 border-4 border-black border-t-transparent animate-spin mb-4" />
      <span className="text-[10px] font-black uppercase tracking-normal text-black">{themeT.loading}</span>
    </div>
  );

  return (
    <div className={`max-w-5xl mx-auto space-y-16 pb-32 ${lang === 'ar' ? 'font-sans' : 'font-bold'}`}>
      {/* Header */}
      <div className={`flex justify-between items-center border-b-4 border-black pb-10 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
        <div className={lang === 'ar' ? 'text-right' : ''}>
          <div className={`flex items-center gap-3 mb-2 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
            <Palette size={24} />
             <h2 className="text-3xl font-black tracking-tighter uppercase leading-none">
               {themeT.title}
             </h2>
          </div>
          <p className="text-[10px] font-black uppercase tracking-normal text-black/40 italic">
            {themeT.subtitle}
          </p>
        </div>
        <div className={`flex gap-4 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
          <button onClick={handleReset}
            className={`px-8 py-5 border-2 border-black text-[10px] font-black uppercase hover:bg-black hover:text-white transition-all flex items-center gap-4 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}
          >
            <RefreshCcw size={16} /> {themeT.reset}
          </button>
          <button onClick={handleSave} disabled={saving}
            className={`bg-black text-white px-12 py-5 text-[10px] font-black uppercase hover:bg-accent transition-all shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)] active:translate-x-1 active:translate-y-1 active:shadow-none disabled:opacity-50 flex items-center gap-6 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}
          >
            {saving ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : showSuccess ? <CheckCircle2 size={18} /> : <Save size={18} />}
            <span>
              {saving ? themeT.saving : 
               showSuccess ? themeT.applied : 
               themeT.publish}
            </span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
         <div className="lg:col-span-12">
            <ColorGrid theme={theme} update={update} />
         </div>
      </div>

      <div className="pt-16 border-t-4 border-black">
         <TypographyLab settings={typoSettings} setSettings={setTypoSettings} />
      </div>
    </div>
  );
}
