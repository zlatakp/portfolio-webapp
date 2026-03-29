export type PublicOfferIntent =
  | "express"
  | "standard"
  | "premium"
  | "platinum"
  | "bespoke"
  | "consultation";

export type PublicOfferHeadlineDimensionId =
  | "price"
  | "shooting-time"
  | "edited-image-count"
  | "outfit-allowance";

export type PublicOfferInclusionFamilyId =
  | "posing-styling-guidance"
  | "unedited-image-access"
  | "gallery-recovery-window"
  | "location-planning-scouting"
  | "professional-hair-makeup"
  | "outfit-curation-support"
  | "behind-the-scenes-coverage";

export type PublicOfferInclusionStatus =
  | "base"
  | "shared"
  | "added"
  | "upgraded"
  | "not-included";

export type PublicOfferProgressionHeadlineShiftKind =
  | "expanded"
  | "upgraded";

export type PublicOfferProgressionInclusionShiftKind =
  | "added"
  | "upgraded";

export interface PublicOfferHeadlineDimension {
  id: PublicOfferHeadlineDimensionId;
  label: string;
  value: string;
}

export interface PublicOfferInclusionFamily {
  id: PublicOfferInclusionFamilyId;
  label: string;
}

export interface PublicOfferInclusionComparison {
  familyId: PublicOfferInclusionFamilyId;
  status: PublicOfferInclusionStatus;
  value: string | null;
}

export interface PublicOfferProgressionHeadlineShift {
  dimensionId: PublicOfferHeadlineDimensionId;
  label: string;
  kind: PublicOfferProgressionHeadlineShiftKind;
  previousValue: string | null;
  value: string;
}

export interface PublicOfferProgressionInclusionShift {
  familyId: PublicOfferInclusionFamilyId;
  label: string;
  kind: PublicOfferProgressionInclusionShiftKind;
  previousValue: string | null;
  value: string;
}

export interface PublicOfferTierProgression {
  stepLabel: string;
  overview: string;
  headlineShifts: PublicOfferProgressionHeadlineShift[];
  inclusionShifts: PublicOfferProgressionInclusionShift[];
}

export interface PublicOfferTier {
  name: "Express" | "Standard" | "Premium" | "Platinum";
  bookingIntent: Extract<
    PublicOfferIntent,
    "express" | "standard" | "premium" | "platinum"
  >;
  summary: string;
  price: string;
  shootingTime: string;
  editedImageCount: string;
  outfitAllowance: string;
  keyInclusions: string[];
  headlineComparison: PublicOfferHeadlineDimension[];
  inclusionComparison: PublicOfferInclusionComparison[];
  progression: PublicOfferTierProgression;
}

export interface PublicDestinationOffer {
  name: "City Escape" | "Coastal Weekend" | "Signature Destination";
  summary: string;
  positioning: string;
  inclusions: string[];
}

export interface SupplementalOfferOption {
  name: "Bespoke Shoot" | "Consultation";
  bookingIntent: Extract<PublicOfferIntent, "bespoke" | "consultation">;
  summary: string;
  description: string;
}

export interface PublicAddOn {
  name: string;
  price: string;
  description: string;
}

export interface PublicAddOnCategory {
  id: "photo" | "video";
  name: string;
  description: string;
  items: PublicAddOn[];
}

export const publicOfferHeadlineDimensions: Array<
  Omit<PublicOfferHeadlineDimension, "value">
> = [
  {
    id: "price",
    label: "Price",
  },
  {
    id: "shooting-time",
    label: "Shooting time",
  },
  {
    id: "edited-image-count",
    label: "Edited-image count",
  },
  {
    id: "outfit-allowance",
    label: "Outfit allowance",
  },
];

