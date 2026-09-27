import "dotenv/config";
import { searchResearch } from "./research.service.js";

async function test() {
  try {
    console.log("=== RESEARCH SERVICE TEST ===");

    const result = await searchResearch(
      "artificial intelligence misinformation",
      5,
    );

    console.log("\n✅ SERVICE WORKING");
    console.log("Source:", result.source);
    console.log("Total:", result.total);

    result.papers.forEach((paper, index) => {
      console.log(`\n${index + 1}. ${paper.title}`);
      console.log(`Year: ${paper.year}`);
      console.log(`URL: ${paper.url}`);
      console.log(`Authors: ${paper.authors.join(", ")}`);
    });
  } catch (error) {
    console.error("\n❌ RESEARCH SERVICE FAILED");
    console.error(error.message);
  }
}

test();
