import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function OrdersAdminPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: true, products: true }
  });

  return (
    <div>
      <h1 className="text-3xl font-black mb-8">Orders</h1>
      
      {orders.length === 0 ? (
        <p className="text-gray-500">No orders found.</p>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="p-4 font-medium text-sm text-gray-500">Order ID</th>
                <th className="p-4 font-medium text-sm text-gray-500">Customer</th>
                <th className="p-4 font-medium text-sm text-gray-500">Amount</th>
                <th className="p-4 font-medium text-sm text-gray-500">Status</th>
                <th className="p-4 font-medium text-sm text-gray-500">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-xs font-mono text-gray-500">{order.id}</td>
                  <td className="p-4 font-medium">{order.user.email}</td>
                  <td className="p-4 font-bold text-black">${order.amount.toFixed(2)}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      order.status === 'SUCCESS' ? 'bg-green-50 text-green-700 border border-green-200' :
                      order.status === 'PENDING' ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' :
                      'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4 text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
