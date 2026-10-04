import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { S as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as createServerFn } from "./ssr.mjs";
import { l as ArrowLeft, s as ExternalLink } from "../_libs/lucide-react.mjs";
import { a as useProvenance, n as Shell, r as cn, t as Button } from "./button-BqO9ai5B.mjs";
import { t as Badge } from "./badge-CZQCvxPZ.mjs";
import { n as Route } from "./router-CHW_fg6R.mjs";
import { n as createSsrRpc, t as ScoreRing } from "./createSsrRpc-Bw0GN4k4.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/report._id-WhfOiINZ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function HighlightedPaper({ text, spans, sources, activeId, onSelect }) {
	const colorOf = (0, import_react.useMemo)(() => {
		const m = /* @__PURE__ */ new Map();
		for (const s of sources) m.set(s.id, s.colorIndex);
		return m;
	}, [sources]);
	const pieces = (0, import_react.useMemo)(() => buildPieces(text, spans, colorOf), [
		text,
		spans,
		colorOf
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "rounded-xl bg-surface p-5 shadow-border sm:p-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mb-4 font-display text-sm text-muted",
			children: "Submission"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "font-display text-[1.05rem] leading-[1.75] text-fg",
			children: pieces.map((p, i) => p.type === "text" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: p.text }, i) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("mark", {
				className: cn("cursor-pointer rounded-sm px-0.5", `mark-${p.color}`, activeId === p.span.sourceId && "mark-active"),
				style: { color: "inherit" },
				title: "Matched source",
				onClick: () => onSelect(p.span.sourceId),
				children: p.text
			}, i))
		})]
	});
}
function buildPieces(text, spans, colorOf) {
	const sorted = [...spans].filter((s) => s.end > s.start).sort((a, b) => a.start - b.start || b.end - a.end);
	const merged = [];
	for (const s of sorted) {
		const last = merged[merged.length - 1];
		if (last && s.start < last.end) {
			if (s.end > last.end) last.end = s.end;
			continue;
		}
		merged.push({ ...s });
	}
	const pieces = [];
	let cursor = 0;
	for (const s of merged) {
		if (s.start > cursor) pieces.push({
			type: "text",
			text: text.slice(cursor, s.start)
		});
		const start = Math.max(s.start, cursor);
		if (s.end > start) {
			pieces.push({
				type: "mark",
				text: text.slice(start, s.end),
				span: s,
				color: colorOf.get(s.sourceId) ?? 0
			});
			cursor = s.end;
		}
	}
	if (cursor < text.length) pieces.push({
		type: "text",
		text: text.slice(cursor)
	});
	return pieces;
}
function Separator({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("h-px w-full bg-border", className),
		role: "separator"
	});
}
function SourcePanel({ report, activeId, onSelect }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		className: "flex flex-col gap-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl bg-surface p-5 shadow-border",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoreRing, { score: report.overallSimilarity }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-center text-sm leading-relaxed text-muted",
						children: report.summary
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 overflow-hidden rounded-md",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex h-2.5 w-full",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
									color: "var(--color-danger)",
									pct: report.exactPercent
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
									color: "var(--color-warn)",
									pct: report.nearPercent
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
									color: "var(--color-ok)",
									pct: report.originalPercent
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "mt-3 grid grid-cols-3 gap-2 text-center text-[11px] uppercase tracking-[0.12em] text-muted",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "block font-mono text-sm text-danger tabular-nums",
									children: [report.exactPercent, "%"]
								}), "Exact"] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "block font-mono text-sm text-warn tabular-nums",
									children: [report.nearPercent, "%"]
								}), "Near"] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "block font-mono text-sm text-ok tabular-nums",
									children: [report.originalPercent, "%"]
								}), "Original"] })
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 text-center font-mono text-xs text-subtle tabular-nums",
						children: [report.wordCount, " words"]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl bg-surface p-5 shadow-border",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-lg",
						children: "Sources"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: report.sources.length ? "Select a source to focus its highlights." : "No matching sources in the current index."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator, { className: "my-4" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "flex flex-col gap-2",
						children: report.sources.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => onSelect(s.id),
							className: cn("flex w-full items-start gap-3 rounded-md p-3 text-left transition-colors duration-150", activeId === s.id ? "bg-sunken" : "hover:bg-sunken/70"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: cn("mt-1 size-2.5 shrink-0 rounded-full", `bg-hl-${s.colorIndex}`),
								style: { background: `var(--color-hl-${s.colorIndex})` }
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "min-w-0 flex-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex items-center justify-between gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "truncate text-sm font-medium",
											children: s.title
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-mono text-sm tabular-nums",
											children: [s.similarity, "%"]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "mt-1 flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: s.kind }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-xs text-subtle",
											children: [s.matchCount, " matches"]
										})]
									}),
									s.url ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
										href: s.url,
										target: "_blank",
										rel: "noreferrer",
										className: "mt-1 inline-flex items-center gap-1 text-xs text-primary hover:underline",
										onClick: (e) => e.stopPropagation(),
										children: ["Open source ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-3" })]
									}) : null
								]
							})]
						}) }, s.id))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl bg-surface p-5 shadow-border",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-lg",
						children: "Writing regularity"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 font-mono text-2xl tabular-nums",
						children: [report.ai.likelihood, "%"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs uppercase tracking-[0.14em] text-muted",
						children: "Heuristic AI likelihood"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
						className: "mt-4 grid grid-cols-3 gap-2 text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "Burstiness",
								value: String(report.ai.burstiness)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "Type-token",
								value: String(report.ai.typeToken)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "Avg sent.",
								value: String(report.ai.avgSentence)
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-sm leading-relaxed text-muted",
						children: report.ai.note
					})
				]
			})
		]
	});
}
function Bar({ color, pct }) {
	if (pct <= 0) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
		width: `${pct}%`,
		background: color
	} });
}
function Stat({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-sm bg-sunken px-2 py-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "font-mono text-sm tabular-nums",
			children: value
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-[10px] uppercase tracking-[0.12em] text-muted",
			children: label
		})]
	});
}
var runDeepScan = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("e6e745116775371aa55fd6e107333f3324d9aa5677e6c07af414c0edb52248b8"));
function DeepScanBox({ text }) {
	const [state, setState] = (0, import_react.useState)("idle");
	const [result, setResult] = (0, import_react.useState)(null);
	async function run() {
		setState("loading");
		try {
			const r = await runDeepScan({ data: { text } });
			setResult(r);
		} catch {
			setResult({
				ok: false,
				error: "Deep scan failed."
			});
		} finally {
			setState("idle");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-xl bg-surface p-5 shadow-border",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-center justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-lg",
				children: "Deep paraphrase pass"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted",
				children: "Optional. Sends this submission to Grok once to flag likely paraphrases of well-known public texts. Not run automatically."
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "button",
				variant: "secondary",
				onClick: () => void run(),
				disabled: state === "loading",
				children: state === "loading" ? "Reading…" : "Run deep scan"
			})]
		}), result ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4 text-sm leading-relaxed",
			children: !result.ok ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted",
				children: result.error
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				result.likelySources.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-medium",
					children: "Possible public sources: "
				}), result.likelySources.join("; ")] }) : null,
				result.paraphraseNotes.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-2 list-disc space-y-1 pl-5 text-muted",
					children: result.paraphraseNotes.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: n }, n))
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted",
					children: "No obvious textbook paraphrases called out."
				}),
				result.aiNote ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-muted",
					children: result.aiNote
				}) : null
			] })
		}) : null]
	});
}
function ReportPage() {
	const { id } = Route.useParams();
	const report = useProvenance((s) => s.reports.find((r) => r.id === id));
	const [hydrated, setHydrated] = (0, import_react.useState)(() => useProvenance.persist.hasHydrated());
	const [activeId, setActiveId] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		const unsub = useProvenance.persist.onFinishHydration(() => setHydrated(true));
		if (useProvenance.persist.hasHydrated()) setHydrated(true);
		return unsub;
	}, []);
	if (!hydrated) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "mx-auto max-w-6xl px-4 py-24 text-sm text-muted",
		children: "Loading report…"
	}) });
	if (!report) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-lg px-4 py-24 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl",
				children: "Report not on this device"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-muted",
				children: "Reports are stored in this browser only. Run a new scan to generate one."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				className: "mt-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					children: "New scan"
				})
			})
		]
	}) });
	const date = new Date(report.createdAt).toLocaleString(void 0, {
		dateStyle: "medium",
		timeStyle: "short"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-6xl px-4 py-8 sm:py-10",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-wrap items-end justify-between gap-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					className: "inline-flex items-center gap-1 text-sm text-muted hover:text-fg",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4" }), " New scan"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-2 font-display text-3xl tracking-tight sm:text-4xl",
					children: report.title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted",
					children: date
				})
			] })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(18rem,0.75fr)]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HighlightedPaper, {
					text: report.text,
					spans: report.spans,
					sources: report.sources,
					activeId,
					onSelect: setActiveId
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DeepScanBox, { text: report.text })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SourcePanel, {
				report,
				activeId,
				onSelect: setActiveId
			})]
		})]
	}) });
}
//#endregion
export { ReportPage as component };
