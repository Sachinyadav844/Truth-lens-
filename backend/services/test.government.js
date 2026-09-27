//import "dotenv/config";
import { getGovernmentNews } from "./government.service.js";

async function test() {
  try {
    console.log("=== GOVERNMENT SERVICE TEST ===");

    const result = await getGovernmentNews();

    console.log("\n✅ SERVICE WORKING");
    console.log("Source:", result.source);

    if (result.articles) {
      console.log("Articles:", result.articles.length);

      console.log("\nFirst 3 articles:\n");

      result.articles.slice(0, 3).forEach((article, index) => {
        console.log(`${index + 1}. ${article.title}`);
        console.log(`   ${article.link}`);
        console.log(`   ${article.pubDate}\n`);
      });
    } else {
      console.log("Backup API response:");
      console.log(JSON.stringify(result.data, null, 2));
    }
  } catch (error) {
    console.error("\n❌ GOVERNMENT SERVICE FAILED");
    console.error(error.message);
  }
}

test();
