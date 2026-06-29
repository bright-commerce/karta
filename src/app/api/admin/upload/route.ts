import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { r2Client, R2_BUCKET_NAME } from "@/lib/r2";
import { PutObjectCommand } from "@aws-sdk/client-s3";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const productId = formData.get("productId") as string | null;

    if (!file || !productId) {
      return NextResponse.json({ error: "Missing file or productId" }, { status: 400 });
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Generate a unique object key for R2
    const fileExtension = file.name.split('.').pop();
    const objectKey = `products/${productId}-${Date.now()}.${fileExtension}`;

    // Upload to Cloudflare R2
    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: objectKey,
      Body: buffer,
      ContentType: file.type || "application/octet-stream",
    });

    await r2Client.send(command);

    // Update product in DB
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: { fileUrl: objectKey }
    });

    return NextResponse.json({ 
      success: true, 
      message: "File uploaded to R2 and linked to product",
      objectKey 
    });

  } catch (error) {
    console.error("Admin Upload Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
