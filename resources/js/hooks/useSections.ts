import axios from 'axios';
import {
    useQuery,
    useMutation,
    useQueryClient,
} from '@tanstack/react-query';
import type { Section } from '@/types';

const SECTIONS_KEY = ['sections'];

export interface SectionCreateData {
    project_id: number;
    title: string;
}

export interface SectionUpdateData extends Partial<SectionCreateData> {
    position?: number;
}

interface SectionsResponse {
    data: Section[];
}

export function useSectionsQuery(projectId?: number) {
    return useQuery<SectionsResponse>({
        queryKey: [...SECTIONS_KEY, projectId],
        queryFn: async () => {
            const params = projectId ? `?project_id=${projectId}` : '';
            const { data } = await axios.get<SectionsResponse>(
                `/api/v1/sections${params}`,
            );
            return data;
        },
        enabled: projectId !== undefined,
    });
}

export function useSectionMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: SectionCreateData) => {
            const response = await axios.post<{ data: Section }>(
                '/api/v1/sections',
                data,
            );
            return response.data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: SECTIONS_KEY });
        },
    });
}

export function useUpdateSectionMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            id,
            ...data
        }: SectionUpdateData & { id: number }) => {
            const response = await axios.put<{ data: Section }>(
                `/api/v1/sections/${id}`,
                data,
            );
            return response.data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: SECTIONS_KEY });
        },
    });
}

export function useDeleteSectionMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: number) => {
            await axios.delete(`/api/v1/sections/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: SECTIONS_KEY });
        },
    });
}
