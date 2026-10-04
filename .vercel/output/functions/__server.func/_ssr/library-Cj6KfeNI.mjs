import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { S as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as Trash2, t as Upload } from "../_libs/lucide-react.mjs";
import { a as useProvenance, i as uid, n as Shell, t as Button } from "./button-BqO9ai5B.mjs";
import { f as wordCount, l as extractFromFile, n as Input, s as Textarea, t as BUILTIN_CORPUS } from "./textarea-BjKmhFRi.mjs";
import { t as Badge } from "./badge-CZQCvxPZ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/library-Cj6KfeNI.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LibraryDesk() {
	const library = useProvenance((s) => s.library);
	const addLibrary = useProvenance((s) => s.addLibrary);
	const removeLibrary = useProvenance((s) => s.removeLibrary);
	const fileRef = (0, import_react.useRef)(null);
	const [title, setTitle] = (0, import_react.useState)("");
	const [text, setText] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)(null);
	function add(fromTitle, body) {
		if (wordCount(body) < 40) {
			setError("Documents need at least 40 words.");
			return;
		}
		addLibrary({
			id: uid("lib"),
			title: fromTitle.trim() || "Untitled source",
			text: body.trim(),
			kind: "library"
		});
		setTitle("");
		setText("");
		setError(null);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-6 lg:grid-cols-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "rounded-xl bg-surface p-5 shadow-border sm:p-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl",
					children: "Add a source"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted",
					children: "Anything stored here is treated as a prior submission or known text. Later scans will highlight overlap against it."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "mt-5 block text-xs uppercase tracking-[0.16em] text-muted",
					children: "Source title"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					className: "mt-2",
					value: title,
					onChange: (e) => setTitle(e.target.value),
					placeholder: "Course pack, earlier paper, style guide"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					className: "mt-4 min-h-48",
					value: text,
					onChange: (e) => setText(e.target.value),
					placeholder: "Paste the source text"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex flex-wrap gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							ref: fileRef,
							type: "file",
							accept: ".txt,.md,.docx,.pdf",
							className: "sr-only",
							onChange: async (e) => {
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
							}
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "button",
							variant: "secondary",
							onClick: () => fileRef.current?.click(),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, {}), "Upload"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							onClick: () => add(title, text),
							children: "Add to library"
						})
					]
				}),
				error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-danger",
					children: error
				}) : null
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "flex flex-col gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl bg-surface p-5 shadow-border",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl",
					children: "Your library"
				}), library.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted",
					children: "No personal sources yet."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-3 divide-y divide-border",
					children: library.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-start justify-between gap-3 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium",
							children: d.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "font-mono text-xs text-subtle tabular-nums",
							children: [wordCount(d.text), " words"]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "ghost",
							size: "icon",
							"aria-label": `Remove ${d.title}`,
							onClick: () => removeLibrary(d.id),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {})
						})]
					}, d.id))
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl bg-surface p-5 shadow-border",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-xl",
						children: "Built-in corpus"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: "Public-domain speeches and reference notes always indexed, so sample papers have something to match."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-3 space-y-2",
						children: BUILTIN_CORPUS.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center justify-between gap-3 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: d.title }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: "corpus" })]
						}, d.id))
					})
				]
			})]
		})]
	});
}
function LibraryPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-6xl px-4 py-10 sm:py-14",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs uppercase tracking-[0.22em] text-muted",
				children: "Prior sources"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-3 font-display text-4xl tracking-tight",
				children: "Library"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 max-w-2xl text-muted",
				children: "Store papers you already hold. They never leave this browser. Built-in public-domain texts stay indexed for everyone."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LibraryDesk, {})
			})
		]
	}) });
}
//#endregion
export { LibraryPage as component };
