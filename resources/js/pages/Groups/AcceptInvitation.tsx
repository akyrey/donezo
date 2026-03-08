import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import { Users, CheckCircle, XCircle, Clock } from 'lucide-react';
import axios from 'axios';
import GuestLayout from '@/layouts/GuestLayout';
import { Button } from '@/components/ui/Button';

interface InvitationProps {
    token: string;
    email: string;
    role: 'admin' | 'member';
    expired: boolean;
    group: {
        id: number;
        name: string;
        description?: string | null;
    };
    inviter: {
        name: string;
    };
    expires_at: string;
}

interface Props {
    invitation: InvitationProps;
}

export default function AcceptInvitation({ invitation }: Props) {
    const [status, setStatus] = useState<'idle' | 'loading' | 'accepted' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const [groupId, setGroupId] = useState<number | null>(null);

    async function handleAccept() {
        setStatus('loading');
        try {
            const response = await axios.post<{ message: string; group_id: number }>(
                `/api/v1/invitations/${invitation.token}/accept`,
            );
            setGroupId(response.data.group_id);
            setStatus('accepted');
        } catch (err: unknown) {
            const message =
                axios.isAxiosError(err) && err.response?.data?.message
                    ? (err.response.data.message as string)
                    : 'Something went wrong. Please try again.';
            setErrorMessage(message);
            setStatus('error');
        }
    }

    return (
        <GuestLayout>
            <Head title="Group Invitation" />

            <div className="mx-auto w-full max-w-sm">
                {/* Group icon */}
                <div className="mb-6 flex justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                        <Users className="h-8 w-8 text-primary" />
                    </div>
                </div>

                {invitation.expired ? (
                    <div className="text-center">
                        <div className="mb-4 flex justify-center">
                            <Clock className="h-10 w-10 text-warning" />
                        </div>
                        <h1 className="mb-2 text-xl font-semibold text-text">
                            Invitation expired
                        </h1>
                        <p className="text-sm text-text-secondary">
                            This invitation is no longer valid. Ask{' '}
                            <strong>{invitation.inviter.name}</strong> to send
                            you a new invitation.
                        </p>
                        <Button className="mt-6" asChild>
                            <Link href={route('login')}>Go to login</Link>
                        </Button>
                    </div>
                ) : status === 'accepted' ? (
                    <div className="text-center">
                        <div className="mb-4 flex justify-center">
                            <CheckCircle className="h-10 w-10 text-success" />
                        </div>
                        <h1 className="mb-2 text-xl font-semibold text-text">
                            You joined {invitation.group.name}!
                        </h1>
                        <p className="text-sm text-text-secondary">
                            You are now a member of the group.
                        </p>
                        <Button className="mt-6" asChild>
                            <Link href={route('groups.show', groupId!)}>
                                Go to group
                            </Link>
                        </Button>
                    </div>
                ) : status === 'error' ? (
                    <div className="text-center">
                        <div className="mb-4 flex justify-center">
                            <XCircle className="h-10 w-10 text-danger" />
                        </div>
                        <h1 className="mb-2 text-xl font-semibold text-text">
                            Could not accept invitation
                        </h1>
                        <p className="text-sm text-text-secondary">
                            {errorMessage}
                        </p>
                        <Button
                            className="mt-6"
                            variant="outline"
                            onClick={() => setStatus('idle')}
                        >
                            Try again
                        </Button>
                    </div>
                ) : (
                    <>
                        <div className="mb-6 text-center">
                            <h1 className="text-xl font-semibold text-text">
                                You&apos;ve been invited
                            </h1>
                            <p className="mt-2 text-sm text-text-secondary">
                                <strong>{invitation.inviter.name}</strong> has
                                invited you to join:
                            </p>
                        </div>

                        <div className="mb-6 rounded-xl border border-border bg-bg-secondary p-4 text-center">
                            <p className="text-lg font-semibold text-text">
                                {invitation.group.name}
                            </p>
                            {invitation.group.description && (
                                <p className="mt-1 text-sm text-text-secondary">
                                    {invitation.group.description}
                                </p>
                            )}
                            <span className="mt-2 inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium capitalize text-primary">
                                Role: {invitation.role}
                            </span>
                        </div>

                        <Button
                            className="w-full"
                            onClick={handleAccept}
                            disabled={status === 'loading'}
                        >
                            {status === 'loading'
                                ? 'Joining...'
                                : 'Accept Invitation'}
                        </Button>

                        <p className="mt-4 text-center text-xs text-text-tertiary">
                            Invitation sent to {invitation.email}. Expires{' '}
                            {new Date(invitation.expires_at).toLocaleDateString()}.
                        </p>
                    </>
                )}
            </div>
        </GuestLayout>
    );
}
