"use client";
import { useState } from "react";
import Image from "next/image";
import AuthNav from "./AuthNav";
import { HiBars3, HiXMark } from "react-icons/hi2";

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <nav className="custom-navbar mx-auto mt-4 mb-8 max-w-3xl flex items-center justify-between gap-4 bg-white/90 border border-blue-100 shadow-lg rounded-2xl px-6 py-3 sticky top-4 z-20 backdrop-blur relative">
      <div className="flex items-center gap-3">
        <Image src="/globe.svg" alt="Logo" width={32} height={32} className="drop-shadow" />
        <a href="/dashboard" className="text-xl font-extrabold text-blue-700 tracking-tight select-none">KeepNest</a>
        <div className="hidden sm:flex items-center gap-4 ml-6">
          <a href="/notes" className="font-semibold text-gray-700 hover:text-black hover:underline underline-offset-4 transition">Notes</a>
          <a href="/bookmarks" className="font-semibold text-gray-700 hover:text-black hover:underline underline-offset-4 transition">Bookmarks</a>
          <a href="https://github.com/theayushgupta08/KeepNest-Notes-Bookmark-Manager" className="font-semibold text-gray-700 hover:text-black hover:underline underline-offset-4 transition">GitHub</a>
          <a href="/about-me" className="font-semibold text-gray-700 hover:text-black hover:underline underline-offset-4 transition">About Me</a>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="sm:hidden">
          <button
            className="p-2 rounded-lg hover:bg-blue-50 transition"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <HiXMark className="text-2xl text-blue-700" /> : <HiBars3 className="text-2xl text-blue-700" />}
          </button>
        </div>
        <div className="hidden sm:block">
          <AuthNav />
        </div>
      </div>
      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-white border-t border-blue-100 rounded-b-2xl shadow-lg flex flex-col items-stretch sm:hidden animate-fade-in z-30">
          <a href="/notes" className="py-3 px-6 font-semibold text-gray-700 hover:text-black hover:underline underline-offset-4 border-b border-blue-50 transition">Notes</a>
          <a href="/bookmarks" className="py-3 px-6 font-semibold text-gray-700 hover:text-black hover:underline underline-offset-4 border-b border-green-50 transition">Bookmarks</a>
          <a href="https://github.com/theayushgupta08/KeepNest-Notes-Bookmark-Manager" className="py-3 px-6 font-semibold text-gray-700 hover:text-black hover:underline underline-offset-4 transition">GitHub</a>
          <a href="/about-me" className="font-semibold text-gray-700 hover:text-black hover:underline underline-offset-4 transition">About Me</a>
          <div className="py-3 px-6 border-t border-blue-50"><AuthNav /></div>
        </div>
      )}
    </nav>
  );
} 