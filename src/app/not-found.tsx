import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] bg-[#111812] flex flex-col items-center justify-center text-white">
      <h1 className="text-8xl font-serif text-[#95C8A1] mb-4">404</h1>
      <h2 className="text-2xl text-gray-400 mb-8">Oops! This page got lost in the shelves.</h2>
      <Link href="/" className="bg-[#95C8A1] text-black px-8 py-3 rounded font-bold hover:bg-[#7eb58c] transition">
        Back to Home
      </Link>
    </div>
  );
}