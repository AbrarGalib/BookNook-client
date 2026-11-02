"use client";
import { useState } from "react";
import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";

export default function BorrowModal({ book, isOpen, onClose, onSuccess }: any) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  if (!isOpen || !session) return null;

  const handleBorrow = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const token = document.cookie.split('; ').find(row => row.startsWith('access-token='))?.split('=')[1];
    const returnDate = new Date();
    returnDate.setDate(returnDate.getDate() + 7);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/borrows`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          bookId: book._id,
          userEmail: session.user.email,
          bookTitle: book.title,
          bookImage: book.image,
          borrowDate: new Date().toISOString(),
          returnDate: returnDate.toISOString(),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to borrow book");
      
      toast.success("Book borrowed successfully!");
      onSuccess(); // Refresh book data on the page
      onClose();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4">
      <div className="bg-[#1A241B] p-6 rounded-xl w-full max-w-md text-white border border-gray-800 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">✕</button>
        <h2 className="text-xl font-bold mb-2">Borrow "{book.title}"</h2>
        <p className="text-sm text-gray-400 mb-6">You can keep this book for 7 days.</p>
        <form onSubmit={handleBorrow} className="space-y-4">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">User Name</label>
            <input value={session.user.name} readOnly className="w-full p-3 bg-gray-900 border border-gray-700 rounded text-gray-400 outline-none" />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">User Email</label>
            <input value={session.user.email} readOnly className="w-full p-3 bg-gray-900 border border-[#95C8A1] rounded text-[#95C8A1] outline-none" />
          </div>
          <button disabled={loading} type="submit" className="w-full p-3 bg-[#95C8A1] text-black font-bold rounded hover:bg-[#7eb58c] transition mt-2">
            {loading ? "Confirming..." : "Confirm Borrow"}
          </button>
        </form>
      </div>
    </div>
  );
}