import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Name, email, and message are required" }, { status: 400 });
    }

    const submission = await prisma.contactSubmission.create({
      data: { name, email, message, status: "UNREAD" }
    });

    return NextResponse.json({ success: true, submission });
  } catch (error) {
    console.error("Contact Submission Error:", error);
    return NextResponse.json({ error: "Failed to submit message" }, { status: 500 });
  }
}
