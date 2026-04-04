'use client';

import { motion } from 'framer-motion';
import PageHero from '@/components/PageHero';
import Image from 'next/image';
import EditableWrapper from '@/components/EditableWrapper';

const defaultAbout = {
  heroHeadline: 'CRAFTING LUXURY \nREDEFINING SPACES',
  heroSubheadline: 'Insight Design and Construction is a premier architectural and interior design firm dedicated to creating breathtaking environments.',
  heroImage: '',
  storyTitle: 'Our Story',
  storyContent: 'Founded on the principles of excellence and innovation, Insight Design & Construction has grown into a leading force in the luxury design industry. Our team of visionaries and craftsmen work tirelessly to bring unique, high-end concepts to life, ensuring every detail reflects the personality and aspirations of our clients.',
  storyImage: '',
  mission: 'To push the boundaries of design and construction, delivering unparalleled luxury and quality in every project.',
  vision: 'To be the global benchmark for luxury living and innovative architectural design.'
};

export default function AboutPageClient({ initialData }: { initialData?: any }) {
  const d = initialData || {};
  const data = {
    heroHeadline: d.heroHeadline || defaultAbout.heroHeadline,
    heroSubheadline: d.heroSubheadline || defaultAbout.heroSubheadline,
    heroImage: d.heroImage || defaultAbout.heroImage,
    storyTitle: d.storyTitle || defaultAbout.storyTitle,
    storyContent: d.storyContent || defaultAbout.storyContent,
    storyImage: d.storyImage || defaultAbout.storyImage,
    mission: d.mission || defaultAbout.mission,
    vision: d.vision || defaultAbout.vision,
  };

  return (
    <div className="flex flex-col">
      {/* Hero Header */}
      <PageHero 
        title={data.heroHeadline} 
        subtitle={data.heroSubheadline} 
        image={data.heroImage} 
        height="80vh"
        editCollection="pages"
        editDocumentId="about"
        imageField="heroImage"
      />

      {/* Story Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <span className="text-accent text-[10px] font-bold uppercase tracking-[0.5em] mb-3 block">Legacies</span>
              <EditableWrapper
                collection="pages"
                documentId="about"
                field="storyTitle"
                value={data.storyTitle}
                type="text"
                styleField="storyTitle"
              >
                <h2 className="text-3xl md:text-4xl font-bold tracking-tighter uppercase">{data.storyTitle}</h2>
              </EditableWrapper>
            </div>
            <EditableWrapper
              collection="pages"
              documentId="about"
              field="storyContent"
              value={data.storyContent}
              type="text"
            >
              <p className="text-muted leading-relaxed text-sm md:text-base whitespace-pre-line">
                {data.storyContent}
              </p>
            </EditableWrapper>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative h-[500px] border border-border"
          >
            <EditableWrapper
              collection="pages"
              documentId="about"
              field="storyImage"
              value={data.storyImage}
              type="image"
            >
              {data.storyImage && (
                <Image src={data.storyImage} alt="Story" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
              )}
            </EditableWrapper>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 px-6 bg-surface border-y border-border">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-12 bg-white border border-border shadow-sm group"
          >
            <h3 className="text-xl font-bold tracking-tighter uppercase mb-6 group-hover:text-accent transition-colors">Our Mission</h3>
            <EditableWrapper
              collection="pages"
              documentId="about"
              field="mission"
              value={data.mission}
              type="text"
            >
              <p className="text-muted text-sm leading-relaxed">{data.mission}</p>
            </EditableWrapper>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="p-12 bg-white border border-border shadow-sm group"
          >
            <h3 className="text-xl font-bold tracking-tighter uppercase mb-6 group-hover:text-accent transition-colors">Our Vision</h3>
            <EditableWrapper
              collection="pages"
              documentId="about"
              field="vision"
              value={data.vision}
              type="text"
            >
              <p className="text-muted text-sm leading-relaxed">{data.vision}</p>
            </EditableWrapper>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
