import type { Metadata } from "next";
import Link from "next/link";
import { destinationPackages } from "@/lib/public-offers";
import { getSiteContent } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();

  return {
    title: `Destinations | ${content.header.brandName}`,
    description:
      "Explore curated destination portrait experiences designed for travel-led editorial sessions.",
    alternates: {
      canonical: "/destinations",
    },
    openGraph: {
      title: `Destinations | ${content.header.brandName}`,
      description:
        "Explore curated destination portrait experiences designed for travel-led editorial sessions.",
      url: "/destinations",
    },
  };
}

export default function DestinationsPage() {
  return (
    <main className="px-6 py-14">
      <div className="mx-auto max-w-6xl space-y-10">
        <section className="grid gap-6 lg:grid-cols-[1fr_0.8fr] lg:items-end">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.28em] text-[var(--public-muted-text)]">
              Destinations
            </p>
            <h1 className="text-5xl font-semibold tracking-tight text-[var(--public-primary-text)] sm:text-6xl">
              Travel-led portrait experiences with room for atmosphere.
            </h1>
            <p className="max-w-3xl text-base leading-8 text-[var(--public-muted-text)]">
              These destination offers are presented as premium editorial experiences:
              a clear starting point for clients considering travel, scenery-led pacing,
              and a more tailored planning rhythm.
            </p>
          </div>

          <div className="rounded-[2.25rem] border border-[var(--public-card-border)] bg-[var(--public-card-surface)] px-6 py-6 shadow-[0_18px_48px_var(--public-shadow-color)]">
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--public-muted-text)]">
              Booking path
            </p>
            <p className="mt-3 text-sm leading-7 text-[var(--public-muted-text)]">
              Destination offers remain curated presentation content for now. When you’re
              ready to move forward, return to the live services area to continue into the
              existing booking flow.
            </p>
            <Link
              className="mt-5 inline-flex rounded-full bg-[var(--public-primary-cta-background)] px-5 py-3 text-sm font-semibold text-[var(--public-primary-cta-text)] transition hover:bg-[var(--public-primary-cta-hover)]"
              href="/services#bookable-services"
            >
              Continue to booking options
            </Link>
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-3">
          {destinationPackages.map((destination) => (
            <article
              key={destination.name}
              className="rounded-[2.25rem] border border-[var(--public-card-border)] bg-[var(--public-card-surface)] p-7 shadow-[0_18px_48px_var(--public-shadow-color)]"
            >
              <div className="space-y-5">
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.24em] text-[var(--public-muted-text)]">
                    {destination.summary}
                  </p>
                  <h2 className="text-3xl font-semibold tracking-tight text-[var(--public-primary-text)]">
                    {destination.name}
                  </h2>
                  <p className="text-sm leading-7 text-[var(--public-muted-text)]">
                    {destination.positioning}
                  </p>
                </div>

                <ul className="space-y-3 text-sm text-[var(--public-muted-text)]">
                  {destination.inclusions.map((inclusion) => (
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
        </section>
      </div>
    </main>
  );
}
