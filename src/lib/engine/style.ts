import type { AiSignals } from "./types";
import { splitSentences, tokenize } from "./text";

export function analyzeStyle(text: string): AiSignals {
  const sentences = splitSentences(text);
  const tokens = tokenize(text);
  const lengths = sentences.map((s) => s.text.split(/\s+/).length);
  const avg = lengths.length ? lengths.reduce((a, b) => a + b, 0) / lengths.length : 0;
  const variance =
    lengths.length > 1
      ? lengths.reduce((a, l) => a + (l - avg) ** 2, 0) / lengths.length
      : 0;
  const burstiness = Math.sqrt(variance);
  const types = new Set(tokens.map((t) => t.norm));
  const typeToken = tokens.length ? types.size / tokens.length : 0;

  // Heuristic: AI prose tends toward even sentence length, high type-token
  // on short pieces, and mid-length sentences clustering around 18–24 words.
  const evenness = avg === 0 ? 0 : 1 - Math.min(burstiness / (avg * 0.7), 1);
  const lengthCluster = avg > 14 && avg < 28 ? 0.2 : 0;
  const lowBurst = burstiness < 6 ? 0.25 : burstiness < 10 ? 0.1 : 0;
  const uniform = typeToken > 0.55 && typeToken < 0.78 ? 0.15 : 0;
  let likelihood = Math.round(Math.min(0.95, evenness * 0.5 + lengthCluster + lowBurst + uniform) * 100);
  if (tokens.length < 80) likelihood = Math.min(likelihood, 35);

  let note = "Stylometry is a weak signal — treat it as a prompt for review, not a verdict.";
  if (likelihood >= 60) {
    note =
      "Even sentence rhythm and limited burstiness often appear in machine-drafted prose. Read the highlighted sources first; this is not proof of AI use.";
  } else if (likelihood <= 25) {
    note = "Sentence length varies the way most human drafts do. Low score here does not prove human authorship.";
  }

  return {
    likelihood,
    burstiness: Math.round(burstiness * 10) / 10,
    typeToken: Math.round(typeToken * 100) / 100,
    avgSentence: Math.round(avg * 10) / 10,
    note,
  };
}
