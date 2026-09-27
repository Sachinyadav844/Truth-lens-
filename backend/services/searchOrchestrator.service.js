import { getNews } from "./news.service.js";
import { getGovernmentNews } from "./government.service.js";
import { searchResearch } from "./research.service.js";
import { rankResults } from "./relevanceRanker.service.js";

// --------------------------------------------------
// Remove duplicate results
// --------------------------------------------------

function normalizeKey(value = '') {
  return String(value).toLowerCase().replace(/\s+/g, ' ').trim();
}

function deduplicate(items) {
  const seen = new Set();

  return items.filter((item) => {
    const url = normalizeKey(item.url);
    const title = normalizeKey(item.title);
    const source = normalizeKey(item.source);
    const content = normalizeKey(item.content || item.description || item.abstract);
    const key = url || (title && `${title}|${source}`) || (content && `content|${content.slice(0, 240)}`);

    if (!key || seen.has(key)) return false;
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
  if (!item || typeof item !== "object" || Array.isArray(item)) return null;

  return {
    ...item,

    source: normalizeSource(item, source),
    sourceType: source === 'OpenAlex' ? 'research' : source === 'PIB' || source === 'data.gov.in' ? 'government' : 'news',

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
  const providerStatuses = [];

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
      const normalizedItems = items
        .map((item) => normalizeItem(item, sourceName))
        .filter(Boolean);

      combined.push(...normalizedItems);
      providerStatuses.push({ provider: sourceName, status: 'ok', results: normalizedItems.length });

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
      providerStatuses.push({ provider: sourceName, status: 'failed', results: 0, error: errorMessage });

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
    providerStatuses,
  };
}

export async function orchestrateSearch(query) {
  const { results, failures, providerStatuses } = await searchAll(query);
  return { sources: results, failures, providerStatuses };
}
