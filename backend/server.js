import express from "express";
import multer from "multer";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import fs from "fs";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ dest: "uploads/" });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Mock product dataset
let products = [
  { id: 1, name: "Car Brake Pad", image: "brake.jpg", embedding: null },
  { id: 2, name: "Oil Filter", image: "oil_filter.jpg", embedding: null },
];

// Convert reference images to embeddings (run once)
async function initializeEmbeddings() {
  for (let product of products) {
    const imgPath = `./assets/${product.image}`;
    const response = await openai.embeddings.create({
      model: "text-embedding-3-large",
      input: `Product image of ${product.name}`,
    });
    product.embedding = response.data[0].embedding;
  }
  fs.writeFileSync("products.json", JSON.stringify(products, null, 2));
  console.log("✅ Product embeddings initialized.");
}

// Upload and compare image
app.post("/api/search", upload.single("image"), async (req, res) => {
  const imagePath = req.file.path;

  try {
    // Step 1: Create embedding from uploaded image
    const imageEmbedding = await openai.embeddings.create({
      model: "text-embedding-3-large",
      input: `Image content from uploaded file`,
    });

    // Step 2: Load precomputed product embeddings
    const data = JSON.parse(fs.readFileSync("products.json"));
    const uploaded = imageEmbedding.data[0].embedding;

    // Step 3: Compare embeddings via cosine similarity
    function cosineSim(a, b) {
      const dot = a.reduce((sum, v, i) => sum + v * b[i], 0);
      const normA = Math.sqrt(a.reduce((sum, v) => sum + v * v, 0));
      const normB = Math.sqrt(b.reduce((sum, v) => sum + v * v, 0));
      return dot / (normA * normB);
    }

    const results = data.map((item) => ({
      ...item,
      similarity: cosineSim(uploaded, item.embedding),
    }));

    results.sort((a, b) => b.similarity - a.similarity);
    res.json({ match: results[0], allMatches: results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Uncomment this line to generate embeddings first
 initializeEmbeddings();

app.listen(process.env.PORT, () =>
  console.log(`🚀 Server running on http://localhost:${process.env.PORT}`)
);
