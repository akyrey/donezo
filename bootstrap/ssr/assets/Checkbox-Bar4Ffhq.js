import { a as cn } from "./wayfinder-C_mx6M06.js";
import * as React$1 from "react";
import { jsx } from "react/jsx-runtime";
import { Check } from "lucide-react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
//#region resources/js/components/ui/Checkbox.tsx
var Checkbox = React$1.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(CheckboxPrimitive.Root, {
	ref,
	className: cn("peer border-border h-5 w-5 shrink-0 cursor-pointer rounded-full border-2", "transition-all duration-200 ease-in-out", "hover:border-primary/60", "focus-visible:ring-primary/50 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none", "disabled:cursor-not-allowed disabled:opacity-50", "data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-white", className),
	...props,
	children: /* @__PURE__ */ jsx(CheckboxPrimitive.Indicator, {
		className: cn("flex items-center justify-center text-current", "data-[state=checked]:animate-in data-[state=checked]:fade-in-0 data-[state=checked]:zoom-in-75"),
		children: /* @__PURE__ */ jsx(Check, { className: "h-3 w-3 stroke-[3]" })
	})
}));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;
//#endregion
export { Checkbox as t };
