import type { Metadata } from "next";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { getPortfolioImages } from "@/lib/gallery";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Portfolio",
    description:
      "View the latest portrait, milestone, and editorial imagery from the studio portfolio.",
    alternates: {
      canonical: "/portfolio",
    },
    openGraph: {
      title: "Portfolio",
      description:
        "View the latest portrait, milestone, and editorial imagery from the studio portfolio.",
      url: "/portfolio",
    },
  };
}

export default async function PortfolioPage() {
  const images = await getPortfolioImages();

  return (
    <main className="px-6 py-14">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.28em] text-stone-500">Portfolio</p>
          <h1 className="text-5xl font-semibold tracking-tight text-stone-950 sm:text-6xl">
            Frames shaped by softness, movement, and intentional light.
          </h1>
          <p className="max-w-3xl text-base leading-8 text-stone-650">
            This gallery is pulled from the studio&apos;s portfolio storage bucket so it
            can stay up to date without rebuilding the booking flow or admin experience.
          </p>
        </div>

        <GalleryGrid images={images} />
      </div>
    </main>
  );
}
