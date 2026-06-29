import { blogPosts } from "@/data/blog";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = blogPosts.find((p) => p.slug === params.slug);

  if (!post) {
    notFound();
  }

  // Simple markdown renderer for the basic markdown used in blog data
  const renderContent = (content: string) => {
    return content.split('\n\n').map((block, i) => {
      if (block.startsWith('### ')) {
        return <h3 key={i} style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '2rem', marginBottom: '1rem' }}>{block.replace('### ', '')}</h3>;
      }
      if (block.startsWith('## ')) {
        return <h2 key={i} style={{ fontSize: '2rem', fontWeight: 800, marginTop: '2.5rem', marginBottom: '1rem' }}>{block.replace('## ', '')}</h2>;
      }
      if (block.includes('\n- ')) {
        const lines = block.split('\n');
        const header = lines[0] && !lines[0].startsWith('-') ? <p key={`${i}-h`} style={{ marginBottom: '1rem' }}>{lines[0]}</p> : null;
        const items = lines.filter(l => l.startsWith('- ')).map((item, j) => (
          <li key={j} style={{ marginBottom: '0.5rem', lineHeight: 1.8 }} dangerouslySetInnerHTML={{ __html: item.replace('- ', '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
        ));
        return (
          <div key={i}>
            {header}
            <ul style={{ paddingLeft: '1.5rem', marginBottom: '1.5rem', listStyleType: 'disc' }}>
              {items}
            </ul>
          </div>
        );
      }
      
      const formattedBlock = block.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      return <p key={i} style={{ marginBottom: '1.5rem', lineHeight: 1.8, fontSize: '1.125rem', color: 'var(--foreground)' }} dangerouslySetInnerHTML={{ __html: formattedBlock }} />;
    });
  };

  return (
    <div className="container" style={{ padding: '4rem 1rem', maxWidth: '800px', margin: '0 auto', minHeight: '80vh' }}>
      <Link href="/blog" style={{ display: 'inline-flex', alignItems: 'center', color: 'var(--muted-foreground)', textDecoration: 'none', marginBottom: '2rem', fontWeight: 600 }}>
        &larr; Back to Blog
      </Link>
      
      <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>
        {post.category} • {post.date}
      </div>
      
      <h1 style={{ fontSize: '3.5rem', fontWeight: 800, lineHeight: 1.1, marginBottom: '2rem' }}>
        {post.title}
      </h1>
      
      <div style={{ fontSize: '1.25rem', color: 'var(--muted-foreground)', lineHeight: 1.6, marginBottom: '3rem', fontStyle: 'italic' }}>
        {post.excerpt}
      </div>

      <div style={{ height: '1px', background: 'var(--border)', marginBottom: '3rem' }}></div>

      <article style={{ color: 'var(--foreground)' }}>
        {renderContent(post.content)}
      </article>

      <div style={{ marginTop: '5rem', padding: '3rem', background: 'var(--muted)', borderRadius: '1rem', textAlign: 'center' }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Looking for {post.category}?</h3>
        <p style={{ color: 'var(--muted-foreground)', marginBottom: '2rem' }}>Check out our premium digital marketplace for high-quality assets.</p>
        <Link href={`/products?category=${encodeURIComponent(post.category)}`} className="btn-primary" style={{ display: 'inline-block' }}>
          Shop {post.category}
        </Link>
      </div>
    </div>
  );
}
