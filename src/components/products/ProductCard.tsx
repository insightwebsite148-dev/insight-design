'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { MessageCircle, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { getOptimizedUrl } from '@/lib/cloudinary';

interface ProductCardProps {
  product: any;
  index?: number;
  whatsappNumber?: string;
}

export default function ProductCard({ product, index = 0, whatsappNumber = '' }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group flex flex-col gap-4 relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <Link href={`/portfolio/${product.id}`} className="relative aspect-[4/5] md:aspect-square w-full rounded-2xl overflow-hidden bg-secondary block">
        <Image
          src={getOptimizedUrl(product.images?.[0] || product.image || '/placeholder.png', 800)}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
          {product.category && (
            <span className="text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-none shadow-sm bg-accent/80 text-white backdrop-blur-md">
              {product.category}
            </span>
          )}
          {product.isNew && (
            <span className="bg-white text-primary text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-sm">
              New
            </span>
          )}
        </div>
      </Link>

      {/* Product Details */}
      <div className="flex flex-col gap-3 px-2">
        <a 
          href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('أهلاً، أود الاستفسار عن خدماتكم.')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3 bg-accent text-white flex items-center justify-center gap-2 rounded-xl font-bold hover:bg-accent/90 transition-all uppercase tracking-widest text-[10px] shadow-sm hover:shadow-md active:scale-95"
        >
          <MessageCircle size={16} />
          تواصل معنا
        </a>
        <div className="flex justify-between items-center">
          {/* Category removed as it is now in the badge slot */}
          <div />
          {/* Color Dots */}
          <div className="flex items-center gap-1.5">
            {product.colors && product.colors.map((color: string, i: number) => (
              <span
                key={i}
                className="w-3 h-3 rounded-full border border-border/50"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
