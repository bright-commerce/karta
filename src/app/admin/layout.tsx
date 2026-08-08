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
    { name: "Blog", href: "/admin/blog", icon: FileText },
    { name: "Downloads", href: "/admin/files", icon: HardDriveDownload },
    { name: "Contacts", href: "/admin/contacts", icon: MessageSquare },
  ];

  return (
    <ThemeProvider>
      <div className="flex min-h-screen bg-[#F9FAFB] dark:bg-[#0A0A0B] text-gray-900 dark:text-gray-100 font-sans selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
        
        {/* Minimalist Sidebar */}
        <aside className="w-64 bg-white dark:bg-[#0A0A0B] border-r border-gray-200 dark:border-[#27272A] flex flex-col fixed inset-y-0 left-0 z-50">
          <div className="h-16 border-b border-gray-200 dark:border-[#27272A] flex items-center px-6 shrink-0">
            <Link href="/admin" className="text-lg font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
              <div className="w-6 h-6 bg-black dark:bg-white text-white dark:text-black rounded-md flex items-center justify-center">
                <span className="text-[10px] font-black">K</span>
              </div>
              Karta <span className="text-gray-500 font-normal">Admin</span>
            </Link>
          </div>
          
          <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-0.5 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-[#27272A]">
            <p className="px-2 text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">Overview</p>
            {navItems.map((item) => (
              <Link 
                key={item.name} 
                href={item.href}
                className="group flex items-center gap-3 px-2 py-2 rounded-md text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#18181B] transition-colors"
              >
                <item.icon size={16} className="shrink-0 text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors" />
                {item.name}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 ml-64 flex flex-col min-h-screen">
          
          {/* Minimalist Top Navbar */}
          <header className="h-16 bg-white dark:bg-[#0A0A0B] border-b border-gray-200 dark:border-[#27272A] sticky top-0 z-40 px-8 flex items-center justify-end gap-5 shrink-0">
            <button className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors relative">
              <Bell size={18} />
              <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-black dark:bg-white rounded-full"></span>
            </button>
            
            <div className="w-px h-4 bg-gray-200 dark:bg-[#27272A]"></div>
            
            <ThemeToggle />
            
            <div className="flex items-center gap-3 pl-2">
              <div className="text-right hidden sm:block">
                <p className="text-[13px] font-semibold text-gray-900 dark:text-white leading-tight">Administrator</p>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">{session.user.email}</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-[#18181B] border border-gray-200 dark:border-[#27272A] flex items-center justify-center font-bold text-[11px] text-black dark:text-white">
                AD
              </div>
              <a href="/api/auth/signout" className="ml-2 text-gray-400 hover:text-red-500 transition-colors">
                <LogOut size={16} />
              </a>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 p-8 lg:p-12 overflow-x-hidden">
            <div className="max-w-6xl mx-auto">
              {children}
            </div>
          </main>

        </div>
      </div>
    </ThemeProvider>
  );
}
