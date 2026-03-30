export type TravelAvailabilityStatus =
  | "confirmed"
  | "planned"
  | "open-interest";

export interface TravelAvailabilityEntry {
  id: string;
  city: string;
  destination: string;
  windowLabel: string;
  status: TravelAvailabilityStatus;
  summary: string;
  supportingCopy: string;
}

export const travelAvailabilityStatusMeta: Record<
  TravelAvailabilityStatus,
  {
    label: string;
    description: string;
  }
> = {
  confirmed: {
    label: "Confirmed",
    description: "Travel dates are already locked in for this city.",
  },
  planned: {
    label: "Planned",
    description: "Travel is being shaped now and can still absorb aligned interest.",
  },
  "open-interest": {
    label: "Open interest",
    description:
      "This city is not booked yet, but strong client demand can open a travel window.",
  },
};

export const travelAvailabilityEntries: TravelAvailabilityEntry[] = [
  {
    id: "paris-may-2026",
    city: "Paris",
    destination: "Paris, France",
    windowLabel: "12-16 May 2026",
    status: "confirmed",
    summary: "Confirmed spring editorial days for portraits shaped around soft city light.",
    supportingCopy:
      "Best fit for clients who already know they want a Paris backdrop and want the clearest booking runway.",
  },
  {
    id: "copenhagen-june-2026",
    city: "Copenhagen",
    destination: "Copenhagen, Denmark",
    windowLabel: "Late June 2026",
    status: "planned",
    summary:
      "A planned early-summer window for clean architecture, coastline, and slower editorial pacing.",
    supportingCopy:
      "Strong early interest here helps finalize dates and keeps the planning conversation efficient.",
  },
  {
    id: "edinburgh-autumn-2026",
    city: "Edinburgh",
    destination: "Edinburgh, Scotland",
    windowLabel: "Autumn 2026",
    status: "open-interest",
    summary:
      "Open for interest if you want old-stone texture, layered styling, and a more cinematic seasonal mood.",
    supportingCopy:
      "Registering interest here is the best route if you want to shape where future travel opens next.",
  },
];

export function getTravelAvailabilityEntry(id: string) {
  return travelAvailabilityEntries.find((entry) => entry.id === id);
}
