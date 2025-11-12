import express from "express";
import multer from "multer";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import { ChromaClient } from "chromadb";
import fs from "fs";
import path from "path";

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;
const upload = multer({ dest: "uploads/" });

app.use(cors());
app.use(express.json());

// ✅ Initialize OpenAI + ChromaDB
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const chroma = new ChromaClient({ path: process.env.CROMADB_API_URL });

// ✅ Sample product data
const sampleProducts = [
  {
    sku: "SKU1001",
    name: "Brake Pad",
    description: "Ceramic brake pad for sedans",
    image: "brake.jpg",
  },
  {
    sku: "SKU1002",
    name: "Oil Filter",
    description: "Spin-on engine oil filter",
    image: "oil_filter.jpg",
  },
  {
    sku: "SKU1003",
    name: "Air Filter",
    description: "Rectangular air intake filter",
    image: "air_filter.jpg",
  },
  {
    sku: "SKU1004",
    name: "Fuel Filter",
    description: "Inline diesel fuel filter",
    image: "fuel_filter.jpg",
  },
  {
    sku: "SKU1005",
    name: "Cabin Filter",
    description: "AC cabin air filter for cars",
    image: "cabin_filter.jpg",
  },
];

// ✅ Create Chroma Collection
let collection;
async function initChroma() {
  collection = await chroma.getOrCreateCollection({ name: "product_embeddings" });
  for (const item of sampleProducts) {
    const embedding = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: `${item.name} ${item.description}`,
    });
    await collection.add({
      ids: [item.sku],
      embeddings: [embedding.data[0].embedding],
      metadatas: [item],
    });
  }
  console.log("✅ Sample products embedded in ChromaDB");
}
initChroma();

// ✅ Upload + Search Endpoint
app.post("/api/search", upload.single("image"), async (req, res) => {
  try {
    const { sku, query } = req.body;
    const imagePath = req.file?.path;

    // Step 1️⃣ Convert image → description
    const vision = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "Describe this automotive product." },
            { type: "image_url", image_url: `file://${path.resolve(imagePath)}` },
          ],
        },
      ],
    });
    const description = vision.choices[0].message.content;

    // Step 2️⃣ Create embedding from description
    const embedding = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: `${description} ${query || ""}`,
    });

    // Step 3️⃣ Query Chroma for similar products
    const results = await collection.query({
      queryEmbeddings: [embedding.data[0].embedding],
      nResults: 3,
    });

    // Step 4️⃣ Determine best match
    const best = results.metadatas[0][0];
    const similarity = results.distances[0][0];
    const isMatch = best.sku === sku;

    res.json({
      uploadedSKU: sku,
      imageDescription: description,
      isMatch,
      similarity: (1 - similarity).toFixed(2),
      bestMatch: best,
      topResults: results.metadatas[0],
    });
  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
