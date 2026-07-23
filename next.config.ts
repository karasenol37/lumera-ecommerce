import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  serverExternalPackages: [
    "iyzipay",
    "postman-request",
    "@postman/form-data",
    "@postman/tough-cookie",
    "qs",
    "tough-cookie",
    "http-signature",
    "sshpk"
  ],


  outputFileTracingIncludes: {

    "/api/payment/create": [
      "./node_modules/punycode/**",

      // iyzipay
      "./node_modules/iyzipay/**",

      // request zinciri
      "./node_modules/postman-request/**",
      "./node_modules/request/**",

      // postman paketleri
      "./node_modules/@postman/**",

      // qs
      "./node_modules/qs/**",
      "./node_modules/querystringify/**",
      "./node_modules/url-parse/**",
      "./node_modules/requires-port/**",

      // cookie
      "./node_modules/tough-cookie/**",
      "./node_modules/psl/**",
      "./node_modules/universalify/**",

      // form-data
      "./node_modules/asynckit/**",

      // stream
      "./node_modules/stream-length/**",
      "./node_modules/bluebird/**",

      // buffer
      "./node_modules/safe-buffer/**",
      "./node_modules/safer-buffer/**",

      // object / function helpers
      "./node_modules/extend/**",
      "./node_modules/side-channel/**",
      "./node_modules/object-inspect/**",
      "./node_modules/call-bind/**",
      "./node_modules/get-intrinsic/**",
      "./node_modules/has-symbols/**",
      "./node_modules/function-bind/**",
      "./node_modules/es-errors/**",

      // crypto / signature
      "./node_modules/http-signature/**",
      "./node_modules/sshpk/**",
      "./node_modules/asn1/**",
      "./node_modules/jsbn/**",
      "./node_modules/jsprim/**",
      "./node_modules/extsprintf/**",
      "./node_modules/bcrypt-pbkdf/**",
      "./node_modules/tweetnacl/**",

      // aws signature
      "./node_modules/aws4/**",
      "./node_modules/aws-sign2/**"

    ],


    "/api/payment/callback": [

      "./node_modules/punycode/**",

      // iyzipay
      "./node_modules/iyzipay/**",

      // request zinciri
      "./node_modules/postman-request/**",
      "./node_modules/request/**",

      // postman
      "./node_modules/@postman/**",

      // qs
      "./node_modules/qs/**",
      "./node_modules/querystringify/**",
      "./node_modules/url-parse/**",
      "./node_modules/requires-port/**",

      // cookie
      "./node_modules/tough-cookie/**",
      "./node_modules/psl/**",
      "./node_modules/universalify/**",

      // form-data
      "./node_modules/asynckit/**",

      // stream
      "./node_modules/stream-length/**",
      "./node_modules/bluebird/**",

      // buffer
      "./node_modules/safe-buffer/**",
      "./node_modules/safer-buffer/**",

      // helpers
      "./node_modules/extend/**",
      "./node_modules/side-channel/**",
      "./node_modules/object-inspect/**",
      "./node_modules/call-bind/**",
      "./node_modules/get-intrinsic/**",
      "./node_modules/has-symbols/**",
      "./node_modules/function-bind/**",
      "./node_modules/es-errors/**",

      // signature
      "./node_modules/http-signature/**",
      "./node_modules/sshpk/**",
      "./node_modules/asn1/**",
      "./node_modules/jsbn/**",
      "./node_modules/jsprim/**",
      "./node_modules/extsprintf/**",
      "./node_modules/bcrypt-pbkdf/**",
      "./node_modules/tweetnacl/**",

      // aws
      "./node_modules/aws4/**",
      "./node_modules/aws-sign2/**"

    ]

  }

};


export default nextConfig;