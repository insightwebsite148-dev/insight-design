/**
 * Seed Project Categories
 * Uses Firebase Admin (service account) to write categories to Firestore.
 * 
 * Usage: node scripts/seed-categories.mjs
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createSign } from 'crypto';

const __dirname = dirname(fileURLToPath(import.meta.url));
const sa = JSON.parse(readFileSync(resolve(__dirname, '../service-account.json'), 'utf8'));
const PROJECT_ID = sa.project_id;

// ---- Auth ----
function base64url(data) {
  return Buffer.from(data).toString('base64url');
}

async function getAccessToken() {
  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const payload = base64url(JSON.stringify({
    iss: sa.client_email,
    scope: 'https://www.googleapis.com/auth/datastore',
    aud: sa.token_uri,
    iat: now,
    exp: now + 3600,
  }));
  const signInput = `${header}.${payload}`;
  const sign = createSign('RSA-SHA256');
  sign.update(signInput);
  const signature = sign.sign(sa.private_key, 'base64url');
  const jwt = `${signInput}.${signature}`;

  const res = await fetch(sa.token_uri, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Auth failed: ${JSON.stringify(data)}`);
  return data.access_token;
}

// ---- Firestore ----
async function firestoreSet(accessToken, collection, docId, fields) {
  const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/${collection}/${docId}`;

  const firestoreFields = {};
  for (const [key, value] of Object.entries(fields)) {
    if (typeof value === 'number') {
      firestoreFields[key] = { integerValue: String(value) };
    } else {
      firestoreFields[key] = { stringValue: value || '' };
    }
  }

  const res = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ fields: firestoreFields }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(JSON.stringify(err.error));
  }
  return true;
}

// ---- Categories Data ----
// Structure: { id, name, parentId (optional), badge (optional), order }

const CATEGORIES = [
  // 1. Contracting (مقاولات)
  { id: 'contracting', name: 'Contracting', parentId: '', badge: '', order: 1 },

  // 2. Finishing (تشطيبات) + subcategories
  { id: 'finishing', name: 'Finishing', parentId: '', badge: '', order: 2 },
  { id: 'finishing-administrative', name: 'Administrative', parentId: 'finishing', badge: '', order: 1 },
  { id: 'finishing-commercial', name: 'Commercial', parentId: 'finishing', badge: '', order: 2 },
  { id: 'finishing-residential', name: 'Residential', parentId: 'finishing', badge: '', order: 3 },
  // Residential sub-subcategories
  { id: 'finishing-residential-villa', name: 'Villa', parentId: 'finishing-residential', badge: '', order: 1 },
  { id: 'finishing-residential-duplex', name: 'Duplex', parentId: 'finishing-residential', badge: '', order: 2 },
  { id: 'finishing-residential-apartments', name: 'Apartments', parentId: 'finishing-residential', badge: '', order: 3 },

  // 3. Furnishing (الفرش) - New
  { id: 'furnishing', name: 'Furnishing', parentId: '', badge: 'جديد', order: 3 },

  // 4. Maintenance (صيانة) - Coming Soon
  { id: 'maintenance', name: 'Maintenance', parentId: '', badge: 'قريباً', order: 4 },
];

async function main() {
  console.log('🚀 Seeding Project Categories...\n');

  console.log('🔑 Authenticating...');
  const accessToken = await getAccessToken();
  console.log('   ✅ Authenticated!\n');

  for (const cat of CATEGORIES) {
    try {
      const indent = cat.parentId ? (cat.parentId.includes('-') ? '      ' : '   ') : '';
      console.log(`${indent}📂 [${cat.name}]${cat.badge ? ` (${cat.badge})` : ''}...`);
      
      await firestoreSet(accessToken, 'categories', cat.id, {
        name: cat.name,
        parentId: cat.parentId,
        badge: cat.badge,
        order: cat.order,
      });
      
      console.log(`${indent}   ✅ Saved!`);
    } catch (err) {
      console.error(`   ❌ Error for ${cat.name}:`, err.message);
    }
  }

  console.log('\n🎉 Done! All categories seeded.');
}

main();
