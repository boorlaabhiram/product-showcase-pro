import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // Initialize Gemini AI Client lazily or when API key is available
  const getGenAIClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return null;
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  };

  // API Health Endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", name: "Showcasely API" });
  });

  // AI Shopping Assistant Endpoint
  app.post("/api/ai/assistant", async (req, res) => {
    try {
      const { prompt, contextProducts, mode } = req.body;

      if (!prompt) {
        return res.status(400).json({ error: "Prompt is required." });
      }

      const ai = getGenAIClient();

      if (!ai) {
        // Fallback intelligent response if Gemini API Key is not set
        return res.json({
          reply: `Here are my top recommendations on Showcasely for your query: "${prompt}". You can filter products by budget, brand, and key specifications in the catalog!`,
          recommendations: contextProducts ? contextProducts.slice(0, 3).map((p: any) => p.id) : [],
          isFallback: true,
        });
      }

      const systemPrompt = `You are Showcasely's AI Shopping Assistant, an expert in tech, smartphones, laptops, audio gear, and electronics in the Indian market.
Keep your answers helpful, concise, well-formatted, and accurate. All prices must be mentioned in Indian Rupees (₹).
Suggest relevant products from the provided context list if applicable. Always maintain a polite, tech-savvy persona.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: `User Query: ${prompt}\n\nMode: ${mode || "general_shopping_assistant"}`,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.7,
        },
      });

      const replyText = response.text || "I found several great products for you on Showcasely!";
      res.json({ reply: replyText, isFallback: false });
    } catch (err: any) {
      console.error("AI Assistant Error:", err);
      res.status(500).json({
        error: "Failed to generate AI response",
        reply: "I experienced an issue processing your query, but you can explore our curated hardware categories and specs above!",
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Showcasely Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
