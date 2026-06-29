import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { contactId, email, reply } = await request.json();

    if (!contactId || !email || !reply) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!resend) {
      return NextResponse.json({ error: "RESEND_API_KEY is not configured in environment variables" }, { status: 500 });
    }

    // Send email using Resend
    await resend.emails.send({
      from: "Karta Support <support@bykarta.com>", // Update this verified domain in Resend
      to: [email],
      subject: "Re: Your message to Karta",
      text: reply,
    });

    // Mark as replied
    await prisma.contactSubmission.update({
      where: { id: contactId },
      data: { status: "REPLIED" }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Reply Contact Error:", error);
    return NextResponse.json({ error: "Failed to send reply" }, { status: 500 });
  }
}
