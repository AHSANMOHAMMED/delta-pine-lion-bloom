import { BUILTIN_CORPUS } from "@/lib/corpus";
import { uid } from "@/lib/utils";
import { indexFingerprints, shingles, winnow, type Fingerprint } from "./fingerprint";
import { analyzeStyle } from "./style";
import { cosine } from "./tfidf";
import { splitSentences, tokenize } from "./text";
import type {
  CorpusDoc,
  MatchKind,
  MatchSpan,
  OriginalityReport,
  SourceHit,
  Token,
  WebSource,
} from "./types";

const EXACT_K = 5;
const NEAR_K = 3;

type IndexedDoc = {
  doc: CorpusDoc;
  tokens: Token[];
  exact: Map<number, Fingerprint[]>;
  near: Map<number, Fingerprint[]>;
  sentences: { text: string; start: number; end: number }[];
};

function indexDoc(doc: CorpusDoc): IndexedDoc {
  const tokens = tokenize(doc.text);
  return {
    doc,
    tokens,
    exact: indexFingerprints(winnow(shingles(tokens, EXACT_K))),
    near: indexFingerprints(shingles(tokens, NEAR_K)),
    sentences: splitSentences(doc.text),
  };
}

function kindRank(k: MatchKind): number {
  return k === "exact" ? 0 : k === "near" ? 1 : 2;
}

function mergeSpans(spans: MatchSpan[]): MatchSpan[] {
  if (!spans.length) return [];
  const sorted = [...spans].sort((a, b) => a.start - b.start || b.end - a.end);
  const out: MatchSpan[] = [];
  for (const s of sorted) {
    const last = out[out.length - 1];
    if (last && s.sourceId === last.sourceId && s.start <= last.end + 1) {
      last.end = Math.max(last.end, s.end);
      last.score = Math.max(last.score, s.score);
      if (kindRank(s.kind) < kindRank(last.kind)) last.kind = s.kind;
    } else {
      out.push({ ...s });
    }
  }
  return out;
}

function collectMatches(
  queryTokens: Token[],
  queryText: string,
  indexed: IndexedDoc[],
): MatchSpan[] {
  const spans: MatchSpan[] = [];
  const exactQ = winnow(shingles(queryTokens, EXACT_K));
  const nearQ = shingles(queryTokens, NEAR_K);

  for (const src of indexed) {
    for (const fp of exactQ) {
      if (!src.exact.has(fp.hash)) continue;
      const a = queryTokens[fp.startTok]!;
      const b = queryTokens[fp.endTok]!;
      spans.push({
        start: a.start,
        end: b.end,
        sourceId: src.doc.id,
        score: 0.98,
        kind: "exact",
        matchedText: queryText.slice(a.start, b.end),
      });
    }
    for (const fp of nearQ) {
      if (!src.near.has(fp.hash)) continue;
      const a = queryTokens[fp.startTok]!;
      const b = queryTokens[fp.endTok]!;
      spans.push({
        start: a.start,
        end: b.end,
        sourceId: src.doc.id,
        score: 0.82,
        kind: "near",
        matchedText: queryText.slice(a.start, b.end),
      });
    }
  }

  const qSentences = splitSentences(queryText);
  for (const qs of qSentences) {
    if (qs.text.split(/\s+/).length < 8) continue;
    let best: { src: IndexedDoc; score: number } | null = null;
    for (const src of indexed) {
      for (const ss of src.sentences) {
        const score = cosine(qs.text, ss.text);
        if (score >= 0.62 && (!best || score > best.score)) {
          best = { src, score };
        }
      }
    }
    if (best) {
      spans.push({
        start: qs.start,
        end: qs.end,
        sourceId: best.src.doc.id,
        score: best.score,
        kind: best.score >= 0.84 ? "near" : "paraphrase",
        matchedText: qs.text,
      });
    }
  }

  return mergeSpans(spans);
}

function coverage(tokens: Token[], spans: MatchSpan[], pred: (s: MatchSpan) => boolean): number {
  if (!tokens.length) return 0;
  let hit = 0;
  for (const t of tokens) {
    if (spans.some((s) => pred(s) && t.start < s.end && t.end > s.start)) hit++;
  }
  return hit / tokens.length;
}

function excerptAround(text: string, start: number, len = 180): string {
  const a = Math.max(0, start - 20);
  const slice = text.slice(a, a + len).trim();
  return (a > 0 ? "…" : "") + slice + (a + len < text.length ? "…" : "");
}

export function buildReport(opts: {
  title: string;
  text: string;
  library: CorpusDoc[];
  web: WebSource[];
}): OriginalityReport {
  const text = opts.text.replace(/\u00a0/g, " ").trim();
  const tokens = tokenize(text);
  const sources: CorpusDoc[] = [
    ...BUILTIN_CORPUS,
    ...opts.library,
    ...opts.web.map((w, i) => ({
      id: `web_${i}_${w.url}`,
      title: w.title,
      text: w.extract,
      kind: "web" as const,
      url: w.url,
    })),
  ];
  const indexed = sources.filter((d) => tokenize(d.text).length >= 20).map(indexDoc);
  const spans = collectMatches(tokens, text, indexed);

  const exactCov = coverage(tokens, spans, (s) => s.kind === "exact");
  const allCov = coverage(tokens, spans, () => true);
  const nearCov = Math.max(0, allCov - exactCov);
  const exactPct = Math.round(exactCov * 1000) / 10;
  const nearPct = Math.round(nearCov * 1000) / 10;
  const covered = Math.min(100, Math.round((exactPct + nearPct * 0.85) * 10) / 10);
  const original = Math.max(0, Math.round((100 - covered) * 10) / 10);

  const bySource = new Map<string, MatchSpan[]>();
  for (const s of spans) {
    const list = bySource.get(s.sourceId);
    if (list) list.push(s);
    else bySource.set(s.sourceId, [s]);
  }

  const sourceHits: SourceHit[] = [];
  let color = 0;
  for (const [id, list] of bySource) {
    const doc = sources.find((d) => d.id === id);
    if (!doc) continue;
    const sim = Math.round(coverage(tokens, list, () => true) * 1000) / 10;
    if (sim < 1.2) continue;
    const first = list[0]!;
    sourceHits.push({
      id,
      title: doc.title,
      kind: doc.kind,
      url: doc.url,
      similarity: sim,
      excerpt: excerptAround(text, first.start),
      colorIndex: color % 6,
      matchCount: list.length,
    });
    color++;
  }
  sourceHits.sort((a, b) => b.similarity - a.similarity);

  const allowed = new Set(sourceHits.map((s) => s.id));
  const coloredSpans = spans.filter((s) => allowed.has(s.sourceId));

  const top = sourceHits[0];
  const summary = top
    ? `${covered}% of this submission overlaps indexed sources. Strongest overlap: ${top.title} (${top.similarity}%).`
    : "No overlapping passages were found in the local corpus, your library, or retrieved web extracts.";

  return {
    id: uid("rep"),
    title: opts.title.trim() || "Untitled submission",
    createdAt: new Date().toISOString(),
    text,
    wordCount: tokens.length,
    overallSimilarity: covered,
    exactPercent: exactPct,
    nearPercent: nearPct,
    originalPercent: original,
    sources: sourceHits,
    spans: coloredSpans,
    ai: analyzeStyle(text),
    summary,
    webQueried: opts.web.length > 0,
  };
}
