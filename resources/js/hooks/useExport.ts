import axios from '@/lib/axios';
import { useMutation } from '@tanstack/react-query';

export interface ExportOptions {
  status?: string;
  include_completed?: boolean;
}

/**
 * Request an export of all tasks, optionally filtered by status.
 *
 * The backend queues a job; when complete the user receives a database
 * notification containing a download URL.
 */
export function useAllTasksExport(options: ExportOptions = {}) {
  const payload: Record<string, unknown> = {};
  if (options.status) payload.status = options.status;
  if (options.include_completed) payload.include_completed = true;

  return useMutation({
    mutationFn: () => axios.post('/api/v1/tasks/export', payload),
  });
}

/** Request an export of tasks belonging to a specific project. */
export function useProjectExport(projectId: number) {
  return useMutation({
    mutationFn: () => axios.post(`/api/v1/projects/${projectId}/export`),
  });
}

/** Request an export of tasks shared with a specific group. */
export function useGroupExport(groupId: number) {
  return useMutation({
    mutationFn: () => axios.post(`/api/v1/groups/${groupId}/export`),
  });
}
