import { S as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { r as cn } from "./button-BqO9ai5B.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/badge-CZQCvxPZ.js
var import_jsx_runtime = require_jsx_runtime();
var badgeVariants = cva("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium tracking-wide", {
	variants: { variant: {
		default: "bg-primary text-primary-fg",
		muted: "bg-sunken text-muted",
		ok: "bg-ok/12 text-ok",
		warn: "bg-warn/12 text-warn",
		danger: "bg-danger/12 text-danger"
	} },
	defaultVariants: { variant: "muted" }
});
function Badge({ className, variant, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn(badgeVariants({ variant }), className),
		...props
	});
}
//#endregion
export { Badge as t };
