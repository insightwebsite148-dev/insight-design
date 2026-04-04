export const uploadToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);

  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  if (!uploadPreset || !cloudName) {
    throw new Error('Cloudinary environment variables are missing');
  }

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
    throw new Error(data.error?.message || 'Failed to upload file to Cloudinary');
  }

  return data.secure_url;
};

/**
 * Transforms a Cloudinary URL to include optimization parameters.
 * Adds f_auto (format) and q_auto (quality) and optional width.
 */
export const getOptimizedUrl = (url: string, width?: number): string => {
  if (!url || !url.includes('cloudinary.com')) return url;

  // Check if it already has transformations
  const parts = url.split('/upload/');
  if (parts.length !== 2) return url;

  let transformations = 'f_auto,q_auto';
  if (width) {
    transformations += `,w_${width},c_limit`;
  }

  return `${parts[0]}/upload/${transformations}/${parts[1]}`;
};
