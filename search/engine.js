import "dotenv/config";
import OpenAI from "openai";
import { details, usageRules } from "../data/details.js";

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY || process.env.AI_KEY,
  timeout: 15000,
});

const EMBEDDING_MODEL = "openai/text-embedding-ada-002";
const STOP_WORDS = new Set(["with", "and", "the", "for", "at", "in", "of", "a", "an", "to", "is", "its"]);

let detailEmbeddingsCache = null;

function cosineSimilarity(a, b) {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  return denom === 0 ? 0 : dot / denom;
}

async function getDetailEmbeddings() {
  if (detailEmbeddingsCache) return detailEmbeddingsCache;
  if (detailEmbeddingsCache === false) return null;

  console.log("🔄 Building semantic index...");
  try {
    const texts = details.map((d) => `${d.title}. ${d.description}. Tags: ${d.tags.join(", ")}.`);
    const response = await client.embeddings.create({ model: EMBEDDING_MODEL, input: texts });
    detailEmbeddingsCache = details.map((detail, i) => ({
      detail,
      embedding: response.data[i].embedding,
    }));
    console.log(`✅ Semantic index built for ${detailEmbeddingsCache.length} details.\n`);
    return detailEmbeddingsCache;
  } catch (err) {
    console.warn(`⚠️  Semantic index unavailable (${err.message}). Using keyword + context scoring.\n`);
    detailEmbeddingsCache = false;
    return null;
  }
}

function semanticScore(queryEmbedding, detailEmbedding) {
  if (!queryEmbedding || !detailEmbedding) return 0;
  const sim = cosineSimilarity(queryEmbedding, detailEmbedding);
  return Math.round(Math.max(0, (sim - 0.70) / 0.30 * 4));
}

function keywordScore(detail, query) {
  if (!query) return { score: 0, matchedKeywords: [] };
  const keywords = query.toLowerCase().split(/\s+/).filter((w) => w.length > 1 && !STOP_WORDS.has(w));
  const searchText = `${detail.title} ${detail.description} ${detail.tags.join(" ")}`.toLowerCase();
  const matchedKeywords = keywords.filter((kw) => searchText.includes(kw));
  return { score: matchedKeywords.length, matchedKeywords };
}

function contextScore(detail, { host_element, adjacent_element, exposure }) {
  let score = 0;
  const matchedFields = [];
  const rule = usageRules.find((r) => r.detail_id === detail.id);
  if (!rule) return { score: 0, matchedFields: [] };

  if (host_element && rule.host_element.toLowerCase() === host_element.toLowerCase()) {
    score += 2; matchedFields.push(`host_element=${host_element}`);
  }
  if (adjacent_element && rule.adjacent_element.toLowerCase() === adjacent_element.toLowerCase()) {
    score += 2; matchedFields.push(`adjacent_element=${adjacent_element}`);
  }
  if (exposure && rule.exposure.toLowerCase() === exposure.toLowerCase()) {
    score += 1; matchedFields.push(`exposure=${exposure}`);
  }
  return { score, matchedFields };
}

async function search({ query, host_element, adjacent_element, exposure }) {
  const context = { host_element, adjacent_element, exposure };

  let queryEmbedding = null;
  const index = await getDetailEmbeddings();
  if (query?.trim() && index) {
    try {
      const response = await client.embeddings.create({ model: EMBEDDING_MODEL, input: query.trim() });
      queryEmbedding = response.data[0].embedding;
    } catch {}
  }

  const results = details.map((detail, i) => {
    const detailEmb = index ? index[i]?.embedding : null;
    const semScore  = semanticScore(queryEmbedding, detailEmb);
    const kwResult  = keywordScore(detail, query);
    const ctxResult = contextScore(detail, context);

    const totalScore = semScore + kwResult.score + ctxResult.score;

    const parts = [];
    if (kwResult.matchedKeywords.length) {
      parts.push(`Matched query '${query}' (${kwResult.matchedKeywords.map((k) => `${k}`).join(", ")})`);
    }
    if (semScore > 0) parts.push(`Semantic similarity (+${semScore})`);
    if (ctxResult.matchedFields.length) {
      parts.push(ctxResult.matchedFields.join(" and "));
    }

    return {
      detail_id: detail.id,
      title: detail.title,
      score: totalScore,
      explanation: parts.length ? parts.join(", ") : "No significant match found.",
    };
  });

  results.sort((a, b) => b.score - a.score || a.detail_id - b.detail_id);
  return results.slice(0, 5).map((r, i) => ({ ...r, rank: i + 1 }));
}

export { search, getDetailEmbeddings };
