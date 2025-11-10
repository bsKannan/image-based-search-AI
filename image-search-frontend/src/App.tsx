import React, { useState, useEffect } from "react";
import axios from "axios";

type Match = {
  id: number;
  name: string;
  description?: string;
  image: string;
  similarity: number;
};

export default function App() {
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [matches, setMatches] = useState<Match[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:3000/api/products").then(res => {
      setProducts(res.data.products || []);
    }).catch(console.error);
  }, []);

  const onUpload = async () => {
    if (!file) return alert("Choose an image file first");
    setLoading(true);
    const form = new FormData();
    form.append("image", file);
    if (caption) form.append("caption", caption);

    try {
      const res = await axios.post("http://localhost:3000/api/search", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMatches(res.data.matches || []);
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.error || err.message || "Search failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow">
        <h1 className="text-2xl font-bold mb-4">Image-based Product Search</h1>

        <div className="mb-4">
          <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        </div>

        <div className="mb-4">
          <input
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Optional: give a short caption to help search (e.g. 'brake pad front')"
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="flex gap-3">
          <button onClick={onUpload} className="px-4 py-2 bg-blue-600 text-white rounded" disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </button>
          <button onClick={() => { setFile(null); setCaption(""); setMatches([]); }} className="px-4 py-2 border rounded">
            Reset
          </button>
        </div>

        <hr className="my-6" />

        <h2 className="text-lg font-semibold mb-2">Product catalog</h2>
        <div className="grid grid-cols-3 gap-4 mb-6">
          {products.map(p => (
            <div key={p.image} className="p-2 border rounded text-center">
              <img src={`http://localhost:3000${p.image}`} alt={p.name} className="h-24 mx-auto object-contain" />
              <div className="mt-2 text-sm">{p.name}</div>
            </div>
          ))}
        </div>

        <h2 className="text-lg font-semibold mb-2">Matches</h2>
        <div className="grid grid-cols-2 gap-4">
          {matches.map(m => (
            <div key={m.id} className="p-3 border rounded">
              <img src={`http://localhost:3000${m.image}`} alt={m.name} className="h-28 mx-auto object-contain" />
              <div className="mt-2 font-medium">{m.name}</div>
              <div className="text-sm text-gray-600">{m.description}</div>
              <div className="mt-1 text-sm">Similarity: {m.similarity ? m.similarity.toFixed(3) : "N/A"}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