export const publicOfferInclusionFamilies: PublicOfferInclusionFamily[] = [
  {
    id: "posing-styling-guidance",
    label: "Posing/styling guidance",
  },
  {
    id: "unedited-image-access",
    label: "Unedited-image access",
  },
  {
    id: "gallery-recovery-window",
    label: "Gallery recovery window",
  },
  {
    id: "location-planning-scouting",
    label: "Location planning/scouting",
  },
  {
    id: "professional-hair-makeup",
    label: "Professional hair and makeup",
  },
  {
    id: "outfit-curation-support",
    label: "Outfit curation support",
  },
  {
    id: "behind-the-scenes-coverage",
    label: "Behind-the-scenes coverage",
  },
];

function buildHeadlineComparison(
  values: Record<PublicOfferHeadlineDimensionId, string>,
): PublicOfferHeadlineDimension[] {
  return publicOfferHeadlineDimensions.map((dimension) => ({
    ...dimension,
    value: values[dimension.id],
  }));
}

function buildInclusionComparison(
  values: Partial<
    Record<
      PublicOfferInclusionFamilyId,
      {
        status: Exclude<PublicOfferInclusionStatus, "not-included">;
        value: string;
      }
    >
  >,
): PublicOfferInclusionComparison[] {
  return publicOfferInclusionFamilies.map((family) => ({
    familyId: family.id,
    status: values[family.id]?.status ?? "not-included",
    value: values[family.id]?.value ?? null,
  }));
}

