"use client";
import { use, useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { useSession } from "@/lib/auth-client"; // Added to get user email

export default function BookDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params); 
  const { data: session } = useSession();
  const [book, setBook] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [borrowing, setBorrowing] = useState(false);

  const fetchBook = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/books/${id}`);
      if (!res.ok) throw new Error("Failed to fetch book");
      const data = await res.json();
      setBook(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBook();
  }, [id]);

  const handleBorrow = async () => {
    if (!session?.user?.email) {
      toast.error("Please log in to borrow books");
      return;
    }

    setBorrowing(true);
    try {
      // 1. Generate token for backend security
      const jwtRes = await fetch("/api/jwt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: session.user.email }),
      });
      if (!jwtRes.ok) throw new Error("Failed to authenticate");
      const { token } = await jwtRes.json();

      // 2. Format the borrow data required by your Express backend
      const borrowData = {
        bookId: book._id,
        userEmail: session.user.email,
        bookTitle: book.title,
        bookImage: book.image,
        borrowDate: new Date().toISOString(),
        returnDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString() // 14 days from now
      };

      // 3. Send request to backend
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/borrows`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(borrowData)
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to borrow book");
      }

      toast.success("Book borrowed successfully!");
      fetchBook(); // Refresh the page to show the new "Copies Left" count

    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setBorrowing(false);
    }
  };

  if (loading || !book) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#111812] text-[#95C8A1]">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111812] py-12 px-6">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-10">
        
        <div className="w-full md:w-1/3">
          <div className="border border-gray-700 rounded-xl overflow-hidden bg-[#1A241B] aspect-[3/4]">
            <img src={book.image} alt={book.title} className="w-full h-full object-cover" />
          </div>
        </div>

        <div className="w-full md:w-2/3 flex flex-col justify-center">
          <h1 className="text-4xl font-serif text-[#95C8A1] mb-2">{book.title}</h1>
          <p className="text-xl text-gray-400 mb-6">by <span className="text-white">{book.author}</span></p>
          
          <div className="bg-[#1A241B] border border-gray-800 p-6 rounded-xl mb-8 flex justify-between items-center text-sm text-gray-400">
            <p>Added by: <span className="text-white">{book.addedBy?.name || "Admin"}</span></p>
            <p>Copies left: <span className="text-[#95C8A1] font-bold text-lg">{book.totalCopies}</span></p>
          </div>

          <p className="text-gray-300 leading-relaxed mb-8">{book.description}</p>

          <div className="flex items-center gap-4">
            {/* Added onClick={handleBorrow} and loading state to the button */}
            <button 
              onClick={handleBorrow}
              disabled={book.totalCopies <= 0 || borrowing}
              className="px-8 py-3 bg-[#95C8A1] text-black font-bold rounded hover:bg-[#7eb58c] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {borrowing ? "Borrowing..." : book.totalCopies > 0 ? "Borrow This Book" : "Out of Stock"}
            </button>
            
            <Link href="/books" className="text-gray-400 hover:text-white transition">
              Back to all books
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}