import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PackageExperience } from "@/components/public/PackageExperience";
import {
  getPackagePageVariant,
  packagePageVariants,
  type PackagePageVariantId,
} from "@/lib/package-page-variants";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

interface ReviewVariantPageProps {
  params: Promise<{
    variant: string;
  }>;
}

export function generateStaticParams() {
  return packagePageVariants.map((variant) => ({
    variant: variant.id,
  }));
}

export async function generateMetadata({
  params,
}: ReviewVariantPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const variant = getPackagePageVariant(resolvedParams.variant);

  if (!variant) {
    return {
      title: "Package review variant",
    };
  }

  return {
    title: `${variant.label} | Services review`,
    description: variant.description,
    alternates: {
      canonical: `/services/review/${variant.id}`,
    },
  };
}

export default async function ReviewVariantPage({
  params,
}: ReviewVariantPageProps) {
  const resolvedParams = await params;
  const variant = getPackagePageVariant(
    resolvedParams.variant as PackagePageVariantId,
  );

  if (!variant) {
    notFound();
  }

  const services = await prisma.service.findMany({
    where: { active: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <PackageExperience
      bookingCtaLabel="Continue into booking"
      description="Each review route uses the same approved package and add-on data, so this page is only testing the presentation layer."
      eyebrow="Services review"
      isReviewMode
      services={services}
      title={`${variant.label}: ${variant.name}`}
      variant={variant}
    />
  );
}
