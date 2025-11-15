import React from "react";

interface Props {
  onImageChange: (file: File | null) => void;
  sku: string;
  setSku: (s: string) => void;
  query: string;
  setQuery: (s: string) => void;
  onSearch: () => void;
  loading: boolean;
}

const UploadForm: React.FC<Props> = ({
  onImageChange,
  sku,
  setSku,
  query,
  setQuery,
  onSearch,
  loading,
}) => {
  return (
    <div className="bg-white p-6 shadow rounded w-96">
      <input
        type="file"
        accept="image/*"
        onChange={(e) => onImageChange(e.target.files?.[0] || null)}
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
        onClick={onSearch}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded w-full"
      >
        {loading ? "Analyzing..." : "Search"}
      </button>
    </div>
  );
};

export default UploadForm;
