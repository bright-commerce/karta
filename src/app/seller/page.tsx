import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { DollarSign, ShoppingCart, Package } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SellerDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  // Placeholder for seller-specific stats
  // In a real app, products would have a sellerId to filter by
  
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-black text-white">Welcome back, {session.user.name}!</h1>
        <p className="text-gray-400 mt-1">Here is what's happening with your store today.</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
        <div className="bg-[#1E1E2D] p-5 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] flex flex-col justify-between">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-[12px] font-medium text-[#6c7293] mb-1">Total Sales</h3>
              <p className="text-[22px] font-bold text-white leading-none">$0.00</p>
            </div>
            <div className={`p-2.5 rounded-lg bg-[#3699FF]/10 text-[#3699FF]`}>
              <DollarSign size={20} />
            </div>
          </div>
        </div>

        <div className="bg-[#1E1E2D] p-5 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] flex flex-col justify-between">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-[12px] font-medium text-[#6c7293] mb-1">Orders</h3>
              <p className="text-[22px] font-bold text-white leading-none">0</p>
            </div>
            <div className={`p-2.5 rounded-lg bg-[#1BC5BD]/10 text-[#1BC5BD]`}>
              <ShoppingCart size={20} />
            </div>
          </div>
        </div>

        <div className="bg-[#1E1E2D] p-5 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] flex flex-col justify-between">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-[12px] font-medium text-[#6c7293] mb-1">Active Products</h3>
              <p className="text-[22px] font-bold text-white leading-none">0</p>
            </div>
            <div className={`p-2.5 rounded-lg bg-[#FFA800]/10 text-[#FFA800]`}>
              <Package size={20} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
