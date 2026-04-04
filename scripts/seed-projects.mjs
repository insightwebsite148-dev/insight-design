/**
 * Seed Best Works Projects
 * Reads images from local folder, uploads to Cloudinary, creates projects in Firestore.
 */

import { readdirSync, readFileSync } from 'fs';
import { resolve, dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { createSign } from 'crypto';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Configuration
const CLOUD_NAME = 'dzkc5pim7';
const UPLOAD_PRESET = 'ml_default';
const FOLDER_PATH = Object.values({p: 'c:\\Users\\decor establishment\\Desktop\\last version of insight\\insight\\our works photos'})[0];

// Load service account & project ID
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

// ---- Cloudinary ----
async function uploadToCloudinary(filePath, publicId) {
  const fileBuffer = readFileSync(filePath);
  const base64 = `data:image/jpeg;base64,${fileBuffer.toString('base64')}`;

  const formData = new URLSearchParams();
  formData.append('file', base64);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('folder', 'insight-projects');
  // formData.append('public_id', publicId); // optional

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(`Cloudinary error: ${JSON.stringify(data.error)}`);
  return data.secure_url;
}

// ---- Firestore ----
async function firestoreCreate(accessToken, collection, docId, fields) {
  const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/${collection}?documentId=${docId}`;

  const firestoreFields = {};
  for (const [key, value] of Object.entries(fields)) {
    if (typeof value === 'boolean') {
      firestoreFields[key] = { booleanValue: value };
    } else if (Array.isArray(value)) {
      firestoreFields[key] = { 
        arrayValue: { 
          values: value.map(v => ({ stringValue: v })) 
        } 
      };
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

  if (!res.ok && res.status !== 409) { // 409 means document already exists
    const err = await res.json();
    console.error("Firestore error details:", JSON.stringify(err));
    throw new Error(JSON.stringify(err.error));
  } else if (res.status === 409) {
    // If exists, patch it
    const patchUrl = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/${collection}/${docId}`;
    const patchRes = await fetch(patchUrl, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ fields: firestoreFields }),
    });
    if (!patchRes.ok) {
       const err = await patchRes.json();
       console.error("Firestore patch error details:", JSON.stringify(err));
       throw new Error(JSON.stringify(err.error));
    }
  }
  return true;
}


async function main() {
  console.log('🚀 Starting Projects Seed...\n');
  
  // 1. Read files
  const files = readdirSync(FOLDER_PATH).filter(f => f.match(/\.(jpg|jpeg|png)$/i));
  if (files.length === 0) {
    console.log('❌ No images found in folder.');
    return;
  }
  
  console.log(`📁 Found ${files.length} images.`);

  console.log('🔑 Authenticating with Firebase...');
  const accessToken = await getAccessToken();
  console.log('   ✅ Authenticated!\n');

  // Define 4 projects to distribute the photos into
  const projectsTemplates = [
    {
      id: 'villa-project-01',
      title: 'تشطيب فيلا فاخرة - التجمع الخامس',
      description: 'تنفيذ أعمال التشطيبات والديكورات الداخلية لفيلا سكنية فاخرة بأحدث الخامات العصرية.',
      category: 'Villa',
      location: 'New Cairo',
      completionDate: '2023-10-15',
      featured: true
    },
    {
      id: 'apartment-project-02',
      title: 'تجديد شقة مودرن - الشيخ زايد',
      description: 'إعادة تصميم وتشطيب شقة سكنية بالكامل بنمط مودرن معاصر واستغلال أمثل للمساحات.',
      category: 'Apartments',
      location: 'Sheikh Zayed',
      completionDate: '2023-08-20',
      featured: true
    },
    {
      id: 'admin-project-03',
      title: 'تجهيز مقر إداري - المعادي',
      description: 'تشطيب وتجهيز مقر شركة إداري شامل أعمال الكهرباء والتيار الخفيف والفرش المكتبي.',
      category: 'Administrative',
      location: 'Maadi',
      completionDate: '2024-01-10',
      featured: false
    },
    {
      id: 'commercial-project-04',
      title: 'تشطيب معرض تجاري - مصر الجديدة',
      description: 'تنفيذ أعمال الديكورات والإضاءة لمعرض تجاري راقي لعرض المنتجات بشكل جذاب.',
      category: 'Commercial',
      location: 'Heliopolis',
      completionDate: '2023-05-05',
      featured: false
    }
  ];

  // Distribute files among projects
  const chunkSize = Math.ceil(files.length / projectsTemplates.length);
  const chunks = [];
  for (let i = 0; i < files.length; i += chunkSize) {
    chunks.push(files.slice(i, i + chunkSize));
  }

  for (let i = 0; i < projectsTemplates.length; i++) {
    const project = projectsTemplates[i];
    const projectFiles = chunks[i] || [];
    if (projectFiles.length === 0) continue;

    console.log(`\n🏗️ Creating Project: ${project.title}`);
    const uploadedUrls = [];

    // Upload images
    for (const file of projectFiles) {
      try {
        console.log(`   📸 Uploading ${file}...`);
        const filePath = join(FOLDER_PATH, file);
        const url = await uploadToCloudinary(filePath, `${project.id}_${file}`);
        uploadedUrls.push(url);
      } catch(err) {
        console.error(`   ❌ Failed to upload ${file}: ${err.message}`);
      }
    }

    if (uploadedUrls.length > 0) {
      // Save to Firestore
      console.log(`   💾 Saving project to Firestore...`);
      try {
        await firestoreCreate(accessToken, 'projects', project.id, {
          title: project.title,
          description: project.description,
          category: project.category,
          location: project.location,
          completionDate: project.completionDate,
          featured: project.featured,
          createdAt: new Date(),
          images: uploadedUrls
        });
        console.log(`   ✅ Project Saved Successfully!`);
      } catch (err) {
        console.error(`   ❌ Failed to save project: ${err.message}`);
      }
    }
  }

  console.log('\n🎉 All projects and photos processed successfully!');
}

main();
