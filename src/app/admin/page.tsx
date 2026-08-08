import ExchangeRateAdmin from "./ExchangeRateAdmin";
import ActivityChart from "./ActivityChart";
import OrderStatusChart from "./OrderStatusChart";
import { Users, Package, ShoppingCart, DollarSign } from "lucide-react";

export const dynamic = "force-dynamic";

export default function AdminDashboard() {
  const stats = [
    { label: "Total Orders", value: "8052", icon: ShoppingCart, color: "text-[#3699FF]", bg: "bg-[#3699FF]/10", change: "+25%" },
    { label: "Total Revenue", value: "$6.2K", icon: DollarSign, color: "text-[#F64E60]", bg: "bg-[#F64E60]/10", change: "+15%" },
    { label: "New Users", value: "1.3K", icon: Users, color: "text-[#1BC5BD]", bg: "bg-[#1BC5BD]/10", change: "-10%" },
    { label: "Sold Items", value: "956", icon: Package, color: "text-[#FFA800]", bg: "bg-[#FFA800]/10", change: "-14%" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Top Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Activity Chart (Sales Overview) */}
        <div className="lg:col-span-2 bg-[#1E1E2D] rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] flex flex-col">
          <div className="p-5 flex items-center justify-between border-b border-[#2B2B40]">
            <h2 className="text-[15px] font-semibold text-white">Sales Overview</h2>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <span className="w-6 h-1.5 rounded-full bg-[#FFA800]"></span>
                <span className="text-[11px] text-[#6c7293]">Visits</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-1.5 rounded-full bg-[#3699FF]"></span>
                <span className="text-[11px] text-[#6c7293]">Sales</span>
              </div>
            </div>
          </div>
          <div className="flex-1 p-5 min-h-[300px]">
            <ActivityChart />
          </div>
        </div>

        {/* Order Status Bar Chart */}
        <div className="bg-[#1E1E2D] rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] flex flex-col">
          <div className="p-5 flex items-center justify-between border-b border-[#2B2B40]">
            <h2 className="text-[15px] font-semibold text-white">Order Status</h2>
          </div>
          <div className="flex-1 p-5">
            <OrderStatusChart />
          </div>
        </div>

      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-[#1E1E2D] p-5 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] flex flex-col justify-between group hover:-translate-y-1 transition-transform cursor-pointer">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-[12px] font-medium text-[#6c7293] mb-1">{stat.label}</h3>
                <p className="text-[22px] font-bold text-white leading-none">{stat.value}</p>
              </div>
              <div className={`p-2.5 rounded-lg ${stat.bg} ${stat.color}`}>
                <stat.icon size={20} />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex gap-1 h-6 items-end">
                {/* Fake mini-chart lines */}
                {[...Array(12)].map((_, i) => (
                  <div key={i} className={`w-1 rounded-t-sm ${stat.color.replace('text-', 'bg-')} opacity-80`} style={{ height: `${Math.random() * 100}%` }}></div>
                ))}
              </div>
              <span className={`text-[11px] font-bold ${stat.change.startsWith('+') ? 'text-[#1BC5BD]' : 'text-[#F64E60]'}`}>
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Row: Exchange Rates */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#1E1E2D] rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.1)]">
          <div className="p-5 border-b border-[#2B2B40] flex items-center gap-2">
            <h2 className="text-[15px] font-semibold text-white">Live Exchange Rates</h2>
          </div>
          <div className="p-5">
            <ExchangeRateAdmin />
          </div>
        </div>
      </div>

    </div>
  );
}
