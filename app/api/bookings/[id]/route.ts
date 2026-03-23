import { BookingStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminSession } from "@/lib/auth-guard";
import { apiError, handleApiError } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { sendStatusEmail } from "@/lib/resend";

const updateBookingStatusSchema = z.object({
  status: z.nativeEnum(BookingStatus),
});

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
    const body = updateBookingStatusSchema.parse(await request.json());
    const existingBooking = await prisma.booking.findUnique({
      where: { id },
    });

    if (!existingBooking) {
      return apiError("Not found", 404);
    }

    const booking = await prisma.booking.update({
      where: { id },
      data: {
        status: body.status,
      },
      include: {
        service: true,
      },
    });

    if (existingBooking.status !== booking.status) {
      try {
        await sendStatusEmail(booking);
      } catch (error: unknown) {
        console.error("Failed to send booking status email", error);
      }
    }

    return NextResponse.json({ booking });
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
