import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const { email, name, businessName } = await req.json();

    if (!email || !name || !businessName) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const existing = await prisma.waitlist.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ message: "Already on waitlist" }, { status: 200 });
    }

    await prisma.waitlist.create({
      data: { email, name, businessName }
    });

    const adminEmail = process.env.ADMIN_EMAIL || "admin@marketplace.com";
    await sendEmail(adminEmail, "New Seller Waitlist Join", `A new seller has joined the waitlist: ${email}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Waitlist error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
