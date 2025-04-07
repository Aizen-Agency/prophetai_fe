"use client"

import * as React from "react"
import Link from "next/link"
import { Menu } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"

export const Navbar = () => {
  return (
    <nav className="w-full bg-[#121218] border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-12 h-12">
              <img
                src="/EFAWER.png"
                alt="Wavii Logo"
                className="h-12 w-12"
              />
            </div>
            <span className="text-white font-semibold text-xl">Wavii</span>
          </div>

          {/* Login Button */}
          <Link href="/login">
            <button className="px-6 py-2.5 rounded-lg text-white text-sm font-medium 
              bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 
              hover:to-purple-600 transition-all duration-200 shadow-lg 
              shadow-purple-500/20 hover:shadow-purple-500/30">
              Login
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
};