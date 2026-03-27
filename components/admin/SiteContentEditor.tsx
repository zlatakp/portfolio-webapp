"use client";

import { useState, useTransition } from "react";
import {
  getEditableSiteContent,
  type PublicThemePreset,
  type SiteContent,
  type SiteContentEditableInput,
} from "@/lib/site-content";

interface SiteContentEditorProps {
  initialContent: SiteContent;
  themePresets: PublicThemePreset[];
}

interface FieldConfig {
  path: string;
  label: string;
  rows?: number;
}

interface SectionConfig {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  affects: string;
  fields: FieldConfig[];
}

type SaveState = "idle" | "saving" | "saved" | "error";

const themeSection = {
  id: "theme",
  eyebrow: "Curated public presentation",
  title: "Theme",
  description:
    "Choose one of the curated public themes below. This changes the marketing palette across the public shell and content pages without affecting booking flows, services data, or admin styling.",
  affects: "Affects: shared header/footer and /, /portfolio, /services, /about",
};

const sections: SectionConfig[] = [
  {
    id: "shared-public-chrome",
    eyebrow: "Header and footer",
    title: "Shared public chrome",
    description: "Controls the marketing copy shown in the public header CTA and footer.",
    affects: "Affects: shared header/footer across /, /portfolio, /services, /about",
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
    id: "homepage",
    eyebrow: "Hero and featured sections",
    title: "Homepage",
    description: "Sets the home page metadata, hero copy, stats, and section labels.",
    affects: "Affects: /",
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
    id: "portfolio-page",
    eyebrow: "Portfolio copy",
    title: "Portfolio page",
    description: "Controls the portfolio page metadata and the copy that frames the gallery.",
    affects: "Affects: /portfolio",
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
    id: "services-page",
    eyebrow: "Services framing copy",
    title: "Services page",
    description: "Shapes the editorial copy around the existing live services list and booking links.",
    affects: "Affects: /services",
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
    id: "about-page",
    eyebrow: "About story and process",
    title: "About page",
    description: "Updates the studio narrative and the three-step expectations section.",
    affects: "Affects: /about",
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

const quickJumpSections = [
  { id: themeSection.id, title: "Theme", affects: themeSection.affects },
  ...sections.map((section) => ({
    id: section.id,
    title: section.title,
    affects: section.affects,
  })),
];

function areFormsEqual(
  left: SiteContentEditableInput,
  right: SiteContentEditableInput,
): boolean {
  return JSON.stringify(left) === JSON.stringify(right);
}

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

export function SiteContentEditor({
  initialContent,
  themePresets,
}: SiteContentEditorProps) {
  const initialForm = getEditableSiteContent(initialContent);
  const [form, setForm] = useState(initialForm);
  const [savedForm, setSavedForm] = useState(initialForm);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [saveMessage, setSaveMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const isDirty = !areFormsEqual(form, savedForm);

  function resetSaveState() {
    setSaveState("idle");
    setSaveMessage("");
  }

  function updateForm(next: SiteContentEditableInput) {
    setForm(next);
    resetSaveState();
  }

  function updateField(path: string, value: string) {
    setForm((current) => setFieldValue(current, path, value));
    resetSaveState();
  }

  const saveStateLabel = {
    idle: "Idle",
    saving: "Saving",
    saved: "Saved",
    error: "Error",
  }[saveState];

  const saveStateText =
    saveState === "saving"
      ? "Saving the latest content changes for the public site."
      : saveState === "saved"
        ? saveMessage || "Public site content saved."
        : saveState === "error"
          ? saveMessage || "We couldn't save the latest content changes."
          : isDirty
            ? "Unsaved changes are ready to publish to the public site."
            : "No unsaved changes. The editor matches the latest saved content.";

  const saveStateTone =
    saveState === "saved"
      ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-100"
      : saveState === "error"
        ? "border-red-400/30 bg-red-500/10 text-red-100"
        : saveState === "saving"
          ? "border-amber-300/30 bg-amber-500/10 text-amber-100"
          : isDirty
            ? "border-amber-300/30 bg-amber-500/10 text-amber-100"
            : "border-stone-700 bg-stone-950/70 text-stone-200";

  function saveContent() {
    startTransition(async () => {
      setSaveState("saving");
      setSaveMessage("");

      const response = await fetch("/api/site-content", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const payload = (await response.json()) as
        | { content: SiteContent; themePreset: PublicThemePreset }
        | { error: string };

      if (!response.ok || !("content" in payload)) {
        setSaveState("error");
        setSaveMessage("error" in payload ? payload.error : "Failed to save content.");
        return;
      }

      const nextSavedForm = getEditableSiteContent(payload.content);
      setForm(nextSavedForm);
      setSavedForm(nextSavedForm);
      setSaveState("saved");
      setSaveMessage("Public site content saved.");
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

      <div className="grid gap-6 xl:grid-cols-[20rem_minmax(0,1fr)] xl:items-start">
        <aside className="space-y-6 xl:sticky xl:top-24">
          <div className="rounded-[1.75rem] border border-stone-800 bg-stone-900/75 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.18)]">
            <p className="text-xs uppercase tracking-[0.28em] text-amber-200/60">
              Save controls
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-stone-50">
              Keep website updates moving.
            </h3>
            <p className="mt-3 text-sm leading-7 text-stone-300">
              This editor controls the shared header and footer plus the public Home,
              Portfolio, Services, and About pages. Save here anytime while moving
              through the sections below.
            </p>

            <div className={`mt-5 rounded-[1.5rem] border p-4 ${saveStateTone}`}>
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs uppercase tracking-[0.24em]">{saveStateLabel}</p>
                <p className="text-xs uppercase tracking-[0.18em]">
                  {isDirty ? "Unsaved changes" : "Up to date"}
                </p>
              </div>
              <p className="mt-3 text-sm leading-6">{saveStateText}</p>
            </div>

            <button
              className="mt-5 w-full rounded-full bg-stone-50 px-5 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isPending || !isDirty}
              onClick={saveContent}
              type="button"
            >
              {isPending ? "Saving..." : isDirty ? "Save content" : "All changes saved"}
            </button>
          </div>

          <nav className="rounded-[1.75rem] border border-stone-800 bg-stone-900/60 p-6">
            <p className="text-xs uppercase tracking-[0.24em] text-stone-500">
              Quick jump
            </p>
            <h3 className="mt-2 text-xl font-semibold text-stone-50">Page and section map</h3>
            <div className="mt-5 space-y-3">
              {quickJumpSections.map((section) => (
                <a
                  key={section.id}
                  className="block rounded-[1.25rem] border border-stone-800 bg-stone-950/70 px-4 py-3 transition hover:border-stone-600 hover:bg-stone-900"
                  href={`#${section.id}`}
                >
                  <p className="text-sm font-semibold text-stone-100">{section.title}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.16em] text-stone-500">
                    {section.affects}
                  </p>
                </a>
              ))}
            </div>
          </nav>
        </aside>

        <div className="space-y-6">
          <article
            className="scroll-mt-28 rounded-[1.75rem] border border-stone-800 bg-stone-900/60 p-6"
            id={themeSection.id}
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-stone-500">
                  {themeSection.eyebrow}
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-stone-50">
                  {themeSection.title}
                </h3>
              </div>
              <p className="rounded-full border border-stone-700 bg-stone-950/70 px-4 py-2 text-xs uppercase tracking-[0.16em] text-stone-300">
                {themeSection.affects}
              </p>
            </div>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-stone-300">
              {themeSection.description}
            </p>

            <div className="mt-6 grid gap-4 lg:grid-cols-3">
              {themePresets.map((preset) => {
                const isSelected = form.theme.themeId === preset.id;

                return (
                  <button
                    key={preset.id}
                    className={`rounded-[1.5rem] border p-5 text-left transition ${
                      isSelected
                        ? "border-amber-200 bg-stone-800/90 shadow-[0_0_0_1px_rgba(253,230,138,0.15)]"
                        : "border-stone-700 bg-stone-950/70 hover:border-stone-500 hover:bg-stone-900"
                    }`}
                    onClick={() =>
                      updateForm({
                        ...form,
                        theme: {
                          themeId: preset.id,
                        },
                      })
                    }
                    type="button"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-stone-50">{preset.label}</p>
                        <p className="mt-2 text-sm leading-6 text-stone-300">
                          {preset.description}
                        </p>
                      </div>
                      <span
                        className={`mt-1 inline-flex h-4 w-4 rounded-full border ${
                          isSelected
                            ? "border-amber-200 bg-amber-200"
                            : "border-stone-500 bg-transparent"
                        }`}
                      />
                    </div>
                    <div className="mt-5 flex gap-2">
                      {preset.previewSwatches.map((swatch) => (
                        <span
                          key={swatch}
                          className="h-10 flex-1 rounded-full border border-white/10"
                          style={{ background: swatch }}
                        />
                      ))}
                    </div>
                    <p className="mt-4 text-xs uppercase tracking-[0.18em] text-stone-500">
                      {isSelected ? "Currently active" : "Available preset"}
                    </p>
                  </button>
                );
              })}
            </div>
          </article>

          {sections.map((section) => (
            <article
              key={section.id}
              className="scroll-mt-28 rounded-[1.75rem] border border-stone-800 bg-stone-900/60 p-6"
              id={section.id}
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-stone-500">
                    {section.eyebrow}
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold text-stone-50">
                    {section.title}
                  </h3>
                </div>
                <p className="rounded-full border border-stone-700 bg-stone-950/70 px-4 py-2 text-xs uppercase tracking-[0.16em] text-stone-300">
                  {section.affects}
                </p>
              </div>
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
                        onChange={(event) => updateField(field.path, event.target.value)}
                        rows={field.rows}
                        value={getFieldValue(form, field.path)}
                      />
                    ) : (
                      <input
                        className="w-full rounded-2xl border border-stone-700 bg-stone-950 px-4 py-3 text-sm text-stone-100"
                        onChange={(event) => updateField(field.path, event.target.value)}
                        value={getFieldValue(form, field.path)}
                      />
                    )}
                  </label>
                ))}
              </div>
            </article>
          ))}

          <div className="flex flex-wrap items-center gap-3 rounded-[1.75rem] border border-stone-800 bg-stone-900/60 p-6">
            <button
              className="rounded-full bg-stone-50 px-5 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isPending || !isDirty}
              onClick={saveContent}
              type="button"
            >
              {isPending ? "Saving..." : isDirty ? "Save content" : "All changes saved"}
            </button>
            <p className="text-sm text-stone-300">{saveStateText}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
