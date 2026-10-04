import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { S as require_jsx_runtime, b as useNavigate, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as createServerFn } from "./ssr.mjs";
import { a as FileUp, i as LoaderCircle } from "../_libs/lucide-react.mjs";
import { a as useProvenance, i as uid, n as Shell, r as cn, t as Button } from "./button-BqO9ai5B.mjs";
import { a as SAMPLE_PATCHWORK, c as distinctivePhrases, d as tokenize, f as wordCount, i as SAMPLE_ORIGINAL, l as extractFromFile, n as Input, o as STOPWORDS, r as SAMPLE_NEAR_COPY, s as Textarea, t as BUILTIN_CORPUS, u as splitSentences } from "./textarea-BjKmhFRi.mjs";
import { n as createSsrRpc, r as scoreTone } from "./createSsrRpc-Bw0GN4k4.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DOu0Fuay.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function RecentReports() {
	const reports = useProvenance((s) => s.reports);
	if (!reports.length) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mt-10",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "font-display text-xl",
			children: "Recent reports"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-3 divide-y divide-border rounded-xl bg-surface shadow-border",
			children: reports.slice(0, 6).map((r) => {
				const tone = scoreTone(r.overallSimilarity);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/report/$id",
					params: { id: r.id },
					className: "flex items-center justify-between gap-4 px-4 py-3 hover:bg-sunken",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block truncate text-sm font-medium",
							children: r.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted",
							children: new Date(r.createdAt).toLocaleString(void 0, {
								dateStyle: "medium",
								timeStyle: "short"
							})
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: cn("font-mono text-sm tabular-nums", tone === "ok" && "text-ok", tone === "warn" && "text-warn", tone === "danger" && "text-danger", tone === "ink" && "text-primary"),
						children: [Math.round(r.overallSimilarity), "%"]
					})]
				}) }, r.id);
			})
		})]
	});
}
function hashStr(s) {
	let h = 2166136261;
	for (let i = 0; i < s.length; i++) {
		h ^= s.charCodeAt(i);
		h = Math.imul(h, 16777619);
	}
	return h >>> 0;
}
function shingles(tokens, k) {
	const out = [];
	if (tokens.length < k) return out;
	for (let i = 0; i <= tokens.length - k; i++) {
		const gram = tokens.slice(i, i + k).map((t) => t.norm).join(" ");
		out.push({
			hash: hashStr(gram),
			startTok: i,
			endTok: i + k - 1
		});
	}
	return out;
}
/** Winnowing: keep the rightmost minimum hash in each window of size w. */
function winnow(prints, w = 4) {
	if (prints.length <= w) return prints;
	const selected = [];
	let last = -1;
	for (let i = 0; i <= prints.length - w; i++) {
		let minIdx = i;
		let minHash = prints[i].hash;
		for (let j = i + 1; j < i + w; j++) {
			const h = prints[j].hash;
			if (h <= minHash) {
				minHash = h;
				minIdx = j;
			}
		}
		if (minIdx !== last) {
			selected.push(prints[minIdx]);
			last = minIdx;
		}
	}
	return selected;
}
function indexFingerprints(prints) {
	const map = /* @__PURE__ */ new Map();
	for (const p of prints) {
		const list = map.get(p.hash);
		if (list) list.push(p);
		else map.set(p.hash, [p]);
	}
	return map;
}
function analyzeStyle(text) {
	const sentences = splitSentences(text);
	const tokens = tokenize(text);
	const lengths = sentences.map((s) => s.text.split(/\s+/).length);
	const avg = lengths.length ? lengths.reduce((a, b) => a + b, 0) / lengths.length : 0;
	const variance = lengths.length > 1 ? lengths.reduce((a, l) => a + (l - avg) ** 2, 0) / lengths.length : 0;
	const burstiness = Math.sqrt(variance);
	const types = new Set(tokens.map((t) => t.norm));
	const typeToken = tokens.length ? types.size / tokens.length : 0;
	const evenness = avg === 0 ? 0 : 1 - Math.min(burstiness / (avg * .7), 1);
	const lengthCluster = avg > 14 && avg < 28 ? .2 : 0;
	const lowBurst = burstiness < 6 ? .25 : burstiness < 10 ? .1 : 0;
	const uniform = typeToken > .55 && typeToken < .78 ? .15 : 0;
	let likelihood = Math.round(Math.min(.95, evenness * .5 + lengthCluster + lowBurst + uniform) * 100);
	if (tokens.length < 80) likelihood = Math.min(likelihood, 35);
	let note = "Stylometry is a weak signal — treat it as a prompt for review, not a verdict.";
	if (likelihood >= 60) note = "Even sentence rhythm and limited burstiness often appear in machine-drafted prose. Read the highlighted sources first; this is not proof of AI use.";
	else if (likelihood <= 25) note = "Sentence length varies the way most human drafts do. Low score here does not prove human authorship.";
	return {
		likelihood,
		burstiness: Math.round(burstiness * 10) / 10,
		typeToken: Math.round(typeToken * 100) / 100,
		avgSentence: Math.round(avg * 10) / 10,
		note
	};
}
function bag(text) {
	const m = /* @__PURE__ */ new Map();
	for (const raw of text.toLowerCase().match(/[a-z0-9']+/g) ?? []) {
		const w = raw.replace(/'/g, "");
		if (w.length < 3 || STOPWORDS.has(w)) continue;
		m.set(w, (m.get(w) ?? 0) + 1);
	}
	return m;
}
function cosine(a, b) {
	const A = bag(a);
	const B = bag(b);
	if (A.size === 0 || B.size === 0) return 0;
	let dot = 0;
	let na = 0;
	let nb = 0;
	for (const [, v] of A) na += v * v;
	for (const [k, v] of B) {
		nb += v * v;
		const u = A.get(k);
		if (u) dot += u * v;
	}
	if (na === 0 || nb === 0) return 0;
	return dot / Math.sqrt(na * nb);
}
var EXACT_K = 5;
var NEAR_K = 3;
function indexDoc(doc) {
	const tokens = tokenize(doc.text);
	return {
		doc,
		tokens,
		exact: indexFingerprints(winnow(shingles(tokens, EXACT_K))),
		near: indexFingerprints(shingles(tokens, NEAR_K)),
		sentences: splitSentences(doc.text)
	};
}
function kindRank(k) {
	return k === "exact" ? 0 : k === "near" ? 1 : 2;
}
function mergeSpans(spans) {
	if (!spans.length) return [];
	const sorted = [...spans].sort((a, b) => a.start - b.start || b.end - a.end);
	const out = [];
	for (const s of sorted) {
		const last = out[out.length - 1];
		if (last && s.sourceId === last.sourceId && s.start <= last.end + 1) {
			last.end = Math.max(last.end, s.end);
			last.score = Math.max(last.score, s.score);
			if (kindRank(s.kind) < kindRank(last.kind)) last.kind = s.kind;
		} else out.push({ ...s });
	}
	return out;
}
function collectMatches(queryTokens, queryText, indexed) {
	const spans = [];
	const exactQ = winnow(shingles(queryTokens, EXACT_K));
	const nearQ = shingles(queryTokens, NEAR_K);
	for (const src of indexed) {
		for (const fp of exactQ) {
			if (!src.exact.has(fp.hash)) continue;
			const a = queryTokens[fp.startTok];
			const b = queryTokens[fp.endTok];
			spans.push({
				start: a.start,
				end: b.end,
				sourceId: src.doc.id,
				score: .98,
				kind: "exact",
				matchedText: queryText.slice(a.start, b.end)
			});
		}
		for (const fp of nearQ) {
			if (!src.near.has(fp.hash)) continue;
			const a = queryTokens[fp.startTok];
			const b = queryTokens[fp.endTok];
			spans.push({
				start: a.start,
				end: b.end,
				sourceId: src.doc.id,
				score: .82,
				kind: "near",
				matchedText: queryText.slice(a.start, b.end)
			});
		}
	}
	const qSentences = splitSentences(queryText);
	for (const qs of qSentences) {
		if (qs.text.split(/\s+/).length < 8) continue;
		let best = null;
		for (const src of indexed) for (const ss of src.sentences) {
			const score = cosine(qs.text, ss.text);
			if (score >= .62 && (!best || score > best.score)) best = {
				src,
				score
			};
		}
		if (best) spans.push({
			start: qs.start,
			end: qs.end,
			sourceId: best.src.doc.id,
			score: best.score,
			kind: best.score >= .84 ? "near" : "paraphrase",
			matchedText: qs.text
		});
	}
	return mergeSpans(spans);
}
function coverage(tokens, spans, pred) {
	if (!tokens.length) return 0;
	let hit = 0;
	for (const t of tokens) if (spans.some((s) => pred(s) && t.start < s.end && t.end > s.start)) hit++;
	return hit / tokens.length;
}
function excerptAround(text, start, len = 180) {
	const a = Math.max(0, start - 20);
	const slice = text.slice(a, a + len).trim();
	return (a > 0 ? "…" : "") + slice + (a + len < text.length ? "…" : "");
}
function buildReport(opts) {
	const text = opts.text.replace(/\u00a0/g, " ").trim();
	const tokens = tokenize(text);
	const sources = [
		...BUILTIN_CORPUS,
		...opts.library,
		...opts.web.map((w, i) => ({
			id: `web_${i}_${w.url}`,
			title: w.title,
			text: w.extract,
			kind: "web",
			url: w.url
		}))
	];
	const spans = collectMatches(tokens, text, sources.filter((d) => tokenize(d.text).length >= 20).map(indexDoc));
	const exactCov = coverage(tokens, spans, (s) => s.kind === "exact");
	const allCov = coverage(tokens, spans, () => true);
	const nearCov = Math.max(0, allCov - exactCov);
	const exactPct = Math.round(exactCov * 1e3) / 10;
	const nearPct = Math.round(nearCov * 1e3) / 10;
	const covered = Math.min(100, Math.round((exactPct + nearPct * .85) * 10) / 10);
	const original = Math.max(0, Math.round((100 - covered) * 10) / 10);
	const bySource = /* @__PURE__ */ new Map();
	for (const s of spans) {
		const list = bySource.get(s.sourceId);
		if (list) list.push(s);
		else bySource.set(s.sourceId, [s]);
	}
	const sourceHits = [];
	let color = 0;
	for (const [id, list] of bySource) {
		const doc = sources.find((d) => d.id === id);
		if (!doc) continue;
		const sim = Math.round(coverage(tokens, list, () => true) * 1e3) / 10;
		if (sim < 1.2) continue;
		const first = list[0];
		sourceHits.push({
			id,
			title: doc.title,
			kind: doc.kind,
			url: doc.url,
			similarity: sim,
			excerpt: excerptAround(text, first.start),
			colorIndex: color % 6,
			matchCount: list.length
		});
		color++;
	}
	sourceHits.sort((a, b) => b.similarity - a.similarity);
	const allowed = new Set(sourceHits.map((s) => s.id));
	const coloredSpans = spans.filter((s) => allowed.has(s.sourceId));
	const top = sourceHits[0];
	const summary = top ? `${covered}% of this submission overlaps indexed sources. Strongest overlap: ${top.title} (${top.similarity}%).` : "No overlapping passages were found in the local corpus, your library, or retrieved web extracts.";
	return {
		id: uid("rep"),
		title: opts.title.trim() || "Untitled submission",
		createdAt: (/* @__PURE__ */ new Date()).toISOString(),
		text,
		wordCount: tokens.length,
		overallSimilarity: covered,
		exactPercent: exactPct,
		nearPercent: nearPct,
		originalPercent: original,
		sources: sourceHits,
		spans: coloredSpans,
		ai: analyzeStyle(text),
		summary,
		webQueried: opts.web.length > 0
	};
}
var searchPublicSources = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("9d7bfef2b285e86efd5a016762b58800693ece56dc8546a33f66d929b48787e1"));
function ScanOverlay({ stages, current }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-40 flex items-center justify-center bg-primary/70 px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-md rounded-xl bg-surface p-6 shadow-border",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs uppercase tracking-[0.18em] text-muted",
					children: "Scanning"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-1 font-display text-2xl",
					children: "Building the report"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-5 space-y-3",
					children: stages.map((s, i) => {
						const state = i < current ? "done" : i === current ? "now" : "wait";
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center gap-3 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: state === "now" ? "size-2.5 animate-pulse rounded-full bg-primary" : state === "done" ? "size-2.5 rounded-full bg-ok" : "size-2.5 rounded-full bg-border" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: state === "wait" ? "text-subtle" : "text-fg",
								children: s.label
							})]
						}, s.id);
					})
				})
			]
		})
	});
}
var STAGES = [
	{
		id: "read",
		label: "Reading submission"
	},
	{
		id: "chunk",
		label: "Cleaning and chunking"
	},
	{
		id: "print",
		label: "Fingerprinting passages"
	},
	{
		id: "lib",
		label: "Searching the library"
	},
	{
		id: "web",
		label: "Checking public sources"
	},
	{
		id: "report",
		label: "Building the report"
	}
];
function SubmitDesk() {
	const navigate = useNavigate();
	const library = useProvenance((s) => s.library);
	const saveReport = useProvenance((s) => s.saveReport);
	const fileRef = (0, import_react.useRef)(null);
	const [title, setTitle] = (0, import_react.useState)("");
	const [text, setText] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)(null);
	const [fileLabel, setFileLabel] = (0, import_react.useState)(null);
	const [scanning, setScanning] = (0, import_react.useState)(false);
	const [stage, setStage] = (0, import_react.useState)(0);
	async function onFile(file) {
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
		const wait = (ms) => new Promise((r) => setTimeout(r, ms));
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
			let web = [];
			try {
				const phrases = distinctivePhrases(body, 3);
				if (phrases.length) web = await searchPublicSources({ data: { phrases } });
			} catch {
				web = [];
			}
			setStage(5);
			const report = buildReport({
				title: title || "Untitled submission",
				text: body,
				library,
				web: web ?? []
			});
			saveReport(report);
			await wait(160);
			navigate({
				to: "/report/$id",
				params: { id: report.id }
			});
		} catch (e) {
			setError(e instanceof Error ? e.message : "Scan failed.");
			setScanning(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [scanning ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScanOverlay, {
		stages: STAGES,
		current: stage
	}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(17rem,0.8fr)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-xl bg-surface p-4 shadow-border sm:p-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "text-xs uppercase tracking-[0.16em] text-muted",
					children: "Title"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					className: "mt-2",
					value: title,
					onChange: (e) => setTitle(e.target.value),
					placeholder: "Assignment, essay, or paper title"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 flex items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "text-xs uppercase tracking-[0.16em] text-muted",
						children: "Text"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-mono text-xs text-subtle tabular-nums",
						children: [wordCount(text), " words"]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					className: "mt-2 min-h-72 font-display text-[1.05rem] leading-relaxed",
					value: text,
					onChange: (e) => setText(e.target.value),
					placeholder: "Paste the submission, or drop a .txt, .docx, or .pdf file."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex flex-wrap items-center gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							ref: fileRef,
							type: "file",
							accept: ".txt,.md,.docx,.pdf,text/plain",
							className: "sr-only",
							onChange: (e) => {
								const f = e.target.files?.[0];
								if (f) onFile(f);
							}
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "button",
							variant: "secondary",
							onClick: () => fileRef.current?.click(),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileUp, {}), "Upload file"]
						}),
						fileLabel ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm text-muted",
							children: fileLabel
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "button",
							className: "ml-auto",
							onClick: () => void runScan(),
							disabled: scanning,
							children: [scanning ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "animate-spin" }) : null, "Run originality scan"]
						})
					]
				}),
				error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-danger",
					children: error
				}) : null
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl bg-surface p-5 shadow-border",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-lg",
						children: "Try a sample"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: "The checker is most obvious when you already know what should light up."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "mt-4 flex flex-col gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SampleButton, {
								title: SAMPLE_PATCHWORK.title,
								hint: "Copied passages from the built-in corpus",
								onClick: () => {
									setTitle(SAMPLE_PATCHWORK.title);
									setText(SAMPLE_PATCHWORK.body);
								}
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SampleButton, {
								title: SAMPLE_NEAR_COPY.title,
								hint: "Paraphrase of a corpus note on Hamlet",
								onClick: () => {
									setTitle(SAMPLE_NEAR_COPY.title);
									setText(SAMPLE_NEAR_COPY.body);
								}
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SampleButton, {
								title: SAMPLE_ORIGINAL.title,
								hint: "Original prose — should stay mostly unmarked",
								onClick: () => {
									setTitle(SAMPLE_ORIGINAL.title);
									setText(SAMPLE_ORIGINAL.body);
								}
							})
						]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl bg-surface p-5 shadow-border",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-lg",
						children: "What it checks"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
						className: "mt-3 space-y-3 text-sm leading-relaxed text-muted",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium text-fg",
								children: "Fingerprints."
							}), " Overlapping word shingles, the same family of method commercial checkers use on local text."] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium text-fg",
								children: "Your library."
							}), " Papers you store here are treated as prior submissions."] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium text-fg",
								children: "Public pages."
							}), " Distinctive phrases are looked up on Wikipedia. This is not a publisher archive."] })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-xs leading-relaxed text-subtle",
						children: "Provenance cannot see paywalled journals or university paper mills. A low score means nothing matched this index — not that the writing is original everywhere."
					})
				]
			})]
		})]
	})] });
}
function SampleButton({ title, hint, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick,
		className: "w-full rounded-md px-3 py-3 text-left transition-colors duration-150 hover:bg-sunken",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "block text-sm font-medium",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "mt-0.5 block text-xs text-muted",
			children: hint
		})]
	}) });
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-6xl px-4 py-10 sm:py-14",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs uppercase tracking-[0.22em] text-muted",
				children: "Similarity index"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-3 max-w-3xl font-display text-4xl leading-[1.15] tracking-tight sm:text-5xl",
				children: "See which passages already exist."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 max-w-2xl text-base leading-relaxed text-muted sm:text-lg",
				children: "Paste a paper. Provenance fingerprints the text, searches your library and a public index, then returns a source-linked originality report — coverage score, highlights, and a writing-regularity note."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-10",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SubmitDesk, {})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecentReports, {})
		]
	}) });
}
//#endregion
export { Home as component };
