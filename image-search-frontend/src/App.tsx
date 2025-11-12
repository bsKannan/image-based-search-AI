import React, { useState } from "react";
import axios from "axios";

function App() {
  const [image, setImage] = useState<File | null>(null);
  const [sku, setSku] = useState("");
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!image || !sku) {
      alert("Please upload an image and enter SKU!");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);
    formData.append("sku", sku);
    formData.append("query", query);

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/search", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(res.data);
    } catch (err) {
      alert("Error during search.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-8">
      <h1 className="text-3xl font-bold mb-6">🔍 Image-Based SKU Search</h1>

      <div className="bg-white p-6 shadow rounded w-96">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
          className="mb-4 w-full"
        />
        <input
          type="text"
          placeholder="Enter SKU (e.g., SKU1001)"
          value={sku}
          onChange={(e) => setSku(e.target.value)}
          className="border p-2 rounded w-full mb-4"
        />
        <input
          type="text"
          placeholder="Optional query (e.g., Honda Civic)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border p-2 rounded w-full mb-4"
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
          {loading ? "Analyzing..." : "Search"}
        </button>
      </div>

      {result && (
        <div className="mt-8 bg-white shadow p-6 rounded w-[500px]">
          <h2 className="text-xl font-semibold mb-4">Results</h2>
          <p><b>Uploaded SKU:</b> {result.uploadedSKU}</p>
          <p><b>Match:</b> {result.isMatch ? "✅ True" : "❌ False"}</p>
          <p><b>Similarity:</b> {result.similarity}</p>
          <p><b>Description:</b> {result.imageDescription}</p>

          <div className="mt-4 grid grid-cols-3 gap-3">
            {result.topResults?.map((item: any) => (
              <div key={item.sku} className="border rounded p-2 text-center">
                <img
                  src={`/assets/${item.image}`}
                  alt={item.name}
                  className="w-full h-24 object-cover rounded"
                />
                <p className="font-bold">{item.name}</p>
                <p>{item.sku}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
