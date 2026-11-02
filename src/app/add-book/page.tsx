"use client";
import { useState } from "react";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import PrivateRoute from "@/components/PrivateRoute";

export default function AddBookPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const imageFile = formData.get("image") as File;
    const imgbbData = new FormData();
    imgbbData.append("image", imageFile);

    try {
      const imgRes = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_KEY}`, {
        method: "POST",
        body: imgbbData,
      });
      const imgJson = await imgRes.json();
      
      const newBook = {
        title: formData.get("title"),
        author: formData.get("author"),
        category: formData.get("category"),
        totalCopies: Number(formData.get("totalCopies")),
        description: formData.get("description"),
        image: imgJson.data.display_url,
        addedBy: { name: session?.user?.name, email: session?.user?.email }
      };

      const token = document.cookie.split('; ').find(row => row.startsWith('access-token='))?.split('=')[1];
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/books`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "authorization": `Bearer ${token}` },
        body: JSON.stringify(newBook),
      });

      toast.success("Book added!");
      router.push("/books");
    } catch (err) {
      toast.error("Error adding book.");
    } finally {
      setLoading(false);
    }
  };

  if (!session) return null;

  return (
    <PrivateRoute>
      <div className="max-w-2xl mx-auto p-8 bg-[#111812] text-white">
        <h1 className="text-3xl font-serif mb-6 text-center text-[#95C8A1]">Add a Book</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="title" required placeholder="Book Title" className="w-full p-3 bg-gray-900 border border-gray-800 rounded" />
          <input name="author" required placeholder="Author Name" className="w-full p-3 bg-gray-900 border border-gray-800 rounded" />
          <select name="category" className="w-full p-3 bg-gray-900 border border-gray-800 rounded">
            <option>Fiction</option><option>Science</option><option>History</option>
          </select>
          <input name="totalCopies" type="number" required placeholder="Total Copies" className="w-full p-3 bg-gray-900 border border-gray-800 rounded" />
          <input name="image" type="file" required accept="image/*" className="w-full p-3 bg-gray-900 border border-gray-800 rounded" />
          <textarea name="description" required placeholder="Description" className="w-full p-3 bg-gray-900 border border-gray-800 rounded" />
          <input value={session.user.name} readOnly className="w-full p-3 bg-gray-800 text-gray-500 rounded" />
          <input value={session.user.email} readOnly className="w-full p-3 bg-gray-800 text-gray-500 rounded" />
          <button disabled={loading} className="w-full p-3 bg-[#95C8A1] text-black font-bold rounded">
            {loading ? "Adding..." : "Add Book"}
          </button>
        </form>
      </div>
    </PrivateRoute>
  );
}