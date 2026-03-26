"use client";

import { useState, useTransition } from "react";
import {
  getEditableSiteContent,
  type SiteContent,
  type SiteContentEditableInput,
} from "@/lib/site-content";

interface SiteContentEditorProps {
  initialContent: SiteContent;
}

interface FieldConfig {
  path: string;
  label: string;
  rows?: number;
}

interface SectionConfig {
  eyebrow: string;
  title: string;
  description: string;
  fields: FieldConfig[];
}

const sections: SectionConfig[] = [
  {
    eyebrow: "Header and footer",
    title: "Shared public chrome",
    description: "Controls the marketing copy shown in the public header CTA and footer.",
    fields: [
      { path: "header.brandName", label: "Brand name" },
      { path: "header.eyebrow", label: "Header eyebrow" },
      { path: "header.bookingCtaLabel", label: "Header booking CTA label" },
      { path: "footer.eyebrow", label: "Footer eyebrow" },
      { path: "footer.heading", label: "Footer heading", rows: 2 },
      { path: "footer.description", label: "Footer description", rows: 3 },
      { path: "footer.bookingPrompt", label: "Footer booking prompt", rows: 3 },
    ],
  },
  {
    eyebrow: "Homepage",
    title: "Hero and featured sections",
    description: "Sets the home page metadata, hero copy, stats, and section labels.",
    fields: [
      { path: "home.metadataTitle", label: "Metadata title" },
      { path: "home.metadataDescription", label: "Metadata description", rows: 3 },
      { path: "home.eyebrow", label: "Hero eyebrow" },
      { path: "home.title", label: "Hero title", rows: 2 },
      { path: "home.description", label: "Hero description", rows: 4 },
      { path: "home.primaryCtaLabel", label: "Primary CTA label" },
      { path: "home.secondaryCtaLabel", label: "Secondary CTA label" },
      { path: "home.spotlightEyebrow", label: "Spotlight eyebrow" },
      { path: "home.spotlightTitle", label: "Spotlight title", rows: 2 },
      { path: "home.spotlightDescription", label: "Spotlight description", rows: 4 },
      { path: "home.primaryStatValue", label: "Primary stat value" },
      { path: "home.primaryStatLabel", label: "Primary stat label", rows: 2 },
      { path: "home.secondaryStatValue", label: "Secondary stat value" },
      { path: "home.secondaryStatLabel", label: "Secondary stat label", rows: 2 },
      { path: "home.galleryEyebrow", label: "Gallery eyebrow" },
      { path: "home.galleryTitle", label: "Gallery title", rows: 2 },
      { path: "home.servicesEyebrow", label: "Services eyebrow" },
      { path: "home.servicesTitle", label: "Services title", rows: 2 },
      { path: "home.servicesDescription", label: "Services description", rows: 4 },
    ],
  },
  {
    eyebrow: "Portfolio page",
    title: "Portfolio copy",
    description: "Controls the portfolio page metadata and the copy that frames the gallery.",
    fields: [
      { path: "portfolio.metadataTitle", label: "Metadata title" },
      { path: "portfolio.metadataDescription", label: "Metadata description", rows: 3 },
      { path: "portfolio.eyebrow", label: "Page eyebrow" },
      { path: "portfolio.title", label: "Page title", rows: 2 },
      { path: "portfolio.description", label: "Page description", rows: 4 },
      { path: "portfolio.galleryEyebrow", label: "Gallery eyebrow" },
      { path: "portfolio.galleryTitle", label: "Gallery title", rows: 2 },
      { path: "portfolio.galleryDescription", label: "Gallery description", rows: 4 },
    ],
  },
  {
    eyebrow: "Services page",
    title: "Services framing copy",
    description: "Shapes the editorial copy around the existing live services list and booking links.",
    fields: [
      { path: "services.metadataTitle", label: "Metadata title" },
      { path: "services.metadataDescription", label: "Metadata description", rows: 3 },
      { path: "services.eyebrow", label: "Page eyebrow" },
      { path: "services.title", label: "Page title", rows: 2 },
      { path: "services.description", label: "Page description", rows: 4 },
      { path: "services.highlightEyebrow", label: "Highlight eyebrow" },
      { path: "services.highlightTitle", label: "Highlight title", rows: 2 },
      { path: "services.highlightDescription", label: "Highlight description", rows: 4 },
      { path: "services.bookingCtaLabel", label: "Service card CTA label" },
    ],
  },
  {
    eyebrow: "About page",
    title: "About story and process",
    description: "Updates the studio narrative and the three-step expectations section.",
    fields: [
      { path: "about.metadataTitle", label: "Metadata title" },
      { path: "about.metadataDescription", label: "Metadata description", rows: 3 },
      { path: "about.eyebrow", label: "Page eyebrow" },
      { path: "about.title", label: "Page title", rows: 2 },
      { path: "about.introduction", label: "Introduction", rows: 4 },
      { path: "about.story", label: "Story", rows: 4 },
      { path: "about.processEyebrow", label: "Process eyebrow" },
      { path: "about.processTitle", label: "Process title", rows: 2 },
      { path: "about.processStepOneTitle", label: "Step 1 title" },
      { path: "about.processStepOneDescription", label: "Step 1 description", rows: 3 },
      { path: "about.processStepTwoTitle", label: "Step 2 title" },
      { path: "about.processStepTwoDescription", label: "Step 2 description", rows: 3 },
      { path: "about.processStepThreeTitle", label: "Step 3 title" },
      { path: "about.processStepThreeDescription", label: "Step 3 description", rows: 3 },
    ],
  },
];

