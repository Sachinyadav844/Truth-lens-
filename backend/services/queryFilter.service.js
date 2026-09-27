const STOP_WORDS = new Set([
  "a", "an", "and", "are", "as", "at", "be", "by", "but", "for",
  "from", "in", "is", "it", "of", "on", "or", "that", "the", "to",
  "with",
]);

function collectText(value) {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(collectText);
  if (value && typeof value === "object") return Object.values(value).flatMap(collectText);
  return [];
}

export function matchesQuery(item, query) {
  const normalizedQuery = query.trim().replace(/\s+/g, " ").toLowerCase();
  if (!normalizedQuery) return true;

  const text = collectText(item).join(" ").replace(/\s+/g, " ").toLowerCase();
  if (text.includes(normalizedQuery)) return true;

  const keywords = [...new Set(normalizedQuery.match(/[\p{L}\p{N}]{3,}/gu) || [])]
    .filter((keyword) => !STOP_WORDS.has(keyword));
  if (keywords.length === 0) return false;

  const textWords = new Set(text.match(/[\p{L}\p{N}]+/gu) || []);
  return keywords.every((keyword) => textWords.has(keyword));
}

export function filterByQuery(items, query) {
  return items.filter((item) => matchesQuery(item, query));
}