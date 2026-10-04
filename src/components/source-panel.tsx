import { ExternalLink } from "lucide-react";
import type { OriginalityReport } from "@/lib/engine/types";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ScoreRing } from "@/components/score-ring";
import { Separator } from "@/components/ui/separator";

export function SourcePanel({
  report,
  activeId,
  onSelect,
}: {
  report: OriginalityReport;
  activeId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <aside className="flex flex-col gap-5">
      <div className="rounded-xl bg-surface p-5 shadow-border">
        <ScoreRing score={report.overallSimilarity} />
        <p className="mt-3 text-center text-sm leading-relaxed text-muted">{report.summary}</p>
        <div className="mt-5 overflow-hidden rounded-md">
          <div className="flex h-2.5 w-full">
            <Bar color="var(--color-danger)" pct={report.exactPercent} />
            <Bar color="var(--color-warn)" pct={report.nearPercent} />
            <Bar color="var(--color-ok)" pct={report.originalPercent} />
          </div>
          <ul className="mt-3 grid grid-cols-3 gap-2 text-center text-[11px] uppercase tracking-[0.12em] text-muted">
            <li>
              <span className="block font-mono text-sm text-danger tabular-nums">
                {report.exactPercent}%
              </span>
              Exact
            </li>
            <li>
              <span className="block font-mono text-sm text-warn tabular-nums">
                {report.nearPercent}%
              </span>
              Near
            </li>
            <li>
              <span className="block font-mono text-sm text-ok tabular-nums">
                {report.originalPercent}%
              </span>
              Original
            </li>
          </ul>
        </div>
        <p className="mt-3 text-center font-mono text-xs text-subtle tabular-nums">
          {report.wordCount} words
        </p>
      </div>

      <div className="rounded-xl bg-surface p-5 shadow-border">
        <h2 className="font-display text-lg">Sources</h2>
        <p className="mt-1 text-sm text-muted">
          {report.sources.length
            ? "Select a source to focus its highlights."
            : "No matching sources in the current index."}
        </p>
        <Separator className="my-4" />
        <ul className="flex flex-col gap-2">
          {report.sources.map((s) => (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => onSelect(s.id)}
                className={cn(
                  "flex w-full items-start gap-3 rounded-md p-3 text-left transition-colors duration-150",
                  activeId === s.id ? "bg-sunken" : "hover:bg-sunken/70",
                )}
              >
                <span
                  className={cn("mt-1 size-2.5 shrink-0 rounded-full", `bg-hl-${s.colorIndex}`)}
                  style={{ background: `var(--color-hl-${s.colorIndex})` }}
                />
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-medium">{s.title}</span>
                    <span className="font-mono text-sm tabular-nums">{s.similarity}%</span>
                  </span>
                  <span className="mt-1 flex items-center gap-2">
                    <Badge>{s.kind}</Badge>
                    <span className="text-xs text-subtle">{s.matchCount} matches</span>
                  </span>
                  {s.url ? (
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 inline-flex items-center gap-1 text-xs text-primary hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Open source <ExternalLink className="size-3" />
                    </a>
                  ) : null}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-xl bg-surface p-5 shadow-border">
        <h2 className="font-display text-lg">Writing regularity</h2>
        <p className="mt-1 font-mono text-2xl tabular-nums">{report.ai.likelihood}%</p>
        <p className="mt-1 text-xs uppercase tracking-[0.14em] text-muted">Heuristic AI likelihood</p>
        <dl className="mt-4 grid grid-cols-3 gap-2 text-center">
          <Stat label="Burstiness" value={String(report.ai.burstiness)} />
          <Stat label="Type-token" value={String(report.ai.typeToken)} />
          <Stat label="Avg sent." value={String(report.ai.avgSentence)} />
        </dl>
        <p className="mt-4 text-sm leading-relaxed text-muted">{report.ai.note}</p>
      </div>
    </aside>
  );
}

function Bar({ color, pct }: { color: string; pct: number }) {
  if (pct <= 0) return null;
  return <div style={{ width: `${pct}%`, background: color }} />;
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-sm bg-sunken px-2 py-2">
      <div className="font-mono text-sm tabular-nums">{value}</div>
      <div className="text-[10px] uppercase tracking-[0.12em] text-muted">{label}</div>
    </div>
  );
}
