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
  sequence: string;
  baseLabel: string;
  additiveSummary: string;
  progressionLabel: string;
  inclusions: string[];
  addedInclusions: string[];
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

export const corePackageTiers: PublicOfferTier[] = [
  {
    name: "Express",
    bookingIntent: "express",
    summary: "A polished editorial session for quick, refined coverage close to home.",
    sequence: "01",
    baseLabel: "Foundational package",
    additiveSummary: "Begins with the full essential package foundation.",
    progressionLabel: "A focused starting point for concise portrait storytelling.",
    inclusions: [
      "45-minute guided session",
      "1 look",
      "1 nearby location",
      "12 edited images",
      "Private online gallery",
    ],
    addedInclusions: [
      "45-minute guided session",
      "1 look",
      "1 nearby location",
      "12 edited images",
      "Private online gallery",
    ],
  },
  {
    name: "Standard",
    bookingIntent: "standard",
    summary: "More time, more variety, and more finished imagery for a fuller gallery.",
    sequence: "02",
    baseLabel: "Everything in Express",
    additiveSummary: "Adds more time, a second look, and a broader edited gallery.",
    progressionLabel:
      "Includes everything in Express plus 90-minute session, 2 looks, 20 edited images, styling guidance.",
    inclusions: [
      "Everything in Express",
      "90-minute session",
      "2 looks",
      "20 edited images",
      "Styling guidance",
    ],
    addedInclusions: [
      "90-minute session",
      "2 looks",
      "20 edited images",
      "Styling guidance",
    ],
  },
  {
    name: "Premium",
    bookingIntent: "premium",
    summary: "An expanded editorial experience with room for deeper pacing and elevated planning.",
    sequence: "03",
    baseLabel: "Everything in Standard",
    additiveSummary:
      "Adds deeper session pacing, more looks, and elevated support around planning and retouching.",
    progressionLabel:
      "Includes everything in Standard plus 2.5-hour session, 3 looks, 35 edited images, priority retouching, location-planning support.",
    inclusions: [
      "Everything in Standard",
      "2.5-hour session",
      "3 looks",
      "35 edited images",
      "Priority retouching",
      "Location-planning support",
    ],
    addedInclusions: [
      "2.5-hour session",
      "3 looks",
      "35 edited images",
      "Priority retouching",
      "Location-planning support",
    ],
  },
  {
    name: "Platinum",
    bookingIntent: "platinum",
    summary: "The most complete signature tier for multi-scene storytelling and luxury coordination.",
    sequence: "04",
    baseLabel: "Everything in Premium",
    additiveSummary:
      "Adds the fullest itinerary, expanded delivery, and the most concierge-led planning support.",
    progressionLabel:
      "Includes everything in Premium plus half-day coverage, multi-location itinerary, 60 edited images, concierge timeline planning, album or print credit.",
    inclusions: [
      "Everything in Premium",
      "Half-day coverage",
      "Multi-location itinerary",
      "60 edited images",
      "Concierge timeline planning",
      "Album or print credit",
    ],
    addedInclusions: [
      "Half-day coverage",
      "Multi-location itinerary",
      "60 edited images",
      "Concierge timeline planning",
      "Album or print credit",
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
      "For clients planning something more individual than the core ladder, with custom pacing, creative direction, or location ambitions that call for a more tailored path.",
  },
  {
    name: "Consultation",
    bookingIntent: "consultation",
    summary: "Guidance-first starting point",
    description:
      "For clients who want help deciding which package fits best before moving into the current booking flow and choosing a live service.",
  },
];
