"use client";

import { useState, useTransition } from "react";

type AvailabilityRule = {
  id: string;
  dayOfWeek: number | null;
  date: string | Date | null;
  startTime: string;
  endTime: string;
  isBlocked: boolean;
};

interface AvailabilityEditorProps {
  initialRules: AvailabilityRule[];
}

const weekdayLabels = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function serializeRule(rule: AvailabilityRule) {
  return {
    ...rule,
    date: rule.date ? new Date(rule.date).toISOString().slice(0, 10) : null,
  };
}

export function AvailabilityEditor({ initialRules }: AvailabilityEditorProps) {
  const [rules, setRules] = useState(initialRules.map(serializeRule));
  const [editingId, setEditingId] = useState<string | null>(null);
  const [mode, setMode] = useState<"weekly" | "date">("weekly");
  const [dayOfWeek, setDayOfWeek] = useState("1");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [isBlocked, setIsBlocked] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function resetForm() {
    setEditingId(null);
    setMode("weekly");
    setDayOfWeek("1");
    setDate("");
    setStartTime("09:00");
    setEndTime("17:00");
    setIsBlocked(false);
  }

  function populateForm(rule: (typeof rules)[number]) {
    setEditingId(rule.id);
    setMode(rule.date ? "date" : "weekly");
    setDayOfWeek(String(rule.dayOfWeek ?? 1));
    setDate(rule.date ?? "");
    setStartTime(rule.startTime);
    setEndTime(rule.endTime);
    setIsBlocked(rule.isBlocked);
  }

  function saveRule() {
    startTransition(async () => {
      setError("");

      const endpoint = editingId ? `/api/availability/${editingId}` : "/api/availability";
      const method = editingId ? "PATCH" : "POST";
      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dayOfWeek: mode === "weekly" ? Number(dayOfWeek) : null,
          date: mode === "date" ? date || null : null,
          startTime,
          endTime,
          isBlocked,
        }),
      });

      const payload = (await response.json()) as
        | { availability: AvailabilityRule }
        | { error: string };

      if (!response.ok || !("availability" in payload)) {
        setError("error" in payload ? payload.error : "Failed to save availability rule.");
        return;
      }

      setRules((current) => {
        const nextRule = serializeRule(payload.availability);

        if (editingId) {
          return current.map((rule) => (rule.id === nextRule.id ? nextRule : rule));
        }

        return [nextRule, ...current];
      });
      resetForm();
    });
  }

  function deleteRule(id: string) {
    startTransition(async () => {
      setError("");

      const response = await fetch(`/api/availability/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const payload = (await response.json()) as { error?: string };
        setError(payload.error ?? "Failed to delete availability rule.");
        return;
      }

      setRules((current) => current.filter((rule) => rule.id !== id));
    });
  }

  return (
    <section className="space-y-6">
      <div className="rounded-[1.75rem] border border-stone-800 bg-stone-900/70 p-6">
        <p className="text-xs uppercase tracking-[0.28em] text-amber-200/60">Availability</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-stone-50">
          Set your weekly hours and date-specific overrides.
        </h2>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <label className="space-y-2 text-sm text-stone-300">
            <span>Rule type</span>
            <select
              className="w-full rounded-2xl border border-stone-700 bg-stone-950 px-4 py-3 text-sm text-stone-100"
              onChange={(event) => setMode(event.target.value as "weekly" | "date")}
              value={mode}
            >
              <option value="weekly">Weekly schedule</option>
              <option value="date">Date override</option>
            </select>
          </label>

          {mode === "weekly" ? (
            <label className="space-y-2 text-sm text-stone-300">
              <span>Day of week</span>
              <select
                className="w-full rounded-2xl border border-stone-700 bg-stone-950 px-4 py-3 text-sm text-stone-100"
                onChange={(event) => setDayOfWeek(event.target.value)}
                value={dayOfWeek}
              >
                {weekdayLabels.map((label, index) => (
                  <option key={label} value={index}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
          ) : (
            <label className="space-y-2 text-sm text-stone-300">
              <span>Date</span>
              <input
                className="w-full rounded-2xl border border-stone-700 bg-stone-950 px-4 py-3 text-sm text-stone-100"
                onChange={(event) => setDate(event.target.value)}
                type="date"
                value={date}
              />
            </label>
          )}

          <label className="space-y-2 text-sm text-stone-300">
            <span>Start time</span>
            <input
              className="w-full rounded-2xl border border-stone-700 bg-stone-950 px-4 py-3 text-sm text-stone-100"
              onChange={(event) => setStartTime(event.target.value)}
              type="time"
              value={startTime}
            />
          </label>

          <label className="space-y-2 text-sm text-stone-300">
            <span>End time</span>
            <input
              className="w-full rounded-2xl border border-stone-700 bg-stone-950 px-4 py-3 text-sm text-stone-100"
              onChange={(event) => setEndTime(event.target.value)}
              type="time"
              value={endTime}
            />
          </label>
        </div>

        <label className="mt-4 flex items-center gap-3 text-sm text-stone-300">
          <input
            checked={isBlocked}
            className="h-4 w-4 rounded border-stone-600 bg-stone-950"
            onChange={(event) => setIsBlocked(event.target.checked)}
            type="checkbox"
          />
          Block the selected day instead of offering slots
        </label>

        <div className="mt-6 flex items-center gap-3">
          <button
            className="rounded-full bg-stone-50 px-5 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isPending || (mode === "date" && !date)}
            onClick={saveRule}
            type="button"
          >
            {isPending ? "Saving..." : editingId ? "Update rule" : "Add rule"}
          </button>
          {editingId ? (
            <button
              className="rounded-full border border-stone-700 px-5 py-3 text-sm font-semibold text-stone-200 transition hover:bg-stone-800"
              onClick={resetForm}
              type="button"
            >
              Cancel edit
            </button>
          ) : null}
          {error ? <p className="text-sm text-red-200">{error}</p> : null}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {rules.length === 0 ? (
          <p className="rounded-[1.5rem] border border-dashed border-stone-700 px-5 py-6 text-sm text-stone-400">
            No availability rules yet.
          </p>
        ) : (
          rules.map((rule) => (
            <article
              key={rule.id}
              className="rounded-[1.5rem] border border-stone-800 bg-stone-900/60 p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.22em] text-stone-500">
                    {rule.date
                      ? `Override: ${rule.date}`
                      : `Weekly: ${weekdayLabels[rule.dayOfWeek ?? 0]}`}
                  </p>
                  <h3 className="text-xl font-semibold text-stone-50">
                    {rule.isBlocked ? "Blocked day" : `${rule.startTime} - ${rule.endTime}`}
                  </h3>
                </div>

                <button
                  className="rounded-full border border-stone-700 px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-stone-200 transition hover:bg-stone-800"
                  onClick={() => populateForm(rule)}
                  type="button"
                >
                  Edit
                </button>
                <button
                  className="rounded-full border border-red-500/40 px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-red-200 transition hover:bg-red-500/10"
                  onClick={() => deleteRule(rule.id)}
                  type="button"
                >
                  Delete
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
