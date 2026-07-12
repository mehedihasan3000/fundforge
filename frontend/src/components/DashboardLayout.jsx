"use client";

import Link from "next/link";
import { Person, Xmark, LogoGithub, CreditCard, Wallet, ChartLine, Plus, Eye, Gear, Trash, CircleCheck, CircleXmark, Bell } from "@gravity-ui/icons";
import { useAuth } from "@/context/AuthContext";

const GITHUB_REPO = "https://github.com/your-username/fundforge";

export default function DashboardLayout({ children }) {
  const { user, credits, logout } = useAuth();
  const role = user?.role || "supporter";
  const navItems = getNavItems(role);

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-64 bg-white border-r flex flex-col">
        <div className="p-4 border-b">
          <Link href="/" className="text-xl font-bold text-indigo-600">
            FundForge
          </Link>
        </div>

        <div className="flex items-center gap-3 px-4 py-3 border-b">
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-sm font-medium text-indigo-600">
            <Person className="w-4 h-4" />
          </div>
          <div>
            <p className="text-sm font-medium">{user?.name || "User"}</p>
            <p className="text-xs text-gray-500 capitalize">{role}</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2 px-3 py-2 text-sm rounded-md text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t space-y-2">
          <p className="text-sm text-gray-600 flex items-center gap-2">
            <Wallet className="w-4 h-4 text-green-600" />
            Credits: <span className="font-semibold text-green-600">{credits}</span>
          </p>
          <a
            href={GITHUB_REPO}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
          >
            <LogoGithub className="w-4 h-4" />
            Join as Developer
          </a>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b px-6 py-3 flex items-center justify-end gap-4">
          <Bell className="w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-700" />
          <button
            onClick={logout}
            className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1"
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
