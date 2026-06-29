import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function SellersAdminPage() {
  const waitlist = await prisma.waitlist.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-3xl font-black mb-8">Seller Waitlist</h1>
      
      {waitlist.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No sellers have joined the waitlist yet.</p>
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
                <th className="p-4 font-medium text-sm text-gray-500 dark:text-gray-400">Name</th>
                <th className="p-4 font-medium text-sm text-gray-500 dark:text-gray-400">Business Name</th>
                <th className="p-4 font-medium text-sm text-gray-500 dark:text-gray-400">Email</th>
                <th className="p-4 font-medium text-sm text-gray-500 dark:text-gray-400">Date Joined</th>
                <th className="p-4 font-medium text-sm text-gray-500 dark:text-gray-400">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {waitlist.map((seller) => (
                <tr key={seller.id} className="hover:bg-gray-50 dark:bg-gray-950 transition-colors">
                  <td className="p-4">{seller.name}</td>
                  <td className="p-4 font-semibold">{seller.businessName}</td>
                  <td className="p-4 text-gray-500 dark:text-gray-400">{seller.email}</td>
                  <td className="p-4 text-gray-500 dark:text-gray-400">
                    {new Date(seller.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <span className="px-3 py-1 rounded-full bg-black text-white text-xs font-bold">
                      {seller.status}
                    </span>
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
