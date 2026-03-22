import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // proxy request to backend server
  // source: https://stackoverflow.com/questions/60925133/proxy-to-backend-with-default-next-js-dev-server */
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://backend:8000/api/:path*'
      }
    ]
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
