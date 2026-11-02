"use client";
import { useState } from "react";
import { signUp } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^(?=.*[a-z])(?=.*[A-Z]).{6,}$/.test(password)) {
      return toast.error("Password must be 6+ chars and contain upper & lower case letters.");
    }

    setLoading(true);
    const { error } = await signUp.email({ email, password, name, image: photo });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Registration successful! Please login.");
      router.push("/login");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#111812] text-white">
      <div className="bg-[#1A241B] p-8 rounded-xl w-full max-w-md border border-gray-800">
        <h1 className="text-3xl font-serif text-center mb-6">Register</h1>
        <form onSubmit={handleRegister} className="space-y-4">
          <input type="text" placeholder="Name" required onChange={(e) => setName(e.target.value)} className="w-full p-3 bg-gray-900 border border-gray-700 rounded outline-none" />
          <input type="email" placeholder="Email" required onChange={(e) => setEmail(e.target.value)} className="w-full p-3 bg-gray-900 border border-gray-700 rounded outline-none" />
          <input type="url" placeholder="Photo URL" required onChange={(e) => setPhoto(e.target.value)} className="w-full p-3 bg-gray-900 border border-gray-700 rounded outline-none" />
          <input type="password" placeholder="Password" required onChange={(e) => setPassword(e.target.value)} className="w-full p-3 bg-gray-900 border border-gray-700 rounded outline-none" />
          <button disabled={loading} type="submit" className="w-full p-3 bg-[#95C8A1] text-black font-semibold rounded">
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
}