function setFieldValue(
  current: SiteContentEditableInput,
  path: string,
  value: string,
): SiteContentEditableInput {
  const next = structuredClone(current);
  const keys = path.split(".");
  let cursor: Record<string, unknown> = next as Record<string, unknown>;

  for (const key of keys.slice(0, -1)) {
    cursor[key] = {
      ...(cursor[key] as Record<string, unknown>),
    };
    cursor = cursor[key] as Record<string, unknown>;
  }

  cursor[keys[keys.length - 1]] = value;

  return next;
}

function getFieldValue(
  content: SiteContentEditableInput,
  path: string,
): string {
  return path
    .split(".")
    .reduce<unknown>((value, key) => {
      if (value && typeof value === "object" && key in value) {
        return (value as Record<string, unknown>)[key];
      }

      return "";
    }, content) as string;
}

export function SiteContentEditor({ initialContent }: SiteContentEditorProps) {
  const [form, setForm] = useState(() => getEditableSiteContent(initialContent));
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function saveContent() {
    startTransition(async () => {
      setMessage("");
      setError("");

      const response = await fetch("/api/site-content", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const payload = (await response.json()) as
        | { content: SiteContent }
        | { error: string };

      if (!response.ok || !("content" in payload)) {
        setError("error" in payload ? payload.error : "Failed to save content.");
        return;
      }

      setForm(getEditableSiteContent(payload.content));
      setMessage("Public site content saved.");
    });
  }

  return (
    <section className="space-y-6">
      <div className="rounded-[1.75rem] border border-stone-800 bg-stone-900/70 p-6">
        <p className="text-xs uppercase tracking-[0.28em] text-amber-200/60">Content</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-stone-50">
          Manage the public marketing copy from one place.
        </h2>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-stone-300">
          These fields power the shared header and footer plus the Home, Portfolio,
          Services, and About pages. Service cards and booking routes stay connected
          to the live booking system.
        </p>
      </div>

      {sections.map((section) => (
        <article
          key={section.title}
          className="rounded-[1.75rem] border border-stone-800 bg-stone-900/60 p-6"
        >
          <p className="text-xs uppercase tracking-[0.24em] text-stone-500">
            {section.eyebrow}
          </p>
          <h3 className="mt-2 text-2xl font-semibold text-stone-50">{section.title}</h3>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-stone-300">
            {section.description}
          </p>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {section.fields.map((field) => (
              <label
                key={field.path}
                className={`space-y-2 text-sm text-stone-300 ${
                  field.rows ? "lg:col-span-2" : ""
                }`}
              >
                <span>{field.label}</span>
                {field.rows ? (
                  <textarea
                    className="min-h-28 w-full rounded-2xl border border-stone-700 bg-stone-950 px-4 py-3 text-sm text-stone-100"
                    onChange={(event) =>
                      setForm((current) =>
                        setFieldValue(current, field.path, event.target.value),
                      )
                    }
                    rows={field.rows}
                    value={getFieldValue(form, field.path)}
                  />
                ) : (
                  <input
                    className="w-full rounded-2xl border border-stone-700 bg-stone-950 px-4 py-3 text-sm text-stone-100"
                    onChange={(event) =>
                      setForm((current) =>
                        setFieldValue(current, field.path, event.target.value),
                      )
                    }
                    value={getFieldValue(form, field.path)}
                  />
                )}
              </label>
            ))}
          </div>
        </article>
      ))}

      <div className="flex flex-wrap items-center gap-3">
        <button
          className="rounded-full bg-stone-50 px-5 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isPending}
          onClick={saveContent}
          type="button"
        >
          {isPending ? "Saving..." : "Save content"}
        </button>
        {message ? <p className="text-sm text-emerald-200">{message}</p> : null}
        {error ? <p className="text-sm text-red-200">{error}</p> : null}
      </div>
    </section>
  );
}
