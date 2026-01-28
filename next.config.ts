import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // proxy request to backend server
  // source: https://stackoverflow.com/questions/60925133/proxy-to-backend-with-default-next-js-dev-server */
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8000/api/:path*'
      }
    ]
  }
};

export default nextConfig;
