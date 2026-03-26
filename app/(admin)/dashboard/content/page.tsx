import { SiteContentEditor } from "@/components/admin/SiteContentEditor";
import { getSiteContent } from "@/lib/site-content";

export default async function DashboardContentPage() {
  const content = await getSiteContent();

  return <SiteContentEditor initialContent={content} />;
}
