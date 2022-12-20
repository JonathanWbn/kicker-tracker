/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  experimental: { appDir: true },
  async redirects() {
    return [
      {
        source: "/",
        destination: "https://kicker-claimsforce.vercel.app/",
        permanent: true,
      },
    ];
  },
};
