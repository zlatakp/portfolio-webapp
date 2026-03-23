import Link from "next/link";
import { notFound } from "next/navigation";
import { BookingForm } from "@/components/booking/BookingForm";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

interface BookingConfirmPageProps {
  searchParams: Promise<{
    serviceId?: string;
  }>;
}

export default async function BookingConfirmPage({ searchParams }: BookingConfirmPageProps) {
  const { serviceId } = await searchParams;

  if (!serviceId) {
    notFound();
  }

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
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="space-y-4">
          <Link
            className="inline-flex items-center text-sm font-semibold text-stone-700 underline-offset-4 hover:underline"
            href={`/book/${service.id}`}
          >
            Back to slot selection
          </Link>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Complete your booking
          </h1>
          <p className="max-w-2xl text-base leading-7 text-stone-600">
            Share your contact details so we can confirm your {service.name} session and
            send the follow-up emails.
          </p>
        </div>

        <BookingForm service={service} />
      </div>
    </main>
  );
}
