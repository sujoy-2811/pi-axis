# Architectural Detail Search & Ranking System

A full-stack application that allows users to search and discover architectural details based on text input and contextual information. Built for the PiAxis Junior Engineer Assignment.

**Tech Stack:**  
- **Backend:** Node.js + Express (port 3001)  
- **Frontend:** Next.js + TypeScript (port 3000)

## Setup Instructions

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** (comes with Node.js)

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd ai-ranking

# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

### Environment Variables

Before running the application, you need to configure your environment variables for the semantic search to work. 

1. Create a `.env` file in the root directory (or just rename `env.example` to `.env`).
2. Add your OpenRouter API key to the file:

```env
OPENROUTER_API_KEY=your_actual_api_key_here
```
*(The system will gracefully fall back to keyword-only search if this key is missing or invalid).*

### Running the Application

You need to run **both** the backend and frontend in separate terminals:

**Terminal 1 — Backend API (port 3001):**
```bash
npm start
```

**Terminal 2 — Frontend UI (port 3000):**
```bash
cd client
npm run dev
```

- **UI**: Open http://localhost:3000 in your browser
- **API**: POST requests to http://localhost:3001/search

## Project Structure

```
ai-ranking/
├── server.js              # Express API server
├── package.json           # Backend dependencies
├── data/
│   └── details.js         # In-memory data store (details + usage rules)
├── search/
│   └── engine.js          # Search & ranking engine (text + context matching)
└── client/                # Next.js + TypeScript frontend
    ├── src/
    │   ├── app/
    │   │   ├── page.tsx       # Main search page
    │   │   ├── layout.tsx     # Root layout with metadata
    │   │   └── globals.css    # Design system & styles
    │   ├── components/
    │   │   ├── SearchForm.tsx  # Search inputs & filters
    │   │   ├── ResultsList.tsx # Results container with states
    │   │   └── ResultCard.tsx  # Individual result card
    │   └── types/
    │       └── search.ts      # TypeScript interfaces
    └── package.json
```

## API Usage

### Endpoint

```
POST http://localhost:3001/search
Content-Type: application/json
```

All fields are optional. At least one must be provided.

### Example Requests

**Full search (query + context):**
```bash
curl -X POST http://localhost:3001/search \
  -H "Content-Type: application/json" \
  -d '{
    "query": "window drip",
    "host_element": "Window",
    "adjacent_element": "External Wall",
    "exposure": "External"
  }'
```

**Text query only:**
```bash
curl -X POST http://localhost:3001/search \
  -H "Content-Type: application/json" \
  -d '{"query": "wall junction"}'
```

**Context only:**
```bash
curl -X POST http://localhost:3001/search \
  -H "Content-Type: application/json" \
  -d '{"host_element": "External Wall", "exposure": "External"}'
```

### Example Response

```json
{
  "results": [
    {
      "detail_id": 2,
      "title": "Window Sill Detail with Drip",
      "score": 9,
      "rank": 1,
      "explanation": "Matched query 'window drip' (window, drip), Semantic similarity (+2), host_element=Window and adjacent_element=External Wall and exposure=External"
    }
  ]
}
```

## Scoring Logic

The search engine uses a **hybrid scoring system** combining semantic similarity, keyword matching, and context matching.

### Semantic Matching (0–4 points)
- Uses OpenRouter `text-embedding-ada-002` to generate vector embeddings for query and details.
- Cosine similarity is computed between the query embedding and each detail's full-text embedding.
- Similarity range `[0.70, 1.0]` is mapped to `[0, 4]` points.
- Handles spelling variations and partial words naturally via embeddings.
- Gracefully falls back to keyword-only search if the API is unavailable.

### Keyword Matching (+1 per keyword)
- Each query keyword is searched across `title`, `tags`, and `description` (combined text).
- +1 point per keyword found (substring match).
- Stop words (e.g., "with", "and", "the") are filtered out.

### Context Matching (per field)
| Field            | Points | Rationale                                          |
|------------------|--------|---------------------------------------------------|
| Host Element     | +2     | Primary element — strongest contextual signal      |
| Adjacent Element | +2     | Secondary element — narrows down detail relevance  |
| Exposure         | +1     | General classification — least specific             |

### Ranking
- Results are sorted by total score (descending)
- Top 5 results are always returned
- Ties are broken by detail ID (ascending)

---

## Engineering Questions

### 1. If this system needed to support 100,000+ details, what changes would you make?
- Migrate from in-memory arrays to a dedicated vector database (e.g., Pinecone, pgvector) for efficient similarity search.
- Implement server-side pagination with offset/limit parameters for search queries.
- Add a caching layer (Redis) for frequent queries to reduce embedding API costs.

### 2. What improvements would you make to the search or ranking logic in a production system?
- Fine-tune the embedding model on domain-specific architectural terminology for better semantic accuracy.
- Implement per-field weighted keyword scoring (e.g., title matches worth more than description matches).
- Add synonym expansion and stemming (e.g., "waterproofing" ↔ "waterproof") for broader recall.

### 3. What additional data or signals could help improve recommendation quality?
- Track user click-through rates and session data to boost frequently selected details.
- Incorporate project metadata like climate zones, building codes, and construction phases.
- Add detail relationships (which details are commonly used together) for "related details" suggestions.

### 4. If this API became a shared service used by multiple applications, what changes would you make to its architecture?
- Add API key or JWT-based authentication with rate limiting per client.
- Deploy behind a load balancer with horizontal scaling and a Redis caching layer.
- Version the API (e.g., `/v1/search`) and provide OpenAPI/Swagger documentation.

### 5. What would you change if this system needed to support AI-based recommendations in the future?
- The system already uses semantic embeddings (text-embedding-ada-002) — extend this with a reranking model (e.g., Cohere Rerank) for better precision.
- Add a feedback loop to collect user relevance judgments and fine-tune the model on architectural data.
- Implement a RAG (Retrieval-Augmented Generation) pipeline to generate natural language explanations for each match.
