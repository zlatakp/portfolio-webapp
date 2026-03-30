import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ServiceCard } from "@/components/booking/ServiceCard";
import {
  corePackageTiers,
  supplementalOfferOptions,
  type PublicOfferIntent,
} from "@/lib/public-offers";

export const dynamic = "force-dynamic";

interface BookPageProps {
  searchParams: Promise<{
    package?: string;
  }>;
}

const packageIntentContent: Record<
  PublicOfferIntent,
  {
    eyebrow: string;
    title: string;
    description: string;
  }
> = {
  express: {
    eyebrow: "Express package",
    title: "Express is your current package path.",
    description:
      "You’re on the most concise premium route. Keep this path selected if you want a quick, polished session, then choose the live service that best fits the timing you want today.",
  },
  standard: {
    eyebrow: "Standard package",
    title: "Standard is your current package path.",
    description:
      "You’re on the fuller one-hour route. Keep this path selected if you want more room for outfit shifts and a broader finished gallery before moving into the live service choice.",
  },
  premium: {
    eyebrow: "Premium package",
    title: "Premium is your current package path.",
    description:
      "You’re on the expanded editorial route. Keep this path selected if you want more final images, more session time, and access to the wider image set after the shoot.",
  },
  platinum: {
    eyebrow: "Platinum package",
    title: "Platinum is your current package path.",
    description:
      "You’re on the highest-touch package path. Keep this selected if you want the most complete planning, beauty support, and concierge-style session setup.",
  },
  bespoke: {
    eyebrow: "Bespoke shoot",
    title: "Bespoke Shoot is your current package path.",
    description:
      "You’re on the tailored route. Use the live service selection below as the next booking step, then shape the finer details during planning.",
  },
  consultation: {
    eyebrow: "Consultation",
    title: "Consultation is your current package path.",
    description:
      "You’re on the guidance-first route. Use the live service selection below to choose the strongest starting point, then refine the package direction with support.",
  },
};

function getPackageIntent(value?: string): PublicOfferIntent | null {
  if (
    value === "express" ||
    value === "standard" ||
    value === "premium" ||
    value === "platinum" ||
    value === "bespoke" ||
    value === "consultation"
  ) {
    return value;
  }

  return null;
}

const bookingPathOptions = [
  ...corePackageTiers.map((tier) => ({
    name: tier.name,
    bookingIntent: tier.bookingIntent,
    summary: `${tier.price} · ${tier.shootingTime} · ${tier.editedImageCount} edited`,
    detail: tier.outfitAllowance,
  })),
  ...supplementalOfferOptions.map((option) => ({
    name: option.name,
    bookingIntent: option.bookingIntent,
    summary: option.summary,
    detail: option.description,
  })),
] as const;

const bookingEntryDefaultContent = {
  eyebrow: "Booking entry",
  title: "Choose the package path you want to book from.",
  description:
    "Select a package path to open the live booking actions inside that package surface. The live services stay the same, but they now appear as the next step inside the path you choose.",
};

