import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";


export async function POST(
  request: Request
){

  const formData =
    await request.formData();


  const file =
    formData.get("file") as File;



  if(!file){

    return NextResponse.json(
      {
        error:"Dosya bulunamadı"
      },
      {
        status:400
      }
    );

  }



  const bytes =
    await file.arrayBuffer();


  const buffer =
    Buffer.from(bytes);



  const uploadDir =
    path.join(
      process.cwd(),
      "public/uploads/products"
    );



  await mkdir(
    uploadDir,
    {
      recursive:true
    }
  );



  const filename =
    Date.now()
    +
    "-"
    +
    file.name;



  const filepath =
    path.join(
      uploadDir,
      filename
    );



  await writeFile(
    filepath,
    buffer
  );



  return NextResponse.json({

    url:
    `/uploads/products/${filename}`

  });


}