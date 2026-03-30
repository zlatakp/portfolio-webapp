import { NextResponse } from "next/server";
import { z } from "zod";
import { apiError, handleApiError } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { sendPhotographerTravelInterestNotification } from "@/lib/resend";
import { getTravelAvailabilityEntry } from "@/lib/travel-availability";

const createTravelInterestSchema = z.object({
  travelAvailabilityId: z.string().min(1).optional(),
  city: z.string().trim().min(1, "City is required"),
  clientName: z.string().trim().min(1, "Client name is required"),
  clientEmail: z.string().trim().email("A valid email is required"),
  clientPhone: z.string().trim().min(1).optional(),
  preferredTiming: z.string().trim().min(1).optional(),
  notes: z.string().trim().min(1).optional(),
});

export async function POST(request: Request) {
  try {
    const body = createTravelInterestSchema.parse(await request.json());

    if (
      body.travelAvailabilityId &&
      !getTravelAvailabilityEntry(body.travelAvailabilityId)
    ) {
      return apiError("Selected travel availability option was not found", 400);
    }

    const travelInterest = await prisma.travelInterest.create({
      data: {
        city: body.city,
        travelAvailabilityId: body.travelAvailabilityId,
        clientName: body.clientName,
        clientEmail: body.clientEmail,
        clientPhone: body.clientPhone,
        preferredTiming: body.preferredTiming,
        notes: body.notes,
      },
    });

    try {
      await sendPhotographerTravelInterestNotification(travelInterest);
    } catch (error: unknown) {
      console.error("Failed to send travel interest notification", error);
    }

    return NextResponse.json({ travelInterest }, { status: 201 });
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
