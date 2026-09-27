import "dotenv/config";
import { getNews } from "./news.service.js";

const result = await getNews("technology");

console.log(result);
