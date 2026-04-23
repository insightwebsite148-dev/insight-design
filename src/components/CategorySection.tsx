'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Layers, Sparkles, Clock } from 'lucide-react';
import { getOptimizedUrl } from '@/lib/cloudinary';
import { useSettings } from '@/context/SettingsContext';
import { useMemo } from 'react';

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

function getAllDescendantNames(node: any): string[] {
  let names = [node.name?.toString().trim().toUpperCase()];
  if (node.children) {
    for (const child of node.children) {
      names = [...names, ...getAllDescendantNames(child)];
    }
  }
  return names;
}

// ─── Child Category Card ──────────────────────────────────────────

function ChildCard({ child, projects, index }: { child: any; projects: any[]; index: number }) {
  const childNames = getAllDescendantNames(child);
  const childProjects = projects.filter((p: any) => childNames.includes(p.category?.toString().trim().toUpperCase()));
  const heroProject = childProjects[0];
  const heroImage = heroProject?.image || (heroProject?.images && heroProject.images[0]) || '';
  const isDisabled = child.badge === 'قريباً';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
    >
      {isDisabled ? (
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-slate-100 cursor-not-allowed">
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <Layers size={32} className="text-slate-300" />
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">{child.name}</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[8px] font-black uppercase bg-amber-100 text-amber-600 rounded-full">
              <Clock size={8} /> SOON
            </span>
          </div>
        </div>
      ) : (
        <Link href={`/category/${encodeURIComponent(child.name)}`} className="group block">
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-[#0a0a0a]">
            {heroImage ? (
              <Image
                src={getOptimizedUrl(heroImage, 600)}
                alt={child.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-all duration-[1.2s] ease-[0.16,1,0.3,1] group-hover:scale-105"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-50">
                <Layers size={32} className="text-slate-200" />
              </div>
            )}
            {/* Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

            {/* Badge */}
            {child.badge === 'جديد' && (
              <div className="absolute top-3 right-3 z-10">
                <span className="inline-flex items-center gap-1 px-2 py-1 text-[8px] font-black uppercase bg-emerald-500 text-white rounded-full shadow-lg">
                  <Sparkles size={8} /> NEW
                </span>
              </div>
            )}

            {/* Bottom info */}
            <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
              <h4 className="text-white text-sm font-bold uppercase tracking-wide mb-1 group-hover:text-accent transition-colors duration-500">
                {child.name}
              </h4>
              <div className="flex items-center justify-between">
                <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest">
                  {childProjects.length} {childProjects.length === 1 ? 'Project' : 'Projects'}
                </span>
                <ArrowRight size={14} className="text-white/0 group-hover:text-accent transition-all duration-500 group-hover:translate-x-1" />
              </div>
            </div>
          </div>
        </Link>
      )}
    </motion.div>
  );
}

// ─── Direct Project Card ──────────────────────────────────────────

function DirectProjectCard({ project, index }: { project: any; index: number }) {
  const image = project.image || (project.images && project.images[0]) || '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link href={`/portfolio/${project.id}`} className="group block">
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-[#0a0a0a]">
          {image ? (
            <Image
              src={getOptimizedUrl(image, 500)}
              alt={project.title || ''}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-all duration-[1.2s] ease-[0.16,1,0.3,1] group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-50">
              <Layers size={32} className="text-slate-200" />
            </div>
          )}
          {/* Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Bottom info */}
          <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
            <p className="text-white text-xs font-bold uppercase tracking-wider truncate group-hover:text-accent transition-colors duration-500">
              {project.title}
            </p>
            {project.location && (
              <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mt-0.5">{project.location}</p>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ─── Branch Section ───────────────────────────────────────────────

function BranchSection({ rootCat, rootIndex, projects, allImages }: { rootCat: any; rootIndex: number; projects: any[]; allImages: string[] }) {
  const allNames = getAllDescendantNames(rootCat);
  const rootProjects = projects.filter((p: any) => {
    const pCat = p.category?.toString().trim().toUpperCase();
    return allNames.includes(pCat);
  });

  const hasChildren = rootCat.children && rootCat.children.length > 0;

  // Hero image
  const heroProject = rootProjects.find((p: any) => p.isRecommended) || rootProjects[0];
  let heroImage = heroProject?.image || (heroProject?.images && heroProject.images[0]);
  if (!heroImage && allImages.length > 0) {
    heroImage = allImages[rootIndex % allImages.length];
  }

  const allChildren = hasChildren ? rootCat.children : [];
  const directProjects = !hasChildren ? rootProjects.slice(0, 8) : [];

  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      {/* Thin separator line */}
      {rootIndex > 0 && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-px bg-border" />
      )}

      <div className="max-w-[1400px] mx-auto w-full px-6 relative z-10">
        
        {/* ═══ Section Header: Clean & Centered ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-14"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <span className="h-px w-8 bg-accent/40" />
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-accent">
              0{rootIndex + 1}
            </span>
            <span className="h-px w-8 bg-accent/40" />
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight uppercase text-primary mb-3">
            {rootCat.name}
          </h2>
          <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-muted">
            {rootProjects.length} {rootProjects.length === 1 ? 'Project' : 'Projects'}
          </span>
        </motion.div>

        {/* ═══ With Children: Grid of Child Categories ═══ */}
        {hasChildren && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {allChildren.map((child: any, ci: number) => (
              <ChildCard key={child.id} child={child} projects={projects} index={ci} />
            ))}
          </div>
        )}

        {/* ═══ No Children: Direct Projects Grid ═══ */}
        {!hasChildren && directProjects.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {directProjects.map((project: any, pi: number) => (
              <DirectProjectCard key={project.id} project={project} index={pi} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!hasChildren && directProjects.length === 0 && (
          <div className="py-16 text-center border border-dashed border-border rounded-xl">
            <Layers size={36} className="text-muted/15 mx-auto mb-3" />
            <p className="text-muted tracking-widest text-xs uppercase">No projects yet</p>
          </div>
        )}

        {/* ═══ CTA ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex justify-center"
        >
          <Link
            href={hasChildren ? `/category/${encodeURIComponent(rootCat.name)}` : `/portfolio?category=${encodeURIComponent(rootCat.name)}`}
            className="group inline-flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.25em] text-muted hover:text-accent transition-colors duration-500"
          >
            <span className="border-b border-current pb-0.5 transition-colors duration-500">
              Explore {rootCat.name}
            </span>
            <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform duration-500" />
          </Link>
        </motion.div>

      </div>
    </section>
  );
}

// ─── Main Export ───────────────────────────────────────────────────

export default function CategorySection() {
  const { categories, projects } = useSettings();

  const tree = useMemo(() => {
    if (!categories || categories.length === 0) return [];
    return buildTree(categories);
  }, [categories]);

  const allImages = useMemo(() => {
    if (!projects) return [];
    return projects
      .map((p: any) => p.image || (p.images && p.images[0]))
      .filter(Boolean);
  }, [projects]);

  if (tree.length === 0 || !projects) return null;

  return (
    <div>
      {tree.map((rootCat, rootIndex) => (
        <BranchSection
          key={rootCat.id}
          rootCat={rootCat}
          rootIndex={rootIndex}
          projects={projects}
          allImages={allImages}
        />
      ))}
    </div>
  );
}
