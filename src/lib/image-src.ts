export function isSupabasePublicStorageUrl(src: string): boolean {
  return src.includes(".supabase.co/storage/v1/object/public/");
}

