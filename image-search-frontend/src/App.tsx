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
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-8">
      <Header />

      <UploadForm
        onImageChange={(file) => setImage(file)}
        sku={sku}
        setSku={setSku}
        query={query}
        setQuery={setQuery}
        onSearch={handleSearch}
        loading={loading}
      />

      {result && <Results result={result} />}
    </div>
  );
}

export default App;
