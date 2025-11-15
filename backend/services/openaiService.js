import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Create embeddings for text input
 * @param {string} text - Text to embed
 * @returns {Promise<Array>} Embedding vector
 */
export async function createEmbedding(text) {
  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: text,
    });
    return response.data[0].embedding;
  } catch (error) {
    console.error("❌ Error creating embedding:", error.message);
    throw error;
  }
}

/**
 * Analyze image using GPT-4 Vision
 * @param {string} imagePath - Path to image file
 * @param {string} prompt - Custom prompt (optional)
 * @returns {Promise<string>} Image description
 */
export async function analyzeImage(imagePath, prompt = "Describe this automotive product.") {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            { type: "image_url", image_url: `file://${imagePath}` },
          ],
        },
      ],
    });
    return response.choices[0].message.content;
  } catch (error) {
    console.error("❌ Error analyzing image:", error.message);
    throw error;
  }
}

export default {
  createEmbedding,
  analyzeImage,
};
