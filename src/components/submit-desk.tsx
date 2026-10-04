import { useNavigate } from "@tanstack/react-router";
import { FileUp, LoaderCircle } from "lucide-react";
import { useRef, useState } from "react";
import { SAMPLE_NEAR_COPY, SAMPLE_ORIGINAL, SAMPLE_PATCHWORK } from "@/lib/corpus";
import { extractFromFile } from "@/lib/engine/files";
import { buildReport } from "@/lib/engine/scan";
import { distinctivePhrases, wordCount } from "@/lib/engine/text";
import { useProvenance } from "@/lib/store";
import { searchPublicSources } from "@/lib/web-search";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScanOverlay, type ScanStage } from "@/components/scan-overlay";

const STAGES: ScanStage[] = [
  { id: "read", label: "Reading submission" },
  { id: "chunk", label: "Cleaning and chunking" },
  { id: "print", label: "Fingerprinting passages" },
  { id: "lib", label: "Searching the library" },
  { id: "web", label: "Checking public sources" },
  { id: "report", label: "Building the report" },
];

export function SubmitDesk() {
  const navigate = useNavigate();
  const library = useProvenance((s) => s.library);
  const saveReport = useProvenance((s) => s.saveReport);
  const fileRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [fileLabel, setFileLabel] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [stage, setStage] = useState(0);

  async function onFile(file: File) {
    setError(null);
    try {
      const extracted = await extractFromFile(file);
      setText(extracted);
      setFileLabel(file.name);
      if (!title) setTitle(file.name.replace(/\.[^.]+$/, ""));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not read that file.");
    }
  }

  async function runScan() {
    const body = text.trim();
    if (wordCount(body) < 40) {
      setError("Need at least 40 words to produce a reliable report.");
      return;
    }
    setError(null);
    setScanning(true);
    setStage(0);
    const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
    try {
      setStage(0);
      await wait(180);
      setStage(1);
      await wait(220);
      setStage(2);
      await wait(240);
      setStage(3);
      await wait(200);
      setStage(4);
      let web: Awaited<ReturnType<typeof searchPublicSources>> = [];
      try {
        const phrases = distinctivePhrases(body, 3);
        if (phrases.length) {
          web = await searchPublicSources({ data: { phrases } });
        }
      } catch {
        web = [];
      }
      setStage(5);
      const report = buildReport({
        title: title || "Untitled submission",
        text: body,
        library,
        web: web ?? [],
      });
      saveReport(report);
      await wait(160);
      void navigate({ to: "/report/$id", params: { id: report.id } });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Scan failed.");
      setScanning(false);
    }
  }

  return (
    <>
      {scanning ? <ScanOverlay stages={STAGES} current={stage} /> : null}
      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(17rem,0.8fr)]">
        <div className="rounded-xl bg-surface p-4 shadow-border sm:p-6">
          <label className="text-xs uppercase tracking-[0.16em] text-muted">Title</label>
          <Input
            className="mt-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Assignment, essay, or paper title"
          />
          <div className="mt-5 flex items-center justify-between gap-3">
            <label className="text-xs uppercase tracking-[0.16em] text-muted">Text</label>
            <span className="font-mono text-xs text-subtle tabular-nums">
              {wordCount(text)} words
            </span>
          </div>
          <Textarea
            className="mt-2 min-h-72 font-display text-[1.05rem] leading-relaxed"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste the submission, or drop a .txt, .docx, or .pdf file."
          />
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <input
              ref={fileRef}
              type="file"
              accept=".txt,.md,.docx,.pdf,text/plain"
              className="sr-only"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void onFile(f);
              }}
            />
            <Button
              type="button"
              variant="secondary"
              onClick={() => fileRef.current?.click()}
            >
              <FileUp />
              Upload file
            </Button>
            {fileLabel ? <span className="text-sm text-muted">{fileLabel}</span> : null}
            <Button type="button" className="ml-auto" onClick={() => void runScan()} disabled={scanning}>
              {scanning ? <LoaderCircle className="animate-spin" /> : null}
              Run originality scan
            </Button>
          </div>
          {error ? <p className="mt-3 text-sm text-danger">{error}</p> : null}
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-xl bg-surface p-5 shadow-border">
            <h2 className="font-display text-lg">Try a sample</h2>
            <p className="mt-1 text-sm text-muted">
              The checker is most obvious when you already know what should light up.
            </p>
            <ul className="mt-4 flex flex-col gap-2">
              <SampleButton
                title={SAMPLE_PATCHWORK.title}
                hint="Copied passages from the built-in corpus"
                onClick={() => {
                  setTitle(SAMPLE_PATCHWORK.title);
                  setText(SAMPLE_PATCHWORK.body);
                }}
              />
              <SampleButton
                title={SAMPLE_NEAR_COPY.title}
                hint="Paraphrase of a corpus note on Hamlet"
                onClick={() => {
                  setTitle(SAMPLE_NEAR_COPY.title);
                  setText(SAMPLE_NEAR_COPY.body);
                }}
              />
              <SampleButton
                title={SAMPLE_ORIGINAL.title}
                hint="Original prose — should stay mostly unmarked"
                onClick={() => {
                  setTitle(SAMPLE_ORIGINAL.title);
                  setText(SAMPLE_ORIGINAL.body);
                }}
              />
            </ul>
          </div>
          <div className="rounded-xl bg-surface p-5 shadow-border">
            <h2 className="font-display text-lg">What it checks</h2>
            <ol className="mt-3 space-y-3 text-sm leading-relaxed text-muted">
              <li>
                <span className="font-medium text-fg">Fingerprints.</span> Overlapping word
                shingles, the same family of method commercial checkers use on local text.
              </li>
              <li>
                <span className="font-medium text-fg">Your library.</span> Papers you store
                here are treated as prior submissions.
              </li>
              <li>
                <span className="font-medium text-fg">Public pages.</span> Distinctive phrases
                are looked up on Wikipedia. This is not a publisher archive.
              </li>
            </ol>
            <p className="mt-4 text-xs leading-relaxed text-subtle">
              Provenance cannot see paywalled journals or university paper mills. A low score
              means nothing matched this index — not that the writing is original everywhere.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

function SampleButton({
  title,
  hint,
  onClick,
}: {
  title: string;
  hint: string;
  onClick: () => void;
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        className="w-full rounded-md px-3 py-3 text-left transition-colors duration-150 hover:bg-sunken"
      >
        <span className="block text-sm font-medium">{title}</span>
        <span className="mt-0.5 block text-xs text-muted">{hint}</span>
      </button>
    </li>
  );
}
