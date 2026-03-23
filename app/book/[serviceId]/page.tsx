import Link from "next/link";
import { notFound } from "next/navigation";
import { TimeSlotPicker } from "@/components/booking/TimeSlotPicker";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

interface BookingStepPageProps {
  params: Promise<{
    serviceId: string;
  }>;
}

export default async function BookingStepPage({ params }: BookingStepPageProps) {
  const { serviceId } = await params;
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
            href="/book"
          >
            Back to services
          </Link>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            {service.name}
          </h1>
          <p className="max-w-2xl text-base leading-7 text-stone-600">
            {service.description}
          </p>
        </div>

        <TimeSlotPicker service={service} />
      </div>
    </main>
  );
}
