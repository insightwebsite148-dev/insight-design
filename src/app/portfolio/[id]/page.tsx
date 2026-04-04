import { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ChevronLeft, ChevronRight, MapPin, Calendar, Layers } from 'lucide-react';
import Link from 'next/link';
import { getDocument, getCollection } from '@/lib/data';
import ProjectGallery from './ProjectGallery';

// SSG: Pre-generate all project pages for SEO
export async function generateStaticParams() {
  try {
    const projects = await getCollection('projects');
    return projects.map((project: any) => ({
      id: project.id,
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

async function getProject(id: string): Promise<any> {
  const data = await getDocument(`projects/${id}`);
  if (!data) return null;
  return { id, ...data };
}

// SEO Meta Data Generation
export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  const project = await getProject(id);
  if (!project) return { title: 'Project Not Found' };

  return {
    title: `${project.title} | Insight Design & Construction`,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      images: [{ url: project.images?.[0] || project.gallery?.[0] || project.image || '' }],
    },
  };
}

export default async function ProjectDetails(
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const project = await getProject(id);

  if (!project) notFound();

  return (
    <div className="bg-background pt-24 pb-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        {/* Navigation */}
        <Link href="/portfolio" className="inline-flex items-center space-x-3 text-[11px] font-bold uppercase tracking-[0.3em] text-muted hover:text-accent transition-colors mb-16 border border-border px-6 py-3 rounded-full hover:bg-black hover:border-black hover:text-white">
          <ChevronLeft size={16} />
          <span>Back to Portfolio</span>
        </Link>

        {/* Header */}
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 mb-20 items-end">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-6">
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-accent px-4 py-2 bg-accent/10 rounded-full">
                {project.category}
              </span>
              {(project.status === "Completed" || project.status === "In Progress") && (
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-muted px-4 py-2 border border-border rounded-full">
                  {project.status}
                </span>
              )}
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-[1.05] mb-8">
              {project.title}
            </h1>
          </div>

          <div className="w-full lg:w-1/3 grid grid-cols-2 gap-x-8 gap-y-10 border-l border-border pl-10">
            {project.location && <InfoBlock icon={<MapPin size={16} />} label="Location" value={project.location} />}
            {project.year && <InfoBlock icon={<Calendar size={16} />} label="Year" value={project.year} />}
            {project.category && <InfoBlock icon={<Layers size={16} />} label="Category" value={project.category} />}
            {project.area && <InfoBlock icon={<Layers size={16} />} label="Area" value={`${project.area} SQM`} />}
          </div>
        </div>

        {/* Gallery Grid via Web Component */}
        <ProjectGallery 
          images={project.images && project.images.length > 0 ? project.images : (project.gallery || [project.image || '/placeholder.png'])} 
          title={project.title} 
        />
      </div>
    </div>
  );
}

function InfoBlock({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="group">
      <div className="flex items-center space-x-2 text-accent mb-3 opacity-70 group-hover:opacity-100 transition-opacity">
        {icon}
        <span className="text-[10px] font-black uppercase tracking-[0.2em]">{label}</span>
      </div>
      <p className="font-medium text-lg capitalize">{value}</p>
    </div>
  );
}
