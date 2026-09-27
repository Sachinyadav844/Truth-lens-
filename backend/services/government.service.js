import { filterByQuery } from "./queryFilter.service.js";

const PIB_URL = "https://pib.gov.in/RssMain.aspx?ModId=6&Lang=1&Regid=3";

// --------------------------------------------------
// PIB RSS fetch + query filtering
// --------------------------------------------------

async function fetchPIB(query = "") {
  const response = await fetch(PIB_URL, { signal: AbortSignal.timeout(12000) });

  if (!response.ok) {
    throw new Error(`PIB request failed: ${response.status}`);
  }

  const xml = await response.text();

  console.log("PIB response length:", xml.length);

  const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)];

  if (items.length === 0) {
    throw new Error("PIB RSS feed returned 0 articles");
  }

  // Convert XML items into normal JS objects
  const articles = items.map((match) => {
    const item = match[1];

    const getTag = (tag) => {
      const result = item.match(
        new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"),
      );

      return result ? result[1].replace(/<!\[CDATA\[|\]\]>/g, "").trim() : null;
    };

    return {
      title: getTag("title"),
      link: getTag("link"),
      description: getTag("description"),
      pubDate: getTag("pubDate"),
      source: "PIB",
    };
  });

  // -----------------------------------------------
  // No query → return all PIB articles
  // -----------------------------------------------

  if (!query || !query.trim()) {
    return articles;
  }

  // -----------------------------------------------
  // Query → filter relevant PIB articles
  // -----------------------------------------------

  const filteredArticles = filterByQuery(articles, query);

  console.log(
    `PIB articles: ${articles.length} → ${filteredArticles.length} relevant`,
  );

  return filteredArticles;
}

// --------------------------------------------------
// data.gov.in backup
// --------------------------------------------------

async function fetchDataGov(query = "") {
  const url = process.env.DATA_GOV_API_URL;
  const apiKey = process.env.DATA_GOV_API_KEY;

  if (!url || !apiKey) {
    throw new Error("data.gov.in credentials are not configured");
  }

  const separator = url.includes("?") ? "&" : "?";

  const response = await fetch(
    `${url}${separator}api-key=${encodeURIComponent(apiKey)}&format=json`,
    { signal: AbortSignal.timeout(12000) },
  );

  if (!response.ok) {
    throw new Error(`data.gov.in request failed: ${response.status}`);
  }

  const payload = await response.json();
  const records = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.records)
      ? payload.records
      : Array.isArray(payload?.data)
        ? payload.data
        : Array.isArray(payload?.results)
          ? payload.results
          : [];

  return {
    source: "data.gov.in",
    data: filterByQuery(records, query),
  };
}

// --------------------------------------------------
// Main government service
// --------------------------------------------------

export async function getGovernmentNews(query = "") {
  try {
    console.log("Trying PIB...");

    const articles = await fetchPIB(query);

    return {
      source: "PIB",
      articles,
    };
  } catch (pibError) {
    console.error("PIB failed:", pibError.message);

    console.log("Trying data.gov.in backup...");

    try {
      return await fetchDataGov(query);
    } catch (govError) {
      throw new Error(
        `Both government sources failed. ` +
          `PIB: ${pibError.message} | ` +
          `data.gov.in: ${govError.message}`,
      );
    }
  }
}
