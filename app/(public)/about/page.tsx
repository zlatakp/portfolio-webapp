import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "About the Studio",
    description:
      "Learn about the studio approach, client experience, and how the direct booking process works from inquiry to confirmation.",
    alternates: {
      canonical: "/about",
    },
    openGraph: {
      title: "About the Studio",
      description:
        "Learn about the studio approach, client experience, and how the direct booking process works from inquiry to confirmation.",
      url: "/about",
    },
  };
}

export default function AboutPage() {
  return (
    <main className="px-6 py-14">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <section className="space-y-5">
          <p className="text-xs uppercase tracking-[0.28em] text-stone-500">About</p>
          <h1 className="text-5xl font-semibold tracking-tight text-stone-950 sm:text-6xl">
            A calm, guided portrait experience from inquiry to delivery.
          </h1>
          <p className="text-base leading-8 text-stone-650">
            This studio focuses on intimate portraiture, milestone sessions, and
            editorial brand imagery. The process is intentionally simple: browse the
            work, choose the service that fits, and request a booking time directly on
            site.
          </p>
          <p className="text-base leading-8 text-stone-650">
            The custom booking system keeps scheduling, service management, and client
            communication in one place, so the public-facing experience stays clear and
            reassuring for clients on mobile and desktop alike.
          </p>
        </section>

        <section className="rounded-[2.5rem] bg-stone-950 p-8 text-stone-50 shadow-[0_30px_100px_rgba(31,24,20,0.2)]">
          <p className="text-xs uppercase tracking-[0.24em] text-stone-400">What to expect</p>
          <div className="mt-6 space-y-5">
            <div>
              <h2 className="text-xl font-semibold">1. Explore the work</h2>
              <p className="mt-2 text-sm leading-7 text-stone-300">
                Browse the portfolio and select the service that best matches the story
                you want to tell.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold">2. Request your time</h2>
              <p className="mt-2 text-sm leading-7 text-stone-300">
                Use the step-by-step booking flow to choose an available slot and submit
                your details without creating an account.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold">3. Receive confirmation</h2>
              <p className="mt-2 text-sm leading-7 text-stone-300">
                Booking emails and reminder messages keep the process easy to follow on
                both the client and studio side.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
