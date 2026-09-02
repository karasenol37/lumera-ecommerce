import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "LUMERA | Lüks Ahşap Bahçe Mobilyaları",
    short_name: "LUMERA",
    description:
      "Doğal masif ahşap ve üst düzey el işçiliği hamak, şezlong, şemsiye ve ateş çukuru koleksiyonları.",
    start_url: "/",
    display: "standalone",
    background_color: "#090a0f",
    theme_color: "#c8a165",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: "/logo.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
