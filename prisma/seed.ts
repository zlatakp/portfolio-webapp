import bcrypt from "bcryptjs";
import { Prisma, PrismaClient } from "@prisma/client";
import {
  SITE_CONTENT_ID,
  defaultSiteContent,
} from "../lib/site-content";

const prisma = new PrismaClient();

async function main(): Promise<void> {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set to seed the admin user.");
  }

  const password = await bcrypt.hash(adminPassword, 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { password },
    create: {
      email: adminEmail,
      password,
    },
  });

  await prisma.siteContent.upsert({
    where: {
      id: SITE_CONTENT_ID,
    },
    update: {
      content: defaultSiteContent as Prisma.InputJsonValue,
    },
    create: {
      id: SITE_CONTENT_ID,
      content: defaultSiteContent as Prisma.InputJsonValue,
    },
  });
}

main()
  .catch((error: unknown) => {
    console.error("Failed to seed database", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
