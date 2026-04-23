import { Metadata } from 'next';
import { getSettings, getProjects, getCategories } from '@/lib/data';
import CategoryPageClient from './CategoryPageClient';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const categoryName = decodeURIComponent(slug);
  const settings = await getSettings();
  const brandName = settings?.brandName || 'Insight Design & Construction';

  return {
    title: `${categoryName} | ${brandName}`,
    description: `Explore our ${categoryName} collection — premium architectural and interior design projects by ${brandName}.`,
    openGraph: {
      title: `${categoryName} | ${brandName}`,
      description: `Explore our ${categoryName} collection`,
    },
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const categoryName = decodeURIComponent(slug);
  
  const [settings, projects, categories] = await Promise.all([
    getSettings(),
    getProjects(),
    getCategories(),
  ]);

  return (
    <CategoryPageClient 
      categoryName={categoryName}
      initialProjects={projects}
      initialCategories={categories}
      initialSettings={settings}
    />
  );
}
