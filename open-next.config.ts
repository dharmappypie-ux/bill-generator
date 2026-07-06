import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default {
  ...defineCloudflareConfig(),
  // Build Next.js directly instead of via `npm run build`, so the `build`
  // script can point at opennextjs-cloudflare without infinite recursion.
  buildCommand: "npx next build",
};
