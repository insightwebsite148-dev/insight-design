import { Metadata } from 'next';
import { getPageData, getProjects, getSettings } from '@/lib/data';
import PortfolioPageClient from './PortfolioPageClient';

export async function generateMetadata(): Promise<Metadata> {
  const [pageData, settings] = await Promise.all([
    getPageData('works'),
    getSettings(),
  ]);

  const brandName = settings?.brandName || 'Insight Design & Construction';

  return {
    title: `Portfolio | ${brandName}`,
    description: pageData?.heroSubheadline || `Explore our architectural portfolio — luxury residential, commercial, and interior design projects by ${brandName}.`,
    openGraph: {
      title: `Portfolio | ${brandName}`,
      description: pageData?.heroSubheadline || `Explore our architectural portfolio`,
      images: pageData?.heroImage ? [{ url: pageData.heroImage }] : [],
    },
  };
}

export default async function PortfolioPage() {
  const [pageData, projects] = await Promise.all([
    getPageData('works'),
    getProjects(),
  ]);
  return <PortfolioPageClient initialData={pageData} initialProjects={projects} />;
}
