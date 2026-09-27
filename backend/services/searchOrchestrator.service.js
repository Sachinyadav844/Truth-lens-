import { getNews } from "./news.service.js";
import { getGovernmentNews } from "./government.service.js";
import { searchResearch } from "./research.service.js";

function deduplicate(items) {
  const seen = new Set();

  return items.filter((item) => {
    const key = item.url || item.link || item.title?.toLowerCase().trim();

    if (!key || seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

export async function searchAll(query) {
  const results = await Promise.allSettled([
    getNews(query),
    getGovernmentNews(query),
    searchResearch(query),
  ]);

  const sources = ["news", "government", "research"];

  const combined = [];
  const failures = [];

  results.forEach((result, index) => {
    const source = sources[index];

    if (result.status === "fulfilled") {
      const value = result.value;

      const items = value.articles || value.papers || value.data || [];

      combined.push(
        ...items.map((item) => ({
          ...item,
          source:
            typeof item.source === "object"
              ? item.source?.name
              : item.source || value.source || source,
        })),
      );
    } else {
      failures.push({
        source,
        error: result.reason?.message || "Unknown error",
      });
    }
  });

  return {
    query,
    results: deduplicate(combined),
    failures,
  };
}
