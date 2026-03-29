import { a as cn } from "./wayfinder-C_mx6M06.js";
import "react";
import { jsx } from "react/jsx-runtime";
import { cva } from "class-variance-authority";
//#region resources/js/components/ui/Badge.tsx
var badgeVariants = cva("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2", {
	variants: { variant: {
		default: "bg-primary text-white",
		secondary: "bg-bg-secondary text-text-secondary",
		outline: "border border-border text-text-secondary",
		destructive: "bg-danger text-white",
		success: "bg-success text-white",
		warning: "bg-warning text-white"
	} },
	defaultVariants: { variant: "default" }
});
function Badge({ className, variant, color, style, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		className: cn(badgeVariants({ variant }), className),
		style: color ? {
			backgroundColor: color,
			color: "#fff",
			...style
		} : style,
		...props
	});
}
//#endregion
export { Badge as t };
