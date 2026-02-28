import axios from 'axios';
import {
    useQuery,
    useMutation,
    useQueryClient,
} from '@tanstack/react-query';
import type { Tag } from '@/types';

const TAGS_KEY = ['tags'];

export interface TagCreateData {
    name: string;
    color?: string;
}

export interface TagUpdateData extends Partial<TagCreateData> {}

interface TagsResponse {
    data: Tag[];
}

export function useTagsQuery() {
    return useQuery<TagsResponse>({
        queryKey: TAGS_KEY,
        queryFn: async () => {
            const { data } = await axios.get<TagsResponse>('/api/v1/tags');
            return data;
        },
    });
}

export function useTagMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: TagCreateData) => {
            const response = await axios.post<{ data: Tag }>(
                '/api/v1/tags',
                data,
            );
            return response.data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: TAGS_KEY });
        },
    });
}

export function useUpdateTagMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            id,
            ...data
        }: TagUpdateData & { id: number }) => {
            const response = await axios.put<{ data: Tag }>(
                `/api/v1/tags/${id}`,
                data,
            );
            return response.data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: TAGS_KEY });
        },
    });
}

export function useDeleteTagMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: number) => {
            await axios.delete(`/api/v1/tags/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: TAGS_KEY });
        },
    });
}
