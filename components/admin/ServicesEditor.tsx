"use client";

import type { Service } from "@prisma/client";
import { useState, useTransition } from "react";

interface ServicesEditorProps {
  initialServices: Service[];
}

export function ServicesEditor({ initialServices }: ServicesEditorProps) {
  const [services, setServices] = useState(initialServices);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [duration, setDuration] = useState("60");
  const [price, setPrice] = useState("0");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function resetForm() {
    setEditingId(null);
    setName("");
    setDuration("60");
    setPrice("0");
    setDescription("");
  }

  function populateForm(service: Service) {
    setEditingId(service.id);
    setName(service.name);
    setDuration(String(service.duration));
    setPrice(String(service.price));
    setDescription(service.description);
  }

  function saveService() {
    startTransition(async () => {
      setError("");

      const endpoint = editingId ? `/api/services/${editingId}` : "/api/services";
      const method = editingId ? "PATCH" : "POST";
      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          duration: Number(duration),
          price: Number(price),
          description,
        }),
      });

      const payload = (await response.json()) as
        | { service: Service }
        | { error: string };

      if (!response.ok || !("service" in payload)) {
        setError("error" in payload ? payload.error : "Failed to save service.");
        return;
      }

      setServices((current) => {
        if (editingId) {
          return current.map((service) =>
            service.id === payload.service.id ? payload.service : service,
          );
        }

        return [payload.service, ...current];
      });
      resetForm();
    });
  }

  function toggleActive(service: Service) {
    startTransition(async () => {
      setError("");

      const response = await fetch(`/api/services/${service.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          active: !service.active,
        }),
      });

      const payload = (await response.json()) as
        | { service: Service }
        | { error: string };

      if (!response.ok || !("service" in payload)) {
        setError("error" in payload ? payload.error : "Failed to update service.");
        return;
      }

      setServices((current) =>
        current.map((item) => (item.id === payload.service.id ? payload.service : item)),
      );
    });
  }

  return (
    <section className="space-y-6">
      <div className="rounded-[1.75rem] border border-stone-800 bg-stone-900/70 p-6">
        <p className="text-xs uppercase tracking-[0.28em] text-amber-200/60">Services</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-stone-50">
          Create and manage the services clients can book.
        </h2>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <label className="space-y-2 text-sm text-stone-300">
            <span>Name</span>
            <input
              className="w-full rounded-2xl border border-stone-700 bg-stone-950 px-4 py-3 text-sm text-stone-100"
              onChange={(event) => setName(event.target.value)}
              value={name}
            />
          </label>

          <label className="space-y-2 text-sm text-stone-300">
            <span>Duration (minutes)</span>
            <input
              className="w-full rounded-2xl border border-stone-700 bg-stone-950 px-4 py-3 text-sm text-stone-100"
              min="1"
              onChange={(event) => setDuration(event.target.value)}
              type="number"
              value={duration}
            />
          </label>

          <label className="space-y-2 text-sm text-stone-300">
            <span>Price (minor unit)</span>
            <input
              className="w-full rounded-2xl border border-stone-700 bg-stone-950 px-4 py-3 text-sm text-stone-100"
              min="0"
              onChange={(event) => setPrice(event.target.value)}
              type="number"
              value={price}
            />
          </label>

          <label className="space-y-2 text-sm text-stone-300 lg:col-span-2">
            <span>Description</span>
            <textarea
              className="min-h-32 w-full rounded-2xl border border-stone-700 bg-stone-950 px-4 py-3 text-sm text-stone-100"
              onChange={(event) => setDescription(event.target.value)}
              value={description}
            />
          </label>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button
            className="rounded-full bg-stone-50 px-5 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isPending || !name || !description}
            onClick={saveService}
            type="button"
          >
            {isPending ? "Saving..." : editingId ? "Update service" : "Create service"}
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

      <div className="grid gap-4">
        {services.map((service) => (
          <article
            key={service.id}
            className="rounded-[1.5rem] border border-stone-800 bg-stone-900/60 p-5"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.22em] text-stone-500">
                  {service.duration} min · {service.price} minor units
                </p>
                <h3 className="text-2xl font-semibold text-stone-50">{service.name}</h3>
                <p className="max-w-3xl text-sm leading-7 text-stone-300">
                  {service.description}
                </p>
              </div>

              <button
                className="rounded-full border border-stone-700 px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-stone-200 transition hover:bg-stone-800"
                onClick={() => populateForm(service)}
                type="button"
              >
                Edit
              </button>
              <button
                className="rounded-full border border-stone-700 px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-stone-200 transition hover:bg-stone-800"
                onClick={() => toggleActive(service)}
                type="button"
              >
                {service.active ? "Deactivate" : "Reactivate"}
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
