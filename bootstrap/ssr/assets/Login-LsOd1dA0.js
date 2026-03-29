import { i as Button } from "./wayfinder-C_mx6M06.js";
import { t as Input } from "./Input-BktEiBB2.js";
import { t as Checkbox } from "./Checkbox-Bar4Ffhq.js";
import { t as GuestLayout } from "./GuestLayout-X1XUkqvF.js";
import { r as register, t as login } from "./routes-BacphFsi.js";
import { Head, Link, useForm } from "@inertiajs/react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/pages/Auth/Login.tsx
function Login({ status, canResetPassword }) {
	const { data, setData, post, processing, errors, reset } = useForm({
		email: "",
		password: "",
		remember: false
	});
	const submit = (e) => {
		e.preventDefault();
		post(login.url(), { onFinish: () => reset("password") });
	};
	return /* @__PURE__ */ jsxs(GuestLayout, { children: [/* @__PURE__ */ jsx(Head, { title: "Log in" }), /* @__PURE__ */ jsxs("div", {
		className: "mx-auto w-full max-w-sm",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "mb-8 text-center",
				children: [/* @__PURE__ */ jsx("h1", {
					className: "text-text text-2xl font-semibold",
					children: "Welcome back"
				}), /* @__PURE__ */ jsx("p", {
					className: "text-text-secondary mt-2 text-sm",
					children: "Sign in to your Donezo account"
				})]
			}),
			status && /* @__PURE__ */ jsx("div", {
				className: "bg-success/10 text-success mb-4 rounded-lg px-4 py-3 text-sm",
				children: status
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "space-y-3",
				children: [/* @__PURE__ */ jsx(Button, {
					variant: "outline",
					className: "w-full",
					asChild: true,
					children: /* @__PURE__ */ jsxs("a", {
						href: "/auth/google/redirect",
						children: [/* @__PURE__ */ jsxs("svg", {
							className: "h-4 w-4",
							viewBox: "0 0 24 24",
							children: [
								/* @__PURE__ */ jsx("path", {
									d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z",
									fill: "#4285F4"
								}),
								/* @__PURE__ */ jsx("path", {
									d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z",
									fill: "#34A853"
								}),
								/* @__PURE__ */ jsx("path", {
									d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z",
									fill: "#FBBC05"
								}),
								/* @__PURE__ */ jsx("path", {
									d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z",
									fill: "#EA4335"
								})
							]
						}), "Continue with Google"]
					})
				}), /* @__PURE__ */ jsx(Button, {
					variant: "outline",
					className: "w-full",
					asChild: true,
					children: /* @__PURE__ */ jsxs("a", {
						href: "/auth/github/redirect",
						children: [/* @__PURE__ */ jsx("svg", {
							className: "h-4 w-4",
							viewBox: "0 0 24 24",
							fill: "currentColor",
							children: /* @__PURE__ */ jsx("path", { d: "M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" })
						}), "Continue with GitHub"]
					})
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "relative my-6",
				children: [/* @__PURE__ */ jsx("div", {
					className: "absolute inset-0 flex items-center",
					children: /* @__PURE__ */ jsx("div", { className: "border-border w-full border-t" })
				}), /* @__PURE__ */ jsx("div", {
					className: "relative flex justify-center text-xs uppercase",
					children: /* @__PURE__ */ jsx("span", {
						className: "bg-bg text-text-tertiary px-2",
						children: "Or continue with email"
					})
				})]
			}),
			/* @__PURE__ */ jsxs("form", {
				onSubmit: submit,
				className: "space-y-4",
				children: [
					/* @__PURE__ */ jsx(Input, {
						label: "Email",
						type: "email",
						value: data.email,
						onChange: (e) => setData("email", e.target.value),
						error: errors.email,
						placeholder: "you@example.com",
						autoComplete: "email",
						autoFocus: true
					}),
					/* @__PURE__ */ jsx(Input, {
						label: "Password",
						type: "password",
						value: data.password,
						onChange: (e) => setData("password", e.target.value),
						error: errors.password,
						placeholder: "Enter your password",
						autoComplete: "current-password"
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ jsxs("label", {
							className: "text-text-secondary flex items-center gap-2 text-sm",
							children: [/* @__PURE__ */ jsx(Checkbox, {
								checked: data.remember,
								onCheckedChange: (checked) => setData("remember", checked === true)
							}), "Remember me"]
						}), canResetPassword && /* @__PURE__ */ jsx(Link, {
							href: "/password/request",
							className: "text-text-secondary hover:text-primary text-sm",
							children: "Forgot password?"
						})]
					}),
					/* @__PURE__ */ jsx(Button, {
						type: "submit",
						className: "w-full",
						disabled: processing,
						children: processing ? "Signing in..." : "Sign in"
					})
				]
			}),
			/* @__PURE__ */ jsxs("p", {
				className: "text-text-secondary mt-6 text-center text-sm",
				children: [
					"Don't have an account?",
					" ",
					/* @__PURE__ */ jsx(Link, {
						href: register.url(),
						className: "text-primary hover:text-primary-dark font-medium",
						children: "Create one"
					})
				]
			})
		]
	})] });
}
//#endregion
export { Login as default };
