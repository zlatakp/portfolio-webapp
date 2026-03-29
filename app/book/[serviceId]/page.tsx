import Link from "next/link";
import { notFound } from "next/navigation";
import { TimeSlotPicker } from "@/components/booking/TimeSlotPicker";
import {
  corePackageTiers,
  supplementalOfferOptions,
  type PublicOfferIntent,
} from "@/lib/public-offers";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

interface BookingStepPageProps {
  params: Promise<{
    serviceId: string;
  }>;
  searchParams: Promise<{
    package?: string;
  }>;
}

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
    bookingIntent: tier.bookingIntent,
    name: tier.name,
  })),
  ...supplementalOfferOptions.map((option) => ({
    bookingIntent: option.bookingIntent,
    name: option.name,
  })),
];

export default async function BookingStepPage({
  params,
  searchParams,
}: BookingStepPageProps) {
  const { serviceId } = await params;
  const resolvedSearchParams = await searchParams;
  const packageIntent = getPackageIntent(resolvedSearchParams.package);
  const activePath = bookingPathOptions.find(
    (option) => option.bookingIntent === packageIntent,
  );
  const service = await prisma.service.findUnique({
    where: {
      id: serviceId,
    },
  });

  if (!service || !service.active) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fcf7f1_0%,#f3e8db_100%)] px-6 py-10 text-stone-950">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="space-y-4">
          <Link
            className="inline-flex items-center text-sm font-semibold text-stone-700 underline-offset-4 hover:underline"
            href={packageIntent ? `/book?package=${packageIntent}` : "/book"}
          >
            {activePath ? `Back to ${activePath.name}` : "Back to services"}
          </Link>
          {activePath ? (
            <p className="text-xs uppercase tracking-[0.24em] text-stone-500">
              Continuing from {activePath.name}
            </p>
          ) : null}
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            {service.name}
          </h1>
          <p className="max-w-2xl text-base leading-7 text-stone-600">
            {service.description}
          </p>
          {activePath ? (
            <p className="max-w-2xl text-sm leading-7 text-stone-600">
              This live service is the next booking step inside the {activePath.name}{" "}
              package path you selected on `/book`.
            </p>
          ) : null}
        </div>

        <TimeSlotPicker service={service} />
      </div>
    </main>
  );
}
