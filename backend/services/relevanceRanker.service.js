function normalize(text = "") {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(text = "") {
  return normalize(text).split(/\s+/).filter(Boolean);
}

// --------------------------------------------------
// Generic stop words
// --------------------------------------------------

const STOP_WORDS = new Set([
  "the",
  "a",
  "an",
  "and",
  "or",
  "but",
  "for",
  "to",
  "of",
  "in",
  "on",
  "at",
  "by",
  "with",
  "from",
  "into",
  "about",
  "over",
  "under",
  "after",
  "before",
  "between",
  "through",
  "during",
  "is",
  "are",
  "was",
  "were",
  "be",
  "been",
  "being",
  "this",
  "that",
  "these",
  "those",
  "it",
  "its",
  "as",
  "how",
  "what",
  "why",
  "when",
  "where",
  "who",
  "which",
  "can",
  "could",
  "should",
  "would",
  "will",
  "may",
  "might",
  "do",
  "does",
  "did",
]);

// --------------------------------------------------
// Get meaningful query terms
// --------------------------------------------------

function getQueryTerms(query) {
  return tokenize(query).filter(
    (word) => word.length > 2 && !STOP_WORDS.has(word),
  );
}

// --------------------------------------------------
// Exact word matching
// --------------------------------------------------

function hasExactWord(text, word) {
  const tokens = new Set(tokenize(text));
  return tokens.has(word);
}

// --------------------------------------------------
// Count matched query terms
// --------------------------------------------------

function getTermMatches(queryTerms, text) {
  let matched = 0;

  for (const term of queryTerms) {
    if (hasExactWord(text, term)) {
      matched++;
    }
  }

  return matched;
}

// --------------------------------------------------
// Query term proximity
// --------------------------------------------------

function getProximityScore(queryTerms, text) {
  const textTokens = tokenize(text);

  if (queryTerms.length < 2 || textTokens.length === 0) {
    return 0;
  }

  const positions = [];

  for (let i = 0; i < textTokens.length; i++) {
    if (queryTerms.includes(textTokens[i])) {
      positions.push(i);
    }
  }

  if (positions.length < 2) {
    return 0;
  }

  let bestDistance = Infinity;

  for (let i = 0; i < positions.length; i++) {
    for (let j = i + 1; j < positions.length; j++) {
      const distance = positions[j] - positions[i];

      if (distance < bestDistance) {
        bestDistance = distance;
      }
    }
  }

  // Terms very close together = stronger relevance
  if (bestDistance <= 3) {
    return 1;
  }

  if (bestDistance <= 7) {
    return 0.7;
  }

  if (bestDistance <= 12) {
    return 0.4;
  }

  return 0.1;
}

// --------------------------------------------------
// Calculate relevance
// --------------------------------------------------

function calculateRelevance(query, item) {
  const queryText = normalize(query);

  const title = normalize(item.title || "");

  const description = normalize(item.description || item.abstract || "");

  const queryTerms = getQueryTerms(queryText);

  if (queryTerms.length === 0) {
    return 0;
  }

  // -----------------------------------------------
  // 1. Query coverage
  // -----------------------------------------------

  const titleMatches = getTermMatches(queryTerms, title);

  const descriptionMatches = getTermMatches(queryTerms, description);

  const titleCoverage = titleMatches / queryTerms.length;

  const descriptionCoverage = descriptionMatches / queryTerms.length;

  // -----------------------------------------------
  // 2. Exact phrase bonus
  // -----------------------------------------------

  let phraseScore = 0;

  if (title.includes(queryText)) {
    phraseScore = 1;
  } else if (description.includes(queryText)) {
    phraseScore = 0.7;
  }

  // -----------------------------------------------
  // 3. Proximity
  // -----------------------------------------------

  const proximityScore = getProximityScore(queryTerms, title);

  // -----------------------------------------------
  // 4. Weighted final score
  // -----------------------------------------------

  let score = 0;

  // Title is strongest signal
  score += titleCoverage * 0.45;

  // Description is useful but weaker
  score += descriptionCoverage * 0.25;

  // Query phrase match
  score += phraseScore * 0.2;

  // Terms close together
  score += proximityScore * 0.1;

  return Math.min(score, 1);
}

// --------------------------------------------------
// Rank results
// --------------------------------------------------

export function rankResults(query, results, limit = 20) {
  const ranked = results
    .map((item) => ({
      ...item,
      relevanceScore: calculateRelevance(query, item),
    }))
    .filter((item) => item.relevanceScore > 0)
    .sort((a, b) => b.relevanceScore - a.relevanceScore);

  return ranked.slice(0, limit);
}
