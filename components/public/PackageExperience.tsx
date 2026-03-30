import Link from "next/link";
import {
  corePackageTiers,
  publicAddOnCategories,
  publicOfferHeadlineDimensions,
  publicOfferInclusionFamilies,
  supplementalOfferOptions,
  type PublicOfferHeadlineDimensionId,
  type PublicOfferInclusionComparison,
  type PublicOfferInclusionFamilyId,
  type PublicOfferInclusionStatus,
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

const statusPresentation: Record<
  PublicOfferInclusionStatus,
  {
    label: string;
    className: string;
  }
> = {
  base: {
    label: "Base",
    className:
      "border-[var(--public-card-border)] bg-[var(--public-shell-background)] text-[var(--public-primary-text)]",
  },
  shared: {
    label: "Shared",
    className:
      "border-[var(--public-card-border)] bg-[var(--public-shell-background)] text-[var(--public-primary-text)]",
  },
  added: {
    label: "Added",
    className:
      "border-[color:rgba(167,130,86,0.25)] bg-[color:rgba(167,130,86,0.12)] text-[var(--public-primary-text)]",
  },
  upgraded: {
    label: "Upgraded",
    className:
      "border-[var(--public-primary-cta-background)] bg-[var(--public-primary-cta-background)] text-[var(--public-primary-cta-text)]",
  },
  "not-included": {
    label: "Not included",
    className:
      "border-dashed border-[var(--public-card-border)] bg-transparent text-[var(--public-muted-text)]",
  },
};

const inclusionFamilyPresentation: Record<
  PublicOfferInclusionFamilyId,
  {
    eyebrow: string;
    badgeClassName: string;
    panelClassName: string;
  }
> = {
  "posing-styling-guidance": {
    eyebrow: "Shared foundation",
    badgeClassName:
      "border-[color:rgba(145,119,82,0.22)] bg-[color:rgba(145,119,82,0.12)] text-[var(--public-primary-text)]",
    panelClassName:
      "border-[color:rgba(145,119,82,0.2)] bg-[color:rgba(145,119,82,0.08)]",
  },
  "unedited-image-access": {
    eyebrow: "Image access",
    badgeClassName:
      "border-[color:rgba(91,116,142,0.22)] bg-[color:rgba(91,116,142,0.12)] text-[var(--public-primary-text)]",
    panelClassName:
      "border-[color:rgba(91,116,142,0.2)] bg-[color:rgba(91,116,142,0.08)]",
  },
  "gallery-recovery-window": {
    eyebrow: "Recovery support",
    badgeClassName:
      "border-[color:rgba(97,126,92,0.22)] bg-[color:rgba(97,126,92,0.12)] text-[var(--public-primary-text)]",
    panelClassName:
      "border-[color:rgba(97,126,92,0.2)] bg-[color:rgba(97,126,92,0.08)]",
  },
  "location-planning-scouting": {
    eyebrow: "Planning",
    badgeClassName:
      "border-[color:rgba(158,128,88,0.22)] bg-[color:rgba(158,128,88,0.12)] text-[var(--public-primary-text)]",
    panelClassName:
      "border-[color:rgba(158,128,88,0.2)] bg-[color:rgba(158,128,88,0.08)]",
  },
  "professional-hair-makeup": {
    eyebrow: "Beauty support",
    badgeClassName:
      "border-[color:rgba(151,102,101,0.22)] bg-[color:rgba(151,102,101,0.12)] text-[var(--public-primary-text)]",
    panelClassName:
      "border-[color:rgba(151,102,101,0.2)] bg-[color:rgba(151,102,101,0.08)]",
  },
  "outfit-curation-support": {
    eyebrow: "Styling depth",
    badgeClassName:
      "border-[color:rgba(134,112,88,0.22)] bg-[color:rgba(134,112,88,0.12)] text-[var(--public-primary-text)]",
    panelClassName:
      "border-[color:rgba(134,112,88,0.2)] bg-[color:rgba(134,112,88,0.08)]",
  },
  "behind-the-scenes-coverage": {
    eyebrow: "Coverage add-on",
    badgeClassName:
      "border-[color:rgba(92,128,127,0.22)] bg-[color:rgba(92,128,127,0.12)] text-[var(--public-primary-text)]",
    panelClassName:
      "border-[color:rgba(92,128,127,0.2)] bg-[color:rgba(92,128,127,0.08)]",
  },
};

function getInclusionState(
  tier: PublicOfferTier,
  familyId: PublicOfferInclusionFamilyId,
): PublicOfferInclusionComparison {
  const state = tier.inclusionComparison.find(
    (comparison) => comparison.familyId === familyId,
  );

  if (!state) {
    throw new Error(`Missing inclusion state for ${tier.name}: ${familyId}`);
  }

  return state;
}

function getHeadlineValue(
  tier: PublicOfferTier,
  dimensionId: PublicOfferHeadlineDimensionId,
) {
  const dimension = tier.headlineComparison.find((item) => item.id === dimensionId);

  if (!dimension) {
    throw new Error(`Missing headline dimension for ${tier.name}: ${dimensionId}`);
  }

  return dimension.value;
}

function getSharedFoundationFamilies() {
  return publicOfferInclusionFamilies.filter((family) =>
    corePackageTiers.every(
      (tier) => getInclusionState(tier, family.id).status !== "not-included",
    ),
  );
}

function renderFamilyBadge(
  familyId: PublicOfferInclusionFamilyId,
  key?: string,
) {
  const family = publicOfferInclusionFamilies.find((item) => item.id === familyId);

  if (!family) {
    throw new Error(`Missing inclusion family: ${familyId}`);
  }

  return (
    <span
      key={key}
      className={`inline-flex rounded-full border px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] ${inclusionFamilyPresentation[familyId].badgeClassName}`}
    >
      {family.label}
    </span>
  );
}

function renderTierShiftPreview(tier: PublicOfferTier) {
  const shiftItems = [
    ...tier.progression.headlineShifts.map((shift) => ({
      key: `${tier.name}-${shift.dimensionId}`,
      label: shift.kind === "upgraded" ? "Upgraded" : "Expanded",
      value: `${shift.label}: ${shift.value}`,
      className:
        "border-[var(--public-card-border)] bg-[var(--public-shell-background)] text-[var(--public-primary-text)]",
    })),
    ...tier.progression.inclusionShifts.map((shift) => ({
      key: `${tier.name}-${shift.familyId}`,
      label: shift.kind === "upgraded" ? "Upgraded" : "Added",
      value: shift.value,
      className: inclusionFamilyPresentation[shift.familyId].badgeClassName,
    })),
  ];

  if (shiftItems.length === 0) {
    return (
      <div className="rounded-[1.2rem] border border-[var(--public-card-border)] bg-[var(--public-shell-background)] px-4 py-4">
        <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--public-muted-text)]">
          Foundation
        </p>
        <p className="mt-2 text-sm leading-6 text-[var(--public-primary-text)]">
          The base offer every higher tier expands from.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {shiftItems.map((item) => (
        <div
          key={item.key}
          className={`rounded-full border px-3 py-2 text-xs font-semibold ${item.className}`}
        >
          {item.label}: {item.value}
        </div>
      ))}
    </div>
  );
}

