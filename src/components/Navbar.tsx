'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import AuthStatus from './AuthStatus';
import BrandLogo from './navbar/BrandLogo';
import NavLinks from './navbar/NavLinks';
import MobileMenu from './navbar/MobileMenu';
import { EditModeToggle } from './EditModeControls';
import { useSettings } from '@/context/SettingsContext';

import { DEFAULT_SETTINGS } from '@/lib/constants';

const NAV_LINKS = [
  { name: 'Home', href: '/' },
  { name: 'Our Works', href: '/portfolio' },
  { name: 'About us', href: '/about' },
  { name: 'Contact us', href: '/contact' }
];

export default function Navbar({ initialSettings }: { initialSettings?: Record<string, string | number | boolean | null | undefined | object> }) {
  const { settings: globalSettings } = useSettings();
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [prevPath, setPrevPath] = useState<string | null>(null);
  const activeSettings = globalSettings && Object.keys(globalSettings).length > 0 ? globalSettings : initialSettings || {};
  
  const branding = {
    name: activeSettings.brandName || DEFAULT_SETTINGS.brandName,
    slogan: activeSettings.brandSlogan || DEFAULT_SETTINGS.brandSlogan,
    logo: activeSettings.siteLogo || DEFAULT_SETTINGS.siteLogo,
    siteLogoSize: Number(activeSettings.siteLogoSize) || 40
  };
  
  const pathname = usePathname();

  if (pathname !== prevPath) {
    setIsMobileMenuOpen(false);
    setPrevPath(pathname);
  }

  if (pathname?.startsWith('/admin')) return null;

  return (
    <div className="sticky top-0 left-0 right-0 z-[100] bg-white border-b border-border shadow-sm">
      <nav className="w-full py-4">
        <div className="max-w-[1800px] mx-auto px-6 md:px-12 lg:px-20 flex justify-between items-center relative z-10">
          <BrandLogo 
            name={branding.name} 
            slogan={branding.slogan} 
            logo={branding.logo} 
            logoSize={branding.siteLogoSize}
          />

          {/* Desktop Navigation — Flex Centered */}
          <div className="hidden xl:flex flex-1 justify-center z-10 px-4">
            <div className="bg-slate-50 px-6 py-2 rounded-full border border-border/50">
              <NavLinks
                links={NAV_LINKS}
                pathname={pathname}
                hoveredLink={hoveredLink}
                setHoveredLink={setHoveredLink}
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="hidden xl:flex items-center gap-4 relative z-20 shrink-0">
              <EditModeToggle />
              <AuthStatus />
              <Link href="/contact">
                <button
                  className="group relative h-10 px-6 overflow-hidden rounded-full bg-black text-white flex items-center justify-center gap-2 transition-all duration-300"
                >
                  <span className="relative z-10 text-[12px] font-bold uppercase tracking-[0.15em]">Consultation</span>
                  <ArrowRight size={14} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                  <div className="absolute inset-0 bg-accent translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                </button>
              </Link>
          </div>

          {/* Mobile Toggle */}
          <div className="flex items-center gap-4 xl:hidden">
            <EditModeToggle />
            <AuthStatus />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="w-12 h-12 rounded-full bg-black/5 flex flex-col items-center justify-center gap-1.5 border border-black/10"
            >
              <span className={`w-5 h-0.5 bg-black transition-all duration-500 ${isMobileMenuOpen ? 'rotate-45 translate-y-2 translate-x-1' : ''}`} />
              <span className={`w-3 h-0.5 self-start ml-3.5 bg-accent transition-all duration-500 ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
              <span className={`w-5 h-0.5 bg-black transition-all duration-500 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2 translate-x-1' : ''}`} />
            </button>
          </div>
        </div>
      </nav>

      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} links={NAV_LINKS} />
    </div>
  );
}
