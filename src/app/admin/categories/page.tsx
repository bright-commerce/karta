import { prisma } from "@/lib/prisma";

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
      <h1 className="text-3xl font-black mb-8">Categories</h1>
      
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
