import type { NextConfig } from "next";

const BACKEND_URL = 'https://doleritic-goutily-shila.ngrok-free.dev';

const nextConfig: any = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${BACKEND_URL}/api/:path*`,
      },
      {
        source: '/r2-proxy/:path*',
        destination: 'https://9e1fa7f5e162c72cd4fc3692cec4c8c3.r2.cloudflarestorage.com/:path*',
      },
    ];
  },

};


export default nextConfig;

