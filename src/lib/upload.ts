import { uploadToCloudinary } from './cloudinary';

/**
 * Uploads an image blob to Cloudinary and returns the secure URL.
 * @param blob The image blob to upload
 * @param path The path (ignored for simple Cloudinary unsigned uploads)
 * @returns Promise<string> The download URL
 */
export async function uploadImage(blob: Blob, path: string): Promise<string> {
  const file = blob instanceof File ? blob : new File([blob], path, { type: blob.type });
  return uploadToCloudinary(file);
}

/**
 * Handles the paste event for an input/textarea and uploads an image if found.
 */
export async function handleClipboardPaste(
  e: React.ClipboardEvent,
  onUpload: (url: string) => void,
  folder: string = 'uploads',
  onLoading?: (loading: boolean) => void
) {
  const items = e.clipboardData?.items;
  if (!items) return;
  
  for (let i = 0; i < items.length; i++) {
    if (items[i].type.indexOf('image') !== -1) {
      const blob = items[i].getAsFile();
      if (!blob) continue;

      // Prevent default paste if it's an image
      e.preventDefault();
      
      try {
        console.log(`Starting clipboard image upload to ${folder}...`);
        onLoading?.(true);
        
        const extension = blob.type.split('/')[1] || 'jpg';
        const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${extension}`;
        
        const url = await uploadImage(blob, fileName);
        console.log('Upload successful:', url);
        onUpload(url);
      } catch (error) {
        console.error('Failed to upload pasted image:', error);
        alert('Image upload failed. Please check your connection and try again.');
      } finally {
        onLoading?.(false);
      }
      return true; // Image was handled
    }
  }
  return false; // No image found, let default paste happen
}
