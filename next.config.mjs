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
