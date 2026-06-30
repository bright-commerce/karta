"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCurrency } from "@/context/CurrencyContext";
import { useStore } from "@/context/StoreContext";
import styles from "../app/(frontend)/page.module.css";

export default function ProductGrid({ products }: { products: any[] }) {
  const { formatPrice, isLoading } = useCurrency();
  const { cart, wishlist, addToCart, removeFromCart, toggleWishlist } = useStore();
  const router = useRouter();

  return (
    <div className={styles.productGrid}>
      {products.map((product: any) => (
        <div key={product.id} className={styles.productCard}>
          <Link href={`/products/${product.id}`} style={{ display: 'block' }}>
            <div className={styles.productImage}>
               {product.imageUrl && <img src={product.imageUrl} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
               {!product.imageUrl && product.images && product.images.length > 0 && <img src={product.images[0]} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
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
}
