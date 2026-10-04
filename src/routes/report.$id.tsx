import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { HighlightedPaper } from "@/components/highlighted-paper";
import { Shell } from "@/components/shell";
import { SourcePanel } from "@/components/source-panel";
import { Button } from "@/components/ui/button";
import { DeepScanBox } from "@/components/deep-scan-box";
import { useProvenance } from "@/lib/store";

export const Route = createFileRoute("/report/$id")({ component: ReportPage });

function ReportPage() {
  const { id } = Route.useParams();
  const report = useProvenance((s) => s.reports.find((r) => r.id === id));
  const [hydrated, setHydrated] = useState(() => useProvenance.persist.hasHydrated());
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const unsub = useProvenance.persist.onFinishHydration(() => setHydrated(true));
    if (useProvenance.persist.hasHydrated()) setHydrated(true);
    return unsub;
  }, []);

  if (!hydrated) {
    return (
      <Shell>
        <main className="mx-auto max-w-6xl px-4 py-24 text-sm text-muted">Loading report…</main>
      </Shell>
    );
  }

  if (!report) {
    return (
      <Shell>
        <main className="mx-auto max-w-lg px-4 py-24 text-center">
          <h1 className="font-display text-3xl">Report not on this device</h1>
          <p className="mt-3 text-muted">
            Reports are stored in this browser only. Run a new scan to generate one.
          </p>
          <Button asChild className="mt-6">
            <Link to="/">New scan</Link>
          </Button>
        </main>
      </Shell>
    );
  }

  const date = new Date(report.createdAt).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <Shell>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Link
              to="/"
              className="inline-flex items-center gap-1 text-sm text-muted hover:text-fg"
            >
              <ArrowLeft className="size-4" /> New scan
            </Link>
            <h1 className="mt-2 font-display text-3xl tracking-tight sm:text-4xl">
              {report.title}
            </h1>
            <p className="mt-1 text-sm text-muted">{date}</p>
          </div>
        </div>
        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(18rem,0.75fr)]">
          <div className="flex flex-col gap-4">
            <HighlightedPaper
              text={report.text}
              spans={report.spans}
              sources={report.sources}
              activeId={activeId}
              onSelect={setActiveId}
            />
            <DeepScanBox text={report.text} />
          </div>
          <SourcePanel report={report} activeId={activeId} onSelect={setActiveId} />
        </div>
      </main>
    </Shell>
  );
}
