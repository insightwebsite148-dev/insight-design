import PageHero from '@/components/PageHero';
import { getSettings } from '@/lib/data';

export const metadata = {
  title: 'Privacy Policy | Insight Design',
  description: 'Privacy Policy for Insight Design',
};

export default async function PrivacyPage() {
  const settings = await getSettings();
  
  return (
    <div className="flex flex-col bg-surface min-h-screen">
      <PageHero 
        title="Privacy Policy" 
        subtitle="Last updated: October 2023" 
        height="40vh"
      /> 
      <section className="py-24 px-6 bg-white shrink-0">
        <div className="max-w-4xl mx-auto prose prose-neutral">
          <h2>1. Information We Collect</h2>
          <p>We may collect personal information such as your name, email address, and phone number when you voluntarily submit it through our contact forms or when communicating with {settings?.brandName || 'Insight Design'}.</p>
          
          <h2>2. How We Use Your Information</h2>
          <p>Your information is used strictly to provide you with our services, communicate about your projects, and improve our website experience. We do not sell your data to third parties.</p>

          <h2>3. Cookies and Tracking</h2>
          <p>We use standard analytics tools to track website performance and improve our marketing. You can manage your cookie preferences through your browser settings.</p>
          
          <h2>4. Contact Us</h2>
          <p>For privacy-related inquiries, please email us at {settings?.email || 'info@insightdesign.com'}.</p>
        </div>
      </section>
    </div>
  );
}
