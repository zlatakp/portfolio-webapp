import { PortfolioUploader } from "@/components/admin/PortfolioUploader";
import { getSupabaseServerClient } from "@/lib/supabase";

export default async function DashboardPortfolioPage() {
  let files: Array<{ id: string; name: string; created_at?: string }> = [];

  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const supabase = getSupabaseServerClient();
    const { data } = await supabase.storage.from("portfolio").list("gallery");
    files =
      data?.map((file) => ({
        id: file.id ?? file.name,
        name: file.name,
        created_at: file.created_at ?? undefined,
      })) ?? [];
  }

  return (
    <PortfolioUploader initialFiles={files} />
  );
}
