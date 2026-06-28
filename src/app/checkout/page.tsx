"use client";

import { useStore } from '@/context/StoreContext';
import { useCurrency } from '@/context/CurrencyContext';
import { mockProducts } from '@/data/products';
import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const { cart, clearCart } = useStore(); // Note: clearCart needs to be added to StoreContext
  const { formatPrice, isLoading: currencyLoading } = useCurrency();
  const { data: session, status } = useSession();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const cartItems = cart.map(id => mockProducts.find(p => p.id === id)).filter(Boolean) as typeof mockProducts;
  const subtotal = cartItems.reduce((acc, item) => acc + item.price, 0);

  useEffect(() => {
    if (status === 'authenticated') {
      setEmail(session.user?.email || '');
    }
  }, [status, session]);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsProcessing(true);

    if (cart.length === 0) {
      setError("Your cart is empty");
      setIsProcessing(false);
      return;
    }

    try {
      // 1. Frictionless Auth: Sign In or Auto-Create Account
      if (status !== 'authenticated') {
        const authRes = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        if (authRes?.error) {
          throw new Error(authRes.error);
        }
      }

      // 2. Process Checkout
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productIds: cart, email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Checkout failed");

      // Redirect to cashfree or handle mock session
      if (data.payment_session_id === "mock_session_id") {
        // Mock successful payment, clear cart and redirect to my-files
        clearCart();
        router.push(`/my-files`);
      } else {
        // Here you would initialize Cashfree JS SDK with the session ID
        alert("Redirecting to Cashfree Payment Gateway...");
        // window.location.href = data.redirect_url // depending on CF integration
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', minHeight: '60vh', textAlign: 'center' }}>
        <h2>Your cart is empty</h2>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '4rem 1rem', minHeight: '80vh' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2rem' }}>Secure Checkout</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '4rem' }}>
        {/* Left: Auth Form */}
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>Account Details</h2>
          <p style={{ color: 'var(--muted-foreground)', marginBottom: '2rem' }}>
            {status === 'authenticated' 
              ? `You are checking out as ${session.user?.email}` 
              : "Enter your details to create an account or login instantly. No email verification required."}
          </p>

          <form onSubmit={handleCheckout} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {status !== 'authenticated' && (
              <>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Email Address</label>
                  <input 
                    type="email" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)', background: 'var(--background)' }} 
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Password (Used to access downloads later)</label>
                  <input 
                    type="password" 
                    required 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)', background: 'var(--background)' }} 
                  />
                </div>
              </>
            )}

            {error && <div style={{ color: 'red', fontSize: '0.875rem', marginTop: '1rem' }}>{error}</div>}

            <button 
              type="submit" 
              className="btn-silver" 
              disabled={isProcessing}
              style={{ marginTop: '2rem' }}
            >
              {isProcessing ? 'Processing securely...' : `Pay ${formatPrice(subtotal)}`}
            </button>
            <p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', textAlign: 'center', marginTop: '1rem' }}>
              Secured by Cashfree Payments. 256-bit SSL encryption.
            </p>
          </form>
        </div>

        {/* Right: Order Summary */}
        <div style={{ background: 'var(--muted)', padding: '2rem', borderRadius: '1rem', height: 'fit-content' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>Order Summary</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
            {cartItems.map((item) => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 500, fontSize: '0.875rem' }}>{item.title}</span>
                <span style={{ fontSize: '0.875rem', opacity: currencyLoading ? 0.5 : 1 }}>{formatPrice(item.price)}</span>
              </div>
            ))}
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', fontWeight: 700, fontSize: '1.25rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
            <span>Total</span>
            <span style={{ opacity: currencyLoading ? 0.5 : 1 }}>{formatPrice(subtotal)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
