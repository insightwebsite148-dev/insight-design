/**
 * Seed Hero Images Script
 * Uses Firebase Admin (service account) to write Cloudinary URLs to Firestore.
 * 
 * Usage: node scripts/seed-heroes.mjs
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createSign } from 'crypto';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load service account
const sa = JSON.parse(readFileSync(resolve(__dirname, '../service-account.json'), 'utf8'));
const PROJECT_ID = sa.project_id;

// ---- JWT / OAuth2 Auth ----

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

// ---- Firestore REST ----

async function firestoreWrite(accessToken, collection, docId, fields) {
  const fieldPaths = Object.keys(fields).map(f => `updateMask.fieldPaths=${f}`).join('&');
  const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/${collection}/${docId}?${fieldPaths}`;

  const firestoreFields = {};
  for (const [key, value] of Object.entries(fields)) {
    firestoreFields[key] = { stringValue: value };
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

// ---- Cloudinary ----

const CLOUD_NAME = 'dzkc5pim7';
const UPLOAD_PRESET = 'ml_default';

async function uploadToCloudinary(sourceUrl, publicId) {
  const formData = new URLSearchParams();
  formData.append('file', sourceUrl);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('folder', 'insight-heroes');
  formData.append('public_id', publicId);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(`Cloudinary: ${JSON.stringify(data.error)}`);
  return data.secure_url;
}

// ---- Main ----

const PAGES = [
  {
    id: 'home',
    collection: 'settings',
    docId: 'general',
    field: 'heroImage',
    sourceUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=2560&q=90',
  },
  {
    id: 'about',
    collection: 'pages',
    docId: 'about',
    field: 'heroImage',
    sourceUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=2560&q=90',
  },
  {
    id: 'portfolio',
    collection: 'pages',
    docId: 'works',
    field: 'heroImage',
    sourceUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=2560&q=90',
  },
  {
    id: 'contact',
    collection: 'pages',
    docId: 'contact',
    field: 'heroImage',
    sourceUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=2560&q=90',
  },
];

async function main() {
  console.log('🚀 Starting Hero Images Seed...\n');

  // Step 1: Get access token
  console.log('🔑 Authenticating with Firebase...');
  const accessToken = await getAccessToken();
  console.log('   ✅ Authenticated!\n');

  for (const page of PAGES) {
    try {
      // Step 2: Upload to Cloudinary
      console.log(`📸 [${page.id.toUpperCase()}] Uploading to Cloudinary...`);
      const url = await uploadToCloudinary(page.sourceUrl, `hero_${page.id}`);
      console.log(`   ✅ Uploaded: ${url}`);

      // Step 3: Save to Firestore
      console.log(`   💾 Saving to Firestore (${page.collection}/${page.docId})...`);
      await firestoreWrite(accessToken, page.collection, page.docId, { [page.field]: url });
      console.log(`   ✅ Saved!\n`);
    } catch (err) {
      console.error(`   ❌ Error for ${page.id}:`, err.message, '\n');
    }
  }

  console.log('🎉 Done! All hero images seeded successfully.');
}

main();
