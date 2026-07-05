/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Brand/fuel-pump logos and template assets are local under /public.
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
  eslint: {
    // We run our own checks; don't fail the build on lint in this replica.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;

// OpenNext + Cloudflare: populate the Cloudflare context (env bindings like the
// D1 `DB`) during `next dev` so local development mirrors the Worker runtime.
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
