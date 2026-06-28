import { prisma } from "@/lib/prisma";
import ExchangeRateAdmin from "./ExchangeRateAdmin";

export const dynamic = "force-dynamic";

export default async function AdminPanel() {
  const waitlist = await prisma.waitlist.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container" style={{ padding: '4rem 1rem' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '2rem' }}>Admin Dashboard</h1>
      
      <section>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem' }}>Seller Waitlist</h2>
        
        {waitlist.length === 0 ? (
          <p style={{ color: 'var(--muted-foreground)' }}>No sellers have joined the waitlist yet.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border)', background: 'var(--muted)' }}>
                  <th style={{ padding: '1rem' }}>Name</th>
                  <th style={{ padding: '1rem' }}>Business Name</th>
                  <th style={{ padding: '1rem' }}>Email</th>
                  <th style={{ padding: '1rem' }}>Date Joined</th>
                  <th style={{ padding: '1rem' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {waitlist.map((seller: any) => (
                  <tr key={seller.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '1rem' }}>{seller.name}</td>
                    <td style={{ padding: '1rem', fontWeight: 600 }}>{seller.businessName}</td>
                    <td style={{ padding: '1rem', color: 'var(--muted-foreground)' }}>{seller.email}</td>
                    <td style={{ padding: '1rem', color: 'var(--muted-foreground)' }}>
                      {new Date(seller.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ padding: '0.25rem 0.75rem', borderRadius: '999px', background: 'var(--foreground)', color: 'var(--background)', fontSize: '0.75rem', fontWeight: 600 }}>
                        {seller.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <ExchangeRateAdmin />
    </div>
  );
}
