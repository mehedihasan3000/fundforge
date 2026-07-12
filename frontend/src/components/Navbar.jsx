"use client";

import Link from "next/link";
import { LogoGithub, Person, Xmark } from "@gravity-ui/icons";
import { useAuth } from "@/context/AuthContext";

const GITHUB_REPO = "https://github.com/your-username/fundforge";

export default function Navbar() {
  const { user, credits, logout } = useAuth();
  const isLoggedIn = !!user;

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold text-indigo-600 flex items-center gap-2">
              <span className="w-6 h-6 bg-indigo-600 rounded" />
              FundForge
            </Link>
            {!isLoggedIn && (
              <Link
                href="/explore"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Explore Campaigns
              </Link>
            )}
            {isLoggedIn && (
              <Link
                href={`/dashboard/${user.role || "supporter"}/home`}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Dashboard
              </Link>
            )}
          </div>

          <div className="flex items-center gap-4">
            <a
              href={GITHUB_REPO}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
            >
              <LogoGithub className="w-4 h-4" />
              Join as Developer
            </a>

            {isLoggedIn ? (
              <>
                <span className="text-sm font-medium text-green-600">
                  {credits} Credits
                </span>
                <div className="flex items-center gap-2">
                  <Person className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700">{user.name}</span>
                  <button
                    onClick={logout}
                    className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1"
                  >
                    <Xmark className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
