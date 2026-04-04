'use client';

import { useState, useEffect } from 'react';
import { Tag, MapPin, Plus, ChevronRight, ChevronDown, Edit3, Trash2, Sparkles, Clock } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';
import TaxonomyModal from './taxonomy/TaxonomyModal';
import { useAdminLanguage } from '@/context/AdminLanguageContext';
import { motion, AnimatePresence } from 'framer-motion';

// Build hierarchy tree from flat list
function buildTree(items: any[]): any[] {
  const map: Record<string, any> = {};
  const roots: any[] = [];
  
  items.forEach(item => {
    map[item.id] = { ...item, children: [] };
  });
  
  items.forEach(item => {
    if (item.parentId && map[item.parentId]) {
      map[item.parentId].children.push(map[item.id]);
    } else {
      roots.push(map[item.id]);
    }
  });
  
  return roots;
}

export default function TaxonomyTab() {
  const { t, lang } = useAdminLanguage();
  const [categories, setCategories] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalType, setModalType] = useState<'category' | 'location' | null>(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [parentForNew, setParentForNew] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  useEffect(() => {
    const unsubCat = onSnapshot(query(collection(db, 'categories'), orderBy('name', 'asc')), (snapshot) => {
      const cats = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCategories(cats);
      // Auto-expand all parents
      const parentIds = new Set(cats.filter((c: any) => c.parentId).map((c: any) => c.parentId));
      setExpanded(prev => new Set([...prev, ...parentIds]));
      setLoading(false);
    });
    const unsubLoc = onSnapshot(query(collection(db, 'locations'), orderBy('name', 'asc')), (snapshot) => {
      setLocations(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => { unsubCat(); unsubLoc(); };
  }, []);

  const handleOpenModal = (type: 'category' | 'location', item: any = null, parentId: string | null = null) => {
    setModalType(type);
    setEditingItem(item);
    setParentForNew(parentId);
  };

  const handleSave = async (name: string, parentId?: string | null, badge?: string | null) => {
    const collectionName = modalType === 'category' ? 'categories' : 'locations';
    
    if (modalType === 'category') {
      const level = parentId ? (categories.find(c => c.id === parentId)?.level || 0) + 1 : 0;
      
      if (editingItem) {
        await updateDoc(doc(db, collectionName, editingItem.id), { 
          name, 
          parentId: parentId || null,
          level,
          badge: badge || null,
          updatedAt: serverTimestamp() 
        });
      } else {
        await addDoc(collection(db, collectionName), { 
          name, 
          parentId: parentId || null,
          level,
          badge: badge || null,
          createdAt: serverTimestamp(), 
          updatedAt: serverTimestamp() 
        });
      }
    } else {
      // Location - simple flat
      if (editingItem) {
        await updateDoc(doc(db, collectionName, editingItem.id), { name, updatedAt: serverTimestamp() });
      } else {
        await addDoc(collection(db, collectionName), { name, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
      }
    }
    setModalType(null);
  };

  const handleDelete = async (id: string, type: 'category' | 'location', label: string) => {
    if (window.confirm(t.taxonomy.deleteConfirm.replace('{label}', label))) {
      const collName = type === 'category' ? 'categories' : 'locations';
      // Also delete children if category
      if (type === 'category') {
        const children = categories.filter(c => c.parentId === id);
        for (const child of children) {
          // Delete grandchildren
          const grandchildren = categories.filter(c => c.parentId === child.id);
          for (const gc of grandchildren) {
            await deleteDoc(doc(db, collName, gc.id));
          }
          await deleteDoc(doc(db, collName, child.id));
        }
      }
      await deleteDoc(doc(db, collName, id));
    }
  };

  const toggleExpand = (id: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const tree = buildTree(categories);

  const title = lang === 'ar' ? 'التصنيفات والمواقع' : 'Taxonomy Management';
  const subtitle = lang === 'ar' 
    ? 'التحكم في تصنيفات المشاريع والمواقع الجغرافية.' 
    : 'Manage project categories and locations.';

  if (loading) return (
    <div className="py-16 flex flex-col items-center">
      <div className="w-10 h-10 border-2 border-accent border-t-transparent rounded-sm animate-spin mb-6" />
      <span className="text-sm font-bold text-slate-400">{t.taxonomy.loading}</span>
    </div>
  );

  return (
    <div className={`space-y-12 ${lang === 'ar' ? 'font-sans text-right' : ''}`}>
      <div className="border-b border-border pb-8">
        <h3 className="text-3xl font-black tracking-tighter uppercase leading-none mb-3">{title}</h3>
        <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-accent/80 italic max-w-2xl">{subtitle}</p>
      </div>

      <div className="space-y-8">
        {/* Categories Tree */}
        <section>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-5 border-b border-slate-100 pb-3 gap-4">
            <div>
              <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                <Tag size={20} className="text-accent" />
                {t.taxonomy.categoriesTitle}
              </h3>
              <p className="text-sm text-slate-400 mt-1">{t.taxonomy.categoriesSubtitle}</p>
            </div>
            <button 
              onClick={() => handleOpenModal('category', null, null)}
              className="bg-slate-800 text-white px-5 py-2 text-sm font-bold rounded-md flex items-center gap-3 hover:bg-slate-700 transition-all shadow-sm group"
            >
              <Plus size={16} className="group-hover:rotate-180 transition-transform duration-500" />
              <span>{lang === 'ar' ? 'إضافة تصنيف رئيسي' : 'Add Root Category'}</span>
            </button>
          </div>

          {/* Category Tree */}
          <div className="space-y-2">
            {tree.map(node => (
              <CategoryNode 
                key={node.id} 
                node={node} 
                level={0} 
                expanded={expanded}
                toggleExpand={toggleExpand}
                onEdit={(item) => handleOpenModal('category', item)}
                onDelete={handleDelete}
                onAddChild={(parentId) => handleOpenModal('category', null, parentId)}
                lang={lang}
              />
            ))}
            {tree.length === 0 && (
              <div className="py-10 text-center border border-dashed border-slate-200 rounded-lg">
                <p className="text-sm text-slate-400">{lang === 'ar' ? 'لا توجد تصنيفات بعد' : 'No categories yet'}</p>
              </div>
            )}
          </div>
        </section>

        {/* Locations (flat — unchanged) */}
        <section>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-5 border-b border-slate-100 pb-3 gap-4">
            <div>
              <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                <MapPin size={20} className="text-accent" />
                {t.taxonomy.locationsTitle}
              </h3>
              <p className="text-sm text-slate-400 mt-1">{t.taxonomy.locationsSubtitle}</p>
            </div>
            <button 
              onClick={() => handleOpenModal('location')}
              className="bg-slate-800 text-white px-5 py-2 text-sm font-bold rounded-md flex items-center gap-3 hover:bg-slate-700 transition-all shadow-sm group"
            >
              <Plus size={16} className="group-hover:rotate-180 transition-transform duration-500" />
              <span>{t.taxonomy.add} {t.taxonomy.locationsTitle}</span>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <AnimatePresence mode="popLayout">
              {locations.map((item) => (
                <motion.div 
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-white p-3 border border-slate-100 shadow-sm rounded-lg flex items-center justify-between group"
                >
                  <span className="text-base font-bold text-slate-700">{item.name}</span>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleOpenModal('location', item)} className="p-1.5 text-slate-400 hover:text-accent transition-colors">
                      <Edit3 size={14} />
                    </button>
                    <button onClick={() => handleDelete(item.id, 'location', item.name)} className="p-1.5 text-slate-400 hover:text-red-500 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>
      </div>

      <TaxonomyModal 
        type={modalType} 
        editingItem={editingItem} 
        parentId={parentForNew}
        categories={categories}
        onClose={() => setModalType(null)} 
        onSave={handleSave} 
      />
    </div>
  );
}

// Recursive tree node component
function CategoryNode({ node, level, expanded, toggleExpand, onEdit, onDelete, onAddChild, lang }: {
  node: any;
  level: number;
  expanded: Set<string>;
  toggleExpand: (id: string) => void;
  onEdit: (item: any) => void;
  onDelete: (id: string, type: 'category' | 'location', name: string) => void;
  onAddChild: (parentId: string) => void;
  lang: string;
}) {
  const hasChildren = node.children && node.children.length > 0;
  const isExpanded = expanded.has(node.id);
  
  const levelColors = [
    'bg-slate-800 text-white',    // Level 0 — root
    'bg-slate-100 text-slate-800', // Level 1
    'bg-white text-slate-600',     // Level 2+
  ];
  const bgClass = levelColors[Math.min(level, 2)];

  return (
    <div>
      <motion.div
        layout
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className={`flex items-center justify-between p-3 rounded-lg border border-slate-100 shadow-sm group ${bgClass} ${level > 0 ? 'ml-' + (level * 6) : ''}`}
        style={{ marginLeft: level * 24 }}
      >
        <div className="flex items-center gap-3">
          {hasChildren ? (
            <button onClick={() => toggleExpand(node.id)} className="p-1 hover:bg-black/5 rounded transition-colors">
              {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
          ) : (
            <span className="w-6" />
          )}
          <span className="text-sm font-bold">{node.name}</span>
          
          {/* Badge */}
          {node.badge === 'جديد' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider bg-emerald-500 text-white">
              <Sparkles size={8} /> {lang === 'ar' ? 'جديد' : 'NEW'}
            </span>
          )}
          {node.badge === 'قريباً' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider bg-amber-500 text-white">
              <Clock size={8} /> {lang === 'ar' ? 'قريباً' : 'SOON'}
            </span>
          )}
          
          {hasChildren && (
            <span className="text-[9px] font-bold text-current/40 uppercase">
              ({node.children.length})
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={() => onAddChild(node.id)} 
            className="p-1.5 text-current/40 hover:text-accent transition-colors"
            title={lang === 'ar' ? 'إضافة فرعي' : 'Add child'}
          >
            <Plus size={14} />
          </button>
          <button onClick={() => onEdit(node)} className="p-1.5 text-current/40 hover:text-accent transition-colors">
            <Edit3 size={14} />
          </button>
          <button onClick={() => onDelete(node.id, 'category', node.name)} className="p-1.5 text-current/40 hover:text-red-500 transition-colors">
            <Trash2 size={14} />
          </button>
        </div>
      </motion.div>
      
      {/* Children */}
      <AnimatePresence>
        {isExpanded && hasChildren && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2 mt-2"
          >
            {node.children.map((child: any) => (
              <CategoryNode
                key={child.id}
                node={child}
                level={level + 1}
                expanded={expanded}
                toggleExpand={toggleExpand}
                onEdit={onEdit}
                onDelete={onDelete}
                onAddChild={onAddChild}
                lang={lang}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
