/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

module.exports = {
  reactStrictMode: true,

  webpack(config) {
    config.resolve.fallback = {
      fs: false, // the solution
    };

    return config;
  },
};
