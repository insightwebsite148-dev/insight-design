'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowLeft, Layers, Sparkles, Clock, MoveUpRight, Grid3X3, ChevronDown } from 'lucide-react';
import { getOptimizedUrl } from '@/lib/cloudinary';
import { useSettings } from '@/context/SettingsContext';

// ─── Tree Utilities ───────────────────────────────────────────────

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

function findNodeByName(nodes: any[], name: string): any {
  for (const node of nodes) {
    if (node.name?.toString().trim().toUpperCase() === name.toUpperCase()) return node;
    if (node.children) {
      const found = findNodeByName(node.children, name);
      if (found) return found;
    }
  }
  return null;
}

function getAllDescendantNames(node: any): string[] {
  let names = [node.name?.toString().trim().toUpperCase()];
  if (node.children) {
    for (const child of node.children) {
      names = [...names, ...getAllDescendantNames(child)];
    }
  }
  return names;
}

// ─── Project Card ─────────────────────────────────────────────────

function CategoryProjectCard({ project, index }: { project: any; index: number }) {
  const image = project.image || (project.images && project.images[0]) || '';
  
  // Varied aspect ratios for visual interest
  const aspects = ['aspect-[3/4]', 'aspect-[4/5]', 'aspect-square', 'aspect-[3/4]', 'aspect-[2/3]'];
  const aspect = aspects[index % aspects.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 1, delay: (index % 4) * 0.1, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link href={`/portfolio/${project.id}`} className="group block relative overflow-hidden rounded-2xl bg-[#050505]">
        <div className={`relative ${aspect} overflow-hidden`}>
          {image ? (
            <Image
              src={getOptimizedUrl(image, 900)}
              alt={project.title || ''}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-all duration-[2s] ease-[0.16,1,0.3,1] group-hover:scale-110 group-hover:brightness-75"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-white/5">
              <Layers size={40} className="text-white/10" />
            </div>
          )}
          
          {/* Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-700" />
          
          {/* Center icon */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-700 z-10">
            <div className="w-16 h-16 rounded-full border border-white/20 bg-white/10 backdrop-blur-md flex items-center justify-center transform translate-y-8 group-hover:translate-y-0 transition-transform duration-700 ease-[0.16,1,0.3,1]">
              <MoveUpRight size={22} strokeWidth={1.5} className="text-white" />
            </div>
          </div>

          {/* Category chip */}
          <div className="absolute top-4 left-4 z-10">
            <span className="px-3 py-1.5 bg-black/40 backdrop-blur-md border border-white/10 text-[9px] font-bold uppercase tracking-widest text-white/70 rounded-full">
              {project.category}
            </span>
          </div>

          {/* Bottom info */}
          <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
            <p className="text-white text-sm font-bold uppercase tracking-wide truncate group-hover:text-accent transition-colors duration-500">
              {project.title}
            </p>
            {project.location && (
              <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mt-1.5">{project.location}</p>
            )}
          </div>

          {/* Decorative border */}
          <div className="absolute inset-0 border border-white/0 group-hover:border-white/10 rounded-2xl transition-colors duration-700 pointer-events-none" />
        </div>
      </Link>
    </motion.div>
  );
}

// ─── Child Category Card (for sub-navigation) ────────────────────

function ChildCategoryCard({ child, projects, index, isActive, onClick }: { child: any; projects: any[]; index: number; isActive: boolean; onClick: () => void }) {
  const childNames = getAllDescendantNames(child);
  const childProjects = projects.filter((p: any) => childNames.includes(p.category?.toString().trim().toUpperCase()));
  const heroProject = childProjects[0];
  const heroImage = heroProject?.image || (heroProject?.images && heroProject.images[0]) || '';
  const isDisabled = child.badge === 'قريباً';

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      onClick={isDisabled ? undefined : onClick}
      className={`relative group flex-shrink-0 w-[200px] md:w-[240px] overflow-hidden rounded-xl transition-all duration-500 ${
        isDisabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
      } ${isActive ? 'ring-2 ring-accent ring-offset-2 ring-offset-white shadow-xl shadow-accent/10' : 'hover:shadow-lg'}`}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-[#0a0a0a]">
        {heroImage ? (
          <Image
            src={getOptimizedUrl(heroImage, 500)}
            alt={child.name}
            fill
            sizes="240px"
            className={`object-cover transition-all duration-700 ${isActive ? 'scale-105 brightness-90' : 'group-hover:scale-105'}`}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
            <Layers size={24} className="text-slate-300" />
          </div>
        )}
        <div className={`absolute inset-0 transition-colors duration-500 ${isActive ? 'bg-accent/20' : 'bg-black/30 group-hover:bg-black/20'}`} />
        
        <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-black uppercase tracking-wider ${isActive ? 'text-accent' : 'text-white'}`}>
              {child.name}
            </span>
            <span className="text-[9px] font-bold text-white/50">
              {childProjects.length}
            </span>
          </div>
          {child.badge === 'جديد' && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[7px] font-black uppercase bg-emerald-500/20 text-emerald-400 rounded-full mt-1">
              <Sparkles size={7} /> NEW
            </span>
          )}
          {child.badge === 'قريباً' && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[7px] font-black uppercase bg-amber-500/20 text-amber-400 rounded-full mt-1">
              <Clock size={7} /> SOON
            </span>
          )}
        </div>
      </div>
    </motion.button>
  );
}

// ─── Main Component ───────────────────────────────────────────────

export default function CategoryPageClient({ 
  categoryName, 
  initialProjects, 
  initialCategories,
  initialSettings
}: { 
  categoryName: string; 
  initialProjects: any[];
  initialCategories: any[];
  initialSettings: any;
}) {
  const { categories: globalCategories, projects: globalProjects } = useSettings();
  
  const categories = globalCategories.length > 0 ? globalCategories : initialCategories;
  const projects = globalProjects.length > 0 ? globalProjects : initialProjects;
  
  const [selectedChild, setSelectedChild] = useState<string | null>(null);

  const tree = useMemo(() => buildTree(categories), [categories]);
  const categoryNode = useMemo(() => findNodeByName(tree, categoryName), [tree, categoryName]);

  const hasChildren = categoryNode?.children && categoryNode.children.length > 0;

  // Get all descendant names for project filtering
  const allDescNames = useMemo(() => {
    if (!categoryNode) return [];
    return getAllDescendantNames(categoryNode);
  }, [categoryNode]);

  // Filter projects
  const filteredProjects = useMemo(() => {
    if (selectedChild) {
      const childNode = categoryNode?.children.find((c: any) => c.name === selectedChild);
      if (childNode) {
        const childNames = getAllDescendantNames(childNode);
        return projects.filter((p: any) => childNames.includes(p.category?.toString().trim().toUpperCase()));
      }
    }
    return projects.filter((p: any) => allDescNames.includes(p.category?.toString().trim().toUpperCase()));
  }, [projects, allDescNames, selectedChild, categoryNode]);

  // Hero image from featured/first project
  const heroProject = filteredProjects.find((p: any) => p.isRecommended) || filteredProjects[0];
  const heroImage = heroProject?.image || (heroProject?.images && heroProject.images[0]) || '';

  // Active (non-disabled) children for filter pills
  const activeChildren = hasChildren ? categoryNode.children.filter((c: any) => c.badge !== 'قريباً') : [];

  return (
    <div className="bg-background min-h-screen">
      {/* ═══ Hero Header ═══ */}
      <section className="relative flex items-end overflow-hidden w-full bg-[#050505]" style={{ minHeight: '60vh' }}>
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          {heroImage ? (
            <motion.div
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0"
            >
              <Image
                src={getOptimizedUrl(heroImage, 2560)}
                alt={categoryName}
                fill
                priority
                className="object-cover"
                sizes="100vw"
              />
            </motion.div>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary via-primary/95 to-accent/20" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />
        </div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 md:px-12 pb-16 md:pb-20 pt-40">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex items-center gap-3 mb-8"
          >
            <Link href="/" className="text-white/40 text-[10px] font-bold uppercase tracking-widest hover:text-accent transition-colors">
              Home
            </Link>
            <ChevronDown size={10} className="text-white/20 -rotate-90" />
            <span className="text-accent text-[10px] font-bold uppercase tracking-widest">
              {categoryName}
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center gap-4 mb-4">
              <span className="h-[2px] w-12 bg-accent" />
              <span className="text-[11px] font-bold uppercase tracking-[0.5em] text-accent">
                Collection
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter uppercase leading-[0.9] mb-6">
              {categoryName}
            </h1>
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-accent" />
              <span className="text-white/50 text-sm font-bold uppercase tracking-widest">
                {filteredProjects.length} {filteredProjects.length === 1 ? 'Project' : 'Projects'}
              </span>
            </div>
          </motion.div>
        </div>

        {/* Decorative vertical lines */}
        <div className="absolute top-0 right-16 md:right-32 bottom-0 w-px bg-white/5 z-0" />
        <div className="absolute top-0 right-6 md:right-16 bottom-0 w-px bg-white/5 z-0" />
      </section>

      {/* ═══ Sub-Categories Navigation (if has children) ═══ */}
      {hasChildren && (
        <section className="bg-white border-b border-border/50 sticky top-[72px] z-40">
          <div className="max-w-[1400px] mx-auto px-6">
            <div className="py-6 overflow-x-auto">
              <div className="flex items-center gap-3 min-w-max">
                {/* "All" button */}
                <button
                  onClick={() => setSelectedChild(null)}
                  className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 flex items-center gap-2 ${
                    !selectedChild 
                      ? 'bg-primary text-white shadow-lg' 
                      : 'bg-slate-50 text-muted hover:bg-slate-100 border border-border/50'
                  }`}
                >
                  <Grid3X3 size={12} />
                  All
                </button>

                {/* Child category cards */}
                {categoryNode.children.map((child: any, ci: number) => (
                  <ChildCategoryCard
                    key={child.id}
                    child={child}
                    projects={projects}
                    index={ci}
                    isActive={selectedChild === child.name}
                    onClick={() => setSelectedChild(child.name === selectedChild ? null : child.name)}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ═══ Projects Gallery ═══ */}
      <section className="max-w-[1400px] mx-auto px-6 py-16 md:py-24 pb-32">
        {/* Active filter indicator */}
        {selectedChild && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-10"
          >
            <span className="text-[11px] font-bold uppercase tracking-widest text-muted">Showing:</span>
            <span className="px-4 py-2 bg-accent/5 border border-accent/20 text-accent text-[11px] font-black uppercase tracking-wider rounded-full flex items-center gap-2">
              {selectedChild}
              <button onClick={() => setSelectedChild(null)} className="hover:text-primary transition-colors">×</button>
            </span>
          </motion.div>
        )}

        {/* Masonry-style grid */}
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 md:gap-6 space-y-4 md:space-y-6">
          {filteredProjects.map((project: any, index: number) => (
            <div key={project.id} className="break-inside-avoid">
              <CategoryProjectCard project={project} index={index} />
            </div>
          ))}
        </div>

        {/* Empty state */}
        {filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-24 text-center"
          >
            <Layers size={64} className="text-muted/15 mx-auto mb-6" />
            <p className="text-muted tracking-widest text-xs uppercase mb-4">No projects in this category yet</p>
            <Link href="/portfolio" className="inline-flex items-center gap-2 text-accent text-[11px] font-bold uppercase tracking-widest hover:text-primary transition-colors">
              <ArrowLeft size={14} />
              Browse All Projects
            </Link>
          </motion.div>
        )}
      </section>
    </div>
  );
}
