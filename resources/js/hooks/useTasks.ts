import axios from 'axios';
import {
    useQuery,
    useMutation,
    useQueryClient,
    type UseQueryOptions,
} from '@tanstack/react-query';
import type { Task } from '@/types';

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
    tag_id?: number;
    is_completed?: boolean;
    due_before?: string;
    due_after?: string;
    due_date?: string;
    is_evening?: boolean;
    search?: string;
    view?: 'inbox' | 'today' | 'upcoming' | 'anytime' | 'someday' | 'logbook';
}

export interface TaskCreateData {
    title: string;
    notes?: string;
    due_date?: string;
    due_time?: string;
    is_evening?: boolean;
    project_id?: number;
    section_id?: number;
    heading_id?: number;
    tag_ids?: number[];
    checklist_items?: { title: string; position: number }[];
    reminders?: { remind_at: string; type?: string }[];
}

export interface TaskUpdateData extends Partial<TaskCreateData> {
    is_completed?: boolean;
    position?: number;
}

interface TasksResponse {
    data: Task[];
    meta?: {
        current_page: number;
        last_page: number;
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
        },
    });
}

export function useCompleteTaskMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            id,
            is_completed,
        }: {
            id: number;
            is_completed: boolean;
        }) => {
            const response = await axios.post<{ data: Task }>(
                `/api/v1/tasks/${id}/complete`,
                { is_completed },
            );
            return response.data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: TASKS_KEY });
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
        },
    });
}
