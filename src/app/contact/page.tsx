import { Metadata } from 'next';
import { getPageData, getSettings } from '@/lib/data';
import ContactPageClient from './ContactPageClient';

export async function generateMetadata(): Promise<Metadata> {
  const [pageData, settings] = await Promise.all([
    getPageData('contact'),
    getSettings(),
  ]);

  const brandName = settings?.brandName || 'Insight Design & Construction';

  return {
    title: `Contact Us | ${brandName}`,
    description: pageData?.heroSubheadline || `Get in touch with ${brandName}. Have a project in mind? Let us discuss how we can bring your vision to life.`,
    openGraph: {
      title: `Contact | ${brandName}`,
      description: pageData?.heroSubheadline || `Contact ${brandName}`,
      images: pageData?.heroImage ? [{ url: pageData.heroImage }] : [],
    },
  };
}

export default async function ContactPage() {
  const [pageData, settings] = await Promise.all([
    getPageData('contact'),
    getSettings(),
  ]);
  return <ContactPageClient initialData={pageData} initialSettings={settings} />;
}
