import { Metadata } from 'next';
import { getPageData, getSettings } from '@/lib/data';
import AboutPageClient from './AboutPageClient';

export async function generateMetadata(): Promise<Metadata> {
  const [pageData, settings] = await Promise.all([
    getPageData('about'),
    getSettings(),
  ]);

  const brandName = settings?.brandName || 'Insight Design & Construction';
  const title = pageData?.heroHeadline || 'About Us';

  return {
    title: `${title} | ${brandName}`,
    description: pageData?.heroSubheadline || `Learn about ${brandName} — a premier architectural and interior design firm dedicated to creating breathtaking environments.`,
    openGraph: {
      title: `About | ${brandName}`,
      description: pageData?.heroSubheadline || `Learn about ${brandName}`,
      images: pageData?.heroImage ? [{ url: pageData.heroImage }] : [],
    },
  };
}

export default async function AboutPage() {
  const pageData = await getPageData('about');
  return <AboutPageClient initialData={pageData} />;
}
