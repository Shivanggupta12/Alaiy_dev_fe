/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'www.amazon.in',
      'amazon.in',
      'images-na.ssl-images-amazon.com',
      'm.media-amazon.com',
      'via.placeholder.com',
      'example.com'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
