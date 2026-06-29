import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function UsersAdminPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { orders: true } } }
  });

  return (
    <div>
      <h1 className="text-3xl font-black mb-8">Registered Users</h1>
      
      {users.length === 0 ? (
        <p className="text-gray-500">No users found.</p>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="p-4 font-medium text-sm text-gray-500">User ID</th>
                <th className="p-4 font-medium text-sm text-gray-500">Email</th>
                <th className="p-4 font-medium text-sm text-gray-500">Role</th>
                <th className="p-4 font-medium text-sm text-gray-500">Orders</th>
                <th className="p-4 font-medium text-sm text-gray-500">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-xs font-mono text-gray-500">{user.id}</td>
                  <td className="p-4 font-medium">{user.email}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 rounded bg-gray-100 text-gray-700 text-xs font-bold">
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4 font-semibold">{user._count.orders}</td>
                  <td className="p-4 text-gray-500">{new Date(user.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
