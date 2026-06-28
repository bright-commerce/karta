import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Premium Digital Marketplace",
  description: "The best place to buy and sell premium digital products.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header style={{ background: '#0a0a0a', borderBottom: '1px solid #333', position: 'sticky', top: 0, zIndex: 50 }}>
          <nav className="container" style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', color: '#ededed', alignItems: 'center' }}>
            <div style={{ fontWeight: '800', fontSize: '1.5rem', letterSpacing: '-0.025em', color: '#fff' }}>
              <a href="/" style={{ textDecoration: 'none', color: 'inherit' }}>KARTA.</a>
            </div>

            {/* Middle: Links */}
            <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
              <a href="/" style={{ fontSize: '0.875rem', fontWeight: 500, color: 'rgba(255, 255, 255, 0.8)', textDecoration: 'none' }}>Home</a>
              <a href="/#products" style={{ fontSize: '0.875rem', fontWeight: 500, color: 'rgba(255, 255, 255, 0.8)', textDecoration: 'none' }}>Explore</a>
              <a href="#" style={{ fontSize: '0.875rem', fontWeight: 500, color: 'rgba(255, 255, 255, 0.8)', textDecoration: 'none' }}>Categories</a>
              <a href="/become-seller" style={{ fontSize: '0.875rem', fontWeight: 500, color: 'rgba(255, 255, 255, 0.8)', textDecoration: 'none' }}>Become a Seller</a>
            </div>

            {/* Right: Icons and Login */}
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
              <a href="#" style={{ color: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center' }} title="Search">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              </a>
              <a href="#" style={{ color: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center' }} title="Wishlist">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
              </a>
              <a href="#" style={{ color: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center' }} title="Cart">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
              </a>
              <button style={{ padding: '0.5rem 1.25rem', fontSize: '0.875rem', background: '#fff', color: '#000', borderRadius: '2rem', fontWeight: 600, border: 'none', cursor: 'pointer' }}>Sign In</button>
            </div>
          </nav>
        </header>
        <main>
          <Providers>
            {children}
          </Providers>
        </main>
      </body>
    </html>
  );
}
