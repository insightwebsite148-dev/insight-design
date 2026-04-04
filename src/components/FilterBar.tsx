'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronRight, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FilterBarProps {
  categories: string[];
  locations: string[];
  selectedCategory: string;
  selectedLocation: string;
  onCategoryChange: (category: string) => void;
  onLocationChange: (location: string) => void;
  categoryTree?: any[]; // Hierarchical category data
}

// Build hierarchy from flat category objects
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

// Flatten tree to indented list for dropdown
function flattenTree(nodes: any[], level = 0): { name: string; level: number; badge?: string }[] {
  const result: { name: string; level: number; badge?: string }[] = [];
  for (const node of nodes) {
    result.push({ name: node.name, level, badge: node.badge });
    if (node.children?.length > 0) {
      result.push(...flattenTree(node.children, level + 1));
    }
  }
  return result;
}

export default function FilterBar({
  categories,
  locations,
  selectedCategory,
  selectedLocation,
  onCategoryChange,
  onLocationChange,
  categoryTree
}: FilterBarProps) {
  const [isCatOpen, setIsCatOpen] = useState(false);
  const [isLocOpen, setIsLocOpen] = useState(false);
  
  const catRef = useRef<HTMLDivElement>(null);
  const locRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (catRef.current && !catRef.current.contains(event.target as Node)) setIsCatOpen(false);
      if (locRef.current && !locRef.current.contains(event.target as Node)) setIsLocOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Build hierarchical dropdown items from categoryTree if available
  const tree = categoryTree ? buildTree(categoryTree) : [];
  const hierarchicalItems = categoryTree ? flattenTree(tree) : [];
  const useHierarchy = hierarchicalItems.length > 0;

  return (
    <div className="bg-white border border-border/50 shadow-xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-8 mb-20 relative z-30">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
        {/* Category Filter */}
        <div className="relative w-full" ref={catRef}>
          <label className="text-[12px] font-bold uppercase tracking-widest text-muted mb-3 block">
            Project Category
          </label>
          <div 
            onClick={() => { setIsCatOpen(!isCatOpen); setIsLocOpen(false); }}
            className={`flex items-center justify-between border-b pb-3 cursor-pointer transition-all duration-500 ${isCatOpen ? 'border-accent text-accent' : 'border-border hover:border-accent/40'}`}
          >
            <span className="font-bold text-xs uppercase tracking-[0.2em]">{selectedCategory}</span>
            <ChevronDown size={14} className={`transition-transform duration-500 ${isCatOpen ? 'rotate-180 text-accent' : 'text-muted'}`} />
          </div>
          
          <AnimatePresence>
            {isCatOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white border border-border/50 shadow-2xl py-4 z-50 max-h-[400px] overflow-y-auto"
              >
                {/* "All" option */}
                <div 
                  onClick={() => { onCategoryChange('All'); setIsCatOpen(false); }}
                  className={`px-6 py-3 text-[10px] font-bold uppercase tracking-widest flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors ${selectedCategory === 'All' ? 'text-accent bg-slate-50/50' : 'text-primary/60'}`}
                >
                  All
                  {selectedCategory === 'All' && <Check size={12} />}
                </div>

                {useHierarchy ? (
                  // Hierarchical view
                  hierarchicalItems.map((item, idx) => (
                    <div 
                      key={`${item.name}-${idx}`}
                      onClick={() => { 
                        if (item.badge !== 'قريباً') {
                          onCategoryChange(item.name); 
                          setIsCatOpen(false); 
                        }
                      }}
                      className={`py-3 text-[10px] font-bold uppercase tracking-widest flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors
                        ${item.level === 0 ? 'px-6 text-primary font-black' : ''}
                        ${item.level === 1 ? 'px-10 text-primary/70' : ''}
                        ${item.level >= 2 ? 'px-14 text-primary/50' : ''}
                        ${selectedCategory === item.name ? 'text-accent bg-slate-50/50' : ''}
                        ${item.badge === 'قريباً' ? 'opacity-40 cursor-not-allowed' : ''}
                      `}
                    >
                      <span className="flex items-center gap-2">
                        {item.level > 0 && <span className="text-accent/30">└</span>}
                        {item.name}
                        {item.badge === 'جديد' && (
                          <span className="text-[7px] bg-emerald-500 text-white px-1.5 py-0.5 rounded-full font-black normal-case">NEW</span>
                        )}
                        {item.badge === 'قريباً' && (
                          <span className="text-[7px] bg-amber-500 text-white px-1.5 py-0.5 rounded-full font-black normal-case">SOON</span>
                        )}
                      </span>
                      {selectedCategory === item.name && <Check size={12} />}
                    </div>
                  ))
                ) : (
                  // Flat fallback
                  categories.filter(c => c !== 'All').map((cat) => (
                    <div 
                      key={cat}
                      onClick={() => { onCategoryChange(cat); setIsCatOpen(false); }}
                      className={`px-6 py-3 text-[10px] font-bold uppercase tracking-widest flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors ${selectedCategory === cat ? 'text-accent bg-slate-50/50' : 'text-primary/60'}`}
                    >
                      {cat}
                      {selectedCategory === cat && <Check size={12} />}
                    </div>
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Location Filter */}
        <div className="relative w-full" ref={locRef}>
          <label className="text-[12px] font-bold uppercase tracking-widest text-muted mb-3 block">
            Project Location
          </label>
          <div 
            onClick={() => { setIsLocOpen(!isLocOpen); setIsCatOpen(false); }}
            className={`flex items-center justify-between border-b pb-3 cursor-pointer transition-all duration-500 ${isLocOpen ? 'border-accent text-accent' : 'border-border hover:border-accent/40'}`}
          >
            <span className="font-bold text-xs uppercase tracking-[0.2em]">{selectedLocation}</span>
            <ChevronDown size={14} className={`transition-transform duration-500 ${isLocOpen ? 'rotate-180 text-accent' : 'text-muted'}`} />
          </div>

          <AnimatePresence>
            {isLocOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white border border-border/50 shadow-2xl py-4 z-50 max-h-[300px] overflow-y-auto"
              >
                {locations.map((loc) => (
                  <div 
                    key={loc}
                    onClick={() => { onLocationChange(loc); setIsLocOpen(false); }}
                    className={`px-6 py-3 text-[10px] font-bold uppercase tracking-widest flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors ${selectedLocation === loc ? 'text-accent bg-slate-50/50' : 'text-primary/60'}`}
                  >
                    {loc}
                    {selectedLocation === loc && <Check size={12} />}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex items-center gap-4 w-full md:w-auto mt-4 md:mt-0 pt-2 border-t md:border-t-0 md:pt-0">
        {(selectedCategory !== 'All' || selectedLocation !== 'All') && (
          <button 
            onClick={() => { onCategoryChange('All'); onLocationChange('All'); }}
            className="text-accent hover:text-primary transition-colors flex items-center gap-2 uppercase text-[9px] font-black tracking-[0.3em] whitespace-nowrap bg-accent/5 px-6 py-4 rounded-sm border border-accent/10"
          >
            <X size={14} />
            Reset Filters
          </button>
        )}
      </div>
    </div>
  );
}
