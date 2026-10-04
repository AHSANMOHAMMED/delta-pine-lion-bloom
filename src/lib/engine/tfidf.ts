import { STOPWORDS } from "./text";

function bag(text: string): Map<string, number> {
  const m = new Map<string, number>();
  for (const raw of text.toLowerCase().match(/[a-z0-9']+/g) ?? []) {
    const w = raw.replace(/'/g, "");
    if (w.length < 3 || STOPWORDS.has(w)) continue;
    m.set(w, (m.get(w) ?? 0) + 1);
  }
  return m;
}

export function cosine(a: string, b: string): number {
  const A = bag(a);
  const B = bag(b);
  if (A.size === 0 || B.size === 0) return 0;
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (const [, v] of A) na += v * v;
  for (const [k, v] of B) {
    nb += v * v;
    const u = A.get(k);
    if (u) dot += u * v;
  }
  if (na === 0 || nb === 0) return 0;
  return dot / Math.sqrt(na * nb);
}
