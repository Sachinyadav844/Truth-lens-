import { getNews } from "./news.service.js";
import { getGovernmentNews } from "./government.service.js";
import { searchResearch } from "./research.service.js";
import { rankResults } from "./relevanceRanker.service.js";

// --------------------------------------------------
// Remove duplicate results
// --------------------------------------------------

function deduplicate(items) {
  const seen = new Set();

  return items.filter((item) => {
    const key = item.url || item.link || item.title?.toLowerCase().trim();

    // If there is no unique identifier,
    // keep the item instead of accidentally removing it.
    if (!key) {
      return true;
    }

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);

    return true;
  });
}

// --------------------------------------------------
// Normalize source name
// --------------------------------------------------

function normalizeSource(item, fallbackSource) {
  // NewsAPI:
  // source can be:
  // { id: "...", name: "BBC News" }

  if (typeof item.source === "object") {
    return item.source?.name || fallbackSource;
  }

  if (typeof item.source === "string") {
    return item.source;
  }

  return fallbackSource;
}

// --------------------------------------------------
// Normalize individual result
// --------------------------------------------------

function normalizeItem(item, source) {
  return {
    ...item,

    source: normalizeSource(item, source),

    title: item.title || item.name || "Untitled",

    description: item.description || item.abstract || "",

    url: item.url || item.link || item.doi || null,
  };
}

// --------------------------------------------------
// Search all external sources
// --------------------------------------------------

export async function searchAll(query) {
  if (!query || typeof query !== "string") {
    throw new Error("Search query is required");
  }

  const cleanQuery = query.trim();

  if (!cleanQuery) {
    throw new Error("Search query cannot be empty");
  }

  // ------------------------------------------------
  // Call all sources in parallel
  // ------------------------------------------------

  const results = await Promise.allSettled([
    getNews(cleanQuery),
    getGovernmentNews(cleanQuery),
    searchResearch(cleanQuery),
  ]);

  const sourceNames = ["NewsAPI", "PIB", "OpenAlex"];

  const combined = [];
  const failures = [];

  // ------------------------------------------------
  // Process every source result
  // ------------------------------------------------

  results.forEach((result, index) => {
    const sourceName = sourceNames[index];

    // ----------------------------------------------
    // Source successful
    // ----------------------------------------------

    if (result.status === "fulfilled") {
      const value = result.value;

      // Different services may return different
      // property names.
      //
      // NewsAPI       -> articles
      // PIB           -> articles
      // OpenAlex      -> papers
      //
      let items = [];

      if (Array.isArray(value?.articles)) {
        items = value.articles;
      } else if (Array.isArray(value?.papers)) {
        items = value.papers;
      } else if (Array.isArray(value?.data)) {
        items = value.data;
      }

      // Normalize every result
      const normalizedItems = items.map((item) =>
        normalizeItem(item, sourceName),
      );

      combined.push(...normalizedItems);

      console.log(` ${sourceName}: ${normalizedItems.length} results`);
    }

    // ----------------------------------------------
    // Source failed
    // ----------------------------------------------
    else {
      const errorMessage = result.reason?.message || "Unknown error";

      failures.push({
        source: sourceName,
        error: errorMessage,
      });

      console.error(` ${sourceName}: ${errorMessage}`);
    }
  });

  // ------------------------------------------------
  // Remove duplicates
  // ------------------------------------------------

  const uniqueResults = deduplicate(combined);

  // ------------------------------------------------
  // Rank results according to query
  // ------------------------------------------------

  const rankedResults = rankResults(cleanQuery, uniqueResults, 20);

  // ------------------------------------------------
  // Return final response
  // ------------------------------------------------

  return {
    query: cleanQuery,

    totalResults: rankedResults.length,

    results: rankedResults,

    failures,
  };
}