export const corePackageTiers: PublicOfferTier[] = [
  {
    name: "Express",
    bookingIntent: "express",
    summary:
      "A concise premium portrait session for clients who want a refined reset without a full-day production rhythm.",
    price: "£250",
    shootingTime: "30 mins",
    editedImageCount: "3",
    outfitAllowance: "2 outfits",
    keyInclusions: ["Posing & styling guidance"],
    headlineComparison: buildHeadlineComparison({
      price: "£250",
      "shooting-time": "30 mins",
      "edited-image-count": "3",
      "outfit-allowance": "2 outfits",
    }),
    inclusionComparison: buildInclusionComparison({
      "posing-styling-guidance": {
        status: "base",
        value: "Posing & styling guidance",
      },
    }),
    progression: {
      stepLabel: "Base package",
      overview:
        "Express sets the foundation: concise shooting time, a tightly edited delivery, and the core posing/styling guidance.",
      headlineShifts: [],
      inclusionShifts: [],
    },
  },
  {
    name: "Standard",
    bookingIntent: "standard",
    summary:
      "A fuller hour of coverage with room to shift looks, settle into the session, and leave with a broader polished set.",
    price: "£400",
    shootingTime: "1 hour",
    editedImageCount: "7",
    outfitAllowance: "Unlimited outfits",
    keyInclusions: ["Posing & styling guidance"],
    headlineComparison: buildHeadlineComparison({
      price: "£400",
      "shooting-time": "1 hour",
      "edited-image-count": "7",
      "outfit-allowance": "Unlimited outfits",
    }),
    inclusionComparison: buildInclusionComparison({
      "posing-styling-guidance": {
        status: "shared",
        value: "Posing & styling guidance",
      },
    }),
    progression: {
      stepLabel: "Step 1 expansion",
      overview:
        "Standard is the first expansion of Express, chiefly through more session depth, more delivery volume, and a wider outfit allowance.",
      headlineShifts: [
        {
          dimensionId: "shooting-time",
          label: "Shooting time",
          kind: "expanded",
          previousValue: "30 mins",
          value: "1 hour",
        },
        {
          dimensionId: "edited-image-count",
          label: "Edited-image count",
          kind: "expanded",
          previousValue: "3",
          value: "7",
        },
        {
          dimensionId: "outfit-allowance",
          label: "Outfit allowance",
          kind: "upgraded",
          previousValue: "2 outfits",
          value: "Unlimited outfits",
        },
      ],
      inclusionShifts: [],
    },
  },
  {
    name: "Premium",
    bookingIntent: "premium",
    summary:
      "An expanded editorial experience for clients who want more final selects, deeper pacing, and wider image access after the session.",
    price: "£800",
    shootingTime: "2 hours",
    editedImageCount: "15",
    outfitAllowance: "Unlimited outfits",
    keyInclusions: [
      "Posing/styling guidance",
      "Access to unedited images",
      "3-month gallery recovery",
    ],
    headlineComparison: buildHeadlineComparison({
      price: "£800",
      "shooting-time": "2 hours",
      "edited-image-count": "15",
      "outfit-allowance": "Unlimited outfits",
    }),
    inclusionComparison: buildInclusionComparison({
      "posing-styling-guidance": {
        status: "shared",
        value: "Posing/styling guidance",
      },
      "unedited-image-access": {
        status: "added",
        value: "Access to unedited images",
      },
      "gallery-recovery-window": {
        status: "added",
        value: "3-month gallery recovery",
      },
    }),
    progression: {
      stepLabel: "Step 2 expansion",
      overview:
        "Premium makes the biggest mid-ladder jump: it deepens the session again and explicitly adds unedited-image access plus 3-month gallery recovery.",
      headlineShifts: [
        {
          dimensionId: "shooting-time",
          label: "Shooting time",
          kind: "expanded",
          previousValue: "1 hour",
          value: "2 hours",
        },
        {
          dimensionId: "edited-image-count",
          label: "Edited-image count",
          kind: "expanded",
          previousValue: "7",
          value: "15",
        },
      ],
      inclusionShifts: [
        {
          familyId: "unedited-image-access",
          label: "Unedited-image access",
          kind: "added",
          previousValue: null,
          value: "Access to unedited images",
        },
        {
          familyId: "gallery-recovery-window",
          label: "Gallery recovery window",
          kind: "added",
          previousValue: null,
          value: "3-month gallery recovery",
        },
      ],
    },
  },
  {
    name: "Platinum",
    bookingIntent: "platinum",
    summary:
      "The most complete signature option, built for higher-touch planning, beauty support, outfit curation, and behind-the-scenes coverage.",
    price: "£1,600",
    shootingTime: "2 hours",
    editedImageCount: "20",
    outfitAllowance: "Unlimited outfits",
    keyInclusions: [
      "Posing guidance",
      "Access to unedited images",
      "6-month gallery recovery",
      "Location scouting",
      "Pro makeup & hair",
      "Curation of 3 outfits",
      "BTS",
    ],
    headlineComparison: buildHeadlineComparison({
      price: "£1,600",
      "shooting-time": "2 hours",
      "edited-image-count": "20",
      "outfit-allowance": "Unlimited outfits",
    }),
    inclusionComparison: buildInclusionComparison({
      "posing-styling-guidance": {
        status: "shared",
        value: "Posing guidance",
      },
      "unedited-image-access": {
        status: "shared",
        value: "Access to unedited images",
      },
      "gallery-recovery-window": {
        status: "upgraded",
        value: "6-month gallery recovery",
      },
      "location-planning-scouting": {
        status: "added",
        value: "Location scouting",
      },
      "professional-hair-makeup": {
        status: "added",
        value: "Pro makeup & hair",
      },
      "outfit-curation-support": {
        status: "added",
        value: "Curation of 3 outfits",
      },
      "behind-the-scenes-coverage": {
        status: "added",
        value: "BTS",
      },
    }),
    progression: {
      stepLabel: "Step 3 signature upgrade",
      overview:
        "Platinum upgrades the Premium foundation with a longer recovery window and adds the planning, beauty, styling, and BTS support that make the biggest premium leap.",
      headlineShifts: [
        {
          dimensionId: "edited-image-count",
          label: "Edited-image count",
          kind: "expanded",
          previousValue: "15",
          value: "20",
        },
      ],
      inclusionShifts: [
        {
          familyId: "gallery-recovery-window",
          label: "Gallery recovery window",
          kind: "upgraded",
          previousValue: "3-month gallery recovery",
          value: "6-month gallery recovery",
        },
        {
          familyId: "location-planning-scouting",
          label: "Location planning/scouting",
          kind: "added",
          previousValue: null,
          value: "Location scouting",
        },
        {
          familyId: "professional-hair-makeup",
          label: "Professional hair and makeup",
          kind: "added",
          previousValue: null,
          value: "Pro makeup & hair",
        },
        {
          familyId: "outfit-curation-support",
          label: "Outfit curation support",
          kind: "added",
          previousValue: null,
          value: "Curation of 3 outfits",
        },
        {
          familyId: "behind-the-scenes-coverage",
          label: "Behind-the-scenes coverage",
          kind: "added",
          previousValue: null,
          value: "BTS",
        },
      ],
    },
  },
];

