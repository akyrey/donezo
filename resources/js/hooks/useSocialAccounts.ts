import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import { router } from '@inertiajs/react';

export function useDisconnectSocialAccountMutation() {
    return useMutation({
        mutationFn: (socialAccountId: number) =>
            axios.delete(`/api/v1/social-accounts/${socialAccountId}`),
        onSuccess: () => {
            router.reload();
        },
    });
}
