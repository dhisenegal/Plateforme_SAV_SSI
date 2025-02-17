import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true, // Désactive les erreurs TypeScript en production
  },

    
};

export default nextConfig;
