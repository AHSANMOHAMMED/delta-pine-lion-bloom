export type SourceKind = "library" | "corpus" | "web";
export type MatchKind = "exact" | "near" | "paraphrase";

export type CorpusDoc = {
  id: string;
  title: string;
  text: string;
  kind: SourceKind;
  url?: string;
};

export type Token = {
  word: string;
  norm: string;
  start: number;
  end: number;
};

export type MatchSpan = {
  start: number;
  end: number;
  sourceId: string;
  score: number;
  kind: MatchKind;
  matchedText: string;
};

export type SourceHit = {
  id: string;
  title: string;
  kind: SourceKind;
  url?: string;
  similarity: number;
  excerpt: string;
  colorIndex: number;
  matchCount: number;
};

export type AiSignals = {
  likelihood: number;
  burstiness: number;
  typeToken: number;
  avgSentence: number;
  note: string;
};

export type OriginalityReport = {
  id: string;
  title: string;
  createdAt: string;
  text: string;
  wordCount: number;
  overallSimilarity: number;
  exactPercent: number;
  nearPercent: number;
  originalPercent: number;
  sources: SourceHit[];
  spans: MatchSpan[];
  ai: AiSignals;
  summary: string;
  webQueried: boolean;
};

export type WebSource = {
  title: string;
  url: string;
  extract: string;
};
