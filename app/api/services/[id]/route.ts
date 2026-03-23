import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminSession } from "@/lib/auth-guard";
import { apiError, handleApiError } from "@/lib/http";
import { prisma } from "@/lib/prisma";

const updateServiceSchema = z.object({
  name: z.string().min(1, "Service name is required").optional(),
  duration: z.number().int().positive("Duration must be a positive number").optional(),
  description: z.string().min(1, "Description is required").optional(),
  price: z.number().int().nonnegative("Price must be zero or greater").optional(),
  active: z.boolean().optional(),
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
    const body = updateServiceSchema.parse(await request.json());
    const existingService = await prisma.service.findUnique({
      where: { id },
    });

    if (!existingService) {
      return apiError("Not found", 404);
    }

    const service = await prisma.service.update({
      where: { id },
      data: body,
    });

    return NextResponse.json({ service });
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
    const existingService = await prisma.service.findUnique({
      where: { id },
    });

    if (!existingService) {
      return apiError("Not found", 404);
    }

    const service = await prisma.service.update({
      where: { id },
      data: { active: false },
    });

    return NextResponse.json({ service });
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
