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
  title: "Choose the package path you want to anchor first.",
  description:
    "All six paths stay visible here so you can compare them before selecting the live service that best fits your timing and session setup.",
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

        <section className="rounded-[2rem] border border-stone-300 bg-white/75 px-6 py-6 shadow-[0_18px_40px_rgba(50,30,10,0.08)]">
          <div className="grid gap-8 xl:grid-cols-[1fr_0.88fr]">
            <div className="space-y-5">
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-[0.24em] text-stone-500">
                  Package paths
                </p>
                <h2 className="text-2xl font-semibold tracking-tight text-stone-950">
                  Keep all six entry paths visible while you choose.
                </h2>
                <p className="max-w-3xl text-sm leading-7 text-stone-600">
                  The four signature packages stay in front first, followed by the
                  bespoke and consultation routes, so the current path is always visible
                  without hiding the other valid ways to begin.
                </p>
              </div>

              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {bookingPathOptions.map((option) => {
                  const isSelected = option.bookingIntent === packageIntent;

                  return (
                    <Link
                      key={option.bookingIntent}
                      className={`rounded-[1.5rem] border px-5 py-4 transition ${
                        isSelected
                          ? "border-stone-950 bg-stone-950 text-stone-50 shadow-[0_16px_32px_rgba(41,28,19,0.18)]"
                          : "border-stone-300 bg-white text-stone-700 hover:border-stone-500"
                      }`}
                      href={`/book?package=${option.bookingIntent}`}
                    >
                      <p className="text-[11px] uppercase tracking-[0.2em] opacity-70">
                        {isSelected ? "Current path" : "Available path"}
                      </p>
                      <p className="mt-2 text-lg font-semibold">{option.name}</p>
                      <p className="mt-3 text-sm opacity-80">{option.summary}</p>
                      <p className="mt-2 text-xs leading-6 opacity-70">{option.detail}</p>
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="space-y-5 rounded-[1.75rem] border border-stone-300 bg-stone-50 px-5 py-5">
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-[0.24em] text-stone-500">
                  {activeContent.eyebrow}
                </p>
                <h3 className="text-2xl font-semibold tracking-tight text-stone-950">
                  {activeContent.title}
                </h3>
                <p className="text-sm leading-7 text-stone-600">
                  {activeContent.description}
                </p>
              </div>

              <div className="rounded-[1.4rem] border border-stone-300 bg-white px-4 py-4">
                <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                  Step 2
                </p>
                <p className="mt-2 text-sm leading-7 text-stone-600">
                  Choose one of the live bookable services below. The selected package
                  path stays as your current context while you continue into the booking
                  flow.
                </p>
              </div>

              <div className="rounded-[1.4rem] border border-dashed border-stone-300 px-4 py-4">
                <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                  Current order
                </p>
                <p className="mt-2 text-sm leading-7 text-stone-600">
                  Express, Standard, Premium, Platinum, Bespoke Shoot, Consultation.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-stone-200 pt-8">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.24em] text-stone-500">
                Live services
              </p>
              <h2 className="text-2xl font-semibold tracking-tight text-stone-950">
                Choose the live service that fits this package path today.
              </h2>
              <p className="max-w-3xl text-sm leading-7 text-stone-600">
                The package decision and the current live service list now live together
                in one place, so you can move directly from path selection into booking.
              </p>
            </div>

            <div className="mt-6">
              {services.length === 0 ? (
                <p className="rounded-[2rem] border border-dashed border-stone-300 px-6 py-8 text-sm text-stone-500">
                  No services are available for booking yet.
                </p>
              ) : (
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {services.map((service) => (
                    <ServiceCard key={service.id} service={service} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
