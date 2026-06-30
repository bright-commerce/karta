import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function CheckoutStatusPage({
  searchParams,
}: {
  searchParams: { order_id?: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  const orderId = searchParams.order_id;
  if (!orderId) {
    return <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>Invalid Order ID</div>;
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { products: true, user: true },
  });

  if (!order) {
    return <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>Order not found</div>;
  }

  if (order.user.email !== session.user.email) {
    return <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>Unauthorized access to this order</div>;
  }

  // Update order status to SUCCESS since we're mocking cashfree. In a real world, this would be updated by the webhook.
  if (process.env.CASHFREE_APP_ID === "mock_app_id" && order.status === "PENDING") {
    await prisma.order.update({
      where: { id: orderId },
      data: { status: "SUCCESS" }
    });
    order.status = "SUCCESS";
  }

  return (
    <div className="container" style={{ padding: '4rem 1rem', minHeight: '80vh', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ background: 'var(--muted)', padding: '3rem', borderRadius: '1rem', textAlign: 'center' }}>
        <div style={{ width: '64px', height: '64px', background: 'var(--foreground)', color: 'var(--background)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
        </div>
        
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>Payment Successful!</h1>
        <p style={{ color: 'var(--muted-foreground)', fontSize: '1.125rem', marginBottom: '2rem' }}>
          Thank you for your purchase. Your digital products are ready for download.
        </p>

        <div style={{ textAlign: 'left', background: 'var(--background)', padding: '2rem', borderRadius: '0.75rem', border: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>Your Downloads</h2>
          
          <div style={{ display: 'grid', gap: '1rem' }}>
            {order.products.map((product: any) => (
              <div key={product.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', border: '1px solid var(--border)', borderRadius: '0.5rem' }}>
                <div>
                  <h3 style={{ fontWeight: 600 }}>{product.title}</h3>
                </div>
                <a 
                  href={`/api/download?productId=${product.id}&orderId=${order.id}`}
                  className="btn-silver"
                  style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                >
                  Download Asset
                </a>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: '3rem' }}>
          <Link href="/" style={{ color: 'var(--foreground)', textDecoration: 'underline', fontWeight: 500 }}>
            Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
