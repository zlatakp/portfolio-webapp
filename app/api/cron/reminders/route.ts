import { BookingStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { sendBookingReminderEmail } from "@/lib/resend";
import { prisma } from "@/lib/prisma";

function getTomorrowRange() {
  const start = new Date();
  start.setUTCHours(0, 0, 0, 0);
  start.setUTCDate(start.getUTCDate() + 1);

  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 1);

  return { start, end };
}

export async function POST(request: Request) {
  const authorization = request.headers.get("authorization");
  const expectedToken = process.env.NEXTAUTH_SECRET;

  if (!authorization || !expectedToken || authorization !== `Bearer ${expectedToken}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { start, end } = getTomorrowRange();
  const bookings = await prisma.booking.findMany({
    where: {
      status: BookingStatus.CONFIRMED,
      date: {
        gte: start,
        lt: end,
      },
    },
    include: {
      service: true,
    },
  });

  let sent = 0;

  for (const booking of bookings) {
    await sendBookingReminderEmail(booking);
    sent += 1;
  }

  return NextResponse.json({ sent });
}
