import axios from 'axios';
import {
    useQuery,
    useMutation,
    useQueryClient,
    type UseQueryOptions,
} from '@tanstack/react-query';
import { router } from '@inertiajs/react';
import type { Task } from '@/types';

/**
 * Reload current Inertia page props so server-rendered task lists update
 * after a client-side API mutation.
 */
function reloadInertiaProps() {
    router.reload();
}

// Ensure axios sends CSRF token and credentials
axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.headers.common['Accept'] = 'application/json';

const TASKS_KEY = ['tasks'];

export interface TaskFilters {
    status?: string;
    project_id?: number;
    section_id?: number;
    heading_id?: number;
    tag?: number;
    completed?: boolean;
    is_evening?: boolean;
    search?: string;
    per_page?: number;
}

export interface TaskCreateData {
    title: string;
    description?: string;
    status?: 'inbox' | 'today' | 'upcoming' | 'anytime' | 'someday';
    is_evening?: boolean;
    scheduled_at?: string;
    deadline_at?: string;
    project_id?: number;
    section_id?: number;
    heading_id?: number;
    assigned_to?: number;
    tags?: number[];
    checklist_items?: { title: string; position?: number }[];
    reminders?: { remind_at: string }[];
}

export interface TaskUpdateData extends Partial<TaskCreateData> {
    position?: number;
}

interface TasksResponse {
    data: Task[];
    meta?: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

async function fetchTasks(filters: TaskFilters = {}): Promise<TasksResponse> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            params.append(key, String(value));
        }
    });
    const { data } = await axios.get<TasksResponse>(
        `/api/v1/tasks?${params.toString()}`,
    );
    return data;
}

export function useTasksQuery(
    filters: TaskFilters = {},
    options?: Partial<UseQueryOptions<TasksResponse>>,
) {
    return useQuery<TasksResponse>({
        queryKey: [...TASKS_KEY, filters],
        queryFn: () => fetchTasks(filters),
        ...options,
    });
}

export function useTaskMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: TaskCreateData) => {
            const response = await axios.post<{ data: Task }>(
                '/api/v1/tasks',
                data,
            );
            return response.data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: TASKS_KEY });
            reloadInertiaProps();
        },
    });
}

export function useUpdateTaskMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            id,
            ...data
        }: TaskUpdateData & { id: number }) => {
            const response = await axios.put<{ data: Task }>(
                `/api/v1/tasks/${id}`,
                data,
            );
            return response.data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: TASKS_KEY });
            reloadInertiaProps();
        },
    });
}

export function useDeleteTaskMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: number) => {
            await axios.delete(`/api/v1/tasks/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: TASKS_KEY });
            reloadInertiaProps();
        },
    });
}

export function useCompleteTaskMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            id,
            completed,
        }: {
            id: number;
            completed: boolean;
        }) => {
            const endpoint = completed
                ? `/api/v1/tasks/${id}/complete`
                : `/api/v1/tasks/${id}/uncomplete`;
            const response = await axios.post<{ data: Task }>(endpoint);
            return response.data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: TASKS_KEY });
            reloadInertiaProps();
        },
    });
}

export function useReorderTasksMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (
            tasks: { id: number; position: number }[],
        ) => {
            const response = await axios.post('/api/v1/tasks/reorder', {
                tasks,
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: TASKS_KEY });
            reloadInertiaProps();
        },
    });
}
