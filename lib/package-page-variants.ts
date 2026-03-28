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
  packageLayout:
    | "comparison-grid"
    | "spotlight-grid"
    | "editorial-rows"
    | "comparison-table"
    | "framed-panels";
  moodNote: string;
}

export const packagePageVariants: PackagePageVariant[] = [
  {
    id: "variant-01",
    label: "Variant 01",
    name: "Calm comparison grid",
    description:
      "A balanced premium comparison board with four side-by-side packages and a restrained supporting rhythm.",
    packageLayout: "comparison-grid",
    moodNote:
      "Keeps the first decision easy: compare price, time, image count, outfits, and inclusions at a glance.",
  },
  {
    id: "variant-02",
    label: "Variant 02",
    name: "Spotlight spread",
    description:
      "Uses larger editorial panels so each package feels more considered while the same package data stays visible.",
    packageLayout: "spotlight-grid",
    moodNote:
      "Leans more spacious and magazine-like while preserving the same package facts in each panel.",
  },
  {
    id: "variant-03",
    label: "Variant 03",
    name: "Editorial rows",
    description:
      "Presents the packages as a guided sequence of quieter horizontal story rows with the comparison details grouped cleanly.",
    packageLayout: "editorial-rows",
    moodNote:
      "Best for a slower scan where the client still keeps every key package dimension in view.",
  },
  {
    id: "variant-04",
    label: "Variant 04",
    name: "Comparison table",
    description:
      "A more direct table-style treatment for clients who want the cleanest side-by-side decision surface.",
    packageLayout: "comparison-table",
    moodNote:
      "The most literal comparison layout, with no package dimension hidden behind a card treatment.",
  },
  {
    id: "variant-05",
    label: "Variant 05",
    name: "Framed panels",
    description:
      "Builds a gallery of premium panels with more visual framing while keeping the package facts and add-ons grounded.",
    packageLayout: "framed-panels",
    moodNote:
      "Feels slightly more styled and presentation-led, while still reading as a usable booking decision page.",
  },
];

export function getPackagePageVariant(
  id: string,
): PackagePageVariant | undefined {
  return packagePageVariants.find((variant) => variant.id === id);
}
