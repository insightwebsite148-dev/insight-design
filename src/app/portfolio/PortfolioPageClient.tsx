'use client';

import { useState } from 'react';
import FilterBar from '@/components/FilterBar';
import ProjectCard from '@/components/ProjectCard';
import PageHero from '@/components/PageHero';
import { useSettings } from '@/context/SettingsContext';

export default function PortfolioPageClient({ initialData, initialProjects }: { initialData?: any; initialProjects?: any[] }) {
  const { projects: globalProjects, categories: globalCategories } = useSettings();
  
  const projects = globalProjects.length > 0 ? globalProjects : (initialProjects || []);
  const categories = globalCategories || [];
  
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');

  const heroData = {
    heroHeadline: initialData?.heroHeadline || 'Our Works',
    heroSubheadline: initialData?.heroSubheadline || 'Explore our latest architectural masterpieces and interior designs, crafted with precision and passion.',
    heroImage: initialData?.heroImage || ''
  };

  const uniqueLocations = Array.from(new Set(projects.map((p: any) => p.location).filter(Boolean)));

  const filteredProjects = projects.filter((p: any) => {
    const catMatch = selectedCategory === 'All' || p.category === selectedCategory;
    const locMatch = selectedLocation === 'All' || p.location === selectedLocation;
    return catMatch && locMatch;
  });

  return (
    <div className="bg-background min-h-screen">
      {/* Hero Header */}
      <PageHero 
        title={heroData.heroHeadline} 
        subtitle={heroData.heroSubheadline} 
        image={heroData.heroImage} 
        height="70vh"
        editCollection="pages"
        editDocumentId="works"
        imageField="heroImage"
      />

      <div className="max-w-[1600px] mx-auto px-6 py-24 pb-40">
        <FilterBar 
          categories={['All', ...categories.map((c: any) => c.name)]}
          locations={['All', ...uniqueLocations]}
          selectedCategory={selectedCategory}
          selectedLocation={selectedLocation}
          onCategoryChange={setSelectedCategory}
          onLocationChange={setSelectedLocation}
          categoryTree={categories}
        />
        
        {/* Dynamic Gallery Grid */}
        <div className="flex flex-wrap justify-center gap-4 sm:gap-8 lg:gap-12 xl:gap-8 mt-16 items-start">
          {filteredProjects.map((project: any, index: number) => (
            <div 
              key={project.id} 
              className="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-2rem)] xl:w-[calc(25%-1.5rem)] max-w-md xl:max-w-none flex-shrink-0"
            >
              <ProjectCard project={project} index={index} />
            </div>
          ))}
        </div>

        {projects.length === 0 && (
          <div className="py-20 text-center border border-dashed border-border">
            <p className="text-muted tracking-widest text-xs uppercase">No projects captured yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
