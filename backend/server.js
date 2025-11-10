import express from "express";
import multer from "multer";
import cors from "cors";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const PORT = process.env.PORT || 3000;
const UPLOAD_DIR = process.env.UPLOAD_DIR || "uploads";
const ASSETS_DIR = process.env.ASSETS_DIR || "assets";
const VECTOR_DB_PATH = process.env.VECTOR_DB_PATH || "./products.json";

if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const upload = multer({ dest: UPLOAD_DIR });
const app = express();
app.use(cors());
app.use(express.json());
app.use("/assets", express.static(path.join(process.cwd(), ASSETS_DIR)));
app.use("/uploads", express.static(path.join(process.cwd(), UPLOAD_DIR)));

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ------ Utility: cosine similarity ------
function cosineSim(a, b) {
  if (!a || !b || a.length !== b.length) return -1;
  let dot = 0,
    na = 0,
    nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  na = Math.sqrt(na);
  nb = Math.sqrt(nb);
  if (na === 0 || nb === 0) return -1;
  return dot / (na * nb);
}

// ------ Load / save product DB ------
function loadProducts() {
  const raw = fs.readFileSync(VECTOR_DB_PATH, "utf8");
  return JSON.parse(raw);
}
function saveProducts(products) {
  fs.writeFileSync(VECTOR_DB_PATH, JSON.stringify(products, null, 2));
}

// ------ Initialize embeddings for the dataset (run once) ------
async function initializeEmbeddings() {
  console.log("Initializing embeddings for products...");
  const products = loadProducts();

  for (let p of products) {
    if (p.embedding && Array.isArray(p.embedding)) continue; // already has embedding
    // We create a short textual prompt from product name + description.
    const text = `${p.name}. ${p.description || ""}`.trim();

    // Use a text embedding model. Replace model if you want a different one.
    const resp = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: text,
    });

    p.embedding = resp.data[0].embedding;
    console.log(` -> embedded product ${p.id} "${p.name}"`);
    // friendly rate limit pause
    await new Promise((r) => setTimeout(r, 250));
  }

  saveProducts(products);
  console.log("Embeddings initialized and saved to products.json");
}

// Uncomment to run initialize on server start once (or run with an endpoint).
// initializeEmbeddings().catch(console.error);

// ------ Endpoint: trigger initialization (one-off) ------
app.post("/api/init-embeddings", async (req, res) => {
  try {
    await initializeEmbeddings();
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || String(err) });
  }
});

// ------ Endpoint: search by uploaded image ------
/*
  Flow:
  1. Client uploads an image file.
  2. Server saves upload -> derives a textual "caption" prompt (simple, from filename or optional user text).
  3. Server creates embedding for the caption (text-embedding).
  4. Server computes cosine similarity vs product embeddings and returns top matches.

  NOTE:
  - This example uses text embeddings derived from a caption/filename.
  - For true image-based embeddings (image -> embedding), replace the caption step
    with a vision-capable API call that returns an image embedding (model dependent).
*/
app.post("/api/search", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${
      req.file.filename
    }`;
    // Basic caption: use filename (without extension) or optional user-provided `caption`
    const userCaption = req.body.caption?.trim();
    let caption =
      userCaption ||
      path.parse(req.file.originalname).name.replace(/[_-]/g, " ");

    // OPTIONAL: If you want better captions, you can call an LLM to describe the image.
    // Example approach (pseudocode):
    //  const captionResp = await openai.responses.create({
    //    model: "gpt-4o-mini",
    //    input: [{ type: "image_url", image_url: fileUrl }, { type: "text", text: "Describe this image in one short sentence." }]
    //  });
    // Then set caption = captionResp.output_text (adapt to actual SDK signature).
    //
    // NOTE: above is a placeholder; exact image->text usage depends on model/SDK capabilities.
    //
    // For this sample we rely on filename or user caption.

    // Create embedding for the caption (text embedding)
    const embResp = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: caption,
    });
    const queryEmbedding = embResp.data[0].embedding;

    // Load product DB
    const products = loadProducts();

    // Compute similarity
    const results = products.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      image: `/assets/${p.image}`,
      similarity: p.embedding ? cosineSim(queryEmbedding, p.embedding) : -1,
    }));

    // Sort (descending similarity) and return top 5
    results.sort((a, b) => b.similarity - a.similarity);
    const top = results.slice(0, 5);

    res.json({
      queryCaption: caption,
      uploadedFile: fileUrl,
      matches: top,
    });
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ error: err.message || String(err) });
  }
});

// ------ Endpoint: list products ------
app.get("/api/products", (req, res) => {
  try {
    const products = loadProducts().map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      image: `/assets/${p.image}`,
    }));
    res.json({ products });
  } catch (err) {
    res.status(500).json({ error: err.message || String(err) });
  }
});

app.listen(PORT, () =>
  console.log(`Backend running on http://localhost:${PORT}`)
);
