"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";
import PrivateRoute from "@/components/PrivateRoute";

export default function AddBookPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("Fiction");
  const [totalCopies, setTotalCopies] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState(""); 

  useEffect(() => {
    document.title = "BookNook | Add a Book";
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Ask Next.js to generate a valid JWT for the logged-in user
      const jwtRes = await fetch("/api/jwt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: session?.user?.email }),
      });
      
      if (!jwtRes.ok) throw new Error("Failed to generate token");
      const jwtData = await jwtRes.json();
      const token = jwtData.token; 

      // 2. Construct the final book object using the pasted URL
      const bookData = {
        title,
        author,
        category,
        totalCopies: Number(totalCopies),
        description,
        image: imageUrl, 
        addedBy: {
          name: session?.user?.name,
          email: session?.user?.email
        }
      };

      // 3. Send to your Express backend with the generated token
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/books`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(bookData),
      });

      if (!res.ok) {
         const errorData = await res.json();
         throw new Error(errorData.message || "Failed to add book to database");
      }

      toast.success("Book added successfully!");
      router.push("/books");

    } catch (err: any) {
      toast.error(err.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PrivateRoute>
      <div className="min-h-screen bg-[#111812] py-12 px-6">
        <div className="max-w-xl mx-auto bg-[#1A241B] p-8 rounded-xl border border-gray-800">
          <h1 className="text-3xl font-serif text-[#95C8A1] text-center mb-8">Add a Book</h1>
          
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
              placeholder="Paste Book Cover Image URL (e.g., https://...)" 
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
            
            <input 
              type="text" 
              readOnly 
              value={session?.user?.name || "Loading..."} 
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded text-gray-400 cursor-not-allowed"
            />
            
            <input 
              type="email" 
              readOnly 
              value={session?.user?.email || "Loading..."} 
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded text-gray-400 cursor-not-allowed"
            />

            <button 
              type="submit" 
              disabled={loading}
              className="w-full p-3 bg-[#95C8A1] text-black font-bold rounded hover:bg-[#7eb58c] transition disabled:opacity-50 mt-4"
            >
              {loading ? "Adding Book..." : "Add Book"}
            </button>
          </form>
        </div>
      </div>
    </PrivateRoute>
  );
}