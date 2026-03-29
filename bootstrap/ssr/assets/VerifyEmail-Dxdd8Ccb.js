import { i as Button, n as queryParams, t as applyUrlDefaults } from "./wayfinder-C_mx6M06.js";
import { t as GuestLayout } from "./GuestLayout-X1XUkqvF.js";
import { n as logout } from "./routes-BacphFsi.js";
import { Head, useForm } from "@inertiajs/react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/routes/verification/index.ts
/**
* @see \App\Http\Controllers\Auth\EmailVerificationController::notice
* @see Http/Controllers/Auth/EmailVerificationController.php:19
* @route '/email/verify'
*/
var notice = (options) => ({
	url: notice.url(options),
	method: "get"
});
notice.definition = {
	methods: ["get", "head"],
	url: "/email/verify"
};
/**
* @see \App\Http\Controllers\Auth\EmailVerificationController::notice
* @see Http/Controllers/Auth/EmailVerificationController.php:19
* @route '/email/verify'
*/
notice.url = (options) => {
	return notice.definition.url + queryParams(options);
};
/**
* @see \App\Http\Controllers\Auth\EmailVerificationController::notice
* @see Http/Controllers/Auth/EmailVerificationController.php:19
* @route '/email/verify'
*/
notice.get = (options) => ({
	url: notice.url(options),
	method: "get"
});
/**
* @see \App\Http\Controllers\Auth\EmailVerificationController::notice
* @see Http/Controllers/Auth/EmailVerificationController.php:19
* @route '/email/verify'
*/
notice.head = (options) => ({
	url: notice.url(options),
	method: "head"
});
/**
* @see \App\Http\Controllers\Auth\EmailVerificationController::verify
* @see Http/Controllers/Auth/EmailVerificationController.php:33
* @route '/email/verify/{id}/{hash}'
*/
var verify = (args, options) => ({
	url: verify.url(args, options),
	method: "get"
});
verify.definition = {
	methods: ["get", "head"],
	url: "/email/verify/{id}/{hash}"
};
/**
* @see \App\Http\Controllers\Auth\EmailVerificationController::verify
* @see Http/Controllers/Auth/EmailVerificationController.php:33
* @route '/email/verify/{id}/{hash}'
*/
verify.url = (args, options) => {
	if (Array.isArray(args)) args = {
		id: args[0],
		hash: args[1]
	};
	args = applyUrlDefaults(args);
	const parsedArgs = {
		id: args.id,
		hash: args.hash
	};
	return verify.definition.url.replace("{id}", parsedArgs.id.toString()).replace("{hash}", parsedArgs.hash.toString()).replace(/\/+$/, "") + queryParams(options);
};
/**
* @see \App\Http\Controllers\Auth\EmailVerificationController::verify
* @see Http/Controllers/Auth/EmailVerificationController.php:33
* @route '/email/verify/{id}/{hash}'
*/
verify.get = (args, options) => ({
	url: verify.url(args, options),
	method: "get"
});
/**
* @see \App\Http\Controllers\Auth\EmailVerificationController::verify
* @see Http/Controllers/Auth/EmailVerificationController.php:33
* @route '/email/verify/{id}/{hash}'
*/
verify.head = (args, options) => ({
	url: verify.url(args, options),
	method: "head"
});
/**
* @see \App\Http\Controllers\Auth\EmailVerificationController::send
* @see Http/Controllers/Auth/EmailVerificationController.php:43
* @route '/email/verification-notification'
*/
var send = (options) => ({
	url: send.url(options),
	method: "post"
});
send.definition = {
	methods: ["post"],
	url: "/email/verification-notification"
};
/**
* @see \App\Http\Controllers\Auth\EmailVerificationController::send
* @see Http/Controllers/Auth/EmailVerificationController.php:43
* @route '/email/verification-notification'
*/
send.url = (options) => {
	return send.definition.url + queryParams(options);
};
/**
* @see \App\Http\Controllers\Auth\EmailVerificationController::send
* @see Http/Controllers/Auth/EmailVerificationController.php:43
* @route '/email/verification-notification'
*/
send.post = (options) => ({
	url: send.url(options),
	method: "post"
});
Object.assign(notice, notice), Object.assign(verify, verify), Object.assign(send, send);
//#endregion
//#region resources/js/pages/Auth/VerifyEmail.tsx
function VerifyEmail({ status }) {
	const { post: postResend, processing: resendProcessing } = useForm({});
	const { post: postLogout, processing: logoutProcessing } = useForm({});
	return /* @__PURE__ */ jsxs(GuestLayout, { children: [/* @__PURE__ */ jsx(Head, { title: "Verify Email" }), /* @__PURE__ */ jsxs("div", {
		className: "mx-auto w-full max-w-sm",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "mb-8 text-center",
				children: [/* @__PURE__ */ jsx("h1", {
					className: "text-text text-2xl font-semibold",
					children: "Verify your email"
				}), /* @__PURE__ */ jsx("p", {
					className: "text-text-secondary mt-2 text-sm",
					children: "Thanks for signing up! Please check your inbox for a verification link before continuing."
				})]
			}),
			status === "verification-link-sent" && /* @__PURE__ */ jsx("div", {
				className: "bg-success/10 text-success mb-4 rounded-lg px-4 py-3 text-sm",
				children: "A new verification link has been sent to your email address."
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "space-y-3",
				children: [/* @__PURE__ */ jsx(Button, {
					className: "w-full",
					disabled: resendProcessing,
					onClick: () => postResend(send.url()),
					children: resendProcessing ? "Sending..." : "Resend verification email"
				}), /* @__PURE__ */ jsx(Button, {
					variant: "outline",
					className: "w-full",
					disabled: logoutProcessing,
					onClick: () => postLogout(logout.url()),
					children: "Log out"
				})]
			})
		]
	})] });
}
//#endregion
export { VerifyEmail as default };
