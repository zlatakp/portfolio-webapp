import Link from "next/link";
import {
  corePackageTiers,
  publicAddOnCategories,
  supplementalOfferOptions,
  type PublicOfferTier,
} from "@/lib/public-offers";
import {
  packagePageVariants,
  type PackagePageVariant,
} from "@/lib/package-page-variants";

interface PackageExperienceService {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
}

interface PackageExperienceProps {
  eyebrow: string;
  title: string;
  description: string;
  bookingCtaLabel: string;
  variant: PackagePageVariant;
  services: PackageExperienceService[];
  isReviewMode?: boolean;
}

const packageDimensions = [
  {
    label: "Price",
    getValue: (tier: PublicOfferTier) => tier.price,
  },
  {
    label: "Shooting time",
    getValue: (tier: PublicOfferTier) => tier.shootingTime,
  },
  {
    label: "Edited-image count",
    getValue: (tier: PublicOfferTier) => tier.editedImageCount,
  },
  {
    label: "Outfit allowance",
    getValue: (tier: PublicOfferTier) => tier.outfitAllowance,
  },
];

function renderStatGrid(tier: PublicOfferTier, compact = false) {
  return (
    <dl
      className={`grid gap-3 ${
        compact ? "sm:grid-cols-2 xl:grid-cols-4" : "grid-cols-2"
      }`}
    >
      {packageDimensions.map((dimension) => (
        <div
          key={`${tier.name}-${dimension.label}`}
          className="rounded-[1.2rem] border border-[var(--public-card-border)] bg-[var(--public-shell-background)] px-4 py-4"
        >
          <dt className="text-[11px] uppercase tracking-[0.2em] text-[var(--public-muted-text)]">
            {dimension.label}
          </dt>
          <dd className="mt-2 text-sm font-semibold text-[var(--public-primary-text)]">
            {dimension.getValue(tier)}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function renderInclusions(tier: PublicOfferTier, dense = false) {
  return (
    <ul className={`grid gap-3 ${dense ? "sm:grid-cols-2" : ""}`}>
      {tier.keyInclusions.map((inclusion) => (
        <li
          key={`${tier.name}-${inclusion}`}
          className="rounded-[1.2rem] border border-[var(--public-card-border)] bg-[var(--public-card-surface)] px-4 py-3 text-sm leading-6 text-[var(--public-muted-text)]"
        >
          {inclusion}
        </li>
      ))}
    </ul>
  );
}

function renderComparisonGrid() {
  return (
    <div className="grid gap-4 xl:grid-cols-4">
      {corePackageTiers.map((tier) => (
        <article
          key={tier.name}
          className="flex h-full flex-col rounded-[2rem] border border-[var(--public-card-border)] bg-[var(--public-card-surface)] p-6 shadow-[0_16px_50px_var(--public-shadow-color)]"
        >
          <div className="space-y-5">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--public-muted-text)]">
                {tier.name} package
              </p>
              <h3 className="text-3xl font-semibold tracking-tight text-[var(--public-primary-text)]">
                {tier.name}
              </h3>
              <p className="text-sm leading-7 text-[var(--public-muted-text)]">
                {tier.summary}
              </p>
            </div>

            {renderStatGrid(tier)}

            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--public-muted-text)]">
                Key inclusions
              </p>
              {renderInclusions(tier)}
            </div>
          </div>

          <Link
            className="mt-6 inline-flex w-fit rounded-full bg-[var(--public-primary-cta-background)] px-5 py-3 text-sm font-semibold text-[var(--public-primary-cta-text)] transition hover:bg-[var(--public-primary-cta-hover)]"
            href={`/book?package=${tier.bookingIntent}`}
          >
            Continue with {tier.name}
          </Link>
        </article>
      ))}
    </div>
  );
}

function renderSpotlightGrid() {
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      {corePackageTiers.map((tier) => (
        <article
          key={tier.name}
          className="rounded-[2.25rem] border border-[var(--public-card-border)] bg-[linear-gradient(180deg,var(--public-card-surface)_0%,var(--public-shell-background)_100%)] p-7 shadow-[0_18px_54px_var(--public-shadow-color)]"
        >
          <div className="space-y-5">
            <div className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-[0.24em] text-[var(--public-muted-text)]">
                  {tier.name} package
                </p>
                <h3 className="text-3xl font-semibold tracking-tight text-[var(--public-primary-text)]">
                  {tier.name}
                </h3>
                <p className="text-sm leading-7 text-[var(--public-muted-text)]">
                  {tier.summary}
                </p>
                <Link
                  className="inline-flex w-fit rounded-full bg-[var(--public-primary-cta-background)] px-5 py-3 text-sm font-semibold text-[var(--public-primary-cta-text)] transition hover:bg-[var(--public-primary-cta-hover)]"
                  href={`/book?package=${tier.bookingIntent}`}
                >
                  Continue with {tier.name}
                </Link>
              </div>

              <div className="space-y-4">
                {renderStatGrid(tier)}
                {renderInclusions(tier)}
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

function renderEditorialRows() {
  return (
    <div className="space-y-4">
      {corePackageTiers.map((tier) => (
        <article
          key={tier.name}
          className="rounded-[2.25rem] border border-[var(--public-card-border)] bg-[var(--public-card-surface)] p-6 shadow-[0_18px_48px_var(--public-shadow-color)]"
        >
          <div className="grid gap-6 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
            <div className="space-y-4">
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-[0.24em] text-[var(--public-muted-text)]">
                  {tier.name} package
                </p>
                <h3 className="text-3xl font-semibold tracking-tight text-[var(--public-primary-text)]">
                  {tier.name}
                </h3>
                <p className="text-sm leading-7 text-[var(--public-muted-text)]">
                  {tier.summary}
                </p>
              </div>

              <Link
                className="inline-flex w-fit rounded-full bg-[var(--public-primary-cta-background)] px-5 py-3 text-sm font-semibold text-[var(--public-primary-cta-text)] transition hover:bg-[var(--public-primary-cta-hover)]"
                href={`/book?package=${tier.bookingIntent}`}
              >
                Continue with {tier.name}
              </Link>
            </div>

            <div className="space-y-4">
              {renderStatGrid(tier, true)}
              {renderInclusions(tier, true)}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

function renderComparisonTable() {
  return (
    <div className="overflow-x-auto rounded-[2.25rem] border border-[var(--public-card-border)] bg-[var(--public-card-surface)] shadow-[0_18px_48px_var(--public-shadow-color)]">
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="border-b border-[var(--public-card-border)]">
            <th className="px-5 py-4 text-left text-[11px] uppercase tracking-[0.2em] text-[var(--public-muted-text)]">
              Package
            </th>
            {packageDimensions.map((dimension) => (
              <th
                key={dimension.label}
                className="px-5 py-4 text-left text-[11px] uppercase tracking-[0.2em] text-[var(--public-muted-text)]"
              >
                {dimension.label}
              </th>
            ))}
            <th className="px-5 py-4 text-left text-[11px] uppercase tracking-[0.2em] text-[var(--public-muted-text)]">
              Key inclusions
            </th>
            <th className="px-5 py-4 text-left text-[11px] uppercase tracking-[0.2em] text-[var(--public-muted-text)]">
              Next step
            </th>
          </tr>
        </thead>
        <tbody>
          {corePackageTiers.map((tier, index) => (
            <tr
              key={tier.name}
              className={index === corePackageTiers.length - 1 ? "" : "border-b border-[var(--public-card-border)]"}
            >
              <td className="px-5 py-5 align-top">
                <div className="space-y-2">
                  <p className="text-xl font-semibold text-[var(--public-primary-text)]">
                    {tier.name}
                  </p>
                  <p className="max-w-xs text-sm leading-7 text-[var(--public-muted-text)]">
                    {tier.summary}
                  </p>
                </div>
              </td>
              {packageDimensions.map((dimension) => (
                <td
                  key={`${tier.name}-${dimension.label}`}
                  className="px-5 py-5 align-top text-sm font-semibold text-[var(--public-primary-text)]"
                >
                  {dimension.getValue(tier)}
                </td>
              ))}
              <td className="px-5 py-5 align-top">
                <ul className="space-y-2 text-sm leading-6 text-[var(--public-muted-text)]">
                  {tier.keyInclusions.map((inclusion) => (
                    <li key={`${tier.name}-${inclusion}`}>{inclusion}</li>
                  ))}
                </ul>
              </td>
              <td className="px-5 py-5 align-top">
                <Link
                  className="inline-flex rounded-full bg-[var(--public-primary-cta-background)] px-5 py-3 text-sm font-semibold text-[var(--public-primary-cta-text)] transition hover:bg-[var(--public-primary-cta-hover)]"
                  href={`/book?package=${tier.bookingIntent}`}
                >
                  Continue
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function renderFramedPanels() {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {corePackageTiers.map((tier) => (
        <article
          key={tier.name}
          className="rounded-[2.5rem] border border-[var(--public-card-border)] bg-[var(--public-card-surface)] p-7 shadow-[0_22px_64px_var(--public-shadow-color)]"
        >
          <div className="space-y-5">
            <div className="space-y-3 rounded-[1.75rem] border border-[var(--public-card-border)] bg-[var(--public-shell-background)] px-5 py-5">
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--public-muted-text)]">
                {tier.name} package
              </p>
              <h3 className="text-3xl font-semibold tracking-tight text-[var(--public-primary-text)]">
                {tier.name}
              </h3>
              <p className="text-sm leading-7 text-[var(--public-muted-text)]">
                {tier.summary}
              </p>
            </div>

            {renderStatGrid(tier)}

            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--public-muted-text)]">
                Key inclusions
              </p>
              {renderInclusions(tier)}
            </div>

            <Link
              className="inline-flex w-fit rounded-full bg-[var(--public-primary-cta-background)] px-5 py-3 text-sm font-semibold text-[var(--public-primary-cta-text)] transition hover:bg-[var(--public-primary-cta-hover)]"
              href={`/book?package=${tier.bookingIntent}`}
            >
              Continue with {tier.name}
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}

function renderPackages(variant: PackagePageVariant) {
  switch (variant.packageLayout) {
    case "spotlight-grid":
      return renderSpotlightGrid();
    case "editorial-rows":
      return renderEditorialRows();
    case "comparison-table":
      return renderComparisonTable();
    case "framed-panels":
      return renderFramedPanels();
    case "comparison-grid":
    default:
      return renderComparisonGrid();
  }
}

export function PackageExperience({
  eyebrow,
  title,
  description,
  bookingCtaLabel,
  variant,
  services,
  isReviewMode = false,
}: PackageExperienceProps) {
  return (
    <main className="px-6 py-14">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr] xl:items-end">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.28em] text-[var(--public-muted-text)]">
              {eyebrow}
            </p>
            <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-[var(--public-primary-text)] sm:text-6xl">
              {title}
            </h1>
            <p className="max-w-3xl text-base leading-8 text-[var(--public-muted-text)]">
              {description}
            </p>
          </div>

          <div className="rounded-[2.25rem] border border-[var(--public-card-border)] bg-[var(--public-card-surface)] px-6 py-6 shadow-[0_18px_48px_var(--public-shadow-color)]">
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--public-muted-text)]">
              {variant.label}
              {isReviewMode ? " review" : " production layout"}
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[var(--public-primary-text)]">
              {variant.name}
            </h2>
            <p className="mt-3 text-sm leading-7 text-[var(--public-muted-text)]">
              {variant.description}
            </p>
            <p className="mt-4 rounded-[1.4rem] border border-[var(--public-card-border)] bg-[var(--public-shell-background)] px-4 py-4 text-sm leading-7 text-[var(--public-muted-text)]">
              {variant.moodNote}
            </p>
          </div>
        </section>

        {isReviewMode ? (
          <section className="rounded-[2rem] border border-[var(--public-card-border)] bg-[var(--public-card-surface)] px-6 py-6 shadow-[0_18px_48px_var(--public-shadow-color)]">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.24em] text-[var(--public-muted-text)]">
                  Review routes
                </p>
                <p className="max-w-3xl text-sm leading-7 text-[var(--public-muted-text)]">
                  Switch between all five package-page mockups locally while keeping the
                  same package, add-on, and booking source data underneath.
                </p>
              </div>

              <Link
                className="inline-flex w-fit rounded-full border border-[var(--public-secondary-cta-border)] bg-[var(--public-secondary-cta-background)] px-5 py-3 text-sm font-semibold text-[var(--public-secondary-cta-text)] transition hover:bg-[var(--public-secondary-cta-hover)]"
                href="/services"
              >
                Back to canonical /services
              </Link>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              {packagePageVariants.map((reviewVariant) => {
                const isActive = reviewVariant.id === variant.id;

                return (
                  <Link
                    key={reviewVariant.id}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      isActive
                        ? "bg-[var(--public-primary-cta-background)] text-[var(--public-primary-cta-text)]"
                        : "border border-[var(--public-card-border)] bg-[var(--public-shell-background)] text-[var(--public-secondary-cta-text)] hover:bg-[var(--public-secondary-cta-background)]"
                    }`}
                    href={`/services/review/${reviewVariant.id}`}
                  >
                    {reviewVariant.label}
                  </Link>
                );
              })}
            </div>
          </section>
        ) : null}

        <section className="space-y-6" id="packages">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--public-muted-text)]">
              Packages
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-[var(--public-primary-text)] sm:text-4xl">
              Compare the four signature package paths without losing the premium feel.
            </h2>
            <p className="max-w-3xl text-sm leading-7 text-[var(--public-muted-text)]">
              Every package keeps the same decision dimensions visible: price, shooting
              time, edited-image count, outfit allowance, and key inclusions. The
              layout changes by variant, but the package facts stay fixed.
            </p>
          </div>

          {renderPackages(variant)}
        </section>

        <section className="space-y-6" id="add-ons">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--public-muted-text)]">
              Add-ons
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-[var(--public-primary-text)] sm:text-4xl">
              Keep extras discoverable without crowding the package decision.
            </h2>
            <p className="max-w-3xl text-sm leading-7 text-[var(--public-muted-text)]">
              Photo add-ons and motion add-ons live in their own calmer section so the
              package comparison stays clear first, then the extra production options
              can be layered in deliberately.
            </p>
          </div>

          <div className="grid gap-5 xl:grid-cols-2">
            {publicAddOnCategories.map((category) => (
              <article
                key={category.id}
                className="rounded-[2.25rem] border border-[var(--public-card-border)] bg-[var(--public-card-surface)] p-7 shadow-[0_18px_48px_var(--public-shadow-color)]"
              >
                <div className="space-y-5">
                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-[0.24em] text-[var(--public-muted-text)]">
                      {category.name}
                    </p>
                    <h3 className="text-3xl font-semibold tracking-tight text-[var(--public-primary-text)]">
                      {category.id === "photo"
                        ? "Photo finishing and delivery extras."
                        : "Short-form video add-ons."}
                    </h3>
                    <p className="text-sm leading-7 text-[var(--public-muted-text)]">
                      {category.description}
                    </p>
                  </div>

                  <div className="space-y-3">
                    {category.items.map((item) => (
                      <div
                        key={`${category.id}-${item.name}`}
                        className="rounded-[1.4rem] border border-[var(--public-card-border)] bg-[var(--public-shell-background)] px-4 py-4"
                      >
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                          <div className="space-y-2">
                            <h4 className="text-lg font-semibold text-[var(--public-primary-text)]">
                              {item.name}
                            </h4>
                            <p className="text-sm leading-7 text-[var(--public-muted-text)]">
                              {item.description}
                            </p>
                          </div>
                          <p className="text-sm font-semibold text-[var(--public-primary-text)]">
                            {item.price}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--public-muted-text)]">
              Additional paths
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-[var(--public-primary-text)] sm:text-4xl">
              Bespoke and consultation-led routes still stay visible.
            </h2>
            <p className="max-w-3xl text-sm leading-7 text-[var(--public-muted-text)]">
              Clients who need a more tailored route, or help deciding before they book,
              can still start from these two guided entry points.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            {supplementalOfferOptions.map((option) => (
              <article
                key={option.name}
                className="rounded-[2rem] border border-[var(--public-card-border)] bg-[var(--public-card-surface)] p-7 shadow-[0_16px_50px_var(--public-shadow-color)]"
              >
                <div className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-[0.24em] text-[var(--public-muted-text)]">
                      {option.summary}
                    </p>
                    <h3 className="text-3xl font-semibold tracking-tight text-[var(--public-primary-text)]">
                      {option.name}
                    </h3>
                    <p className="max-w-2xl text-sm leading-7 text-[var(--public-muted-text)]">
                      {option.description}
                    </p>
                  </div>

                  <Link
                    className="inline-flex w-fit rounded-full bg-[var(--public-primary-cta-background)] px-5 py-3 text-sm font-semibold text-[var(--public-primary-cta-text)] transition hover:bg-[var(--public-primary-cta-hover)]"
                    href={`/book?package=${option.bookingIntent}`}
                  >
                    {option.name === "Bespoke Shoot"
                      ? "Start bespoke booking path"
                      : "Start with a consultation"}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section
          className="rounded-[2.5rem] border border-[var(--public-card-border)] bg-[var(--public-card-surface)] px-6 py-8 shadow-[0_18px_48px_var(--public-shadow-color)]"
          id="destinations"
        >
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--public-muted-text)]">
                Destination Packages
              </p>
              <h2 className="text-3xl font-semibold tracking-tight text-[var(--public-primary-text)] sm:text-4xl">
                Destination storytelling still has its own dedicated page.
              </h2>
              <p className="max-w-3xl text-sm leading-7 text-[var(--public-muted-text)]">
                Travel-led packages remain easy to discover, but they stay separate from
                the core package comparison so this page can stay focused and calm.
              </p>
            </div>

            <Link
              className="inline-flex rounded-full border border-[var(--public-secondary-cta-border)] bg-[var(--public-secondary-cta-background)] px-5 py-3 text-sm font-semibold text-[var(--public-secondary-cta-text)] transition hover:bg-[var(--public-secondary-cta-hover)]"
              href="/destinations"
            >
              Explore Destination Packages
            </Link>
          </div>
        </section>

        <section className="space-y-6" id="bookable-services">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--public-muted-text)]">
              Bookable services
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-[var(--public-primary-text)] sm:text-4xl">
              Current live booking options.
            </h2>
            <p className="max-w-3xl text-sm leading-7 text-[var(--public-muted-text)]">
              Once you know the package path you want, continue into the live booking
              options below to choose the specific service and timing that fits today.
            </p>
          </div>

          {services.length === 0 ? (
            <p className="rounded-[2rem] border border-dashed border-[var(--public-card-border)] px-6 py-8 text-sm text-[var(--public-muted-text)]">
              No public services are available yet.
            </p>
          ) : (
            <div className="grid gap-5 lg:grid-cols-2">
              {services.map((service) => (
                <article
                  key={service.id}
                  className="rounded-[2rem] border border-[var(--public-card-border)] bg-[var(--public-card-surface)] p-7 shadow-[0_16px_50px_var(--public-shadow-color)]"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-3">
                      <p className="text-xs uppercase tracking-[0.24em] text-[var(--public-muted-text)]">
                        {service.duration} min · {service.price} minor units
                      </p>
                      <h3 className="text-3xl font-semibold tracking-tight text-[var(--public-primary-text)]">
                        {service.name}
                      </h3>
                      <p className="max-w-2xl text-sm leading-7 text-[var(--public-muted-text)]">
                        {service.description}
                      </p>
                    </div>

                    <Link
                      className="rounded-full bg-[var(--public-primary-cta-background)] px-5 py-3 text-sm font-semibold text-[var(--public-primary-cta-text)] transition hover:bg-[var(--public-primary-cta-hover)]"
                      href={`/book/${service.id}`}
                    >
                      {bookingCtaLabel}
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
