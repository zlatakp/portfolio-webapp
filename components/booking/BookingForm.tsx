"use client";

import { useEffect, useState, useTransition } from "react";
import type { BookingHandoff, CreatedBooking, PublicService } from "./booking-types";

interface BookingFormProps {
  service: PublicService;
}

const handoffStorageKey = "booking-handoff";

export function BookingForm({ service }: BookingFormProps) {
  const [handoff, setHandoff] = useState<BookingHandoff | null>(null);
  const [booking, setBooking] = useState<CreatedBooking | null>(null);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const raw = sessionStorage.getItem(handoffStorageKey);

    if (!raw) {
      setError("Please choose a service date and time before completing the booking.");
      return;
    }

    try {
      const parsed = JSON.parse(raw) as BookingHandoff;

      if (parsed.serviceId !== service.id) {
        setError("The selected booking slot does not match this service.");
        return;
      }

      setHandoff(parsed);
    } catch {
      setError("We could not read the selected booking slot. Please try again.");
    }
  }, [service.id]);

  function submitBooking(formData: FormData) {
    if (!handoff) {
      setError("Please restart the booking flow and choose a valid slot.");
      return;
    }

    startTransition(async () => {
      setError("");

      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          serviceId: handoff.serviceId,
          date: handoff.date,
          startTime: handoff.startTime,
          clientName: formData.get("clientName"),
          clientEmail: formData.get("clientEmail"),
          clientPhone: formData.get("clientPhone") || undefined,
          visualReferences: formData.get("visualReferences") || undefined,
          notes: formData.get("notes") || undefined,
        }),
      });

      const payload = (await response.json()) as
        | { booking: CreatedBooking }
        | { error: string };

      if (!response.ok || !("booking" in payload)) {
        setError("error" in payload ? payload.error : "Failed to submit booking.");
        return;
      }

      sessionStorage.removeItem(handoffStorageKey);
      setBooking({
        ...payload.booking,
        date: new Date(payload.booking.date).toISOString(),
      });
    });
  }

  if (booking) {
    return <BookingConfirmationCard booking={booking} />;
  }

  return (
    <section className="space-y-6 rounded-[2rem] border border-stone-200 bg-white p-6 shadow-[0_24px_80px_rgba(94,72,48,0.08)]">
      <div>
        <p className="text-xs uppercase tracking-[0.28em] text-stone-500">Step 3</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-stone-950">
          Tell us about your booking.
        </h2>
        <p className="mt-3 text-sm leading-7 text-stone-600">
          You&apos;re booking {service.name}
          {handoff ? ` on ${handoff.date} at ${handoff.startTime}` : ""}. Use this step
          to share the details, notes, and visual references that will help shape the
          session well before the shoot.
        </p>
      </div>

      <form action={submitBooking} className="grid gap-4">
        <label className="space-y-2 text-sm text-stone-700">
          <span>Name</span>
          <input
            className="w-full rounded-2xl border border-stone-300 bg-stone-50 px-4 py-3 text-sm text-stone-950 outline-none transition focus:border-stone-900"
            name="clientName"
            required
          />
        </label>

        <label className="space-y-2 text-sm text-stone-700">
          <span>Email</span>
          <input
            className="w-full rounded-2xl border border-stone-300 bg-stone-50 px-4 py-3 text-sm text-stone-950 outline-none transition focus:border-stone-900"
            name="clientEmail"
            required
            type="email"
          />
        </label>

        <label className="space-y-2 text-sm text-stone-700">
          <span>Phone (optional)</span>
          <input
            className="w-full rounded-2xl border border-stone-300 bg-stone-50 px-4 py-3 text-sm text-stone-950 outline-none transition focus:border-stone-900"
            name="clientPhone"
          />
        </label>

        <label className="space-y-2 text-sm text-stone-700">
          <span>Visual references (optional)</span>
          <p className="text-xs leading-6 text-stone-500">
            Paste portfolio or website image links, or describe the image names or
            pages you&apos;d like us to reference.
          </p>
          <textarea
            className="min-h-32 w-full rounded-2xl border border-stone-300 bg-stone-50 px-4 py-3 text-sm text-stone-950 outline-none transition focus:border-stone-900"
            name="visualReferences"
          />
        </label>

        <label className="space-y-2 text-sm text-stone-700">
          <span>Notes (optional)</span>
          <textarea
            className="min-h-32 w-full rounded-2xl border border-stone-300 bg-stone-50 px-4 py-3 text-sm text-stone-950 outline-none transition focus:border-stone-900"
            name="notes"
          />
        </label>

        {error ? (
          <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        <button
          className="rounded-full bg-stone-950 px-5 py-3 text-sm font-semibold text-stone-50 transition hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isPending || !handoff}
          type="submit"
        >
          {isPending ? "Submitting..." : "Submit booking"}
        </button>
      </form>
    </section>
  );
}

function BookingConfirmationCard({ booking }: { booking: CreatedBooking }) {
  return (
    <article className="rounded-[2rem] border border-emerald-200 bg-emerald-50 p-6 shadow-[0_24px_80px_rgba(27,94,55,0.08)]">
      <p className="text-xs uppercase tracking-[0.28em] text-emerald-700">Booking received</p>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight text-emerald-950">
        Your booking request has been submitted.
      </h2>
      <p className="mt-4 text-sm leading-7 text-emerald-900">
        We&apos;ve saved your request for {booking.service.name} on{" "}
        {new Date(booking.date).toLocaleDateString("en-GB", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        })}{" "}
        at {booking.startTime}. A confirmation email should arrive shortly.
      </p>
      <div className="mt-6 rounded-[1.5rem] border border-emerald-200 bg-white/80 p-5 text-sm text-emerald-900">
        <p className="font-semibold">Reference</p>
        <p className="mt-1">{booking.id}</p>
        <p className="mt-4 font-semibold">Status</p>
        <p className="mt-1">{booking.status}</p>
      </div>
    </article>
  );
}
