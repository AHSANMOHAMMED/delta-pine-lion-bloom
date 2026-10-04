export type ScanStage = { id: string; label: string };

export function ScanOverlay({
  stages,
  current,
}: {
  stages: ScanStage[];
  current: number;
}) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-primary/70 px-4">
      <div className="w-full max-w-md rounded-xl bg-surface p-6 shadow-border">
        <p className="text-xs uppercase tracking-[0.18em] text-muted">Scanning</p>
        <h2 className="mt-1 font-display text-2xl">Building the report</h2>
        <ul className="mt-5 space-y-3">
          {stages.map((s, i) => {
            const state = i < current ? "done" : i === current ? "now" : "wait";
            return (
              <li key={s.id} className="flex items-center gap-3 text-sm">
                <span
                  className={
                    state === "now"
                      ? "size-2.5 animate-pulse rounded-full bg-primary"
                      : state === "done"
                        ? "size-2.5 rounded-full bg-ok"
                        : "size-2.5 rounded-full bg-border"
                  }
                />
                <span className={state === "wait" ? "text-subtle" : "text-fg"}>{s.label}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
