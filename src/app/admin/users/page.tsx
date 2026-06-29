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
        <p className="text-gray-500 dark:text-gray-400">No users found.</p>
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
                <th className="p-4 font-medium text-sm text-gray-500 dark:text-gray-400">User ID</th>
                <th className="p-4 font-medium text-sm text-gray-500 dark:text-gray-400">Email</th>
                <th className="p-4 font-medium text-sm text-gray-500 dark:text-gray-400">Role</th>
                <th className="p-4 font-medium text-sm text-gray-500 dark:text-gray-400">Orders</th>
                <th className="p-4 font-medium text-sm text-gray-500 dark:text-gray-400">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 dark:bg-gray-950 transition-colors">
                  <td className="p-4 text-xs font-mono text-gray-500 dark:text-gray-400">{user.id}</td>
                  <td className="p-4 font-medium">{user.email}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-bold">
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4 font-semibold">{user._count.orders}</td>
                  <td className="p-4 text-gray-500 dark:text-gray-400">{new Date(user.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
