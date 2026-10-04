import { Trash2, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { BUILTIN_CORPUS } from "@/lib/corpus";
import { extractFromFile } from "@/lib/engine/files";
import { wordCount } from "@/lib/engine/text";
import { useProvenance } from "@/lib/store";
import { uid } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

export function LibraryDesk() {
  const library = useProvenance((s) => s.library);
  const addLibrary = useProvenance((s) => s.addLibrary);
  const removeLibrary = useProvenance((s) => s.removeLibrary);
  const fileRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);

  function add(fromTitle: string, body: string) {
    if (wordCount(body) < 40) {
      setError("Documents need at least 40 words.");
      return;
    }
    addLibrary({
      id: uid("lib"),
      title: fromTitle.trim() || "Untitled source",
      text: body.trim(),
      kind: "library",
    });
    setTitle("");
    setText("");
    setError(null);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="rounded-xl bg-surface p-5 shadow-border sm:p-6">
        <h2 className="font-display text-2xl">Add a source</h2>
        <p className="mt-1 text-sm text-muted">
          Anything stored here is treated as a prior submission or known text. Later scans
          will highlight overlap against it.
        </p>
        <label className="mt-5 block text-xs uppercase tracking-[0.16em] text-muted">
          Source title
        </label>
        <Input
          className="mt-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Course pack, earlier paper, style guide"
        />
        <Textarea
          className="mt-4 min-h-48"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste the source text"
        />
        <div className="mt-4 flex flex-wrap gap-3">
          <input
            ref={fileRef}
            type="file"
            accept=".txt,.md,.docx,.pdf"
            className="sr-only"
            onChange={async (e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              try {
                const extracted = await extractFromFile(f);
                setText(extracted);
                if (!title) setTitle(f.name.replace(/\.[^.]+$/, ""));
                setError(null);
              } catch (err) {
                setError(err instanceof Error ? err.message : "Could not read file.");
              }
            }}
          />
          <Button type="button" variant="secondary" onClick={() => fileRef.current?.click()}>
            <Upload />
            Upload
          </Button>
          <Button type="button" onClick={() => add(title, text)}>
            Add to library
          </Button>
        </div>
        {error ? <p className="mt-3 text-sm text-danger">{error}</p> : null}
      </section>

      <section className="flex flex-col gap-4">
        <div className="rounded-xl bg-surface p-5 shadow-border">
          <h2 className="font-display text-xl">Your library</h2>
          {library.length === 0 ? (
            <p className="mt-2 text-sm text-muted">No personal sources yet.</p>
          ) : (
            <ul className="mt-3 divide-y divide-border">
              {library.map((d) => (
                <li key={d.id} className="flex items-start justify-between gap-3 py-3">
                  <div>
                    <p className="text-sm font-medium">{d.title}</p>
                    <p className="font-mono text-xs text-subtle tabular-nums">
                      {wordCount(d.text)} words
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={`Remove ${d.title}`}
                    onClick={() => removeLibrary(d.id)}
                  >
                    <Trash2 />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="rounded-xl bg-surface p-5 shadow-border">
          <h2 className="font-display text-xl">Built-in corpus</h2>
          <p className="mt-1 text-sm text-muted">
            Public-domain speeches and reference notes always indexed, so sample papers have
            something to match.
          </p>
          <ul className="mt-3 space-y-2">
            {BUILTIN_CORPUS.map((d) => (
              <li key={d.id} className="flex items-center justify-between gap-3 text-sm">
                <span>{d.title}</span>
                <Badge>corpus</Badge>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
