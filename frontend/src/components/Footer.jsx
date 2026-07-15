import Link from "next/link";
import { LogoLinkedin, LogoFacebook, LogoGithub } from "@gravity-ui/icons";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="text-xl font-bold text-white flex items-center gap-2 mb-4">
              <span className="w-6 h-6 bg-indigo-500 rounded" />
              FundForge
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Empowering creators and supporters to bring ideas to life through community-driven funding.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Platform</h3>
            <ul className="space-y-2.5">
              <li><Link href="/explore" className="text-sm hover:text-white transition-colors">Explore Campaigns</Link></li>
              <li><Link href="/" className="text-sm hover:text-white transition-colors">How It Works</Link></li>
              <li><Link href="/" className="text-sm hover:text-white transition-colors">Top Funded</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Company</h3>
            <ul className="space-y-2.5">
              <li><Link href="#" className="text-sm hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="#" className="text-sm hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="#" className="text-sm hover:text-white transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Legal & Social */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Legal</h3>
            <ul className="space-y-2.5 mb-6">
              <li><Link href="#" className="text-sm hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="text-sm hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
            <div className="flex items-center gap-3">
              <a href="https://www.linkedin.com/in/mehedihasan3000" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="LinkedIn">
                <LogoLinkedin className="w-5 h-5" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="Facebook">
                <LogoFacebook className="w-5 h-5" />
              </a>
              <a href="https://github.com/mehedihasan3000" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="GitHub">
                <LogoGithub className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-sm text-gray-500">
          &copy; {year} FundForge. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
