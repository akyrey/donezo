import { a as cn, i as Button, n as queryParams } from "./wayfinder-C_mx6M06.js";
import { t as Input } from "./Input-BktEiBB2.js";
import { t as AuthenticatedLayout } from "./AuthenticatedLayout-BBEUssZw.js";
import { t as axios_default } from "./axios-BY0CCud-.js";
import { t as Badge } from "./Badge-C_622rLo.js";
import { Head, router, useForm, usePage } from "@inertiajs/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Bell, Calendar, Globe, Link as Link$1, Loader2, Monitor, Moon, Palette, RefreshCw, Settings, Shield, Sun, Trash2, Unlink, User } from "lucide-react";
import * as Separator from "@radix-ui/react-separator";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
//#region resources/js/routes/profile/index.ts
/**
* @see \App\Http\Controllers\Web\SettingsController::update
* @see Http/Controllers/Web/SettingsController.php:66
* @route '/profile'
*/
var update$1 = (options) => ({
	url: update$1.url(options),
	method: "patch"
});
update$1.definition = {
	methods: ["patch"],
	url: "/profile"
};
/**
* @see \App\Http\Controllers\Web\SettingsController::update
* @see Http/Controllers/Web/SettingsController.php:66
* @route '/profile'
*/
update$1.url = (options) => {
	return update$1.definition.url + queryParams(options);
};
/**
* @see \App\Http\Controllers\Web\SettingsController::update
* @see Http/Controllers/Web/SettingsController.php:66
* @route '/profile'
*/
update$1.patch = (options) => ({
	url: update$1.url(options),
	method: "patch"
});
/**
* @see \App\Http\Controllers\Web\SettingsController::preferences
* @see Http/Controllers/Web/SettingsController.php:83
* @route '/profile/preferences'
*/
var preferences = (options) => ({
	url: preferences.url(options),
	method: "patch"
});
preferences.definition = {
	methods: ["patch"],
	url: "/profile/preferences"
};
/**
* @see \App\Http\Controllers\Web\SettingsController::preferences
* @see Http/Controllers/Web/SettingsController.php:83
* @route '/profile/preferences'
*/
preferences.url = (options) => {
	return preferences.definition.url + queryParams(options);
};
/**
* @see \App\Http\Controllers\Web\SettingsController::preferences
* @see Http/Controllers/Web/SettingsController.php:83
* @route '/profile/preferences'
*/
preferences.patch = (options) => ({
	url: preferences.url(options),
	method: "patch"
});
/**
* @see \App\Http\Controllers\Web\SettingsController::destroy
* @see Http/Controllers/Web/SettingsController.php:114
* @route '/profile'
*/
var destroy = (options) => ({
	url: destroy.url(options),
	method: "delete"
});
destroy.definition = {
	methods: ["delete"],
	url: "/profile"
};
/**
* @see \App\Http\Controllers\Web\SettingsController::destroy
* @see Http/Controllers/Web/SettingsController.php:114
* @route '/profile'
*/
destroy.url = (options) => {
	return destroy.definition.url + queryParams(options);
};
/**
* @see \App\Http\Controllers\Web\SettingsController::destroy
* @see Http/Controllers/Web/SettingsController.php:114
* @route '/profile'
*/
destroy.delete = (options) => ({
	url: destroy.url(options),
	method: "delete"
});
Object.assign(update$1, update$1), Object.assign(preferences, preferences), Object.assign(destroy, destroy);
//#endregion
//#region resources/js/routes/password/index.ts
/**
* @see \App\Http\Controllers\Web\SettingsController::update
* @see Http/Controllers/Web/SettingsController.php:97
* @route '/profile/password'
*/
var update = (options) => ({
	url: update.url(options),
	method: "put"
});
update.definition = {
	methods: ["put"],
	url: "/profile/password"
};
/**
* @see \App\Http\Controllers\Web\SettingsController::update
* @see Http/Controllers/Web/SettingsController.php:97
* @route '/profile/password'
*/
update.url = (options) => {
	return update.definition.url + queryParams(options);
};
/**
* @see \App\Http\Controllers\Web\SettingsController::update
* @see Http/Controllers/Web/SettingsController.php:97
* @route '/profile/password'
*/
update.put = (options) => ({
	url: update.url(options),
	method: "put"
});
Object.assign(update, update);
//#endregion
//#region resources/js/hooks/useCalendar.ts
var CALENDAR_KEY = ["calendar"];
function useDisconnectCalendarMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async () => {
			const { data } = await axios_default.post("/api/v1/calendar/disconnect");
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: CALENDAR_KEY });
			queryClient.invalidateQueries({ queryKey: ["tasks"] });
		}
	});
}
function useSyncCalendarMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async () => {
			const { data } = await axios_default.post("/api/v1/calendar/sync");
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["tasks"] });
		}
	});
}
//#endregion
//#region resources/js/hooks/useSocialAccounts.ts
function useDisconnectSocialAccountMutation() {
	return useMutation({
		mutationFn: (socialAccountId) => axios_default.delete(`/api/v1/social-accounts/${socialAccountId}`),
		onSuccess: () => {
			router.reload();
		}
	});
}
//#endregion
//#region resources/js/hooks/useNotifications.ts
function urlBase64ToUint8Array(base64String) {
	const base64 = (base64String + "=".repeat((4 - base64String.length % 4) % 4)).replace(/-/g, "+").replace(/_/g, "/");
	const rawData = window.atob(base64);
	const outputArray = new Uint8Array(rawData.length);
	for (let i = 0; i < rawData.length; ++i) outputArray[i] = rawData.charCodeAt(i);
	return outputArray;
}
function useNotifications() {
	const [permission, setPermission] = useState(typeof Notification !== "undefined" ? Notification.permission : "default");
	const [isSubscribed, setIsSubscribed] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	useQueryClient();
	const isSupported = typeof window !== "undefined" && "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
	useEffect(() => {
		if (!isSupported) return;
		async function checkSubscription() {
			try {
				setIsSubscribed(await (await navigator.serviceWorker.ready).pushManager.getSubscription() !== null);
			} catch {}
		}
		checkSubscription();
	}, [isSupported]);
	return {
		permission,
		isSupported,
		isSubscribed,
		isLoading,
		subscribe: useCallback(async () => {
			if (!isSupported) return;
			setIsLoading(true);
			try {
				const result = await Notification.requestPermission();
				setPermission(result);
				if (result !== "granted") {
					setIsLoading(false);
					return;
				}
				const registration = await Promise.race([navigator.serviceWorker.ready, new Promise((_, reject) => setTimeout(() => reject(/* @__PURE__ */ new Error("Service worker timed out")), 1e4))]);
				const vapidKey = window.__CONFIG__?.vapidPublicKey;
				if (!vapidKey) {
					console.error("VAPID public key not configured");
					setIsLoading(false);
					return;
				}
				const subscription = await registration.pushManager.subscribe({
					userVisibleOnly: true,
					applicationServerKey: urlBase64ToUint8Array(vapidKey)
				});
				const subscriptionJson = subscription.toJSON();
				await axios_default.post("/api/v1/push-subscriptions", {
					endpoint: subscription.endpoint,
					keys: {
						p256dh: subscriptionJson.keys?.p256dh ?? "",
						auth: subscriptionJson.keys?.auth ?? ""
					},
					content_encoding: (PushManager.supportedContentEncodings ?? ["aesgcm"])[0]
				});
				setIsSubscribed(true);
			} catch (error) {
				console.error("Failed to subscribe to push notifications:", error);
			} finally {
				setIsLoading(false);
			}
		}, [isSupported]),
		unsubscribe: useCallback(async () => {
			if (!isSupported) return;
			setIsLoading(true);
			try {
				const subscription = await (await navigator.serviceWorker.ready).pushManager.getSubscription();
				if (subscription) {
					await subscription.unsubscribe();
					await axios_default.delete("/api/v1/push-subscriptions", { data: { endpoint: subscription.endpoint } });
				}
				setIsSubscribed(false);
			} catch (error) {
				console.error("Failed to unsubscribe from push notifications:", error);
			} finally {
				setIsLoading(false);
			}
		}, [isSupported])
	};
}
//#endregion
//#region resources/js/hooks/useTheme.ts
var ThemeContext = createContext({
	theme: "system",
	setTheme: () => {},
	resolvedTheme: "light"
});
function useTheme() {
	return useContext(ThemeContext);
}
//#endregion
//#region resources/js/pages/Settings/Index.tsx
function ProfileSection({ user }) {
	const { data, setData, patch, processing, errors, recentlySuccessful } = useForm({
		name: user.name,
		email: user.email
	});
	const submit = (e) => {
		e.preventDefault();
		patch(update$1.url());
	};
	return /* @__PURE__ */ jsxs("section", { children: [/* @__PURE__ */ jsxs("div", {
		className: "mb-4 flex items-center gap-2",
		children: [/* @__PURE__ */ jsx(User, { className: "text-text-secondary h-5 w-5" }), /* @__PURE__ */ jsx("h2", {
			className: "text-text text-lg font-semibold",
			children: "Profile"
		})]
	}), /* @__PURE__ */ jsxs("form", {
		onSubmit: submit,
		className: "max-w-md space-y-4",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-4",
				children: [/* @__PURE__ */ jsx("div", {
					className: "bg-primary/10 text-primary flex h-16 w-16 items-center justify-center rounded-full text-xl font-semibold",
					children: user.avatar ? /* @__PURE__ */ jsx("img", {
						src: user.avatar,
						alt: user.name,
						className: "h-16 w-16 rounded-full object-cover"
					}) : user.name.charAt(0).toUpperCase()
				}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
					className: "text-text font-medium",
					children: user.name
				}), /* @__PURE__ */ jsx("p", {
					className: "text-text-secondary text-sm",
					children: user.email
				})] })]
			}),
			/* @__PURE__ */ jsx(Input, {
				label: "Name",
				value: data.name,
				onChange: (e) => setData("name", e.target.value),
				error: errors.name
			}),
			/* @__PURE__ */ jsx(Input, {
				label: "Email",
				type: "email",
				value: data.email,
				onChange: (e) => setData("email", e.target.value),
				error: errors.email
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-3",
				children: [/* @__PURE__ */ jsx(Button, {
					type: "submit",
					size: "sm",
					disabled: processing,
					children: processing ? "Saving..." : "Save Changes"
				}), recentlySuccessful && /* @__PURE__ */ jsx("span", {
					className: "text-success text-sm",
					children: "Saved."
				})]
			})
		]
	})] });
}
function PreferencesSection({ user }) {
	const { data, setData, patch, processing, recentlySuccessful } = useForm({ timezone: user.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone });
	const submit = (e) => {
		e.preventDefault();
		patch(preferences.url());
	};
	return /* @__PURE__ */ jsxs("section", { children: [/* @__PURE__ */ jsxs("div", {
		className: "mb-4 flex items-center gap-2",
		children: [/* @__PURE__ */ jsx(Globe, { className: "text-text-secondary h-5 w-5" }), /* @__PURE__ */ jsx("h2", {
			className: "text-text text-lg font-semibold",
			children: "Preferences"
		})]
	}), /* @__PURE__ */ jsxs("form", {
		onSubmit: submit,
		className: "max-w-md space-y-4",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex flex-col gap-1.5",
			children: [/* @__PURE__ */ jsx("label", {
				className: "text-text text-sm font-medium",
				children: "Timezone"
			}), /* @__PURE__ */ jsx("select", {
				value: data.timezone,
				onChange: (e) => setData("timezone", e.target.value),
				className: "border-border bg-bg text-text focus-visible:ring-primary/50 flex h-9 w-full cursor-pointer rounded-lg border px-3 py-1 text-sm shadow-sm focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:outline-none",
				children: [
					"America/New_York",
					"America/Chicago",
					"America/Denver",
					"America/Los_Angeles",
					"America/Anchorage",
					"Pacific/Honolulu",
					"Europe/London",
					"Europe/Berlin",
					"Europe/Paris",
					"Europe/Rome",
					"Asia/Tokyo",
					"Asia/Shanghai",
					"Asia/Kolkata",
					"Australia/Sydney",
					"Pacific/Auckland"
				].map((tz) => /* @__PURE__ */ jsx("option", {
					value: tz,
					children: tz.replace(/_/g, " ")
				}, tz))
			})]
		}), /* @__PURE__ */ jsxs("div", {
			className: "flex items-center gap-3",
			children: [/* @__PURE__ */ jsx(Button, {
				type: "submit",
				size: "sm",
				disabled: processing,
				children: processing ? "Saving..." : "Save Preferences"
			}), recentlySuccessful && /* @__PURE__ */ jsx("span", {
				className: "text-success text-sm",
				children: "Saved."
			})]
		})]
	})] });
}
function PasswordSection() {
	const { data, setData, put, processing, errors, reset, recentlySuccessful } = useForm({
		current_password: "",
		password: "",
		password_confirmation: ""
	});
	const submit = (e) => {
		e.preventDefault();
		put(update.url(), { onSuccess: () => reset() });
	};
	return /* @__PURE__ */ jsxs("section", { children: [/* @__PURE__ */ jsxs("div", {
		className: "mb-4 flex items-center gap-2",
		children: [/* @__PURE__ */ jsx(Shield, { className: "text-text-secondary h-5 w-5" }), /* @__PURE__ */ jsx("h2", {
			className: "text-text text-lg font-semibold",
			children: "Change Password"
		})]
	}), /* @__PURE__ */ jsxs("form", {
		onSubmit: submit,
		className: "max-w-md space-y-4",
		children: [
			/* @__PURE__ */ jsx(Input, {
				label: "Current password",
				type: "password",
				value: data.current_password,
				onChange: (e) => setData("current_password", e.target.value),
				error: errors.current_password,
				autoComplete: "current-password"
			}),
			/* @__PURE__ */ jsx(Input, {
				label: "New password",
				type: "password",
				value: data.password,
				onChange: (e) => setData("password", e.target.value),
				error: errors.password,
				autoComplete: "new-password"
			}),
			/* @__PURE__ */ jsx(Input, {
				label: "Confirm new password",
				type: "password",
				value: data.password_confirmation,
				onChange: (e) => setData("password_confirmation", e.target.value),
				error: errors.password_confirmation,
				autoComplete: "new-password"
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-3",
				children: [/* @__PURE__ */ jsx(Button, {
					type: "submit",
					size: "sm",
					disabled: processing,
					children: processing ? "Updating..." : "Update Password"
				}), recentlySuccessful && /* @__PURE__ */ jsx("span", {
					className: "text-success text-sm",
					children: "Updated."
				})]
			})
		]
	})] });
}
var PROVIDERS = [{
	key: "google",
	label: "Google",
	connectHref: "/auth/google/redirect",
	icon: /* @__PURE__ */ jsxs("svg", {
		className: "h-5 w-5",
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
	})
}, {
	key: "github",
	label: "GitHub",
	connectHref: "/auth/github/redirect",
	icon: /* @__PURE__ */ jsx("svg", {
		className: "h-5 w-5",
		viewBox: "0 0 24 24",
		fill: "currentColor",
		children: /* @__PURE__ */ jsx("path", { d: "M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" })
	})
}];
function ConnectedAccountsSection({ socialAccounts, hasPassword }) {
	const disconnectMutation = useDisconnectSocialAccountMutation();
	const isOnlyAccount = socialAccounts.length <= 1;
	const disconnectBlocked = !hasPassword && isOnlyAccount;
	return /* @__PURE__ */ jsxs("section", { children: [/* @__PURE__ */ jsxs("div", {
		className: "mb-4 flex items-center gap-2",
		children: [/* @__PURE__ */ jsx(Link$1, { className: "text-text-secondary h-5 w-5" }), /* @__PURE__ */ jsx("h2", {
			className: "text-text text-lg font-semibold",
			children: "Connected Accounts"
		})]
	}), /* @__PURE__ */ jsx("div", {
		className: "max-w-md space-y-3",
		children: PROVIDERS.map((provider) => {
			const account = socialAccounts.find((a) => a.provider === provider.key);
			const isConnected = account !== void 0;
			const isPending = disconnectMutation.isPending && disconnectMutation.variables === account?.id;
			return /* @__PURE__ */ jsxs("div", {
				className: "border-border flex items-center justify-between rounded-lg border p-4",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-3",
					children: [
						provider.icon,
						/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
							className: "text-text text-sm font-medium",
							children: provider.label
						}), isConnected && /* @__PURE__ */ jsx("p", {
							className: "text-text-tertiary text-xs",
							children: "Connected"
						})] }),
						isConnected && /* @__PURE__ */ jsx(Badge, {
							variant: "outline",
							className: "border-success text-success",
							children: "Connected"
						})
					]
				}), isConnected ? /* @__PURE__ */ jsxs("div", {
					className: "flex flex-col items-end gap-1",
					children: [/* @__PURE__ */ jsxs(AlertDialog.Root, { children: [/* @__PURE__ */ jsx(AlertDialog.Trigger, {
						asChild: true,
						children: /* @__PURE__ */ jsxs(Button, {
							variant: "ghost",
							size: "sm",
							disabled: isPending || disconnectBlocked,
							className: "text-danger hover:text-danger",
							children: [isPending ? /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsx(Unlink, { className: "h-4 w-4" }), "Disconnect"]
						})
					}), /* @__PURE__ */ jsxs(AlertDialog.Portal, { children: [/* @__PURE__ */ jsx(AlertDialog.Overlay, { className: "data-[state=open]:animate-in data-[state=open]:fade-in-0 fixed inset-0 bg-black/40" }), /* @__PURE__ */ jsxs(AlertDialog.Content, {
						className: "border-border bg-bg text-text data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 fixed top-1/2 left-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border p-6 shadow-lg focus:outline-none",
						children: [
							/* @__PURE__ */ jsxs(AlertDialog.Title, {
								className: "text-text text-lg font-semibold",
								children: [
									"Disconnect ",
									provider.label,
									"?"
								]
							}),
							/* @__PURE__ */ jsxs(AlertDialog.Description, {
								className: "text-text-secondary mt-2 text-sm",
								children: [
									"You will no longer be able to sign in with ",
									provider.label,
									". Make sure you have another way to access your account."
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "mt-6 flex justify-end gap-3",
								children: [/* @__PURE__ */ jsx(AlertDialog.Cancel, {
									asChild: true,
									children: /* @__PURE__ */ jsx(Button, {
										variant: "ghost",
										children: "Cancel"
									})
								}), /* @__PURE__ */ jsx(AlertDialog.Action, {
									asChild: true,
									children: /* @__PURE__ */ jsx(Button, {
										variant: "destructive",
										onClick: () => account && disconnectMutation.mutate(account.id),
										children: "Disconnect"
									})
								})]
							})
						]
					})] })] }), disconnectBlocked && /* @__PURE__ */ jsx("p", {
						className: "text-text-tertiary max-w-[180px] text-right text-xs",
						children: "Set a password before disconnecting your only login method"
					})]
				}) : /* @__PURE__ */ jsx(Button, {
					variant: "outline",
					size: "sm",
					asChild: true,
					children: /* @__PURE__ */ jsx("a", {
						href: provider.connectHref,
						children: "Connect"
					})
				})]
			}, provider.key);
		})
	})] });
}
function CalendarSection({ calendarStatus }) {
	const disconnectMutation = useDisconnectCalendarMutation();
	const syncMutation = useSyncCalendarMutation();
	const isCalendarConnected = calendarStatus.connected && calendarStatus.has_calendar_scope;
	return /* @__PURE__ */ jsxs("section", { children: [/* @__PURE__ */ jsxs("div", {
		className: "mb-4 flex items-center gap-2",
		children: [/* @__PURE__ */ jsx(Calendar, { className: "text-text-secondary h-5 w-5" }), /* @__PURE__ */ jsx("h2", {
			className: "text-text text-lg font-semibold",
			children: "Google Calendar"
		})]
	}), /* @__PURE__ */ jsx("div", {
		className: "max-w-md space-y-4",
		children: !calendarStatus.enabled ? /* @__PURE__ */ jsx("div", {
			className: "border-border rounded-lg border p-4",
			children: /* @__PURE__ */ jsx("p", {
				className: "text-text-secondary text-sm",
				children: "Google Calendar integration is not enabled on this server. Contact your administrator to enable it."
			})
		}) : isCalendarConnected ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs("div", {
			className: "border-border flex items-center justify-between rounded-lg border p-4",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-3",
				children: [/* @__PURE__ */ jsx(Calendar, { className: "text-success h-5 w-5" }), /* @__PURE__ */ jsxs("div", { children: [
					/* @__PURE__ */ jsx("span", {
						className: "text-text text-sm font-medium",
						children: "Connected"
					}),
					calendarStatus.token_expired && /* @__PURE__ */ jsx(Badge, {
						variant: "outline",
						className: "border-warning text-warning ml-2",
						children: "Token expired"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "text-text-tertiary text-xs",
						children: "Tasks with dates will sync to your Google Calendar"
					})
				] })]
			}), /* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ jsxs(Button, {
					variant: "outline",
					size: "sm",
					onClick: () => syncMutation.mutate(),
					disabled: syncMutation.isPending,
					children: [syncMutation.isPending ? /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsx(RefreshCw, { className: "h-4 w-4" }), "Sync"]
				}), /* @__PURE__ */ jsxs(Button, {
					variant: "ghost",
					size: "sm",
					onClick: () => disconnectMutation.mutate(),
					disabled: disconnectMutation.isPending,
					className: "text-danger hover:text-danger",
					children: [/* @__PURE__ */ jsx(Unlink, { className: "h-4 w-4" }), "Disconnect"]
				})]
			})]
		}), syncMutation.isSuccess && /* @__PURE__ */ jsxs("p", {
			className: "text-success text-sm",
			children: [
				"Queued ",
				syncMutation.data?.count ?? 0,
				" tasks for sync."
			]
		})] }) : /* @__PURE__ */ jsxs("div", {
			className: "border-border rounded-lg border p-4",
			children: [/* @__PURE__ */ jsx("p", {
				className: "text-text-secondary mb-3 text-sm",
				children: "Connect your Google Calendar to automatically sync tasks with dates as calendar events."
			}), /* @__PURE__ */ jsx(Button, {
				variant: "outline",
				size: "sm",
				asChild: true,
				children: /* @__PURE__ */ jsxs("a", {
					href: "/auth/google/calendar/redirect",
					children: [/* @__PURE__ */ jsx(Calendar, { className: "h-4 w-4" }), "Connect Google Calendar"]
				})
			})]
		})
	})] });
}
function NotificationsSection() {
	const { permission, isSupported, isSubscribed, isLoading, subscribe, unsubscribe } = useNotifications();
	return /* @__PURE__ */ jsxs("section", { children: [/* @__PURE__ */ jsxs("div", {
		className: "mb-4 flex items-center gap-2",
		children: [/* @__PURE__ */ jsx(Bell, { className: "text-text-secondary h-5 w-5" }), /* @__PURE__ */ jsx("h2", {
			className: "text-text text-lg font-semibold",
			children: "Push Notifications"
		})]
	}), /* @__PURE__ */ jsx("div", {
		className: "max-w-md space-y-4",
		children: !isSupported ? /* @__PURE__ */ jsx("div", {
			className: "border-border rounded-lg border p-4",
			children: /* @__PURE__ */ jsx("p", {
				className: "text-text-secondary text-sm",
				children: "Push notifications are not supported in this browser. Try using a modern browser like Chrome, Firefox, or Edge."
			})
		}) : permission === "denied" ? /* @__PURE__ */ jsx("div", {
			className: "border-danger/30 rounded-lg border p-4",
			children: /* @__PURE__ */ jsx("p", {
				className: "text-text-secondary text-sm",
				children: "Notification permissions have been blocked. Please enable notifications in your browser settings to receive task reminders."
			})
		}) : isSubscribed ? /* @__PURE__ */ jsxs("div", {
			className: "border-border flex items-center justify-between rounded-lg border p-4",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-3",
				children: [/* @__PURE__ */ jsx(Bell, { className: "text-success h-5 w-5" }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
					className: "text-text text-sm font-medium",
					children: "Notifications enabled"
				}), /* @__PURE__ */ jsx("p", {
					className: "text-text-tertiary text-xs",
					children: "You will receive push notifications for task reminders"
				})] })]
			}), /* @__PURE__ */ jsx(Button, {
				variant: "ghost",
				size: "sm",
				onClick: unsubscribe,
				disabled: isLoading,
				children: isLoading ? /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }) : "Disable"
			})]
		}) : /* @__PURE__ */ jsxs("div", {
			className: "border-border rounded-lg border p-4",
			children: [/* @__PURE__ */ jsx("p", {
				className: "text-text-secondary mb-3 text-sm",
				children: "Enable push notifications to receive reminders for your tasks, even when the app is closed."
			}), /* @__PURE__ */ jsxs(Button, {
				variant: "outline",
				size: "sm",
				onClick: subscribe,
				disabled: isLoading,
				children: [isLoading ? /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsx(Bell, { className: "h-4 w-4" }), "Enable Notifications"]
			})]
		})
	})] });
}
function AppearanceSection() {
	const { theme, setTheme, resolvedTheme } = useTheme();
	return /* @__PURE__ */ jsxs("section", { children: [/* @__PURE__ */ jsxs("div", {
		className: "mb-4 flex items-center gap-2",
		children: [/* @__PURE__ */ jsx(Palette, { className: "text-text-secondary h-5 w-5" }), /* @__PURE__ */ jsx("h2", {
			className: "text-text text-lg font-semibold",
			children: "Appearance"
		})]
	}), /* @__PURE__ */ jsxs("div", {
		className: "max-w-md space-y-4",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex flex-col gap-1.5",
				children: [/* @__PURE__ */ jsx("label", {
					className: "text-text text-sm font-medium",
					children: "Theme"
				}), /* @__PURE__ */ jsx("p", {
					className: "text-text-secondary text-sm",
					children: "Choose how Donezo looks to you. Select a theme, or sync with your system settings."
				})]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "border-border bg-bg-secondary inline-flex gap-1 rounded-xl border p-1",
				children: [
					{
						value: "light",
						label: "Light",
						icon: /* @__PURE__ */ jsx(Sun, { className: "h-4 w-4" })
					},
					{
						value: "dark",
						label: "Dark",
						icon: /* @__PURE__ */ jsx(Moon, { className: "h-4 w-4" })
					},
					{
						value: "system",
						label: "System",
						icon: /* @__PURE__ */ jsx(Monitor, { className: "h-4 w-4" })
					}
				].map((opt) => /* @__PURE__ */ jsxs("button", {
					type: "button",
					onClick: () => setTheme(opt.value),
					className: cn("flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-150", theme === opt.value ? "bg-bg text-text border-border border shadow-sm" : "text-text-secondary hover:text-text hover:bg-bg-tertiary"),
					children: [opt.icon, opt.label]
				}, opt.value))
			}),
			/* @__PURE__ */ jsxs("p", {
				className: "text-text-tertiary text-xs",
				children: [
					"Currently showing:",
					" ",
					/* @__PURE__ */ jsx("span", {
						className: "text-text-secondary font-medium capitalize",
						children: resolvedTheme
					}),
					theme === "system" && " (from system preference)"
				]
			})
		]
	})] });
}
function DangerZone() {
	const { delete: destroy$1, processing } = useForm({});
	const handleDelete = () => {
		destroy$1(destroy.url());
	};
	return /* @__PURE__ */ jsxs("section", { children: [/* @__PURE__ */ jsxs("div", {
		className: "mb-4 flex items-center gap-2",
		children: [/* @__PURE__ */ jsx(Trash2, { className: "text-danger h-5 w-5" }), /* @__PURE__ */ jsx("h2", {
			className: "text-danger text-lg font-semibold",
			children: "Danger Zone"
		})]
	}), /* @__PURE__ */ jsxs("div", {
		className: "border-danger/30 max-w-md rounded-lg border p-4",
		children: [
			/* @__PURE__ */ jsx("h3", {
				className: "text-text text-sm font-medium",
				children: "Delete Account"
			}),
			/* @__PURE__ */ jsx("p", {
				className: "text-text-secondary mt-1 text-sm",
				children: "Once you delete your account, all of your data will be permanently removed. This action cannot be undone."
			}),
			/* @__PURE__ */ jsxs(AlertDialog.Root, { children: [/* @__PURE__ */ jsx(AlertDialog.Trigger, {
				asChild: true,
				children: /* @__PURE__ */ jsxs(Button, {
					variant: "destructive",
					size: "sm",
					className: "mt-4",
					children: [/* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" }), "Delete Account"]
				})
			}), /* @__PURE__ */ jsxs(AlertDialog.Portal, { children: [/* @__PURE__ */ jsx(AlertDialog.Overlay, { className: "data-[state=open]:animate-in data-[state=open]:fade-in-0 fixed inset-0 bg-black/40" }), /* @__PURE__ */ jsxs(AlertDialog.Content, {
				className: "border-border bg-bg text-text data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 fixed top-1/2 left-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border p-6 shadow-lg focus:outline-none",
				children: [
					/* @__PURE__ */ jsx(AlertDialog.Title, {
						className: "text-text text-lg font-semibold",
						children: "Are you absolutely sure?"
					}),
					/* @__PURE__ */ jsx(AlertDialog.Description, {
						className: "text-text-secondary mt-2 text-sm",
						children: "This will permanently delete your account and all associated data including tasks, projects, and settings. This action cannot be undone."
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "mt-6 flex justify-end gap-3",
						children: [/* @__PURE__ */ jsx(AlertDialog.Cancel, {
							asChild: true,
							children: /* @__PURE__ */ jsx(Button, {
								variant: "ghost",
								children: "Cancel"
							})
						}), /* @__PURE__ */ jsx(AlertDialog.Action, {
							asChild: true,
							children: /* @__PURE__ */ jsx(Button, {
								variant: "destructive",
								onClick: handleDelete,
								disabled: processing,
								children: processing ? "Deleting..." : "Yes, delete my account"
							})
						})]
					})
				]
			})] })] })
		]
	})] });
}
function AboutSection() {
	const { app_version } = usePage().props;
	return /* @__PURE__ */ jsxs("section", { children: [/* @__PURE__ */ jsxs("div", {
		className: "mb-4 flex items-center gap-2",
		children: [/* @__PURE__ */ jsx(Shield, { className: "text-text-secondary h-5 w-5" }), /* @__PURE__ */ jsx("h2", {
			className: "text-text text-lg font-semibold",
			children: "About"
		})]
	}), /* @__PURE__ */ jsxs("p", {
		className: "text-text-secondary text-sm",
		children: ["Version ", /* @__PURE__ */ jsxs("span", {
			className: "text-text font-medium",
			children: ["v", app_version]
		})]
	})] });
}
function SettingsIndex({ auth: { user }, calendarStatus, socialAccounts, hasPassword }) {
	return /* @__PURE__ */ jsxs(AuthenticatedLayout, { children: [/* @__PURE__ */ jsx(Head, { title: "Settings" }), /* @__PURE__ */ jsxs("div", {
		className: "mx-auto max-w-2xl px-4 py-8",
		children: [/* @__PURE__ */ jsx("div", {
			className: "mb-8",
			children: /* @__PURE__ */ jsxs("h1", {
				className: "text-text flex items-center gap-3 text-2xl font-semibold",
				children: [/* @__PURE__ */ jsx(Settings, { className: "text-text-secondary h-6 w-6" }), "Settings"]
			})
		}), /* @__PURE__ */ jsxs("div", {
			className: "space-y-10",
			children: [
				/* @__PURE__ */ jsx(ProfileSection, { user }),
				/* @__PURE__ */ jsx(Separator.Root, { className: "bg-border h-px" }),
				/* @__PURE__ */ jsx(PreferencesSection, { user }),
				/* @__PURE__ */ jsx(Separator.Root, { className: "bg-border h-px" }),
				/* @__PURE__ */ jsx(AppearanceSection, {}),
				/* @__PURE__ */ jsx(Separator.Root, { className: "bg-border h-px" }),
				/* @__PURE__ */ jsx(PasswordSection, {}),
				/* @__PURE__ */ jsx(Separator.Root, { className: "bg-border h-px" }),
				/* @__PURE__ */ jsx(ConnectedAccountsSection, {
					socialAccounts,
					hasPassword
				}),
				/* @__PURE__ */ jsx(Separator.Root, { className: "bg-border h-px" }),
				/* @__PURE__ */ jsx(CalendarSection, { calendarStatus }),
				/* @__PURE__ */ jsx(Separator.Root, { className: "bg-border h-px" }),
				/* @__PURE__ */ jsx(NotificationsSection, {}),
				/* @__PURE__ */ jsx(Separator.Root, { className: "bg-border h-px" }),
				/* @__PURE__ */ jsx(DangerZone, {}),
				/* @__PURE__ */ jsx(Separator.Root, { className: "bg-border h-px" }),
				/* @__PURE__ */ jsx(AboutSection, {})
			]
		})]
	})] });
}
//#endregion
export { SettingsIndex as default };
