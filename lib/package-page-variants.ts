export type PackagePageVariantId =
  | "variant-01"
  | "variant-02"
  | "variant-03"
  | "variant-04"
  | "variant-05";

export interface PackagePageVariant {
  id: PackagePageVariantId;
  label: string;
  name: string;
  description: string;
  headlineLayout:
    | "ladder-cards"
    | "spotlight-ladder"
    | "progression-rows"
    | "comparison-table"
    | "framed-ladder";
  comparisonLayout:
    | "matrix-rail"
    | "family-cards"
    | "steps-first"
    | "comparison-ledger"
    | "gallery-grid";
  moodNote: string;
}

export const packagePageVariants: PackagePageVariant[] = [
  {
    id: "variant-01",
    label: "Variant 01",
    name: "Converged production ladder",
    description:
      "Combines the concise spotlight-style headline band with the clearer ledger-style comparison treatment so the live package page stays premium, concise, and high-signal.",
    headlineLayout: "spotlight-ladder",
    comparisonLayout: "comparison-ledger",
    moodNote:
      "The live/default route: concise package spotlights up top, then one tighter comparison ledger carrying the real decision detail below.",
  },
  {
    id: "variant-02",
    label: "Variant 02",
    name: "Spotlight ladder",
    description:
      "Uses widening editorial spotlights across the ladder so each tier feels more premium while the same comparison families stay easy to scan.",
    headlineLayout: "spotlight-ladder",
    comparisonLayout: "family-cards",
    moodNote:
      "The premium feeling leads, but the step-up logic still stays obvious through the recurring family cards and tier deltas.",
  },
  {
    id: "variant-03",
    label: "Variant 03",
    name: "Progression rows",
    description:
      "Frames the ladder as a guided sequence of horizontal step panels so the biggest jump at each tier is visible before the family-by-family comparison.",
    headlineLayout: "progression-rows",
    comparisonLayout: "steps-first",
    moodNote:
      "Best when stakeholders want to see where the ladder changes most at each step without losing the recurring family scan.",
  },
  {
    id: "variant-04",
    label: "Variant 04",
    name: "Comparison ledger",
    description:
      "Leans hardest into comparison, with a premium ledger for the fixed headline metrics and a matrix-led breakdown of shared, added, and upgraded families.",
    headlineLayout: "comparison-table",
    comparisonLayout: "comparison-ledger",
    moodNote:
      "The clearest route when the question is pure package comparison, while still staying polished enough for the public brand.",
  },
  {
    id: "variant-05",
    label: "Variant 05",
    name: "Framed step-up gallery",
    description:
      "Uses framed premium panels with the same ladder ordering and family cues, so the presentation feels more gallery-led without breaking the tier sequence.",
    headlineLayout: "framed-ladder",
    comparisonLayout: "gallery-grid",
    moodNote:
      "The most presentation-led route, but the step-up logic still stays explicit through the same shared foundation and family-based cues.",
  },
];

export function getPackagePageVariant(
  id: string,
): PackagePageVariant | undefined {
  return packagePageVariants.find((variant) => variant.id === id);
}
