"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { HiArrowRightOnRectangle, HiArrowLeftOnRectangle } from "react-icons/hi2";

export default function AuthNav() {
  const [isAuth, setIsAuth] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  useEffect(() => {
    setIsAuth(typeof window !== 'undefined' && !!localStorage.getItem("jwt"));
  }, [pathname]);
  const handleLogout = () => {
    localStorage.removeItem("jwt");
    setIsAuth(false);
    router.push("/auth");
  };
  if (isAuth) {
    return (
      <button
        className="flex items-center gap-2 bg-red-100 text-red-700 font-semibold px-4 py-1.5 rounded-lg shadow hover:bg-red-200 hover:text-red-900 transition border border-red-200"
        onClick={handleLogout}
        title="Logout"
      >
        <HiArrowLeftOnRectangle className="text-lg" /> Logout
      </button>
    );
  }
  return (
    <a
      href="/auth"
      className="flex items-center gap-2 bg-blue-100 text-blue-700 font-semibold px-4 py-1.5 rounded-lg shadow hover:bg-blue-200 hover:text-blue-900 transition border border-blue-200"
      title="Login or Register"
    >
      <HiArrowRightOnRectangle className="text-lg" /> Login / Register
    </a>
  );
} 