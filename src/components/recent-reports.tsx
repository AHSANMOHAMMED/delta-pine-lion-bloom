import { Link } from "@tanstack/react-router";
import { useProvenance } from "@/lib/store";
import { scoreTone } from "@/components/score-ring";
import { cn } from "@/lib/utils";

export function RecentReports() {
  const reports = useProvenance((s) => s.reports);
  if (!reports.length) return null;
  return (
    <section className="mt-10">
      <h2 className="font-display text-xl">Recent reports</h2>
      <ul className="mt-3 divide-y divide-border rounded-xl bg-surface shadow-border">
        {reports.slice(0, 6).map((r) => {
          const tone = scoreTone(r.overallSimilarity);
          return (
            <li key={r.id}>
              <Link
                to="/report/$id"
                params={{ id: r.id }}
                className="flex items-center justify-between gap-4 px-4 py-3 hover:bg-sunken"
              >
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium">{r.title}</span>
                  <span className="text-xs text-muted">
                    {new Date(r.createdAt).toLocaleString(undefined, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </span>
                </span>
                <span
                  className={cn(
                    "font-mono text-sm tabular-nums",
                    tone === "ok" && "text-ok",
                    tone === "warn" && "text-warn",
                    tone === "danger" && "text-danger",
                    tone === "ink" && "text-primary",
                  )}
                >
                  {Math.round(r.overallSimilarity)}%
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
