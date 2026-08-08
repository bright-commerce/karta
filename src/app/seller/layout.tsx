import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { Package, ShoppingCart, Settings, LogOut, LayoutDashboard } from "lucide-react";

export default async function SellerLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== "SELLER") {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[#151521] text-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1E1E2D] border-r border-[#2B2B40] flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-[#2B2B40]">
          <Link href="/" className="text-xl font-black text-white tracking-wider">
            SELLER PANEL
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white bg-[#3699FF]/10 text-[#3699FF]">
            <LayoutDashboard size={18} />
            Dashboard
          </Link>
          <Link href="/products" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-[#2B2B40] transition-colors">
            <Package size={18} />
            My Products
          </Link>
          <Link href="/orders" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-[#2B2B40] transition-colors">
            <ShoppingCart size={18} />
            Orders
          </Link>
          <Link href="/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-[#2B2B40] transition-colors">
            <Settings size={18} />
            Store Settings
          </Link>
        </nav>

        <div className="p-4 border-t border-[#2B2B40]">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center font-bold text-sm">
              {session.user.name?.[0]?.toUpperCase() || 'S'}
            </div>
            <div className="flex-1 truncate">
              <p className="text-sm font-medium text-white truncate">{session.user.name || 'Seller'}</p>
              <p className="text-xs text-gray-500 truncate">{session.user.email}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-[#1E1E2D] border-b border-[#2B2B40] flex items-center px-8 justify-between sticky top-0 z-10">
          <h2 className="text-sm font-medium text-gray-400">Seller Dashboard</h2>
          <Link href="/api/auth/signout" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
            <LogOut size={16} />
            Sign Out
          </Link>
        </header>
        <div className="flex-1 p-8 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
