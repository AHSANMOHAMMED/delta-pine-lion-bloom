import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { S as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as BookOpen, o as FileSearch } from "../_libs/lucide-react.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { t as Slot } from "../_libs/radix-ui__react-slot.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/button-BqO9ai5B.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var useProvenance = create()(persist((set, get) => ({
	library: [],
	reports: [],
	addLibrary: (doc) => set((s) => ({ library: [doc, ...s.library.filter((d) => d.id !== doc.id)].slice(0, 40) })),
	removeLibrary: (id) => set((s) => ({ library: s.library.filter((d) => d.id !== id) })),
	saveReport: (report) => set((s) => ({ reports: [report, ...s.reports.filter((r) => r.id !== report.id)].slice(0, 24) })),
	getReport: (id) => get().reports.find((r) => r.id === id)
}), { name: "provenance-originality" }));
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function uid(prefix = "id") {
	return `${prefix}_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36).slice(-4)}`;
}
function Shell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-bg text-fg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
			className: "border-b border-border bg-primary text-primary-fg",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex h-14 max-w-6xl items-center justify-between px-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					className: "flex items-baseline gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-display text-xl tracking-tight",
						children: "Provenance"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "hidden text-xs uppercase tracking-[0.18em] text-primary-fg/70 sm:inline",
						children: "Originality"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
					className: "flex items-center gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavLink, {
						to: "/",
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSearch, { className: "size-4" }),
						label: "Scan"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavLink, {
						to: "/library",
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "size-4" }),
						label: "Library"
					})]
				})]
			})
		}), children]
	});
}
function NavLink({ to, icon, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to,
		className: cn("inline-flex h-10 items-center gap-2 rounded-sm px-3 text-sm text-primary-fg/80", "transition-colors duration-150 hover:bg-primary-fg/10 hover:text-primary-fg"),
		activeProps: { className: "bg-primary-fg/12 text-primary-fg" },
		children: [icon, label]
	});
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-[opacity,transform,background-color,box-shadow] duration-150 ease-out active:not-disabled:scale-[0.96] disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", {
	variants: {
		variant: {
			default: "bg-primary text-primary-fg shadow-border hover:opacity-92",
			secondary: "bg-surface text-fg shadow-border hover:shadow-border-hover",
			ghost: "text-fg hover:bg-sunken",
			outline: "bg-transparent text-fg shadow-border hover:bg-sunken",
			danger: "bg-danger text-primary-fg hover:opacity-92"
		},
		size: {
			default: "h-11 rounded-md px-4 text-sm",
			sm: "h-9 rounded-sm px-3 text-sm",
			lg: "h-12 rounded-md px-5 text-base",
			icon: "size-11 rounded-md"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		ref,
		...props
	});
});
Button.displayName = "Button";
//#endregion
export { useProvenance as a, uid as i, Shell as n, cn as r, Button as t };
