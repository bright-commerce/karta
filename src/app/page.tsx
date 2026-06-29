import styles from "./page.module.css";
import Link from "next/link";
import prisma from "@/lib/prisma";
import ProductGrid from "@/components/ProductGrid";
import WaitlistForm from "@/components/WaitlistForm";

export const dynamic = "force-dynamic";

export default async function Home() {
  const allProducts = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
  });

  const featuredProducts = allProducts.slice(0, 3);
  const popularProducts = allProducts.slice(3, 6);
  const recentProducts = allProducts.slice(0, 3); // Just show newest

  const blogPosts = [
    { id: "1", title: "How to Monetize AI Prompts in 2026", date: "June 25, 2026", excerpt: "Discover the secrets of crafting and selling AI prompts on digital marketplaces." },
    { id: "2", title: "Why Notion Templates are the New Gold Rush", date: "June 21, 2026", excerpt: "Learn how creators are making a full-time income by selling Notion OS systems." },
    { id: "3", title: "Top 5 Lightroom Presets for Moody Photography", date: "June 18, 2026", excerpt: "Elevate your photography game with these stunning aesthetic Lightroom presets." },
  ];

  return (
    <div>
      <div className={styles.heroWrapper}>
        <div className="container">
          <section className={styles.hero}>
            <h1 className={styles.heroTitle}>Premium Digital Assets for Everyone</h1>
            <p className={styles.heroSubtitle}>
              Discover curated templates, courses, and tools. Built for quality, trusted by thousands.
            </p>
            <Link href="/products" className="btn-silver" style={{ marginTop: '1.5rem', display: 'inline-block' }}>
              Explore Products
            </Link>
          </section>
        </div>
      </div>

      <div className="container">
        <section id="products" className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Featured Products</h2>
            <Link href="/products" className={styles.viewAll}>View all</Link>
          </div>
          <ProductGrid products={featuredProducts} />
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Popular Right Now</h2>
            <Link href="/products" className={styles.viewAll}>View all</Link>
          </div>
          <ProductGrid products={popularProducts} />
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Recently Added</h2>
            <Link href="/products" className={styles.viewAll}>View all</Link>
          </div>
          <ProductGrid products={recentProducts} />
        </section>
        
        <WaitlistForm />

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Latest on the Blog</h2>
            <Link href="#blog" className={styles.viewAll}>Read all articles</Link>
          </div>
          <div className={styles.productGrid}>
            {blogPosts.map(post => (
              <div key={post.id} className={styles.productCard} style={{ background: 'var(--background)' }}>
                <div className={styles.productInfo}>
                  <p style={{ color: 'var(--muted-foreground)', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.5rem' }}>{post.date}</p>
                  <h3 className={styles.productTitle} style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>{post.title}</h3>
                  <p style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem' }}>
                    {post.excerpt}
                  </p>
                  <Link href={`#blog-${post.id}`} style={{ display: 'inline-block', marginTop: '1rem', color: 'var(--foreground)', fontWeight: 600, fontSize: '0.875rem' }}>Read More &rarr;</Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <footer className={styles.footerWrapper}>
        <div className={`container ${styles.footerContent}`}>
          <div className={styles.footerColumn}>
            <div className={styles.footerBrand}>KARTA.</div>
            <p style={{ color: 'var(--dark-muted-foreground)', fontSize: '0.875rem' }}>
              Premium digital assets for everyone.
            </p>
          </div>
          
          <div className={styles.footerColumn}>
            <div className={styles.footerHeading}>Pages</div>
            <div className={styles.footerLinks}>
              <Link href="#">About Us</Link>
              <Link href="#">Careers</Link>
              <Link href="#">Privacy Policy</Link>
              <Link href="#">Terms of Service</Link>
              <Link href="#">Contact</Link>
            </div>
          </div>

          <div className={styles.footerColumn}>
            <div className={styles.footerHeading}>Social Media</div>
            <div className={styles.footerLinks}>
              <Link href="#">Twitter / X</Link>
              <Link href="#">Instagram</Link>
              <Link href="#">LinkedIn</Link>
              <Link href="#">YouTube</Link>
            </div>
          </div>

          <div className={styles.footerColumn}>
            <div className={styles.footerHeading}>Sell on Karta</div>
            <div className={styles.footerLinks}>
              <Link href="/become-seller">Become a Seller</Link>
              <Link href="#">Seller Guide</Link>
              <Link href="#">Seller FAQ</Link>
              <Link href="#">Commission & Fees</Link>
              <Link href="#">Seller Login</Link>
            </div>
          </div>
        </div>
        
        <div className="container">
          <div className={styles.footerBottom}>
            &copy; 2026 Karta. A digital marketplace by Bright Commerce. Developed by ViteRank
          </div>
        </div>
      </footer>
    </div>
  );
}
