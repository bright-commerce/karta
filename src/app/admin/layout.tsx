import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Package, 
  Tags, 
  ShoppingCart, 
  Users, 
  UserPlus, 
  FileText, 
  HardDriveDownload, 
  MessageSquare,
  LogOut,
  Bell
} from "lucide-react";

import { ThemeProvider } from "./ThemeProvider";
import { ThemeToggle } from "./ThemeToggle";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== "ADMIN") {
    redirect("/login");
  }

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Products", href: "/admin/products", icon: Package },
    { name: "Categories", href: "/admin/categories", icon: Tags },
    { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Sellers", href: "/admin/sellers", icon: UserPlus },
    { name: "Blog Posts", href: "/admin/blog", icon: FileText },
    { name: "Downloads", href: "/admin/files", icon: HardDriveDownload },
    { name: "Contacts", href: "/admin/contacts", icon: MessageSquare },
  ];

  return (
    <ThemeProvider>
      <div className="flex min-h-screen bg-slate-50 dark:bg-[#0a0a0a] text-gray-900 dark:text-gray-100 font-sans selection:bg-indigo-500 selection:text-white">
        
        {/* Sidebar */}
        <aside className="w-64 bg-white dark:bg-[#111113] border-r border-gray-200 dark:border-white/5 flex flex-col fixed inset-y-0 left-0 z-50">
          <div className="h-20 border-b border-gray-100 dark:border-white/5 flex items-center px-6 shrink-0">
            <Link href="/admin" className="text-xl font-black tracking-tight text-gray-900 dark:text-white flex items-center gap-2 group">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-600/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                <span className="text-white text-sm font-bold">K</span>
              </div>
              KARTA<span className="text-indigo-600 dark:text-indigo-500">ADMIN</span>
            </Link>
          </div>
          
          <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-white/10">
            <p className="px-3 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">Menu</p>
            {navItems.map((item) => (
              <Link 
                key={item.name} 
                href={item.href}
                className="group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-all duration-200"
              >
                <item.icon size={18} className="transition-transform group-hover:scale-110 shrink-0 opacity-70 group-hover:opacity-100" />
                {item.name}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 ml-64 flex flex-col min-h-screen">
          
          {/* Top Navbar */}
          <header className="h-20 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-gray-200 dark:border-white/5 sticky top-0 z-40 px-8 flex items-center justify-end gap-6 shrink-0">
            
            <button className="text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors relative">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full border border-white dark:border-[#0a0a0a]"></span>
            </button>
            
            <div className="w-px h-6 bg-gray-200 dark:bg-white/10"></div>
            
            <ThemeToggle />
            
            <div className="flex items-center gap-3 pl-2">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-gray-900 dark:text-white leading-none">Administrator</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{session.user.email}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-sm border border-indigo-200 dark:border-indigo-500/30">
                AD
              </div>
              <a href="/api/auth/signout" className="ml-2 p-2 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors">
                <LogOut size={18} />
              </a>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 p-8 lg:p-12 overflow-x-hidden">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>

        </div>
      </div>
    </ThemeProvider>
  );
}
