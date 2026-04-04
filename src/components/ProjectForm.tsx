'use client';

import { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { ImagePlus, X, Save, ArrowLeft } from 'lucide-react';

export default function ProjectForm({ project, onCancel, onSave }: { project: any, onCancel: () => void, onSave: () => void }) {
  const [formData, setFormData] = useState(project || {
    title: '',
    category: '',
    location: '',
    year: '',
    area: '',
    description: '',
    images: []
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: any) => {
    const files = e.target.files;
    if (!files.length) return;

    setUploading(true);
    // Cloudinary Upload Logic (Pattern)
    // 1. Create FormData
    // 2. Append file and upload preset
    // 3. Post to https://api.cloudinary.com/v1_1/${cloudName}/image/upload
    // 4. Update images array with returned secure_url
    
    // Simulating upload delay
    setTimeout(() => {
      setFormData({
        ...formData,
        images: [...formData.images, '/hero.png']
      });
      setUploading(false);
    }, 1500);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (project?.id) {
        await updateDoc(doc(db, 'projects', project.id), formData);
      } else {
        await addDoc(collection(db, 'projects'), formData);
      }
      onSave();
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-border p-12 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-12">
        <button onClick={onCancel} className="flex items-center space-x-2 text-muted hover:text-primary font-bold uppercase tracking-widest text-[10px]">
          <ArrowLeft size={16} />
          <span>Cancel</span>
        </button>
        <h2 className="text-2xl font-bold tracking-tighter uppercase">
          {project ? 'Edit Project' : 'Add New Project'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-12">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted block">Project Title</label>
            <input 
              type="text" 
              value={formData.title} 
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full border-b border-border py-2 focus:border-accent outline-none font-bold uppercase tracking-tight"
              placeholder="E.G. VILLA NOUVELLE"
              required
            />
          </div>
          <div className="space-y-4">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted block">Category</label>
            <select 
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="w-full border-b border-border py-2 focus:border-accent outline-none font-bold uppercase tracking-tight"
            >
              <option value="">Select Category</option>
              <option value="Residential">Residential</option>
              <option value="Commercial">Commercial</option>
              <option value="Hospitality">Hospitality</option>
            </select>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-4">
          <label className="text-[10px] font-bold uppercase tracking-widest text-muted block">Description</label>
          <textarea 
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full border border-border p-4 focus:border-accent outline-none text-sm leading-relaxed"
            placeholder="Describe the project details, materials, and vision..."
          />
        </div>

        {/* Image Gallery */}
        <div className="space-y-4">
          <label className="text-[10px] font-bold uppercase tracking-widest text-muted block">Project Gallery</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {formData.images.map((img: string, i: number) => (
              <div key={i} className="relative aspect-square border border-border overflow-hidden group">
                <img src={img} alt="Project" className="object-cover w-full h-full" />
                <button 
                  type="button"
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => setFormData({...formData, images: formData.images.filter((_: any, idx: number) => idx !== i)})}
                >
                  <X size={12} />
                </button>
              </div>
            ))}
            <label className="aspect-square border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:border-accent hover:bg-slate-50 transition-all">
              <input type="file" multiple className="hidden" onChange={handleImageUpload} />
              <ImagePlus size={24} className="text-muted mb-2" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted">
                {uploading ? 'Uploading...' : 'Add Image'}
              </span>
            </label>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-primary text-background py-6 font-bold uppercase tracking-widest flex items-center justify-center space-x-4 hover:bg-accent transition-all disabled:opacity-50"
        >
          <Save size={20} />
          <span>{loading ? 'Saving Changes...' : 'Save Project Instance'}</span>
        </button>
      </form>
    </div>
  );
}
