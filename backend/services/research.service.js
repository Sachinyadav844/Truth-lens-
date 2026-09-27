const OPENALEX_URL = "https://api.openalex.org/works";

function decodeAbstract(invertedIndex) {
  if (!invertedIndex || typeof invertedIndex !== "object") return "";
  const words = [];
  for (const [word, positions] of Object.entries(invertedIndex)) {
    if (!Array.isArray(positions)) continue;
    for (const position of positions) {
      if (Number.isInteger(position) && position >= 0) words[position] = word;
    }
  }
  return words.filter(Boolean).join(" ");
}

export async function searchResearch(query, limit = 5) {
  const apiKey = process.env.OPENALEX_API_KEY;

  if (!apiKey) {
    throw new Error("OPENALEX_API_KEY is not configured");
  }

  const url = new URL(OPENALEX_URL);

  url.searchParams.set("search", query);
  url.searchParams.set("per-page", limit);
  url.searchParams.set("api_key", apiKey);

  const response = await fetch(url, { signal: AbortSignal.timeout(12000) });

  if (response.status === 429) {
    throw new Error("OpenAlex rate limit exceeded");
  }

  if (!response.ok) {
    throw new Error(`OpenAlex request failed: ${response.status}`);
  }

  const data = await response.json();

  return {
    source: "OpenAlex",
    query,
    total: data.meta?.count || 0,

    papers: (Array.isArray(data.results) ? data.results : []).filter((paper) => paper && typeof paper === "object").map((paper) => ({
      title: paper.title,
      year: paper.publication_year,
      doi: paper.doi,
      url: paper.primary_location?.landing_page_url || paper.id,
      abstract: decodeAbstract(paper.abstract_inverted_index),
      authors:
        paper.authorships?.map((author) => author.author?.display_name) || [],
    })),
  };
}
