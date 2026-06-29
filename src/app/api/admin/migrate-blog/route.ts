import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { blogPosts } from "@/data/blog";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let migrated = 0;
    let skipped = 0;

    for (const post of blogPosts) {
      const existing = await prisma.blogPost.findUnique({
        where: { slug: post.slug }
      });

      if (!existing) {
        await prisma.blogPost.create({
          data: {
            title: post.title,
            slug: post.slug,
            date: post.date,
            excerpt: post.excerpt,
            content: post.content,
            category: post.category,
          }
        });
        migrated++;
      } else {
        skipped++;
      }
    }

    return NextResponse.json({ success: true, migrated, skipped });
  } catch (error: any) {
    console.error("Migration Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
