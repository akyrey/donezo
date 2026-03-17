import axios from '@/lib/axios';
import { useMutation } from '@tanstack/react-query';
import { router } from '@inertiajs/react';
import type { Heading } from '@/types';

export function useRenameHeadingMutation() {
  return useMutation({
    mutationFn: async ({ id, name }: { id: number; name: string }) => {
      const response = await axios.put<{ data: Heading }>(route('api.v1.headings.update', id), {
        name,
      });
      return response.data.data;
    },
    onSuccess: () => {
      router.reload();
    },
  });
}
