/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

console.log(process.env.NODE_ENV);

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  //   enabled: process.env.NODE_ENV === "production",
  enabled: false,
});

module.exports = withBundleAnalyzer(nextConfig);
