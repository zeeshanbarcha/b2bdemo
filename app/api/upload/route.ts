import { NextResponse } from "next/server";
import { put } from "@vercel/blob";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file received." }, { status: 400 });
    }

    const blob = await put(file.name, file, {
      access: "public",
      token: process.env.blob_READ_WRITE_TOKEN,
    });

    return NextResponse.json({
      success: true,
      url: blob.url,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error uploading file." },
      { status: 500 }
    );
  }
}
