import { S as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById } from "./ssr.mjs";
import { r as cn } from "./button-BqO9ai5B.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/createSsrRpc-Bw0GN4k4.js
var import_jsx_runtime = require_jsx_runtime();
function scoreTone(score) {
	if (score < 15) return "ok";
	if (score < 40) return "ink";
	if (score < 70) return "warn";
	return "danger";
}
var STROKE = {
	ok: "var(--color-ok)",
	ink: "var(--color-primary)",
	warn: "var(--color-warn)",
	danger: "var(--color-danger)"
};
function ScoreRing({ score, size = 168, label = "Similarity" }) {
	const tone = scoreTone(score);
	const r = 54;
	const c = 2 * Math.PI * r;
	const clamped = Math.max(0, Math.min(100, score));
	const dash = clamped / 100 * c;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			width: size,
			height: size,
			viewBox: "0 0 140 140",
			className: "overflow-visible",
			"aria-label": `${label} ${Math.round(clamped)} percent`,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "70",
					cy: "70",
					r,
					fill: "none",
					stroke: "color-mix(in oklab, var(--color-fg) 10%, transparent)",
					strokeWidth: "10"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "70",
					cy: "70",
					r,
					fill: "none",
					stroke: STROKE[tone],
					strokeWidth: "10",
					strokeLinecap: "round",
					strokeDasharray: `${dash} ${c - dash}`,
					transform: "rotate(-90 70 70)",
					className: "transition-[stroke-dasharray] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
					x: "70",
					y: "68",
					textAnchor: "middle",
					className: "fill-fg font-display",
					style: {
						fontSize: "32px",
						fontWeight: 550
					},
					children: [Math.round(clamped), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tspan", {
						style: { fontSize: "16px" },
						children: "%"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
					x: "70",
					y: "90",
					textAnchor: "middle",
					className: "fill-muted",
					style: {
						fontSize: "10px",
						letterSpacing: "0.16em"
					},
					children: label.toUpperCase()
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: cn("text-xs uppercase tracking-[0.16em]", toneClass(tone)),
			children: bandLabel(clamped)
		})]
	});
}
function toneClass(tone) {
	if (tone === "ok") return "text-ok";
	if (tone === "warn") return "text-warn";
	if (tone === "danger") return "text-danger";
	return "text-primary";
}
function bandLabel(score) {
	if (score < 15) return "Low overlap";
	if (score < 40) return "Moderate overlap";
	if (score < 70) return "High overlap";
	return "Severe overlap";
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
//#endregion
export { createSsrRpc as n, scoreTone as r, ScoreRing as t };
