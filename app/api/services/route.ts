import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminSession } from "@/lib/auth-guard";
import { apiError, handleApiError } from "@/lib/http";
import { prisma } from "@/lib/prisma";

const createServiceSchema = z.object({
  name: z.string().min(1, "Service name is required"),
  duration: z.number().int().positive("Duration must be a positive number"),
  description: z.string().min(1, "Description is required"),
  price: z.number().int().nonnegative("Price must be zero or greater"),
});

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      where: {
        active: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ services });
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
    const body = createServiceSchema.parse(await request.json());
    const service = await prisma.service.create({
      data: body,
    });

    return NextResponse.json({ service }, { status: 201 });
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
