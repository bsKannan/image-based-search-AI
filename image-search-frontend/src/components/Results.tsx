import React from "react";

interface Props {
  result: any;
}

const Results: React.FC<Props> = ({ result }) => {
  if (!result) return null;

  return (
    <div className="mt-10 w-full max-w-2xl">
      {/* Main Results Card */}
      <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-200 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-4xl">✨</span>
          <h2 className="text-3xl font-bold text-gray-800">Search Results</h2>
        </div>

        {/* Result Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Uploaded SKU */}
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
            <p className="text-sm text-gray-600 font-medium">📦 Uploaded SKU</p>
            <p className="text-2xl font-bold text-blue-600">{result.uploadedSKU}</p>
          </div>

          {/* Match Status */}
          <div className={`p-4 rounded-xl border-2 ${result.isMatch ? "bg-green-50 border-green-300" : "bg-red-50 border-red-300"}`}>
            <p className="text-sm text-gray-600 font-medium">✅ Match Status</p>
            <p className={`text-2xl font-bold ${result.isMatch ? "text-green-600" : "text-red-600"}`}>
              {result.isMatch ? "✅ Match Found!" : "❌ No Match"}
            </p>
          </div>

          {/* Similarity Score */}
          <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
            <p className="text-sm text-gray-600 font-medium">📊 Similarity</p>
            <div className="flex items-end gap-2">
              <p className="text-3xl font-bold text-purple-600">{result.similarity}</p>
              <span className="text-xl mb-1">/ 1.0</span>
            </div>
            {/* Similarity bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all"
                style={{ width: `${parseFloat(result.similarity) * 100}%` }}
              />
            </div>
          </div>

          {/* Best Match Product */}
          <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
            <p className="text-sm text-gray-600 font-medium">🎯 Best Match</p>
            <p className="text-lg font-bold text-amber-700">{result.bestMatch?.name}</p>
            <p className="text-sm text-amber-600">{result.bestMatch?.sku}</p>
          </div>
        </div>

        {/* Image Description */}
        <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
          <p className="text-sm font-semibold text-gray-700 mb-2">📝 Image Description</p>
          <p className="text-gray-700 leading-relaxed">{result.imageDescription}</p>
        </div>
      </div>

      {/* Top Results Grid */}
      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <span>🏆</span>
          Top Matching Products
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {result.topResults?.map((item: any, index: number) => (
            <div
              key={item.sku}
              className={`group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border-2 ${
                index === 0
                  ? "border-yellow-400 md:col-span-2 md:flex"
                  : "border-gray-200"
              }`}
            >
              {/* Image Container */}
              <div className="relative overflow-hidden bg-gray-100 flex-shrink-0 md:w-48 h-48">
                <img
                  src={`/assets/${item.image}`}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://via.placeholder.com/200?text=Image+Not+Found";
                  }}
                />
                {index === 0 && (
                  <div className="absolute top-2 left-2 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-sm font-bold">
                    🥇 #1 Match
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className={`p-4 flex flex-col justify-between ${index === 0 ? "flex-1" : ""}`}>
                <div>
                  <p className="font-bold text-gray-800 text-lg mb-1">{item.name}</p>
                  <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                    {item.sku}
                  </span>
                  {index === 0 && (
                    <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">
                      ✓ Best
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Results;
