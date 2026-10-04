import { createFileRoute } from "@tanstack/react-router";
import { LibraryDesk } from "@/components/library-desk";
import { Shell } from "@/components/shell";

export const Route = createFileRoute("/library")({ component: LibraryPage });

function LibraryPage() {
  return (
    <Shell>
      <main className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
        <p className="text-xs uppercase tracking-[0.22em] text-muted">Prior sources</p>
        <h1 className="mt-3 font-display text-4xl tracking-tight">Library</h1>
        <p className="mt-3 max-w-2xl text-muted">
          Store papers you already hold. They never leave this browser. Built-in public-domain
          texts stay indexed for everyone.
        </p>
        <div className="mt-8">
          <LibraryDesk />
        </div>
      </main>
    </Shell>
  );
}
