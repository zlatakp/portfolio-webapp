import { describe, expect, it, vi } from "vitest";
import { getAvailableSlotsWithDependencies } from "./availability";

function createDependencies(overrides?: {
  dateOverride?: {
    startTime: string;
    endTime: string;
    isBlocked: boolean;
  } | null;
  weeklyRule?: {
    startTime: string;
    endTime: string;
    isBlocked: boolean;
  } | null;
  service?: {
    duration: number;
    active: boolean;
  } | null;
  bookings?: Array<{
    startTime: string;
    endTime: string;
  }>;
}) {
  return {
    findDateOverride: vi
      .fn()
      .mockResolvedValue(overrides?.dateOverride === undefined ? null : overrides.dateOverride),
    findWeeklyRule: vi.fn().mockResolvedValue(
      overrides?.weeklyRule === undefined
        ? {
            startTime: "09:00",
            endTime: "12:00",
            isBlocked: false,
          }
        : overrides.weeklyRule,
    ),
    findService: vi.fn().mockResolvedValue(
      overrides?.service === undefined
        ? {
            duration: 60,
            active: true,
          }
        : overrides.service,
    ),
    findBookings: vi
      .fn()
      .mockResolvedValue(overrides?.bookings === undefined ? [] : overrides.bookings),
  };
}

describe("getAvailableSlotsWithDependencies", () => {
  it("returns no slots when a blocked date override exists", async () => {
    const dependencies = createDependencies({
      dateOverride: {
        startTime: "10:00",
        endTime: "14:00",
        isBlocked: true,
      },
    });

    const slots = await getAvailableSlotsWithDependencies(
      "2026-03-24",
      "service_1",
      dependencies,
    );

    expect(slots).toEqual([]);
    expect(dependencies.findWeeklyRule).not.toHaveBeenCalled();
  });

  it("returns no slots when no weekly rule exists", async () => {
    const dependencies = createDependencies({
      weeklyRule: null,
    });

    const slots = await getAvailableSlotsWithDependencies(
      "2026-03-24",
      "service_1",
      dependencies,
    );

    expect(slots).toEqual([]);
  });

  it("generates slots in service-duration increments", async () => {
    const dependencies = createDependencies({
      weeklyRule: {
        startTime: "09:00",
        endTime: "13:30",
        isBlocked: false,
      },
      service: {
        duration: 90,
        active: true,
      },
    });

    const slots = await getAvailableSlotsWithDependencies(
      "2026-03-24",
      "service_1",
      dependencies,
    );

    expect(slots).toEqual(["09:00", "10:30", "12:00"]);
  });

  it("removes overlapping bookings from the returned slots", async () => {
    const dependencies = createDependencies({
      weeklyRule: {
        startTime: "09:00",
        endTime: "12:00",
        isBlocked: false,
      },
      service: {
        duration: 60,
        active: true,
      },
      bookings: [
        {
          startTime: "10:00",
          endTime: "11:00",
        },
      ],
    });

    const slots = await getAvailableSlotsWithDependencies(
      "2026-03-24",
      "service_1",
      dependencies,
    );

    expect(slots).toEqual(["09:00", "11:00"]);
  });

  it("prefers a date override over the weekly rule", async () => {
    const dependencies = createDependencies({
      dateOverride: {
        startTime: "13:00",
        endTime: "15:00",
        isBlocked: false,
      },
      weeklyRule: {
        startTime: "09:00",
        endTime: "12:00",
        isBlocked: false,
      },
    });

    const slots = await getAvailableSlotsWithDependencies(
      "2026-03-24",
      "service_1",
      dependencies,
    );

    expect(slots).toEqual(["13:00", "14:00"]);
  });
});
