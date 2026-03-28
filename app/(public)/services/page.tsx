import type { Metadata } from "next";
import { PackageExperience } from "@/components/public/PackageExperience";
import { prisma } from "@/lib/prisma";
import { getPackagePageVariant } from "@/lib/package-page-variants";
import { getSiteContent } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();

  return {
    title: content.services.metadataTitle,
    description: content.services.metadataDescription,
    alternates: {
      canonical: "/services",
    },
    openGraph: {
      title: content.services.metadataTitle,
      description: content.services.metadataDescription,
      url: "/services",
    },
  };
}

export default async function ServicesPage() {
  const [content, services] = await Promise.all([
    getSiteContent(),
    prisma.service.findMany({
      where: { active: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);
  const variant = getPackagePageVariant("variant-01");

  if (!variant) {
    throw new Error("Missing package page variant: variant-01");
  }

  return (
    <PackageExperience
      bookingCtaLabel={content.services.bookingCtaLabel}
      description={content.services.description}
      eyebrow={content.services.eyebrow}
      services={services}
      title={content.services.title}
      variant={variant}
    />
  );
}
