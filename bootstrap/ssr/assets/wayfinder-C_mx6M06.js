import * as React$1 from "react";
import { jsx } from "react/jsx-runtime";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
//#region resources/js/lib/utils.ts
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
//#endregion
//#region resources/js/components/ui/Button.tsx
var buttonVariants = cva("inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", {
	variants: {
		variant: {
			default: "bg-primary text-white shadow-sm hover:bg-primary-dark",
			destructive: "bg-danger text-white shadow-sm hover:bg-danger/90",
			outline: "border border-border bg-bg text-text shadow-sm hover:bg-bg-secondary hover:text-text",
			secondary: "bg-bg-secondary text-text shadow-sm hover:bg-bg-tertiary",
			ghost: "text-text hover:bg-bg-secondary hover:text-text",
			link: "text-primary underline-offset-4 hover:underline"
		},
		size: {
			default: "h-9 px-4 py-2",
			sm: "h-8 rounded-md px-3 text-xs",
			lg: "h-10 rounded-lg px-8",
			icon: "h-9 w-9"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = React$1.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ jsx(asChild ? Slot : "button", {
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
//#region resources/js/wayfinder/index.ts
var urlDefaults = () => ({});
var getValue = (value) => {
	if (value === true) return "1";
	if (value === false) return "0";
	return value.toString();
};
var addNestedParams = (obj, prefix, params) => {
	Object.entries(obj).forEach(([subKey, value]) => {
		if (value === void 0) return;
		const paramKey = `${prefix}[${subKey}]`;
		if (Array.isArray(value)) value.forEach((v) => params.append(`${paramKey}[]`, getValue(v)));
		else if (value !== null && typeof value === "object") addNestedParams(value, paramKey, params);
		else if ([
			"string",
			"number",
			"boolean"
		].includes(typeof value)) params.set(paramKey, getValue(value));
	});
};
var queryParams = (options) => {
	if (!options || !options.query && !options.mergeQuery) return "";
	const query = options.query ?? options.mergeQuery;
	const includeExisting = options.mergeQuery !== void 0;
	const params = new URLSearchParams(includeExisting && typeof window !== "undefined" ? window.location.search : "");
	for (const key in query) {
		const queryValue = query[key];
		if (queryValue === void 0 || queryValue === null) {
			params.delete(key);
			continue;
		}
		if (Array.isArray(queryValue)) {
			if (params.has(`${key}[]`)) params.delete(`${key}[]`);
			queryValue.forEach((value) => {
				params.append(`${key}[]`, value.toString());
			});
		} else if (typeof queryValue === "object") {
			params.forEach((_, paramKey) => {
				if (paramKey.startsWith(`${key}[`)) params.delete(paramKey);
			});
			addNestedParams(queryValue, key, params);
		} else params.set(key, getValue(queryValue));
	}
	const str = params.toString();
	return str.length > 0 ? `?${str}` : "";
};
var applyUrlDefaults = (existing) => {
	const existingParams = { ...existing ?? {} };
	const defaultParams = urlDefaults();
	for (const key in defaultParams) if (existingParams[key] === void 0 && defaultParams[key] !== void 0) existingParams[key] = defaultParams[key];
	return existingParams;
};
var validateParameters = (args, optional) => {
	const missing = optional.filter((key) => !args?.[key]);
	const expectedMissing = optional.slice(missing.length * -1);
	for (let i = 0; i < missing.length; i++) if (missing[i] !== expectedMissing[i]) throw Error("Unexpected optional parameters missing. Unable to generate a URL.");
};
//#endregion
export { cn as a, Button as i, queryParams as n, validateParameters as r, applyUrlDefaults as t };
