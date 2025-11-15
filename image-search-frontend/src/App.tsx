import { useState } from "react";
import axios from "axios";
import Header from "./components/Header";
import UploadForm from "./components/UploadForm";
import Results from "./components/Results";

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
      const API_BASE = (import.meta.env.VITE_API_BASE as string) || "http://localhost:5000";
      const res = await axios.post(`${API_BASE}/api/search`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(res.data);
    } catch (err) {
      alert("Error during search.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex flex-col items-center p-4 sm:p-8">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
      </div>

      <div className="relative z-10 w-full max-w-2xl">
        <Header />

        <div className="flex justify-center mb-10">
          <UploadForm
            onImageChange={(file: File | null) => setImage(file)}
            sku={sku}
            setSku={setSku}
            query={query}
            setQuery={setQuery}
            onSearch={handleSearch}
            loading={loading}
          />
        </div>

        {result && (
          <div className="animate-fadeIn">
            <Results result={result} />
          </div>
        )}

        {!result && !loading && (
          <div className="text-center py-12 bg-white/40 backdrop-blur-sm rounded-2xl border border-white/20">
            <p className="text-gray-600 text-lg font-medium">
               Upload an image and enter a SKU to get started
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
