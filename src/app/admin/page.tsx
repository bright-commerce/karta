import { prisma } from "@/lib/prisma";
import ExchangeRateAdmin from "./ExchangeRateAdmin";
import { Users, Package, ShoppingCart, MessageSquare, TrendingUp, Activity, CreditCard, DollarSign } from "lucide-react";
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
    { label: "Total Users", value: userCount, icon: Users, href: "/admin/users", color: "from-blue-500 to-cyan-400" },
    { label: "Products", value: productCount, icon: Package, href: "/admin/products", color: "from-purple-500 to-indigo-500" },
    { label: "Orders", value: orderCount, icon: ShoppingCart, href: "/admin/orders", color: "from-emerald-400 to-teal-500" },
    { label: "Unread Messages", value: unreadContacts, icon: MessageSquare, href: "/admin/contacts", color: "from-orange-400 to-rose-400" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Welcome back. Here's what's happening today.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href} className="group relative bg-white dark:bg-[#111113] p-6 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 overflow-hidden">
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-500`}></div>
            
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-lg`}>
                <stat.icon size={22} className="opacity-90" />
              </div>
            </div>
            
            <div>
              <p className="text-4xl font-black text-gray-900 dark:text-white mb-1">{stat.value}</p>
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{stat.label}</h3>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-[#111113] p-6 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <Activity className="text-indigo-500" size={20} />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Activity</h2>
          </div>
          <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-100 dark:border-white/5 rounded-xl">
            <p className="text-gray-400 font-medium">Activity chart will appear here</p>
          </div>
        </div>
        
        <div className="bg-white dark:bg-[#111113] p-6 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <DollarSign className="text-emerald-500" size={20} />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Exchange Rates</h2>
          </div>
          <ExchangeRateAdmin />
        </div>
      </div>
    </div>
  );
}
