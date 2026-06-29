import { prisma } from "@/lib/prisma";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function ProductsAdminPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black">Products</h1>
        {/* Placeholder for future Add Product button */}
        <button className="bg-black text-white px-4 py-2 rounded-lg font-medium text-sm hover:opacity-90">
          + Add Product
        </button>
      </div>
      
      {products.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No products found.</p>
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
                <th className="p-4 font-medium text-sm text-gray-500 dark:text-gray-400">Product</th>
                <th className="p-4 font-medium text-sm text-gray-500 dark:text-gray-400">Category</th>
                <th className="p-4 font-medium text-sm text-gray-500 dark:text-gray-400">Price</th>
                <th className="p-4 font-medium text-sm text-gray-500 dark:text-gray-400">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 dark:bg-gray-950 transition-colors">
                  <td className="p-4 flex items-center gap-4">
                    {product.imageUrl ? (
                      <div className="w-12 h-12 rounded bg-gray-100 dark:bg-gray-800 overflow-hidden relative flex-shrink-0">
                        <Image src={product.imageUrl} alt={product.title} fill className="object-cover" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded bg-gray-200 flex-shrink-0" />
                    )}
                    <div>
                      <p className="font-bold">{product.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate w-48">{product.id}</p>
                    </div>
                  </td>
                  <td className="p-4 text-gray-600 dark:text-gray-400">{product.category}</td>
                  <td className="p-4 font-semibold">${product.price.toFixed(2)}</td>
                  <td className="p-4">
                    {product.isActive ? (
                      <span className="text-green-600 bg-green-50 px-2 py-1 rounded text-xs font-bold border border-green-200">ACTIVE</span>
                    ) : (
                      <span className="text-red-600 bg-red-50 px-2 py-1 rounded text-xs font-bold border border-red-200">INACTIVE</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
