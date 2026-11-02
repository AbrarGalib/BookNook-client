"use client";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

export default function HomePage() {
  return (
    <div className="bg-[#111812]">
      <section className="h-[60vh] w-full">
        <Swiper modules={[Autoplay, Pagination]} autoplay={{ delay: 5000 }} pagination={{ clickable: true }} className="h-full w-full">
          <SwiperSlide>
            <div className="h-full flex flex-col justify-center items-center text-center px-4 bg-[#1A241B]">
              <h1 className="text-5xl font-serif text-white mb-4">Share the books on your shelf</h1>
              <Link href="/books" className="bg-[#95C8A1] text-black px-6 py-3 rounded font-bold mt-6">Browse Books</Link>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="h-full flex flex-col justify-center items-center text-center px-4 bg-[#0b100c]">
              <h1 className="text-5xl font-serif text-white mb-4">Your neighbourhood library</h1>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="h-full flex flex-col justify-center items-center text-center px-4 bg-[#1A241B]">
              <h1 className="text-5xl font-serif text-white mb-4">Find your next great read</h1>
            </div>
          </SwiperSlide>
        </Swiper>
      </section>
    </div>
  );
}