import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Cashfree } from "@/lib/cashfree";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { productIds, email, password } = await req.json();

    if (!productIds || !Array.isArray(productIds) || productIds.length === 0 || !email || !password) {
      return NextResponse.json({ error: "Missing fields or empty cart" }, { status: 400 });
    }

    const products = await prisma.product.findMany({
      where: { id: { in: productIds } }
    });
    
    if (products.length === 0) {
      return NextResponse.json({ error: "Products not found" }, { status: 404 });
    }

    const totalAmount = products.reduce((sum: number, p: any) => sum + p.price, 0);

    // Hash password and create/find user
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
        },
      });
    }

    // Create local order
    const order = await prisma.order.create({
      data: {
        totalAmount,
        status: "PENDING",
        products: {
          connect: products.map((p: any) => ({ id: p.id }))
        },
        user: { connect: { id: user.id } }
      }
    });

    // Create Cashfree Order
    const request = {
      order_amount: totalAmount,
      order_currency: "INR",
      order_id: order.id,
      customer_details: {
        customer_id: user.id,
        customer_email: user.email,
        customer_phone: "9999999999" // Mock phone, cashfree requires it
      },
      order_meta: {
        return_url: `${process.env.NEXTAUTH_URL}/my-files`
      }
    };

    // In a sandbox environment with mock credentials, Cashfree SDK might throw if app id is mock.
    // If it's literally "mock_app_id", let's return a mock session.
    if (process.env.CASHFREE_APP_ID === "mock_app_id") {
      await prisma.order.update({
        where: { id: order.id },
        data: { status: "SUCCESS" }
      });
      return NextResponse.json({
        payment_session_id: "mock_session_id",
        order_id: order.id
      });
    }

    const response = await Cashfree.PGCreateOrder("2022-09-01", request);
    
    // Save cashfree order id if needed
    await prisma.order.update({
      where: { id: order.id },
      data: { cashfreeOrderId: response.data.order_id }
    });

    return NextResponse.json({
      payment_session_id: response.data.payment_session_id,
      order_id: order.id
    });
  } catch (error: any) {
    console.error("Checkout Error:", error.response?.data || error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
