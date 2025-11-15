import React from "react";

const Header: React.FC = () => (
  <div className="w-full bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 text-white py-12 px-6 rounded-2xl shadow-2xl mb-8">
    <div className="max-w-4xl mx-auto text-center">
      <h1 className="text-5xl font-bold mb-3 flex items-center justify-center gap-3">
        <span className="text-6xl">🔍</span>
        Image-Based SKU Search
      </h1>
      <p className="text-lg text-blue-100 font-light">
        Upload an image to instantly find matching automotive products using AI-powered embeddings
      </p>
    </div>
  </div>
);

export default Header;
