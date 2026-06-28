"use client";

import { useState } from "react";
import styles from "../page.module.css";
import { useCurrency } from "@/context/CurrencyContext";
import { useStore } from "@/context/StoreContext";
import { useRouter } from "next/navigation";

import { mockProducts } from "@/data/products";
import Link from "next/link";

const allProducts = mockProducts;

const PRODUCTS_PER_PAGE = 15;

export default function ProductsPage() {
  const { formatPrice, isLoading } = useCurrency();
  const { cart, wishlist, addToCart, removeFromCart, toggleWishlist } = useStore();
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(allProducts.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const currentProducts = allProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);

  return (
    <div className="container" style={{ padding: '4rem 1rem', minHeight: '80vh' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '2rem' }}>All Products</h1>
      
      <div className={styles.productGrid}>
        {currentProducts.map((product) => (
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

      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '4rem' }}>
          <button 
            disabled={currentPage === 1} 
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            className="btn-outline"
          >
            Previous
          </button>
          <span style={{ display: 'flex', alignItems: 'center', fontWeight: 600 }}>
            Page {currentPage} of {totalPages}
          </span>
          <button 
            disabled={currentPage === totalPages} 
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            className="btn-outline"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
