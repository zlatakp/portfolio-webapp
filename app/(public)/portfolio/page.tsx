import type { Metadata } from "next";
import Image from "next/image";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { getPortfolioImages } from "@/lib/gallery";
import { getSiteContent } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();

  return {
    title: content.portfolio.metadataTitle,
    description: content.portfolio.metadataDescription,
    alternates: {
      canonical: "/portfolio",
    },
    openGraph: {
      title: content.portfolio.metadataTitle,
      description: content.portfolio.metadataDescription,
      url: "/portfolio",
    },
  };
}

export default async function PortfolioPage() {
  const [content, images] = await Promise.all([getSiteContent(), getPortfolioImages()]);
  const galleryImages =
    images.length > 0
      ? images.map((image) => ({
          ...image,
          alt: image.name,
          caption: "Live portfolio image from the studio gallery.",
        }))
      : content.placeholderImages.portfolioGallery;
  const leadImage = content.placeholderImages.portfolioGallery[0];

  return (
    <main className="px-6 py-14">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.28em] text-stone-500">
              {content.portfolio.eyebrow}
            </p>
            <h1 className="text-5xl font-semibold tracking-tight text-stone-950 sm:text-6xl">
              {content.portfolio.title}
            </h1>
            <p className="max-w-3xl text-base leading-8 text-stone-650">
              {content.portfolio.description}
            </p>
          </div>

          <div className="relative overflow-hidden rounded-[2.5rem] bg-stone-200 shadow-[0_30px_100px_rgba(58,39,26,0.14)]">
            <div className="relative aspect-[4/5]">
              <Image
                alt={leadImage.alt}
                className="object-cover"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                src={leadImage.url}
              />
            </div>
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-stone-950/80 via-stone-950/40 to-transparent px-6 py-8 text-stone-50">
              <p className="text-xs uppercase tracking-[0.24em] text-stone-200/75">
                {content.portfolio.galleryEyebrow}
              </p>
              <h2 className="mt-3 text-2xl font-semibold">
                {content.portfolio.galleryTitle}
              </h2>
              <p className="mt-3 max-w-md text-sm leading-7 text-stone-100/90">
                {content.portfolio.galleryDescription}
              </p>
            </div>
          </div>
        </div>

        <GalleryGrid images={galleryImages} />
      </div>
    </main>
  );
}
