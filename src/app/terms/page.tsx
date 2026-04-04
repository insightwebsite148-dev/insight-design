import PageHero from '@/components/PageHero';
import { getSettings } from '@/lib/data';

export const metadata = {
  title: 'Terms of Use | Insight Design',
  description: 'Terms of Use and Conditions for Insight Design',
};

export default async function TermsPage() {
  const settings = await getSettings();
  
  return (
    <div className="flex flex-col bg-surface min-h-screen">
      <PageHero 
        title="Terms of Use" 
        subtitle="Last updated: October 2023" 
        height="40vh"
      /> 
      <section className="py-24 px-6 bg-white shrink-0">
        <div className="max-w-4xl mx-auto prose prose-neutral">
          <h2>1. Introduction</h2>
          <p>Welcome to {settings?.brandName || 'Insight Design'}. By accessing our website, you agree to these Terms of Use.</p>
          
          <h2>2. Intellectual Property</h2>
          <p>All content on this website, including projects, images, and text, is the property of {settings?.brandName || 'Insight Design'} and is protected by copyright laws.</p>

          <h2>3. Modifications</h2>
          <p>We reserve the right to modify these terms at any time. Your continued use of the site constitutes acceptance of the new terms.</p>
          
          <h2>4. Contact</h2>
          <p>If you have any questions about these Terms, please contact us at {settings?.email || 'info@insightdesign.com'}.</p>
        </div>
      </section>
    </div>
  );
}
