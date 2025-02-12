import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true, // Désactive les erreurs TypeScript en production
  },
  webpack(config, { isServer }) {
    // Ignore les erreurs de module manquant
    config.ignoreWarnings = [
      (warning) => warning.module && warning.module.resource && warning.module.resource.includes('node_modules')
    ];
    return config;
  },
};

export default nextConfig;
