import { SiteContentEditor } from "@/components/admin/SiteContentEditor";
import { getPublicThemePresets, getSiteContent } from "@/lib/site-content";

export default async function DashboardContentPage() {
  const content = await getSiteContent();
  const themePresets = getPublicThemePresets();

  return (
    <div className="mx-auto w-full max-w-[96rem]">
      <SiteContentEditor initialContent={content} themePresets={themePresets} />
    </div>
  );
}
