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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Dashboard Overview</h1>
          <p className="text-[13px] text-gray-500 mt-1">Here's a summary of what's happening today.</p>
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href} className="group bg-white dark:bg-[#0A0A0B] p-5 border border-gray-200 dark:border-[#27272A] rounded-lg hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="text-gray-500 dark:text-gray-400">
                <stat.icon size={18} />
              </div>
              <ArrowUpRight size={16} className="text-gray-300 dark:text-gray-600 group-hover:text-black dark:group-hover:text-white transition-colors" />
            </div>
            <div>
              <p className="text-[28px] font-bold tracking-tight text-gray-900 dark:text-white leading-none mb-1.5">{stat.value}</p>
              <h3 className="text-[12px] font-medium text-gray-500 dark:text-gray-400">{stat.label}</h3>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Activity Chart Area */}
        <div className="lg:col-span-2 bg-white dark:bg-[#0A0A0B] border border-gray-200 dark:border-[#27272A] rounded-lg flex flex-col">
          <div className="p-5 border-b border-gray-200 dark:border-[#27272A] flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-900 dark:text-white">
              <Activity size={16} />
              <h2 className="text-[14px] font-bold">Recent Activity</h2>
            </div>
            <select className="bg-transparent border border-gray-200 dark:border-[#27272A] text-[12px] rounded px-2 py-1 text-gray-600 dark:text-gray-300 focus:outline-none focus:border-gray-400 dark:focus:border-gray-500">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
            </select>
          </div>
          <div className="flex-1 p-6 min-h-[300px]">
            <ActivityChart />
          </div>
        </div>
        
        {/* Exchange Rates Area */}
        <div className="bg-white dark:bg-[#0A0A0B] border border-gray-200 dark:border-[#27272A] rounded-lg flex flex-col">
          <div className="p-5 border-b border-gray-200 dark:border-[#27272A] flex items-center gap-2 text-gray-900 dark:text-white">
            <DollarSign size={16} />
            <h2 className="text-[14px] font-bold">Exchange Rates</h2>
          </div>
          <div className="p-5 flex-1">
            <ExchangeRateAdmin />
          </div>
        </div>
        
      </div>
    </div>
  );
}
