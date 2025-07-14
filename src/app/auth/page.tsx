"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "register") {
        await axios.post(`${apiUrl}/api/register`, { username, password });
        setMode("login");
        setError("Registration successful! Please log in.");
      } else {
        const res = await axios.post(`${apiUrl}/api/login`, { username, password });
        localStorage.setItem("jwt", res.data.token);
        window.location.href = "/dashboard";
      }
    } catch (e: any) {
      setError(e.response?.data?.error || "Something went wrong");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 via-green-200 to-green-400 p-4">
      <div className="bg-white/90 rounded-3xl shadow-2xl p-8 w-full max-w-md flex flex-col gap-6 border border-blue-100 relative">
        <div className="flex flex-col items-center gap-2 mb-2">
          <Image src="/globe.svg" alt="Logo" width={48} height={48} className="drop-shadow" />
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">{mode === "login" ? "Welcome Back" : "Create Account"}</h1>
          <p className="text-gray-500 text-sm">Personal Notes & Bookmark Manager</p>
        </div>
        <form className="flex flex-col gap-4 mt-2" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700 font-medium mb-1" htmlFor="username">Username</label>
            <input
              id="username"
              className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition placeholder-gray-500 text-black"
              placeholder="Enter your username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1" htmlFor="password">Password</label>
            <input
              id="password"
              className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition placeholder-gray-500 text-black"
              placeholder="Enter your password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          <button
            className="bg-gradient-to-r from-blue-500 to-green-500 text-white px-4 py-2 rounded-lg font-semibold shadow hover:from-blue-600 hover:to-green-600 transition text-lg mt-2"
            type="submit"
            disabled={loading}
          >
            {loading ? "Please wait..." : mode === "login" ? "Login" : "Register"}
          </button>
        </form>
        {error && <div className={`text-center px-2 py-1 rounded ${error.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} mt-2`}>{error}</div>}
        <div className="text-center text-gray-600 mt-2">
          {mode === "login" ? (
            <>
              Don&apos;t have an account?{' '}
              <button className="text-blue-700 hover:underline font-semibold" onClick={() => { setMode("register"); setError(""); }}>Register</button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button className="text-blue-700 hover:underline font-semibold" onClick={() => { setMode("login"); setError(""); }}>Login</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
} 