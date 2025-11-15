import React from "react";

interface Props {
  result: any;
}

const Results: React.FC<Props> = ({ result }) => {
  if (!result) return null;

  return (
    <div className="mt-8 bg-white shadow p-6 rounded w-[500px]">
      <h2 className="text-xl font-semibold mb-4">Results</h2>
      <p>
        <b>Uploaded SKU:</b> {result.uploadedSKU}
      </p>
      <p>
        <b>Match:</b> {result.isMatch ? "✅ True" : "❌ False"}
      </p>
      <p>
        <b>Similarity:</b> {result.similarity}
      </p>
      <p>
        <b>Description:</b> {result.imageDescription}
      </p>

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
  );
};

export default Results;
