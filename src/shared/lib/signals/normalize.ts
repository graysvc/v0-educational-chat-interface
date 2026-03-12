/**
 * Normalize text for signal matching:
 * lowercase → NFD decompose → strip diacritics → strip punctuation → collapse spaces → trim
 */
export function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // strip diacritics
    .replace(/[^\w\s]/g, " ")        // strip punctuation
    .replace(/\s+/g, " ")            // collapse spaces
    .trim();
}
