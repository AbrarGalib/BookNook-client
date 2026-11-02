"use client";
import { useState } from "react";
import { signIn } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await signIn.email({ email, password });
    
    if (error) {
      toast.error(error.message || "Login failed");
      setLoading(false);
      return;
    }

    if (data?.user) {
      try {
        const res = await fetch("/api/jwt", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: data.user.email }),
        });
        const result = await res.json();
        document.cookie = `access-token=${result.token}; path=/; max-age=${7 * 24 * 60 * 60};`;
        toast.success("Successfully logged in!");
        router.push("/");
      } catch (err) {
        toast.error("Failed to generate secure token.");
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#111812] text-white">
      <div className="bg-[#1A241B] p-8 rounded-xl w-full max-w-md border border-gray-800">
        <h1 className="text-3xl font-serif text-center mb-6">Login</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <input type="email" placeholder="Email" required onChange={(e) => setEmail(e.target.value)} className="w-full p-3 bg-gray-900 border border-gray-700 rounded focus:border-[#95C8A1] outline-none" />
          <input type="password" placeholder="Password" required onChange={(e) => setPassword(e.target.value)} className="w-full p-3 bg-gray-900 border border-gray-700 rounded focus:border-[#95C8A1] outline-none" />
          <button disabled={loading} type="submit" className="w-full p-3 bg-[#95C8A1] text-black font-semibold rounded">
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="text-center text-sm text-gray-400 mt-4">New here? <Link href="/register" className="text-[#95C8A1]">Register</Link></p>
      </div>
    </div>
  );
}