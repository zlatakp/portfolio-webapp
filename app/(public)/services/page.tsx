import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Photography Services",
    description:
      "Explore available photography sessions, pricing, and durations before entering the direct booking flow.",
    alternates: {
      canonical: "/services",
    },
    openGraph: {
      title: "Photography Services",
      description:
        "Explore available photography sessions, pricing, and durations before entering the direct booking flow.",
      url: "/services",
    },
  };
}

export default async function ServicesPage() {
  const services = await prisma.service.findMany({
    where: { active: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="px-6 py-14">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.28em] text-stone-500">Services</p>
          <h1 className="text-5xl font-semibold tracking-tight text-stone-950 sm:text-6xl">
            Session types designed for portraits, milestones, and brand stories.
          </h1>
          <p className="max-w-3xl text-base leading-8 text-stone-650">
            Each service below connects directly into the custom booking flow so clients
            can request a time without leaving the site.
          </p>
        </div>

        {services.length === 0 ? (
          <p className="rounded-[2rem] border border-dashed border-stone-300 px-6 py-8 text-sm text-stone-500">
            No public services are available yet.
          </p>
        ) : (
          <div className="grid gap-5 lg:grid-cols-2">
            {services.map((service) => (
              <article
                key={service.id}
                className="rounded-[2rem] border border-stone-200 bg-white p-7 shadow-[0_16px_50px_rgba(58,39,26,0.08)]"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-3">
                    <p className="text-xs uppercase tracking-[0.24em] text-stone-500">
                      {service.duration} min · {service.price} minor units
                    </p>
                    <h2 className="text-3xl font-semibold tracking-tight text-stone-950">
                      {service.name}
                    </h2>
                    <p className="max-w-2xl text-sm leading-7 text-stone-600">
                      {service.description}
                    </p>
                  </div>

                  <Link
                    className="rounded-full bg-stone-950 px-5 py-3 text-sm font-semibold text-stone-50 transition hover:bg-stone-700"
                    href={`/book/${service.id}`}
                  >
                    Book now
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
