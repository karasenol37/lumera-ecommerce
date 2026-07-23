import type { NextConfig } from "next";


const nextConfig: NextConfig = {

  serverExternalPackages: [
    "iyzipay"
  ],


  outputFileTracingIncludes: {

    "/api/payment/create": [
      "./node_modules/iyzipay/**"
    ],

    "/api/payment/callback": [
      "./node_modules/iyzipay/**"
    ]

  }

};


export default nextConfig;