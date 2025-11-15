import express from "express";
import path from "path";
import multer from "multer";
import { createEmbedding, analyzeImage } from "../services/openaiService.js";
import { querySimilarProducts } from "../services/chromaService.js";

const router = express.Router();
const upload = multer({ dest: process.env.UPLOAD_DIR || "uploads/" });

/**
 * POST /api/search
 * Upload an image and search for similar products in ChromaDB
 */
router.post("/search", upload.single("image"), async (req, res) => {
  try {
    const { sku, query } = req.body;
    const imagePath = req.file?.path;

    if (!imagePath) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    if (!sku) {
      return res.status(400).json({ error: "SKU is required" });
    }

    console.log(`🔍 Processing search for SKU: ${sku}`);

    // Step 1️⃣: Convert image → description using vision
    const imageDescription = await analyzeImage(
      path.resolve(imagePath),
      "Describe this automotive product."
    );
    console.log(`📸 Image described: ${imageDescription.substring(0, 50)}...`);

    // Step 2️⃣: Create embedding from description + query
    const embedding = await createEmbedding(
      `${imageDescription} ${query || ""}`
    );
    console.log("🧠 Embedding created");

    // Step 3️⃣: Query Chroma for similar products
    const results = await querySimilarProducts(embedding, 3);
    console.log(`✅ Found ${results.metadatas[0].length} similar products`);

    // Step 4️⃣: Determine best match
    const bestMatch = results.metadatas[0][0];
    const similarity = results.distances[0][0];
    const isMatch = bestMatch.sku === sku;

    res.json({
      uploadedSKU: sku,
      imageDescription,
      isMatch,
      similarity: (1 - similarity).toFixed(2),
      bestMatch,
      topResults: results.metadatas[0],
    });
  } catch (error) {
    console.error("❌ Error in search endpoint:", error);
    res.status(500).json({
      error: error.message || "Internal server error",
    });
  }
});

/**
 * GET /api/health
 * Health check endpoint
 */
router.get("/health", (req, res) => {
  res.json({ status: "✅ Server is running" });
});

export default router;
