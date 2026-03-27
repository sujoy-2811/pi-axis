/** Shared types for the search API */

export interface SearchRequest {
  query?: string;
  host_element?: string;
  adjacent_element?: string;
  exposure?: string;
}

export interface SearchResult {
  detail_id: number;
  title: string;
  score: number;
  rank: number;
  explanation: string;
}

export interface SearchResponse {
  results: SearchResult[];
}

export interface SearchErrorResponse {
  error: string;
}
