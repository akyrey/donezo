import { useState } from 'react';
import axios from 'axios';

export interface ExportOptions {
    status?: string;
    include_completed?: boolean;
}

export interface UseExportReturn {
    isLoading: boolean;
    requestExport: () => Promise<void>;
}

/**
 * Hook that posts to the given export endpoint and shows a transient loading
 * state. The backend queues a job; when done the user gets a database
 * notification with a download link.
 */
function useExport(endpoint: string, payload: Record<string, unknown> = {}): UseExportReturn {
    const [isLoading, setIsLoading] = useState(false);

    async function requestExport(): Promise<void> {
        if (isLoading) return;
        setIsLoading(true);
        try {
            await axios.post(endpoint, payload);
        } finally {
            setIsLoading(false);
        }
    }

    return { isLoading, requestExport };
}

// ── Convenience wrappers ──────────────────────────────────────────────────────

/** Request an export of all tasks, optionally filtered by status. */
export function useAllTasksExport(options: ExportOptions = {}): UseExportReturn {
    const payload: Record<string, unknown> = {};
    if (options.status) payload.status = options.status;
    if (options.include_completed) payload.include_completed = true;

    return useExport('/api/v1/tasks/export', payload);
}

/** Request an export of tasks belonging to a specific project. */
export function useProjectExport(projectId: number): UseExportReturn {
    return useExport(`/api/v1/projects/${projectId}/export`);
}

/** Request an export of tasks shared with a specific group. */
export function useGroupExport(groupId: number): UseExportReturn {
    return useExport(`/api/v1/groups/${groupId}/export`);
}