export default async function BookPage({ searchParams }: BookPageProps) {
  const params = await searchParams;
  const packageIntent = getPackageIntent(params.package);
  const services = await prisma.service.findMany({
    where: {
      active: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  const activeContent = packageIntent
    ? packageIntentContent[packageIntent]
    : bookingEntryDefaultContent;

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fcf7f1_0%,#f3e8db_100%)] px-6 py-10 text-stone-950">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.28em] text-stone-500">Step 1</p>
          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
            Choose your package path, then continue into the live booking flow.
          </h1>
          <p className="max-w-3xl text-base leading-7 text-stone-600">
            The package paths and live services now sit in one booking-entry surface, so
            you can hold the bigger package decision and the next booking step together
            without losing your place.
          </p>
          <div className="flex flex-wrap gap-4 text-sm font-semibold text-stone-700">
            <Link
              className="underline-offset-4 hover:underline"
              href="/services#packages"
            >
              Compare packages again
            </Link>
            <Link className="underline-offset-4 hover:underline" href="/">
              Back to homepage
            </Link>
          </div>
        </div>

        <section className="rounded-[1.75rem] border border-stone-300 bg-white/70 px-5 py-5 shadow-[0_18px_40px_rgba(50,30,10,0.05)]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.22em] text-stone-500">
                Travel note
              </p>
              <p className="max-w-3xl text-sm leading-7 text-stone-600">
                If your city is not represented in the live services yet, use the
                destination travel hub to check confirmed or planned travel windows, or
                register interest for a new city before you continue.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                className="inline-flex rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-900 transition hover:bg-stone-100"
                href="/destinations#travel-availability"
              >
                See travel availability
              </Link>
              <Link
                className="inline-flex rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-900 transition hover:bg-stone-100"
                href="/destinations#city-interest"
              >
                Request a city
              </Link>
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-stone-300 bg-white/75 px-6 py-6 shadow-[0_18px_40px_rgba(50,30,10,0.08)]">
          <div className="space-y-5">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.24em] text-stone-500">
                Package-first booking
              </p>
              <h2 className="text-2xl font-semibold tracking-tight text-stone-950">
                Select the package path you want, then book from inside that path.
              </h2>
              <p className="max-w-3xl text-sm leading-7 text-stone-600">
                The six paths stay visible in one fixed order. When you select one, the
                live bookable services open inside that package surface instead of
                appearing as a separate section below.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {bookingPathOptions.map((option) => {
                const isSelected = option.bookingIntent === packageIntent;
                const optionContent = packageIntentContent[option.bookingIntent];

                return (
                  <article
                    key={option.bookingIntent}
                    className={`rounded-[1.75rem] border transition ${
                      isSelected
                        ? "border-stone-950 bg-stone-950 text-stone-50 shadow-[0_18px_36px_rgba(41,28,19,0.18)] md:col-span-2 xl:col-span-3"
                        : "border-stone-300 bg-white text-stone-700"
                    }`}
                  >
                    <div className="p-5">
                      <div className={isSelected ? "grid gap-6 xl:grid-cols-[0.78fr_1.22fr]" : ""}>
                        <div className="space-y-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="space-y-2">
                              <p className="text-[11px] uppercase tracking-[0.2em] opacity-70">
                                {isSelected ? "Current booking path" : "Available path"}
                              </p>
                              <h3 className="text-2xl font-semibold tracking-tight">
                                {option.name}
                              </h3>
                            </div>

                            <Link
                              className={`inline-flex rounded-full px-4 py-2 text-sm font-semibold transition ${
                                isSelected
                                  ? "border border-stone-700 bg-stone-50 text-stone-950 hover:bg-stone-200"
                                  : "border border-stone-300 bg-stone-950 text-stone-50 hover:bg-stone-700"
                              }`}
                              href={`/book?package=${option.bookingIntent}`}
                            >
                              {isSelected ? "Selected" : "Choose path"}
                            </Link>
                          </div>

                          <div className="space-y-2">
                            <p className="text-sm opacity-80">{option.summary}</p>
                            <p className="text-sm leading-7 opacity-80">{option.detail}</p>
                          </div>

                          {isSelected ? (
                            <div className="rounded-[1.4rem] border border-stone-700 bg-stone-900/80 px-4 py-4 text-stone-100">
                              <p className="text-xs uppercase tracking-[0.2em] text-stone-300">
                                {optionContent.eyebrow}
                              </p>
                              <h4 className="mt-2 text-xl font-semibold tracking-tight">
                                {optionContent.title}
                              </h4>
                              <p className="mt-3 text-sm leading-7 text-stone-300">
                                {optionContent.description}
                              </p>
                            </div>
                          ) : null}
                        </div>

                        {isSelected ? (
                          <div className="space-y-4 rounded-[1.5rem] border border-stone-700 bg-stone-50 px-4 py-4 text-stone-950">
                            <div className="space-y-3">
                              <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                                Live booking actions
                              </p>
                              <h4 className="text-2xl font-semibold tracking-tight">
                                Book a live service from inside {option.name}.
                              </h4>
                              <p className="text-sm leading-7 text-stone-600">
                                The selected package path stays visible here while you
                                choose the real live service record that will take you
                                into booking next.
                              </p>
                            </div>

                            {services.length === 0 ? (
                              <p className="rounded-[1.5rem] border border-dashed border-stone-300 px-5 py-6 text-sm text-stone-500">
                                No services are available for booking yet.
                              </p>
                            ) : (
                              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                                {services.map((service) => (
                                  <ServiceCard
                                    key={service.id}
                                    packageIntent={option.bookingIntent}
                                    packageName={option.name}
                                    service={service}
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {!packageIntent ? (
              <div className="rounded-[1.75rem] border border-dashed border-stone-300 bg-stone-50 px-5 py-5">
                <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                  {activeContent.eyebrow}
                </p>
                <h3 className="mt-2 text-xl font-semibold tracking-tight text-stone-950">
                  {activeContent.title}
                </h3>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-stone-600">
                  {activeContent.description}
                </p>
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
}
