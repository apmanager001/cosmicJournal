import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable trace to avoid permission issues
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  // Disable tracing completely
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },
  turbopack: {},
};

export default nextConfig;
