import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { corePackageTiers, destinationPackages } from "@/lib/public-offers";
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
            <p className="text-xs uppercase tracking-[0.28em] text-[var(--public-muted-text)]">
              {content.services.eyebrow}
            </p>
            <h1 className="text-5xl font-semibold tracking-tight text-[var(--public-primary-text)] sm:text-6xl">
              {content.services.title}
            </h1>
            <p className="max-w-3xl text-base leading-8 text-[var(--public-muted-text)]">
              {content.services.description}
            </p>
          </div>

          <div className="overflow-hidden rounded-[2.5rem] bg-[var(--public-card-surface)] shadow-[0_30px_100px_var(--public-shadow-color)]">
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
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--public-muted-text)]">
                {content.services.highlightEyebrow}
              </p>
              <h2 className="text-2xl font-semibold tracking-tight text-[var(--public-primary-text)]">
                {content.services.highlightTitle}
              </h2>
              <p className="text-sm leading-7 text-[var(--public-muted-text)]">
                {content.services.highlightDescription}
              </p>
            </div>
          </div>
        </div>

        <section
          className="space-y-6 rounded-[2.5rem] border border-[var(--public-card-border)] bg-[var(--public-card-surface)] px-6 py-8 shadow-[0_24px_70px_var(--public-shadow-color)]"
          id="packages"
        >
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--public-muted-text)]">
              Packages
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-[var(--public-primary-text)] sm:text-4xl">
              Four editorial tiers that build with your story.
            </h2>
            <p className="max-w-3xl text-sm leading-7 text-[var(--public-muted-text)]">
              Start with a concise session or scale into a fuller signature production.
              Each tier expands on the one before it so the progression is clear from
              first session to flagship coverage.
            </p>
          </div>

          <div className="grid gap-5 xl:grid-cols-2">
            {corePackageTiers.map((tier, index) => (
              <article
                key={tier.name}
                className="rounded-[2rem] border border-[var(--public-card-border)] bg-[var(--public-card-surface)] p-7 shadow-[0_16px_50px_var(--public-shadow-color)]"
              >
                <div className="space-y-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-3">
                      <p className="text-xs uppercase tracking-[0.24em] text-[var(--public-muted-text)]">
                        Tier {index + 1}
                      </p>
                      <h3 className="text-3xl font-semibold tracking-tight text-[var(--public-primary-text)]">
                        {tier.name}
                      </h3>
                      <p className="max-w-2xl text-sm leading-7 text-[var(--public-muted-text)]">
                        {tier.summary}
                      </p>
                    </div>
                    <span className="rounded-full border border-[var(--public-card-border)] bg-[var(--public-secondary-cta-background)] px-4 py-2 text-xs uppercase tracking-[0.18em] text-[var(--public-secondary-cta-text)]">
                      {index === 0 ? "Starting tier" : "Builds on prior tier"}
                    </span>
                  </div>

                  <p className="rounded-[1.5rem] bg-[var(--public-secondary-cta-background)] px-5 py-4 text-sm leading-7 text-[var(--public-secondary-cta-text)]">
                    {tier.progressionLabel}
                  </p>

                  <ul className="grid gap-3 text-sm text-[var(--public-muted-text)] sm:grid-cols-2">
                    {tier.inclusions.map((inclusion) => (
                      <li
                        key={inclusion}
                        className="rounded-[1.25rem] border border-[var(--public-card-border)] bg-[var(--public-shell-background)] px-4 py-3"
                      >
                        {inclusion}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section
          className="space-y-6 rounded-[2.5rem] bg-[var(--public-accent-panel-surface)] px-6 py-8 text-[var(--public-accent-panel-text)] shadow-[0_24px_70px_var(--public-shadow-color)]"
          id="destinations"
        >
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--public-accent-panel-text)] opacity-70">
              Destinations
            </p>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Travel-led portrait experiences with a higher-touch rhythm.
            </h2>
            <p className="max-w-3xl text-sm leading-7 text-[var(--public-accent-panel-text)] opacity-80">
              Destination sessions are framed as elevated, scenery-led experiences with
              more room for movement, atmosphere, and tailored planning support.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {destinationPackages.map((destination) => (
              <article
                key={destination.name}
                className="rounded-[2rem] border border-white/20 bg-black/10 p-6 shadow-[0_16px_40px_rgba(0,0,0,0.12)] backdrop-blur"
              >
                <div className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-[0.24em] text-[var(--public-accent-panel-text)] opacity-70">
                      {destination.summary}
                    </p>
                    <h3 className="text-2xl font-semibold tracking-tight">
                      {destination.name}
                    </h3>
                    <p className="text-sm leading-7 text-[var(--public-accent-panel-text)] opacity-80">
                      {destination.positioning}
                    </p>
                  </div>

                  <ul className="space-y-3 text-sm text-[var(--public-accent-panel-text)] opacity-90">
                    {destination.inclusions.map((inclusion) => (
                      <li
                        key={inclusion}
                        className="rounded-[1.25rem] border border-white/20 bg-white/10 px-4 py-3"
                      >
                        {inclusion}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="space-y-6" id="bookable-services">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--public-muted-text)]">
              Bookable services
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-[var(--public-primary-text)] sm:text-4xl">
              Current live booking options.
            </h2>
            <p className="max-w-3xl text-sm leading-7 text-[var(--public-muted-text)]">
              These are the active services currently connected to the live booking flow.
              Choose one below to continue into booking.
            </p>
          </div>

          {services.length === 0 ? (
            <p className="rounded-[2rem] border border-dashed border-[var(--public-card-border)] px-6 py-8 text-sm text-[var(--public-muted-text)]">
              No public services are available yet.
            </p>
          ) : (
            <div className="grid gap-5 lg:grid-cols-2">
              {services.map((service) => (
                <article
                  key={service.id}
                  className="rounded-[2rem] border border-[var(--public-card-border)] bg-[var(--public-card-surface)] p-7 shadow-[0_16px_50px_var(--public-shadow-color)]"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-3">
                      <p className="text-xs uppercase tracking-[0.24em] text-[var(--public-muted-text)]">
                        {service.duration} min · {service.price} minor units
                      </p>
                      <h3 className="text-3xl font-semibold tracking-tight text-[var(--public-primary-text)]">
                        {service.name}
                      </h3>
                      <p className="max-w-2xl text-sm leading-7 text-[var(--public-muted-text)]">
                        {service.description}
                      </p>
                    </div>

                    <Link
                      className="rounded-full bg-[var(--public-primary-cta-background)] px-5 py-3 text-sm font-semibold text-[var(--public-primary-cta-text)] transition hover:bg-[var(--public-primary-cta-hover)]"
                      href={`/book/${service.id}`}
                    >
                      {content.services.bookingCtaLabel}
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
