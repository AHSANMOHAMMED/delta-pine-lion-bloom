import { createFileRoute } from "@tanstack/react-router";
import { RecentReports } from "@/components/recent-reports";
import { Shell } from "@/components/shell";
import { SubmitDesk } from "@/components/submit-desk";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <Shell>
      <main className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
        <p className="text-xs uppercase tracking-[0.22em] text-muted">Similarity index</p>
        <h1 className="mt-3 max-w-3xl font-display text-4xl leading-[1.15] tracking-tight sm:text-5xl">
          See which passages already exist.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
          Paste a paper. Provenance fingerprints the text, searches your library and a public
          index, then returns a source-linked originality report — coverage score, highlights,
          and a writing-regularity note.
        </p>
        <div className="mt-10">
          <SubmitDesk />
        </div>
        <RecentReports />
      </main>
    </Shell>
  );
}
