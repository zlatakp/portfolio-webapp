import { BookingStatus, type Booking, type Service } from "@prisma/client";
import { prisma } from "@/lib/prisma";

type BookingWithTimes = Pick<Booking, "startTime" | "endTime">;
type AvailabilityRule = {
  startTime: string;
  endTime: string;
  isBlocked: boolean;
};

interface AvailabilityDependencies {
  findDateOverride(date: string): Promise<AvailabilityRule | null>;
  findWeeklyRule(dayOfWeek: number): Promise<AvailabilityRule | null>;
  findService(serviceId: string): Promise<Pick<Service, "duration" | "active"> | null>;
  findBookings(date: string): Promise<BookingWithTimes[]>;
}

const ACTIVE_BOOKING_STATUSES = [BookingStatus.PENDING, BookingStatus.CONFIRMED];

/**
 * Returns the UTC midnight date for a YYYY-MM-DD string.
 */
export function parseDateOnly(date: string): Date {
  return new Date(`${date}T00:00:00.000Z`);
}

/**
 * Converts a HH:MM string to minutes since midnight.
 */
export function timeToMinutes(value: string): number {
  const [hours, minutes] = value.split(":").map(Number);

  return hours * 60 + minutes;
}

/**
 * Converts minutes since midnight back into a HH:MM string.
 */
export function minutesToTime(value: number): string {
  const hours = Math.floor(value / 60)
    .toString()
    .padStart(2, "0");
  const minutes = (value % 60).toString().padStart(2, "0");

  return `${hours}:${minutes}`;
}

/**
 * Calculates the UTC date range bounds for a YYYY-MM-DD string.
 */
export function getDateRange(date: string) {
  const start = parseDateOnly(date);
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 1);

  return { start, end };
}

async function createAvailabilityDependencies(): Promise<AvailabilityDependencies> {
  return {
    async findDateOverride(date: string) {
      const { start, end } = getDateRange(date);

      return prisma.availability.findFirst({
        where: {
          dayOfWeek: null,
          date: {
            gte: start,
            lt: end,
          },
        },
        select: {
          startTime: true,
          endTime: true,
          isBlocked: true,
        },
      });
    },
    async findWeeklyRule(dayOfWeek: number) {
      return prisma.availability.findFirst({
        where: {
          dayOfWeek,
          date: null,
        },
        select: {
          startTime: true,
          endTime: true,
          isBlocked: true,
        },
      });
    },
    async findService(serviceId: string) {
      return prisma.service.findUnique({
        where: {
          id: serviceId,
        },
        select: {
          duration: true,
          active: true,
        },
      });
    },
    async findBookings(date: string) {
      const { start, end } = getDateRange(date);

      return prisma.booking.findMany({
        where: {
          date: {
            gte: start,
            lt: end,
          },
          status: {
            in: ACTIVE_BOOKING_STATUSES,
          },
        },
        select: {
          startTime: true,
          endTime: true,
        },
      });
    },
  };
}

/**
 * Implements the spec-defined slot generation algorithm for a service on a date.
 */
export async function getAvailableSlots(date: string, serviceId: string): Promise<string[]> {
  const dependencies = await createAvailabilityDependencies();

  return getAvailableSlotsWithDependencies(date, serviceId, dependencies);
}

/**
 * Internal dependency-injected version of the slot algorithm for tests.
 */
export async function getAvailableSlotsWithDependencies(
  date: string,
  serviceId: string,
  dependencies: AvailabilityDependencies,
): Promise<string[]> {
  const targetDate = parseDateOnly(date);
  const dayOfWeek = targetDate.getUTCDay();

  const dateOverride = await dependencies.findDateOverride(date);

  if (dateOverride) {
    if (dateOverride.isBlocked) {
      return [];
    }

    return buildAvailableSlots(dateOverride, serviceId, date, dependencies);
  }

  const weeklyRule = await dependencies.findWeeklyRule(dayOfWeek);

  if (!weeklyRule || weeklyRule.isBlocked) {
    return [];
  }

  return buildAvailableSlots(weeklyRule, serviceId, date, dependencies);
}

async function buildAvailableSlots(
  rule: AvailabilityRule,
  serviceId: string,
  date: string,
  dependencies: AvailabilityDependencies,
) {
  const service = await dependencies.findService(serviceId);

  if (!service || !service.active) {
    return [];
  }

  const startMinutes = timeToMinutes(rule.startTime);
  const endMinutes = timeToMinutes(rule.endTime);
  const slotDuration = service.duration;
  const candidateSlots: string[] = [];

  for (let slotStart = startMinutes; slotStart + slotDuration <= endMinutes; slotStart += slotDuration) {
    candidateSlots.push(minutesToTime(slotStart));
  }

  const bookings = await dependencies.findBookings(date);

  return candidateSlots.filter((slot) => {
    const slotStart = timeToMinutes(slot);
    const slotEnd = slotStart + slotDuration;

    return !bookings.some((booking) => {
      const existingStart = timeToMinutes(booking.startTime);
      const existingEnd = timeToMinutes(booking.endTime);

      return slotStart < existingEnd && slotEnd > existingStart;
    });
  });
}
