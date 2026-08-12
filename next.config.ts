import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  skipTrailingSlashRedirect: true,
  async rewrites() {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL ?? "https://admin.primefamilyhousing.com";
    return [
      {
        source: "/api/v1/:path*/",
        destination: `${backendUrl}/api/v1/:path*/`,
      },
      {
        source: "/api/v1/:path*",
        destination: `${backendUrl}/api/v1/:path*/`,
      },
    ];
  },
};

export default nextConfig;