export const publicAddOnCategories: PublicAddOnCategory[] = [
  {
    id: "photo",
    name: "Additional photo services",
    description:
      "Keep the core package choice calm, then layer in only the finishing support or extra image volume you actually need.",
    items: [
      {
        name: "Rush Delivery",
        price: "£150",
        description:
          "Priority turnaround for clients who need their final gallery back on a tighter timeline.",
      },
      {
        name: "Access to All Unedited Images",
        price: "£250",
        description:
          "Receive the full unedited image set from the session in addition to your edited delivery.",
      },
      {
        name: "Additional Edited Images",
        price: "£40 / image",
        description:
          "Add fully edited final selects beyond the included image count in your chosen package.",
      },
      {
        name: "Additional Images (Colour Correction Only)",
        price: "£20 / image",
        description:
          "Expand the gallery with extra images that receive colour correction without full retouching.",
      },
      {
        name: "Retouching of Third-Party Images",
        price: "£35 / image",
        description:
          "Apply matching retouching work to imagery captured outside this session when you need a consistent set.",
      },
      {
        name: "Cropping/Resizing for Specific Formats",
        price: "£30 flat fee",
        description:
          "Prepare your chosen images for social, web, LinkedIn, print, or AI-assisted background extension formats.",
      },
    ],
  },
  {
    id: "video",
    name: "Video services",
    description:
      "Short-form motion add-ons stay separate here so they are easy to compare without crowding the package decision.",
    items: [
      {
        name: "Teaser (5-10 seconds)",
        price: "£50",
        description:
          "A short motion accent for social posting, launch teasers, or polished post-session reveals.",
      },
      {
        name: "Edit (15 seconds)",
        price: "£75",
        description:
          "A balanced short-form edit for clients who want a more complete movement-led recap.",
      },
      {
        name: "Extended (30 seconds)",
        price: "£150",
        description:
          "A longer edit with room for pacing, transitions, and a more cinematic highlight cut.",
      },
    ],
  },
];

export const destinationPackages: PublicDestinationOffer[] = [
  {
    name: "City Escape",
    summary: "Nearby-city editorial package",
    positioning:
      "Designed for a stylish short-haul session with a travel feel and an efficient production rhythm.",
    inclusions: [
      "Editorial planning call",
      "Travel-aware timeline guidance",
      "Curated city location pairing",
      "Expanded gallery delivery",
    ],
  },
  {
    name: "Coastal Weekend",
    summary: "Seaside or countryside weekend package",
    positioning:
      "Built for slower, atmospheric coverage across a weekend setting with a relaxed premium pace.",
    inclusions: [
      "Weekend scheduling support",
      "Light itinerary shaping",
      "Scenery-led session design",
      "Premium retouching selection",
    ],
  },
  {
    name: "Signature Destination",
    summary: "Bespoke flagship destination experience",
    positioning:
      "A high-touch flagship offer for clients wanting the most tailored travel-led portrait experience.",
    inclusions: [
      "Bespoke creative direction",
      "Concierge-style planning support",
      "Multi-scene destination coverage",
      "Luxury gallery and keepsake guidance",
    ],
  },
];

export const supplementalOfferOptions: SupplementalOfferOption[] = [
  {
    name: "Bespoke Shoot",
    bookingIntent: "bespoke",
    summary: "Tailored custom offer path",
    description:
      "For clients planning something more individual than the core package set, with custom pacing, creative direction, or location ambitions that call for a more tailored path.",
  },
  {
    name: "Consultation",
    bookingIntent: "consultation",
    summary: "Guidance-first starting point",
    description:
      "For clients who want help choosing between packages, add-ons, and live services before settling into the booking flow.",
  },
];
