import Link from "next/link";

const navigation = [
  { href: "/", label: "Home" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/book", label: "Book" },
];

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fcf7f1_0%,#f4e9dc_100%)] text-stone-950">
      <header className="sticky top-0 z-40 border-b border-stone-200/80 bg-[#fcf7f1]/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
          <Link className="text-sm font-semibold uppercase tracking-[0.32em] text-stone-700" href="/">
            Zlata Studio
          </Link>
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
      </header>

      {children}

      <footer className="border-t border-stone-200 bg-white/70">
        <div className="mx-auto grid max-w-6xl gap-6 px-6 py-10 md:grid-cols-2">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.28em] text-stone-500">Photography studio</p>
            <h2 className="text-2xl font-semibold text-stone-950">Elegant sessions, calm direction, lasting images.</h2>
          </div>
          <div className="space-y-2 text-sm text-stone-600 md:justify-self-end">
            <p>Bookings and availability are managed through the custom studio system.</p>
            <p>Use the booking flow to request your preferred session date and time.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
