import axios from "axios";
//#region resources/js/lib/axios.ts
/**
* Centralized axios configuration.
*
* Import from here instead of directly from 'axios' so that CSRF and
* credential defaults are always applied before any request is made,
* regardless of which module loads first.
*/
axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;
axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
axios.defaults.headers.common["Accept"] = "application/json";
var axios_default = axios;
//#endregion
export { axios_default as t };
