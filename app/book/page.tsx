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
    title: "You’re continuing into booking from Express.",
    description:
      "You’ve chosen the concise starting point. Continue by selecting the live service that best fits your preferred timing and session setup.",
  },
  standard: {
    eyebrow: "Standard package",
    title: "You’re continuing into booking from Standard.",
    description:
      "You’ve chosen the fuller step-up option. Continue by selecting the live service that best matches the session pace you want next.",
  },
  premium: {
    eyebrow: "Premium package",
    title: "You’re continuing into booking from Premium.",
    description:
      "You’ve chosen the expanded editorial path. Continue by selecting the live service that best fits the experience you want to book today.",
  },
  platinum: {
    eyebrow: "Platinum package",
    title: "You’re continuing into booking from Platinum.",
    description:
      "You’ve chosen the most complete signature package. Continue by selecting the live service that best fits the premium coverage you want to begin with.",
  },
  bespoke: {
    eyebrow: "Bespoke shoot",
    title: "You’re continuing into booking from Bespoke Shoot.",
    description:
      "You’ve chosen the tailored path. Continue by selecting the live service that feels closest to your goals, and use the booking flow as the next step into planning.",
  },
  consultation: {
    eyebrow: "Consultation",
    title: "You’re continuing into booking from Consultation.",
    description:
      "You’ve chosen the guidance-first path. Continue by selecting the live service that feels like the best starting point, and use the booking flow to move the conversation forward.",
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
  })),
  ...supplementalOfferOptions.map((option) => ({
    name: option.name,
    bookingIntent: option.bookingIntent,
  })),
] as const;

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

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fcf7f1_0%,#f3e8db_100%)] px-6 py-10 text-stone-950">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.28em] text-stone-500">Step 1</p>
          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
            Choose the photography service you&apos;d like to book.
          </h1>
          <p className="max-w-3xl text-base leading-7 text-stone-600">
            Choose a starting package path below, then continue into the current live
            service-selection flow. Your selected package is the current path, not the
            only available offer, and the full package set remains available here while
            you compare and decide how to proceed.
          </p>
          <Link
            className="inline-flex items-center text-sm font-semibold text-stone-700 underline-offset-4 hover:underline"
            href="/"
          >
            Back to homepage
          </Link>
        </div>

        <section className="space-y-5 rounded-[2rem] border border-stone-300 bg-white/70 px-6 py-6 shadow-[0_18px_40px_rgba(50,30,10,0.08)]">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.24em] text-stone-500">Package paths</p>
            <h2 className="text-2xl font-semibold tracking-tight text-stone-950">
              Keep the full package set in view while choosing your starting path.
            </h2>
            <p className="max-w-3xl text-sm leading-7 text-stone-600">
              Every option below routes into the same live service-selection flow. If
              one package is already selected, it marks your current path while the rest
              of the package set remains fully available to compare and switch.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {bookingPathOptions.map((option) => {
              const isSelected = option.bookingIntent === packageIntent;

              return (
                <Link
                  key={option.bookingIntent}
                  className={`rounded-[1.5rem] border px-5 py-4 text-sm transition ${
                    isSelected
                      ? "border-stone-950 bg-stone-950 text-stone-50"
                      : "border-stone-300 bg-white text-stone-700 hover:border-stone-500"
                  }`}
                  href={`/book?package=${option.bookingIntent}`}
                >
                  <p className="text-xs uppercase tracking-[0.2em] opacity-70">
                    {isSelected ? "Current path" : "Available path"}
                  </p>
                  <p className="mt-2 text-lg font-semibold">{option.name}</p>
                </Link>
              );
            })}
          </div>

          {packageIntent ? (
            <div className="rounded-[1.5rem] border border-stone-300 bg-stone-50 px-5 py-5">
              <p className="text-xs uppercase tracking-[0.24em] text-stone-500">
                {packageIntentContent[packageIntent].eyebrow}
              </p>
              <h3 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
                {packageIntentContent[packageIntent].title}
              </h3>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-stone-600">
                {packageIntentContent[packageIntent].description}
              </p>
            </div>
          ) : null}
        </section>

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
    </main>
  );
}
