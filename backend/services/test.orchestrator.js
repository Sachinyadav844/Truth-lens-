import "dotenv/config";

import { searchAll } from "./searchOrchestrator.service.js";

async function test() {
  try {
    console.log("=== SEARCH ORCHESTRATOR TEST ===");

    const result = await searchAll("artificial intelligence misinformation");

    console.log("\nQuery:", result.query);

    console.log("\nTotal results:", result.results.length);

    console.log("\nResults:");

    result.results.slice(0, 10).forEach((item, index) => {
      console.log(`${index + 1}. ${item.title || "No title"}`);
      console.log(`   Source: ${item.source}`);
      console.log(`   URL: ${item.url || item.link || "N/A"}`);
    });

    if (result.failures.length > 0) {
      console.log("\n Partial failures:");

      result.failures.forEach((failure) => {
        console.log(`${failure.source}: ${failure.error}`);
      });
    } else {
      console.log("\n All sources succeeded");
    }
  } catch (error) {
    console.error("\n ORCHESTRATOR FAILED");
    console.error(error.message);
  }
}

test();
