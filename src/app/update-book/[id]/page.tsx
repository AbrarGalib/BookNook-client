"use client";
import { use, useEffect, useState, Suspense } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";

// 1. Move all update logic into an internal component
function UpdateBookContent() {
  const params = useParams();
  const id = params?.id as string; 
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("Fiction");
  const [totalCopies, setTotalCopies] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState(""); 

  useEffect(() => {
    if (!id) return;
    const fetchBook = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/books/${id}`);
        if (!res.ok) throw new Error("Failed to load book data");
        const data = await res.json();
        
        setTitle(data.title);
        setAuthor(data.author);
        setCategory(data.category);
        setTotalCopies(data.totalCopies.toString());
        setDescription(data.description);
        setImageUrl(data.image);
      } catch (err) {
        toast.error("Failed to load book details");
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const updatedBook = {
        title,
        author,
        category,
        totalCopies: Number(totalCopies),
        description,
        image: imageUrl, 
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/books/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedBook),
      });

      if (!res.ok) throw new Error("Failed to update book");

      toast.success("Book updated successfully!");
      router.back(); 

    } catch (err: any) {
      toast.error(err.message || "Something went wrong!");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#111812] text-[#95C8A1]">Loading Book Data...</div>;
  }

  return (
    <div className="min-h-screen bg-[#111812] py-12 px-6">
      <div className="max-w-xl mx-auto bg-[#1A241B] p-8 rounded-xl border border-gray-800">
        <h1 className="text-3xl font-serif text-[#95C8A1] text-center mb-8">Update Book</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="text" 
            placeholder="Book Title" 
            required 
            value={title} 
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 bg-gray-900 border border-gray-800 rounded text-white outline-none focus:border-[#95C8A1]"
          />
          
          <input 
            type="text" 
            placeholder="Author Name" 
            required 
            value={author} 
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full p-3 bg-gray-900 border border-gray-800 rounded text-white outline-none focus:border-[#95C8A1]"
          />
          
          <select 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-3 bg-gray-900 border border-gray-800 rounded text-white outline-none focus:border-[#95C8A1]"
          >
            <option value="Fiction">Fiction</option>
            <option value="Science">Science</option>
            <option value="History">History</option>
            <option value="Kids">Kids</option>
            <option value="Others">Others</option>
          </select>
          
          <input 
            type="number" 
            placeholder="Total Copies" 
            required 
            min="1"
            value={totalCopies} 
            onChange={(e) => setTotalCopies(e.target.value)}
            className="w-full p-3 bg-gray-900 border border-gray-800 rounded text-white outline-none focus:border-[#95C8A1]"
          />
          
          <input 
            type="url" 
            placeholder="Book Cover Image URL" 
            required 
            value={imageUrl} 
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full p-3 bg-gray-900 border border-gray-800 rounded text-white outline-none focus:border-[#95C8A1]"
          />
          
          <textarea 
            placeholder="Description" 
            required 
            rows={4}
            value={description} 
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 bg-gray-900 border border-gray-800 rounded text-white outline-none focus:border-[#95C8A1]"
          />

          <button 
            type="submit" 
            disabled={updating}
            className="w-full p-3 bg-[#95C8A1] text-black font-bold rounded hover:bg-[#7eb58c] transition disabled:opacity-50 mt-4"
          >
            {updating ? "Updating..." : "Update Book"}
          </button>
        </form>
      </div>
    </div>
  );
}

// 2. Wrap the page in Suspense for safe prerendering during builds
export default function UpdateBookPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#111812] text-[#95C8A1]">Loading...</div>}>
      <UpdateBookContent />
    </Suspense>
  );
}