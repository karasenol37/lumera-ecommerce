import type { NextConfig } from "next";


const nextConfig: NextConfig = {

  serverExternalPackages: [
    "iyzipay"
  ],


  outputFileTracingIncludes: {

    "/api/payment/create": [
      "./node_modules/iyzipay/**",
      "./node_modules/postman-request/**",
      "./node_modules/extend/**"
    ],


    "/api/payment/callback": [
      "./node_modules/iyzipay/**",
      "./node_modules/postman-request/**",
      "./node_modules/extend/**"
    ]

  }

};


export default nextConfig;