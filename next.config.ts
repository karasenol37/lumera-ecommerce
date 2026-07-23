import type { NextConfig } from "next";


const nextConfig: NextConfig = {

  serverExternalPackages: [
    "iyzipay"
  ],


  outputFileTracingIncludes: {

    "/api/payment/create": [
      "./node_modules/iyzipay/**",
      "./node_modules/postman-request/**",
      "./node_modules/extend/**",
      "./node_modules/@postman/tough-cookie/**",
      "./node_modules/punycode/**"
    ],


    "/api/payment/callback": [
      "./node_modules/iyzipay/**",
      "./node_modules/postman-request/**",
      "./node_modules/extend/**",
      "./node_modules/@postman/tough-cookie/**",
      "./node_modules/punycode/**"
    ]

  }

};


export default nextConfig;