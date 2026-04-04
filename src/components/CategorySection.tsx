'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Layers, Sparkles, Clock } from 'lucide-react';
import { getOptimizedUrl } from '@/lib/cloudinary';
import { useSettings } from '@/context/SettingsContext';

// Build tree from flat categories
function buildTree(items: any[]): any[] {
  const map: Record<string, any> = {};
  const roots: any[] = [];
  items.forEach(item => { map[item.id] = { ...item, children: [] }; });
  items.forEach(item => {
    if (item.parentId && map[item.parentId]) {
      map[item.parentId].children.push(map[item.id]);
    } else {
      roots.push(map[item.id]);
    }
  });
  return roots;
}

// Collect all descendant names for project matching
function getAllDescendantNames(node: any): string[] {
  let names = [node.name?.toString().trim().toUpperCase()];
  if (node.children) {
    for (const child of node.children) {
      names = [...names, ...getAllDescendantNames(child)];
    }
  }
  return names;
}

export default function CategorySection() {
  const { categories, projects } = useSettings();
  if (!categories || categories.length === 0 || !projects) return null;

  const tree = buildTree(categories);

  // All project images as fallback pool
  const allImages = projects
    .map((p: any) => p.image || (p.images && p.images[0]))
    .filter(Boolean);

  return (
    <section className="bg-[#060606] py-32 px-6 overflow-hidden relative">
      {/* Subtle dot pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'radial-gradient(rgba(255,255,255,.4) 1px, transparent 1px)',
        backgroundSize: '32px 32px'
      }} />
      
      <div className="max-w-[1400px] mx-auto w-full relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-10">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-4 mb-5"
            >
              <span className="h-[1px] w-12 bg-accent" />
              <span className="text-[12px] font-bold uppercase tracking-[0.5em] text-accent">
                Our Services
              </span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-[0.9] text-white">
                Browse<br />
                <span className="text-accent">Collections</span>
              </h2>
            </motion.div>
          </div>
          <Link href="/portfolio" className="group">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative h-14 px-12 overflow-hidden flex items-center justify-center gap-4 text-[11px] font-bold uppercase tracking-[0.3em] border border-white/20 text-white/80 hover:text-white transition-all duration-700"
            >
              <div className="absolute inset-0 bg-accent -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-[0.16,1,0.3,1]" />
              <span className="relative z-10">View All Works</span>
              <ArrowRight size={16} className="relative z-10 group-hover:translate-x-2 transition-transform duration-700" />
            </motion.div>
          </Link>
        </div>

        {/* Root Categories */}
        <div className="space-y-6">
          {tree.map((rootCat, rootIndex) => {
            // Match projects to this root + all descendants
            const allNames = getAllDescendantNames(rootCat);
            const rootProjects = projects.filter((p: any) => {
              const pCat = p.category?.toString().trim().toUpperCase();
              return allNames.includes(pCat);
            });
            
            // Pick image: matched project > recommended > any project (fallback)
            const heroProject = rootProjects.find((p: any) => p.isRecommended) || rootProjects[0];
            let heroImage = heroProject?.image || (heroProject?.images && heroProject.images[0]);
            
            // FALLBACK: use any project image if nothing matched
            if (!heroImage && allImages.length > 0) {
              heroImage = allImages[rootIndex % allImages.length];
            }

            const hasChildren = rootCat.children && rootCat.children.length > 0;

            return (
              <motion.div
                key={rootCat.id}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 1, delay: rootIndex * 0.12, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className={`grid grid-cols-1 lg:grid-cols-5 gap-0 group relative overflow-hidden rounded-sm border border-white/[0.06] hover:border-accent/20 transition-colors duration-700`}>
                  
                  {/* Image Side — 3 cols */}
                  <div className={`relative h-[350px] lg:h-[480px] lg:col-span-3 overflow-hidden ${rootIndex % 2 === 1 ? 'lg:order-2' : ''}`}>
                    {heroImage ? (
                      <Image
                        src={getOptimizedUrl(heroImage, 1200)}
                        alt={rootCat.name}
                        fill
                        sizes="(max-width: 1024px) 100vw, 60vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-[1.5s] ease-out"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-white/5">
                        <Layers size={80} className="text-white/10" />
                      </div>
                    )}
                    
                    {/* Gradient towards content side */}
                    <div className={`absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#060606] via-[#060606]/40 to-transparent ${rootIndex % 2 === 1 ? 'lg:bg-gradient-to-l' : 'lg:bg-gradient-to-r'}`} />
                    
                    {/* Floating category name on image */}
                    <div className="absolute bottom-6 left-6 z-10 lg:hidden">
                      <h3 className="text-3xl font-black text-white uppercase tracking-tight">
                        {rootCat.name}
                      </h3>
                    </div>

                    {/* Project count chip */}
                    <div className="absolute top-5 right-5 z-10">
                      <div className="backdrop-blur-md bg-black/40 border border-white/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-white/80">
                        {rootProjects.length} {rootProjects.length === 1 ? 'Project' : 'Projects'}
                      </div>
                    </div>
                  </div>

                  {/* Content Side — 2 cols */}
                  <div className={`lg:col-span-2 flex flex-col justify-center p-8 lg:p-12 bg-white/[0.02] ${rootIndex % 2 === 1 ? 'lg:order-1' : ''}`}>
                    
                    {/* Large number */}
                    <span className="text-[100px] font-black text-white/[0.03] leading-none select-none -mb-16">
                      0{rootIndex + 1}
                    </span>

                    {/* Root name */}
                    <h3 className="hidden lg:block text-4xl xl:text-5xl font-black text-white uppercase tracking-tight leading-[0.95] mb-3">
                      {rootCat.name}
                    </h3>
                    
                    <div className="h-[2px] w-14 bg-accent mb-8" />

                    {/* Subcategories list */}
                    {hasChildren && (
                      <div className="space-y-1 mb-8">
                        {rootCat.children.map((child: any, ci: number) => {
                          const childNames = getAllDescendantNames(child);
                          const childCount = projects.filter((p: any) => childNames.includes(p.category?.toString().trim().toUpperCase())).length;
                          const isDisabled = child.badge === 'قريباً';

                          return (
                            <div key={child.id}>
                              <Link 
                                href={isDisabled ? '#' : `/portfolio?category=${encodeURIComponent(child.name)}`}
                                className={`flex items-center justify-between py-3 px-3 rounded-sm group/item transition-all duration-300 ${isDisabled ? 'opacity-30 cursor-default' : 'hover:bg-white/[0.05] hover:pl-5'}`}
                              >
                                <div className="flex items-center gap-3">
                                  <span className="w-1.5 h-1.5 rounded-full bg-accent/40 group-hover/item:bg-accent transition-all duration-300" />
                                  <span className="text-[12px] font-bold uppercase tracking-[0.12em] text-white/50 group-hover/item:text-white transition-colors duration-300">
                                    {child.name}
                                  </span>
                                  {child.badge === 'جديد' && (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[7px] font-black uppercase bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 rounded-full">
                                      <Sparkles size={7} /> NEW
                                    </span>
                                  )}
                                  {child.badge === 'قريباً' && (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[7px] font-black uppercase bg-amber-500/15 text-amber-400 border border-amber-500/20 rounded-full">
                                      <Clock size={7} /> SOON
                                    </span>
                                  )}
                                </div>
                                {!isDisabled && (
                                  <div className="flex items-center gap-2 opacity-0 group-hover/item:opacity-100 transition-all duration-300">
                                    {childCount > 0 && <span className="text-[10px] font-bold text-white/20">{childCount}</span>}
                                    <ArrowRight size={10} className="text-accent" />
                                  </div>
                                )}
                              </Link>

                              {/* Grandchildren chips */}
                              {child.children && child.children.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 pl-9 pb-2">
                                  {child.children.map((gc: any) => (
                                    <Link
                                      key={gc.id}
                                      href={`/portfolio?category=${encodeURIComponent(gc.name)}`}
                                      className="text-[10px] font-bold uppercase tracking-wider text-white/25 hover:text-accent px-2.5 py-1 border border-white/[0.05] hover:border-accent/30 rounded-sm transition-all duration-300"
                                    >
                                      {gc.name}
                                    </Link>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* CTA */}
                    <Link 
                      href={`/portfolio?category=${encodeURIComponent(rootCat.name)}`}
                      className="group/cta inline-flex items-center gap-3 text-[12px] font-bold uppercase tracking-[0.3em] text-accent hover:text-white transition-colors duration-500 self-start mt-auto"
                    >
                      <span className="border-b border-accent/30 group-hover/cta:border-white pb-1 transition-colors duration-500">
                        Explore {rootCat.name}
                      </span>
                      <ArrowRight size={14} className="group-hover/cta:translate-x-2 transition-transform duration-500" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom accent line */}
        <motion.div 
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="h-[1px] bg-gradient-to-r from-transparent via-accent/30 to-transparent mt-20 origin-left"
        />
      </div>
    </section>
  );
}
