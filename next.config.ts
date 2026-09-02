import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "cdn.sanity.io",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "**",
      },
    ],
    localPatterns: [
      {
        pathname: "/api/media/file/**",
      },
      {
        pathname: '/images/**',
      },
    ],
  },
};

export default withPayload(nextConfig, { devBundleServerPackages: false });
