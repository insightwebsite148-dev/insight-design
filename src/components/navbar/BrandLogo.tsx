'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import EditableWrapper from '../EditableWrapper';

interface BrandLogoProps {
  name: string;
  slogan: string;
  logo: string;
  logoSize?: number;
}

export default function BrandLogo({ name, slogan, logo, logoSize = 40 }: BrandLogoProps) {
  return (
    <div className="relative group flex items-center gap-4">
      <Link href="/" className="flex items-center gap-4">
        {logo && logo.trim() !== '' ? (
          <div className="flex flex-col items-start">
            <EditableWrapper
              collection="settings"
              documentId="general"
              field="siteLogo"
              value={logo}
              type="image"
            >
              <img 
                src={logo} 
                alt={name} 
                style={{ height: `${logoSize}px`, maxHeight: '200px' }}
                className="w-auto object-contain transition-all duration-700 group-hover:scale-105" 
              />
            </EditableWrapper>
            {slogan && (
              <EditableWrapper
                collection="settings"
                documentId="general"
                field="brandSlogan"
                value={slogan}
                type="text"
              >
                <p className="text-[6px] lg:text-[7px] font-black tracking-normal text-black uppercase mt-2 border-t border-black/10 pt-1 w-full text-center">
                  {slogan}
                </p>
              </EditableWrapper>
            )}
          </div>
        ) : (
          <div className="flex flex-col">
            <EditableWrapper
              collection="settings"
              documentId="general"
              field="brandName"
              value={name}
              type="text"
            >
              <span className="font-serif text-2xl lg:text-3xl font-light tracking-tight text-primary group-hover:text-accent transition-colors duration-700 uppercase">
                {name}
              </span>
            </EditableWrapper>
            <div className="h-[1px] w-full bg-black/10 group-hover:bg-accent transition-all duration-700" />
            <EditableWrapper
              collection="settings"
              documentId="general"
              field="brandSlogan"
              value={slogan}
              type="text"
            >
              <p className="text-[6px] lg:text-[7px] font-black tracking-normal text-accent uppercase mt-1">
                {slogan}
              </p>
            </EditableWrapper>
          </div>
        )}
      </Link>
    </div>
  );
}
