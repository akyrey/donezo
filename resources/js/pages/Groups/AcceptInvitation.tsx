import { Head, Link } from '@inertiajs/react';
import { Users, CheckCircle, XCircle, Clock } from 'lucide-react';
import GuestLayout from '@/layouts/GuestLayout';
import { login } from '@/routes';
import { show as showGroup } from '@/routes/groups';
import { Button } from '@/components/ui/Button';
import { useAcceptInvitationMutation } from '@/hooks/useGroups';
import axios from '@/lib/axios';

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
  const mutation = useAcceptInvitationMutation();

  const errorMessage =
    axios.isAxiosError(mutation.error) && mutation.error.response?.data?.message
      ? (mutation.error.response.data.message as string)
      : mutation.error
        ? 'Something went wrong. Please try again.'
        : null;

  return (
    <GuestLayout>
      <Head title="Group Invitation" />

      <div className="mx-auto w-full max-w-sm">
        {/* Group icon */}
        <div className="mb-6 flex justify-center">
          <div className="bg-primary/10 flex h-16 w-16 items-center justify-center rounded-full">
            <Users className="text-primary h-8 w-8" />
          </div>
        </div>

        {invitation.expired ? (
          <div className="text-center">
            <div className="mb-4 flex justify-center">
              <Clock className="text-warning h-10 w-10" />
            </div>
            <h1 className="text-text mb-2 text-xl font-semibold">Invitation expired</h1>
            <p className="text-text-secondary text-sm">
              This invitation is no longer valid. Ask <strong>{invitation.inviter.name}</strong> to
              send you a new invitation.
            </p>
            <Button className="mt-6" asChild>
              <Link href={login.url()}>Go to login</Link>
            </Button>
          </div>
        ) : mutation.isSuccess ? (
          <div className="text-center">
            <div className="mb-4 flex justify-center">
              <CheckCircle className="text-success h-10 w-10" />
            </div>
            <h1 className="text-text mb-2 text-xl font-semibold">
              You joined {invitation.group.name}!
            </h1>
            <p className="text-text-secondary text-sm">You are now a member of the group.</p>
            <Button className="mt-6" asChild>
              <Link href={showGroup.url(mutation.data!.group_id)}>Go to group</Link>
            </Button>
          </div>
        ) : mutation.isError ? (
          <div className="text-center">
            <div className="mb-4 flex justify-center">
              <XCircle className="text-danger h-10 w-10" />
            </div>
            <h1 className="text-text mb-2 text-xl font-semibold">Could not accept invitation</h1>
            <p className="text-text-secondary text-sm">{errorMessage}</p>
            <Button className="mt-6" variant="outline" onClick={() => mutation.reset()}>
              Try again
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-6 text-center">
              <h1 className="text-text text-xl font-semibold">You&apos;ve been invited</h1>
              <p className="text-text-secondary mt-2 text-sm">
                <strong>{invitation.inviter.name}</strong> has invited you to join:
              </p>
            </div>

            <div className="border-border bg-bg-secondary mb-6 rounded-xl border p-4 text-center">
              <p className="text-text text-lg font-semibold">{invitation.group.name}</p>
              {invitation.group.description && (
                <p className="text-text-secondary mt-1 text-sm">{invitation.group.description}</p>
              )}
              <span className="bg-primary/10 text-primary mt-2 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium capitalize">
                Role: {invitation.role}
              </span>
            </div>

            <Button
              className="w-full"
              onClick={() => mutation.mutate(invitation.token)}
              disabled={mutation.isPending}
            >
              {mutation.isPending ? 'Joining...' : 'Accept Invitation'}
            </Button>

            <p className="text-text-tertiary mt-4 text-center text-xs">
              Invitation sent to {invitation.email}. Expires{' '}
              {new Date(invitation.expires_at).toLocaleDateString()}.
            </p>
          </>
        )}
      </div>
    </GuestLayout>
  );
}
