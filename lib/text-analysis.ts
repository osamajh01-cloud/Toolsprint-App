/**
 * lib/text-analysis.ts
 *
 * Pure text-analysis functions for the Word Counter tool. Framework-free
 * on purpose: no React, no DOM — just string in, numbers out. This keeps
 * the logic unit-testable and reusable (the Social Character Counter and
 * Keyword Density Checker in later milestones will share pieces of it).
 *
 * All functions are O(n) over the input and fast enough to run on every
 * keystroke without debouncing, even for book-length pastes.
 */

export const READING_WPM = 200;
export const SPEAKING_WPM = 130;

export interface TextStats {
  characters: number;
  charactersNoSpaces: number;
  words: number;
  sentences: number;
  paragraphs: number;
  /** Seconds, at READING_WPM. */
  readingTimeSeconds: number;
  /** Seconds, at SPEAKING_WPM. */
  speakingTimeSeconds: number;
  /** Most frequent meaningful word (common stop words excluded), or null. */
  mostUsedWord: string | null;
  longestWord: string | null;
  /** Mean letters per word, 1 decimal place. */
  averageWordLength: number;
  /** Human label derived from a simplified Flesch Reading Ease score. */
  readingLevel: string;
}

/** Common English words excluded from "most used word" — counting "the"
 *  would make the stat useless for almost any input. */
const STOP_WORDS = new Set([
  "the", "a", "an", "and", "or", "but", "if", "of", "to", "in", "on", "at",
  "for", "with", "as", "by", "is", "are", "was", "were", "be", "been", "it",
  "its", "this", "that", "these", "those", "i", "you", "he", "she", "we",
  "they", "not", "no", "so", "do", "does", "did", "have", "has", "had",
]);

/** Split into word tokens: unicode letters/digits with internal
 *  apostrophes/hyphens kept ("don't", "state-of-the-art" = 1 word). */
function tokenize(text: string): string[] {
  return text.match(/[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu) ?? [];
}

/** Heuristic syllable count: vowel groups, minus a silent trailing "e",
 *  minimum one. Good enough for a reading-level estimate. */
function countSyllables(word: string): number {
  const clean = word.toLowerCase().replace(/[^a-z]/g, "");
  if (clean.length === 0) return 0;
  const groups = clean.match(/[aeiouy]+/g)?.length ?? 0;
  const silentE = clean.length > 2 && clean.endsWith("e") ? 1 : 0;
  return Math.max(1, groups - silentE);
}

/** Simplified Flesch Reading Ease, mapped to a plain-language label.
 *  FRE = 206.835 − 1.015·(words/sentences) − 84.6·(syllables/words). */
function readingLevelLabel(
  words: string[],
  sentenceCount: number,
): string {
  if (words.length < 10 || sentenceCount === 0) return "Too short to rate";

  const syllables = words.reduce((sum, word) => sum + countSyllables(word), 0);
  const score =
    206.835 -
    1.015 * (words.length / sentenceCount) -
    84.6 * (syllables / words.length);

  if (score >= 80) return "Very easy";
  if (score >= 60) return "Easy";
  if (score >= 40) return "Moderate";
  if (score >= 20) return "Difficult";
  return "Very difficult";
}

export function analyzeText(text: string): TextStats {
  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, "").length;

  const words = tokenize(text);
  const wordCount = words.length;

  // Sentences: runs of text ending in ., !, ?, or … (or end of input).
  const sentences = text
    .split(/[.!?…]+/)
    .map((part) => part.trim())
    .filter((part) => part.length > 0).length;

  // Paragraphs: blocks separated by one or more blank lines.
  const paragraphs = text
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter((block) => block.length > 0).length;

  // Most used word, ignoring case and stop words.
  const frequency = new Map<string, number>();
  for (const word of words) {
    const key = word.toLowerCase();
    if (STOP_WORDS.has(key) || key.length < 2) continue;
    frequency.set(key, (frequency.get(key) ?? 0) + 1);
  }
  let mostUsedWord: string | null = null;
  let mostUsedCount = 0;
  for (const [word, count] of frequency) {
    if (count > mostUsedCount) {
      mostUsedWord = word;
      mostUsedCount = count;
    }
  }

  let longestWord: string | null = null;
  for (const word of words) {
    if (!longestWord || word.length > longestWord.length) longestWord = word;
  }

  const totalLetters = words.reduce((sum, word) => sum + word.length, 0);
  const averageWordLength =
    wordCount > 0 ? Math.round((totalLetters / wordCount) * 10) / 10 : 0;

  return {
    characters,
    charactersNoSpaces,
    words: wordCount,
    sentences,
    paragraphs,
    readingTimeSeconds: Math.round((wordCount / READING_WPM) * 60),
    speakingTimeSeconds: Math.round((wordCount / SPEAKING_WPM) * 60),
    mostUsedWord,
    longestWord,
    averageWordLength,
    readingLevel: readingLevelLabel(words, sentences),
  };
}

/** Format seconds as "3 min 20 sec", "45 sec", or "< 1 sec". */
export function formatDuration(totalSeconds: number): string {
  if (totalSeconds <= 0) return "0 sec";
  if (totalSeconds < 1) return "< 1 sec";
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.round(totalSeconds % 60);
  if (minutes === 0) return `${seconds} sec`;
  if (seconds === 0) return `${minutes} min`;
  return `${minutes} min ${seconds} sec`;
}
