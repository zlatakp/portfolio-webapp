const DEFAULT_BASE_URL = "http://localhost:3000";

function toUrl(value: string | undefined): URL {
  try {
    return new URL(value ?? DEFAULT_BASE_URL);
  } catch {
    return new URL(DEFAULT_BASE_URL);
  }
}

export function getBaseUrl(): URL {
  return toUrl(
    process.env.NEXT_PUBLIC_BASE_URL ??
      process.env.NEXTAUTH_URL ??
      DEFAULT_BASE_URL,
  );
}

export function getSiteMetadata() {
  const baseUrl = getBaseUrl();

  return {
    name: "Atelier Frame Photography",
    description:
      "A premium photography portfolio and direct booking experience for portraits, milestones, and editorial brand sessions.",
    baseUrl,
    location: "London, United Kingdom",
    ogImage: new URL("/og-image.jpg", baseUrl).toString(),
  };
}
