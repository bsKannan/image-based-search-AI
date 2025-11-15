import express from "express";
import cors from "cors";
import { initializeChromaDB } from "./services/chromaService.js";
import searchRoutes from "./routes/search.js";

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Routes
app.use("/api", searchRoutes);

// ✅ Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "🚀 Image Search AI Backend",
    version: "1.0.0",
    endpoints: {
      health: "GET /api/health",
      search: "POST /api/search",
    },
  });
});

// ✅ Initialize ChromaDB and start server
async function startServer() {
  try {
    // Initialize ChromaDB with product embeddings
    await initializeChromaDB();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📝 Environment: ${process.env.NODE_ENV || "development"}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
}

startServer();
