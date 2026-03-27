import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth-guard";
import { apiError, handleApiError } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import {
  SITE_CONTENT_ID,
  getSiteContent,
  getSelectedPublicTheme,
  mergeSiteContent,
  siteContentEditableSchema,
} from "@/lib/site-content";

export async function GET() {
  const session = await requireAdminSession();

  if (!session) {
    return apiError("Unauthorized", 401);
  }

  const content = await getSiteContent();
  const themePreset = getSelectedPublicTheme(content);

  return NextResponse.json({ content, themePreset });
}

export async function PATCH(request: Request) {
  const session = await requireAdminSession();

  if (!session) {
    return apiError("Unauthorized", 401);
  }

  try {
    const editableContent = siteContentEditableSchema.parse(await request.json());
    const currentContent = await getSiteContent();
    const content = mergeSiteContent(currentContent, editableContent);
    const themePreset = getSelectedPublicTheme(content);

    await prisma.siteContent.upsert({
      where: {
        id: SITE_CONTENT_ID,
      },
      update: {
        content: content as Prisma.InputJsonValue,
      },
      create: {
        id: SITE_CONTENT_ID,
        content: content as Prisma.InputJsonValue,
      },
    });

    return NextResponse.json({ content, themePreset });
  } catch (error) {
    return handleApiError(error);
  }
}
