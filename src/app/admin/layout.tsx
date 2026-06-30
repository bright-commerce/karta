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
  LogOut
} from "lucide-react";
import "./admin.css";
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
      <div className="flex min-h-screen bg-[#f3f4f6] dark:bg-[#09090b] text-gray-900 dark:text-gray-100 font-sans selection:bg-indigo-500 selection:text-white">
        {/* Sidebar */}
        <aside className="w-72 bg-white/80 dark:bg-[#111113]/80 backdrop-blur-xl border-r border-gray-200 dark:border-white/5 flex flex-col fixed h-full transition-all z-50">
          <div className="p-8 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
            <Link href="/admin" className="text-2xl font-black tracking-tight text-gray-900 dark:text-white hover:opacity-80 flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-lg shadow-indigo-500/30 flex items-center justify-center">
                <span className="text-white text-sm font-bold">K</span>
              </div>
              KARTA<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">ADMIN</span>
            </Link>
          </div>
          
          <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1 scrollbar-hide">
            <p className="px-4 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4 mt-2">Main Menu</p>
            {navItems.map((item) => (
              <Link 
                key={item.name} 
                href={item.href}
                className="group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-all duration-200"
              >
                <item.icon size={18} className="transition-transform group-hover:scale-110" />
                {item.name}
              </Link>
            ))}
          </nav>
          
          <div className="p-4 border-t border-gray-100 dark:border-white/5 flex justify-between items-center">
            <ThemeToggle />
            <Link href="/" className="p-2 rounded-lg text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors" title="Exit Admin">
              <LogOut size={18} />
            </Link>
          </div>

          <div className="p-6 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-black/20">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 text-white flex items-center justify-center font-bold text-sm shadow-md">
                AD
              </div>
              <div className="overflow-hidden flex-1">
                <p className="text-sm font-bold text-gray-900 dark:text-white">Administrator</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{session.user.email}</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 ml-72 p-8 lg:p-12 relative">
          {/* Subtle background glow */}
          <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-indigo-500/5 to-transparent dark:from-indigo-500/10 pointer-events-none -z-10"></div>
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
}
