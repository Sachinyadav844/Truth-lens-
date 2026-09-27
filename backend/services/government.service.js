const PIB_URL = "https://pib.gov.in/RssMain.aspx?ModId=6&Lang=1&Regid=3";

async function fetchPIB() {
  const response = await fetch(PIB_URL);

  if (!response.ok) {
    throw new Error(`PIB request failed: ${response.status}`);
  }

  const xml = await response.text();

  console.log("PIB response length:", xml.length);

  const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)];

  if (items.length === 0) {
    throw new Error("PIB RSS feed returned 0 articles");
  }

  return items.map((match) => {
    const item = match[1];

    const getTag = (tag) => {
      const result = item.match(
        new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"),
      );

      return result ? result[1].replace(/<!\[CDATA\[|\]\]>/g, "").trim() : null;
    };

    return {
      title: getTag("title"),
      description: getTag("description"),
      link: getTag("link"),
      pubDate: getTag("pubDate"),
      source: "PIB",
    };
  });
}

async function fetchDataGov() {
  const url = process.env.DATA_GOV_API_URL;
  const apiKey = process.env.DATA_GOV_API_KEY;

  if (!url || !apiKey) {
    throw new Error("data.gov.in credentials are not configured");
  }

  const separator = url.includes("?") ? "&" : "?";

  const response = await fetch(
    `${url}${separator}api-key=${encodeURIComponent(apiKey)}&format=json`,
  );

  if (!response.ok) {
    throw new Error(`data.gov.in request failed: ${response.status}`);
  }

  const data = await response.json();

  return {
    source: "data.gov.in",
    data,
  };
}

export async function getGovernmentNews() {
  try {
    console.log("Trying PIB...");

    const data = await fetchPIB();

    return {
      source: "PIB",
      articles: data,
    };
  } catch (pibError) {
    console.error("PIB failed:", pibError.message);
    console.log("Trying data.gov.in backup...");

    try {
      return await fetchDataGov();
    } catch (govError) {
      throw new Error(
        `Both government sources failed. PIB: ${pibError.message} | data.gov.in: ${govError.message}`,
      );
    }
  }
}
