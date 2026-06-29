import { prisma } from "@/lib/prisma";
import ProductDetailsClient from "./ProductDetailsClient";

export const dynamic = "force-dynamic";

export default async function ProductDetailsPage({ params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({
    where: { id: params.id }
  });

  if (!product) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', minHeight: '60vh', textAlign: 'center' }}>
        Product not found.
      </div>
    );
  }

  return <ProductDetailsClient product={product} />;
}
