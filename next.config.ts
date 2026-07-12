import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The cockpit's draft engine + newsletter read PLAYBOOK.md / PROOF.md /
  // SEQUENCES.md at runtime. Bundle them into the serverless functions so they
  // exist in production (otherwise fs.readFileSync fails on Vercel).
  outputFileTracingIncludes: {
    "/api/cockpit/**": ["./cockpit/knowledge/**"],
  },
};

export default nextConfig;
