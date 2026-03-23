import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ServiceCard } from "@/components/booking/ServiceCard";

export const dynamic = "force-dynamic";

export default async function BookPage() {
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
          <p className="max-w-2xl text-base leading-7 text-stone-600">
            Start the booking flow by selecting one of the currently active services.
            Each option leads into date and time selection.
          </p>
          <Link
            className="inline-flex items-center text-sm font-semibold text-stone-700 underline-offset-4 hover:underline"
            href="/"
          >
            Back to homepage
          </Link>
        </div>

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
