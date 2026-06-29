import { PrismaClient } from "@prisma/client";
import { blogPosts } from "../src/data/blog";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting blog migration...");

  for (const post of blogPosts) {
    // Check if it already exists to avoid unique constraint errors
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
      console.log(`Migrated: ${post.title}`);
    } else {
      console.log(`Skipped (already exists): ${post.title}`);
    }
  }

  console.log("Migration complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
