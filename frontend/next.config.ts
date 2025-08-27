import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: "/api/search",
        destination: "http://backend:8000/api/search",
      },
    ];
  },
};

export default nextConfig;
