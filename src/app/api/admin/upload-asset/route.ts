import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { r2Client, R2_ASSETS_BUCKET_NAME, R2_ASSETS_PUBLIC_URL } from "@/lib/r2";
import { PutObjectCommand } from "@aws-sdk/client-s3";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Missing file" }, { status: 400 });
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Generate a unique object key for R2
    const fileExtension = file.name.split('.').pop();
    const randomString = Math.random().toString(36).substring(2, 8);
    const objectKey = `media/${Date.now()}-${randomString}.${fileExtension}`;

    // Upload to Cloudflare R2
    const command = new PutObjectCommand({
      Bucket: R2_ASSETS_BUCKET_NAME,
      Key: objectKey,
      Body: buffer,
      ContentType: file.type || "application/octet-stream",
    });

    await r2Client.send(command);

    // Return the public URL
    // Ensure the public URL doesn't have a trailing slash before appending
    const baseUrl = R2_ASSETS_PUBLIC_URL.replace(/\/$/, "");
    const publicUrl = `${baseUrl}/${objectKey}`;

    return NextResponse.json({ 
      success: true, 
      message: "Asset uploaded successfully to public R2 bucket",
      publicUrl 
    });

  } catch (error) {
    console.error("Asset Upload Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
