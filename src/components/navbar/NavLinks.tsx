'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const SPRING = { type: "spring", stiffness: 400, damping: 30 } as const;

interface NavLinksProps {
  links: { name: string; href: string }[];
  pathname: string;
  hoveredLink: string | null;
  setHoveredLink: (name: string | null) => void;
}

export default function NavLinks({ links, pathname, hoveredLink, setHoveredLink }: NavLinksProps) {
  return (
    <nav 
      onMouseLeave={() => setHoveredLink(null)}
      className="relative flex items-center gap-2"
    >
      {links.map((link) => {
        const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
        return (
          <Link
            key={link.name}
            href={link.href}
            onMouseEnter={() => setHoveredLink(link.name)}
            className="relative h-10 px-4 flex items-center justify-center group"
          >
            <span 
              className={`relative z-10 text-[11px] font-black uppercase tracking-[0.15em] transition-all duration-300 text-center ${
                (hoveredLink ? hoveredLink === link.name : isActive)
                  ? 'text-accent' 
                  : 'text-foreground/60 hover:text-foreground'
              }`}
            >
              {link.name}
            </span>
            
            {(hoveredLink === link.name || (isActive && !hoveredLink)) && (
              <motion.div
                layoutId="nav-indicator"
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent z-0"
                transition={SPRING}
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
