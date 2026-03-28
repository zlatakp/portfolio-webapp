export type PublicOfferIntent =
  | "express"
  | "standard"
  | "premium"
  | "platinum"
  | "bespoke"
  | "consultation";

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
