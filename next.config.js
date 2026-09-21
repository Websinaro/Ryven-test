/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "drive.google.com" },
    ],
    formats: ["image/avif", "image/webp"],
  },
};

module.exports = nextConfig;
