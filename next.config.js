const { withPlausibleProxy } = require("next-plausible");

/** @type {import('next').NextConfig} */
const nextConfig = withPlausibleProxy()({
  experimental: {
    appDir: true,
  },
});

module.exports = nextConfig;
