import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // ⚠️ This disables ESLint checks during builds
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true, // disables type checking during build
  },
};

export default nextConfig;
