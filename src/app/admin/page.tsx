import { prisma } from "@/lib/prisma";
import ExchangeRateAdmin from "./ExchangeRateAdmin";
import { Users, Package, ShoppingCart, MessageSquare } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminPanel() {
  const [userCount, productCount, orderCount, unreadContacts] = await Promise.all([
    prisma.user.count(),
    prisma.product.count(),
    prisma.order.count(),
    prisma.contactSubmission.count({ where: { status: "UNREAD" } })
  ]);

  const stats = [
    { label: "Total Users", value: userCount, icon: Users, href: "/admin/users" },
    { label: "Products", value: productCount, icon: Package, href: "/admin/products" },
    { label: "Orders", value: orderCount, icon: ShoppingCart, href: "/admin/orders" },
    { label: "Unread Messages", value: unreadContacts, icon: MessageSquare, href: "/admin/contacts" },
  ];

  return (
    <div>
      <h1 className="text-3xl font-black mb-8">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-500 font-medium">{stat.label}</h3>
              <div className="p-2 bg-gray-50 rounded-lg text-gray-700">
                <stat.icon size={20} />
              </div>
            </div>
            <p className="text-3xl font-bold">{stat.value}</p>
          </Link>
        ))}
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <ExchangeRateAdmin />
      </div>
    </div>
  );
}
