import Link from "next/link";
import { LogoLinkedin, LogoFacebook, LogoGithub } from "@gravity-ui/icons";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link href="/" className="text-xl font-bold text-white flex items-center gap-2">
            <span className="w-6 h-6 bg-indigo-500 rounded" />
            FundForge
          </Link>
          <div className="flex items-center gap-4">
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
              aria-label="LinkedIn"
            >
              <LogoLinkedin className="w-5 h-5" />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
              aria-label="Facebook"
            >
              <LogoFacebook className="w-5 h-5" />
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
              aria-label="GitHub"
            >
              <LogoGithub className="w-5 h-5" />
            </a>
          </div>
        </div>
        <p className="text-center text-sm text-gray-500 mt-6">
          &copy; {new Date().getFullYear()} FundForge. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
