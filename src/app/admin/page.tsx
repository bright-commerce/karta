import { prisma } from "@/lib/prisma";
import ExchangeRateAdmin from "./ExchangeRateAdmin";
import ActivityChart from "./ActivityChart";
import { Users, Package, ShoppingCart, MessageSquare, Activity, DollarSign, ArrowUpRight } from "lucide-react";
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
    { label: "Total Users", value: userCount, icon: Users, href: "/admin/users", color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Products", value: productCount, icon: Package, href: "/admin/products", color: "text-purple-500", bg: "bg-purple-500/10" },
    { label: "Orders", value: orderCount, icon: ShoppingCart, href: "/admin/orders", color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Unread Messages", value: unreadContacts, icon: MessageSquare, href: "/admin/contacts", color: "text-rose-500", bg: "bg-rose-500/10" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white">Dashboard Overview</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Here's a summary of what's happening today.</p>
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href} className="group relative bg-white dark:bg-[#111113] p-6 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-lg hover:shadow-indigo-500/5 hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={22} strokeWidth={2.5} />
              </div>
              <ArrowUpRight size={20} className="text-gray-300 dark:text-gray-600 group-hover:text-indigo-500 transition-colors" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{stat.label}</h3>
              <p className="text-4xl font-black tracking-tight text-gray-900 dark:text-white">{stat.value}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Activity Chart Area */}
        <div className="lg:col-span-2 bg-white dark:bg-[#111113] rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm flex flex-col">
          <div className="p-6 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="text-indigo-500" size={20} />
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent Activity</h2>
            </div>
            <select className="bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 text-sm rounded-lg px-3 py-1.5 text-gray-600 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
            </select>
          </div>
          <div className="flex-1 p-6 min-h-[300px]">
            <ActivityChart />
          </div>
        </div>
        
        {/* Exchange Rates Area */}
        <div className="bg-white dark:bg-[#111113] rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm flex flex-col">
          <div className="p-6 border-b border-gray-100 dark:border-white/5 flex items-center gap-2">
            <DollarSign className="text-emerald-500" size={20} />
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Exchange Rates</h2>
          </div>
          <div className="p-6 flex-1">
            <ExchangeRateAdmin />
          </div>
        </div>
        
      </div>
    </div>
  );
}
