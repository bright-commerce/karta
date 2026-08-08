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

import { prisma } from "@/lib/prisma";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== "ADMIN") {
    redirect("/login");
  }

  // Fetch unread notifications
  const unreadContacts = await prisma.contactSubmission.count({
    where: { status: "UNREAD" }
  });

  const userName = session.user?.name || "Admin";
  const userInitial = userName.charAt(0).toUpperCase();

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Products", href: "/admin/products", icon: Package },
    { name: "Categories", href: "/admin/categories", icon: Tags },
    { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Sellers", href: "/admin/sellers", icon: UserPlus },
    { name: "Blog", href: "/admin/blog", icon: FileText },
    { name: "Downloads", href: "/admin/files", icon: HardDriveDownload },
    { name: "Contacts", href: "/admin/contacts", icon: MessageSquare, badge: unreadContacts },
  ];

  return (
    <ThemeProvider>
      <div className="flex min-h-screen bg-gray-50 dark:bg-[#151521] text-gray-800 dark:text-gray-300 font-sans selection:bg-[#3699FF] selection:text-white transition-colors duration-200">
        
        {/* Sidebar */}
        <aside className="w-64 bg-white dark:bg-[#1E1E2D] flex flex-col fixed inset-y-0 left-0 z-50 shadow-[5px_0_15px_rgba(0,0,0,0.05)] dark:shadow-[5px_0_15px_rgba(0,0,0,0.15)] transition-colors duration-200 border-r border-gray-200 dark:border-transparent">
          <div className="h-16 flex items-center px-6 shrink-0 mt-2 mb-2">
            <Link href="/admin" className="text-xl font-bold tracking-wide text-gray-900 dark:text-white flex items-center gap-3">
              <div className="w-8 h-8 rounded-full border-2 border-gray-900 dark:border-white flex items-center justify-center">
                <span className="text-xs font-black">K</span>
              </div>
              Karta
            </Link>
          </div>
          
          <nav className="flex-1 overflow-y-auto py-4 px-4 space-y-1 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-[#323248] hover:scrollbar-thumb-gray-300 dark:hover:scrollbar-thumb-[#4A4A63] scrollbar-track-transparent">
            <p className="px-3 text-[11px] font-medium text-gray-500 dark:text-[#6c7293] uppercase tracking-wider mb-4 mt-2">Dashboard</p>
            {navItems.map((item) => (
              <Link 
                key={item.name} 
                href={item.href}
                className="group flex items-center justify-between px-3 py-2.5 rounded-md text-[13.5px] font-medium text-gray-600 dark:text-[#92929F] hover:text-[#3699FF] dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#1B1B29] transition-all"
              >
                <div className="flex items-center gap-3">
                  <item.icon size={18} className="shrink-0 text-gray-500 dark:text-[#92929F] group-hover:text-[#3699FF] dark:group-hover:text-white transition-colors" />
                  {item.name}
                </div>
                {item.badge && item.badge > 0 ? (
                  <span className="bg-[#F64E60] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{item.badge}</span>
                ) : null}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 ml-64 flex flex-col min-h-screen">
          
          {/* Top Navbar */}
          <header className="h-16 bg-white dark:bg-[#1E1E2D] sticky top-0 z-40 px-6 flex items-center justify-between shrink-0 shadow-[0_5px_15px_rgba(0,0,0,0.05)] dark:shadow-[0_5px_15px_rgba(0,0,0,0.15)] transition-colors duration-200 border-b border-gray-200 dark:border-transparent">
            
            {/* Left side (Search) */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 bg-gray-50 dark:bg-[#151521] px-4 py-2 rounded-md border border-gray-200 dark:border-[#2B2B40] text-gray-500 dark:text-[#92929F] focus-within:border-[#3699FF] dark:focus-within:border-[#3699FF] transition-colors w-64">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                <input type="text" placeholder="Search" className="bg-transparent border-none outline-none text-[13px] w-full placeholder-gray-400 dark:placeholder-[#6c7293] text-gray-900 dark:text-gray-100" />
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-4">
              <Link href="/admin/contacts" className="text-gray-400 dark:text-[#92929F] hover:text-[#3699FF] dark:hover:text-[#3699FF] transition-colors relative">
                <Bell size={18} />
                {unreadContacts > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#F64E60] rounded-full border border-white dark:border-[#1E1E2D]"></span>
                )}
              </Link>
              
              <ThemeToggle />
              
              <div className="flex items-center gap-3 ml-2 cursor-pointer group">
                <div className="w-8 h-8 rounded bg-[#3699FF] flex items-center justify-center font-bold text-[12px] text-white">
                  {userInitial}
                </div>
                <div className="hidden sm:block">
                  <p className="text-[13px] font-semibold text-gray-900 dark:text-white leading-tight group-hover:text-[#3699FF] transition-colors">{userName}</p>
                  <p className="text-[11px] text-gray-500 dark:text-[#92929F]">Administrator</p>
                </div>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 p-6 md:p-8 overflow-x-hidden">
            <div className="max-w-[1400px] mx-auto">
              {children}
            </div>
          </main>

        </div>
      </div>
    </ThemeProvider>
  );
}
