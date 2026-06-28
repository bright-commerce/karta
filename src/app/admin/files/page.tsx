import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import UploadForm from "./UploadForm"; // Client component

export default async function AdminFilesPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/");
  }

  // Fetch all products to populate the dropdown
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="container" style={{ padding: '4rem 1rem', minHeight: '80vh' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>Admin File Manager</h1>
      <p style={{ color: 'var(--muted-foreground)', fontSize: '1.125rem', marginBottom: '3rem' }}>
        Upload digital files to Cloudflare R2 and link them to products.
      </p>

      <div style={{ background: 'var(--background)', padding: '2rem', border: '1px solid var(--border)', borderRadius: '1rem', maxWidth: '600px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem' }}>Upload New File</h2>
        <UploadForm products={products} />
      </div>

      <div style={{ marginTop: '4rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem' }}>Current Linkages</h2>
        <div style={{ display: 'grid', gap: '1rem' }}>
          {products.map(product => (
            <div key={product.id} style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>{product.title}</strong>
                <div style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', marginTop: '0.25rem' }}>
                  {product.fileUrl ? (
                    <span style={{ color: 'green' }}>Linked R2 Key: {product.fileUrl}</span>
                  ) : (
                    <span style={{ color: 'red' }}>No file linked yet</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
