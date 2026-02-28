import axios from 'axios';
import {
    useQuery,
    useMutation,
    useQueryClient,
} from '@tanstack/react-query';
import type { Project } from '@/types';

const PROJECTS_KEY = ['projects'];

export interface ProjectCreateData {
    name: string;
    description?: string;
    section_id?: number;
}

export interface ProjectUpdateData extends Partial<ProjectCreateData> {
    status?: 'active' | 'completed' | 'archived';
    position?: number;
}

interface ProjectsResponse {
    data: Project[];
}

export function useProjectsQuery() {
    return useQuery<ProjectsResponse>({
        queryKey: PROJECTS_KEY,
        queryFn: async () => {
            const { data } = await axios.get<ProjectsResponse>(
                '/api/v1/projects',
            );
            return data;
        },
    });
}

export function useProjectMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: ProjectCreateData) => {
            const response = await axios.post<{ data: Project }>(
                '/api/v1/projects',
                data,
            );
            return response.data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PROJECTS_KEY });
        },
    });
}

export function useUpdateProjectMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            id,
            ...data
        }: ProjectUpdateData & { id: number }) => {
            const response = await axios.put<{ data: Project }>(
                `/api/v1/projects/${id}`,
                data,
            );
            return response.data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PROJECTS_KEY });
        },
    });
}

export function useDeleteProjectMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: number) => {
            await axios.delete(`/api/v1/projects/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PROJECTS_KEY });
        },
    });
}
