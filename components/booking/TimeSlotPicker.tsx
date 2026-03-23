"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import type { BookingHandoff, PublicService } from "./booking-types";

interface TimeSlotPickerProps {
  service: PublicService;
}

const handoffStorageKey = "booking-handoff";

export function TimeSlotPicker({ service }: TimeSlotPickerProps) {
  const router = useRouter();
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!date) {
      setSlots([]);
      setSelectedSlot("");
      return;
    }

    startTransition(async () => {
      setError("");
      setSelectedSlot("");

      const response = await fetch(
        `/api/availability?date=${encodeURIComponent(date)}&serviceId=${encodeURIComponent(service.id)}`,
      );
      const payload = (await response.json()) as { slots?: string[]; error?: string };

      if (!response.ok || !payload.slots) {
        setSlots([]);
        setError(payload.error ?? "Unable to load available time slots.");
        return;
      }

      setSlots(payload.slots);
    });
  }, [date, service.id]);

  function continueToConfirmation() {
    if (!date || !selectedSlot) {
      setError("Please pick a date and time before continuing.");
      return;
    }

    const handoff: BookingHandoff = {
      serviceId: service.id,
      date,
      startTime: selectedSlot,
    };

    sessionStorage.setItem(handoffStorageKey, JSON.stringify(handoff));
    router.push(`/book/confirm?serviceId=${service.id}`);
  }

  return (
    <section className="space-y-6 rounded-[2rem] border border-stone-200 bg-white p-6 shadow-[0_24px_80px_rgba(94,72,48,0.08)]">
      <div>
        <p className="text-xs uppercase tracking-[0.28em] text-stone-500">Step 2</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-stone-950">
          Choose a date and available time.
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-stone-600">
          Available slots are generated from the photographer&apos;s schedule and
          existing bookings for {service.name}.
        </p>
      </div>

      <label className="block space-y-2 text-sm text-stone-700">
        <span>Date</span>
        <input
          className="w-full rounded-2xl border border-stone-300 bg-stone-50 px-4 py-3 text-sm text-stone-950 outline-none transition focus:border-stone-900"
          min={new Date().toISOString().slice(0, 10)}
          onChange={(event) => setDate(event.target.value)}
          type="date"
          value={date}
        />
      </label>

      <div className="space-y-3">
        <p className="text-sm font-medium text-stone-700">Available times</p>
        {isPending ? (
          <p className="text-sm text-stone-500">Loading slots...</p>
        ) : slots.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-stone-300 px-4 py-5 text-sm text-stone-500">
            {date
              ? "No slots are currently available for that date."
              : "Pick a date to see available slots."}
          </p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-3">
            {slots.map((slot) => (
              <button
                key={slot}
                className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                  selectedSlot === slot
                    ? "border-stone-950 bg-stone-950 text-stone-50"
                    : "border-stone-300 bg-white text-stone-800 hover:border-stone-500"
                }`}
                onClick={() => setSelectedSlot(slot)}
                type="button"
              >
                {slot}
              </button>
            ))}
          </div>
        )}
      </div>

      {error ? (
        <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <button
        className="rounded-full bg-stone-950 px-5 py-3 text-sm font-semibold text-stone-50 transition hover:bg-stone-700"
        onClick={continueToConfirmation}
        type="button"
      >
        Continue to details
      </button>
    </section>
  );
}
