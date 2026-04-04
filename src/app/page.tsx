import { getSettings, getProjects, getClients, getCategories } from '@/lib/data';
import HomePageClient from '@/components/home/HomePageClient';

export default async function Home() {
  const [settings, projects, clients, categories] = await Promise.all([
    getSettings(),
    getProjects(),
    getClients(),
    getCategories(),
  ]);

  return (
    <HomePageClient 
      settings={settings} 
      projects={projects} 
      clients={clients} 
      categories={categories} 
    />
  );
}
