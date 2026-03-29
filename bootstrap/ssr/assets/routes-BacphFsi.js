import { n as queryParams, r as validateParameters, t as applyUrlDefaults } from "./wayfinder-C_mx6M06.js";
//#region resources/js/routes/index.ts
/**
* @see \Laravel\Telescope\Http\Controllers\HomeController::telescope
* @see vendor/laravel/telescope/src/Http/Controllers/HomeController.php:15
* @route '/telescope/{view?}'
*/
var telescope = (args, options) => ({
	url: telescope.url(args, options),
	method: "get"
});
telescope.definition = {
	methods: ["get", "head"],
	url: "/telescope/{view?}"
};
/**
* @see \Laravel\Telescope\Http\Controllers\HomeController::telescope
* @see vendor/laravel/telescope/src/Http/Controllers/HomeController.php:15
* @route '/telescope/{view?}'
*/
telescope.url = (args, options) => {
	if (typeof args === "string" || typeof args === "number") args = { view: args };
	if (Array.isArray(args)) args = { view: args[0] };
	args = applyUrlDefaults(args);
	validateParameters(args, ["view"]);
	const parsedArgs = { view: args?.view };
	return telescope.definition.url.replace("{view?}", parsedArgs.view?.toString() ?? "").replace(/\/+$/, "") + queryParams(options);
};
/**
* @see \Laravel\Telescope\Http\Controllers\HomeController::telescope
* @see vendor/laravel/telescope/src/Http/Controllers/HomeController.php:15
* @route '/telescope/{view?}'
*/
telescope.get = (args, options) => ({
	url: telescope.url(args, options),
	method: "get"
});
/**
* @see \Laravel\Telescope\Http\Controllers\HomeController::telescope
* @see vendor/laravel/telescope/src/Http/Controllers/HomeController.php:15
* @route '/telescope/{view?}'
*/
telescope.head = (args, options) => ({
	url: telescope.url(args, options),
	method: "head"
});
/**
* @see \App\Http\Controllers\Auth\AuthenticatedSessionController::login
* @see Http/Controllers/Auth/AuthenticatedSessionController.php:20
* @route '/login'
*/
var login = (options) => ({
	url: login.url(options),
	method: "get"
});
login.definition = {
	methods: ["get", "head"],
	url: "/login"
};
/**
* @see \App\Http\Controllers\Auth\AuthenticatedSessionController::login
* @see Http/Controllers/Auth/AuthenticatedSessionController.php:20
* @route '/login'
*/
login.url = (options) => {
	return login.definition.url + queryParams(options);
};
/**
* @see \App\Http\Controllers\Auth\AuthenticatedSessionController::login
* @see Http/Controllers/Auth/AuthenticatedSessionController.php:20
* @route '/login'
*/
login.get = (options) => ({
	url: login.url(options),
	method: "get"
});
/**
* @see \App\Http\Controllers\Auth\AuthenticatedSessionController::login
* @see Http/Controllers/Auth/AuthenticatedSessionController.php:20
* @route '/login'
*/
login.head = (options) => ({
	url: login.url(options),
	method: "head"
});
/**
* @see \App\Http\Controllers\Auth\RegisteredUserController::register
* @see Http/Controllers/Auth/RegisteredUserController.php:25
* @route '/register'
*/
var register = (options) => ({
	url: register.url(options),
	method: "get"
});
register.definition = {
	methods: ["get", "head"],
	url: "/register"
};
/**
* @see \App\Http\Controllers\Auth\RegisteredUserController::register
* @see Http/Controllers/Auth/RegisteredUserController.php:25
* @route '/register'
*/
register.url = (options) => {
	return register.definition.url + queryParams(options);
};
/**
* @see \App\Http\Controllers\Auth\RegisteredUserController::register
* @see Http/Controllers/Auth/RegisteredUserController.php:25
* @route '/register'
*/
register.get = (options) => ({
	url: register.url(options),
	method: "get"
});
/**
* @see \App\Http\Controllers\Auth\RegisteredUserController::register
* @see Http/Controllers/Auth/RegisteredUserController.php:25
* @route '/register'
*/
register.head = (options) => ({
	url: register.url(options),
	method: "head"
});
/**
* @see \App\Http\Controllers\Auth\AuthenticatedSessionController::logout
* @see Http/Controllers/Auth/AuthenticatedSessionController.php:51
* @route '/logout'
*/
var logout = (options) => ({
	url: logout.url(options),
	method: "post"
});
logout.definition = {
	methods: ["post"],
	url: "/logout"
};
/**
* @see \App\Http\Controllers\Auth\AuthenticatedSessionController::logout
* @see Http/Controllers/Auth/AuthenticatedSessionController.php:51
* @route '/logout'
*/
logout.url = (options) => {
	return logout.definition.url + queryParams(options);
};
/**
* @see \App\Http\Controllers\Auth\AuthenticatedSessionController::logout
* @see Http/Controllers/Auth/AuthenticatedSessionController.php:51
* @route '/logout'
*/
logout.post = (options) => ({
	url: logout.url(options),
	method: "post"
});
/**
* @see \App\Http\Controllers\Web\DashboardController::dashboard
* @see Http/Controllers/Web/DashboardController.php:15
* @route '/'
*/
var dashboard = (options) => ({
	url: dashboard.url(options),
	method: "get"
});
dashboard.definition = {
	methods: ["get", "head"],
	url: "/"
};
/**
* @see \App\Http\Controllers\Web\DashboardController::dashboard
* @see Http/Controllers/Web/DashboardController.php:15
* @route '/'
*/
dashboard.url = (options) => {
	return dashboard.definition.url + queryParams(options);
};
/**
* @see \App\Http\Controllers\Web\DashboardController::dashboard
* @see Http/Controllers/Web/DashboardController.php:15
* @route '/'
*/
dashboard.get = (options) => ({
	url: dashboard.url(options),
	method: "get"
});
/**
* @see \App\Http\Controllers\Web\DashboardController::dashboard
* @see Http/Controllers/Web/DashboardController.php:15
* @route '/'
*/
dashboard.head = (options) => ({
	url: dashboard.url(options),
	method: "head"
});
/**
* @see \App\Http\Controllers\Web\InboxController::inbox
* @see Http/Controllers/Web/InboxController.php:18
* @route '/inbox'
*/
var inbox = (options) => ({
	url: inbox.url(options),
	method: "get"
});
inbox.definition = {
	methods: ["get", "head"],
	url: "/inbox"
};
/**
* @see \App\Http\Controllers\Web\InboxController::inbox
* @see Http/Controllers/Web/InboxController.php:18
* @route '/inbox'
*/
inbox.url = (options) => {
	return inbox.definition.url + queryParams(options);
};
/**
* @see \App\Http\Controllers\Web\InboxController::inbox
* @see Http/Controllers/Web/InboxController.php:18
* @route '/inbox'
*/
inbox.get = (options) => ({
	url: inbox.url(options),
	method: "get"
});
/**
* @see \App\Http\Controllers\Web\InboxController::inbox
* @see Http/Controllers/Web/InboxController.php:18
* @route '/inbox'
*/
inbox.head = (options) => ({
	url: inbox.url(options),
	method: "head"
});
/**
* @see \App\Http\Controllers\Web\TodayController::today
* @see Http/Controllers/Web/TodayController.php:19
* @route '/today'
*/
var today = (options) => ({
	url: today.url(options),
	method: "get"
});
today.definition = {
	methods: ["get", "head"],
	url: "/today"
};
/**
* @see \App\Http\Controllers\Web\TodayController::today
* @see Http/Controllers/Web/TodayController.php:19
* @route '/today'
*/
today.url = (options) => {
	return today.definition.url + queryParams(options);
};
/**
* @see \App\Http\Controllers\Web\TodayController::today
* @see Http/Controllers/Web/TodayController.php:19
* @route '/today'
*/
today.get = (options) => ({
	url: today.url(options),
	method: "get"
});
/**
* @see \App\Http\Controllers\Web\TodayController::today
* @see Http/Controllers/Web/TodayController.php:19
* @route '/today'
*/
today.head = (options) => ({
	url: today.url(options),
	method: "head"
});
/**
* @see \App\Http\Controllers\Web\UpcomingController::upcoming
* @see Http/Controllers/Web/UpcomingController.php:19
* @route '/upcoming'
*/
var upcoming = (options) => ({
	url: upcoming.url(options),
	method: "get"
});
upcoming.definition = {
	methods: ["get", "head"],
	url: "/upcoming"
};
/**
* @see \App\Http\Controllers\Web\UpcomingController::upcoming
* @see Http/Controllers/Web/UpcomingController.php:19
* @route '/upcoming'
*/
upcoming.url = (options) => {
	return upcoming.definition.url + queryParams(options);
};
/**
* @see \App\Http\Controllers\Web\UpcomingController::upcoming
* @see Http/Controllers/Web/UpcomingController.php:19
* @route '/upcoming'
*/
upcoming.get = (options) => ({
	url: upcoming.url(options),
	method: "get"
});
/**
* @see \App\Http\Controllers\Web\UpcomingController::upcoming
* @see Http/Controllers/Web/UpcomingController.php:19
* @route '/upcoming'
*/
upcoming.head = (options) => ({
	url: upcoming.url(options),
	method: "head"
});
/**
* @see \App\Http\Controllers\Web\AnytimeController::anytime
* @see Http/Controllers/Web/AnytimeController.php:18
* @route '/anytime'
*/
var anytime = (options) => ({
	url: anytime.url(options),
	method: "get"
});
anytime.definition = {
	methods: ["get", "head"],
	url: "/anytime"
};
/**
* @see \App\Http\Controllers\Web\AnytimeController::anytime
* @see Http/Controllers/Web/AnytimeController.php:18
* @route '/anytime'
*/
anytime.url = (options) => {
	return anytime.definition.url + queryParams(options);
};
/**
* @see \App\Http\Controllers\Web\AnytimeController::anytime
* @see Http/Controllers/Web/AnytimeController.php:18
* @route '/anytime'
*/
anytime.get = (options) => ({
	url: anytime.url(options),
	method: "get"
});
/**
* @see \App\Http\Controllers\Web\AnytimeController::anytime
* @see Http/Controllers/Web/AnytimeController.php:18
* @route '/anytime'
*/
anytime.head = (options) => ({
	url: anytime.url(options),
	method: "head"
});
/**
* @see \App\Http\Controllers\Web\SomedayController::someday
* @see Http/Controllers/Web/SomedayController.php:18
* @route '/someday'
*/
var someday = (options) => ({
	url: someday.url(options),
	method: "get"
});
someday.definition = {
	methods: ["get", "head"],
	url: "/someday"
};
/**
* @see \App\Http\Controllers\Web\SomedayController::someday
* @see Http/Controllers/Web/SomedayController.php:18
* @route '/someday'
*/
someday.url = (options) => {
	return someday.definition.url + queryParams(options);
};
/**
* @see \App\Http\Controllers\Web\SomedayController::someday
* @see Http/Controllers/Web/SomedayController.php:18
* @route '/someday'
*/
someday.get = (options) => ({
	url: someday.url(options),
	method: "get"
});
/**
* @see \App\Http\Controllers\Web\SomedayController::someday
* @see Http/Controllers/Web/SomedayController.php:18
* @route '/someday'
*/
someday.head = (options) => ({
	url: someday.url(options),
	method: "head"
});
/**
* @see \App\Http\Controllers\Web\LogbookController::logbook
* @see Http/Controllers/Web/LogbookController.php:18
* @route '/logbook'
*/
var logbook = (options) => ({
	url: logbook.url(options),
	method: "get"
});
logbook.definition = {
	methods: ["get", "head"],
	url: "/logbook"
};
/**
* @see \App\Http\Controllers\Web\LogbookController::logbook
* @see Http/Controllers/Web/LogbookController.php:18
* @route '/logbook'
*/
logbook.url = (options) => {
	return logbook.definition.url + queryParams(options);
};
/**
* @see \App\Http\Controllers\Web\LogbookController::logbook
* @see Http/Controllers/Web/LogbookController.php:18
* @route '/logbook'
*/
logbook.get = (options) => ({
	url: logbook.url(options),
	method: "get"
});
/**
* @see \App\Http\Controllers\Web\LogbookController::logbook
* @see Http/Controllers/Web/LogbookController.php:18
* @route '/logbook'
*/
logbook.head = (options) => ({
	url: logbook.url(options),
	method: "head"
});
/**
* @see \App\Http\Controllers\Web\SettingsController::settings
* @see Http/Controllers/Web/SettingsController.php:22
* @route '/settings'
*/
var settings = (options) => ({
	url: settings.url(options),
	method: "get"
});
settings.definition = {
	methods: ["get", "head"],
	url: "/settings"
};
/**
* @see \App\Http\Controllers\Web\SettingsController::settings
* @see Http/Controllers/Web/SettingsController.php:22
* @route '/settings'
*/
settings.url = (options) => {
	return settings.definition.url + queryParams(options);
};
/**
* @see \App\Http\Controllers\Web\SettingsController::settings
* @see Http/Controllers/Web/SettingsController.php:22
* @route '/settings'
*/
settings.get = (options) => ({
	url: settings.url(options),
	method: "get"
});
/**
* @see \App\Http\Controllers\Web\SettingsController::settings
* @see Http/Controllers/Web/SettingsController.php:22
* @route '/settings'
*/
settings.head = (options) => ({
	url: settings.url(options),
	method: "head"
});
//#endregion
export { upcoming as i, logout as n, register as r, login as t };
