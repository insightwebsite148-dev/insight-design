'use client';

import Hero from '@/components/Hero';
import FeaturedSlider from '@/components/FeaturedSlider';
import ProductGrid from '@/components/products/ProductGrid';
import CategorySection from '@/components/CategorySection';
import FeaturesSection from '@/components/FeaturesSection';
import StatsBar from '@/components/StatsBar';
import OurClients from '@/components/OurClients';
import LocationSection from '@/components/LocationSection';
import MapSection from '@/components/MapSection';
import CTASection from '@/components/CTASection';

interface HomePageClientProps {
  settings: any;
  projects: any[];
  clients: any[];
  categories: any[];
}

export default function HomePageClient({ settings, projects, clients, categories }: HomePageClientProps) {
  return (
    <div className="flex flex-col">
      <Hero initialSettings={settings} />
      <FeaturedSlider initialProjects={projects} initialSettings={settings} />
      <ProductGrid initialProjects={projects} />
      <FeaturesSection />
      <CategorySection />
      <StatsBar initialSettings={settings} />
      <OurClients initialClients={clients} initialSettings={settings} />
      <LocationSection initialSettings={settings} />
      <MapSection initialSettings={settings} />
      <CTASection initialSettings={settings} initialCategories={categories} />
    </div>
  );
}
