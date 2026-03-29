import { a as cn } from "./wayfinder-C_mx6M06.js";
import * as React$1 from "react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/components/ui/Input.tsx
var Input = React$1.forwardRef(({ className, type, label, error, id, wrapperClassName, ...props }, ref) => {
	const inputId = id || React$1.useId();
	return /* @__PURE__ */ jsxs("div", {
		className: cn("flex flex-col gap-1.5", wrapperClassName),
		children: [
			label && /* @__PURE__ */ jsx("label", {
				htmlFor: inputId,
				className: "text-text text-sm font-medium",
				children: label
			}),
			/* @__PURE__ */ jsx("input", {
				type,
				id: inputId,
				className: cn("border-border bg-bg text-text flex h-9 w-full rounded-lg border px-3 py-1 text-sm shadow-sm transition-colors", "file:border-0 file:bg-transparent file:text-sm file:font-medium", "placeholder:text-text-tertiary", "focus-visible:ring-primary/50 focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:outline-none", "disabled:cursor-not-allowed disabled:opacity-50", error && "border-danger focus-visible:ring-danger/50", className),
				ref,
				...props
			}),
			error && /* @__PURE__ */ jsx("p", {
				className: "text-danger text-xs",
				children: error
			})
		]
	});
});
Input.displayName = "Input";
//#endregion
export { Input as t };
