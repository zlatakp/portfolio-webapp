import type { Metadata } from "next";
import Link from "next/link";
import { TravelInterestForm } from "@/components/public/TravelInterestForm";
import { destinationPackages } from "@/lib/public-offers";
import { getSiteContent } from "@/lib/site-content";
import {
  travelAvailabilityEntries,
  travelAvailabilityStatusMeta,
  type TravelAvailabilityStatus,
} from "@/lib/travel-availability";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();

  return {
    title: `Destination Travel | ${content.header.brandName}`,
    description:
      "Explore confirmed travel dates, planned destination windows, and city-interest requests for travel-led editorial portrait experiences.",
    alternates: {
      canonical: "/destinations",
    },
    openGraph: {
      title: `Destination Travel | ${content.header.brandName}`,
      description:
        "Explore confirmed travel dates, planned destination windows, and city-interest requests for travel-led editorial portrait experiences.",
      url: "/destinations",
    },
  };
}

export default function DestinationsPage() {
  const statusPanelClasses: Record<TravelAvailabilityStatus, string> = {
    confirmed:
      "border-[color:rgba(97,126,92,0.28)] bg-[color:rgba(97,126,92,0.12)]",
    planned:
      "border-[color:rgba(91,116,142,0.28)] bg-[color:rgba(91,116,142,0.12)]",
    "open-interest":
      "border-[color:rgba(158,128,88,0.28)] bg-[color:rgba(158,128,88,0.12)]",
  };

  return (
    <main className="px-6 py-14">
      <div className="mx-auto max-w-6xl space-y-10">
        <section className="grid gap-6 lg:grid-cols-[1fr_0.8fr] lg:items-end">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.28em] text-[var(--public-muted-text)]">
              Destination travel
            </p>
            <h1 className="text-5xl font-semibold tracking-tight text-[var(--public-primary-text)] sm:text-6xl">
              Travel availability for clients who want the city to shape the session.
            </h1>
            <p className="max-w-3xl text-base leading-8 text-[var(--public-muted-text)]">
              Use this page as the premium travel hub: see where dates are already
              confirmed, where a planning window is taking shape, and where open
              interest can still influence the next destination.
            </p>
          </div>

          <div className="rounded-[2.25rem] border border-[var(--public-card-border)] bg-[var(--public-card-surface)] px-6 py-6 shadow-[0_18px_48px_var(--public-shadow-color)]">
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--public-muted-text)]">
              Travel path
            </p>
            <p className="mt-3 text-sm leading-7 text-[var(--public-muted-text)]">
              Confirmed and planned cities can flow straight into the city-interest
              form below. If you already know you want the standard package ladder
              first, you can still return to the live booking path at any time.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                className="inline-flex rounded-full bg-[var(--public-primary-cta-background)] px-5 py-3 text-sm font-semibold text-[var(--public-primary-cta-text)] transition hover:bg-[var(--public-primary-cta-hover)]"
                href="#city-interest"
              >
                Register city interest
              </Link>
              <Link
                className="inline-flex rounded-full border border-[var(--public-secondary-cta-border)] bg-[var(--public-secondary-cta-background)] px-5 py-3 text-sm font-semibold text-[var(--public-secondary-cta-text)] transition hover:bg-[var(--public-secondary-cta-hover)]"
                href="/book"
              >
                Return to booking flow
              </Link>
            </div>
          </div>
        </section>

        <section className="space-y-5" id="travel-availability">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--public-muted-text)]">
              Travel availability
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-[var(--public-primary-text)] sm:text-4xl">
              Confirmed cities, planned windows, and open-interest destinations.
            </h2>
            <p className="max-w-3xl text-sm leading-7 text-[var(--public-muted-text)]">
              This stays intentionally editorial rather than calendar-heavy. Each entry
              gives you the city, the timing window, the current travel status, and the
              clearest next step into the interest form.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {travelAvailabilityEntries.map((entry) => {
              const status = travelAvailabilityStatusMeta[entry.status];

              return (
                <article
                  key={entry.id}
                  className="rounded-[2.25rem] border border-[var(--public-card-border)] bg-[var(--public-card-surface)] p-7 shadow-[0_18px_48px_var(--public-shadow-color)]"
                >
                  <div className="space-y-5">
                    <div className="space-y-3">
                      <div
                        className={`inline-flex rounded-full border px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--public-primary-text)] ${statusPanelClasses[entry.status]}`}
                      >
                        {status.label}
                      </div>
                      <div className="space-y-2">
                        <p className="text-xs uppercase tracking-[0.24em] text-[var(--public-muted-text)]">
                          {entry.windowLabel}
                        </p>
                        <h3 className="text-3xl font-semibold tracking-tight text-[var(--public-primary-text)]">
                          {entry.destination}
                        </h3>
                        <p className="text-sm leading-7 text-[var(--public-muted-text)]">
                          {entry.summary}
                        </p>
                      </div>
                    </div>

                    <div className="rounded-[1.5rem] border border-[var(--public-card-border)] bg-[var(--public-shell-background)] px-4 py-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-[var(--public-muted-text)]">
                        What this means
                      </p>
                      <p className="mt-2 text-sm leading-7 text-[var(--public-muted-text)]">
                        {status.description} {entry.supportingCopy}
                      </p>
                    </div>

                    <Link
                      className="inline-flex rounded-full bg-[var(--public-primary-cta-background)] px-5 py-3 text-sm font-semibold text-[var(--public-primary-cta-text)] transition hover:bg-[var(--public-primary-cta-hover)]"
                      href={`/destinations?city=${encodeURIComponent(
                        entry.city,
                      )}&travelAvailabilityId=${entry.id}#city-interest`}
                    >
                      Register interest for {entry.city}
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]" id="city-interest">
          <TravelInterestForm availabilityEntries={travelAvailabilityEntries} />

          <div className="space-y-5 rounded-[2.5rem] border border-[var(--public-card-border)] bg-[linear-gradient(180deg,var(--public-card-surface)_0%,var(--public-shell-background)_100%)] p-7 shadow-[0_18px_52px_var(--public-shadow-color)]">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--public-muted-text)]">
                Travel notes
              </p>
              <h2 className="text-3xl font-semibold tracking-tight text-[var(--public-primary-text)]">
                Travel interest works best when it stays specific.
              </h2>
              <p className="text-sm leading-7 text-[var(--public-muted-text)]">
                Share the city you want, the timing you have in mind, and any notes
                about mood, scenery, or occasion. That gives us a real planning signal
                instead of a vague expression of interest.
              </p>
            </div>

            <div className="space-y-4">
              <div className="rounded-[1.6rem] border border-[var(--public-card-border)] bg-[var(--public-card-surface)] px-5 py-5">
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--public-muted-text)]">
                  Best use cases
                </p>
                <ul className="mt-3 space-y-3 text-sm leading-7 text-[var(--public-muted-text)]">
                  <li>Use a confirmed city if the destination is already decided.</li>
                  <li>Use a planned city if you want to strengthen an in-progress route.</li>
                  <li>Use a new city name if your destination is not listed yet.</li>
                </ul>
              </div>

              <div className="rounded-[1.6rem] border border-[var(--public-card-border)] bg-[var(--public-card-surface)] px-5 py-5">
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--public-muted-text)]">
                  Prefer the core package ladder first?
                </p>
                <p className="mt-3 text-sm leading-7 text-[var(--public-muted-text)]">
                  You can still compare the core packages before returning here. The
                  travel hub is designed to complement that flow, not replace it.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Link
                    className="inline-flex rounded-full border border-[var(--public-secondary-cta-border)] bg-[var(--public-secondary-cta-background)] px-5 py-3 text-sm font-semibold text-[var(--public-secondary-cta-text)] transition hover:bg-[var(--public-secondary-cta-hover)]"
                    href="/services#packages"
                  >
                    Compare core packages
                  </Link>
                  <Link
                    className="inline-flex rounded-full border border-[var(--public-secondary-cta-border)] bg-[var(--public-secondary-cta-background)] px-5 py-3 text-sm font-semibold text-[var(--public-secondary-cta-text)] transition hover:bg-[var(--public-secondary-cta-hover)]"
                    href="/book"
                  >
                    Open live booking
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-5">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--public-muted-text)]">
              Destination packages
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-[var(--public-primary-text)] sm:text-4xl">
              Curated travel-led package ideas for clients planning further ahead.
            </h2>
            <p className="max-w-3xl text-sm leading-7 text-[var(--public-muted-text)]">
              These remain premium editorial package concepts rather than live calendar
              inventory. Use them to understand the kind of destination experience you
              want, then register interest or return to the live booking flow.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
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
          </div>
        </section>
      </div>
    </main>
  );
}
