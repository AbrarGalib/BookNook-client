"use client";
import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";
import PrivateRoute from "@/components/PrivateRoute";

export default function MyBooksPage() {
  const { data: session } = useSession();
  const [myBooks, setMyBooks] = useState([]);

  useEffect(() => {
    if (session) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/books`)
        .then(res => res.json())
        .then(data => {
          const filtered = data.filter((book: any) => book.addedBy?.email === session.user.email);
          setMyBooks(filtered);
        });
    }
  }, [session]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;
    const token = document.cookie.split('; ').find(row => row.startsWith('access-token='))?.split('=')[1];
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/books/${id}`, {
        method: "DELETE",
        headers: { "authorization": `Bearer ${token}` }
      });
      if (!res.ok) throw new Error();
      setMyBooks(myBooks.filter((b: any) => b._id !== id));
      toast.success("Book deleted successfully");
    } catch (err) {
      toast.error("Failed to delete book");
    }
  };

  return (
    <PrivateRoute>
      <div className="min-h-screen bg-[#111812] py-12 px-6 md:px-20 text-white">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-serif mb-8 text-white">Books I've Added</h1>
          <div className="overflow-x-auto bg-[#1A241B] rounded-xl border border-gray-800">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-800 text-gray-400 bg-[#111812]">
                  <th className="p-4 font-semibold text-sm">Book Title</th>
                  <th className="p-4 font-semibold text-sm">Author</th>
                  <th className="p-4 font-semibold text-sm">Category</th>
                  <th className="p-4 font-semibold text-sm">Copies</th>
                  <th className="p-4 font-semibold text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {myBooks.map((book: any) => (
                  <tr key={book._id} className="border-b border-gray-800/50 hover:bg-[#111812] transition">
                    <td className="p-4 font-semibold">{book.title}</td>
                    <td className="p-4 text-sm text-gray-300">{book.author}</td>
                    <td className="p-4 text-sm text-gray-300">{book.category}</td>
                    <td className="p-4 text-sm">{book.totalCopies}</td>
                    <td className="p-4">
                      <button onClick={() => handleDelete(book._id)} className="bg-red-500/10 text-red-400 border border-red-500/20 px-4 py-1.5 rounded text-xs font-bold hover:bg-red-500 hover:text-white transition">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {myBooks.length === 0 && <p className="p-6 text-center text-gray-500">You haven't added any books yet.</p>}
          </div>
        </div>
      </div>
    </PrivateRoute>
  );
}