import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongoose";
import { rateLimiter } from "@/app/lib/rateLimiter";
import Creations from "@/app/model/Creations";

function getIP(req: NextRequest) {
  return req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
}

export async function GET(req: NextRequest) {
  const ip = getIP(req);
  if (!rateLimiter(ip)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  await connectDB();
  const users = await Creations.find();
  return NextResponse.json(users);
}

import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  const ip = getIP(req);
  if (!rateLimiter(ip)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  await connectDB();

  const formData = await req.formData();
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const configStr = formData.get("configuration") as string;
  const image = formData.get("image") as Blob;

  if (!name || !image) {
    return NextResponse.json(
      { error: "Name and image are required" },
      { status: 400 }
    );
  }

  const arrayBuffer = await image.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const uploadResult = await new Promise((resolve, reject) => {
    cloudinary.v2.uploader
      .upload_stream({ folder: "fractals" }, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      })
      .end(buffer);
  });

  const { secure_url } = uploadResult as { secure_url: string };
  console.log(secure_url);
  const newCreation = await Creations.create({
    name,
    description,
    configuration: JSON.parse(configStr),
    imageUrl: secure_url,
  });

  return NextResponse.json(newCreation, { status: 201 });
}
