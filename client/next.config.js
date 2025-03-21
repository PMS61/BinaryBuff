/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'lh3.googleusercontent.com',  // Google user profile images
      'googleusercontent.com'
    ],
  },
}

module.exports = nextConfig
