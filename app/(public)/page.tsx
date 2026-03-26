import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getPortfolioImages } from "@/lib/gallery";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { getSiteMetadata } from "@/lib/site";
import { getSiteContent } from "@/lib/site-content";

const site = getSiteMetadata();
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();

  return {
    title: content.home.metadataTitle,
    description: content.home.metadataDescription,
    alternates: {
      canonical: "/",
    },
    openGraph: {
      title: `${site.name} | ${content.home.metadataTitle}`,
      description: content.home.metadataDescription,
      url: "/",
    },
  };
}

export default async function HomePage() {
  const [content, services, images] = await Promise.all([
    getSiteContent(),
    prisma.service.findMany({
      where: { active: true },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
    getPortfolioImages(),
  ]);

  const featuredImages =
    images.length > 0
      ? images.slice(0, 6).map((image) => ({
          ...image,
          alt: image.name,
          caption: "Live portfolio image from the studio gallery.",
        }))
      : content.placeholderImages.portfolioGallery;

  const heroImage = content.placeholderImages.homeHero;
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: site.name,
    description: content.home.metadataDescription,
    url: site.baseUrl.toString(),
    image: site.ogImage,
    areaServed: "London",
    address: {
      "@type": "PostalAddress",
      addressLocality: "London",
      addressCountry: "GB",
    },
    email: process.env.PHOTOGRAPHER_EMAIL,
    priceRange: "$$",
    sameAs: [],
  };

  return (
    <main>
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        type="application/ld+json"
      />
      <section className="px-6 py-16 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="space-y-6">
            <p className="text-xs uppercase tracking-[0.32em] text-stone-500">
              {content.home.eyebrow}
            </p>
            <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-stone-950 sm:text-6xl">
              {content.home.title}
            </h1>
            <p className="max-w-2xl text-base leading-8 text-stone-650">
              {content.home.description}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                className="rounded-full bg-stone-950 px-6 py-3 text-sm font-semibold text-stone-50 transition hover:bg-stone-700"
                href="/book"
              >
                {content.home.primaryCtaLabel}
              </Link>
              <Link
                className="rounded-full border border-stone-300 px-6 py-3 text-sm font-semibold text-stone-900 transition hover:border-stone-500 hover:bg-white"
                href="/portfolio"
              >
                {content.home.secondaryCtaLabel}
              </Link>
            </div>
          </div>

          <div className="grid gap-5">
            <div className="relative overflow-hidden rounded-[2.75rem] bg-stone-200 shadow-[0_40px_120px_rgba(88,56,31,0.2)]">
              <div className="relative aspect-[4/5]">
                <Image
                  alt={heroImage.alt}
                  className="object-cover"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  src={heroImage.url}
                />
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-stone-950/80 via-stone-950/40 to-transparent px-6 py-8 text-stone-50">
                <p className="text-xs uppercase tracking-[0.24em] text-stone-200/75">
                  {heroImage.name}
                </p>
                <p className="mt-3 max-w-md text-sm leading-7 text-stone-100/90">
                  {heroImage.caption}
                </p>
              </div>
            </div>

            <div className="rounded-[2.5rem] bg-[radial-gradient(circle_at_top,#e7cdb4_0%,#d5b18f_38%,#b98d67_100%)] p-8 text-stone-950 shadow-[0_40px_120px_rgba(88,56,31,0.2)]">
              <p className="text-xs uppercase tracking-[0.24em] text-stone-600">
                {content.home.spotlightEyebrow}
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                {content.home.spotlightTitle}
              </h2>
              <p className="mt-4 text-sm leading-7 text-stone-900/80">
                {content.home.spotlightDescription}
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.75rem] bg-white/70 p-5">
                  <p className="text-3xl font-semibold">{content.home.primaryStatValue}</p>
                  <p className="mt-2 text-sm text-stone-700">
                    {content.home.primaryStatLabel}
                  </p>
                </div>
                <div className="rounded-[1.75rem] bg-stone-950/90 p-5 text-stone-50">
                  <p className="text-3xl font-semibold">{content.home.secondaryStatValue}</p>
                  <p className="mt-2 text-sm text-stone-300">
                    {content.home.secondaryStatLabel}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-10">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-stone-500">
                {content.home.galleryEyebrow}
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-stone-950">
                {content.home.galleryTitle}
              </h2>
            </div>
            <Link
              className="text-sm font-semibold text-stone-700 underline-offset-4 hover:underline"
              href="/portfolio"
            >
              See the full gallery
            </Link>
          </div>

          <GalleryGrid images={featuredImages} />
        </div>
      </section>

      <section className="px-6 py-14">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.28em] text-stone-500">
                {content.home.servicesEyebrow}
              </p>
              <h2 className="text-3xl font-semibold tracking-tight text-stone-950">
                {content.home.servicesTitle}
              </h2>
            </div>
            <p className="max-w-2xl text-sm leading-7 text-stone-600">
              {content.home.servicesDescription}
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {services.length === 0 ? (
              <p className="rounded-[2rem] border border-dashed border-stone-300 px-6 py-8 text-sm text-stone-500 md:col-span-3">
                No services have been published yet. Add services in the admin dashboard
                to populate this section.
              </p>
            ) : (
              services.map((service) => (
                <article
                  key={service.id}
                  className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-[0_16px_50px_rgba(58,39,26,0.08)]"
                >
                  <p className="text-xs uppercase tracking-[0.24em] text-stone-500">
                    {service.duration} min · {service.price} minor units
                  </p>
                  <h3 className="mt-4 text-2xl font-semibold tracking-tight text-stone-950">
                    {service.name}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-stone-600">
                    {service.description}
                  </p>
                </article>
              ))
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
