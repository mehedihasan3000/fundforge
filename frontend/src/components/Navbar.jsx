"use client";

import { useState } from "react";
import Link from "next/link";
import { LogoGithub, Person, Xmark, Bars } from "@gravity-ui/icons";
import { useAuth } from "@/context/AuthContext";

const GITHUB_REPO = "https://github.com/your-username/fundforge";

export default function Navbar() {
  const { user, credits, logout } = useAuth();
  const isLoggedIn = !!user;
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-gray-100 shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side */}
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold text-indigo-600 flex items-center gap-2 shrink-0">
              <span className="w-6 h-6 bg-indigo-600 rounded" />
              FundForge
            </Link>
            <div className="hidden md:flex items-center gap-8">
              {!isLoggedIn && (
                <Link href="/explore" className="text-sm text-gray-600 hover:text-gray-900">
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
          </div>

          {/* Right side - desktop */}
          <div className="hidden md:flex items-center gap-4">
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
                <span className="text-sm font-medium text-green-600">{credits} Credits</span>
                <div className="flex items-center gap-2">
                  <Person className="w-4 h-4 text-gray-500 shrink-0" />
                  <span className="text-sm text-gray-700 truncate max-w-[100px]">{user.name}</span>
                  <button onClick={logout} className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1">
                    <Xmark className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900">
                  Login
                </Link>
                <Link href="/register" className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-gray-600 hover:text-gray-900"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <Xmark className="w-6 h-6" /> : <Bars className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t bg-white px-4 py-4 space-y-3">
          {isLoggedIn ? (
            <Link
              href={`/dashboard/${user.role || "supporter"}/home`}
              className="block text-sm text-gray-600 hover:text-gray-900 py-1"
              onClick={() => setMenuOpen(false)}
            >
              Dashboard
            </Link>
          ) : (
            <Link
              href="/explore"
              className="block text-sm text-gray-600 hover:text-gray-900 py-1"
              onClick={() => setMenuOpen(false)}
            >
              Explore Campaigns
            </Link>
          )}

          <a
            href={GITHUB_REPO}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 py-1"
            onClick={() => setMenuOpen(false)}
          >
            <LogoGithub className="w-4 h-4" />
            Join as Developer
          </a>

          {isLoggedIn ? (
            <div className="border-t pt-3 space-y-3">
              <div className="flex items-center gap-2">
                <Person className="w-4 h-4 text-gray-500 shrink-0" />
                <span className="text-sm text-gray-700 truncate">{user.name}</span>
                <span className="text-sm font-medium text-green-600 ml-auto">{credits} Credits</span>
              </div>
              <button
                onClick={() => { logout(); setMenuOpen(false); }}
                className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700 py-1"
              >
                <Xmark className="w-4 h-4" />
                Logout
              </button>
            </div>
          ) : (
            <div className="border-t pt-3 flex flex-col gap-2">
              <Link
                href="/login"
                className="text-sm text-gray-600 hover:text-gray-900 py-1"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                href="/register"
                className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 text-center"
                onClick={() => setMenuOpen(false)}
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
