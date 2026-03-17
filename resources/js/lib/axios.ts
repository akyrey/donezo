/**
 * Centralized axios configuration.
 *
 * Import from here instead of directly from 'axios' so that CSRF and
 * credential defaults are always applied before any request is made,
 * regardless of which module loads first.
 */
import axios from 'axios';

// Send session cookie on every request (required for Sanctum SPA auth)
axios.defaults.withCredentials = true;

// Axios 1.x: automatically read the XSRF-TOKEN cookie and attach it as
// the X-XSRF-TOKEN header, satisfying Laravel's CSRF protection.
axios.defaults.withXSRFToken = true;

// Tell Laravel this is an AJAX request so it returns JSON errors instead
// of HTML redirects.
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// Ensure Laravel always responds with JSON.
axios.defaults.headers.common['Accept'] = 'application/json';

export default axios;
