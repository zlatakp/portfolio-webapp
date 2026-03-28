export interface PublicOfferTier {
  name: "Express" | "Standard" | "Premium" | "Platinum";
  summary: string;
  progressionLabel: string;
  inclusions: string[];
}

export interface PublicDestinationOffer {
  name: "City Escape" | "Coastal Weekend" | "Signature Destination";
  summary: string;
  positioning: string;
  inclusions: string[];
}

export const corePackageTiers: PublicOfferTier[] = [
  {
    name: "Express",
    summary: "A polished editorial session for quick, refined coverage close to home.",
    progressionLabel: "A focused starting point for concise portrait storytelling.",
    inclusions: [
      "45-minute guided session",
      "1 look",
      "1 nearby location",
      "12 edited images",
      "Private online gallery",
    ],
  },
  {
    name: "Standard",
    summary: "More time, more variety, and more finished imagery for a fuller gallery.",
    progressionLabel:
      "Includes everything in Express plus 90-minute session, 2 looks, 20 edited images, styling guidance.",
    inclusions: [
      "Everything in Express",
      "90-minute session",
      "2 looks",
      "20 edited images",
      "Styling guidance",
    ],
  },
  {
    name: "Premium",
    summary: "An expanded editorial experience with room for deeper pacing and elevated planning.",
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
  },
  {
    name: "Platinum",
    summary: "The most complete signature tier for multi-scene storytelling and luxury coordination.",
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
