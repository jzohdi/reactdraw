/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // This example is its own project inside the library's repo: don't let Turbopack pick the
  // repo root (which has its own lockfile) as the workspace root.
  turbopack: {
    root: __dirname,
  },
  // Don't let `next dev` write an AGENTS.md when it detects a coding agent.
  agentRules: false,
  experimental: {
    // No upgrade reminders: they fetch npm advisories, and they can stop `next build`
    // when a coding agent runs it.
    agentUpgrade: false,
  },
};

console.log(process.env.NODE_ENV);

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  //   enabled: process.env.NODE_ENV === "production",
  enabled: false,
});

module.exports = withBundleAnalyzer(nextConfig);
