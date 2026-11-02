"use client";
import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";
import PrivateRoute from "@/components/PrivateRoute";

export default function MyBorrowsPage() {
  const { data: session } = useSession();
  const [borrows, setBorrows] = useState([]);

  useEffect(() => {
    if (session) {
      const token = document.cookie.split('; ').find(row => row.startsWith('access-token='))?.split('=')[1];
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/borrows?email=${session.user.email}`, {
        headers: { "authorization": `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => setBorrows(data));
    }
  }, [session]);

  const handleReturn = async (borrowId: string) => {
    const token = document.cookie.split('; ').find(row => row.startsWith('access-token='))?.split('=')[1];
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/borrows/${borrowId}`, {
        method: "DELETE",
        headers: { "authorization": `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to return book");
      
      setBorrows(borrows.filter((b: any) => b._id !== borrowId));
      toast.success("Book returned successfully!");
    } catch (err) {
      toast.error("Error returning book");
    }
  };

  return (
    <PrivateRoute>
      <div className="min-h-screen bg-[#111812] py-12 px-6 md:px-20 text-white">
        <div className="max-w-[1400px] mx-auto">
          <h1 className="text-3xl font-serif mb-8 text-white">My Borrowed Books</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {borrows.map((borrow: any) => (
              <div key={borrow._id} className="bg-[#1A241B] p-5 rounded-xl flex items-center gap-6 border border-gray-800">
                <img src={borrow.bookImage} alt={borrow.bookTitle} className="w-20 h-28 object-cover rounded shadow-md" />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">{borrow.bookTitle}</h3>
                  <p className="text-xs text-gray-400 mb-1">Borrowed: {new Date(borrow.borrowDate).toLocaleDateString()}</p>
                  <p className="text-xs text-[#95C8A1] mb-4">Return by: {new Date(borrow.returnDate).toLocaleDateString()}</p>
                  <button 
                    onClick={() => handleReturn(borrow._id)}
                    className="w-full bg-[#95C8A1] text-black py-2 rounded text-xs font-bold hover:bg-[#7eb58c] transition"
                  >
                    Return Book
                  </button>
                </div>
              </div>
            ))}
          </div>
          {borrows.length === 0 && <p className="text-gray-400 text-center py-12">You haven't borrowed any books yet.</p>}
        </div>
      </div>
    </PrivateRoute>
  );
}