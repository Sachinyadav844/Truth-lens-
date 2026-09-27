const OPENALEX_URL = "https://api.openalex.org/works";

export async function searchResearch(query, limit = 5) {
  const apiKey = process.env.OPENALEX_API_KEY;

  if (!apiKey) {
    throw new Error("OPENALEX_API_KEY is not configured");
  }

  const url = new URL(OPENALEX_URL);

  url.searchParams.set("search", query);
  url.searchParams.set("per-page", limit);
  url.searchParams.set("api_key", apiKey);

  const response = await fetch(url);

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

    papers: data.results.map((paper) => ({
      title: paper.title,
      year: paper.publication_year,
      doi: paper.doi,
      url: paper.primary_location?.landing_page_url || paper.id,
      authors:
        paper.authorships?.map((author) => author.author?.display_name) || [],
    })),
  };
}
