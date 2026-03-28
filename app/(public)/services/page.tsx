import type { Metadata } from "next";
import Link from "next/link";
import { corePackageTiers, supplementalOfferOptions } from "@/lib/public-offers";
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

  return (
    <main className="px-6 py-14">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="space-y-4">
          <p className="text-xs uppercase tracking-[0.28em] text-[var(--public-muted-text)]">
            {content.services.eyebrow}
          </p>
          <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-[var(--public-primary-text)] sm:text-6xl">
            {content.services.title}
          </h1>
          <p className="max-w-3xl text-base leading-8 text-[var(--public-muted-text)]">
            {content.services.description}
          </p>
        </section>

        <section className="space-y-8" id="packages">
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

          <div className="rounded-[2.5rem] border border-[var(--public-card-border)] bg-[var(--public-card-surface)] p-6 shadow-[0_24px_70px_var(--public-shadow-color)]">
            <div className="grid gap-4 xl:grid-cols-4">
              {corePackageTiers.map((tier, index) => (
                <article
                  key={tier.name}
                  className="flex h-full flex-col rounded-[2rem] border border-[var(--public-card-border)] bg-[var(--public-shell-background)] p-6 shadow-[0_12px_36px_var(--public-shadow-color)]"
                >
                  <div className="flex h-full flex-col space-y-5">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--public-card-border)] bg-[var(--public-secondary-cta-background)] text-sm font-semibold text-[var(--public-secondary-cta-text)]">
                          {tier.sequence}
                        </span>
                        <div>
                          <p className="text-xs uppercase tracking-[0.24em] text-[var(--public-muted-text)]">
                            {index === 0 ? "Starting point" : "Builds on prior tier"}
                          </p>
                          <h3 className="mt-1 text-3xl font-semibold tracking-tight text-[var(--public-primary-text)]">
                            {tier.name}
                          </h3>
                        </div>
                      </div>
                      <p className="text-sm leading-7 text-[var(--public-muted-text)]">
                        {tier.summary}
                      </p>
                      <div className="rounded-[1.5rem] border border-[var(--public-card-border)] bg-[var(--public-card-surface)] px-5 py-4">
                        <p className="text-xs uppercase tracking-[0.2em] text-[var(--public-muted-text)]">
                          {tier.baseLabel}
                        </p>
                        <p className="mt-2 text-sm leading-7 text-[var(--public-primary-text)]">
                          {tier.additiveSummary}
                        </p>
                      </div>
                      <p className="text-sm leading-7 text-[var(--public-muted-text)]">
                        {tier.progressionLabel}
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-3">
                        <p className="text-xs uppercase tracking-[0.24em] text-[var(--public-muted-text)]">
                          {index === 0 ? "Included in Express" : `What ${tier.name} adds`}
                        </p>
                        <h4 className="text-xl font-semibold tracking-tight text-[var(--public-primary-text)]">
                          {index === 0
                            ? "The complete foundation for a concise editorial session."
                            : "A tighter view of the step-up value."}
                        </h4>
                      </div>

                      <ul className="grid gap-3 text-sm text-[var(--public-muted-text)]">
                        {tier.addedInclusions.map((inclusion) => (
                          <li
                            key={inclusion}
                            className="rounded-[1.25rem] border border-[var(--public-card-border)] bg-[var(--public-secondary-cta-background)] px-4 py-3 text-[var(--public-secondary-cta-text)]"
                          >
                            {inclusion}
                          </li>
                        ))}
                      </ul>

                      {index > 0 ? (
                        <p className="rounded-[1.25rem] border border-dashed border-[var(--public-card-border)] px-4 py-3 text-sm text-[var(--public-muted-text)]">
                          {tier.baseLabel}
                        </p>
                      ) : null}
                    </div>

                    <Link
                      className="mt-auto inline-flex w-fit rounded-full bg-[var(--public-primary-cta-background)] px-5 py-3 text-sm font-semibold text-[var(--public-primary-cta-text)] transition hover:bg-[var(--public-primary-cta-hover)]"
                      href={`/book?package=${tier.bookingIntent}`}
                    >
                      Continue with {tier.name}
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--public-muted-text)]">
              Additional paths
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-[var(--public-primary-text)] sm:text-4xl">
              Tailored or guidance-first ways to begin.
            </h2>
            <p className="max-w-3xl text-sm leading-7 text-[var(--public-muted-text)]">
              If you already know you need something more custom, or you want help
              choosing the right fit first, start with one of these guided entry points.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            {supplementalOfferOptions.map((option) => (
              <article
                key={option.name}
                className="rounded-[2rem] border border-[var(--public-card-border)] bg-[var(--public-card-surface)] p-7 shadow-[0_16px_50px_var(--public-shadow-color)]"
              >
                <div className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-[0.24em] text-[var(--public-muted-text)]">
                      {option.summary}
                    </p>
                    <h3 className="text-3xl font-semibold tracking-tight text-[var(--public-primary-text)]">
                      {option.name}
                    </h3>
                    <p className="max-w-2xl text-sm leading-7 text-[var(--public-muted-text)]">
                      {option.description}
                    </p>
                  </div>

                  <Link
                    className="inline-flex w-fit rounded-full bg-[var(--public-primary-cta-background)] px-5 py-3 text-sm font-semibold text-[var(--public-primary-cta-text)] transition hover:bg-[var(--public-primary-cta-hover)]"
                    href={`/book?package=${option.bookingIntent}`}
                  >
                    {option.name === "Bespoke Shoot"
                      ? "Start bespoke booking path"
                      : "Start with a consultation"}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section
          className="rounded-[2.5rem] border border-[var(--public-card-border)] bg-[var(--public-card-surface)] px-6 py-8 shadow-[0_18px_48px_var(--public-shadow-color)]"
          id="destinations"
        >
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--public-muted-text)]">
                Destination Packages
              </p>
              <h2 className="text-3xl font-semibold tracking-tight text-[var(--public-primary-text)] sm:text-4xl">
                Destination Packages, kept easy to discover.
              </h2>
              <p className="max-w-3xl text-sm leading-7 text-[var(--public-muted-text)]">
                Destination Packages now live on their own dedicated page so the services
                experience stays focused on package progression and live booking options,
                while travel-led storytelling still stays easy to discover.
              </p>
            </div>

            <Link
              className="inline-flex rounded-full border border-[var(--public-secondary-cta-border)] bg-[var(--public-secondary-cta-background)] px-5 py-3 text-sm font-semibold text-[var(--public-secondary-cta-text)] transition hover:bg-[var(--public-secondary-cta-hover)]"
              href="/destinations"
            >
              Explore Destination Packages
            </Link>
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
