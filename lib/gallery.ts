import { getSupabaseServerClient } from "@/lib/supabase";

interface GalleryImage {
  id: string;
  name: string;
  url: string;
}

/**
 * Returns public portfolio image metadata from the Supabase storage bucket.
 */
export async function getPortfolioImages(): Promise<GalleryImage[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return [];
  }

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase.storage.from("portfolio").list("gallery");

  if (error || !data) {
    return [];
  }

  return data.map((file) => ({
    id: file.id ?? file.name,
    name: file.name,
    url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/portfolio/gallery/${file.name}`,
  }));
}
