import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function MyFilesPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  // Fetch all successful orders for this user
  const orders = await prisma.order.findMany({
    where: { 
      userId: session.user.id,
      status: "SUCCESS" // only show paid files
    },
    include: { products: true },
    orderBy: { createdAt: 'desc' }
  });

  // Flatten the products into a unique list
  // A user might have bought the same product in multiple orders, we can just show it once
  // or show all purchased instances. Let's show all distinct products.
  const purchasedProducts = new Map();
  orders.forEach((order: any) => {
    order.products.forEach((product: any) => {
      if (!purchasedProducts.has(product.id)) {
        purchasedProducts.set(product.id, {
          product,
          orderId: order.id, // we just need one valid orderId to authorize the download
          purchasedAt: order.createdAt
        });
      }
    });
  });

  const files = Array.from(purchasedProducts.values());

  return (
    <div className="container" style={{ padding: '4rem 1rem', minHeight: '80vh' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>My Files</h1>
      <p style={{ color: 'var(--muted-foreground)', fontSize: '1.125rem', marginBottom: '3rem' }}>
        Access all your purchased digital products here. You retain lifetime access to these files.
      </p>

      {files.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', background: 'var(--muted)', borderRadius: '1rem' }}>
          <p style={{ fontSize: '1.25rem', color: 'var(--muted-foreground)', marginBottom: '1.5rem' }}>You haven't purchased any files yet.</p>
          <Link href="/products" className="btn-primary" style={{ textDecoration: 'none' }}>Explore Products</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
          {files.map(({ product, orderId, purchasedAt }) => (
            <div key={product.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', border: '1px solid var(--border)', borderRadius: '1rem', background: 'var(--background)' }}>
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                <div style={{ width: '100px', height: '100px', background: 'var(--muted)', borderRadius: '0.5rem', overflow: 'hidden' }}>
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted-foreground)' }}>
                      No Image
                    </div>
                  )}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.25rem' }}>{product.title}</h3>
                  <p style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem' }}>Purchased on {new Date(purchasedAt).toLocaleDateString()}</p>
                </div>
              </div>
              <a 
                href={`/api/download?productId=${product.id}&orderId=${orderId}`}
                className="btn-silver"
                style={{ padding: '0.75rem 1.5rem', fontSize: '0.875rem', textDecoration: 'none' }}
              >
                Download File
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
