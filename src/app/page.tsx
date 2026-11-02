"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

export default function HomePage() {
  const [newBooks, setNewBooks] = useState([]);
  
  // 1. Add the isMounted state back
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // 2. Set isMounted to true once the browser loads
    setIsMounted(true);
    
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/books?limit=6`)
      .then((res) => res.json())
      .then((data) => setNewBooks(data))
      .catch((err) => console.error(err));
  }, []);

  // 3. Return a safe, empty placeholder while server renders
  if (!isMounted) {
    return <main className="min-h-screen bg-[#111812]"><div className="h-[70vh] w-full bg-[#1A241B]"></div></main>;
  }

  return (
    <div className="bg-[#111812] text-white">
      {/* 1. Banner Section (Swiper) */}
      <section className="h-[70vh] w-full">
        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 5000 }}
          pagination={{ clickable: true }}
          className="h-full w-full"
        >
          {/* Slide 1 */}
          <SwiperSlide>
            <div className="h-full flex flex-col justify-center items-center text-center px-4 bg-gradient-to-b from-[#111812] to-[#1A241B]">
              <h4 className="text-[#95C8A1] tracking-widest text-xs font-bold mb-4 uppercase">BookNook</h4>
              <h1 className="text-5xl md:text-7xl font-serif mb-6 max-w-3xl">Share the books on your shelf</h1>
              <p className="text-gray-400 mb-8 max-w-xl">Add the books you have finished. Let other readers enjoy them too.</p>
              <Link href="/books" className="bg-[#95C8A1] text-black px-8 py-3 rounded font-bold hover:bg-[#7eb58c] transition">
                Browse Books
              </Link>
            </div>
          </SwiperSlide>
          
          {/* Slide 2 */}
          <SwiperSlide>
            <div className="h-full flex flex-col justify-center items-center text-center px-4 bg-gradient-to-b from-[#111812] to-[#0b100c]">
              <h4 className="text-[#95C8A1] tracking-widest text-xs font-bold mb-4 uppercase">Community</h4>
              <h1 className="text-5xl md:text-7xl font-serif mb-6 max-w-3xl">Your neighbourhood library, online</h1>
              <p className="text-gray-400 mb-8 max-w-xl">Find a book that someone nearby already loved, and borrow it for a week.</p>
              <Link href="/books" className="bg-[#95C8A1] text-black px-8 py-3 rounded font-bold hover:bg-[#7eb58c] transition">
                Browse Books
              </Link>
            </div>
          </SwiperSlide>

          {/* Slide 3 */}
          <SwiperSlide>
            <div className="h-full flex flex-col justify-center items-center text-center px-4 bg-gradient-to-b from-[#1A241B] to-[#111812]">
              <h4 className="text-[#95C8A1] tracking-widest text-xs font-bold mb-4 uppercase">Discover</h4>
              <h1 className="text-5xl md:text-7xl font-serif mb-6 max-w-3xl">Find your next great read</h1>
              <p className="text-gray-400 mb-8 max-w-xl">Explore hundreds of titles across fiction, science, and history.</p>
              <Link href="/books" className="bg-[#95C8A1] text-black px-8 py-3 rounded font-bold hover:bg-[#7eb58c] transition">
                Browse Books
              </Link>
            </div>
          </SwiperSlide>
        </Swiper>
      </section>

      {/* 2. New Arrivals (Dynamic) */}
      <section className="py-20 px-6 md:px-20 max-w-[1400px] mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif text-white mb-3">New Arrivals</h2>
          <p className="text-gray-400 text-sm">The latest books added by our readers.</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {newBooks.map((book: any) => (
            <div key={book._id} className="bg-[#1A241B] rounded-lg overflow-hidden flex flex-col border border-gray-800 hover:border-[#95C8A1] transition">
              <img src={book.image} alt={book.title} className="h-56 w-full object-cover" />
              <div className="p-4 flex flex-col flex-grow">
                <span className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">{book.category}</span>
                <h3 className="text-white text-sm font-semibold truncate mb-1">{book.title}</h3>
                <p className="text-xs text-gray-400 mb-4 truncate">by {book.author}</p>
                <Link href={`/books/${book._id}`} className="mt-auto w-full text-center bg-[#95C8A1] text-black py-2 rounded text-xs font-bold hover:bg-[#7eb58c] transition">
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Extra Section: How Borrowing Works */}
      <section className="py-20 bg-[#0b100c] px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif text-white mb-3">How Borrowing Works</h2>
          <p className="text-gray-400 text-sm">Three steps. No library card needed.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-[#1A241B] p-8 rounded-xl text-center border border-gray-800">
            <div className="w-12 h-12 bg-[#95C8A1] rounded-full flex items-center justify-center mx-auto mb-6 text-black font-bold text-xl">1</div>
            <h3 className="text-white font-semibold mb-2">Find a book</h3>
            <p className="text-sm text-gray-400">Browse the shelf and open any book you like.</p>
          </div>
          <div className="bg-[#1A241B] p-8 rounded-xl text-center border border-gray-800">
            <div className="w-12 h-12 bg-[#95C8A1] rounded-full flex items-center justify-center mx-auto mb-6 text-black font-bold text-xl">2</div>
            <h3 className="text-white font-semibold mb-2">Borrow it</h3>
            <p className="text-sm text-gray-400">Confirm the borrow. The book is yours for 7 days.</p>
          </div>
          <div className="bg-[#1A241B] p-8 rounded-xl text-center border border-gray-800">
            <div className="w-12 h-12 bg-[#95C8A1] rounded-full flex items-center justify-center mx-auto mb-6 text-black font-bold text-xl">3</div>
            <h3 className="text-white font-semibold mb-2">Return it</h3>
            <p className="text-sm text-gray-400">Done reading? Return it from My Borrows in one click.</p>
          </div>
        </div>
      </section>

      {/* 4. Extra Section: Top Categories */}
      <section className="py-20 px-6 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif text-white mb-3">Top Categories</h2>
          <p className="text-gray-400 text-sm">Pick a shelf and start reading.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#1A241B] border border-gray-800 p-8 rounded-xl text-center hover:border-[#95C8A1] transition cursor-pointer">
            <div className="text-[#95C8A1] text-3xl mb-4">✨</div>
            <h3 className="font-semibold text-white mb-1">Fiction</h3>
            <p className="text-xs text-gray-400">Novels and short stories</p>
          </div>
          <div className="bg-[#1A241B] border border-gray-800 p-8 rounded-xl text-center hover:border-[#95C8A1] transition cursor-pointer">
            <div className="text-[#95C8A1] text-3xl mb-4">⚛️</div>
            <h3 className="font-semibold text-white mb-1">Science</h3>
            <p className="text-xs text-gray-400">How the world works</p>
          </div>
          <div className="bg-[#1A241B] border border-gray-800 p-8 rounded-xl text-center hover:border-[#95C8A1] transition cursor-pointer">
            <div className="text-[#95C8A1] text-3xl mb-4">🏛️</div>
            <h3 className="font-semibold text-white mb-1">History</h3>
            <p className="text-xs text-gray-400">Stories from the past</p>
          </div>
          <div className="bg-[#1A241B] border border-gray-800 p-8 rounded-xl text-center hover:border-[#95C8A1] transition cursor-pointer">
            <div className="text-[#95C8A1] text-3xl mb-4">😊</div>
            <h3 className="font-semibold text-white mb-1">Kids</h3>
            <p className="text-xs text-gray-400">Picture books and more</p>
          </div>
        </div>
      </section>
    </div>
  );
}