function renderHeadlineTiles(tier: PublicOfferTier, compact = false) {
  return (
    <dl
      className={`grid gap-3 ${
        compact ? "sm:grid-cols-2 xl:grid-cols-4" : "grid-cols-2"
      }`}
    >
      {tier.headlineComparison.map((dimension) => (
        <div
          key={`${tier.name}-${dimension.id}`}
          className="rounded-[1.2rem] border border-[var(--public-card-border)] bg-[var(--public-shell-background)] px-4 py-4"
        >
          <dt className="text-[11px] uppercase tracking-[0.2em] text-[var(--public-muted-text)]">
            {dimension.label}
          </dt>
          <dd className="mt-2 text-sm font-semibold text-[var(--public-primary-text)]">
            {dimension.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function renderSharedFoundationPanel() {
  const sharedFamilies = getSharedFoundationFamilies();

  return (
    <div className="rounded-[1.8rem] border border-[var(--public-card-border)] bg-[var(--public-shell-background)] p-5">
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.22em] text-[var(--public-muted-text)]">
          Shared foundation
        </p>
        <h4 className="text-xl font-semibold tracking-tight text-[var(--public-primary-text)]">
          Every package starts from the same core guidance, then each step adds depth.
        </h4>
        <p className="text-sm leading-7 text-[var(--public-muted-text)]">
          The ladder comparison below keeps the same inclusion families in view so you can
          scan what is always present, what first appears, and what gets upgraded.
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        {sharedFamilies.map((family) => renderFamilyBadge(family.id, family.id))}
      </div>

      <p className="mt-4 text-sm leading-7 text-[var(--public-muted-text)]">
        {sharedFamilies
          .map((family) => getInclusionState(corePackageTiers[0], family.id).value)
          .filter(Boolean)
          .join(". ")}
      </p>
    </div>
  );
}

function renderProgressionNotes(tier: PublicOfferTier) {
  const entries = [
    ...tier.progression.headlineShifts.map((shift) => ({
      key: `${tier.name}-${shift.dimensionId}`,
      kind: shift.kind === "upgraded" ? "Upgraded" : "Expanded",
      value: shift.previousValue
        ? `${shift.label}: ${shift.previousValue} -> ${shift.value}`
        : `${shift.label}: ${shift.value}`,
      className:
        "border-[var(--public-card-border)] bg-[var(--public-shell-background)] text-[var(--public-primary-text)]",
    })),
    ...tier.progression.inclusionShifts.map((shift) => ({
      key: `${tier.name}-${shift.familyId}`,
      kind: shift.kind === "upgraded" ? "Upgraded" : "Added",
      value: shift.previousValue
        ? `${shift.label}: ${shift.previousValue} -> ${shift.value}`
        : shift.value,
      className: inclusionFamilyPresentation[shift.familyId].panelClassName,
    })),
  ];

  return (
    <div className="space-y-3">
      <div>
        <p className="text-xs uppercase tracking-[0.22em] text-[var(--public-muted-text)]">
          {tier.progression.stepLabel}
        </p>
        <p className="mt-2 text-sm leading-7 text-[var(--public-muted-text)]">
          {tier.progression.overview}
        </p>
      </div>

      <ul className="grid gap-3">
        {entries.length > 0 ? (
          entries.map((entry) => (
            <li
              key={entry.key}
              className={`rounded-[1.2rem] border px-4 py-3 ${entry.className}`}
            >
              <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--public-muted-text)]">
                {entry.kind}
              </p>
              <p className="mt-2 text-sm leading-6 text-[var(--public-primary-text)]">
                {entry.value}
              </p>
            </li>
          ))
        ) : (
          <li className="rounded-[1.2rem] border border-[var(--public-card-border)] bg-[var(--public-shell-background)] px-4 py-3 text-sm leading-6 text-[var(--public-primary-text)]">
            Sets the core package foundation.
          </li>
        )}
      </ul>
    </div>
  );
}

function renderHeadlineLadderCards() {
  return (
    <div className="grid gap-4 xl:grid-cols-4">
      {corePackageTiers.map((tier, index) => (
        <article
          key={tier.name}
          className="flex h-full flex-col rounded-[2rem] border border-[var(--public-card-border)] bg-[var(--public-card-surface)] p-6 shadow-[0_18px_52px_var(--public-shadow-color)]"
        >
          <div className="space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-[0.24em] text-[var(--public-muted-text)]">
                  {tier.progression.stepLabel}
                </p>
                <h3 className="text-3xl font-semibold tracking-tight text-[var(--public-primary-text)]">
                  {tier.name}
                </h3>
              </div>

              <div className="rounded-full border border-[var(--public-card-border)] bg-[var(--public-shell-background)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--public-muted-text)]">
                0{index + 1}
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm leading-7 text-[var(--public-muted-text)]">
                {tier.summary}
              </p>
              <div>{renderTierShiftPreview(tier)}</div>
            </div>

            {renderHeadlineTiles(tier)}
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

function renderSpotlightLadder() {
  return (
    <div className="grid gap-4 xl:grid-cols-[0.92fr_1fr_1.08fr_1.16fr]">
      {corePackageTiers.map((tier) => (
        <article
          key={tier.name}
          className="rounded-[2.25rem] border border-[var(--public-card-border)] bg-[linear-gradient(180deg,var(--public-card-surface)_0%,var(--public-shell-background)_100%)] p-7 shadow-[0_18px_54px_var(--public-shadow-color)]"
        >
          <div className="space-y-5">
            <div className="space-y-3">
              <p className="text-4xl font-semibold tracking-tight text-[var(--public-primary-text)]">
                {getHeadlineValue(tier, "price")}
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
        </article>
      ))}
    </div>
  );
}

function renderComparisonLedgerBoard() {
  const serviceRows = [
    {
      id: "shooting-time" as const,
      label: "Shooting time",
    },
    {
      id: "edited-image-count" as const,
      label: "Edited-image count",
    },
    {
      id: "outfit-allowance" as const,
      label: "Outfit allowance",
    },
  ];

  return (
    <div className="overflow-x-auto rounded-[2rem] border border-[var(--public-card-border)] bg-[var(--public-card-surface)]">
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="border-b border-[var(--public-card-border)]">
            <th className="px-4 py-4 text-left text-[11px] uppercase tracking-[0.2em] text-[var(--public-muted-text)]">
              Comparison point
            </th>
            {corePackageTiers.map((tier) => (
              <th
                key={`${tier.name}-ledger-header`}
                className="px-4 py-4 text-left text-[11px] uppercase tracking-[0.2em] text-[var(--public-muted-text)]"
              >
                <div className="space-y-1">
                  <p>{tier.name}</p>
                  <p className="text-base font-semibold tracking-tight text-[var(--public-primary-text)]">
                    {tier.price}
                  </p>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {serviceRows.map((row) => (
            <tr
              key={row.id}
              className="border-b border-[var(--public-card-border)]"
            >
              <td className="px-4 py-4 align-top text-sm font-semibold text-[var(--public-primary-text)]">
                {row.label}
              </td>
              {corePackageTiers.map((tier) => (
                <td
                  key={`${tier.name}-${row.id}-ledger-cell`}
                  className="px-4 py-4 align-top text-sm font-semibold text-[var(--public-primary-text)]"
                >
                  {getHeadlineValue(tier, row.id)}
                </td>
              ))}
            </tr>
          ))}
          {publicOfferInclusionFamilies.map((family, index) => (
            <tr
              key={`${family.id}-ledger-row`}
              className={
                index === publicOfferInclusionFamilies.length - 1
                  ? ""
                  : "border-b border-[var(--public-card-border)]"
              }
            >
              <td className="px-4 py-4 align-top">
                <div className="space-y-2">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--public-muted-text)]">
                    {inclusionFamilyPresentation[family.id].eyebrow}
                  </p>
                  <div>{renderFamilyBadge(family.id)}</div>
                </div>
              </td>
              {corePackageTiers.map((tier) => {
                const state = getInclusionState(tier, family.id);
                const presentation = statusPresentation[state.status];

                return (
                  <td
                    key={`${tier.name}-${family.id}-ledger-cell`}
                    className="px-4 py-4 align-top"
                  >
                    <div
                      className={`rounded-[1.2rem] border px-3 py-3 ${presentation.className}`}
                    >
                      <p className="text-[11px] uppercase tracking-[0.18em]">
                        {presentation.label}
                      </p>
                      <p className="mt-2 text-sm leading-6">
                        {state.value ?? "Not included"}
                      </p>
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function renderProgressionRows() {
  return (
    <div className="grid gap-4 xl:grid-cols-4">
      {corePackageTiers.map((tier, index) => (
        <article
          key={tier.name}
          className="rounded-[2.25rem] border border-[var(--public-card-border)] bg-[var(--public-card-surface)] p-6 shadow-[0_18px_48px_var(--public-shadow-color)]"
        >
          <div className="space-y-5">
            <div className="flex items-center justify-between gap-4">
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--public-muted-text)]">
                {tier.progression.stepLabel}
              </p>
              <span className="text-xs uppercase tracking-[0.18em] text-[var(--public-muted-text)]">
                {index < corePackageTiers.length - 1 ? "Next step ->" : "Signature tier"}
              </span>
            </div>

            <div className="space-y-4">
              <h3 className="text-3xl font-semibold tracking-tight text-[var(--public-primary-text)]">
                {tier.name}
              </h3>
              <p className="text-sm leading-7 text-[var(--public-muted-text)]">
                {tier.progression.overview}
              </p>
            </div>

            {renderHeadlineTiles(tier)}

            <div className="rounded-[1.4rem] border border-[var(--public-card-border)] bg-[var(--public-shell-background)] p-4">
              <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--public-muted-text)]">
                Biggest change at this step
              </p>
              <div className="mt-3">{renderTierShiftPreview(tier)}</div>
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

function renderHeadlineComparisonTable() {
  return (
    <div className="overflow-x-auto rounded-[2.25rem] border border-[var(--public-card-border)] bg-[var(--public-card-surface)] shadow-[0_18px_48px_var(--public-shadow-color)]">
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="border-b border-[var(--public-card-border)]">
            <th className="px-5 py-4 text-left text-[11px] uppercase tracking-[0.2em] text-[var(--public-muted-text)]">
              Package
            </th>
            {corePackageTiers.map((tier) => (
              <th
                key={tier.name}
                className="px-5 py-4 text-left text-[11px] uppercase tracking-[0.2em] text-[var(--public-muted-text)]"
              >
                {tier.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-[var(--public-card-border)]">
            <td className="px-5 py-5 align-top">
              <p className="text-sm font-semibold text-[var(--public-primary-text)]">
                Ladder role
              </p>
            </td>
            {corePackageTiers.map((tier) => (
              <td
                key={`${tier.name}-step`}
                className="px-5 py-5 align-top text-sm leading-7 text-[var(--public-muted-text)]"
              >
                {tier.progression.stepLabel}
              </td>
            ))}
          </tr>
          <tr className="border-b border-[var(--public-card-border)]">
            <td className="px-5 py-5 align-top text-sm font-semibold text-[var(--public-primary-text)]">
              Step-up focus
            </td>
            {corePackageTiers.map((tier) => (
              <td
                key={`${tier.name}-overview`}
                className="px-5 py-5 align-top text-sm leading-7 text-[var(--public-muted-text)]"
              >
                {tier.progression.overview}
              </td>
            ))}
          </tr>
          {publicOfferHeadlineDimensions.map((dimension, index) => (
            <tr
              key={dimension.id}
              className={
                index === publicOfferHeadlineDimensions.length - 1
                  ? ""
                  : "border-b border-[var(--public-card-border)]"
              }
            >
              <td className="px-5 py-5 align-top text-sm font-semibold text-[var(--public-primary-text)]">
                {dimension.label}
              </td>
              {corePackageTiers.map((tier) => (
                <td
                  key={`${tier.name}-${dimension.id}`}
                  className="px-5 py-5 align-top text-sm font-semibold text-[var(--public-primary-text)]"
                >
                  {getHeadlineValue(tier, dimension.id)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function renderFramedLadder() {
  return (
    <div className="grid gap-5 xl:grid-cols-4">
      {corePackageTiers.map((tier) => (
        <article
          key={tier.name}
          className="rounded-[2.5rem] border border-[var(--public-card-border)] bg-[var(--public-card-surface)] p-7 shadow-[0_22px_64px_var(--public-shadow-color)]"
        >
          <div className="space-y-5">
            <div className="space-y-3 rounded-[1.75rem] border border-[var(--public-card-border)] bg-[var(--public-shell-background)] px-5 py-5">
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--public-muted-text)]">
                {tier.progression.stepLabel}
              </p>
              <h3 className="text-3xl font-semibold tracking-tight text-[var(--public-primary-text)]">
                {tier.name}
              </h3>
              <p className="text-sm leading-7 text-[var(--public-muted-text)]">
                {tier.summary}
              </p>
            </div>

            <div className="rounded-[1.6rem] border border-[var(--public-card-border)] bg-[var(--public-shell-background)] p-4">
              <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--public-muted-text)]">
                What this step adds
              </p>
              <div className="mt-3">{renderTierShiftPreview(tier)}</div>
            </div>

            {renderHeadlineTiles(tier)}

            <p className="rounded-[1.2rem] border border-[var(--public-card-border)] bg-[var(--public-shell-background)] px-4 py-4 text-sm leading-7 text-[var(--public-muted-text)]">
              {tier.progression.overview}
            </p>

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

function renderHeadlineSurface(variant: PackagePageVariant) {
  switch (variant.headlineLayout) {
    case "spotlight-ladder":
      return renderSpotlightLadder();
    case "progression-rows":
      return renderProgressionRows();
    case "comparison-table":
      return renderHeadlineComparisonTable();
    case "framed-ladder":
      return renderFramedLadder();
    case "ladder-cards":
    default:
      return renderHeadlineLadderCards();
  }
}

function renderFamilyMatrix() {
  return (
    <div className="overflow-x-auto rounded-[2rem] border border-[var(--public-card-border)] bg-[var(--public-card-surface)]">
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="border-b border-[var(--public-card-border)]">
            <th className="px-4 py-4 text-left text-[11px] uppercase tracking-[0.2em] text-[var(--public-muted-text)]">
              Inclusion family
            </th>
            {corePackageTiers.map((tier) => (
              <th
                key={`${tier.name}-family-column`}
                className="px-4 py-4 text-left text-[11px] uppercase tracking-[0.2em] text-[var(--public-muted-text)]"
              >
                {tier.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {publicOfferInclusionFamilies.map((family, index) => (
            <tr
              key={family.id}
              className={
                index === publicOfferInclusionFamilies.length - 1
                  ? ""
                  : "border-b border-[var(--public-card-border)]"
              }
            >
              <td className="px-4 py-4 align-top">
                <div className="space-y-2">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--public-muted-text)]">
                    {inclusionFamilyPresentation[family.id].eyebrow}
                  </p>
                  <div>{renderFamilyBadge(family.id)}</div>
                </div>
              </td>
              {corePackageTiers.map((tier) => {
                const state = getInclusionState(tier, family.id);
                const presentation = statusPresentation[state.status];

                return (
                  <td
                    key={`${tier.name}-${family.id}`}
                    className="px-4 py-4 align-top"
                  >
                    <div
                      className={`rounded-[1.2rem] border px-3 py-3 ${presentation.className}`}
                    >
                      <p className="text-[11px] uppercase tracking-[0.18em]">
                        {presentation.label}
                      </p>
                      <p className="mt-2 text-sm leading-6">
                        {state.value ?? "Not included"}
                      </p>
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function renderFamilyCards() {
  return (
    <div className="grid gap-4">
      {publicOfferInclusionFamilies.map((family) => (
        <article
          key={family.id}
          className={`rounded-[1.8rem] border bg-[var(--public-card-surface)] p-5 ${inclusionFamilyPresentation[family.id].panelClassName}`}
        >
          <div className="space-y-4">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--public-muted-text)]">
                {inclusionFamilyPresentation[family.id].eyebrow}
              </p>
              <div className="mt-2">{renderFamilyBadge(family.id)}</div>
            </div>

            <div className="grid gap-3 lg:grid-cols-4">
              {corePackageTiers.map((tier) => {
                const state = getInclusionState(tier, family.id);
                const presentation = statusPresentation[state.status];

                return (
                  <div
                    key={`${family.id}-${tier.name}`}
                    className={`rounded-[1.2rem] border px-4 py-4 ${presentation.className}`}
                  >
                    <p className="text-[11px] uppercase tracking-[0.18em]">
                      {tier.name} · {presentation.label}
                    </p>
                    <p className="mt-2 text-sm leading-6">
                      {state.value ?? "Not included"}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

function renderProgressionRail(layout: "spread" | "stacked" = "spread") {
  return (
    <div className={`grid gap-4 ${layout === "spread" ? "xl:grid-cols-4" : ""}`}>
      {corePackageTiers.map((tier) => (
        <article
          key={`${tier.name}-progression`}
          className="rounded-[1.8rem] border border-[var(--public-card-border)] bg-[var(--public-card-surface)] p-5"
        >
          {renderProgressionNotes(tier)}
        </article>
      ))}
    </div>
  );
}

function renderProgressionSurface(variant: PackagePageVariant) {
  switch (variant.comparisonLayout) {
    case "family-cards":
      return (
        <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-5">
            {renderSharedFoundationPanel()}
            {renderFamilyCards()}
          </div>
          <div>{renderProgressionRail("stacked")}</div>
        </div>
      );
    case "steps-first":
      return (
        <div className="space-y-5">
          {renderSharedFoundationPanel()}
          {renderProgressionRail()}
          {renderFamilyMatrix()}
        </div>
      );
    case "comparison-ledger":
      return (
        <div>{renderComparisonLedgerBoard()}</div>
      );
    case "gallery-grid":
      return (
        <div className="space-y-5">
          {renderSharedFoundationPanel()}
          <div className="grid gap-4 lg:grid-cols-2">
            {publicOfferInclusionFamilies.map((family) => (
              <article
                key={`${family.id}-gallery`}
                className={`rounded-[1.8rem] border bg-[var(--public-card-surface)] p-5 ${inclusionFamilyPresentation[family.id].panelClassName}`}
              >
                <div className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-[0.22em] text-[var(--public-muted-text)]">
                      {inclusionFamilyPresentation[family.id].eyebrow}
                    </p>
                    <div>{renderFamilyBadge(family.id)}</div>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {corePackageTiers.map((tier) => {
                      const state = getInclusionState(tier, family.id);
                      const presentation = statusPresentation[state.status];

                      return (
                        <div
                          key={`${family.id}-${tier.name}-gallery`}
                          className={`rounded-[1.2rem] border px-4 py-4 ${presentation.className}`}
                        >
                          <p className="text-[11px] uppercase tracking-[0.18em]">
                            {tier.name} · {presentation.label}
                          </p>
                          <p className="mt-2 text-sm leading-6">
                            {state.value ?? "Not included"}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </article>
            ))}
          </div>
          {renderProgressionRail()}
        </div>
      );
    case "matrix-rail":
    default:
      return (
        <div className="space-y-5">
          {renderSharedFoundationPanel()}
          {renderFamilyMatrix()}
          {renderProgressionRail()}
        </div>
      );
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
  const isConvergedVariant = variant.id === "variant-01";

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
                  Switch between all five package-page mockups while keeping the same
                  approved package ladder, add-ons, and downstream booking flow.
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
              {isConvergedVariant
                ? "One concise package spotlight band, followed by one decisive comparison ledger."
                : "A four-tier premium ladder, from concise base package to full signature upgrade."}
            </h2>
            <p className="max-w-4xl text-sm leading-7 text-[var(--public-muted-text)]">
              {isConvergedVariant
                ? "The headline band stays deliberately brief: package name, short description, and price. The ledger underneath carries the real comparison detail for shooting time, edited-image count, outfit allowance, and every shared, added, or upgraded inclusion family."
                : "Express is the foundation. Standard expands time and delivery volume. Premium introduces unedited-image access plus 3-month gallery recovery. Platinum upgrades recovery to 6-month gallery recovery and layers in scouting, beauty, outfit curation, and BTS. Every variant keeps that same ladder visible."}
            </p>
          </div>

          <div className={isConvergedVariant ? "space-y-4" : "space-y-5"}>
            <div className="rounded-[2.25rem] border border-[var(--public-card-border)] bg-[var(--public-card-surface)] p-6 shadow-[0_18px_48px_var(--public-shadow-color)]">
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-[0.24em] text-[var(--public-muted-text)]">
                  {isConvergedVariant ? "Package spotlight" : "Headline comparison"}
                </p>
                <h3 className="text-2xl font-semibold tracking-tight text-[var(--public-primary-text)]">
                  {isConvergedVariant
                    ? "Each package headline stays concise: name, brief description, and price."
                    : "Price, time, image count, and outfit allowance stay visible without expansion."}
                </h3>
              </div>

              <div className="mt-6">{renderHeadlineSurface(variant)}</div>
            </div>

            <div className="rounded-[2.25rem] border border-[var(--public-card-border)] bg-[var(--public-card-surface)] p-6 shadow-[0_18px_48px_var(--public-shadow-color)]">
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-[0.24em] text-[var(--public-muted-text)]">
                  {isConvergedVariant ? "Comparison ledger" : "Shared versus added"}
                </p>
                <h3 className="text-2xl font-semibold tracking-tight text-[var(--public-primary-text)]">
                  {isConvergedVariant
                    ? "Decision detail lives here: service rows plus the shared, added, and upgraded inclusion families."
                    : "Scan what carries across the ladder, what gets added, and what gets upgraded."}
                </h3>
                {isConvergedVariant ? null : (
                  <p className="max-w-4xl text-sm leading-7 text-[var(--public-muted-text)]">
                    The same inclusion families appear in every variant so the package
                    ladder reads consistently from left to right: shared foundation,
                    newly added benefits, and the key Platinum upgrade moments.
                  </p>
                )}
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                {Object.values(statusPresentation).map((presentation) => (
                  <span
                    key={presentation.label}
                    className={`rounded-full border px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] ${presentation.className}`}
                  >
                    {presentation.label}
                  </span>
                ))}
              </div>

              <div className="mt-6">{renderProgressionSurface(variant)}</div>
            </div>
          </div>
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
              The package ladder stays comparison-first, while photo add-ons and motion
              add-ons remain in their own calmer section immediately below.
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
                Travel-led storytelling now has a dedicated availability hub.
              </h2>
              <p className="max-w-3xl text-sm leading-7 text-[var(--public-muted-text)]">
                The core ladder stays focused here, while destination clients can now
                jump straight into confirmed cities, planned windows, or a city-interest
                request without losing the premium package context.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                className="inline-flex rounded-full border border-[var(--public-secondary-cta-border)] bg-[var(--public-secondary-cta-background)] px-5 py-3 text-sm font-semibold text-[var(--public-secondary-cta-text)] transition hover:bg-[var(--public-secondary-cta-hover)]"
                href="/destinations#travel-availability"
              >
                Explore travel availability
              </Link>
              <Link
                className="inline-flex rounded-full border border-[var(--public-secondary-cta-border)] bg-[var(--public-secondary-cta-background)] px-5 py-3 text-sm font-semibold text-[var(--public-secondary-cta-text)] transition hover:bg-[var(--public-secondary-cta-hover)]"
                href="/destinations#city-interest"
              >
                Request your city
              </Link>
            </div>
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
