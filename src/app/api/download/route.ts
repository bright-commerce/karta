import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { r2Client, R2_BUCKET_NAME } from "@/lib/r2";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");
    const orderId = searchParams.get("orderId");

    if (!productId || !orderId) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    // Verify order belongs to user and includes product
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { user: true, products: true }
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.user.email !== session.user.email) {
      return NextResponse.json({ error: "Unauthorized access to order" }, { status: 403 });
    }

    if (order.status !== "SUCCESS") {
      return NextResponse.json({ error: "Payment not successful" }, { status: 402 });
    }

    const product = order.products.find(p => p.id === productId);
    if (!product) {
      return NextResponse.json({ error: "Product not in this order" }, { status: 404 });
    }

    // Replace the default with empty string, we assume fileUrl is the R2 object key
    const fileKey = product.fileUrl;
    if (!fileKey) {
      return NextResponse.json({ error: "Product file is not configured." }, { status: 404 });
    }

    try {
      const command = new GetObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: fileKey,
      });

      // URL expires in 1 hour (3600 seconds)
      const presignedUrl = await getSignedUrl(r2Client, command, { expiresIn: 3600 });
      
      // Redirect the user to the presigned URL
      return NextResponse.redirect(presignedUrl);
    } catch (r2Error) {
      console.error("R2 Presigned URL Error:", r2Error);
      return NextResponse.json({ error: "Failed to generate download link" }, { status: 500 });
    }

  } catch (error) {
    console.error("Download Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
