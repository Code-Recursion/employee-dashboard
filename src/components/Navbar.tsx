import Link from "next/link";
import { Button } from "./ui/button";

export function Navbar() {
  return (
    <nav className="border-b bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center gap-2">
              <span className="font-bold text-xl text-neutral-900 tracking-tight">
                SalaryMgmt
              </span>
            </Link>
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              <Link
                href="/dashboard"
                className="text-neutral-600 hover:text-neutral-900 px-3 py-2 text-sm font-medium transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/insights"
                className="text-neutral-600 hover:text-neutral-900 px-3 py-2 text-sm font-medium transition-colors"
              >
                Insights
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
