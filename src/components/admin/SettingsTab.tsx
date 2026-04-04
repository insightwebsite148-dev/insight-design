'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import {
  collection,
  getDocs,
  query,
  doc,
  getDoc,
  updateDoc,
  setDoc
} from 'firebase/firestore';

import AdminAccordion from './AdminAccordion';
import {
  ShieldCheck,
  Layout,
  MessageSquare,
  BarChart3,
  MousePointer2,
  Maximize,
  PenTool,
  Image as ImageIcon,
  Globe,
  Building2,
  TrendingUp,
  Zap,
  Target,
  Activity,
  Camera,
  Save,
  Loader2
} from 'lucide-react';

// Modular Sections
import BrandingSection from './settings/BrandingSection';
import ContactSection from './settings/ContactSection';
import StatisticsSection from './settings/StatisticsSection';
import SliderSettingsSection from './settings/SliderSettingsSection';
import HeroSettingsSection from './settings/HeroSettingsSection';
import WhatsAppSettingsSection from './settings/WhatsAppSettingsSection';
import CursorLab from './settings/CursorLab';
import LayoutDimensions from './settings/LayoutDimensions';
import SchemaSection from './settings/SchemaSection';
import OrganizationSection from './settings/OrganizationSection';

import { useAdminLanguage } from '@/context/AdminLanguageContext';

