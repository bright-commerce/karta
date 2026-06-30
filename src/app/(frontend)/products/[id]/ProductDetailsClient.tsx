"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCurrency } from "@/context/CurrencyContext";
import { useStore } from "@/context/StoreContext";

export default function ProductDetailsClient({ product }: { product: any }) {
  const router = useRouter();
  const { formatPrice, isLoading } = useCurrency();
  const { cart, wishlist, addToCart, removeFromCart, toggleWishlist } = useStore();
  
  // Use imageUrl as array fallback
  const images = product.images?.length > 0 ? product.images : (product.imageUrl ? [product.imageUrl] : []);
  const [selectedImage, setSelectedImage] = useState(0);

  const inCart = cart.includes(product.id);
  const inWishlist = wishlist.includes(product.id);

  return (
    <div className="container" style={{ padding: '4rem 1rem', minHeight: '80vh' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem' }}>
        
        {/* Left: Images */}
        <div>
          <div style={{ width: '100%', aspectRatio: '16/10', background: 'var(--muted)', borderRadius: '1rem', overflow: 'hidden', marginBottom: '1rem' }}>
            {images.length > 0 && <img src={images[selectedImage]} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
          </div>
          {images.length > 1 && (
            <div style={{ display: 'flex', gap: '1rem' }}>
              {images.map((img: string, idx: number) => (
                <div 
                  key={idx} 
                  onClick={() => setSelectedImage(idx)}
                  style={{ 
                    width: '80px', height: '50px', background: 'var(--muted)', borderRadius: '0.5rem', cursor: 'pointer', overflow: 'hidden',
                    border: selectedImage === idx ? '2px solid var(--foreground)' : '2px solid transparent'
                  }}
                >
                  <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{product.category}</span>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginTop: '0.5rem' }}>{product.title}</h1>
          </div>
          
          <div style={{ fontSize: '2rem', fontWeight: 700, opacity: isLoading ? 0.5 : 1 }}>
            {formatPrice(product.price)}
          </div>

          <p style={{ color: 'var(--muted-foreground)', lineHeight: 1.6, fontSize: '1.125rem' }}>
            {product.description}
          </p>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button 
              className="btn-silver" 
              style={{ flex: 1, textAlign: 'center' }}
              onClick={() => router.push(`/checkout?productId=${product.id}`)}
            >
              Buy Now
            </button>
            <button 
              className="btn-primary" 
              style={{ flex: 1, background: inCart ? 'var(--foreground)' : 'var(--muted)', color: inCart ? 'var(--background)' : 'var(--foreground)', border: '1px solid var(--border)' }}
              onClick={() => inCart ? removeFromCart(product.id) : addToCart(product.id)}
            >
              {inCart ? 'Remove from Cart' : 'Add to Cart'}
            </button>
            <button 
              style={{ padding: '0 1.5rem', border: '1px solid var(--border)', borderRadius: '0.75rem', background: inWishlist ? 'var(--foreground)' : 'transparent', color: inWishlist ? 'var(--background)' : 'var(--foreground)', cursor: 'pointer', transition: 'all 0.2s' }}
              onClick={() => toggleWishlist(product.id)}
              title="Toggle Wishlist"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill={inWishlist ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
            </button>
          </div>
          
          <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border)', paddingTop: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Product Details</h3>
            <ul style={{ color: 'var(--muted-foreground)', lineHeight: 1.8, listStylePosition: 'inside' }}>
              <li>Instant Download link upon purchase</li>
              <li>Lifetime access to updates</li>
              <li>Verified by Bright Commerce</li>
              <li>Secure 256-bit SSL encrypted checkout</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
