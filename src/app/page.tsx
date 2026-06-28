"use client";

import { useState } from "react";
import styles from "./page.module.css";

import { useCurrency } from "@/context/CurrencyContext";
import { useStore } from "@/context/StoreContext";
import { useRouter } from "next/navigation";

import { mockProducts } from "@/data/products";
import Link from "next/link";

const featuredProducts = mockProducts.slice(0, 3);
const popularProducts = mockProducts.slice(3, 6);
const recentProducts = mockProducts.slice(6, 9);

const blogPosts = [
  { id: "1", title: "How to Monetize AI Prompts in 2026", date: "June 25, 2026", excerpt: "Discover the secrets of crafting and selling AI prompts on digital marketplaces." },
  { id: "2", title: "Why Notion Templates are the New Gold Rush", date: "June 21, 2026", excerpt: "Learn how creators are making a full-time income by selling Notion OS systems." },
  { id: "3", title: "Top 5 Lightroom Presets for Moody Photography", date: "June 18, 2026", excerpt: "Elevate your photography game with these stunning aesthetic Lightroom presets." },
];

export default function Home() {
  const { formatPrice, isLoading } = useCurrency();
  const { cart, wishlist, addToCart, removeFromCart, toggleWishlist } = useStore();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const joinWaitlist = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  };

  const renderProductGrid = (products: any[]) => (
    <div className={styles.productGrid}>
      {products.map((product: any) => (
        <div key={product.id} className={styles.productCard}>
          <Link href={`/products/${product.id}`} style={{ display: 'block' }}>
            <div className={styles.productImage}>
               {product.images && <img src={product.images[0]} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
            </div>
            <h3 className={styles.productTitle} style={{ padding: '0 1.5rem', paddingTop: '1.5rem' }}>{product.title}</h3>
          </Link>
          <div className={styles.productInfo} style={{ paddingTop: '0.5rem' }}>
            <p style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem' }}>
              {product.description}
            </p>
            <div className={styles.productPrice} style={{ marginBottom: '1rem' }}>
              <span style={{ opacity: isLoading ? 0.5 : 1 }}>{formatPrice(product.price)}</span>
            </div>
            <div className={styles.productActions}>
              <button 
                className={styles.wishlistBtn} 
                title="Add to Wishlist"
                onClick={() => toggleWishlist(product.id)}
                style={{ background: wishlist.includes(product.id) ? 'var(--foreground)' : '', color: wishlist.includes(product.id) ? 'var(--background)' : '' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill={wishlist.includes(product.id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
              </button>
              <button 
                className={styles.cartBtn} 
                title="Add to Cart"
                onClick={() => cart.includes(product.id) ? removeFromCart(product.id) : addToCart(product.id)}
                style={{ background: cart.includes(product.id) ? 'var(--foreground)' : '', color: cart.includes(product.id) ? 'var(--background)' : '' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill={cart.includes(product.id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
              </button>
              <button 
                className={styles.buyBtn} 
                onClick={() => router.push(`/checkout?productId=${product.id}`)}
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div>
      <div className={styles.heroWrapper}>
        <div className="container">
          <section className={styles.hero}>
            <h1 className={styles.heroTitle}>Premium Digital Assets for Everyone</h1>
            <p className={styles.heroSubtitle}>
              Discover curated templates, courses, and tools. Built for quality, trusted by thousands.
            </p>
            <a href="/products" className="btn-silver" style={{ marginTop: '1.5rem' }}>
              Explore Products
            </a>
          </section>
        </div>
      </div>

      <div className="container">
        <section id="products" className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Featured Products</h2>
            <a href="#featured" className={styles.viewAll}>View all</a>
          </div>
          {renderProductGrid(featuredProducts)}
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Popular Right Now</h2>
            <a href="#popular" className={styles.viewAll}>View all</a>
          </div>
          {renderProductGrid(popularProducts)}
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Recently Added</h2>
            <a href="#recent" className={styles.viewAll}>View all</a>
          </div>
          {renderProductGrid(recentProducts)}
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Latest on the Blog</h2>
            <a href="#blog" className={styles.viewAll}>Read all articles</a>
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
                  <a href={`#blog-${post.id}`} style={{ display: 'inline-block', marginTop: '1rem', color: 'var(--foreground)', fontWeight: 600, fontSize: '0.875rem' }}>Read More &rarr;</a>
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
              <a href="#">About Us</a>
              <a href="#">Careers</a>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Contact</a>
            </div>
          </div>

          <div className={styles.footerColumn}>
            <div className={styles.footerHeading}>Social Media</div>
            <div className={styles.footerLinks}>
              <a href="#">Twitter / X</a>
              <a href="#">Instagram</a>
              <a href="#">LinkedIn</a>
              <a href="#">YouTube</a>
            </div>
          </div>

          <div className={styles.footerColumn}>
            <div className={styles.footerHeading}>Sell on Karta</div>
            <div className={styles.footerLinks}>
              <a href="/become-seller">Become a Seller</a>
              <a href="#">Seller Guide</a>
              <a href="#">Seller FAQ</a>
              <a href="#">Commission & Fees</a>
              <a href="#">Seller Login</a>
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