/* ── Reusable pixel input row ────────────────────────── */
function PixelField({ label, placeholder, value, onChange, tip, lang }: {
  label: string; placeholder: string; value: string;
  onChange: (v: string) => void; tip: string; lang: string;
}) {
  const isRtl = lang === 'ar';
  return (
    <div className="space-y-2">
      <label className={`text-[13px] font-bold text-gray-800 block ${isRtl ? 'text-right' : ''}`}>
        {label}
      </label>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full border border-gray-200 bg-gray-50/50 rounded-lg px-4 py-3.5 text-sm font-semibold text-gray-900 placeholder:text-gray-400 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all ${isRtl ? 'text-right' : ''}`}
      />
      <p className={`text-[11px] font-medium text-gray-400 leading-relaxed ${isRtl ? 'text-right' : ''}`}>
        {tip}
      </p>
    </div>
  );
}

export default function SettingsTab() {
  const { lang, t } = useAdminLanguage();
  const sT = t.settings;
  const mT = t.marketing;

  const [settings, setSettings] = useState({
    brandName: '',
    brandSlogan: '',
    siteLogo: '',
    siteFavicon: '',
    address: '',
    phone: '',
    email: '',
    workingHours: '',
    mapLink: '',
    heroHeadline: '',
    heroSubheadline: '',
    heroButton1: '',
    heroButton2: '',
    heroImage: '',
    mapImage: '',
    mapEmbedUrl: '',
    stats1Value: '',
    stats1Label: '',
    stats2Value: '',
    stats2Label: '',
    stats3Value: '',
    stats3Label: '',
    stats4Value: '',
    stats4Label: '',
    sliderHeadline: '',
    sliderSubheadline: '',
    footerDescription: '',
    whatsappNumber: '',
    whatsappMessage: 'I am interested in starting a project with Insight.',
    // Typography
    heroFontSize: '',
    sectionFontSize: '',
    bodyFontSize: '',
    headlineFontSize: '',
    headlineFont: 'Montserrat',
    headlineWeight: '700',
    bodyFont: 'Montserrat',
    bodyWeight: '400',
    ctaHeadline: '',
    ctaSubheadline: '',
    ctaButton: '',
    // Image Sizes
    heroHeight: '',
    sliderHeight: '',
    clientLogoSize: '',
    // Advanced Cursor (Ultima Edition)
    cursorEnabled: true,
    cursorInnerColor: '#f25c27',
    cursorOuterColor: '#f25c27',
    cursorInnerSize: '6',
    cursorOuterSize: '32',
    cursorHoverScale: '2.5',
    cursorStiff: '250',
    cursorDamp: '25',
    cursorBlend: 'difference',
    cursorShape: 'circle',
    cursorBorderWidth: '1',
    cursorInnerOpacity: '1',
    cursorOuterOpacity: '0.4',
    typingSpeed: 80,
    typingPause: 3000,
    schema: {} as any,
    organization: {} as any,
    metaPixelId: '',
    ga4Id: '',
    gadsConversionId: '',
    gadsConversionLabel: '',
    tiktokPixelId: '',
    snapchatPixelId: ''
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const q = query(collection(db, 'settings'));
        const docSnap = await getDocs(q);
        const generalSettings = docSnap.docs.find(d => d.id === 'general');

        if (generalSettings) {
          setSettings(prev => ({ ...prev, ...generalSettings.data() }));
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const settingsRef = doc(db, 'settings', 'general');
      const docExists = await getDoc(settingsRef);
      if (docExists.exists()) {
        await updateDoc(settingsRef, settings);
      } else {
        await setDoc(settingsRef, settings);
      }
      alert(sT.success);
    } catch (error) {
      console.error('Error updating settings:', error);
      alert(sT.failed);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64 gap-3">
      <Loader2 size={20} className="animate-spin text-accent" />
      <span className="text-sm font-semibold text-gray-400">{sT.loading}</span>
    </div>
  );

  return (
    <div className={`max-w-5xl mx-auto pb-20 ${lang === 'ar' ? 'font-sans' : ''}`}>
      {/* ── Header ────────────────────────────── */}
      <div className={`flex justify-between items-center mb-12 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
        <div className={lang === 'ar' ? 'text-right' : ''}>
          <h2 className="text-3xl font-black uppercase tracking-tight text-gray-900">{sT.title}</h2>
          <p className="text-sm font-semibold text-gray-400 mt-1.5">{sT.version}</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2.5 bg-black text-white px-7 py-3 rounded-xl font-bold uppercase tracking-wide text-[12px] hover:bg-accent hover:text-black transition-all duration-300 shadow-lg shadow-black/15 active:scale-[0.97] disabled:opacity-50"
        >
          {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
          {saving ? sT.syncing : sT.publishUpdate}
        </button>
      </div>

      <div className="space-y-14">

        {/* ═══════════════════════════════════════ */}
        {/* GROUP: BRAND IDENTITY                   */}
        {/* ═══════════════════════════════════════ */}
        <section>
          <SectionHeader icon={<ShieldCheck size={16} />} label={sT.brandIdentity} lang={lang} />
          <div className="grid grid-cols-1 gap-3">
            <AdminAccordion title={sT.coreBranding} icon={<PenTool size={15} />}>
              <BrandingSection settings={settings} setSettings={setSettings} />
            </AdminAccordion>
            <AdminAccordion title={sT.contactReach} icon={<MessageSquare size={15} />}>
              <ContactSection settings={settings} setSettings={setSettings} />
            </AdminAccordion>
          </div>
        </section>

        {/* ═══════════════════════════════════════ */}
        {/* GROUP: HOMEPAGE CONTENT                 */}
        {/* ═══════════════════════════════════════ */}
        <section>
          <SectionHeader icon={<Layout size={16} />} label={sT.homepageExp} lang={lang} />
          <div className="grid grid-cols-1 gap-3">
            <AdminAccordion title={sT.heroMasterpiece} icon={<ImageIcon size={15} />}>
              <HeroSettingsSection settings={settings} setSettings={setSettings} />
            </AdminAccordion>
            <AdminAccordion title={sT.featuredSlider} icon={<Layout size={15} />}>
              <SliderSettingsSection settings={settings} setSettings={setSettings} />
            </AdminAccordion>
            <AdminAccordion title={sT.performanceStats} icon={<BarChart3 size={15} />}>
              <StatisticsSection settings={settings} setSettings={setSettings} />
            </AdminAccordion>
          </div>
        </section>

        {/* ═══════════════════════════════════════ */}
        {/* GROUP: SEO & ALGORITHM                  */}
        {/* ═══════════════════════════════════════ */}
        <section>
          <SectionHeader icon={<Globe size={16} />} label={sT.seoGrowth} lang={lang} />
          <div className="grid grid-cols-1 gap-3">
            <AdminAccordion title={sT.websiteSchema} icon={<Globe size={15} />}>
              <SchemaSection settings={settings} setSettings={setSettings} />
            </AdminAccordion>
            <AdminAccordion title={sT.orgSchema} icon={<Building2 size={15} />}>
              <OrganizationSection settings={settings} setSettings={setSettings} />
            </AdminAccordion>
          </div>
        </section>

        {/* ═══════════════════════════════════════ */}
        {/* GROUP: ADVANCED INTERACTIONS             */}
        {/* ═══════════════════════════════════════ */}
        <section>
          <SectionHeader icon={<MousePointer2 size={16} />} label={sT.uiLab} lang={lang} />
          <div className="grid grid-cols-1 gap-3">
            <AdminAccordion title={sT.interactiveCursor} icon={<MousePointer2 size={15} />}>
              <CursorLab settings={settings} setSettings={setSettings} />
            </AdminAccordion>
          </div>
        </section>

        {/* ═══════════════════════════════════════ */}
        {/* GROUP: ANALYTICS & MARKETING             */}
        {/* ═══════════════════════════════════════ */}
        <section>
          <SectionHeader icon={<TrendingUp size={16} />} label={sT.marketingAnalytics} lang={lang} />
          <div className="grid grid-cols-1 gap-3">

            {/* Meta Pixel */}
            <AdminAccordion title={sT.metaPixel} icon={<Target size={15} />}>
              <div className="space-y-5">
                <PixelField
                  label={mT.pixelId} placeholder={mT.pixelPlaceholder}
                  value={settings.metaPixelId || ''} tip={mT.pixelTip} lang={lang}
                  onChange={(v) => setSettings({ ...settings, metaPixelId: v })}
                />
              </div>
            </AdminAccordion>

            {/* Google Analytics 4 */}
            <AdminAccordion title={sT.googleAnalytics} icon={<BarChart3 size={15} />}>
              <div className="space-y-5">
                <PixelField
                  label={mT.ga4Id} placeholder={mT.ga4Placeholder}
                  value={settings.ga4Id || ''} tip={mT.ga4Tip} lang={lang}
                  onChange={(v) => setSettings({ ...settings, ga4Id: v })}
                />
              </div>
            </AdminAccordion>

            {/* Google Ads Conversion */}
            <AdminAccordion title={sT.googleAds} icon={<Zap size={15} />}>
              <div className="space-y-6">
                <PixelField
                  label={mT.gadsId} placeholder={mT.gadsPlaceholder}
                  value={settings.gadsConversionId || ''} tip={mT.gadsTip} lang={lang}
                  onChange={(v) => setSettings({ ...settings, gadsConversionId: v })}
                />
                <div className="border-t border-gray-100 pt-5">
                  <PixelField
                    label={mT.gadsLabel} placeholder={mT.gadsLabelPlaceholder}
                    value={settings.gadsConversionLabel || ''} tip={mT.gadsLabelTip} lang={lang}
                    onChange={(v) => setSettings({ ...settings, gadsConversionLabel: v })}
                  />
                </div>
              </div>
            </AdminAccordion>

            {/* TikTok Pixel */}
            <AdminAccordion title={sT.tiktokPixel} icon={<Activity size={15} />}>
              <div className="space-y-5">
                <PixelField
                  label={mT.tiktokId} placeholder={mT.tiktokPlaceholder}
                  value={settings.tiktokPixelId || ''} tip={mT.tiktokTip} lang={lang}
                  onChange={(v) => setSettings({ ...settings, tiktokPixelId: v })}
                />
              </div>
            </AdminAccordion>

            {/* Snapchat Pixel */}
            <AdminAccordion title={sT.snapchatPixel} icon={<Camera size={15} />}>
              <div className="space-y-5">
                <PixelField
                  label={mT.snapId} placeholder={mT.snapPlaceholder}
                  value={settings.snapchatPixelId || ''} tip={mT.snapTip} lang={lang}
                  onChange={(v) => setSettings({ ...settings, snapchatPixelId: v })}
                />
              </div>
            </AdminAccordion>

          </div>
        </section>

        {/* ═══════════════════════════════════════ */}
        {/* GROUP: TECHNICAL LAYOUT                  */}
        {/* ═══════════════════════════════════════ */}
        <section>
          <SectionHeader icon={<Maximize size={16} />} label={sT.archSystem} lang={lang} />
          <div className="grid grid-cols-1 gap-3">
            <AdminAccordion title={sT.layoutDimensions} icon={<Maximize size={15} />}>
              <LayoutDimensions settings={settings} setSettings={setSettings} />
            </AdminAccordion>
          </div>
        </section>
      </div>
    </div>
  );
}

/* ── Section header component ──────────────────────── */
function SectionHeader({ icon, label, lang }: { icon: React.ReactNode; label: string; lang: string }) {
  return (
    <div className={`flex items-center gap-3 mb-5 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
      <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
        {icon}
      </div>
      <span className="text-sm font-bold uppercase tracking-wide text-gray-600">{label}</span>
      <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent" />
    </div>
  );
}
