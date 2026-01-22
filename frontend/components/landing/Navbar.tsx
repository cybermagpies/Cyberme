"use client";
import Link from "next/link";
import { Terminal } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="w-full flex items-center justify-between py-8 px-8 max-w-7xl mx-auto z-50 relative">
      <div className="flex items-center gap-2 text-white">
        <div className="bg-green-600 p-1 rounded">
            <Terminal size={20} className="text-black" />
        </div>
        <span className="text-xl font-bold tracking-tight">CyberMe</span>
      </div>

      <div className="hidden md:flex items-center gap-10 text-sm font-medium text-gray-400">
        <Link href="#" className="hover:text-green-400 transition-colors">Features</Link>
        <Link href="#" className="hover:text-green-400 transition-colors">Manifesto</Link>
        <Link href="#" className="hover:text-green-400 transition-colors">Pricing</Link>
      </div>

      <Link href="/auth?mode=login">
        <button className="text-white hover:text-green-400 font-medium transition-colors border border-green-900 hover:border-green-500 px-6 py-2 rounded-lg text-sm bg-green-900/10">
          Log In
        </button>
      </Link>
    </nav>
  );
}
