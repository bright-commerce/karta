import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import fs from "fs";
import path from "path";

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

    // Resolve file path safely
    // Defaulting to our dummy zip if it's missing from DB for testing
    const fileUrl = product.fileUrl || "storage/product.zip";
    const filePath = path.join(process.cwd(), fileUrl);

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "File not found on server" }, { status: 404 });
    }

    const fileBuffer = fs.readFileSync(filePath);

    const response = new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Disposition": `attachment; filename="${product.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.zip"`,
        "Content-Type": "application/zip",
      }
    });

    return response;

  } catch (error) {
    console.error("Download Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
