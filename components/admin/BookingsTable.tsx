"use client";

import { BookingStatus, type Service } from "@prisma/client";
import { useMemo, useState, useTransition } from "react";

type BookingWithService = {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string | null;
  notes: string | null;
  date: string | Date;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  service: Pick<Service, "name">;
};

interface BookingsTableProps {
  initialBookings: BookingWithService[];
}

function formatDate(value: string | Date) {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function BookingsTable({ initialBookings }: BookingsTableProps) {
  const [bookings, setBookings] = useState(initialBookings);
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "ALL">("ALL");
  const [dateFilter, setDateFilter] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const matchesStatus = statusFilter === "ALL" || booking.status === statusFilter;
      const matchesDate =
        !dateFilter ||
        new Date(booking.date).toISOString().slice(0, 10) === dateFilter;

      return matchesStatus && matchesDate;
    });
  }, [bookings, dateFilter, statusFilter]);

  function updateBookingStatus(id: string, status: BookingStatus) {
    startTransition(async () => {
      setError("");

      const response = await fetch(`/api/bookings/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      const payload = (await response.json()) as
        | { booking: BookingWithService }
        | { error: string };

      if (!response.ok || !("booking" in payload)) {
        setError("error" in payload ? payload.error : "Failed to update booking.");
        return;
      }

      setBookings((current) =>
        current.map((booking) =>
          booking.id === payload.booking.id ? payload.booking : booking,
        ),
      );
    });
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 rounded-[1.75rem] border border-stone-800 bg-stone-900/70 p-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-amber-200/60">Bookings</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-stone-50">
            Track requests and keep session statuses moving.
          </h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="space-y-2 text-sm text-stone-300">
            <span>Status</span>
            <select
              className="w-full rounded-2xl border border-stone-700 bg-stone-950 px-4 py-3 text-sm text-stone-100"
              onChange={(event) =>
                setStatusFilter(event.target.value as BookingStatus | "ALL")
              }
              value={statusFilter}
            >
              <option value="ALL">All statuses</option>
              <option value={BookingStatus.PENDING}>Pending</option>
              <option value={BookingStatus.CONFIRMED}>Confirmed</option>
              <option value={BookingStatus.CANCELLED}>Cancelled</option>
            </select>
          </label>

          <label className="space-y-2 text-sm text-stone-300">
            <span>Date</span>
            <input
              className="w-full rounded-2xl border border-stone-700 bg-stone-950 px-4 py-3 text-sm text-stone-100"
              onChange={(event) => setDateFilter(event.target.value)}
              type="date"
              value={dateFilter}
            />
          </label>
        </div>
      </div>

      {error ? (
        <p className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </p>
      ) : null}

      <div className="overflow-hidden rounded-[1.75rem] border border-stone-800 bg-stone-900/60">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-stone-800">
            <thead className="bg-stone-950/70 text-left text-xs uppercase tracking-[0.2em] text-stone-500">
              <tr>
                <th className="px-5 py-4">Client</th>
                <th className="px-5 py-4">Service</th>
                <th className="px-5 py-4">Session</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800 text-sm text-stone-200">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td className="px-5 py-8 text-stone-400" colSpan={5}>
                    No bookings match the current filters.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((booking) => (
                  <tr key={booking.id} className="align-top">
                    <td className="px-5 py-5">
                      <div className="space-y-1">
                        <p className="font-medium text-stone-50">{booking.clientName}</p>
                        <p className="text-stone-400">{booking.clientEmail}</p>
                        {booking.clientPhone ? (
                          <p className="text-stone-500">{booking.clientPhone}</p>
                        ) : null}
                        {booking.notes ? (
                          <p className="pt-2 text-stone-400">{booking.notes}</p>
                        ) : null}
                      </div>
                    </td>
                    <td className="px-5 py-5 text-stone-300">{booking.service.name}</td>
                    <td className="px-5 py-5">
                      <div className="space-y-1">
                        <p>{formatDate(booking.date)}</p>
                        <p className="text-stone-400">
                          {booking.startTime} - {booking.endTime}
                        </p>
                      </div>
                    </td>
                    <td className="px-5 py-5">
                      <span className="inline-flex rounded-full border border-stone-700 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-stone-200">
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-5 py-5">
                      <div className="flex flex-wrap gap-2">
                        <button
                          className="rounded-full border border-emerald-500/40 px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-200 transition hover:bg-emerald-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                          disabled={isPending || booking.status === BookingStatus.CONFIRMED}
                          onClick={() =>
                            updateBookingStatus(booking.id, BookingStatus.CONFIRMED)
                          }
                          type="button"
                        >
                          Confirm
                        </button>
                        <button
                          className="rounded-full border border-red-500/40 px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-red-200 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                          disabled={isPending || booking.status === BookingStatus.CANCELLED}
                          onClick={() =>
                            updateBookingStatus(booking.id, BookingStatus.CANCELLED)
                          }
                          type="button"
                        >
                          Cancel
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
