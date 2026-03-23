import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getPortfolioImages } from "@/lib/gallery";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { getSiteMetadata } from "@/lib/site";

const site = getSiteMetadata();
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Portrait Photography in London",
    description:
      "Browse a premium portrait photography portfolio and book editorial, milestone, and personal branding sessions directly online.",
    alternates: {
      canonical: "/",
    },
    openGraph: {
      title: `${site.name} | Portrait Photography in London`,
      description:
        "Browse a premium portrait photography portfolio and book editorial, milestone, and personal branding sessions directly online.",
      url: "/",
    },
  };
}

export default async function HomePage() {
  const [services, images] = await Promise.all([
    prisma.service.findMany({
      where: { active: true },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
    getPortfolioImages(),
  ]);

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: site.name,
    description: site.description,
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
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div className="space-y-6">
            <p className="text-xs uppercase tracking-[0.32em] text-stone-500">Photographer portfolio & booking</p>
            <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-stone-950 sm:text-6xl">
              Portraits and stories with a cinematic, editorial calm.
            </h1>
            <p className="max-w-2xl text-base leading-8 text-stone-650">
              Explore the portfolio, choose a session, and request your booking date
              in one seamless flow built for mobile-first clients and a simple studio
              back office.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                className="rounded-full bg-stone-950 px-6 py-3 text-sm font-semibold text-stone-50 transition hover:bg-stone-700"
                href="/book"
              >
                Book a session
              </Link>
              <Link
                className="rounded-full border border-stone-300 px-6 py-3 text-sm font-semibold text-stone-900 transition hover:border-stone-500 hover:bg-white"
                href="/portfolio"
              >
                View portfolio
              </Link>
            </div>
          </div>

          <div className="rounded-[2.5rem] bg-[radial-gradient(circle_at_top,#e7cdb4_0%,#d5b18f_38%,#b98d67_100%)] p-8 text-stone-950 shadow-[0_40px_120px_rgba(88,56,31,0.2)]">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.75rem] bg-white/70 p-5">
                <p className="text-xs uppercase tracking-[0.24em] text-stone-500">Sessions</p>
                <p className="mt-3 text-3xl font-semibold">{services.length || "0"}</p>
                <p className="mt-2 text-sm text-stone-700">Active services ready to book</p>
              </div>
              <div className="rounded-[1.75rem] bg-stone-950/90 p-5 text-stone-50">
                <p className="text-xs uppercase tracking-[0.24em] text-stone-400">Approach</p>
                <p className="mt-3 text-3xl font-semibold">1:1</p>
                <p className="mt-2 text-sm text-stone-300">Guided direction from inquiry to delivery</p>
              </div>
            </div>
            <p className="mt-6 text-sm leading-7 text-stone-900/80">
              The site is designed to move from inspiration to booking quickly: no
              account creation, no off-platform scheduler, just a direct client path.
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 py-10">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-stone-500">Featured work</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-stone-950">
                A portfolio built around intimacy, atmosphere, and texture.
              </h2>
            </div>
            <Link className="text-sm font-semibold text-stone-700 underline-offset-4 hover:underline" href="/portfolio">
              See the full gallery
            </Link>
          </div>

          <GalleryGrid images={images.slice(0, 6)} />
        </div>
      </section>

      <section className="px-6 py-14">
        <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-3">
          {services.length === 0 ? (
            <p className="rounded-[2rem] border border-dashed border-stone-300 px-6 py-8 text-sm text-stone-500 md:col-span-3">
              No services have been published yet. Add services in the admin dashboard to
              populate this section.
            </p>
          ) : (
            services.map((service) => (
              <article key={service.id} className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-[0_16px_50px_rgba(58,39,26,0.08)]">
                <p className="text-xs uppercase tracking-[0.24em] text-stone-500">
                  {service.duration} min · {service.price} minor units
                </p>
                <h3 className="mt-4 text-2xl font-semibold tracking-tight text-stone-950">
                  {service.name}
                </h3>
                <p className="mt-3 text-sm leading-7 text-stone-600">{service.description}</p>
              </article>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
