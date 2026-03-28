import Link from "next/link";
import type { CSSProperties } from "react";
import { getSelectedPublicTheme, getSiteContent } from "@/lib/site-content";

const navigation = [
  { href: "/", label: "Home" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/services#packages", label: "Packages" },
  { href: "/destinations", label: "Destination Packages" },
  { href: "/about", label: "About" },
];

export const dynamic = "force-dynamic";

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const content = await getSiteContent();
  const themePreset = getSelectedPublicTheme(content);
  const themeStyle = {
    "--public-shell-background": themePreset.tokens.shellBackground,
    "--public-header-surface": themePreset.tokens.headerSurface,
    "--public-header-border": themePreset.tokens.headerBorder,
    "--public-primary-text": themePreset.tokens.primaryText,
    "--public-muted-text": themePreset.tokens.mutedText,
    "--public-primary-cta-background": themePreset.tokens.primaryCtaBackground,
    "--public-primary-cta-text": themePreset.tokens.primaryCtaText,
    "--public-primary-cta-hover": themePreset.tokens.primaryCtaHover,
    "--public-secondary-cta-background": themePreset.tokens.secondaryCtaBackground,
    "--public-secondary-cta-border": themePreset.tokens.secondaryCtaBorder,
    "--public-secondary-cta-text": themePreset.tokens.secondaryCtaText,
    "--public-secondary-cta-hover": themePreset.tokens.secondaryCtaHover,
    "--public-card-surface": themePreset.tokens.cardSurface,
    "--public-card-border": themePreset.tokens.cardBorder,
    "--public-accent-panel-surface": themePreset.tokens.accentPanelSurface,
    "--public-accent-panel-text": themePreset.tokens.accentPanelText,
    "--public-dark-panel-surface": themePreset.tokens.darkPanelSurface,
    "--public-dark-panel-text": themePreset.tokens.darkPanelText,
    "--public-footer-surface": themePreset.tokens.footerSurface,
    "--public-image-overlay-text": themePreset.tokens.imageOverlayText,
    "--public-image-overlay-muted-text": themePreset.tokens.imageOverlayMutedText,
    "--public-shadow-color": themePreset.tokens.shadowColor,
  } as CSSProperties;

  return (
    <div className="public-theme-shell min-h-screen" style={themeStyle}>
      <header className="sticky top-0 z-40 border-b border-[var(--public-header-border)] bg-[var(--public-header-surface)] backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-10">
            <div className="space-y-1">
              <p className="text-[0.65rem] uppercase tracking-[0.28em] text-[var(--public-muted-text)]">
                {content.header.eyebrow}
              </p>
              <Link
                className="text-sm font-semibold uppercase tracking-[0.32em] text-[var(--public-primary-text)]"
                href="/"
              >
                {content.header.brandName}
              </Link>
            </div>
            <nav className="flex w-fit flex-wrap items-center gap-2 rounded-full border border-[var(--public-header-border)] bg-[var(--public-card-surface)] p-2 text-sm font-medium text-[var(--public-muted-text)] shadow-[0_18px_40px_var(--public-shadow-color)]">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  className="rounded-full px-4 py-2 transition hover:bg-[var(--public-secondary-cta-background)] hover:text-[var(--public-primary-text)]"
                  href={item.href}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <Link
            className="inline-flex w-fit rounded-full bg-[var(--public-primary-cta-background)] px-5 py-3 text-sm font-semibold text-[var(--public-primary-cta-text)] transition hover:bg-[var(--public-primary-cta-hover)]"
            href="/book"
          >
            {content.header.bookingCtaLabel}
          </Link>
        </div>
      </header>

      {children}

      <footer className="border-t border-[var(--public-header-border)] bg-[var(--public-footer-surface)]">
        <div className="mx-auto grid max-w-6xl gap-6 px-6 py-10 md:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.28em] text-[var(--public-muted-text)]">
              {content.footer.eyebrow}
            </p>
            <h2 className="text-2xl font-semibold text-[var(--public-primary-text)]">
              {content.footer.heading}
            </h2>
            <p className="max-w-xl text-sm leading-7 text-[var(--public-muted-text)]">
              {content.footer.description}
            </p>
          </div>
          <div className="space-y-4 text-sm text-[var(--public-muted-text)] md:justify-self-end">
            <p className="max-w-md leading-7">{content.footer.bookingPrompt}</p>
            <Link
              className="inline-flex rounded-full border border-[var(--public-secondary-cta-border)] bg-[var(--public-secondary-cta-background)] px-5 py-3 font-semibold text-[var(--public-secondary-cta-text)] transition hover:bg-[var(--public-secondary-cta-hover)]"
              href="/book"
            >
              {content.header.bookingCtaLabel}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
