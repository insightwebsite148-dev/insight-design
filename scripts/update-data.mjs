/**
 * Script to update general settings in Firestore.
 */
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createSign } from 'crypto';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load service account & project ID
const sa = JSON.parse(readFileSync(resolve(__dirname, '../service-account.json'), 'utf8'));
const PROJECT_ID = sa.project_id;

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

function convertValue(value) {
    if (typeof value === 'boolean') {
        return { booleanValue: value };
    } else if (typeof value === 'number') {
        return { doubleValue: value };
    } else if (value && typeof value === 'object') {
        // Simple map conversion
        const mapFields = {};
        for(const [k, v] of Object.entries(value)) {
            mapFields[k] = convertValue(v);
        }
        return { mapValue: { fields: mapFields } };
    } else {
        return { stringValue: value || '' };
    }
}

async function getDocument(accessToken, collection, docId) {
    const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/${collection}/${docId}`;
    const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
    });
    if (!res.ok) return null;
    return await res.json();
}

function parseFirestoreMap(fields) {
    const result = {};
    for (const [key, val] of Object.entries(fields)) {
        if ('stringValue' in val) result[key] = val.stringValue;
        else if ('booleanValue' in val) result[key] = val.booleanValue;
        else if ('mapValue' in val) result[key] = parseFirestoreMap(val.mapValue.fields || {});
    }
    return result;
}

async function firestoreUpdateSettings(accessToken) {
  const collection = 'settings';
  const docId = 'general';
  
  // 1. Fetch current settings to avoid overriding non-touched fields
  let currentSettings = {};
  try {
      const existingDoc = await getDocument(accessToken, collection, docId);
      if (existingDoc && existingDoc.fields) {
          currentSettings = parseFirestoreMap(existingDoc.fields);
      }
  } catch(err) {
      console.log('No existing general doc found or error fetching. Starting fresh.');
  }

  // 2. Merge new values
  const newFields = {
    ...currentSettings,
    whatsappNumber: '+20 11 00007003',
    address: '128 banq center, Cairo, Egypt, 11835',
    email: 'insight.design.construction@gmail.com',
    schema: {
       ...(currentSettings.schema || {}),
       facebook: 'https://www.facebook.com/Insight.Design.Construction',
       instagram: 'https://www.instagram.com/insightdesignandconstruction/',
       tiktok: 'https://www.tiktok.com/@insightdesigneg'
    }
  };

  // Convert to firestore fields
  const firestoreFields = {};
  for (const [key, value] of Object.entries(newFields)) {
      firestoreFields[key] = convertValue(value);
  }

  const patchUrl = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/${collection}/${docId}`;
  
  const res = await fetch(patchUrl, {
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

async function main() {
  console.log(`Updating site data...`);
  try {
    const token = await getAccessToken();
    await firestoreUpdateSettings(token);
    console.log(`✅ Data successfully pushed to Firestore!`);
  } catch (err) {
    console.error(`❌ Failed:`, err);
  }
}

main();
