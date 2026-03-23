import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminSession } from "@/lib/auth-guard";
import { parseDateOnly } from "@/lib/availability";
import { apiError, handleApiError } from "@/lib/http";
import { prisma } from "@/lib/prisma";

const updateAvailabilitySchema = z
  .object({
    dayOfWeek: z.number().int().min(0).max(6).nullable().optional(),
    date: z.string().date().nullable().optional(),
    startTime: z.string().regex(/^\d{2}:\d{2}$/, "Start time must be HH:MM").optional(),
    endTime: z.string().regex(/^\d{2}:\d{2}$/, "End time must be HH:MM").optional(),
    isBlocked: z.boolean().optional(),
  })
  .refine(
    (value) =>
      !(
        value.dayOfWeek !== undefined &&
        value.date !== undefined &&
        value.dayOfWeek !== null &&
        value.date !== null
      ),
    {
      message: "Use either dayOfWeek or date, not both",
    },
  );

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function PATCH(request: Request, { params }: RouteContext) {
  const session = await requireAdminSession();

  if (!session) {
    return apiError("Unauthorized", 401);
  }

  try {
    const { id } = await params;
    const body = updateAvailabilitySchema.parse(await request.json());
    const existingRule = await prisma.availability.findUnique({
      where: { id },
    });

    if (!existingRule) {
      return apiError("Not found", 404);
    }

    const availability = await prisma.availability.update({
      where: { id },
      data: {
        ...(body.dayOfWeek !== undefined ? { dayOfWeek: body.dayOfWeek } : {}),
        ...(body.date !== undefined
          ? { date: body.date ? parseDateOnly(body.date) : null }
          : {}),
        ...(body.startTime !== undefined ? { startTime: body.startTime } : {}),
        ...(body.endTime !== undefined ? { endTime: body.endTime } : {}),
        ...(body.isBlocked !== undefined ? { isBlocked: body.isBlocked } : {}),
      },
    });

    return NextResponse.json({ availability });
  } catch (error: unknown) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const session = await requireAdminSession();

  if (!session) {
    return apiError("Unauthorized", 401);
  }

  try {
    const { id } = await params;
    const existingRule = await prisma.availability.findUnique({
      where: { id },
    });

    if (!existingRule) {
      return apiError("Not found", 404);
    }

    await prisma.availability.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
