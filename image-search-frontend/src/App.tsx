import axios from "axios";
import { useState } from "react";

const App = () => {
  const [file, setFile] = useState<File | null>(null);
  const [result, setReult] = useState<any>(null);

  const handleFileUpload = async() => {
    if(!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axios.post("http://localhost:3000/api/search", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setReult(response.data.match);
  }
  catch (error) {
      console.error("Error uploading file:", error);
    }
  }

  return (
 <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6">🧠 Image-based Product Search</h1>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="mb-4"
      />
      <button
        onClick={handleFileUpload}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg"
      >
        Search Product
      </button>

      {result && (
        <div className="mt-6 p-4 bg-white shadow rounded-xl">
          <h2 className="text-xl font-semibold">{result.name}</h2>
          <img
            src={`/${result.image}`}
            alt={result.name}
            className="w-48 mt-2 rounded-lg"
          />
          <p className="mt-2 text-gray-600">Similarity Score: {result.similarity.toFixed(2)}</p>
        </div>
      )}
    </div>
  );
}

export default App;