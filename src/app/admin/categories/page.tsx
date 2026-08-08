import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function CategoriesAdminPage() {
  const products = await prisma.product.findMany();
  
  const categoryCounts = products.reduce((acc: any, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {});

  const categories = Object.keys(categoryCounts).map(cat => ({
    name: cat,
    count: categoryCounts[cat]
  })).sort((a, b) => b.count - a.count);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black">Categories</h1>
          <p className="text-sm text-gray-500 mt-1">Categories are created automatically when assigned to a product.</p>
        </div>
        <Link href="/admin/products/new" className="bg-[#3699FF] text-white px-4 py-2 rounded-lg font-medium text-sm hover:opacity-90">
          + Add Category
        </Link>
      </div>
      
      {categories.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No categories found.</p>
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
                <th className="p-4 font-medium text-sm text-gray-500 dark:text-gray-400">Category Name</th>
                <th className="p-4 font-medium text-sm text-gray-500 dark:text-gray-400">Total Products</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {categories.map((cat) => (
                <tr key={cat.name} className="hover:bg-gray-50 dark:bg-gray-950 transition-colors">
                  <td className="p-4 font-bold">{cat.name}</td>
                  <td className="p-4 text-gray-600 dark:text-gray-400">{cat.count} products</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
