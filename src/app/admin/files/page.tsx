import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import UploadForm from "./UploadForm"; // Client component
import AssetUploadForm from "./AssetUploadForm"; // Client component

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
      <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>Media & File Manager</h1>
      <p style={{ color: 'var(--muted-foreground)', fontSize: '1.125rem', marginBottom: '3rem' }}>
        Manage public assets (images/videos) and private digital product downloads using Cloudflare R2.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div style={{ background: 'var(--background)', padding: '2rem', border: '1px solid var(--border)', borderRadius: '1rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem' }}>1. Upload Public Asset</h2>
          <p style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Upload images or videos here to get a public URL for your blog posts and product images.</p>
          <AssetUploadForm />
        </div>

        <div style={{ background: 'var(--background)', padding: '2rem', border: '1px solid var(--border)', borderRadius: '1rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem' }}>2. Upload Secure Download</h2>
          <p style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Upload ZIP/PDF files and link them directly to a product for secure checkout delivery.</p>
          <UploadForm products={products} />
        </div>
      </div>

      <div style={{ marginTop: '4rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem' }}>Current Linkages</h2>
        <div style={{ display: 'grid', gap: '1rem' }}>
          {products.map((product: any) => (
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
