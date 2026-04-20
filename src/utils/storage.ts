/**
 * MOCK Storage Utility — benangbaju (Mockup Mode)
 * Stubbed to simulate uploads and deletions safely.
 */

export const BUCKETS = {
  PRODUCTS: "product-images",
  REVIEWS: "review-images",
} as const;

export type BucketName = typeof BUCKETS[keyof typeof BUCKETS];

export async function uploadFile(
  file: File,
  bucket: BucketName = BUCKETS.PRODUCTS,
  path: string = ""
) {
  console.log(`[MOCK STORAGE] Uploading ${file.name} to ${bucket}`);
  
  // Simulate delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const mockPath = `${path ? path + "/" : ""}${Date.now()}-${file.name}`;
  
  return {
    path: mockPath,
    url: "https://placehold.co/600x400?text=Mock+Upload",
    error: null
  };
}

export async function deleteFile(path: string, bucket: BucketName = BUCKETS.PRODUCTS) {
  console.log(`[MOCK STORAGE] Deleting ${path} from ${bucket}`);
  return { success: true, error: null };
}

export function validateImage(file: File, maxSizeMB: number = 2) {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Tipe file tidak didukung. Gunakan JPG, PNG, WEBP, atau GIF.' };
  }

  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return { valid: false, error: `Ukuran file terlalu besar. Maksimal ${maxSizeMB}MB.` };
  }

  return { valid: true, error: null };
}
