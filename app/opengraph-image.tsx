import { ImageResponse } from "next/og";

export const runtime = "nodejs";

export const alt = "LUMERA | Premium Outdoor & Lüks Dinlenme Koleksiyonları";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#090a0f",
          backgroundImage:
            "radial-gradient(circle at 50% 30%, rgba(200, 161, 101, 0.2) 0%, rgba(9, 10, 15, 1) 70%)",
          color: "#f5efe6",
          fontFamily: "sans-serif",
          padding: "60px",
          textAlign: "center",
          border: "2px solid rgba(200, 161, 101, 0.4)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            border: "1px solid rgba(200, 161, 101, 0.4)",
            backgroundColor: "rgba(200, 161, 101, 0.1)",
            padding: "8px 24px",
            borderRadius: "999px",
            marginBottom: "32px",
          }}
        >
          <span
            style={{
              color: "#e5c184",
              fontSize: "16px",
              fontWeight: 700,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
            }}
          >
            LUMERA LUXURY OUTDOOR
          </span>
        </div>

        <h1
          style={{
            fontSize: "64px",
            fontWeight: 900,
            letterSpacing: "-0.02em",
            color: "#ffffff",
            margin: "0 0 24px 0",
            lineHeight: 1.15,
          }}
        >
          Gölgede Zarafet & Masif Ahşap Konforu
        </h1>

        <p
          style={{
            fontSize: "24px",
            color: "#d4af37",
            margin: "0 0 40px 0",
            maxWidth: "850px",
            lineHeight: 1.4,
          }}
        >
          Hamak • Lüks Şezlong • Güneş Şemsiyesi • Ateş Çukuru
        </p>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "24px",
            fontSize: "18px",
            color: "#9ca3af",
          }}
        >
          <span>• Masif Ahşap Zanaatı</span>
          <span>• Türkiye Geneli Ücretsiz Kargo</span>
          <span>• Güvenli Alışveriş</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
