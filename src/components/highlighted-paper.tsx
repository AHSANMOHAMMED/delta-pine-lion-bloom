import { useMemo } from "react";
import type { MatchSpan, SourceHit } from "@/lib/engine/types";
import { cn } from "@/lib/utils";

type Piece =
  | { type: "text"; text: string }
  | { type: "mark"; text: string; span: MatchSpan; color: number };

export function HighlightedPaper({
  text,
  spans,
  sources,
  activeId,
  onSelect,
}: {
  text: string;
  spans: MatchSpan[];
  sources: SourceHit[];
  activeId: string | null;
  onSelect: (sourceId: string) => void;
}) {
  const colorOf = useMemo(() => {
    const m = new Map<string, number>();
    for (const s of sources) m.set(s.id, s.colorIndex);
    return m;
  }, [sources]);

  const pieces = useMemo(() => buildPieces(text, spans, colorOf), [text, spans, colorOf]);

  return (
    <article className="rounded-xl bg-surface p-5 shadow-border sm:p-8">
      <p className="mb-4 font-display text-sm text-muted">Submission</p>
      <div className="font-display text-[1.05rem] leading-[1.75] text-fg">
        {pieces.map((p, i) =>
          p.type === "text" ? (
            <span key={i}>{p.text}</span>
          ) : (
            <mark
              key={i}
              className={cn(
                "cursor-pointer rounded-sm px-0.5",
                `mark-${p.color}`,
                activeId === p.span.sourceId && "mark-active",
              )}
              style={{ color: "inherit" }}
              title="Matched source"
              onClick={() => onSelect(p.span.sourceId)}
            >
              {p.text}
            </mark>
          ),
        )}
      </div>
    </article>
  );
}

function buildPieces(
  text: string,
  spans: MatchSpan[],
  colorOf: Map<string, number>,
): Piece[] {
  const sorted = [...spans]
    .filter((s) => s.end > s.start)
    .sort((a, b) => a.start - b.start || b.end - a.end);
  const merged: MatchSpan[] = [];
  for (const s of sorted) {
    const last = merged[merged.length - 1];
    if (last && s.start < last.end) {
      if (s.end > last.end) last.end = s.end;
      continue;
    }
    merged.push({ ...s });
  }
  const pieces: Piece[] = [];
  let cursor = 0;
  for (const s of merged) {
    if (s.start > cursor) {
      pieces.push({ type: "text", text: text.slice(cursor, s.start) });
    }
    const start = Math.max(s.start, cursor);
    if (s.end > start) {
      pieces.push({
        type: "mark",
        text: text.slice(start, s.end),
        span: s,
        color: colorOf.get(s.sourceId) ?? 0,
      });
      cursor = s.end;
    }
  }
  if (cursor < text.length) pieces.push({ type: "text", text: text.slice(cursor) });
  return pieces;
}
