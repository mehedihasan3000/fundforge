"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Person, Xmark, LogoGithub, CreditCard, Wallet, ChartLine, Plus, Eye, CircleCheck, CircleXmark, Bars } from "@gravity-ui/icons";
import { useAuth } from "@/context/AuthContext";
import NotificationPopup from "@/components/NotificationPopup";

const GITHUB_REPO = "https://github.com/mehedihasan3000/fundforge";

export default function DashboardLayout({ children }) {
  const { user, credits, logout, loading, refreshUser } = useAuth();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const onVisible = () => { if (!document.hidden) refreshUser(); };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user || !user.role) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Please log in to access the dashboard.</p>
          <Link href="/login" className="text-indigo-600 hover:text-indigo-800 font-semibold text-sm">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  const role = user.role;
  const navItems = getNavItems(role);

  return (
    <div className="flex h-screen bg-gray-50">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
      <aside className={`w-64 bg-white border-r flex flex-col shrink-0 fixed lg:static inset-y-0 left-0 z-40 transition-transform lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-4 border-b flex items-center gap-2">
          <span className="w-6 h-6 bg-indigo-600 rounded" />
          <Link href="/" className="text-lg font-bold text-indigo-600">
            FundForge
          </Link>
        </div>

        <div className="flex items-center gap-3 px-4 py-3 border-b">
          <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-sm font-medium text-indigo-600 overflow-hidden">
            {user?.image ? (
              <img src={user.image} alt="" className="w-full h-full object-cover" />
            ) : (
              <Person className="w-4 h-4" />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm text-gray-700 font-semibold truncate">{user?.name}</p>
            <p className="text-xs text-gray-500 capitalize">{role}</p>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 px-3 py-2.5 text-sm rounded-lg transition-colors ${
                  isActive
                    ? "bg-indigo-50 text-indigo-700 font-semibold"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <span className={isActive ? "text-indigo-600" : "text-gray-400"}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t space-y-3">
          <div className="flex items-center justify-between bg-green-50 rounded-lg px-3 py-2.5">
            <span className="text-sm text-gray-600">Credits</span>
            <span className="text-sm font-bold text-green-700">{credits}</span>
          </div>
          <a
            href={GITHUB_REPO}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            <LogoGithub className="w-3.5 h-3.5" />
            Join as Developer
          </a>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b px-4 lg:px-6 py-3 flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
            aria-label="Open sidebar"
          >
            <Bars className="w-5 h-5" />
          </button>
          <div className="flex-1" />
          <NotificationPopup />
          <button
            onClick={logout}
            className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
          >
            <Xmark className="w-4 h-4" />
            Logout
          </button>
        </header>
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}

function getNavItems(role) {
  const iconClass = "w-4 h-4";

  if (role === "supporter") {
    return [
      { label: "Home", href: "/dashboard/supporter/home", icon: <ChartLine className={iconClass} /> },
      { label: "Explore Campaigns", href: "/dashboard/supporter/explore", icon: <Eye className={iconClass} /> },
      { label: "My Contributions", href: "/dashboard/supporter/contributions", icon: <CreditCard className={iconClass} /> },
      { label: "Purchase Credits", href: "/dashboard/supporter/purchase-credits", icon: <Plus className={iconClass} /> },
      { label: "Payment History", href: "/dashboard/supporter/payment-history", icon: <Wallet className={iconClass} /> },
    ];
  }

  if (role === "creator") {
    return [
      { label: "Home", href: "/dashboard/creator/home", icon: <ChartLine className={iconClass} /> },
      { label: "Add New Campaign", href: "/dashboard/creator/add-campaign", icon: <Plus className={iconClass} /> },
      { label: "My Campaigns", href: "/dashboard/creator/my-campaigns", icon: <Eye className={iconClass} /> },
      { label: "Withdrawals", href: "/dashboard/creator/withdrawals", icon: <Wallet className={iconClass} /> },
      { label: "Payment History", href: "/dashboard/creator/payment-history", icon: <CreditCard className={iconClass} /> },
    ];
  }

  if (role === "admin") {
    return [
      { label: "Home", href: "/dashboard/admin/home", icon: <ChartLine className={iconClass} /> },
      { label: "Manage Users", href: "/dashboard/admin/manage-users", icon: <Person className={iconClass} /> },
      { label: "Manage Campaigns", href: "/dashboard/admin/manage-campaigns", icon: <Eye className={iconClass} /> },
      { label: "Withdrawal Requests", href: "/dashboard/admin/withdrawal-requests", icon: <CircleCheck className={iconClass} /> },
      { label: "Reports", href: "/dashboard/admin/reports", icon: <CircleXmark className={iconClass} /> },
    ];
  }

  return [];
}
