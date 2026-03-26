import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSiteContent } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();

  return {
    title: content.services.metadataTitle,
    description: content.services.metadataDescription,
    alternates: {
      canonical: "/services",
    },
    openGraph: {
      title: content.services.metadataTitle,
      description: content.services.metadataDescription,
      url: "/services",
    },
  };
}

export default async function ServicesPage() {
  const [content, services] = await Promise.all([
    getSiteContent(),
    prisma.service.findMany({
      where: { active: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);
  const spotlightImage = content.placeholderImages.servicesSpotlight;

  return (
    <main className="px-6 py-14">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.28em] text-stone-500">
              {content.services.eyebrow}
            </p>
            <h1 className="text-5xl font-semibold tracking-tight text-stone-950 sm:text-6xl">
              {content.services.title}
            </h1>
            <p className="max-w-3xl text-base leading-8 text-stone-650">
              {content.services.description}
            </p>
          </div>

          <div className="overflow-hidden rounded-[2.5rem] bg-white shadow-[0_30px_100px_rgba(58,39,26,0.14)]">
            <div className="relative aspect-[4/5]">
              <Image
                alt={spotlightImage.alt}
                className="object-cover"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                src={spotlightImage.url}
              />
            </div>
            <div className="space-y-3 px-6 py-6">
              <p className="text-xs uppercase tracking-[0.24em] text-stone-500">
                {content.services.highlightEyebrow}
              </p>
              <h2 className="text-2xl font-semibold tracking-tight text-stone-950">
                {content.services.highlightTitle}
              </h2>
              <p className="text-sm leading-7 text-stone-600">
                {content.services.highlightDescription}
              </p>
            </div>
          </div>
        </div>

        {services.length === 0 ? (
          <p className="rounded-[2rem] border border-dashed border-stone-300 px-6 py-8 text-sm text-stone-500">
            No public services are available yet.
          </p>
        ) : (
          <div className="grid gap-5 lg:grid-cols-2">
            {services.map((service) => (
              <article
                key={service.id}
                className="rounded-[2rem] border border-stone-200 bg-white p-7 shadow-[0_16px_50px_rgba(58,39,26,0.08)]"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-3">
                    <p className="text-xs uppercase tracking-[0.24em] text-stone-500">
                      {service.duration} min · {service.price} minor units
                    </p>
                    <h2 className="text-3xl font-semibold tracking-tight text-stone-950">
                      {service.name}
                    </h2>
                    <p className="max-w-2xl text-sm leading-7 text-stone-600">
                      {service.description}
                    </p>
                  </div>

                  <Link
                    className="rounded-full bg-stone-950 px-5 py-3 text-sm font-semibold text-stone-50 transition hover:bg-stone-700"
                    href={`/book/${service.id}`}
                  >
                    {content.services.bookingCtaLabel}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
