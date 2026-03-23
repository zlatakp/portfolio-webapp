import { BookingsTable } from "@/components/admin/BookingsTable";
import { prisma } from "@/lib/prisma";

export default async function DashboardBookingsPage() {
  const bookings = await prisma.booking.findMany({
    include: {
      service: {
        select: {
          name: true,
        },
      },
    },
    orderBy: [{ date: "asc" }, { startTime: "asc" }],
  });

  return (
    <BookingsTable
      initialBookings={bookings.map((booking) => ({
        ...booking,
        date: booking.date.toISOString(),
      }))}
    />
  );
}
