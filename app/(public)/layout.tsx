import Link from "next/link";
import { getSiteContent } from "@/lib/site-content";

const navigation = [
  { href: "/", label: "Home" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/book", label: "Book" },
];

export const dynamic = "force-dynamic";

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const content = await getSiteContent();

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fcf7f1_0%,#f4e9dc_100%)] text-stone-950">
      <header className="sticky top-0 z-40 border-b border-stone-200/80 bg-[#fcf7f1]/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-10">
            <div className="space-y-1">
              <p className="text-[0.65rem] uppercase tracking-[0.28em] text-stone-500">
                {content.header.eyebrow}
              </p>
              <Link
                className="text-sm font-semibold uppercase tracking-[0.32em] text-stone-700"
                href="/"
              >
                {content.header.brandName}
              </Link>
            </div>
            <nav className="flex flex-wrap items-center gap-4 text-sm font-medium text-stone-600">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  className="transition hover:text-stone-950"
                  href={item.href}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <Link
            className="inline-flex w-fit rounded-full bg-stone-950 px-5 py-3 text-sm font-semibold text-stone-50 transition hover:bg-stone-700"
            href="/book"
          >
            {content.header.bookingCtaLabel}
          </Link>
        </div>
      </header>

      {children}

      <footer className="border-t border-stone-200 bg-white/70">
        <div className="mx-auto grid max-w-6xl gap-6 px-6 py-10 md:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.28em] text-stone-500">
              {content.footer.eyebrow}
            </p>
            <h2 className="text-2xl font-semibold text-stone-950">
              {content.footer.heading}
            </h2>
            <p className="max-w-xl text-sm leading-7 text-stone-600">
              {content.footer.description}
            </p>
          </div>
          <div className="space-y-4 text-sm text-stone-600 md:justify-self-end">
            <p className="max-w-md leading-7">{content.footer.bookingPrompt}</p>
            <Link
              className="inline-flex rounded-full border border-stone-300 px-5 py-3 font-semibold text-stone-900 transition hover:border-stone-500 hover:bg-white"
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
