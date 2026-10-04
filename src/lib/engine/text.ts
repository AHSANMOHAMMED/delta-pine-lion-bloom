import type { Token } from "./types";

const WORD_RE = /[A-Za-z0-9]+(?:['’][A-Za-z0-9]+)?/g;

export function tokenize(text: string): Token[] {
  const tokens: Token[] = [];
  const re = new RegExp(WORD_RE.source, "g");
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    const word = m[0];
    tokens.push({
      word,
      norm: word.toLowerCase().replace(/[’']/g, ""),
      start: m.index,
      end: m.index + word.length,
    });
  }
  return tokens;
}

export function splitSentences(text: string): { text: string; start: number; end: number }[] {
  const out: { text: string; start: number; end: number }[] = [];
  const re = /[^.!?]+[.!?]+|[^.!?]+$/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    const raw = m[0];
    const lead = raw.search(/\S/);
    if (lead < 0) continue;
    const start = m.index + lead;
    const trimmed = raw.trim();
    if (trimmed.split(/\s+/).length < 4) continue;
    out.push({ text: trimmed, start, end: start + trimmed.length });
  }
  return out;
}

export function wordCount(text: string): number {
  return tokenize(text).length;
}

export const STOPWORDS = new Set(
  `a an the and or but if while of to in on at for from by with as is was are were be been being this that these those it its they them their you your we our i me my not no so than then there here when what which who whom how all any both each few more most other some such only own same too very can will just about into over after before between also`.split(
    " ",
  ),
);

export function distinctivePhrases(text: string, limit = 4): string[] {
  const tokens = tokenize(text);
  const scored: { phrase: string; score: number }[] = [];
  const n = 9;
  for (let i = 0; i <= tokens.length - n; i += 7) {
    const slice = tokens.slice(i, i + n);
    const rare = slice.filter((t) => t.norm.length > 4 && !STOPWORDS.has(t.norm)).length;
    const phrase = slice.map((t) => t.word).join(" ");
    if (rare >= 4) scored.push({ phrase, score: rare + slice.reduce((a, t) => a + Math.min(t.norm.length, 10) / 10, 0) });
  }
  scored.sort((a, b) => b.score - a.score);
  const seen = new Set<string>();
  const out: string[] = [];
  for (const s of scored) {
    const key = s.phrase.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(s.phrase);
    if (out.length >= limit) break;
  }
  return out;
}
