import "dotenv/config";
import express from "express";
import cors from "cors";
import { search, getDetailEmbeddings } from "./search/engine.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.post("/search", async (req, res) => {
  try {
    const { query, host_element, adjacent_element, exposure } = req.body;

    const hasInput = query || host_element || adjacent_element || exposure;
    if (!hasInput) {
      return res.status(400).json({
        error: "At least one search parameter is required (query, host_element, adjacent_element, or exposure)",
      });
    }

    const fields = { query, host_element, adjacent_element, exposure };
    for (const [key, value] of Object.entries(fields)) {
      if (value !== undefined && value !== null && typeof value !== "string") {
        return res.status(400).json({
          error: `Field '${key}' must be a string`,
        });
      }
    }

    const sanitized = {
      query: query?.trim() || "",
      host_element: host_element?.trim() || "",
      adjacent_element: adjacent_element?.trim() || "",
      exposure: exposure?.trim() || "",
    };

    const results = await search(sanitized);

    return res.json({ results });
  } catch (err) {
    console.error("Search error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`\n🏗️  Architectural Detail Search API`);
  console.log(`   Server running at http://localhost:${PORT}`);
  console.log(`   API endpoint:    POST http://localhost:${PORT}/search`);
  console.log(`   Search mode:     Semantic (OpenRouter embeddings)\n`);

  getDetailEmbeddings()
    .then(() => console.log("   ✅ Ready for search requests.\n"))
    .catch((err) => {
      console.error("⚠️  Warning: Failed to pre-build semantic index:", err.message);
      console.error("   Index will be built on first search request.\n");
    });
});
