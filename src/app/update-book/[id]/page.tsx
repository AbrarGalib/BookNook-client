"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import PrivateRoute from "@/components/PrivateRoute";

export default function UpdateBookPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ title: "", author: "", category: "", totalCopies: 0, description: "" });

  useEffect(() => {
    document.title = "BookNook | Update Book";
    const token = document.cookie.split('; ').find(row => row.startsWith('access-token='))?.split('=')[1];
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/books/${params.id}`, {
      headers: { "authorization": `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setFormData({ title: data.title, author: data.author, category: data.category, totalCopies: data.totalCopies, description: data.description }));
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const token = document.cookie.split('; ').find(row => row.startsWith('access-token='))?.split('=')[1];

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/books/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "authorization": `Bearer ${token}` },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error();
      toast.success("Book updated successfully!");
      router.push("/my-books");
    } catch (err) {
      toast.error("Error updating book.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PrivateRoute>
      <div className="max-w-2xl mx-auto p-8 bg-[#111812] text-white">
        <h1 className="text-3xl font-serif mb-6 text-center text-[#95C8A1]">Update Book</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required placeholder="Book Title" className="w-full p-3 bg-gray-900 border border-gray-800 rounded" />
          <input value={formData.author} onChange={e => setFormData({...formData, author: e.target.value})} required placeholder="Author Name" className="w-full p-3 bg-gray-900 border border-gray-800 rounded" />
          <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full p-3 bg-gray-900 border border-gray-800 rounded">
            <option>Fiction</option><option>Science</option><option>History</option><option>Kids</option><option>Others</option>
          </select>
          <input type="number" value={formData.totalCopies} onChange={e => setFormData({...formData, totalCopies: Number(e.target.value)})} required placeholder="Total Copies" className="w-full p-3 bg-gray-900 border border-gray-800 rounded" />
          <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required placeholder="Description" className="w-full p-3 bg-gray-900 border border-gray-800 rounded h-32" />
          <button disabled={loading} className="w-full p-3 bg-[#95C8A1] text-black font-bold rounded">
            {loading ? "Updating..." : "Update Book"}
          </button>
        </form>
      </div>
    </PrivateRoute>
  );
}