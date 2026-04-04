'use client';

import { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { 
  LogOut,
  LayoutDashboard,
  Briefcase,
  Settings,
  Users,
  FileText,
  Tags,
  Palette,
  ChevronRight,
  ShieldCheck,
  Building2,
  Globe,
  UsersRound
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import DashboardTab from '@/components/admin/DashboardTab';
import ProjectsTab from '@/components/admin/ProjectsTab';
import ClientsTab from '@/components/admin/ClientsTab';
import SettingsTab from '@/components/admin/SettingsTab';
import PagesTab from '@/components/admin/PagesTab';
import TaxonomyTab from '@/components/admin/TaxonomyTab';
import ThemeLab from '@/components/admin/ThemeLab';
import AdminsTab from '@/components/admin/AdminsTab';
import { AdminLanguageProvider, useAdminLanguage } from '@/context/AdminLanguageContext';

interface NavItemProps {
  tab: Tab;
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  icon: any;
  label: string;
  lang: string;
}

const NavItem = ({ tab, activeTab, setActiveTab, icon, label, lang }: NavItemProps) => (
  <button
    onClick={() => setActiveTab(tab)}
    className={`group w-full flex items-center justify-between px-8 py-4.5 transition-all ${
      activeTab === tab 
        ? 'bg-accent text-black font-black' 
        : 'text-white hover:bg-white/10'
    }`}
  >
    <div className="flex items-center gap-4">
      <div className={`transition-transform duration-500 ${activeTab === tab ? 'scale-125' : 'group-hover:scale-125'}`}>
        {icon}
      </div>
      <span className="text-[13px] font-black uppercase tracking-normal">{label}</span>
    </div>
    {activeTab === tab && <div className={`w-1.5 h-1.5 bg-accent rounded-full ${lang === 'ar' ? 'ml-0 mr-auto' : ''}`} />}
  </button>
);

type Tab = 'Dashboard' | 'Works' | 'Taxonomy' | 'Clients' | 'Settings' | 'Pages' | 'Theme' | 'Admins';

function AdminDashboardContent() {
  const [activeTab, setActiveTab] = useState<Tab>('Dashboard');
  const [user, setUser] = useState<any>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();
  const { lang, setLang, t } = useAdminLanguage();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const adminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAIL?.split(',').map(e => e.trim().toLowerCase()) || [];
        const userEmail = user.email?.toLowerCase();

        if (userEmail) {
          if (adminEmails.includes(userEmail)) {
            // Root Admin
            setUser(user);
            return;
          }

          // Check dynamic Firestore Admins
          try {
             const safeId = userEmail.replace(/[^a-zA-Z0-9]/g, '_');
             const adminDoc = await getDoc(doc(db, 'system_admins', safeId));
             if (adminDoc.exists() && adminDoc.data().role === 'admin') {
               setUser(user);
               return;
             }
          } catch(err) {
             console.error('Failed to verify admin status dynamically:', err);
          }
        }
        
        signOut(auth);
        router.push('/login');
      } else {
        router.push('/login');
      }
    });
    return () => unsubscribe();
  }, [router]);

  if (!user) return null;
 
  const renderContent = () => {
    switch (activeTab) {
      case 'Dashboard': return <DashboardTab />;
      case 'Works': return <ProjectsTab />;
      case 'Taxonomy': return <TaxonomyTab />;
      case 'Clients': return <ClientsTab />;
      case 'Settings': return <SettingsTab />;
      case 'Pages': return <PagesTab />;
      case 'Theme': return <ThemeLab />;
      case 'Admins': return <AdminsTab />;
      default: return null;
    }
  };

  const handleTabClick = (tab: Tab) => {
    setActiveTab(tab);
    setIsSidebarOpen(false); // Close sidebar on mobile when a tab is clicked
  };

  return (
    <div className="flex h-screen bg-white overflow-hidden admin-mode font-bold relative">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Sharp Black Architecture */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-black flex flex-col border-r border-black/10 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-accent flex items-center justify-center">
                <ShieldCheck size={18} className="text-black" />
             </div>
             <div>
                <span className="text-xl font-black text-white leading-none block">INSIGHT</span>
                <span className="text-[9px] font-black uppercase text-accent tracking-[0.2em]">{t.sidebar.masterCommand}</span>
             </div>
          </div>
          {/* Close button for mobile */}
          <button 
            className="lg:hidden text-white/50 hover:text-white"
            onClick={() => setIsSidebarOpen(false)}
          >
            <ChevronRight size={24} className="rotate-180" />
          </button>
        </div>
        
        <nav className="flex-1 py-6 overflow-y-auto custom-scrollbar" data-lenis-prevent="true">
          {/* Group: Core Intelligence */}
          <div className="mb-8">
            <div className="px-10 text-[11px] font-black uppercase text-white/40 mb-4 flex items-center gap-2">
               <div className="w-4 h-[1px] bg-accent" /> {t.sidebar.systemsCore}
            </div>
            <NavItem tab="Dashboard" activeTab={activeTab} setActiveTab={handleTabClick} icon={<LayoutDashboard size={18} />} label={t.sidebar.overview} lang={lang} />
            <NavItem tab="Theme" activeTab={activeTab} setActiveTab={handleTabClick} icon={<Palette size={18} />} label={t.sidebar.vibeControl} lang={lang} />
          </div>

          {/* Group: Architectural Assets */}
          <div className="mb-8">
            <div className="px-10 text-[11px] font-black uppercase text-white/40 mb-4 flex items-center gap-2">
               <div className="w-4 h-[1px] bg-accent" /> {t.sidebar.portfolioAssets}
            </div>
            <NavItem tab="Works" activeTab={activeTab} setActiveTab={handleTabClick} icon={<Briefcase size={18} />} label={t.sidebar.globalWorks} lang={lang} />
            <NavItem tab="Taxonomy" activeTab={activeTab} setActiveTab={handleTabClick} icon={<Tags size={18} />} label={t.sidebar.categories} lang={lang} />
          </div>

          {/* Group: User Base */}
          <div className="mb-8">
            <div className="px-10 text-[11px] font-black uppercase text-white/40 mb-4 flex items-center gap-2">
               <div className="w-4 h-[1px] bg-accent" /> {t.sidebar.entities}
            </div>
            <NavItem tab="Clients" activeTab={activeTab} setActiveTab={handleTabClick} icon={<Users size={18} />} label={t.sidebar.clientRegistry} lang={lang} />
          </div>

          {/* Group: Configuration */}
          <div className="mb-8">
            <div className="px-10 text-[11px] font-black uppercase text-white/40 mb-4 flex items-center gap-2">
               <div className="w-4 h-[1px] bg-accent" /> {t.sidebar.internalEngine}
            </div>
            <NavItem tab="Settings" activeTab={activeTab} setActiveTab={handleTabClick} icon={<Settings size={18} />} label={t.sidebar.siteConfig} lang={lang} />
            <NavItem tab="Pages" activeTab={activeTab} setActiveTab={handleTabClick} icon={<FileText size={18} />} label={t.sidebar.pageBuilder} lang={lang} />
            <NavItem tab="Admins" activeTab={activeTab} setActiveTab={handleTabClick} icon={<UsersRound size={18} />} label={t.sidebar.adminRegistry} lang={lang} />
          </div>
        </nav>

        {/* User Profile & Logout */}
        <div className="p-6 border-t border-white/5 bg-white/[0.02]">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-8 h-8 bg-white items-center justify-center flex text-black font-black text-xs shrink-0">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
               <p className="text-[12px] font-black text-white truncate">{user?.email}</p>
               <p className="text-[10px] font-black uppercase text-accent">{t.sidebar.rootAdministrator}</p>
            </div>
          </div>
          <button 
            onClick={() => signOut(auth)}
            className="w-full flex items-center justify-center gap-3 py-3 text-[10px] font-black uppercase bg-white text-black hover:bg-accent transition-all shrink-0"
          >
            <LogOut size={14} />
            <span>{t.sidebar.terminateSession}</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col bg-[#fcfcfc] overflow-hidden">
        <header className="h-16 md:h-20 shrink-0 bg-white border-b border-black/[0.03] flex items-center justify-between px-4 md:px-8 relative z-30">
          <div className="flex items-center gap-3 md:gap-4">
             {/* Hamburger Menu Mobile */}
             <button 
               className="lg:hidden p-2 -ml-2 text-black hover:bg-black/5 rounded-md"
               onClick={() => setIsSidebarOpen(true)}
             >
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
             </button>
             
             <div className="flex items-center gap-2 md:gap-4">
               <div className="hidden md:block w-1 h-3 bg-accent" />
               <h2 className="text-[10px] md:text-[12px] font-black uppercase text-black line-clamp-1 truncate w-24 md:w-auto">
                 {t.tabs[activeTab.toLowerCase() as keyof typeof t.tabs]} {t.header.environment}
               </h2>
             </div>
          </div>
          <div className="flex items-center gap-2 md:gap-4 shrink-0">
            <a 
              href="/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-3 px-5 py-2.5 bg-accent text-black text-[11px] font-black uppercase hover:bg-black hover:text-white transition-all group"
            >
              <Globe size={14} className="group-hover:rotate-12 transition-transform duration-500" />
              <span>{t.header.viewSite || 'View Site'}</span>
            </a>
            <button 
              onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
              className="flex items-center gap-2 md:gap-3 px-3 md:px-5 py-2 md:py-2.5 bg-black text-white text-[9px] md:text-[11px] font-black uppercase hover:bg-accent transition-all group shrink-0"
            >
              <Globe size={14} className="group-hover:scale-125 transition-transform duration-500 hidden md:block" />
              <span>{lang === 'en' ? 'عربي' : 'EN'}</span>
            </button>
            <div className="hidden md:flex items-center gap-2">
               <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
               <span className="text-[10px] font-black uppercase text-black/40 tracking-widest">{t.header.activeServer}</span>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto" data-lenis-prevent="true">
          <main className="p-4 sm:p-6 md:p-8 w-full max-w-[1400px] mx-auto min-h-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="pb-24 lg:pb-0"
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <AdminLanguageProvider>
      <AdminDashboardContent />
    </AdminLanguageProvider>
  );
}
