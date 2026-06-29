import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const idsParam = searchParams.get("ids");
  
  try {
    if (idsParam) {
      const ids = idsParam.split(",");
      const products = await prisma.product.findMany({
        where: { id: { in: ids } }
      });
      return NextResponse.json(products);
    }
    
    // Optionally return all products if no ids provided
    const products = await prisma.product.findMany();
    return NextResponse.json(products);
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}
