'use client';
 
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  Instagram, 
  Facebook, 
  Phone,
  Mail,
  MapPin
} from 'lucide-react';
import EditableWrapper from './EditableWrapper';
import { useSettings } from '@/context/SettingsContext';

const TikTokIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.75a8.18 8.18 0 004.76 1.52V6.84a4.84 4.84 0 01-1-.15z"/>
  </svg>
);
 
interface FooterProps {
  initialSettings?: any;
}
 
export default function Footer({ initialSettings }: FooterProps) {
  const { settings: globalSettings, categories } = useSettings();
  const pathname = usePathname();
  
  if (pathname?.startsWith('/admin')) return null;
 
  const settings = globalSettings || initialSettings || {};
  const schema = settings.schema || {};
 
  const socialLinks = [
    { key: 'facebook', icon: <Facebook size={18} />, url: schema.facebook },
    { key: 'instagram', icon: <Instagram size={18} />, url: schema.instagram },
    { key: 'tiktok', icon: <TikTokIcon size={18} />, url: schema.tiktok },
  ].filter(link => link.url);
 
  return (
    <footer className="bg-[#0A0A0A] text-white pt-32 pb-16 px-8 border-t border-accent/10">
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-24 mb-32">
        {/* Brand Column */}
        <div className="flex flex-col space-y-10">
          <Link href="/" className="flex items-center gap-3 group">
            {settings.siteLogo ? (
              <EditableWrapper
                collection="settings"
                documentId="general"
                field="siteLogo"
                value={settings.siteLogo}
                type="image"
              >
                <img src={settings.siteLogo} alt={settings.brandName} className="h-12 w-auto object-contain transition-transform duration-700 group-hover:scale-105" />
              </EditableWrapper>
            ) : (
              <EditableWrapper
                collection="settings"
                documentId="general"
                field="brandName"
                value={settings.brandName || 'INSIGHT'}
                type="text"
              >
                <span className="text-3xl font-black tracking-tight text-white uppercase">
                  {settings.brandName || 'INSIGHT'}
                </span>
              </EditableWrapper>
            )}
          </Link>
          <EditableWrapper
            collection="settings"
            documentId="general"
            field="footerDescription"
            value={settings.footerDescription || 'Crafting breathtaking architectural masterpieces and ultra-luxurious interiors for the world\'s most discerning clients.'}
            type="text"
          >
            <p className="text-white/50 text-base font-light leading-relaxed max-w-sm">
              {settings.footerDescription || 'Crafting breathtaking architectural masterpieces and ultra-luxurious interiors for the world\'s most discerning clients.'}
            </p>
          </EditableWrapper>
          
          {/* Contact Details */}
          <div className="space-y-6 pt-4">
            <div className="flex items-start gap-4 group">
              <MapPin size={16} className="text-accent shrink-0 mt-1" />
              <EditableWrapper
                collection="settings"
                documentId="general"
                field="address"
                value={settings.address || 'LUXURY TOWER, DUBAI, UAE'}
                type="text"
              >
                <span className="text-sm text-white/70 font-light hover:text-white transition-colors uppercase">{settings.address || 'LUXURY TOWER, DUBAI, UAE'}</span>
              </EditableWrapper>
            </div>
            
            {settings.phone && (
              <div className="flex items-start gap-4 group">
                <Phone size={16} className="text-accent shrink-0 mt-1" />
                <EditableWrapper
                  collection="settings"
                  documentId="general"
                  field="phone"
                  value={settings.phone}
                  type="text"
                >
                  <span className="text-sm text-white/70 font-light hover:text-white transition-colors">{settings.phone}</span>
                </EditableWrapper>
              </div>
            )}
 
            <div className="flex items-start gap-4 group">
              <Mail size={16} className="text-accent shrink-0 mt-1" />
              <EditableWrapper
                collection="settings"
                documentId="general"
                field="email"
                value={settings.email || 'OFFICE@INSIGHTDESIGN.COM'}
                type="text"
              >
                <span className="text-sm text-white/70 font-light hover:text-white transition-colors uppercase">{settings.email || 'OFFICE@INSIGHTDESIGN.COM'}</span>
              </EditableWrapper>
            </div>
          </div>
        </div>
 
        {/* Studio Navigation */}
        <div>
          <h4 className="text-[12px] font-bold uppercase tracking-[0.3em] mb-12 text-accent">Studio Navigation</h4>
          <ul className="space-y-6 text-sm">
            <li><Link href="/" className="text-white/50 hover:text-white transition-all duration-500 luxury-underline uppercase">Architecture</Link></li>
            <li><Link href="/about" className="text-white/50 hover:text-white transition-all duration-500 luxury-underline uppercase">The Studio</Link></li>
            <li><Link href="/portfolio" className="text-white/50 hover:text-white transition-all duration-500 luxury-underline uppercase">Portfolio</Link></li>
            <li><Link href="/contact" className="text-white/50 hover:text-white transition-all duration-500 luxury-underline uppercase">Contact</Link></li>
          </ul>
        </div>
 
        {/* Expertise / Services */}
        <div>
          <h4 className="text-[12px] font-bold uppercase tracking-[0.3em] mb-12 text-accent">Our Expertise</h4>
          <ul className="space-y-4 text-sm">
            {categories.length > 0 ? (
              (() => {
                const roots = categories.filter((c: any) => !c.parentId);
                return roots.map((root: any) => {
                  const children = categories.filter((c: any) => c.parentId === root.id);
                  return (
                    <li key={root.id}>
                      <Link href={`/portfolio?category=${root.name}`} className="text-white/80 hover:text-white transition-all duration-500 luxury-underline uppercase font-bold text-xs tracking-wider">
                        {root.name}
                      </Link>
                      {children.length > 0 && (
                        <ul className="mt-2 ml-4 space-y-2">
                          {children.map((child: any) => (
                            <li key={child.id} className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-accent/40 shrink-0" />
                              <Link href={`/portfolio?category=${child.name}`} className="text-white/40 hover:text-white transition-all duration-500 text-xs uppercase">
                                {child.name}
                                {child.badge === 'جديد' && <span className="ml-2 text-[7px] bg-emerald-500 text-white px-1 py-0.5 rounded-full">NEW</span>}
                                {child.badge === 'قريباً' && <span className="ml-2 text-[7px] bg-amber-500 text-white px-1 py-0.5 rounded-full">SOON</span>}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  );
                });
              })()
            ) : (
              ['مقاولات', 'تشطيبات'].map((item) => (
                <li key={item}>
                  <Link href="/portfolio" className="text-white/50 hover:text-white transition-all duration-500 luxury-underline uppercase">
                    {item}
                  </Link>
                </li>
              ))
            )}
          </ul>
        </div>
 
        {/* Social Presence */}
        <div className="space-y-12">
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.3em] mb-8 text-accent">Social Presence</h4>
            <div className="flex gap-4">
              {socialLinks.length > 0 ? (
                socialLinks.map((link) => (
                  <a 
                    key={link.key} 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-10 h-10 border border-white/10 flex items-center justify-center text-white/40 hover:text-accent hover:border-accent transition-all duration-500"
                  >
                    {link.icon}
                  </a>
                ))
              ) : (
                <p className="text-[11px] text-white/20 uppercase tracking-widest italic">Follow our journey</p>
              )}
            </div>
          </div>
 
          <div className="pt-8 border-t border-white/5">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.3em] mb-8 text-accent italic">Quick Inquiry</h4>
            <form className="flex flex-col gap-6" onSubmit={(e) => {
              e.preventDefault();
              alert('Connection Initialized. Our team will reach out shortly.');
            }}>
              <div className="relative group">
                <input 
                  type="email" 
                  placeholder="IDENTITY@OFFICE.COM" 
                  required
                  className="bg-transparent border-b border-white/10 text-white px-4 py-4 text-[11px] font-bold tracking-[0.2em] focus:border-accent focus:outline-none transition-all w-full placeholder:text-white/20 uppercase"
                />
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-accent scale-x-0 group-focus-within:scale-x-100 transition-transform duration-700 origin-left" />
              </div>
              <button 
                type="submit"
                className="relative h-14 w-full bg-white text-black text-[12px] font-bold uppercase tracking-[0.3em] overflow-hidden group shadow-2xl"
              >
                <div className="absolute inset-0 bg-accent -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-[0.16,1,0.3,1]" />
                <span className="relative z-10 group-hover:text-white group-hover:tracking-[0.4em] transition-all duration-700">Initialize</span>
              </button>
            </form>
          </div>
        </div>
      </div>
 
      <div className="max-w-[1600px] mx-auto pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-[11px] font-medium tracking-[0.2em] text-white/30 gap-8">
        <span className="uppercase font-bold">&copy; {new Date().getFullYear()} {settings.brandName || 'INSIGHT'} &mdash; Architectural Excellence</span>
        <div className="flex space-x-12">
          <Link href="/privacy" className="hover:text-accent transition-all duration-500 uppercase">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-accent transition-all duration-500 uppercase">Terms</Link>
        </div>
      </div>
    </footer>
  );
}
