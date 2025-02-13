import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config) => {
    config.ignoreWarnings = [/Module not found/]; // Ignore "Module not found"
    return config;
  },
};

export default nextConfig;
