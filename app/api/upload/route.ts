import { NextResponse } from "next/server";
import { put } from "@vercel/blob";


export async function POST(
  request: Request
) {

  const formData =
    await request.formData();


  const file =
    formData.get("file") as File;


  if (!file) {

    return NextResponse.json(
      {
        error: "Dosya bulunamadı"
      },
      {
        status: 400
      }
    );

  }


  const filename =
    `${Date.now()}-${file.name.replace(/\s/g, "-")}`;


  const blob =
    await put(
      filename,
      file,
      {
        access: "public"
      }
    );


  return NextResponse.json({

    url: blob.url

  });


}