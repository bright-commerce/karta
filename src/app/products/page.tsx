import styles from "../page.module.css";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ProductGrid from "@/components/ProductGrid";

export const dynamic = "force-dynamic";

const PRODUCTS_PER_PAGE = 15;

const CATEGORIES = [
  "AI Prompts",
  "Canva Templates",
  "Notion Templates",
  "n8n Automation Workflows",
  "Resume & CV Templates",
  "Social Media Kits",
  "Excel & Google Sheets",
  "Website Templates",
  "Lightroom Presets",
  "eBooks & Premium Guides"
];

export default async function ProductsPage({ searchParams }: { searchParams: { page?: string, category?: string } }) {
  const currentPage = parseInt(searchParams.page || "1");
  const selectedCategory = searchParams.category;

  const whereClause = selectedCategory ? { category: selectedCategory } : {};

  const totalProducts = await prisma.product.count({ where: whereClause });
  const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;

  const currentProducts = await prisma.product.findMany({
    where: whereClause,
    skip: startIndex,
    take: PRODUCTS_PER_PAGE,
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="container" style={{ padding: '4rem 1rem', minHeight: '80vh', display: 'flex', gap: '3rem' }}>
      
      {/* Sidebar Categories */}
      <aside style={{ width: '250px', flexShrink: 0 }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>Categories</h2>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <li>
            <Link 
              href="/products" 
              style={{ fontWeight: !selectedCategory ? 700 : 400, color: !selectedCategory ? 'var(--foreground)' : 'var(--muted-foreground)' }}
            >
              All Products
            </Link>
          </li>
          {CATEGORIES.map(cat => (
            <li key={cat}>
              <Link 
                href={`/products?category=${encodeURIComponent(cat)}`} 
                style={{ fontWeight: selectedCategory === cat ? 700 : 400, color: selectedCategory === cat ? 'var(--foreground)' : 'var(--muted-foreground)' }}
              >
                {cat}
              </Link>
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Content */}
      <div style={{ flex: 1 }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '2rem' }}>
          {selectedCategory ? selectedCategory : "All Products"}
        </h1>
        
        {currentProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--muted-foreground)' }}>
            No products found in this category.
          </div>
        ) : (
          <ProductGrid products={currentProducts} />
        )}

        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '4rem' }}>
            {currentPage > 1 ? (
              <Link href={`/products?page=${currentPage - 1}${selectedCategory ? `&category=${encodeURIComponent(selectedCategory)}` : ''}`} className="btn-outline">
                Previous
              </Link>
            ) : (
              <button disabled className="btn-outline" style={{ opacity: 0.5 }}>Previous</button>
            )}
            <span style={{ display: 'flex', alignItems: 'center', fontWeight: 600 }}>
              Page {currentPage} of {totalPages}
            </span>
            {currentPage < totalPages ? (
              <Link href={`/products?page=${currentPage + 1}${selectedCategory ? `&category=${encodeURIComponent(selectedCategory)}` : ''}`} className="btn-outline">
                Next
              </Link>
            ) : (
              <button disabled className="btn-outline" style={{ opacity: 0.5 }}>Next</button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
