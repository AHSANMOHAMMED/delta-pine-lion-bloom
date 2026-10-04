import { cn } from "@/lib/utils";

export function scoreTone(score: number): "ok" | "warn" | "danger" | "ink" {
  if (score < 15) return "ok";
  if (score < 40) return "ink";
  if (score < 70) return "warn";
  return "danger";
}

const STROKE: Record<ReturnType<typeof scoreTone>, string> = {
  ok: "var(--color-ok)",
  ink: "var(--color-primary)",
  warn: "var(--color-warn)",
  danger: "var(--color-danger)",
};

export function ScoreRing({
  score,
  size = 168,
  label = "Similarity",
}: {
  score: number;
  size?: number;
  label?: string;
}) {
  const tone = scoreTone(score);
  const r = 54;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, score));
  const dash = (clamped / 100) * c;

  return (
    <div className="flex flex-col items-center gap-2">
      <svg
        width={size}
        height={size}
        viewBox="0 0 140 140"
        className="overflow-visible"
        aria-label={`${label} ${Math.round(clamped)} percent`}
      >
        <circle
          cx="70"
          cy="70"
          r={r}
          fill="none"
          stroke="color-mix(in oklab, var(--color-fg) 10%, transparent)"
          strokeWidth="10"
        />
        <circle
          cx="70"
          cy="70"
          r={r}
          fill="none"
          stroke={STROKE[tone]}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c - dash}`}
          transform="rotate(-90 70 70)"
          className="transition-[stroke-dasharray] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
        />
        <text
          x="70"
          y="68"
          textAnchor="middle"
          className="fill-fg font-display"
          style={{ fontSize: "32px", fontWeight: 550 }}
        >
          {Math.round(clamped)}
          <tspan style={{ fontSize: "16px" }}>%</tspan>
        </text>
        <text
          x="70"
          y="90"
          textAnchor="middle"
          className="fill-muted"
          style={{ fontSize: "10px", letterSpacing: "0.16em" }}
        >
          {label.toUpperCase()}
        </text>
      </svg>
      <p className={cn("text-xs uppercase tracking-[0.16em]", toneClass(tone))}>
        {bandLabel(clamped)}
      </p>
    </div>
  );
}

function toneClass(tone: ReturnType<typeof scoreTone>) {
  if (tone === "ok") return "text-ok";
  if (tone === "warn") return "text-warn";
  if (tone === "danger") return "text-danger";
  return "text-primary";
}

function bandLabel(score: number) {
  if (score < 15) return "Low overlap";
  if (score < 40) return "Moderate overlap";
  if (score < 70) return "High overlap";
  return "Severe overlap";
}
