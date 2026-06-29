import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Pin the tracing root to this project so Next stops scanning parent
  // directories — this also silences the "multiple lockfiles" warning caused
  // by a stray package-lock.json higher up the tree.
  outputFileTracingRoot: path.join(__dirname),

  // Barrel-optimise heavy, widely-imported packages so dev compiles only the
  // symbols actually used instead of the whole module graph (faster startup).
  experimental: {
    optimizePackageImports: ["lucide-react", "date-fns"],
  },

  images:{
    remotePatterns:[
      {
        protocol:"https",
        hostname:"*",
        port:'',
        pathname:"/**"
      }
    ]
  },
  async headers() {
    return [
      {
        // Apply to all routes
        source: '/:path*',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
          },
        ],
      },
    ];
  },
  reactStrictMode:false
};

export default nextConfig;
