const fs = require('fs');
const path = require('path');
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, doc, updateDoc } = require('firebase/firestore');
require('dotenv').config({ path: '.env.local' });

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

async function uploadToCloudinary(filePath) {
  const fileBuffer = fs.readFileSync(filePath);
  
  const formData = new FormData();
  const blob = new Blob([fileBuffer]);
  formData.append('file', blob);
  formData.append('upload_preset', uploadPreset);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || 'Failed to upload to Cloudinary');
  }

  return data.secure_url;
}

async function runMigration() {
  console.log('--- Starting Project Image Migration ---');
  
  const baseDir = path.join(process.cwd(), 'insight projects');
  // Detect the exact folder name (handling the special character)
  const subDirs = fs.readdirSync(baseDir);
  const targetDirName = subDirs.find(d => d.startsWith('Beet watan')) || 'Beet watan';
  const targetPath = path.join(baseDir, targetDirName);
  
  console.log(`Reading images from: ${targetPath}`);
  const files = fs.readdirSync(targetPath).filter(f => 
    /\.(jpg|jpeg|png|webp|gif)$/i.test(f)
  );

  if (files.length === 0) {
    console.error('No images found in the target directory.');
    return;
  }
  console.log(`Found ${files.length} images.`);

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  // Fetch Projects
  const projectsCol = collection(db, 'projects');
  const snapshot = await getDocs(projectsCol);
  const projects = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
  
  console.log(`Found ${projects.length} projects in Firestore.`);

  for (let i = 0; i < projects.length; i++) {
    const project = projects[i];
    // Map images: reuse the 11 images for projects sequentially
    const imageFile = files[i % files.length];
    const filePath = path.join(targetPath, imageFile);
    
    try {
      console.log(`[${i+1}/${projects.length}] Uploading ${imageFile} for project: ${project.id}...`);
      const imageUrl = await uploadToCloudinary(filePath);
      
      const projectRef = doc(db, 'projects', project.id);
      await updateDoc(projectRef, {
        image: imageUrl,
        beforeImage: imageUrl
      });
      
      console.log(`Successfully updated project ${project.id}`);
    } catch (err) {
      console.error(`Error processing project ${project.id}:`, err);
    }
  }

  console.log('\n--- Migration Finished ---');
  process.exit(0);
}

runMigration().catch(console.error);
