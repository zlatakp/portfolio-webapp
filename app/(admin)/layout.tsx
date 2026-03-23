import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerAuthSession } from "@/lib/auth";

const navigationItems = [
  { href: "/dashboard/bookings", label: "Bookings" },
  { href: "/dashboard/availability", label: "Availability" },
  { href: "/dashboard/services", label: "Services" },
  { href: "/dashboard/portfolio", label: "Portfolio" },
];

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerAuthSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100">
      <div className="mx-auto grid min-h-screen max-w-7xl lg:grid-cols-[260px_1fr]">
        <aside className="border-b border-stone-800 bg-stone-900/80 px-6 py-8 lg:border-b-0 lg:border-r">
          <div className="space-y-8">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.3em] text-stone-500">
                Admin Dashboard
              </p>
              <div>
                <h1 className="text-2xl font-semibold text-stone-50">Studio Control</h1>
                <p className="mt-2 text-sm text-stone-400">{session.user?.email}</p>
              </div>
            </div>

            <nav className="space-y-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  className="block rounded-2xl border border-stone-800 px-4 py-3 text-sm font-medium text-stone-300 transition hover:border-stone-700 hover:bg-stone-800 hover:text-stone-50"
                  href={item.href}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        <main className="bg-[radial-gradient(circle_at_top,#2b231d_0%,#171210_38%,#120f0d_100%)] px-6 py-8 sm:px-8 lg:px-10">
          {children}
        </main>
      </div>
    </div>
  );
}
