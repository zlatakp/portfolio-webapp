const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

const remotePatterns = [
  {
    protocol: "https",
    hostname: "images.unsplash.com",
    port: "",
    pathname: "/**",
  },
];

if (supabaseUrl) {
  try {
    const { protocol, hostname, port } = new URL(supabaseUrl);

    remotePatterns.push(
      {
        protocol: protocol.replace(":", ""),
        hostname,
        port,
        pathname: "/storage/v1/object/public/**",
      },
    );
  } catch {
    // Ignore invalid Supabase host configuration and keep placeholder image support.
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns,
  },
};

export default nextConfig;
