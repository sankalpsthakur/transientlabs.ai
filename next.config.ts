import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  // Render runs a single small web-service instance. The standalone server
  // loads only traced production dependencies instead of the full install,
  // which keeps the runtime working set bounded and makes the deploy artifact
  // match what was exercised during the build.
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
    ],
  },
};

export default nextConfig;
