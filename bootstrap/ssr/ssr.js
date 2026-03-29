import { createInertiaApp } from "@inertiajs/react";
import createServer from "@inertiajs/react/server";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";
import ReactDOMServer from "react-dom/server";
import { jsx, jsxs } from "react/jsx-runtime";
//#region node_modules/.pnpm/laravel-vite-plugin@3.0.0_vite@8.0.3_@emnapi+core@1.9.1_@emnapi+runtime@1.9.1_@types+no_1d9408ec77d44249bef17a1ca6486ddd/node_modules/laravel-vite-plugin/inertia-helpers/index.js
async function resolvePageComponent(path, pages) {
	for (const p of Array.isArray(path) ? path : [path]) {
		const page = pages[p];
		if (typeof page === "undefined") continue;
		return typeof page === "function" ? page() : page;
	}
	throw new Error(`Page not found: ${path}`);
}
//#endregion
//#region resources/js/ssr.tsx
var appName = process.env.APP_NAME || "Donezo";
createServer((page) => createInertiaApp({
	page,
	render: ReactDOMServer.renderToString,
	title: (title) => `${title} - ${appName}`,
	resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, /* @__PURE__ */ Object.assign({
		"./pages/Anytime.tsx": () => import("./assets/Anytime-DlwtFprC.js"),
		"./pages/Auth/Login.tsx": () => import("./assets/Login-LsOd1dA0.js"),
		"./pages/Auth/Register.tsx": () => import("./assets/Register-jiD2w_IH.js"),
		"./pages/Auth/VerifyEmail.tsx": () => import("./assets/VerifyEmail-Dxdd8Ccb.js"),
		"./pages/Groups/AcceptInvitation.tsx": () => import("./assets/AcceptInvitation-DYtglhyX.js"),
		"./pages/Groups/Index.tsx": () => import("./assets/Index-CkX_TqmR.js"),
		"./pages/Groups/Show.tsx": () => import("./assets/Show-BCkkPBZp.js"),
		"./pages/Inbox.tsx": () => import("./assets/Inbox-DH4i94xw.js"),
		"./pages/Logbook.tsx": () => import("./assets/Logbook-ftR_r-G4.js"),
		"./pages/Projects/Index.tsx": () => import("./assets/Index-BQYmSkX6.js"),
		"./pages/Projects/Show.tsx": () => import("./assets/Show-BKU1Hw6Z.js"),
		"./pages/Sections/Show.tsx": () => import("./assets/Show-rSUycV17.js"),
		"./pages/Settings/Index.tsx": () => import("./assets/Index-HKjuQ1tK.js"),
		"./pages/Someday.tsx": () => import("./assets/Someday-DWddXNNj.js"),
		"./pages/Today.tsx": () => import("./assets/Today-DUB6Vt9k.js"),
		"./pages/Upcoming.tsx": () => import("./assets/Upcoming-BOA7vcFV.js")
	})),
	setup: ({ App, props }) => {
		const [queryClient] = useState(() => new QueryClient());
		return /* @__PURE__ */ jsxs(QueryClientProvider, {
			client: queryClient,
			children: [/* @__PURE__ */ jsx(App, { ...props }), /* @__PURE__ */ jsx(ReactQueryDevtools, { initialIsOpen: false })]
		});
	}
}), { cluster: true });
//#endregion
export {};
