import { sidebar } from './sidebar';
import { header } from './header';
import { tabs } from './tabs';
import { settings, dashboard, stats, hero, slider, cursor, layout } from './settings';
import { projects } from './projects';
import { taxonomy } from './taxonomy';
import { clients } from './clients';
import { pages } from './pages';
import { marketing } from './marketing';
import { common } from './common';
import { theme } from './theme';
import { admins } from './admins';

export type AdminLanguage = 'en' | 'ar';

export const translations: Record<AdminLanguage, any> = {
  en: {
    sidebar: sidebar.en,
    header: header.en,
    tabs: tabs.en,
    settings: settings.en,
    dashboard: dashboard.en,
    projects: projects.en,
    stats: stats.en,
    hero: hero.en,
    slider: slider.en,
    cursor: cursor.en,
    layout: layout.en,
    theme: theme.en,
    taxonomy: taxonomy.en,
    clients: clients.en,
    pages: pages.en,
    marketing: marketing.en,
    common: common.en,
    admins: admins.en
  },
  ar: {
    sidebar: sidebar.ar,
    header: header.ar,
    tabs: tabs.ar,
    settings: settings.ar,
    dashboard: dashboard.ar,
    projects: projects.ar,
    stats: stats.ar,
    hero: hero.ar,
    slider: slider.ar,
    cursor: cursor.ar,
    layout: layout.ar,
    theme: theme.ar,
    taxonomy: taxonomy.ar,
    clients: clients.ar,
    pages: pages.ar,
    marketing: marketing.ar,
    common: common.ar,
    admins: admins.ar
  }
};
