"use client";

import { useState } from "react";
import styles from "./page.module.css";

import { useCurrency } from "@/context/CurrencyContext";

// Mock products
const featuredProducts = [
  { id: "1", title: "Ultimate UI Kit", price: 49, description: "A comprehensive UI kit for modern apps." },
  { id: "2", title: "Next.js Boilerplate", price: 99, description: "Start your SaaS in minutes." },
  { id: "3", title: "Figma Masterclass", price: 29, description: "Learn to design like a pro." },
];

const recentProducts = [
  { id: "4", title: "Notion Life OS", price: 19, description: "Organize your life efficiently." },
  { id: "5", title: "iOS App Icon Set", price: 15, description: "Beautiful icons for your next app." },
  { id: "6", title: "React Animations Guide", price: 39, description: "Master Framer Motion and Spring." },
  { id: "7", title: "Freelance Contract Template", price: 12, description: "Protect your freelance business." },
];

const popularProducts = [
  { id: "2", title: "Next.js Boilerplate", price: 99, description: "Start your SaaS in minutes." },
  { id: "1", title: "Ultimate UI Kit", price: 49, description: "A comprehensive UI kit for modern apps." },
  { id: "8", title: "Tailwind CSS Components", price: 59, description: "Over 500+ premium components." },
];

export default function Home() {
  const { formatPrice, isLoading } = useCurrency();
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
      {products.map((product) => (
        <div key={product.id} className={styles.productCard}>
          <div className={styles.productImage}></div>
          <div className={styles.productInfo}>
            <h3 className={styles.productTitle}>{product.title}</h3>
            <p style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem' }}>
              {product.description}
            </p>
            <div className={styles.productPrice}>
              <span style={{ opacity: isLoading ? 0.5 : 1 }}>{formatPrice(product.price)}</span>
              <button className={styles.buyBtn}>Buy Now</button>
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
            <h1 className={styles.heroTitle}>Premium Digital Assets for Creators</h1>
            <p className={styles.heroSubtitle}>
              Discover curated templates, courses, and tools. Built for quality, trusted by thousands.
            </p>
            <a href="#products" className="btn-silver" style={{ marginTop: '1.5rem' }}>
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


      </div>

      <footer className={styles.footerWrapper}>
        <div className={`container ${styles.footerContent}`}>
          <div className={styles.footerColumn}>
            <div className={styles.footerBrand}>KARTA.</div>
            <p style={{ color: 'var(--dark-muted-foreground)', fontSize: '0.875rem' }}>
              Premium digital assets for modern creators.
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
