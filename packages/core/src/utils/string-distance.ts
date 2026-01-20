/**
 * String Distance Utilities
 *
 * Provides efficient string similarity algorithms for typo detection
 */

/**
 * Calculate Levenshtein distance between two strings
 * Uses dynamic programming for optimal performance
 *
 * @param str1 - First string
 * @param str2 - Second string
 * @returns Distance between strings (0 = identical)
 */
export function levenshteinDistance(str1: string, str2: string): number {
  const len1 = str1.length;
  const len2 = str2.length;

  const matrix: number[][] = Array.from({ length: len1 + 1 }, () =>
    Array.from({ length: len2 + 1 }, () => 0)
  );

  for (let i = 0; i <= len1; i++) {
    matrix[i]![0] = i;
  }
  for (let j = 0; j <= len2; j++) {
    matrix[0]![j] = j;
  }

  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[i]![j] = Math.min(
        matrix[i - 1]![j]! + 1,
        matrix[i]![j - 1]! + 1,
        matrix[i - 1]![j - 1]! + cost
      );
    }
  }

  return matrix[len1]![len2]!;
}

/**
 * Calculate similarity score between two strings (0-1)
 * Higher score means more similar
 *
 * @param str1 - First string
 * @param str2 - Second string
 * @returns Similarity score (1 = identical, 0 = completely different)
 */
export function similarityScore(str1: string, str2: string): number {
  if (str1 === str2) {
    return 1;
  }
  if (!str1 || !str2) {
    return 0;
  }

  const distance = levenshteinDistance(str1.toLowerCase(), str2.toLowerCase());
  const maxLength = Math.max(str1.length, str2.length);

  return maxLength > 0 ? 1 - distance / maxLength : 0;
}

/**
 * Find the closest match from a list of candidates
 *
 * @param target - Target string to match
 * @param candidates - List of candidate strings
 * @param threshold - Minimum similarity threshold (0-1)
 * @returns Best match or null if no match above threshold
 */
export function findClosestMatch(
  target: string,
  candidates: string[],
  threshold: number = 0.5
): { match: string; score: number } | null {
  let bestMatch: string | null = null;
  let bestScore = 0;

  for (const candidate of candidates) {
    const score = similarityScore(target, candidate);
    if (score > bestScore && score >= threshold) {
      bestScore = score;
      bestMatch = candidate;
    }
  }

  return bestMatch ? { match: bestMatch, score: bestScore } : null;
}
