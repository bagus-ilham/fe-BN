import { supabase } from "./supabase";

export const BUCKETS = {
  PRODUCTS: "product-images",
  REVIEWS: "review-images",
  SITE_ASSETS: "site-assets",
} as const;

export type BucketName = typeof BUCKETS[keyof typeof BUCKETS];

export async function uploadFile(
  file: File,
  bucket: BucketName = BUCKETS.PRODUCTS,
  path: string = ""
) {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = path ? `${path}/${fileName}` : fileName;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return {
      path: data.path,
      url: publicUrl,
      error: null
    };
  } catch (error: any) {
    console.error(`[STORAGE] Upload error:`, error);
    return {
      path: null,
      url: null,
      error: error.message || "Gagal mengunggah file"
    };
  }
}

