import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getPortfolioImages } from "@/lib/gallery";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { getSiteMetadata } from "@/lib/site";
import { getSiteContent } from "@/lib/site-content";

const site = getSiteMetadata();
const processStages = [
  {
    name: "Enquiry",
    description:
      "Choose a package or starting path and submit an initial booking request.",
  },
  {
    name: "Planning",
    description:
      "We review goals, references, and direction together before the session.",
  },
  {
    name: "Session",
    description:
      "The shoot itself is guided with calm pacing, direction, and room to settle in.",
  },
  {
    name: "Delivery",
    description:
      "Your edited gallery and follow-up assets are delivered after the session.",
  },
] as const;

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
            <p className="text-xs uppercase tracking-[0.32em] text-[var(--public-muted-text)]">
              {content.home.eyebrow}
            </p>
            <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-[var(--public-primary-text)] sm:text-6xl">
              {content.home.title}
            </h1>
            <p className="max-w-2xl text-base leading-8 text-[var(--public-muted-text)]">
              {content.home.description}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                className="rounded-full bg-[var(--public-primary-cta-background)] px-6 py-3 text-sm font-semibold text-[var(--public-primary-cta-text)] transition hover:bg-[var(--public-primary-cta-hover)]"
                href="/book"
              >
                {content.home.primaryCtaLabel}
              </Link>
              <Link
                className="rounded-full border border-[var(--public-secondary-cta-border)] bg-[var(--public-secondary-cta-background)] px-6 py-3 text-sm font-semibold text-[var(--public-secondary-cta-text)] transition hover:bg-[var(--public-secondary-cta-hover)]"
                href="/portfolio"
              >
                {content.home.secondaryCtaLabel}
              </Link>
            </div>
          </div>

          <div className="grid gap-5">
            <div className="relative overflow-hidden rounded-[2.75rem] bg-[var(--public-card-surface)] shadow-[0_40px_120px_var(--public-shadow-color)]">
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
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-6 py-8 text-[var(--public-image-overlay-text)]">
                <p className="text-xs uppercase tracking-[0.24em] text-[var(--public-image-overlay-muted-text)]">
                  {heroImage.name}
                </p>
                <p className="mt-3 max-w-md text-sm leading-7 text-[var(--public-image-overlay-text)]">
                  {heroImage.caption}
                </p>
              </div>
            </div>

            <div className="rounded-[2.5rem] bg-[var(--public-accent-panel-surface)] p-8 text-[var(--public-accent-panel-text)] shadow-[0_40px_120px_var(--public-shadow-color)]">
              <p className="text-xs uppercase tracking-[0.24em] text-[color:color-mix(in_srgb,var(--public-accent-panel-text)_70%,transparent)]">
                {content.home.spotlightEyebrow}
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                {content.home.spotlightTitle}
              </h2>
              <p className="mt-4 text-sm leading-7 text-[color:color-mix(in_srgb,var(--public-accent-panel-text)_82%,transparent)]">
                {content.home.spotlightDescription}
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.75rem] bg-[color:color-mix(in_srgb,var(--public-secondary-cta-background)_88%,white)] p-5">
                  <p className="text-3xl font-semibold">{content.home.primaryStatValue}</p>
                  <p className="mt-2 text-sm text-[color:color-mix(in_srgb,var(--public-accent-panel-text)_78%,transparent)]">
                    {content.home.primaryStatLabel}
                  </p>
                </div>
                <div className="rounded-[1.75rem] bg-[var(--public-dark-panel-surface)] p-5 text-[var(--public-dark-panel-text)]">
                  <p className="text-3xl font-semibold">{content.home.secondaryStatValue}</p>
                  <p className="mt-2 text-sm text-[color:color-mix(in_srgb,var(--public-dark-panel-text)_82%,transparent)]">
                    {content.home.secondaryStatLabel}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-6">
        <div className="mx-auto max-w-6xl rounded-[2.75rem] border border-[var(--public-card-border)] bg-[var(--public-card-surface)] px-6 py-8 shadow-[0_24px_70px_var(--public-shadow-color)] sm:px-8">
          <div className="max-w-3xl space-y-3">
            <p className="text-xs uppercase tracking-[0.28em] text-[var(--public-muted-text)]">
              Process
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-[var(--public-primary-text)] sm:text-4xl">
              A calm editorial journey from first enquiry to final delivery.
            </h2>
            <p className="text-sm leading-7 text-[var(--public-muted-text)]">
              The experience is designed to feel considered at every stage: clear at the
              beginning, collaborative in planning, gently directed during the session,
              and polished in delivery.
            </p>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-4">
            {processStages.map((stage, index) => (
              <article
                key={stage.name}
                className="rounded-[2rem] border border-[var(--public-card-border)] bg-[var(--public-shell-background)] px-5 py-6"
              >
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--public-secondary-cta-background)] text-sm font-semibold text-[var(--public-secondary-cta-text)]">
                    {index + 1}
                  </span>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--public-primary-text)]">
                    {stage.name}
                  </p>
                </div>
                <p className="mt-4 text-sm leading-7 text-[var(--public-muted-text)]">
                  {stage.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-10">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-[var(--public-muted-text)]">
                {content.home.galleryEyebrow}
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--public-primary-text)]">
                {content.home.galleryTitle}
              </h2>
            </div>
            <Link
              className="text-sm font-semibold text-[var(--public-muted-text)] underline-offset-4 hover:text-[var(--public-primary-text)] hover:underline"
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
              <p className="text-xs uppercase tracking-[0.28em] text-[var(--public-muted-text)]">
                {content.home.servicesEyebrow}
              </p>
              <h2 className="text-3xl font-semibold tracking-tight text-[var(--public-primary-text)]">
                {content.home.servicesTitle}
              </h2>
            </div>
            <p className="max-w-2xl text-sm leading-7 text-[var(--public-muted-text)]">
              {content.home.servicesDescription}
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {services.length === 0 ? (
              <p className="rounded-[2rem] border border-dashed border-[var(--public-card-border)] px-6 py-8 text-sm text-[var(--public-muted-text)] md:col-span-3">
                No services have been published yet. Add services in the admin dashboard
                to populate this section.
              </p>
            ) : (
              services.map((service) => (
                <article
                  key={service.id}
                  className="rounded-[2rem] border border-[var(--public-card-border)] bg-[var(--public-card-surface)] p-6 shadow-[0_16px_50px_var(--public-shadow-color)]"
                >
                  <p className="text-xs uppercase tracking-[0.24em] text-[var(--public-muted-text)]">
                    {service.duration} min · {service.price} minor units
                  </p>
                  <h3 className="mt-4 text-2xl font-semibold tracking-tight text-[var(--public-primary-text)]">
                    {service.name}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-[var(--public-muted-text)]">
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
