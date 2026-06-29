"use client";

import { useStore } from "@/context/StoreContext";
import { useCurrency } from "@/context/CurrencyContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CartPage() {
  const { cart, removeFromCart } = useStore();
  const { formatPrice, isLoading } = useCurrency();
  const router = useRouter();

  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loadingItems, setLoadingItems] = useState(true);

  useEffect(() => {
    async function fetchCartProducts() {
      if (cart.length === 0) {
        setCartItems([]);
        setLoadingItems(false);
        return;
      }
      try {
        const res = await fetch(`/api/products?ids=${cart.join(",")}`);
        if (res.ok) {
          const data = await res.json();
          // Maintain cart order or just use data
          setCartItems(data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingItems(false);
      }
    }
    fetchCartProducts();
  }, [cart]);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price, 0);

  return (
    <div className="container" style={{ padding: '4rem 1rem', minHeight: '80vh' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '2rem' }}>Your Cart</h1>
      
      {loadingItems ? (
        <div style={{ textAlign: 'center', padding: '4rem', background: 'var(--muted)', borderRadius: '1rem' }}>
          <p style={{ fontSize: '1.25rem', color: 'var(--muted-foreground)' }}>Loading cart...</p>
        </div>
      ) : cartItems.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', background: 'var(--muted)', borderRadius: '1rem' }}>
          <p style={{ fontSize: '1.25rem', color: 'var(--muted-foreground)', marginBottom: '1.5rem' }}>Your cart is empty.</p>
          <button className="btn-primary" onClick={() => router.push('/products')}>Continue Shopping</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
          {/* Cart Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {cartItems.map((item) => (
              <div key={item.id} style={{ display: 'flex', gap: '1rem', padding: '1.5rem', border: '1px solid var(--border)', borderRadius: '1rem', background: 'var(--background)' }}>
                <div style={{ width: '120px', height: '80px', background: 'var(--muted)', borderRadius: '0.5rem', overflow: 'hidden' }}>
                   {item.imageUrl && <img src={item.imageUrl} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>{item.title}</h3>
                  <p style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem', marginTop: '0.25rem' }}>{item.category}</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                  <div style={{ fontWeight: 700, fontSize: '1.125rem', opacity: isLoading ? 0.5 : 1 }}>{formatPrice(item.price)}</div>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    style={{ color: 'red', fontSize: '0.875rem', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div style={{ background: 'var(--muted)', padding: '2rem', borderRadius: '1rem', height: 'fit-content' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>Order Summary</h2>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: 'var(--muted-foreground)' }}>
              <span>Subtotal ({cartItems.length} items)</span>
              <span style={{ opacity: isLoading ? 0.5 : 1 }}>{formatPrice(subtotal)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', color: 'var(--muted-foreground)' }}>
              <span>Taxes</span>
              <span>Calculated at checkout</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', fontWeight: 700, fontSize: '1.25rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
              <span>Total</span>
              <span style={{ opacity: isLoading ? 0.5 : 1 }}>{formatPrice(subtotal)}</span>
            </div>
            <button 
              className="btn-silver" 
              style={{ width: '100%' }}
              onClick={() => router.push('/checkout')}
            >
              Checkout Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
