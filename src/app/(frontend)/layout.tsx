import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { ShoppingCart, Search, Heart } from "lucide-react";

export default async function FrontendLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  return (
    <>
      <header style={{ background: '#0a0a0a', borderBottom: '1px solid #333', position: 'sticky', top: 0, zIndex: 50 }}>
        <nav className="container" style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', color: '#ededed', alignItems: 'center' }}>
          <div style={{ fontWeight: '800', fontSize: '1.5rem', letterSpacing: '-0.025em', color: '#fff' }}>
            <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>KARTA.</Link>
          </div>

          {/* Middle: Links */}
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
            <Link href="/" style={{ fontSize: '0.875rem', fontWeight: 500, color: 'rgba(255, 255, 255, 0.8)', textDecoration: 'none' }}>Home</Link>
            <Link href="/#products" style={{ fontSize: '0.875rem', fontWeight: 500, color: 'rgba(255, 255, 255, 0.8)', textDecoration: 'none' }}>Explore</Link>
            <Link href="/my-files" style={{ fontSize: '0.875rem', fontWeight: 500, color: 'rgba(255, 255, 255, 0.8)', textDecoration: 'none' }}>My Files</Link>
            <Link href="/become-seller" style={{ fontSize: '0.875rem', fontWeight: 500, color: 'rgba(255, 255, 255, 0.8)', textDecoration: 'none' }}>Become a Seller</Link>
          </div>

          {/* Right: Icons and Login */}
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <Link href="#" style={{ color: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center' }} title="Search">
              <Search size={20} />
            </Link>
            <Link href="#" style={{ color: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center' }} title="Wishlist">
              <Heart size={20} />
            </Link>
            <Link href="/cart" style={{ color: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center' }} title="Cart">
              <ShoppingCart size={20} />
            </Link>
            {session ? (
              <Link href="/my-files" style={{ padding: '0.5rem 1.25rem', fontSize: '0.875rem', background: '#fff', color: '#000', borderRadius: '2rem', fontWeight: 600, border: 'none', cursor: 'pointer', textDecoration: 'none' }}>Account</Link>
            ) : (
              <Link href="/login" style={{ padding: '0.5rem 1.25rem', fontSize: '0.875rem', background: '#fff', color: '#000', borderRadius: '2rem', fontWeight: 600, border: 'none', cursor: 'pointer', textDecoration: 'none' }}>Sign In</Link>
            )}
          </div>
        </nav>
      </header>
      <main>
        {children}
      </main>
    </>
  );
}
