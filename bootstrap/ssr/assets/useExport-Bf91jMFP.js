import { t as axios_default } from "./axios-BY0CCud-.js";
import { useMutation } from "@tanstack/react-query";
//#region resources/js/hooks/useExport.ts
/**
* Request an export of all tasks, optionally filtered by status.
*
* The backend queues a job; when complete the user receives a database
* notification containing a download URL.
*/
function useAllTasksExport(options = {}) {
	const payload = {};
	if (options.status) payload.status = options.status;
	if (options.include_completed) payload.include_completed = true;
	return useMutation({ mutationFn: () => axios_default.post("/api/v1/tasks/export", payload) });
}
/** Request an export of tasks belonging to a specific project. */
function useProjectExport(projectId) {
	return useMutation({ mutationFn: () => axios_default.post(`/api/v1/projects/${projectId}/export`) });
}
/** Request an export of tasks shared with a specific group. */
function useGroupExport(groupId) {
	return useMutation({ mutationFn: () => axios_default.post(`/api/v1/groups/${groupId}/export`) });
}
//#endregion
export { useGroupExport as n, useProjectExport as r, useAllTasksExport as t };
