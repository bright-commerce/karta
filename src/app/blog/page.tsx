import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function BlogIndexPage() {
  const blogPosts = await prisma.blogPost.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container" style={{ padding: '4rem 1rem', minHeight: '80vh' }}>
      <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem' }}>Karta Blog</h1>
      <p style={{ color: 'var(--muted-foreground)', fontSize: '1.25rem', marginBottom: '3rem' }}>
        Insights, guides, and strategies for digital creators.
      </p>

      {blogPosts.length === 0 ? (
        <div className="bg-yellow-50 text-yellow-800 p-6 rounded-lg text-center">
          <p>No blog posts found. Please visit <b>/api/admin/migrate-blog</b> as an admin to migrate the default posts into the database.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
          {blogPosts.map(post => (
            <Link key={post.id} href={`/blog/${post.slug}`} style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}>
              <div style={{ 
                background: 'var(--muted)', 
                borderRadius: '1rem', 
                padding: '2rem',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s',
              }}
              className="blog-card"
              >
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                  {post.category}
                </div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', lineHeight: 1.3 }}>
                  {post.title}
                </h2>
                <p style={{ color: 'var(--muted-foreground)', marginBottom: '1.5rem', flex: 1 }}>
                  {post.excerpt}
                </p>
                <div style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', fontWeight: 600 }}>
                  {post.date}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
      <style>{`
        .blog-card:hover {
          transform: translateY(-4px);
        }
      `}</style>
    </div>
  );
}
