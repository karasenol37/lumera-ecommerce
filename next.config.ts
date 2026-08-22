import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
      {
        protocol: "https",
        hostname: "*.vercel-storage.com",
      },
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },

  serverExternalPackages: [
    "iyzipay",
    "postman-request",
    "@postman/tough-cookie",
    "@postman/form-data"
  ],

  outputFileTracingIncludes: {
    "/api/payment/create": [
      "./node_modules/iyzipay/**",
      "./node_modules/postman-request/**",
      "./node_modules/@postman/**",
      "./node_modules/request/**",
      "./node_modules/http-signature/**",
      "./node_modules/sshpk/**"
    ],
    "/api/payment/callback": [
      "./node_modules/iyzipay/**",
      "./node_modules/postman-request/**",
      "./node_modules/@postman/**",
      "./node_modules/request/**",
      "./node_modules/http-signature/**",
      "./node_modules/sshpk/**"
    ]
  }
};

export default nextConfig;