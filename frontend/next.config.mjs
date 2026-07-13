/** @type {import('next').NextConfig} */
const API_URL = process.env.BACKEND_URL || "http://localhost:5000";

const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${API_URL}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
