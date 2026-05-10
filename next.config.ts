import type { NextConfig } from "next";

const BACKEND_URL = 'https://doleritic-goutily-shila.ngrok-free.dev';

const nextConfig: any = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${BACKEND_URL}/api/:path*`,
      },
    ];
  },

};


export default nextConfig;

