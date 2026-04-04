/**
 * Adds an admin to system_admins via Firestore REST API using the service account.
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

async function firestoreCreate(accessToken, collection, docId, fields) {
  const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/${collection}?documentId=${docId}`;

  const firestoreFields = {};
  for (const [key, value] of Object.entries(fields)) {
    if (typeof value === 'boolean') {
      firestoreFields[key] = { booleanValue: value };
    } else if (value instanceof Date) {
      firestoreFields[key] = { timestampValue: value.toISOString() };
    } else {
      firestoreFields[key] = { stringValue: value || '' };
    }
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ fields: firestoreFields }),
  });

  if (!res.ok && res.status !== 409) {
    const err = await res.json();
    throw new Error(JSON.stringify(err.error));
  } else if (res.status === 409) {
    // Patch instead
    const patchUrl = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/${collection}/${docId}`;
    const patchRes = await fetch(patchUrl, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ fields: firestoreFields }),
    });
    if (!patchRes.ok) throw new Error("Patch failed");
  }
  return true;
}

async function main() {
  const email = 'insight.design.construction@gmail.com'.trim().toLowerCase();
  const adminId = email.replace(/[^a-zA-Z0-9]/g, '_');

  console.log(`Adding admin: ${email}...`);
  try {
    const token = await getAccessToken();
    await firestoreCreate(token, 'system_admins', adminId, {
      email: email,
      role: 'admin',
      addedAt: new Date()
    });
    console.log(`✅ Admin ${email} successfully added directly to Firestore!`);
  } catch (err) {
    console.error(`❌ Failed:`, err);
  }
}

main();
