import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/actions/session";
import { getSiteSettings, updateSiteSettings } from "@/lib/services/settingsService";

export async function GET() {
  try {
    const settings = await getSiteSettings();
    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Ayarlar alınamadı." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Yetkisiz işlem." }, { status: 403 });
    }

    const body = await req.json();
    const { settings } = body;

    if (!settings || typeof settings !== "object") {
      return NextResponse.json(
        { error: "Geçersiz ayar verisi." },
        { status: 400 }
      );
    }

    const success = await updateSiteSettings(settings);
    if (!success) {
      return NextResponse.json(
        { error: "Ayarlar veritabanına kaydedilemedi." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: "Ayarlar başarıyla güncellendi." });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Sunucu hatası." },
      { status: 500 }
    );
  }
}
