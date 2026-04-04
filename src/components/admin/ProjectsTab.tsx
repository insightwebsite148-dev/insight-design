'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  limit,
  serverTimestamp
} from 'firebase/firestore';

// Modular Components
import ProjectSearch from './projects/ProjectSearch';
import ProjectTable from './projects/ProjectTable';
import ProjectModal from './projects/ProjectModal';

import { useAdminLanguage } from '@/context/AdminLanguageContext';

export default function ProjectsTab() {
  const { t, lang } = useAdminLanguage();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [displayLimit, setDisplayLimit] = useState(8);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    location: '',
    area: '',
    year: '',
    style: '',
    description: '',
    image: '',
    images: [] as string[],
    beforeImage: '',
    status: 'Completed',
    isRecommended: false
  });

  useEffect(() => {
    // Fetch with a safe limit to prevent initial lag
    const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'), limit(50));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const projectsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProjects(projectsData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleOpenModal = (project: any = null) => {
    if (project) {
      setEditingProject(project);
      setFormData({
        title: project.title,
        category: project.category || '',
        location: project.location || '',
        area: project.area || '',
        year: project.year || '',
        style: project.style || '',
        description: project.description || '',
        image: project.image || '',
        images: project.images || (project.image ? [project.image] : []),
        beforeImage: project.beforeImage || '',
        status: project.status || 'Completed',
        isRecommended: project.isRecommended || false
      });
    } else {
      setEditingProject(null);
      setFormData({
        title: '',
        category: '',
        location: '',
        area: '',
        year: '',
        style: '',
        description: '',
        image: '',
        images: [],
        beforeImage: '',
        status: 'Completed',
        isRecommended: false
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (editingProject) {
        const docRef = doc(db, 'projects', editingProject.id);
        await updateDoc(docRef, {
          ...formData,
          updatedAt: serverTimestamp()
        });
      } else {
        await addDoc(collection(db, 'projects'), {
          ...formData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving project:', error);
      alert(t?.modal?.failed || 'Failed to save project.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(t.projects.confirmDelete.replace('{title}', title))) {
      try {
        await deleteDoc(doc(db, 'projects', id));
      } catch (error) {
        console.error('Error deleting project:', error);
      }
    }
  };

  const filteredProjects = projects.filter(p =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayedProjects = filteredProjects.slice(0, displayLimit);

  const title = lang === 'ar' ? 'المشاريع' : 'Projects';
  const subtitle = lang === 'ar'
    ? 'إضافة وتعديل وحذف مشاريع معرض الأعمال.'
    : 'Add, edit, or delete portfolio projects.';

  return (
    <div className={`space-y-10 ${lang === 'ar' ? 'font-sans text-right' : ''}`}>
      <div className="border-b border-border pb-8">
        <h3 className="text-3xl font-black tracking-tighter uppercase leading-none mb-3">{title}</h3>
        <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-accent/80 italic max-w-2xl">{subtitle}</p>
      </div>

      <ProjectSearch
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onAddClick={() => handleOpenModal()}
      />

      <div className="space-y-6">
        <ProjectTable
          projects={displayedProjects}
          loading={loading}
          onEdit={handleOpenModal}
          onDelete={handleDelete}
        />

        {!loading && filteredProjects.length > displayLimit && (
          <div className="flex justify-center pt-4">
            <button 
              onClick={() => setDisplayLimit((prev: number) => prev + 12)}
              className="bg-white border border-border px-8 py-3 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-black hover:text-white transition-all"
            >
              {lang === 'ar' ? 'عرض المزيد' : 'Show More Projects'}
            </button>
          </div>
        )}
      </div>

      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingProject={editingProject}
        formData={formData}
        setFormData={setFormData}
        onSave={handleSave}
        isSaving={isSaving}
      />
    </div>
  );
}
