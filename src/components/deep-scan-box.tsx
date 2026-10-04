import { useState } from "react";
import { runDeepScan, type DeepScanResult } from "@/lib/deep-scan";
import { Button } from "@/components/ui/button";

export function DeepScanBox({ text }: { text: string }) {
  const [state, setState] = useState<"idle" | "loading">("idle");
  const [result, setResult] = useState<DeepScanResult | null>(null);

  async function run() {
    setState("loading");
    try {
      const r = await runDeepScan({ data: { text } });
      setResult(r);
    } catch {
      setResult({ ok: false, error: "Deep scan failed." });
    } finally {
      setState("idle");
    }
  }

  return (
    <section className="rounded-xl bg-surface p-5 shadow-border">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-lg">Deep paraphrase pass</h2>
          <p className="mt-1 text-sm text-muted">
            Optional. Sends this submission to Grok once to flag likely paraphrases of
            well-known public texts. Not run automatically.
          </p>
        </div>
        <Button
          type="button"
          variant="secondary"
          onClick={() => void run()}
          disabled={state === "loading"}
        >
          {state === "loading" ? "Reading…" : "Run deep scan"}
        </Button>
      </div>
      {result ? (
        <div className="mt-4 text-sm leading-relaxed">
          {!result.ok ? (
            <p className="text-muted">{result.error}</p>
          ) : (
            <>
              {result.likelySources.length ? (
                <p>
                  <span className="font-medium">Possible public sources: </span>
                  {result.likelySources.join("; ")}
                </p>
              ) : null}
              {result.paraphraseNotes.length ? (
                <ul className="mt-2 list-disc space-y-1 pl-5 text-muted">
                  {result.paraphraseNotes.map((n) => (
                    <li key={n}>{n}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted">No obvious textbook paraphrases called out.</p>
              )}
              {result.aiNote ? <p className="mt-3 text-muted">{result.aiNote}</p> : null}
            </>
          )}
        </div>
      ) : null}
    </section>
  );
}
