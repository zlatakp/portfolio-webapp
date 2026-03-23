import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerAuthSession } from "@/lib/auth";
import { LoginForm } from "./login-form";

interface LoginPageProps {
  searchParams?: Promise<{
    callbackUrl?: string;
  }>;
}

export const metadata: Metadata = {
  title: "Admin Login",
  description: "Sign in to manage bookings, availability, services, and portfolio assets.",
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const session = await getServerAuthSession();

  if (session) {
    redirect("/dashboard");
  }

  const resolvedSearchParams = await searchParams;
  const callbackUrl = resolvedSearchParams?.callbackUrl ?? "/dashboard";

  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,#f8f5ef_0%,#efe3d1_50%,#e4d0bf_100%)] px-6 py-10 text-stone-950">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-5xl items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="space-y-6">
          <p className="text-sm uppercase tracking-[0.35em] text-stone-500">
            Photographer Admin
          </p>
          <div className="space-y-4">
            <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-stone-950 sm:text-5xl">
              Keep bookings, availability, and services in one protected workspace.
            </h1>
            <p className="max-w-lg text-base leading-7 text-stone-700">
              This admin area is reserved for the single account seeded into the local
              database. Sign in to reach the dashboard shell for the rest of the MVP.
            </p>
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/60 bg-white/85 p-8 shadow-[0_24px_80px_rgba(62,39,15,0.14)] backdrop-blur">
          <div className="mb-6 space-y-2">
            <h2 className="text-2xl font-semibold text-stone-950">Sign in</h2>
            <p className="text-sm leading-6 text-stone-600">
              Use the admin email and password from your environment or seeded local
              database.
            </p>
          </div>

          <LoginForm callbackUrl={callbackUrl} />
        </section>
      </div>
    </main>
  );
}
