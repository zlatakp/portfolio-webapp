import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminSession } from "@/lib/auth-guard";
import { getAvailableSlots, parseDateOnly } from "@/lib/availability";
import { apiError, handleApiError } from "@/lib/http";
import { prisma } from "@/lib/prisma";

const createAvailabilitySchema = z
  .object({
    dayOfWeek: z.number().int().min(0).max(6).nullable(),
    date: z.string().date().nullable(),
    startTime: z.string().regex(/^\d{2}:\d{2}$/, "Start time must be HH:MM"),
    endTime: z.string().regex(/^\d{2}:\d{2}$/, "End time must be HH:MM"),
    isBlocked: z.boolean().default(false),
  })
  .refine((value) => !(value.dayOfWeek === null && value.date === null), {
    message: "Either dayOfWeek or date is required",
  })
  .refine((value) => !(value.dayOfWeek !== null && value.date !== null), {
    message: "Use either dayOfWeek or date, not both",
  });

const querySchema = z.object({
  date: z.string().date(),
  serviceId: z.string().min(1, "serviceId is required"),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = querySchema.parse({
      date: searchParams.get("date"),
      serviceId: searchParams.get("serviceId"),
    });

    const slots = await getAvailableSlots(query.date, query.serviceId);

    return NextResponse.json({ slots });
  } catch (error: unknown) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  const session = await requireAdminSession();

  if (!session) {
    return apiError("Unauthorized", 401);
  }

  try {
    const body = createAvailabilitySchema.parse(await request.json());
    const availability = await prisma.availability.create({
      data: {
        dayOfWeek: body.dayOfWeek,
        date: body.date ? parseDateOnly(body.date) : null,
        startTime: body.startTime,
        endTime: body.endTime,
        isBlocked: body.isBlocked,
      },
    });

    return NextResponse.json({ availability }, { status: 201 });
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
