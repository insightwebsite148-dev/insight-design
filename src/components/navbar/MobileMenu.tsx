'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { X } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  links: { name: string; href: string }[];
}

export default function MobileMenu({ isOpen, onClose, links }: MobileMenuProps) {
  const { settings } = useSettings();
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[85] xl:hidden pointer-events-auto"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-y-0 right-0 z-[90] w-full max-w-sm bg-white border-l border-border/50 xl:hidden h-screen flex flex-col pointer-events-auto shadow-2xl"
          >
          <div className="absolute top-8 right-8 z-10">
            <button onClick={onClose} className="p-2.5 bg-black/5 rounded-full text-primary hover:bg-accent hover:text-white transition-all duration-300">
              <X size={20} />
            </button>
          </div>
          <div className="mt-24 px-8 space-y-12 flex-1 overflow-y-auto pb-12">
            <div className="space-y-4">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-muted">Navigation</span>
              <nav className="flex flex-col gap-4 mt-8">
                {links.map((link, i) => (
                  <motion.div
                    key={link.name}
                    initial={{ x: 30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 * i + 0.2, duration: 0.6 }}
                  >
                    <Link 
                      href={link.href}
                      className="text-4xl font-semibold tracking-tight text-primary hover:text-accent transition-colors duration-300 block"
                      onClick={onClose}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ x: 30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 * links.length + 0.2, duration: 0.6 }}
                  className="mt-4"
                >
                  <Link
                    href="/register"
                    className="inline-block bg-primary text-background px-8 py-4 text-[11px] font-black uppercase tracking-[0.3em] rounded-sm active:scale-95 transition-all"
                    onClick={onClose}
                  >
                    Partner With Us
                  </Link>
                </motion.div>
              </nav>
            </div>

            <div className="space-y-6 pt-12 border-t border-border/50">
              <div className="space-y-2">
                <span className="text-[11px] font-semibold uppercase tracking-widest text-muted">Contact</span>
                <p className="text-sm text-primary/80 font-medium uppercase break-all">{settings?.email || 'OFFICE@INSIGHTDESIGN.COM'}</p>
                <p className="text-sm text-primary/80 font-medium">{settings?.phone || '+971 4 123 4567'}</p>
              </div>
            </div>
          </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
