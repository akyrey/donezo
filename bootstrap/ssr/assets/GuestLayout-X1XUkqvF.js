import "react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/layouts/GuestLayout.tsx
function GuestLayout({ children }) {
	return /* @__PURE__ */ jsx("div", {
		className: "bg-bg-secondary text-text flex min-h-screen items-center justify-center px-4",
		children: /* @__PURE__ */ jsxs("div", {
			className: "w-full max-w-md",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "mb-8 text-center",
				children: [/* @__PURE__ */ jsx("h1", {
					className: "text-text text-2xl font-bold tracking-tight",
					children: "Donezo"
				}), /* @__PURE__ */ jsx("p", {
					className: "text-text-tertiary mt-1 text-sm",
					children: "Get things done, beautifully."
				})]
			}), /* @__PURE__ */ jsx("div", {
				className: "border-border bg-bg rounded-xl border p-8 shadow-sm",
				children
			})]
		})
	});
}
//#endregion
export { GuestLayout as t };
