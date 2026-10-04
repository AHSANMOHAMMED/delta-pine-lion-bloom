import type { Token } from "./types";

export type Fingerprint = {
  hash: number;
  startTok: number;
  endTok: number;
};

function hashStr(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function shingles(tokens: Token[], k: number): Fingerprint[] {
  const out: Fingerprint[] = [];
  if (tokens.length < k) return out;
  for (let i = 0; i <= tokens.length - k; i++) {
    const gram = tokens
      .slice(i, i + k)
      .map((t) => t.norm)
      .join(" ");
    out.push({ hash: hashStr(gram), startTok: i, endTok: i + k - 1 });
  }
  return out;
}

/** Winnowing: keep the rightmost minimum hash in each window of size w. */
export function winnow(prints: Fingerprint[], w = 4): Fingerprint[] {
  if (prints.length <= w) return prints;
  const selected: Fingerprint[] = [];
  let last = -1;
  for (let i = 0; i <= prints.length - w; i++) {
    let minIdx = i;
    let minHash = prints[i]!.hash;
    for (let j = i + 1; j < i + w; j++) {
      const h = prints[j]!.hash;
      if (h <= minHash) {
        minHash = h;
        minIdx = j;
      }
    }
    if (minIdx !== last) {
      selected.push(prints[minIdx]!);
      last = minIdx;
    }
  }
  return selected;
}

export function indexFingerprints(prints: Fingerprint[]): Map<number, Fingerprint[]> {
  const map = new Map<number, Fingerprint[]>();
  for (const p of prints) {
    const list = map.get(p.hash);
    if (list) list.push(p);
    else map.set(p.hash, [p]);
  }
  return map;
}
