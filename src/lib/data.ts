/**
 * Server-side data fetching via Firestore REST API.
 * Used in Server Components for SSR/SSG — zero client JS overhead.
 * Falls back gracefully if fetch fails; client-side onSnapshot picks up.
 */

const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
const BASE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

// ─── Firestore Value Parsers ───────────────────────────────────────

function parseValue(val: any): any {
  if (!val) return null;
  if ('stringValue' in val) return val.stringValue;
  if ('integerValue' in val) return Number(val.integerValue);
  if ('doubleValue' in val) return val.doubleValue;
  if ('booleanValue' in val) return val.booleanValue;
  if ('nullValue' in val) return null;
  if ('timestampValue' in val) return val.timestampValue;
  if ('mapValue' in val) return parseFields(val.mapValue.fields || {});
  if ('arrayValue' in val) return (val.arrayValue.values || []).map((v: any) => parseValue(v));
  return null;
}

function parseFields(fields: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {};
  if (!fields) return result;
  for (const [key, val] of Object.entries(fields)) {
    result[key] = parseValue(val);
  }
  return result;
}

// ─── Core Fetch Helpers ────────────────────────────────────────────

export async function getDocument(path: string): Promise<Record<string, any> | null> {
  try {
    const res = await fetch(`${BASE_URL}/${path}?key=${API_KEY}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    if (!json.fields) return null;
    return parseFields(json.fields);
  } catch (e) {
    console.error(`[SSR] Failed to fetch document: ${path}`, e);
    return null;
  }
}

export async function getCollection(collectionPath: string): Promise<Record<string, any>[]> {
  try {
    const res = await fetch(`${BASE_URL}/${collectionPath}?key=${API_KEY}&pageSize=200`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    if (!json.documents) return [];
    return json.documents.map((doc: any) => ({
      id: doc.name.split('/').pop(),
      ...parseFields(doc.fields || {}),
    }));
  } catch (e) {
    console.error(`[SSR] Failed to fetch collection: ${collectionPath}`, e);
    return [];
  }
}

// ─── Convenience Data Fetchers ─────────────────────────────────────

export const getSettings = () => getDocument('settings/general');
export const getThemeSettings = () => getDocument('settings/theme');
export const getProjects = () => getCollection('projects');
export const getClients = () => getCollection('clients');
export const getCategories = () => getCollection('categories');
export const getPageData = (slug: string) => getDocument(`pages/${slug}`);
