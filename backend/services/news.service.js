import axios from "axios";
import { filterByQuery } from "./queryFilter.service.js";

const NEWS_API_KEY = process.env.NEWS_API_KEY;

export async function getNews(query) {
  const response = await axios.get("https://newsapi.org/v2/everything", {
    params: {
      q: query,
      apiKey: NEWS_API_KEY,
    },
  });

  const articles = Array.isArray(response.data?.articles)
    ? response.data.articles
    : [];

  return {
    ...response.data,
    articles: filterByQuery(articles, query),
  };
}
