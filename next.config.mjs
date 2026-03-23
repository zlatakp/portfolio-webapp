const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

let remotePatterns = [];

if (supabaseUrl) {
  try {
    const { protocol, hostname, port } = new URL(supabaseUrl);

    remotePatterns = [
      {
        protocol: protocol.replace(":", ""),
        hostname,
        port,
        pathname: "/storage/v1/object/public/**",
      },
    ];
  } catch {
    remotePatterns = [];
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns,
  },
};

export default nextConfig;
