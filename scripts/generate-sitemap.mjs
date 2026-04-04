/**
 * Generates sitemap.xml at build time using project data from Firestore.
 * Reads the site domain from Firestore settings if available.
 * Runs as a post-build script: `node scripts/generate-sitemap.mjs`
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs';

// Try to read the siteUrl from the prerendered settings data
function getSiteUrl() {
  // Default fallback
  let siteUrl = process.env.SITE_URL || '';
  
  try {
    // Read the built index.html and try to extract siteUrl from the __NEXT_DATA__ or RSC payload
    // Simpler approach: read from env or fallback
    const envLocal = '.env.local';
    if (existsSync(envLocal)) {
      const envContent = readFileSync(envLocal, 'utf-8');
      const match = envContent.match(/SITE_URL=(.+)/);
      if (match) siteUrl = match[1].trim();
    }
  } catch (e) {
    // ignore
  }
  
  return siteUrl || 'https://example.com';
}

// Static pages
const staticPages = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/about', priority: '0.8', changefreq: 'monthly' },
  { path: '/portfolio', priority: '0.9', changefreq: 'weekly' },
  { path: '/contact', priority: '0.7', changefreq: 'monthly' },
];

// Read generated portfolio pages from build output
function getPortfolioIds() {
  const portfolioDir = './out/portfolio';
  if (!existsSync(portfolioDir)) return [];
  
  return readdirSync(portfolioDir, { withFileTypes: true })
    .filter(d => d.isDirectory() && d.name !== '[id]')
    .map(d => d.name);
}

function generateSitemap() {
  const SITE_URL = getSiteUrl();
  const portfolioIds = getPortfolioIds();
  const today = new Date().toISOString().split('T')[0];
  
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  // Static pages
  for (const page of staticPages) {
    xml += `
  <url>
    <loc>${SITE_URL}${page.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
  }

  // Dynamic portfolio pages
  for (const id of portfolioIds) {
    xml += `
  <url>
    <loc>${SITE_URL}/portfolio/${id}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`;
  }

  xml += `
</urlset>`;

  // Also generate robots.txt with correct domain
  const robotsTxt = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /admin/login
Disallow: /login
Disallow: /register

Sitemap: ${SITE_URL}/sitemap.xml
`;

  writeFileSync('./out/sitemap.xml', xml);
  writeFileSync('./out/robots.txt', robotsTxt);
  console.log(`✅ Sitemap generated with ${staticPages.length + portfolioIds.length} URLs (domain: ${SITE_URL})`);
}

generateSitemap();
