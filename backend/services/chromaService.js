import dotenv from "dotenv";
import { ChromaClient } from "chromadb";
import { createEmbedding } from "./openaiService.js";
import sampleProducts from "../data/products.js";

dotenv.config();

const chroma = new ChromaClient({ path: process.env.CROMADB_API_URL });
let collection = null;

/**
 * Initialize ChromaDB collection with product embeddings
 */
export async function initializeChromaDB() {
  try {
    collection = await chroma.getOrCreateCollection({
      name: "product_embeddings",
    });
    
    console.log("📝 Embedding sample products...");
    for (const product of sampleProducts) {
      const embedding = await createEmbedding(
        `${product.name} ${product.description}`
      );
      
      await collection.add({
        ids: [product.sku],
        embeddings: [embedding],
        metadatas: [product],
      });
    }
    console.log("✅ ChromaDB initialized with products");
    return collection;
  } catch (error) {
    console.error("❌ Error initializing ChromaDB:", error.message);
    throw error;
  }
}

/**
 * Get the initialized collection
 */
export function getCollection() {
  if (!collection) {
    throw new Error("ChromaDB not initialized. Call initializeChromaDB first.");
  }
  return collection;
}

/**
 * Query similar products by embedding
 * @param {Array} queryEmbedding - Embedding vector
 * @param {number} topN - Number of results
 * @returns {Promise<Object>} Query results
 */
export async function querySimilarProducts(queryEmbedding, topN = 3) {
  try {
    const col = getCollection();
    const results = await col.query({
      queryEmbeddings: [queryEmbedding],
      nResults: topN,
    });
    return results;
  } catch (error) {
    console.error("❌ Error querying similar products:", error.message);
    throw error;
  }
}

export default {
  initializeChromaDB,
  getCollection,
  querySimilarProducts,
};
