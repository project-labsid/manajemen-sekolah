import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Vercel otomatis handle output, tidak perlu standalone
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
