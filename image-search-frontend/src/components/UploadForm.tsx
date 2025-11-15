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
    <div className="bg-white p-8 shadow-lg rounded-2xl w-full max-w-md border border-gray-200 hover:shadow-2xl transition-shadow duration-300">
      {/* File Upload */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          📷 Upload Image
        </label>
        <div className="relative p-[2px]">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => onImageChange(e.target.files?.[0] || null)}
            className="hidden"
            id="file-input"
          />
          <label
            htmlFor="file-input"
            className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-blue-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <span className="text-blue-600 font-medium p-[2px]">Click to upload or drag & drop</span>
          </label>
        </div>
      </div>

      {/* SKU Input */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2 p-[2px]">
          📦 SKU (Required)
        </label>
        <input
          type="text"
          placeholder="e.g., SKU1001"
          value={sku}
          onChange={(e) => setSku(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
      </div>

      {/* Query Input */}
      <div className="mb-8 p-[2px]">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          🔎 Additional Query (Optional)
        </label>
        <input
          type="text"
          placeholder="e.g., Honda Civic, Ceramic brakes"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
      </div>

      {/* Search Button */}
      <button
        onClick={onSearch}
        disabled={loading}
        className={`w-full px-6 py-3 rounded-lg font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2 ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg hover:scale-105 active:scale-95"
        }`}
      >
        {loading ? (
          <>
            <span className="animate-spin">⏳</span>
            Analyzing...
          </>
        ) : (
          <>
            <span>🚀</span>
            Search
          </>
        )}
      </button>
    </div>
  );
};

export default UploadForm;
