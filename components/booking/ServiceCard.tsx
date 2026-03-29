import Link from "next/link";
import type { PublicOfferIntent } from "@/lib/public-offers";
import type { PublicService } from "./booking-types";

interface ServiceCardProps {
  packageIntent?: PublicOfferIntent;
  packageName?: string;
  service: PublicService;
}

export function ServiceCard({
  packageIntent,
  packageName,
  service,
}: ServiceCardProps) {
  const bookingHref = packageIntent
    ? `/book/${service.id}?package=${packageIntent}`
    : `/book/${service.id}`;

  return (
    <article className="flex h-full flex-col rounded-[1.75rem] border border-stone-200 bg-white p-6 shadow-[0_18px_60px_rgba(94,72,48,0.08)]">
      <p className="text-xs uppercase tracking-[0.28em] text-stone-500">
        {packageName ? `${packageName} booking path` : "Photography service"}
      </p>
      <h3 className="mt-4 text-2xl font-semibold tracking-tight text-stone-950">
        {service.name}
      </h3>
      <p className="mt-3 text-sm leading-7 text-stone-600">{service.description}</p>

      <div className="mt-6 flex items-center justify-between text-sm text-stone-700">
        <span>{service.duration} minutes</span>
        <span>{service.price} minor units</span>
      </div>

      <div className="mt-8">
        <Link
          className="inline-flex items-center justify-center rounded-full bg-stone-950 px-5 py-3 text-sm font-semibold text-stone-50 transition hover:bg-stone-700"
          href={bookingHref}
        >
          {packageName ? `Book from ${packageName}` : "Book now"}
        </Link>
      </div>
    </article>
  );
}
