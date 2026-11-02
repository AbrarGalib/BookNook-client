"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function AllBooksPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/books`)
      .then((res) => res.json())
      .then((data) => {
        setBooks(data);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-[#95C8A1] bg-[#111812]">Loading books...</div>;

  return (
    <div className="min-h-screen bg-[#111812] py-12 px-6 md:px-20 text-white">
      <div className="max-w-[1400px] mx-auto">
        <h1 className="text-4xl font-serif text-center mb-12">All Books</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.map((book: any) => (
            <div key={book._id} className="bg-[#1A241B] rounded-lg overflow-hidden flex flex-col border border-gray-800 hover:border-[#95C8A1] transition">
              <img src={book.image} alt={book.title} className="h-72 w-full object-cover" />
              <div className="p-4 flex flex-col flex-grow">
                <span className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">{book.category}</span>
                <h3 className="text-white font-semibold truncate mb-1">{book.title}</h3>
                <p className="text-xs text-gray-400 mb-4">by {book.author}</p>
                <Link href={`/books/${book._id}`} className="mt-auto w-full text-center bg-[#95C8A1] text-black py-2 rounded text-sm font-bold hover:bg-[#7eb58c] transition">
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}