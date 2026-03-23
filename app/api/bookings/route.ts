import { BookingStatus, Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminSession } from "@/lib/auth-guard";
import { getAvailableSlots, getDateRange, minutesToTime, parseDateOnly, timeToMinutes } from "@/lib/availability";
import { apiError, handleApiError } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import {
  sendBookingConfirmationEmail,
  sendPhotographerBookingNotification,
} from "@/lib/resend";

const bookingsQuerySchema = z.object({
  status: z.nativeEnum(BookingStatus).optional(),
  date: z.string().date().optional(),
});

const createBookingSchema = z.object({
  serviceId: z.string().min(1, "serviceId is required"),
  clientName: z.string().min(1, "Client name is required"),
  clientEmail: z.string().email("A valid email is required"),
  clientPhone: z.string().min(1).optional(),
  notes: z.string().min(1).optional(),
  date: z.string().date(),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, "startTime must be HH:MM"),
});

export async function GET(request: Request) {
  const session = await requireAdminSession();

  if (!session) {
    return apiError("Unauthorized", 401);
  }

  try {
    const { searchParams } = new URL(request.url);
    const query = bookingsQuerySchema.parse({
      status: searchParams.get("status") ?? undefined,
      date: searchParams.get("date") ?? undefined,
    });
    const range = query.date ? getDateRange(query.date) : null;

    const where: Prisma.BookingWhereInput = {
      ...(query.status ? { status: query.status } : {}),
      ...(range
        ? {
            date: {
              gte: range.start,
              lt: range.end,
            },
          }
        : {}),
    };

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        service: true,
      },
      orderBy: [{ date: "asc" }, { startTime: "asc" }],
    });

    return NextResponse.json({ bookings });
  } catch (error: unknown) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const body = createBookingSchema.parse(await request.json());
    const service = await prisma.service.findUnique({
      where: {
        id: body.serviceId,
      },
    });

    if (!service || !service.active) {
      return apiError("Not found", 404);
    }

    const availableSlots = await getAvailableSlots(body.date, body.serviceId);

    if (!availableSlots.includes(body.startTime)) {
      return apiError("This slot is no longer available", 409);
    }

    const endTime = minutesToTime(timeToMinutes(body.startTime) + service.duration);
    const booking = await prisma.booking.create({
      data: {
        serviceId: body.serviceId,
        clientName: body.clientName,
        clientEmail: body.clientEmail,
        clientPhone: body.clientPhone,
        notes: body.notes,
        date: parseDateOnly(body.date),
        startTime: body.startTime,
        endTime,
      },
      include: {
        service: true,
      },
    });

    try {
      await sendBookingConfirmationEmail(booking);
      await sendPhotographerBookingNotification(booking);
    } catch (error: unknown) {
      console.error("Failed to send booking submission emails", error);
    }

    return NextResponse.json({ booking }, { status: 201 });
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
