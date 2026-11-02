"use client";
import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import BorrowModal from "@/components/BorrowModal";
import Link from "next/link";
import PrivateRoute from "@/components/PrivateRoute";

export default function BookDetails({ params }: { params: { id: string } }) {
  const [book, setBook] = useState<any>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const fetchBook = () => {
    const token = document.cookie.split('; ').find(row => row.startsWith('access-token='))?.split('=')[1];
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/books/${params.id}`, {
      headers: token ? { "authorization": `Bearer ${token}` } : {}
    })
      .then(res => res.json())
      .then(data => setBook(data));
  };

  useEffect(() => {
    fetchBook();
  }, [params.id]);

  if (!book) return <div className="min-h-screen flex items-center justify-center bg-[#111812] text-[#95C8A1]">Loading...</div>;

  return (
    <PrivateRoute>
      <div className="min-h-screen bg-[#111812] py-12 px-6 md:px-20 text-white">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-12">
          <img src={book.image} alt={book.title} className="w-full md:w-1/3 rounded-lg object-cover border border-gray-800" />
          <div className="flex-1">
            <span className="bg-gray-800 text-xs px-3 py-1 rounded-full text-gray-300 tracking-wider uppercase">{book.category}</span>
            <h1 className="text-4xl md:text-5xl font-serif mt-4 mb-2">{book.title}</h1>
            <p className="text-gray-400 mb-6 text-lg">by {book.author}</p>
            <p className="text-gray-300 mb-8 leading-relaxed">{book.description}</p>
            
            <div className="bg-[#1A241B] border border-gray-800 p-6 rounded-xl flex justify-between items-center mb-8">
              <div>
                <p className="text-xs text-gray-500 mb-1">Added by</p>
                <p className="text-sm font-semibold">{book.addedBy?.name}</p>
                <p className="text-xs text-gray-400">{book.addedBy?.email}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 mb-1">Copies left</p>
                <p className="text-2xl font-bold text-[#95C8A1]">{book.totalCopies}</p>
              </div>
            </div>

            <div className="flex gap-6 items-center">
              <button 
                disabled={book.totalCopies === 0}
                onClick={() => setModalOpen(true)}
                className="bg-[#95C8A1] text-black px-8 py-3 rounded font-bold hover:bg-[#7eb58c] disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {book.totalCopies === 0 ? "Not Available" : "Borrow This Book"}
              </button>
              <Link href="/books" className="text-sm text-gray-400 hover:text-white transition">Back to all books</Link>
            </div>
          </div>
        </div>
        <BorrowModal book={book} isOpen={isModalOpen} onClose={() => setModalOpen(false)} onSuccess={fetchBook} />
      </div>
    </PrivateRoute>
  );
}