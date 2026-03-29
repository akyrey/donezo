import { i as Button, n as queryParams, t as applyUrlDefaults } from "./wayfinder-C_mx6M06.js";
import { t as axios_default } from "./axios-BY0CCud-.js";
import { t as GuestLayout } from "./GuestLayout-X1XUkqvF.js";
import { t as login } from "./routes-BacphFsi.js";
import { t as useAcceptInvitationMutation } from "./useGroups-v2WOXtpc.js";
import { Head, Link } from "@inertiajs/react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { CheckCircle, Clock, Users, XCircle } from "lucide-react";
//#region resources/js/routes/groups/index.ts
/**
* @see \App\Http\Controllers\Web\GroupController::index
* @see Http/Controllers/Web/GroupController.php:21
* @route '/groups'
*/
var index = (options) => ({
	url: index.url(options),
	method: "get"
});
index.definition = {
	methods: ["get", "head"],
	url: "/groups"
};
/**
* @see \App\Http\Controllers\Web\GroupController::index
* @see Http/Controllers/Web/GroupController.php:21
* @route '/groups'
*/
index.url = (options) => {
	return index.definition.url + queryParams(options);
};
/**
* @see \App\Http\Controllers\Web\GroupController::index
* @see Http/Controllers/Web/GroupController.php:21
* @route '/groups'
*/
index.get = (options) => ({
	url: index.url(options),
	method: "get"
});
/**
* @see \App\Http\Controllers\Web\GroupController::index
* @see Http/Controllers/Web/GroupController.php:21
* @route '/groups'
*/
index.head = (options) => ({
	url: index.url(options),
	method: "head"
});
/**
* @see \App\Http\Controllers\Web\GroupController::show
* @see Http/Controllers/Web/GroupController.php:47
* @route '/groups/{group}'
*/
var show = (args, options) => ({
	url: show.url(args, options),
	method: "get"
});
show.definition = {
	methods: ["get", "head"],
	url: "/groups/{group}"
};
/**
* @see \App\Http\Controllers\Web\GroupController::show
* @see Http/Controllers/Web/GroupController.php:47
* @route '/groups/{group}'
*/
show.url = (args, options) => {
	if (typeof args === "string" || typeof args === "number") args = { group: args };
	if (typeof args === "object" && !Array.isArray(args) && "id" in args) args = { group: args.id };
	if (Array.isArray(args)) args = { group: args[0] };
	args = applyUrlDefaults(args);
	const parsedArgs = { group: typeof args.group === "object" ? args.group.id : args.group };
	return show.definition.url.replace("{group}", parsedArgs.group.toString()).replace(/\/+$/, "") + queryParams(options);
};
/**
* @see \App\Http\Controllers\Web\GroupController::show
* @see Http/Controllers/Web/GroupController.php:47
* @route '/groups/{group}'
*/
show.get = (args, options) => ({
	url: show.url(args, options),
	method: "get"
});
/**
* @see \App\Http\Controllers\Web\GroupController::show
* @see Http/Controllers/Web/GroupController.php:47
* @route '/groups/{group}'
*/
show.head = (args, options) => ({
	url: show.url(args, options),
	method: "head"
});
Object.assign(index, index), Object.assign(show, show);
//#endregion
//#region resources/js/pages/Groups/AcceptInvitation.tsx
function AcceptInvitation({ invitation }) {
	const mutation = useAcceptInvitationMutation();
	const errorMessage = axios_default.isAxiosError(mutation.error) && mutation.error.response?.data?.message ? mutation.error.response.data.message : mutation.error ? "Something went wrong. Please try again." : null;
	return /* @__PURE__ */ jsxs(GuestLayout, { children: [/* @__PURE__ */ jsx(Head, { title: "Group Invitation" }), /* @__PURE__ */ jsxs("div", {
		className: "mx-auto w-full max-w-sm",
		children: [/* @__PURE__ */ jsx("div", {
			className: "mb-6 flex justify-center",
			children: /* @__PURE__ */ jsx("div", {
				className: "bg-primary/10 flex h-16 w-16 items-center justify-center rounded-full",
				children: /* @__PURE__ */ jsx(Users, { className: "text-primary h-8 w-8" })
			})
		}), invitation.expired ? /* @__PURE__ */ jsxs("div", {
			className: "text-center",
			children: [
				/* @__PURE__ */ jsx("div", {
					className: "mb-4 flex justify-center",
					children: /* @__PURE__ */ jsx(Clock, { className: "text-warning h-10 w-10" })
				}),
				/* @__PURE__ */ jsx("h1", {
					className: "text-text mb-2 text-xl font-semibold",
					children: "Invitation expired"
				}),
				/* @__PURE__ */ jsxs("p", {
					className: "text-text-secondary text-sm",
					children: [
						"This invitation is no longer valid. Ask ",
						/* @__PURE__ */ jsx("strong", { children: invitation.inviter.name }),
						" to send you a new invitation."
					]
				}),
				/* @__PURE__ */ jsx(Button, {
					className: "mt-6",
					asChild: true,
					children: /* @__PURE__ */ jsx(Link, {
						href: login.url(),
						children: "Go to login"
					})
				})
			]
		}) : mutation.isSuccess ? /* @__PURE__ */ jsxs("div", {
			className: "text-center",
			children: [
				/* @__PURE__ */ jsx("div", {
					className: "mb-4 flex justify-center",
					children: /* @__PURE__ */ jsx(CheckCircle, { className: "text-success h-10 w-10" })
				}),
				/* @__PURE__ */ jsxs("h1", {
					className: "text-text mb-2 text-xl font-semibold",
					children: [
						"You joined ",
						invitation.group.name,
						"!"
					]
				}),
				/* @__PURE__ */ jsx("p", {
					className: "text-text-secondary text-sm",
					children: "You are now a member of the group."
				}),
				/* @__PURE__ */ jsx(Button, {
					className: "mt-6",
					asChild: true,
					children: /* @__PURE__ */ jsx(Link, {
						href: show.url(mutation.data.group_id),
						children: "Go to group"
					})
				})
			]
		}) : mutation.isError ? /* @__PURE__ */ jsxs("div", {
			className: "text-center",
			children: [
				/* @__PURE__ */ jsx("div", {
					className: "mb-4 flex justify-center",
					children: /* @__PURE__ */ jsx(XCircle, { className: "text-danger h-10 w-10" })
				}),
				/* @__PURE__ */ jsx("h1", {
					className: "text-text mb-2 text-xl font-semibold",
					children: "Could not accept invitation"
				}),
				/* @__PURE__ */ jsx("p", {
					className: "text-text-secondary text-sm",
					children: errorMessage
				}),
				/* @__PURE__ */ jsx(Button, {
					className: "mt-6",
					variant: "outline",
					onClick: () => mutation.reset(),
					children: "Try again"
				})
			]
		}) : /* @__PURE__ */ jsxs(Fragment, { children: [
			/* @__PURE__ */ jsxs("div", {
				className: "mb-6 text-center",
				children: [/* @__PURE__ */ jsx("h1", {
					className: "text-text text-xl font-semibold",
					children: "You've been invited"
				}), /* @__PURE__ */ jsxs("p", {
					className: "text-text-secondary mt-2 text-sm",
					children: [/* @__PURE__ */ jsx("strong", { children: invitation.inviter.name }), " has invited you to join:"]
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "border-border bg-bg-secondary mb-6 rounded-xl border p-4 text-center",
				children: [
					/* @__PURE__ */ jsx("p", {
						className: "text-text text-lg font-semibold",
						children: invitation.group.name
					}),
					invitation.group.description && /* @__PURE__ */ jsx("p", {
						className: "text-text-secondary mt-1 text-sm",
						children: invitation.group.description
					}),
					/* @__PURE__ */ jsxs("span", {
						className: "bg-primary/10 text-primary mt-2 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
						children: ["Role: ", invitation.role]
					})
				]
			}),
			/* @__PURE__ */ jsx(Button, {
				className: "w-full",
				onClick: () => mutation.mutate(invitation.token),
				disabled: mutation.isPending,
				children: mutation.isPending ? "Joining..." : "Accept Invitation"
			}),
			/* @__PURE__ */ jsxs("p", {
				className: "text-text-tertiary mt-4 text-center text-xs",
				children: [
					"Invitation sent to ",
					invitation.email,
					". Expires",
					" ",
					new Date(invitation.expires_at).toLocaleDateString(),
					"."
				]
			})
		] })]
	})] });
}
//#endregion
export { AcceptInvitation as default };
