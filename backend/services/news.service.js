import axios from "axios";
import { filterByQuery } from "./queryFilter.service.js";

export async function getNews(query) {
  const apiKey = process.env.NEWS_API_KEY;
  if (!apiKey) {
    throw new Error("NEWS_API_KEY is not configured");
  }

  const response = await axios.get("https://newsapi.org/v2/everything", {
    params: {
      q: query,
      apiKey,
    },
    timeout: 12000,
  });

  const articles = Array.isArray(response.data?.articles)
    ? response.data.articles
    : [];

  return {
    ...response.data,
    articles: filterByQuery(articles, query),
  };
}
