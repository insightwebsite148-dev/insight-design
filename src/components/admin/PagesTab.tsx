'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import {
  doc,
  setDoc,
  onSnapshot
} from 'firebase/firestore';
import {
  Save,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Modular Components
import PageTabNavigation from './pages/PageTabNavigation';
import AboutPageSection from './pages/AboutPageSection';
import ContactPageSection from './pages/ContactPageSection';
import WorksPageSection from './pages/WorksPageSection';
import HeroSettingsSection from './settings/HeroSettingsSection';
import StatisticsSection from './settings/StatisticsSection';
import SliderSettingsSection from './settings/SliderSettingsSection';

import { useAdminLanguage } from '@/context/AdminLanguageContext';

export default function PagesTab() {
  const { lang, t } = useAdminLanguage();
  const [subTab, setSubTab] = useState<'Home' | 'About' | 'Contact' | 'Works'>('Home');
  const [aboutData, setAboutData] = useState<any>({
    heroHeadline: '',
    heroSubheadline: '',
    heroImage: '',
    storyTitle: '',
    storyContent: '',
    storyImage: '',
    mission: '',
    vision: ''
  });
  const [contactData, setContactData] = useState<any>({
    heroHeadline: '',
    heroSubheadline: '',
    socialInstagram: '',
    socialLinkedIn: '',
    socialFacebook: ''
  });
  const [homeData, setHomeData] = useState<any>({});
  const [worksData, setWorksData] = useState<any>({
    heroHeadline: '',
    heroSubheadline: '',
    heroImage: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    setLoading(true);
    const unsubHome = onSnapshot(doc(db, 'settings', 'general'), (snap) => {
      if (snap.exists()) setHomeData(snap.data());
    });

    const unsubAbout = onSnapshot(doc(db, 'pages', 'about'), (snap) => {
      if (snap.exists()) setAboutData(snap.data());
    });

    const unsubContact = onSnapshot(doc(db, 'pages', 'contact'), (snap) => {
      if (snap.exists()) setContactData(snap.data());
    });

    const unsubWorks = onSnapshot(doc(db, 'pages', 'works'), (snap) => {
      if (snap.exists()) setWorksData(snap.data());
      setLoading(false);
    });

    return () => {
      unsubHome();
      unsubAbout();
      unsubContact();
      unsubWorks();
    };
  }, []);

  const handleSave = async (type: string) => {
    setSaving(true);
    try {
      if (type === 'home') {
        await setDoc(doc(db, 'settings', 'general'), homeData);
      } else {
        const data = type === 'about' ? aboutData : type === 'contact' ? contactData : worksData;
        await setDoc(doc(db, 'pages', type), data);
      }
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (e) {
      console.error(e);
      alert(lang === 'ar' ? 'فشل في حفظ التغييرات' : 'Failed to save changes.');
    } finally {
      setSaving(false);
    }
  };

  const getSubTabLabel = (tab: string) => {
    if (tab === 'Home') return t.pages.home || 'Home';
    if (tab === 'About') return t.pages.about;
    if (tab === 'Contact') return t.pages.contact;
    if (tab === 'Works') return t.pages.works;
    return tab;
  };

  if (loading) return (
    <div className="py-12 flex flex-col items-center">
      <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mb-4" />
      <span className="text-sm font-bold uppercase tracking-[0.3em] text-muted">{t.pages.loading}</span>
    </div>
  );

  return (
    <div className={`space-y-6 ${lang === 'ar' ? 'font-sans' : ''}`}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <PageTabNavigation activeTab={subTab} onTabChange={setSubTab} />

        <button
          onClick={() => handleSave(subTab.toLowerCase() as any)}
          disabled={saving}
          className="bg-accent text-white px-6 py-2.5 text-[12px] font-black uppercase tracking-[0.4em] hover:bg-primary transition-all shadow-xl disabled:opacity-50 flex items-center gap-3 rounded-sm min-w-[240px] justify-center"
        >
          {saving ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : showSuccess ? (
            <CheckCircle2 size={18} />
          ) : (
            <Save size={18} />
          )}
          <span>{saving ? t.pages.sync : showSuccess ? t.pages.live : t.pages.publish.replace('{tab}', getSubTabLabel(subTab))}</span>
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={subTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-6"
        >
          {subTab === 'Home' && (
            <div className="space-y-8">
               <HeroSettingsSection settings={homeData} setSettings={setHomeData} />
               <StatisticsSection settings={homeData} setSettings={setHomeData} />
               <SliderSettingsSection settings={homeData} setSettings={setHomeData} />
               
               {/* Collections Section */}
               <div className={`bg-white p-10 border border-border shadow-sm ${lang === 'ar' ? 'font-sans' : ''}`}>
                 <h3 className="text-xl font-bold tracking-tighter uppercase mb-8 pb-4 border-b border-border">
                   {(t as any).collections?.title || 'Our New Collections'}
                 </h3>
                 <div className="space-y-6">
                   <div>
                     <label className="text-[10px] font-bold uppercase tracking-widest text-muted block mb-2">
                       {(t as any).collections?.headlineLabel || 'Headline'}
                     </label>
                     <input 
                       type="text" 
                       value={homeData.collectionsHeadline || ''} 
                       onChange={(e) => setHomeData({...homeData, collectionsHeadline: e.target.value})} 
                       placeholder={(t as any).collections?.headlinePlaceholder} 
                       className="w-full bg-slate-50 border border-border px-4 py-3 text-xs font-bold focus:outline-none focus:border-accent" 
                     />
                   </div>
                   <div>
                     <label className="text-[10px] font-bold uppercase tracking-widest text-muted block mb-2">
                       {(t as any).collections?.subLabel || 'Subtext'}
                     </label>
                     <input 
                       type="text" 
                       value={homeData.collectionsSubheadline || ''} 
                       onChange={(e) => setHomeData({...homeData, collectionsSubheadline: e.target.value})} 
                       placeholder={(t as any).collections?.subPlaceholder} 
                       className="w-full bg-slate-50 border border-border px-4 py-3 text-xs font-bold focus:outline-none focus:border-accent" 
                     />
                   </div>
                 </div>
               </div>

               {/* Most Recommended Section */}
               <div className={`bg-white p-10 border border-border shadow-sm ${lang === 'ar' ? 'font-sans' : ''}`}>
                 <h3 className="text-xl font-bold tracking-tighter uppercase mb-8 pb-4 border-b border-border">
                   {(t as any).recommended?.title || 'Most Recommended'}
                 </h3>
                 <div className="space-y-6">
                   <div>
                     <label className="text-[10px] font-bold uppercase tracking-widest text-muted block mb-2">
                       {(t as any).recommended?.headlineLabel || 'Headline'}
                     </label>
                     <input 
                       type="text" 
                       value={homeData.recommendedHeadline || ''} 
                       onChange={(e) => setHomeData({...homeData, recommendedHeadline: e.target.value})} 
                       placeholder={(t as any).recommended?.headlinePlaceholder} 
                       className="w-full bg-slate-50 border border-border px-4 py-3 text-xs font-bold focus:outline-none focus:border-accent" 
                     />
                   </div>
                   <div>
                     <label className="text-[10px] font-bold uppercase tracking-widest text-muted block mb-2">
                       {(t as any).recommended?.subLabel || 'Subtext'}
                     </label>
                     <input 
                       type="text" 
                       value={homeData.recommendedSubheadline || ''} 
                       onChange={(e) => setHomeData({...homeData, recommendedSubheadline: e.target.value})} 
                       placeholder={(t as any).recommended?.subPlaceholder} 
                       className="w-full bg-slate-50 border border-border px-4 py-3 text-xs font-bold focus:outline-none focus:border-accent" 
                     />
                   </div>
                 </div>
               </div>
            </div>
          )}
          {subTab === 'About' && (
            <AboutPageSection data={aboutData} setData={setAboutData} />
          )}
          {subTab === 'Contact' && (
            <ContactPageSection data={contactData} setData={setContactData} />
          )}
          {subTab === 'Works' && (
            <WorksPageSection data={worksData} setData={setWorksData} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
