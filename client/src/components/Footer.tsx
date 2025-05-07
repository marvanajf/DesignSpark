import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-black border-t border-gray-700/60">
      <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
        <nav className="-mx-5 -my-2 flex flex-wrap justify-center" aria-label="Footer">
          <div className="px-5 py-2">
            <Link href="/about" className="text-base text-gray-400 hover:text-[#74d1ea]">
              About
            </Link>
          </div>
          <div className="px-5 py-2">
            <Link href="/features" className="text-base text-gray-400 hover:text-[#74d1ea]">
              Features
            </Link>
          </div>
          <div className="px-5 py-2">
            <Link href="/pricing" className="text-base text-gray-400 hover:text-[#74d1ea]">
              Pricing
            </Link>
          </div>
          <div className="px-5 py-2">
            <Link href="/blog" className="text-base text-gray-400 hover:text-[#74d1ea]">
              Blog
            </Link>
          </div>
          <div className="px-5 py-2">
            <Link href="/contact" className="text-base text-gray-400 hover:text-[#74d1ea]">
              Contact
            </Link>
          </div>
          <div className="px-5 py-2">
            <Link href="/privacy-policy" className="text-base text-gray-400 hover:text-[#74d1ea]">
              Privacy Policy
            </Link>
          </div>
          <div className="px-5 py-2">
            <Link href="/sitemap" className="text-base text-gray-400 hover:text-[#74d1ea]">
              Sitemap
            </Link>
          </div>
        </nav>
        <p className="mt-8 text-center text-base text-gray-400">
          &copy; {new Date().getFullYear()} Tovably. All rights reserved.
        </p>
      </div>
    </footer>
  );
}