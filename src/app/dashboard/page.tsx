"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function Dashboard() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (!localStorage.getItem("jwt")) {
        setRedirecting(true);
        router.replace("/auth");
      } else {
        setAuthChecked(true);
      }
    }
  }, [router]);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  if (!authChecked) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-green-50">
        <span className="animate-spin rounded-full h-10 w-10 border-b-4 border-blue-600 mb-4"></span>
        <div className="text-gray-600 text-lg">{redirecting ? "Redirecting to login..." : "Checking authentication..."}</div>
        {redirecting && (
          <div className="text-gray-400 text-sm mt-2">If you are stuck, try refreshing or go to <a href="/auth" className="text-blue-600 underline">/auth</a></div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 p-6">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center gap-6">
        <Image src="/globe.svg" alt="Logo" width={64} height={64} className="mb-2" />
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 text-center">Personal Notes & Bookmark Manager</h1>
        <p className="text-lg text-gray-600 text-center">
          Organize your thoughts and favorite links in one place. Create, search, and filter notes and bookmarks with ease.
        </p>
        <div className="flex gap-6 mt-4">
          <Link href="/notes" className="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition">
            Go to Notes
          </Link>
          <Link href="/bookmarks" className="px-6 py-3 rounded-lg bg-green-600 text-white font-semibold shadow hover:bg-green-700 transition">
            Go to Bookmarks
          </Link>
        </div>
        <div className="mt-8 w-full">
          <h2 className="text-xl font-bold mb-2 text-gray-800">Features</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>📝 Create, update, and delete notes</li>
            <li>🔖 Save bookmarks with auto-fetched titles</li>
            <li>🏷️ Tag and filter your items</li>
            <li>🔍 Fast search for notes and bookmarks</li>
            <li>✨ Responsive, clean UI</li>
          </ul>
        </div>
      </div>
      <footer className="mt-10 text-gray-400 text-sm text-center">
        &copy; {year ?? ""} Personal Notes & Bookmark Manager
      </footer>
    </div>
  );
}
