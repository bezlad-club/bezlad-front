import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
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
