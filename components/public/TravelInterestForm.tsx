"use client";

import { useEffect, useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import {
  travelAvailabilityStatusMeta,
  type TravelAvailabilityEntry,
} from "@/lib/travel-availability";

interface TravelInterestFormProps {
  availabilityEntries: TravelAvailabilityEntry[];
}

interface SubmittedTravelInterest {
  id: string;
  city: string;
  clientName: string;
  preferredTiming: string | null;
  travelAvailabilityId: string | null;
}

export function TravelInterestForm({
  availabilityEntries,
}: TravelInterestFormProps) {
  const searchParams = useSearchParams();
  const cityParam = searchParams.get("city");
  const travelAvailabilityIdParam = searchParams.get("travelAvailabilityId");
  const [city, setCity] = useState(cityParam ?? "");
  const [travelAvailabilityId, setTravelAvailabilityId] = useState(
    travelAvailabilityIdParam ?? "",
  );
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState<SubmittedTravelInterest | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const nextEntry = travelAvailabilityIdParam
      ? availabilityEntries.find((entry) => entry.id === travelAvailabilityIdParam)
      : undefined;

    setTravelAvailabilityId(nextEntry?.id ?? "");
    setCity(cityParam ?? nextEntry?.city ?? "");
  }, [availabilityEntries, cityParam, travelAvailabilityIdParam]);

  const selectedEntry = availabilityEntries.find(
    (entry) => entry.id === travelAvailabilityId,
  );

  function submitTravelInterest(formData: FormData) {
    startTransition(async () => {
      setError("");

      const response = await fetch("/api/travel-interest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          travelAvailabilityId: travelAvailabilityId || undefined,
          city,
          clientName: formData.get("clientName"),
          clientEmail: formData.get("clientEmail"),
          clientPhone: formData.get("clientPhone") || undefined,
          preferredTiming: formData.get("preferredTiming") || undefined,
          notes: formData.get("notes") || undefined,
        }),
      });

      const payload = (await response.json()) as
        | { travelInterest: SubmittedTravelInterest }
        | { error: string };

      if (!response.ok || !("travelInterest" in payload)) {
        setError(
          "error" in payload
            ? payload.error
            : "We could not save your travel interest right now.",
        );
        return;
      }

      setSubmitted(payload.travelInterest);
    });
  }

  if (submitted) {
    const submittedEntry = submitted.travelAvailabilityId
      ? availabilityEntries.find(
          (entry) => entry.id === submitted.travelAvailabilityId,
        )
      : undefined;

    return (
      <article className="rounded-[2.25rem] border border-emerald-200 bg-emerald-50 p-6 shadow-[0_18px_48px_rgba(29,94,62,0.08)]">
        <p className="text-xs uppercase tracking-[0.26em] text-emerald-700">
          Interest received
        </p>
        <h3 className="mt-3 text-3xl font-semibold tracking-tight text-emerald-950">
          Your travel request is in.
        </h3>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-emerald-900">
          We&apos;ve saved your interest for {submitted.city}
          {submittedEntry ? ` (${submittedEntry.windowLabel})` : ""}. This gives us a
          clean starting point for future travel planning and follow-up.
        </p>
        <div className="mt-6 rounded-[1.6rem] border border-emerald-200 bg-white/80 p-5 text-sm text-emerald-950">
          <p className="font-semibold">Reference</p>
          <p className="mt-1">{submitted.id}</p>
          <p className="mt-4 font-semibold">Preferred timing</p>
          <p className="mt-1">
            {submitted.preferredTiming || "No timing preference shared yet."}
          </p>
        </div>
      </article>
    );
  }

  return (
    <section className="rounded-[2.5rem] border border-[var(--public-card-border)] bg-[var(--public-card-surface)] p-6 shadow-[0_18px_52px_var(--public-shadow-color)] sm:p-8">
      <div className="space-y-4">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--public-muted-text)]">
            City interest
          </p>
          <h3 className="text-3xl font-semibold tracking-tight text-[var(--public-primary-text)]">
            Tell us where you want the travel calendar to open next.
          </h3>
          <p className="max-w-2xl text-sm leading-7 text-[var(--public-muted-text)]">
            Use this form when your city is not yet confirmed, or when you want to be
            counted against a planned or open-interest stop. We&apos;ll keep it tied to
            real demand, not a generic waitlist.
          </p>
        </div>

        {selectedEntry ? (
          <div className="rounded-[1.6rem] border border-[var(--public-card-border)] bg-[var(--public-shell-background)] px-5 py-5">
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--public-muted-text)]">
              Selected availability reference
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-[var(--public-card-border)] px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--public-primary-text)]">
                {selectedEntry.destination}
              </span>
              <span className="rounded-full border border-[var(--public-card-border)] px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--public-muted-text)]">
                {travelAvailabilityStatusMeta[selectedEntry.status].label}
              </span>
            </div>
            <p className="mt-3 text-sm leading-7 text-[var(--public-muted-text)]">
              {selectedEntry.windowLabel}. {selectedEntry.supportingCopy}
            </p>
          </div>
        ) : null}
      </div>

      <form action={submitTravelInterest} className="mt-8 grid gap-4">
        <label className="space-y-2 text-sm text-[var(--public-primary-text)]">
          <span>Name</span>
          <input
            className="w-full rounded-[1.4rem] border border-[var(--public-card-border)] bg-[var(--public-shell-background)] px-4 py-3 text-sm text-[var(--public-primary-text)] outline-none transition focus:border-[var(--public-primary-cta-background)]"
            name="clientName"
            required
          />
        </label>

        <label className="space-y-2 text-sm text-[var(--public-primary-text)]">
          <span>Email</span>
          <input
            className="w-full rounded-[1.4rem] border border-[var(--public-card-border)] bg-[var(--public-shell-background)] px-4 py-3 text-sm text-[var(--public-primary-text)] outline-none transition focus:border-[var(--public-primary-cta-background)]"
            name="clientEmail"
            required
            type="email"
          />
        </label>

        <label className="space-y-2 text-sm text-[var(--public-primary-text)]">
          <span>Phone (optional)</span>
          <input
            className="w-full rounded-[1.4rem] border border-[var(--public-card-border)] bg-[var(--public-shell-background)] px-4 py-3 text-sm text-[var(--public-primary-text)] outline-none transition focus:border-[var(--public-primary-cta-background)]"
            name="clientPhone"
          />
        </label>

        <label className="space-y-2 text-sm text-[var(--public-primary-text)]">
          <span>City</span>
          <input
            className="w-full rounded-[1.4rem] border border-[var(--public-card-border)] bg-[var(--public-shell-background)] px-4 py-3 text-sm text-[var(--public-primary-text)] outline-none transition focus:border-[var(--public-primary-cta-background)]"
            name="city"
            onChange={(event) => {
              const nextCity = event.target.value;

              setCity(nextCity);

              if (selectedEntry && nextCity.trim() !== selectedEntry.city) {
                setTravelAvailabilityId("");
              }
            }}
            required
            value={city}
          />
        </label>

        <label className="space-y-2 text-sm text-[var(--public-primary-text)]">
          <span>Preferred timing (optional)</span>
          <input
            className="w-full rounded-[1.4rem] border border-[var(--public-card-border)] bg-[var(--public-shell-background)] px-4 py-3 text-sm text-[var(--public-primary-text)] outline-none transition focus:border-[var(--public-primary-cta-background)]"
            name="preferredTiming"
            placeholder="Example: early September or any weekday in June"
          />
        </label>

        <label className="space-y-2 text-sm text-[var(--public-primary-text)]">
          <span>Notes (optional)</span>
          <textarea
            className="min-h-32 w-full rounded-[1.4rem] border border-[var(--public-card-border)] bg-[var(--public-shell-background)] px-4 py-3 text-sm text-[var(--public-primary-text)] outline-none transition focus:border-[var(--public-primary-cta-background)]"
            name="notes"
          />
        </label>

        {error ? (
          <p className="rounded-[1.4rem] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        <button
          className="inline-flex w-fit rounded-full bg-[var(--public-primary-cta-background)] px-5 py-3 text-sm font-semibold text-[var(--public-primary-cta-text)] transition hover:bg-[var(--public-primary-cta-hover)] disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isPending}
          type="submit"
        >
          {isPending ? "Submitting..." : "Register travel interest"}
        </button>
      </form>
    </section>
  );
}
