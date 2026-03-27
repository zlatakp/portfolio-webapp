import type { Metadata } from "next";
import Image from "next/image";
import { getSiteContent } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();

  return {
    title: content.about.metadataTitle,
    description: content.about.metadataDescription,
    alternates: {
      canonical: "/about",
    },
    openGraph: {
      title: content.about.metadataTitle,
      description: content.about.metadataDescription,
      url: "/about",
    },
  };
}

export default async function AboutPage() {
  const content = await getSiteContent();
  const portraitImage = content.placeholderImages.aboutPortrait;

  return (
    <main className="px-6 py-14">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <section className="space-y-5">
          <p className="text-xs uppercase tracking-[0.28em] text-[var(--public-muted-text)]">
            {content.about.eyebrow}
          </p>
          <h1 className="text-5xl font-semibold tracking-tight text-[var(--public-primary-text)] sm:text-6xl">
            {content.about.title}
          </h1>
          <p className="text-base leading-8 text-[var(--public-muted-text)]">
            {content.about.introduction}
          </p>
          <p className="text-base leading-8 text-[var(--public-muted-text)]">
            {content.about.story}
          </p>
        </section>

        <section className="space-y-6">
          <div className="overflow-hidden rounded-[2.5rem] bg-[var(--public-card-surface)] shadow-[0_30px_100px_var(--public-shadow-color)]">
            <div className="relative aspect-[4/5]">
              <Image
                alt={portraitImage.alt}
                className="object-cover"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                src={portraitImage.url}
              />
            </div>
          </div>

          <div className="rounded-[2.5rem] bg-[var(--public-dark-panel-surface)] p-8 text-[var(--public-dark-panel-text)] shadow-[0_30px_100px_var(--public-shadow-color)]">
            <p className="text-xs uppercase tracking-[0.24em] text-[color:color-mix(in_srgb,var(--public-dark-panel-text)_72%,transparent)]">
              {content.about.processEyebrow}
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
              {content.about.processTitle}
            </h2>
            <div className="mt-6 space-y-5">
              <div>
                <h3 className="text-xl font-semibold">
                  {content.about.processStepOneTitle}
                </h3>
                <p className="mt-2 text-sm leading-7 text-[color:color-mix(in_srgb,var(--public-dark-panel-text)_82%,transparent)]">
                  {content.about.processStepOneDescription}
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold">
                  {content.about.processStepTwoTitle}
                </h3>
                <p className="mt-2 text-sm leading-7 text-[color:color-mix(in_srgb,var(--public-dark-panel-text)_82%,transparent)]">
                  {content.about.processStepTwoDescription}
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold">
                  {content.about.processStepThreeTitle}
                </h3>
                <p className="mt-2 text-sm leading-7 text-[color:color-mix(in_srgb,var(--public-dark-panel-text)_82%,transparent)]">
                  {content.about.processStepThreeDescription}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
