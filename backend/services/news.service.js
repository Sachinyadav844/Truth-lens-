import axios from "axios";

const NEWS_API_KEY = process.env.NEWS_API_KEY;

export async function getNews(query) {
  const response = await axios.get("https://newsapi.org/v2/everything", {
    params: {
      q: query,
      apiKey: NEWS_API_KEY,
    },
  });

  return response.data;
}
