"use client";
import Link from "next/link";
import { useSession, signOut } from "@/lib/auth-client";
import { BookOpen } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const { data: session, isPending } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    document.cookie = "access-token=; path=/; max-age=0;";
    window.location.href = "/login";
  };

  return (
    <nav className="bg-[#111812] border-b border-gray-800 px-6 py-4 flex justify-between items-center relative z-50">
      <Link href="/" className="flex items-center gap-2 text-[#95C8A1] font-bold text-xl">
        <BookOpen size={24} /> BookNook
      </Link>
      <div className="hidden md:flex gap-6 text-sm text-gray-300">
        <Link href="/" className="hover:text-[#95C8A1]">Home</Link>
        <Link href="/books" className="hover:text-[#95C8A1]">All Books</Link>
        {session && (
          <>
            <Link href="/add-book" className="hover:text-[#95C8A1]">Add Book</Link>
            <Link href="/my-books" className="hover:text-[#95C8A1]">My Books</Link>
            <Link href="/my-borrows" className="hover:text-[#95C8A1]">My Borrows</Link>
          </>
        )}
      </div>
      <div className="flex items-center gap-4">
        {!isPending && !session ? (
          <>
            <Link href="/login" className="text-sm font-semibold hover:text-[#95C8A1]">Login</Link>
            <Link href="/register" className="bg-[#95C8A1] text-black px-4 py-2 rounded text-sm font-semibold">Register</Link>
          </>
        ) : session ? (
          <div className="relative">
            <img 
              src={session.user.image || "/default-avatar.png"} 
              alt="User" 
              className="w-10 h-10 rounded-full cursor-pointer border-2 border-transparent hover:border-[#95C8A1]"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            />
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-[#1A241B] border border-gray-800 rounded py-2 shadow-xl">
                <p className="px-4 py-2 text-sm text-gray-300 border-b border-gray-700">{session.user.name}</p>
                <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-800">Logout</button>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </nav>
  );
}