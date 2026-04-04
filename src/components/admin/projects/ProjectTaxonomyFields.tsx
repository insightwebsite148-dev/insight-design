import { Layers, MapPin } from 'lucide-react';
import { useAdminLanguage } from '@/context/AdminLanguageContext';

interface ProjectTaxonomyFieldsProps {
  categories: any[];
  locations: any[];
  formData: any;
  setFormData: (data: any | ((prev: any) => any)) => void;
}

export default function ProjectTaxonomyFields({ categories, locations, formData, setFormData }: ProjectTaxonomyFieldsProps) {
  const { lang, t } = useAdminLanguage();
  const f = t.projects.fields;

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 ${lang === 'ar' ? 'font-sans' : ''}`}>
      {/* Category Selection */}
      <div className="space-y-3">
        <div className={`flex items-center gap-2 mb-1 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
          <Layers size={14} className="text-accent" />
          <label className="text-[11px] font-black uppercase text-black/60">{f.category}</label>
        </div>
        <select 
          required
          value={formData.category}
          onChange={(e) => setFormData((prev: any) => ({...prev, category: e.target.value}))}
          className={`w-full bg-black/[0.02] border border-black/5 px-4 py-4.5 text-xs font-bold outline-none focus:border-accent cursor-pointer ${lang === 'ar' ? 'text-right pr-4 pl-10' : 'pl-4 pr-10'}`}
        >
          <option value="">{f.selectCategory}</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.name}>{cat.name}</option>
          ))}
        </select>
      </div>

      {/* Location Selection */}
      <div className="space-y-3">
        <div className={`flex items-center gap-2 mb-1 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
          <MapPin size={14} className="text-accent" />
          <label className="text-[11px] font-black uppercase text-black/60">{f.location || 'Location'}</label>
        </div>
        <div className="flex gap-2">
          <select 
            value={formData.location}
            onChange={(e) => setFormData((prev: any) => ({...prev, location: e.target.value}))}
            className={`flex-1 bg-black/[0.02] border border-black/5 px-4 py-4.5 text-xs font-bold outline-none focus:border-accent cursor-pointer ${lang === 'ar' ? 'text-right pr-4 pl-10' : 'pl-4 pr-10'}`}
          >
            <option value="">{f.selectLocation || 'Select Location'}</option>
            {locations.map(loc => (
              <option key={loc.id} value={loc.name}>{loc.name}</option>
            ))}
          </select>
          <input 
             type="text"
             value={formData.customLocation || ''}
             onChange={(e) => setFormData((prev: any) => ({...prev, customLocation: e.target.value}))}
             placeholder={f.customLocation || 'Custom Location'}
             className={`flex-1 bg-black/[0.02] border border-black/5 px-4 py-4.5 text-xs font-bold outline-none focus:border-accent ${lang === 'ar' ? 'text-right' : 'uppercase'}`}
          />
        </div>
      </div>

      {/* Year */}
      <div className="space-y-3">
        <label className="text-[11px] font-black uppercase text-black/60 block">{lang === 'ar' ? 'سنة التنفيذ' : 'Project Year'}</label>
        <input 
          type="text"
          value={formData.year || ''}
          onChange={(e) => setFormData((prev: any) => ({...prev, year: e.target.value}))}
          placeholder="e.g. 2024"
          className="w-full bg-black/[0.02] border border-black/5 px-4 py-4.5 text-xs font-bold outline-none focus:border-accent transition-all"
        />
      </div>

      {/* Area */}
      <div className="space-y-3">
        <label className="text-[11px] font-black uppercase text-black/60 block">{lang === 'ar' ? 'المساحة' : 'Project Area'}</label>
        <input 
          type="text"
          value={formData.area || ''}
          onChange={(e) => setFormData((prev: any) => ({...prev, area: e.target.value}))}
          placeholder={lang === 'ar' ? "مثال: 450 م²" : "e.g. 450 SQM"}
          className="w-full bg-black/[0.02] border border-black/5 px-4 py-4.5 text-xs font-bold outline-none focus:border-accent transition-all"
        />
      </div>
    </div>
  );
}
