import "dotenv/config";

import { searchAll } from "./searchOrchestrator.service.js";

const query = "india economy";

console.log("=== SEARCH ORCHESTRATOR TEST ===");

try {
  const result = await searchAll(query);

  console.log("\nQuery:", result.query);

  console.log("\nTotal results:", result.totalResults);

  console.log("\nResults:");

  result.results.forEach((item, index) => {
    console.log(`\n${index + 1}. ${item.title}`);

    console.log("Source:", item.source);

    console.log("Relevance:", item.relevanceScore?.toFixed(3));

    console.log("URL:", item.url || item.link || "N/A");
  });

  if (result.failures.length > 0) {
    console.log("\nFailures:");

    result.failures.forEach((failure) => {
      console.log(`${failure.source}: ${failure.error}`);
    });
  } else {
    console.log("\nAll sources succeeded");
  }
} catch (error) {
  console.error("\n❌ ORCHESTRATOR FAILED:");

  console.error(error);
}
